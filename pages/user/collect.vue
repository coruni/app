<template>
	<z-paging ref="paging" @query="getData" v-model="article">
		<template #top>
			<u-navbar title="我的收藏" placeholder autoBack bgColor="transparent">
				<view slot="left">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
			</u-navbar>
		</template>
		<block v-for="(item,index) in article" :key="index">
			<view style="margin: 30rpx;" @tap.stop="goArticle(item)">
				<article-header :data="item"></article-header>
				<article-photo :data="item" v-if="item.type=='photo'"></article-photo>
				<article-content :data="item" v-else></article-content>
				<article-footer :data="item"></article-footer>
			</view>
			<u-gap height="6" bgColor="#f7f7f7" class="article-gap"></u-gap>
		</block>
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
		data() {
			return {
				article: []
			};
		},
		methods: {
			getData(page, limit) {
				this.$http.get('/article/markList', {
					params: {
						page,
						limit,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
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

		}
	}
</script>

<style lang="scss">

</style>