
const ModeTypeEmu = {
    one: 'one',
    two: 'two',
    three: 'three'
}
const modeTypeByIndex = index => {
    let k = Object.keys(ModeTypeEmu)[index]
    return ModeTypeEmu[k]
}
const TypeEmu = {
    line: '直线',
    pen: '铅笔',
    reactangle: '矩形',
    fill: '填充',
    text: '文字',
    crop: '裁剪',
    enlarge: '放大',
    curve: '曲线',
    polygon: '多边形',
    circle: '圆形',
    circleReactangle: '圆角矩形',
    spray: '喷瓶',
    rubber: '橡皮擦',
    brush: '刷子'
}
const PositionFuncType = {
    line: [
        0,
        -125
    ],
    pen: [
        0,
        -75
    ],
    reactangle: [
        0,
        -150
    ],
    fill: [
        24,
        -25
    ],
    text: [
        24,
        -100
    ],
    crop: [
        0,
        0
    ],
    enlarge: [
        24,
        -50
    ],
    curve: [
        24,
        -125
    ],
    polygon: [
        24,
        -150
    ],
    circle: [
        0,
        -175
    ],
    circleReactangle: [
        24,
        -175
    ],
    spray: [
        0,
        -100
    ],
    rubber: [
        0,
        -25
    ],
    brush: [
        24,
        -75
    ]
}
const Global = {
    color: {
        foreground: 'rgb(0, 0, 0)',
        back: 'rgb(255, 255, 255)'
    }
}