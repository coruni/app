<template>
	<view>
		<u-navbar title="商品详情" placeholder autoBack bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
			<view slot="right">
				<i class="ess mgc_share_3_line" style="font-size: 45rpx;"></i>
			</view>
		</u-navbar>
		<view style="position: relative;top: 0;">
			<u-swiper height="280" :list="info && info.imgurl" radius="0" circular @click="swiperTap"
				@change="swiperIndex = $event.current"></u-swiper>
			<view
				style="font-size: 24rpx;background: #aa96daa0;border-radius:20rpx 0rpx 0rpx 0 ;padding:6rpx 20rpx;position: absolute;bottom: 0;right: 0;"
				v-if="info.imgurl && info.imgurl.length">
				<text style="color: #fff;">{{swiperIndex+1}}/{{info.imgurl&&info.imgurl.length}}</text>
			</view>
		</view>
		<view style="margin: 30rpx;">
			<view style="display: flex;align-items: baseline;color: red;">
				<i class="ess mgc_coin_line" style="font-size: 26rpx;margin-right: 10rpx;"></i>
				<text style="font-size: 40rpx;">{{info.price}}</text>
			</view>
			<text style="font-Weight: bold;">{{info.title}}</text>
			<view style="font-size: 24rpx;color: #999;">
				<text>已售 {{info.sellNum}}</text>
			</view>
			<!-- 规格 -->
			<view style="margin-top: 20rpx;
			background: #f7f7f7;
			border-radius: 20rpx;
			padding: 20rpx 30rpx;">
				<view>
					<text style="
					font-size: 28rpx;
					color: #999;">选择规格</text>
				</view>
				<u-row customStyle="
				margin-top: 20rpx;
				flex-wrap: wrap;">
					<block v-for="(item,index) in info.specs" :key="index">
						<view style="
									font-size: 28rpx;
									border-radius: 50rpx;
									padding: 8rpx 30rpx;
									background: #fff;
									margin-right: 20rpx;
									margin-bottom: 10rpx;
									" :style="[selectSpecs.id==item.id ? {background:'#aa96dac3', color:'#fff'} : {}]"
							@tap.stop="selectSpecs = item">
							<text>{{item.name}}</text>
						</view>
					</block>
				</u-row>
			</view>
			<view style="margin-top: 20rpx;">
				<u-row justify="space-between" style="flex-wrap: nowrap;">
					<u-col span="6">
						<u-row>
							<u-avatar :src="info && info.bossInfo && info.bossInfo.avatar" size="36"></u-avatar>
							<text style="margin-left: 20rpx;font-Weight: bold;font-size: 28rpx;"
								class="u-line-1">{{info.bossInfo&&info.bossInfo.screenName?info.bossInfo.screenName:info.bossInfo && info.bossInfo.name}}</text>
						</u-row>
					</u-col>
					<u-col span="6">
						<u-row>
							<u-button shape="circle" plain customStyle="height:60rpx;width:200rpx">关注</u-button>
							<u-button shape="circle" color="#aa96da"
								customStyle="height:60rpx;margin-left:20rpx">更多商品</u-button>
						</u-row>
					</u-col>

				</u-row>
			</view>
			<view style="margin-top: 50rpx;">
				<text style="font-Weight: bold;">商品详情</text>
				<uv-parse :showImgMenu="false" :content="info.text"></uv-parse>
			</view>
		</view>
		<view style="position: fixed;bottom: 0;width: 100%;background: white;">
			<view style="padding: 20rpx 30rpx;">
				<u-button color="#aa96da" shape="circle" style="box-shadow: 0 0 4px 0 #aa96da;"
					@click="showSpecs = true">购买</u-button>
			</view>
		</view>
		<u-popup :show="showSpecs" @close="showSpecs= false" closeable round="10">
			<view style="text-align: center;margin-top: 30rpx;">
				<text>选择商品规格</text>
			</view>
			<view style="margin: 30rpx;">
				<u-row>
					<image :src="selectSpecs && selectSpecs.image" mode="aspectFill"
						style="height: 120rpx;width: 120rpx;border-radius: 20rpx;background: #f7f7f7;"></image>
					<view style="display: flex;flex-direction: column;margin-left: 20rpx;">
						<text>已选：{{selectSpecs && selectSpecs.name}}</text>
						<u-row align="baseline" style="color: red;">
							<i class="ess mgc_coin_line"></i>
							<text style="margin-left: 10rpx;">{{selectSpecs&&selectSpecs.price}}</text>
						</u-row>
					</view>
				</u-row>
				<view style="margin-top: 20rpx;">
					<u-row justify="space-between" @click="showAddress =true">
						<u-row align="top" style="flex:1">
							<view style="background: #aa96da;
								border-radius: 50rpx;
								color: white;
								padding: 8rpx;
								font-size: 26rpx;
								display: flex;
								align-items: baseline;
								flex-shrink: 0;">
								<i class="ess mgc_home_1_line"></i>
								<text style="margin-left: 10rpx;">配送至：</text>
							</view>
							<view style="padding-left: 20rpx;">
								<text>{{$store.state.userInfo.address?$store.state.userInfo.address.address:'你还没有设置地址，点击设置'}}</text>
							</view>
						</u-row>
						<i class="ess mgc_right_line"></i>
					</u-row>
				</view>

				<view style="margin-top: 20rpx;
				background: #f7f7f7;
				border-radius: 20rpx;
				padding: 20rpx 30rpx;">
					<view>
						<text style="
						font-size: 28rpx;
						color: #999;">选择规格</text>
					</view>
					<u-row customStyle="
					margin-top: 20rpx;
					flex-wrap: wrap;">
						<block v-for="(item,index) in info.specs" :key="index">
							<view style="
										font-size: 28rpx;
										border-radius: 50rpx;
										padding: 8rpx 30rpx;
										background: #fff;
										margin-right: 20rpx;
										margin-bottom: 10rpx;
										" :style="[selectSpecs.id==item.id ? {background:'#aa96dac3', color:'#fff'} : {}]"
								@tap.stop="selectSpecs = item">
								<text>{{item.name}}</text>
							</view>
						</block>
					</u-row>
				</view>
				<view style="margin-top: 60rpx;">
					<u-button color="#aa96da" shape="circle" @click="genOrder()">立即购买</u-button>
				</view>
			</view>

			<u-popup :show="showAddress" @close="showAddress = false" closeable round="10">
				<view style="margin-top: 30rpx;text-align: center;">
					<text>收货地址</text>
				</view>
				<view style="margin: 30rpx;height: 50vh;">
					<u-form :model="address" :rules="rules" ref="address">
						<u-form-item :borderBottom="false" prop="contacts" label="收货人" label-width="80">
							<u-input v-model="address && address.contacts" placeholder="名字"></u-input>
						</u-form-item>
						<u-form-item :borderBottom="false" prop="phone" label="手机号" label-width="80">
							<u-input v-model="address && address.phone" maxlength="11" placeholder="手机号"></u-input>
						</u-form-item>
						<u-form-item :borderBottom="false" prop="region" label="所在地区" label-width="80">
							<u-input v-model="address && address.region" placeholder="请填写省/市/县">
								<template slot="suffix">
									<u-icon name="map" color="#aa96da" size="20" @click="getLocaltion()"></u-icon>
								</template>
							</u-input>
						</u-form-item>
						<u-form-item :borderBottom="false" prop="detailAddress" label="详细地址" label-width="80">
							<u-textarea placeholder="镇/村/门牌号" v-model="address && address.detailAddress"
								height="40"></u-textarea>
						</u-form-item>
					</u-form>
					<u-button color="#aa96da" style="margin-top: 60rpx;" shape="circle"
						@click="saveAddress();showAddress=false">保存</u-button>
				</view>
			</u-popup>
		</u-popup>
		<!-- fixed占位 -->
		<u-gap height="50"></u-gap>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				id: 0,
				info: {},
				swiperIndex: 0,
				selectSpecs: {},
				showSpecs: false,
				showBuy: false,
				showAddress: false,
				
				address: {
					contacts: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					detailAddress: '',
					address: '',
					region: ''
				},
				// 规则校验
				rules: {
					// 字段名称
					'contacts': {
						type: 'string',
						required: true,
						min: 2,
						max: 8,
						message: '请填写姓名',
						trigger: ['blur', 'change']
					},
					'phone': {
						type: 'string',
						required: true,
						pattern: '[0-9]',
						message: '请填写正确手机号码',
						len: 11,
						min: 11,
						trigger: ['blur', 'change']
					},
					'region': {
						type: 'string',
						required: true,
						message: '请定位获取位置',
						trigger: ['blur', 'change']
					},
					'detailAddress': {
						type: 'string',
						required: true,
						message: '请输入正确地址',
						trigger: ['blur', 'change']
					}
				}
			};
		},
		onLoad(params) {
			this.getData(params.id)
			// 获取用户地址
			if (this.userInfo.address) {
				this.address = this.userInfo.address
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			getData(id) {
				this.$http.get('/shop/info', {
					params: {
						id,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.info = res.data.data
					}
				})
			},
			swiperTap(index) {
				uni.previewImage({
					urls: this.info.imgurl,
					current: index
				})
			},
			genOrder() {
				if (!this.selectSpecs.id) {
					uni.$u.toast('请选择商品规格')
					return;
				}
				this.$http.post('/shop/genOrder', {
					product: this.info.id,
					specs: this.selectSpecs.id,
					address: JSON.stringify(this.address)
				}).then(res => {
					if (res.data.code) {
						this.$Router.push({
							path: '/pages/shop/order',
							query: {
								id: res.data.data.orderId
							}
						})
					} else {
						uni.$u.toast(res.data.msg)
					}
				})
			},
			getLocaltion() {
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: (res) => {
						this.address.region = res.address.province + res.address.city + res.address.district
						this.address.province = res.address.province
						this.address.city = res.address.city
						this.address.district = res.address.district
					},
					fail: (err) => {

					}
				})
			},
			saveAddress() {
				this.$refs.address.validate().then(() => {
					let address = this.address
					address.address = address.region + address.detailAddress
					this.$http.post('/user/update', {
						address: JSON.stringify(address)
					}).then(res => {

						if (res.data.code == 200) {
							uni.$u.toast('已设置地址')
						}
					})
				}).catch(err => {
					uni.$u.toast('请填写完整收货地址！')
				})

			}
		}
	}
</script>

<style lang="scss">

</style>