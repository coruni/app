import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: { //存放状态
		userInfo: {},
		userMeta: {},
		token: null,
		config: {},
		hasLogin: false,
		appInfo: {},
		noticeNum: {},
		homepage: [],
		tasks: {},
		swiper: [],
		homeTabs: [],
		history: [],
	},
	mutations: {
		setToken(state, payload) {
			state.token = payload
			state.hasLogin = true
			uni.setStorage({
				key: 'token',
				data: payload
			})
		},
		setUser(state, payload) {
			state.userInfo = payload
			uni.setStorage({
				key: 'user',
				data: payload
			})
		},
		setAppInfo(state, payload) {
			state.appInfo = payload
			uni.setStorage({
				key: 'appInfo',
				data: payload
			})
		},
		setHomepage(state, payload) {
			state.homepage = payload
			uni.setStorage({
				key: 'appHomepage',
				data: payload
			})
		},
		setUserMeta(state, payload) {
			state.userMeta = payload
			uni.setStorage({
				key: 'userMeta',
				data: payload
			})
		},
		loginStatus(state, payload) {
			state.hasLogin = true
		},
		setNoticeNum(state, payload) {
			state.noticeNum = payload
		},
		setTasks(state, payload) {
			state.tasks = payload
			uni.setStorage({
				key: 'userTasks',
				data: payload
			})
		},
		logout(state, payload) {
			uni.clearStorage('user');
			uni.clearStorage('token');
			uni.clearStorage('account');
			state.userInfo = {};
			state.token = null;
			state.hasLogin = false
			uni.reLaunch({
				url: '/pages/index/index'
			})
		},
		setSwiper(state, payload) {
			uni.setStorage({
				key: 'swiper',
				data: payload,
			})
			state.swiper = payload
		},
		setTabs(state, payload) {
			uni.setStorage({
				data: payload,
				key: 'homeTabs'
			})
			state.homeTabs = payload
		},
		setHistory(state, payload) {
		    if (!payload) return;
		    
		    let data = uni.getStorageSync('history') || [];
		    
		    if (Array.isArray(payload)) {
		        // 如果传入的是数组，直接赋值给历史记录数组
		        data = payload;
		    } else if (typeof payload === 'object') {
		        let index = data.findIndex(item => item.cid === payload.cid);
		        if (index !== -1) {
		            // 如果存在相同 id 的数据，删除旧数据，存入新数据
		            data.splice(index, 1, payload);
		        } else {
		            // 如果不存在相同 id 的数据，直接添加新数据到数组开头
		            data.unshift(payload);
		        }
		    }
		    state.history = data;
		    uni.setStorage({
		        data: data,
		        key: 'history'
		    });
		},
		clearHistory(state) {
			return new Promise((resolve, reject) => {
				state.history = [];
				uni.removeStorage({
					key: 'history',
					success: () => {
						uni.$u.toast('已清除全部历史记录')
					}
				})
			})
		}
	}
})
export default store