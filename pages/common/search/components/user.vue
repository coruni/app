<template>
	<z-paging @query="getData" v-model="users" ref="paging" :refresher-enabled="false">
		<view class="user-panel">
			<block v-for="(item,index) in users" :key="index">
				<u-row class="user-item" @click="goProfile(item.uid)">
					<u-avatar size="35" :src="item.avatar"></u-avatar>
					<text>{{item.screenName||item.name}}</text>
				</u-row>
			</block>
		</view>
		<template #loadingMoreNoMore></template>
	</z-paging>
</template>

<script>
	export default {
		name: 'tagItem',
		data() {
			return {
				users: [],
				key: ''
			}
		},
		props: {
			search: {
				type: [String, Number],
				default: 0,
			},

		},
		computed: {},
		watch: {
			search: {
				handler(e) {
					this.key = e
					this.getData(1, 20)
				},
				immediate: true,
				deep: true,
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/user/userList', {
					params: {
						page,
						limit,
						searchKey: this.key
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			goProfile(id) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark) {
		.user-panel {
			background-color: #525252 !important;
		}
	}

	.user-panel {
		margin: 30rpx;
		border-radius: 10rpx;
		background-color: #fff;

		&>text {
			font-size: 30rpx;
			margin-left: 20rpx;
		}
	}

	.user-item {
		padding: 30rpx;

		&>text {
			margin-left: 20rpx;
		}
	}
</style>