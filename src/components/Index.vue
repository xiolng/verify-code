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
                                <Select
                                        v-model="imgUrl"
                                        filterable
                                        transfer
                                        placeholder="请输入URL"
                                >
                                    <Option
                                            v-for="item in urlList"
                                            :key="item.id"
                                            :value="item.value"
                                            :label="item.name"
                                    />
                                </Select>
                            </Col>
                            <Col span="8">
                                <Input placeholder="执行次数" v-model="imgNum" />
                            </Col>
                            <Col span="8">
                                <Button type="primary" @click="pushImg" :disabled="!isSave">确定</Button>
                            </Col>
                        </Row>
                        <div class="tipBox" v-show="!isSave">请提确认提交后再次获取新的数据</div>
                        <Row v-show="percentNum >= 1">
                            <Col span="16">
                                <Progress :percent="percentNum" status="active" />
                            </Col>

                        </Row>
                    </TabPane>
                </Tabs>
                <div style="position: relative;">
                    <Row class="imgBox" :gutter="20" type="flex">
                        <Col class="imgContent" v-for="(item,index) in imgList" :key="index" :lg="{span: 3}" :md="{span: 4}" :sm="{span: '6'}" :xs="{span: '6'}">
                            <img :src="'/api/show_image/' + item.url" alt="">
                            <Input class="input" @on-change="imgChange(item)" :class="{'inputColor': !item.changes}" v-model="item.name" />
                        </Col>
                        <Spin size="large" fix v-if="percentNum"></Spin>
                    </Row>
                    <div>
                        <Button type="primary" @click="saveImg">提交</Button>
                    </div>
                </div>
            </Card>
        </Col>
    </Row>
</template>

<script>
    import {Row, Col, Card, Icon, Input, TabPane, Tabs, Button, Message, Spin, Progress, Select, Option} from 'iview'
    import cmEcharts from './echarts'

    export default {
        name: 'Index',
        data() {
            return {
                imgList: [],
                imgUrl: '',
                imgNum: '',
                percentNum: 0,
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
                urlList: [
                    {name: 'uac.10010.com', value: 'https://uac.10010.com/portal/Service/CreateImage', id: 0},
                    {
                        name: 'skypearl.csair.com',
                        value: 'https://skypearl.csair.com/skypearl/cn/dot/validatorAction.action?valType=1',
                        id: 1
                    },
                    {
                        name: 'epass.icbc.com.cn',
                        value: 'https://epass.icbc.com.cn/servlet/ICBCVerificationCodeImageCreate?randomId=1543978661626364767&height=36&width=90&appendRandom=1543978702341',
                        id: 2
                    },
                    {name: 'shop.10086.cn', value: 'https://shop.10086.cn/i/authImg', id: 3},
                    {name: 'iir.circ.gov.cn', value: 'http://iir.circ.gov.cn/web/servlet/ValidateCode', id: 4},
                    {name: 'login.bthhotels.com', value: 'https://login.bthhotels.com/home/GetIdentyCode', id: 5},
                    {name: 'fj.ac.10086.cn', value: 'https://fj.ac.10086.cn/common/image.jsp', id: 6},
                ]
            }
        },
        mounted() {
        },
        methods: {
            pushImg() {
                this.imgList = []
                // captcha_url= https://uac.10010.com/portal/Service/CreateImage &loops=2
                if (this.imgNum <= 10) {
                    this.getDataList(this.imgNum)
                    return false
                }
                let defaultNum = 1
                let num = Math.floor(this.imgNum / 10)
                let lastNum = this.imgNum % 10
                this.splitData(defaultNum, num, lastNum)
            },
            /**
             * 拆分多次请求， 每次请求10条
             * @param defaultNum 默认第一次
             * @param num 总共次数
             * @param lastNum 不足10条的请求数量
             */
            splitData(defaultNum, num, lastNum) {
                let numSplit = defaultNum
                if (numSplit <= num) {
                    this.getDataList(10).then(() => {
                        this.percentNum = Math.floor((numSplit / num) * 100)
                        this.splitData(++numSplit, num, lastNum)
                    })
                } else if (lastNum >= 1) {
                    this.getDataList(lastNum).then(() => {
                        this.percentNum = 100
                        this.percentNum = 0
                    })
                }
            },
            getDataList(num) {
                return this.axios.post(`/api/upload`, {
                    captcha_url: this.imgUrl,
                    loops: num
                }).then(res => {
                    this.correct_data.data = [
                        {
                            name: '正确率',
                            value: 100
                        }
                    ]
                    this.imgList = [...this.imgList, ...res.data]
                    this.isSave = false
                    return this.imgList
                }, () => {
                    this.isSave = true
                })
            },
            /**
             * 验证码更改，监听
             * @param item
             */
            imgChange(item) {
                item.changes = true
            },
            saveImg() {
                Spin.show()
                this.isSave = true
                let data = this.imgList.filter(v => v.changes)
                if (!data.length) {
                    Message.info('提交成功')
                    this.isSave = true
                    Spin.hide()
                    return false
                }
                this.axios.post(`/api/remark_captcha`, {
                    data: data
                }).then(res => {
                    Spin.hide()
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
                }, () => {
                    Spin.hide()
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
            Button,
            Progress,
            Select,
            Option,
            Spin
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
