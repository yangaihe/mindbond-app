import { getUserCenter } from '@/api/user'
import { Read_BOOKS } from '@/enums/cacheEnums'
import cache from '@/utils/cache'
import { defineStore } from 'pinia'
import * as bookService from "@/api/course"
import { submitStudyProcess } from "@/tasks"
import _ from 'lodash'
import { showToast } from '@/utils/untool'
import { checkLessonCanPaly } from '@/utils/book'

export interface Lesson {
    bookInfo?: any
    lessonInfo?: any
    totalDuration?: number
    currentTime?: number
    progressPercentage?: number
    isPlaying?: boolean
    speed?: number
    noticeTime?: number // 单位分钟
    noticeLeftTime?: number // 单位秒
}

interface BookSate {
    readLessonItem: Lesson,
    // audioContext: UniApp.InnerAudioContext,
}

const defaultReadLessonItem: Lesson = {
    bookInfo: {},
    lessonInfo: {},
    totalDuration: 0,
    currentTime: 0,
    progressPercentage: 0,
    isPlaying: false,
    speed: 1.0,
    noticeTime: 0,
}

const audioContext = uni.createInnerAudioContext()

export const useBookStore = defineStore({
    id: 'bookStore',
    state: (): BookSate => ({
        readLessonItem: cache.get(Read_BOOKS) || defaultReadLessonItem,
        // audioContext: uni.createInnerAudioContext(),
    }),
    getters: {
        // progressPercentage(state) {
        //     return state.readLessonItem
        // }
    },
    actions: {
        _timer: null as any,
        updateLessonItem(info: Lesson = {}) {
            this.readLessonItem = Object.assign(this.readLessonItem, info)
            cache.set(Read_BOOKS, this.readLessonItem)
        },
        clearAllReadBook() {
            this.readLessonItem = defaultReadLessonItem
            cache.remove(Read_BOOKS)
            audioContext.stop();
        },
        initPlayer() {
            let { readLessonItem } = this

            audioContext.onPlay(() => {
                console.log('音频开始播放');
                this.updateLessonItem({ isPlaying: true })
            });
            
            audioContext.onPause(() => {
                console.log('音频暂停播放');
                this.updateLessonItem({ isPlaying: false })
            });
            
            audioContext.onStop(() => {
                console.log('音频停止播放');
                this.updateLessonItem({ isPlaying: false })
            });
            
            audioContext.onEnded(() => {
                console.log('音频播放结束');
                submitStudyProcess(_.cloneDeep(this.readLessonItem))
                this.updateLessonItem({ isPlaying: false })
                // 播放下一个
            });

            audioContext.onCanplay(() => {
                console.log('音频可以播放了');
                if (audioContext.duration) {
                    this.updateLessonItem({ totalDuration: audioContext.duration })
                }
            });
            
            // 音频错误事件
            audioContext.onError((err) => {
                console.error('音频播放错误:', err);
                this.updateLessonItem({ isPlaying: false })
            });
            
            // 播放进度更新
            audioContext.onTimeUpdate(() => {
                console.log('音频播放:', {
                    duration: audioContext.duration,
                    currentTime: audioContext.currentTime,
                });
                const current = audioContext.currentTime || 0;
                const duration = audioContext.duration || 0;
                if (duration > 0) {
                    this.updateLessonItem({ 
                        currentTime: current, 
                        progressPercentage: (current / duration) * 100 ,
                        totalDuration: duration
                    })
                }
            });
            let audSrc = readLessonItem?.lessonInfo?.resourceUrl
            // 读取缓存
            audSrc && (audioContext.src = audSrc);
            this.updateLessonItem({ isPlaying: false, noticeTime: 0 })
            // if (readLessonItem.isPlaying && audSrc) {
            //     this.play()
            // }
        },
        togglePlayPause() {
            let { readLessonItem } = this
            if(!checkLessonCanPaly(this.readLessonItem.bookInfo, readLessonItem.lessonInfo)){
                return showToast(`请先解锁该内容`)
            }
            if (readLessonItem.isPlaying) {
                audioContext.pause();
            } else {
                audioContext.seek(readLessonItem.currentTime || 0)
                audioContext.play();
            }
            submitStudyProcess(_.cloneDeep(this.readLessonItem))
        },
        play(lessionInfo?:any) {
            submitStudyProcess(_.cloneDeep(this.readLessonItem))
            let { readLessonItem } = this
            let curLessonId = readLessonItem.lessonInfo?.id || ''
            lessionInfo = lessionInfo || this.readLessonItem.lessonInfo
            if(!checkLessonCanPaly(this.readLessonItem.bookInfo, lessionInfo)){
                return showToast(`请先解锁该内容`)
            }
            this.readLessonItem.lessonInfo = lessionInfo
            audioContext.stop();
            audioContext.playbackRate = readLessonItem.speed
            if(
                curLessonId != lessionInfo.id
            ) {
                // 设置音频源
                audioContext.src = lessionInfo.resourceUrl;
                // audioContext.src = 'https://c-dev.weimobwmc.com/qa-OoyG/20e73a2b47174976b29bc2635f771bf7.mp3'; 
                this.updateLessonItem({ progressPercentage: 0, currentTime: 0 })

            } else {
                audioContext.seek(readLessonItem.currentTime || 0)
            }
            // 尝试自动播放（注意：部分平台需要用户交互后才能播放）
            audioContext.play();
        },
        pause() {
            let { readLessonItem } = this
            audioContext.pause()
        },
        seek(time: number) {
            let { readLessonItem } = this
            audioContext.seek(time)
            let progressPercentage = (time / audioContext.duration) * 100 || 0
            this.updateLessonItem({ currentTime: time, progressPercentage })
        },
        setPlaybackRate(rate: number) {
            let { readLessonItem } = this
            try {
                // 设置播放速率
                audioContext.playbackRate = rate;
                this.updateLessonItem({ speed: rate })
                console.log('设置播放速率:', rate);
            } catch (error) {
                console.warn('当前环境不支持调整播放速率:', error);
            }
        },
        setKockTime(time: number) {
            time = time || 0 
            clearInterval(this._timer)
            if(time) {
                this._timer = setInterval(() => {
                    let { noticeLeftTime = 0 } = this.readLessonItem
                    if(noticeLeftTime > 1) {
                        this.updateLessonItem({ noticeLeftTime: noticeLeftTime - 1 })
                    } else {
                        this.updateLessonItem({ noticeTime:0, noticeLeftTime: 0 })
                        clearInterval(this._timer)
                        audioContext.pause();
                    }
                }, 1000)
            }
            this.updateLessonItem({ noticeTime: time, noticeLeftTime: time * 60 })
        }
    }
})
