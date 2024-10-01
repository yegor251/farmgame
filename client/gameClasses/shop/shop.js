import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import mouse from "../controller/mouse.js";
import Calc from "../../calc.js";
import CVAR from "../../globalVars/const.js";
import RES from "../../resources.js";
import Phantom from "../sprite/phantom.js";
import socketClient from "../../init.js";

class Shop{
    constructor() {
        const shopWrap = document.getElementById('shop-wrap');
        const shopBar = document.getElementById('shop-bar');
        shopWrap.addEventListener('click', function(event) {
            if (!(event.target.closest('#shop-bar') || event.target.closest('#shop-list'))) {
                const slidableDiv = document.getElementById('shop');
                slidableDiv.classList.add('slide-out');
                setTimeout(() => {
                    document.getElementById("shop-wrap").style.display = "none";
                }, 450);
            }
        });

        document.getElementById("buy-building").onclick = () => {
            this.drawBuildingShop();
        }

        document.getElementById("buy-plant").onclick = () => {
            this.drawPlantShop();
        }

        document.getElementById("buy-animal").onclick = () => {
            this.drawAnimalShop();
        }

        document.getElementById("buy-animalPen").onclick = () => {
            this.drawAnimalPenShop();
        }

        document.getElementById("buy-bush").onclick = () => {
            this.drawBushShop();
        }
    
        document.getElementById("open-shop").onclick = () => {
            const slidableDiv = document.getElementById('shop');
            slidableDiv.classList.remove('slide-out');
            GVAR.closeAllWindows();
            document.getElementById("shop-wrap").style.display = "flex";
            this.drawBuildingShop();
        }        

        document.getElementById("closeStash").onclick = () => {
            document.getElementById("stash-wrap").style.display = "none";
        }
        document.getElementById("open-stash").onclick = () => {
            GVAR.closeAllWindows();
            this.drawStash();
        }
    }
    drawBuildingShop(){
        const shop = document.getElementById('shop-list');
        shop.innerHTML = '';
        RES.buildingNames.garden.concat(RES.buildingNames.bakery).forEach(building => {
            const shopItem = document.createElement('div');
            const img = document.createElement('img');
            img.src = `client/assets/buildings/${building}/${building}.png`
            img.className = "item-image"
            const price = document.createElement('h3');
            price.innerText = `${RES.buildings[building].price}$`;
    
            // Создаем элемент для выпадающего описания
            const description = document.createElement('div');
            description.className = 'description';
            description.innerText = 'описание'
            description.style.display = 'none'; // изначально скрыто
    
            // Создаем стрелочку для открытия описания
            const arrow = document.createElement('span');
            arrow.innerText = '↓'; // символ стрелочки
            arrow.className = 'description-arrow';
    
            // Добавляем обработчик для стрелочки
            arrow.addEventListener('click', function() {
                if (description.style.display === 'none') {
                    description.style.display = 'block';
                    arrow.innerText = '↑'; // меняем стрелочку на вверх
                } else {
                    description.style.display = 'none';
                    arrow.innerText = '↓'; // меняем стрелочку на вниз
                }
            });
    
            shopItem.appendChild(img);
            shopItem.appendChild(price);
            shopItem.appendChild(arrow);
            shopItem.appendChild(description);
    
            if (GVAR.countBuilding(building) < RES.buildings[building].mapLimit && player._money >= RES.buildings[building].price) {
                let touchStartX = 0;
                let touchStartY = 0;
                let isScrolling = false;
                let touchTimer = null;

                img.addEventListener("touchstart", function(e) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    isScrolling = false;

                    touchTimer = setTimeout(function() {
                        if (!isScrolling) {
                            document.getElementById("shop-wrap").style.display = "none";
                            player._phantomStructure = {
                                cost: RES.buildings[building].price,
                                structureType: 'building'
                            };
                            let pos = Calc.indexToCanvas(mouse._mapPos.i, mouse._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
                            player._phantomStructure.structure = new Phantom(pos.x, pos.y, RES.buildings[building].size, building, RES.buildings[building].image);
                            player._phantomStructure.structure._isMoving = true;
                            GVAR.phantomStructureArr.push(player._phantomStructure.structure);
                            mouse._isDragging = true;
                            mouse._isBlockAfterShop = true;
                            setTimeout(() => {
                                mouse._isBlockAfterShop = false
                            }, 1000);
                            mouse.onMouseMove(e);
                        }
                    }, 300);
                });

                img.addEventListener("touchmove", function(e) {
                    let touchMoveX = e.touches[0].clientX;
                    let touchMoveY = e.touches[0].clientY;

                    if (Math.abs(touchMoveX - touchStartX) > 10 || Math.abs(touchMoveY - touchStartY) > 10) {
                        isScrolling = true;
                        clearTimeout(touchTimer);
                    }
                });

                img.addEventListener("touchend", function(e) {
                    clearTimeout(touchTimer);
                });

            } else {
                img.style.filter = 'grayscale(100%)';
            }
    
            shopItem.className = "shop-item";
            shop.appendChild(shopItem);
        });
    }    
    drawPlantShop(){
        const shop = document.getElementById('shop-list');
        shop.innerHTML = '';
        RES.names.plants.forEach(plant => {
            const shopItem = document.createElement('div');
            const img = document.createElement('img');
            img.src = `client/assets/items/${plant}.png`
            img.className = "item-image"
            const price = document.createElement('h3');
            price.innerText = `${RES.plants[plant].seed.price}$`;

            // Создаем элемент для выпадающего описания
            const description = document.createElement('div');
            description.className = 'description';
            description.innerText = 'описание'
            description.style.display = 'none'; // изначально скрыто
    
            // Создаем стрелочку для открытия описания
            const arrow = document.createElement('span');
            arrow.innerText = '↓'; // символ стрелочки
            arrow.className = 'description-arrow';
    
            // Добавляем обработчик для стрелочки
            arrow.addEventListener('click', function() {
                if (description.style.display === 'none') {
                    description.style.display = 'block';
                    arrow.innerText = '↑'; // меняем стрелочку на вверх
                } else {
                    description.style.display = 'none';
                    arrow.innerText = '↓'; // меняем стрелочку на вниз
                }
            });

            shopItem.appendChild(img)
            shopItem.appendChild(price)
            shopItem.appendChild(arrow);
            shopItem.appendChild(description);
            
            shopItem.addEventListener("click", function(e) {
                if (player._money >= RES.plants[plant].seed.price && player.getInvFullness() >= 1)
                {
                    player.buy(RES.plants[plant].seed.price)
                    player.pushInventory(plant, 1)
                    socketClient.send(`buy/${plant}/${1}`)
                }else{
                    console.log("нет денег или места в инвентаре")
                }
            });
            shopItem.className = "shop-item";
            shop.appendChild(shopItem);
        });
    }
    drawAnimalShop(){
        const shop = document.getElementById('shop-list');
        shop.innerHTML = '';
        RES.names.animals.forEach(animal => {
            const shopItem = document.createElement('div');
            const img = document.createElement('img');
            img.src = `client/assets/animals/${animal}/${animal}.png`
            img.className = "item-image"
            const price = document.createElement('h3');
            price.innerText = `${RES.animals[animal].price}$`;

            // Создаем элемент для выпадающего описания
            const description = document.createElement('div');
            description.className = 'description';
            description.innerText = 'описание'
            description.style.display = 'none'; // изначально скрыто
    
            // Создаем стрелочку для открытия описания
            const arrow = document.createElement('span');
            arrow.innerText = '↓'; // символ стрелочки
            arrow.className = 'description-arrow';
    
            // Добавляем обработчик для стрелочки
            arrow.addEventListener('click', function() {
                if (description.style.display === 'none') {
                    description.style.display = 'block';
                    arrow.innerText = '↑'; // меняем стрелочку на вверх
                } else {
                    description.style.display = 'none';
                    arrow.innerText = '↓'; // меняем стрелочку на вниз
                }
            });

            shopItem.appendChild(img)
            shopItem.appendChild(price)
            shopItem.appendChild(arrow);
            shopItem.appendChild(description);

            if (player._money >= RES.animals[animal].price){
                let touchStartX = 0;
                let touchStartY = 0;
                let isScrolling = false;
                let touchTimer = null;

                img.addEventListener("touchstart", function(e) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    isScrolling = false;

                    touchTimer = setTimeout(function() {
                        if (!isScrolling) {
                            document.getElementById("shop-wrap").style.display = "none"; //везде заменить на плавное закрывание

                            player._phantomStructure = {
                                cost: RES.animals[animal].price,
                                structureType: 'animal'
                            };
                            let pos = Calc.indexToCanvas(mouse._mapPos.i, mouse._mapPos.j, CVAR.tileSide, CVAR.outlineWidth);
                            player._phantomStructure.structure = new Phantom(pos.x, pos.y, RES.animals[animal].size, animal, RES.animals[animal].standImages[0]);
                            player._phantomStructure.structure._isMoving = true;
                            GVAR.phantomStructureArr.push(player._phantomStructure.structure);
                            mouse._isDragging = true;
                            mouse._isBlockAfterShop = true;
                            setTimeout(() => {
                                mouse._isBlockAfterShop = false
                            }, 1000);
                            mouse.onMouseMove(e);
                        }
                    }, 300);
                });

                img.addEventListener("touchmove", function(e) {
                    let touchMoveX = e.touches[0].clientX;
                    let touchMoveY = e.touches[0].clientY;

                    if (Math.abs(touchMoveX - touchStartX) > 10 || Math.abs(touchMoveY - touchStartY) > 10) {
                        isScrolling = true;
                        clearTimeout(touchTimer);
                    }
                });

                img.addEventListener("touchend", function(e) {
                    clearTimeout(touchTimer);
                });
            } else {
                img.style.filter = 'grayscale(100%)';
            }
            shopItem.className = "shop-item";
            shop.appendChild(shopItem);
        });
    }
    drawAnimalPenShop(){
        const shop = document.getElementById('shop-list');
        shop.innerHTML = '';
        RES.buildingNames.animalPen.forEach(building => {
            const shopItem = document.createElement('div');
            const img = document.createElement('img');
            img.src = `client/assets/buildings/${building}/${building}.png`
            img.className = "item-image"
            const price = document.createElement('h3');
            price.innerText = `${RES.buildings[building].price}$`;

            // Создаем элемент для выпадающего описания
            const description = document.createElement('div');
            description.className = 'description';
            description.innerText = 'описание'
            description.style.display = 'none'; // изначально скрыто
    
            // Создаем стрелочку для открытия описания
            const arrow = document.createElement('span');
            arrow.innerText = '↓'; // символ стрелочки
            arrow.className = 'description-arrow';
    
            // Добавляем обработчик для стрелочки
            arrow.addEventListener('click', function() {
                if (description.style.display === 'none') {
                    description.style.display = 'block';
                    arrow.innerText = '↑'; // меняем стрелочку на вверх
                } else {
                    description.style.display = 'none';
                    arrow.innerText = '↓'; // меняем стрелочку на вниз
                }
            });

            shopItem.appendChild(img)
            shopItem.appendChild(price)
            shopItem.appendChild(arrow);
            shopItem.appendChild(description);

            if (player._money >= RES.buildings[building].price){
                let touchStartX = 0;
                let touchStartY = 0;
                let isScrolling = false;
                let touchTimer = null;

                img.addEventListener("touchstart", function(e) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    isScrolling = false;

                    touchTimer = setTimeout(function() {
                        if (!isScrolling) {
                            document.getElementById("shop-wrap").style.display = "none";
                            player._phantomStructure = {
                                cost: RES.buildings[building].price,
                                structureType: 'building'
                            }
                            let pos = Calc.indexToCanvas(mouse._mapPos.i, mouse._mapPos.j, CVAR.tileSide, CVAR.outlineWidth)
                            player._phantomStructure.structure = new Phantom(pos.x, pos.y, RES.buildings[building].size, building, RES.buildings[building].image)
                            player._phantomStructure.structure._isMoving = true
                            GVAR.phantomStructureArr.push(player._phantomStructure.structure)
                            mouse._isDragging = true
                            mouse._isBlockAfterShop = true;
                            setTimeout(() => {
                                mouse._isBlockAfterShop = false
                            }, 1000);
                            mouse.onMouseMove(e)
                        }
                    }, 300);
                });

                img.addEventListener("touchmove", function(e) {
                    let touchMoveX = e.touches[0].clientX;
                    let touchMoveY = e.touches[0].clientY;

                    if (Math.abs(touchMoveX - touchStartX) > 10 || Math.abs(touchMoveY - touchStartY) > 10) {
                        isScrolling = true;
                        clearTimeout(touchTimer);
                    }
                });

                img.addEventListener("touchend", function(e) {
                    clearTimeout(touchTimer);
                });
            } else{
                img.style.filter = 'grayscale(100%)';
            }
            shopItem.className = "shop-item";
            shop.appendChild(shopItem);
        });
    }
    drawBushShop(){
        const shop = document.getElementById('shop-list');
        shop.innerHTML = '';
        RES.buildingNames.bush.forEach(building => {
            const shopItem = document.createElement('div');
            const img = document.createElement('img');
            img.src = `client/assets/buildings/${building}/${building}1.png`
            img.className = "item-image"
            const price = document.createElement('h3');
            price.innerText = `${RES.buildings[building].price}$`;

            // Создаем элемент для выпадающего описания
            const description = document.createElement('div');
            description.className = 'description';
            description.innerText = 'описание'
            description.style.display = 'none'; // изначально скрыто
    
            // Создаем стрелочку для открытия описания
            const arrow = document.createElement('span');
            arrow.innerText = '↓'; // символ стрелочки
            arrow.className = 'description-arrow';
    
            // Добавляем обработчик для стрелочки
            arrow.addEventListener('click', function() {
                if (description.style.display === 'none') {
                    description.style.display = 'block';
                    arrow.innerText = '↑'; // меняем стрелочку на вверх
                } else {
                    description.style.display = 'none';
                    arrow.innerText = '↓'; // меняем стрелочку на вниз
                }
            });

            shopItem.appendChild(img)
            shopItem.appendChild(price)
            shopItem.appendChild(arrow);
            shopItem.appendChild(description);

            if (player._money >= RES.buildings[building].price){
                let touchStartX = 0;
                let touchStartY = 0;
                let isScrolling = false;
                let touchTimer = null;

                img.addEventListener("touchstart", function(e) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    isScrolling = false;

                    touchTimer = setTimeout(function() {
                        if (!isScrolling) {
                            document.getElementById("shop-wrap").style.display = "none";
                            player._phantomStructure = {
                                cost: RES.buildings[building].price,
                                structureType: 'building'
                            }
                            let pos = Calc.indexToCanvas(mouse._mapPos.i, mouse._mapPos.j, CVAR.tileSide, CVAR.outlineWidth)
                            player._phantomStructure.structure = new Phantom(pos.x, pos.y, RES.buildings[building].size, building, RES.buildings[building].image[0])
                            player._phantomStructure.structure._isMoving = true
                            GVAR.phantomStructureArr.push(player._phantomStructure.structure)
                            mouse._isDragging = true
                            mouse._isBlockAfterShop = true;
                            setTimeout(() => {
                                mouse._isBlockAfterShop = false
                            }, 1000);
                            mouse.onMouseMove(e)
                        }
                    }, 300);
                });

                img.addEventListener("touchmove", function(e) {
                    let touchMoveX = e.touches[0].clientX;
                    let touchMoveY = e.touches[0].clientY;

                    if (Math.abs(touchMoveX - touchStartX) > 10 || Math.abs(touchMoveY - touchStartY) > 10) {
                        isScrolling = true;
                        clearTimeout(touchTimer);
                    }
                });

                img.addEventListener("touchend", function(e) {
                    clearTimeout(touchTimer);
                });
            } else{
                img.style.filter = 'grayscale(100%)';
            }
            shopItem.className = "shop-item";
            shop.appendChild(shopItem);
        });
    }
    drawStash()
    {
        document.getElementById("stash-wrap").style.display = "flex";
        const stashList = document.getElementById('stash-list')
        stashList.innerHTML = "";
    
        for (let item in player._inventory)
        {
            if (player._inventory[item] > 0)
            {
                const div = document.createElement('div');
                div.className = 'stash-item'
                const img = document.createElement("img")
                img.src = `client/assets/items/${item}.png`
                img.className = "item-image"
                div.appendChild(img)

                const name = document.createElement('h3');
                name.innerHTML = player._inventory[item];    
                div.appendChild(name);
                stashList.appendChild(div);
            }
        }
        const upgButton = document.getElementById('upgrade-stash-button')
        upgButton.className = 'booster-button' // временно
        if (player._tokenBalance >= 1000){
            upgButton.disabled = false
        } else {
            upgButton.disabled = true
        }
        upgButton.addEventListener('click', () => {
            player.upgradeInventory()
            socketClient.send('invupgrade')
        });
    }
}
const shop = new Shop();
export default shop;
