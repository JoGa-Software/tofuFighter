class GSMap extends GSStaticEntity {

    constructor(position, rotation, model = SQUARE_MAP) {
        super(model.staticModels[0].mesh, Mat4Scale(2, 2, 2))
        this.texture = loadTexture(model.staticModels[0].texture);

        if (position) {
            this.pos = position;
            if (rotation) this.rot = rotation;
        }
    }

}