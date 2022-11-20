
const ColorPattle = class {
    constructor() {
        this.callBackClick = () => {
        }
        this.init()
    }
    init() {
        this.initPattleDom()
        this.initListener()
    }
    initPattleDom() {
        let t = this.templateTwoColorPattle() + this.templatePattle()
        addHtmlToElement('#color_select', t)
    }
    initListener() {
        this.initListenerPattle()
        this.initListenerTwoColor()
    }
    initListenerPattle() {
        let l = eAll('.color_btn')
        l = Array.from(l)
        for (let e of l) {
            e.addEventListener('click', event => {
                let t = event.target
                let color = t.title
                if (color) {
                    this.headColorDom().style.backgroundColor = color
                    this.updateGlobalColor()
                    this.callBackClick(color)
                }
            })
            e.addEventListener('dblclick', event => {
                log('dblclick')
                e.children[0].click()
            })
            e.children[0].addEventListener('change', event => {
                let e = event.target
                this.headColorDom().style.backgroundColor = e.value
                this.updateGlobalColor()
            }, false)
        }
    }
    exchangeColor() {
        let head = this.headColorDom().style.backgroundColor
        let back = this.backColorDom().style.backgroundColor
        this.headColorDom().style.backgroundColor = back
        this.backColorDom().style.backgroundColor = head
        this.updateGlobalColor()
    }
    updateGlobalColor() {
        let head = this.headColorDom().style.backgroundColor
        let back = this.backColorDom().style.backgroundColor
        Global.color.foreground = head
        Global.color.back = back
    }
    headColorDom() {
        return eAll('.color_selection')[0]
    }
    backColorDom() {
        return eAll('.color_selection')[1]
    }
    initListenerTwoColor() {
        let element = e('.current_colors')
        element.addEventListener('click', () => {
            this.exchangeColor()
        })
    }
    templateColorBtn(colorStr) {
        return `<div class="color_btn" title="${ colorStr }" style="background-color: ${ colorStr }; position: relative;">
            <input type="color" value="${ colorStr }" style="display: flex; font-size: 0; opacity: 0; width: 100%; height: 100%; box-sizing: content-box; margin: 0; padding: 0; border: none; position: absolute; left: 0; top: 0; z-index: -1;" />
        </div>`
    }
    templateColorBtnList(colorStrList) {
        let s = ''
        for (let c of colorStrList) {
            s += this.templateColorBtn(c)
        }
        return s
    }
    templatePattle() {
        let palette1 = [
            '#000000',
            '#787878',
            '#790300',
            '#757A01',
            '#007902',
            '#007778',
            '#0A0078',
            '#7B0077',
            '#767A38',
            '#003637',
            '#286FFE',
            '#083178',
            '#4C00FE',
            '#783B00'
        ]
        let palette2 = [
            '#FFFFFF',
            '#BBBBBB',
            '#FF0E00',
            '#FAFF08',
            '#00FF0B',
            '#00FEFF',
            '#3400FE',
            '#FF00FE',
            '#FBFF7A',
            '#00FF7B',
            '#76FEFF',
            '#8270FE',
            '#FF0677',
            '#FF7D36'
        ]
        let t = `
        <div id="pattle">
            <div class="color_btn_list">
                ${ this.templateColorBtnList(palette1) }
            </div>
            <div class="color_btn_list">
                ${ this.templateColorBtnList(palette2) }
            </div>
        </div>`
        return t
    }
    templateTwoColorPattle() {
        return `
            <div class="current_colors">
                <div class="color_selection" style="position: absolute; left: 2px; top: 4px; background-color: ${ Global.color.foreground }; z-index: 1;"></div>
                <div class="color_selection" style="position: absolute; right: 3px; bottom: 3px; background-color: ${ Global.color.back }"></div>
            </div>`
    }
}