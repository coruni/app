<template>
	<view>
		<u-navbar placeholder autoBack :title="update?'更新视频':'发布视频'" bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
			<view slot="right">
				<u-button shape="circle" color="#88d8c0" style="height: 60rpx;"
					@click="update?updateArticle():save()">{{update?'更新':'发布'}}</u-button>
			</view>
		</u-navbar>
		<yingbing-video ref="video" :autoplay="false" style="height: 500rpx;" @captureFinish="captureFinish"
			:src="video.src" :title="article.title" :poster="video.potser">
			<view style="text-align: center;height:500rpx;display: flex;justify-content: center;align-items: center;"
				v-if="!article.videos[index].src">
				<uv-line-progress :percentage="progress" v-if="uploadTask" style="margin: 30rpx;"></uv-line-progress>
				<text class="uploadBtn" @click="chooseVideo()" v-if="!uploadTask">上传视频</text>
			</view>
		</yingbing-video>
		<view style="margin: 30rpx;">
			<view>
				<text>标题</text><text style="color: red;">*</text>
				<uv-input v-model="article.title" :maxlength="20" placeholder="取一个响亮的标题!" border="none"
					class="input"></uv-input>
			</view>
			<view style="margin-top: 30rpx;">
				<text>简介</text>
				<editor id="editor" :adjust-position="false" placeholder="视频描述" @ready="onEditorReady"
					style="background: #f7f7f7;border-radius: 10rpx;padding: 10rpx;max-height: 200rpx;min-height: 200rpx;">
				</editor>
			</view>
			<view style="margin-top: 30rpx;">
				<text>分类</text>
				<u-row justify="space-between" @click="showCategory = true">
					<text>{{article.category.name}}</text>
					<i class="mgc_right_line" style="font-size: 40rpx;"></i>
				</u-row>
			</view>
			<view style="margin-top: 30rpx;">
				<text>分集EP</text>
				<u-collapse ref="collapse" accordion @open="collTap" :border="false">
					<u-collapse-item v-for="(item,index) in article.videos" :key="index" :title="item.name"
						:border="false" :name="index">
						<u-row>
							<u-form :model="article.videos[index]" :rules="rules" class="epContent"
								:ref="`epForm_${index}`">
								<u-form-item prop="name">
									<uv-input v-model="article.videos[index].name" placeholder="分集名" border="none"
										style="padding: 10rpx;">
										<view slot="prefix">
											<text>分集名：</text>
										</view>
									</uv-input>
								</u-form-item>
								<u-form-item prop="src">
									<uv-input v-model="article.videos[index].src" placeholder="视频源" border="none"
										style="padding: 10rpx;">
										<view slot="prefix">
											<text>视频源：</text>
										</view>
									</uv-input>
								</u-form-item>
								<u-form-item prop="poster">
									<uv-input v-model="article.videos[index].poster" placeholder="封面源" border="none"
										style="padding: 10rpx;">
										<view slot="prefix">
											<text>封面源：</text>
										</view>
										<view slot="suffix">
											<image :src="article.videos[index].poster" mode="aspectFill"
												style="width: 40rpx;height: 40rpx;"
												@click="previewImg(article.videos[index].poster)"></image>
										</view>
									</uv-input>
								</u-form-item>
							</u-form>
							<i class="mgc_delete_2_line" style="font-size: 45rpx;margin-left: 30rpx;color: red;"
								@click="deleteVideo(index)"></i>
						</u-row>
					</u-collapse-item>
					<u-button color="#88d8c0" shape="circle" @click="addEP" style="margin-top: 60rpx;">添加分集</u-button>
				</u-collapse>
			</view>
		</view>
		<!-- 分类 -->
		<u-popup mode="right" :show="showCategory" @close="showCategory = false">
			<view style="width: 70vw;">
				<u-gap height="60"></u-gap>
				<view style="padding:30rpx">
					<text style="font-weight: bold;font-size: 34rpx;">选择分类</text>
					<view style="padding-top: 20rpx;">
						<block v-for="(item,index) in category" :key="index">
							<u-row @click="article.category = item;showCategory = false" style="margin-bottom: 20rpx;">
								<text v-if="item.isrecommend" style="
									font-size: 26rpx;
									color:#88d8c0;
									background: #88d8c03c;
									padding:4rpx 14rpx;
									border-radius: 10rpx;
									margin-right: 20rpx;">推荐</text>
								<u-row>
									<u-avatar :src="item.imgurl" size="30" shape="square" v-if="item.imgurl"
										mode="aspectFill"></u-avatar>
									<text style="margin-left: 20rpx;"
										:style="{color:article.category && article.category.mid == item.mid?'#88d8c0':''}">{{item.name}}</text>
								</u-row>
							</u-row>
						</block>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		base64ToPath
	} from 'image-tools'
	export default {
		data() {
			return {
				video: {
					src: '',
					potser: '',
					name: ''
				},
				category: [],
				index: 0,
				article: {
					title: '',
					text: '',
					videos: [{
						name: 'EP1',
						src: '',
						poster: ''
					}],
					type: 'video', // 不要修改！
					tags: [],
					category: {
						mid: 1,
						name: ''
					},
				},
				editorCtx: null,
				uploadTask: null,
				progress: 0,
				showCategory: false,
				saving: false,
				saveBack: false,
				rules: {
					'name': {
						type: 'string',
						required: true,
						message: '请填写分集名',
						trigger: ['blur', 'change']
					},
					'src': {
						type: 'string',
						required: true,
						message: '请上传视频或者填写链接',
						trigger: ['blur', 'change']
					},
					'poster': {
						type: 'string',
						required: true,
						message: '请截取封面或者填写链接',
						trigger: ['blur', 'change']
					},
				},
				update: false,
			}
		},
		watch: {
			'video.src': {
				handler() {
					this.$refs.video.reload()
				}
			}
		},
		onLoad() {
			if (this.$Route.query.update) {
				this.update = true;
				this.getContentInfo(this.$Route.query.id)
			}
			this.getCategory()
			this.getTags()
		},
		methods: {
			getCategory() {
				this.$http.get('/category/list', {
					params: {
						page: 1,
						limit: 50,
						params: JSON.stringify({
							type: 'category'
						})
					}
				}).then(res => {
					if (res.data.code == 200) {
						for (let i in res.data.data.data) {
							if (res.data.data.data[i].mid == 1) this.article.category = res.data.data.data[i];
						}
						console.log(res.data.data.data)
						this.category = res.data.data.data
					}
				})
			},
			getTags() {
				this.$http.get('/category/list', {
					params: {
						page: 1,
						limit: 10,
						params: JSON.stringify({
							type: 'tag',
						}),
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
			collTap(data) {
				this.video = this.article.videos[data];
				this.index = data;
			},
			async chooseVideo() {
				uni.chooseVideo({
					compressed: false,
					success: async (res) => {
						let video = await this.uploadFile(res.tempFilePath, 'video')
						if (video) {
							this.article.videos[this.index].src = video
						}
					}
				})
			},
			uploadFile(url, type) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						fileType: type, // 仅允许video/image/audio
						filePath: url, //不支持多文件上传使用filePath
						name: 'file',
						getTask: (task, options) => {
							this.uploadTask = task
							task.onProgressUpdate((res) => {
								console.log(res.progress)
								this.progress = res.progress
							})
						}
					}).then(res => {
						if (res.data.code == 200) {
							// 上传完成之后清除uploadTask;
							resolve(res.data.data.url)
						}
						this.uploadTask = null;
					}).catch(err => {
						this.uploadTask = null;
					})
				})

			},
			async captureFinish(data) {
				let poster
				// #ifdef H5
				poster = await this.formatImage(data.base64)
				// #endif
				// #ifdef APP
				poster = await this.formatImage(data)
				// #endif
				console.log(poster)
				if (poster) {
					this.article.videos[this.index].poster = poster
				}
			},
			formatImage(base64) {
				return new Promise((resolve, reject) => {
					base64ToPath(base64).then(res => {
						this.$http.upload('/upload/full', {
							filePath: res,
							name: 'file',
						}).then(res => {
							if (res.data.code == 200) {
								resolve(res.data.data.url)
							}
						})
					})
				})
			},
			previewImg(data) {
				var data = data.replace('_compress.webp', '')
				uni.previewImage({
					urls: [data],
					current: 0
				})
			},
			addEP() {
				// 获取当前videos数组的长度，即已存在的视频数量
				const epIndex = this.article.videos.length + 1;

				// 添加一个新的视频元素到this.article.videos，同时根据视频数量定义EP名称
				const newVideo = {
					name: 'EP' + epIndex,
					src: '',
					poster: ''
				};
				this.article.videos.push(newVideo);

				// 更新video为新添加的视频元素
				this.video = newVideo;

				// 更新index为最后一个元素的索引
				this.index = this.article.videos.length - 1;
			},
			deleteVideo(index) {
				if (index < 0 || index >= this.article.videos.length) {
					console.error('Invalid index');
					return;
				}

				// 删除指定索引位置的视频元素
				this.article.videos.splice(index, 1);

				// 如果被删除的视频正好是当前展示的视频，将video和index更新
				if (this.index === index) {
					this.index = Math.min(index, this.article.videos.length - 1);
					this.video = this.article.videos[this.index];
				} else if (this.index > index) {
					this.index--;
				}
			},
			save() {
				if (this.saving) return;
				if (this.article.title < 4) {
					uni.$u.toast('标题太短')
					return
				}

				// 手动对每个分集表单进行验证
				for (let index = 0; index < this.article.videos.length; index++) {
					console.log(this.$refs[`epForm_${index}`])
					this.$refs[`epForm_${index}`][0].validate().catch(() => {
						uni.$u.toast('请填写信息')
						return
					})
				}

				this.saving = true;
				this.editorCtx.getContents({
					success: res => {
						this.article.text = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `_|#${alt}|`;
							});

						if (this.article.text.length < 5) {
							uni.$u.toast('再多写点吧~');
							this.saving = false;
							return;
						}
						let tags = this.article.tags.map(tag => tag.mid).join(',');
						this.$http.post('/article/articleAdd', {
							title: this.article.title,
							text: this.article.text,
							category: this.article.category.mid,
							videos: JSON.stringify(this.article.videos),
							type: 'video',
							mid: this.article.category.mid,
							tag: tags,
							opt: JSON.stringify(this.article.opt),
						}).then(res => {
							if (res.data.code == 200) {
								this.saveBack = true
								// 关闭弹窗再弹出成功对话框
								setTimeout(() => {
									uni.$u.toast(res.data.msg)
									setTimeout(() => {
										this.$Router.back(1);
									}, 1500);
								}, 1000)
							}
							uni.$u.toast(res.data.msg)
							this.saving = false
						}).catch(err => {
							this.saving = false
						})
					}
				});
			},
			getContentInfo(id) {
				this.$http.get('/article/info', {
					params: {
						id
					},

				}).then(res => {
					if (res.data.code == 200) {
						this.article = res.data.data
						this.article.category = res.data.data.category ? res.data.data.category : this.category[0];
						this.article.tags = res.data.data.tag
						this.editorCtx.getContents({
							success: (res) => {
								if (res.text.length < 2) {
									this.setContents()
								}
							}
						})
					}

				})
			},
			setContents() {
				this.editorCtx.setContents({
					html: this.article.text,

				})
			},
			updateArticle() {
				this.editorCtx.getContents({
					success: (res) => {
						this.article.text = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `_|#${alt}|`;
							});

						if (res.text.length < 3) {
							uni.$u.toast('再多写点吧~')
							return;
						}
						if (this.article.title.length < 3) {
							uni.$u.toast('标题太短')
							return;
						}
						let tags = this.article.tags.map(tag => tag.mid).join(',');
						this.$http.post('/article/update', {
							id: this.article.cid,
							title: this.article.title,
							text: this.article.text,
							category: this.article.category.mid ? this.article.category
								.mid : this.article.category[0].mid,
							mid: this.article.category.mid ? this.article.category.mid : this.article
								.category[0].mid,
							tag: tags,
							videos: JSON.stringify(this.article.videos),
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
		}
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark) {

		.uploadBtn,
		.epContent {
			background: #525252 !important;
		}

		.uv-input__content__prefix-icon {
			color: white !important;
		}
	}

	.ql-container ::v-deep .ql-blank::before {
		font-style: normal;
		color: #999;
		min-height: 0rpx;
	}

	.uploadBtn {
		padding: 15rpx;
		background: #f7f7f7;
		border-radius: 10rpx;
	}

	.input {
		background: #f7f7f7;
		padding: 10rpx 0 !important;
		margin-top: 10rpx;
	}

	.epContent {
		background: #f7f7f7;
		display: flex;
		flex-direction: column;
		border-radius: 10rpx;
		flex: 1
	}
</style>