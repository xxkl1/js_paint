
const log = console.log.bind(console)
const e = sel => document.querySelector(sel)
const eAll = sel => document.querySelectorAll(sel)
const pointFromEvent = function (event) {
    return {
        x: event.offsetX,
        y: event.offsetY
    }
}
const setImageDataColorByPoint = function (imageData, point, color = [
    0,
    0,
    0,
    255
]) {
    let lenRgba = 4
    let w = imageData.width
    let x = point.x
    let y = point.y
    let lenOneRow = lenRgba * w
    let startX = lenOneRow * y
    let offset = startX + lenRgba * x
    let d = imageData.data
    for (let i = 0; i < color.length; i++) {
        d[offset + i] = color[i]
    }
}
const colorImageDataByPoint = function (imageData, point) {
    let lenRgba = 4
    let w = imageData.width
    let x = point.x
    let y = point.y
    let lenOneRow = lenRgba * w
    let startX = lenOneRow * y
    let offset = startX + lenRgba * x
    let d = imageData.data
    return [
        d[offset],
        d[offset + 1],
        d[offset + 2],
        d[offset + 3]
    ]
}
const imageDataByCanvas = function (canvas) {
    let c = canvas.getContext('2d')
    let w = canvas.width
    let h = canvas.height
    return c.getImageData(0, 0, w, h)
}
const copyCanvas = function (canvas) {
    let w = canvas.width
    let h = canvas.height
    let context = canvas.getContext('2d')
    let d = context.getImageData(0, 0, w, h)
    let canvasCopy = document.createElement('canvas')
    let contextCopy = canvasCopy.getContext('2d')
    canvasCopy.width = w
    canvasCopy.height = h
    contextCopy.putImageData(d, 0, 0)
    return canvasCopy
}
const isInRect = function (point, pointStart, pointEnd) {
    let inX = point.x >= pointStart.x && point.x <= pointEnd.x
    let inY = point.y >= pointStart.y && point.y <= pointEnd.y
    return inX && inY
}
const drawSecondOrderBezier = function (context, start, control, end) {
    let ctx = context
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.quadraticCurveTo(control.x, control.y, end.x, end.y)
    ctx.stroke()
}
const drawThreeOrderBezier = function (context, start, control1, control2, end) {
    let ctx = context
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y)
    ctx.stroke()
}
const drawLine = function (context, start, end) {
    let ctx = context
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()
}
const setHtmlToElementSpec = function (element, html) {
    element.innerHTML = html
}
const setHtmlToElement = function (select, html) {
    const element = e(select)
    element.innerHTML += html
}
const addHtmlToElement = function (select, html) {
    const element = e(select)
    element.innerHTML += html
}
const widthByStartEnd = function (start, end) {
    let w = end.x - start.x + 1
    return w
}
const heightByStartEnd = function (start, end) {
    let h = end.y - start.y + 1
    return h
}
const centerByStartEnd = function (start, end) {
    let w = widthByStartEnd(start, end)
    let h = heightByStartEnd(start, end)
    let wHalf = (w - 1) / 2
    let hHalf = (h - 1) / 2
    let r = {
        x: start.x + wHalf,
        y: start.y + hHalf
    }
    return r
}
const testCenterByStartEnd = function () {
    centerByStartEnd({
        x: 0,
        y: 0
    }, {
        x: 2,
        y: 2
    })
    centerByStartEnd({
        x: 0,
        y: 0
    }, {
        x: 3,
        y: 3
    })
}
const drawCircle = function (context, center, radiusX, radiusY) {
    let ctx = context
    ctx.beginPath()
    ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, 2 * Math.PI)
    ctx.stroke()
}
const drawCircleStartEnd = function (context, start, end) {
    let center = centerByStartEnd(start, end)
    let radiusX = widthByStartEnd(start, end) / 2
    let radiusY = heightByStartEnd(start, end) / 2
    drawCircle(context, center, radiusX, radiusY)
}
const drawRect = function (context, start, end) {
    let w = widthByStartEnd(start, end)
    let h = heightByStartEnd(start, end)
    context.strokeRect(start.x, start.y, w, h)
}
const drawRectByStartWh = function (context, start, w, h) {
    context.strokeRect(start.x, start.y, w, h)
}
const drawFillRectByStartWh = function (context, start, w, h) {
    context.fillRect(start.x, start.y, w, h)
}
const radiusRect = (context, left, top, width, height, r) => {
    let ctx = context
    const pi = Math.PI
    ctx.beginPath()
    ctx.arc(left + r, top + r, r, -pi, -pi / 2)
    ctx.arc(left + width - r, top + r, r, -pi / 2, 0)
    ctx.arc(left + width - r, top + height - r, r, 0, pi / 2)
    ctx.arc(left + r, top + height - r, r, pi / 2, pi)
    ctx.closePath()
    ctx.stroke()
}
const drawCircleReactangle = function (context, start, end) {
    let w = widthByStartEnd(start, end)
    let h = heightByStartEnd(start, end)
    radiusRect(context, start.x, start.y, w, h, 10)
}
const genRandom = function (min, max) {
    return Math.round(Math.random() * (max - min)) + min
}
const drawSinglePixel = function (context, point, color = [
    0,
    0,
    0,
    255
]) {
    let c = context
    var imageData = c.createImageData(1, 1)
    var d = imageData.data
    for (let i = 0; i < color.length; i++) {
        d[i] = color[i]
    }
    c.putImageData(imageData, point.x, point.y)
}
const isSame = function (a, b) {
    return JSON.stringify(a) === JSON.stringify(b)
}
const toColorList = function (colorStr) {
    let s = colorStr.replace('rgb', '')
    s = s.replace('rgba', '')
    s = s.replace(' ', '')
    s = s.replace('(', '')
    s = s.replace(')', '')
    let l = s.split(',').map(s => Number(s))
    if (l.length === 3) {
        l.push(255)
    }
    return l
}
const testToColorList = function () {
    let l = toColorList('rgb(128, 128, 128)')
    log(l)
}
const addClass = function (select, className) {
    const el = e(select)
    el.classList.add(className)
}
const addClassByElement = function (element, className) {
    element.classList.add(className)
}
const removeClassByElement = function (element, className) {
    element.classList.remove(className)
}
const testAddClass = function () {
    addClass('.paint', 'test_name')
    addClass('.paint', 'test_name2')
}
const removeClass = function (select, className) {
    const el = e(select)
    el.classList.remove(className)
}
const testRemoveClass = function () {
    removeClass('#select', 'test_name')
}
const loadImage = function (path) {
    return new Promise(resolve => {
        let img = new Image()
        img.src = path
        img.onload = () => {
            resolve(img)
        }
    })
}
const inverElement = function (element) {
    element.style += 'filter: invert(100%)'
}
const contextOfCanvas = function (canvas) {
    return canvas.getContext('2d')
}
const wrapOptionDiv = function (canvas) {
    let div = document.createElement('div')
    div.style = 'display: flex;'
    addClassByElement(div, 'tool-option')
    div.appendChild(canvas)
    return div
}
const clearToolOption = function () {
    domToolOption().innerHTML = ''
}
const domToolOption = function () {
    return e('.tool-options')
}
const domToolOptionList = function () {
    let d = domToolOption()
    return d.children[0].children
}
const clearSelectDomToolOptionList = function (dom) {
    let l = Array.from(domToolOptionList())
    let className = 'selected'
    let classNameInvert = 'invert'
    l.forEach(e => {
        let canvas = e.children[0]
        removeClassByElement(e, className)
        removeClassByElement(canvas, classNameInvert)
    })
}
const setSelectedToOption = function (index) {
    let className = 'selected'
    let classNameInvert = 'invert'
    let d = domToolOptionList()[index]
    let canvas = d.children[0]
    addClassByElement(d, className)
    addClassByElement(canvas, classNameInvert)
}