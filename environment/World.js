import {Cell} from "../lives/Cell.js";

class World {
    #worldWidth;//多少个生命宽
    #worldHeight;//多少个生命高
    #lifeSize;
    #worldCanvas;
    #worldContext;
    #worldInterval;
    #lives;

    /**
     * 构造函数
     * @param canvasId
     * @param width //多少个生命宽
     * @param height //多少个生命高
     * @param size //生命的尺寸
     */
    constructor(canvasId, width, height, size) {
        this.#worldCanvas = document.getElementById(canvasId);
        this.#worldContext = this.#worldCanvas.getContext("2d");
        this.#worldWidth = width;
        this.#worldHeight = height;
        this.#lifeSize = size;
        this.#worldCanvas.width = width * size;
        this.#worldCanvas.height = height * size;

        this.init();
        this.#lives = this.build();

        //监听鼠标点击事件
        this.#worldCanvas.addEventListener("mousedown", this.mouseHandle.bind(this), false);//需要bind this否则读取不到当前实例的私有变量
        //监听按钮点击事件
        this.setButtonListener();
    };

    /**
     * 初始化棋盘
     */
    init() {
        this.#worldContext.clearRect(0, 0, this.#worldWidth * this.#lifeSize, this.#worldHeight * this.#lifeSize);
        //画格子
        for (let i = 0; i <= this.#worldHeight; i++) {
            //横线
            this.#worldContext.beginPath();
            this.#worldContext.moveTo(0, i * this.#lifeSize);
            this.#worldContext.lineTo(this.#worldWidth * this.#lifeSize, i * this.#lifeSize);
            this.#worldContext.stroke();
        }
        for (let j = 0; j <= this.#worldWidth; j++) {
            //竖线
            this.#worldContext.beginPath();
            this.#worldContext.moveTo(j * this.#lifeSize, 0);
            this.#worldContext.lineTo(j * this.#lifeSize, this.#worldHeight * this.#lifeSize);
            this.#worldContext.stroke();
        }
    }

    /**
     * 初始化生命
     */
    build() {
        let lives = new Array(this.#worldWidth);
        for (let i = 0; i < lives.length; i++) {
            lives[i] = new Array(this.#worldHeight);
            for (let j = 0; j < lives[i].length; j++) {
                lives[i][j] = new Cell();
            }
        }

        return lives;
    }

    /**
     * 设置按钮监听
     */
    setButtonListener() {
        const start = document.getElementById("start");
        const stop = document.getElementById("stop");
        const step = document.getElementById("step");
        const clean = document.getElementById("clean");
        start.addEventListener("click", this.start.bind(this), false);
        stop.addEventListener("click", this.stop.bind(this), false);
        step.addEventListener("click", this.step.bind(this), false);
        clean.addEventListener("click", this.clean.bind(this), false);
    }

    /**
     * 设置生命
     * @param lives
     */
    setLives(lives) {
        this.#lives = lives;
    }

    /**
     * 获取生命
     */
    getLives() {
        return this.#lives;
    }

    /**
     * 开始运行
     */
    start() {
        this.#worldInterval = setInterval(this.update.bind(this), 500);
    }

    /**
     * 暂停运行
     */
    stop() {
        clearInterval(this.#worldInterval);
    }

    /**
     * 步进一代
     */
    step() {
        this.update();
    }

    /**
     * 清空屏幕
     */
    clean() {
        this.#lives = this.build();
        this.drawLife();
    }

    /**
     * 处理鼠标点击事件
     * @param event
     */
    mouseHandle(event) {
        let x = Math.floor(event.pageX / this.#lifeSize) - 1;
        let y = Math.floor(event.pageY / this.#lifeSize) - 1;
        this.#lives[x][y].setLifeState(+!this.#lives[x][y].getLifeState());
        this.drawLife();
    }

    /**
     * 更新生命状态
     */
    update() {
        //深拷贝，判断是基于原细胞群的一个快照，如果直接改变细胞群状态，那么有的情况下会影响下一行的判断
        let newLives = JSON.parse(JSON.stringify(this.#lives));
        for (let i = 0; i < this.#worldWidth; i++) {
            for (let j = 0; j < this.#worldHeight; j++) {
                newLives[i][j] = new Cell();
                let life = this.#lives[i][j];
                let neighbors = this.checkEnv(i, j);
                //当前细胞有两到三个邻居，活着的继续存活，死亡的复活
                if (neighbors == 2 || neighbors == 3) {
                    if (life.getLifeState() || neighbors == 3) {
                        newLives[i][j].setLifeState(1);
                    }
                }
            }
        }
        this.setLives(newLives);

        this.drawLife();
    }

    /**
     * 画出生命
     */
    drawLife() {
        for (let i = 0; i < this.#worldWidth; i++) {
            for (let j = 0; j < this.#worldHeight; j++) {
                if (this.#lives[i][j].getLifeState()) {
                    this.#worldContext.fillRect(i * this.#lifeSize + 1, j * this.#lifeSize + 1, this.#lifeSize - 2, this.#lifeSize - 2);
                } else {
                    this.#worldContext.clearRect(i * this.#lifeSize + 1, j * this.#lifeSize + 1, this.#lifeSize - 2, this.#lifeSize - 2);
                }
            }
        }
    }

    /**
     * 计算生命所处环境状态
     * @param x
     * @param y
     * @returns {number}
     */
    checkEnv(x, y) {
        let count = 0;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i < 0 || i > this.#worldWidth - 1 || j < 0 || j > this.#worldHeight - 1 || (i == x && j == y)) {
                    continue;
                }
                if (this.#lives[i][j].getLifeState()) {
                    count += 1;
                }
            }
        }

        return count;
    }
}

export {World};