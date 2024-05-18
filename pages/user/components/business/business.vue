<template>
	<z-paging @query="getData" ref="paging" v-model="list" :auto-scroll-to-top-when-reload="false"
		:auto-clean-list-when-reload="false">
		<view style="margin: 20rpx;">
			<block v-for="(item,index) in list" :key="index">
				<view style="padding: 30rpx;background: white;border-radius: 20rpx;margin-bottom: 20rpx;">
					<u-row style="margin-bottom: 20rpx;" justify="space-between">
						<u-row>
							<u-avatar size="30" :src="item.buyerInfo.avatar"></u-avatar>
							<text
								style="font-Weight: bold;margin-left: 20rpx;">{{item.buyerInfo.screenName?item.buyerInfo.screenName:item.buyerInfo.name}}</text>
						</u-row>
						<text
							style="color: #88d8c0;">{{item.paid&&!item.isTracking?'待发货':item.paid &&item.isTracking?'待收货':'待支付'}}</text>
					</u-row>
					<u-row align="top">
						<image :src="item.product_image[0]" mode="aspectFill" style="width: 120rpx;
							height: 120rpx;
							border-radius: 20rpx;">
						</image>
						<view style="display: flex;flex-direction: column;margin-left: 20rpx;flex:1">
							<u-row justify="space-between">
								<text style="font-Weight: bold;" class="u-line-1">{{item.product_name}}</text>
								<u-row style="color: red;">
									<i class="ess mgc_coin_line"></i>
									<text>{{item.price}}</text>
								</u-row>
							</u-row>
							<text style="font-size: 30rpx;color: #999;">{{item.specs.name}}</text>
						</view>
					</u-row>
					<view style="margin-top: 40rpx;">
						<text>订单号：{{item.orders}}</text>
					</view>
					<!-- 底部控件 -->
					<view style="margin-top: 60rpx;">
						<u-row justify="space-between">
							<text style="font-size: 28rpx;color: #999;">更多</text>
							<u-col :span="8">
								<u-row v-if="item.paid" sty>
									<u-button shape="circle" color="#88d8c0" plain
										style="height: 60rpx;margin-right: 20rpx;">联系买家</u-button>
									<u-button shape="circle" :color="item.isTracking?'#ccc':'#88d8c0'"
										style="height: 60rpx;margin-left: 20rpx;"
										@click="goOrderDetail(item.id)">{{item.isTracking?'已发货':'去发货'}}</u-button>
								</u-row>
							</u-col>
						</u-row>
					</view>

				</view>
			</block>
		</view>
	</z-paging>
</template>

<script>
	export default {
		name: 'businessItem',
		props: {
			data: {
				type: Object,
				default: null,
			},

		},

		data() {
			return {
				list: [],
				showPayment: false,
			}
		},
		methods: {
			getData(page, limit) {
				let searchParams = {};
				// 遍历order数组
				this.data.order.forEach(condition => {
					searchParams[condition.order] = condition.value;
				});
				this.$http.post('/shop/orderList', {
					page,
					limit,
					type: 1,
					params: JSON.stringify(searchParams),
				}).then(res => {
					
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			reload() {
				this.$refs.paging.reload()
			},
			goOrderDetail(id) {
				this.$Router.push({
					path: '/pages/shop/order',
					query: {
						id,
						tracking: 1
					}
				})
			}

		}
	}
</script>

<style>
	page {
		background: #f7f7f7;
	}
</style>