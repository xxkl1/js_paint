
class Line {
    constructor(canvas, context, paint) {
        this.canvas = canvas
        this.context = context
        this.paint = paint
        this.setup()
        this.initOptions()
    }
    setup() {
        this.start = null
        this.end = null
        this.lineWidth = 1
    }
    initOptions() {
        let options = new LineOptions()
        options.callBackClickOption = lineWidth => {
            this.lineWidth = lineWidth
        }
    }
    canvasByLineWidth(lineWidth) {
        let c = document.createElement('canvas')
        c.width = 39
        c.height = 12
        c.style = 'display: flex;'
        let ctx = c.getContext('2d')
        ctx.fillStyle = '#000'
        let y = (c.height - lineWidth) / 2
        let margin = 3
        let reactWidth = c.width - 2 * margin
        ctx.fillRect(margin, y, reactWidth, lineWidth)
        let div = document.createElement('div')
        div.style = 'display: flex;'
        div.classList.add('tool-option')
        div.appendChild(c)
        div.lineWidth = lineWidth
        return div
    }
    canvasOfOption(div) {
        return div.children[0]
    }
    setToolOptions() {
        let toolOptions = e('.tool-options')
        toolOptions.innerHTML = ''
        this.lineWidthList.forEach((w, index) => {
            let div = this.canvasByLineWidth(w)
            div.addEventListener('click', () => {
                this.resetAllToolOptions()
                div.classList.add('selected')
                let cavans = this.canvasOfOption(div)
                cavans.style = 'filter: invert(100%)'
                this.lineWidth = div.lineWidth
            })
            toolOptions.appendChild(div)
            this.toolOptionDomList.push(div)
            if (index === 0) {
                div.classList.add('selected')
                let cavans = this.canvasOfOption(div)
                cavans.style = 'filter: invert(100%)'
            }
        })
    }
    resetAllToolOptions() {
        this.toolOptionDomList.forEach(e => {
            e.classList.remove('selected')
            let cavans = this.canvasOfOption(e)
            cavans.style = 'filter: invert(0%)'
        })
    }
    reset() {
        this.start = null
        this.end = null
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
    handleMouseup() {
        this.reset()
        this.paint.setContextResult()
    }
    draw() {
        if (this.start && this.end) {
            this.context.lineWidth = this.lineWidth
            this.context.beginPath()
            this.context.moveTo(this.start.x, this.start.y)
            this.context.lineTo(this.end.x, this.end.y)
            this.context.stroke()
        }
    }
    update() {
    }
}