<template>
	<view>
		<u-navbar title="账号与安全" placeholder autoBack bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<u-row justify="space-between" style="padding: 20rpx 30rpx;" @click="showAddress = true">
			<text>管理收货地址</text>
			<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
		</u-row>
		<u-row justify="space-between" style="padding: 20rpx 30rpx;" @click="showChangePassword = true">
			<text>修改密码</text>
			<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
		</u-row>
		<u-row justify="space-between" style="padding: 20rpx 30rpx;">
			<text>第三方绑定</text>
			<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
		</u-row>
		<u-row justify="space-between" style="padding: 20rpx 30rpx;" @click="goPage('destroy')">
			<text>注销账号</text>
			<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
		</u-row>

		<!-- popup组件 -->
		<!-- 修改密码 -->
		<u-popup :show="showChangePassword" round="5" @close="showChangePassword = false;resetPasswordValue()"
			mode="center" closeable>
			<view
				style="width: 80vw; height: auto;display: flex;justify-content: center;padding: 30rpx;flex-direction: column;">
				<u-row justify="center">
					<text style="font-Weight: bold;">修改密码</text>
				</u-row>
				<view style="margin-top: 20rpx;">
					<text>旧密码</text>
					<u-gap height="5"></u-gap>
					<uv-input class="input" v-model="password.oldPassword" type="password" placeholder="请输入旧密码"
						border="none"></uv-input>
					<u-gap height="10"></u-gap>
					<text>新密码</text>
					<u-gap height="5"></u-gap>
					<uv-input class="input" :maxlength="18" v-model="password.newPassword" type="password"
						placeholder="请输入新密码" border="none"></uv-input>
				</view>

				<view style="margin-top: 20rpx;">
					<u-row justify="space-between">
						<u-button plain shape="circle" style="margin-right: 20rpx;"
							@click="showChangePassword =false">取消</u-button>
						<u-button color="#aa96da" shape="circle" style="margin-left: 20rpx;"
							@click="savePassword()">确定</u-button>
					</u-row>

				</view>
			</view>
		</u-popup>
		<!-- 收货管理 -->
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
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				showChangePassword: false,
				password: {
					newPassword: '',
					oldPassword: '',
				},
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
				addressRules: {
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
					'province': {
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

			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			// 获取用户地址
			if (this.userInfo.address) {
				this.address = this.userInfo.address
			}

		},
		methods: {
			savePassword() {

				let {
					newPassword,
					oldPassword
				} = this.password;
				if (newPassword == oldPassword) {
					uni.$u.toast('密码相同，无需更改');
					return
				}
				if (!/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/.test(newPassword)) {
					uni.$u.toast('密码只能包含字母、数字和特殊字符！');
					return;
				}
				if (uni.$u.test.rangeLength(newPassword, [6, 18])) {
					uni.$u.toast('密码强度不足');
				}
				this.$http.post('/user/changePassword', {
					newPassword,
					oldPassword
				}).then(res => {
					if (res.data.code == 200) {
						this.showChangePassword = false;
					}
					uni.$u.toast(res.data.msg)
				})
			},
			resetPasswordValue() {
				this.password = {
					newPassword: '',
					oldPassword: '',
				}
			},
			goPage(page) {
				this.$Router.push({
					name: page
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
					fail: (err) => {}
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
							this.getUserInfo()
						}
					})
				}).catch(err => {
					uni.$u.toast('请填写完整收货地址！')
				})

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
				}).catch(err => {

				})
			},

		}
	}
</script>

<style lang="scss">
	.input {
		padding: 15rpx !important;
		border-radius: 10rpx;
		background: #f7f7f7;
	}
</style>