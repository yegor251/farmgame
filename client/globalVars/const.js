class ConstVar{
    constructor() {
        this.tileSide = 10; this.outlineWidth = 0;
        this.tileRows = 100; this.tileCols = 100;
        this.mapBoundingBox = {
            top: -50,
            bottom: this.tileCols * (this.tileSide+this.outlineWidth) + 50,
            left: -50,
            right: this.tileRows * (this.tileSide+this.outlineWidth) + 50,
        }
    }
}

const CVAR = new ConstVar();

export default CVAR;