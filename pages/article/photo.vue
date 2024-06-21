<template>
	<z-paging-swiper>
		<z-paging ref="comments" v-model="comments" @query="getComments" :auto-scroll-to-top-when-reload="false"
			:auto-clean-list-when-reload="false" v-show="!loading" @scroll="onScroll" @onRefresh="onRefresh"
			cache-mode="always" use-cache :cache-key="`article_mid-${cid}`">
			<template #top>
				<u-navbar placeholder fixed style="z-index: 10;" bgColor="transparent" id="navbar">
					<view slot="left" style="display:flex;align-items: center;">
						<i class="ess mgc_left_line" style="font-size: 60rpx;" @click="$Router.back(1)"></i>
						<view style="margin-left: 40rpx;display: flex;align-items: center;"
							@click="goProfile(article.authorId)" v-show="showNavAvatar" v-if="article">
							<u-avatar :src="article && article.authorInfo && article.authorInfo.avatar" size="28"
								customStyle="border:4rpx solid #88d8c032"></u-avatar>
							<text style="font-Weight: bold;font-size: 30rpx;margin-left: 20rpx;">
								{{article && article.authorInfo && article.authorInfo.screenName?article.authorInfo.screenName:article.authorInfo.name}}
							</text>
						</view>
					</view>
					<view slot="right">
						<view v-show="showNavAvatar"
							style="display: flex; align-items: center;border-radius: 50rpx;border:2rpx solid #88d8c032;padding: 0rpx 16rpx;line-height: 1;">
							<u-row customStyle="margin-right:20rpx;"
								@click="article.authorInfo.isFollow?showFollow = true:follow(article.authorId)">
								<i class="ess mgc_add_line" style="font-size: 30rpx;font-Weight: bold;"
									:style="{color:article && article.authorInfo &&article.authorInfo.isFollow?'':'#88d8c0'}"
									v-if="article && article.authorInfo &&!article.authorInfo.isFollow"></i>

								<text style="font-size: 26rpx;margin-left: 10rpx;padding-right:20rpx;font-Weight: bold;"
									:style="{color:article && article.authorInfo && article.authorInfo.isFollow?'':'#88d8c0'}">
									{{article && article.authorInfo && article.authorInfo.isFollow?'已关注':'关注'}}
								</text>
							</u-row>
							<view>
								<i class="ess mgc_more_1_line" style="font-size: 60rpx;" @click="showMore = true"></i>
							</view>
						</view>
						<i class="ess mgc_more_1_line" style="font-size: 60rpx;" @click="showMore = true"
							v-show="!showNavAvatar"></i>
					</view>
				</u-navbar>
			</template>
			<view style="padding: 10rpx 30rpx 30rpx 30rpx;" v-if="article" @touchend="touchEnd" @touchmove="touchMove">
				<text style="font-size: 60rpx;">{{article.title}}</text>
				<u-row align="top" justify="space-between" class="album-content">
					<u-col :span="5.8">
						<image :src="article.images[0]" mode="aspectFill"
							style="border-radius: 20rpx;height: 380rpx;width: 260rpx; background: #f7f7f7;"></image>
					</u-col>
					<u-col :span="5">
						<view
							style="display: flex;flex-direction: column;align-items: flex-end; justify-content: flex-start;padding: 20rpx 30rpx;flex:1">
							<view class="ripple album-content-info" @tap.stop="goCategory(article.category.mid)">
								<u-row justify="space-between" class="u-line-1">
									<text>{{article.category.name}}</text>
								</u-row>
								<u-row justify="space-between">
									<u-row>
										<i class="ess mgc_heart_fill" style="color: red;"></i>
										<text style="margin-left: 5rpx;">{{article.likes}}</text>
									</u-row>
									<text>{{article.images.length}}页</text>
								</u-row>
								<view style="text-align: center;margin-top: 10rpx;">
									<text>{{$u.timeFormat(article.created, 'yyyy-mm-dd hh:MM')}}</text>
								</view>
							</view>

							<!-- 控件三 -->
							<view style="margin-top: 30rpx;border-radius: 20rpx;border: 1rpx #999 solid;padding: 10rpx;"
								class="ripple">
								<u-row justify="space-between">
									<u-avatar :src="article.authorInfo.avatar" size="20"></u-avatar>
									<text style="font-size: 26rpx;margin-left: 20rpx;">
										{{article.authorInfo.screenName?article.authorInfo.screenName:article.authorInfo.name}}
									</text>
								</u-row>
							</view>
						</view>
					</u-col>
				</u-row>
				<!-- 按钮 -->
				<view style="margin-top: 40rpx;">
					<u-row>
						<u-button color="#88d8c03c" shape="circle" :hairline="false"
							style="color: black;margin-right: 10rpx;">下载</u-button>
						<u-button color="#88d8c0" shape="circle" :hairline="false" style="margin-left: 10rpx;"
							@click="goRead()">阅读</u-button>
					</u-row>
				</view>

				<!-- 图廊 -->
				<view style="margin-top: 40rpx;">
					<text style="font-Weight: bold;">图廊</text>
					<uv-scroll-list indicatorActiveColor="#88d8c0">
						<block v-for="(item,index) in article.images" :key="index" v-if="index<12">
							<u-image :src="item" height="160" width="100" radius="8"
								style="margin-right: 20rpx;"></u-image>
						</block>
						<u-row style="text-orientation:mixed;writing-mode: vertical-lr" justify="center"
							@click="goRead()">
							<text>阅读更多</text>
							<i class="ess mgc_down_small_fill" style="font-size: 40rpx;"></i>
						</u-row>
					</uv-scroll-list>
				</view>
				<!-- 交互控件 -->
				<view style="margin-top: 60rpx;">
					<u-row justify="space-around">
						<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
							<i class="ess ripple" :class="article.isLike?'mgc_heart_fill':'mgc_heart_line'"
								style="font-size: 60rpx;" :style="{color:article.isLike?'red':''}" @click="like()"></i>
							<text>{{article.likes}}</text>
						</view>
						<view style="display: flex;flex-direction: column;align-items: center;justify-content: center;">
							<i class="ess ripple" :class="article.isMark?'mgc_star_fill':'mgc_star_line'"
								style="font-size: 60rpx;" :style="{color:article.isMark?'#f2ba49':''}"
								@click="mark()"></i>
							<text>{{article && article.marks}}</text>
						</view>

					</u-row>
				</view>
				<!-- 标签 -->
				<view style="margin-top: 20rpx;">
					<u-row style="flex-wrap:wrap;">
						<block v-for="(item,index) in article.tag" :key="index">
							<view class="tag" @tap.stop.prevent="goTag(item.mid)">
								<i class="mgc_hashtag_line" style="font-size: 26rpx;"></i>
								<text>{{item.name}}</text>
							</view>
						</block>
					</u-row>
				</view>
			</view>



			<!-- 评论区 -->
			<u-gap height="6" class="article-gap" bgColor="#f7f7f7"></u-gap>
			<!-- #ifdef APP -->
			<u-sticky>
				<view style="position: relative;top: 0;padding: 30rpx 30rpx 0 30rpx;" @touchmove.stop>
					<u-row>
						<view @click="showOrderList = !showOrderList" style="display: flex; align-items: center;">
							<text
								style="margin-right: 6rpx;font-size: 30rpx;color: #666;font-Weight: bold;">{{orderName}}</text>
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
								style="font-size: 30rpx;color:#88d8c0;display: flex;flex-direction: column;position: absolute; top: 100rpx; left: 30rpx; background-color: #fff; padding: 10rpx; border-radius: 20rpx; box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);">
								<block v-for="(item,index) in orderList" :key="index">
									<text @click.stop="orderTap(item.name);$refs.comments.reload()"
										style="padding: 15rpx;">{{item.name}}</text>
								</block>
							</view>
						</view>
					</u-transition>
				</view>
			</u-sticky>
			<!-- #endif -->
			<!-- #ifndef APP -->
			<u-sticky>
				<view style="position: relative;top: 0;padding: 30rpx 30rpx 0 30rpx;" @touchmove.stop>
					<u-row>
						<view @click="showOrderList = !showOrderList" style="display: flex; align-items: center;">
							<text
								style="margin-right: 6rpx;font-size: 30rpx;color: #666;font-Weight: bold;">{{orderName}}</text>
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
								style="font-size: 30rpx;color:#88d8c0;display: flex;flex-direction: column;position: absolute; top: 100rpx; left: 30rpx; background-color: #fff; padding: 10rpx; border-radius: 20rpx; box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);">
								<block v-for="(item,index) in orderList" :key="index">
									<text @click.stop="orderTap(item.name);$refs.comments.reload()"
										style="padding: 15rpx;">{{item.name}}</text>
								</block>
							</view>
						</view>
					</u-transition>
				</view>

			</u-sticky>
			<!-- #endif -->
			<view style="margin: 30rpx;">
				<!-- 开始 -->
				<block v-for="(item,index) in comments" v-if="comments">
					<view style="margin:10rpx 0">
						<comment :data="item" @subComment="subComment = $event;showSub =true"
							@reply="pid = $event.id;showComment =true" :article="article"></comment>
					</view>
				</block>
			</view>
			<template #bottom>
				<u-row class="u-info comment-box" @click="showComment = true">
					<u-icon name="edit-pen" size="20"></u-icon>
					<text style="margin-left:10rpx;font-size: 28rpx;">说点什么</text>
				</u-row>
			</template>
		</z-paging>
		<u-loading-page :loading="loading"></u-loading-page>
		<!-- 页面公用组件 -->
		<!-- 回复文章 -->
		<u-popup :show="showComment" @close="showComment = false;pid = 0" round="10" :z-index="10074"
			:customStyle="{transform: `translateY(${-keyboardHeight+'px'})`,transition:'transform 0.3s ease',padding:30+'rpx'}">
			<editor id="editor" :adjust-position="false" :show-img-size="false" :show-img-resize="false"
				:show-img-toolbar="false" @ready="onEditorReady" placeholder="说点什么"
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
					<u-button shape="circle" color="#88d8c0" customStyle="padding:4rpx,6rpx;height:50rpx;width:120rpx"
						text="发送" @click="$u.throttle(reply(),2000,true) "></u-button>
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
		<!-- 子评论 -->
		<u-popup :show="showSub" @close="showSub = false;keyboardHeight = 0" round="20">
			<u-gap height="25"></u-gap>
			<view>
				<subComment :data="subComment" ref="paging" :keyHeigt="keyboardHeight"></subComment>
			</view>
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
						<view v-if="article&& article.authorId == $store.state.userInfo.uid|| isAdmin">
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
				<view
					style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
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
		<!-- 上传进度 -->
		<uv-modal :show="showLoading" ref="upload" :zIndex="10076"
			@close="showLoading=false;uploadErr.status = false;uploadErr.msg=null;"
			:closeOnClickOverlay="uploadErr.status" :showConfirmButton="false"
			:title="uploadErr.status?'上传错误':'上传中...'">
			<u-line-progress :percentage="percentage" activeColor="#88d8c0" :showText="false"
				v-if="!uploadErr.status"></u-line-progress>
			<text v-if="uploadErr.status">错误信息：{{uploadErr.msg}}</text>
			<view slot="confirmButton"></view>
		</uv-modal>
		<u-popup :show="showPay" :round="10" mode="center" @close="showPay = false" customStyle="width:500rpx">
			<view
				style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
				<text style="font-size: 34rpx;">提示</text>
				<view style="margin-top:30rpx">
					<text>是否确定查看？</text>
				</view>
				<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
					<u-button plain color="#88d8c0" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
						@click="showPay = false">取消</u-button>
					<u-button color="#88d8c0" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
						@click="buyHide()">确定</u-button>
				</u-row>
			</view>
		</u-popup>
		<u-popup :show="showFollow" :round="10" mode="center" @close="showFollow = false" customStyle="width:500rpx">
			<view
				style="display: flex;flex-direction: column;align-items: center;justify-content: center;padding: 50rpx;">
				<text style="font-size: 34rpx;">提示</text>
				<view style="margin-top:30rpx">
					<text>是否取消关注？</text>
				</view>
				<u-row customStyle="margin-top: 60rpx;flex:1;width:100%" justify="space-between">
					<u-button plain color="#88d8c0" customStyle="height:60rpx;margin-right:10rpx" shape="circle"
						@click="showFollow = false">取消</u-button>
					<u-button color="#88d8c0" customStyle="height:60rpx;margin-left:10rpx" shape="circle"
						@click="follow(article.authorId)">确定</u-button>
				</u-row>
			</view>
		</u-popup>
		<!-- 打赏 -->
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
		shareTap
	} from '@/common/common.js';
	import {
		filterHtml
	} from '@/common/common.js';
	import articleHeader from '@/pages/article/components/header.vue';
	import articleContent from '@/pages/article/components/content.vue';
	import articleFooter from '@/pages/article/components/footer.vue';
	import comment from '@/pages/article/components/comments/comment.vue';
	import subComment from '@/pages/article/components/comments/subComment.vue';
	import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin'
	export default {
		components: {
			articleHeader,
			articleContent,
			articleFooter,
			comment,
			subComment,
		},
		mixins: [ZPMixin],
		data() {
			return {
				showDelete: false,
				showFollow: false,
				isReply: false,
				editorCtx: null,
				percentage: 30,
				showLoading: false,
				showPublishAction: false,
				uploadErr: {
					status: false,
					msg: ''
				},
				images: [],
				showPay: false,
				showReward: false,
				showOrderList: false,
				showNavAvatar: false,
				orderName: '全部评论',
				isScroll: false,
				cid: 0,
				pid: 0,
				article: null,
				comments: [],
				emojiData: [],
				emojiIndex: 0,
				author: null,
				subComment: null,
				loading: true,
				showMore: false,
				showComment: false,
				showComemntBtn: null,
				commentText: '',
				commentTabIndex: 0,
				swiperIndex: 0,
				commentId: 0,
				showSub: false,
				orderList: [{
						name: '全部评论',
						order: 'likes desc,created desc'
					}, {
						name: '点赞最多',
						order: 'likes desc'
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
				colors: ['#88d8c0', '#5BD784', '#FFA600', '#0DD0F2', '#FB4F14', '#000000E6'],
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
				manage: [{
						name: '举报',
						icon: 'warning'
					},
					{
						name: '编辑',
						icon: 'warning'
					}
				],
				keyboardHeight: 0,
				headerHeight: 0,
			};
		},
		onLoad(params) {
			let query = this.$Route.query;
			this.cid = query.id;
			this.getData(query.id);
			this.formatEmoji();
			uni.onKeyboardHeightChange(data => {
				this.keyboardHeight = data.height
			})

		},
		beforeRouteLeave(to, from, next) {

			if (this.showComment || this.showMore || this.showSub) {
				this.showComment = false;
				this.showSub = false;
				this.showMore = false;
				this.$Router.$lockStatus = false
				return
			}
			next();

		},
		onUnload() {
			// 取消监听
			uni.offKeyboardHeightChange(data => {

			})
		},
		computed: {
			isAdmin() {
				if (!this.$store.state.hasLogin) return false;
				let userInfo = this.$store.state.userInfo;
				return userInfo.group == 'administrator' || userInfo.group == 'editor';
			}
		},
		methods: {
			shareTap,
			filterHtml,
			getData(id) {
				this.$http.get('/article/info', {
					params: {
						id: id ? id : this.cid,
					},
				}).then(res => {
					if (res.statusCode == 200) {
						this.article = res.data.data
						this.article.text = res.data.data && this.replaceEmoji(res.data.data.text)
						setTimeout(() => {
							this.loading = false;
						}, 600)

					}
				})
			},
			cBtnTap(name) {
				if (name == '图片') {
					this.chooseImage()
					return;
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
			onRefresh() {
				this.getData()
			},
			getComments(page, limit) {
				let order = this.orderList.find(order => order.name == this.orderName)
				let params = {
					page,
					limit,
					all: 0,
					parent: 0,
					id: this.cid,
					order: order.order
				}
				if (order.name == '只看楼主') {
					params.order = null
				}
				this.$http.get('/comments/list', {
					params
				}).then(res => {

					if (res.data.code == 200) {
						this.$refs.comments.complete(res.data.data.data)
					}
				}).catch(err => {
					this.$refs.comments.complete(false)
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
							images: this.images
						}
						console.log(params)
						this.isReply = true
						this.$http.post('/comments/add', {
							...params
						}).then(res => {


							if (res.data.code == 200) {
								uni.$u.toast('已发送~')
								this.commentText = null
								this.showComment = false
								this.images = []
								this.$refs.comments.reload()

							} else {
								uni.$u.toast(res.data.msg)
							}
							this.isReply = false
						}).catch(err => {
							console.log(err)
							this.isReply = false
						})
					}
				})

			},
			replaceEmoji(html) {
				if (html) {
					return html.replace(
						/<img[^>]*?alt="src=([^"]+)\|poster=([^"]+)\|type=video"[^>]*?>/g, (match, src, poster) => {
							return `<div style="border-radius:10px"><video src="${src}" poster="${poster}" object-fit muted width="100%" style="border-radius:10px" /></div>`
						}).replace(/_\|#([^_]+)_([^|]+)\|/g, (match, name, key) => {
						const emoji = this.$emoji.data.find(e => e.name === name)
						if (emoji) {
							const src = `${emoji.base}${emoji.slug}_${emoji.list[key]}.${emoji.format}`
							return `<img src="${src}" style="width:100rpx;height:100rpx">`
						}
						// 如果没有找到,直接返回空字符串
						// 即删除整个匹配文本
						return ''
					}).replace(/\|</g, '<').replace(/>\|/g, '>').replace(/【(回复|付费)查看：([^】]+)】/g, (match, type,
						content) => {
						let html = ''

						html += `<a style="text-decoration:unset;color:#88d8c0;border:#88d8c0 dashed 1px;border-radius:10px;text-align:center;margin:10px 0;display:flex;flex:1;padding:20px;justify-content:center" data-type="${type}">
						隐藏内容，${type}后查看
						</a>`
						if (type == "付费") {
							html += `<div style="position:absolute;bottom:10px;right:0;border-radius:5px 0 5px 0;color:white;background:#a385ff;padding:0 8px;font-size:12px !important;display:flex">
							<div><i class="ess mgc_coin_line" style="font-size:12px"></div>
							<p style="font-size:12px;margin-left:2px">${this.article.price>0?this.article.price:'免费'}</p>
							</div>`
						}
						return html;
					})
				}
			},
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
			changTab(data) {
				this.commentTabIndex = data.index

			},
			animationfinish(data) {
				this.swiperIndex = data.detail.current
			},
			touchEnd() {
				// 停止移动
				this.isScroll = false;
			},
			touchMove(e) {
				// 手指触摸后的移动事件
				this.isScroll = true;
			},
			orderTap(item) {
				this.orderName = item
				this.showOrderList = false
			},
			onScroll(data) {
				if (data.detail.scrollTop > 160) this.showNavAvatar = true;
				else this.showNavAvatar = false;
			},
			goProfile(id) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			},
			follow(id) {
				if (this.$store.state.userInfo.uid == id) {
					uni.$u.toast('不可以关注自己');
					return;
				};
				this.$http.post('/user/follow', {
					id
				}).then(res => {
					if (res.data.code == 200) {
						this.article.authorInfo.isFollow = !this.article.authorInfo.isFollow
					}
					this.showFollow = false;
					uni.$u.toast(res.data.msg)
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

			goEdit() {
				this.showMore = false
				this.$Router.push({
					path: '/publish/article/photo',
					query: {
						update: true,
						id: this.article.cid
					}
				})
			},

			hideTap(type) {
				if (type == '付费') this.showPay = true
				else this.showComment = true;
			},
			buyHide() {
				this.$http.post('/article/buy', {
					id: this.article.cid
				}).then(res => {
					if (res.data.code) {
						uni.$u.toast(res.data.msg)
						this.showPay = false
						setTimeout(() => {
							this.getData()
						}, 800)
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
			goRead() {
				uni.setStorageSync('photo_read', this.article)
				this.$Router.push({
					path: '/pages/article/components/preview_photo/preview_photo',
					query: {
						id: this.article.cid
					},
					animation: {
						animationType: 'slide-in-bottom',
						animationDuration: 300
					}
				})
			},
			colorTap(color) {
				this.editorCtx.format('color', color)
			},
			shareWithSystem() {
				let data = this.article
				shareWithSystem(data.title, `${this.$config.h5}/#/pages/article/article?id=${data.cid}`).then(() => {
					this.showMore = false;
				})
			},
			shareWithApi(data) {
				shareTap(data.provider, data.type, data.scene, this.article.title, filterHtml(this.article.text),
					`${this.$config.h5}/#/pages/article/photo?id=${this.article.cid}`, this.article.images[0])
			},
			goCategory(id) {
				this.$Router.push({
					path: '/pages/common/category/categoryInfo',
					query: {
						id
					}
				})
			},
			copyLink() {
				let data = this.article
				uni.setClipboardData({
					data: `${this.$config.h5}/#/pages/article/photo?id=${data.cid}`,
					success: () => {
						uni.$u.toast('复制成功')
						this.showMore = false
					}
				})
			},
			goTag(id) {
				this.$Router.push({
					path: '/pages/common/tag/tag',
					query: {
						id
					}
				})
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
		}
	}
</script>

<style lang="less">
	.ql-container ::v-deep .ql-blank::before {
		min-height: 60rpx;
		height: 60rpx;
		font-style: normal;
	}

	.ripple {
		.button-ripple()
	}

	.comment-box {
		padding: 14rpx 14rpx;
		border-radius: 50rpx;
		background: #f9f9f9;
		margin: 20rpx 30rpx 30rpx 30rpx
	}

	.album-content {
		margin-top: 30rpx;
		background: #f9f9f9;
		border-radius: 20rpx;
		box-shadow: 1rpx 1rpx 2rpx rgba(0, 0, 0, 0.06);
		height: 380rpx;
	}

	.album-content-info {
		background: #fff;
		padding: 20rpx;
		border-radius: 20rpx;
		font-size: 26rpx;
		width: 100%;
	}

	.button-ripple() {
		overflow: hidden;
		position: relative;
		transition: background-color .3s linear, border .3s linear;

		&:after {
			content: "";
			display: block;
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			pointer-events: none;
			background-image: radial-gradient(circle, #000 10%, rgba(0, 0, 0, 0) 10.01%);
			background-repeat: no-repeat;
			background-position: 50%;
			transform: scale(10);
			opacity: 0;
			transition: transform .5s, opacity 1s;
		}

		&:active:after {
			transform: scale(0);
			opacity: .2;
			transition: 0s;
		}
	}

	.tag {
		font-size: 26rpx;
		background: #88d8c01e;
		color: #88d8c0;
		padding: 8rpx 14rpx;
		border-radius: 500rpx;
		margin-right: 10rpx;
		margin-top: 10rpx;
		font-size: 26rpx;
		display: flex;
		justify-content: center;
		align-items: center;
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