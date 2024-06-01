<template>
	<view>
		<u-navbar title="举报" placeholder autoBack>
			<view slot="left">
				<i class="mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view style="margin: 30rpx;">
			<text>举报原因</text>
		</view>

		<view class="content">
			<u-radio-group v-model="value" iconPlacement="right" shape="square" placement="column">
				<u-radio label="虚假广告" class="radio" name="广告"></u-radio>
				<u-radio label="色情暴力" name="色情暴力" class="radio"></u-radio>
				<u-radio label="辱骂骚扰" name="辱骂骚扰" class="radio"></u-radio>
				<u-radio label="不实信息" name="不实信息" class="radio"></u-radio>
				<u-radio label="其他" name="其他" class="radio"></u-radio>
			</u-radio-group>
		</view>

		<view style="margin: 30rpx;">
			<text>描述</text>
		</view>
		<u-textarea placeholder="简单描述" border="none"></u-textarea>
		<view style="margin: 30rpx;">
			<u-button class="submit">提交</u-button>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0,
				user_id: 0,
				article_id: 0,
				info: {},
				value: '广告',

			};
		},
		onLoad(params) {
			console.log(params)
			this.type = params.type;
			this.user_id = params.user_id;
			this.article_id = params.article_id;
			this.getUser()
		},
		methods: {
			getUser() {
				this.$http.get('/user/userInfo', {
					params: {
						id: this.user_id
					}
				}).then(res => {
					this.info = res.data.data
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f9f9f9;
	}

	.radio {
		flex: 1;
		padding: 30rpx 0rpx;
	}

	.content {
		background-color: #fff;
		padding: 30rpx;
	}

	.submit {
		background-color: $c-primary;
		color: white;
	}
</style>