<template>
	<view>
		<u-loading-page :loading="loading"></u-loading-page>
		<z-paging ref="paging" v-model="comments" @query="getData" v-show="!loading">
			<template #top>
				<u-navbar bgColor="transparent" title="评论" placeholder autoBack>
					<view slot="left">
						<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
					</view>
				</u-navbar>
			</template>
			<block v-for="(item,index) in comments" :key="index">
				<view class="notice-message" @click.stop.prevent="goArticle(item.article)">
					<view @click.stop.prevent="goProfile(item)">
						<u-row customStyle="margin-bottom:20rpx">
							<u-avatar :src="item.userInfo && item.userInfo.avatar" size="24"></u-avatar>
							<text style="margin-left:20rpx;font-Weight: bold;">
								{{item.userInfo && item.userInfo.screenName?item.userInfo.screenName:item.userInfo.name}}
							</text>
						</u-row>
					</view>
					
					<u-parse class="u-line-2" :content="formatEmoji(item.text)"
						v-if="item.text !=item.article.title"></u-parse>
					<u-parse class="u-line-2" :content="formatEmoji(item.reply.text)" v-else></u-parse>
					<view style="border-left: #f7f7f7 6rpx solid;padding-left: 10rpx;margin: 10rpx 0;display: flex;"
						class="u-line-1" v-if="item.text !=item.article.title">
						<text v-if="item.reply" style="color:#a899e6;flex-shrink: 0;padding-right: 10rpx;">
							@{{item.reply.userInfo.screenName?item.reply.userInfo.screenName:item.reply.userInfo.name}}
						</text>
						<uv-parse style="color: #999;font-size: 28rpx;"
							:content="item.reply && item.reply.text"></uv-parse>
					</view>
					<view style="border-left: #f7f7f7 6rpx solid;padding-left: 10rpx;margin: 10rpx 0;display: flex;"
						class="u-line-1" v-else>
						<text v-if="item.article"
							style="color: #999;flex-shrink: 0;padding-right: 10rpx;font-size: 26rpx;">回复帖子：{{item.article.title}}</text>
					</view>
					<u-row justify="space-between" customStyle="color:#999;font-size:26rpx">
						<text>{{$u.timeFormat(item.created,'mm-dd')}}</text>
						<u-row customStyle="color:#aa96da">
							<text>查看</text>
							<u-icon name="arrow-right" size="14" color="#aa96da"></u-icon>
						</u-row>
					</u-row>
				</view>
			</block>
		</z-paging>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				comments: [],
				loading: true,
			}
		},
		onShow() {
			this.clearNotice()
		},
		methods: {
			getData(page, limit) {
				this.$http.post('/user/inbox', {
					page,
					limit,
					type: 'comment'
				}).then(res => {
					console.log(res)
					this.$refs.paging.complete(res.data.data.data)
					setTimeout(() => {
						this.loading = false
					}, 500)
				})
			},
			formatEmoji(html) {
				if (html == null) return html;
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
			goArticle(data) {
				console.log(data)
				if (!data.hasOwnProperty('id') || data.id == 0) {
					uni.$u.toast('帖子已被删除');
					return;
				}
				let path
				switch (data.type) {
					case 'photo':
						path = '/pages/article/photo';
						break;
					case 'video':
						path = '/pages/article/video';
						break;
					default:
						path = '/pages/article/article';
						break;
				}
				this.$Router.push({
					path: path,
					query: {
						id: data.id
					}
				})
			},

			goProfile(data) {
				if (!data.hasOwnProperty('userInfo') || !data.userInfo.hasOwnProperty('uid')) {
					uni.$u.toast('用户已注销')
					return;
				}
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id: data.userInfo.uid
					}
				})
			},

			clearNotice() {
				this.$http.post('/user/clearNum', {
					type: 'comment'
				}).then(res => {
					console.log(res)
				})
			}
		}
	}
</script>

<style>
	page {
		background: #f7f7f7;
	}

	.notice-message {
		margin: 30rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
	}
</style>