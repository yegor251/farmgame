import { ctx } from "../../globalVars/canvas.js";
import CVAR from "../../globalVars/const.js";
import Calc from "../../calc.js";
import tiles from "../../globalVars/tiles.js";
import player from "../player/player.js";
import Sprite from "../sprite/sprite.js";
import RES from "../../resources.js";

export default class Animal extends Sprite{
    constructor(x, y, type, range)
    {
        super(x, y);
        this.range = range
        console.log(type)
        this._image = RES.animals[type].image
        this._h = RES.animals[type].size.h * CVAR.tileSide
        this._w = RES.animals[type].size.w * CVAR.tileSide
        this.range.w -= this._w
        this.range.h -= this._h
        this.range.y += 5 //размер запретной зоны переведенный в пиксели игры
        this.range.h -= 5
        this.nextCoords = this._getRandomPointOnBorder(range)
        this.timer = 0
        this.stopTime = 20 + Math.floor(Math.random() * 20)
        this.direction = 1
    }
    draw(){
        if (this.direction == 1){
            ctx.drawImage(this._image, this._x, this._y, this._w, this._h);
        }else {
            // Сохраняем текущую трансформацию контекста
            ctx.save();

            // Перемещаем начало системы координат к правой границе области рисования
            ctx.translate(this._x + this._w, this._y);

            // Отражаем по вертикали
            ctx.scale(-1, 1);

            // Рисуем изображение на отзеркаленной области
            ctx.drawImage(this._image, 0, 0, this._w, this._h);

            // Восстанавливаем трансформацию контекста
            ctx.restore();
        }
    }
    update() {
        if (this.timer == 0){
            // Вычисляем разницу по осям
            const deltaX = this.nextCoords.x - this._x;
            const deltaY = this.nextCoords.y - this._y;
            if (deltaX < 0 && this.direction == 1){
                this.direction = -1;
            } else if (deltaX >=0 && this.direction == -1){
                this.direction = 1;
            }

            // Вычисляем расстояние до nextCoords
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Определяем шаг по осям для перемещения на расстояние 1
            const stepX = (deltaX / distance) || 0; // защита от деления на ноль
            const stepY = (deltaY / distance) || 0; // защита от деления на ноль

            // Обновляем координаты, сдвигая их на 1 единицу в сторону nextCoords
            this._x += stepX;
            this._y += stepY;

            // Проверяем, достигнуты ли nextCoords, чтобы выбрать новые координаты
            if (Math.abs(this._x - this.nextCoords.x) < 1 && Math.abs(this._y - this.nextCoords.y) < 1) {
                this.nextCoords = this._getRandomPointOnBorder(this.range)
                this.timer = 1
            }
            this.draw()
        }
        else {
            this.timer += 1;
            if (this.timer==this.stopTime){
                this.timer = 0
                this.stopTime = 20 + Math.floor(Math.random() * 20)
            }
        }
    }
    moveDelta(delta){
        this._x += delta.x;
        this._y += delta.y;
        this.nextCoords.x += delta.x;
        this.nextCoords.y += delta.y;
        this.range.x += delta.x;
        this.range.y += delta.y;
    }
    _getRandomPointOnBorder(range) {
        const side = Math.floor(Math.random() * 4); // Случайно выбираем одну из 4 сторон
        let x, y;
        
        switch (side) {
            case 0: // Верхняя сторона
                x = range.x + Math.floor(Math.random() * range.w);
                y = range.y;
                break;
            case 1: // Правая сторона
                x = range.x + range.w;
                y = range.y + Math.floor(Math.random() * range.h);
                break;
            case 2: // Нижняя сторона
                x = range.x + Math.floor(Math.random() * range.w);
                y = range.y + range.h;
                break;
            case 3: // Левая сторона
                x = range.x;
                y = range.y + Math.floor(Math.random() * range.h);
                break;
        }
    
        return {x: x, y: y};
    }
}