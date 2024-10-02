import GVAR from './globalVars/global.js';
import { canvas, ctx } from './globalVars/canvas.js';
import tiles from './globalVars/tiles.js';
import mouse from './gameClasses/controller/mouse.js';
import camera from './gameClasses/controller/camera.js';
import shop from './gameClasses/shop/shop.js';
import player from './gameClasses/player/player.js';
import { spin } from './gameClasses/spin/spin.js';
import { buisnessMenu } from './gameClasses/buisness/buisnessMenu.js';
import { orderManager } from './gameClasses/orders/orders.js';
import boosterMenu from './gameClasses/boosterMenu/boosterMenu.js';
import { transactionsMenu } from './gameClasses/transactionsMenu/transactionsMenu.js';
// import { dealmenu } from './gameClasses/ton-connect/tonMenu.js';
import { buildingMenu } from './gameClasses/building/buildingMenu.js';
import { animalMenu } from './gameClasses/animals/animalMenu.js';
import { fieldMenu } from './gameClasses/field/fieldMenu.js';
import CVAR from './globalVars/const.js';
import { bushMenu } from './gameClasses/bush/bushMenu.js';
import RES from './resources.js';


// import socketClient from './init.js';

// socketClient.send('buydeal/Deal_test_1')
// console.log(player._boostersArr)

tiles[1][5].createBuilding('small_swamp')
tiles[10][5].createBuilding('barn')

// Ensure the document is scrollable
function ensureDocumentIsScrollable() {
    const isScrollable =
        document.documentElement.scrollHeight > window.innerHeight;
    if (!isScrollable) {
        document.documentElement.style.setProperty(
            "height",
            "calc(100vh + 1px)",
            "important"
        );
    }
}

// Prevent window.scrollY from becoming zero
function preventCollapse(event) {
    if (window.scrollY === 0) {
        window.scrollTo(0, 1);
    }
}

window.addEventListener("load", ensureDocumentIsScrollable)

//      [WINDOW STUFF]
window.onresize = () => {
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    GVAR.rescale = true;
}

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

//      [GLOBAL VARS]
let prevdelta = 0.001;

//      [EVENTS]

let isScaling = false;
let singleTouchTimeout = null;
let singleTouchEndTimeout = null;
const SINGLE_TOUCH_DELAY = 50;

document.addEventListener('touchmove', (e) => {
    if (canvas === document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)) {
        if (e.touches.length == 1 && !isScaling) {
            mouse.onMouseMove(e);
        } else if (e.touches.length > 1) {
            mouse.moveBuildablePrevPos()
            clearTimeout(singleTouchTimeout);
            isScaling = true;
            mouse.onScale(e);
        }
    }
}, false);

canvas.addEventListener('touchstart', (e) => {
    preventCollapse(e);
    if (e.touches.length == 1) {
        singleTouchTimeout = setTimeout(() => {
            if (!isScaling) {
                mouse.onMouseDown(e);
            }
        }, SINGLE_TOUCH_DELAY);
    } else if (e.touches.length > 1) {
        mouse.moveBuildablePrevPos()
        isScaling = true;
        clearTimeout(singleTouchTimeout);
        mouse.onScaleStart(e);
    }
}, false);

document.addEventListener('touchend', (e) => {
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    const touchedElement = document.elementFromPoint(touchX, touchY);

    if (e.touches.length === 0) {
        if (isScaling)
            mouse.moveBuildablePrevPos()
        clearTimeout(singleTouchEndTimeout);
        singleTouchEndTimeout = setTimeout(() => {
            if (canvas === touchedElement && !isScaling) {
                mouse.onMouseUp(e);
            }
            isScaling = false;
        }, SINGLE_TOUCH_DELAY);
    }

}, false);

//      UPDATE  ALL 
function updateGrow() {    
    GVAR.buildableArr.forEach((el) => {
        const type = el._type
        if (type == 'garden' || RES.buildingNames.bush.includes(type)){
            el.update();
            GVAR.redraw = true;  
        }
    });
    
    if (fieldMenu.field != 'none')
        fieldMenu.renderTimer();
    if (bushMenu.bush != 'none')
        bushMenu.renderTimer();
    clearTimeout(growTimer);
    growTimer = setTimeout(updateGrow, 1000 / player._growBooster.boosterAmount);
}

let growTimer = setTimeout(updateGrow, 1000 / player._growBooster.boosterAmount);

function updateWork() {    
    GVAR.buildableArr.forEach((el) => {
        const type = el._type
        if (RES.buildingNames.bakery.includes(type) || RES.buildingNames.animalPen.includes(type)){
            el.update();
            GVAR.redraw = true;  
        }
    });
    
    if (buildingMenu.building != 'none')
        buildingMenu.renderQueue();
    if (animalMenu.animalPen != 'none')
        animalMenu.renderMenu();
    clearTimeout(workTimer);
    workTimer = setTimeout(updateWork, 1000 / player._workBooster.boosterAmount);
}

let workTimer = setTimeout(updateWork, 1000 / player._workBooster.boosterAmount);

setInterval(() => {
    player._activBoostersArr.forEach(booster => {
        booster.timeToEnd = (booster.timeStamp - Date.now() > 0 ? (booster.timeStamp - Date.now()) : 0);
        if (booster.timeToEnd == 0){
            console.log('test')
            booster.boosterAmount = 1
            booster.timeStamp = 0;
            player._activBoostersArr = player._activBoostersArr.filter(item => item !== booster);
        }
    });
}, 1000);

//      [ANIMATE]
let waterInd = 0;

setInterval(() => {
    GVAR.penArr.forEach((el) => {
        el.updateAnimal();
        GVAR.redraw = true;  
    })
}, 100);

setInterval(() => {
    GVAR.obstacleArr.forEach((el) => {
        el.changeImage()
    })
    GVAR.redraw = true;
    waterInd = (waterInd + 1) % 4
}, 1000);

async function animate(delta){    
    if (mouse._isOnBorder && !mouse._isBlockAfterShop){
        camera.newMove(mouse._dirX * 0.25 * GVAR.scale, mouse._dirY * 0.25 * GVAR.scale)
        let pos = {
            x: GVAR.phantomStructureArr[0]._floatX + mouse._dirX * 0.5,
            y: GVAR.phantomStructureArr[0]._floatY + mouse._dirY * 0.5
        }
        if (camera._cameraIndexBoundingBox.top == 0)
            pos.y = GVAR.phantomStructureArr[0]._floatY
        if (camera._cameraIndexBoundingBox.left == 0)
            pos.x = GVAR.phantomStructureArr[0]._floatX
        if (camera._cameraIndexBoundingBox.right == 40)
            pos.x = GVAR.phantomStructureArr[0]._floatX
        if (camera._cameraIndexBoundingBox.bottom == 40)
            pos.y = GVAR.phantomStructureArr[0]._floatY
        GVAR.phantomStructureArr[0].move(pos)
    }
    if (GVAR.redraw || mouse._isOnBorder)
    {
        GVAR.redraw = false;
        const pos = camera.getPos();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(-pos.x, -pos.y);
        ctx.scale(GVAR.scale, GVAR.scale);

        for (let i = -2; i < CVAR.tileCols + 3; i++) {
            const k = (i+2+waterInd)%4
            ctx.drawImage(RES.map.water[k], i * CVAR.tileSide, -20, CVAR.tileSide, CVAR.tileSide);
            ctx.drawImage(RES.map.water[k], i * CVAR.tileSide, -10, CVAR.tileSide, CVAR.tileSide);
            ctx.drawImage(RES.map.water[k], i * CVAR.tileSide, 0, CVAR.tileSide, CVAR.tileSide);

            ctx.drawImage(RES.map.water[k], i * CVAR.tileSide, CVAR.tileRows * CVAR.tileSide - 10, CVAR.tileSide, CVAR.tileSide);
            ctx.drawImage(RES.map.water[k], i * CVAR.tileSide, CVAR.tileRows * CVAR.tileSide + 0, CVAR.tileSide, CVAR.tileSide);
            ctx.drawImage(RES.map.water[k], i * CVAR.tileSide, CVAR.tileRows * CVAR.tileSide + 10, CVAR.tileSide, CVAR.tileSide);
        }
        for (let j = -2; j < CVAR.tileRows + 3; j++) {
            ctx.drawImage(RES.map.water[waterInd], -20, j * CVAR.tileSide, CVAR.tileSide, CVAR.tileSide);
            ctx.drawImage(RES.map.water[waterInd], -10, j * CVAR.tileSide, CVAR.tileSide, CVAR.tileSide);
            ctx.drawImage(RES.map.water[waterInd], 0, j * CVAR.tileSide, CVAR.tileSide, CVAR.tileSide);

            ctx.drawImage(RES.map.water[waterInd], CVAR.tileCols * CVAR.tileSide - 10, j * CVAR.tileSide, CVAR.tileSide, CVAR.tileSide);
            ctx.drawImage(RES.map.water[waterInd], CVAR.tileRows * CVAR.tileSide + 0, j * CVAR.tileSide, CVAR.tileSide, CVAR.tileSide);
            ctx.drawImage(RES.map.water[waterInd], CVAR.tileRows * CVAR.tileSide + 10, j * CVAR.tileSide, CVAR.tileSide, CVAR.tileSide);
        }

        const drawBoundingBox = camera.getBoundingBox();
        for (let i = drawBoundingBox.left; i < drawBoundingBox.right; i++)
        {
            for (let j = drawBoundingBox.top; j < drawBoundingBox.bottom; j++)
            {
                tiles[i][j].draw();
            }
        }

        GVAR.buildableArr.forEach((el) => {
            el.draw();
        })

        GVAR.phantomStructureArr.forEach((el) => {
            el.draw();
        })
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    prevdelta = delta
    requestAnimationFrame(animate);
}

animate()