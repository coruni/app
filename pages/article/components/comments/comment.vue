<template>
	<view>
		<u-row align="top">
			<view style="position: relative;top: 0;" @tap.stop="goProfile(data)">
				<u-avatar :src="data.userInfo && data.userInfo.avatar" size="30"
					customStyle="border:4rpx solid #85a3ff32"></u-avatar>
				<image class="avatar_head" mode="aspectFill"
					:src="data && data.userInfo && data.userInfo.opt &&  data.userInfo.opt.head_picture">
				</image>
			</view>
			<view style="display: flex;flex:1; flex-direction: column;margin-left: 20rpx;">
				<u-row align="center">
					<u-row>
						<text
							:style="{color:data && data.userInfo&&data.userInfo.isVip?'#aa96da':'',fontSize:30+'rpx',fontWeight:600}">{{data.userInfo.screenName?data.userInfo.screenName:data.userInfo.name}}</text>
						<text
							:style="{border:`${data.userInfo.level > 8 ? $level[Math.floor(data.userInfo.level/2)-1] : $level[data.userInfo.level-1]} solid 2rpx`,background:data.userInfo.level > 8 ? $level[Math.floor(data.userInfo.level/2)-1] : $level[data.userInfo.level-1] }"
							style="font-size: 18rpx;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx;color: white;"
							v-if="data.userInfo.level">
							Lv.{{data.userInfo.level}}
						</text>
					</u-row>

					<text
						style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
						v-show="article && data && data.userInfo.uid == article.authorId">作者</text>
				</u-row>
				<view style="margin-top:10rpx;word-break: break-word;" @click="reply(data)">
					<uv-parse :preview-img="false" :showImgMenu="false" selectable
						:content="formatEmoji(data && data.text)" style="font-size: 30rpx;"></uv-parse>
				</view>
				<u-swiper :list="data && data.images" v-if="data && data.images && data.images.length" :autoplay="false"
					indicator height="150" indicator-style="left" radius="10"
					@click="previewImg(data.images,$event)"></u-swiper>
				<view style="margin-top: 10rpx;" v-if="data && data.subComments&&data.subComments.length"
					@click="goSubComment(data)">
					<block v-for="(item,index) in data.subComments" :key="index">
						<u-row class="subComment" align="top">
							<u-row>
								<u-row>
									<u-avatar :src="item.userInfo.avatar" size="20"></u-avatar>
									<text
										style="margin-left: 10rpx;font-size: 28rpx;font-Weight: bold;">{{item.userInfo.screenName?item.userInfo.screenName:item.userInfo.name}}</text>
								</u-row>
								<text
									style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
									v-if="article && item.userInfo.uid ==  article.authorId">作者</text>
							</u-row>
							<view>
								<uv-parse selectable :showImgMenu="false" :preview-img="false" style="font-size:28rpx;"
									:content="formatEmoji(item.text)"></uv-parse>
							</view>
						</u-row>
					</block>
					<view style="margin-top: 30rpx;">
						<view class="moreComment">
							<text>{{data.subCommentCount}}条评论</text>
							<i class="mgc_right_line"></i>
						</view>
					</view>
				</view>
				<u-gap height="6"></u-gap>
				<view style="padding-bottom: 50rpx;">
					<u-row justify="space-between" style="font-size: 24rpx;color: #aaa;">
						<text>{{$u.timeFrom(data.created,'mm-dd')}}</text>
						<u-row style="flex-wrap: nowrap;" justify="space-between">
							<u-row style="margin-right: 30rpx;"
								v-if="$store.state.userInfo.uid == data.userInfo.uid || $store.state.userInfo.group=='administrator' ||$store.state.userInfo.group=='editor'"
								@click="showDelete = true">
								<i class="mgc_delete_2_line" style="font-size: 36rpx;color: #aa96da;"></i>
								<text style="font-size: 28rpx;margin-left: 10rpx;">删除</text>
							</u-row>
							<u-row @click="reply(data)" style="margin-right: 30rpx;">
								<i class="mgc_chat_4_line" style="font-size: 40rpx;"></i>
								<text style="font-size: 28rpx;margin-left: 10rpx;">回复</text>
							</u-row>
							<u-row @click="like()" :style="{color:data.isLike?'#ffa385':''}">
								<i class="mgc_thumb_up_2_line" style="font-size: 40rpx;"></i>
								<text
									style="font-size: 28rpx;margin-left: 10rpx;">{{data && data.likes?data.likes:0}}</text>
							</u-row>
						</u-row>
					</u-row>
				</view>
			</view>
		</u-row>
		<u-popup :show="showDelete" :round="10" mode="center" @close="showDelete = false" customStyle="width:500rpx">
			<view
				style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
				<text style="font-size: 34rpx;">提示</text>
				<view style="margin-top:30rpx">
					<text>是否删除该评论？</text>
				</view>
				<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
					<u-button plain color="#aa96da" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
						@click="showDelete = false">取消</u-button>
					<u-button color="#aa96da" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
						@click="deleteComment()">确定</u-button>
				</u-row>
			</view>
		</u-popup>
	</view>

</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				default: null,
			},
			article: {
				type: Object,
				default: null,
			}
		},
		name: 'comment',
		data() {
			return {
				comments: [],
				num: 0,
				showDelete: false,
			}
		},
		created() {

		},
		methods: {
			reply(data) {
				this.$emit('reply', data)
			},
			goSubComment(data) {
				uni.setStorageSync('subComment_' + data.id, data)
				this.$Router.push({
					path: '/pages/article/components/comments/subComment',
					query: {
						id: data.id
					}
				})
			},
			previewImg(urls, index) {
				uni.previewImage({
					urls: urls,
					current: index
				})
			},
			goProfile(data) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id: data.userInfo.uid
					}
				})
			},
			like() {
				this.$http.post('/comments/like', {
					id: this.data.id
				}).then(res => {

					if (res.data.code == 200) {
						this.data.isLike = !this.data.isLike
						this.data.likes += this.data.isLike ? 1 : -1;
					}
				})
			},
			formatEmoji(html) {
				return html.replace(/\[([^\]]+)_([^\]]+)\]/g, (match, name, key) => {
					const emoji = this.$emoji.data.find(e => e.name === name);
					if (emoji) {
						const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`;
						return `<img src=".${src}" style="width:80rpx;height:80rpx">`;
					}
					// 如果找不到对应的 emoji，可能需要返回原始的字符串或者给出一些提示
					return match;
				})
			},
			deleteComment() {
				this.showDelete = false
				this.$http.post('/comments/delete', {
					id: this.data.id
				}).then(res => {
					if (res.data.code == 200) {
						// 通知父组件刷新数据
						this.$emit('commentDelete', true)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark) {
		.subComment {
			border-left: 6rpx solid #fff !important;
		}

		.moreComment {
			background: #525252 !important;
		}
	}

	.subComment {
		border-left: 6rpx solid #aa96da1e;
		padding-left: 15rpx;
		flex-direction: column;
		padding-bottom: 5rpx
	}

	.moreComment {
		padding: 8rpx 20rpx;
		font-size: 26rpx;
		background: #aa96da1e;
		display: flex;
		align-items: center;
		width: 180rpx;
		border-radius: 500rpx;
		justify-content: space-around;
	}
</style>