class GSHUD {

    constructor() {

        this.health = 0.5;

        this.Meter = function (color, amount) {
            return function (x, y) {
                y = (y > 1.0-amount) ? 1 : 0;
                return [color[0], color[1], color[2], y*255];
            };
        }

        //create the textures
        this.healthBackdrop = MakeTexture(this.Meter([0,0,0], 1.0), 255)
        this.healthBar = MakeTexture(this.Meter([255,0,0], this.health), 64);

        //creat the mesh
        this.healthBarMesh = CloneMesh(SQUARE_MESH);
        TransformMeshUVs(this.healthBarMesh, [0, 0.99, 0,0.99,0,0]);
        BufferMesh(this.healthBarMesh);

        this.hpText = {}
        this.hpText.text = TextSprite("HP:", "white", "28px impact");
        this.hpText.text.x = (canvas.width - this.hpText.text.size.width) - canvas.width*0.95;
        this.hpText.text.y =  canvas.height*0.03;

        this.mesh = this.healthBarMesh;
        this.matrix;
    }
    
    update(dt) {
        this.health = game.tofu.health / 100.0
        UpdateTexture(this.healthBar, this.Meter([196,0,64], this.health));
    }

    render() {
        if (game.tofu.dead) { return }

        // set up rendering state
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.DEPTH_TEST);
		OrthogonalProjection();

        // health bar backdrop
		TEX_SHADER.enable(this.healthBackdrop);
		TEX_SHADER.setColor(0.1, 0.3, 0.0);
		this.matrix = Mat4Mult(Mat4Scale(0.27, 0.07, 1), Mat4Translate(-0.62, 0.9, 0));
		DrawMesh(this.healthBarMesh, Mat4List(this.matrix), TEX_SHADER);
        
        // health bar
        TEX_SHADER.enable(this.healthBar);
		TEX_SHADER.setColor(1, 1, 1);
		this.matrix = Mat4Mult(Mat4Scale(0.25, 0.05, 1), Mat4Translate(-0.62, 0.9, 0));
		DrawMesh(this.healthBarMesh, Mat4List(this.matrix), TEX_SHADER);

        // restore rendering state
        gl.depthMask(true);
        gl.enable(gl.DEPTH_TEST);
		gl.disable(gl.BLEND);
        NormalProjection();
        
        if (this.hpText.text) {
            this.hpText.text.render();
        }
    }

}