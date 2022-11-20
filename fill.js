
class Fill {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.contextResult = paint.contextResult
        this.setup()
    }
    setup() {
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
    static instance(...params) {
        this.i = this.i || new this(...params)
        return this.i
    }
    handleMousedown(point) {
        let p = point
    }
    handleMousemove(point) {
        let p = point
    }
    handleMouseup(point) {
        let p = point
        this.fill(p)
    }
    imageDataByPoint(point) {
        return this.contextResult.getImageData(point.x, point.y, 1, 1)
    }
    isNoImageDataPoint(point) {
        let d = this.imageDataByPoint(point)
        return this.isNoImageData(d)
    }
    isNoImageData(imageData) {
        let d = imageData.data
        for (let e of d) {
            if (e !== 0) {
                return false
            }
        }
        return true
    }
    fill(point) {
        let imageData = imageDataByCanvas(this.paint.canvasResult)
        let p = point
        let map = {}
        const isInMap = function (point) {
            return !!map[JSON.stringify(point)]
        }
        const setMap = function (point) {
            map[JSON.stringify(point)] = true
        }
        let stack = []
        if (this.isNoImageDataPoint(p)) {
            stack.push(p)
        }
        while (stack.length > 0) {
            let p = stack.pop()
            setMap(p)
            let c = toColorList(Global.color.foreground)
            setImageDataColorByPoint(imageData, p, c)
            let top = {
                x: p.x,
                y: p.y - 1
            }
            let right = {
                x: p.x + 1,
                y: p.y
            }
            let bottom = {
                x: p.x,
                y: p.y + 1
            }
            let left = {
                x: p.x - 1,
                y: p.y
            }
            let l = [
                top,
                right,
                bottom,
                left
            ]
            for (let p of l) {
                let color = colorImageDataByPoint(imageData, p)
                let isBlankPoint = color[3] === 0
                if (isBlankPoint && !isInMap(p)) {
                    stack.push(p)
                }
            }
        }
        this.paint.contextResult.putImageData(imageData, 0, 0)
    }
    draw() {
    }
    update() {
    }
    beforeDestroy() {
    }
}