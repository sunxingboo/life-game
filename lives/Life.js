class Life {
    state
    constructor() {
    }

    /**
     * 获取生命状态
     * @returns {*}
     */
    getLifeState() {
        return this.state;
    }

    /**
     * 设置生命状态
     * @param state
     */
    setLifeState(state) {
        this.state = state;
    }
}

export {Life};