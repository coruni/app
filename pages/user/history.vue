<template>
	<view>
		<u-navbar title="浏览历史" placeholder autoBack bgColor="transparent">
			<view slot="left">
				<i class="mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
			<view slot="right">
				<i class="mgc_delete_2_line" style="font-size: 45rpx;" @click="clearHistory()"></i>
			</view>
		</u-navbar>
		<block v-for="(item,index) in $store.state.history" :key="index" v-if="$store.state.history">
			<view class="content" @tap.stop="goArticle(item)">
				<view style="display: flex;flex-direction: column;">
					<u-row justify="space-between" align="top">
						<view class="u-line-2" style="display: flex;flex-direction: column;">
							<text style="font-size: 36rpx;font-Weight: bold;">{{item.title}}</text>
						</view>
						<image v-if="item.images&&item.images[0]"
							:src="item.images&& item.images[0]?item.images[0]:'/static/login.jpg'"
							style="width: 260rpx;height: 160rpx; border-radius: 10rpx;flex-shrink: 0;"
							mode="aspectFill"></image>
					</u-row>

					<u-row justify="space-between" style="margin-top: 20rpx;">
						<u-row>
							<u-avatar :src="item && item.authorInfo && item.authorInfo.avatar" size="24"></u-avatar>
							<text
								style="margin-left: 20rpx;font-size: 28rpx;">{{item && item.authorInfo && item.authorInfo.screenName?item.authorInfo.screenName:item && item.authorInfo &&item.authorInfo.name}}</text>
						</u-row>

						<u-icon name="eye-fill" size="16" labelColor="#eee" color="#eee" :label="item.views"></u-icon>
					</u-row>
				</view>
			</view>
		</block>
		<u-popup :show="showClear" :round="10" mode="center" @close="showClear = false" customStyle="width:500rpx">
			<view
				style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
				<text style="font-size: 34rpx;">清空历史</text>
				<view style="margin-top:30rpx">
					<text>是否清空所有历史记录？</text>
				</view>
				<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
					<u-button plain color="#88d8c0" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
						@click="showClear = false">取消</u-button>
					<u-button color="#88d8c0" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
						@click="clearHistory()">确定</u-button>
				</u-row>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				data: [],
				showClear: false
			}
		},
		methods: {
			...mapMutations(['clearHistory']),
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

			replaceEmoji(html) {
				if (html) {
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
				}

			},
		}
	}
</script>

<style>
	page {
		background: #f7f7f7;
	}

	@media (prefers-color-scheme: dark) {

		body,
		html {
			background: #292929 !important;
		}

		.content {
			background: #525252 !important;
		}
	}

	.content {
		margin: 30rpx;
		padding: 30rpx;
		background: #fff;
		border-radius: 10rpx;

	}
</style>