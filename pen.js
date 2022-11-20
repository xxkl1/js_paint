
class Pen {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.contextResult = paint.contextResult
        this.setup()
    }
    setup() {
        this.l = []
    }
    static instance(...params) {
        this.i = this.i || new this(...params)
        return this.i
    }
    handleMousedown(point) {
        this.l.push(point)
    }
    handleMousemove(point) {
        this.l.push(point)
    }
    handleMouseup() {
        this.l = []
        this.paint.setContextResult()
    }
    draw() {
        if (this.l.length > 0) {
            this.context.beginPath()
            this.context.moveTo(this.l[0].x, this.l[0].y)
            for (let i = 1; i < this.l.length; i++) {
                let cur = this.l[i]
                this.context.lineTo(cur.x, cur.y)
            }
            this.context.stroke()
        }
    }
    update() {
    }
}