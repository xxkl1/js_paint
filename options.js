
const LineOptions = class {
    constructor() {
        this.init()
    }
    init() {
        this.lineWidthList = [
            1,
            3,
            5,
            7,
            9
        ]
        this.callBackClickOption = () => {
        }
        this.initOptionsDom()
        this.initOptionSelectDefault()
        this.initOptionsListener()
    }
    initOptionsDom() {
        let chooser = this.chooserLineDiv()
        let option = domToolOption()
        option.appendChild(chooser)
    }
    initOptionSelectDefault() {
        setSelectedToOption(0)
    }
    initOptionsListener() {
        let l = Array.from(domToolOptionList())
        for (let i = 0; i < l.length; i++) {
            let cur = l[i]
            cur.addEventListener('click', () => {
                clearSelectDomToolOptionList()
                setSelectedToOption(i)
                this.callBackClickOption(this.lineWidthList[i], i)
            })
        }
    }
    canvasByLineWidth(lineWidth) {
        let c = document.createElement('canvas')
        c.width = 39
        c.height = 12
        c.style = 'display: flex;'
        let context = contextOfCanvas(c)
        let marginLeftRight = 3
        let pointStart = {
            x: marginLeftRight,
            y: (c.height - lineWidth) / 2
        }
        let reactWidth = c.width - 2 * marginLeftRight
        drawFillRectByStartWh(context, pointStart, reactWidth, lineWidth)
        return c
    }
    chooserLineDiv() {
        let div = document.createElement('div')
        addClassByElement(div, 'chooser')
        addClassByElement(div, 'choose-line')
        let canvasList = this.lineWidthList.map(item => this.canvasByLineWidth(item))
        let canvasWrapDivList = canvasList.map(d => wrapOptionDiv(d))
        canvasWrapDivList.forEach(element => {
            div.appendChild(element)
        })
        return div
    }
}
const RectOptions = class {
    constructor() {
        this.init()
    }
    init() {
        this.callBackClickOption = () => {
        }
        this.initOptionsDom()
        this.initOptionSelectDefault()
        this.initOptionsListener()
    }
    initOptionsDom() {
        let chooser = this.chooserRectDiv()
        let option = domToolOption()
        option.appendChild(chooser)
    }
    initOptionSelectDefault() {
        setSelectedToOption(0)
    }
    initOptionsListener() {
        let l = Array.from(domToolOptionList())
        for (let i = 0; i < l.length; i++) {
            let cur = l[i]
            cur.addEventListener('click', () => {
                clearSelectDomToolOptionList()
                setSelectedToOption(i)
                this.callBackClickOption(i)
            })
        }
    }
    canvasRect1() {
        let c = document.createElement('canvas')
        c.width = 39
        c.height = 21
        c.style = 'display: flex;'
        let margin = 5
        let context = contextOfCanvas(c)
        context.strokeStyle = '#000'
        let pointStart = {
            x: margin,
            y: margin
        }
        drawRectByStartWh(context, pointStart, c.width - 2 * margin, c.height - 2 * margin)
        return c
    }
    canvasRect2() {
        let c = document.createElement('canvas')
        c.width = 39
        c.height = 21
        c.style = 'display: flex;'
        let margin = 5
        let context = contextOfCanvas(c)
        let pointStart = {
            x: margin,
            y: margin
        }
        let params = [
            context,
            pointStart,
            c.width - 2 * margin,
            c.height - 2 * margin
        ]
        context.strokeStyle = '#000'
        drawRectByStartWh(...params)
        context.fillStyle = '#777'
        drawFillRectByStartWh(...params)
        return c
    }
    canvasRect3() {
        let c = document.createElement('canvas')
        c.width = 39
        c.height = 21
        c.style = 'display: flex;'
        let margin = 5
        let context = contextOfCanvas(c)
        let pointStart = {
            x: margin,
            y: margin
        }
        context.fillStyle = '#777'
        drawFillRectByStartWh(context, pointStart, c.width - 2 * margin, c.height - 2 * margin)
        return c
    }
    chooserRectDiv() {
        let div = document.createElement('div')
        addClassByElement(div, 'chooser')
        addClassByElement(div, 'choose-rect')
        let canvasList = [
            this.canvasRect1(),
            this.canvasRect2(),
            this.canvasRect3()
        ]
        let canvasWrapDivList = canvasList.map(d => wrapOptionDiv(d))
        canvasWrapDivList.forEach(element => {
            div.appendChild(element)
        })
        return div
    }
}
const PathFuncOptions = class {
    constructor() {
        this.init()
    }
    init() {
        this.callBackClickOption = () => {
        }
        this.initOptionsDom().then(() => {
            this.initOptionSelectDefault()
            this.initOptionsListener()
        })
    }
    initOptionsDom() {
        return this.chooserPathFuncDiv().then(chooser => {
            let option = domToolOption()
            option.appendChild(chooser)
        })
    }
    initOptionSelectDefault() {
        setSelectedToOption(0)
    }
    initOptionsListener() {
        let l = Array.from(domToolOptionList())
        for (let i = 0; i < l.length; i++) {
            let cur = l[i]
            cur.addEventListener('click', () => {
                clearSelectDomToolOptionList()
                setSelectedToOption(i)
                this.callBackClickOption(i)
            })
        }
    }
    canvasByIndex(modeType) {
        return loadImage('./images/options-transparency.png').then(img => {
            let widthImg = img.width
            let heightImg = img.height
            let heightImgHalf = heightImg / 2
            let c = document.createElement('canvas')
            c.width = 39
            c.height = 27
            c.style = 'display: flex; filter: invert(0%);'
            let context = contextOfCanvas(c)
            let offset = (c.width - widthImg) / 2
            if (modeType === ModeTypeEmu.one) {
                context.drawImage(img, 0, 0, widthImg, heightImgHalf, offset, offset, widthImg, heightImgHalf)
            } else if (modeType === ModeTypeEmu.two) {
                context.drawImage(img, 0, heightImgHalf, widthImg, heightImgHalf, offset, offset, widthImg, heightImgHalf)
            }
            return c
        })
    }
    chooserPathFuncDiv() {
        let div = document.createElement('div')
        addClassByElement(div, 'chooser')
        addClassByElement(div, 'choose-path-func')
        return Promise.all([
            this.canvasByIndex(ModeTypeEmu.one),
            this.canvasByIndex(ModeTypeEmu.two)
        ]).then(canvasList => {
            let canvasWrapDivList = canvasList.map(item => wrapOptionDiv(item))
            canvasWrapDivList.forEach(element => {
                div.appendChild(element)
            })
            return div
        })
    }
}