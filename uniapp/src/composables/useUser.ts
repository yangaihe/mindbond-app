import { ref, computed, readonly } from 'vue'

// 用户状态类型
export type UserStatus =
  | 'guest'              // 未登录
  | 'free'               // 已登录未购买
  | 'audiobook'          // 只有听书房
  | 'bootcamp'           // 只有共读营
  | 'audiobook_bootcamp' // 听书房+共读营
  | 'vip'                // 超级会员

// 共读营班级信息
export interface BootcampClass {
  id: string
  name: string
  type: 'morning-1' | 'morning-2' | 'evening-1' | 'evening-2'
  timeRange: string
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}

// 共读营信息
export interface BootcampInfo {
  currentBook: {
    title: string
    cover: string
    chapter: string
    progress: number // 0-100
  }
  myClass: BootcampClass
  weekNumber: number
  daysRemaining: number
  completedLessons: number
  totalLessons: number
}

// 听书房信息
export interface AudiobookInfo {
  totalBooks: number
  listenedBooks: number
  currentBook?: {
    id: string
    title: string
    cover: string
    progress: number // 0-100
  }
}

// 用户数据
export interface UserData {
  id: string
  nickname: string
  avatar: string
  status: UserStatus
  // 会员信息
  audiobook?: {
    expireDate: string
    info: AudiobookInfo
  }
  bootcamp?: {
    expireDate: string
    currentPeriod: string // e.g., "1月期"
    info: BootcampInfo
  }
  vip?: {
    expireDate: string
    remainingBootcampPeriods: number
    bonusCourses: string[]
  }
  // 免费用户限制
  freeTrials?: {
    audiobookListensRemaining: number
    journalWritesRemaining: number
  }
  // 统计数据
  stats: {
    streakDays: number
    totalJournals: number
    totalListenMinutes: number
  }
}

// 默认游客数据
const defaultGuestUser: UserData = {
  id: '',
  nickname: '探索者',
  avatar: '',
  status: 'guest',
  freeTrials: {
    audiobookListensRemaining: 3,
    journalWritesRemaining: 5
  },
  stats: {
    streakDays: 0,
    totalJournals: 0,
    totalListenMinutes: 0
  }
}

// Mock 数据 - 共读营用户
const mockBootcampUser: UserData = {
  id: 'user_001',
  nickname: '觉醒者小明',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
  status: 'bootcamp',
  bootcamp: {
    expireDate: '2026-01-31',
    currentPeriod: '1月期',
    info: {
      currentBook: {
        title: '被讨厌的勇气',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop',
        chapter: '第三章 · 课题分离',
        progress: 65
      },
      myClass: {
        id: 'evening-1',
        name: '晚读1班',
        type: 'evening-1',
        timeRange: '20:55 - 22:00',
        startHour: 20,
        startMinute: 55,
        endHour: 22,
        endMinute: 0
      },
      weekNumber: 3,
      daysRemaining: 9,
      completedLessons: 12,
      totalLessons: 28
    }
  },
  stats: {
    streakDays: 7,
    totalJournals: 15,
    totalListenMinutes: 420
  }
}

// Mock 数据 - 听书房用户
const mockAudiobookUser: UserData = {
  id: 'user_002',
  nickname: '书友小红',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  status: 'audiobook',
  audiobook: {
    expireDate: '2026-12-31',
    info: {
      totalBooks: 108,
      listenedBooks: 23,
      currentBook: {
        id: 'book_001',
        title: '被讨厌的勇气',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop',
        progress: 45
      }
    }
  },
  stats: {
    streakDays: 3,
    totalJournals: 8,
    totalListenMinutes: 680
  }
}

// Mock 数据 - VIP用户 (听书房+共读营)
const mockVipUser: UserData = {
  id: 'user_003',
  nickname: 'VIP用户小王',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  status: 'vip',
  audiobook: {
    expireDate: '2026-12-31',
    info: {
      totalBooks: 108,
      listenedBooks: 45,
      currentBook: {
        id: 'book_001',
        title: '被讨厌的勇气',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop',
        progress: 100
      }
    }
  },
  bootcamp: {
    expireDate: '2026-12-31',
    currentPeriod: '1月期',
    info: {
      currentBook: {
        title: '被讨厌的勇气',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop',
        chapter: '第三章 · 课题分离',
        progress: 65
      },
      myClass: {
        id: 'morning-1',
        name: '晨读1班',
        type: 'morning-1',
        timeRange: '5:55 - 7:00',
        startHour: 5,
        startMinute: 55,
        endHour: 7,
        endMinute: 0
      },
      weekNumber: 3,
      daysRemaining: 9,
      completedLessons: 12,
      totalLessons: 28
    }
  },
  vip: {
    expireDate: '2026-12-31',
    remainingBootcampPeriods: 11,
    bonusCourses: ['亲密关系工作坊', '情绪管理课']
  },
  stats: {
    streakDays: 21,
    totalJournals: 45,
    totalListenMinutes: 1200
  }
}

// Mock 数据 - 免费用户
const mockFreeUser: UserData = {
  id: 'user_004',
  nickname: '新用户',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
  status: 'free',
  freeTrials: {
    audiobookListensRemaining: 2,
    journalWritesRemaining: 3
  },
  stats: {
    streakDays: 1,
    totalJournals: 2,
    totalListenMinutes: 38
  }
}

// 所有可旁听的班级
const allClasses: BootcampClass[] = [
  {
    id: 'morning-1',
    name: '晨读1班',
    type: 'morning-1',
    timeRange: '5:55 - 7:00',
    startHour: 5,
    startMinute: 55,
    endHour: 7,
    endMinute: 0
  },
  {
    id: 'morning-2',
    name: '晨读2班',
    type: 'morning-2',
    timeRange: '5:55 - 7:00',
    startHour: 5,
    startMinute: 55,
    endHour: 7,
    endMinute: 0
  },
  {
    id: 'evening-1',
    name: '晚读1班',
    type: 'evening-1',
    timeRange: '20:55 - 22:00',
    startHour: 20,
    startMinute: 55,
    endHour: 22,
    endMinute: 0
  },
  {
    id: 'evening-2',
    name: '晚读2班',
    type: 'evening-2',
    timeRange: '20:55 - 22:00',
    startHour: 20,
    startMinute: 55,
    endHour: 22,
    endMinute: 0
  }
]

// 全局状态
const user = ref<UserData>(mockBootcampUser) // 默认使用共读营用户作为演示
const isLoading = ref(false)

export function useUser() {
  // 权限检查
  const isLoggedIn = computed(() => user.value.status !== 'guest')

  const hasAudiobook = computed(() =>
    ['audiobook', 'audiobook_bootcamp', 'vip'].includes(user.value.status)
  )

  const hasBootcamp = computed(() =>
    ['bootcamp', 'audiobook_bootcamp', 'vip'].includes(user.value.status)
  )

  const isVip = computed(() => user.value.status === 'vip')

  const isFreeUser = computed(() => user.value.status === 'free')

  const isGuest = computed(() => user.value.status === 'guest')

  // 免费试用次数
  const canListenFree = computed(() =>
    (user.value.freeTrials?.audiobookListensRemaining ?? 0) > 0
  )

  const canWriteJournalFree = computed(() =>
    (user.value.freeTrials?.journalWritesRemaining ?? 0) > 0
  )

  // 获取可旁听的班级（排除自己的班级）
  const auditableClasses = computed(() => {
    if (!hasBootcamp.value || !user.value.bootcamp?.info.myClass) {
      return []
    }
    const myClassId = user.value.bootcamp.info.myClass.id
    return allClasses.filter(cls => cls.id !== myClassId)
  })

  // 获取班级状态
  const getClassStatus = (cls: BootcampClass): 'completed' | 'active' | 'upcoming' => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute
    const startTime = cls.startHour * 60 + cls.startMinute
    const endTime = cls.endHour * 60 + cls.endMinute

    if (currentTime >= endTime) return 'completed'
    if (currentTime >= startTime && currentTime < endTime) return 'active'
    return 'upcoming'
  }

  // 获取倒计时文本
  const getClassCountdown = (cls: BootcampClass): string => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = currentHour * 60 + currentMinute
    const startTime = cls.startHour * 60 + cls.startMinute

    if (currentTime >= startTime) return ''

    const diff = startTime - currentTime
    const hours = Math.floor(diff / 60)
    const minutes = diff % 60

    if (hours > 0) {
      return `${hours}小时${minutes}分后`
    }
    return `${minutes}分钟后`
  }

  // 切换用户状态（用于演示）
  const switchUserStatus = (status: UserStatus) => {
    switch (status) {
      case 'guest':
        user.value = { ...defaultGuestUser }
        break
      case 'free':
        user.value = { ...mockFreeUser }
        break
      case 'audiobook':
        user.value = { ...mockAudiobookUser }
        break
      case 'bootcamp':
        user.value = { ...mockBootcampUser }
        break
      case 'audiobook_bootcamp':
        user.value = {
          ...mockAudiobookUser,
          status: 'audiobook_bootcamp',
          bootcamp: mockBootcampUser.bootcamp
        }
        break
      case 'vip':
        user.value = { ...mockVipUser }
        break
    }
  }

  // 模拟登录
  const login = async () => {
    isLoading.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    user.value = { ...mockFreeUser }
    isLoading.value = false
  }

  // 模拟登出
  const logout = async () => {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 500))
    user.value = { ...defaultGuestUser }
    isLoading.value = false
  }

  // 消耗免费试听次数
  const consumeFreeListen = () => {
    if (user.value.freeTrials && user.value.freeTrials.audiobookListensRemaining > 0) {
      user.value.freeTrials.audiobookListensRemaining--
    }
  }

  // 消耗免费日记次数
  const consumeFreeJournal = () => {
    if (user.value.freeTrials && user.value.freeTrials.journalWritesRemaining > 0) {
      user.value.freeTrials.journalWritesRemaining--
    }
  }

  return {
    // 状态
    user: readonly(user),
    isLoading: readonly(isLoading),

    // 权限检查
    isLoggedIn,
    hasAudiobook,
    hasBootcamp,
    isVip,
    isFreeUser,
    isGuest,
    canListenFree,
    canWriteJournalFree,

    // 班级相关
    auditableClasses,
    getClassStatus,
    getClassCountdown,

    // 操作
    switchUserStatus,
    login,
    logout,
    consumeFreeListen,
    consumeFreeJournal
  }
}

// 导出类型
export type { UserData, BootcampInfo, AudiobookInfo }
