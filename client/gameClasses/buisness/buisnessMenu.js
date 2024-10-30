import Calc from "../../calc.js";
import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import socketClient from "../../init.js";

const levelMultiplier = 1.2;
const nextMultiplier = 1.33;
const maxLevel = 3;
const investmentLockTime = 30;

const businessesProperties = [
    {cost: 52500, income: 0.2625, maxCapacity: 200000}
]
for (let i = 0; i < 4; i++) {
    businessesProperties.push({
        cost: businessesProperties[i].cost * levelMultiplier * levelMultiplier * nextMultiplier,
        maxCapacity: businessesProperties[i].maxCapacity * levelMultiplier * levelMultiplier,
        income: businessesProperties[i].income * levelMultiplier * levelMultiplier * nextMultiplier,
    })
}

class BuisnessMenu{
    constructor() {
        document.getElementById("close-buisness-menu").onclick = () => {
            document.getElementById("buisness-menu-wrap").style.display = "none";
            document.getElementById("main-menu-wrap").style.display = "flex";
        }
        document.getElementById("open-buisness").onclick = () => {
            this.show();
        }
        document.getElementById('buisness-arrow1').onclick = () => {
            if (this.currBusiness == 1)
                document.getElementById('buisness-arrow1').style.display = 'none';
            document.getElementById('buisness-arrow2').style.display = 'flex';
            this.currBusiness -= 1
            this.renderMenu()
        }
        document.getElementById('buisness-arrow2').onclick = () => {
            if (this.currBusiness == 3)
                document.getElementById('buisness-arrow2').style.display = 'none';
            document.getElementById('buisness-arrow1').style.display = 'flex';
            this.currBusiness += 1
            this.renderMenu()
        }
        this.currBusiness = 0
        document.getElementById('buisness-arrow1').style.display = 'none';
        document.getElementsByClassName("buisness_slot")[0].onclick = () => {
            if (!player._buisnesses[this.currBusiness]) {
                if (businessesProperties[this.currBusiness].cost <= player._tokenBalance){
                    const text = GVAR.localization[51][GVAR.language].replace(
                    /\{/g, GVAR.localization[`b${this.currBusiness}`][GVAR.language]).replace(
                    /\}/g, (businessesProperties[this.currBusiness].cost / 100).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
                    document.getElementById("buisness-buy-text").innerText = text
                    document.getElementById("buisness-buy-wrap").style.display = "flex"
                } else {
                    GVAR.showFloatingText(2)
                }
            } else {
                this.openBusiness()
            }
        }
        document.getElementById("open-buisness-button").onclick = () => {
            if (!player._buisnesses[this.currBusiness]) {
                if (businessesProperties[this.currBusiness].cost <= player._tokenBalance){
                    const text = GVAR.localization[51][GVAR.language].replace(
                    /\{/g, GVAR.localization[`b${this.currBusiness}`][GVAR.language]).replace(
                    /\}/g, (businessesProperties[this.currBusiness].cost / 100).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
                    document.getElementById("buisness-buy-text").innerText = text
                    document.getElementById("buisness-buy-wrap").style.display = "flex"
                } else {
                    GVAR.showFloatingText(2)
                }
            } else {
                this.openBusiness()
            }
        }
        document.getElementById("buisness-yes").onclick = () => {
            socketClient.send(`business/buy/${this.currBusiness}/0`);
            player._buisnesses[this.currBusiness] = {lvl: 0}
            player.spendToken(Math.trunc(businessesProperties[this.currBusiness].cost))
            businessesProperties[this.currBusiness].cost *= levelMultiplier
            businessesProperties[this.currBusiness].maxCapacity *= levelMultiplier
            document.getElementById("buisness-buy-wrap").style.display = "none"
            GVAR.showFloatingText(7)
            this.renderMenu()
        }
        document.getElementById("buisness-no").onclick = () => {
            document.getElementById("buisness-buy-wrap").style.display = "none"
        }
        document.getElementById("close-buisness-properties").onclick = () => {
            this.closeBuisnessProp()
        }
        document.getElementById("buisness-claim-button").onclick = () => {
            socketClient.send(`business/collect/${this.currBusiness}/0`)
            player.addToken(player._buisnesses[this.currBusiness].activateData[1] * (1 + businessesProperties[this.currBusiness].income))
            player._buisnesses[this.currBusiness].activateData = undefined
            this.closeBuisnessProp()
            GVAR.showFloatingText(7)
        }
        document.getElementById("buisness-question").onclick = () => {
            document.getElementById("buisness-question-wrap").style.display = "flex"
        }
        document.getElementById("buisness-question-text").innerText = GVAR.localization[52][GVAR.language]
        document.getElementById("buisness-question-close").onclick = () => {
            document.getElementById("buisness-question-wrap").style.display = "none"
        }
        document.getElementById("buisness-upgarde-button").onclick = () => {
            if (player._buisnesses[this.currBusiness].lvl < 2) {
                socketClient.send(`business/upgrade/${this.currBusiness}/0`)
                player.spendToken(Math.trunc(businessesProperties[this.currBusiness].cost))
                player._buisnesses[this.currBusiness].lvl += 1
                businessesProperties[this.currBusiness].cost *= levelMultiplier
                businessesProperties[this.currBusiness].income *= levelMultiplier
                businessesProperties[this.currBusiness].maxCapacity *= levelMultiplier
                this.closeBuisnessProp()
                this.openBusiness()
            }
        }
        document.getElementById("buisness-start-button").onclick = () => {
            if (!player._buisnesses[this.currBusiness].activateData) {
                if (player._tokenBalance >= document.getElementById('business_invest').value * 100 || document.getElementById('business_invest').value == 0){
                    socketClient.send(`business/activate/${this.currBusiness}/${document.getElementById('business_invest').value * 100}`)
                    player._buisnesses[this.currBusiness].activateData = [Math.floor(Date.now() / 1000), document.getElementById('business_invest').value * 100]
                    player.spendToken(document.getElementById('business_invest').value * 100)
                    this.closeBuisnessProp()
                    this.openBusiness()
                } else {
                    GVAR.showFloatingText(2)
                }
            }
        }
        document.getElementById('business_invest').oninput = () =>  {
            document.getElementById('business_invest_sum').innerText = document.getElementById('business_invest').value
            document.getElementById('buisness-inactive-income').innerText = GVAR.localization[60][GVAR.language] + (document.getElementById('business_invest').value * businessesProperties[this.currBusiness].income).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        }     
        document.getElementById('buisness-properties-wrap').onclick = (event) => {
            if (event.target === event.currentTarget) {
                this.closeBuisnessProp()
            }
        };
          
    }
    closeBuisnessProp(){
        document.getElementById("buisness-properties-wrap").style.display = "none"
        document.getElementById("buisness-active").style.display = 'none'
        document.getElementById("buisness-inactive").style.display = 'none'
        clearInterval(this.interval);
        this.interval = null
    }
    init(){
        for (let i = 0; i < 5; i++) {
            if (player._buisnesses[i]) {
                businessesProperties[i].cost *= Math.pow(levelMultiplier, player._buisnesses[i].lvl)
                businessesProperties[i].maxCapacity *= Math.pow(levelMultiplier, player._buisnesses[i].lvl)
            }
        }
    }
    show(){
        GVAR.closeAllWindows();
        this.renderMenu();
        document.getElementById("buisness-menu-wrap").style.display = "flex";
        document.getElementById('business_invest').value = 10
    }
    close(){
        document.getElementById("buisness-menu-wrap").style.display = "none";
        document.getElementById("main-menu-wrap").style.display = "flex";
    }
    renderMenu(){
        const img = document.getElementById("buisness_slot_img");
        img.style.backgroundImage = `url(client/assets/buisnesses/b${this.currBusiness}.png)`
        document.getElementById('buisness-name').innerText = GVAR.localization[`b${this.currBusiness}`][GVAR.language]
        if (!player._buisnesses[this.currBusiness]){
            document.getElementById("open-buisness-button").style.display = 'none'
            img.style.filter = 'grayscale(100%)';
            document.getElementById("buisness_slot_lock").style.display = 'flex'
            document.getElementById("buisness-price").innerText = (businessesProperties[this.currBusiness].cost / 100).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        } else {
            document.getElementById("open-buisness-button").style.display = 'flex'
            img.style.filter = 'grayscale(0%)';
            document.getElementById("buisness_slot_lock").style.display = 'none'
            document.getElementById("buisness-price").innerText = ''
        }
        document.getElementById("business_invest").max = Math.min(Math.trunc(player._tokenBalance / 100), Math.trunc(businessesProperties[this.currBusiness].maxCapacity / 100))
    }
    openBusiness() {
        document.getElementById("buisness-properties-wrap").style.display = "flex"
        document.getElementById("buisness-claim-button").style.display = "none"
        if (player._buisnesses[this.currBusiness].activateData) {
            document.getElementById("buisness-active").style.display = 'flex'
            document.getElementById("buisness-active-name").innerText = GVAR.localization[`b${this.currBusiness}`][GVAR.language]
            document.getElementById("buisness-active-deposited").innerText = GVAR.localization[58][GVAR.language] + (player._buisnesses[this.currBusiness].activateData[1] / 100).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
            document.getElementById("buisness-active-earning").innerText = GVAR.localization[59][GVAR.language].replace(/\{/g, (player._buisnesses[this.currBusiness].activateData[1] * businessesProperties[this.currBusiness].income / 100).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0])
            document.getElementById("buisness-active-level").innerText = GVAR.localization[55][GVAR.language] + (player._buisnesses[this.currBusiness].lvl + 1)
            document.getElementById("buisness-claim-button-text").innerText = GVAR.localization[12][GVAR.language]
            this.startTimer()
        } else {
            document.getElementById("buisness-inactive").style.display = 'flex'
            document.getElementById("buisness-inactive-name").innerText = GVAR.localization[`b${this.currBusiness}`][GVAR.language]
            document.getElementById("buisness-inactive-capacity").innerText = GVAR.localization[53][GVAR.language] + Math.trunc(businessesProperties[this.currBusiness].maxCapacity / 1000) * 10
            document.getElementById("buisness-inactive-level").innerText = GVAR.localization[55][GVAR.language] + (player._buisnesses[this.currBusiness].lvl + 1)
            document.getElementById("buisness-inactive-upgrade-price").innerText = GVAR.localization[56][GVAR.language] + (businessesProperties[this.currBusiness].cost / 100).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
            document.getElementById("buisness-upgarde-button-text").innerText = GVAR.localization[8][GVAR.language]
            document.getElementById("buisness-start-button-text").innerText = GVAR.localization[57][GVAR.language]
            document.getElementById("b-deposit-text").innerText = GVAR.localization[54][GVAR.language]
            document.getElementById('buisness-inactive-income').innerText = GVAR.localization[60][GVAR.language] + (document.getElementById('business_invest').value * businessesProperties[this.currBusiness].income).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
            document.getElementById("buisness-inactive-upgrade-price").style.display = "flex"
            document.getElementById("buisness-upgarde-button").style.display = "flex"
            if (player._buisnesses[this.currBusiness].lvl == 2){
                document.getElementById("buisness-inactive-upgrade-price").style.display = "none"
                document.getElementById("buisness-upgarde-button").style.display = "none"
            }
        }
    }
    startTimer(){
        const time = Math.floor(Date.now() / 1000) > player._buisnesses[this.currBusiness].activateData[0] + investmentLockTime ? 0 : player._buisnesses[this.currBusiness].activateData[0] + investmentLockTime - Math.floor(Date.now() / 1000)
        document.getElementById("buisness-active-time").innerText = Calc.formatTime(time)
        if (time == 0)
            document.getElementById("buisness-claim-button").style.display = "flex"
        this.interval = setInterval(() => {
            const time = Math.floor(Date.now() / 1000) > player._buisnesses[this.currBusiness].activateData[0] + investmentLockTime ?
            0 : player._buisnesses[this.currBusiness].activateData[0] + investmentLockTime - Math.floor(Date.now() / 1000)
            
            document.getElementById("buisness-active-time").innerText = Calc.formatTime(time)
            if (time == 0)
                document.getElementById("buisness-claim-button").style.display = "flex"
        }, 1000);
    }
}

export const buisnessMenu = new BuisnessMenu();
