import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import RES from "../../resources.js";
import CVAR from "../../globalVars/const.js";

class BuildingMenu {
    constructor() {
        document.getElementById("close-building-menu").onclick = () => {
            document.getElementById("building-menu-wrap").style.display = "none";
        };
        this.building = 'none';
    }
    show(building) {
        this.building = building;
        GVAR.closeAllWindows();
        document.getElementById("building-menu-wrap").style.display = "flex";
        this.renderCrafts();
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
    renderQueue() {
        const queue = this.building._craftingItems;
        const size = this.building._slotsAmount;
        const buildingQueue = document.getElementById('building-queue');
        buildingQueue.innerHTML = '';
        for (let i = 0; i < size; i++) {
            const queueElem = document.createElement("div");
            queueElem.className = "queue-elem";
            if (queue[i] != undefined) {
                const img = document.createElement("img");
                img.className = "item-image";
                const key = Object.keys(queue[i])[0];
                img.src = `client/assets/${key}/${key}.png`;
                queueElem.appendChild(img);

                const time = document.createElement("h3");
                time.className = "queue-text";
                time.innerText = this._formatTime(Math.trunc(queue[i].timeToFinish / 1000));
                queueElem.appendChild(time);
            }
            buildingQueue.appendChild(queueElem);
        }

        if (this.building._slotsAmount < RES.buildings[this.building._type].maxSlots + CVAR.extraSlotsCount){
            const queueElem = document.createElement("div");
            queueElem.className = "queue-elem";
            queueElem.innerText = '+'
            queueElem.onclick = () => {
                const overlay = document.createElement('div');
                overlay.id = 'menu-overlay';
                
                const menu = document.createElement('div');
                menu.id = 'menu';

                const extraSlotCount = this.building._slotsAmount - RES.buildings[this.building._type].maxSlots
                const price = CVAR.extraSlotPrice * Math.pow(CVAR.extraSlotCoef, extraSlotCount)
                const question = document.createElement('p');
                question.innerText = `Хотите ли купить улучшение за ${price} токенов?`;
                
                const yesButton = document.createElement('button');
                yesButton.innerText = 'Да';
                yesButton.className = 'menu-button yes-button';
                yesButton.onclick = () => {
                    if (player._tokenBalance >= price){
                        this.building.incSlotsAmount()
                        player.spendToken(price)
                        this.renderQueue()
                    }
                    document.body.removeChild(menu);
                    document.body.removeChild(overlay);
                };

                const noButton = document.createElement('button');
                noButton.innerText = 'Нет';
                noButton.className = 'menu-button no-button';
                noButton.onclick = () => {
                    document.body.removeChild(menu);
                    document.body.removeChild(overlay);
                };

                menu.appendChild(question);
                menu.appendChild(yesButton);
                menu.appendChild(noButton);

                document.body.appendChild(overlay);
                document.body.appendChild(menu);
            };
            buildingQueue.appendChild(queueElem);
        }
    }
    renderCrafts() {
        const type = this.building._type;
        const queue = this.building._craftingItems;
        this.renderQueue();
        const buildingImg = document.getElementById('building-img');
        buildingImg.src = `client/assets/${type}/${type}.png`;
        buildingImg.className = 'menu-big-img';
        const button = document.getElementById('upgrade-building');
        button.onclick = () => {
            if (this.building.canUpgrade()){
                this.building.upgrade()
                this.renderCrafts()
            }
        };
        const buildingMenuList = document.getElementById('building-menu-list');
        buildingMenuList.innerHTML = "";
        for (let product in RES.buildings[type].workTypes) {
            const craft = document.createElement("div");
            craft.className = "craft";

            const craftImg = document.createElement("div");
            craftImg.style.backgroundImage = `url(client/assets/${product}/${product}.png)`;
            craftImg.className = "craft-item-image";
            const buildingQueue = document.getElementById('building-queue');

            const isIntersecting = (rect1, rect2) => {
                return (
                    rect1.left + rect1.width / 2 < rect2.right &&
                    rect1.right - rect1.width / 2 > rect2.left &&
                    rect1.top + rect1.height / 2 < rect2.bottom &&
                    rect1.bottom - rect1.height / 2 > rect2.top
                );
            };
            const thisMenu = this;
            const building = this.building;

            if (building.canStartWork(RES.buildings[type].workTypes[product])) {
                craftImg.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    const clone = this.cloneNode(true);

                    clone.classList.add('clone-image');
                    document.body.appendChild(clone);

                    const moveAt = (pageX, pageY) => {
                        clone.style.left = pageX - clone.offsetWidth / 2 + 'px';
                        clone.style.top = pageY - clone.offsetHeight / 2 + 'px';
                    };

                    const touch = e.touches[0];
                    moveAt(touch.pageX, touch.pageY);

                    const onTouchMove = (event) => {
                        if (!isIntersecting(clone.getBoundingClientRect(), craft.getBoundingClientRect()))
                            document.getElementById('drop-list').style.display = 'none';
                        const touch = event.touches[0];
                        moveAt(touch.pageX, touch.pageY);
                    };
                    const onTouchEnd = () => {
                        document.removeEventListener('touchmove', onTouchMove);
                        const cloneRect = clone.getBoundingClientRect();
                        const visualRect = document.getElementById('building-visual').getBoundingClientRect();
                        if (isIntersecting(cloneRect, visualRect) && building.canStartWork(RES.buildings[type].workTypes[product])) {
                            building.startWork(RES.buildings[type].workTypes[product]);
                            thisMenu.renderCrafts();
                        }
                        clone.remove();
                    };

                    document.addEventListener('touchmove', onTouchMove);
                    document.addEventListener('touchend', onTouchEnd, { once: true });
                });
            } else {
                craftImg.style.filter = 'grayscale(100%)';
            }

            craft.addEventListener('touchstart', (event) => {
                const dropList = document.createElement("div");
                dropList.id = 'drop-list';
                dropList.className = "craft-drop-list";
                const dropName = document.createElement("h3");
                dropName.innerText = product;
                dropName.className = 'drop-list-text';
                dropList.appendChild(dropName);

                const dropTime = document.createElement("h3");
                dropTime.innerText = this._formatTime(RES.buildings[type].workTypes[product].timeToFinish);
                dropTime.className = 'drop-list-text';
                dropList.appendChild(dropTime);
                const dropLevel = document.createElement("h3");
                dropLevel.className = 'drop-items-amount';
                const nowLevel = this.building._level;
                const needLevel = RES.buildings[type].workTypes[product].minLevel;
                if (nowLevel < needLevel) {
                    dropLevel.classList.add('insufficient');
                }
                dropLevel.innerText = `level: ${nowLevel}/${needLevel}`
                dropList.appendChild(dropLevel);

                for (let item in RES.buildings[type].workTypes[product].items) {
                    const dropItem = document.createElement("div");
                    dropItem.className = "drop-item";
                    const img = document.createElement("img");
                    img.src = `client/assets/${item}/${item}.png`;
                    img.className = 'drop-list-img';

                    const itemText = document.createElement("h3");
                    itemText.className = 'drop-items-amount';
                    const playerItemAmount = player._inventory[item];
                    const requiredItemAmount = RES.buildings[type].workTypes[product].items[item];
                    itemText.innerText = `${playerItemAmount}/${requiredItemAmount}`;

                    if (playerItemAmount < requiredItemAmount) {
                        itemText.classList.add('insufficient');
                    }
                    dropItem.appendChild(img);
                    dropItem.appendChild(itemText);
                    dropList.appendChild(dropItem);
                }
                craft.appendChild(dropList);
                dropList.style.display = 'block';
            });

            craft.addEventListener('touchend', (event) => {
                document.getElementById('drop-list').remove();
            });

            craft.appendChild(craftImg);

            buildingMenuList.appendChild(craft);
        }
    }
}
export const buildingMenu = new BuildingMenu();
