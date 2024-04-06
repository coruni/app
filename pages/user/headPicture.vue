<template>
	<view>
		<u-navbar title="更改挂件" placeholder autoBack bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view style="margin: 30rpx; height: 100%;">
			<view style="display: flex;justify-content: center;height: 400rpx;align-items: center;">
				<view style="position: relative;">
					<u-avatar :src="userInfo.avatar" :size="85"></u-avatar>
					<image :src="userInfo&& userInfo.opt && userInfo.opt.head_picture" class="avatar_head"
						mode="aspectFill"></image>
				</view>

			</view>
			<u-button style="color: black;" color="#f7f7f7" shape="square" @click="clear()">取消佩戴</u-button>
		</view>
		<z-paging @query="getData" ref="paging" v-model="headPicture" :fixed="false" :refresher-enabled="false"
			use-page-scroll>
			<u-grid col="4">
				<u-grid-item v-for="(item,index) in headPicture" :key="index"
					customStyle="flex-wrap:wrap;height:180rpx;width:180rpx"
					@click="$u.throttle(setHeadPicture(item),1000,true)">
					<view style="position: relative;top: 0;margin:30rpx;padding-left: 10rpx">
						<u-avatar :src="userInfo.avatar" size="60"></u-avatar>
						<image :src="item.link" class="avatar_head" mode="aspectFit"></image>
					</view>
				</u-grid-item>
			</u-grid>
			<view slot="loadingMoreNoMore"></view>
		</z-paging>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import album from '../../uni_modules/uview-ui/libs/config/props/album';
	import upload from '../../uni_modules/uview-ui/libs/config/props/upload';
	export default {
		data() {
			return {
				showMyHead: false,
				showHeadUpload: false,
				headPicture: [],
				uploadHeadPic: null,
				myHead: [],
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		created() {

		},
		methods: {
			getData(page, limit) {
				this.$http.get('/headpicture/list', {
					params: {
						page,
						limit: 50,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			},
			getMyHead() {
				this.$http.get('/headpicture/list', {
					params: {
						limit: 50,
						self: 1
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.myHead = res.data.data.data
					}
				})
			},
			setHeadPicture(data) {
				this.$http.post('/headpicture/set', {
					id: data.id
				}).then(res => {
					if (res.data.code == 200) {
						this.getUserInfo()
					}
					uni.$u.toast(res.data.msg)
				})
			},
			getUserInfo() {
				if (!uni.getStorageSync('token')) return;
				this.$http.get('/user/userInfo', {
					params: {
						id: this.userInfo.uid,
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.$store.commit('setUser', res.data.data)
					}

				}).catch(err => {
					console.log(err)
				})
			},
			chooseHead() {
				uni.chooseImage({
					sizeType: ['original'],
					sourceType: ['album'],
					extension: ['png', 'webp'],
					success: (res) => {
						this.uploadHeadPic = res.tempFilePaths[0]
					}
				})
			},
			async addHead() {
				let permission = false
				if (this.userInfo.group == 'administrator' || this.userInfo.group == 'editor') permission = true;
				if (!permission && !this.userInfo.isVip) {
					uni.$u.toast('非会员用户或权限不足');
					return;
				}
				if (this.uploadHeadPic == null || this.uploadHeadPic == '') {
					uni.$u.toast('你还没有选择头像框');
					return;
				}
				uni.showLoading({
					title: '上传中...',
					mask: true,
				})
				let headImg = await this.upload()
				if (headImg) {
					this.$http.post('/headpicture/add', {
						name: `用户${this.userInfo.uid}`,
						link: headImg
					}).then(res => {
						if (res.data.code == 200) {
							this.setHeadPicture(res.data.data)
						}
						uni.hideLoading()
						setTimeout(() => {
							uni.$u.toast(res.data.msg)
						}, 800)

					}).catch(err => {
						uni.hideLoading()
						setTimeout(() => {
							uni.$u.toast('网络错误')
						}, 800)
					})

				}
			},
			upload() {
				return new Promise((resolve, reject) => {
					this.$http.upload('/upload/full', {
						filePath: this.uploadHeadPic,
						name: 'file'
					}).then(res => {
						if (res.data.code) {
							resolve(res.data.data.url)
						}
					}).catch(err => {
						uni.hideLoading()
						setTimeout(() => {
							uni.$u.toast('网络错误')
						}, 800)
					})
				})
			},
			clear() {
				this.$http.post('/headpicture/clear').then(res => {
					if (res.data.code == 200) {
						this.getUserInfo()
					}
				})
			}
		}
	}
</script>

<style lang="scss">

</style>