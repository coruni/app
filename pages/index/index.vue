<template>
	<z-paging-swiper>
		<home v-show="tabbarIndex == 0" @avatarTap="avatarTap()" @edit="showMoreMenu = true;data=$event" ref="home">
		</home>
		<category v-show="tabbarIndex == 1" :index="1" :current="tabbarIndex"></category>
		<message v-show="tabbarIndex == 3" :index="3" :current="tabbarIndex"></message>
		<user v-show="tabbarIndex == 4" :index="4" :current="tabbarIndex" style="height: 100%;margin-bottom: 190rpx;">
		</user>

		<!-- 底部导航栏 -->
		<!-- 底部占位高度 100rpx -->
		<template #bottom>
			<u-row class="bottom bottom-tabbar" justify="space-around">
				<view class="content" :class="{'btn-active':tabbarIndex==0}" @tap.stop="tabbarIndex=0">
					<i class="mgc_home_5_line"></i>
					<text>首页</text>
				</view>
				<view class="content" :class="{'btn-active':tabbarIndex==1}" @tap.stop="tabbarIndex=1">
					<i class="mgc_planet_line"></i>
					<text>星球</text>
				</view>
				<view class="content content-add" @click="showPublish = true">
					<i class="mgc_add_line"></i>
				</view>
				<view style="position: relative;">
					<view class="content" :class="{'btn-active':tabbarIndex==3}" @tap.stop="tabbarIndex = 3">
						<i class="mgc_message_2_line"></i>
						<text>消息</text>
					</view>
					<i class="mgc_round_fill noticeNum" v-if="$store.state.noticeNum.total"></i>
				</view>

				<view @tap.stop="tabbarIndex=4">
					<u-avatar :src="$store.state.userInfo.avatar || null" size="30"></u-avatar>
				</view>
			</u-row>
		</template>
		<!-- 组件开始 -->
		<u-popup :show="showPublish" @close="showPublish = false" customStyle="border-radius:20rpx 20rpx 0 0">
			<view style="padding: 30rpx;">
				<view style="text-align: center;">
					<text>{{$store.state.hasLogin?'有什么好玩的事~？':'请登录后再发表'}}</text>
				</view>
				<view class="publish-content">
					<view class="publish-content-article" @click="goPublish('articlePublish')">
						<text>帖子</text>
					</view>
					<view class="publish-content-photo" @click="goPublish('photo')">
						<text>图册</text>
					</view>
					<view class="publish-content-video" @click="goPublish('video')">
						<text>视频</text>
					</view>
				</view>
				<view style="display: flex;flex-direction: column;">
					<text style="font-size: 34rpx;">创作灵感</text>
					<text style="padding-left: 30rpx;font-size: 26rpx;">大家都想看的</text>
				</view>

				<block v-for="(item,index) in tags" :key="index">
					<view class="tag-content">
						<text>No{{index+1}} {{item.name}}</text>
					</view>
				</block>
			</view>
		</u-popup>

		<!-- 菜单弹出 -->
		<u-popup :show="showMoreMenu" @close="showMoreMenu = false" :closeable="true" round="10">
			<view style="padding: 30rpx;">
				<view style="
				text-align: center;
				color: #999;">
					<text>分享至</text>
				</view>
				<view style="margin-top: 50rpx;">
					<u-row customStyle="border-bottom:1rpx solid #aa96da0a;padding-bottom:30rpx" justify="space-around">
						<block v-for="(item,index) in share" :key="index">
							<u-row align="center" customStyle="flex-direction:column" @click="shareArticle('api',item)">
								<view style="padding: 20rpx;border-radius: 100rpx;" :style="{background:item.color}">
									<u-icon :name="item.icon" color="white" size="24"></u-icon>
								</view>
								<text style="margin-top: 20rpx;">{{item.name}}</text>
							</u-row>
						</block>
					</u-row>
					<view style="display: flex;flex-direction: column;margin-top: 50rpx;">
						<u-row style="margin:20rpx 0">
							<i class="ess mgc_alert_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">举报</text>
						</u-row>
						<u-row style="margin:20rpx 0" @click="shareArticle('link')">
							<i class="ess mgc_flash_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">复制链接</text>
						</u-row>
						<!-- #ifdef APP -->
						<u-row style="margin:20rpx 0" @click="shareArticle('system')">
							<i class="ess mgc_share_forward_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">通过系统分享</text>
						</u-row>
						<!-- #endif -->
						<u-row style="margin:20rpx 0" @click="goEdit()" v-if="permission">
							<i class="ess mgc_edit_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">编辑</text>
						</u-row>
						<u-row style="margin:20rpx 0;color:red" @click="showDelete = true" v-if="permission">
							<i class="ess mgc_delete_2_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">删除</text>
						</u-row>
					</view>
				</view>
			</view>
			<!-- 删除弹出 -->
			<u-popup :show="showDelete" :round="10" mode="center" @close="showDelete = false"
				customStyle="width:500rpx">
				<view style="display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 50rpx;">
					<text style="font-size: 34rpx;">提示</text>
					<view style="margin-top:30rpx">
						<text>是否确定删除？</text>
					</view>
					<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
						<u-button plain color="#aa96da" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
							@click="showDelete = false">取消</u-button>
						<u-button color="#aa96da" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
							@click="deleteArticle()">确定</u-button>
					</u-row>
				</view>
			</u-popup>
		</u-popup>
	</z-paging-swiper>
</template>

<script>
	import {
		shareTap,
		shareWithSystem,
		filterHtml
	} from '@/common/common.js';
	import home from './components/home.vue';
	import discovery from './components/discovery.vue';
	import message from './components/message.vue'
	import user from './components/user.vue';
	import category from './components/category.vue';
	export default {
		components: {
			home,
			user,
			discovery,
			category,
			message
		},
		data() {
			return {
				data: null,
				content: [],
				topTabbar: [{
					name: '首页',
				}],
				page: 1,
				data: null,
				showMoreMenu: false,
				topTabIndex: 0,
				tabbarIndex: 0,
				showPublish: false,
				tags: [],
				publish: [{
						name: '帖子',
						type: 'article',
						icon: 'mgc_quill_pen_line',
						path: 'articlePublish'
					},
					{
						name: '图片',
						type: 'picture',
						icon: 'mgc_pic_line',
						path: 'photo'
					},
					{
						name: '视频',
						type: 'video',
						icon: 'mgc_play_circle_line',
						path: 'video'
					},
				],
				share: [{
						name: '微信',
						icon: 'weixin-fill',
						provider: 'weixin',
						type: 0,
						scene: 'WXSceneSession',
						color: '#46d262'
					},
					{
						name: '朋友圈',
						icon: 'moments',
						provider: 'weixin',
						type: 0,
						scene: 'WXSceneTimeline',
						color: '#46d262'
					},
					{
						name: 'QQ',
						icon: 'qq-fill',
						provider: 'qq',
						type: 2,
						scene: '',
						color: '#0070ff'
					},

				],
				tabbar: [{
						name: '首页',
						active: true,
						type: 'home',
						count: 0,
						icon: 'mgc_home_3_line',
						cur: 'mgc_home_3_fill'
					},
					{
						name: '动态',
						active: false,
						type: 'find',
						count: 0,
						icon: 'mgc_send_line',
						cur: 'mgc_send_fill'
					},
					{
						type: 'midbutton',
						icon: 'mgc_add_line'
					},
					{
						name: '板块',
						active: false,
						type: 'shop',
						count: 0,
						icon: 'mgc_three_circles_line',
						cur: 'mgc_three_circles_fill'
					},
				],
				showDelete: false,
			}
		},
		onLoad() {
			uni.setNavStyle()
			this.getTags()
			// 用户切换主题，动态修改状态栏颜色
			uni.onThemeChange(() => {
				uni.setNavStyle()
			})
		},
		computed: {
			permission() {
				if (!this.$store.state.hasLogin) return false;
				let userInfo = this.$store.state.userInfo
				if (this.data && this.data.authorId == userInfo.uid || userInfo.group == 'administrator' || userInfo
					.group == 'editor')
					return true;
				return false;
			}
		},
		methods: {
			animationfinish(data) {
				this.topTabIndex = data.detail.current
			},
			changeTab(data) {
				this.topTabIndex = data.index
			},
			tabbarTap(index) {
				if (index === 2) {
					this.showPublish = true
					return; // 当点击中间按钮时，直接返回，不执行后续逻辑
				}
				this.tabbar.forEach((item, i) => {
					item.active = i === index;
					this.tabbarIndex = index

				});
				// this.tabbarIndex = index
			},
			avatarTap() {
				this.tabbar.forEach((item, i) => {
					item.active = i === 4;
					this.tabbarIndex = 4
				});
				this.tabbarIndex = 4
			},
			getTags() {
				this.$http.get('/category/list', {
					params: {
						limit: 3,
						params: {
							type: 'tag'
						}
					}
				}).then(res => {
					this.tags = res.data.data.data
				})
			},
			goPublish(path) {
				if (!path) return;
				this.$Router.push({
					name: path
				})
				this.$Router.$lockStatus = false
				this.showPublish = false;
			},
			shareArticle(scene, data) {
				let article = this.data
				let type
				switch (article.type) {
					case 'post':
						type = 'article'
						break;
					case 'video':
						type = 'video'
						break;
					case 'photo':
						type = 'photo'
						break;
					default:
						type = 'article'
						break;
				}
				switch (scene) {
					case 'system':
						shareWithSystem(article.title,
							`${this.$config.h5}/#/pages/article/${type}?id=${article.cid}`)
						break;
					case 'api':
						shareTap(data.provider, data.type, data.scene, article.title, filterHtml(article.text),
							`${this.$config.h5}/#/pages/article/${type}?id=${article.cid}`,
							article.images[0])
						break;
					case 'link':
						uni.setClipboardData({
							data: `${this.$config.h5}/#/pages/article/${type}?id=${article.cid}`,
							success: () => {
								uni.$u.toast('复制成功')
							}
						})
						break;
					default:
						break;
				}
				this.showMoreMenu = false;
			},
			goEdit() {
				this.showMoreMenu = false
				let path
				let type = this.data.type;
				if (type == 'post') path = '/publish/article/article';
				if (type == 'photo') path = '/publish/article/photo';
				if (type == 'video') path = '/publish/article/video';
				setTimeout(() => {
					this.$Router.push({
						path: path,
						query: {
							update: true,
							id: this.data.cid
						}
					})
				}, 200)
			},
			deleteArticle() {
				this.$http.post('/article/delete', {
					id: this.data.cid
				}).then(res => {
					if (res.data.code == 200) {
						this.showDelete = false
						this.showMoreMenu = false
						uni.$u.toast(res.data.msg)
						this.$refs.home.reload()
					}
				})
			},
		}
	}
</script>
<style lang="scss">
	@media(prefers-color-scheme:dark) {
		.tag-content {
			background-color: #525252 !important;
		}

		.content-add {

			background: #525252 !important;
		}
	}

	.content {
		display: flex;
		flex-direction: column;
		font-size: 46rpx;
		color: #8a8a8a;
		transition: 0.5s ease-in-out all;

		&-add {
			font-size: 60rpx;
			background-color: $c-primary;
			border-radius: 10rpx;
			padding: 8rpx 25rpx;

			&>i {
				transition: 0.5s ease all;
				transform-origin: 50% 50%;
				color: white;

				/* 设置旋转中心点为元素中心 */
				&:hover {
					transform: rotate(45deg);
					/* 合并两个变换 */
				}
			}
		}

		&>text {
			font-size: 24rpx;
		}

		&:hover {
			color: $c-primary;
		}
	}

	.swiper {
		height: 100%;
	}

	.btn-active {
		color: $c-primary;
		/* 设置颜色 */
	}

	.bottom {
		width: 100%;
		height: 100rpx;
		z-index: 999;

		&-tabbar {
			border-top: #f7f7f7 2rpx solid;
		}
	}

	.tabbar-avatar {
		display: flex;
		flex-direction: column;
		justify-content: center;
		justify-content: center;
		font-size: 28rpx;
	}


	.avatar {
		transition: all 0.2s ease;
		border: 4rpx solid #85a3ff32;

		&_active {
			border: 4rpx solid #aa96daa0 !important;
		}
	}

	.tabbar {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
		transition: all 0.5s ease;

		&:hover {
			color: $c-primary;
		}

		&-add {
			font-size: 45rpx;
			transform: translateY(-20rpx);

			&:hover {
				transform: rotate(90deg);
			}
		}
	}

	.publish-content {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		margin: 20rpx 0;

		&-article {
			clip-path: polygon(0 0, 100% 0, 90% 100%, 0% 100%);
			display: flex;
			justify-content: center;
			color: white;
			align-items: center;
			width: 100%;

			background-image: url();
			height: 100rpx;
			background-color: #ffaaa5;
			border-radius: 10rpx;
			box-shadow: 0 0 8rpx 0 #ffaaa5;
		}

		&-photo {
			display: flex;
			justify-content: center;
			color: white;
			align-items: center;
			width: 100%;
			clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);
			height: 100rpx;
			background-color: #ffd3b6;
			box-shadow: 0 0 8rpx 0 #ffd3b6;
		}

		&-video {
			display: flex;
			justify-content: center;
			color: white;
			clip-path: polygon(10% 0, 100% 0%, 100% 100%, 0% 100%);
			align-items: center;
			width: 100%;
			height: 100rpx;
			background-color: #dcedc1;
			border-radius: 10rpx;
			box-shadow: 0 0 8rpx 0 #dcedc1;
		}
	}

	.tag-content {
		margin-top: 30rpx;
		background-color: #f7f7f7;
		padding: 30rpx;
		border-radius: 20rpx;
		font-size: 30rpx;
	}

	.noticeNum {
		position: absolute;
		top: 0;
		right: 0;
		color: red;
		font-size: 24rpx;
	}
</style>