import cConfig from '@/config/config.js'
import Request from '@/utils/luch-request/index.js'
import store from '@/store'
import {
	router
} from '@/router.js'
const http = new Request()
// 全局配置
http.setConfig((config) => {
	config.baseURL = cConfig.api
	config.header = {
		'Content-Type': 'application/x-www-form-urlencoded',
	}


	config.timeout = 60 * 1000
	return config
})


// 请求拦截
//   所有的网络请求都会先走这个方法
http.interceptors.request.use((config) => {
	config.header = {
		...config.header,
		'Authorization': uni.getStorageSync('token')
	}

	if (!store.state.hasLogin && config.method == 'POST') {
		router.push({
			path: '/pages/user/login',
			animationType: 'slide-in-bottom',
			animationDuration: 500
		})
		return Promise.reject(config)
	}
	return config
}, (config) => {
	return Promise.reject(config)
})

// 刷新请求
const is_fresh = false
const refresh = new Request()
refresh.setConfig((config) => {
	/* 设置全局配置 */
	config.baseURL = cConfig.api
	config.header = {
		'Refresh-Token': uni.getStorageSync('refresh_token') || '',
	}
	config.timeout = 60 * 1000
	return config
})

// 请求后刷新
const againHttp = new Request()
againHttp.interceptors.request.use(config => {
	config.baseURL = cConfig.api
	return config
}, error => {
	return Promise.reject(error)
})
// 响应拦截
//   所有的网络请求返回数据之后都会先执行这个方法
http.interceptors.response.use(async (response) => {
	let code = response.data.code
	if (store.state.hasLogin && (code == 401 || code == 402 || code == 403 || code == 404)) {
		let refresh_token = uni.getStorageSync('refresh_token')
		try {
			const res = await refresh.post('/user/refresh')
			if (res.data.code == 200) {
				store.commit('setToken', res.data.token)
				try {
					const againhttp = await againHttp.middleware(response.config)
					return againhttp
				} catch (e) {
					//TODO handle the exception
					return Promise.reject(e)
				}
			} else {
				uni.$u.toast('请重新登录')
				store.commit('logout')
				router.push({
					path: '/pages/user/login',
					animationType: 'slide-in-bottom',
					animationDuration: 500
				})
			}
		} catch (e) {
			//TODO handle the exception
			return Promise.reject(e)
		}
	} else {
		uni.$u.toast('请重新登录')
		store.commit('logout')
		router.push({
			path: '/pages/user/login',
			animationType: 'slide-in-bottom',
			animationDuration: 500
		})
	}

	return response
}, error => {
	return Promise.reject(error)
})

export {
	http
}