import { useUserStore } from '@/stores/user'
import * as bookService from '@/api/course'
import { Lesson } from '@/stores/book'

export const submitStudyProcess = async(readLessonItem: Lesson) => {
    if(!readLessonItem?.lessonInfo?.id){
        return
    }
    let userStore = useUserStore()
    let params = {
        id: '',
        courseId: readLessonItem.bookInfo?.id || '',
        lessonId: readLessonItem?.lessonInfo?.id || '',
        isFinish: (readLessonItem?.progressPercentage || 0) >= 99 ? 1 : 0,// 是否完成：0-否，1-是
        lastLearnTime: Date.now(),
        progress: readLessonItem?.currentTime || 0, // 学习时长， 单位：秒
    }
    try {
        let getAllLearList = await bookService.getBookStudyList({  })
        let upMethod = bookService.addBookStudyProgress
        let curStudy = getAllLearList?.lists?.filter((item:any) => item.lessonId == params.lessonId)?.[0] || {}
        if(curStudy?.id){
            params.id =  curStudy.id
            upMethod = bookService.updateBookStudyProgress
        }
        await upMethod(params)
    } catch (error) {
        console.log(error)
    }
}