var c = document.getElementById('c'),
    ctx = c.getContext('2d'),
    sart = document.getElementById('start'),
    stop = document.getElementById('stop'),
    pause = document.getElementById('pause'),
    next = document.getElementById('next'),
    mouseX = document.getElementById('mouseX'),
    mouseY = document.getElementById('mouseY'),
    customGen = document.getElementById('customGen'),
    saveCurrent = document.getElementById('saveCurrent'),
    firstGenRandom = document.getElementById('firstGenRandom'),
    scaleInput = document.getElementById('scale'),
    fillInput = document.getElementById('fill'),
    speedInput = document.getElementById('speed'),
    speed = speedInput.value,						// frame refresh value
    game = 0, 										// var for control setInterval
    scale = 2,
    blockingStart = false,							// if true: block "start" when game already started
    width = 200,
    height = 200,
    fillPercent = 0.3,								// how much will be canvas randomly filled
    world = new Array(height), 						// main array
    savedFirstGen = new Array(height);				// array for get firs generation


/*############################
#_________Main logic_________#
#############################*/

initGame();

function initGame() {								// initialize game

    ctx.fillStyle = 'black'; 						// set pixel color

    for (var i = 0; i < world.length; i++) {		// create 2-dimensional arrays
        world[i] = new Array(width);
        savedFirstGen[i] = new Array(width);
    }

    for ( i = 0; i < width; i++) {					// initialize main array with 0
        for (var j = 0; j < height; j++) {
                world[i][j] = 0;
        }
    }

    c.width = width * scale;						// set canvas width
    c.height = height * scale;						// set canvas height
}

function setRandomPoints() {						// random fill main array

    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            if (Math.random() < fillPercent) {
                world[i][j] = 1;
            } else {
                world[i][j] = 0;
            }
        }
    }

    draw();
}

function copyArray(inputArr, outputArr) {			// function for copy one array to another

    for (var i = 0; i < inputArr.length; i++) {
        for (var j = 0; j < inputArr[i].length; j++) {
            outputArr[i][j] = inputArr[i][j];
        }
    }
}

function isAlive(x, y) {							// return true, if pixel exist at (x, y)

    if (world[x][y] === 1) {
        return true;
    } else {
        return false;
    }
}

function neighborsNum(x, y, arr) {					// return number of neighbors

    return 	arr[x - 1][y - 1] +					//topLeft
	        arr[x][y - 1] +						//top
	        arr[x + 1][y - 1] +					//topRight
	        arr[x - 1][y] +						//left
	        arr[x + 1][y] +						//right
	        arr[x - 1][y + 1] +					//btmLeft
	        arr[x][y + 1] +						//btm
	        arr[x + 1][y + 1];					//btmRight
}

function draw() {									// draw main array in canvas

    ctx.clearRect(0, 0, width * scale, height * scale);		// clear all canvas

    for (var i = 0; i < world.length; i++) {
        for (var j = 0; j < world[i].length; j++) {

            if (isAlive(i, j)) {
                ctx.fillRect(i * scale, j * scale, scale, scale);
            }
        }
    }
}

function step() {									// create next generation

    var i, j,
     	newWorld = new Array(height + 2);				// create array for "border" main array

    for (i = 0; i < newWorld.length; i++) {
        newWorld[i] = new Array(width + 2);
    }

    for (i = 0; i < newWorld.length; i++) {				// fill "border array" with 0, so our canvas margins has "dead cells"
        for (j = 0; j < newWorld[i].length; j++) {
            newWorld[i][j] = 0;
        }
    }

    for (i = 0; i < world.length; i++) {
        for (j = 0; j < world[i].length; j++) {
            newWorld[i + 1][j + 1] = world[i][j];		// start main array from (1, 1) in "border array"
        }
    }

    for (i = 0; i < world.length; i++) {
        for (j = 0; j < world[i].length; j++) {

            var neighbors = neighborsNum(i + 1, j + 1, newWorld);	// count neighbors of current cell

            if (isAlive(i, j)) {
                if (!((neighbors === 2) || (neighbors === 3))) {
                    world[i][j] = 0;								// kill current cell
                }
            } else {
                if (neighbors === 3) {
                    world[i][j] = 1;								// bring life to current cell
                }
            }
        }
    }

    draw();
}


/*############################
#________Mouse logic_________#
#############################*/


function getMousePos(el, evt) {             // get mouse coordinates on canvas
    var rect = el.getBoundingClientRect();
    return {
        x: Math.floor( (evt.clientX - rect.left) / scale),
        y: Math.floor( (evt.clientY - rect.top) / scale )
    };
}

c.onclick = function(e) {                   // add or remove pixel onclick
    var pos = getMousePos(c, e);
    posX = pos.x;
    posY = pos.y;
    if (isAlive(posX, posY)) {
        world[posX][posY] = 0;
    } else {
        world[posX][posY] = 1;
    }
    draw();
};

c.onmousemove = function (e) {              // display coordinates on page     
	var pos = getMousePos(c, e);
	posX = pos.x;
    posY = pos.y;

    mouseX.value = posX;
    mouseY.value = posY;
};

c.onmouseleave = function (){               // clear displayed coordinats when leave canvas
	mouseX.value = '';
    mouseY.value = '';
};



/*############################
#_________Controls___________#
#############################*/

function playControl(n, speed) {

    if ((n === 'start') && (blockingStart === false)) {
        game = setInterval(step, speed);
        blockingStart = true;
    }

    if (n === 'stop') {
        clearInterval(game);
        blockingStart = false;
        start.innerText = 'Start';
    }

    if (n === 'pause') {
        clearInterval(game);
        blockingStart = false;
    }
}

start.onclick = function() {
    playControl('start', speed);
};

pause.onclick = function() {

    playControl('pause');

    if (game !== 0) {
        start.innerText = 'Continue';
    }
};

stop.onclick = function() {

    playControl('stop');

    copyArray(savedFirstGen, world);

    draw();
};

next.onclick = function() {
    step();
};

customGen.onclick = function() {
    initGame();
};

saveCurrent.onclick = function() {
    copyArray(world, savedFirstGen);
};

firstGenRandom.onclick = function() {

    initGame();

    setRandomPoints();

    copyArray(world, savedFirstGen);
};

speedInput.oninput = function() {

    speed = speedInput.value;

    playControl('pause');
    
    if(game !== 0){
        playControl('start', speed);
    }
};

scaleInput.onchange = function() {

    scale = scaleInput.value;

    c.width = width * scale;
    c.height = height * scale;

    draw();
};

fillInput.onchange = function() {
    fillPercent = fillInput.value / 100;
};