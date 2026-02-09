<script>
let requestTask;
export default {
  props: {},
  data() {
    return {
    }
  },
  methods: {
    stopChat() {
      requestTask.offChunkReceived(this.listener)
      requestTask.abort();
    },

    decode(data) {
      if(typeof data === 'string') {
        return data;
      }
      let txt;
      // 进行判断返回的对象是Uint8Array（开发者工具）或者ArrayBuffer（真机）
      // 1.获取对象的准确的类型
      const type = Object.prototype.toString.call(data); // Uni8Array的原型对象被更改了所以使用字符串的信息进行判断。
      if(type ==="[object Uint8Array]"){
        txt = decodeURIComponent(escape(String.fromCharCode(...data)))
      }else if(data instanceof ArrayBuffer){
        // 将ArrayBuffer转换为Uint8Array
        const uint8Array = new Uint8Array(data);
        txt=decodeURIComponent(escape(String.fromCharCode(...uint8Array)))
      }
      return txt;
    },

    /**
     * 开始chat对话
     * @param body
     * @param url
     * @param headers
     */
    startChat({body, url, headers = {}}) {
      requestTask = uni.request({
        url: url,
        method: 'POST',
        header: {
          Accept: 'text/event-stream',
          ...headers,
        },
        data: body,
        enableChunked: true,
        responseType: 'arraybuffer',
        success: (res) => {},
        fail: (error) => {
          this.$emit("onInnerError", error)
        },
        complete: () => {
          this.$emit("onInnerFinish")
        },
      });

      requestTask.onChunkReceived(this.listener)
      this.$emit("onInnerOpen")
    },

    listener(data) {
      const decodedData = this.decode(data.data);
      // 解析SSE格式的数据
      this.parseSSEMessage(decodedData);
    },
    
    parseSSEMessage(text) {
      if (!text || text.trim() === '') return;
      
      // 处理可能的多行数据
      const lines = text.split('\n');
      
      for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        // 检查是否是SSE格式的数据行
        if (line.startsWith('data:')) {
          // 提取data字段后的内容
          const content = line.substring(5).trim();
          this.$emit("onInnerMessage", content);
        } else if (line.startsWith('event:') || line.startsWith('id:') || line.startsWith('retry:')) {
          // 处理其他SSE字段
          continue;
        } else {
          // 不是标准SSE格式，直接发送原始数据
          this.$emit("onInnerMessage", line);
        }
      }
    },
  },
}
</script>

<template>
  <view />
</template>