<template>
	<view>
		<z-paging @query="getData" ref="paging" v-model="article">
			<block v-for="(item,index) in article" :key="index">
				<u-row customStyle="margin-bottom:20rpx">
					<image mode="aspectFill" :src="item.images[0]"
						style="width: 200rpx; height: 140rpx;border-radius: 20rpx 0 0 20rpx;background: #f7f7f7;">
					</image>
					<view style="flex:1;display: flex;justify-content: space-between;margin-left: 20rpx;">
						<view style="display: flex;flex-direction: column;">
							<text class="u-line-1" style="font-Weight: bold;">{{item.title}}</text>
							<view class="u-line-1">
								<text class="u-line-1">{{item.text}}</text>
							</view>
						</view>
						<view>
							<u-button size="mini" color="#88d8c0" plain @click="$emit('edit',item)">编辑</u-button>
						</view>
					</view>
				</u-row>
			</block>
		</z-paging>
	</view>
</template>

<script>
	export default {
		name: 'articleItem',
		props: {
			type: {
				type: String,
				default: 'publish'
			}
		},
		data() {
			return {
				article: []
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							status: this.type,
						}),
						order: 'created desc',
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}

				}).then(res => {
					
					this.$refs.paging.complete(res.data.data)
				})
			}
		}

	}
</script>

<style>
</style>