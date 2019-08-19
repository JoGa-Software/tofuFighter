class GSPlayer extends GSTofu{

    constructor(position, rotation){
        super(position, rotation);

        //make the player an inputting entity
        InputtingEntity(this);

        this.oldMouseMove = [0, 0];
        this.mouseMove = [0, 0];
        
        this.netSync = 0.0;

        this.skyboxTexture = loadTexture('src/assets/gfx/skybox.png');
        this.skyboxMesh = CloneMesh(SKYBOX_MESH);

        BufferMesh(this.skyboxMesh)
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
            if (this.keyDown(K_SPACE)){
                console.log("jumping")
            }
            
            if (this.mouseDown(M_LEFT)){
                this.shoot();
            }

			this.oldMouseMove = this.mouseMove;
			this.mouseMove = this.mouseMovement();

			//only move the aimer if the mouse has moved and the movement was large enough
			if (!this.dead && this.mouseMove[0] != this.oldMouseMove[0] && Math.abs(this.mouseMove[0]) > 5){
				this.rot = QuatMult(this.rot, QuatXYZ(0.0, -this.mouseMove[0]*.001, 0.0));
            }
        }
            
        //call the super update
        super.update(dt);

        this.netSync+= dt;
        if (game.connected && this.pos && this.netSync > 0.067){ 

            sendNetMessage('pos', {
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
        sendNetMessage('shoot', {
            pos: this.pos,
            rot: this.rot,
            matrix: this.matrix
        })
    }

    spawn(){
        if (game.user_id)
            super.spawn();
    }

    die(){
        sendNetMessage('die', null)
        super.die();
    }

    render() {
        super.render()

        var rot = QuatInverse(this.rot);
        rot = QuatMult(rot, QuatXYZ(-Math.PI*0.5, 0, 0))

        var newMat = Mat4Mult(Mat4Translate([-0.2,1.5,0.55]), this.matrix)
        newMat = Mat4Mult(Mat4Rotate(rot), newMat)
        // newMat = Mat4Mult(Mat4Scale(2,2,2), newMat)

        gl.depthMask(false);
        TEX_SHADER.enable(this.skyboxTexture);
        TEX_SHADER.setColor([1,1,1, 1.0]);
        DrawMesh(this.skyboxMesh, Mat4List(newMat), TEX_SHADER);
        gl.depthMask(true);
    }

}