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
	
	document.body.appendChild(game.instructionBox);
	document.body.appendChild(game.chatDisplay);
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
		this.chatEnabled = false;
		this.instructionBox = this.createInstructionBox()
		this.chatBox = this.createChatbox();
		this.chatDisplay = this.createChatDisplay();

		this.user_id;
		this.netName;
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
			["src/assets/gfx/thick.png", "texture"],
			["src/assets/gfx/skybox.png", "texture"],
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
		
		//add the map 
		var map = new GSMap([0, -10, 0])//Box([0, -10, 0]);
		entities.push(map);

		//create the game camera 
		gCamera = createFPSCamera(this.tofu);//TrackingCamera(this.tofu);
		entities.push(gCamera);

		//create the hud
		var hud = new GSHUD()
		entities.push(hud)

		netConnect();
		
		//run the game engine 
		runEngine();
	
	}
	
	//Main update loop
	update(dt)
	{
		//we only care if mouse lock is enabled
		if (mouseLockEnabled){


			//if the tilde character is pressed
			if (this.keyDown(K_TILDE) && !this.chatEnabled){

				if (this.instructionBox.parentElement == document.body) {
					document.body.removeChild(this.instructionBox);
				}

				this.chatEnabled = true
				
				document.body.appendChild(this.chatBox);
				document.getElementById("chatBox").focus()

			}else if (this.keyDown(K_RETURN) && this.chatEnabled) {
				
				//get the chat box
				var chatBox = document.getElementById("chatBox");
	
				//if there is a message to be sent then send it
				if (chatBox.value.trim().length > 0) {
					this.socket.emit('message', {
						event: 'chatMessage',
						id: game.user_id,
						netName: game.netName,
						message: chatBox.value
					});
				}

				//clear the chat box
				chatBox.value = "";
				
				//disable chat
				this.chatEnabled = false;
				
				//remove the chat box 
				document.body.removeChild(this.chatBox);

				document.body.appendChild(this.instructionBox);
			}
		}
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

	createInstructionBox() {
		var instructionBox = document.createElement("DIV");
		instructionBox.style = "position:absolute; zIndex:100; bottom: 0px; padding:10px; width: 90%; alignItems:center; justifyContent:center;"
		instructionBox.innerHTML = `
			[Press ~ to chat]
		`
		return instructionBox
	}

	createChatbox() {
		var chatBox = document.createElement("DIV");
		chatBox.style = "position:absolute; zIndex:100; bottom: 0px; padding:10px; width: 90%; alignItems:center; justifyContent:center;"
		chatBox.innerHTML = `
			Chat:
			<input id="chatBox" style="width:50%"></input>
			[Press ENTER to Submit]
		`
		return chatBox
	}

	createChatDisplay() {
		var chatDisplay = document.createElement("DIV");
		chatDisplay.style = "position:absolute; zIndex:100; top: 0px; right: 0px; padding:5px; width: 25%; align-items:center; justify-content:center;"
		chatDisplay.innerHTML = `
			<ul id="chatDisplay" style="color:white;background-color:rgba(0, 0, 0, 0.5); border-radius:3%">
			</ul>
		`
		return chatDisplay
	}
}

//create the global game instance
var game = new GSGame();

//make main the function that runs when onload fires
window.onload = main;