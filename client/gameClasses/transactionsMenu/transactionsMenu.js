import player from "../player/player.js";
import socketClient from "../../init.js";

class TransactionsMenu {
    constructor() {
        this.depositButton = document.getElementById("deposits-button");
        this.withdrawButton = document.getElementById("withdraws-button");
        this.depositContainer = document.getElementById("transaction-deposits-list");
        this.withdrawContainer = document.getElementById("transaction-withdraws-list");
        this.closeButton = document.getElementById("closeTransaction");

        this.depositButton.onclick = () => this.showDeposits();
        this.withdrawButton.onclick = () => this.showWithdraws();
        this.closeButton.onclick = () => this.closeMenu();
        document.getElementById('open-transactions').onclick = () => {
            document.getElementById('transaction-wrap').style.display = 'flex'
        }
        this.showDeposits();
    }

    showDeposits() {
        this.clearContainers();
        player._deposits.forEach((deposit, index) => {
            const item = document.createElement("div");
            item.classList.add("transaction-item");

            const acceptButton = document.createElement("button");
            acceptButton.innerText = "Принять";
            acceptButton.disabled = !deposit.active;
            acceptButton.onclick = () => {
                deposit.active = false
                socketClient.send(`claim/${index}`)
                socketClient.send('regen')
                this.showDeposits()
            }
            item.appendChild(acceptButton);

            const info = document.createElement("div");
            info.classList.add("transaction-info");
            info.innerHTML = `
                <p>Сумма: ${deposit.amount}</p>
                <p>Время: ${new Date(deposit.time_stamp * 1000).toLocaleString()}</p>
                <p>Валюта: ${deposit.jetton_signature}</p>
            `;
            item.appendChild(info);

            this.depositContainer.appendChild(item);
        });
        this.depositContainer.style.display = "block";
    }

    showWithdraws() {
        this.clearContainers();
        player._withdraws.forEach(withdraw => {
            const item = document.createElement("div");
            item.classList.add("transaction-item");

            const info = document.createElement("div");
            info.classList.add("transaction-info");
            info.innerHTML = `
                <p>Сумма: ${withdraw.amount}</p>
                <p>Кошелек: ${withdraw.wallet}</p>
                <p>Время: ${new Date(withdraw.time_stamp).toLocaleString()}</p>
            `;
            item.appendChild(info);

            this.withdrawContainer.appendChild(item);
        });
        this.withdrawContainer.style.display = "block";
    }

    clearContainers() {
        this.depositContainer.style.display = "none";
        this.withdrawContainer.style.display = "none";
        this.depositContainer.innerHTML = "";
        this.withdrawContainer.innerHTML = "";
    }

    closeMenu() {
        document.getElementById('transaction-wrap').style.display = 'none';
    }
}

export const transactionsMenu = new TransactionsMenu();