import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import RES from "../../resources.js";
import Calc from "../../calc.js";

class FieldMenu{
    constructor() {
        document.getElementById("close-field-menu").onclick = () => {
            this.close()
        }
        this.field = 'none'
    }
    show(field){
        this.field = field
        const fieldImg = document.getElementById('field-img')
        fieldImg.style.backgroundImage = `url(client/assets/buildings/${field._type}/${field._type}.png)`;
        fieldImg.style.aspectRatio = `1 / 1`;
        GVAR.closeAllWindows()
        document.getElementById("field-menu-wrap").style.display = "flex";
        this.renderPlants()
    }
    close(){
        document.getElementById("field-menu-wrap").style.display = "none";
        document.getElementById("buttons-bar").style.display = "flex";
    }
    renderTimer() {
        const textTime = document.getElementById("field-timeToFinish");
        if (this.field._plant === "none") {
            textTime.innerText = '-';
        } else {
            textTime.innerText = Calc.formatTime(Math.floor(this.field._plant._timeToGrow / 1000));
        }
    
        let remainingTime = 0;
        let totalTime = 1; 
    
        if (this.field._plant !== "none") {
            remainingTime = this.field._plant._timeToGrow;
            totalTime = this.field._plant._plantTimeStamp;
            if (remainingTime === 0) {
                this.close();
            }
        } else {
            remainingTime = 1
        }
    
        var progressLine = document.getElementById('field-process-line');
        var progressBar = progressLine.querySelector('.progress');
    
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress';
            progressLine.appendChild(progressBar);
        }
    
        var percentage = ((totalTime - remainingTime) / totalTime) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
    
        progressBar.style.transition = 'width 0.5s ease';
        progressBar.style.width = percentage + '%';
    

        const plantImg = document.getElementById('overlay-plant-img');
        if (this.field._plant !== 'none') {
            plantImg.style.backgroundImage = `url(${this.field._plant._image.src})`;
            plantImg.style.aspectRatio = `${this.field._plant._image.width} / ${this.field._plant._image.height}`
            plantImg.style.display = 'flex';
        } else {
            plantImg.style.display = 'none';
        }
    }    
    renderPlants(){
        const fieldMenuList = document.getElementById('field-menu-list');
        fieldMenuList.innerHTML = ""
        this.renderTimer()
        RES.names.plants.forEach(plant =>
        {
            const craft = document.createElement("div")
            craft.className = "plant-craft"

            const craftImg = document.createElement("div")
            craftImg.style.backgroundImage = `url(client/assets/items/${plant}.png)`
            craftImg.className = "craft-item-image"
            if (!player._inventory[plant]) {
                craftImg.style.filter = 'grayscale(100%)';
                player._inventory[plant] = 0
            }
            const amount = document.createElement("h3")
            amount.innerText = player._inventory[plant]
            amount.className = 'amount-text'

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
                    if (GVAR.countBuilding('garden') == 1 && player._inventory['wheat'] == 4 && GVAR.countBuilding('bakery') == 0){
                        const customEvent = new Event('firstPlant');
                        document.body.dispatchEvent(customEvent);
                    }
                    e.preventDefault();
                    const clone = this.cloneNode(true);
                    clone.classList.add('clone-image');
                    document.body.appendChild(clone);

                    const computedStyle = window.getComputedStyle(this);
                    clone.style.width = computedStyle.width;
                    clone.style.height = computedStyle.height;
        
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
                            if (GVAR.countBuilding('garden') == 1 && player._inventory['wheat'] == 4 && GVAR.countBuilding('bakery') == 0){
                                const customEvent = new Event('firstPlantDone');
                                document.body.dispatchEvent(customEvent);
                            }
                            player._inventory[plant] -= 1;
                            field.createPlant(plant)
                            thisMenu.renderPlants()
                        } else {
                            if (GVAR.countBuilding('garden') == 1 && player._inventory['wheat'] == 4 && GVAR.countBuilding('bakery') == 0){
                                const customEvent = new Event('firstPlantBad');
                                document.body.dispatchEvent(customEvent);
                            }
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
                dropName.innerText = RES.plants[plant].localization.name[GVAR.language]
                dropName.className = 'drop-list-text'
                dropList.appendChild(dropName)

                const dropTime =  document.createElement("h3")
                dropTime.innerText = Calc.formatTime(RES.plants[plant].seed.timeToGrow)
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
