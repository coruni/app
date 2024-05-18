<template>
	<z-paging ref="paging" v-model="content" @query="getData" :auto="false" :auto-scroll-to-top-when-reload="false"
		:auto-clean-list-when-reload="false" user-cache :cache-key="`Article_${mid}`">
		<block v-for="(item,index) in content" :key="`${index}_${item.cid}`" v-if="content.length">
			<view @tap.stop="goArticle(item)" class="article">
				<article-header :data="item" @follow="$refs.paging.reload()"
					@menuTap="$emit('edit',$event)"></article-header>
				<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
				<article-content :data="item" v-else></article-content>
				<article-footer :data="item"></article-footer>
			</view>
			<u-gap height="6" bg-color="#f7f7f7" class="article-gap"></u-gap>
		</block>
		<!-- 底部占位高度-->
		<template #bottom style="background:transparent;">
			<view style="background: transparent !important;height: 80rpx;"></view>
		</template>
	</z-paging>
</template>

<script>
	import articleHeader from '@/components/article/header.vue';
	import articleContent from '@/components/article/content.vue';
	import articleFooter from '@/components/article/footer.vue';
	import articlePhoto from '@/components/article/photo.vue';
	export default {
		components: {
			articleHeader,
			articleContent,
			articleFooter,
			articlePhoto,
		},
		name: 'articleIndex',
		props: {
			swiper: {
				type: [Number, String],
				default: 0,
			},
			tabbar: {
				type: [Number, String],
				default: 0,
			},
			waterFall: {
				type: [Boolean, String],
				default: false,
			},
			isSwiper: {
				type: Boolean,
				default: false,
			},
			mid: {
				type: [String, Number],
				default: 0,
			}
		},
		watch: {
			tabbar: {
				handler(index) {
					if (index == this.swiper) {
						if (!this.is_loaded) {
							setTimeout(() => {
								this.$refs.paging.reload()
							}, 5)
						}
					}
				},
				immediate: true
			}
		},
		data() {
			return {
				swiperIndex: 0,
				content: [],
				is_loaded: false,
				data: null,
				showMenu: false,
				gutter: 40,
				width: 0,

			};
		},
		created() {},
		methods: {
			getData(page, limit) {
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						params: {
							mid: this.mid
						},
						order: 'isCircleTop desc,isrecommend desc,created desc'
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data);
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
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

			homepageTap(data) {
				if (!data.type) {
					this.$Router.push({
						path: data.page,
					})
				} else {
					// #ifndef APP || MP
					window.open(data.page)
					// #endif
					// #ifdef APP || MP
					plus.runtime.openWeb(data.page)
					// #endif
				}
				this.$Router.$lockStatus = false
			},
			reload() {
				this.$refs.paging.reload()
			},

		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-grid-item--hover-class {
		opacity: 1 !important;
	}

	.article {
		margin: 30rpx 30rpx 12rpx 30rpx;
		padding-bottom: 10rpx;
	}

	.image {
		width: 90rpx;
		height: 90rpx;
		border-radius: 20rpx;
	}

	.home-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.swiper {
		margin: 30rpx;
		height: 400rpx;
		position: relative;
		top: 0;

		&-dot {
			font-size: 24rpx;
			background: #88d8c0a0;
			border-top-left-radius: 10rpx;
			padding: 6rpx 20rpx;
			position: absolute;
			bottom: 0;
			right: 0;
			z-index: 10;
		}

		&-mask {
			position: absolute;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 0;
			background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 76%, rgba(0, 0, 0, 0.48783263305322133) 100%);

			&-title {
				position: absolute;
				bottom: 0;
				color: white;
				font-Weight: bold;
				padding: 30rpx;
			}
		}
	}
</style>