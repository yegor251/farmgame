import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import socketClient from "../../init.js";

class Orders {
    constructor() {
        this.renderOrders();
        document.getElementById("closeOrders").onclick = () => {
            this.close()
        }
        document.getElementById("open-orders").onclick = () => {
            GVAR.closeAllWindows()
            document.getElementById("orders-wrap").style.display = "flex";
            this.chosenOrder = 'none'
            this._intervalId = setInterval(() => {
                this.showOrderDetails()
            }, 1000);
            this.renderOrders();
        }
        this.chosenOrder = 'none'
    }
    close(){
        this.chosenOrder = 'none'
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
            order.timeStamp = Math.floor(Date.now()/1000) + 150
            socketClient.send(`order/complete/${order.index}`)
            socketClient.send(`regen`)
            this.renderOrders();
            document.getElementById('order-details').innerHTML = "";
            console.log('now', Math.floor(Date.now()/1000))
        }
    }
    rerollOrder(order){
        order.timeStamp = Math.floor(Date.now()/1000) + 150
        socketClient.send(`order/reroll/${order.index}`)
        socketClient.send(`regen`)
        this.showTimer(order);
        this.renderOrders()
        console.log('now', Math.floor(Date.now()/1000), this._intervalId)
        document.getElementById('order-details').innerHTML = "";
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
    showTimer(order){
        const orderDetails = document.getElementById('order-details');
        orderDetails.innerHTML = "";
        const timer = document.createElement('h3')
        timer.className = 'drop-list-text'
        orderDetails.appendChild(timer)
        if (order.timeStamp > Math.floor(Date.now()/1000))
            timer.innerText = this._formatTime(order.timeStamp - Math.floor(Date.now()/1000))
        else
            this.showOrderDetails(order)
    }
    showOrderDetails() {
        console.log(this._intervalId)
        const order = this.chosenOrder
        if (order === 'none')
            return
        console.log(order.timeStamp , Math.floor(Date.now()/1000))
        if (order.timeStamp > Math.floor(Date.now()/1000)){
            this.showTimer(order)
            return
        }
        const orderDetails = document.getElementById('order-details');
        orderDetails.innerHTML = "";

        const orderPrice = document.createElement("h3");
        orderPrice.className = "order-price";
        orderPrice.innerText = `Cost: ${order.orderPrice}`;

        const orderRes = document.createElement("div");
        orderRes.className = "order-res";
        for (let item in order.orderItems) {
            const res = document.createElement("div");
            res.className = "res-wrap";
            // res.id = `res${item}`;

            const resImg = document.createElement("img");
            resImg.src = `client/assets/items/${item}.png`;
            resImg.className = "res-img";

            const amount = document.createElement("h3");
            amount.innerText = `${player._inventory[item]}/${order.orderItems[item]}`;
            amount.className = `${player._inventory[item] >= order.orderItems[item] ? "unlocked-item" : ""}`;

            res.appendChild(resImg);
            res.appendChild(amount);
            orderRes.appendChild(res);
        }

        const completeButton = document.createElement("button");
        completeButton.className = `complete-order ${this.verifyOrder(order) ? "unlocked" : ""}`;
        completeButton.innerText = "Complete";
        completeButton.onclick = () => {
            this.completeOrder(order);
        };

        const rerollButton = document.createElement("button");
        rerollButton.className = `complete-order ${this.verifyOrder(order) ? "unlocked" : ""}`;
        rerollButton.innerText = "reroll";
        rerollButton.onclick = () => {
            this.rerollOrder(order);
        };

        orderDetails.appendChild(orderPrice);
        orderDetails.appendChild(orderRes);
        orderDetails.appendChild(completeButton);
        orderDetails.appendChild(rerollButton);
    }
    renderOrders() {
        console.log(player._orderArr)
        const ordersList = document.getElementById('orders-list');
        ordersList.innerHTML = "";
        for (let i in player._orderArr) {
            const ord = player._orderArr[i];
            ord.index = i
            const order = document.createElement("div");
            order.className = "order";
            order.style.backgroundImage = `url(client/assets/pizdec/pizdec.png)`; // Устанавливаем фоновое изображение

            order.onclick = () => {
                this.chosenOrder = ord
                this.showOrderDetails();
            };

            ordersList.appendChild(order);
        }
    }
}

export const orderManager = new Orders();
