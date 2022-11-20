
class Reactangle {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.contextResult = paint.contextResult
        this.setup()
        this.initOptions()
    }
    setup() {
        this.start = null
        this.end = null
    }
    initOptions() {
        this.optionType = ModeTypeEmu.one
        let options = new RectOptions()
        options.callBackClickOption = i => {
            this.optionType = modeTypeByIndex(i)
        }
    }
    reset() {
        this.setup()
    }
    static instance(...params) {
        this.i = this.i || new this(...params)
        return this.i
    }
    handleMousedown(point) {
        this.start = point
    }
    handleMousemove(point) {
        this.end = point
    }
    handleMouseup() {
        this.reset()
        this.paint.setContextResult()
    }
    draw() {
        if (this.start && this.end) {
            drawRect(this.context, this.start, this.end)
        }
    }
    update() {
    }
}