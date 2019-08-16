
class GSTofu extends GSDynamicEntity
{
    constructor(position, rotation)
    {
        super(TOFU_MESH);

        BufferMesh(G36C_MESH);
        this.gunTexture = loadTexture("./src/assets/gfx/G36CTex.png");

        //set the texture of tofu
        this.texture = loadTexture("./src/assets/gfx/tofuTex.png");
        
        //set the position
        this.pos = position ? position : [0, 0, 0];

        //set the rotation
        this.rot = rotation ? rotation : Quat();

        this.force = [0, -100, 0,];

        this.speed = 30;
        this.rotSpeed = 0.05;

        this.spawnTimer = 1.0;
        this.shootDelay = SHOOT_DELAY;
        this.isKillable = true;
        this.health = 100;
        this.dead = false;
    }

    forward(){
        this.acl = VecAdd(this.acl, VecRotate(VecScale(VEC_FORWARD, this.speed), this.rot));
    }

    reverse(){
        this.acl = VecAdd(this.acl, VecRotate(VecScale(VEC_FORWARD, -this.speed), this.rot));
    }

    left(){
        this.rot = QuatMult(this.rot, QuatXYZ(0.0, -this.rotSpeed, 0.0));
    }
    
    right(){
        this.rot = QuatMult(this.rot, QuatXYZ(0.0, this.rotSpeed, 0.0));
    }

    strafeLeft(){
        this.acl = VecAdd(this.acl, VecRotate(VecScale(VEC_LEFT, -this.speed), this.rot));
    }

    strafeRight(){
        this.acl = VecAdd(this.acl, VecRotate(VecScale(VEC_LEFT, this.speed), this.rot));
    }

    mouseX(mouseX){

    }

    shoot(){
        if (this.shootDelay <= 0){
            var pos = Mat4TransformPoint([-0.35, 1, 1.55], this.matrix);
            var bullet = new GSBullet(this, pos, this.rot);
            entities.push(bullet);
            this.shootDelay = SHOOT_DELAY;
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
        if (!this.dead) {
            entities.push(createExplosion(this.pos, this.color, 9));
        }
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
            if (this.color) {
                TEX_SHADER.setColor([this.color[0], this.color[1], this.color[2], 1.0]);
            }
			DrawMesh(G36C_MESH, Mat4List(Mat4Mult(Mat4Translate([-0.2, 1, 0.55]),this.matrix)), TEX_SHADER);
		} else {
			DrawMesh(G36C_MESH, Mat4List(Mat4Mult(Mat4Translate([-0.2, 1, 0.55]),this.matrix)), this.shader);
        }
        TEX_SHADER.setColor([1,1,1,1]);
    }

}