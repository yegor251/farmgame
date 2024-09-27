import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import RES from "../../resources.js";

class FieldMenu{
    constructor() {
        document.getElementById("close-field-menu").onclick = () => {
            this.close()
        }
        this.field = 'none'
    }
    show(field){
        this.field = field
        GVAR.closeAllWindows()
        document.getElementById("field-menu-wrap").style.display = "flex";
        this.renderPlants()
    }
    close(){
        document.getElementById("field-menu-wrap").style.display = "none";
    }
    _formatTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;
    
        let result = [];
        if (hours > 0) {
            result.push(hours + 'ч');
        }
        if (minutes > 0) {
            result.push(minutes + 'м');
        }
        if (secs > 0 || (hours === 0 && minutes === 0 && secs === 0)) {
            result.push(secs + 'с');
        }
        return result.join(' ');
    }
    renderTimer(){
        const textTime = document.getElementById("field-timeToFinish")
        if (this.field._plant == "none")
            textTime.innerText = '-'
        else{
            textTime.innerText = this._formatTime(Math.floor(this.field._plant._timeToGrow / 1000))
        }
        let a = 0
        let b = 1 
        if (this.field._plant != "none"){
            a = this.field._plant._timeToGrow
            b = this.field._plant._plantTimeStamp
            if (a == 0)
                this.close()
        }
        var progressLine = document.getElementById('field-process-line');
        var progressBar = progressLine.querySelector('.progress');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress';
            progressLine.appendChild(progressBar);
        }

        var percentage = (a / b) * 100;
        
        percentage = Math.max(0, Math.min(100, percentage));
        progressBar.style.width = percentage + '%';
        const plantImg = document.getElementById('overlay-plant-img')
        if (this.field._plant != 'none'){
            plantImg.src = this.field._plant._image.src
            plantImg.style.display = 'flex'
        }
        else
            plantImg.style.display = 'none'
    }
    renderPlants(){
        const fieldImg = document.getElementById('field-img')
        fieldImg.src = `client/assets/${this.field._type}/${this.field._type}.png`
        fieldImg.className = 'menu-big-img'
        const fieldMenuList = document.getElementById('field-menu-list');
        fieldMenuList.innerHTML = ""
        this.renderTimer()
        RES.names.plants.forEach(plant =>
        {
            const craft = document.createElement("div")
            craft.className = "craft"

            const craftImg = document.createElement("div")
            craftImg.style.backgroundImage = `url(client/assets/${plant}/${plant}.png)`
            craftImg.className = "craft-item-image"
            if (player._inventory[plant] == 0)
                craftImg.style.filter = 'grayscale(100%)';
            const amount = document.createElement("h3")
            amount.innerText = player._inventory[plant]
            amount.className = 'drop-list-text' //потом замениться

            const isIntersecting = (rect1, rect2) => {
                return (
                    rect1.left + rect1.width/2 < rect2.right &&
                    rect1.right - rect1.width/2 > rect2.left &&
                    rect1.top + rect1.height/2 < rect2.bottom &&
                    rect1.bottom - rect1.height/2> rect2.top
                );
            };
            const thisMenu = this;
            const field = this.field;
            if (player._inventory[plant] > 0) {
                craftImg.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    const clone = this.cloneNode(true);
                    const chosenElem = craft.id.substring(0, craft.id.indexOf('-'));
                    clone.classList.add('clone-image');
                    document.body.appendChild(clone);
        
                    const moveAt = (pageX, pageY) => {
                        clone.style.left = pageX - clone.offsetWidth / 2 + 'px';
                        clone.style.top = pageY - clone.offsetHeight / 2 + 'px';
                    };
        
                    const touch = e.touches[0];
                    moveAt(touch.pageX, touch.pageY);
        
                    const onTouchMove = (event) => {
                        if (!isIntersecting(clone.getBoundingClientRect(),craft.getBoundingClientRect()))
                            document.getElementById('drop-list').style.display = 'none';
                        const touch = event.touches[0];
                        moveAt(touch.pageX, touch.pageY);
                    };
                    const onTouchEnd = () => {
                        document.removeEventListener('touchmove', onTouchMove);
                        const cloneRect = clone.getBoundingClientRect();
                        const visualRect = document.getElementById('field-img').getBoundingClientRect();
                        if (isIntersecting(cloneRect, visualRect) && field.canCreatePlant(plant)) {
                            player._inventory[plant] -= 1;
                            field.createPlant(plant)
                            thisMenu.renderPlants()
                        }
                        clone.remove();
                    };
                    
                    document.addEventListener('touchmove', onTouchMove);
                    document.addEventListener('touchend', onTouchEnd, { once: true });
                });
            }

            craft.addEventListener('touchstart', (event) => {
                const dropList = document.createElement("div")
                dropList.id = 'drop-list'
                dropList.className = "craft-drop-list"
                const dropName =  document.createElement("h3")
                dropName.innerText = plant
                dropName.className = 'drop-list-text'
                dropList.appendChild(dropName)

                const dropTime =  document.createElement("h3")
                dropTime.innerText = this._formatTime(RES.plants[plant].seed.timeToGrow)
                dropTime.className = 'drop-list-text'
                dropList.appendChild(dropTime)

                craft.appendChild(dropList)
                dropList.style.display = 'block';
            });
    
            craft.addEventListener('touchend', (event) => {
                document.getElementById('drop-list').remove()
            });

            craft.appendChild(craftImg)
            craft.appendChild(amount)

            fieldMenuList.appendChild(craft)
        });
    }
}
export const fieldMenu = new FieldMenu();
