export class ImgVC {
    constructor(imgData = {}) {
        this.imgPage = {
            identifyCodes: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            identifyCode: '',
            codeNum: 4,
            fontSizeMin: 24,
            fontSizeMax: 30,
            backgroundColorMin: 180,
            backgroundColorMax: 240,
            colorMin: 50,
            colorMax: 160,
            lineColorMin: 40,
            lineColorMax: 180,
            dotColorMin: 0,
            dotColorMax: 255,
            contentWidth: 140,
            contentHeight: 60
        }
        this.init(imgData)

    }

    init(imgData) {
        for (let i = 0; i < this.imgPage.codeNum; i++) {
            this.imgPage.identifyCode += this.imgPage.identifyCodes[
                this.randomNum(0, this.imgPage.identifyCodes.length)
                ];
        }
        for (let item in this.imgPage) {
            if (imgData[item]) {
                this.imgPage[item] = imgData[item]
            }
        }
    }

    // 生成一个随机数
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min)
    }


    // 生成一个随机的颜色
    randomColor(min, max) {
        let r = this.randomNum(min, max)
        let g = this.randomNum(min, max)
        let b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    }


    drawPic() {
        let canvas = document.createElement('canvas')
        canvas.width = this.imgPage.contentWidth
        canvas.height = this.imgPage.contentHeight
        let ctx = canvas.getContext('2d')
        ctx.textBaseline = 'bottom'
        // 绘制背景
        ctx.fillStyle = this.randomColor(this.imgPage.backgroundColorMin, this.imgPage.backgroundColorMax)
        ctx.fillRect(0, 0, this.imgPage.contentWidth, this.imgPage.contentHeight)
        this.drawLine(ctx)
        this.drawDot(ctx)
        // 绘制文字
        for (let i = 0; i < this.imgPage.identifyCode.length; i++) {
            this.drawText(ctx, this.imgPage.identifyCode[i], i)
        }
        return {
            name: this.imgPage.identifyCode,
            url: canvas.toDataURL('image/png')
        }
    }


    drawText(ctx, txt, i) {
        ctx.fillStyle = this.randomColor(this.imgPage.colorMin, this.imgPage.colorMax)
        ctx.font = this.randomNum(this.imgPage.fontSizeMin, this.imgPage.fontSizeMax) + 'px SimHei'
        let x = (i + 1) * (this.imgPage.contentWidth / (this.imgPage.identifyCode.length + 2))
        let y = this.randomNum(this.imgPage.fontSizeMin, this.imgPage.contentHeight)
        var deg = this.randomNum(1, 45)
        // 修改坐标原点和旋转角度
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        // 恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
    }


    drawLine(ctx) {
        // 绘制干扰线
        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = this.randomColor(this.imgPage.lineColorMin, this.imgPage.lineColorMax)
            ctx.beginPath()
            ctx.moveTo(this.randomNum(0, this.imgPage.contentWidth), this.randomNum(0, this.imgPage.contentHeight))
            ctx.lineTo(this.randomNum(0, this.imgPage.contentWidth), this.randomNum(0, this.imgPage.contentHeight))
            ctx.stroke()
        }
    }


    drawDot(ctx) {
        // 绘制干扰点
        for (let i = 0; i < 10; i++) {
            ctx.fillStyle = this.randomColor(0, 255)
            ctx.beginPath()
            ctx.arc(this.randomNum(0, this.imgPage.contentWidth), this.randomNum(0, this.imgPage.contentHeight), 1, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
}