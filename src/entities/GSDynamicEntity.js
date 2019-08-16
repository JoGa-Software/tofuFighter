class GSDynamicEntity{

    constructor(origMesh, mdlMtx, shader = TEX_SHADER){

        // an array of meshes were passed in(this is for animation)
        if (Array.isArray(origMesh)){
            this.meshes = origMesh
        }else { // a single mesh was passed in
            this.meshes = [origMesh]
        }

        this.meshes.forEach((mesh, index) => {
            var temp;
            if (mdlMtx)
            {   
                temp = {uvs: mesh.uvs, count: mesh.count};
                temp.vertices = Mat4TransformPoints(mesh.vertices, mdlMtx);
                temp.normals  = Mat3TransformPoints(mesh.normals, mdlMtx);
            }
            else
                temp = mesh;
            
            //update the mesh
            this.meshes[index] = temp
            //buffer the edited mesh
            BufferMesh(temp);
        });

        //make the mesh a physical entity
        PhysicalEntity(this, this.meshes[0], true);

        //set the shader
        this.shader = shader;
        this.t = 0;
    }
    
    update(dt) {
        this.t += dt;
    }

    render()
    {

        if (this.shader == ANIM_SHADER) {
            this._renderAnimated()
        }else {
            this._renderNormal()
        }
        
        this.shader.setColor([1,1,1,1]);
    }

    _renderAnimated() {
        var frame = Math.floor(this.t) % this.meshes.length;
        var tfactor = this.t - Math.floor(this.t);
        this.shader.enable(this.texture);

        if (this.color) {
            this.shader.setColor([this.color[0], this.color[1], this.color[2], 1.0]);
        }
        
        this.shader.setBlend(0.5-0.5*Math.cos(tfactor*3.14));
        this.shader.render(this.meshes[frame], this.meshes[(frame+1)%this.meshes.length], Mat4List(this.matrix));
    }

    _renderNormal() {
        if (this.texture !== undefined) {
            this.shader.enable(this.texture);
            DrawMesh(this.mesh, Mat4List(this.matrix), this.shader);
        } else {
            DrawMesh(this.mesh, Mat4List(this.matrix), this.shader);
        }
    }
}