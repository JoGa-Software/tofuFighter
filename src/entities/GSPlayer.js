class GSPlayer extends GSTofu{

    constructor(position, rotation){
        super(position, rotation);

        //make the player an inputting entity
        InputtingEntity(this);

        this.oldMouseMove = [0, 0];
        this.mouseMove = [0, 0];
        
        this.netSync = 0.0;
    }

    update(dt){
		if (mouseLockEnabled){			
			if (this.keyDown(K_W)){
				this.forward();
			}
			if (this.keyDown(K_S)){
				this.reverse();
			}
			if (this.keyDown(K_A)){
				this.strafeLeft();
			}
			if (this.keyDown(K_D)){
				this.strafeRight();
            }
            
            if (this.mouseDown(M_LEFT)){
                this.shoot();
            }

			this.oldMouseMove = this.mouseMove;
			this.mouseMove = this.mouseMovement();

			//only move the aimer if the mouse has moved and the movement was large enough
			if (this.mouseMove[0] != this.oldMouseMove[0] && Math.abs(this.mouseMove[0]) > 5){
				this.rot = QuatMult(this.rot, QuatXYZ(0.0, -this.mouseMove[0]*.001, 0.0));
            }
        }
            
        //call the super update
        super.update(dt);

        this.netSync+= dt;
        if (game.connected && this.pos && this.netSync > 0.067){ 

            game.socket.emit('message', {
                event: 'pos',
                id: game.user_id,
                pos: this.pos,
                rot: this.rot,
                keys: {
                    w: K_W,
                    s: K_S,
                    a: K_A,
                    d: K_D,
                }
            });
            this.netSync = 0.0;
        }
    }

    shoot(){
        if (this.dead === true){ return; }
        super.shoot();
        game.socket.emit('message', {
            event: 'shoot',
            id: game.user_id,
            pos: this.pos,
            rot: this.rot,
            matrix: this.matrix
        });
    }

    spawn(){
        if (game.user_id)
            super.spawn();
    }

    die(){
        game.socket.emit("message", {
            event: 'die',
            id: game.user_id
        });
        super.die();
    }

}