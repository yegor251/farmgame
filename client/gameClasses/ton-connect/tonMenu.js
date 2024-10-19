import socketClient from "../../init.js";
import player from "../player/player.js";

const tonweb = new window.TonWeb();

const WALLET_ADRESS = "UQAr2S7H-w148h9N97NI17bqSW8v9TLV8V7Scp60KiM4fewU";
const TELEGRAM_ID = "1770661619"

class PayMenu {
    constructor() {
        this.walletDisconnected();

        this.tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
            manifestUrl: 'https://www.jsonkeeper.com/b/TE7Z',
            buttonRootId: "ton-connect-button"
        });

        this.tonConnectUI.onStatusChange((wallet) => {
            if (wallet) {
                this.walletConnected();
            }
            else
            {
                this.walletDisconnected();
            }
        })

        document.getElementById('close-payments').onclick = () => {
            document.getElementById("payment-wrap").style.display = 'none';
            document.getElementById("main-menu-wrap").style.display = "flex";
        }
    }

    drawPayMenu() {
        document.getElementById("deals-wrap").style.display = "none";
        document.getElementById("payment-wrap").style.display = "flex";
    }

    walletConnected() {
        document.getElementById("ton-amount").style.display = "flex";
        document.getElementById("proceed-to-buy").style.display = "flex";
        document.getElementById("proceed-to-buy").onclick = async () => {
            const amount = parseInt(document.getElementById("ton-amount").value);
            await this.purchaseTon(amount);
        }
    }

    walletDisconnected() {
        document.getElementById("ton-amount").style.display = "none";
        document.getElementById("proceed-to-buy").style.display = "none";
    }

    async generatePayload(amount) {
        let a = new tonweb.boc.Cell();
        a.bits.writeUint(0, 32);
        a.bits.writeString(`${amount}`);
        let payload = tonweb.utils.bytesToBase64(await a.toBoc());
        return payload
    }

    async purchaseTon(amount) {

        // VERIFY AMOUNT PLS

        var payload = await this.generatePayload(TELEGRAM_ID);

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
            messages: [
                {
                    address: WALLET_ADRESS,
                    amount: `${amount}`,
                    payload: `${payload}`
                }
            ]
        }
        
        try {
            const result = await this.tonConnectUI.sendTransaction(transaction);
            const someTxData = await myAppExplorerService.getTransaction(result.boc);
            console.log('Transaction successful:', someTxData);
        } catch (e) {
            console.error('Transaction failed:', e);
        }
    }
}

const pm = new PayMenu();

class DealsMenu
{
    constructor() {
        document.getElementById("open-deals").onclick = () => {
            document.getElementById("deals-wrap").style.display = 'flex';
        }

        document.getElementById("close-deals").onclick = () => {
            document.getElementById("deals-wrap").style.display = "none";
        }

        document.getElementById("buy-usdt").onclick = () => {
            document.getElementById("deals-wrap").style.display = "none";
            pm.drawPayMenu();
        }

        document.getElementById("buy-ton").onclick = () => {
            document.getElementById("deals-wrap").style.display = "none";
            pm.drawPayMenu();
        }

        this.drawDealsMenu();
    }

    drawDealsMenu() {
        const dealsWrap = document.getElementById("deals-list");

        for (const dealKey in player._availableDeals) {
            const deal = player._availableDeals[dealKey];
    
            const dealDiv = document.createElement("div");
            dealDiv.className = "deal";
                
            let dealContent = `
                <h3>${deal.name}</h3>
                ${deal.tonPrice ? `<div class="deal-price">Price: ${deal.tonPrice} TON</div>` : ''}
                ${deal.usdtPrice ? `<div class="deal-price">Price: ${deal.usdtPrice} USDT</div>` : ''}
                <div class="deal-token">Token: ${deal.reward.token}</div>
                <h4>Boosters:</h4>
                <ul class="booster-list">`;
    
            for (const booster of deal.reward.boosters) {
                dealContent += `
                    <li>
                        <span>Type: ${booster.boosterType}</span>, 
                        <span>Percentage: ${booster.percentage}%</span>, 
                        <span>Time: ${booster.time}s</span>
                    </li>`;
            }
    
            dealContent += `</ul>`;
    
            // Вставляем содержимое в dealDiv
            dealDiv.innerHTML = dealContent;
    
            const canAfford = (deal.tonPrice && player._tonBalance >= deal.tonPrice) ||
                              (deal.usdtPrice && player._usdtBalance >= deal.usdtPrice);
            // Создание кнопки через createElement
            const buyButton = document.createElement("button");
            buyButton.className = "deal-button";
            buyButton.textContent = "Купить";
            buyButton.disabled = !canAfford;  // Активность кнопки зависит от canAfford
            buyButton.onclick = () => {
                socketClient.send(`buydeal/${dealKey}`)
                socketClient.send(`regen`)
            }
            // Добавление кнопки в dealDiv
            dealDiv.appendChild(buyButton);
    
            // Добавление блока сделки в dealsWrap
            dealsWrap.appendChild(dealDiv);
        }
    }    
    
}

export const dealmenu = new DealsMenu();