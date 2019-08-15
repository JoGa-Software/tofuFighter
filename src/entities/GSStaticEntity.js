class GSStaticEntity {

    constructor(inMesh, mdlMtx) {
        
        var mesh;
        if (mdlMtx)
        {   
            var origMesh = inMesh;
            inMesh = {uvs: origMesh.uvs, count: origMesh.count};
            inMesh.vertices = Mat4TransformPoints(origMesh.vertices, mdlMtx);
            if (inMesh.normals)
                inMesh.normals  = Mat3TransformPoints(origMesh.normals, mdlMtx);
        }

        mesh = BufferMesh(inMesh);

        PhysicalEntity(this, inMesh, false);
	    shader = STD_SHADER;
    }

    render() {
        if (this.texture !== undefined) {
			TEX_SHADER.enable(this.texture);
			DrawMesh(this.mesh, Mat4List(this.matrix), TEX_SHADER);
		} else {
			DrawMesh(this.mesh, Mat4List(this.matrix), this.shader);
		}
    }

}