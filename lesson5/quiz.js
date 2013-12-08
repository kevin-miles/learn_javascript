	var data = [{
		question: "Which instrument is used to measure pressure?",
		choices: ["Saccharimeter", "Ammeter", "Manometer", "Lactometer", "Wackometer"],
		correctAnswer: 2
	}, {
		question: "Anna Pavlowa excelled in which of the following?",
		choices: ["Ballet", "Chess", "Painting", "Tennis", "Photography"],
		correctAnswer: 0
	}, {
		question: "The crown of which New York City landmark was originally built as an airship dock?",
		choices: ["Chrysler Building", "Empire State Building", "Statue of Liberty", "Trump Tower", "Owls"],
		correctAnswer: 1
	}, {
		question: "What is the old name for Sri Lanka?",
		choices: ["Spice Islands", "Mandalay", "Ceylon", "East Pakistan", "Thailand"],
		correctAnswer: 2
	}, {
		question: "Countries from which continent boycotted the 1976 summer Olympics in Montreal?",
		choices: ["Europe", "Asia", "South America", "Australia", "Africa"],
		correctAnswer: 4
	}],
		Quiz = function (data) {
			this.data = data;
			this.current_state = null;
			this.score = 0;
		},
		q = new Quiz(data);

	Quiz.prototype.setForm = function () {
		var that = this;
		$("#question").html(this.data[this.current_state].question);
		$("#answers > label").each(function (key, val) {
			$(this).text(that.data[that.current_state].choices[key]);
		});
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
			if (this.current_state < this.data.length - 1) {
				this.storeUserAnswer();
				this.current_state++;
				this.getUserAnswer();
				this.setForm();
			} else {
				this.calcUserScore();
				this.insertScore();
				$(scoreWrapper).fadeIn(500);
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
		for (var key in this.data) {
			if (this.data[key].userAnswer) {
				delete this.data[key].userAnswer;
			}
		}
	};

	Quiz.prototype.getUserAnswer = function () {
		var answer = this.data[this.current_state].userAnswer;
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
		this.data[this.current_state].userAnswer = answer;
	};
	Quiz.prototype.insertScore = function () {
		$("#userScore").text(this.score + " out of " + data.length + " correct");
	};
	Quiz.prototype.calcUserScore = function () {
		for (var key in this.data) {
			if (this.data[key].userAnswer === this.data[key].correctAnswer) {
				this.score++;
			}
		}
	};


	$(document).ready(function () {
		q.next();

		$("#next").bind("click", function () {
			q.next();
		});
		$("#back").bind("click", function () {
			q.back();
		});
		$("#again").bind("click", function () {
			q.reset();
			q.setForm();
			$(scoreWrapper).fadeOut(500);
		});

	});