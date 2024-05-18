<template>
	<view>
		<z-paging @query="getData" v-model="mates" ref="paging">
			<block v-for="(item,index) in mates" :key="index">
				<u-row customStyle="margin-bottom:20rpx" justify="space-between">
					<view style="display: flex;">
						<u-avatar shape="square" :src="item.imgurl"></u-avatar>
						<view style="display: flex;flex-direction: column;margin-left: 20rpx;">
							<text>{{item.name}}</text>
							<text style="font-size: 26rpx;" class="u-line-1">{{item.description}}</text>
						</view>
					</view>
					<view>
						<u-button plain color="#88d8c0" size="mini" @click="$emit('edit',item)">编辑</u-button>
					</view>
				</u-row>
			</block>
		</z-paging>
	</view>
</template>

<script>
	export default {
		name: 'metaItem',
		data() {
			return {
				mates: []
			}
		},
		props: {
			type: {
				type: [String],
				default: 'category'
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/category/list', {
					params: {
						page,
						limit,
						searchParams: JSON.stringify({
							type: this.type
						}),
						token: this.$store.state.hasLogin ? uni.getStorageSync('token') : ''
					}
				}).then(res => {
					if (res.data.code) {
						let list =[]
						for (let item of res.data.data) {
							if (!item.opt) {
								item.opt = {
									background: '',
									primary: '',
									underline: '',
									color: ''
								};
								console.log(item);
							}
							list.push(item);
						}
						this.$refs.paging.complete(list)
					}
				})
			}
		}
	}
</script>

<style>
</style>