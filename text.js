
const sliceStrByLen = function (str, len) {
    var strArr = []
    var n = len
    for (var i = 0, l = str.length; i < l / n; i++) {
        var a = str.slice(n * i, n * (i + 1))
        strArr.push(a)
    }
    return strArr
}
class TextFuc {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.statusEmu = {
            init: 'init',
            drow: 'drow',
            showText: 'showText'
        }
        this.setup()
        this.setupInputSelect()
        this.initOptions()
    }
    setup() {
        this.margin = 10
        this.status = this.statusEmu.init
        this.start = null
        this.end = null
        this.showLine = false
        this.text = ''
        this.fontSize = 14
        this.lineHeight = 18
        this.spaceTextHalf = (this.lineHeight - this.fontSize) / 2
        this.fontWidth = 8.4
        this.fps = 0
        this.listText = []
    }
    initOptions() {
        this.optionType = ModeTypeEmu.one
        let options = new PathFuncOptions()
        options.callBackClickOption = i => {
            this.optionType = modeTypeByIndex(i)
        }
    }
    setupInputSelect() {
        window.addEventListener('keyup', event => {
            let key = event.key
            if (this.start && this.end) {
                if (key === 'Backspace') {
                    this.deleteText()
                } else {
                    this.addText(key)
                }
                this.updateTextLine()
            }
        })
    }
    updateTextLine() {
        let w = this.reactWidth() - this.margin * 2
        let h = this.reactHeight() - this.margin * 2
        this.countLine = Math.floor(w / this.fontWidth)
        this.countVerticleLine = Math.floor(h / this.lineHeight)
        this.listText = sliceStrByLen(this.text, this.countLine)
        this.listText = this.listText.slice(0, this.countVerticleLine)
    }
    deleteText() {
        this.text = this.text.slice(0, this.text.length - 1)
    }
    addText(text) {
        this.text += text
    }
    reset() {
        this.setup()
    }
    reactWidth() {
        return this.end.x - this.start.x
    }
    reactHeight() {
        return this.end.y - this.start.y
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
        if (this.isStatus(this.statusEmu.init)) {
            this.start = point
        }
        if (this.isStatus(this.statusEmu.showText)) {
            let inX = point.x >= this.end.x - 10 && point.x <= this.end.x + 10
            let inY = point.y >= this.end.y - 10 && point.y <= this.end.y + 10
            if (inX && inY) {
                this.status = this.statusEmu.drow
            }
        }
    }
    handleMousemove(point) {
        let l = [
            this.statusEmu.init,
            this.statusEmu.drow
        ]
        if (this.isStatusList(l)) {
            this.end = point
            this.status = this.statusEmu.drow
            this.updateTextLine()
        }
    }
    canDrawRect() {
        return this.start && this.end
    }
    handleMouseup(point) {
        if (this.isStatus(this.statusEmu.drow)) {
            this.end = point
            this.status = this.statusEmu.showText
        }
        if (this.isStatus(this.statusEmu.showText) && !isInRect(point, this.start, this.end)) {
            this.paint.context.save()
            this.paint.contextResult.save()
            this.paint.updateColorByGlobal()
            this.paint.clear()
            this.drawText()
            this.paint.setContextResult()
            this.reset()
            this.context.restore()
            this.contextResult.restore()
        }
    }
    drawLine() {
        let last = this.listText[this.listText.length - 1] || ''
        let x = this.start.x + this.margin + last.length * this.fontWidth
        let countLine = this.listText.length || 1
        let fixHeight = 2
        let y = this.start.y + this.margin + this.spaceTextHalf + fixHeight + (countLine - 1) * this.lineHeight
        let w = 2
        let h = this.lineHeight
        this.context.fillRect(x, y, w, h)
    }
    drawText() {
        this.context.font = `${ this.fontSize }px monospace`
        let x = this.start.x + this.margin
        for (let i = 0; i < this.listText.length; i++) {
            let text = this.listText[i]
            let y = this.start.y + this.margin + this.lineHeight * (i + 1)
            this.context.fillText(text, x, y)
        }
    }
    drawRect() {
        let w = this.reactWidth()
        let h = this.reactHeight()
        this.context.setLineDash([
            3,
            7
        ])
        this.context.strokeRect(this.start.x, this.start.y, w, h)
    }
    draw() {
        this.context.save()
        let lShowRect = [
            this.statusEmu.drow,
            this.statusEmu.showText
        ]
        if (this.isStatusList(lShowRect)) {
            this.drawRect()
        }
        let lShowLine = [
            this.statusEmu.drow,
            this.statusEmu.showText
        ]
        if (lShowLine.includes(this.status)) {
            if (this.showLine) {
                this.drawLine()
            }
            this.drawText()
        }
        this.context.restore()
    }
    update() {
        this.fps++
        if (this.fps > 15) {
            this.showLine = !this.showLine
            this.fps = 0
        }
    }
}