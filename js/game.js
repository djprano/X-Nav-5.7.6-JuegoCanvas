// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};

princessImage.src = "images/princess.png";

// stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload= function(){
	stoneReady=true;
};
stoneImage.src = "images/stone.png"

// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload= function(){
	monsterReady=true;
};
monsterImage.src = "images/monster.png"



// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var hero_backup = {};
var stone ={};
var princess = {};
var monster = {};
var monster_backup = {};
var monster2 = {};
var monster2_backup = {};
var princessesCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2-16;
	hero.y = canvas.height / 2-16;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 + (Math.random() * (canvas.width - 96));
	princess.y = 32 + (Math.random() * (canvas.height - 96));

	//stone

	stone.x = 32 + (Math.random() * (canvas.width - 96));
	stone.y = 32 + (Math.random() * (canvas.height - 96));

	//mosnter
	monster.x = 32 + (Math.random() * (canvas.width - 96));
	monster.y = 32 + (Math.random() * (canvas.height - 96));

	monster2.x = 32 + (Math.random() * (canvas.width - 96));
	monster2.y = 32 + (Math.random() * (canvas.height - 96));





	if(colision(stone,hero)||colision(stone,princess)|| colision(monster,princess)){
		reset();
	}

};

//
function colision (hero,obstaculo){
	if(hero.x+32>obstaculo.x && hero.x<obstaculo.x+32){
		if(hero.y+32>obstaculo.y && hero.y<obstaculo.y+32){
			//hay colision
			return true;
		}
	}
	return false;
};

function monster_move(monster,monster_backup,modifier){
	if(!colision(monster,stone)){
		if(monster.x<hero.x){
			monster_backup.x = monster.x;
			monster.x+=hero.speed * modifier/5;
		}else{
			monster_backup.x = monster.x;
			monster.x-=hero.speed * modifier/5;
		}
		if(monster.y<hero.y){
			monster_backup.y = monster.y;
			monster.y+=hero.speed * modifier/5;
		}else{
			monster_backup.y = monster.y;
			monster.y-=hero.speed * modifier/5;
		}
	}else{
		monster.x=monster_backup.x;
		monster.y=monster_backup.y;
	}
}

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if(hero.y>32 && !colision(hero,stone)){
			hero_backup.y = hero.y;
			hero.y -= hero.speed * modifier;
		}else{
			hero.y = hero_backup.y; 
		}
		
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y<canvas.height-64 && !colision(hero,stone)){
			hero_backup.y = hero.y;
			hero.y += hero.speed * modifier;			
		}else{
			hero.y = hero_backup.y;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x>32 && !colision(hero,stone)){
			hero_backup.x = hero.x;
			hero.x -= hero.speed * modifier;
		}else{
			hero.x = hero_backup.x;
		}
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x<canvas.width-64 && !colision(hero,stone)){
			hero_backup.x = hero.x;
			hero.x += hero.speed * modifier;
		}else{
			hero.x = hero_backup.x;
		}
	}

	// Are they touching?
	if (colision(princess,hero)){
		++princessesCaught;
	reset();
	}

	//monster moving

	monster_move(monster,monster_backup,modifier);
	monster_move(monster2,monster2_backup,modifier);

	if(colision(monster,hero)||colision(monster2,hero)){
		princessesCaught=0;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if (stoneReady){
		ctx.drawImage(stoneImage,stone.x,stone.y);
	}
	if (monsterReady){
		ctx.drawImage(monsterImage,monster.x,monster.y);
	}
	if (monsterReady){
		ctx.drawImage(monsterImage,monster2.x,monster2.y);
	}

	jQuery('.heroe').text("x: "+hero.x+"     y: "+hero.y);
	jQuery('.piedra').text("x: "+stone.x+"     y: "+stone.y);
	$('.diferencia').text(hero.y-stone.y);
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
