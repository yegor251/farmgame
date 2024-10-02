class Player{
    constructor()
    {
        this._money = 100000;
        this._networth = 0;
        this._tokenBalance = 0;
        this._tonBalance = 0
        this._usdtBalance = 0

        this._chosenTile = {i: -1, j: -1};
        this._phantomStructure = "none";

        this._inventory = []
        this._inventorySize = 50;
        
        this._orderArr = []
        
        this._spinItems = []
        this._isSpinActivated = false;
        this._spinDropIndex = 0
        this._spinTimeStamp = 0

        this._boostersArr = []
        this._activBoostersArr = []
        this._availableDeals = []
        this._growBooster = {
            type: 'GrowSpeed',
            boosterAmount: 1,
            timeStamp: 0,
            timeToEnd: 0
        }
        this._workBooster = {
            type: 'WorkSpeed',
            boosterAmount: 1,
            timeStamp: 0,
            timeToEnd: 0
        }
        this._boostersArr = []
        this._deposits = []
        this._withdraws = []
    }
    upgradeInventory(){
        this._inventorySize += 10
        this.spendToken(1000)
    }
    canActivateBooster(id){
        let boost = this._boostersArr[id]
        let result = true
        this._activBoostersArr.forEach(booster => {
            if (boost.type == booster.type)
                result = false
        });
        return result
    }
    activateBooster(id){
        let boost = this._boostersArr[id]
        console.log(boost)
        this._boostersArr.splice(id, 1)
        if (boost.type == 'WorkSpeed'){
            this._workBooster.boosterAmount = boost.amount
            this._workBooster.timeToEnd = boost.time * 1000
            this._activBoostersArr.push(this._workBooster)
        } else if (boost.type == 'GrowSpeed'){
            this._growBooster.boosterAmount = boost.amount
            this._growBooster.timeToEnd = boost.time * 1000
            this._activBoostersArr.push(this._growBooster)
        } else{ //кажется этот else не нужен из-за reroll
            boost.boosterAmount = boost.amount
            boost.timeToEnd = boost.time * 1000
            console.log(boost.timeToEnd)
            boost.timeStamp = 0
            this._activBoostersArr.push(boost)
        }
    }
    realActivateBooster(){
        for (let i = 0; i < this._activBoostersArr.length; i++) {
            const booster = this._activBoostersArr[i];
            if (booster.timeStamp == 0){
                booster.timeStamp = Date.now() + booster.timeToEnd
                console.log(booster.timeToEnd, Date.now() / 1000)
                break
            }
        }
    }
    buy(cost) {
        if (this._money >= cost){
            this._money -= cost;
            player.updateMoney();
            return true
        } else {
            return false
        }
    }
    addMoney(n){
        this._money += n
        this._networth += n
        this.updateMoney()
        this.checkNetworthLevel()
    }
    spendToken(cost){
        this._tokenBalance -= cost
        this.updateMoney()
    }
    addToken(n){
        this._tokenBalance += n
        this.updateMoney()
    }
    checkNetworthLevel(){

    }
    getInvFullness(){
        let sum = 0;
        console.log(this._inventory)
        for (const el in this._inventory) {
            sum += this._inventory[el];
        }
        return this._inventorySize - sum
    }
    canCraft(item){
        for (const el in item.items) {
            if (item.items[el]>this._inventory[el]){
                return false
            }
        }
        return true
    }
    craftItem(item){
        for (const el in item.items) {
            this._inventory[el] -= item.items[el]
        };
    }
    updateMoney()
    {
        document.getElementById('money').innerText = `Money: ${this._money}`;
        //апдейт tokenBalance
    }
    pushInventory(item, n)
    {
        this._inventory[item]?
        this._inventory[item]+= n
        :
        this._inventory[item] = n;
        console.log(this._inventory)
    }
}
const player = new Player();

export default player
