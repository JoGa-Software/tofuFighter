class GSLoadingScreen 
{
    constructor(items, callBack)
    {
        this.progress = 0.0;
        this.mesh = BufferMesh(SQUARE_MESH);
        this.texture = MakeTexture(function () {return [255, 255, 255, 255];}, 16);

        this.loadIndex = 0;
        this.loadList = items;
        this.loadingCallback = callBack;
        
        // start timeout loop
        window.setTimeout(() => {
            this.loadInstance();
        }, 1);
    }

    setProgress(percent) 
    {
        if (percent > 1) percent = 1;
        this.progress = percent;
    }

    loadInstance() {
        this.setProgress((this.loadIndex+1)/this.loadList.length);
        this.render();
        
        var instance = this.loadList[this.loadIndex];
        if (instance[1] === "mesh"){
            BufferMesh(instance[0]);
        }else if (instance[1] === "texture"){
            loadTexture(instance[0]);
        }
    
        this.loadIndex++;
        if (this.loadIndex < this.loadList.length)
            window.setTimeout(() => {
                this.loadInstance()
            }, 1);
        else
            this.loadingCallback();
    }

    render()
    {
        // clear screen
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        var matrix;
        TEX_SHADER.enable(this.texture);
        OrthogonalProjection();
        gl.depthMask(false);
        
        TEX_SHADER.setColor(100,100,100);
        matrix = Mat4Scale(0.5, 0.15, 1);
        DrawMesh(this.mesh, Mat4List(matrix), TEX_SHADER);
        
        TEX_SHADER.setColor(0,0,0);
        matrix = Mat4Scale(0.475, 0.125, 1);
        DrawMesh(this.mesh, Mat4List(matrix), TEX_SHADER);
        
        if (this.progress > 0) {
            TEX_SHADER.setColor(3,3,3);
            matrix = Mat4Scale(0.45 * this.progress, 0.1, 1);
            matrix = Mat4Mult(Mat4Translate(1 - 1/this.progress, 0, 0), matrix);
            DrawMesh(this.mesh, Mat4List(matrix), TEX_SHADER);
        }
        
        gl.depthMask(true);
        NormalProjection();
    }
}

