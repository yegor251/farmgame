import GVAR from "../../globalVars/global.js";
import RES from "../../resources.js";

class BushMenu{
    constructor() {
        document.getElementById("close-bush-menu").onclick = () => {
            this.close()
        }
        this.bush = 'none'
    }
    close(){
        document.getElementById("bush-menu-wrap").style.display = "none";
        this.bush = 'none'
        if (document.getElementById("bush-waterer")){
            document.getElementById("bush-waterer").remove()
            document.getElementById("waterer-price").remove()
        }
    }
    show(bush){
        this.bush = bush
        GVAR.closeAllWindows()
        document.getElementById("bush-menu-wrap").style.display = "flex";
        const waterer = document.createElement('img')
        waterer.id = 'bush-waterer'
        document.getElementById('bush-menu').appendChild(waterer)
        const watererPrice = document.createElement('h3')
        watererPrice.id = 'waterer-price'
        document.getElementById('bush-menu').appendChild(watererPrice)
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
        const textTime = document.getElementById("bush-timeToFinish")
        if (this.bush._timeToFinish == undefined)
            textTime.innerText = '-'
        else
            textTime.innerText = this._formatTime(Math.floor(this.bush._timeToFinish / 1000))
        let a = this.bush._timeToFinish
        let b = this.bush._timeStamp
        if (this.bush._timeToFinish == undefined)
            a = 0;
        var progressLine = document.getElementById('bush-process-line');
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
        const temp = document.createElement('button')
        temp.innerText = this.bush._collectedAmount
        document.getElementById('temp').innerText = this.bush._collectedAmount

        const bushImage = document.getElementById('bush-img');
        bushImage.className = 'menu-big-img';
        bushImage.src = this.bush._image.src
        this.renderTimer();
    
        const isIntersecting = (rect1, rect2) => {
            return (
                rect1.left + rect1.width / 2 < rect2.right &&
                rect1.right - rect1.width / 2 > rect2.left &&
                rect1.top + rect1.height / 2 < rect2.bottom &&
                rect1.bottom - rect1.height / 2 > rect2.top
            );
        };
    
        const bush = this.bush;
        const startButton = document.getElementById("bush-waterer");
        startButton.className = 'item-image';
        startButton.src = `client/assets/waterer/waterer.png`;

        const watererPrice = document.getElementById("waterer-price");
        // watererPrice.className = 'item-image';
        watererPrice.innerText = bush._resetPrice//цена пересоздания
        console.log(this.bush.canReset())
        if (this.bush.canReset()) {
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
                const imgRect = document.getElementById('bush-img').getBoundingClientRect();
                if (isIntersecting(cloneRect, imgRect)) {
                    bush.reset();
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
export const bushMenu = new BushMenu();