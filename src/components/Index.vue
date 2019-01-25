<template>
    <Row type="flex" justify="center" style="margin: 40px 0;">
        <Col span="18">
            <Card style="min-height: calc(100vh - 90px);">
                <p slot="title" style="font-size: 30px; height: 40px;line-height: 40px; color: #777; font-weight: initial;">
                    <Icon type="md-color-wand" size="30" color="#2d8cf0" />
                    验证码检验
                </p>
                <cm-echarts v-if="correct_data" :ec-data="correct_data" type="pie" :is-click="true" base="USE"></cm-echarts>
                <Tabs>
                    <!--<TabPane label="上传">-->
                    <!--<Button type="primary">update</Button>-->
                    <!--</TabPane>-->
                    <TabPane label="图片地址">
                        <Row :gutter="20">
                            <Col span="8">
                                <Input placeholder="请输入URL" v-model="imgUrl" />
                            </Col>
                            <Col span="8">
                                <Input placeholder="执行次数" v-model="imgNum" />
                            </Col>
                            <Col span="8">
                                <Button type="primary" @click="pushImg" :disabled="!isSave">确定</Button>
                            </Col>
                        </Row>
                        <div class="tipBox" v-show="!isSave">请提确认提交后再次获取新的数据</div>
                    </TabPane>
                </Tabs>
                <Row class="imgBox" :gutter="20" type="flex">
                    <Col class="imgContent" v-for="(item,index) in imgList" :key="index" :lg="{span: 3}" :md="{span: 4}" :sm="{span: '6'}" :xs="{span: '6'}">
                        <img :src="'/api/show_image/' + item.url" alt="">
                        <Input class="input" @on-change="imgChange(item)" :class="{'inputColor': !item.changes}" v-model="item.name" />
                    </Col>
                </Row>
                <div>
                    <Button type="primary" @click="saveImg">提交</Button>
                </div>
            </Card>
        </Col>
    </Row>
</template>

<script>
    import {Row, Col, Card, Icon, Input, TabPane, Tabs, Button, Message} from 'iview'
    import cmEcharts from './echarts'

    export default {
        name: 'Index',
        data() {
            return {
                imgList: [],
                imgUrl: '',
                imgNum: '',
                isSave: true,
                correct_data: {
                    title: '验证码准确率',
                    // subTitle: '( 点击图表扇形块可查看详情 )',
                    toolTitle: '验证码准确率',
                    data: [{
                        name: '正确',
                        value: '100'
                    }],
                    cursor: 'pointer',
                    detailUrl: '/dashboard/message_detail'
                },
            }
        },
        mounted() {
        },
        methods: {
            pushImg() {
                this.imgList = []
                // captcha_url= https://uac.10010.com/portal/Service/CreateImage &loops=2
                this.axios.post(`/api/upload`, {
                    captcha_url: this.imgUrl,
                    loops: this.imgNum
                }).then(res => {
                    this.correct_data.data = [
                        {
                            name: '正确率',
                            value: 100
                        }
                    ]
                    this.imgList = res.data
                    this.isSave = false
                })
            },
            imgChange(item) {
                item.changes = true
            },
            saveImg() {
                this.isSave = true
                let data = this.imgList.filter(v => v.changes)
                this.axios.post(`/api/remark_captcha`, {
                    data: data
                }).then(res => {
                    this.correct_data.data = [
                        {
                            name: '正确率',
                            value: this.imgList.length - data.length
                        },
                        {
                            name: '错误率',
                            value: data.length
                        }
                    ]
                    Message.info(res.data.message)
                })
            }
        },
        components: {
            cmEcharts,
            Row,
            Col,
            Card,
            Icon,
            Input,
            TabPane,
            Tabs,
            Button
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .imgBox {
        margin-top: 20px;
        .imgContent {
            margin: 0 0 20px 0;
            display: flex;
            flex-direction: column;
            img {
                width: 100%;
                border: 1px solid #ccc;
                margin-bottom: 10px;
            }
            /deep/ .input > input {
                letter-spacing: 2px;
                font-size: 16px;
                color: #2d8cf0;
            }
            /deep/ .inputColor > input {
                color: #ccc;
            }
        }
    }

    .tipBox {
        margin: 10px 0;
        color: #ed4014;
    }
</style>
