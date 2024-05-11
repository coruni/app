<template>
	<view class="content">
		<u-navbar placeholder title="关于" autoBack>
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view class="container">
			<view class="logo">
				<image src="../../../static/login.jpg" mode="aspectFill"
					style="width: 160rpx;height: 160rpx;border-radius: 20rpx;"></image>
			</view>
			<text class="logo-name">{{system.appName}}</text>
			<view class="info">
				<text>手机型号：{{system.model}}</text>
				<text>手机系统：{{system.system}}</text>
				<text>APP版本：{{system.appVersionCode}}</text>
				<text>网络类型：{{networkType}}</text>
				<text>SDK版本：{{system.SDKVersion}}</text>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				system: {},
				networkType: '',
			};
		},
		onLoad() {
			this.system = uni.getSystemInfoSync()
			uni.getNetworkType({
				success: (res) => {
					this.networkType = res.networkType
				}
			})
		}
	}
</script>

<style lang="scss">
	.content {
		background-color: #f9f9f9;
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.container {
		flex: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.logo {
		background-color: #fff;
		padding: 5rpx;
		box-shadow: #ccc 0 0 8rpx 0;
		width: 160rpx;
		height: 160rpx;
		border-radius: 20rpx;

		&-name {
			font-size: 40rpx;
			margin-top: 30rpx;
			text-shadow: 1px 1px 2px black;
			;
		}
	}

	.info {
		margin: 30rpx;
		border-radius: 20rpx;
		width: 80%;
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
	}
</style>