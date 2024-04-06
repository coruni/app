<template>
	<view
		class="u-avatar"
		:class="[`u-avatar--${shape}`]"
		:style="[{
			backgroundColor: (text || icon) ? (randomBgColor ? colors[colorIndex !== '' ? colorIndex : $u.random(0, 19)] : bgColor) : 'transparent',
			width: $u.addUnit(size),
			height: $u.addUnit(size),
		}, $u.addStyle(customStyle)]"
		@tap="clickHandler"
	>
		<slot>
			<!-- #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU  -->
			<open-data
				v-if="mpAvatar && allowMp"
				type="userAvatarUrl"
				:style="[{
					width: $u.addUnit(size),
					height: $u.addUnit(size)
				}]"
			/>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN && MP-QQ && MP-BAIDU  -->
			<template v-if="mpAvatar && allowMp"></template>
			<!-- #endif -->
			<u-icon
				v-else-if="icon"
				:name="icon"
				:size="fontSize"
				:color="color"
			></u-icon>
			<u--text
				v-else-if="text"
				:text="text"
				:size="fontSize"
				:color="color"
				align="center"
				customStyle="justify-content: center"
			></u--text>
			<image
				class="u-avatar__image"
				v-else
				:class="[`u-avatar__image--${shape}`]"
				:src="avatarUrl || defaultUrl"
				:mode="mode"
				@error="errorHandler"
				:style="[{
					width: $u.addUnit(size),
					height: $u.addUnit(size)
				}]"
			></image>
		</slot>
	</view>
</template>

<script>
	import props from './props.js';
	const base64Avatar =
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoCAYAAAB65WHVAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABJiSURBVHgB7d1bj13lecDxlzHYBuMjPqDYQDCCmEoxlUqoEhV6UbioQm6iXPbD9KZfoPe5aqL2IkFVai4aiJTEaqRAicBINUc3GAweYzP2+DAHy3bXs2FNx/ac9157PWvv30/amvFgyWaW93/e/ax3rX3Pr37zp1sFgGxuTRQAUhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkhJogKQEGiApgQZISqABkrq3QMfduHGj3Lh587avbZqYKJs2bSrQZQJNK+qozs/P9x7h+vXr5Wb1tfhvYb76de/jN/+9/j39uO+++xY+37x5c+9jhDyCXv+3+Nj7WvWI3yP2tEWgaUTEtY5vRDUe9dduLrHiHZbFgV9P7HsBj1hHtKuA3/fNIwLeeywKPwyKQLNhsdKN6M7MzJS5ubmFz9sMcFPi/+fG7Gzv86vL/J6tW7cuxPqBBx7oxfz+6mtW32yUQLMmdXyvXbu28Hm/44ZRM1sFfPabiJcLFxa+Xod765Ytvc/v/+bXsBqB5i6xMr5y9WqZrVbFEZyr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"
	/**
	 * Avatar  头像
	 * @description 本组件一般用于展示头像的地方，如个人中心，或者评论列表页的用户头像展示等场所。
	 * @tutorial https://www.uviewui.com/components/avatar.html
	 *
	 * @property {String}			src				头像路径，如加载失败，将会显示默认头像(不能为相对路径)
	 * @property {String}			shape			头像形状  （ circle (默认) | square）
	 * @property {String | Number}	size			头像尺寸，可以为指定字符串(large, default, mini)，或者数值 （默认 40 ）
	 * @property {String}			mode			头像图片的裁剪类型，与uni的image组件的mode参数一致，如效果达不到需求，可尝试传widthFix值 （默认 'scaleToFill' ）
	 * @property {String}			text			用文字替代图片，级别优先于src
	 * @property {String}			bgColor			背景颜色，一般显示文字时用 （默认 '#c0c4cc' ）
	 * @property {String}			color			文字颜色 （默认 '#ffffff' ）
	 * @property {String | Number}	fontSize		文字大小  （默认 18 ）
	 * @property {String}			icon			显示的图标
	 * @property {Boolean}			mpAvatar		显示小程序头像，只对百度，微信，QQ小程序有效  （默认 false ）
	 * @property {Boolean}			randomBgColor	是否使用随机背景色  （默认 false ）
	 * @property {String}			defaultUrl		加载失败的默认头像(组件有内置默认图片)
	 * @property {String | Number}	colorIndex		如果配置了randomBgColor为true，且配置了此值，则从默认的背景色数组中取出对应索引的颜色值，取值0-19之间
	 * @property {String}			name			组件标识符  （默认 'level' ）
	 * @property {Object}			customStyle		定义需要用到的外部样式
	 *
	 * @event    {Function}        click       点击组件时触发   index: 用户传递的标识符
	 * @example  <u-avatar :src="src" mode="square"></u-avatar>
	 */
	export default {
		name: 'u-avatar',
		mixins: [uni.$u.mpMixin, uni.$u.mixin, props],
		data() {
			return {
				// 如果配置randomBgColor参数为true，在图标或者文字的模式下，会随机从中取出一个颜色值当做背景色
				colors: ['#ffb34b', '#f2bba9', '#f7a196', '#f18080', '#88a867', '#bfbf39', '#89c152', '#94d554', '#f19ec2',
					'#afaae4', '#e1b0df', '#c38cc1', '#72dcdc', '#9acdcb', '#77b1cc', '#448aca', '#86cefa', '#98d1ee',
					'#73d1f1',
					'#80a7dc'
				],
				avatarUrl: this.src,
				allowMp: false
			}
		},
		watch: {
			// 监听头像src的变化，赋值给内部的avatarUrl变量，因为图片加载失败时，需要修改图片的src为默认值
			// 而组件内部不能直接修改props的值，所以需要一个中间变量
			src: {
				immediate: true,
				handler(newVal) {
					this.avatarUrl = newVal
					// 如果没有传src，则主动触发error事件，用于显示默认的头像，否则src为''空字符等的时候，会无内容展示
					if(!newVal) {
						this.errorHandler()
					}
				}
			}
		},
		computed: {
			imageStyle() {
				const style = {}
				return style
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				// 目前只有这几个小程序平台具有open-data标签
				// 其他平台可以通过uni.getUserInfo类似接口获取信息，但是需要弹窗授权(首次)，不合符组件逻辑
				// 故目前自动获取小程序头像只支持这几个平台
				// #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU
				this.allowMp = true
				// #endif
			},
			// 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
			isImg() {
				return this.src.indexOf('/') !== -1
			},
			// 图片加载时失败时触发
			errorHandler() {
				this.avatarUrl = this.defaultUrl || base64Avatar
			},
			clickHandler() {
				this.$emit('click', this.name)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/components.scss";

	.u-avatar {
		@include flex;
		align-items: center;
		justify-content: center;

		&--circle {
			border-radius: 100px;
		}

		&--square {
			border-radius: 4px;
		}

		&__image {
			&--circle {
				border-radius: 50%;
			}

			&--square {
				border-radius: 4px;
			}
		}
	}
</style>
