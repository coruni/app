<template>
	<z-paging @query="getData" v-model="messages" ref="paging" @onRefresh="onRefresh"
		:auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false">
		<template #top>
			<u-navbar placeholder title="消息通知" bgColor="transparent">
				<view slot="left">

				</view>
			</u-navbar>
		</template>
		<view style="margin: 30rpx;">
			<view style="display: flex;flex-direction: column">
				<u-row justify="space-between" @click="goPath('finance')">
					<u-row>
						<i class="ess mgc_bill_line"
							style="font-size: 45rpx;background: #fb7299;border-radius: 100rpx;color: white;padding: 25rpx;"></i>
						<text style="margin-left: 20rpx;">财务通知</text>
					</u-row>
					<i class="ess mgc_round_fill" style="color: #88d8c0;font-size: 18rpx;"
						v-if="$store.state.noticeNum.finances"></i>
				</u-row>
				<u-gap height="10"></u-gap>
				<u-row justify="space-between" @click="goPath('systems')">
					<u-row>
						<i class="ess mgc_settings_1_line"
							style="font-size: 45rpx;background: #ffb300;border-radius: 100rpx;color: white;padding: 25rpx;"></i>
						<text style="margin-left: 20rpx;">系统通知</text>
					</u-row>
					<i class="ess mgc_round_fill" style="color: #88d8c0;font-size: 18rpx;"
						v-if="$store.state.noticeNum.systems"></i>
				</u-row>
				<u-gap height="10"></u-gap>
				<u-row justify="space-between" @click="goPath('comments')">
					<u-row>
						<i class="ess mgc_message_1_line"
							style="font-size: 45rpx;background: #00ccff;border-radius: 100rpx;color: white;padding: 25rpx;"></i>
						<text style="margin-left: 20rpx;">评论通知</text>
					</u-row>

					<i class="ess mgc_round_fill" style="color: #88d8c0;font-size: 18rpx;"
						v-if="$store.state.noticeNum.comments"></i>
				</u-row>
			</view>

			<view style="margin-top: 0 30rpx;" v-if="$store.state.hasLogin">
				<block v-for="(item, index) in messages" :key="index">
					<u-row align="top" @click="goPrivate(item)" style="padding: 20rpx 0;">
						<u-avatar :src="item.userInfo.avatar"></u-avatar>
						<u-row style="flex-direction: column;margin-left: 20rpx;flex: 1;" align="top">
							<text>{{item.userInfo.screenName?item.userInfo.screenName:item.userInfo.name}}</text>
							<u-row justify="space-between" style="flex:1;width: 100%;font-size: 26rpx;">
								<text class="u-line-1">{{item.lastMsg && item.lastMsg.text}}</text>
								<text style="font-size: 26rpx;flex-shrink: 0;"
									v-if="item.lastMsg">{{$u.timeFrom(item.lastTime,'hh:MM')}}</text>
							</u-row>
						</u-row>
					</u-row>
				</block>
			</view>
		</view>
		<template #bottom style="background:transparent;">
			<view style="background: transparent !important;height: 100rpx;"></view>
		</template>
	</z-paging>
</template>

<script>
	export default {
		props: {
			index: {
				type: [String, Number],
				default: 0
			},
			current: {
				type: [String, Number],
				default: 0
			}
		},
		watch: {
			current: {
				handler(index) {
					if (index == this.index) {
						this.$refs.paging.reload()
					}
				},
				immediate: true,
				deep: true
			}
		},
		data() {
			return {
				messages: [],
				rooms: [],
				noticeNum: {}
			}
		},
		created() {
			if (!this.$store.state.hasLogin) return;
			uni.$on('login', data => {
				this.$refs.paging.reload()
			})
			this.getNoticeNum()
		},
		methods: {
			getData(page, limit) {
				if (!this.$store.state.hasLogin) return;
				this.$http.get('/chat/chatList', {
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
			goPrivate(data) {
				this.$Router.push({
					path: '/pages/notice/private',
					query: {
						id: data.id,
						receiver_id: data.userInfo.uid,
						nickname: data.userInfo.screenName ? data.userInfo.screenName : data.userInfo.name,
					}
				})
			},
			onRefresh() {
				if (this.$store.state.hasLogin) {
					this.getNoticeNum()
				}
			},
			goRoom(id) {

			},
			getNoticeNum() {
				if (!this.$store.state.hasLogin) return;
				this.$http.get('/user/noticeNum', {}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setNoticeNum', res.data.data)
					}
				})
			},
			goPath(path) {
				this.$Router.push({
					name: path
				})
			}
		}
	}
</script>

<style>
</style>