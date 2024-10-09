class ConstVar{
    constructor() {
        this.tileSide = 10; this.outlineWidth = 0;
        this.tileRows = 40; this.tileCols = 40;
        this.minScale = 2.5; this.maxScale = 12;
        this.itemMapSize = 8; this.extraSlotsCount = 3;
        this.nextGardenPriceCoef = 1.2; this.nextBuildingPriceCoef = 100;
        this.animalPenCoef = 1.1;
        this.extraSlotPrice = 1000; this.extraSlotCoef = 10;
        this.orderCompleteTime = 600; this.orderRerollTime = 1800;
        this.maxInvSize = 2000;
        this.redColor = 230; this.greenColor = 230;
    }
}

const CVAR = new ConstVar();

export default CVAR;