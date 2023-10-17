export default class TimeOut {
    handler;
    time;
    id;
    start;
    timeLeft;
    constructor(handler, time) {
        this.id = setTimeout(handler, time);
        this.handler = handler;
        this.time = time;
        this.start = Date.now();
        this.timeLeft = time;
    }
    clear() {
        clearTimeout(this.id);
    }
    pause() {
        const passed = Date.now() - this.start;
        this.timeLeft = this.timeLeft - passed;
        this.clear();
    }
    continue() {
        this.clear();
        this.id = setTimeout(this.handler, this.timeLeft);
        this.start = Date.now();
    }
}
//# sourceMappingURL=Timeout.js.map