<template>
	<view>
		<u-navbar autoBack bgColor="transparent" leftIconColor="white" leftIcon="close" placeholder>
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view style="text-align: center;">
			<view style="margin-top:40%;position: relative;display:inline-block;">
				<u-avatar :src="userInfo.avatar" size="220" customStyle="flex:1"></u-avatar>
				<image class="avatar_head" mode="aspectFill"
					:src="userInfo.opt && userInfo.opt.headStatus && userInfo.opt.head_picture">
				</image>
			</view>
		</view>
		<view
			style="padding:26rpx 20rpx; font-size:30rpx;color: white;background: rgba(255, 255, 255, 0.1);margin:40rpx;margin-top: 50% !important;border-radius: 20rpx;">
			<u-row customStyle="flex-direction:column">
				<text @click="goHeadPictureChange()">更改头像挂件</text>
				<u-gap height="18"></u-gap>
				<text @click="choose()">修改头像</text>
			</u-row>
		</view>
		<l-clipper v-if="showClipper" :imageUrl="image" @success="upload($event.url);showClipper=false;showLoading=true"
			@canel="showClipper = false" is-limit-move is-lock-ratio></l-clipper>

		<u-modal ref="uModal" :title="!isError.status?'上传中...':'上传错误'" :show="showLoading" :showConfirmButton="false"
			:closeOnClickOverlay="isError.status" @close="showLoading= false;isError.status=false;isError.msg=null">
			<u-loading-icon color="#88d8c0" mode="circle" :show="!isError.status"></u-loading-icon>
			<text v-if="isError.msg" style="font-size: 30rpx;text-align: center;">{{isError.msg}}</text>
		</u-modal>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {
		data() {
			return {
				info: {},
				showClipper: false,
				image: null,
				showLoading: false,
				isError: {
					status: false,
					msg: null,
				}
			};
		},
		computed:{
			...mapState(['userInfo'])
		},
		created() {
			if (this.$store.state.hasLogin) {
				this.info = uni.getStorageSync('user')
			}
		},
		methods: {
			choose() {
				uni.chooseImage({
					count: 1,
					success: res => {
						this.image = res.tempFilePaths[0]
						this.showClipper = true
					}
				})
			},
			upload(url) {
				this.$http.upload('/upload/full', {
					filePath: url,
					name: 'file'
				}).then(res => {
					if (res.data.code) {
						this.save(res.data.data.url)
					} else {
						this.isError.status = true
						this.isError.msg = res.data.msg
					}
				}).catch(err => {
					this.isError.status = true
					this.isError.msg = res.data.msg
				})
			},
			save(url) {
				this.$http.post('/user/userEdit', {
					params: JSON.stringify({
						uid: this.info.uid,
						name: this.info.name,
						avatar: url,
					})
				}).then(res => {
					
					if (res.data.code) {
						this.getUserInfo()
						uni.$u.toast('资料已更新')
					}
				}).catch(err => {
					console.log(err)
					this.isError.status = true
					this.isError.msg = res.data.msg
				})
			},
			getUserInfo() {
				this.$http.get('/user/userInfo', {
					params: {
						key: this.info.uid
					}
				}).then(res => {
					if (res.data.code) {
						this.$store.commit('setUser', res.data.data)
						this.showLoading = false
					} else {
						this.isError.status = true
						this.isError.msg = res.data.msg
						
					}
				}).catch(err => {})
			},
			goHeadPictureChange(){
				this.$Router.push({name:'headPictureChange'})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #1b1b1b;
	}
</style>