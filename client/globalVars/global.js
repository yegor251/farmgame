class GlobalVars{
    constructor()
    {
        this.buildableArr = new Array();
        this.penArr = new Array();
        this.phantomStructureArr = new Array(0);
        this.obstacleArr = new Array();

        this.scale = 11;
        this.rescale = true
        this.redraw = true;
    }
    countBuilding(type){
        let counter = 0
        this.buildableArr.forEach(el => {
            if (el._type === type)
                counter += 1
        });
        return counter
    }
    addBuilding(item){
        let index = this.buildableArr.findIndex(element => element._y > item._y);
    
        if (index >= 0) {
            this.buildableArr.splice(index, 0, item);
        } else {
            this.buildableArr.push(item);
        }
    }
    updateBuildingArr(item) {
        let index = this.buildableArr.indexOf(item);
        
        if (index !== -1) {   
            this.buildableArr.splice(index, 1);
            this.addBuilding(item);
        }
    }
    closeAllWindows(){
        document.getElementById("spin-wrap").style.display = "none";
        document.getElementById("orders-wrap").style.display = "none";
        document.getElementById("stash-wrap").style.display = "none";
        document.getElementById("shop-wrap").style.display = "none";
        document.getElementById("building-menu-wrap").style.display = "none";
    }
}

const GVAR = new GlobalVars();

export default GVAR;