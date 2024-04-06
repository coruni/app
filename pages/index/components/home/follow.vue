<template>
	<view>
		<z-paging @query="getData" ref="paging" v-model="article" v-if="$store.state.hasLogin">
			<block v-for="(item,index) in article" :key="`${index}_${item.cid}`" v-if="article">
				<view @tap.stop="goArticle(item)" class="article">
					<article-header :data="item" @follow="$refs.paging.reload()"
						@menuTap="$emit('edit',$event)"></article-header>
					<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
					<article-content :data="item" v-else></article-content>
					<article-footer :data="item"></article-footer>
				</view>
				<u-gap height="6" bg-color="#f7f7f7" class="article-gap"></u-gap>
			</block>
			<template #bottom style="background:transparent;">
				<view style="background: transparent !important;height: 80rpx;"></view>
			</template>
		</z-paging>
		<view v-else style="width: 100%; display: flex; align-items: center;justify-content: center;flex: 1;">
			<text>你还没有登录哦</text>
		</view>
	</view>

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
		created() {},
		methods: {
			getData(page, limit) {
				if (!this.$store.state.hasLogin) return;
				let params = {
					page,
					limit,
					order: 'likes desc,created desc,views desc',
					random: 1
				}
				this.$http.get('/article/follow', {
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
			},
			
		}
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark) {
		.tabbar-placeholder {
			background-color: #292929;
		}
	}

	.article {
		margin: 30rpx 30rpx 12rpx 30rpx;
		padding-bottom: 10rpx;
	}

	.tabbar-placeholder {
		height: 80 rpx;
		background: #fff;
	}
</style>