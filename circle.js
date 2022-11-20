
class Circle {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.contextResult = paint.contextResult
        this.setup()
        this.initOptions()
        this.test()
    }
    test() {
    }
    testDrawCircleStartEnd() {
        let ctx = this.contextResult
        let start = {
            x: 0,
            y: 0
        }
        let end = {
            x: 100,
            y: 200
        }
        drawCircleStartEnd(ctx, start, end)
    }
    testCenterByStartEnd() {
        testCenterByStartEnd()
    }
    testDrawCircel() {
        let ctx = this.contextResult
        let center = {
            x: 75,
            y: 75
        }
        let radiusX = 50
        let radiusY = 50
        drawCircle(ctx, center, radiusX, radiusY)
    }
    setup() {
        log('circle')
        this.statusEmu = {
            init: 'init',
            setStart: 'setStart',
            setEnding: 'setEnding',
            setEnd: 'setEnd'
        }
        this.status = this.statusEmu.init
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
            this.start = p
            this.status = this.statusEmu.setStart
            log('set start')
        }
    }
    handleMousemove(point) {
        let p = point
        if (this.isStatusList([
                this.statusEmu.setStart,
                this.statusEmu.setEnding
            ])) {
            this.end = p
            this.status = this.statusEmu.setEnding
            log('set end ing')
        }
    }
    handleMouseup(point) {
        let p = point
        if (this.isStatusList([this.statusEmu.setEnding])) {
            this.end = p
            this.status = this.statusEmu.setEnd
            this.paint.setContextResult()
            this.reset()
            log('set end ed')
        }
    }
    draw() {
        let emu = this.statusEmu
        let isDraw = [
            emu.setEnding,
            emu.setEnd
        ]
        if (this.isStatusList(isDraw)) {
            drawCircleStartEnd(this.context, this.start, this.end)
        }
    }
    update() {
    }
    beforeDestroy() {
    }
}