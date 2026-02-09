/// API请求封装
const BASE_URL = `${import.meta.env.VITE_APP_BASE_URL || ''}`+'/api';
export { BASE_URL };

import { getToken } from '@/utils/auth'
// 用户签到
export async function userSignIn() {
  try {
    //const token = uni.getStorageSync('Token');
	const token = getToken();
    const user = uni.getStorageSync('User');
    
    /* if (!token || !user) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return {
        success: false,
        points: 0
      };
    } */
    if(true){
		return {
		  success: false,
		  points: 0
		};
	}
    const res = await uni.request({
      url: `${BASE_URL}/aichat/UserSignr`,
      method: 'POST',
      data: {
        username: user,
        usertoken: token
      },
      header: {
        'content-type': 'application/json'
      }
    });
    console.log('收到响应，响应状态码:', res.statusCode);
    console.log('收到响应，响应数据:', res.data);
    if (res.data.code === 200) {
      return {
        success: true,
        points: res.data.data.money,
        msg: res.data.msg
      };
    } else {
      return {
        success: false,
        points: 0,
        isVip: false,
        msg: res.data.msg || '签到失败'
      };
    }
  } catch (err) {
    uni.showToast({
      title: '网络请求失败',
      icon: 'none'
    });
    return {
      success: false,
      points: 0
    };
  }
}


// 获取推荐问题列表
export async function getSuggestedQuestions() {
  try {
    const response = await uni.request({
      url: `${BASE_URL}/aichat/tiwenmoban`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
		'Like-Token':getToken()
      }
    });

    if (response.statusCode === 200 && response.data && response.data.items) {
      // 转换数据格式以适配前端展示，并限制只返回前4个问题
      return response.data.items.slice(0, 4).map(item => ({
        icon: item.icon_emoji || '❓', // 使用API返回的emoji图标，如果没有则使用默认图标
        text: item.title,
        // 移除prompt中的"Kimi，"前缀
        prompt: item.prompt ? item.prompt.replace(/^Kimi[，,]\s*/i, '') : item.prompt // 保存处理后的prompt用于点击时发送
      }));
    }
    throw new Error('获取推荐问题失败');
  } catch (error) {
    console.error('获取推荐问题失败:', error);
    // 如果API请求失败，返回默认问题列表
    return [
      { icon: '❓', text: '你能帮我做什么？' },
      { icon: '👔', text: '如何提高工作效率？' },
      { icon: '🔬', text: '讲解一下量子计算的原理' },
      { icon: '📝', text: '帮我写一篇商业计划书' }
    ];
  }
}

// 获取AI模型列表
export async function getModelList() {
  try {
    const response = await uni.request({
      url: `${BASE_URL}/aichat/getModelInfos`,
      method: 'GET',
      header: {
        'content-type': 'application/json',
		'Like-Token':getToken()
      }
    });
    
    if (response.statusCode === 200) {
      const modelData = response.data.data;
      if (modelData) {console.log(modelData)
        return {
          text: Array.isArray(modelData.text) ? modelData.text : [],
          drawing: Array.isArray(modelData.drawing) ? modelData.drawing : [],
          zhiling: modelData.zhiling || {},
          // 随机打乱mobana数组的顺序
          mobana: Array.isArray(modelData.mobana) ? modelData.mobana: [],
          // 处理抽奖奖品数据
          choujiang: Array.isArray(modelData.choujiang) ? modelData.choujiang : []
        };
      }
      throw new Error('模型列表数据格式不正确');
    }
    throw new Error('获取模型列表失败');
  } catch (error) {
    console.error('获取模型列表失败:', error);
    throw error;
  }
}

// 发送消息到后端API
export async function sendMessageToAPI(message, aiid = '0', options = {}, isDrawing = false) {
  console.log('当前模式:', isDrawing ? '绘图模式' : '文本模式', '使用的aiid:', aiid);
  try {
    const token = uni.getStorageSync('Token');
    const user = uni.getStorageSync('User');
    
    // 根据模式选择不同的endpoint
    const endpoint = isDrawing ? '/aichat/doubaomoxs' : '/aichat/doubaomoxs';
    
    const requestData = {
	  username: user,
	  token: token,
      aiid: aiid,
      prompt: message,
      searchEnabled: options.searchEnabled,
      messages: options.messages || [],
    };
    
    // 如果是绘图模式，添加额外的参数
    if (isDrawing && options.imageOptions) {
      Object.assign(requestData, {
        size: options.imageOptions.ratio,
        count: options.imageOptions.count
      });
    }

    const response = await uni.request({
      ...options,
      url: `${BASE_URL}${endpoint}`,
      method: 'POST',
      data: requestData,
      header: {
        'content-type': 'application/json',
        'Like-Token':getToken(),
        'username': user
      }
    });
    console.log('收到响应，响应状态码:', response.statusCode);
    console.log('收到响应，响应数据:', response.data);
    if (response.statusCode === 200) {
      const data = response.data;
      // 处理图片生成的情况
      if (isDrawing) {
        if (data && data.data && data.data.url) {
          // 将url字符串按逗号分割成数组，并转换为对象数组格式
          const urls = data.data.url.split(',').map(url => ({
            url: url.trim()
          }));
          return urls;
        }
      }
      // 处理文本对话的情况
      if (data && data.data && data.data.response) {
        // 构建返回对象，包含AI响应和搜索结果
        const result = {
          response: data.data.response,
          searchResults: data.data.web_search || []
        };
        return result;
      }
    }
    throw new Error('API请求失败');
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

// 获取用户信息
export async function getUserInfo() {
  try {
    const token = uni.getStorageSync('Token');
    const user = uni.getStorageSync('User');
    
    const response = await uni.request({
      url: `${BASE_URL}/user/center`,
      method: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json',
        'Like-Token':getToken(),
        'username': user
      }
    });

    if (response.statusCode === 200 && response.data.code === 200) {		
      const userInfo = response.data.data;
      return {
        nickname: userInfo.nickname,
        viptime: userInfo.viptime,
        usertx: userInfo.avatar,
		username: userInfo.username,
        money: userInfo.money,
		vip: userInfo.vip,
		
      };
	  
    }
    throw new Error(response.data.msg || '获取用户信息失败');
  } catch (error) {
	  
    console.error('获取用户信息失败:', error);
    // 清除本地存储的用户信息和token
    uni.removeStorageSync('Token');
    //uni.removeStorageSync('User');
    throw error;
  }
}


// 用户抽奖
export async function userLuckyDraw() {
  try {
    const token = getToken();
    const user = uni.getStorageSync('User');
    
    /* if (!token || !user) {
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      return {
        success: false,
        msg: '请先登录'
      };
    } */
    if(true){
		return {
		  success: false,
		  points: 0
		};
	}
    const res = await uni.request({
      url: `${BASE_URL}/aichat/UserDrawr`,
      method: 'POST',
      data: {
        username: user,
        usertoken: token
      },
      header: {
        'content-type': 'application/json'
      }
    });
    console.log('抽奖响应，响应状态码:', res.statusCode);
    console.log('抽奖响应，响应数据:', res.data);
    if (res.data.code === 200) {
      return {
        success: true,
        msg: res.data.msg
      };
    } else {
      return {
        success: false,
        msg: res.data.msg || '抽奖失败'
      };
    }
  } catch (err) {
    console.error('抽奖请求失败:', err);
    uni.showToast({
      title: '网络请求失败',
      icon: 'none'
    });
    return {
      success: false,
      msg: '网络请求失败'
    };
  }
}