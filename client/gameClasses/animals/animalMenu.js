import GVAR from "../../globalVars/global.js";
import RES from "../../resources.js";

class AnimalMenu{
    constructor() {
        document.getElementById("close-animal-menu").onclick = () => {
            this.close()
        }
        this.animalPen = 'none'
    }
    close(){
        document.getElementById("animal-menu-wrap").style.display = "none";
        this.animalPen = 'none'
        if (document.getElementById("animal-start-button"))
            document.getElementById("animal-start-button").remove()
    }
    show(animalPen){
        this.animalPen = animalPen
        GVAR.closeAllWindows()
        document.getElementById("animal-menu-wrap").style.display = "flex";
        const startButton = document.createElement('img')
        startButton.id = 'animal-start-button'
        document.getElementById('animal-menu').appendChild(startButton)
        this.renderMenu()
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
    renderTimer(){
        const textTime = document.getElementById("animal-timeToFinish")
        console.log(this.animalPen)
        if (!this.animalPen._timeToFinish)
            textTime.innerText = '-'
        else
            textTime.innerText = this._formatTime(Math.floor(this.animalPen._timeToFinish / 1000))
        let a = this.animalPen._timeToFinish
        let b = this.animalPen._timeStamp
        if (!this.animalPen._timeToFinish)
            a = 0;
        var progressLine = document.getElementById('animal-process-line');
        var progressBar = progressLine.querySelector('.progress');
        
        if (!progressBar) {
            // Create the progress bar if it does not exist
            progressBar = document.createElement('div');
            progressBar.className = 'progress';
            progressLine.appendChild(progressBar);
        }
        
        var percentage = (a / b) * 100;
        
        // Ensure the percentage is within the bounds of 0 to 100
        percentage = Math.max(0, Math.min(100, percentage));
        progressBar.style.width = percentage + '%';
    }
    renderMenu() {
        const type = this.animalPen._type;
        const animalImage = document.getElementById('animal-img');
        animalImage.className = 'menu-big-img';
        animalImage.src = `client/assets/buildings/${type}/${type}.png`;
        this.renderTimer();
        const upgradeButton = document.getElementById('animal-upgrade');
        upgradeButton.disabled = !(this.animalPen.canUpgrade())
        upgradeButton.onclick = () => {
            this.animalPen.upgrade()
        };
    
        const isIntersecting = (rect1, rect2) => {
            return (
                rect1.left + rect1.width / 2 < rect2.right &&
                rect1.right - rect1.width / 2 > rect2.left &&
                rect1.top + rect1.height / 2 < rect2.bottom &&
                rect1.bottom - rect1.height / 2 > rect2.top
            );
        };
    
        const animalPen = this.animalPen;
        const startButton = document.getElementById("animal-start-button");
        startButton.className = 'item-image';
        const feedType = Object.keys(RES.buildings[type].intake)[0]
        startButton.src = `client/assets/items/${feedType}.png`;
        if (this.animalPen.canStartWork()) {
            if (startButton.dataset.handlerAdded !== 'true') {
                startButton.style.filter = 'grayscale(0%)';
                startButton.addEventListener('touchstart', startButtonTouchStartHandler);
                startButton.dataset.handlerAdded = 'true';
            }
        }else {
            startButton.style.filter = 'grayscale(100%)';
            startButton.removeEventListener('touchstart', startButtonTouchStartHandler);
            startButton.dataset.handlerAdded = 'false';
        }
    
        function startButtonTouchStartHandler(e) {
            e.preventDefault();
            const clone = this.cloneNode(true);
            clone.classList.add('clone-image');
            document.body.appendChild(clone);
    
            const moveAt = (pageX, pageY) => {
                clone.style.left = pageX - clone.offsetWidth / 2 + 'px';
                clone.style.top = pageY - clone.offsetHeight / 2 + 'px';
            };
    
            const touch = e.touches[0];
            moveAt(touch.pageX, touch.pageY);
    
            const onTouchMove = (event) => {
                const touch = event.touches[0];
                moveAt(touch.pageX, touch.pageY);
            };
    
            const onTouchEnd = () => {
                document.removeEventListener('touchmove', onTouchMove);
                const cloneRect = clone.getBoundingClientRect();
                const imgRect = document.getElementById('animal-img').getBoundingClientRect();
                if (isIntersecting(cloneRect, imgRect) && animalPen.canStartWork()) {
                    animalPen.startWork();
                    // Применяем CSS фильтр для черно-белого изображения
                    startButton.style.filter = 'grayscale(100%)';
                    // Удаляем обработчик события, чтобы запретить перемещение
                    startButton.removeEventListener('touchstart', startButtonTouchStartHandler);
                    startButton.dataset.handlerAdded = 'false';
                }
                clone.remove();
            };
    
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd, { once: true });
        }
    }    
}
export const animalMenu = new AnimalMenu();