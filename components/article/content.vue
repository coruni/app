<template>
	<view style="margin-top: 10rpx;">
		<!-- 标题 -->
		<u-row>
			<view v-if="data.istop||data.isCircleTop" style="flex-shrink: 0;margin-right: 20rpx;">
				<text style="font-size: 26rpx;
					border:#ff8800 solid 2rpx;
					color: #fff;
					background: #ff8800;
					padding: 4rpx 16rpx;
					border-radius: 10rpx;">置顶</text>
			</view>

			<text style="font-Weight: bold;word-break: break-all;word-wrap: break-word;font-size: 32rpx;"
				class="u-line-2">{{data.title}}</text>
		</u-row>
		<uv-parse :content="replaceEmoji(data.text)" class="u-line-2"
			style="overflow: hidden;white-space: normal;word-break: break-all;word-wrap: break-word;font-size: 30rpx;"
			:previewImg="false" :showImgMenu="false" v-if="data.type!='video'"></uv-parse>

		<!-- 视频布局 -->
		<view v-if="data.type=='video'" class="video">
			<image :src="data.images[0]" mode="aspectFill" style="border-radius: 10rpx;width: 100%;height: 400rpx;"></image>
			<i class="mgc_play_circle_fill video-icon"></i>
		</view>
		<!-- 一张图片 -->
		<view v-if="data.images_size == 1&&data.type!='video'">
			<image :src="data.images[0]" mode="heightFix"
				style="max-width: 680rpx; max-height: 400rpx;border-radius: 10rpx;background-color: #f7f7f7;"
				@tap.stop.prevent="picPreview(data.images,0)"></image>
		</view>
		<!-- 两张图片 -->
		<view v-if="data.images_size==2&&data.type!='video'">
			<u-row justify="space-between">
				<u-col :span="5.92">
					<image mode="aspectFill" style="width: 100%;height: 300rpx;border-radius: 10rpx 0 0 10rpx;"
						:src="data.images[0]" @click.stop="picPreview(data.images,0)">
					</image>
				</u-col>
				<u-col :span="5.92">
					<image mode="aspectFill" style="width: 100%;height: 300rpx;border-radius: 0 10rpx 10rpx 0;"
						:src="data.images[1]" @click.stop="picPreview(data.images,1)">
					</image>
				</u-col>
			</u-row>
		</view>

		<!-- 大于等于三 小于六才显示 -->
		<view v-if="data.images.length>=3 && data.images.length<6 &&data.type !='video'">
			<u-row justify="space-between" style="height: 400rpx;">
				<u-col :span="5.91" style="height: 100%;">
					<image style="height: 100%;width: 100%;border-radius: 10rpx 0 0 10rpx;" mode="aspectFill"
						:src="data.images[0]" @tap.stop="picPreview(data.images,0,3)"></image>
				</u-col>
				<u-col :span="5.91" style="height: 100%;">
					<view style="display: flex;flex-direction: column;height: 100%;">
						<image style="height: 100%;width: 100%;border-radius: 0 10rpx 0 0;" mode="aspectFill"
							:src="data.images[1]" @tap.stop="picPreview(data.images,1,3)"></image>
						<image style="height: 100%;width: 100%;border-radius: 0 0 10rpx 0; margin-top: 12rpx;"
							mode="aspectFill" :src="data.images[2]" @tap.stop="picPreview(data.images,2,3)"></image>
					</view>
				</u-col>
			</u-row>
		</view>

		<!-- 大于等于六张图片 -->
		<view v-if="data.images.length>=6 &&data.type !='video'">
			<view style="display: flex;flex-direction: column;height: 500rpx;justify-content: space-between;">
				<u-row justify="space-between" style="height: 70%;">
					<u-col :span="5.91" style="height: 100%;">
						<image style="height: 100%;width: 100%;border-radius: 10rpx 0 0 0;" mode="aspectFill"
							:src="data.images[0]" @tap.stop="picPreview(data.images,0,6)"></image>
					</u-col>
					<u-col :span="5.91" style="height: 100%;">
						<view style="display: flex;flex-direction: column;height: 100%;">
							<image style="height: 100%;width: 100%;border-radius: 0 10rpx 0 0;" mode="aspectFill"
								:src="data.images[1]" @tap.stop="picPreview(data.images,1,6)"></image>
							<image style="height: 100%;width: 100%; margin-top: 12rpx;" mode="aspectFill"
								:src="data.images[2]" @tap.stop="picPreview(data.images,2,6)"></image>
						</view>
					</u-col>
				</u-row>
				<u-row style="height: 30%; margin-top: 12rpx;" justify="space-between">
					<u-col :span="3.89" style="height: 100%;">
						<image style="height: 100%;width: 100%; border-radius: 0 0 0 10rpx;" mode="aspectFill"
							:src="data.images[3]" @tap.stop="picPreview(data.images,3,6)"></image>
					</u-col>
					<u-col :span="3.89" style="height: 100%;">
						<image style="height: 100%;width: 100%;" mode="aspectFill" :src="data.images[4]"
							@tap.stop="picPreview(data.images,4,6)"></image>
					</u-col>
					<u-col :span="3.89" style="height: 100%;">
						<image style="height: 100%;width: 100%;border-radius: 0 0 10rpx 0" mode="aspectFill"
							:src="data.images[5]" @tap.stop="picPreview(data.images,5,6)"></image>
					</u-col>
				</u-row>
			</view>
		</view>


		<view v-if="data.tag && data.tag.length>0" style="display: flex;flex-wrap: wrap;margin-top: 10rpx;">
			<block v-for="(item,index) in data.tag" :key="index">
				<view class="tag" @tap.stop.prevent="goTag(item.mid)">
					<i class="mgc_hashtag_line" style="font-size: 26rpx;"></i>
					<text>{{item.name}}</text>
				</view>
			</block>
		</view>
	</view>
</template>
<script>
	export default {
		name: 'articleContent',
		props: {
			data: {
				type: Object,
				default: null,
			}
		},
		// computed: {
		// 	video
		// },
		data() {
			return {
				elWidth: uni.getStorageSync('albumWidth') ? uni.getStorageSync('albumWidth') : 100,
				mode: 'aspectFill',
				video: {}
			}
		},
		methods: {
			replaceEmoji(html) {
				return html.replace(/_|#([^|]+)_(([^|]+))|/g, (match, name, key) => {
					const emoji = this.$emoji.data.find(e => e.name === name)

					if (emoji) {
						const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`
						return `<img src=".${src}" style="width:60rpx;height:60rpx">`
					}
					// 如果没有找到,直接返回空字符串
					// 即删除整个匹配文本
					return ''

				}).replace(/\|</g, '<').replace(/>\|/g, '>')
			},
			goTag(id) {
				this.$Router.push({
					path: '/pages/common/tag/tag',
					query: {
						id
					}
				})
			},
			picPreview(urls, current, count = urls.length) {
				const selectedUrls = urls.slice(0, count).map(url => {
					return url.replace('_compress.webp', ''); // 将链接中的 _compress.webp 删除
				});
				uni.previewImage({
					urls: selectedUrls,
					current: current
				});
			},
			getImgMode(imageUrl) {
				return this.getImageOrientation(imageUrl) === 'landscape' ? 'aspectFit' : 'aspectFill';
			},
			getImageOrientation(imageUrl) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: imageUrl,
						success: (res) => {
							if (res.width > res.height) {
								resolve('landscape');
							} else {
								resolve('portrait');
							}
						},
						fail: (err) => {
							reject(err);
						}
					});
				});
			},
			loadeddata(data) {
				this.video = data
			}
		}
	}
</script>

<style lang="scss">
	.tag {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
		background: #88d8c01e;
		color: #88d8c0;
		padding: 8rpx 14rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
		margin-bottom: 10rpx;
		font-size: 24rpx;
	}

	.video {
		position: relative;

		&-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 80rpx;
			color: white;
		}
	}
</style>