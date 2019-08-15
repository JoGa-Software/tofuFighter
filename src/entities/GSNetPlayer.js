class GSNetPlayer extends GSTofu{

    constructor(id, position, rotation){
        super(position, rotation);

        
        //make the player an inputting entity
        InputtingEntity(this);
        
        this.color = COLORS[id % COLORS.length];
        this.oldMouseMove = [0, 0];
        this.mouseMove = [0, 0];
        
        this.tick = 0;
        this.keys;
        this.id = id;

    }

    netUpdate(data){
        this.tick = 0;

        this.pos = data['pos'];
        this.rot = data['rot'];
        if (data['keys'])
            this.keys = data['keys'];

        if (data['event'] === 'shoot'){
            this.shoot();
        }
    }

    update(dt){
		if (mouseLockEnabled){			
			if (this.keys && this.keys.w){
				this.forward();
			}
			if (this.keys && this.keys.s){
				this.reverse();
			}
			if (this.keys && this.keys.a){
				this.strafeLeft();
			}
			if (this.keys && this.keys.d){
				this.strafeRight();
			}

			// this.oldMouseMove = this.mouseMove;
			// this.mouseMove = this.mouseMovement();

			// //only move the aimer if the mouse has moved and the movement was large enough
			// if (this.mouseMove[0] != this.oldMouseMove[0] && Math.abs(this.mouseMove[0]) > 5){
			// 	this.rot = QuatMult(this.rot, QuatXYZ(0.0, -this.mouseMove[0]*.001, 0.0));
            // }
        }
            
        //call the super update
        super.update(dt);

        this.tick+= dt;
        if (this.tick > 10.0){ 
            removeEntity(this);
			if (netPlayers[this.id])
				delete netPlayers[this.id];
        }
    }

    spawn(){
        if (game.user_id)
            super.spawn();
    }

    render() {
        super.render()
    }
}