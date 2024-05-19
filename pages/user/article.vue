<template>
	<z-paging @query="getData" ref="paging" v-model="articles">
		<template #top>
			<u-navbar title="我的稿件" placeholder autoBack bgColor="transparent">
				<view slot="left">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
			</u-navbar>
		</template>
		<view class="content">
			<block v-for="(item,index) in articles" :key="index">
				<view class="article">
					<u-row style="height: 100%;">
						<u-col :span="4" style="height: 100%;">
							<image :src="item.images[0]" mode="aspectFill" class="article-img"></image>
						</u-col>
						<view
							style="flex: 1;height: 100%;display: flex;flex-direction: column;margin-left: 30rpx;justify-content: space-between;">
							<text class="u-line-2">{{item.title}}</text>
							<u-row justify="end">
								<view style="margin-right: 30rpx;">
									<u-button style="height: 60rpx;" @click="goEdit(item)">修改</u-button>
								</view>
								<view>
									<u-button style="height: 60rpx;" color="red"
										@click="deleteId= item.cid;showDelete = true">删除</u-button>
								</view>

							</u-row>
						</view>
					</u-row>
				</view>
			</block>
		</view>
		<u-popup :show="showDelete" :round="10" mode="center" @close="showDelete = false" customStyle="width:500rpx">
			<view
				style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
				<text style="font-size: 34rpx;">提示</text>
				<view style="margin-top:30rpx">
					<text>是否确定删除？</text>
				</view>
				<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
					<u-button plain color="#88d8c0" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
						@click="showDelete = false">取消</u-button>
					<u-button color="#88d8c0" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
						@click="deleteArticle()">确定</u-button>
				</u-row>
			</view>
		</u-popup>
	</z-paging>

</template>

<script>
	export default {
		data() {
			return {
				articles: [],
				showDelete: false,
				deleteId: 0,
			}
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						params: {
							authorId: this.$store.state.userInfo.uid
						},
						order: 'created desc',
					}
				}).then(res => {
					this.$refs.paging.complete(res.data.data.data)
				})
			},
			deleteArticle() {
				this.$http.post('/article/delete', {
					id: this.deleteId
				}).then(res => {
					this.showDelete = false
					uni.$u.toast(res.data.msg)
					this.$refs.paging.reload()
				})
			},
			goEdit(data) {
				let path
				let type = data.type;
				if (type == 'post') path = '/publish/article/article';
				if (type == 'photo') path = '/publish/article/photo';
				if (type == 'video') path = '/publish/article/video';
				this.$Router.push({
					path: path,
					query: {
						update: true,
						id:data.cid
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		margin: 30rpx;
	}

	.article {
		box-shadow: 0 0 8rpx 0 #efefef;
		padding: 30rpx;
		border-radius: 8rpx;
		margin-top: 20rpx;
		height: 200rpx;

		&-img {
			height: 100%;
			width: 100%;
			border-radius: 8rpx;
		}
	}
</style>