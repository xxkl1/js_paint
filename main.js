
class Paint {
    constructor() {
        this.setup()
    }
    static instance() {
        this.i = this.i || new this()
        return this.i
    }
    setup() {
        this.init()
        this.setupInputs()
        this.setupFuncMap()
        this.setSelectHtml()
        let p = new ColorPattle()
    }
    setSelectHtml() {
        let l = Object.keys(TypeEmu)
        for (let k of l) {
            let imagePosition = PositionFuncType[k]
            let html = `
            <div class="func ${ k }" id="${ k }">
                <div class="func_inside" style="background-position: ${ imagePosition[0] }px ${ imagePosition[1] }px;"></div>
            </div>`
            addHtmlToElement('#select', html)
        }
        addClass(`#${ l[0] }`, 'selected')
    }
    updateColorByGlobal() {
        let foreground = Global.color.foreground
        let back = Global.color.back
        this.context.strokeStyle = foreground
        this.context.fillStyle = foreground
        this.contextResult.strokeStyle = foreground
        this.contextResult.fillStyle = foreground
    }
    test() {
        this.testSecondOrderBezier()
        this.testThreeOrderBezier()
        this.testDrawLine()
    }
    testDrawLine() {
        let start = {
            x: 0,
            y: 0
        }
        let end = {
            x: 100,
            y: 100
        }
        drawLine(this.contextResult, start, end)
    }
    testSecondOrderBezier() {
        let start = {
            x: 50,
            y: 20
        }
        let end = {
            x: 50,
            y: 100
        }
        let control = {
            x: 230,
            y: 30
        }
        drawSecondOrderBezier(this.contextResult, start, control, end)
    }
    testThreeOrderBezier() {
        let start = {
            x: 50,
            y: 20
        }
        let end = {
            x: 50,
            y: 100
        }
        let control1 = {
            x: 230,
            y: 30
        }
        let control2 = {
            x: 150,
            y: 60
        }
        drawThreeOrderBezier(this.contextResult, start, control1, control2, end)
    }
    init() {
        this.canvas = e('#canvas1')
        this.context = this.canvas.getContext('2d')
        this.canvasResult = e('#canvas2')
        this.contextResult = this.canvasResult.getContext('2d')
        this.updateColorByGlobal()
        this.listDataHistory = []
        this.keyStatus = {}
        this.isMousedown = false
    }
    keyRevoke() {
        const s = this.keyStatus
        const toRevoke = s['Control'] && s['z'] || s['Control'] && s['Z']
        if (toRevoke) {
            this.revoke()
        }
    }
    setupFuncMap() {
        this.mapFunction = {
            [TypeEmu.line]: Line,
            [TypeEmu.pen]: Pen,
            [TypeEmu.reactangle]: Reactangle,
            [TypeEmu.text]: TextFuc,
            [TypeEmu.crop]: Crop,
            [TypeEmu.enlarge]: Enlarge,
            [TypeEmu.curve]: Curve,
            [TypeEmu.circle]: Circle,
            [TypeEmu.circleReactangle]: CircleReactangle,
            [TypeEmu.polygon]: Polygon,
            [TypeEmu.spray]: Spray,
            [TypeEmu.rubber]: Rubber,
            [TypeEmu.brush]: Brush,
            [TypeEmu.fill]: Fill
        }
        this.func = new Line(this.canvas, this.context, this)
    }
    setupInputs() {
        this.setupClickWin()
        this.setupInputSelect()
        this.setupMouse()
    }
    setupClickWin() {
        window.addEventListener('keydown', event => {
            this.keyStatus[event.key] = true
            this.keyRevoke()
        })
        window.addEventListener('keyup', event => {
            this.keyStatus[event.key] = false
        })
    }
    setupMouse() {
        this.canvas.addEventListener('mousedown', event => {
            let point = pointFromEvent(event)
            this.isMousedown = true
            this.func.handleMousedown(point)
        })
        this.canvas.addEventListener('mousemove', event => {
            let point = pointFromEvent(event)
            if (this.isMousedown) {
                this.func.handleMousemove(point)
            }
        })
        this.canvas.addEventListener('mouseup', event => {
            let point = pointFromEvent(event)
            this.isMousedown = false
            this.func.handleMouseup(point)
        })
    }
    removeAllSelect() {
        let l = Object.keys(TypeEmu)
        for (let k of l) {
            removeClass(`#${ k }`, 'selected')
        }
    }
    setupInputSelect() {
        e('#select').addEventListener('click', event => {
            let el = event.target.parentNode
            let id = el.id
            this.removeAllSelect()
            addClass(`#${ id }`, 'selected')
            let funcId = TypeEmu[id]
            this.changeFunc(funcId)
        })
    }
    changeFunc(funcID) {
        clearToolOption()
        if (this.func.beforeDestroy) {
            this.func.beforeDestroy()
        }
        log('id:', funcID)
        let Func = this.mapFunction[funcID]
        log('Func:', Func)
        this.func = new Func(this.canvas, this.context, this)
    }
    update() {
        this.func.update()
    }
    backupContextResult() {
        let w = this.canvas.width
        let h = this.canvas.height
        let d = this.contextResult.getImageData(0, 0, w, h)
        this.listDataHistory.push(d)
    }
    setContextResult() {
        this.backupContextResult()
        let w = this.canvas.width
        let h = this.canvas.height
        let dataOrigin = this.contextResult.getImageData(0, 0, w, h)
        let dataNew = this.context.getImageData(0, 0, w, h)
        dataNew = dataNew.data
        for (let i = 0; i < dataNew.length; i = i + 4) {
            let r = dataNew[i]
            let g = dataNew[i + 1]
            let b = dataNew[i + 2]
            let a = dataNew[i + 3]
            let dOrigin = dataOrigin.data
            if (!(r === 0 && g === 0 && b === 0 && a === 0)) {
                dOrigin[i] = r
                dOrigin[i + 1] = g
                dOrigin[i + 2] = b
                dOrigin[i + 3] = a
            }
        }
        this.contextResult.putImageData(dataOrigin, 0, 0)
    }
    revoke() {
        log('start revoke')
        if (this.listDataHistory.length > 0) {
            log('revoke')
            this.clear()
            this.clearResult()
            const d = this.listDataHistory.pop()
            this.contextResult.putImageData(d, 0, 0)
        }
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    clearResult() {
        this.contextResult.clearRect(0, 0, this.canvasResult.width, this.canvasResult.height)
    }
    draw() {
        this.context.save()
        this.contextResult.save()
        this.clear()
        if (this.func.updateColorByGlobal) {
            this.func.updateColorByGlobal()
        } else {
            this.updateColorByGlobal()
        }
        this.func.draw()
        this.context.restore()
        this.contextResult.restore()
    }
    runloop() {
        this.update()
        this.draw()
        setTimeout(() => {
            this.runloop()
        }, 1000 / 30)
    }
}
const __main = function () {
    let p = new Paint()
    p.runloop()
}
__main()