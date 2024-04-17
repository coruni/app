const state = {
    socketTask: null,
    isSocketOpen: false,
    heartbeatInterval: null,
    reconnectTimeout: null
};

const mutations = {
    SET_SOCKET_TASK(state, socketTask) {
        state.socketTask = socketTask;
    },
    SET_SOCKET_OPEN(state, isOpen) {
        state.isSocketOpen = isOpen;
    },
    SET_HEARTBEAT_INTERVAL(state, interval) {
        state.heartbeatInterval = interval;
    },
    SET_RECONNECT_TIMEOUT(state, timeout) {
        state.reconnectTimeout = timeout;
    }
};

const actions = {
    connectWebSocket({ commit, dispatch }, url) {
        let socketTask = uni.connectSocket({
            url: url,
            success: () => {
                commit('SET_SOCKET_TASK', socketTask);
                commit('SET_SOCKET_OPEN', true);
                dispatch('startHeartbeat');
            }
        });

        socketTask.onMessage((res) => {
            // 处理收到的消息
            console.log('收到 WebSocket 消息：', res);
        });

        socketTask.onClose(() => {
            // WebSocket 连接关闭时触发重连
            commit('SET_SOCKET_OPEN', false);
            dispatch('reconnectWebSocket');
        });
    },
    sendWebSocketMessage({ state }, message) {
        if (state.isSocketOpen) {
            state.socketTask.send({
                data: message,
                async success() {
                    console.log("消息发送成功");
                },
            });
        }
    },
    startHeartbeat({ state, dispatch }) {
        state.heartbeatInterval = setInterval(() => {
            let data = { type: "PING", text: "PING" };
            dispatch('sendWebSocketMessage', JSON.stringify(data));
        }, 3000); // 间隔时间根据实际情况调整
    },
    reconnectWebSocket({ state, dispatch }) {
        clearInterval(state.heartbeatInterval);
        if (!state.isSocketOpen) {
            state.reconnectTimeout = setTimeout(() => {
                dispatch('connectWebSocket');
            }, 3000); // 重连间隔时间根据实际情况调整
        }
    }
};

const getters = {
    isSocketOpen: state => state.isSocketOpen
};

export default {
    state,
    mutations,
    actions,
    getters
};
