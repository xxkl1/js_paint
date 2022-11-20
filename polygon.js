
class Polygon {
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
            setPoint1: 'setPoint1',
            setPoint2ing: 'setPoint2ing',
            setPoint2: 'setPoint2',
            setPointOther: 'setPointOther'
        }
        this.status = this.statusEmu.init
        this.listPoint = []
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
            this.listPoint.push(p)
            this.status = this.statusEmu.setPoint1
            log('set p1')
            log('l:', this.listPoint)
        }
    }
    handleMousemove(point) {
        let p = point
        let emu = this.statusEmu
        if (this.isStatusList([
                emu.setPoint1,
                emu.setPoint2ing
            ])) {
            this.listPoint[1] = p
            this.status = this.statusEmu.setPoint2ing
            log('set p2:', this.listPoint)
            log('l:', this.listPoint)
        }
    }
    handleMouseup(point) {
        let p = point
        let emu = this.statusEmu
        if (this.isStatusList([emu.setPoint2ing])) {
            this.listPoint[1] = p
            this.status = this.statusEmu.setPoint2
            log('set p2 end:', this.listPoint)
            log('l:', this.listPoint)
        } else if (this.isStatusList([
                emu.setPoint2,
                emu.setPointOther
            ])) {
            this.listPoint.push(p)
            this.status = this.statusEmu.setPointOther
            log('set p other')
            log('l:', this.listPoint)
        }
    }
    draw() {
        let emu = this.statusEmu
        let isDrawStatusList = [
            emu.setPoint2ing,
            emu.setPoint2,
            emu.setPointOther
        ]
        if (this.isStatusList(isDrawStatusList)) {
            for (let i = 0; i < this.listPoint.length; i++) {
                let cur = this.listPoint[i]
                let next = this.listPoint[i + 1]
                if (next) {
                    drawLine(this.context, cur, next)
                }
            }
        }
    }
    beforeDestroy() {
        this.paint.setContextResult()
    }
    update() {
    }
}