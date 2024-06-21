<template>
	<z-paging-swiper>
		<template #top>
			<!-- 状态栏占位 -->
			<view :style="{height:systemInfo.statusBarHeight+'px',background:'black'}"></view>
			<!-- 视频主容器 -->
			<yingbing-video :autoplay="true" class="video-content" :style="{height:isPro}" :poster="video.poster"
				:src="video.src" ref="video" :controls="false" @loadedmetadata="loadedMetaData" @timeupdate="timeUpdate"
				@play="play.status = true" @pause="play.status = false" @fullscreenChange="fullscreen" @ended="ended"
				:fullscreenDirection="direction">
				<template #controls>
					<view class="player-container">
						<view class="player-btn" v-show="showBtn">
							<u-row style="padding: 10rpx 30rpx;" justify="space-between">
								<u-row>
									<i class="mgc_left_line" style="font-size: 60rpx;" @click="back()"></i>
									<i class="mgc_home_3_line" style="font-size: 45rpx;margin-left: 30rpx;"
										@click="goHome()"></i>
								</u-row>
								<i class="mgc_more_2_line" style="font-size: 60rpx;" @click="showMore = true"></i>
							</u-row>
						</view>
						<view class="player-control" v-show="showBtn">
							<view style="padding: 10rpx 30rpx;"
								:style="play.fullscreen?'padding-top:30rpx !important':''">
								<!-- 播放组件 -->
								<u-row>
									<i :class="play.status ? 'mgc_pause_fill' : 'mgc_play_fill'"
										style="font-size: 40rpx;margin-right: 30rpx;" @click="onPlay()"></i>
									<!-- 进度条 -->
									<view class="progress-bar" @click="handleProgressBarClick">
										<view class="played" :style="{ width: playedPercentage }"></view>
										<view class="unplayed" :style="{ width: unplayedPercentage }"></view>
										<i class="mgc_rabbit_fill progress-bar-icon" :style="{ left: dragPosition }"
											@touchstart="handleTouchStart" @touchmove.stop.prevent="handleTouchMove"
											@touchend="handleTouchEnd"></i>
									</view>
									<text
										style="font-size: 28rpx;margin: 0 30rpx;">{{formatDuration(play.currentTime)}}/{{ play.duration}}</text>
									<i :class="play.fullscreen?'mgc_fullscreen_exit_fill':'mgc_fullscreen_fill'"
										@click="switchFullscreen()" style="font-size: 40rpx;"></i>
								</u-row>
							</view>
						</view>
						<!-- 呼出控制组件时的遮罩 -->
						<view class="player-mask" @tap.stop="maskTouchend()" :class="{'active':!showBtn}"
							@touchstart="touchStart" @touchmove.stop.prevent="handleTouch" @touchend="touchEnd">
						</view>
					</view>
				</template>
			</yingbing-video>
			<u-row class="tabbar">
				<z-tabs :list="list" ref="tabs" :scrollCount="0" :current="swiperIndex" bar-height="6" bar-width="20"
					active-color="#88d8c0" inactive-color="#999" bgColor="transparent" @change="tabsChange"
					v-if="article"></z-tabs>
				<u-col :span="4.5">
					<uv-input disabled shape="circle" style="padding: 5rpx 10rpx;">
						<view slot="suffix" style="display: flex;align-items: center;padding: 0 10rpx;">
							<i class="mgc_comment_line" style="font-size: 40rpx;"></i>
						</view>
					</uv-input>
				</u-col>
			</u-row>
		</template>
		<swiper :current="swiperIndex" @transition="swiperTransition" @animationfinish="swiperAnimationfinish"
			class="swiper">
			<swiper-item>
				<z-paging @query="getArticleList" v-model="articleList" ref="article" :refresher-enabled="false">
					<view style="padding: 30rpx;">
						<u-row justify="space-between">
							<u-row>
								<u-avatar :src="article && article.authorInfo && article.authorInfo.avatar"
									size="30"></u-avatar>
								<view style="margin-left: 20rpx;display: flex;flex-direction: column;">
									<text style="font-size: 30rpx;"
										:class="{'vipname':article.authorInfo && article.authorInfo.isVip}">
										{{article && article.authorInfo && article.authorInfo.screenName?article.authorInfo.screenName:article && article.authorInfo &&article.authorInfo.name}}
									</text>
									<text style="font-size: 24rpx;"
										class="u-line-1 text">{{article && article.authorInfo &&  article.authorInfo.introduce}}</text>
								</view>
							</u-row>
							<view style="flex-shrink: 0;">
								<u-button :plain="article && article.authorInfo&& !article.authorInfo.isFollow"
									shape="circle" hover-class="button_hover"
									:color="article && article.authorInfo&& article.authorInfo.isFollow?'#88d8c00f':'#88d8c0'"
									style="width:160rpx;height:65rpx;"
									:style="{color:article && article.authorInfo&& article.authorInfo.isFollow?'black':'#88d8c0'}"
									:text="article && article.authorInfo&& article.authorInfo.isFollow?'已关注':'关注'"
									class="follow" @click="$emit('follow',article.authorId)"></u-button>
							</view>
						</u-row>
					</view>
					<view style="padding: 10rpx 30rpx;">
						<u-row justify="space-between" @click="showInfo =!showInfo">
							<text>{{article.title}}</text>
							<i class="mgc_right_line icon" :class="{'icon-active':showInfo}"></i>
						</u-row>
						<view class="info-panel" :class="{'active':showInfo}">
							<view class="chlid">
								<uv-parse :content="article.text" class="text" selectable></uv-parse>
								<view style="margin-top: 30rpx;display: flex;flex-wrap: wrap;" v-if="article.tag">
									<block v-for="(item,index) in article.tag" :key="index">
										<view>{{item.name}}</view>
									</block>
								</view>
							</view>
						</view>
					</view>
					<!-- 这里放分集 只有videos长度大于1时才会显示 -->
					<view style="padding: 0 30rpx;" v-if="article.videos && article.videos.length>1">
						<scroll-view style="width: 100%;overflow: hidden;" scroll-x>
							<u-row>
								<block v-for="(item,index) in article.videos" :key="index">
									<view class="epContent" @click="video = item">
										<text style="overflow: hidden;" class="u-line-1"
											:class="{'ep': video.src == item.src}">{{item.name}}</text>
									</view>
								</block>
							</u-row>
						</scroll-view>
					</view>
					<!-- 点赞控件之类 -->
					<u-row justify="space-around" style="font-size: 50rpx;padding: 30rpx; color: #999;">
						<view style="display: flex;flex-direction: column;align-items: center;">
							<i class="mgc_thumb_up_2_fill" :class="{'active':article.isLike}" @click="like()"></i>
							<text style="font-size: 28rpx;">{{article.likes}}</text>
						</view>
						<view style="display: flex;flex-direction: column;align-items: center;">
							<i class="mgc_star_fill" :class="{'active':article.isMark}" @click="mark()"></i>
							<text style="font-size: 28rpx;">{{article.marks}}</text>
						</view>
						<view style="display: flex;flex-direction: column;align-items: center;"
							@click="showReward = true">
							<i class="mgc_pig_money_fill"></i>
							<text style="font-size: 28rpx;">{{article.rewards}}</text>
						</view>
						<view style="display: flex;flex-direction: column;align-items: center;">
							<i class="mgc_share_forward_fill"></i>
							<text style="font-size: 28rpx;">{{article.marks}}</text>
						</view>
					</u-row>
					<view style="padding: 30rpx;border-top: #f7f7f7 1rpx solid;margin-top: 10rpx;"
						class="bottom-tabbar">
						<block v-for="(item,index) in articleList" :key="index">
							<u-row style="margin-bottom: 20rpx;height: 150rpx;" @click="goArticle(item)">
								<image :src="item.images[0]" mode="aspectFill"
									style="width: 260rpx;height: 150rpx;border-radius: 10rpx;flex-shrink: 0;background: #f7f7f7;">
								</image>
								<view
									style="display: flex;flex-direction: column;margin-left: 20rpx;height: 100%;justify-content: space-between;flex: 1;">
									<text class="u-line-1">{{item.title}}</text>
									<view style="display: flex;flex-direction: column;font-size: 28rpx;color: #999;">
										<u-row>
											<i class="mgc_quill_pen_line"></i>
											<text style="margin-left: 10rpx;">{{item.authorInfo.screenName}}</text>
										</u-row>
										<u-row>
											<u-row align="baseline">
												<i class="mgc_play_circle_line"></i>
												<text style="margin-left: 10rpx;">{{item.views}}</text>
											</u-row>
											<u-row align="baseline" style="margin-left: 40rpx;">
												<i class="mgc_chat_4_line"></i>
												<text style="margin-left: 10rpx;">{{item.commentsNum}}</text>
											</u-row>
										</u-row>
									</view>
								</view>
							</u-row>
						</block>
					</view>
				</z-paging>
			</swiper-item>
			<swiper-item>
				<z-paging @query="getComments" v-model="comments" ref="comments" empty-view-text="还没有人发表评论哦,快来评论一下吧~">
					<view v-if="comments.length" style="padding: 30rpx;">
						<block v-for="(item,index) in comments" :key="index">
							<comment :data="item" @reply="pid = $event.id;showComment =true" :article="article"
								style="padding: 10rpx 0;">
							</comment>
						</block>
					</view>
					<template #bottom>
						<view style="padding: 15rpx 30rpx;border-top: #f7f7f7 1rpx solid;" class="bottom-tabbar"
							@click="showComment = true">
							<u-row class="u-info comment-box" @click="showComment = true">
								<u-icon name="edit-pen" size="20"></u-icon>
								<text style="margin-left:10rpx;font-size: 28rpx;">我简单喵两句</text>
							</u-row>
						</view>
					</template>

				</z-paging>
			</swiper-item>
		</swiper>
		<u-popup :show="showComment" @close="showComment = false;pid = 0" round="10" :z-index="10074"
			:customStyle="{transform: `translateY(${-keyboardHeight+'px'})`,transition:'transform 0.2s ease',padding:30+'rpx'}">
			<view style="position: relative;">
				<editor id="editor" :adjust-position="false" :show-img-size="false" :show-img-resize="false"
					:show-img-toolbar="false" @ready="onEditorReady" placeholder="简单喵两句"
					:class="{'fullscreen':fullscreenEdit}">
				</editor>
				<i :class="fullscreenEdit?'mgc_fullscreen_exit_2_line':'mgc_fullscreen_2_line'"
					style="position: absolute;top: 10rpx;right: 10rpx;" @click="fullscreenEdit= !fullscreenEdit"></i>
			</view>
			<u-row customStyle="margin-top:20rpx" justify="space-between">
				<u-col span="4">
					<u-row justify="space-between">
						<block v-for="(item,index) in cBtn" :key="index">
							<i class="ess" :class="item.icon" style="font-size: 44rpx;" @click="cBtnTap(item.name)"></i>
						</block>
					</u-row>
				</u-col>
				<view>
					<u-button shape="circle" color="#88d8c0" customStyle="padding:4rpx,6rpx;height:50rpx;"
						@click="$u.throttle(reply(),2000,true) ">
						<i class="ess mgc_send_line" style="font-size: 40rpx;"></i>
						<text>发送</text>
					</u-button>
				</view>
			</u-row>
			<uv-scroll-list :indicator="false" v-if="images.length" style="margin-top: 20rpx;">
				<view v-for="(item, index) in images" :key="index"
					style="position: relative; display: inline-block;height: 100rpx;width: 100rpx;margin-right: 10rpx;">
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
				<u-tabs :list="emojiData" :current="emojiIndex" lineHeight="3" lineColor="#88d8c0"
					itemStyle="height: 26px;"
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
		<!-- 分享 -->
		<u-popup mode="bottom" round="10" :show="showMore" @close="showMore =false" :closeable="true">
			<view style="padding: 30rpx;">
				<view style="text-align: center;color: #999;">
					<text>分享至</text>
				</view>
				<view style="margin-top: 50rpx;">
					<u-row customStyle="border-bottom:1rpx solid #88d8c00a;padding-bottom:30rpx" justify="space-around">
						<block v-for="(item,index) in share" :key="index">
							<u-row align="center" customStyle="flex-direction:column" @click="shareWithApi(item)">
								<view style="padding: 20rpx;border-radius: 100rpx;" :style="{background:item.color}">
									<u-icon :name="item.icon" color="white" size="24"></u-icon>
								</view>
								<text style="margin-top: 20rpx;">{{item.name}}</text>
							</u-row>
						</block>
					</u-row>
					<view style="display: flex;flex-direction: column;margin-top: 50rpx;">
						<u-row customStyle="margin-bottom:30rpx" @click="goReport(article.authorId,article.cid,'article')">
							<i class="ess mgc_alert_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">举报</text>
						</u-row>
						<u-row customStyle="margin-bottom: 30rpx;" @click="copyLink()">
							<i class="ess mgc_flash_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx">复制链接</text>
						</u-row>
						<!-- #ifdef APP -->
						<u-row customStyle="margin-bottom: 30rpx;">
							<i class="ess mgc_share_forward_line" style="font-size: 40rpx;"></i>
							<text style="margin-left:20rpx" @click="shareWithSystem()">通过系统分享</text>
						</u-row>
						<!-- #endif -->
						<view
							v-if="article&& article.authorId == $store.state.userInfo.uid|| $store.state.userInfo.group =='administrator'">
							<u-row customStyle="margin-bottom: 30rpx;" @click="goEdit()">
								<i class="ess mgc_edit_line" style="font-size: 40rpx;"></i>
								<text style="margin-left:20rpx">编辑</text>
							</u-row>
							<u-row customStyle="margin-bottom: 30rpx;color:red" @click="showDelete = true">
								<i class="ess mgc_delete_2_line" style="font-size: 40rpx;"></i>
								<text style="margin-left:20rpx">删除</text>
							</u-row>
							<u-row style="margin:20rpx 0;color:red" @click="showPublishAction = true" v-if="isAdmin">
								<i class="mgc_seal_line" style="font-size: 40rpx;"></i>
								<text style="margin-left:20rpx">审核</text>
							</u-row>
						</view>
					</view>
				</view>
			</view>
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
						<u-button plain color="#88d8c0" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
							@click="showDelete = false">取消</u-button>
						<u-button color="#88d8c0" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
							@click="deleteArticle()">确定</u-button>
					</u-row>
				</view>
			</u-popup>
			<!-- 弹出审核 -->
			<u-popup :show="showPublishAction" :round="10" mode="center" @close="showPublishAction = false"
				customStyle="width:500rpx">
				<view style="display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					padding: 50rpx;">
					<text style="font-size: 34rpx;">提示</text>
					<view style="margin-top:30rpx">
						<text>是否{{article&& article.status=='publish'?'取消审核':'审核通过'}}</text>
					</view>
					<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
						<u-button plain color="#88d8c0" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
							@click="showPublishAction = false">取消</u-button>
						<u-button color="#88d8c0" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
							@click="appArticle()">确定</u-button>
					</u-row>
				</view>
			</u-popup>
		</u-popup>
		<u-popup :show="showReward" @close="showReward = false" mode="center" round="5"
			customStyle="padding:30rpx;background-color: transparent;width:500rpx;">
			<u-row justify="space-around">
				<view class="reward-container-coin" @click="reward(5)">
					<i class="mgc_sparkles_fill"></i>
					<text style="font-size: 28rpx;">5</text>
				</view>
				<view class="reward-container-coin" @click="reward(10)">
					<i class="mgc_sparkles_2_fill"></i>
					<text style="font-size: 28rpx;">10</text>
				</view>
			</u-row>

			<view
				style="margin-top: 100rpx;color: white;font-size: 28rpx;border-radius: 10rpx;display: flex;flex-direction: column;align-items: center;"
				v-if="$store.state.hasLogin">
				<text>剩余{{$store.state.appInfo.currencyName}}：{{$store.state.userInfo.assets}}</text>
				<text>点击图标赠送</text>
			</view>

		</u-popup>
	</z-paging-swiper>
</template>

<script>
	import {
		shareTap,
		filterHtml,
		shareWithSystem
	} from '@/common/common.js';
	import comment from '@/pages/article/components/comments/comment.vue';
	import _ from 'lodash' // 导入 lodash 库
	export default {
		components: {
			comment
		},
		data() {
			return {
				swiperIndex: 0,
				articleList: [],
				comments: [],
				showComment: false,
				showPublishAction: false,
				pid: 0,
				id: 0,
				article: {},
				video: {},
				list: ['简介', '评论'],
				showInfo: false,
				page: 1,
				commentPage: 1,
				limit: 15,
				showComemntBtn: false,
				images: [],
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
				fullscreenEdit: false,
				keyboardHeight: 0,
				editorCtx: null,
				showReward: false,
				emojiData: [],
				emojiIndex: 0,
				colors: ['#88d8c0', '#5BD784', '#FFA600', '#0DD0F2', '#FB4F14', '#000000E6'],
				isReply: false,
				commentText: '',
				systemInfo: {},
				showBtn: true,
				play: {
					duration: '00:00',
					metaData: {},
					currentTime: 0,
					status: false,
					fullscreen: false,
				},
				progress: {
					played: 0,
					unplayed: 100
				},
				iconPosition: 0,
				touchNum: 0,
				startX: 0,
				startY: 0,
				lastX: 0,
				totalOffset: 0, // 累计滑动偏移量
				smoothingFactor: 0.4, // 平滑系数,0-1 之间,数值越小平滑程度越高
				startVolume: 0, // 开始音量值
				startBrightness: 0, // 开始亮度值
				showDelete: false,
				showMore: false,
				isDragging: false,
				progressStartX: 0,
				progressBarWidth: 0,
				progressBarLeft: 0,
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
				direction: 'landscape-primary',
				videoHeight: 500, // 初始视频高度
				lastScrollTop: 0, // 上次滚动位置
			}
		},
		async onLoad(params) {
			this.formatEmoji()
			this.id = this.$Route.query.id;
			this.getData(this.id)
			this.getComments()
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})
			this.systemInfo = uni.getSystemInfoSync()

		},
		computed: {
			playedPercentage() {
				return `${this.progress.played}%`;
			},
			unplayedPercentage() {
				return `${this.progress.unplayed}%`;
			},
			dragPosition() {
				return `${this.progress.played-1}%`;
			},
			isPro() {
				let width = this.play.metaData.width;
				let height = this.play.metaData.height;

				// 判断视频方向
				const isPortrait = height > width;

				if (isPortrait) {
					// 竖屏视频,应用动态高度
					let newHeight = 1000 - this.lastScrollTop;
					return `${newHeight <= 1000 ? newHeight : ''}rpx`;
				} else {
					// 横屏视频,使用固定高度
					return '500rpx';
				}
			},
			isAdmin() {
				if (!this.$store.state.hasLogin) return false;
				let userInfo = this.$store.state.userInfo;
				return userInfo.group == 'administrator' || userInfo.group == 'editor';
			}
		},
		mounted() {
			this.queryProgressBarBoundingRect();

		},
		methods: {
			getData(id) {
				this.$http.get('/article/info', {
					params: {
						id: id ? id : this.id
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.article = res.data.data
						this.video = this.article.videos[0]
					}
				})
			},
			getArticleList(page, limit) {
				this.$http.get('/article/articleList', {
					params: {
						page,
						limit,
						params: {
							type: 'video'
						},
						random: 1
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.article.complete(res.data.data.data)
					}
				})
			},
			getComments(page, limit) {
				this.$http.get('/comments/list', {
					params: {
						page,
						limit,
						id: this.id,
						all: 0,
						parent: 0,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.comments.complete(res.data.data.data)
					}
				})
			},
			tabsChange(index) {
				this.swiperIndex = index;
				if (index == 1) this.lastScrollTop = 1000;
				else this.lastScrollTop = 0;
			},
			//swiper滑动中
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.swiperIndex = e.detail.current;
				if (e.detail.current == 1) this.lastScrollTop = 1000;
				else this.lastScrollTop = 0;
				this.$refs.tabs.unlockDx();

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
			formatEmoji() {
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
				let permission = false
				let userInfo = this.$store.state.userInfo
				if (userInfo.group == 'administrator' || userInfo.group == 'editor' || userInfo.isVip) {
					permission = true
				}
				if (name == '图片') {
					this.chooseImage()
					return;
				}
				if (name == '颜色' && !permission) {
					uni.$u.toast('颜色评论仅会员可用');
					return
				}
				if (name == this.showComemntBtn) this.showComemntBtn = null;
				else this.showComemntBtn = name
			},
			colorTap(color) {
				this.editorCtx.format('color', color)
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
					success: res => {}
				})
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

						let params = {
							id: this.article.cid,
							parent: this.pid ? this.pid : 0,
							all: this.pid ? this.pid : 0,
							text: this.commentText,
							images: JSON.stringify(this.images)
						}
						this.isReply = true
						this.$http.post('/comments/add', {
							...params
						}).then(res => {
							if (res.data.code == 200) {
								this.commentText = '';
								this.showComment = false;
								this.images = [];
								this.$refs.comments.reload()
							}
							uni.$u.toast(res.data.msg);
							this.isReply = false
						}).catch(err => {
							this.isReply = false
						})
					}
				})

			},
			scrolltolower(type) {
				if (type == 'article') this.getArticleList(true);
				if (type == 'comment') this.getComments(true);
			},
			refresherpulling() {
				this.getComments(false)
			},
			goArticle(data) {
				if (this.article.cid == data.cid) return;
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
			async chooseImage() {
				if (this.images.length >= 6) {
					uni.$u.toast('至多可添加6张图片')
					return;
				}
				uni.chooseImage({
					success: (res) => {
						this.upload(res.tempFilePaths);
					}
				})

			},
			upload(files) {
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
						} else {
							this.images.push(data.url)
						}
						this.$refs.upload.close()
					} else {
						this.uploadErr.status = true
						this.uploadErr.msg = res.data.msg
					}
				}).catch(err => {
					this.uploadErr.status = true
					this.uploadErr.msg = '网络错误'
				})
			},
			back() {
				if (this.play.fullscreen) this.$refs.video.switchFullscreen()
				else this.$Router.back()
			},
			goHome() {
				if (this.play.fullscreen) {
					this.$refs.video.switchFullscreen();
					setTimeout(() => {
						this.$Router.replace({
							name: 'home'
						})
					}, 200)
				} else {
					this.$Router.replace({
						name: 'home'
					})
				}

			},
			loadedMetaData(event) {
				this.play.metaData = event;
				this.play.duration = this.formatDuration(event.duration)
			},
			fullscreen() {
				this.play.fullscreen = !this.play.fullscreen
				// #ifdef APP
				if (!this.play.fullscreen) plus.navigator.setStatusBarStyle("light");
				// #endif

			},
			switchFullscreen() {
				let height = this.play.metaData.height;
				let width = this.play.metaData.width;
				if (height > width) {
					this.direction = 'portrait-primary'
				} else {
					this.direction = 'landscape-primary'
				}
				setTimeout(() => {
					this.$refs.video.switchFullscreen()
				}, 50)

			},
			formatDuration(duration) {
				const durationInSeconds = duration;
				const hours = Math.floor(durationInSeconds / 3600);
				const minutes = Math.floor((durationInSeconds % 3600) / 60);
				const seconds = Math.floor(durationInSeconds % 60);
				let formatDuration;
				if (hours > 0) {
					// 格式化为时:分:秒的格式
					formatDuration =
						`${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
				} else {
					// 格式化为分:秒的格式
					formatDuration = `${this.padZero(minutes)}:${this.padZero(seconds)}`;
				}
				return formatDuration;
			},
			padZero(num) {
				return num.toString().padStart(2, '0');
			},
			timeUpdate(e) {
				if (this.isDragging) return;
				const duration = this.play.metaData.duration;
				const currentTime = e.currentTime;
				// 计算已播放和未播放的百分比
				this.progress.played = (currentTime / duration) * 100;
				this.progress.unplayed = 100 - this.progress.played;
				this.play.currentTime = e.currentTime
			},
			onPlay() {
				this.$refs.video.toggle();
				this.play.status = !this.play.status;
			},
			ended() {
				// 重置播放进度
				this.progress.played = 0;
				this.progress.unplayed = 100;
				// 重置图标位置
				this.iconPosition = 0;
				// 获取当前播放视频的索引
				const currentIndex = this.article.videos.findIndex(v => v.src === this.video.src);

				// 如果有续集
				if (currentIndex !== -1 && currentIndex < this.article.videos.length - 1) {
					// 获取下一集视频的信息
					const nextVideo = this.article.videos[currentIndex + 1];

					// 将下一集视频信息赋值给 this.video
					this.video = nextVideo;
				}
			},
			maskTouchend(e) {
				this.touchNum++
				setTimeout(() => {
					if (this.touchNum == 1) {
						this.showBtn = !this.showBtn
					}
					if (this.touchNum >= 2) {
						this.onPlay()
					}
					this.touchNum = 0
				}, 200)
			},
			touchStart(e) {
				this.startX = e.touches[0].clientX
				this.startY = e.touches[0].clientY
				this.lastX = this.startX
				this.totalOffset = 0
				// #ifdef APP
				this.startVolume = plus.device.getVolume()
				this.startBrightness = plus.screen.getBrightness()
				// #endif

			},
			handleTouch(e) {
				const screenWidth = uni.getSystemInfoSync().screenWidth
				const duration = this.play.metaData.duration || 0
				const currentX = e.touches[0].clientX
				const currentY = e.touches[0].clientY
				const deltaX = currentX - this.lastX
				const deltaY = currentY - this.startY

				// #ifdef APP
				// 横向滑动，调节进度
				if (Math.abs(deltaX) > Math.abs(deltaY)) {
					this.totalOffset += deltaX * this.smoothingFactor
					const moveRatio = this.totalOffset / screenWidth
					const newPosition = Math.max(0, Math.min(this.play.currentTime + duration * moveRatio, duration))
					this.$refs.video.seek(newPosition)
					this.lastX = currentX
				} else if (Math.abs(deltaY) > 10) { // 纵向滑动，防止微小移动引起变化
					// 右侧调节音量
					if (this.startX > screenWidth / 2) {
						let volume = this.startVolume - deltaY / uni.upx2px(500) * 0.4
						volume = Math.max(0, Math.min(volume, 1))
						plus.device.setVolume(volume)
					} else { // 左侧调节亮度
						let brightness = this.startBrightness - deltaY / uni.upx2px(500) * 0.4
						brightness = Math.max(0, Math.min(brightness, 1))
						plus.screen.setBrightness(brightness)
					}
				}
				// #endif

			},
			touchEnd() {
				this.startX = 0
				this.startY = 0
				this.lastX = 0
				this.totalOffset = 0
				this.startVolume = 0
				this.startBrightness = 0
			},

			// 操作进度条方法
			// 操作进度条方法
			handleTouchStart(e) {
				this.isDragging = true;
				this.progressStartX = e.touches[0].clientX;
			},
			handleTouchMove(e) {
				if (!this.isDragging) return;
				const currentX = e.touches[0].clientX;
				const progress = Math.max(0, Math.min(100, (currentX - this.progressBarLeft) / this.progressBarWidth *
					100));
				this.updateProgress(progress);
			},
			handleTouchEnd() {
				this.isDragging = false;
				const newPosition = (this.progress.played / 100) * this.play.metaData.duration;
				this.$refs.video.seek(newPosition);
			},
			handleProgressBarClick(e) {
				const offsetX = e.detail.x - this.progressBarLeft;
				const progress = (offsetX / this.progressBarWidth) * 100;
				this.updateProgress(progress);
				const newPosition = (this.progress.played / 100) * this.play.metaData.duration;
				this.$refs.video.seek(newPosition);
			},
			queryProgressBarBoundingRect() {
				const query = uni.createSelectorQuery().in(this);
				query
					.select(".progress-bar")
					.boundingClientRect((res) => {
						this.progressBarWidth = res.width;
						this.progressBarLeft = res.left;
					})
					.exec();
			},
			updateProgress(progress) {
				progress = Math.max(0, Math.min(100, progress));
				this.progress.played = progress;
				this.progress.unplayed = 100 - progress;
				this.iconPosition = (this.progressBarWidth * progress) / 100;
			},

			shareWithSystem() {
				let data = this.article
				shareWithSystem(data.title, `${this.$config.h5}/#/pages/article/video?id=${data.cid}`).then(() => {
					this.showMore = false;
				})
			},
			shareWithApi(data) {
				shareTap(data.provider, data.type, data.scene, this.article.title, filterHtml(this.article.text),
					`${this.$config.h5}/#/pages/article/video?id=${this.article.cid}`, this.article.images[0])
			},
			copyLink() {
				let data = this.article
				uni.setClipboardData({
					data: `${this.$config.h5}/#/pages/article/video?id=${data.cid}`,
					success: () => {
						uni.$u.toast('复制成功')
						this.showMore = false
					}
				})
			},
			goEdit() {
				this.showMore = false
				this.$Router.push({
					path: '/publish/article/video',
					query: {
						update: true,
						id: this.article.cid
					}
				})
			},
			deleteArticle() {
				this.$http.post('/article/delete', {
					id: this.article.cid
				}).then(res => {
					if (res.data.code == 200) {
						this.showDelete = false
						uni.$u.toast(res.data.msg)
						setTimeout(() => {
							this.$Router.back()
						})
					}
				})
			},
			// handleScroll(event) {
			// 	const scrollTop = event.detail.scrollTop
			// 	this.updateVideoHeight(scrollTop)
			// },
			// updateVideoHeight: _.throttle(function(scrollTop) {
			// 	const scrollDiff = scrollTop - this.lastScrollTop
			// 	let newHeight = this.videoHeight - scrollDiff
			// 	newHeight = Math.max(this.minHeight, Math.min(this.maxHeight, newHeight))
			// 	this.videoHeight = newHeight
			// 	this.lastScrollTop = scrollTop + 100
			// }, 100),
			like() {
				this.$http.post('/article/like', {
					id: this.article.cid
				}).then(res => {
					if (res.data.code == 200) {
						this.article.isLike = !this.article.isLike
						this.article.likes += this.article.isLike ? 1 : -1;
					}
				})
			},
			mark() {
				this.article.isMark = !this.article.isMark
				if (this.article.isMark) this.article.marks += 1;
				if (!this.article.isMark) this.article.marks = this.article.marks ? this.article.marks -
					1 : 0;
				this.$http.post('/article/mark', {
					id: this.article.cid
				}).then(res => {})
			},
			reward(money) {
				this.$http.post('/article/reward', {
					id: this.article.cid,
					money
				}).then(res => {
					this.getData()
					uni.$u.toast(res.data.msg)
					this.showReward = false
				})
			},
			appArticle() {
				this.$http.post('/article/action', {
					id: this.article.cid,
					type: 'publish',
				}).then(res => {
					this.showPublishAction = false;
					this.showMoreMenu = false;
					this.getData();
					uni.$u.toast(res.data.msg)
				})
			},
			goReport(user_id, article_id, type) {
				this.showMore = false
				this.$Router.push({
					path: '/pagesA/report/report',
					query: {
						user_id,
						article_id,
						type
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	@media(prefers-color-scheme:dark) {
		.text {
			color: white;
		}

		.tabbar {
			border-bottom: #292929 1rpx solid;
		}
	}

	.ql-container ::v-deep .ql-blank::before {
		min-height: 60rpx;
		height: 60rpx;
		font-style: normal;
	}

	#editor {
		background: #f9f9f9;
		height: auto;
		min-height: 120rpx;
		max-height: 200rpx;
		border-radius: 20rpx;
		padding: 8rpx 16rpx;
		transition: all 0.5s ease;
		/* 添加过渡效果 */
	}

	#editor.fullscreen {
		min-height: 600rpx;
		max-height: 600rpx;
	}

	.info-panel {
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		transition: all .3s;

		&.active {
			grid-template-rows: 1fr !important;
		}
	}

	.info-panel .chlid {
		min-height: 0rpx;
	}

	.icon {
		transition: all 0.3s ease;

		&-active {
			transform: rotate(90deg);
		}
	}

	.text {
		font-size: 28rpx;
		color: #999;
	}

	.swiper {
		height: 100%;
	}

	.comment {
		&-mask {
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background-color: rgba(0, 0, 0, 0.5);
		}

		&-order {
			font-size: 30rpx;
			color: #88d8c0;
			display: flex;
			flex-direction: column;
			position: absolute;
			top: 100rpx;
			left: 30rpx;
			background-color: #fff;
			padding: 10rpx;
			border-radius: 20rpx;
			box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
		}

		&-box {
			padding: 14rpx 14rpx;
			border-radius: 50rpx;
			background: #f9f9f9;
		}
	}

	.epContent {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 10rpx;
		padding: 8rpx 30rpx;
		border-radius: 10rpx;
		background: #f7f7f7;
		min-width: 100rpx;
		max-width: 100rpx;
	}

	.ep {
		color: $c-primary;
	}

	.player-container {
		position: relative;
		height: 100%;
	}

	.player-btn {
		position: absolute;
		left: 0;
		color: white;
		width: 100%;
		z-index: 10;
	}

	.player-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* 设置黑色透明背景 */
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5970763305322129) 0%, rgba(0, 0, 0, 0) 12%, rgba(0, 0, 0, 0) 88%, rgba(0, 0, 0, 0.6) 100%);
		z-index: 0;

		&.active {
			background: transparent;
		}
	}

	.player-control {
		position: absolute;
		bottom: 10rpx;
		width: 100%;
		color: white;
		z-index: 10;
	}

	.progress-bar {
		width: 100%;
		height: 10rpx;
		border-radius: 10rpx;
		background-color: rgba(255, 255, 255, 0.4);
		/* 白色半透明 */
		position: relative;
	}

	.progress-bar-icon {
		transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		position: absolute;
		top: 50%;
		transform: translateY(-60%);
		font-size: 32rpx;
		color: white;
	}

	.played {
		height: 100%;
		border-radius: 10rpx;
		background-color: $c-primary;
		transition: width 0.3s;

	}

	.unplayed {
		height: 100%;
		border-radius: 10rpx;
		background-color: rgba(255, 255, 255, 0.4);
		transition: width 0.3s;
		/* 白色半透明 */
		position: absolute;
		right: 0;
		top: 0;
	}

	/deep/ .ybplayer-slots,
	/deep/ .ybplayer-controls-slots {
		height: 100%;
	}

	/deep/.ybplayer-video-poster {
		background-size: cover !important;
	}

	.tabbar {
		padding: 5rpx 30rpx;
		border-bottom: #f7f7f7 1rpx solid;
	}

	/deep/ .video-content {
		max-height: 1000rpx;
		min-height: 500rpx;
		height: 500rpx;
		transition: all 0.3s;
		background: black;
	}

	.active {
		color: $c-primary;
		transition: all 0.3s;
	}

	.reward-container {
		display: inline-block;
		text-align: center;
		transition: all 0.5s ease;

		&-coin {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: white;
			font-size: 100rpx;
		}
	}
</style>