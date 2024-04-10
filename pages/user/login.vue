<template>
	<view>
		<u-navbar autoBack bg-color="rgba(0,0,0,0)" left-icon="close" fixed left-icon-color="white"
			height="80"></u-navbar>
		<view style="position: relative;top: 0;">
			<image src="/static/login.jpg" mode="aspectFill" style="width: 100%;height: 400rpx;"></image>
			<view style="width: 100%;position: absolute;bottom: 0;">
				<view class="top-header"></view>
			</view>
		</view>
		<view style="margin: 40rpx;margin-top: 0;" v-show="!isForget">
			<u-text :text="isLogin?'用户登录':'用户注册'" size="17" bold></u-text>
			<u-gap height="10"></u-gap>
			<!-- 登录用 -->
			<view v-show="isLogin">
				<uv-input placeholder="邮箱/账号" class="input" border="none" v-model="account">
					<view slot="prefix">
						<i class="ess mgc_user_1_line"></i>
					</view>
				</uv-input>
				<u-gap></u-gap>
				<uv-input placeholder="密码" type="password" class="input" border="none" v-model="password">
					<view slot="prefix">
						<i class="ess mgc_lock_line"></i>
					</view>
				</uv-input>
			</view>
			<!-- 注册用 -->
			<view v-show="!isLogin">
				<uv-input placeholder="用户名" class="input" border="none" v-model="username">
					<view slot="prefix">
						<i class="ess mgc_user_1_line"></i>
					</view>
				</uv-input>
				<u-gap></u-gap>
				<uv-input placeholder="密码" type="password" border="none" class="input" v-model="password">
					<view slot="prefix">
						<i class="ess mgc_lock_line"></i>
					</view>
				</uv-input>
				<u-gap></u-gap>
				<uv-input placeholder="确认密码" type="password" class="input" border="nont" v-model="password2">
					<view slot="prefix">
						<i class="ess mgc_lock_line"></i>
					</view>
				</uv-input>
				<u-gap></u-gap>
				<uv-input placeholder="邮箱" class="input" border="none" v-model="email">
					<view slot="prefix">
						<i class="ess mgc_mail_line"></i>
					</view>
					<view slot="suffix" v-if="config && config.isEmail">
						<u-code ref="uCode" @change="codeChange" seconds="120"></u-code>
						<u-button @tap="getCode" plain color="#aa96da" size="mini">{{tips}}</u-button>
					</view>
				</uv-input>
				<u-gap v-if="config && config.isEmail || config && config.isInvite"></u-gap>
				<u-row>
					<uv-input v-if="config && config.isEmail" placeholder="验证码" type="number" class="input"
						border="none" v-model="code">
						<view slot="prefix">
							<i class="ess mgc_safe_lock_line"></i>
						</view>
					</uv-input>
					<view v-if="config &&config.isEmail && config.isInvite" style="margin: 0 15rpx"></view>
					<uv-input v-if="config.isInvite" :placeholder="`邀请码(${config.isInvite?'必填':'选填'})`" class="input"
						border="none" v-model="inviteCode">
					</uv-input>
				</u-row>
			</view>
			<u-row justify="space-between"
				customStyle="margin-top:40rpx;font-weight:bold;font-size:30rpx;color:#414141">
				<text @click="isLogin=!isLogin" class="login-text">{{isLogin?'注册':'登录'}}</text>
				<text @click="isForget=true" class="login-text">忘记密码？</text>
			</u-row>
			<view style="margin-top:40rpx">
				<u-row>
					<u-checkbox-group>
						<u-checkbox @change="accept=!accept" v-model="accept" activeColor="#aa96da" size="15"
							shape="circle"></u-checkbox>
					</u-checkbox-group>
					<u-row customStyle="font-size:30rpx">
						<text>登录及代表你同意</text>
						<text style="color:#aa96da">《用户协议》</text>
						<text>与</text>
						<text style="color:#aa96da">《隐私政策》</text>
					</u-row>
				</u-row>
			</view>

			<view style="margin-top: 60rpx;">
				<u-button :text="isLogin?'登录':'注册'" shape="circle" :hairline="false" color="#aa96da" size="normal"
					loading-size="10" customStyle="width:300rpx; height:80rpx;box-shadow:0 0 9rpx 0 #aa96da"
					@click="isLogin?login():register()"></u-button>
			</view>
			<!-- 仅APP显示 -->
			<!-- #ifdef APP -->
			<u-gap height="60"></u-gap>
			<u-row justify="center">
				<u-row justify="space-between" customStyle="flex-basis:40%">
					<block v-for="(item,index) in loginBtn" :key="index">
						<u-row customStyle="flex-direction:column" @click="item.provider=='qq'?QQlogin():null">
							<u-icon :name="item.icon" size="30" color="white"
								:customStyle="{padding:10+'rpx',background:item.color,borderRadius:50+'rpx'}"></u-icon>
							<text style="margin-top: 10rpx;">{{item.name}}</text>
						</u-row>
					</block>
				</u-row>
			</u-row>
			<!-- #endif -->

		</view>
		<view style="margin: 40rpx;margin-top: 0rpx;" v-show="isForget">
			<u-text text="找回密码" size="17" bold></u-text>
			<u-gap height="10"></u-gap>
			<uv-input placeholder="邮箱/用户名" class="input" border="none" v-model="account">
				<view slot="prefix">
					<i class="ess mgc_user_1_line"></i>
				</view>
			</uv-input>
			<u-gap></u-gap>
			<uv-input placeholder="密码" type="password" class="input" border="none" v-model="password">
				<view slot="prefix">
					<i class="ess mgc_lock_line"></i>
				</view>
			</uv-input>
			<u-gap></u-gap>
			<uv-input placeholder="验证码" type="number" class="input" border="none" v-model="code">
				<view slot="prefix">
					<i class="ess mgc_safe_lock_line"></i>
				</view>
				<view slot="suffix" v-if="config && config.isEmail">
					<u-code ref="uCode1" @change="codeChange" seconds="120"></u-code>
					<u-button @tap="getAllCode" plain color="#aa96da" size="mini">{{tips}}</u-button>
				</view>
			</uv-input>

			<u-row justify="space-between"
				customStyle="margin-top:40rpx;font-weight:bold;font-size:30rpx;color:#414141">
				<text @click="isForget=false" class="login-text">返回登录</text>
			</u-row>
			<view style="margin-top:20rpx">
				<u-row>
					<u-checkbox-group>
						<u-checkbox @change="accept=!accept" v-model="accept" activeColor="#aa96da" size="15"
							shape="circle"></u-checkbox>
					</u-checkbox-group>
					<u-row customStyle="font-size:30rpx">
						<text>登录及代表你同意</text>
						<text style="color:#aa96da">《用户协议》</text>
						<text>与</text>
						<text style="color:#aa96da">《隐私政策》</text>
					</u-row>
				</u-row>
			</view>
			<view style="margin-top: 40rpx;">
				<u-button text="确认" :hairline="false" color="#aa96da" loading-size="10"
					customStyle="width:300rpx; height:80rpx;border-radius:10rpx;box-shadow:0 0 9rpx 0 #aa96da"
					@click="resetPassword()"></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				config: {},
				username: '',
				account: '',
				password: '',
				password2: '',
				email: '',
				code: '',
				inviteCode: '',
				isLogin: true,
				isForget: false,
				tips: '',
				accept: false,
				loginBtn: [{
						provider: 'weixin',
						name: '微信',
						icon: 'weixin-fill',
						color: '#5ac725'
					},
					{
						provider: 'qq',
						name: 'QQ',
						icon: 'qq-fill',
						color: '#3c9cff'
					}
				],

			};

		},
		created() {
			this.getConfig()
		},
		computed: {

		},
		methods: {
			...mapMutations(['setToken', 'setUser', 'setUserMeta', 'setRefreshToken']),
			codeChange(text) {
				this.tips = text
			},
			getConfig() {
				this.$http.get('/user/regConfig').then(res => {
					if (res.data.code == 200) {
						this.config = res.data.data
					}
				})
			},
			getAllCode() {
				if (!this.account.length) {
					uni.$u.toast('账号为空');
					return;
				}
				if (this.$refs.uCode1.canGetCode) {
					this.$http.get('/user/resetPassword', {
						params: {
							account: this.account,
							password: this.password,
							code: this.code,
						}
					}).then(res => {
						if (res.data.code == 200) {
							this.$refs.uCode1.start();
						}
						uni.$u.toast(res.data.msg)
					})
				}
			},
			resetPassword() {
				if (!this.accept) {
					uni.$u.toast('请同意协议')
					return;
				}
				this.$http.get('/user/resetPassword', {
					params: {
						account: this.account,
						password: this.password,
						code: this.code
					}
				}).then(res => {
					if (res.data.code == 200) {
						setTimeout(() => {
							this.login()
						}, 1600)
					}
					uni.$u.toast(res.data.msg)
				})
			},
			login() {
				if (!this.account.length) {
					uni.$u.toast('请填写账号！')
					return
				}
				if (!this.password.length) {
					uni.$u.toast('请填写密码！')
					return
				}
				if (!this.accept) {
					uni.$u.toast('请同意协议！')
					return
				}
				this.$http.get('/user/login', {
					params: {
						account: this.account,
						password: this.password,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.saveUser(res.data.data, true)
					}
					uni.$u.toast(res.data.msg)
				}).catch(err => {
					console.log(err)
				})
			},
			saveUser(data, type) {
				this.setToken(data.token);
				this.setRefreshToken(RefreshToken);
				this.getUserInfo(data.uid);
				uni.$emit('login', true);
				this.$store.commit('loginStatus');
				//保存账号密码 用于持久登录
				if (type) {
					let account = {
						name: this.account,
						password: this.password
					}
					uni.setStorageSync('account', account)
				}
				setTimeout(() => {
					this.$Router.back(1)
				}, 1600)
			},
			getUserInfo(uid) {
				this.$http.get('/user/userInfo', {
					params: {
						id: uid
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.setUser(res.data.data);
					}
				})
			},

			register() {
				if (!this.username.length) {
					uni.$u.toast('请填写用户名！');
					return;
				}

				if (!/^[a-zA-Z0-9]+$/.test(this.username)) {
					uni.$u.toast('用户名只能包含字母和数字！');
					return;
				}

				if (!this.email.length) {
					uni.$u.toast('请填写邮箱！');
					return;
				}

				if (!/\S+@\S+\.\S+/.test(this.email)) {
					uni.$u.toast('请输入正确的邮箱格式！');
					return;
				}
				if (this.password.length < 8) {
					uni.$u.toast('密码强度不合格！')
					return;
				}

				if (!this.config.isEmail && this.password != this.password2) {
					uni.$u.toast('密码不一致！')
					return;
				}

				if (!/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/.test(this.password)) {
					uni.$u.toast('密码只能包含字母、数字和特殊字符！');
					return;
				}

				if (this.config.isEmail && this.code.length < 6) {
					uni.$u.toast('请填写验证码！')
					return;
				}
				if (this.config.isInvite && !this.inviteCode.length) {
					uni.$u.toast('请填写邀请码！')
					return;
				}
				this.$http.get('/user/register', {
					params: {
						account: this.username,
						password: this.password,
						mail: this.email,
						code: this.code,
						inviteCode: this.inviteCode
					}
				}).then(res => {
					if (res.data.code) {
						uni.$u.toast(res.data.msg + '即将自动登录')
						this.account = this.username
						setTimeout(() => {
							this.login()
						}, 800)
					}
				})
			},
			getCode() {
				if (!this.email.length) {
					uni.$u.toast('邮箱为空');
					return;
				}
				if (this.$refs.uCode.canGetCode) {
					this.$http.get('/user/regCodeSend', {
						params: {
							mail: this.email
						}
					}).then(res => {
						if (res.statusCode == 200) {
							uni.$u.toast(res.data.msg)
							setTimeout(() => {
								this.$refs.uCode.start()
							}, 2000)
						}
					})
				}
			},
			async QQlogin() {
				let data = await this.getQQLoginInfo()
				this.$http.get('/user/OAuth', {
					params: {
						provider: 'qq',
						access_token: data.authResult.access_token,
						openid: data.authResult.openid
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.saveUser(res.data.data, false)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			getQQLoginInfo() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'qq',
						success: (res) => {
							resolve(res)
						}
					})
				})
			}

		}
	}
</script>

<style lang="scss">
	.input {
		padding: 15rpx !important;
		border-radius: 10rpx;
		background: #f7f7f7;
	}

	.top-header {
		background: white;
		padding: 20rpx;
		border-radius: 20rpx 20rpx 0 0;
	}
</style>