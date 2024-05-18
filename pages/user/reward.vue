<template>
	<z-paging ref="paging" @query="getData" v-model="data">
		<template #top>
			<u-navbar title="我的奖品" autoBack placeholder bgColor="transparent">
				<view slot="left">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
			</u-navbar>
		</template>
		<block v-for="(item,index) in data" :key="index">
			<view class="box">
				<u-row>
					<image :src="item.image" mode="aspectFill" class="box-content-image"></image>
					<view class="box-content-info">
						<view style="display: flex;flex-direction: column;">
							<text style="font-Weight: bold;">奖品：{{item.name}}</text>
							<text style="font-size: 26rpx;color: #ccc;" class="u-line-2">介绍：{{item.description}}</text>
						</view>
						<view style="text-align: end;">
							<text style="font-size: 26rpx;"
								:style="{color:item.status=='issued'?'#88d8c0':'#ff8800'}">{{item.status=='issued'?'已发放，请注意物流':'待发放'}}</text>
						</view>
					</view>
				</u-row>
			</view>
		</block>
	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				data: [],
				point: '/static/lottery/coin.png',
				vip: '/static/lottery/vip.png'
			};
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/raffle/log', {
					params: {
						page,
						limit,
						type: 'product'
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			}
		}
	}
</script>

<style lang="scss">
	@media (prefers-color-scheme: dark) {
		.box {
			background: #525252 !important;
		}
	}

	page {
		background: #f7f7f7;
	}

	.box {
		margin: 30rpx;
		padding: 30rpx;
		border-radius: 20rpx;
		background: #fff;
		overflow: hidden;
		position: relative;
		top: 0;

		&-content {
			border-radius: 20rpx;

			&-image {
				width: 200rpx;
				height: 200rpx;
				background: #f7f7f7;
				border-radius: 20rpx;
			}

			&-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 200rpx;
				margin-left: 30rpx;
				overflow: hidden;
			}
		}
	}
</style>