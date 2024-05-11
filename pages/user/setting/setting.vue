<template>
	<view class="content">
		<view>
			<u-navbar title="设置" placeholder autoBack bgColor="transparent">
				<view slot="left">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
			</u-navbar>
			<view v-if="$store.state.hasLogin">
				<u-row justify="space-between" style="padding: 20rpx 30rpx;" @click="goPage('account')">
					<text>账号与安全</text>
					<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
				</u-row>
			</view>
			<u-gap height="6" bgColor="#f7f7f7" class="article-gap"></u-gap>
			<u-row justify="space-between" style="padding: 20rpx 30rpx;">
				<text>护眼模式</text>
				<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
			<u-row justify="space-between" style="padding: 20rpx 30rpx;">
				<text>动图自动播放</text>
				<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
			<u-row justify="space-between" style="padding: 20rpx 30rpx;">
				<text>列表视频自动播放</text>
				<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
			</u-row>
			<u-gap height="6" bgColor="#f7f7f7" class="article-gap"></u-gap>
			<view>
				<u-row justify="space-between" style="padding: 20rpx 30rpx;">
					<text>关于{{systemInfo.appName}}</text>
					<u-row>
						<text
							style="font-size: 28rpx;">版本{{systemInfo.appVersion}}({{systemInfo.appVersionCode}})</text>
						<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
					</u-row>

				</u-row>
				<u-row justify="space-between" style="padding: 20rpx 30rpx;" @click="clearCache()">
					<text>清除缓存</text>
					<u-row>
						<text style="font-size: 28rpx;">{{cacheSize}}Mb</text>
						<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
					</u-row>

				</u-row>
				<u-row justify="space-between" style="padding: 20rpx 30rpx;">
					<text>建议与反馈</text>
					<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
				</u-row>
				<!-- <u-row justify="space-between" style="padding: 20rpx 30rpx;" @click="getUpdate()">
					<text>检查更新</text>
					<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
				</u-row> -->
			</view>
			<u-gap height="6" bgColor="#f7f7f7" class="article-gap"></u-gap>
			<view>
				<u-row justify="space-between" style="padding: 20rpx 30rpx;">
					<text>用户协议</text>
					<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
				</u-row>
				<u-row justify="space-between" style="padding: 20rpx 30rpx;">
					<text>隐私政策</text>
					<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
				</u-row>
				<u-row justify="space-between" style="padding: 20rpx 30rpx;">
					<text>个人信息收集清单</text>
					<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
				</u-row>
				<u-row justify="space-between" style="padding: 20rpx 30rpx;">
					<text>第三方共享个人信息清单</text>
					<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
				</u-row>

				<u-row justify="space-between" style="padding: 20rpx 30rpx;" @click="goSource()">
					<text>关于FANBBS</text>
					<i class="ess mgc_right_small_line" style="font-size: 50rpx;"></i>
				</u-row>
			</view>
		</view>
		<view style="padding: 30rpx;" v-if="$store.state.hasLogin">
			<u-button color="#ff165d" @click="$store.commit('logout')">退出登录</u-button>
		</view>

	</view>
</template>

<script>
	import silenceUpdate from '@/uni_modules/rt-uni-update/js_sdk/silence-update.js' //引入静默更新
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				appName: null,
				systemInfo: {},
				cacheSize: '',
			}
		},
		computed: {
			...mapState(['appInfo'])
		},
		onLoad(){
			this.systemInfo = uni.getSystemInfoSync()
			this.getCacheSize()
		},
		methods: {
			goPage(page) {
				this.$Router.push({
					name: page
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
			getCacheSize() {
				let size = uni.getStorageInfoSync().currentSize
				this.cacheSize = (size / 1024).toFixed(2)
			},
			clearCache() {
				uni.getStorageInfo({
					success: function(res) {
						for (let key of res.keys) {
							if (key.includes('z-paging-cache')) {
								uni.removeStorage({
									key: key,
									success: function() {},
									fail: function(error) {

									}
								});
							}
						}
						uni.$u.toast('清除完成')
					},
				});
			},
			goSource() {
				// #ifdef APP
				plus.runtime.openURL("https://gitee.com/qianshn/fanbbs")
				// #endif
				// #ifndef APP
				window.open("https://gitee.com/qianshn/fanbbs")
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100vh;
	}
</style>