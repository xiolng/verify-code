<template>
  <div class="echartsBox">
    <div id="my-echarts" :style="{width:elWidth,height:elHeight}"></div>
    <slot></slot>
  </div>

</template>

<script>
  import echarts from 'echarts'
  import {debounce} from './utils'

  require('echarts/theme/macarons')
  export default {
    name: 'cm-echarts',
    props: {
      ecData: Object,
      type: String,
      isClick: Boolean,
      date: String,
      base: String,
      elWidth: {
        type: String,
        default: '100%'
      },
      elHeight: {
        type: String,
        default: '400px'
      },
      getTableList: Function
    },
    data() {
      return {
        myEchart: null
      }
    },
    mounted() {
      this.initEcharts()
      this.__resizeHandler = debounce(() => {
        if (this.myEchart) {
          this.myEchart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    },
    beforeDestroy() {
      if (!this.myEchart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHandler)
      this.myEchart.dispose()
      this.myEchart = null
    },
    methods: {
      async renderEcharts(myEchart) {
        let option = require('./type')[this.type](this.ecData)
        // option.color = new ColorList(colors, 5)
        await myEchart.setOption(option, true)
      },
      initEcharts() {
        this.myEchart = echarts.init(this.$el.children[0], 'macarons')
        this.renderEcharts(this.myEchart).then(() => {
          if (this.type !== 'pie') {
            this.myEchart.resize()
          }
        })
        this.myEchart.on('click', () => {
          // if (params.seriesType === 'pie' && this.isClick) {
          //   this.$router.push(`${this.ecData.detailUrl}/${params.value}/${params.name}/${this.base}`)
          // }
          // if (params.seriesType !== 'pie' && this.ecData.isDetailUrl) {
          //   this.getTableList(params.name)
          // }
        })
      }
    },
    watch: {
      'ecData.data'() {
        this.myEchart.clear()
        this.renderEcharts(this.myEchart)
      }
    }
  }
</script>

<style scoped lang="less">
  .echartsBox {
    height: 100%;
  }
</style>
