<template>
	<view>
		<u-navbar title="发布商品" placeholder autoBack bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
			<view slot="right">
				<u-button color="#aa96da" shape="circle" style="height: 60rpx;"
					@click="update?updateProduct():save()">{{update?'更新':'发布'}}</u-button>
			</view>
		</u-navbar>
		<view style="margin: 30rpx;">
			<u-input v-model="shop.title" border="bottom" maxlength="40" placeholder="商品标题" placeholderStyle="padding:0"
				style="padding: 10rpx 0rpx;"></u-input>
			<view style="margin-top: 20rpx;background: #f7f7f7;border-radius: 20rpx;padding: 30rpx;">
				<editor id="editor" @ready="" placeholder="请输入商品介绍" @ready="onEditorReady" @statuschange="con"></editor>
				<view style="margin-top: 20rpx;">
					<u-row>
						<i class="ess mgc_pic_2_line" style="font-size: 35rpx;" @click="choose()"></i>
						<block v-for="(color,index) in colors" :key="index">
							<text :style="{background:color}"
								style="margin-left: 20rpx;padding: 15rpx;border-radius: 50rpx;"></text>
						</block>
					</u-row>
				</view>
			</view>
			<view style="margin-top: 20rpx;">
				<label>商品参数</label>
				<u-form ref="form" labelPosition="top">
					<text style="font-size: 28rpx;">商品主图</text>
					<uv-scroll-list indicatorActiveColor="#aa96da">
						<block v-for="(image,index) in shop.imgurl" :key="index">
							<view style="position: relative;margin-right: 20rpx;border-radius: 16rpx;">
								<u-image :src="image" height="130" width="100" radius="8"
									@click="previewImg(index)"></u-image>
								<view @click="deleteImage(index)"
									style="position: absolute;right: 0;top: 0;background: #aa96da;color: white;border-radius: 0 16rpx 0 16rpx;">
									<i class="ess mgc_close_line"></i>
								</view>
							</view>
						</block>
						<u-row style="height: 130px;width: 100px;border: #ccc solid 1rpx;border-radius: 16rpx;"
							v-if="shop.imgurl.length<10" @click="choose('mainPic')">
							<view style="text-align: center;flex:1">
								<i class="ess mgc_add_line" style="font-size: 50rpx;"></i>
							</view>
						</u-row>
					</uv-scroll-list>

					<u-form-item label="商品价格*" labelWidth="auto">
						<u-input v-model="shop.price" placeholder="只能是整数" border="none"
							style="background: #f7f7f7;padding: 8rpx 18rpx;border-radius: 50rpx;"></u-input>
						<view style="margin-left: 20rpx;">
							<u-button plain color="#aa96da" style="height: 60rpx;" shape="circle"
								@click="setPrice()">一键设置</u-button>
						</view>
					</u-form-item>
					<u-form-item label="库存" labelWidth="auto">
						<u-input v-model="shop.num" placeholder="不填写则由产品规格中的数量决定" border="none"
							style="background: #f7f7f7;padding: 8rpx 18rpx;border-radius: 50rpx;"></u-input>
					</u-form-item>
					<u-form-item label="运费" labelWidth="auto">
						<u-input v-model="shop.freight" placeholder="不填写则为包邮" border="none"
							style="background: #f7f7f7;padding: 8rpx 18rpx;border-radius: 50rpx;"></u-input>
					</u-form-item>
					<u-form-item>
						<u-row justify="space-between" style="flex:1" @click="showCategory = true">
							<text style="font-size: 28rpx;">分类：{{shop.sort.name}}</text>
							<i class="ess mgc_right_line"></i>
						</u-row>
					</u-form-item>
					<u-form-item label="商品规格*" labelWidth="auto">
						<u-swipe-action>
							<view style="display: flex;flex-direction: column;">
								<u-swipe-action-item v-for="(item,index) in shop.specs" :key="item.id"
									:options="options" @click="swiperTap($event,index)">
									<view
										style="background: #f7f7f7;padding: 10rpx;border-radius: 10rpx;margin-bottom: 10rpx;">
										<u-row style="flex-wrap: wrap;" justify="space-between">
											<u-col :span="5.8">
												<u-row>
													<text>名称：</text>
													<u-input v-model="shop.specs[index].name" placeholder="规格名称"
														border="none"
														style="border-radius: 10rpx;margin-left: 10rpx;padding: 4rpx 10rpx;background: white;"></u-input>
												</u-row>
											</u-col>
											<u-col :span="5.8">
												<u-row>
													<text>价格*：</text>
													<u-input v-model="shop.specs[index].price" placeholder="规格价格"
														border="none"
														style="border-radius: 10rpx;margin-left: 10rpx;padding: 4rpx 10rpx;background: white;"></u-input>
												</u-row>
											</u-col>
										</u-row>
										<u-row style="flex-wrap: wrap;margin-top: 10rpx;" justify="space-between">
											<u-col :span="5.8">
												<u-row>
													<text>库存：</text>
													<u-input v-model="shop.specs[index].num" placeholder="规格库存"
														border="none"
														style="border-radius: 10rpx;margin-left: 10rpx;padding: 4rpx 10rpx;background: white;"></u-input>
												</u-row>
											</u-col>
											<u-col :span="5.8">
												<u-row>
													<text>图片*：</text>
													<image :src="shop.specs[index].image" mode="aspectFill"
														style="width: 50rpx;height: 50rpx;background: white;border-radius: 10rpx;margin-left: 10rpx;">
													</image>
												</u-row>
											</u-col>
										</u-row>
									</view>
								</u-swipe-action-item>
								<view style="text-align: right;margin-top: 20rpx;">
									<i class="ess mgc_add_line" hover-class="hover"
										style="color: white;background: #aa96da;padding: 4rpx;border-radius: 50rpx;"
										@click="specsAdd()"></i>
								</view>
							</view>
						</u-swipe-action>
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view style="font-size: 26rpx;color: #999;margin: 30rpx;">
			<u-row align="top">
				<i class="ess mgc_warning_line"></i>
				<text style="margin-left: 10rpx;">商城物品定价为积分且积分数量只能是整数，暂不支持小数点。积分比例请根据充值比例定义防止出现盈亏问题</text>
			</u-row>

		</view>
		<u-picker :show="showCategory" keyName="name" :columns="columns" @close="showCategory = false"
			@cancel="showCategory=false" closeOnClickOverlay
			@confirm="shop.sort = $event.value[0];showCategory=false"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shop: {
					title: null,
					text: null,
					price: null,
					num: 0,
					imgurl: [],
					sort: '',
					freight: 0,
					specs: [{
						id: 1,
						name: '',
						price: '',
						num: '',
						image: '',
					}],
				},
				editorCtx: null,
				columns: [
					[]
				],
				showCategory: false,
				update: 0,
				options: [{
					text: '删除',
					style: {
						backgroundColor: 'red'
					}
				}],
				colors: ['#aa96da', '#5bd784', '#ffa600', '#0dd0f2', '#fb4f14', '#000000'],
			}
		},
		created() {
			this.getCategory()
		},
		onLoad(params) {
			if (params && params.update == 1) this.update = params.update;
			if (params.update == 1) this.getData(params.id);

		},
		methods: {
			getData(id) {
				this.$http.post('/shop/info', {
					id
				}).then(res => {
					if (res.data.code == 200) {
						this.shop = res.data.data;
						this.columns[0].map(item => {
							if (item.id == res.data.sort.id) {
								this.shop.sort = item;
							}
						});
						this.$nextTick(() => {
							if (this.editorCtx) {
								this.editorCtx.setContents({
									html: this.shop.text,
									success: () => {
										this.editorCtx.insertText({
											text: '\n'
										})
									}
								})
							}
						}, 200)
					}
				})
			},
			addProduct() {
				this.$http.post('/shop/add', {
					...this.shop,
					specs: JSON.stringify(this.shop.specs),
					sort: this.shop.sort.id
				}).then(res => {
					if (res.data.code == 200) {

					}
				})
			},
			getCategory() {
				this.$http.get('/shop/typeList', {}).then(res => {
					if (res.data.code == 200) {
						if (res.data.data.data.length > 0) {
							this.shop.sort = res.data.data.data[0]
							res.data.data.data.forEach(item => {
								this.columns[0].push({
									name: item.name,
									id: item.id
								});
							});
						}
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
				if (this.update) {
					setTimeout(() => {
						this.setContents()
					}, 500)
				}

			},
			specsAdd() {
				const lastSpec = this.shop.specs[this.shop.specs.length - 1];
				const newId = lastSpec ? lastSpec.id + 1 : 1; // 如果数组不为空，使用最后一个元素的id加1，否则使用1作为初始id
				this.shop.specs.push({
					id: newId,
					name: '',
					price: '',
					num: '',
					image: '',
				});
			},
			swiperTap(event, index) {

				this.shop.specs.splice(index, 1);
			},
			setPrice(price) {
				this.shop.specs.forEach(spec => {
					spec.price = this.shop.price;
				});
			},
			save() {
				if (this.shop.sort == null || this.shop.sort == '') {
					uni.$u.toast('请选择分类');
					return;
				}
				uni.showLoading({
					mask: true,
					title: '发布中...'
				})
				
				let params = this.shop
				params.sort = params.sort.id
				if (!params.num) {
					let num = 0
					params.specs.forEach(specs => {
						num += specs.num
					})
					params.num = num
				}
				this.editorCtx.getContents({
					success: (res) => {
						params.text = res.html
						this.$http.post('/shop/add', {
							...params,
							specs: JSON.stringify(params.specs),
							images: JSON.stringify(params.imgurl)
						}).then(res => {
							uni.hideLoading()
							if (res.data.code) {
								uni.$u.toast('发布完成')
								setTimeout(() => {
									this.$Router.back()
								}, 800)
							}
						}).catch(err => {
							console.log(err)
							uni.hideLoading()
							uni.$u.toast('发布失败')
						})
					}
				})
			},
			updateProduct() {
				uni.showLoading({
					mask: true,
					title: '发布中...'
				})
				let params = this.shop
				params.sort = params.sort.id
				if (!params.num) {
					let num = 0
					params.specs.forEach(specs => {
						num += specs.num
					})
					params.num = num
				}
				this.editorCtx.getContents({
					success: (res) => {
						params.text = res.html
						this.$http.post('/shop/editShop', {
							params: JSON.stringify(params)
						}).then(res => {
							uni.hideLoading()
							if (res.data.code) {
								uni.$u.toast('修改完成')
								setTimeout(() => {
									this.$Router.back()
								}, 800)
							}
						}).catch(err => {
							uni.hideLoading()
							uni.$u.toast('修改失败')
						})
					}
				})
			},
			async choose(type) {
				uni.chooseImage({
					count: 20,
					success: async (res) => {
						for (let i in res.tempFilePaths) {
							let image = await this.upload(res.tempFilePaths[i]);
							if (type == 'mainPic') {
								this.shop.imgurl.push(image)
							} else {
								this.editorCtx.insertImage({
									src: image,
									alt: this.shop.title ? this.shop.title : 'IMAGE'
								});
							}
						}
						if (type == 'mainPic') return;
						this.editorCtx.insertText({
							text: '\n'
						});
					}
				});
			},
			upload(image) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath: image,
						name: 'file',
					}).then(res => {

						if (res.data.code == 200) {
							resolve(res.data.data.url)
						} else {
							uni.$u.toast(res.data.msg)
						}
					}).catch(err => {
						uni.$u.toast('上传错误')
					})
				})
			},
			deleteImage(index) {
				this.shop.imgurl.splice(index, 1); // 删除对应索引的图片
			},
			previewImg(index) {
				uni.previewImage({
					urls: this.shop.imgurl,
					current: index
				})
			}

		}
	}
</script>

<style>
	.hover {
		opacity: 0.8;
	}
</style>