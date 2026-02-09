<template>
	<view class="pg-cont" :style="rootStyle">
		<view class="">
			<slot name="header"></slot>
		</view>
		<view class="pg-body" :style="bodyStyle">
			<slot name="body"></slot>
		</view>
		<view class="" :style="footerStyle">
			<slot name="footer"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			rootStyle: {
				default () {
					return ''
				}
			},
			bodyStyle: {
				default () {
					return ''
				}
			},
			footerStyle: {
				default () {
					return ''
				}
			},
		},
		data() {
			return {

			}
		},
		created() {

		},
		onHide() {

		},
		unmounted() {},
		
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
	.pg-cont{
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	.pg-body{
		min-height: 0;
		flex: 1 1 auto;
		max-height: 100%;
		overflow: auto;
	}
</style>