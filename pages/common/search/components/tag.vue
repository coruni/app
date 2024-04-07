<template>
	<z-paging @query="getData()" v-model="tags" ref="paging" :refresher-enabled="false">
		<block v-for="(item,index) in tags" :key="index">
			<view class="search-item">
				<u-row>
					<u--image :src="item.imgurl && item.imgurl?item.imgurl:'/static/login.jpg'" mode="aspectFill"
						height="50px" width="50px" radius="10"></u--image>
					<view style="margin-left:20rpx">
						<text>{{item.name}}</text>
					</view>
				</u-row>
			</view>
		</block>
		<template #loadingMoreNoMore></template>
	</z-paging>
</template>

<script>
	export default {
		name: 'tagItem',
		data() {
			return {
				tags: [],
				key: ''
			}
		},
		props: {
			search: {
				type: [String, Number],
				default: 0,
			},

		},
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
				this.$http.get('/category/list', {
					params: {
						page,
						limit,
						params: {
							type: 'tag'
						}

					}
				}).then(res => {
					if (res.data.code) {
						this.$refs.paging.complete(res.data.data.data)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			}
		}
	}
</script>

<style>
	.search-item {
		margin: 30rpx;
		padding: 30rpx;
		background: #fff;
		border-radius: 10rpx
	}
</style>