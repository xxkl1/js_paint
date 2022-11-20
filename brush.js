
class Brush extends Pen {
    constructor(...params) {
        super(...params)
    }
    draw() {
        this.context.lineWidth = 10
        super.draw()
    }
}