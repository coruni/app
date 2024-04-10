<template>
	<view>
		<z-paging ref="paging" @query="getComments" v-model="comments" :auto-scroll-to-top-when-reload="false"
			:auto-clean-list-when-reload="false" cache-mode="always" use-cache
			:cache-key="`article_mid_sub-${data.id}`">
			<template #top>
				<u-navbar autoBack placeholder style="z-index: 10;" bgColor="transparent">
					<view slot="left">
						<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
					</view>
				</u-navbar>
			</template>

			<u-row align="top" customStyle="margin:30rpx;">
				<view style="position: relative;">
					<u-avatar :src="data.userInfo.avatar" size="30" customStyle="border:4rpx solid #85a3ff32"
						@click="goProfile(data.userInfo.uid)"></u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="data.userInfo&&data.userInfo.opt&&data.userInfo.opt.head_picture">
					</image>
				</view>
				<view style="
				display: flex;
				flex:1; 
				flex-direction: column;
				margin-left: 20rpx;
				padding-bottom: 30rpx;">
					<u-row>
						<u-row>
							<text
								:style="{color:data.userInfo.isVip?'#aa96da':'',fontSize:30+'rpx',fontWeight:600}">{{data.userInfo.screenName?data.userInfo.screenName:data.userInfo.name}}</text>
							<i v-if="data.userInfo.level" :class="`level mgc_lv-${data.userInfo.level}`"
								style="font-size: 50rpx; margin-left: 10rpx;"
								:style="{ color: data.userInfo.level > 8 ? $level[Math.floor(data.userInfo.level/2)-1] : $level[data.userInfo.level-1] }">
							</i>
						</u-row>

						<text style="
							font-size: 18rpx;
							border:#98e6a8 solid 2rpx;
							color: #98e6a8;
							padding: 0 16rpx;
							border-radius: 50rpx;
							margin-left:20rpx" v-if="data.userInfo.uid == data.article.authorId">作者</text>
					</u-row>
					<view style="margin-top:10rpx;word-break: break-word;">
						<uv-parse selectable :previewImg="false" selectable :showImgMenu="false"
							:content="formatEmoji(data.text)"></uv-parse>
					</view>
					<u-swiper :list="data.images" v-if="data.images && data.images.length" :autoplay="false" indicator
						height="150" indicator-style="left" radius="10"
						@click="previewImg(data.images,$event)"></u-swiper>
					<u-gap height="6"></u-gap>
					<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
						<text>{{$u.timeFrom(data.created,'mm-dd')}}</text>
						<u-row customStyle="flex-basis:30%" justify="space-between">
							<u-row
								@click="commentCheck(false,data.id,data.userInfo.screenName?data.userInfo.screenName:data.userInfo.name)">
								<i class="ess mgc_chat_4_line" style="font-size: 40rpx;"></i>
								<text style="font-size: 28rpx;margin-left: 10rpx;">回复</text>
							</u-row>
							<u-row>
								<i class="ess mgc_thumb_up_2_line" style="font-size: 40rpx;"></i>
								<text style="font-size: 28rpx;margin-left: 10rpx;"></text>
							</u-row>
						</u-row>
					</u-row>
				</view>
			</u-row>
			<u-gap height="6" class="article-gap" bgColor="#f7f7f7"></u-gap>

			<!-- #ifdef APP -->
			<u-sticky bgColor="#fff">
				<view style="position: relative;top: 0;padding: 30rpx 30rpx 0 30rpx;" @touchmove.stop.prevent>
					<u-row>
						<view @click="showOrderList = !showOrderList" style="display: flex; align-items: center;">
							<text style="margin-right: 10rpx;font-size:30rpx;font-Weight: bold;">{{orderName}}</text>
							<i class="ess" style="font-size: 50rpx;"
								:class="showOrderList?'mgc_up_small_fill':'mgc_down_small_fill'"></i>
						</view>
					</u-row>
					<u-transition :show="showOrderList"
						style="position: absolute; top: -10rpx; left: 0; width: 100%;z-index: 1001;">
						<view>
							<!-- 半透明遮罩 -->
							<view @click.stop="showOrderList = false"
								style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5);">
							</view>
							<view
								style="font-size: 30rpx;color:#aa96da;display: flex;flex-direction: column;position: absolute; top: 100rpx; left: 30rpx; background-color: #fff; padding: 10rpx; border-radius: 20rpx; box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);">
								<block v-for="(item,index) in orderList" :key="index">
									<text @click.stop="orderTap(item.name);$refs.paging.reload()"
										style="padding: 15rpx;">{{item.name}}</text>
								</block>
							</view>
						</view>
					</u-transition>
				</view>
			</u-sticky>
			<!-- #endif -->
			<!-- #ifndef APP -->
			<u-sticky bgColor="#fff" offsetTop="-44">
				<view style="position: relative;top: 0;padding: 30rpx 30rpx 0 30rpx;" @touchmove.stop>
					<u-row>
						<view @click="showOrderList = !showOrderList" style="display: flex; align-items: center;">
							<text
								style="margin-right: 10rpx;font-size:30rpx;color: #666;font-Weight: bold;">{{orderName}}</text>
							<i class="ess" style="font-size: 50rpx;"
								:class="showOrderList?'mgc_up_small_fill':'mgc_down_small_fill'"></i>
						</view>
					</u-row>
					<u-transition :show="showOrderList"
						style="position: absolute; top: -10rpx; left: 0; width: 100%;z-index: 1001;">
						<view>
							<!-- 半透明遮罩 -->
							<view @click.stop="showOrderList = false"
								style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.5);">
							</view>
							<view
								style="font-size: 30rpx;color:#aa96da;display: flex;flex-direction: column;position: absolute; top: 100rpx; left: 30rpx; background-color: #fff; padding: 10rpx; border-radius: 20rpx; box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);">
								<block v-for="(item,index) in orderList" :key="index">
									<text @click.stop="orderTap(item.name);$refs.paging.reload()"
										style="padding: 15rpx;">{{item.name}}</text>
								</block>
							</view>
						</view>
					</u-transition>
				</view>

			</u-sticky>
			<!-- #endif -->
			<!-- 子评论开始 -->
			<view>
				<block v-for="(item,index) in comments" :key="index">
					<view style="padding:30rpx">
						<u-skeleton rows="2" avatar :loading="loading">
							<u-row align="top">
								<u-avatar :src="item.userInfo.avatar" size="24"
									customStyle="border:4rpx solid #85a3ff32"
									@click="goProfile(item.userInfo.uid)"></u-avatar>

								<view style="
								display: flex;
								flex:1; 
								flex-direction: column;
								margin-left: 20rpx;">
									<u-row>
										<u-row>
											<text
												:style="{color:item.isVip?'#aa96da':'',fontSize:30+'rpx',fontWeight:600}">{{item.userInfo.screenName?item.userInfo.screenName:item.userInfo.name}}</text>
											<text
												:style="{border:`${item.userInfo.level > 8 ? $level[Math.floor(item.userInfo.level/2)-1] : $level[item.userInfo.level-1]} solid 2rpx`,background:item.userInfo.level > 8 ? $level[Math.floor(item.userInfo.level/2)-1] : $level[item.userInfo.level-1] }"
												style="font-size: 18rpx;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx;color: white;"
												v-if="item.userInfo.level">
												Lv.{{item.userInfo.level}}
											</text>
										</u-row>

										<text
											style="font-size: 18rpx;border:#98e6a8 solid 2rpx;color: #98e6a8;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx"
											v-if="item.userInfo.uid == data.article.authorId">作者</text>
									</u-row>
									<view style="margin-top:10rpx;word-break: break-word;"
										@click="commentCheck(true,item.id,item.userInfo.screenName?item.userInfo.screenName:item.userInfo.name)">

										<uv-parse :previewImg="false" selectable :showImgMenu="false"
											:content="formatEmoji(item.text)"></uv-parse>
									</view>
									<view
										v-if="item.parent != data.id&&item.userInfo.uid!=item.parentComment.userInfo.uid"
										class="u-line-1" style="
										padding-left:20rpx;
										border-left: 6rpx #aa96da1e solid;
										margin-top: 20rpx;
										font-size: 28rpx;
										color: #999;
										display: flex !important;">
										<text
											style="color:#a899e6;flex-shrink: 0;padding-right: 10rpx;">@{{item.parentComment.userInfo.screenName?item.parentComment.userInfo.screenName:item.parentComment.userInfo.name}}</text>
										<uv-parse :previewImg="false" selectable :showImgMenu="false"
											:content="item.parentComment.text" class="u-line-1"></uv-parse>
									</view>
									<u-swiper :list="item.images" v-if="item.images && item.images.length"
										:autoplay="false" indicator height="150" indicator-style="left" radius="10"
										@click="previewImg(item.images,$event)"></u-swiper>
									<u-gap height="6"></u-gap>
									<view>
										<u-row justify="space-between" customStyle="font-size: 24rpx;color: #aaa;">
											<text>{{$u.timeFrom(item.created,'mm-dd')}}</text>
											<u-row style="flex-wrap: nowrap;" justify="space-between">
												<u-row style="margin-right: 30rpx;" align="top"
													v-if="$store.state.userInfo.uid == item.userInfo.uid"
													@click="showDelete = true;deleteId = item.id">
													<i class="mgc_delete_2_line"
														style="font-size: 36rpx;color: #aa96da;"></i>
													<text style="font-size: 28rpx;margin-left: 10rpx;">删除</text>
												</u-row>
												<u-row style="margin-right: 30rpx;"
													@click="commentCheck(true,item.id,item.userInfo.screenName?item.userInfo.screenName:item.userInfo.name)">
													<i class="ess mgc_chat_4_line" style="font-size: 40rpx;"></i>
													<text style="font-size: 28rpx;margin-left: 10rpx;">回复</text>
												</u-row>
												<u-row @click="like(index)" :style="{color:item.isLike?'#ffa385':''}">
													<i class="ess mgc_thumb_up_2_line" style="font-size: 40rpx;"></i>
													<text
														style="font-size: 28rpx;margin-left: 10rpx;">{{item && item.likes?item.likes:''}}</text>
												</u-row>

											</u-row>
										</u-row>
									</view>
								</view>
							</u-row>
						</u-skeleton>
					</view>
				</block>
			</view>
			<template #bottom>
				<view style="margin: 30rpx;">
					<u-row class="u-info comment-box"
						@click="commentCheck(false,data.id,data.userInfo.screenName?data.userInfo.screenName:data.userInfo.name);">
						<u-icon name="edit-pen" size="20"></u-icon>
						<text
							style="margin-left:10rpx;font-size: 28rpx;">回复{{data.userInfo.screenName?data.userInfo.screenName:data.userInfo.name}}</text>
					</u-row>
				</view>

			</template>

		</z-paging>
		<!-- 回复评论弹窗 -->
		<u-popup :show="showComment" @close="showComment = false" round="10"
			:customStyle="{transform: `translateY(${-keyboardHeight+'px'})`,transition:'transform 0.3s ease',padding:30+'rpx'}">
			<editor id="editor" :adjust-position="false" :show-img-size="false" :show-img-resize="false"
				:show-img-toolbar="false" @ready="onEditorReady" :placeholder="`回复${replyWho}`"
				style="background: #f9f9f9;height: auto;min-height: 60px;max-height: 100px;border-radius: 20rpx;padding: 8rpx 16rpx;">
			</editor>
			<u-row customStyle="margin-top:20rpx" justify="space-between">
				<u-col span="4">
					<u-row justify="space-between">
						<block v-for="(item,index) in cBtn" :key="index">
							<i class="ess" :class="item.icon" style="font-size: 44rpx;" @click="cBtnTap(item.name)"></i>
						</block>
					</u-row>
				</u-col>
				<view>
					<u-button shape="circle" color="#aa96da" customStyle="padding:4rpx,6rpx;height:50rpx;"
						@click="$u.throttle(reply(),2000,true) ">
						<i class="ess mgc_send_line" style="font-size: 40rpx;"></i>
						<text>发送</text>
					</u-button>
				</view>
			</u-row>
			<uv-scroll-list :indicator="false" v-if="images.length" style="margin-top: 20rpx;">
				<view v-for="(item, index) in images" :key="index"
					style="position: relative; display: inline-block;height: 100rpx;width: 100rpx;margin-right: 10orx;">
					<image :src="item" mode="aspectFill" style="height: 100rpx; width: 100rpx; border-radius: 20rpx;"
						@click="preview(images,index)">
					</image>
					<u-icon name="close-circle" style="position: absolute; top: 0; right: 0;"
						@click="images.splice(index, 1)">
					</u-icon>
				</view>
			</uv-scroll-list>
			<!-- 隐藏面板 -->
			<block v-if="showComemntBtn == '表情'">
				<!-- 这里加表情 -->
				<block v-for="(one,oneIndex) in emojiData" :key="oneIndex">
					<swiper style="height: 120px;" v-show="emojiIndex == oneIndex">
						<swiper-item v-for="(two,twoIndex) in one.list" :key="twoIndex">
							<u-row justify="space-between" customStyle="flex-wrap:wrap">
								<image :src="one.base+one.slug+'_'+three+'.'+one.format" v-for="(three,key) in two"
									:key="key" mode="aspectFill" style="width: 100rpx;height: 100rpx;margin: 10rpx;"
									@click="insertEmoji(one.base,one.name,one.slug,three,one.format,key)"></image>
							</u-row>
						</swiper-item>
					</swiper>
				</block>
				<u-tabs :list="emojiData" :current="emojiIndex" lineHeight="3" lineColor="#aa96da"
					itemStyle="height: 24px;"
					:activeStyle="{color: '#303133',fontWeight: 'bold',transform: 'scale(1.05)'}"
					:inactiveStyle="{color: '#606266',transform: 'scale(1)'}" @change="emojiIndex = $event.index"
					style="position: static;"></u-tabs>
			</block>
			<block v-if="showComemntBtn=='颜色'">
				<u-row justify="space-between" style="margin-top: 30rpx;">
					<u-col :span="6">
						<u-row justify="space-between">
							<block v-for="(color,index) in colors" :key="index">
								<text :style="{background:color}" style="padding: 15rpx;border-radius: 50rpx;"
									@tap.stop="colorTap(color)"></text>
							</block>
						</u-row>
					</u-col>
					<i class="ess mgc_eraser_line" style="font-size: 40rpx;" @tap.stop="editorCtx.removeFormat()"></i>
				</u-row>
			</block>
		</u-popup>
		<uv-modal ref="upload" :zIndex="10076" @close="uploadErr.status = false;uploadErr.msg=null;"
			:closeOnClickOverlay="uploadErr.status" :showConfirmButton="false"
			:title="uploadErr.status?'上传错误':'上传中...'">
			<u-line-progress :percentage="percentage" activeColor="#aa96da" :showText="false"
				v-if="!uploadErr.status"></u-line-progress>
			<text v-if="uploadErr.status">错误信息：{{uploadErr.msg}}</text>
			<view slot="confirmButton"></view>
		</uv-modal>
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
		data() {
			return {
				isReply: false,
				data: null,
				percentage: 30,
				comments: [],
				images: [],
				pid: 0,
				uploadErr: {
					status: false,
					msg: ''
				},
				keyboardHeight: 0,
				showComment: false,
				showComemntBtn: null,
				commentText: '',
				emojiData: [],
				emojiIndex: 0,
				cBtn: [{
						name: '表情',
						icon: 'mgc_emoji_line',
					}, {
						name: '图片',
						icon: 'mgc_pic_line',
					},
					{
						name: '颜色',
						icon: 'mgc_palette_line'
					}
				],
				colors: ['#aa96da', '#5BD784', '#FFA600', '#0DD0F2', '#FB4F14', '#000000E6'],
				orderList: [{
						name: '全部评论',
						order: ''
					}, {
						name: '点赞最多',
						order: 'likes'
					},
					{
						name: '最新',
						order: 'created desc'
					},
					{
						name: '最早',
						order: 'created asc'
					},
					{
						name: '只看楼主',
						order: 'author'
					}
				],
				orderName: '最新',
				showOrderList: false,
				replyWho: '',
				loading: true,
				showDelete: false,
				deleteId: 0,
			}
		},
		beforeRouteLeave(to, from, next) {
			if (this.showComment) {
				this.showComment = false;
				next(false)
				this.$Router.$lockStatus = false
			} else {
				next();
			}

		},
		created() {

			this.formatEmojiData()
		},
		onLoad(params) {
			this.data = uni.getStorageSync('subComment_' + params.id)
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
		},
		onUnload() {
			// 取消键盘监听
			uni.offKeyboardHeightChange(data => {})

		},
		methods: {
			getComments(page, limit) {
				let order = this.orderList.find(order => order.name == this.orderName)
				let params = {
					page,
					limit,
					id: this.data.cid,
					all: this.data.id,
					order: order.order
				}

				if (order.name == '只看楼主') {
					params.order = null
				}
				this.$http.get('/comments/list', {
					params
				}).then(res => {

					if (res.data.code) {
						this.$refs.paging.complete(res.data.data.data)
					}
					setTimeout(() => {
						this.loading = false
					}, 1000)
				})
			},
			orderTap(item) {
				this.orderName = item
				this.showOrderList = false
			},
			commentCheck(status, pid, reply) {
				this.pid = pid
				this.replyWho = reply
				if (!status) this.pid = pid;
				this.showComment = true
			},
			reply() {
				if (this.isReply) return;
				this.editorCtx.getContents({
					success: (res) => {
						this.commentText = res.html.replace(/<img\s+[^>]*alt="([^"]+)_emoji"[^>]*>/g,
							function(match, alt) {
								return `[${alt}]`;
							});
						if (res.text.length < 2) {
							uni.$u.toast('再多说点吧~')
							return;
						};
						console.log(this.data.article)
						let params = {
							id: this.data.article.cid,
							parent: this.pid,
							all: this.data.id,
							text: this.commentText,
							images: JSON.stringify(this.images)
						}
						this.isReply = true
						this.$http.post('/comments/add', {
							...params
						}).then(res => {
							if (res.data.code) {
								uni.$u.toast('已发送~')
								this.commentText = ''
								this.showComment = false
								this.$refs.paging.reload()
								this.$emit('subReply', true)
							} else {
								uni.$u.toast(res.data.msg)
							}
							this.isReply = false
						}).catch(err => {
							this.isReply = false
						})
					}

				})
			},

			goProfile(id) {
				console.log('点击了')
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			},
			like(index) {
				this.$http.post('/comments/like', {
					id: this.comments[index].id
				}).then(res => {

					if (res.data.code == 200) {
						uni.$u.toast(res.data.msg)
						this.comments[index].isLike = !this.comments[index].isLike
						this.comments[index].likes += this.comments[index].isLike ? 1 : -1;
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
			formatEmojiData() {
				// 处理后的数据
				let result = [];

				// 每页表情对象的数量
				const pageSize = 10;

				// 遍历原始数据中的每个 item
				this.$emoji.data.forEach(item => {
					// 构建一个新的 item 对象
					let newItem = {
						"name": item.name,
						"slug": item.slug,
						"base": item.base,
						"format": item.format,
						"list": []
					};
					// 遍历原始数据中的每个子列表
					let page = 1;
					let pageList = {}; // 用于存储每一页的表情对象
					Object.entries(item.list).forEach(([key, value]) => {
						// 将表情对象添加到当前页的列表中
						pageList[key] = value;

						// 如果达到一页的数量，将当前页列表添加到 newItem 的 list 中，重置页码和列表
						if (Object.keys(pageList).length === pageSize) {
							newItem.list.push(pageList);
							page++;
							pageList = {};
						}
					});

					// 添加最后一页的表情对象，如果不为空的话
					if (Object.keys(pageList).length > 0) {
						newItem.list.push(pageList);
					}

					// 将新的 item 添加到结果数组中
					result.push(newItem);
				});

				this.emojiData = result;
			},
			cBtnTap(name) {
				let perimission = false
				let userInfo = this.$store.state.userInfo
				if (userInfo.group == 'administrator' || userInfo.group == 'editor' || userInfo.isVip) {
					perimission = true
				}

				if (name == '图片') {
					this.chooseImage()
					return;
				}
				if (name == '颜色' && !perimission) {
					uni.$u.toast('颜色评论仅会员可用');
					return
				}
				if (name == this.showComemntBtn) this.showComemntBtn = null;
				else this.showComemntBtn = name
				console.log(name)
			},
			async chooseImage() {
				if (this.images.length >= 6) {
					uni.$u.toast('至多可添加6张图片')
					return;
				}
				try {
					const res = await uni.chooseImage({
						count: 6
					});

					const imageList = res.tempFilePaths;
					this.$refs.upload.open()

					const uploadPromises = imageList.map(async (item) => {
						try {
							const uploadedImage = await this.upload(item);
							this.images.push(uploadedImage);
						} catch (error) {
							this.uploadErr.status = true
							this.uploadErr.msg = error.data.msg
							console.error("Upload failed:", error);
						}
					});

					await Promise.all(uploadPromises);

					this.$refs.upload.close()

				} catch (error) {
					this.$refs.upload.close()
					console.error("Choose image failed:", error);
				}
			},
			async upload(filePath) {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath,
						name: 'file'
					}).then(res => {
						if (res.data.code) {
							resolve(res.data.data.url)
						} else {
							reject(res)
						}
					})
				});
			},
			previewImg(urls, index) {
				uni.previewImage({
					urls: urls,
					current: index
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
			insertEmoji(base, name, slug, emoji, format, key) {
				this.editorCtx.insertImage({
					src: base + slug + '_' + emoji + '.' + format,
					alt: name + '_' + key + '_' + 'emoji',
					width: '30px',
					height: '30px',
					data: {
						name: name,
						emoji: emoji,
						format: format
					},
					success: res => {

					}
				})
			},
			preview(urls, current) {
				uni.previewImage({
					urls,
					current
				})
			},
			colorTap(color) {
				this.editorCtx.format('color', color)
			},
			deleteComment(id) {
				this.showDelete = false;
				this.$http.post('/comments/delete', {
					id: this.deleteId
				}).then(res => {
					if (res.data.code == 200) {
						// 通知父组件刷新数据
						this.$refs.paging.reload()
					}
				})
			}
		}
	}
</script>

<style>
	.ql-container ::v-deep .ql-blank::before {
		min-height: 60rpx;
		height: 60rpx;
		font-style: normal;
	}

	.comment-box {
		padding: 14rpx 14rpx;
		border-radius: 50rpx;
		flex: 1;
		background: #f9f9f9;
	}
</style>