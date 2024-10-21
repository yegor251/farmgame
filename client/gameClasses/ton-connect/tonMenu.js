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
                console.log(amount)
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
            GVAR.closeAllWindows();
            document.getElementById("deals-wrap").style.display = 'flex';
            this.drawDealsMenu();
        }

        document.getElementById("close-deals").onclick = () => {
            document.getElementById("deals-wrap").style.display = "none";
            document.getElementById("main-menu-wrap").style.display = "flex";
        }
    }
    drawDealsMenu() {
        document.getElementById('deal-ton-balance').innerText = (player._tonBalance / 1000000000).toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
        document.getElementById('deal-usdt-balance').innerText = (player._usdtBalance / 1000000).toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
        const dealsWrap = document.getElementById("deals-list");
        dealsWrap.innerHTML = ''
        if (Object.keys(player._availableDeals).length === 0){
            const text = document.createElement('h3');
            text.className = 'deal-empty-text'
            text.innerText = GVAR.localization[14][GVAR.language];
            dealsWrap.appendChild(text)
        }
        const menu = this
        for (const dealKey in player._availableDeals) {
            const deal = player._availableDeals[dealKey];
            
            const dealImg = document.createElement('div')
            dealImg.className = 'deal'
            dealImg.style.backgroundImage = `url(client/assets/deals/${dealKey}.png)`
            
            dealImg.onclick = () => {
                if (GVAR.confirmFlag){
                    const canBuy = (deal.tonPrice && player._tonBalance >= deal.tonPrice) ||
                     (deal.usdtPrice && player._usdtBalance >= deal.usdtPrice);
                    console.log(player._usdtBalance, deal.usdtPrice)
                    if (canBuy){
                        socketClient.send(`buydeal/${dealKey}`)
                        socketClient.send(`regen`)
                        if (deal.tonPrice)
                            player._tonBalance -= deal.tonPrice
                        else {
                            player._usdtBalance -= deal.usdtPrice
                        }
                        console.log(dealKey)
                        delete player._availableDeals[dealKey];
                        console.log(player._availableDeals)
                        GVAR.showFloatingText(7)
                        menu.drawDealsMenu()
                    } else {
                        GVAR.showFloatingText(2)
                    }
                } else {
                    GVAR.setConfirm()
                    GVAR.showFloatingText(4)
                }
            }
            dealsWrap.appendChild(dealImg);
        }
    }
}

export const dealmenu = new DealsMenu();

class WithdrawMenu
{
    constructor() {
        document.getElementById("close-withdraw-menu").onclick = () => {
            document.getElementById("withdraw-menu-wrap").style.display = "none";
            document.getElementById("main-menu-wrap").style.display = "flex";
        }

        function isValidTonAddress(address) {
            try {
                const decodedAddress = new tonweb.utils.Address(address);
                return true;
            } catch (error) {
                return false;
            }
        }

        document.getElementById('confirm-withdraw').onclick = () => {
            const wallet = document.getElementById('withdraw-adress').value
            if (isValidTonAddress(wallet)){
                let flag = true
                let amount = 0;
                try {
                    amount = Math.trunc(parseFloat(document.getElementById('withdraw-amount').value)*100)
                    if (amount <=0){
                        flag = false
                    }
                } catch (error) {
                    flag = false
                }
                if (flag && amount) {
                    if (amount > 0 && amount <= player._tokenBalance){
                        if (player._tonBalance >= CVAR.transactionFee){
                            socketClient.send(`widthdraw/${amount}/${wallet}`)
                            GVAR.showFloatingText(7)
                            player._tonBalance -= CVAR.transactionFee
                            player._tokenBalance -= amount
                        } else {
                            GVAR.showFloatingText(29);
                        }
                    } else {
                        GVAR.showFloatingText(2);
                    }
                } else {
                    GVAR.showFloatingText(23);
                }
            } else {
                GVAR.showFloatingText(28);
            }
        }

    }
    show() {
        GVAR.closeAllWindows();
        document.getElementById("withdraw-menu-wrap").style.display = "flex";
        this.drawMenu();
    }
    drawMenu() {
        document.getElementById('withdraw-ton-balance').innerText = (player._tonBalance / 1000000000).toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
        document.getElementById('withdraw-token-balance').innerText = (player._tokenBalance / 100).toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
        document.getElementById('withdraw-rule').innerText = GVAR.localization[24][GVAR.language]
        document.getElementById('withdraw-adress-text').innerText = GVAR.localization[25][GVAR.language]
        document.getElementById('withdraw-amount-text').innerText = GVAR.localization[26][GVAR.language]
        document.getElementById('confirm-withdraw-text').innerText = GVAR.localization[27][GVAR.language]
    }    
}

export const withdraw = new WithdrawMenu();