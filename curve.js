
class Curve {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.contextResult = paint.contextResult
        this.setup()
        this.initOptions()
    }
    setup() {
        this.statusEmu = {
            init: 'init',
            setStart: 'setStart',
            setEnding: 'setEnding',
            setEnd: 'setEnd',
            setControl1: 'setControl1',
            setControl2: 'setControl2'
        }
        this.status = this.statusEmu.init
        this.pointStart = null
        this.pointEnd = null
        this.pointControl1 = null
        this.pointControl2 = null
    }
    initOptions() {
        let options = new LineOptions()
        options.callBackClickOption = lineWidth => {
            this.context.lineWidth = lineWidth
        }
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
    static instance(...params) {
        this.i = this.i || new this(...params)
        return this.i
    }
    handleMousedown(point) {
        let p = point
        if (this.isStatus(this.statusEmu.init)) {
            this.pointStart = p
            this.status = this.statusEmu.setStart
            log('set start:', p)
        }
    }
    handleMousemove(point) {
        let p = point
        if (this.isStatusList([
                this.statusEmu.setStart,
                this.statusEmu.setEnding
            ])) {
            this.pointEnd = p
            this.status = this.statusEmu.setEnding
            log('set ending:', p)
        }
    }
    handleMouseup(point) {
        let p = point
        if (this.isStatusList([this.statusEmu.setEnding])) {
            this.pointEnd = p
            this.status = this.statusEmu.setEnd
            log('set ended:', p)
        } else if (this.isStatus(this.statusEmu.setEnd)) {
            this.pointControl1 = p
            this.status = this.statusEmu.setControl1
            log('set control1')
        } else if (this.isStatus(this.statusEmu.setControl1)) {
            this.pointControl2 = p
            this.status = this.statusEmu.setControl2
            log('set control2')
            this.setCurToResult()
            this.reset()
        }
    }
    draw() {
        let isDrawLine = this.isStatusList([
            this.statusEmu.setEnding,
            this.statusEmu.setEnd
        ])
        if (isDrawLine) {
            drawLine(this.context, this.pointStart, this.pointEnd)
        } else if (this.isStatus(this.statusEmu.setControl1)) {
            drawSecondOrderBezier(this.context, this.pointStart, this.pointControl1, this.pointEnd)
        } else if (this.isStatus(this.statusEmu.setControl2)) {
            drawThreeOrderBezier(this.context, this.pointStart, this.pointControl1, this.pointControl2, this.pointEnd)
        }
    }
    setCurToResult() {
        this.paint.context.save()
        this.paint.contextResult.save()
        this.paint.updateColorByGlobal()
        this.paint.clear()
        this.draw()
        this.paint.setContextResult()
        this.context.restore()
        this.contextResult.restore()
    }
    beforeDestroy() {
        this.setCurToResult()
    }
    update() {
    }
}