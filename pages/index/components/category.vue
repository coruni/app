<template>
	<z-paging :refresher-enabled="false" @query="getArticle" v-model="content" ref="paging">
		<template #top>
			<u-navbar placeholder>
				<view slot="left"></view>
				<view slot="center" style="flex: 1;display: flex;padding: 10rpx 30rpx;">
					<view style="flex: 1;">
						<uv-search placeholder="搜索你感兴趣的圈子" :showAction="false"></uv-search>
					</view>
					<u-row style="margin-left: 20rpx;font-size: 28rpx;">
						<i class="mgc_add_line"></i>
						<text>创建圈子</text>
					</u-row>
				</view>
			</u-navbar>

		</template>
		<u-gap height="6" class="article-gap" bgColor="#f7f7f7"></u-gap>
		<!-- 我的关注 -->
		<view style="padding: 20rpx 30rpx;min-height: 300rpx;display: flex;flex-direction: column;">
			<u-row>
				<i class="mgc_star_2_line"></i>
				<text style="margin-left: 10rpx;">我关注的</text>
			</u-row>

			<u-gap height="6"></u-gap>
			<scroll-view scroll-x class="scroll" v-if="follow.length!=0">
				<view style="display: flex;">
					<block v-for="(item, index) in uniqueFollow1" :key="index">
						<view class="category-item" @tap="goCategory(item.mid)">
							<u-image :src="item.imgurl" width="50" height="50" radius="5"></u-image>
							<text style="font-size: 28rpx; margin-top: 10rpx;">{{item.name}}</text>
						</view>
					</block>
				</view>
				<view style="display: flex;">
					<block v-for="(item, index) in uniqueFollow2" :key="index">
						<view class="category-item" @tap="goCategory(item.mid)">
							<u-image :src="item.imgurl" width="50" height="50" radius="5"></u-image>
							<text style="font-size: 28rpx; margin-top: 10rpx;">{{item.name}}</text>
						</view>
					</block>
				</view>
			</scroll-view>
			<view v-else
				style="flex: 1;display: flex;align-items: center;justify-content: center;color: 26rpx;color: #999;">
				<text>暂无关注</text>
			</view>
		</view>
		<u-gap bgColor="#f7f7f7" height="6" class="article-gap"></u-gap>
		<!-- 全部板块 -->
		<view style="padding: 20rpx 30rpx;min-height: 300rpx;">
			<u-row justify="space-between" @click="goCategoryList()">
				<u-row>
					<i class="mgc_menu_line"></i>
					<text style="margin-left: 10rpx;">板块列表</text>
				</u-row>
				<i class="mgc_right_line"></i>
			</u-row>
			<u-gap height="6"></u-gap>
			<u-row justify="space-between" style="flex-wrap: wrap;">
				<block v-for="(item,index) in categories" :key="index">
					<u-col :span="5.9">
						<u-row @click="goCategory(item.mid)" style="padding: 10rpx;">
							<u-image width="50" height="50" :src="item.imgurl" radius="5"></u-image>
							<view style="margin-left: 10rpx;font-size: 28rpx;display: flex;flex-direction: column;">
								<text class="u-line-1">{{item.name}}</text>
								<u-row style="font-size: 22rpx;color: #999;">
									<text style="padding-right: 4rpx;">{{item.follows}}人关注</text>
									<text>{{item.count}}讨论</text>
								</u-row>
							</view>
						</u-row>
					</u-col>
				</block>
			</u-row>
		</view>
		<u-gap bgColor="#f7f7f7" height="6" class="article-gap"></u-gap>
		<view style="padding: 20rpx 30rpx;">
			<u-row>
				<i class="mgc_fire_line"></i>
				<text style="margin-left: 10rpx;">热门帖子</text>
			</u-row>

		</view>
		<uv-waterfall ref="waterfall" v-model="content" :add-time="10" :left-gap="leftGap" :rightGap="rightGap"
			:column-gap="columnGap" @changeList="changeList" v-if="index==current">
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item,index) in list1" :key="index" :style="[imageStyle(item)]" class="waterfall"
						@tap.stop="goArticle(item)">
						<image :src="item.images.length?item.images[0]:'/static/login.jpg'" mode="widthFix"
							:style="{width:item.width+'px'}"
							style="border-radius: 10rpx 10rpx 0 0 ;max-height: 720rpx;">
						</image>
						<view style="margin: 10rpx;">
							<text class="u-line-2">{{item.title}}</text>
							<u-row style="margin-top: 10rpx;">
								<u-avatar :src="item.authorInfo.avatar" :size="24"></u-avatar>
								<text style="margin-left: 20rpx;font-size: 26rpx;"
									class="u-line-1">{{item.authorInfo.screenName||item.authorInfo.name}}</text>
							</u-row>
						</view>
					</view>
				</view>
			</template>
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item,index) in list2" :key="index" :style="[imageStyle(item)]" class="waterfall"
						@tap.stop="goArticle(item)">
						<image :src="item.images.length?item.images[0]:'/static/login.jpg'" mode="widthFix"
							:style="{width:item.width+'px'}"
							style="border-radius: 10rpx 10rpx 0 0 ;max-height: 720rpx;">
						</image>
						<view style="margin: 10rpx;">
							<text class="u-line-2">{{item.title}}</text>
							<u-row style="margin-top: 10rpx;">
								<u-avatar :src="item.authorInfo.avatar" :size="24"></u-avatar>
								<text style="margin-left: 20rpx;font-size: 26rpx;"
									class="u-line-1">{{item.authorInfo.screenName||item.authorInfo.name}}</text>
							</u-row>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
		<!-- 底部占位 -->
		<template #bottom>
			<view style="height:100rpx;"></view>
		</template>
	</z-paging>

</template>

<script>
	const statusHeight = uni.getSystemInfoSync().statusBarHeight
	export default {
		name: 'homeCategory',
		props: {
			index: {
				type: [String, Number],
				default: 0
			},
			current: {
				type: [String, Number],
				default: 0
			}
		},
		data() {
			return {
				statusBarHeight: statusHeight,
				top: [],
				categories: [],
				swiperIndex: 0,
				color: ['#aa96da', '#ff8800', '#FFCC00'],
				tags: [],
				follow: [],
				content: [],
				list1: [],
				list2: [],
				leftGap: 6,
				rightGap: 6,
				columnGap: 6,
				page: 1,
				limit: 12,
			}
		},
		computed: {
			uniqueFollow1() {
				return this.follow.filter((item, index) => index % 2 === 0);
			},
			uniqueFollow2() {
				return this.follow.filter((item, index) => index % 2 === 1);
			},
			imageStyle(item) {
				return item => {
					const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
					const w = v / 2;
					const rate = w / item.w;
					const h = rate * item.h;
					return {
						width: '100%',
						height: h + 'px'
					}
				}
			}
		},

		created() {
			this.getFollowCategory()
			this.getTop()
			this.getTags()
			this.getData()
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/category/list', {
					params: {
						params: JSON.stringify({
							type: 'category',
							parent: 0,
						})
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.categories = res.data.data.data
					}
				})
			},
			getArticle(page, limit) {
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						order: 'created desc,likes desc,views desc,replyTime desc'
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			},
			getFollowCategory() {
				if (!this.$store.state.hasLogin) return;
				this.$http.get('/category/followList').then(res => {
					this.follow = res.data.data.data
				})
			},
			getTags() {
				this.$http.get('/category/list', {
					params: {
						params: JSON.stringify({
							type: 'tag',
							parent: 0
						})
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.tags = res.data.data.data
					}
				})
			},
			getTop() {
				this.$http.get('/article/articleList', {
					params: {
						page: 1,
						limit: 6,
						order: 'created desc,likes desc,views desc'
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.top = res.data.data.data
					}
				})
			},
			goArticle(data) {
				let path
				switch (data.type) {
					case 'photo':
						path = '/pages/article/photo';
						break;
					case 'video':
						path = '/pages/article/video';
						break;
					default:
						path = '/pages/article/article';
						break;
				}
				this.$Router.push({
					path: path,
					query: {
						id: data.cid
					}
				})
			},

			goCategory(id) {
				this.$Router.push({
					path: '/pages/common/category/categoryInfo',
					query: {
						id
					}
				})
			},
			goCategoryList() {
				this.$Router.push({
					name: 'categoryList'
				})
			},
			goTag(id) {
				this.$Router.push({
					path: '/pages/common/tag/tag',
					query: {
						id
					}
				})
			},
			swiperTap(index) {
				uni.setStorageSync(`article_${this.$store.state.swiper[index].cid}`, this.$store.state.swiper[index])
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: this.$store.state.swiper[index].cid
					}
				})
			},
			changeList(e) {
				this[e.name].push(e.value);
			},
		}
	}
</script>

<style lang="scss" scoped>
	@media(prefers-color-scheme:dark) {

		/deep/ .u-status-bar,
		/deep/ .u-navbar__content {
			background-color: #292929 !important;
		}
	}

	.page-container {
		display: flex;
		flex-direction: column;
		overflow: scroll;
	}

	/deep/ .zp-swiper-super {
		overflow: scroll;
	}

	.myPage {
		color: $c-primary;
	}

	.input {
		background-color: #f7f7f7;
		padding: 15rpx !important;
	}

	.scroll {
		display: flex;
		overflow-y: scroll;

	}

	.category-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
	}

	.top {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f7f7f7;
		font-size: 26rpx;
		padding: 4rpx;
		text-align: center;
		line-height: 34rpx;
		width: 30rpx;
		height: 30rpx;
		color: black;
		flex-shrink: 0;
		border-radius: 8rpx;
	}

	.tag {
		font-size: 26rpx;
		background: #aa96da1e;
		color: #aa96da;
		padding: 8rpx 14rpx;
		min-width: 100rpx;
		max-width: 160rpx;
		min-height: 30rpx;
		border-radius: 500rpx;
		margin-right: 20rpx;
		margin-bottom: 10rpx;
		font-size: 30rpx;
	}

	.waterfall {

		margin-top: 14rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
		overflow: hidden;
	}
</style>