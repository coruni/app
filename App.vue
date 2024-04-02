<script>
	import {
		mapMutations
	} from 'vuex';
	import config from '@/config/config.js'
	import silenceUpdate from '@/uni_modules/rt-uni-update/js_sdk/silence-update.js' //引入静默更新
	import {
		http
	} from '@/utils/luch-request/http.js'
	import store from './store';
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS
			plus.nativeUI.setUIStyle('auto')
			// #endif
			let token = uni.getStorageSync('token')
			if (token) {
				this.$store.commit('setToken', uni.getStorageSync('token'));
				this.$store.commit('setUser', uni.getStorageSync('user'));
				this.$store.commit('loginStatus');
				setTimeout(() => {
					this.getNoticeNum();
					this.getUserTasks();
				}, 1)
			}
			// 从缓存从获取数据
			this.$store.commit('setSwiper', uni.getStorageSync('swiper'))
			this.$store.commit('setTabs', uni.getStorageSync('homeTabs'))
			this.$store.commit('setHomepage', uni.getStorageSync('appHomepage'))
			this.$store.commit('setHistory', uni.getStorageSync('history'))
			// 启动开始请求的数据
			setTimeout(() => {
				this.getAppData()
				this.getHomeTabs()
				this.getSwiper();
			}, 1)
		},
		onShow: function() {
			// #ifdef APP
			setTimeout(() => {
				this.getUpdate()
			}, 200)
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		onThemeChange() {

		},
		methods: {
			...mapMutations(['setToken', 'setUser', 'setUserMeta']),
			getNoticeNum() {
				if (!store.state.hasLogin) return;
				http.get('/user/noticeNum', {}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setNoticeNum', res.data.data)
					}
				})
			},
			getSwiper() {
				http.get('/swiper/list', {
					params: {
						page: 1,
						limit: 10,
					}
				}).then(res => {
					const data = res.data.data.data

					this.$store.commit('setSwiper', data)
				})
			},
			login() {
				let account = uni.getStorageSync('account')
				if (!account) return;
				http.get('/user/login', {
					params: {
						account: account.name,
						password: account.password
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.setToken(res.data.data.token);
						this.getUserInfo(res.data.data.uid);
						uni.$emit('login', true)
					} else {
						this.$Router.push({
							path: '/pages/user/login'
						})
						// 还是登陆错误就到登录页面登录
					}
				}).catch(err => {

				})
			},
			getUserInfo(uid) {
				if (!uni.getStorageSync('token')) return;
				http.get('/user/userInfo', {
					params: {
						id: uid ? uid : this.$store.state.userInfo.uid,
					},
				}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setUser', res.data.data)
					}
				}).catch(err => {

				})
			},

			getAppData() {
				http.get('/system/app', {
					params: {
						key: config.app
					}
				}).then(res => {
					this.$store.commit('setAppInfo', res.data.data.app)
					this.$store.commit('setHomepage', res.data.data.appHomepage)
				})
			},
			getUserTasks() {
				http.get('/user/tasks', {}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setTasks', res.data.data);
					}
				})
			},
			getUpdate() {
				let platform = uni.getSystemInfoSync().platform
				let data = {
					describe: '', // 版本更新内容 支持<br>自动换行
					edition_url: '', //apk、wgt包下载地址或者应用市场地址  安卓应用市场 market://details?id=xxxx 苹果store itms-apps://itunes.apple.com/cn/app/xxxxxx
					edition_force: 0, //是否强制更新 0代表否 1代表是
					package_type: 1, //0是整包升级（apk或者appstore或者安卓应用市场） 1是wgt升级
					edition_issue: 1, //是否发行  0否 1是 为了控制上架应用市场审核时不能弹出热更新框
					edition_number: 1, //版本号 最重要的manifest里的版本号 （检查更新主要以服务器返回的edition_number版本号是否大于当前app的版本号来实现是否更新）
					edition_name: '1.0.0', // 版本名称 manifest里的版本名称
					edition_silence: 0, // 是否静默更新 0代表否 1代表是
				}
				plus.runtime.getProperty(plus.runtime.appid, (inf) => {
					http.get('/system/app', {}).then(res => {
						if (res.data.code == 200) {

							let app = res.data.data.app
							data.describe = app.versionIntro
							data.edition_url = platform == 'android' ? app.androidUrl : app.iosUrl
							data.edition_force = app.forceUpdate
							data.package_type = app.updateType
							data.edition_number = app.versionCode
							data.edition_name = app.version
							data.edition_silence = app.silence
							data.edition_issue = app.issue

							// 判断版本号
							if (Number(data.edition_number) > Number(inf.versionCode) && data
								.edition_issue == 1) {
								// 判断是否热更新
								if (data.package_type == 1 && data.edition_silence == 1) {
									silenceUpdate(data.edition_url)
								} else {
									setTimeout(() => {
										this.$Router.push({
											path: '/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update',
											query: {
												obj: JSON.stringify(data)
											}
										})
									}, 500)

								}
							}
						}
					})

				});
			},
			getHomeTabs() {
				http.get('/category/list', {
					params: {
						page: 1,
						limit: 8,
						params: JSON.stringify({
							type: 'category',
							isrecommend: 1,
						})
					}
				}).then(res => {
					if (res.data.code == 200) {
						let topList = [{
							name: '关注'
						}, {
							name: '推荐'
						}]
						topList = topList.concat(res.data.data.data)
						this.$store.commit('setTabs', topList)
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import 'animate.css';
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
	/*引入等级图标*/
	@import './static/font/level/level.css';
	/*引入基础图标*/
	@import './static/font/ess/ess.css';

	body,
	html {
		font-family: 'HarmonyOS_Sans';
		font-size: 32rpx;
		line-height: 1.3;
	}

	@font-face {
		font-family: 'HarmonyOS_Sans';
		src: url('/static/font/HarmonyOS_Sans_SC_Regular.ttf');

	}

	@media (prefers-color-scheme: dark) {

		html,
		body {
			background: #292929 !important;
		}

		.u-loading-page {
			background: #292929 !important;
		}

		.waterfall {
			background: #525252 !important;

			&-home {
				background: #292929 !important;
			}
		}

		.update-content {
			background: #525252 !important;
		}

		.bottom-tabbar {
			background: #292929 !important;
			border-top: #242424 2rpx solid !important;

			&-tag {
				background: #525252 !important;
			}
		}

		.u-popup__content {
			background: #292929 !important;
		}

		.u-navbar__content__title {
			color: white !important;
		}

		.u-text__value {
			color: white !important;
		}

		.top-header,
		.u-sticky {
			background: #292929 !important;
		}

		.login-text {
			color: white;
		}

		.input {
			background: #525252 !important;
			border: none !important;
		}

		.uni-input-input,
		.uni-textarea-textarea {
			color: white !important;
		}

		.uv-search {
			background: #525252 !important;
			border-radius: 100px;

			&__content {
				background: #525252 !important;

				&__input {
					background: #525252 !important;
					color: white !important;
				}
			}
		}

		.u-textarea__count {
			background: transparent !important;
		}

		.search {
			&-item {
				background: #525252 !important;
			}

			&-header {
				background: #525252 !important;
			}
		}

		.photo {
			&-background {
				background: #525252 !important;
			}
		}

		.article-gap {
			background: #191919 !important;
		}

		#editor {
			background: #525252 !important;
			color: white;
		}

		.ql-container ::v-deep .ql-blank::before {
			color: white;
		}

		.comment {
			&-box {
				background: #525252 !important;
			}
		}

		.download-content,
		.notice-message,
		.album-content {
			background: #525252 !important;
		}

		.album-content-info {
			background: #494949 !important;
		}
	}

	.avatar_head {
		position: absolute;
		display: block;
		left: 50%;
		top: 50%;
		width: calc((100% - 2px) * 1.3);
		height: calc((100% - 2px) * 1.3);
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 2;
		image-rendering: -webkit-optimize-contrast;
	}

	.vipname {
		color: $c-primary;
	}

	.category {
		background: rgba($c-primary, 0.1);
		color: $c-primary;
	}

	.primary {
		color: $c-primary;
	}

	.primary-bg {
		background: $c-primary;
		color: white;
	}

	.vipname {
		color: #ff8800;
	}
</style>