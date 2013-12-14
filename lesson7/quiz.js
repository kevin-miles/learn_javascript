//depends on: jQuery, Handlebars

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
				async: false;
	            $.each(data.questions, function (key, val) {
	                q[key] = val;
	            });

	        });
	        return q;
	    },
	    Quiz = function (q, a, u) {
	        this.questions = q;
	        this.answers = a;
	        this.current_state = 0;
	        this.users = u;
	        this.score = 0;
	    },
	    ques = getJSONdata("q.json"),
	    q = new Quiz(ques, answers, {
	        abraham: "abe122",
	        thomas: "jeff313"
	    }),
		source,
		template;

	Quiz.prototype.setData = function() {
		this.data = {};
		this.data.answers = {};
		this.data.question = this.questions[this.current_state];
		var user_answer = this.getUserAnswer();
		for(i = 0; i < this.answers.length; i++) {
			this.data.answers[i] = {};
			this.data.answers[i]["answer"] = (this.answers[this.current_state].choices[i]);

			if(i === user_answer){ this.data.answers[i]["checked"] = true; }
		};
	};
	Quiz.prototype.setForm = function () {
		$("#quiz").html(template(this.data));
	};
	Quiz.prototype.next = function () {
		if (this.formIsComplete()) {
	        if(this.current_state < this.questions.length - 1) {
	            this.storeUserAnswer();
	            this.current_state++;
				this.setData();
	            this.setForm();
	        } else if(this.current_state === this.questions.length - 1) {
				this.storeUserAnswer();
	            this.calcUserScore();
	            this.insertScore();
	            $("#score_container").fadeIn(500);
	        }
		}
	};
	Quiz.prototype.back = function () {
	    if (this.current_state >= 1) {
	        this.storeUserAnswer();
	        this.current_state--;
	        this.setData();
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
	    return answer;
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
				this.setData();
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
			$("#login_container").fadeIn(800);
	};
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
			
		source = document.getElementById( 'quiz-template' ).innerHTML;
		template = Handlebars.compile(source);

	    $("#next").bind("click", function () {
	        q.next();
	    });
	    $("#back").bind("click", function () {
	        q.back();
	    });
	    $("#again").bind("click", function () {
	        q.reset();
	        q.setForm();
	        $("#score_container").fadeOut(800);
	    });
	    $("#login").bind("click", function () {
	        if (q.verifyLogin($("#username").val(), $("#password").val())) {
				q.next();
				$("#login_container").fadeOut(800);
				$("#loginError").fadeOut(500);
				$("#loginError").text("");
	        } else {
				$("#loginError").text("Authentication Failure");
	            $("#loginError").fadeIn(500);
	        }
	    });
		
		$("#reset_storage").bind("click", function () {
			if(localStorage["quiz.user"]){ localStorage.removeItem("quiz.user"); }
			if(localStorage["quiz.pass"]){ localStorage.removeItem("quiz.pass"); }
			$.cookie("quiz.user", null);
		});
		
	    q.checkForLogin();
		

	});