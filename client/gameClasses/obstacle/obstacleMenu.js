import player from "../player/player.js";
import GVAR from "../../globalVars/global.js";
import tiles from "../../globalVars/tiles.js";
import Calc from "../../calc.js";
import CVAR from "../../globalVars/const.js";

class ObstacleMenu {
    constructor() {
        document.getElementById("close-obstacle-menu").onclick = () => {
            this.close()
        };
        this.obstacle = 'none';
    }
    show(obstacle) {
        this.obstacle = obstacle;
        GVAR.closeAllWindows();
        const img = document.getElementById('obstacle-img')
        img.style.backgroundImage = `url(client/assets/obstacles/${obstacle._type}/${obstacle._type}0.png)`;
        img.style.aspectRatio = `${obstacle._image.width} / ${obstacle._image.height}`
        document.getElementById("obstacle-menu-wrap").style.display = "flex";
        this.renderMenu();
    }
    close(){
        this.obstacle = 'none'
        document.getElementById("obstacle-menu-wrap").style.display = "none";
    }
    renderMenu() {
        const obstacleDelete = document.getElementById('obstacle-button');
        const money = document.getElementById('obstacle-money')
        if (this.obstacle._deletePrice){
            money.innerText = this.obstacle._deletePrice
            if (this.obstacle._deletePrice > player._money)
                document.getElementById('obstacle-money-checkmark').style.filter = 'grayscale(100%)';
            else
                document.getElementById('obstacle-money-checkmark').style.filter = 'grayscale(0%)';
        } else {
            money.innerText = '0'
            document.getElementById('obstacle-money-checkmark').style.filter = 'grayscale(0%)';
        }
        const token = document.getElementById('obstacle-token')
        if (this.obstacle._deleteTokenPrice){
            token.innerText = this.obstacle._deleteTokenPrice
            if (this.obstacle._deleteTokenPrice > player._tokenBalance)
                document.getElementById('obstacle-token-checkmark').style.filter = 'grayscale(100%)';
            else
                document.getElementById('obstacle-token-checkmark').style.filter = 'grayscale(0%)';
        } else {
            token.innerText = '0'
            document.getElementById('obstacle-token-checkmark').style.filter = 'grayscale(0%)';
        }
        obstacleDelete.addEventListener('click', () => {
            if (this.obstacle._deletePrice && this.obstacle._deletePrice > player._money){
                GVAR.showFloatingText('недостаточно money')
                return
            }
            if (this.obstacle._deleteTokenPrice && this.obstacle._deleteTokenPrice > player._tokenBalance){
                GVAR.showFloatingText('недостаточно token')
                return
            }
            const tileIndex = Calc.CanvasToIndex(this.obstacle._x, this.obstacle._y, CVAR.tileSide, CVAR.outlineWidth);
            for (let i = tileIndex.i; i < this.obstacle._w / CVAR.tileSide; i++) {
                for (let j = tileIndex.j; j < this.obstacle._h / CVAR.tileSide; j++) {
                    tiles[i][j]._structure = "none"
                }
            }
            if (this.obstacle._deletePrice && this.obstacle._deleteTokenPrice){
                player.buy(this.obstacle._deletePrice)
                player.spendToken(this.obstacle._deleteTokenPrice)
            } else if (this.obstacle._deleteTokenPrice){
                player.spendToken(this.obstacle._deleteTokenPrice)
            } else {
                player.buy(this.obstacle._deletePrice)
            }
            this.obstacle.delete()
            this.close()
            GVAR.showFloatingText('успешно')
        });
    }
}
export const obstacleMenu = new ObstacleMenu();
