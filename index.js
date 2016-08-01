

function Player () {
	this.money = 10;
	this.highscore = 0;
	this.scores = [];
}

//player = new Player();

function PlayTracker (id, p1, p2, p3, p4, n1, n2, n3, n4) {
	this.id = id;
	this.pick1 = p1;
	this.pick2 = p2;
	this.pick3 = p3;
	this.pick4 = p4;
	this.num1 = n1;
	this.num2 = n2;
	this.num3 = n3;
	this.num4 = n4;
}

	//playTracker = new PlayTracker();

function Model () {
	this.player = new Player();
	this.playTracker = new PlayTracker();

	/*
	this.player = function() {
		new Player();
	};

	this.playTracker = function() {
		new PlayTracker();
	};
	*/

} // end Model

function View(c) {

	this.displayMoney = function () {
		$("#money").html(c.getMoney());
	};

	$(document).ready(function() {
		$('#title').circleType({radius: 384});
		this.displayMoney();
		}.bind(this)
	);
	
	$("#playButton").click(function() {
		var numArray = [];
		if (!c.enoughMoney()) {
			alert("You don't have enough money to play. Go ahead and refresh to play again.");
		} else if (!c.haveFourNums()) {
			alert("You haven't picked four numbers.");
		} else {
			c.manipulateMoney(-2);
			this.displayMoney();
			$('.numInput').removeClass('green');
			$('.result').val('');
			c.getNums(numArray, this.displayMoney);
		}
		this.displayMoney();
		}.bind(this)
	);

	// call this whenever the user focus leaves an input field and validate the input
	this.validateInput = function(elm) {
		var pickNum = $(elm).attr('id')[4];
		if (!$(elm).val().match(/^(10|[1-9])$/)) {
			$(elm).val('');
			alert("Invalid Input");
		} else {
			for (var i=1; i<5; i++) {
				if (i != pickNum) {
					if (c.checkForEquals(elm,i)) {
						// if there is another field with this value, set value to "" and raise alert
						$(elm).val("");
						alert("Enter a value not equal to others");
						c.updatePick("pick"+pickNum, elm);
						return;
					}
				}
			}
		}

		c.updatePick("pick"+pickNum, elm);
	};

} // end View

function Controller (m) {

	this.checkForEquals = function (elm,i) {
		//return m.playTracker["pick"+pickNum] == m.playTracker["pick"+i];
		return $(elm).val() == m.playTracker["pick"+i];
	};

	this.updatePick = function (pickNumStr, elm) {
		m.playTracker[pickNumStr] = $(elm).val();
	};

	this.getMoney = function () {
		return m.player.money;
	};

	this.enoughMoney = function () {
		return (m.player.money >= 2);
	};

	this.manipulateMoney = function (arg) {
		m.player.money = m.player.money + arg;
	};

	// this stays in controller
	this.haveFourNums = function () {
		return (!!m.playTracker.pick1 && !!m.playTracker.pick2 && !!m.playTracker.pick3 && !!m.playTracker.pick4);
	};

	this.getNums = function(numArray, updateCallback) {
		$.get('http://159.203.175.239:8001/', function(res) {
			this.callback(res, numArray, updateCallback);
		}.bind(this));
	};

	this.callback = function(res, numArray, updateCallback) {
		if (numArray.indexOf(res) === -1) {
			numArray.push(res);
			if (numArray.length < 4) {
				this.getNums(numArray, updateCallback);
			} else {
				this.matcher(numArray); // now can run matcher because we have all numbers
				updateCallback();
			}
		} else {
			this.getNums(numArray, updateCallback);
		}
	};

	this.matcher = function(numArray) {
		var numMatches = 0;
		var i;
		var y;
		var str;

		// put the numbers generated into the playTracker object
		for (i=0;i<4;i++) {
			m.playTracker["num"+(i+1)] = numArray[i];
			str = '#num' + (i+1);
			$('#num' + (i+1)).val(m.playTracker["num"+(i+1)]);
		}

		// check for matches
		for (i=1;i<5;i++) {
			for (y=1;y<5;y++) {
				if (m.playTracker["pick"+i] == m.playTracker["num"+y]) {
					str = "#pick"+i;
					$(str).addClass('green');
					numMatches++;
				}
			}
		}

		// based on number of matches, increase money
		if (numMatches === 2) {
			m.player.money += 4;
		} else if (numMatches === 3) {
			m.player.money += 8;
		} else if (numMatches === 4) {
			m.player.money += 40;
		}

		//m.setMoney();
	};

} // end controller

//debugger;
var model = new Model();
var controller = new Controller(model);
var view = new View(controller);






