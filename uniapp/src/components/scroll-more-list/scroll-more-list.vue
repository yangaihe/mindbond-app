<template>
	<scroll-view ref="scrollViewRef" :scroll-y="true" @scrolltolower="onScrollBottom()" 
		:refresher-enabled="false"
		:refresher-triggered="refresherTriggered" 
		:refresher-background="'transparent'" 
		@refresherrefresh="onPullDownRefresh()" :style="customStyle"
	>
		<slot></slot>

		<!-- 加载更多 -->
		<view v-if="showLoadMore" class="bottomstatus">
			<u-loadmore  icon-size="28" font-size="28"  
			status="loading" />
		</view>
		
		
		<!-- 没有更多了 -->
		<view v-if="showLoadedAll && loadedAll && resObject.list?.length !== 0" class="bottomstatus">
			<u-loadmore  icon-size="28" font-size="28"
				status="nomore" />
		</view>
		
		<!-- 空数据页 -->
		<view v-if="!showLoadMore && resObject.list?.length == 0" class="bottomstatus">
			<u-empty text="无数据" :icon="''" textSize="28" :width="emptSizeMap[size].width" :height="emptSizeMap[size].height">
			</u-empty>
		</view>
		
	</scroll-view>
</template>

<script>
	const emptSizeMap = {
		dfl: {
			width: 86,
			height: 97,
			pdTB: 100,
		},
		sm: {
			width: 42,
			height: 48,
			pdTB: 30,
		}
	}
	export default {
		watch: {
			searchParam: {
				handler: function(cval, oval) {
					if(this.autoReload) {
						this.getDataList(true)
					}
				},
				deep: true
			}
		},
		computed: {
			customStyle() {
				let stl = `height: 100%;`
				if(this.maxHeight) {
					stl += `max-height:${this.maxHeight};`
				}
				return `${stl};${this.rootStyle};`
			}
		},
		props: {
			createReload: {
				default () {
					return true
				}
			},
			autoReload: {
				default () {
					return true
				}
			},
			searchParam: {
				default () {
					return {}
				}
			},
			showLoadedAll: {
				default () {
					return true
				}
			},
			getListFun: {
				default () {
					return null
				}
			},
			resObject: {
				default () {
					return {
						list: []
					}
				}
			},
			size: {
				default () {
					return 'dfl'
				}
			},
			pageSize: {
				default () {
					return 20
				}
			},
			maxHeight: {
				default () {
					return ''
				}
			},
			rootStyle: {
				default () {
					return ''
				}
			}
		},
		data() {
			return {
				emptSizeMap,
				reqLoading: false,
				refresherTriggered: false, // 是否正在下拉刷新
				page: { // 分页参数
					pageNum: 1,
					pageSize: this.pageSize,
				},
				showLoadMore: false, // 是否显示加载更多的loading
				loadedAll: false, // 是否加载了所有数据
			}
		},
		created() {
			if(this.createReload) {
				this.getDataList(true)
			}
		},
		onHide() {

		},
		unmounted() {},

		methods: {
			async onPullDownRefresh() {
				console.log('scroll-more-list  onPullDownRefresh================')
				// 设置下拉刷新状态为 true
				this.refresherTriggered = true
				this.$emit('onPullDownRefresh')
				try {
					await this.getDataList(true)
				} catch (error) {
					console.error('scroll-more-list  onPullDownRefresh error', error)
				} finally {
					// 无论请求成功还是失败，都关闭下拉刷新状态
					this.refresherTriggered = false
				}
			},
			async onScrollBottom() {
				console.log('scroll-more-list  onScrollBottom================')
				this.$emit('onScrollBottom')
				if (this.loadedAll || this.showLoadMore) {
					return
				}
				this.showLoadMore = true
				this.page.pageNum++
				try{
					await this.getDataList()
				}catch(e){
					// 滚动下一页加载失败，重置 page.pageNum
					this.page.pageNum -- 
				}
				this.showLoadMore = false
			},
			async getDataList(reload) {
				if(!this.getListFun) {
					return
				}
				if (reload) {
					this.$emit('onListReload', this.searchParam)
					this.page.pageNum = 1
					// this.showLoading()
				}
				this.reqLoading = true
				const res = await this.getListFun({
					...this.page,
					...this.searchParam
				})
				this.reqLoading = false
				let list = res.list || []
				if (reload) {
					// this.hideLoading()
				} else {
					list = this.resObject.list.concat(list)
				}
				this.loadedAll = res.total <= list.length
				this.refresherTriggered = false
				this.updateRes({
					list,
					total: res.total
				})
			},
			updateRes(obj) {
				const res = {
					...this.resObject,
					page: this.page,
					showLoadMore: this.showLoadMore,
					loadedAll: this.loadedAll,
					reqLoading: this.reqLoading,
					...obj,
				}
				this.$emit('update:resObject', res)
				this.$emit('onListChange', res)
			}
		}
	}
</script>

<style scoped lang="scss">
	.sch-cont {
		position: relative;
	}
	.bottomstatus{
		padding: 20rpx 0;
	}
</style>