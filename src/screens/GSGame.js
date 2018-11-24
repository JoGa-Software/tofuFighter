/**
 * This is the main entry point for the app
 */
function main()
{
	// init graphics
	initGL();
	
	//set the input handlers 
	document.onkeydown = onKeyDown;
	document.onkeyup = onKeyUp;
	document.onmousedown = onMouseDown;
	document.onmouseup = onMouseUp;
	document.onmousemove = onMouseMove;

	//initialize the game
	game.initialize();
}

class GSGame
{

	constructor()
	{
		//render the game entity last 
		this.renderLast = true;

		//make this entity an input entity 
		InputtingEntity(this);

		this.tofu= null;

		this.user_id;
		this.connected = false;
		this.socket;
	}

	/**
	 * Initialize the game elements here(ex. loading game assets)
	 */
	initialize()
	{
		//show the loading screen and load assets 
		new GSLoadingScreen([
			[TOFU_MESH, "mesh"],
			[BOX_MESH, "mesh"],
			["src/thick.png", "texture"],
			["src/castleTex.png", "texture"]
		], () => {
			//call finished loadding after loading has finished
			this.finishedLoading();
		});	
	}

	/**
	 * Called after the load method has finished loading the game assets 
	 */
	finishedLoading() {

		//add this to the entities list
		entities.push(this);

		//add the fps counter to the entities list
		entities.push(FPSCounter());

		//add tofu to the entities list
		this.tofu = new GSPlayer();
		entities.push(this.tofu);
		
		var t3 = Box([0, -10, 0]);
		entities.push(t3);

		//create the game camera 
		gCamera = createFPSCamera(this.tofu);//TrackingCamera(this.tofu);
		entities.push(gCamera);

		netConnect();
		
		//run the game engine 
		runEngine();
	
	}
	
	//Main update loop
	update(dt)
	{
	}
    
    //Main render loop 
	render() 
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

}

//create the global game instance
var game = new GSGame();

//make main the function that runs when onload fires
window.onload = main;