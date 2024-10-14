import GVAR from "../../globalVars/global.js";
import player from "../player/player.js";
import socketClient from "../../init.js";
import Calc from "../../calc.js";

class Spin {
    constructor() {
        document.getElementById('spin-button').onclick = () => {
            if (!player._isSpinActivated){
                if (player.getInvFullness() >= player._spinItems[player._spinDropIndex].amount){
                    this.doSpin()
                    socketClient.send('spin')
                    socketClient.send('regen')
                    setTimeout(() => {
                        this.startTimer()
                        setTimeout(() => { //временно
                            this.renderSpin()
                        }, 1000);
                    }, 4000);
                } else{
                    GVAR.showFloatingText(3)
                }
            }
        }
        
        document.getElementById("closeSpin").onclick = () => {
            this.close()
        }
    }
    startTimer(){
        document.getElementById('spin-timer').innerText = Calc.formatTime(player._spinTimeStamp - Math.floor(Date.now() / 1000))
        this.interval = setInterval(() => {
            if (Math.floor(Date.now() / 1000) < player._spinTimeStamp){
                document.getElementById('spin-timer').innerText = Calc.formatTime(player._spinTimeStamp - Math.floor(Date.now() / 1000))
            } else {
                clearInterval(this.interval)
                this.interval = null
                document.getElementById('spin-timer').style.display = 'none'
                document.getElementById('spin-button').style.display = 'flex'
            }
        }, 1000);
    }
    open(){
        if (Math.floor(Date.now() / 1000) < player._spinTimeStamp){
            this.startTimer()
        }
        this.renderSpin();
        document.getElementById("spin-wrap").style.display = "flex";
    }
    close(){
        if (this.interval != null){
            clearInterval(this.interval)
        }
        this.interval = null
        document.getElementById("spin-wrap").style.display = "none";
    }
    doSpin(){
        const container = document.getElementById('spin-wheel');
        let number = Math.ceil(360 - (Math.random()*180/player._spinItems.length + player._spinDropIndex*360/player._spinItems.length) + 720);
        container.style.transform = `rotate(${number}deg)`;
        container.style.transform = `rotate(${number}deg)`;
        console.log(player._spinItems[player._spinDropIndex])
    }
    renderSpin(){
        console.log(this.interval, player._spinItems)
        const spin = document.getElementById('spin-wheel');
        spin.innerHTML = ""
        if (this.interval != null){
            document.getElementById('spin-button').style.display = 'none'
            return
        }
        document.getElementById('spin-button').style.display = 'flex'
        const size = player._spinItems.length
        for (let index = 0; index < size; index++) {
            const elem = document.createElement("div")
            elem.className = 'spin-elem'
            elem.style.transform = `rotate(${(index) * 360 / size}deg)`;

            const img = document.createElement("div")
            img.style.backgroundImage = `url(client/assets/items/${player._spinItems[index].item}.png)`
            img.className = "spin-image"
            const amount = document.createElement("h3")
            amount.className = "spin-text"
            amount.innerText = player._spinItems[index].amount
            elem.appendChild(img)
            elem.appendChild(amount)
            spin.appendChild(elem)
        }
    }
}
export const spin = new Spin();