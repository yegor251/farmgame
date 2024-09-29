import GVAR from "../../globalVars/global.js";
import player from "../player/player.js";
import socketClient from "../../init.js";

class Spin {
    constructor() {
        document.getElementById('spin-button').onclick = () => {
            if (!player._isSpinActivated){
                if (player.getInvFullness() >= player._spinItems[player._spinDropIndex].amount){
                    this.doSpin()
                    socketClient.send('spin')
                } else{
                    console.log('Недостаточно места в инвентаре')
                }
            } else{
                console.log('Спин не активен')
            }
        }
        
        document.getElementById("closeSpin").onclick = () => {
            document.getElementById("spin-wrap").style.display = "none";
        }
        document.getElementById("open-spin").onclick = () => {
            GVAR.closeAllWindows()
            this.open()
        }
    }
    open(){
        this.renderSpin();
        document.getElementById("spin-wrap").style.display = "flex";
    }
    doSpin(){
        const container = document.getElementById('spin-container');
        let number = Math.ceil(360 - (Math.random()*180/player._spinItems.length + player._spinDropIndex*360/player._spinItems.length) + 360);
        container.style.transform = `rotate(${number}deg)`;
        container.style.transform = `rotate(${number}deg)`;
        console.log(player._spinItems[player._spinDropIndex])
        player.pushInventory(player._spinItems[player._spinDropIndex].item,player._spinItems[player._spinDropIndex].amount)
    }
    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    renderSpin(){
        const spin = document.getElementById('spin-container');
        spin.innerHTML = ""
        const size = player._spinItems.length
        let h = 150; // половина ширины рулетки (радиус)
        for (let index = 0; index < size; index++) {
            const elem = document.createElement("div")
            elem.style.backgroundColor = this.getRandomColor();
            elem.style.height = "50%";
            elem.style.width = `${h*Math.sqrt(2-2*Math.cos(2*Math.PI/size))/Math.cos(Math.PI/size)}px`;
            elem.style.position = "absolute";
            elem.style.clipPath = "polygon(100% 0, 50% 100%, 0 0)";
            elem.style.transformOrigin = "bottom";
            elem.style.textAlign = "center";
            elem.style.display = "flex";
            elem.style.alignItems = "center";
            elem.style.left = "63px"; // подбор
            elem.style.transform = `rotate(${(index) * 360 / size}deg)`;

            const img = document.createElement("img")
            img.src = `client/assets/items/${player._spinItems[index].item}.png`
            img.className = "spin-image"
            const amount = document.createElement("h3")
            amount.className = "spin-text"
            amount.innerText = player._spinItems[index].amount
            elem.appendChild(amount)
            elem.appendChild(img)
            spin.appendChild(elem)
        }
    }
}
export const spin = new Spin();