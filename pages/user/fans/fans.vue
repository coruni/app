<template>
	<z-paging ref="paging" @query="getData" v-model="data">
		<template #top>
			<u-navbar :title="type==1?'粉丝':'关注'" placeholder autoBack bgColor="transparent">
				<view slot="left">
					<i class="mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
			</u-navbar>
		</template>
		<view class="container">
			<block v-for="(item,index) in data" :key="index">
				<u-row @click="goProfile(item.uid)" justify="between">
					<u-row>
						<u-avatar :src="item.avatar"></u-avatar>
						<view class="flex-col">
							<text>{{item.screenName||item.name}}</text>
							<text class="desc">{{item.introduce}}</text>
						</view>
					</u-row>
					<view>
						<u-button plain color="#88d8c00f'" shape="circle" customStyle="height:60rpx;width:160rpx"
							@click.stop="follow(item.uid)">
							<text :style="{color:'black'}">已关注</text>
						</u-button>
					</view>
					
				</u-row>
			</block>
		</view>
	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				type: 0,
				data: []
			};
		},
		onLoad(params) {
			this.type = params.type
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/user/followList', {
					params: {
						page,
						limit,
						type: this.type
					}
				}).then(res => {
					this.$refs.paging.complete(res.data.data.data)
					console.log(res.data.data.data)
				})
			},
			goProfile(id) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.container {
		margin: 30rpx;
	}

	.flex-col {
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.desc {
		font-size: 28rpx;
		color: #ccc;
	}
</style>