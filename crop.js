
class Crop {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.contextResult = this.paint.contextResult
        this.setup()
        this.initOptions()
    }
    setup() {
        this.status = 0
        this.showRect = false
        this.start = null
        this.end = null
        this.dataOrigin = null
        this.offsetPoint = {
            x: 0,
            y: 0
        }
        this.pointMoveDown = {
            x: 0,
            y: 0
        }
        this.pointMosueMove = {
            x: 0,
            y: 0
        }
        this.preMouseMove = null
    }
    initOptions() {
        this.optionType = ModeTypeEmu.one
        let options = new PathFuncOptions()
        options.callBackClickOption = i => {
            this.optionType = modeTypeByIndex(i)
        }
    }
    reset() {
        this.setup()
    }
    static instance(...params) {
        this.i = this.i || new this(...params)
        return this.i
    }
    handleMousedown(point) {
        this.pointMoveDown = point
        if (this.dataOrigin) {
            if (!this.isOutRect(point)) {
                this.status = 3
                this.draw()
                this.paint.setContextResult()
                this.setup()
                this.status = 3
            }
        }
        this.contextResult.beginPath()
        this.contextResult.moveTo(point.x, point.y)
    }
    isOutRect(point) {
        let x = point.x
        let y = point.y
        if (this.start) {
            let inX = x >= this.start.x && x <= this.start.x + this.rectWidth - 1
            let inY = y >= this.start.y && y <= this.start.y + this.rectHeight - 1
            return inX && inY
        } else {
            return false
        }
    }
    handleMousemove(point) {
        this.pointMosueMove = point
        if (this.status === 3) {
            this.status = 0
        }
        if (this.status === 1) {
            this.status = 2
        }
        if (this.status === 0) {
            this.contextResult.lineTo(point.x, point.y)
            this.contextResult.strokeStyle = '#fff'
            this.contextResult.stroke()
        }
    }
    handleMouseup() {
        if (this.status === 3) {
            this.status = 0
            return
        }
        if (this.dataOrigin) {
        } else {
            this.contextResult.closePath()
            let w = this.canvas.width
            let h = this.canvas.height
            let dataOrigin = this.contextResult.getImageData(0, 0, w, h)
            this.contextResult.fillStyle = '#fff'
            this.contextResult.fill('evenodd')
            let minX = null
            let minY = null
            let maxX = null
            let maxY = null
            for (let x = 0; x < w; x++) {
                for (let y = 0; y < h; y++) {
                    let p = {
                        x,
                        y
                    }
                    if (this.contextResult.isPointInPath(x, y, 'evenodd')) {
                        if (minX === null) {
                            minX = x
                        } else if (x < minX) {
                            minX = x
                        }
                        if (minY === null) {
                            minY = y
                        } else if (y < minY) {
                            minY = y
                        }
                        if (maxX === null) {
                            maxX = x
                        } else if (x > maxX) {
                            maxX = x
                        }
                        if (maxY === null) {
                            maxY = y
                        } else if (y > maxY) {
                            maxY = y
                        }
                    } else {
                        setImageDataColorByPoint(dataOrigin, p, [
                            0,
                            0,
                            0,
                            0
                        ])
                    }
                }
            }
            this.start = {
                x: minX,
                y: minY
            }
            this.rectWidth = maxX - minX
            this.rectHeight = maxY - minY
            this.dataOrigin = dataOrigin
            this.status = 1
        }
        if (this.status === 2) {
            this.status = 1
            this.preMouseMove = null
        }
    }
    draw() {
        this.context.save()
        if (this.status === 2) {
            let moveXy = {
                x: 0,
                y: 0
            }
            if (this.preMouseMove) {
                moveXy.x = this.pointMosueMove.x - this.preMouseMove.x
                moveXy.y = this.pointMosueMove.y - this.preMouseMove.y
            } else {
                moveXy.x = this.pointMosueMove.x - this.pointMoveDown.x
                moveXy.y = this.pointMosueMove.y - this.pointMoveDown.y
            }
            this.offsetPoint = {
                x: this.offsetPoint.x + moveXy.x,
                y: this.offsetPoint.y + moveXy.y
            }
            if (this.start) {
                this.start = {
                    x: this.start.x + moveXy.x,
                    y: this.start.y + moveXy.y
                }
            }
            this.preMouseMove = this.pointMosueMove
        }
        if ([
                1,
                2,
                3
            ].includes(this.status) && this.dataOrigin) {
            this.context.setLineDash([
                3,
                7
            ])
            this.context.putImageData(this.dataOrigin, this.offsetPoint.x, this.offsetPoint.y)
        }
        if ([
                1,
                2
            ].includes(this.status)) {
            this.context.strokeRect(this.start.x, this.start.y, this.rectWidth, this.rectHeight)
        }
        this.context.restore()
    }
    update() {
    }
}