var BULLET_SPEED = -8;
var BULLET_LIFE = 10;
class GSBullet extends GSDynamicEntity {

    constructor(shooter, pos, rotation){
        super(BULLET_MESH, Mat4Scale(.5*.05));
		
		var vel = shooter.vel;
		var mag = -Math.sqrt(vel[0]*vel[0]+vel[1]*vel[1]+vel[2]*vel[2])		
		
		this.texture = loadTexture('src/assets/gfx/thick.png');
        this.pos = pos;
        this.vel = Mat4TransformPoint(VecScale(VEC_BACKWARD, BULLET_SPEED+mag), Mat4Rotate(rotation));
        this.force = Vector3();
        this.friction = 0;
        this.size = 10;
        this.color = shooter.color;

        this.t = 0;
		this.shooter = shooter;
		this.rot = QuatMult(rotation, QuatXYZ(0.0, Math.PI/2, 0.0));
    }
	
	update(dt) {
		this.t += dt;
		if (this.t > BULLET_LIFE) {
			removeEntity(this);
		}
	}
	
	collision(target, collision) {
		if (target != this.shooter) {
            
            //hit killable object
            if (target.hit && target.isKillable && target.isKillable === true){
				target.hit();
				entities.push(createExplosion(this.pos, target.color, 2));
            }
			
			//hit static object
			if (target.dynamic == false) 
			{
				// var explosion = Explosion(this.pos);
				// explosion.color = [0.1, 0.1, 0.1, 1];
				// explosion.size = 0.5
				// explosion.range = 0.01;
				// explosion.velocityRange = 0.02;
				// explosion.duration = 0.5;
				// entities.push(explosion);
				entities.push(createExplosion(this.pos, this.shooter.color, 1));
			}
			
			removeEntity(this);
		}
	}
	
	render() {
		TEX_SHADER.enable(this.texture);


		var matrix = Mat4World(this.pos, this.rot);
		matrix = Mat4Mult(Mat4Scale(this.size), matrix);

		TEX_SHADER.setColor(this.color);
		matrix = Mat4List(matrix);
		DrawMesh(this.mesh, matrix, TEX_SHADER);

		TEX_SHADER.setColor(1, 1, 1, 1);
	}

}