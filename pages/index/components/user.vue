<template>
	<view style="overflow: scroll;">
		<!-- 用户banner -->
		<view class="user-banner">
			<u-image :src="userInfo.userBg?userInfo.userBg:'/static/login.jpg'" height="440rpx" width="100%"></u-image>
			<view class="user-banner-radius"></view>
			<view class="user-banner-avatar_contaniner">
				<view class="user-banner-avatar_contaniner-avatar">
					<u-avatar :src="userInfo.avatar||''" size="76"
						@click="$store.state.hasLogin?goPage('headPicture'):goLogin()"></u-avatar>
					<view class="user-banner-avatar_contaniner-button_container" v-if="$store.state.hasLogin">
						<u-button class="user-banner-avatar_contaniner-button_container-zone"
							@click="goProfile()">个人空间</u-button>
						<u-button class="user-banner-avatar_contaniner-button_container-edit"
							@click="goPage('editUser')">
							<u-row>
								<i class="mgc_user_setting_line" style="margin-right: 10rpx;font-size: 34rpx;"></i>
								<text>编辑</text>
							</u-row>
						</u-button>
					</view>
				</view>
			</view>

		</view>
		<u-gap height="20"></u-gap>
		<!-- 用户信息 -->
		<view class="user-info" v-if="$store.state.hasLogin">
			<text class="user-info-nickname">{{userInfo.screenName||userInfo.name}}</text>
			<u-row class="user-info-nickname-info">
				<i class="mgc_IDcard_fill"></i>
				<text>UID：{{userInfo.uid}}</text>
			</u-row>
			<u-row class="user-info-nickname-info">
				<i class="mgc_profile_fill"></i>
				<text class="u-line-1">{{userInfo.introduce?userInfo.introduce:'系统默认签名'}}</text>
			</u-row>
			<view style="margin-top: 40rpx;">
				<u-row>
					<view>
						<text class="user-info-detail">{{userInfo.fans}}</text>
						<text class="user-info-detail-noti">粉丝</text>
					</view>
					<view style="margin-left: 30rpx;">
						<text class="user-info-detail">{{userInfo.follows}}</text>
						<text class="user-info-detail-noti">关注</text>
					</view>
					<view style="margin-left: 30rpx;" @click="goPage('wallet')">
						<text class="user-info-detail">{{userInfo.assets}}</text>
						<text class="user-info-detail-money">{{$store.state.appInfo.currencyName||'积分'}}</text>
					</view>
				</u-row>
			</view>
		</view>
		<view v-else class="user-info" @click="goLogin()">
			<text class="user-info-nickname">登录解锁更多精彩</text>
		</view>
		<u-gap height="20"></u-gap>
		<!-- 创作中心 -->
		<view class="creator">
			<text>创作中心</text>
			<view class="creator-inner-container">
				<view class="creator-item" @click="goPage('userArticle')">
					<i class="mgc_edit_4_line"></i>
					<u-gap height="1"></u-gap>
					<text>稿件管理</text>
				</view>
				<view class="creator-item" @click="$u.toast('开发中...')">
					<i class="mgc_firework_line"></i>
					<u-gap height="1"></u-gap>
					<text>精彩活动</text>
				</view>
			</view>
		</view>
		<!-- 菜单 -->
		<u-grid :col="4">
			<u-grid-item v-for="(item,index) in menu" :key="index" @click="goPage(item.path)">
				<view class="creator-item" style="margin-top: 30rpx;">
					<i :class="item.icon" style="font-size: 50rpx;"></i>
					<u-gap height="8"></u-gap>
					<text>{{item.name}}</text>
				</view>
			</u-grid-item>
			<u-grid-item @click="goPage('level')">
				<view class="creator-item" style="margin-top: 30rpx;">
					<i class="mgc_VIP_1_line" style="font-size: 50rpx;"></i>
					<u-gap height="8"></u-gap>
					<text>我的等级</text>
				</view>
			</u-grid-item>
			<u-grid-item @click="goService()">
				<view class="creator-item" style="margin-top: 30rpx;">
					<i class="mgc_service_line" style="font-size: 50rpx;"></i>
					<u-gap height="8"></u-gap>
					<text>联系客服</text>
				</view>
			</u-grid-item>
			<u-grid-item @click="goPage('addProduct')" v-if="$store.state.userInfo.group=='administrator'">
				<view class="creator-item" style="margin-top: 30rpx;">
					<i class="mgc_shopping_bag_3_line" style="font-size: 50rpx;"></i>
					<u-gap height="8"></u-gap>
					<text>发布商品</text>
				</view>
			</u-grid-item>
		</u-grid>

		<!-- 其他控件 -->
		<view class="other-list">
			<u-row justify="space-between">
				<u-row>
					<i class="mgc_align_arrow_up_line other-list-icon"></i>
					<text>当前版本</text>
				</u-row>
				<text class="other-list-right" style="font-size: unset;">{{system.appVersion}}</text>
			</u-row>
			<!-- #ifdef APP -->
			<u-gap height="15"></u-gap>
			<u-row justify="space-between" @click="getUpdate()">
				<u-row>
					<i class="mgc_refresh_1_line other-list-icon"></i>
					<text>更新检测</text>
				</u-row>
				<i class="mgc_right_line other-list-right"></i>
			</u-row>
			<!-- #endif -->

			<u-gap height="15"></u-gap>
			<u-row justify="space-between" @click="goPage('setting')">
				<u-row>
					<i class="mgc_settings_1_line other-list-icon"></i>
					<text>设置</text>
				</u-row>
				<i class="mgc_right_line other-list-right"></i>
			</u-row>
			<u-gap height="15"></u-gap>
			<u-row justify="space-between" @click="goPage('about')">
				<u-row>
					<i class="mgc_information_line other-list-icon"></i>
					<text>关于</text>
				</u-row>
				<i class="mgc_right_line other-list-right"></i>
			</u-row>
		</view>

	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import articleItem from '../components/user/article.vue';
	import commentItem from '../components/user/comment.vue';
	import silenceUpdate from '@/uni_modules/rt-uni-update/js_sdk/silence-update.js' //引入静默更新
	export default {
		components: {
			articleItem,
			commentItem
		},
		props: {
			index: {
				type: [String, Number],
				default: 0,
			},
			current: {
				type: [String, Number],
				default: 0
			}
		},
		watch: {
			current: {
				handler(e) {
					if (e == this.index && this.$store.state.hasLogin) {
						this.isMounted = true;
						this.$nextTick(() => {
							this.onRefresh();
						})
						this.getTodayEndTime()
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				showLevel: false,
				showRightMenu: false,
				isMounted: false,
				backgroundShow: false,
				cropperBg: null,
				menu: [{
						name: '积分商店',
						icon: 'mgc_shop_line',
						path: 'shop',
					}, {
						name: '我的订单',
						icon: 'mgc_coupon_line ',
						path: 'orderList',
					},
					{
						name: '我的奖品',
						icon: 'mgc_gift_line',
						path: 'myReward'
					}, {
						name: "挂饰兑换",
						icon: "mgc_sparkles_line",
						path: "exchange"
					},
					{
						name: "我的收藏",
						icon: "mgc_star_line ",
						path: "collect"
					},
					{
						name: "浏览历史",
						icon: "mgc_time_line",
						path: "history"
					},
					{
						name: "我的头衔",
						icon: "mgc_candy_line",
						path: "rank"
					}
				],

				tabsIndex: 0,
				list: [{
					name: '发布'
				}, {
					name: '评论'
				}, ],
				opacity: 0,
				allHeight: 0,
				isScroll: false,
				showArticleMenu: false,
				tasks: {},
				edit: {},
				showDelete: false,
				theme: '#fff',
				sticky: 0,
				hours: 0,
				system: {},
				cachedEndTime: 0,

			}
		},
		computed: {
			...mapState(['userInfo']),
			getTime() {
				var date = new Date();
				var hour = date.getHours();
				var greeting = "";
				var backgroundColor = "";

				if (hour >= 6 && hour < 12) {
					greeting = "早上好喵~";
					backgroundColor = "#f07b3f"; // 早上的背景色
				} else if (hour >= 12 && hour < 18) {
					greeting = "中午好喵~";
					backgroundColor = "#ffd460"; // 中午的背景色
				} else {
					greeting = "晚上好喵~";
					backgroundColor = "#2d4059"; // 晚上的背景色
				}

				return {
					greeting,
					backgroundColor,
					hour
				};
			},
			fillStyle() {
				// 计算百分比
				const percentage = Math.floor((this.userInfo.experience || 0 / this.userInfo.nextExp || 0) * 100);
				// 根据百分比返回填充样式
				return `conic-gradient(#88d8c0 ${percentage}%, transparent ${percentage}% 100%)`;
			},
		},
		created() {
			uni.$on('login', data => {
				this.$store.commit('loginStatus')
				this.isMounted = true
			})
			this.tasks = uni.getStorageSync('userTasks')
			if (uni.getSystemInfoSync().theme == 'dark') this.theme = '#292929'
			uni.onThemeChange((res) => {
				if (res.theme == 'dark') this.theme = "#292929";
				else this.theme = '#fff'
			})
			let system = uni.getSystemInfoSync()
			this.system = system;
			this.sticky = system.statusBarHeight + 44
		},
		onShow() {
			let date = new Date();
			this.hours = date.getHours();
		},


		methods: {
			//tabs通知swiper切换
			tabsChange(index) {
				this.tabsIndex = index;
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.tabsIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
			},
			onRefresh() {
				if (this.$store.state.hasLogin) {
					// this.$refs.collect.reload()
					this.getUserInfo()
				}

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

			goLogout() {
				this.$store.commit('logout');
				this.$Router.replaceAll({
					path: '/pages/index/index'
				})
			},
			goProfile() {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id: this.userInfo.uid
					}
				})
			},
			chooseBackImg() {
				if (!this.$store.state.hasLogin) return;
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					success: (res) => {
						this.cropperBg = res.tempFilePaths[0];
						this.backgroundShow = true
					}
				})
			},
			upload(url, ) {
				this.$http.upload('/upload/full', {
					filePath: url,
					name: 'file'
				}).then(res => {

					if (res.data.code == 200) {
						this.save(res.data.data.url)
					}
				})
			},
			save(url) {
				this.$http.post('/user/update', {
					background: url
				}).then(res => {
					if (res.data.code == 200) {
						this.getUserInfo()
					}
				})
			},
			goPage(path) {
				if (!path && path == "") return;
				this.$Router.push({
					name: path
				})
			},
			goLogin() {
				this.$Router.push({
					path: '/pages/user/login',
				})
			},
			scroll(data) {
				const scrollTop = data.detail.scrollTop;
				this.opacity = scrollTop / 100;
				if (scrollTop > 407) this.isScroll = true;
				else this.isScroll = false;
			},
			bottomTap(data) {
				switch (data.type) {
					case 'logout':
						this.goLogout();
						break;
					default:
						break;
				}
			},
			checkUp() {
				if (this.$store.state.tasks.isSign) return;
				this.$http.post('/user/sign').then(res => {
					if (res.data.code == 200) {
						uni.$u.toast(res.data.msg)
						this.getUserTasks()
					}
				})
			},
			getUserTasks() {
				this.$http.get('/user/tasks').then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setTasks', res.data.data);
						this.tasks = res.data.data
					}
				})
			},
			goEdit() {
				let data = this.edit
				this.$Router.push({
					path: data.type == 'post' ? '/publish/article/article' : '',
					query: {
						update: 1,
						id: this.edit.cid
					}
				})
				this.showArticleMenu = false;
			},
			deleteArticle() {
				let data = this.edit
				this.$http.post('/article/delete', {
					id: data.cid
				}).then(res => {
					if (res.data.code == 200) {
						this.showDelete = false
						this.$refs.publish.reload()
						this.showArticleMenu = false
					}
					uni.$u.toast(res.data.msg)
				})
			},
			goService() {
				// 获取客服QQ this.$config.service
				// #ifdef APP
				plus.runtime.openWeb(this.$config.service)
				// #endif
				// #ifdef H5
				window.open(this.$config.service)
				// #endif
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
					this.$http.get('/system/app', {}).then(res => {
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

							if (Number(data.edition_number) == Number(inf.versionCode)) {
								uni.$u.toast('已是最新版本');
							}
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
									}, 200)

								}
							}
						}
					})

				});
			},
			getTodayEndTime() {
				const now = new Date();
				const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
				if (uni.getStorageSync('CacheEndTime')) {
					let time = uni.getStorageSync('CacheEndtime')
					if (Date.now() > time) {
						this.checkUp()
					}
				} else {
					uni.setStorageSync('CacheEndTime', endOfDay.getTime())
					this.checkUp()
				}
			},

		}
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark) {}

	.user-banner {
		position: relative;
		height: 440rpx;
		width: 100%;

		&-radius {
			position: absolute;
			height: 46rpx;
			bottom: 0;
			width: 100%;
			background-color: white;
			border-radius: 20rpx 20rpx 0 0;
		}

		&-avatar_contaniner {
			position: absolute;
			bottom: 0;
			width: 100%;

			&-avatar {
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				transform: translate(0, 25%);
				margin: 0 30rpx;
			}

			&-button_container {
				display: flex;
				align-items: center;

				&-zone {
					height: 60rpx;
					font-size: 28rpx;
					border-radius: 50rpx;
					border: #eee solid 2rpx;
					border-radius: 50rpx;
					margin-right: 20rpx;
				}

				&-edit {
					height: 60rpx;
					font-size: 28rpx;
					width: 160rpx;
					flex-shrink: 0;
					border-radius: 50rpx;
					border-radius: 50rpx;
					color: $c-primary;
					border: $c-primary solid 2rpx;
				}
			}
		}
	}

	.user-info {
		margin: 30rpx;

		&-nickname {
			font-weight: bold;
			font-size: 36rpx;

			&-info {
				color: #999;
				font-size: 28rpx;

				&>i {
					font-size: 36rpx;
					margin-right: 15rpx;
					color: #00aaee;
				}
			}
		}

		&-detail {

			font-size: 34rpx;

			&-noti {
				margin-left: 15rpx;
				color: #999;
				font-size: 28rpx;
			}

			&-money {
				margin-left: 15rpx;
				font-size: 28rpx;
				color: #ffb300;
			}
		}
	}

	.creator {
		background-color: $c-primary;
		padding: 20rpx;
		font-size: 34rpx;
		margin: 0 30rpx;
		color: white;
		border-radius: 20rpx;

		&-inner-container {
			margin-top: 20rpx;
			border-radius: 20rpx;
			padding: 20rpx;
			background-color: white;
			display: flex;
			justify-content: space-around;
			align-items: center;

		}

		&-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			color: #999;
			font-size: 28rpx;

			&>i {
				font-size: 60rpx;
			}
		}
	}

	.other-list {
		margin: 30rpx;
		border-radius: 20rpx;
		background-color: #fafafa;
		padding: 20rpx;

		&-icon {
			font-size: 40rpx;
			margin-right: 15rpx;
		}

		&-right {
			font-size: 40rpx;
			color: #999;
		}
	}
</style>