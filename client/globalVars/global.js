class GlobalVars{
    constructor()
    {
        this.buildableArr = new Array();
        this.penArr = new Array();
        this.phantomStructureArr = new Array(0);
        this.obstacleArr = new Array();

        this.scale = 7 * window.innerHeight / 1000;
        this.rescale = true
        this.redraw = true;
        this.confirmFlag = false;
        this.confirmTimer = null
        this.localization = null
        this.language = 'en'
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
        document.getElementById("booster-menu-wrap").style.display = "none";
        document.getElementById("obstacle-menu-wrap").style.display = "none";
        document.getElementById("buisness-menu-wrap").style.display = "none";
        document.getElementById("animal-menu-wrap").style.display = "none";
        document.getElementById("field-menu-wrap").style.display = "none";
        document.getElementById("bush-menu-wrap").style.display = "none";
        document.getElementById("transaction-wrap").style.display = "none";
        document.getElementById("deals-wrap").style.display = "none";
        document.getElementById("payment-wrap").style.display = "none";
        document.getElementById("main-menu-wrap").style.display = "none";
        document.getElementById("buttons-bar").style.display = "none";
    }
    showFloatingText(code, text) {
        const existingTexts = document.querySelectorAll('.floating-text');
        let message = this.localization[code][this.language];
        if (message.includes('{')) {
            message = message.replace(/\{/g, text);
        }
        
        for (const textElement of existingTexts) {
            if (textElement.textContent === message) {
                return;
            }
        }
    
        const textElement = document.createElement('div');
        textElement.textContent = message;
        textElement.classList.add('floating-text');
        
        document.body.appendChild(textElement);
      
        setTimeout(() => {
            textElement.classList.add('float-away');
        }, 50);
      
        setTimeout(() => {
            textElement.remove();
        }, 4000);
    }    
    setConfirm(){
        this.confirmFlag = true;
        this.confirmTimer = setTimeout(() => {
            this.confirmFlag = false;
        }, 3000);
    }
    deleteConfirm(){
        this.confirmFlag = false;
        clearTimeout(this.confirmTimer)
    }
}

const GVAR = new GlobalVars();

export default GVAR;