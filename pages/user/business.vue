<template>
	<z-paging-swiper>
		<u-navbar autoBack title="商家订单" placeholder bgColor="transparent">
		</u-navbar>
		<z-tabs :list="list" :current="tabIndex" :activeColor="'#88d8c0'" ref="tab"
			@change="tabIndex = $event" bgColor="transparent"></z-tabs>
			
			<swiper style="height: 100%;" :current="tabIndex"
				@animationfinish="tabIndex = $event.detail.current;$refs.tab.unlockDx()"
				@transition="$refs.tab.setDx($event.detail.dx)">
				<swiper-item v-for="(item,index) in list" :key="index">
					<businessItem :data="item" @address="orderId = $event.id;address = $event.address;showAddress = true"
						@buy="orderId = $event.id;$refs.payMent.open()" ref="page"></businessItem>
				</swiper-item>
			</swiper>
	</z-paging-swiper>
</template>

<script>
	import businessItem from "./components/business/business.vue";
	export default {
		components: {
			businessItem
		},
		data() {
			return {
				tabIndex: 0,
				list: [{
						name: '全部',
						order: [{
								order: 'paid',
								value: 1
							}]

					},
					{
						name: '待发货',
						order: [{
								order: 'isTracking',
								value: 0
							},
							{
								order: 'paid',
								value: 1
							}
						],
					},
					{
						name: '待收货',
						order: [{
							order: 'isTracking',
							value: 1
						}]

					}
				]
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>