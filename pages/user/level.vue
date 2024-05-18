<template>
	<view>
		<u-navbar autoBack placeholder title="我的等级">
			<view slot="left">
				<i class="mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view class="content">
			<view class="card">
				<u-row justify="space-between">
					<u-row>
						<u-avatar :src="$store.state.userInfo.avatar" size="36"></u-avatar>
						<text
							:style="{border:`${$store.state.userInfo.level > 8 ? $level[Math.floor($store.state.userInfo.level/2)-2] : $level[$store.state.userInfo.level-2]} solid 2rpx`,background:$store.state.userInfo.level > 8 ? $level[Math.floor($store.state.userInfo.level/2)-2] : $level[$store.state.userInfo.level-2] }"
							style="font-size: 18rpx;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx;color: white;"
							v-if="$store.state.userInfo.level">
							Lv.{{$store.state.userInfo.level-1}}
						</text>
					</u-row>
					<text>当前经验：{{$store.state.userInfo.experience}}</text>
				</u-row>
				<view style="margin-top: 60rpx;">
					<u-line-progress :height="4"
						:activeColor="$store.state.userInfo > 8 ? $level[Math.floor($store.state.userInfo/2)-1] : $level[$store.state.userInfo-1]"
						:percentage="100-(($store.state.userInfo && $store.state.userInfo.nextExp - $store.state.userInfo.experience) / $store.state.userInfo.nextExp) * 100"
						:showText="false" v-if="$store.state.userInfo"></u-line-progress>
				</view>

			</view>
			<view style="margin-top: 60rpx;">
				<text>等级详情</text>
				<view class="card" style="margin-top: 20rpx;">
					<u-row>
						<u-col :span="4">
							<text>等级</text>
						</u-col>
						<u-col :span="4">
							<text>经验</text>
						</u-col>
					</u-row>
					<block v-for="(item,index) in $store.state.level" :key="index">
						<u-row style="margin-top: 10rpx;">
							<u-col :span="4">
								<view>
									<text :style="{border:`${index > 7 ? $level[Math.floor(index/2)] : $level[index]} solid 2rpx`,
										background:index > 7 ? $level[Math.floor(index/2)] : $level[index] }" class="level">
										Lv.{{index+1}}
									</text>
								</view>

							</u-col>
							<u-col :span="4">
								<text>{{item}}</text>
							</u-col>


						</u-row>
					</block>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.content {
		margin: 30rpx;
	}

	.card {
		padding: 30rpx;
		box-shadow: 0 0 8rpx #efefef;
		border-radius: 8rpx;

	}

	.level {
		font-size: 24rpx;
		padding: 0 16rpx;
		border-radius: 50rpx;
		color: white;
	}
</style>