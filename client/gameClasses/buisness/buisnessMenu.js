import Calc from "../../calc.js";
import player from "../player/player.js";
import businesses from "./buisnesses.js";
import GVAR from "../../globalVars/global.js";

const levelMultiplier = 1.2;  // Коэффициент уровня
const maxLevel = 3;  // Максимальное количество уровней
const investmentLockTime = 10000; // Время блокировки инвестирования

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
            if (this.currBusiness == 2)
                document.getElementById('buisness-arrow1').style.display = 'none';
            document.getElementById('buisness-arrow2').style.display = 'flex';
            this.currBusiness -= 1
            this.renderMenu()
        }
        document.getElementById('buisness-arrow2').onclick = () => {
            if (this.currBusiness == 4)
                document.getElementById('buisness-arrow2').style.display = 'none';
            document.getElementById('buisness-arrow1').style.display = 'flex';
            this.currBusiness += 1
            this.renderMenu()
        }
        this.currBusiness = 1
    }
    show(){
        this.interval = setInterval(() => this.updateTimers(), 1000);
        GVAR.closeAllWindows();
        this.renderMenu();
        document.getElementById("buisness-menu-wrap").style.display = "flex";
    }
    close(){
        clearInterval(this.interval);
        document.getElementById("buisness-menu-wrap").style.display = "none";
        document.getElementById("main-menu-wrap").style.display = "flex";
    }
    renderMenu(){
        const img = document.getElementById("buisness_slot_img");
        img.style.backgroundImage = `client/buisnesses/buisness${this.currBusiness}.png`
    }
    openBusiness(index) {
        const business = businesses[index-1];
        
        if (!business.unlocked) {
            if (player._tokenBalance >= business.cost) {
                player._tokenBalance -= business.cost;
                business.unlocked = true;
                this.updateMoneyDisplay();
                document.getElementById(`business${index}`).classList.remove("locked");
            } else {
                alert("Недостаточно денег для разблокировки бизнеса.");
                return;
            }
        }
    
        this.currBusiness = business;
        document.getElementById("business-title").innerText = `Бизнес ${index}`;
        document.getElementById("level").innerText = this.currBusiness.level;
        document.getElementById("invested").innerText = this.currBusiness.invested;
        document.getElementById("max-capacity").innerText = this.currBusiness.maxCapacity - this.currBusiness.invested;
        this.updateLevelUpCost();
        document.getElementById("business-modal").style.display = "block";
    
        // Обновление состояния кнопок в зависимости от того, идет ли таймер
        this.updateButtonStates();
    
        if (!this.currBusiness.canInvest) {
            const timeLeft = Math.ceil((this.currBusiness.investmentEndTime - Date.now()) / 1000);
            document.getElementById("timer").innerText = Calc.formatTime(timeLeft);
        } else {
            document.getElementById("timer").innerText = "";
        }
    }
    claim() {
        console.log('claim')
        if (this.currBusiness && this.currBusiness.canClaim) {
            player._tokenBalance += this.currBusiness.invested * this.currBusiness.income;
            player._tokenBalance += this.currBusiness.invested;
            this.currBusiness.invested = 0
            this.currBusiness.canInvest = true;
            this.currBusiness.timeToEnd = undefined;
            this.currBusiness.investmentTimeStamp = undefined;
            this.currBusiness.canClaim = false
            this.updateMoneyDisplay();
            document.getElementById("timer").innerText = "";
            this.updateButtonStates();
        }
    }
    investMoney() {
        const amount = parseFloat(document.getElementById("investment-amount").value);
        const maxInvestable = this.currBusiness.maxCapacity - this.currBusiness.invested;
    
        if (this.currBusiness && player._tokenBalance >= amount && this.currBusiness.canInvest) {
            if (amount > maxInvestable) {
                alert("Превышена максимальная вместимость для инвестиций.");
                return;
            }
    
            player._tokenBalance -= amount;
            this.currBusiness.invested += amount;
            this.currBusiness.canInvest = false;
            this.currBusiness.canClaim = false
            this.currBusiness.investmentTimeStamp = Date.now() + investmentLockTime
            this.currBusiness.timeToEnd = investmentLockTime / 1000
            this.updateMoneyDisplay();
            document.getElementById("invested").innerText = this.currBusiness.invested;
    
            this.updateButtonStates();
        } else {
            alert("Недостаточно денег.");
        }
    }
    updateButtonStates() {
        const disabled = !this.currBusiness.canInvest;
        document.getElementById("invest-button").disabled = !this.currBusiness.canInvest || this.currBusiness.canClaim;
        document.getElementById("collect-button").disabled = !this.currBusiness.canClaim;
        document.getElementById("level-up-button").disabled = this.currBusiness.level == maxLevel ? false : !this.currBusiness.canInvest || this.currBusiness.canClaim;
        document.getElementById("timer").innerText = this.currBusiness.timeToEnd ? `До конца инвестирования: ${Math.ceil(this.currBusiness.timeToEnd / 1000)} сек.` : '';
    }
    levelUp() {
        const levelUpCost = this.currBusiness.cost * levelMultiplier;
    
        if (this.currBusiness.level < maxLevel && player._tokenBalance >= levelUpCost) {
            player._tokenBalance -= levelUpCost;
            this.currBusiness.level++;
            this.currBusiness.cost *= levelMultiplier;
            this.currBusiness.income *= levelMultiplier;
            this.currBusiness.maxCapacity *= levelMultiplier;
            this.updateMoneyDisplay();
            document.getElementById("level").innerText = this.currBusiness.level;
            this.updateLevelUpCost();
        } else {
            alert("Недостаточно денег для повышения уровня или достигнут максимальный уровень.");
        }
    }
    updateLevelUpCost() {
        if (this.currBusiness.level < maxLevel) {
            const nextLevelCost = this.currBusiness.cost * levelMultiplier;
            document.getElementById("level-up-cost").innerText = nextLevelCost.toFixed(2);
        } else {
            document.getElementById("level-up-cost").innerText = "Максимальный уровень";
        }
    }
    updateTimers() {
        businesses.forEach((business) => {
            business.update()
        });
        if (this.currBusiness){
            this.updateButtonStates()
        }
    }
    updateMoneyDisplay() {
        document.getElementById("crupto-money").innerText = player._tokenBalance;
    }
}

export const buisnessMenu = new BuisnessMenu();
