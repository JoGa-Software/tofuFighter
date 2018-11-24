class GSTofu extends GSDynamicEntity
{
    constructor(position, rotation)
    {
        super(TOFU_MESH);

        BufferMesh(SMG_MESH);
        this.gunTexture = loadTexture("./src/smgTexture.png");

        //set the texture of tofu
        this.texture = loadTexture("./src/thick.png");
        
        //set the position
        this.pos = position ? position : [0, 0, 0];

        //set the rotation
        this.rot = rotation ? rotation : Quat();

        this.force = [0, -100, 0,];

        this.speed = 30;
        this.rotSpeed = 0.05;

        this.spawnTimer = 1.0;
        this.shootDelay = 1.0;
        this.isKillable = true;
        this.health = 100;
        this.dead = false;
    }

    forward(){
        this.acl = VecAdd(this.acl, VecRotate(VecScale(VEC_FORWARD, -this.speed), this.rot));
    }

    reverse(){
        this.acl = VecAdd(this.acl, VecRotate(VecScale(VEC_FORWARD, this.speed), this.rot));
    }

    left(){
        this.rot = QuatMult(this.rot, QuatXYZ(0.0, this.rotSpeed, 0.0));
    }
    
    right(){
        this.rot = QuatMult(this.rot, QuatXYZ(0.0, -this.rotSpeed, 0.0));
    }

    strafeLeft(){
        this.acl = VecAdd(this.acl, VecRotate(VecScale(VEC_LEFT, this.speed), this.rot));
    }

    strafeRight(){
        this.acl = VecAdd(this.acl, VecRotate(VecScale(VEC_RIGHT, this.speed), this.rot));
    }

    mouseX(mouseX){

    }

    shoot(){
        if (this.shootDelay <= 0){
            var pos = Mat4TransformPoint([0.3, 1, -1], this.matrix);
            var bullet = new GSBullet(this, pos, QuatMult(this.rot, QuatXYZ(0,Math.PI,0)));
            entities.push(bullet);
            this.shootDelay = 0.2;
        }
    }

    update(dt){
        if (this.dead){
            this.spawnTimer-=dt;
            if (this.spawnTimer < 0)
                this.spawn();
        }

        //shoot delay
        if (this.shootDelay > 0) {
			this.shootDelay -= dt;
		}
    }

    spawn(){
        this.dead = false;
        this.pos = [0, 10, 0];
    }

    hit(){
        this.health -= 20;
        if (this.health <= 0)
            this.die();
    }

    die(){
        delete this.pos;
        this.dead = true;
        this.spawnTimer = 5.0;
        this.health = 100;
    }

    render(){
        if (!this.pos){ return; }
        super.render();
		if (this.gunTexture !== undefined) {
			TEX_SHADER.enable(this.gunTexture);
			DrawMesh(SMG_MESH, Mat4List(Mat4Mult(Mat4Translate([0.3, 1, -0.5]),this.matrix)), TEX_SHADER);
		} else {
			DrawMesh(SMG_MESH, Mat4List(Mat4Mult(Mat4Translate([0.3, 1, -0.5]),this.matrix)), this.shader);
		}
    }

}