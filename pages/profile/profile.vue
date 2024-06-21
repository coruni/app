<template>
	<view>
		<z-paging ref="paging" refresher-only @onRefresh="onRefresh" @scroll="scroll">
			<template #top>
				<u-navbar :bgColor="$u.colorToRgba(theme, opacity)" id="navbar">
					<view slot="left">
						<u-row>
							<i class="mgc_left_line" style="font-size: 60rpx;"
								:style="{color: opacity >= 0.5 ? (theme === '#292929' ? '#fff' : 'black') : 'white'}"
								@click="$Router.back()"></i>
							<u-row customStyle="margin-left:20rpx" v-show="opacity>=1"
								@click="$refs.paging.scrollToTop()">
								<u-avatar :src="info.avatar" size="26"></u-avatar>
								<text style="margin-left:20rpx;font-Weight: bold;"
									:class="{'vipname':info&& info.isVip}">{{info.screenName?info.screenName:info.name}}</text>
							</u-row>
						</u-row>
					</view>
					<u-button :plain="!info.isFollow" :color="!info.isFollow?'#88d8c0':'#88d8c00f'" shape="circle"
						customStyle="height:60rpx;width:160rpx" v-show="opacity>=1" slot="right">
						<text :style="{color:info.isFollow?'black':'#88d8c0'}">{{info.isFollow?'已关注':'关注'}}</text>
					</u-button>
					<view slot="right">
						<i class="mgc_more_1_line" style="font-size: 60rpx;"
							:style="{color: opacity >= 0.5 ? (theme === '#292929' ? '#fff' : 'black') : 'white'}"
							@click="showMore= true"></i>
					</view>
				</u-navbar>
			</template>
			<image :src="info && info.userBg?info.userBg:'/static/login.jpg'" mode="aspectFill"
				style="width: 100%;height: 500rpx;transform: scale(1);" class="backCover"></image>
			<view class="userPanel" id="profile">
				<view style="position: absolute;top: -80rpx;">
					<u-avatar :src="info.avatar" size="80">
					</u-avatar>
					<image class="avatar_head" mode="aspectFill" :src="info && info.opt&&info.opt.head_picture">
					</image>
				</view>

				<u-row justify="space-between" align="top" customStyle="padding-top:30rpx">
					<view style="margin-top: 80rpx;">
						<u-row>
							<text style="font-Weight: bold;font-size: 34rpx;"
								:class="{'vipname':info&& info.isVip}">{{info.screenName?info.screenName:info.name}}</text>
							<text
								:style="{border:`${info.level > 8 ? $level[Math.floor(info.level/2)-1] : $level[info.level-1]} solid 2rpx`,background:info.level > 8 ? $level[Math.floor(info.level/2)-1] : $level[info.level-1] }"
								style="font-size: 18rpx;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx;color: white;"
								v-if="info.level">
								Lv.{{info.level}}
							</text>
						</u-row>

						<u-row style="font-size:28rpx">
							<i class="mgc_IDcard_line" style="margin-right: 10rpx;"></i>
							<text>通行证ID：{{info.uid}}</text>
						</u-row>
						<u-row style="font-size:28rpx;color: #999;">
							<i class="mgc_profile_line" style="margin-right: 10rpx;"></i>
							<text>{{info.introduce?info.introduce:'系统默认签名~'}}</text>
						</u-row>
					</view>

					<view style="display: flex;justify-content: center;" v-if="info.uid != $store.state.userInfo.uid">
						<u-button customStyle="height:60rpx;width:120rpx;margin-right:20rpx" color="#88d8c0"
							shape="circle" @click="goPrivate(info)">私信</u-button>
						<u-button :plain="!info.isFollow" :color="!info.isFollow?'#88d8c0':'#88d8c00f'" shape="circle"
							customStyle="height:60rpx;width:160rpx"
							@click="!info.isFollow?follow(info.uid):$refs.follow.open()">
							<text :style="{color:info.isFollow?'black':'#88d8c0'}">{{info.isFollow?'已关注':'关注'}}</text>
						</u-button>
					</view>
				</u-row>

				<!-- ban Tips -->
				<view class="banTips" v-if="info.isBan">
					<u-row style="font-size: 28rpx;">
						<i class="mgc_alert_line" style="font-size: 32rpx;"></i>
						<text>该用户已被封禁</text>
						<text style="margin-left: 10rpx;">{{$u.timeFormat(info.bantime, 'yyyy年mm月dd日 hh:MM')}}</text>
					</u-row>
				</view>
				<u-row justify="space-around" customStyle="margin-top:40rpx">
					<view class="userMate">
						<text style="font-size: 34rpx;font-Weight: bold;">{{info &&info.articles}}</text>
						<text>帖子</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-Weight: bold;">{{info &&info.follows}}</text>
						<text>关注</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-Weight: bold;">{{info &&info.fans}}</text>
						<text>粉丝</text>
					</view>
					<view class="userMate">
						<text style="font-size: 34rpx;font-Weight: bold;">{{info &&info.comments}}</text>
						<text>评论</text>
					</view>
				</u-row>
			</view>
			<view style="position: relative;top: 0rpx;">
				<view>
					<!-- #ifndef APP -->
					<u-sticky bgColor="#fff">
						<z-tabs ref="tabs" :list="tabs" :scrollCount="1" :current="tabsIndex" @change="tabsChange"
							bar-height="6" bar-width="20" active-color="#88d8c0" inactive-color="#999"
							bgColor="transparent"></z-tabs>
					</u-sticky>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<u-sticky bgColor="#fff" :offsetTop="sticky">
						<z-tabs ref="tabs" :list="tabs" :scrollCount="1" :current="tabsIndex" @change="tabsChange"
							bar-height="6" bar-width="20" active-color="#88d8c0" inactive-color="#999"
							bgColor="transparent"></z-tabs>
					</u-sticky>
					<!-- #endif -->
					<swiper style="height: 100vh;" :current="tabsIndex" @transition="swiperTransition"
						@animationfinish="swiperAnimationfinish">
						<swiper-item style="overflow: auto;">
							<publish :isScroll="isScroll" :uid="id" ref="publish"></publish>
						</swiper-item>
						<swiper-item style="overflow: auto;">
							<comment :isScroll="isScroll" :uid="id" ref="comment"></comment>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</z-paging>
		<uv-modal :showConfirmButton="false" ref="follow" title="提示" width="500rpx">
			<view style="flex:1;display: flex;flex-direction: column;">
				<view style="text-align: center;">
					<text>是否取消关注？</text>
				</view>
				<view style="margin-top: 30rpx;">
					<u-row>
						<u-button plain shape="circle" style="margin-right: 10rpx;"
							@click="$refs.payMent.close()">取消</u-button>
						<u-button shape="circle" color="#88d8c0" style="margin-left: 10rpx;"
							@click="follow(info.uid)">确定</u-button>
					</u-row>
				</view>
			</view>
			<view slot="confirmButton"></view>
		</uv-modal>
		<u-popup :show="showMore" mode="bottom" round="10">
			<view style="padding: 30rpx;">
				<u-row@click="goReport(info.uid,0,'user')">
					<i class="ess mgc_alert_line" style="font-size: 40rpx;"></i>
					<text style="margin-left:20rpx">举报</text>
					</u-row>
					<!-- #ifdef APP -->
					<u-row customStyle="margin-top: 30rpx;">
						<i class="ess mgc_share_forward_line" style="font-size: 40rpx;"></i>
						<text style="margin-left:20rpx" @click="shareWithSystem()">通过系统分享</text>
					</u-row>
					<!-- #endif -->
			</view>

		</u-popup>
	</view>
</template>

<script>
	import publish from './components/articleItem.vue';
	import comment from './components/commentItem.vue';
	export default {
		components: {
			publish,
			comment,
		},
		props: {
			nav: {
				type: Boolean,
				default: false
			},

		},
		data() {
			return {
				id: 0,
				info: {},
				swiperIndex: 0,
				tabsIndex: 0,
				isfollow: false,
				userData: {},
				isScroll: false,
				systemInfo: {},
				tabs: [{
						name: '帖子'
					},
					{
						name: '评论'
					},
					{
						name: '收藏'
					}
				],
				stopMove: false,
				opacity: 0,
				scrollTop: 0,
				isScroll: false,
				elementHeight: 0,
				navbarHeight: 0,
				sticky: 0,
				theme: '#ffffff',
				showMore: false,
			};
		},
		onLoad(params) {
			this.id = params.id
			this.getAuthor(this.$Route.query.id)
			this.systemInfo = uni.getSystemInfoSync()
			this.sticky = this.systemInfo.statusBarHeight + 44
			if (this.systemInfo.theme == 'dark') this.theme = '#292929';
		},
		onReady() {
			uni.createSelectorQuery().in(this).select('#profile').boundingClientRect(data => {
				this.elementHeight = data.bottom
			}).exec()
		},
		methods: {
			getAuthor(id) {
				this.$http.get('/user/userInfo', {
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
				this.$refs.publish.reload()
				// #ifdef APP
				if (uni.getSystemInfoSync().theme != 'dark') plus.navigator.setStatusBarStyle("dark");
				// #endif

				setTimeout(() => {
					this.$refs.paging.complete();
					// #ifdef APP
					plus.navigator.setStatusBarStyle("light");
					// #endif

				}, 1000)

			},
			changTab(data) {
				this.tabsIndex = data.index
				this.swiperIndex = data.index
			},
			animationfinish(data) {
				this.swiperIndex = data.detail.current
				this.tabsIndex = data.detail.current
			},
			scroll(data) {
				const scrollTop = data.detail.scrollTop;
				this.opacity = scrollTop / 200;
				// #ifdef APP
				if (this.opacity > 0 && this.systemInfo.theme != 'dark') {
					plus.navigator.setStatusBarStyle("dark");
				} else {
					plus.navigator.setStatusBarStyle("light");
				}
				// #endif

				if (scrollTop >= this.elementHeight) this.isScroll = true
				else this.isScroll = false
			},

			goPrivate(data) {
				if (data.uid == this.$store.state.userInfo.uid) {
					uni.$u.toast('不能私聊自己')
					return;
				}
				this.$Router.push({
					path: '/pages/notice/private',
					query: {
						receiver_id: data.uid,
						nickname: data.screenName ? data.screenName : data.name
					}
				})
			},
			follow(id) {
				if (this.$store.state.userInfo.uid == id) {
					uni.$u.toast('不可以关注自己');
					return;
				};
				this.$http.post('/user/follow', {
					id
				}).then(res => {
					if (res.data.code == 200) {
						uni.$u.toast(res.data.msg)
						this.info.isFollow = !this.info.isFollow
					}
				})

				this.$refs.follow.close()
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
			goReport(user_id, article_id, type) {
				this.showMore = false
				this.$Router.push({
					path: '/pagesA/report/report',
					query: {
						user_id,
						article_id,
						type
					}
				})
			}

		}
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark) {
		.userPanel {
			background-color: #292929 !important;
			border-bottom: 1rpx solid #191919 !important;
		}
	}

	.userMate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
	}

	.userPanel {
		position: relative;
		top: -60rpx;
		background-color: #fff;
		border-radius: 40rpx 40rpx 0 0;
		padding: 0 40rpx 40rpx 40rpx;
		border-bottom: 1rpx solid #f7f7f7;
	}

	.u-button::before {
		background: #88d8c0;
	}

	.backCover {
		height: 100%;
		background-size: cover;
		background-repeat: no-repeat;
	}

	.backCover::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.banTips {
		margin-top: 40rpx;
		color: white;
		background-color: #ed1c24a1;
		padding: 15rpx;
		border-radius: 10rpx;

	}
</style>