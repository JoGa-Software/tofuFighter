/**
 * This is the main entry point for the app
 */
function main()
{
	// init graphics
	initGL();
	
	// init input
	document.onkeydown = onKeyDown;
	document.onkeyup = onKeyUp;
	document.onmousedown = onMouseDown;
	document.onmouseup = onMouseUp;
	document.onmousemove = onMouseMove;
	
	//init the game
	gameInit();
}
//make main the function that runs when onload fires
window.onload = main;

/**
 * Init game elements here(ex. loading game assets)
 */
function gameInit()
{
	// receive / create game data
	Load([
		[Box, [0,-10,0]],
		[GAME],
		[FPSCounter],
	], finishedLoading);
}

/**
 * Called after the load method has finished loading the game assets 
 */
function finishedLoading() {
	
	//create the game camera 
	gCamera = TrackingCamera(gBox);
	entities.push(gCamera);
		
	// // rock and roll
	// if (true) {
	// 	netConnect();
	// } else {
	// 	connected = true;
	// 	//connected = true;
	// 	//socket = {json: {send: function(a) { /*alert(a.event);*/ } } };
	// }
    
    //runs the game engine 
	runEngine();
  
}

/**
 * This is the main game objct. Game updates and render udates will take place in here
 */
function GAME() 
{
    //make this entity render last
    var GAME = {renderLast: true};
    
    //make this entity an input entity 
	InputtingEntity(GAME);
    
    //Main update loop
	GAME.update = function (dt)
	{
		if (GAME.keyDown(K_DOWN))
			gBox.rotate();
	}
    
    //Main render loop 
	GAME.render = function () 
	{
		// set up rendering state
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		
		TEX_SHADER.setColor(1,1,1,1);
		
		gl.enable(gl.DEPTH_TEST);
				
		// restore rendering state
		//gl.depthMask(true);
		gl.disable(gl.BLEND);
		NormalProjection();
	}
	
	return GAME;
}