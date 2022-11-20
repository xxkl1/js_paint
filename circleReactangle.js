
class CircleReactangle extends Reactangle {
    constructor(...params) {
        super(...params)
    }
    testDrawCircleReactangle() {
        radiusRect(this.contextResult, 0, 0, 50, 50, 8)
    }
    draw() {
        if (this.start && this.end) {
            drawCircleReactangle(this.context, this.start, this.end)
        }
    }
}