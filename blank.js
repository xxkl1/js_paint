
class Blank {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.contextResult = paint.contextResult
        this.setup()
    }
    setup() {
        log('blank')
        this.statusEmu = {}
        this.status = this.statusEmu.init
    }
    reset() {
        this.setup()
    }
    isStatus(status) {
        return this.status === status
    }
    isStatusList(statusList) {
        return statusList.includes(this.status)
    }
    handleMousedown(point) {
        let p = point
    }
    handleMousemove(point) {
        let p = point
    }
    handleMouseup(point) {
        let p = point
    }
    draw() {
    }
    update() {
    }
    beforeDestroy() {
    }
}