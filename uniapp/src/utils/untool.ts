import { allRoutePathMaps } from "@/router/constant"
import allPagePaths from "@/pages.json"
const allTabBarPages = allPagePaths.tabBar.list
const tabBarUrls = allTabBarPages.map(t=>t.pagePath)
const allPageConfMap:any = {}

allPagePaths.pages.map((t)=>{
	if(t && t.path){
		let key:string = t.path
		allPageConfMap[key] = allPageConfMap[key] || {}
		Object.assign(allPageConfMap[key], { ...t })
	}
})

const goto = (url='', type = 1)=> {
	if(!url) {
		console.error("goto 缺少入参 url=========")
		return 
	}
	url = url.replace(/^\/pages\//, '')
	url = url.replace(/^pages\//, '')
	url = `/pages/${url}`
	if(tabBarUrls.filter(t=> url.indexOf(t) > -1).length > 0) {
		// tabBar 使用 reLaunch切换，防止页面不刷新
		return uni.reLaunch({
			url
		});
	} 
	if (type == 1){
		uni.navigateTo({
			url
		});
	} else if (type == 2){
		 uni.redirectTo({
			url
		});
	}
}

const goBack = (opt:UniApp.NavigateBackOptions & { _finalUrl?:string } ={})=> {
	uni.navigateBack({
		fail: ()=>{
			goto(opt._finalUrl || tabBarUrls[0], 2)
		},
		...opt,
	})
}

const reLaunch = (opt: UniApp.ReLaunchOptions)=> {
	uni.reLaunch(opt)
}

const setClipboardData = (val='')=> {
	uni.setClipboardData({
		data: val,
		success: () => {
			showToast('复制成功')
		},
	})
}

const showToast = (val='')=> {
	uni.showToast({ title: val, icon: 'none' })
}

const confirmModal = (title:any='', opt = {}) => {
	return new Promise((resolve)=> {
		uni.showModal({ 
			content: title, confirmColor: '#B12D29', ...opt,
			success: (res)=> {
				if(res.confirm) {
					resolve(true)
				} else {
					resolve(false)
				}
			}
		})
	})
}

const showLoading = (title:any='')=> {
	uni.showLoading({
		mask: true,
		title: title || '加载中'
	});
}

const hideLoading = ()=> {
	uni.hideLoading();
}


const scanCode = ()=> {
	return new Promise((resolve, reject)=> {
		uni.scanCode({
			onlyFromCamera: false,
			success: (res) =>{
				console.log("scanCode res========", res)
				resolve(res.result)
			},
			fail: reject
		})
	})
}

const makePhoneCall = (phoneNumber:any='')=> {
	uni.makePhoneCall({
		phoneNumber: phoneNumber 
	});
}

const downloadFile = (url:any='', ext = {})=> {
	return new Promise((resolve, reject)=> {
		uni.downloadFile({
			url: url, 
			...ext,
			success: (res) => {
				console.log("downloadFile:success:res======", res)
				if (res.statusCode === 200 || res.statusCode === 400) {
					console.log('下载成功');
					resolve(res)
				} else {
					reject('下载失败')
				}
			},
			fail: (err)=>{
				console.log("downloadFile:err", err)
				reject(err)
			}
		});
	})
}

const saveFile = (opt:{ tempFilePath:string }={tempFilePath:''})=> {
	const { tempFilePath } = opt
	return new Promise(async (resolve, reject)=> {
		//保存到本地
		uni.saveFile({
			tempFilePath,//文件的临时路径
			success: function(res) {
				console.log("saveFile:success", res)
				resolve(res)
			},
			fail: function(err) {
				console.log("saveFile:err", err)
				reject(err)
			},
			complete(res){
				console.log("saveFile:complete", res)
			}
		});
	})
}

const getImageInfo = (src:any='')=> {
	return new Promise(async (resolve, reject)=> {
		uni.getImageInfo({
			src,
			success(res) {
				resolve(res)
			},
			fail(e) {
				console.log("获取图片信息失败=======", e)
				reject(e)
			}
		})
	})
}

const chooseImage = async(opt={})=> {
	return uniPromiseApi('chooseImage', {
		count: 1, // 最多可以选择的图片张数，默认为9
		sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
		sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
		...opt
	})
}


const uniPromiseApi = (name: string, options = {}, extObj:{successText?:any, failText?:any} = {  })=> {
	return new Promise((resolve, reject)=> {
		// @ts-ignore
		if(!(uni?.[name])) {
			console.error(`uni.${name}  api不存在 `)
			return reject(`uni.${name}  api不存在`)
		}
		// @ts-ignore
		uni?.[name]?.({
			...options,
			success(res:any){
				console.log(`uni.${name}  -execResult:success====`, res)
				if(extObj.successText) {
					showToast(extObj.successText)
				}
				resolve({ res })
			},
			fail(err:any){
				console.error(`uni.${name}  -execResult:fail====`, err)
				if(extObj.failText) {
					showToast(extObj.failText)
				}
				resolve({ err })
			}
		})
	})
}

const promiseTimeout = (time = 300) => {
	return new Promise((resolve, reject)=> {
		setTimeout(()=> {
			resolve(true)
		}, time)
	})
}

const setNavigationBarTitle = (title:any='')=> {
	uni.setNavigationBarTitle({
		title
	})
}

const getCurPage = ()=> {
	let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	let curPage:any = routes[routes.length - 1] // 获取当前页面路由，也就是最后一个打开的页面路由
	curPage._isTabarPage = tabBarUrls.indexOf(curPage.route) > -1
	curPage._style = allPageConfMap[curPage.route]?.style || {}
	return curPage
}

const reloadCurrentPage = (_thisPage:any)=> {
	let curPage = getCurPage()
	_thisPage = curPage || _thisPage
	let { fullPath } = _thisPage.$page
	goto(fullPath, 2)
}

const getHasPreviousPage = ()=> {
	let routes = getCurrentPages();
	let curPage:any = getCurPage()
	
	return routes.length > 1 && !curPage._isTabarPage
}

const playAudio = (src='')=> {
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	innerAudioContext.src = src
	innerAudioContext.onPlay(() => {
	  console.log('开始播放===');
	});
	innerAudioContext.onError((res) => {
	  console.log("playAudio onError ======", res);
	});
}
/**
 * 获取顶部导航栏相关参数（跨端兼容 App/微信小程序）
 * @returns {Object} { safeAreaTop: 顶部安全区高度, capsuleHeight: 胶囊高度, capsuleWidth, 胶囊高度, navBarHeight: 建议的 NavBar 总高度 }
 */
const getNavBarInfo = ()=>{
	let  scale = 1
	//#ifndef H5
	scale = 2
	//#endif
	const systemInfo = uni.getSystemInfoSync();
	const safeAreaTop = systemInfo.safeAreaInsets?.top || 0; // 顶部安全区高度（跨端）
	let capsuleHeight = 0; // 默认胶囊高度（微信标准，App 端用此默认值）
	let capsuleWidth = 0
	let navBarHeight = safeAreaTop + 44 * scale; // 默认 NavBar 高度（安全区 + 44px 内容区）

	
	// 仅小程序端获取胶囊信息（App 端无 wx.getMenuButtonBoundingClientRect）
    // #ifdef MP   
	try {
		const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
		if (menuButtonInfo) {
			capsuleHeight = menuButtonInfo.height; // 实际胶囊高度
			// 微信小程序 NavBar 建议高度：胶囊底部到屏幕顶部的距离（保证胶囊垂直居中）
			// navBarHeight = menuButtonInfo.bottom;
			console.log("getNavBarInfo:menuButtonInfo", menuButtonInfo)
		}
	} catch (e) {
		capsuleWidth = 60 * scale
		capsuleHeight = 32 * scale
		console.warn('获取微信胶囊信息失败，使用默认值', e);
	}
	//#endif
	let ret = {
		safeAreaTop: safeAreaTop,// 顶部安全区高度（必须用于 NavBar padding-top）
		capsuleHeight: capsuleHeight,// 胶囊高度（用于自定义按钮大小对齐）
		capsuleWidth: capsuleWidth,// 胶囊宽度（用于自定义按钮大小对齐）
		navBarHeight: navBarHeight,// 建议的 NavBar 总高度（安全区 + 内容区）
	}
	// 单位px
	console.log("getNavBarInfo:systemInfo", ret)
	return ret
}

const addCaclueUnit = (val:number = 0, unit:string = '')=> {
	//#ifdef H5
	unit = unit || 'px'
	//#endif
	
	//#ifndef H5
	unit = unit || 'px'
	//#endif
	return `${val}${unit}`
}


//rpx转px
const rpxToPx =(rpx:number) =>{
    return uni.upx2px(rpx)
}
 
//px转rpx
const pxToRpx =(px:number)=>{
    let scale = uni.upx2px(100)/100;
    return px/scale 
}

export {
	reLaunch,
	goto,
	goBack,
	setClipboardData,
	confirmModal,
	showLoading,
	hideLoading,
	showToast,
	scanCode,
	makePhoneCall,
	downloadFile,
	saveFile,
	getImageInfo,
	uniPromiseApi,
	promiseTimeout,
	setNavigationBarTitle,
	reloadCurrentPage,
	playAudio,
	allRoutePathMaps,
	allPageConfMap,
	allTabBarPages,
	getHasPreviousPage,
	getCurPage,
	getNavBarInfo,
	addCaclueUnit,
	chooseImage,
}
