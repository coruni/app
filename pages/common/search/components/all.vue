<template>
	<z-paging @query="getData" ref="paging" v-model="article" :refresher-enabled="false">
		<view class="search-header">
			<text>相关帖子</text>
		</view>
		<block v-for="(item,index) in article" :key="index">
			<view class="search-item"
				@tap.stop="goArticle(item)">
				<view style="display: flex;flex-direction: column;">
					<u-row justify="space-between" align="top">
						<view class="u-line-2" style="display: flex;flex-direction: column;">
							<text style="font-size: 36rpx;font-Weight: bold;">{{item.title}}</text>
							<uv-parse :showImgMenu="false" class="u-line-1"
								style="overflow-y: unset;overflow: hidden;"
								:content="replaceEmoji(item.text)"></uv-parse>
						</view>
						<image v-if="item.images&&item.images[0]"
							:src="item.images&& item.images[0]?item.images[0]:'/static/login.jpg'"
							style="width: 260rpx;height: 160rpx; border-radius: 10rpx;flex-shrink: 0;"
							mode="aspectFill"></image>
					</u-row>
					<u-row justify="space-between" style="margin-top: 20rpx;">
						<u-row>
							<u-avatar :src="item.authorInfo.avatar" size="24"></u-avatar>
							<text
								style="margin-left: 20rpx;font-size: 28rpx;">{{item.authorInfo.screenName?item.authorInfo.screenName:item.authorInfo.name}}</text>
						</u-row>
	
						<u-icon name="eye-fill" size="16" labelColor="#eee" color="#eee"
							:label="item.views"></u-icon>
					</u-row>
				</view>
			</view>
		</block>
		<template #loadingMoreNoMore></template>
	</z-paging>
</template>

<script>
	export default {
		name: 'allArticle',
		props: {
			search: {
				type: String,
				default: null,
			},
			mid: {
				type: [String, Number],
				default: 0,
			}
		},
		watch: {
			search: {
				handler(e) {
					this.key = e
					this.getData(1, 20)
				},
				immediate: true,
				deep: true
			},
			mid: {
				handler(e) {
					this.categoryId = e
					this.getData(1, 20)
				},
				deep: true,
			}
		},
		data() {
			return {
				key: null,
				article: [],
				categoryId: 0,
				isLoaded: false,
			}
		},
		methods: {
			getData(page, limit) {
				if (!this.key.length) return;
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						searchKey: this.key,
					}
				}).then(res => {

					if (res.data.code == 200) {
						this.isLoaded = true
						this.$refs.paging.complete(res.data.data.data)
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
					path:path,
					query: {
						id: data.cid
					}
				})
			},
			reload() {
				this.$refs.paging.reload()
			},
			replaceEmoji(html) {
				return html.replace(
					/<img[^>]*?alt="src=([^"]+)\|poster=([^"]+)\|type=video"[^>]*?>/g, (match, src, poster) => {
						return `<div style="border-radius:10px"><video src="${src}" poster="${poster}" muted width="100%" style="border-radius:10px" /></div>`
					}).replace(/_|#([^|]+)_(([^|]+))|/g, (match, name, key) => {
					const emoji = this.$emoji.data.find(e => e.name === name)
					if (emoji) {
						const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`
						return `<img src="${src}" style="width:80rpx;height:80rpx">`
					}
					// 如果没有找到,直接返回空字符串
					// 即删除整个匹配文本
					return ''
				}).replace(/\|</g, '<').replace(/>\|/g, '>')

			},
		}
	}
</script>

<style lang="scss">
	.search {
		&-header {
			margin: 30rpx;
			background: #fff;
			padding: 30rpx;
			border-radius: 10rpx;
		}

		&-item {
			margin: 30rpx;
			padding: 30rpx;
			background: #fff;
			border-radius: 20rpx
		}

	}
</style>