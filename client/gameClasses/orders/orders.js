import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import socketClient from "../../init.js";
import CVAR from "../../globalVars/const.js";

class Orders {
    constructor() {
        this.renderOrders();
        document.getElementById("closeOrders").onclick = () => {
            this.close()
        }
        document.getElementById("open-orders").onclick = () => {
            GVAR.closeAllWindows()
            document.getElementById("orders-wrap").style.display = "flex";
            this.chosenOrderInd = 'none'
            this.clear()
            this._intervalId = setInterval(() => {
                if (this.chosenOrderInd != 'none'){
                    this.showOrderDetails()
                    this.renderOrders();
                }
            }, 1000);
            this.renderOrders();
        }
        this.chosenOrderInd = 'none'
    }
    clear(){
        document.getElementById('order-details').innerHTML = "";
        document.getElementById('order-buttons-bar').innerHTML = "";
        document.getElementById('order-money').innerHTML = "";
        document.getElementById('order-token').innerHTML = "";
    }
    close(){
        this.chosenOrderInd = 'none'
        clearInterval(this._intervalId)
        document.getElementById("orders-wrap").style.display = "none";
    }
    verifyOrder(order) {
        for (let item in order.orderItems) {
            if (order.orderItems[item] > player._inventory[item]) return false;
        }
        return true;
    }
    completeOrder(order) {
        if (this.verifyOrder(order)) {
            order.timeStamp = Math.floor(Date.now()/1000) + CVAR.orderCompleteTime
            socketClient.send(`order/complete/${order.index}`)
            socketClient.send(`regen`)
            this.showTimer(order);
            this.renderOrders();
            this.clear()
            console.log('now', Math.floor(Date.now()/1000))
        }
    }
    rerollOrder(order){
        order.timeStamp = Math.floor(Date.now()/1000) + CVAR.orderRerollTime
        socketClient.send(`order/reroll/${this.chosenOrderInd}`)
        socketClient.send(`regen`)
        this.showTimer(order);
        this.renderOrders()
        console.log('now', Math.floor(Date.now()/1000), this._intervalId)
        this.clear()
    }
    _formatTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = seconds % 60;
    
        let result = [];
        if (hours > 0) {
            result.push(hours + 'h');
        }
        if (minutes > 0) {
            result.push(minutes + 'm');
        }
        if (secs > 0 || (hours === 0 && minutes === 0 && secs === 0)) {
            result.push(secs + 's');
        }
        return result.join(' ');
    }
    showTimer(order){
        const orderDetails = document.getElementById('order-details');
        orderDetails.innerHTML = "";
        const timer = document.createElement('h3')
        timer.className = 'order-timer'
        orderDetails.appendChild(timer)
        if (order.timeStamp > Math.floor(Date.now()/1000))
            timer.innerText = this._formatTime(order.timeStamp - Math.floor(Date.now()/1000))
        else
            this.showOrderDetails(order)
    }
    showOrderDetails() {
        const order = player._orderArr[this.chosenOrderInd]
        if (order.timeStamp > Math.floor(Date.now()/1000)){
            this.showTimer(order)
            return
        }
        const orderDetails = document.getElementById('order-details');
        orderDetails.innerHTML = "";

        const orderPrice = document.getElementById('order-money');
        orderPrice.innerText = `Cost: ${order.orderPrice}`;

        const orderTokenPrice = document.getElementById('order-token');
        orderTokenPrice.innerText = `Cost: ${order.orderTokenPrice}`;

        for (let item in order.orderItems) {
            const res = document.createElement("div");
            res.className = "order-res";

            const resImg = document.createElement("div");
            resImg.style.backgroundImage = `url('client/assets/items/${item}.png')`;
            resImg.className = "order-res-img";

            const amount = document.createElement("h3");
            amount.innerText = `${player._inventory[item]}/${order.orderItems[item]}`;
            amount.className = 'order-res-amount'
            if (player._inventory[item] >= order.orderItems[item])
                amount.classList.add("unlocked")
            else
                amount.classList.add("locked")

            res.appendChild(resImg);
            res.appendChild(amount);
            orderDetails.appendChild(res);
        }

        const completeButton = document.createElement("div");
        completeButton.className = `complete-order`;
        if (this.verifyOrder(order))
            completeButton.onclick = () => {
                console.log(GVAR.confirmFlag)
                if (GVAR.confirmFlag)
                    this.completeOrder(order);
                else {
                    GVAR.setConfirm()
                    GVAR.showFloatingText('Нажмите ещё раз для подтверждения')
                }
            };
        else
            completeButton.style.filter = 'grayscale(100%)';

        const rerollButton = document.createElement("div");
        rerollButton.className = `reroll-order`;
        rerollButton.onclick = () => {
            console.log(GVAR.confirmFlag)
            if (GVAR.confirmFlag)
                this.rerollOrder(order);
            else {
                GVAR.setConfirm()
                console.log(GVAR.confirmFlag)
                GVAR.showFloatingText('Нажмите ещё раз для подтверждения')
            }
        };
        document.getElementById('order-buttons-bar').innerHTML = ''
        document.getElementById('order-buttons-bar').appendChild(completeButton)
        document.getElementById('order-buttons-bar').appendChild(rerollButton)
    }
    renderOrders() {
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = "";
        for (let i in player._orderArr) {
            const ord = player._orderArr[i];
            ord.index = i
            const order = document.createElement("div");
            order.className = "order";
            if (ord.timeStamp > Math.floor(Date.now()/1000))
                order.style.backgroundImage = `url(client/assets/design/order_wait${i % 3}.png)`;
            else
                order.style.backgroundImage = `url(client/assets/design/order${i % 3}.png)`;
            order.onclick = () => {
                GVAR.deleteConfirm()
                this.chosenOrderInd = i
                this.showOrderDetails();
            };

            ordersList.appendChild(order);
        }
    }
}

export const orderManager = new Orders();
