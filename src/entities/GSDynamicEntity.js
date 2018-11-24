class GSDynamicEntity{

    constructor(origMesh, mdlMtx){

        var mesh;
        if (mdlMtx)
        {   
            mesh = {uvs: origMesh.uvs, count: origMesh.count};
            mesh.vertices = Mat4TransformPoints(origMesh.vertices, mdlMtx);
            mesh.normals  = Mat3TransformPoints(origMesh.normals, mdlMtx);
        }
        else
            mesh = origMesh;
        
        BufferMesh(mesh);
        
        PhysicalEntity(this, mesh, true);
        this.shader = STD_SHADER;
    
    }

    render()
    {
        if (this.texture !== undefined) {
            TEX_SHADER.enable(this.texture);
            DrawMesh(this.mesh, Mat4List(this.matrix), TEX_SHADER);
        } else {
            DrawMesh(this.mesh, Mat4List(this.matrix), this.shader);
        }
    }

}