<template>
	<view>
		<u-navbar placeholder title="管理面板" autoBack bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view style="margin: 30rpx;">
			<u-grid customStyle="background:#88d8c00a;padding:30rpx;border-radius:20rpx">
				<u-grid-item v-for="(item,index) in data" :key="index">
					<view style="display: flex; flex-direction: column;align-items: center;margin-bottom: 20rpx;">
						<text>{{item.count}}</text>
						<text>{{item.name}}</text>
					</view>
				</u-grid-item>
			</u-grid>

			<view style="margin-top: 20rpx;">
				<u-row justify="space-between">
					<u-tabs :list="metasList" :current="metaIndex" @change="metaIndex = $event.index"></u-tabs>
					<view>
						<u-button size="mini" color="#88d8c0" plain shape="circle"
							@click="$refs.editCategory.open()">{{metaIndex?'创建话题':'创建板块'}}</u-button>
					</view>
				</u-row>
				<swiper :current="metaIndex" style="height: 400rpx;"
					@animationfinish="metaIndex = $event.detail.current">
					<swiper-item style="overflow: auto;" v-for="(item,index) in metasList" :key="index">
						<meta-item :type="item.type"
							@edit="$refs.editCategory.open();editCategory = $event"></meta-item>
					</swiper-item>
				</swiper>
			</view>

			<view style="margin-top: 20rpx;">
				<u-row justify="space-between">
					<text style="flex-shrink: 0;">文章管理</text>
					<u-tabs :list="articleType" :current="typeIndex" @change="typeIndex = $event.index"></u-tabs>
					<view>
						<u-input v-model="articleSearchKey" border="none" placeholder="搜索文章"
							customStyle="background: #88d8c01e;border-radius: 50rpx;padding: 10rpx 20rpx;">
							<view slot="suffix">
								<u-icon name="search" size="20"></u-icon>
							</view>
						</u-input>
					</view>
				</u-row>
				<swiper :current="typeIndex" style="height: 400rpx;"
					@animationfinish="typeIndex = $event.detail.current">
					<swiper-item style="overflow: auto;" v-for="(item,index) in articleType" :key="index">
						<article-item :type="item.status"
							@edit="editArticle = $event;$refs.editArticle.open();"></article-item>
					</swiper-item>
				</swiper>
			</view>
		</view>

		<uv-modal ref="editCategory" :showConfirmButton="false" :title="metaIndex?'修改话题':'修改板块'" :zIndex="20"
			@close="resetData()">
			<view style="width: 100%;">
				<u-row justify="space-between">
					<u-avatar :src="editCategory.imgurl" shape="square" size="50" @click="choose(true)"></u-avatar>
					<image mode="aspectFill" :src="editCategory.opt.background" @click="choose(false)"
						style="border-radius: 10rpx;width: 100%;height: 100rpx;margin-left: 50rpx;background: #f7f7f7;">
					</image>
				</u-row>
				<view style="margin-top: 20rpx;">
					<text style="color: #999;">名称</text>
					<u-input v-model="editCategory.name" maxlength="20" placeholder="分类名称" border="bottom"
						customStyle="padding: 10rpx 0;" />
					<u-gap height="10"></u-gap>
					<text style="color: #999;">简介</text>
					<u-input v-model="editCategory.description" maxlength="120" placeholder="分类介绍" border="bottom"
						customStyle="padding: 10rpx 0;" />
					<u-gap height="10"></u-gap>
					<view style="background: #88d8c00a;padding: 30rpx;border-radius: 20rpx;">
						<text style="color: #999;">主题色</text>
						<u-input v-model="editCategory.opt && editCategory.opt.primary" placeholder="#88d8c0"
							border="bottom" customStyle="padding: 10rpx 0;" />
						<u-gap height="10"></u-gap>
						<text style="color: #999;">下划线颜色</text>
						<u-input v-model="editCategory.opt && editCategory.opt.underline" placeholder="#88d8c0"
							border="bottom" customStyle="padding: 10rpx 0;" />
						<u-gap height="10"></u-gap>
						<text style="color: #999;">字体颜色</text>
						<u-input v-model="editCategory.opt && editCategory.opt.color" placeholder="#88d8c0"
							border="bottom" customStyle="padding: 10rpx 0;" />
					</view>
				</view>
				<u-button color="#88d8c0" shape="circle" customStyle="margin-top: 30rpx;"
					@click="editCategory.mid?saveCategory(false):addCategory()">保存</u-button>
			</view>
			<view slot="confirmButton"></view>

		</uv-modal>
		<uv-modal ref="editArticle" :showConfirmButton="false" title="帖子修改">
			<view style="width: 100%;" v-if="editArticle">
				<text style="font-Weight: bold;font-size: 36rpx;">{{editArticle.title}}</text>
				<view style="margin: 10rpx 0;">
					<u-button color="#88d8c0" shape="circle" @click="getContentInfo(editArticle.cid)">查看内容</u-button>
				</view>

				<view style="margin-top: 20rpx;">
					<text style="font-Weight: bold;">选择圈子</text>
				</view>

				<view style="margin-top: 20rpx;">
					<text style="font-Weight: bold;">文章属性</text>
					<u-row justify="space-between" customStyle="flex-wrap:wrap">
						<u-row>
							<text style="margin-right: 10rpx;">推荐</text>
							<u-switch v-model="editArticle.isrecommend" :inactiveValue="0" :activeValue="1"
								size="20"></u-switch>
						</u-row>
						<u-row>
							<text style="margin-right: 10rpx;">置顶</text>
							<u-switch v-model="editArticle.istop" :inactiveValue="0" :activeValue="1"
								size="20"></u-switch>
						</u-row>
						<u-row>
							<text style="margin-right: 10rpx;">轮播</text>
							<u-switch v-model="editArticle.isswiper" :inactiveValue="0" :activeValue="1"
								size="20"></u-switch>
						</u-row>
						<u-row customStyle="margin-top:10rpx">
							<text style="margin-right: 10rpx;">发布</text>
							<u-switch v-model="editArticle.status" inactiveValue="waiting" activeValue="publish"
								size="20"></u-switch>
						</u-row>

					</u-row>
				</view>
				<view style="margin-top: 50rpx;">
					<u-button color="#88d8c0" shape="circle" @click="saveArticle()">保存</u-button>
				</view>
			</view>
			<view slot="confirmButton"></view>
		</uv-modal>

		<uv-modal ref="showContent" title="查看内容" :zIndex="10077">
			<view style="width: 100%;" v-if="contentInfo">
				<uv-parse :content="contentInfo.text"></uv-parse>
			</view>
		</uv-modal>
		<l-clipper v-if="backgroundShow" :image-url="cropperBg"
			@success="upload($event.url,false); backgroundShow = false" @cancel="backgroundShow = false" is-limit-move
			is-lock-ratio :width="1280" :height="720" :min-width="1280" :min-height="720" :max-width="1920"
			:max-height="720" />

		<l-clipper v-if="showClipper" :imageUrl="avatarImage"
			@success="upload($event.url,true);showClipper=false;showLoading=true" @canel="showClipper = false"
			is-limit-move is-lock-ratio />
	</view>
</template>

<script>
	import articleItem from './components/manage/articleItem.vue';
	import metaItem from './components/manage/category.vue';
	export default {
		components: {
			metaItem,
			articleItem
		},
		data() {
			return {
				data: [],
				category: [],
				editCategory: {
					name: null,
					imgurl: null,
					description: null,
					opt: {
						background: '',
						primary: '',
						underline: '',
						color: ''
					},
					iswaterfall: false,
				},
				metasList: [{
						name: '板块',
						type: 'category'
					},
					{
						name: '话题',
						type: 'tag'
					}
				],
				metaIndex: 0,
				showEditCategory: false,
				avatarImage: null,
				cropperBg: null,
				backgroundShow: false,
				showClipper: false,
				articleSearchKey: '',
				articleType: [{
					name: '发布',
					status: 'publish'
				}, {
					name: '审核',
					status: 'waiting'
				}],
				typeIndex: 0,
				editArticle: null,
				status: false,
				contentInfo: null,
			};
		},
		created() {
			this.initData()
			this.getCategory()
		},
		computed: {

		},
		methods: {
			initData() {
				this.getAllData()
			},
			getAllData() {
				this.$http.post('/article/allData').then(res => {
					if (res.data.code) {
						let data = res.data.data
						this.data = [{
							name: '广告数',
							count: data.allAds
						}, {
							name: '评论数',
							count: data.allComments
						}, {
							name: '帖子数',
							count: data.allContents
						}, {
							name: '商品',
							count: data.allShop
						}, {
							name: '动态',
							count: data.allSpace
						}, {
							name: '用户',
							count: data.allUsers
						}]
					}
				})
			},
			getCategory() {
				this.$http.get('/category/list', {
					page: 1,
					limit: 30,
					params: {
						searchParams: JSON.stringify({
							type: 'category'
						})
					}
				}).then(res => {
					if (res.data.code) {
						let list = [];
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
						this.category = list;
					}
				});
			},
			saveCategory(upload) {

				this.$http.post('/category/update', {
					params: JSON.stringify({
						mid: this.editCategory.mid ? this.editCategory.mid : '',
						imgurl: this.editCategory.imgurl,
						name: this.editCategory.name,
						description: this.editCategory.description,
						opt: JSON.stringify(this.editCategory.opt)
					})
				}).then(res => {
					
					if (res.data.code) {
						uni.$u.toast('保存成功')
						if (!upload) {
							setTimeout(() => {
								this.$refs.editCategory.close()
								this.editCategory = {
									name: null,
									imgurl: null,
									description: null,
									opt: {
										background: null,
										primary: null,
										underline: null,
										color: null
									}
								}
							}, 500)
						}
					}
				})
			},
			addCategory() {
				this.$http.post('/category/add', {
					params: JSON.stringify({
						imgurl: this.editCategory.imgurl,
						name: this.editCategory.name,
						type: this.metaIndex ? 'tag' : 'category',
						description: this.editCategory.description,
						opt: JSON.stringify(this.editCategory.opt)
					})
				}).then(res => {
					
					if (res.data.code) {
						uni.$u.toast('创建成功')
						setTimeout(() => {
							this.getCategory()
							this.$refs.editCategory.close()
							this.editCategory = {
								name: null,
								imgurl: null,
								description: null,
								opt: {
									background: '',
									primary: '',
									underline: '',
									color: ''
								}
							}
						}, 500)
					}
				})
			},
			choose(isAvatar) {
				uni.chooseImage({
					count: 1,
					sourceType: ['album'],
					success: (res) => {
						if (isAvatar) {
							this.avatarImage = res.tempFilePaths[0];
							this.showClipper = true
						} else {
							this.cropperBg = res.tempFilePaths[0];
							this.backgroundShow = true
						}

					}
				})
			},
			upload(url, isAvatar) {
				this.$http.upload('/upload/full', {
					filePath: url,
					name: 'file'
				}).then(res => {
					
					if (res.data.code) {
						if (isAvatar) this.editCategory.imgurl = res.data.data.url;
						else this.editCategory.opt.background = res.data.data.url;
					}
				})
			},
			resetData() {
				setTimeout(() => {
					this.editCategory = {
						name: null,
						imgurl: null,
						description: null,
						opt: {
							background: null,
							primary: null,
							underline: null,
							color: null
						}
					}
				}, 500)

			},
			statusChange(status) {
				if (status == 'publish') {
					this.editArticle.status = 'waiting'
					this.status = false
				} else {
					this.editArticle.status = 'publish'
					this.status = true
				}
			},
			getContentInfo(id) {
				this.$http.get('/article/info', {
					params: {
						key: id,
						isMd: 1,
					}
				}).then(res => {
					
					if (res.data) {
						this.contentInfo = res.data
						this.$refs.showContent.open();
					}
				})
			},
			saveArticle() {
				console.log(this.editArticle.status)
				this.$http.post('/article/articleUpdate', {
					params: JSON.stringify({
						title: this.editArticle.title,
						cid: this.editArticle.cid,
						mid: this.editArticle.mid,
						istop: this.editArticle.istop,
						isswiper: this.editArticle.isswiper,
						isrecommend: this.editArticle.isrecommend
					}),
					postStatus: this.editArticle.status
				}).then(res => {
					
					if (res.data.code) {
						uni.$u.toast(res.data.msg)
						setTimeout(() => {
							this.$refs.editArticle.close()
							this.editArticle = null
						}, 500)
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>