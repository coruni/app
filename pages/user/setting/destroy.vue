<template>
	<view>
		<u-navbar title="注销账号" placeholder autoBack bgColor="transparent">
			<view slot="left">
				<i class="ess mgc_left_line" style="font-size: 60rpx;"></i>
			</view>
		</u-navbar>
		<view style="padding: 30rpx;">
			<text>
				注销账号须知

				尊敬的用户，

				感谢您选择使用我们的服务。在您选择注销账号之前，请务必详细阅读以下须知，并确认您已充分了解和接受以下内容：

				1. 账号信息丢失： 注销账号将导致您的所有账号信息被永久删除，包括但不限于个人资料、历史记录、购买记录、收藏夹和设置等。这些信息无法恢复，请确认您已备份重要信息。

				2. 无法撤销操作： 注销账号是一个无法撤销的操作，一旦注销成功，您将无法再次登录该账号或恢复其信息。请慎重考虑后再进行操作。

				3. 影响服务使用： 注销账号后，您将无法再使用我们的服务和功能，需要重新注册一个新账号才能再次使用。您可能需要重新设置个人偏好和收藏等信息。

				4. 处理个人数据： 我们将根据适用的法律要求或公司政策处理您的个人数据。您可以查阅我们的隐私政策以了解我们的数据处理方式和保护措施。

				5. 确认操作： 请再次确认您的决定。如果您有任何疑问或需要帮助，我们的客户服务团队随时为您提供支持。请联系我们以获得进一步指导。

				6. 输入确认密码： 请在下方输入您的账号密码以确认注销操作。这是为了确保只有账号所有者本人可以进行注销操作。</text>


			<view style="margin-top: 30rpx;">
				<u-checkbox-group>
					<u-checkbox v-model="accept" activeColor="#88d8c0" size="mini" shape="circle"
						@change="accept = !accept" label="注销账号则代表您已阅读并同意本协议"></u-checkbox>
				</u-checkbox-group>

				<view style="margin-top: 30rpx;">
					<u-button shape="circle" color="#88d8c0" style="box-shadow: #88d8c0 0 0 8rpx 0 ;"
						@click="destroyAccount">确定注销</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				accept: false,
			}
		},
		methods: {
			destroyAccount() {
				if (!this.accept) {
					uni.$u.toast('请先同意协议！')
					return;
				}
				this.$http.post('/user/destroy').then(res => {
					if (res.data.code == 200) {
						uni.$u.toast(res.data.msg)
						setTimeout(() => {
							this.$store.commit('logout');
						}, 2000)
					}
				})

			}
		}
	}
</script>

<style>

</style>