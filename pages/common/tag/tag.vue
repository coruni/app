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
						<!-- <view style="flex-shrink: 0;">
							<u-button color="#88d8c0" style="height: 60rpx;" shape="circle"
								@click="follow(info.mid)">{{info.isFollow?'已关注':'关注'}}</u-button>
						</view> -->
					</u-row>
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
			<z-tabs ref="tabs" :list="list" :scrollCount="1" :current="tabsIndex" @change="tabsChange"
				active-color="#88d8c0" bar-animate-mode="worm" bgColor="transparent" :active-style="{fontWeight:600}">
			</z-tabs>
		</u-sticky>
		<!-- #endif -->
		<!-- #ifdef APP -->
		<u-sticky :bgColor="theme === '#292929' ? theme : (info.opt && info.opt.primary ? info.opt.primary : '#fff')"
			offsetTop="65">
			<z-tabs ref="tabs" :list="list" :scrollCount="1" :current="tabsIndex" @change="tabsChange"
				active-color="#88d8c0" bar-animate-mode="worm" bgColor="transparent"
				:active-style="{fontWeight:600}"></z-tabs>
		</u-sticky>
		<!-- #endif -->
		<view
			:style="{background: theme === '#292929' ? theme : (info.opt && info.opt.primary ? info.opt.primary : '#fff')}">
			<swiper :style="{height: windowHeight + 'px'}" :current="tabsIndex" @transition="swiperTransition"
				@animationfinish="swiperAnimationfinish">
				<swiper-item v-for="(item, index) in list" :key="index" style="overflow: auto;">
					<articleItem :mid="id" :isScroll="isScroll" :order="item.order" :random="item.random" ref="article">
					</articleItem>
				</swiper-item>
			</swiper>
		</view>
	</z-paging>

</template>
<script>
	import articleItem from './components/article.vue';
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
				list: [{
						name: '热门',
						order: 'isCircleTop desc,likes desc,replyTime desc,text desc,views desc,created desc',
						random: true,

					},
					{
						name: '最新',
						order: 'isCircleTop desc,created desc',
						random: false,

					}
				],
				theme: '#ffffff',
				windowHeight: 0,
			};
		},
		onLoad(params) {
			this.id = params.id
			this.getData(params.id)
			this.platform = uni.getSystemInfoSync().uniPlatform
			this.windowHeight = uni.getSystemInfoSync().windowHeight
			if (uni.getSystemInfoSync().theme == 'dark') this.theme = '#292929'

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
				setTimeout(() => {
					this.$refs.paging.complete()
				}, 1000)
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
		}
	}
</script>

<style lang="scss">
	@media (prefers-color-scheme: dark) {
	}

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