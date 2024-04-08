<template>
	<view>
		<z-paging @query="getLog" v-model="logs" ref="paging">
			<template #top>
				<u-navbar placeholder title="钱包" autoBack bgColor="transparent">
					<view slot="left">
						<i class="mgc_left_line" style="font-size: 60rpx;"></i>
					</view>
				</u-navbar>
				<view class="panel">
					<u-row justify="space-between">
						<text style="color: #999999;">Balance</text>
						<u-avatar size="26" :src="userInfo.avatar"></u-avatar>
					</u-row>
					<u-row style="margin-top: 50rpx;" justify="space-between">
						<u-row style="font-size: 50rpx;">
							<i class="mgc_currency_dollar_line"></i>
							<text style="margin-left: 20rpx;">{{userInfo.assets}}</text>
						</u-row>
						<view style="z-index: 1;">
							<u-button shape="circle" style="height: 60rpx;padding: 0 30rpx;" color="#525252"
								@click="showPayment = true">充值</u-button>
						</view>
					</u-row>
					<u-row style="margin-top: 20rpx;font-size: 40rpx;" justify="space-between">
						<u-row>
							<i class="mgc_VIP_1_line"></i>
							<text
								style="margin-left: 30rpx;font-size: 32rpx;">{{userInfo.vip?$u.timeFormat(userInfo.vip, 'yyyy年mm月dd日'):'未开通'}}</text>
						</u-row>

						<view style="z-index: 1;">
							<u-button shape="circle" style="height: 50rpx;padding: 0 30rpx;" color="#ffcc5c"
								@click="showVip = true">{{$store.state.userInfo.isVip?'续期':'开通'}}</u-button>
						</view>
					</u-row>
					<view style="margin-top: 30rpx;">
						<text style="text-shadow: 1px 1px 1px #000, -1px -1px 1px #fff;color: #999999">
							Virtual Points Bank Card
						</text>
					</view>
					<view class="panel-circle" style="z-index: 0;"></view>
				</view>
				<text style="font-Weight: bold; font-size: 40rpx;margin:0 30rpx;">收支明细</text>
			</template>

			<!-- 收支记录 -->
			<view style="margin: 30rpx;">
				<block v-for="(item,index) in logs" :key="index">
					<view class="task-panel">
						<text>主题：{{item.subject}}</text>
						<text>{{$store.state.currencyName||'积分'}}：{{item.totalAmount}}</text>
						<text>时间：{{$u.timeFormat(item.created,'yyyy-mm-dd hh:MM:ss')}}</text>
					</view>
				</block>
			</view>
		</z-paging>
		<u-popup round="10" :show="showPayment" @close="showPayment = false;selectPackage =payPackage[0]" closeable>
			<view style="padding: 30rpx;">
				<view style="text-align: center;">
					<text>选择充值套餐</text>
				</view>
				<u-grid col="3">
					<u-grid-item v-for="(item,index) in payPackage" :key="index">
						<view class="package" @click="selectPackage = item"
							:style="{background:selectPackage && selectPackage.id == item.id?'#aa96da1e':''}">
							<view class="package-sub">
								<text style="font-size: 26rpx;">￥</text>
								<text style="font-size: 50rpx;">{{item.price}}</text>
							</view>
							<view style="color: #999;text-align: center;font-size: 24rpx;">
								<text>积分{{item.price*config.ratio}}</text>
							</view>
						</view>
					</u-grid-item>
				</u-grid>
				<view style="margin-top: 20rpx;">
					<u-radio-group v-model="radio" placement="column">
						<block v-for="(item,index) in payMent" :key="index">
							<u-row justify="space-between" style="flex:1;margin-bottom: 30rpx"
								@click="radio = item.name">
								<u-row>
									<i :class="item.icon" :style="{background:item.color}"
										style="padding: 16rpx;border-radius: 50rpx;color: white;"></i>
									<text style="margin-left: 20rpx;">{{item.name}}</text>
								</u-row>
								<u-radio :name="item.name" activeColor="#aa96da"></u-radio>
							</u-row>
						</block>
					</u-radio-group>
				</view>
				<u-row justify="space-between" @click="showCard = true">
					<text>使用卡密</text>
					<i class="ess mgc_right_line" style="font-size: 34rpx;"></i>
				</u-row>
				<view style="margin-top: 20rpx;">
					<u-button color="#aa96da" shape="circle"
						@click="selectPackage?goPay():$u.toast('你还有选择充值金额哦~')">充值</u-button>
				</view>
			</view>
			<u-popup :show="showCard" round="10" customStyle="z-index: 10175;" @close="showCard = false" closeable>
				<view style="height: 40vh;padding: 60rpx 30rpx 30rpx 30rpx;">
					<text style="margin-bottom: 10rpx;">输入卡密</text>
					<u-input v-model="card" placeholder="卡密" border="bottom"></u-input>
				</view>
				<view style="position: fixed;bottom: 0;width: 100%;">
					<view style="padding: 30rpx;">
						<u-button color="#aa96da" shape="circle" @click="cardPay()">充值</u-button>
					</view>
				</view>
			</u-popup>
		</u-popup>
		<!-- 二维码弹窗 -->
		<u-popup mode="center" round="10" :show="showPaycode" @close="showPaycode = false" closeable>
			<u-gap height="30"></u-gap>
			<view
				style="padding: 30rpx;width: 550rpx;display: flex;flex-direction: column;justify-content: center;align-items: center;">
				<uv-qrcode size="200" :value="paycode" auto ref="qrcode"></uv-qrcode>
				<text
					style="font-size: 24rpx;color: #999;margin-top: 30rpx;">点击按钮保存在相册打开微信或支付宝扫码付款，支付完成后会延迟到账，请耐心等待。如长时间不到账请联系客服处理</text>
				<u-button color="#aa96da" shape="circle" style="margin-top: 30rpx;" @click="save()">保存二维码</u-button>
			</view>
		</u-popup>

		<u-popup round="10" :show="showVip" @close="showVip = false;" closeable>
			<view style="padding: 30rpx;">
				<view style="text-align: center;">
					<text>选择会员套餐</text>
				</view>
				<u-grid col="3">
					<u-grid-item v-for="(item,index) in vipPackage" :key="index">
						<view class="package" @click="vipSelect = item"
							:style="{background:vipSelect && vipSelect.name == item.name?'#aa96da1e':''}">
							<view class="package-sub"
								style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
								<text style="font-size: 26rpx;">Day</text>
								<text style="font-size: 50rpx;">{{item.day}}</text>
							</view>
							<view style="color: #999;text-align: center;font-size: 24rpx;">
								<text>{{$store.state.appInfo.currencyName}}{{item.day*config.vipPrice}}</text>
							</view>
						</view>
					</u-grid-item>
				</u-grid>
				<view style="margin-top: 20rpx;">
					<u-button color="#aa96da" shape="circle"
						@click="vipSelect.name?getVip():$u.toast('你还没有选择会员套餐~')">开通</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				card: null,
				showCard: false,
				logs: [],
				pageHeight: 0,
				showPayment: false,
				userData: {},
				tabs: [{
					name: '任务'
				}, {
					name: '记录'
				}],
				tabsIndex: 0,
				appInfo: {},
				customPrice: 0,
				vipSelect: {},
				vipPackage: [{
						name: '一月',
						day: 30
					},
					{
						name: '两月',
						day: 60
					},
					{
						name: '一季',
						day: 90
					},
					{
						name: '半年',
						day: 180
					},
					{
						name: '一年',
						day: 365
					}

				],

				payMent: [{
						name: '微信',
						type: 'wxpay',
						icon: 'mgc_wechat_pay_fill',
						color: '#46d262'
					},
					{
						name: '支付宝',
						type: 'alipay',
						icon: 'mgc_alipay_fill',
						color: '#0070ff'
					},
					{
						name: '三方微信',
						type: 'epayWechat',
						icon: 'mgc_wechat_pay_fill',
						color: '#000'
					},
					{
						name: '三方支付宝',
						type: 'epayAlipay',
						icon: 'mgc_alipay_fill',
						color: '#000'
					}
				],
				payPackage: [{
					id: 1,
					price: 1,
				}, {
					id: 2,
					price: 6
				}, {
					id: 3,
					price: 15
				}, {
					id: 4,
					price: 30
				}, {
					id: 5,
					price: 60
				}, {
					id: 6,
					price: 100
				}],
				selectPackage: {
					id: 1,
					price: 1
				},
				radio: '微信',
				config: {},
				task: [{
						name: '打卡',
						point: 5,
						times: 1,
						check: this.tasksInfo && this.tasksInfo.isSign,
						icon: 'heart'
					},
					{
						name: '点赞',
						point: 2,
						times: 3,
						check: this.tasksInfo && this.tasksInfo.likes,
						icon: 'heart'
					},
					{
						name: '浏览帖子',
						point: 5,
						times: 2,
						check: this.tasksInfo && this.tasksInfo.views,
						icon: 'heart'
					},
					{
						name: '分享',
						point: 5,
						times: 1,
						check: this.tasksInfo && this.tasksInfo.shares,
						icon: 'heart'
					}
				],
				paycode: '',
				showPaycode: false,
				showVip: false,
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			this.selectPackage = this.payPackage[0]
			this.vipSelect = this.vipPackage[0]
			this.initData()
			this.appInfo = this.$store.state.appInfo
			// 计算剩余高度
			let system = uni.getSystemInfoSync()
			this.pageHeight = system.windowHeight - system.statusBarHeight

		},
		onShow() {
			this.getUserInfo()
		},
		onReady() {
			uni.createSelectorQuery().in(this).select(".panel").boundingClientRect(data => {
				this.pageHeight -= data.height
			}).exec()
		},
		methods: {
			initData() {
				this.getData()
				this.getConfig()
			},
			getData() {
				this.$http.post('/user/tasks').then(res => {
					if (res.data.code == 200) {
						this.task[0].check = res.data.data.isSign
						this.task[1].check = res.data.data.likes
						this.task[2].check = res.data.data.views
						this.task[3].check = res.data.data.shares
					}
				})
			},
			getConfig() {
				this.$http.get('/system/vip').then(res => {
					if (res.data.code) {
						this.config = res.data.data
						this.$store.commit('setTasks', res.data.data)
					}
				})
			},
			getLog(page, limit) {
				this.$http.get('/pay/list', {
					params: {
						page,
						limit,
						status: 1,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			},
			goPay() {
				switch (this.radio) {
					case '微信':
						this.despoit('wxpay')
						break;
					case '支付宝':
						this.despoit('alipay')
						break;
					case '三方微信':
						this.orderPay('wxpay')
						break;
					case '三方支付宝':
						this.orderPay('alipay')
						break;
					default:
						break;
				}
			},

			// 三方支付
			orderPay(type) {
				uni.showLoading({
					mask: true,
					title: "生成二维码中..."
				})
				this.$http.post('/pay/epay', {
					money: this.selectPackage.price,
					type: type,
					device: 'mobile',
				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						let data = res.data.data
						this.showPayment = false;
						if (data.hasOwnProperty('qrcode')) {
							this.paycode = data.qrcode
							this.showPaycode = true;
						}
						if (data.hasOwnProperty('payurl')) {
							// #ifdef APP
							plus.runtime.openWeb(data.payurl);
							// #endif
							// #ifdef H5
							window.open(data.payurl);
							// #endif
						}
						this.showCard = false;
					}
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			},

			// 支付
			despoit(provider) {
				if (provider == 'wxpay') return;
				uni.getProvider({
					service: 'payment',
					success: (res) => {
						this.$http.post('/pay/alipay', {
							money: this.selectPackage.price
						}).then(res => {
							if (res.data.code == 200) {
								let url =
									`alipays://platformapi/startapp?saId=10000007&qrcode=${encodeURI(res.data.order)}?_s=web-other`;
								// #ifdef APP
								plus.runtime.openURL(url)
								// #endif
								// #ifndef APP
								window.open(url)
								// #endif
							}
						}).catch(err => {
							console.log(err)
						})
					}
				})
			},

			cardPay() {
				if (this.card == null) {
					uni.$u.toast('卡密不可为空')
					return;
				}
				this.$http.post('/pay/chargeCard', {
					card: this.card
				}).then(res => {
					if (res.data.code == 200) {
						this.showCard = false;
						this.showPayment = false;
						this.card = null
						this.getData()
					}
					uni.$u.toast(res.data.msg)
				})
			},
			save() {
				this.$refs.qrcode.save({
					success: () => {
						uni.$u.toast('保存成功');
					}
				});
			},
			getUserInfo() {
				if (!uni.getStorageSync('token')) return;
				this.$http.get('/user/userInfo', {
					params: {
						id: this.userInfo.uid,
					},
				}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setUser', res.data.data)
					}
				}).catch(err => {})
			},
			getVip() {
				this.$http.post('/shop/vip', {
					days: this.vipSelect.day
				}).then(res => {
					uni.$u.toast(res.data.msg)
					this.showVip = false
				})
			}
		}
	}
</script>

<style lang="scss">
	@media (prefers-color-scheme: dark) {

		.panel,
		.task-panel {
			background: #545454 !important;
		}

	}

	.panel {
		position: relative;
		margin: 30rpx;
		padding: 30rpx;
		background: #343434;
		color: white;
		height: 340rpx;
		border-radius: 20rpx;
		overflow: hidden;

		&-circle {
			position: absolute;
			bottom: -30rpx;
			right: -40rpx;
			height: 260rpx;
			width: 260rpx;
			background: #404040;
			border-radius: 50%;
		}

		&-bottom {
			backdrop-filter: blur(1px);
			position: absolute;
			bottom: 0;
			height: 150rpx;
			width: 100%;
			background: #fff;
			opacity: 0.5;
		}

	}


	.task-panel {
		font-size: 28rpx;
		margin: 30rpx 0;
		background: #fff;
		border-radius: 10rpx;
		color: #999;
		padding: 30rpx;
		display: flex;
		flex-direction: column;

		box-shadow: 0 0 4rpx 0 #2929293c;
	}

	::v-deep .u-grid-item--hover-class {
		opacity: unset;
	}

	.package {
		display: flex;
		flex-direction: column;
		padding: 30rpx;
		height: 160rpx;
		border: $c-primary solid 2rpx;
		width: 80rpx;
		margin: 30rpx;
		border-radius: 20rpx;

		&-sub {
			color: $c-primary;
			display: flex;
			justify-content: center;
			align-items: baseline;
		}
	}

	.logItem {
		padding-left: 20rpx;
		width: 100%;

		&-add {
			border-left: 6rpx red solid;
		}

		&-reduce {
			border-left: 6rpx green solid;
		}
	}
</style>