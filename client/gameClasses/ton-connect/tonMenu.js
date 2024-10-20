import CVAR from "../../globalVars/const.js";
import GVAR from "../../globalVars/global.js";
import socketClient from "../../init.js";
import player from "../player/player.js";

const tonweb = new window.TonWeb();

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
        document.getElementById("adress-copy-div").addEventListener("click", function() {
            GVAR.showFloatingText(22);
            navigator.clipboard.writeText(CVAR.wallet).then(() => {
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        });
        document.getElementById("memo-copy-div").addEventListener("click", function() {
            GVAR.showFloatingText(22);
            navigator.clipboard.writeText(GVAR.tg_id).then(() => {
            }).catch(err => {
                console.error("Failed to copy text: ", err);
            });
        });
    }
    drawPayMenu() {
        document.getElementById("payment-wrap").style.display = "flex";
        document.getElementById("manual-pay-text").innerText = GVAR.localization[16][GVAR.language];
        document.getElementById("adress-text").innerText = CVAR.wallet;
        document.querySelectorAll('.tap-to-copy').forEach(text => {
            text.innerText = GVAR.localization[17][GVAR.language];
        });
        document.getElementById("memo-warning-text").innerText = GVAR.localization[18][GVAR.language];
        document.getElementById("memo-text").innerText = GVAR.tg_id;
        document.getElementById("or-text").innerText = GVAR.localization[19][GVAR.language];
        document.getElementById("payment-ton-text").innerText = GVAR.localization[20][GVAR.language];
        document.getElementById("deposit-text").innerText = GVAR.localization[21][GVAR.language];
    }
    walletConnected() {
        document.getElementById("ton-amount").style.display = "flex";
        document.getElementById("proceed-to-buy").style.display = "flex";
        document.getElementById("proceed-to-buy").onclick = async () => {
            const s = document.getElementById("ton-amount").value;
            if (!isNaN(parseFloat(s)) && isFinite(s) && parseFloat(s) > 0) {
                const amount = Math.trunc(parseFloat(s) * 1000000000);
                await this.purchaseTon(amount);
            } else {
                GVAR.showFloatingText(23);
            }
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
        var payload = await this.generatePayload(GVAR.tg_id);

        const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 120, // 120 sec
            messages: [
                {
                    address: CVAR.wallet,
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

export const pm = new PayMenu();

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