<template>
	<z-paging ref="paging" v-model="product" @query="getData">
		<template #top>
			<u-navbar title="兑换中心" bgColor="transparent" placeholder autoBack>
				<view slot="left" style="display:flex;align-items: center;">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
				<view slot="right">
					<i class="ess mgc_search_3_line" style="font-size: 40rpx;" @click="showSearch= !showSearch"></i>
				</view>
			</u-navbar>
		</template>
		<uv-waterfall ref="waterfall" v-model="product" :add-time="10" :left-gap="leftGap" :rightGap="rightGap"
			:column-gap="columnGap" @changeList="changeList">
			<!-- 第一列数据 -->
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item,index) in list1" :key="index" :style="[imageStyle(item)]"
						style="background: #fff;margin-top: 20rpx;border-radius: 10;overflow: hidden;"
						@tap.stop="exchange = item;showExchange = true;">
						<view v-if="item.type=='rank'">
							<image :src="item.detail.image" mode="widthFix"
								:style="{width:item.width+'px',maxHeight:item.height>720?720:item.height+'px'}"
								style="border-radius: 10rpx 10rpx 0 0 ;" v-if="item.detail.type">
							</image>
							<view style="text-align: center;padding: 30rpx;" v-else>
								<view :style="{background:item.detail.background,color:item.detail.color}">
									<text>{{item.detail.name}}</text>
								</view>
							</view>
						</view>
						<view v-else>
							<image :src="item.detail.link" mode="widthFix"
								:style="{width:item.width+'px',maxHeight:item.height>720?720:item.height+'px'}"></image>
						</view>
						<view style="margin: 20rpx;">
							<text class="u-line-2">{{item.name}}</text>
							<view style="margin-top: 20rpx;display: flex;justify-content: space-between;">
								<view style="display: flex;align-items: baseline;color: red;">
									<i class="ess mgc_coin_line" style="font-size: 26rpx;margin-right: 10rpx;"></i>
									<text>{{item.price}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
			<!-- 第二列数据 -->
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<view v-for="(item,index) in list2" :key="index" :style="[imageStyle(item)]"
						style="background: #fff;margin-top: 20rpx;border-radius: 10;overflow: hidden;"
						@tap.stop="exchange = item;showExchange = true;">
						<view v-if="item.type=='rank'">
							<image :src="item.detail.image" mode="widthFix"
								:style="{width:item.width+'px',maxHeight:item.height>720?720:item.height+'px'}"
								style="border-radius: 10rpx 10rpx 0 0 ;" v-if="item.detail.type">
							</image>
							<view style="text-align: center;padding: 30rpx;" v-else>
								<view :style="{background:item.detail.background,color:item.detail.color}">
									<text>{{item.detail.name}}</text>
								</view>
							</view>
						</view>
						<view v-else>
							<image :src="item.detail.link" mode="widthFix"
								:style="{width:item.width+'px',maxHeight:item.height>720?720:item.height+'px'}"></image>
						</view>
						<view style="margin: 20rpx;">
							<text class="u-line-2">{{item.name}}</text>
							<view style="margin-top: 20rpx;display: flex;justify-content: space-between;">
								<view style="display: flex;align-items: baseline;color: red;">
									<i class="ess mgc_coin_line" style="font-size: 26rpx;margin-right: 10rpx;"></i>
									<text>{{item.price}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</template>
		</uv-waterfall>
		<u-popup :show="showExchange" round="5" mode="center" customStyle="width:500rpx">
			<view style="padding: 30rpx;">
				<view style="display: flex;justify-content: center;color: #aaa;font-size: 30rpx;">
					<text>兑换提示</text>
				</view>
				<view style="margin-top: 30rpx;text-align: center;">
					<text>是否兑换{{exchange.name}}</text>
				</view>
				<u-row style="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
					<u-button plain color="#88d8c0" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
						@click="showExchange = false">取消</u-button>
					<u-button color="#88d8c0" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
						@click="goExchange()">确定</u-button>
				</u-row>
			</view>

		</u-popup>
	</z-paging>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				exchange: {},
				showSearch: false,
				product: [],
				list1: [],
				list2: [],
				columnGap: 6,
				leftGap: 6,
				rightGap: 6,
				showExchange: false,

			};
		},
		computed: {
			...mapState(['appInfo']),
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

		methods: {
			getData(page, limit) {
				this.$http.get('/exchange/list', {
					params: {
						page,
						limit,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			changeList(e) {
				this[e.name].push(e.value);
			},
			goExchange() {
				this.$http.post('/exchange/exchange', {
					id: this.exchange.id
				}).then(res => {
					uni.$u.toast(res.data.msg)
					this.showExchange = false
				})
			}

		}

	}
</script>

<style lang="scss" scoped>
	.search {
		transform: translateY(10);
		transition: 0.6s ease;
	}

	page {
		background: #f7f7f7;
	}
</style>