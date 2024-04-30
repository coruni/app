<template>
	<view style="height: 100%;">
		<view style="height: 100%;display: flex;flex-direction: column;">
			<uv-navbar autoBack placeholder title="发布相册" bgColor="transparent">
				<view slot="left">
					<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
				</view>
				<view slot="right">
					<view class="publish-button">
						<view hover-class="button_hover" @click="update?updateArticle(): save()">
							<text>{{update?'更新':'发布'}}</text>
						</view>
					</view>
				</view>
			</uv-navbar>
			<editor id="editor" :adjust-position="false" placeholder="请上传图片" style="padding: 30rpx;height: 100%;"
				@ready="onEditorReady"></editor>
			<!-- 工具栏 -->
			<view class="toolbar" :style="{transform:`translateY(${-keyboardHeight}px)`}" id="toolbar">
				<u-row style="font-size: 30rpx;" @click="showCategory = true">
					<text>选择分类：{{article.category.name}}</text>
					<i class="mgc_right_line"></i>
				</u-row>
				<u-gap height="10"></u-gap>
				<uv-input :adjust-position="false" placeholder="请输入标题(必须)" v-model="article.title" border="none"
					class="input" :maxlength="32"></uv-input>
				<u-gap height="10"></u-gap>
				<u-row style="flex-shrink: 0;">
					<i class="mgc_photo_album_fill toolbar-button" @click="chooseImage()"></i>
					<u-row style="margin-left: 20rpx;flex: 1;" justify="space-between" @click="showTag = true">
						<u-row>
							<text style="font-size: 30rpx;margin-right: 20rpx;flex-shrink: 0;">已选标签：</text>
							<scroll-view scroll-x style="white-space: nowrap;overflow: hidden;width: 400rpx;">
								<block v-for="(item, index) in article.tags">
									<text style=" margin-right: 20rpx;"
										@click.stop="tagTap(item)">#{{ item.name }}</text>
								</block>
							</scroll-view>
						</u-row>
						<i class="mgc_right_line"></i>
					</u-row>
				</u-row>
			</view>
		</view>
		<!-- 组件 -->
		<uv-modal ref="publish" :closeOnClickOverlay="false" :showConfirmButton="false" :show-cancel-button="false"
			width="300rpx">
			<uv-loading-icon text="发布中..." mode="circle" color="#aa96da"></uv-loading-icon>
			<view slot="confirmButton"></view>
		</uv-modal>
		<u-popup customStyle="border-radius:40rpx 40rpx 0 0;" :show="showCategory" @close="showCategory = false"
			:closeable="true">
			<view style="height: 70vh;padding:30rpx;border-radius:40rpx 40rpx 0 0;">
				<view style="text-align: center;">选择板块</view>
				<view style="margin-top: 30rpx;">
					<scroll-view scroll-y style="height: 65vh;">
						<u-row justify="space-between" style="flex-wrap: wrap;">
							<block v-for="(item,index) in category" :key="index">
								<u-col :span="5.8">
									<u-row style="padding: 20rpx;" align="top"
										@click="article.category = item;showCategory = false">
										<image :src="item.imgurl" mode="aspectFill"
											style="width: 100rpx;height: 100rpx;border-radius: 20rpx;background: #f7f7f7;flex-shrink: 0;">
										</image>
										<view style="margin-left: 20rpx;display: flex;flex-direction: column;">
											<text style="font-Weight: bold;" class="u-line-1">{{item.name}}</text>
											<text style="font-size: 30rpx;color: #999;"
												class="u-line-1">{{item.description}}</text>
										</view>
									</u-row>
								</u-col>
							</block>
						</u-row>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<!-- 标签&&话题 -->
		<u-popup customStyle="border-radius:40rpx 40rpx 0 0" :show="showTag" @close="showTag = false">
			<view style="height: 70vh;padding:30rpx">
				<view style="margin-top: 30rpx;">
					<u-row customStyle="flex-wrap:nowrap;font-size:30rpx">
						<text style="font-weight: bold;">标签&话题：</text>
						<text style="color: #999;">选择相关内容、分类，获得更多浏览</text>
					</u-row>
					<view style="margin-top: 20rpx;display: flex">
						<uv-input prefix-icon="search" v-model="tagKey" placeholder="搜索标签&话题"
							customStyle="padding:10rpx 6rpx;background:#f7f7f7" border="none"
							@input="getTags()"></uv-input>
						<view style="margin-left: 20rpx;">
							<u-button color="#aa96da" @click="addNewTag()">新增</u-button>
						</view>
					</view>
				</view>
				<view style="margin-top: 30rpx;">
					<block v-for="(item,index) in article.tags" :key="index">
						<view style="position: relative;display: inline-block;">
							<view class="select-tag">
								<text>{{item.name}}</text>
							</view>
							<i class="mgc_close_circle_line select-tag-close" @click="tagTap(item)"></i>
						</view>
					</block>
				</view>
				<view style="margin-top: 40rpx;">
					<text style="font-weight: bold;">推荐话题</text>
					<scroll-view scroll-y style="flex:1;height: 55vh;;overflow-y: scroll;">
						<block v-for="(item,index) in tags" :key="index">
							<u-row @click="tagTap(item)" style="padding: 20rpx;">
								<image v-if="item.imgurl" :src="item.imgurl" mode="aspectFill"
									style="width: 50rpx;height: 50rpx;background: #f7f7f7;margin-right: 20rpx;border-radius: 20rpx;">
								</image>
								<text
									:style="{color:article.tags.some(tag=>tag.name == item.name)?'#aa96da':''}">{{item.name}}</text>
							</u-row>
						</block>
					</scroll-view>
				</view>
			</view>
		</u-popup>
		<u-modal :show="showLoading" @close="showLoading=false;uploadErr.status = false;uploadErr.msg=null;"
			:closeOnClickOverlay="uploadErr.status" :showConfirmButton="false"
			:title="uploadErr.status?'上传错误':'上传中...'">
			<u-line-progress :percentage="percentage" activeColor="#aa96da" :showText="false"
				v-if="!uploadErr.status"></u-line-progress>
			<text v-if="uploadErr.status">错误信息：{{uploadErr.msg}}</text>
		</u-modal>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				images: [],
				percentage: 0,
				uploadErr: {
					status: false,
					msg: null,
				},
				showTag: false,
				showLoading: false,
				showCategory: false,
				category: [],
				tags: [],
				tagKey:'',
				keyboardHeight: 0,
				toolbarHeight: 0,
				editorHeight: 0,
				article: {
					title: '',
					text: '',
					category: {},
					tags: [],
					opt: {
						create: false,
						files: [{}],
						// files:
						// name: null,  //名称
						// link: null,  //连接
						// password: null, //提取密码
						// unzipPass: null, //解压密码
						// downloadType: null, // 网盘地址 或者直链
						permission: [],
						gift: [],
						// Gift type 可选 item 可选
					}
				},
				editorCtx: null,
				windowHeight: 0,
				isSave: false,
				back: false,
				update: false,
				windowHeight: 0,

			}
		},
		onReady() {
			let toolbarHeight = 0;
			uni.createSelectorQuery().select("#toolbar").boundingClientRect(data => {
				toolbarHeight = data.height
			}).exec()
			uni.createSelectorQuery().in(this).select("#editor-container").boundingClientRect(data => {
				this.editorHeight = data.height
			})
			let systemInfo = uni.getSystemInfoSync()
		},
		beforeRouteLeave(to, from, next) {
			if (this.back) {
				next()
				return;
			}
			if (this.showCategory || this.showTag) {
				this.showCategory = false;
				this.showTag = false;
				this.$Router.$lockStatus = false;
				return;
			}
			next()
		},
		onLoad(params) {
			this.initData()
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
			// 判断update
			if (this.$Route.query.update) {
				this.update = true;
				this.getContentInfo(this.$Route.query.id)
			}
			this.windowHeight = uni.getSystemInfoSync().windowHeight

		},
		onUnload() {
			uni.offKeyboardHeightChange()
		},

		methods: {
			initData() {
				this.getCategory()
				this.getTags()
			},
			getCategory() {
				this.$http.get('/category/list', {
					params: {
						limit: 100,
						params: JSON.stringify({
							type: 'category',
						}),
					}
				}).then(res => {

					if (res.data.code == 200) {
						let data = res.data.data.data;
						for (let i in data) {
							if (data[i].mid == 1) this.article.category = data[i];
						}
						this.category = data
					}
				})
			},
			getContentInfo(id) {
				this.$http.get('/article/info', {
					params: {
						id
					},
				}).then(res => {
					if (res.data.code == 200) {
						this.article = res.data.data
						this.article.category = res.data.data.category ? res.data.data
							.category : this.category[0];
						this.article.tags = res.data.data.tag
						this.editorCtx.getContents({
							success: (res) => {
								if (res.text.length < 2) {
									this.setContents()
								}
							}
						})
					}
				}).catch(err => {

				})

			},
			setContents() {
				this.editorCtx.setContents({
					html: this.article.text,
				})
			},
			getTags() {
				this.$http.get('/category/list', {
					params: {
						page: 1,
						limit: 20,
						params: JSON.stringify({
							type: 'tag',
						}),
						searchKey: this.tagKey,
						order: 'count'
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.tags = res.data.data.data
					}
				})
			},
			onEditorReady() {
				// #ifdef MP-BAIDU
				this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor');
				// #endif

				// #ifdef APP-PLUS || H5 ||MP-WEIXIN
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
				// #endif
			},
			save() {
				if (this.isSave) return;
				if (this.article.title < 4) {
					uni.$u.toast('标题太短')
					this.isSave = false;
					return
				}
				this.isSave = true;
				this.editorCtx.getContents({
					success: res => {
						this.article.text = res.html
						if (res.html.length < 15) {
							uni.$u.toast('你还没上传图片呢')
							this.isSave = false;
							return
						}
						this.$refs.publish.open()
						let tags = [];
						let newTags = [];
						
						this.article.tags.forEach(tag => {
							if (tag.hasOwnProperty('mid')) {
								tags.push(tag.mid);
							} else if (tag.id === 0) {
								newTags.push(tag.name); 
							}
						});
						
						tags = tags.join(',');
						newTags = newTags.join(',');
						this.$http.post('/article/articleAdd', {
							title: this.article.title,
							text: this.article.text,
							category: this.article.category.mid,
							mid: this.article.category.mid,
							tag: tags,
							type:'photo',
							newTag: newTags,
							opt: JSON.stringify(this.article.opt)
						}).then(res => {
							if (res.data.code == 200) {
								this.back = true
								setTimeout(() => {
									this.$Router.back(1)
								}, 1500)
							}
							setTimeout(() => {
								this.$refs.publish.close()
							}, 1000)
							uni.$u.toast(res.data.msg)
						}).catch(err => {})
						this.isSave = false;
					}
				})
			},
			updateArticle() {
				this.editorCtx.getContents({
					success: (res) => {
						this.article.text = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `_|#${alt}|`;
							});

						if (res.html.length < 15) {
							uni.$u.toast('再多写点吧~')
							return;
						}
						if (this.article.title.length < 3) {
							uni.$u.toast('标题太短')
							return;
						}
						console.log(this.article)
						let tags = this.article.tags.map(tag => tag.mid).join(',');
						this.$http.post('/article/update', {
							id: this.article.cid,
							title: this.article.title,
							text: this.article.text,
							category: this.article.category.mid ? this.article.category
								.mid : this.article.category[0].mid,
							tag: tags,
							price: this.article.price,
							discount: this.article.discount,
							opt: JSON.stringify(this.article.opt)
						}).then(res => {
							if (res.data.code == 200) {
								this.saveBack = true
								setTimeout(() => {
									this.$Router.back(1)
								}, 1000)
							}
							uni.$u.toast(res.data.msg)
						})
					}
				})
			},
			async chooseImage() {
				this.percentage = 0; // 重置进度条
				try {
					const res = await uni.chooseImage({
						count: 100
					});

					this.showLoading = true;
					let images = await this.upload(res.tempFilePaths);
					for (let image of images) {
						this.editorCtx.insertImage({
							src: image,
							alt: this.article.title ? this.article.title : 'IMAGE'
						});
					}

					setTimeout(() => {
						this.showLoading = false;
					}, 200);

					this.editorCtx.insertText({
						text: '\n'
					});
				} catch (err) {
					console.error(err); // 打印错误信息到控制台
				}
			},
			tagTap(item) {
				// 检查标签是否已存在于数组中
				const index = this.article.tags.findIndex(tag => tag.mid === item.mid);
				if (index !== -1) {
					// 如果存在，从数组中删除
					this.article.tags.splice(index, 1);
				} else {
					// 如果不存在，加入数组
					this.article.tags.push(item);
				}
			},
			upload(files) {
				return new Promise((resolve, reject) => {
					const processedFiles = files.map((item, index) => ({
						name: `file${index+1}`,
						uri: item // 文件路径
					}));
					this.$http.upload('/upload/full', {
						files: processedFiles,
						getTask: (task) => {
							task.onProgressUpdate((res) => {
								this.percentage = res.progress
							})
						}
					}).then(res => {
						if (res.data.code == 200) {
							const data = res.data.data;
							if (data.hasOwnProperty('urls')) {
								this.images = data.urls
								resolve(data.urls)
							} else {
								this.images.push(data.url)
								resolve([data.url])
							}
						} else {
							this.uploadErr.status = true
							this.uploadErr.msg = res.data.msg
						}
					}).catch(err => {
						this.uploadErr.status = true
						this.uploadErr.msg = '网络错误'
					})
				})
			},
			addNewTag() {
				if (this.tagKey == '' || !this.tagKey) return;
				let tag = {
					name: this.tagKey,
					id: 0,
				}
				this.article.tags.push(tag)
				this.tagKey = ''
				console.log(this.article.tags);
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100vh;
	}

	@media (prefers-color-scheme: dark) {
		#editor {
			border-radius: 20rpx;
			padding: 30rpx;
		}
		.toolbar{
			background-color: #292929 !important;
		}

		.category {
			background: #525252 !important;
		}
	}

	.ql-container ::v-deep .ql-blank::before {
		font-style: normal;
		color: #999;
		min-height: 0rpx;
	}

	.ql-container ::v-deep img {
		margin: 20rpx auto;
		border-radius: 20rpx;
		max-width: 80%;
		display: block;
	}

	.button_hover {
		opacity: 0.5;
	}

	.imageCover {
		position: relative;
		object-fit: cover;
		width: 100%;
		height: 200px;
	}

	.category {
		border-radius: 50rpx;
		flex-shrink: 0;
		background: #f7f7f7;
		color: black;
		padding: 10rpx;
		flex: 1;
		margin-left: 20rpx;
	}

	.publish-button {
		display: flex;
		align-items: center;
		background: #aa96da;
		border-radius: 10rpx;
		padding: 10rpx;
		color: white;
		font-size: 28rpx;
	}

	.input {
		padding: 15rpx !important;
		border-radius: 10rpx;
		background: #f7f7f7;
	}

	.toolbar {
		padding: 30rpx;
		flex-shrink: 0;
		transition: all 0.3s ease;
		background: #fff;
	}

	.toolbar-button {
		font-size: 45rpx;
		border-radius: 50rpx;
		padding: 10rpx;
		background-color: #aa96da1e;
		color: #aa96da;

	}
	.select-tag {
		display: inline-block;
		border-radius: 20rpx;
		padding: 10rpx;
		border: $c-primary 1rpx solid;
		color: $c-primary;
		font-size: 28rpx;
		margin: 10rpx;
	
		&-close {
			color: $c-primary;
			position: absolute;
			top: 0;
			right: 0;
		}
	}
</style>