	var answers = [{
	    choices: ["Saccharimeter", "Ammeter", "Manometer", "Lactometer", "Wackometer"],
	    correctAnswer: 2
	}, {
	    choices: ["Ballet", "Chess", "Painting", "Tennis", "Photography"],
	    correctAnswer: 0
	}, {
	    choices: ["Chrysler Building", "Empire State Building", "Statue of Liberty", "Trump Tower", "Owls"],
	    correctAnswer: 1
	}, {
	    choices: ["Spice Islands", "Mandalay", "Ceylon", "East Pakistan", "Thailand"],
	    correctAnswer: 2
	}, {
	    choices: ["Europe", "Asia", "South America", "Australia", "Africa"],
	    correctAnswer: 4
	}],
	    getJSONdata = function (filename) {
	        var q = [];
	        $.getJSON(filename, function (data) {
	            $.each(data.questions, function (key, val) {
	                q[key] = val;
	            });

	        });
	        return q;
	    },
	    Quiz = function (q, a, u) {
	        this.questions = q;
	        this.answers = a;
	        this.current_state = null;
	        this.users = u;
	        this.score = 0;
	    },
	    ques = getJSONdata("q.json"),
	    q = new Quiz(ques, answers, {
	        abraham: "abe122",
	        thomas: "jeff313"
	    });


	Quiz.prototype.setForm = function () {
		var that = this;
	    $("#answers > label").each(function (key) {
			if(that.current_state === null) { that.current_state = 0};
	        $(this).text(that.answers[that.current_state].choices[key]);
	    });
		$("#question").text(this.questions[this.current_state]);
	};
	Quiz.prototype.next = function () {
		
	    //three cases:
	    // new game (current_state = 0)
	    // middle of game (current_state < data length - 1
	    // end of game (two other conditions not met)
	    if (this.current_state === null) {
			this.current_state = 0;
	        this.setForm();
	    } else if (this.formIsComplete()) {
	        if (this.current_state < this.questions.length - 1) {
	            this.storeUserAnswer();
	            this.current_state++;
				console.log("NEXT!");
	            this.getUserAnswer();
	            this.setForm();
	        } else if(this.current_state === this.questions.length-1) {
				this.storeUserAnswer();
	            this.calcUserScore();
	            this.insertScore();
	            $("#scoreWrapper").fadeIn(500);
	        }
		}
	};
	Quiz.prototype.back = function () {
	    if (this.current_state >= 1) {
	        this.storeUserAnswer();
	        this.current_state--;
	        this.getUserAnswer();
	        this.setForm();
	    }
	};
	Quiz.prototype.reset = function () {
	    this.current_state = 0;
	    this.score = 0;
	    for (var key in this.answers) {
	        if (this.answers[key].userAnswer) {
	            delete this.answers[key].userAnswer;
	        }
	    }
	};

	Quiz.prototype.getUserAnswer = function () {
	    var answer = this.answers[this.current_state].userAnswer;
	    if (answer !== null) {
	        $('input[name=input][value=' + answer + ']').prop('checked', true);
	    }
	};
	Quiz.prototype.formIsComplete = function () {
	    var answer = $('input[name=input]:checked').length;
	    if (answer < 1) {
	        return false;
	    } else {
	        return true;
	    }
	};
	Quiz.prototype.storeUserAnswer = function () {
	    var answer = parseInt($('input[name=input]:checked').val(), 10);
	    this.answers[this.current_state].userAnswer = answer;
	};
	Quiz.prototype.insertScore = function () {
	    $("#userScore").text(this.score + " out of " + this.questions.length + " correct");
	};
	Quiz.prototype.calcUserScore = function () {
	    for (var key in this.answers) {
	        if (this.answers[key].userAnswer === this.answers[key].correctAnswer) {
				
	            this.score++;
	        }
	    }
	};
	Quiz.prototype.hasStorage = function () {
	    try {
	        return 'localStorage' in window && window.localStorage !== null;
	    } catch (e) {
	        return false;
	    }
	};
	Quiz.prototype.checkForLogin = function () {
	    var stored_username = $.cookie("quiz.user");
	    if (this.hasStorage() && stored_username === localStorage["quiz.user"]) {
			if (this.verifyLogin(stored_username, localStorage["quiz.pass"])) {
				$("#loginWrapper").fadeOut(800);
				this.setForm();
			} else {
				this.showLogin();
			}
		} else {
			this.showLogin();
		}
	};
	
	Quiz.prototype.showLogin = function() {
			$("#welcome").text("");
			$("#loginWrapper").fadeIn(800);
	}
	Quiz.prototype.storeLogin = function (user, pass) {
		$.cookie("quiz.user", user, { expires: 7 });
		if(localStorage){
			localStorage["quiz.user"] = user;
			localStorage["quiz.pass"] = pass;
		}
		$("#welcome").text("Welcome, " + user + "!");
	};
	
	Quiz.prototype.verifyLogin = function (user, pass) {
	    if (this.users[user] && pass === this.users[user]) {
			this.storeLogin(user, pass);
	        return true;
	    } else {
	        return false;
	    }
	};

	$(document).ready(function () {

	    $("#next").bind("click", function () {
	        q.next();
	    });
	    $("#back").bind("click", function () {
	        q.back();
	    });
	    $("#again").bind("click", function () {
	        q.reset();
	        q.setForm();
	        $("#scoreWrapper").fadeOut(800);
	    });
	    $("#login").bind("click", function () {
	        if (q.verifyLogin($("#username").val(), $("#password").val())) {
				q.next();
				$("#loginWrapper").fadeOut(800);
				$("#loginError").fadeOut(500);
				$("#loginError").text("");
	        } else {
				$("#loginError").text("Authentication Failure");
	            $("#loginError").fadeIn(500);
	        }
	    });
		
		$("#resetStorage").bind("click", function () {
			if(localStorage["quiz.user"]){ localStorage.removeItem("quiz.user"); }
			if(localStorage["quiz.pass"]){ localStorage.removeItem("quiz.pass"); }
			$.cookie("quiz.user", null);
		});
		
	    q.checkForLogin();
		

	});