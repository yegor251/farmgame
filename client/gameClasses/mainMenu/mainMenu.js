import GVAR from "../../globalVars/global.js";
import player from "../player/player.js";

class MainManu {
    constructor() {
        document.getElementById('open-main-menu').onclick = () => {
            this.show();
        }
        
        document.getElementById("close-main-menu").onclick = () => {
            this.close();
        }
        document.getElementById("networth-question-button").onclick = () => {
            GVAR.showFloatingText(15);
        }
        document.querySelectorAll('.donate-plus-button').forEach(button => {
            button.onclick = () => {
                document.getElementById('payment-wrap').style.display = 'flex';
                document.getElementById('main-menu-wrap').style.display = 'none';
            }
        });
    }
    show(){
        GVAR.closeAllWindows()
        this.renderMenu();
        document.getElementById("main-menu-wrap").style.display = "flex";
    }
    close(){
        document.getElementById("main-menu-wrap").style.display = "none";
        document.getElementById("buttons-bar").style.display = "flex";
    }
    renderMenu(){
        document.getElementById('money-balance').innerText = player._money;
        document.getElementById('networth-balance').innerText = player._networth;
        document.getElementById('token-balance').innerText = (player._tokenBalance / 100).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
        document.getElementById('ton-balance').innerText = (player._tonBalance / 1000000000).toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
        document.getElementById('usdt-balance').innerText = (player._usdtBalance / 1000000).toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
    }
}
export const mainMenu = new MainManu();