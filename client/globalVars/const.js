class ConstVar{
    constructor() {
        this.tileSide = 10; this.outlineWidth = 0;
        this.tileRows = 40; this.tileCols = 40;
        this.minScale = 2.5; this.maxScale = 12;
        this.itemMapSize = 8;
    }
}

const CVAR = new ConstVar();

export default CVAR;