<template>
	<z-paging-swiper>
		<template #top>
			<!-- 头部搜索框 -->
			<u-navbar placeholder bgColor="transparent">
				<!-- 用slot占位取消返回图标 -->
				<view slot="left"></view>
				<view slot="center" style="flex: 1;margin: 0 20rpx;">
					<u-row>
						<u-avatar :src="userInfo.avatar" size="30" customStyle="margin-right:20rpx"
							@click="avatarTap()"></u-avatar>
						<uv-search :showAction="false" placeholder="看你想看" :disabled="true" :animation="true"
							@click="goSearch()" class="search"></uv-search>

					</u-row>
				</view>
			</u-navbar>
		</template>
		<!-- 模拟首屏开始 -->
		<z-tabs ref="tabs" :list="$store.state.homeTabs" :scrollCount="0" :current="topTabIndex" @change="tabsChange"
			bar-height="6" bar-width="20" active-color="#88d8c0" inactive-color="#999" bgColor="transparent"></z-tabs>
		<swiper style="height: 100%;" :current="topTabIndex" @transition="swiperTransition"
			@animationfinish="swiperAnimationfinish">
			<swiper-item>
				<follow @edit="$emit('edit',$event)" ref="home"></follow>
			</swiper-item>
			<swiper-item>
				<recommend @edit="$emit('edit',$event)" ref="home"></recommend>
			</swiper-item>
			<swiper-item v-for="(page,pageIndex) in $store.state.homeTabs" :key="pageIndex" v-if="pageIndex>1">
				<articleItem :mid="page.mid" :swiper="pageIndex" :tabbar="topTabIndex" v-if="!page.iswaterfall"
					@edit="$emit('edit',$event)" ref="home">
				</articleItem>
				<waterfallItem v-else :swiper="pageIndex" :mid="page.mid" :tabbar="topTabIndex" class="waterfall-home">
				</waterfallItem>
			</swiper-item>
		</swiper>

		<!-- 底部占位高度 100rpx -->
		<template #bottom>
			<view style="background: transparent !important;height: 100rpx;"></view>
		</template>
	</z-paging-swiper>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import waterfallItem from './home/waterfall.vue';
	import articleItem from './home/article.vue';
	import recommend from './home/recommend.vue';
	import follow from './home/follow.vue'
	export default {
		components: {
			recommend,
			follow,
			waterfallItem,
			articleItem
		},
		name: 'index',
		data() {
			return {
				content: [],
				topTabbar: [{
						name: '关注'
					},
					{
						name: '推荐',
					}
				],
				showMoreMenu: false,
				data: null,
				page: 1,
				topTabIndex: 1,
				tabbarIndex: 1,
				showPublish: false,
				publish: [{
						name: '帖子',
						type: 'article',
						icon: 'edit-pen'
					},
					{
						name: '图片',
						type: 'picture',
						icon: 'photo'
					},
					{
						name: '视频',
						type: 'video',
						icon: 'play-circle'
					},
				],
				tabbar: [{
						name: '首页',
						active: true,
						count: 0,
						icon: 'home'
					},
					{
						name: '动态',
						active: false,
						count: 0,
						icon: 'arrow-up'
					},
					{
						type: 'midbutton',
						icon: 'plus'
					},
					{
						name: '消息',
						active: false,
						count: 0,
						icon: 'bell'
					},
					{
						name: '我的',
						active: false,
						count: 0,
						icon: 'account'
					},
				],
				searchFoucs: false,
			}
		},
		created() {},
		computed: {
			...mapState(['userInfo'])
		},
		onReady() {},
		beforeRouteLeave(to, from, next) {
			if (this.showPublish || this.showMoreMenu) {
				this.showMoreMenu = false
				this.showPublish = false
				return
			}
			next()
		},
		methods: {
			//tabs通知swiper切换
			tabsChange(index) {
				this.topTabIndex = index;
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.topTabIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
			},
			tabbarTap(index) {
				if (index === 2) {
					this.showPublish = true
					return; // 当点击中间按钮时，直接返回，不执行后续逻辑
				}
				this.tabbar.forEach((item, i) => {
					item.active = i === index;
					this.tabbarIndex = index
				});
			},
			goCategoryList() {
				this.$Router.push({
					name: 'categoryList'
				})
			},
			avatarTap() {
				if (this.$store.state.hasLogin) this.$emit('avatarTap', true);
				else this.goLogin()
			},
			goLogin() {
				this.$Router.push({
					path: '/pages/user/login'
				})
			},
			goSearch() {
				console.log('点击了搜索')
				this.$Router.push({
					path: '/pages/common/search/search'
				})
			},
			goNotice() {
				this.$Router.push({
					path: '/pages/notice/notice',

				})
			},
			reload() {
				this.$refs.home[this.topTabIndex].reload()
			}
		}
	}
</script>

<style>
	.swiper {
		height: 100%;
	}

	.waterfall-home {
		background: #f7f7f7;
	}
</style>