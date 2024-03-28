<template>
	<view class="container">
		<u-navbar title="头衔" placeholder autoBack bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view style="padding: 30rpx;">
			<text style="font-size: 32rpx;">头衔列表</text>
			<u-grid :col="4">
				<u-grid-item v-for="(item,index) in ranks" :key="index" class="rank-item"
					@click="($store.state.userInfo.rank || $store.state.userInfo.rank.includes(item.id))?setRank(item.id):$u.toast('你还没拥有该头衔')">
					<view class="rank-item-content" v-if="item.type">
						<u-image :src="item.image" height="100%" width="100%" mode="widthFix"></u-image>
						<text style="margin-top: 20rpx;font-size: 28rpx;">{{item.name}}</text>
					</view>
					<view v-else class="rank-item-content">
						<view :style="{background:item.background}" style="padding: 0 20rpx;border-radius: 10rpx;">
							<text :style="{color:item.color}">{{item.name}}</text>
						</view>
					</view>
					<view class="mask"
						v-if="!$store.state.userInfo.rank || !$store.state.userInfo.rank.includes(item.id)">
						<i class="mgc_lock_fill"
							style="position: absolute;bottom: 0;right: 0;color: white;padding: 10rpx;"></i>
					</view>
					<view class="equie"
						v-if="$store.state.userInfo.opt&& $store.state.userInfo.opt.rank && $store.state.userInfo.opt.rank.id == item.id">
						<text>佩戴中</text>
					</view>
				</u-grid-item>

			</u-grid>
		</view>

	</view>

</template>

<script>
	export default {
		data() {
			return {
				ranks: [],
				page: 1,
				limit: 15,
			};
		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData() {
				let params = {
					page: this.page,
					limit: this.limit,
				}
				this.$http.get('/rank/list', {
					params: {
						params
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.ranks = this.ranks.concat(res.data.data.data)
					}
				})
			},
			setRank(id) {
				this.$http.post('/rank/set', {
					id
				}).then(res => {
					if (res.data.code == 200) {
						uni.$u.toast(res.data.msg)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
	}

	.rank-item {
		position: relative;
		overflow: hidden;
		width: 100%;
		padding: 20rpx;
		margin: 10rpx;
		display: flex;
		background-color: #f7f7f7 !important;
		border-radius: 10rpx;
		height: 200rpx;

		&-content {
			display: flex;
			height: 100%;
			flex-direction: column;
			align-items: center;
			justify-content: center;

		}
	}

	.mask {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
		background-color: rgba(0, 0, 0, 0.15);
	}

	.equie {
		position: absolute;
		right: 0;
		top: 0;
		height: 50rpx;
		width: 100rpx;
		display: flex;
		justify-content: center;
		align-items: end;
		transform: rotate(45deg) translate(22%, -70%);
		background-color: #ff8800;
		color: white;
		font-size: 20rpx;
	}

	/deep/.u-fade-enter-active {
		width: 100%;
	}
</style>