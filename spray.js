
const getPointRandomCircle = function (context, center, radius) {
    let ctx = context
    ctx.beginPath()
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI)
    let maxX = center.x + (radius - 1)
    let minX = center.x - (radius - 1)
    let maxY = center.y + (radius - 1)
    let minY = center.y - (radius - 1)
    let p = {
        x: genRandom(minX, maxX),
        y: genRandom(minY, maxY)
    }
    if (ctx.isPointInPath(p.x, p.y)) {
        return p
    } else {
        return getPointRandomCircle(ctx, center, radius)
    }
}
const drawPixelByRadius = function (context, center, radius) {
    let c = context
    let len = radius * 2 + 1
    var imageData = c.createImageData(len, len)
    var d = imageData.data
    for (let i = 0; i < d.length; i += 4) {
        d[i + 0] = 0
        d[i + 1] = 0
        d[i + 2] = 0
        d[i + 3] = 255
    }
    let start = {
        x: center.x - radius,
        y: center.y - radius
    }
    c.putImageData(imageData, start.x, start.y)
}
const canvasSpayLittle = function () {
    return loadImage('./images/options-airbrush-size.png').then(img => {
        let imgWidht = img.width
        let imgHeightCu3 = imgWidht / 3
        let imgHeight = img.height
        let canvas = document.createElement('canvas')
        canvas.width = 16
        canvas.height = 23
        contextOfCanvas(canvas).drawImage(img, 3, 0, imgHeightCu3, imgHeight, 0, 0, imgHeightCu3, imgHeight)
        return canvas
    })
}
const canvasSpayMid = function () {
    return loadImage('./images/options-airbrush-size.png').then(img => {
        let imgWidht = img.width
        let imgHeightCu3 = imgWidht / 3
        let imgHeight = img.height
        let canvas = document.createElement('canvas')
        canvas.width = 16
        canvas.height = 23
        contextOfCanvas(canvas).drawImage(img, imgHeightCu3 * 1 + 3, 0, imgHeightCu3, imgHeight, 0, 0, imgHeightCu3, imgHeight)
        return canvas
    })
}
const canvasSpayBig = function () {
    return loadImage('./images/options-airbrush-size.png').then(img => {
        let imgWidht = img.width
        let imgHeightCu3 = imgWidht / 3
        let imgHeight = img.height
        let canvas = document.createElement('canvas')
        canvas.width = 24
        canvas.height = 23
        contextOfCanvas(canvas).drawImage(img, imgHeightCu3 * 2, 0, imgHeightCu3, imgHeight, 0, 0, imgHeightCu3, imgHeight)
        return canvas
    })
}
const chooserSpay = function () {
    let div = document.createElement('div')
    addClassByElement(div, 'chooser')
    addClassByElement(div, 'choose-airbrush-size')
    return Promise.all([
        canvasSpayLittle(),
        canvasSpayMid(),
        canvasSpayBig()
    ]).then(domList => {
        for (let d of domList) {
            div.appendChild(wrapOptionDiv(d))
        }
        return div
    })
}
class Spray {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.contextResult = paint.contextResult
        this.SpraySizeEmu = {
            little: 0,
            mid: 1,
            big: 2
        }
        this.spraySize = this.SpraySizeEmu.little
        this.setOptions().then(() => {
            this.setSelect(0)
            this.setOptionLister()
        })
        this.setup()
        this.test()
    }
    setOptions() {
        return chooserSpay().then(div => {
            this.domToolOption = domToolOption()
            this.domToolOption.appendChild(div)
        })
    }
    optionDivList() {
        return this.domToolOption.children[0].children
    }
    setSelect(index) {
        const canvasOfDiv = div => div.children[0]
        const spraySizeByIndex = index => {
            let k = Object.keys(this.SpraySizeEmu)[index]
            return this.SpraySizeEmu[k]
        }
        let className = 'selected'
        let classNameInvert = 'invert'
        let l = Array.from(this.optionDivList())
        l.forEach(e => {
            removeClassByElement(e, className)
            removeClassByElement(canvasOfDiv(e), classNameInvert)
        })
        let selected = l[index]
        addClassByElement(selected, className)
        addClassByElement(canvasOfDiv(selected), classNameInvert)
        this.spraySize = spraySizeByIndex(index)
    }
    setOptionLister() {
        let l = Array.from(this.optionDivList())
        l.forEach((dom, index) => {
            dom.addEventListener('click', () => {
                this.setSelect(index)
            })
        })
    }
    test() {
    }
    testGetPointRandomCircle() {
        log(getPointRandomCircle(this.contextResult, {
            x: 50,
            y: 50
        }, 50))
    }
    testDrawSinglePixel() {
        drawSinglePixel(this.contextResult, {
            x: 50,
            y: 55
        })
    }
    testDrawPixel() {
        drawPixelByRadius(this.contextResult, {
            x: 50,
            y: 50
        }, 1)
    }
    setup() {
        log('spray')
        this.statusEmu = {}
        this.status = this.statusEmu.init
        this.mouseDown = false
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
        this.mouseDown = true
        this.center = point
    }
    handleMousemove(point) {
        let p = point
        this.center = point
    }
    handleMouseup() {
        this.mouseDown = false
        this.paint.setContextResult()
    }
    draw() {
        let radiusMap = {
            [this.SpraySizeEmu.little]: 5,
            [this.SpraySizeEmu.mid]: 13,
            [this.SpraySizeEmu.big]: 25
        }
        let countDrawMap = {
            [this.SpraySizeEmu.little]: radiusMap[this.SpraySizeEmu.little],
            [this.SpraySizeEmu.mid]: radiusMap[this.SpraySizeEmu.mid],
            [this.SpraySizeEmu.big]: radiusMap[this.SpraySizeEmu.big]
        }
        if (this.mouseDown) {
            let c = this.contextResult
            let countDraw = countDrawMap[this.spraySize]
            let radius = radiusMap[this.spraySize]
            for (let i = 0; i < countDraw; i++) {
                let p = getPointRandomCircle(c, this.center, radius)
                let color = toColorList(Global.color.foreground)
                drawSinglePixel(c, p, color)
            }
        }
    }
    update() {
    }
    beforeDestroy() {
    }
}