
class Rubber extends Pen {
    constructor(...params) {
        super(...params)
    }
    draw() {
        this.contextResult.lineWidth = 15
        let back = Global.color.back
        this.contextResult.strokeStyle = back
        if (this.l.length > 0) {
            this.contextResult.beginPath()
            this.contextResult.moveTo(this.l[0].x, this.l[0].y)
            for (let i = 1; i < this.l.length; i++) {
                let cur = this.l[i]
                this.contextResult.lineTo(cur.x, cur.y)
            }
            this.contextResult.stroke()
        }
    }
}