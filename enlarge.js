
const canvasEnlarge = function (size) {
    let canvas = document.createElement('canvas')
    canvas.width = 39
    canvas.height = 13
    let context = contextOfCanvas(canvas)
    let fontSize = 12
    context.strokeStyle = '#000'
    context.font = `${ fontSize }px serif`
    context.fillText(`${ size }x`, 5, fontSize - 2)
    let pointCenterRect = {
        x: canvas.width - 13,
        y: canvas.height / 2
    }
    let widthRectBase = 1
    let widthRectSized = widthRectBase * size
    let offset = widthRectSized / 2
    let pointStartDraw = {
        x: pointCenterRect.x - offset,
        y: pointCenterRect.y - offset
    }
    drawFillRectByStartWh(context, pointStartDraw, widthRectSized, widthRectSized)
    return canvas
}
const chooserEnlarge = function () {
    let div = document.createElement('div')
    addClassByElement(div, 'chooser')
    addClassByElement(div, 'choose-enlarge')
    let canvasList = [
        canvasEnlarge(1),
        canvasEnlarge(2),
        canvasEnlarge(6),
        canvasEnlarge(8)
    ]
    let canvasWrapDivList = canvasList.map(d => wrapOptionDiv(d))
    canvasWrapDivList.forEach(element => {
        div.appendChild(element)
    })
    return div
}
class Enlarge {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.contextResult = paint.contextResult
        this.canvasResult = paint.canvasResult
        this.setup()
        this.setOptions()
        this.setOptionSelectDefault()
        this.addLinsterOptions()
    }
    setup() {
        this.isEnlarged = false
        this.scale = 2
    }
    setOptions() {
        clearToolOption()
        let chooser = chooserEnlarge()
        domToolOption().appendChild(chooser)
    }
    addLinsterOptions() {
        let l = Array.from(domToolOptionList())
        for (let i = 0; i < l.length; i++) {
            let cur = l[i]
            let sizeMap = {
                0: 1,
                1: 2,
                2: 6,
                3: 8
            }
            cur.addEventListener('click', () => {
                clearSelectDomToolOptionList()
                setSelectedToOption(i)
                this.scale = sizeMap[i]
            })
        }
    }
    setOptionSelectDefault() {
        clearSelectDomToolOptionList()
        setSelectedToOption(0)
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
    enlarge() {
        let w = this.canvasResult.width
        let h = this.canvasResult.height
        let d = this.contextResult.getImageData(0, 0, w, h)
        let wScale = w * this.scale
        let hScale = h * this.scale
        let dNew = new ImageData(wScale, hScale)
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let p = {
                    x: x,
                    y: y
                }
                let color = colorImageDataByPoint(d, p)
                let pointStartNew = {
                    x: x * this.scale,
                    y: y * this.scale
                }
                let isBlankPoint = color[3] === 0
                if (!isBlankPoint) {
                    for (let y = 0; y < this.scale; y++) {
                        for (let x = 0; x < this.scale; x++) {
                            let pointSet = {
                                x: pointStartNew.x + x,
                                y: pointStartNew.y + y
                            }
                            setImageDataColorByPoint(dNew, pointSet, color)
                        }
                    }
                }
            }
        }
        this.canvasResult.width *= this.scale
        this.canvasResult.height *= this.scale
        this.canvas.width *= this.scale
        this.canvas.height *= this.scale
        this.contextResult.putImageData(dNew, 0, 0)
    }
    shrink() {
        log('shrink')
        console.time('time shrink')
        let w = this.canvasResult.width
        let h = this.canvasResult.height
        let d = this.contextResult.getImageData(0, 0, w, h)
        let wScale = w / this.scale
        let hScale = h / this.scale
        let dNew = new ImageData(wScale, hScale)
        for (let y = 0; y < hScale; y++) {
            for (let x = 0; x < wScale; x++) {
                let p = {
                    x: x,
                    y: y
                }
                let pointColor = {
                    x: p.x * this.scale,
                    y: p.y * this.scale
                }
                let color = colorImageDataByPoint(d, pointColor)
                setImageDataColorByPoint(dNew, p, color)
            }
        }
        this.canvasResult.width /= this.scale
        this.canvasResult.height /= this.scale
        this.canvas.width /= this.scale
        this.canvas.height /= this.scale
        this.contextResult.putImageData(dNew, 0, 0)
        console.timeEnd('time shrink')
    }
    handleMouseup() {
        if (!this.isEnlarged) {
            this.enlarge()
        } else {
            this.shrink()
        }
        this.isEnlarged = !this.isEnlarged
    }
    draw() {
    }
    update() {
    }
}