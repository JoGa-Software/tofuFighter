var BULLET_SPEED = -50;
var BULLET_LIFE = 10;
class GSBullet extends GSDynamicEntity {

    constructor(shooter, pos, rotation){
        super(SQUARE_MESH);

        this.texture = GetParticleTexture();
        this.pos = pos;
        this.vel = Mat4TransformPoint(VecScale(VEC_FORWARD, BULLET_SPEED), Mat4Rotate(rotation));
        this.force = Vector3();
        this.friction = 0;
        this.size = .05;
        this.color = [1,1,0,1];

        this.t = 0;
        this.shooter = shooter;
    }

	update(dt) {
		this.t += dt;
		if (this.t > BULLET_LIFE) {
			removeEntity(this);
		}
	}
	
	collision(target, collision) {
		if (target != this.shooter) {
			var explosion = Explosion(this.pos);
            explosion.color = [0.1, 0.1, 0.1, 1];
            explosion.size = 0.5
            explosion.range = 0.01;
            explosion.velocityRange = 0.02;
            explosion.duration = 0.5;
			entities.push(explosion);
            
            //check if we should hit the target
            if (target.hit && target.isKillable && target.isKillable === true){
                target.hit();
            }
            
			if (target.dynamic == false) 
			{
                console.log("hit");
				//var scorch = ScorchMark(collision.contact, collision.normal);
				//entities.push(scorch);
			}
			
			removeEntity(this);
		}
	}
	
	render() {
		TEX_SHADER.enable(this.texture);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		gl.depthMask(false);
		
		var rot = gCamera.rot;
		var matrix = Mat4World(this.pos, rot);
		matrix = Mat4Mult(Mat4Scale(this.size), matrix);
		TEX_SHADER.setColor(this.color);
		matrix = Mat4List(matrix);
		DrawMesh(this.mesh, matrix, TEX_SHADER);

		gl.depthMask(true);
		gl.disable(gl.BLEND);
		TEX_SHADER.setColor(1, 1, 1, 1);
	}

}