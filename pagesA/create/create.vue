<template>
	<view>
		<u-navbar title="圈子创建" placeholder autoBack bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view class="content">
			<image src="../../static/login.jpg" mode="aspectFill" style="height: 160rpx;width: 160rpx;border-radius: 8rpx;"></image>
			
			<view style="margin-top: 20rpx;">
				<text style="font-size: 28rpx;">圈子名称</text>
				<uv-input :maxlength="18" border="bottom" style="padding: 0;"></uv-input>
			</view>
			<view style="margin-top: 20rpx;">
				<text style="font-size: 28rpx;">圈子介绍</text>
				<u-textarea border="bottom" style="padding: 0;"></u-textarea>
			</view>
			尚未开发完成
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
</style>