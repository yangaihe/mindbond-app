import {
	confirmModal,
	showLoading,
	hideLoading,
	showToast
} from "@/utils/untool"
import { getLastAppVersion } from "@/api/app"

export const getSystemInfo = () => {
	let info = uni.getSystemInfoSync()
	// console.log('getSystemInfo=====', info)
	return info
}

export const getCurrentAppInfo = () => {
	return new Promise((resolve, reject) => {
		// 保存 app 版本信息
		// #ifdef APP-PLUS
		plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
			console.log('plus.runtime.appid=========', plus.runtime.appid);
			console.log('widgetInfo=========', widgetInfo);
			widgetInfo._appVersion = `${widgetInfo.version}.${widgetInfo.versionCode}`;
			uni.setStorageSync('_appVersion', widgetInfo._appVersion);
			resolve(widgetInfo)
		});
		// #endif

		// #ifndef APP-PLUS
		// TODO MOCK数据
		resolve({})
		// #endif
	})
}

const installNewApk = (url) => {
	console.log("installNewApk url===", url)
	return new Promise((resolve, reject) => {
		showLoading('正在下载资源文件，请稍等...')
		let downInstance = uni.downloadFile({
			url: url,
			success: (downloadResult) => {
				console.log("===downloadResult===", downloadResult)
				hideLoading()
				if (downloadResult.statusCode === 200) {
					showLoading('正在安装...')
					// #ifdef APP-PLUS
					plus.runtime.install(downloadResult.tempFilePath, {
						force: true
					}, function() {
						hideLoading()
						console.log('install success...');
						plus.runtime.restart();
						resolve()
					}, function(e) {
						hideLoading()
						console.error('install fail...');
						reject()
					});
					// #endif
				} else {
					showToast(`文件下载失败, 错误码：${downloadResult.statusCode}`)
					reject()
				}
			},
			fail: (err) => {
				console.log('download file err...', err);
				showToast("文件下载失败")
				hideLoading()
			}
		});
		downInstance.onProgressUpdate((res) => {
			let {
				totalBytesExpectedToWrite,
				totalBytesWritten
			} = res
			let percent = (totalBytesWritten / totalBytesExpectedToWrite) * 100
			// showLoading(`下载进度：${parseInt(percent)}%`)
		})
	})
}

const getLastAppInfo = async (curAppInfo) => {
	let {
		version,
		versionCode
	} = curAppInfo
	let {
		deviceId
	} = getSystemInfo()
	let res = await getLastAppVersion({
		version,
		versionCode,
		deviceId
	})
	console.log("getLastAppInfo res====", res)
	// res = { 
	// 	version: '1.0.0',
	// 	versionCode: 100,
	// 	domain: 'http://192.168.1.7:5173',
	// 	apkUrl: 'http://192.168.1.7:5173/static/t.apk',
	// 	wgtUrl: 'http://192.168.1.7:5173/static/t.wgt',
	// 	whiteDeviceIds: ['F9E778C90D0E9A8DA9D95AA97B00A3FB'],
	// 	remark: '',
	// }
	return res
}

const compareInfo = (curAppInfo, lastAppInfo) => {
	let hasNewVersion = false
	let url = ''
	// 强制更新app
	if (lastAppInfo.version && curAppInfo.version != lastAppInfo.version) {
		hasNewVersion = true
		url = lastAppInfo.apkUrl
	}
	// 热更新
	if (!url && lastAppInfo.versionCode && curAppInfo.versionCode != lastAppInfo.versionCode) {
		hasNewVersion = true
		url = lastAppInfo.wgtUrl
	}
	// 判断是否走白名单更新
	if (url && lastAppInfo.whiteDeviceIds?.length > 0) {
		let sysInfo = getSystemInfo()
		hasNewVersion = lastAppInfo.whiteDeviceIds.indexOf(sysInfo?.deviceId) > -1
	}
	url = `${lastAppInfo.domain}${url}`
	return {
		hasNewVersion,
		url,
		lastAppInfo
	}
}

export const getCompareVersion = async () => {
	let curAppInfo = await getCurrentAppInfo()
	let lastAppInfo = await getLastAppInfo(curAppInfo)
	let cmpRes = await compareInfo(curAppInfo, lastAppInfo)
	console.log("checkUpdate cmpRes ====", cmpRes)
	return cmpRes
}

export const checkUpdate = async () => {
	// app升级检测
	// #ifdef APP-PLUS
	let cmpRes = await getCompareVersion()
	if (cmpRes.hasNewVersion) {
		let fmBl = await confirmModal(
			`app最新版本：${cmpRes.lastAppInfo.version}.${cmpRes.lastAppInfo.versionCode}, 是否更新?`)
		if (fmBl) {
			await installNewApk(cmpRes.url)
		}
	}
	return cmpRes
	// #endif

	//微信小程序检测
	// #ifdef MP-WEIXIN
	if (wx.canIUse('getUpdateManager')) { //判断当前微信版本是否支持版本更新
		const updateManager = wx.getUpdateManager();
		updateManager.onCheckForUpdate(async function(res) {
			if (res.hasUpdate) { // 请求完新版本信息的回调
				updateManager.onUpdateReady(async function() {
					let cbl = await confirmModal('新版本已经准备好，是否重启应用？')
					if (cbl) { // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				});
				updateManager.onUpdateFailed(function() {
					showToast('新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~')
				})
			}
		})
	} else {
		showToast('当前微信版本过低，无法使用新功能，请升级到最新微信版本后重试。')
	}
	// #endif

}