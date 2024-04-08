<template>
	<z-paging refresher-only @onRefresh="onRefresh" ref="paging" @scroll="onScroll">
		<template #top>
			<u-navbar autoBack
				:bgColor="theme === '#292929' ? $u.colorToRgba(theme, opacity) : (info.opt && info.opt.primary ? $u.colorToRgba(info.opt.primary, opacity) : $u.colorToRgba('#fff', opacity))">
				<view slot="left">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"
						:style="{color: opacity >= 0.5 ? (theme === '#292929' ? '#fff' : 'black') : 'white'}"></i>
				</view>
			</u-navbar>
		</template>
		<!-- 背景 -->
		<view id="infoPanel" style="position: relative;height: 240px;">
			<view
				:style="{backgroundImage:`url(${info.opt && info.opt.background?info.opt.background:'/static/login.jpg'})`}"
				class="backCover">
			</view>
			<view style="position: absolute;top: 120rpx;width: 100%;">
				<view style="margin: 30rpx;">
					<u-row justify="space-between">
						<u-row style="flex: 1;">
							<image :src="info.imgurl" mode="aspectFill"
								style="border-radius: 20rpx;width: 120rpx;height: 120rpx;border-radius: 20rpx;background: #f7f7f7;flex-shrink: 0;">
							</image>
							<view style="display: flex;flex-direction: column;margin-left: 20rpx;color: white;">
								<text>{{info.name}}</text>
								<text style="font-size: 26rpx;" class="u-line-2">{{info.description}}</text>
							</view>
						</u-row>
						<view style="flex-shrink: 0;">
							<u-button color="#aa96da" style="height: 60rpx;" shape="circle"
								@click="follow(info.mid)">{{info.isFollow?'已关注':'关注'}}</u-button>
						</view>
					</u-row>

					<view style="margin-top: 60rpx;">
						<u-row justify="space-between">
							<u-col :span="8">
								<u-row justify="space-between">
									<view
										style="background: #aa96daa0;color: #fff;padding: 4rpx 20rpx;border-radius: 20rpx;">
										<i class="ess mgc_ghost_line"></i>
										<text style="margin-left: 20rpx;">{{info.follows}}</text>
									</view>
									<view
										style="background: #ffe085a0;color: #fff;padding: 4rpx 20rpx;border-radius: 20rpx;">
										<i class="ess mgc_quill_pen_line"></i>
										<text style="margin-left: 20rpx;">{{info.count}}</text>
									</view>
									<view
										style="background: #ff85a3a0;color: #fff;padding: 4rpx 20rpx;border-radius: 20rpx;">
										<i class="ess mgc_ghost_line"></i>
										<text style="margin-left: 20rpx;">{{info.follows}}</text>
									</view>
								</u-row>
							</u-col>
						</u-row>
					</view>
				</view>
			</view>
			<view style="position: absolute; bottom: 0; width: 100%;">
				<view style="width: 100%; height: 22rpx; border-radius: 20rpx 20rpx 0 0;"
					:style="{background: theme === '#292929' ? theme : (info.opt && info.opt.primary ? info.opt.primary : '#fff')}">
				</view>
			</view>
		</view>
		<!-- #ifndef APP -->
		<u-sticky :bgColor="theme === '#292929' ? theme : (info.opt && info.opt.primary ? info.opt.primary : '#fff')">
			<z-tabs ref="tabs" :list="list" :scrollCount="1" :current="tabsIndex" @change="tabsChange" bar-height="6"
				bar-width="20" active-color="#aa96da" inactive-color="#999" bgColor="transparent">
			</z-tabs>
		</u-sticky>
		<!-- #endif -->
		<!-- #ifdef APP -->
		<u-sticky :bgColor="theme === '#292929' ? theme : (info.opt && info.opt.primary ? info.opt.primary : '#fff')"
			:offsetTop="sticky">
			<z-tabs ref="tabs" :list="list" :scrollCount="1" :current="tabsIndex" @change="tabsChange" bar-height="6"
				bar-width="20" active-color="#aa96da" inactive-color="#999" bgColor="transparent">
			</z-tabs>
		</u-sticky>
		<!-- #endif -->
		<view
			:style="{background: theme === '#292929' ? theme : (info.opt && info.opt.primary ? info.opt.primary : '#fff')}">
			<swiper :style="{height: windowHeight + 'px'}" :current="tabsIndex" @transition="swiperTransition"
				@animationfinish="swiperAnimationfinish">
				<swiper-item v-for="(item, index) in list" :key="index" style="overflow: auto;">
					<articleItem :mid="id" :isScroll="isScroll" :order="item.order" :random="item.random" ref="article"
						@edit="showMoreMenu = true;data=$event">
					</articleItem>
				</swiper-item>
			</swiper>
		</view>
		<!-- 菜单弹出 -->
		<u-popup :show="showMoreMenu" @close="showMoreMenu = false" :closeable="true" round="10">
			<view style="padding: 30rpx;">
				<view style="
				text-align: center;
				color: #999;">
					<text>分享至</text>
				</view>
				<view style="margin-top: 50rpx;">
					<u-row customStyle="border-bottom:1rpx solid #aa96da0a;padding-bottom:30rpx" justify="space-around">
						<block v-for="(item,index) in share" :key="index">
							<u-row align="center" customStyle="flex-direction:column" @click="shareArticle('api',item)">
								<view style="padding: 20rpx;border-radius: 100rpx;" :style="{background:item.color}">
									<u-icon :name="item.icon" color="white" size="24"></u-icon>
								</view>
								<text style="margin-top: 20rpx;">{{item.name}}</text>
							</u-row>
						</block>
					</u-row>
					<view style="display: flex;flex-direction: column;margin-top: 50rpx;">
						<u-row style="margin:20rpx 0">
							<i class="ess mgc_alert_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">举报</text>
						</u-row>
						<u-row style="margin:20rpx 0" @click="shareArticle('link')">
							<i class="ess mgc_flash_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">复制链接</text>
						</u-row>
						<!-- #ifdef APP -->
						<u-row style="margin:20rpx 0" @click="shareArticle('system')">
							<i class="ess mgc_share_forward_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">通过系统分享</text>
						</u-row>
						<!-- #endif -->
						<u-row style="margin:20rpx 0" @click="goEdit()" v-if="permission">
							<i class="ess mgc_edit_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">编辑</text>
						</u-row>
						<u-row style="margin:20rpx 0;color:red" @click="showDelete = true" v-if="permission">
							<i class="ess mgc_delete_2_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">删除</text>
						</u-row>
					</view>
				</view>
			</view>
			<!-- 删除弹出 -->
			<u-popup :show="showDelete" :round="10" mode="center" @close="showDelete = false"
				customStyle="width:500rpx">
				<view style="display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 50rpx;">
					<text style="font-size: 34rpx;">提示</text>
					<view style="margin-top:30rpx">
						<text>是否确定删除？</text>
					</view>
					<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
						<u-button plain color="#aa96da" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
							@click="showDelete = false">取消</u-button>
						<u-button color="#aa96da" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
							@click="deleteArticle()">确定</u-button>
					</u-row>
				</view>
			</u-popup>
		</u-popup>
	</z-paging>

</template>
<script>
	import articleItem from './components/article.vue';
	import {
		shareTap,
		shareWithSystem,
		filterHtml
	} from '@/common/common.js';
	export default {
		components: {
			articleItem,
		},
		data() {
			return {
				id: 0,
				info: {},
				isScroll: false,
				isSticky: false,
				panelHeight: 0,
				platform: '',
				opacity: 0,
				tabsIndex: 0,
				data: {},
				list: [{
						name: '热门',
						order: 'likes desc,created desc,views desc',
						random: 1,

					},
					{
						name: '最新',
						order: 'isCircleTop desc,created desc',
						random: 0,

					}
				],
				theme: '#ffffff',
				windowHeight: 0,
				sticky: 0,
				showMoreMenu: false,
				share: [{
						name: '微信',
						icon: 'weixin-fill',
						provider: 'weixin',
						type: 0,
						scene: 'WXSceneSession',
						color: '#46d262'
					},
					{
						name: '朋友圈',
						icon: 'moments',
						provider: 'weixin',
						type: 0,
						scene: 'WXSceneTimeline',
						color: '#46d262'
					},
					{
						name: 'QQ',
						icon: 'qq-fill',
						provider: 'qq',
						type: 2,
						scene: '',
						color: '#0070ff'
					},

				],
				showDelete: false,
			};
		},
		onLoad(params) {
			this.id = params.id
			this.getData(params.id)
			let systemInfo = uni.getSystemInfoSync()
			this.platform = systemInfo.uniPlatform
			this.windowHeight = systemInfo.windowHeight
			if (systemInfo.theme == 'dark') this.theme = '#292929';
			this.sticky = systemInfo.statusBarHeight + 44

		},
		computed: {
			permission() {
				if (!this.$store.state.hasLogin) return false;
				let userInfo = this.$store.state.userInfo
				if (this.data && this.data.authorId == userInfo.uid || userInfo.group == 'administrator' || userInfo
					.group == 'editor')
					return true;
				return false;
			}
		},
		methods: {
			getData(id) {
				this.$http.get('/category/info', {
					params: {
						id
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.info = res.data.data
					}
				})
			},
			onRefresh() {
				this.$refs.article[this.tabsIndex].reload()
				setTimeout(() => {
					this.$refs.paging.complete()
				}, 800)
			},
			onScroll(data) {
				let scrollTop = data.detail.scrollTop
				this.opacity = scrollTop / 100;
				if (scrollTop > 240 - 44 - (this.platform == 'app' ? 45 : 0)) {
					this.isScroll = true;
					this.isSticky = true;
				} else {
					this.isSticky = false;
					this.isScroll = false;
				}
			},
			follow(id) {
				this.$http.post('/category/follow', {
					id
				}).then(res => {

					if (res.data.code == 200) {
						this.info.isFollow = !this.info.isFollow
					}
				})
			},
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
			shareArticle(scene, data) {
				let article = this.data
				let type
				switch (article.type) {
					case 'post':
						type = 'article'
						break;
					case 'video':
						type = 'video'
						break;
					case 'photo':
						type = 'photo'
						break;
					default:
						type = 'article'
						break;
				}
				switch (scene) {
					case 'system':
						shareWithSystem(article.title,
							`${this.$config.h5}/#/pages/article/${type}?id=${article.cid}`)
						break;
					case 'api':
						shareTap(data.provider, data.type, data.scene, article.title, filterHtml(article.text),
							`${this.$config.h5}/#/pages/article/${type}?id=${article.cid}`,
							article.images[0])
						break;
					case 'link':
						uni.setClipboardData({
							data: `${this.$config.h5}/#/pages/article/${type}?id=${article.cid}`,
							success: () => {
								uni.$u.toast('复制成功')
							}
						})
						break;
					default:
						break;
				}
				this.showMoreMenu = false;
			},
			goEdit() {
				this.showMoreMenu = false
				let path
				let type = this.data.type;
				if (type == 'post') path = '/publish/article/article';
				if (type == 'photo') path = '/publish/article/photo';
				if (type == 'video') path = '/publish/article/video';
				setTimeout(() => {
					this.$Router.push({
						path: path,
						query: {
							update: true,
							id: this.data.cid
						}
					})
				}, 200)
			},
			deleteArticle() {
				this.$http.post('/article/delete', {
					id: this.data.cid
				}).then(res => {
					if (res.data.code == 200) {
						this.showDelete = false
						uni.$u.toast(res.data.msg)
						this.$refs.home.reload()
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	@media (prefers-color-scheme: dark) {}

	.backCover {
		height: 100%;
		background-size: cover;
		background-repeat: no-repeat;
		filter: blur(1px);
	}

	.backCover::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.2);
	}
</style>