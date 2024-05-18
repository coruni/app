<template>
	<z-paging @query="getData" ref="paging" v-model="article"
		:empty-view-error-text="!$store.state.hasLogin?'你还没有登录哦~':'还没有关注的人，快去关注吧~'">
		<view style="display: flex;flex-direction: column;margin: 30rpx;"
			v-show="!$store.state.hasLogin ||!article.length">
			<text style="font-Weight: bold;">推荐关注</text>
			<scroll-view scroll-x style="margin-top: 30rpx;">
				<u-row>
					<block v-for="(item,index) in users" :key="index">
						<view
							style="display: flex;flex-direction: column;align-items: center;border-radius: 10rpx;background-color: #88d8c00a;padding: 20rpx;margin-right: 20rpx;flex-shrink: 0;width: 160rpx;">
							<view style="position: relative;">
								<u-avatar :src="item.avatar"></u-avatar>
							</view>
							<view class="u-line-1">
								<text style="margin-top: 20rpx;">{{item.screenName?item.screenName:item.name}}</text>
							</view>
							<u-button style="height: 60rpx;margin-top:20rpx" color="#88d8c0" shape="circle"
								@click="follow(item.uid,index)">关注</u-button>
						</view>
					</block>
				</u-row>
			</scroll-view>
		</view>
		<view style="
		border: #88d8c0 1rpx solid;
		border-radius: 20rpx;
		padding: 30rpx;
		margin: 30rpx;
		margin-top: 0;
		text-align: center;
		color: #88d8c0;
		" v-show="!$store.state.hasLogin" @click="goLogin()">
			<text>登录查看关注的帖子</text>
		</view>

		<block v-for="(item,index) in article" :key="index" v-if="article">
			<view @tap.stop="goArticle(item)" class="article">
				<article-header :data="item" @follow="$refs.paging.reload()"
					@menuTap="$emit('edit',$event)"></article-header>
				<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
				<article-content :data="item" v-else></article-content>
				<article-footer :data="item"></article-footer>
			</view>
			<u-gap height="6" bg-color="#f7f7f7" class="article-gap"></u-gap>
		</block>
		<template #bottom>
			<view class="tabbar-placeholder"></view>
		</template>
	</z-paging>
</template>

<script>
	import articleHeader from '@/components/article/header.vue';
	import articleContent from '@/components/article/content.vue';
	import articleFooter from '@/components/article/footer.vue';
	import articlePhoto from '@/components/article/photo.vue';
	export default {
		components: {
			articleHeader,
			articleContent,
			articleFooter,
			articlePhoto
		},
		props: {
			type: {
				type: String,
				default: 'all'
			},
		},

		data() {
			return {
				article: [],
				showComemnts: false,
				id: 0,
				elWidth: 300,
				users: [],

			}
		},
		created() {
			this.getRandomUser()
		},
		methods: {

			getData(page, limit) {
				let params = {
					page,
					limit,
					order: 'likes desc,created desc,views desc',
					random: 1
				}

				this.$http.get(this.$store.state.hasLogin ? '/article/follow' : '/article/articleList', {
					params
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},

			getRandomUser() {
				this.$http.get('/user/userList', {
					params: {
						page: 1,
						limit: 10,
						random: 1,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.users = res.data.data.data
					}
				})
			},

			goArticle(data) {
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
						id: data.cid
					}
				})
			},



			reload() {
				this.$refs.paging.reload()
			},
			goShare(data) {
				console.log('getData')
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
			follow(id, index) {
				this.$http.post('/user/follow', {
					id
				}).then(res => {
					this.users[index].isFollow = !this.users[index].isFollow
				})
			},

			goLogin() {
				this.$Router.push({
					name: 'login'
				})
			}
		}
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark){
		.tabbar-placeholder{
			background-color: #292929;
		}
	}
	.article {
		margin: 30rpx 30rpx 12rpx 30rpx;
		padding-bottom: 10rpx;
	}

	.tabbar-placeholder {
		height: 100rpx;
		background: #fff;
	}
</style>