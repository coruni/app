<template>
	<z-paging @query="getData" v-model="ranks" ref="paging" :refresher-enabled="false">
		<template #top>
			<u-navbar title="头衔" placeholder autoBack bgColor="transparent">
				<view slot="left">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
			</u-navbar>

			<view
				style="display: flex;flex-direction: column;justify-content: center;align-items: center;height: 300rpx;">
				<view v-if="$store.state.userInfo.opt&& $store.state.userInfo.opt.rank">
					<view v-if="$store.state.userInfo.opt.rank.type">
						<view class="rank-item-content">
							<u-image :src="$store.state.userInfo.opt.rank.image" height="100%" width="100%"
								mode="widthFix"></u-image>

						</view>
					</view>
					<view v-else class="rank-item-content">
						<view :style="{background: $store.state.userInfo.opt.rank.background}"
							style="padding: 0 20rpx;border-radius: 10rpx;font-size: 24rpx;">
							<text
								:style="{color:$store.state.userInfo.opt.rank.color}">{{$store.state.userInfo.opt.rank.name}}</text>
						</view>
					</view>
				</view>
				<view v-else>
					<text>尚未佩戴任何头衔</text>
				</view>

			</view>
			<view style="padding: 20rpx 30rpx;">
				<u-button style="color: black;" color="#f7f7f7" shape="square" @click="clear()">取消佩戴</u-button>
			</view>
		</template>

		<view style="padding: 30rpx;">
			<text style="font-size: 32rpx;">头衔列表</text>
			<u-grid :col="4">
				<u-grid-item v-for="(item,index) in ranks" :key="index" class="rank-item" @click="setRank(item.id)">
					<view class="rank-item-content" v-if="item.type">
						<u-image :src="item.image" height="100%" width="100%" mode="widthFix"></u-image>
						<text style="margin-top: 20rpx;font-size: 28rpx;">{{item.name}}</text>
					</view>
					<view v-else class="rank-item-content">
						<view :style="{background:item.background}"
							style="padding: 0 20rpx;border-radius: 10rpx;font-size: 24rpx;">
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
	</z-paging>

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
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			},
			setRank(id) {
				this.$http.post('/rank/set', {
					id
				}).then(res => {
					uni.$u.toast(res.data.msg)
				})
			},
			clear() {
				this.$http.post('/rank/clear').then(res => {
					if (res.data.code == 200) {
						this.getUserInfo()
					}
				})
			},
			getUserInfo() {
				if (!uni.getStorageSync('token')) return;
				this.$http.get('/user/userInfo', {
					params: {
						id: this.$store.state.userInfo.uid,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setUser', res.data.data)
					}

				}).catch(err => {
					console.log(err)
				})
			},
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