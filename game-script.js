 		$("#Refresh").hover(function() {
			$("#Refresh").attr("src", "reniew_hover.png");
		}, function() {
			$("#Refresh").attr("src", "reniew_normal.png");
		})
		$("#AcceptLose").click(function() {
			$("#PlayerLost").hide();
			Refresh();
		})
		$("#AcceptWin").click(function() {
			$("#PlayerWon").hide();
			document.body.style.background ="white";
			$("#Cover").hide();
			Refresh();
		})
		var curPosition = 0; arrayOfElem = new Array(10);
		var ChipLeft = document.getElementById('Chip').getBoundingClientRect().left;
		for (i = 0; i < 10; i++){
			arrayOfElem[i] = document.getElementById("sqr" + (i+1));
		}
		function Rand(){
			var randomStep, userStep, brickSize = 54, coords, coordsChip;
			for (i=curPosition; i<10;i++)
				arrayOfElem[i].style.opacity = "0.3";
			function randomInteger(min, max) 
			{
				var rand = min + Math.random() * (max + 1 - min);
				rand = Math.floor(rand);
				return rand;
			}
			if ((10 - curPosition) > 3)
			{
				randomStep = randomInteger(1,3);
				if (curPosition == 0) {
					curPosition = curPosition + randomStep;
					ChipLeft = document.getElementById("Chip").getBoundingClientRect().left;
					$('#Chip').animate({left: "+=10"}, 50)
					$('#Chip').animate({left: "+="+(randomStep*brickSize)}, 500, function() {
						coordsChip = document.getElementById("Chip").getBoundingClientRect();
						for (a = 0,i=0; i < 10; i++) {
							coords = arrayOfElem[i].getBoundingClientRect();
							a = coords.left - coordsChip.left-10;
							if (a<0){
								arrayOfElem[i].style.opacity = "1"
								arrayOfElem[i].style.backgroundColor = "#e6d0a1";
							}
							else arrayOfElem[i].style.opacity = "0.08";
						}
					});
				}
				else {
					curPosition = curPosition + randomStep;
					$('#Chip').animate({left: "+="+(randomStep*brickSize)}, 500, function() {
						coordsChip = document.getElementById("Chip").getBoundingClientRect();
						for (a = 0,i=0; i < 10; i++) {
							coords = arrayOfElem[i].getBoundingClientRect();
							a = coords.left - coordsChip.left-10;
							if (a<0){
								arrayOfElem[i].style.opacity = "1"
								arrayOfElem[i].style.backgroundColor = "#e6d0a1";
							}
							else arrayOfElem[i].style.opacity = "0.08";
						}
					});
				}
			}
			else
			{
				randomStep = (10 - curPosition);
				curPosition = 10*brickSize;
				$('#Chip').animate({left: "+="+(randomStep*brickSize)}, 500, function() {
					coordsChip = document.getElementById("Chip").getBoundingClientRect();
					for (a = 0,i=0; i < 10; i++) {
						coords = arrayOfElem[i].getBoundingClientRect();
						a = coords.left - coordsChip.left-10;
						if (a<0){
							arrayOfElem[i].style.opacity = "1"
							arrayOfElem[i].style.backgroundColor = "#e6d0a1";
						}
						else arrayOfElem[i].style.opacity = "0.08";
					}
					setTimeout($("#PlayerLost").show(), 2000);
				});
			}
			return curPosition, ChipLeft;
		}
		function Refresh() {
			$('#Chip').animate({left: "+="+(ChipLeft - document.getElementById("Chip").getBoundingClientRect().left)}, 500, function() {
				for (i = 0; i<10; i++) {
					arrayOfElem[i].style.opacity = "0.08";
					arrayOfElem[i].style.background = "#000000";
					curPosition = 0;
				}
			})
			PlayerRandButtons();
			return curPosition = 0
		}
		$("#Refresh").click(Refresh);
		$('#ButtonHide').click(function() {
			if ($('#HiddingArea').is(':visible'))
				$('#HiddingArea').hide("slow")
			else 
				$('#HiddingArea').show("slow");
			})
		$('#ButtonRand').click(function() {
			if ($('#ButtonPlayerBackground').css("background") != "white") {
				$('#ButtonPlayerBackground').css("background","white");
				$('#ButtonPlayerBackground').css("opacity","1");
				$('#ButtonPlayerShadow').css("box-shadow","-2px 2px 4px gray");
			
				$('#ButtonRandBackground').css("background","#000000");
				$('#ButtonRandBackground').css("opacity","0.08");
				$('#ButtonRandShadow').css("box-shadow","inset 0 2px 6px gray")
			if (curPosition == 0)
				Rand();	
			}
		})
		function PlayerRandButtons() {
			if ($('#ButtonRandBackground').css("background") != "white") {
				$('#ButtonRandBackground').css("background","white");
				$('#ButtonRandBackground').css("opacity","1");
				$('#ButtonRandShadow').css("box-shadow","-2px 2px 4px gray");
			
				$('#ButtonPlayerBackground').css("background","#000000");
				$('#ButtonPlayerBackground').css("opacity","0.08");
				$('#ButtonPlayerShadow').css("box-shadow","inset 0 2px 6px gray")
			}
		}
		$('#ButtonPlayer').click(PlayerRandButtons);
		ChipLeft = document.getElementById("Chip").getBoundingClientRect().left;
		document.getElementById("Chip").onmousedown = function(e) {
			var ChangeX = e.pageX, ChangeY = e.pageY;
			var x, y;
			for (i = curPosition+3; i<10; i++) {
				arrayOfElem[i].style.opacity = "0.3";
			}
			x = parseInt(document.getElementById("Chip").style.left, 10);
			y = parseInt(document.getElementById("Chip").style.top,10) ;
			function moveTo(e) {
				var X, Y;
				X = x + e.pageX - ChangeX ;
				Y = y + e.pageY - ChangeY;
				document.getElementById("Chip").style.left = X ;
 				document.getElementById("Chip").style.top =  Y;
			}
			document.onmousemove = function(e) {
				moveTo(e)
			}
			document.getElementById('Chip').onmouseup = function(e) {
				document.getElementById("Chip").onmouseup = null;
				document.onmousemove = null;
				if   ((document.getElementById('Chip').getBoundingClientRect().top < arrayOfElem[0].getBoundingClientRect().top + 40) &&
					 (document.getElementById('Chip').getBoundingClientRect().top > arrayOfElem[0].getBoundingClientRect().top - 40) &&
					 ((document.getElementById('Chip').getBoundingClientRect().left - arrayOfElem[curPosition].getBoundingClientRect().left) < 
					  130 ) && ((document.getElementById('Chip').getBoundingClientRect().left - arrayOfElem[curPosition].getBoundingClientRect().left) > 
					  -30) ) {  
					for (i = curPosition; i<10; i++) {
						if (document.getElementById("Chip").getBoundingClientRect().left + 30 > arrayOfElem[i].getBoundingClientRect().left) {
							arrayOfElem[i].style.opacity = "1";
							arrayOfElem[i].style.backgroundColor = "#e6d0a1";						
							curPosition += 1;
						}
					}
					if (curPosition != 10) 
						setTimeout(Rand, 1000);
				}
				for (i = curPosition; i<10; i++) {
					arrayOfElem[i].style.opacity = "0.08";
				}
				if (curPosition != 0) {
					var PlayerStepToDoneLeft = arrayOfElem[curPosition - 1].getBoundingClientRect().left -
								document.getElementById('Chip').getBoundingClientRect().left - 6;
					var PlayerStepToDoneTop = arrayOfElem[curPosition - 1].getBoundingClientRect().top -
								document.getElementById('Chip').getBoundingClientRect().top - 5;
					$('#Chip').animate({left: "+="+(PlayerStepToDoneLeft), top: "+="+(PlayerStepToDoneTop)}, 500, function() {
						if (curPosition == 10) {
							document.body.style.background ="linear-gradient(-70deg, #ddfcc7, #befae4)";
							setTimeout($("#Cover").show(),2000);
							setTimeout($("#PlayerWon").show(),2000);
						}
					});
				}
				else {
					var PlayerStepToDoneLeft = ChipLeft - document.getElementById('Chip').getBoundingClientRect().left - 6;
					var PlayerStepToDoneTop = arrayOfElem[curPosition].getBoundingClientRect().top -
								document.getElementById('Chip').getBoundingClientRect().top - 5;
					$('#Chip').animate({left: "+="+(PlayerStepToDoneLeft), top: "+="+(PlayerStepToDoneTop)}, 500);
				}			
			}
		}
		document.getElementById("Chip").ondragstart = function(e) {
			return false;
		}