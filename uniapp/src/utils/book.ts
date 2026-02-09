import { goto } from "@/utils/untool"

export const getGroupBookList = (bkList: any = [], groupList: any = [], type = 1) => {
  const gpMap:any = {}
  groupList.map((t:any)=> {
    gpMap[t.id] = t
  })
  let list = []

  groupList.forEach((item:any) => {
    let gpItem = item
    if(type == 0 && item.parentId != 0 && gpMap[item.parentId]){
      gpItem = gpMap[item.parentId]
    }
    let curBkList = bkList?.filter((bk:any) => (bk.categoryId == item.id || bk.categoryId == gpItem.id))  || []
    gpItem.bookList = gpItem.bookList || []
    gpItem.bookList.push(...curBkList)
  })
  list = groupList.filter((item:any) => item?.bookList?.length > 0);
  return list
}

export const getSellGroupBookList = (bkList: any = [], groupList: any = []) => {
  const gpMap:any = {}
  groupList.map((t:any)=> {
    gpMap[t.id] = t
  })
  let list = []

  groupList.forEach((item:any) => {
    let gpItem = item
    let curBkList = bkList?.filter((bk:any) => (bk.categoryId == gpItem.id))  || []
    gpItem.bookList = gpItem.bookList || []
    gpItem.bookList.push(...curBkList)
  })
  list = groupList.filter((item:any) => item?.bookList?.length > 0);
  return list
}

export const getBookChapterGroupList = (lessonList: any = [], groupList: any = []) => {
  const gpMap:any = {}
  groupList.map((t:any)=> {
    gpMap[t.id] = t
  })
  let list = []

  groupList.forEach((item:any) => {
    let gpItem = item
    let curBkList = lessonList?.filter((bk:any) => (bk.chapterId == gpItem.id))  || []
    gpItem.dataList = gpItem.dataList || []
    gpItem.dataList.push(...curBkList)
  })
  list = groupList.filter((item:any) => item?.dataList?.length > 0);
  return list
}

export const designLinkClick = (item: any = {}) => {
  let { path = '' } = item
  if(!path){
    return
  }
  if(path.indexOf('http') >-1){
    // 跳转到webview页面
  }
  goto(path)
  
}

export const checkLessonCanPaly = (bkInfo:any = {}, lessInfo:any = {})=> {
  return bkInfo?.isSubscribe == 1 || lessInfo?.isFree == 1
}