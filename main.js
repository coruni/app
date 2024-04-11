import moment from 'moment';
import App from './App';
import store from './store';
import config from "./config/config.js";

//引入websocket文件
import wsRequest from './utils/websocket/websocket.js'

// #ifndef VUE3
import Vue from 'vue'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
import {
	router,
	RouterMount
} from '@/router.js' //路径换成自己的
Vue.use(router)
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store
})
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app,
		store
	}
}
// #endif

// http模块
import {
	http
} from '@/utils/luch-request/http.js'
Vue.prototype.$http = http

//全局挂载表情数据
import emoji from '@/static/emoji/emoji.json'
Vue.prototype.$emoji = emoji

import level from '@/config/level.js'
Vue.prototype.$level = level
Vue.prototype.$config = config
// 引入全局函数
import common from "./common/common.js"
Vue.prototype.$common = common

// #ifdef H5
import quill from "quill";
window.Quill = quill;
// #endif

uni.getStorage({
	key: 'token'
}).then(() => {
	//开启websocket
	let websocket = new wsRequest(config.websocket + `?token=${uni.getStorageSync('token')||''}`, 3000)
	//挂载到全局
	Vue.prototype.$socket = websocket

})
// z-paging配置 这个不是必须的，请自行修改
uni.$zp = {
	config: {
		//配置分页默认pageSize为15
		'default-page-size': '15',
		//配置空数据图默认描述文字为：空空如也~~
		'empty-view-text': '空数据',
		'loading-more-no-more-text': '无数据',
		'loading-more-fail-text': '错误数据',
		'loading-more-loading-text': '加载中',
		'refresher-default-text': '下拉重载',
		'refresher-pulling-text': '释放重载',
		'refresher-refreshing-text': '重载中...',
		'refresher-complete-text': '已重载'
		//...
	}
}


// 适配深色模式
uni.setNavStyle = () => {
	const theme = uni.getSystemInfoSync().theme
	// App端
	// #ifdef APP-PLUS
	plus.navigator.setStatusBarStyle(theme === 'dark' ? 'light' : 'dark') // 只支持dark和light
	// #endif

	// 小程序端
	// #ifdef MP-WEIXIN
	uni.setNavigationBarColor({
		frontColor: theme === 'dark' ? '#fff' : '#000',
		backgroundColor: theme === 'dark' ? '#000' : '#fff'
	})
	// #endif
}