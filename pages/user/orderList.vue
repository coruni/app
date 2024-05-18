<template>
	<z-paging-swiper>
		<template #top>
			<u-navbar title="我的订单" autoBack placeholder bgColor="transparent">
				<view slot="left">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
				<view slot="right">
					<u-button style="height: 50rpx;" shape="circle" @click="goBusiness()">商家订单</u-button>
				</view>
			</u-navbar>
			<z-tabs :list="list" :current="tabIndex" :activeColor="'#88d8c0'" ref="tab" @change="tabIndex = $event"
				bgColor="transparent"></z-tabs>
		</template>
		<swiper style="height: 100%;" :current="tabIndex"
			@animationfinish="tabIndex = $event.detail.current;$refs.tab.unlockDx()"
			@transition="$refs.tab.setDx($event.detail.dx)">
			<swiper-item v-for="(item,index) in list" :key="index">
				<listItem :data="item" @address="orderId = $event.id;address = $event.address;showAddress = true"
					@buy="orderId = $event.id;$refs.payMent.open()" ref="page" :type="type"></listItem>
			</swiper-item>
		</swiper>
		<uv-modal :showConfirmButton="false" ref="payMent" title="提示" width="500rpx">
			<view style="flex:1;display: flex;flex-direction: column;">
				<view style="text-align: center;">
					<text>是否支付？</text>
				</view>
				<view style="margin-top: 30rpx;">
					<u-row>
						<u-button plain shape="circle" style="margin-right: 10rpx;"
							@click="$refs.payMent.close()">取消</u-button>
						<u-button shape="circle" color="#88d8c0" style="margin-left: 10rpx;"
							@click="buy()">确定</u-button>
					</u-row>
				</view>
			</view>
			<view slot="confirmButton"></view>
		</uv-modal>
		<u-popup :show="showAddress" @close="showAddress = false" closeable round="10">
			<view style="margin-top: 30rpx;text-align: center;">
				<text>收货地址</text>
			</view>
			<view style="margin: 30rpx;height: 50vh;">
				<u-form :model="address" :rules="addressRules" ref="address">
					<u-form-item :borderBottom="false" prop="contacts" label="收货人" label-width="80">
						<u-input v-model="address && address.contacts" placeholder="名字"></u-input>
					</u-form-item>
					<u-form-item :borderBottom="false" prop="phone" label="手机号" label-width="80">
						<u-input v-model="address && address.phone" maxlength="11" placeholder="手机号"></u-input>
					</u-form-item>
					<u-form-item :borderBottom="false" prop="region" label="所在地区" label-width="80">
						<u-input v-model="address && address.region" placeholder="请填写省/市/县">
							<template slot="suffix">
								<u-icon name="map" color="#88d8c0" size="20" @click="getLocaltion()"></u-icon>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item :borderBottom="false" prop="detailAddress" label="详细地址" label-width="80">
						<u-textarea placeholder="镇/村/门牌号" v-model="address && address.detailAddress"
							height="40"></u-textarea>
					</u-form-item>
				</u-form>
				<u-button color="#88d8c0" style="margin-top: 60rpx;" shape="circle"
					@click="saveAddress();showAddress=false">保存</u-button>
			</view>
		</u-popup>
	</z-paging-swiper>
</template>

<script>
	import listItem from './components/orderList/listItem.vue';
	export default {
		components: {
			listItem,
		},
		data() {
			return {
				tabIndex: 0,
				data: [],
				showAddress: false,
				orderId: 0,
				list: [{
						name: '全部',
						order: [{
							order: 'all',
							value: 0,
						}]

					},
					{
						name: '未支付',
						order: [{
							order: 'paid',
							value: 0
						}]

					},
					{
						name: '未发货',
						order: [{
								order: 'isTracking',
								value: 0
							},
							{
								order: 'paid',
								value: 1
							}
						],
					},
					{
						name: '待收货',
						order: [{
							order: 'isTracking',
							value: 1
						}]

					}
				],
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
				},
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
				type: false,

			};
		},
		methods: {
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
						console.log(err)
					}
				})
			},
			saveAddress() {
				this.$refs.address.validate().then(() => {
					let address = this.address
					address.address = address.region + address.detailAddress
					this.$http.post('/shop/tracking', {
						id: this.orderId,
						address: JSON.stringify(address)
					}).then(res => {

						if (res.data.code == 200) {
							this.$refs.page[this.tabIndex].reload()
							this.orderId = 0;
						}
						uni.$u.toast(res.data.msg)
					})
				}).catch(err => {
					uni.$u.toast('请填写完整收货地址！')
				})

			},
			buy() {
				this.$http.post('/shop/buy', {
					id: this.orderId,
				}).then(res => {
					if (res.data.code == 200) {
						uni.$u.toast('已下单，请等待商家配送')
						this.showPayment = true;
						this.orderId = 0;
						this.$refs.page[this.tabIndex].reload()
					}
					uni.$u.toast(res.data.msg)
					this.$refs.payMent.close()
				})
			},
			goBusiness() {
				this.$Router.push({
					name: "business"
				})
			}

		}
	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
	}
</style>