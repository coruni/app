<template>
	<view>
		<text style="font-size: 50rpx;font-Weight: bold;word-break: break-all;">{{data &&data.title}}</text>
		<u-row customStyle="color:#c0c4cc;font-size: 26rpx;" align="center" justify="space-between">
			<u-row>
				<u-row>
					<i class="ess mgc_time_line"></i>
					<text>{{$u.timeFrom(data.created,'mm-dd')}}</text>
				</u-row>
				<text style="margin:0 20rpx">·</text>
				<u-row align="center">
					<i class="ess mgc_eye_2_line"></i>
					<text>{{data.views}}</text>
				</u-row>
			</u-row>
			<text @click="goCategory(data.category.mid)">{{data.category && data.category.name?data.category.name:'未分类'}}</text>
		</u-row>
		<u-row justify="space-between"
			style="background: #85a3ff0a;padding: 40rpx 35rpx;border-radius: 20rpx;margin-top: 20rpx;">
			<u-row @click="goProfile(data.authorId)" style="flex: 1;">
				<view style="position: relative;display: inline-block;">
					<u-avatar :src="data && data.authorInfo&& data.authorInfo.avatar" size="40"
						customStyle="border:4rpx solid #85a3ff32"></u-avatar>
					<image class="avatar_head" mode="aspectFill"
						:src="data && data.authorInfo && data.authorInfo.opt  && data.authorInfo.opt.head_picture">
					</image>
				</view>
				<view style="display: flex;flex-direction: column;margin-left:20rpx;font-size: 30rpx;width: 0;flex:1">
					<u-row>
						<text
							style="font-Weight: bold;font-size: 34rpx;" :class="{'vipname':data&& data.authorInfo && data.authorInfo.isVip}">{{data.authorInfo&& data.authorInfo.screenName?data.authorInfo.screenName:data.authorInfo.name}}</text>
						<text
							:style="{border:`${data.authorInfo.level > 8 ? $level[Math.floor(data.authorInfo.level/2)-1] : $level[data.authorInfo.level-1]} solid 2rpx`,background:data.authorInfo.level > 8 ? $level[Math.floor(data.authorInfo.level/2)-1] : $level[data.authorInfo.level-1] }"
							style="font-size: 18rpx;padding: 0 16rpx;border-radius: 50rpx;margin-left:20rpx;color: white;"
							v-if="data.authorInfo.level">
							Lv.{{data.authorInfo.level}}
						</text>
						
					</u-row>
					<text class="u-info u-line-1"
						style="font-size: 28rpx;">{{data && data.authorInfo && data.authorInfo.introduce}}</text>
				</view>
			</u-row>
			<view>
				<u-button :plain="data && data.authorInfo&& !data.authorInfo.isFollow" shape="circle"
					hover-class="button_hover"
					:color="data && data.authorInfo&& data.authorInfo.isFollow?'#88d8c00f':'#88d8c0'"
					style="width:160rpx;height:65rpx;"
					:style="{color:data && data.authorInfo&& data.authorInfo.isFollow?'black':'#88d8c0'}"
					:text="data && data.authorInfo&& data.authorInfo.isFollow?'已关注':'关注'"
					class="follow"
					@click="$emit('follow',data.authorId)"></u-button>
			</view>
		</u-row>
	</view>
</template>

<script>
	export default {
		props: {
			data: {
				type: Object,
				default: null,
			}
		},
		data() {
			return {

			}
		},
		methods: {
			goProfile(id) {
				this.$Router.push({
					path: '/pages/profile/profile',
					query: {
						id
					}
				})
			},
			goCategory(id) {
				this.$Router.push({
					path: '/pages/common/category/categoryInfo',
					query: {
						id
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@media (prefers-color-scheme: dark){
		
	}
	.u-button::before {
		background: $c-primary;
	}
</style>