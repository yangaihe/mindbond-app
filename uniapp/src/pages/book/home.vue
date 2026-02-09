<template>
  <page-root>
    <template #body>
      <view class="p-[30rpx]">
        <view class="date-header fade-in">
          <view class="date-info">
            <view class="date-greeting">{{ greeting.title }}</view>
            <view class="date-subtitle">{{ greeting.subtitle }}</view>
            <view class="date-today">{{ todayDate }}</view>
          </view>
          <view v-if="isLoggedIn && user.stats.streakDays > 0" class="streak-badge" @click="showStreakCelebration">
            <view class="fas fa-fire"></view>
            <view>连续{{ user.stats.streakDays }}天</view>
          </view>
          <view v-else-if="!isLoggedIn" class="login-btn" @click="goToLogin">
            <view class="fas fa-user"></view>
            <view>登录</view>
          </view>
        </view>

        <view v-if="isLoggedIn && user.stats.streakDays > 0" class="streak-encourage fade-in"
          style="animation-delay: 0.03s">
          <view class="streak-encourage-text">{{ streakEncouragement }}</view>
        </view>

        <template v-if="isGuest || isFreeUser">
          <view v-if="isGuest" class="welcome-banner fade-in" style="animation-delay: 0.05s">
            <view class="welcome-icon">
              <view class="fas fa-sparkles"></view>
            </view>
            <view class="welcome-content">
              <view class="wel-title">开启觉察之旅</view>
              <view class="wel-subtitle">用听书和写作，遇见更好的自己</view>
            </view>
            <view class="btn-register" @click="goToLogin">
              立即注册
            </view>
          </view>

          <view v-if="isFreeUser" class="trial-status fade-in" style="animation-delay: 0.05s">
            <view class="trial-item">
              <view class="fas fa-headphones"></view>
              <view>试听剩余 <text>{{ user.freeTrials?.audiobookListensRemaining || 0 }}</text> 次
            </view>
            </view>
            <view class="trial-item">
              <view class="fas fa-feather"></view>
              <view>日记剩余 <text>{{ user.freeTrials?.journalWritesRemaining || 0 }}</text> 次
              </view>
            </view>
          </view>

          <view class="section-header fade-in" style="animation-delay: 0.1s">
            <view class="sec-title">探索内容</view>
          </view>

          <view class="promo-card audiobook fade-in" style="animation-delay: 0.15s" @click="goToAudiobooks">
            <view class="promo-icon">
              <view class="fas fa-headphones"></view>
            </view>
            <view class="promo-content">
              <view class="proc-name">听书房</view>
              <view>100+本精选好书，每本一个精华音频</view>
              <view class="promo-tag">年费会员 · 随时畅听</view>
            </view>
            <view class="fas fa-chevron-right promo-arrow"></view>
          </view>

          <view class="promo-card bootcamp fade-in" style="animation-delay: 0.2s" @click="goToBootcampIntro">
            <view class="promo-icon">
              <view class="fas fa-users"></view>
            </view>
            <view class="promo-content">
              <view class="proc-name">共读营</view>
              <view>30天深度共读，班级陪伴成长</view>
              <view class="promo-tag">月费订阅 · 每本20讲</view>
            </view>
            <view class="fas fa-chevron-right promo-arrow"></view>
          </view>

          <view class="section-header fade-in" style="animation-delay: 0.25s">
            <view class="sec-title">免费试听</view>
            <view href="#" @click.prevent="goToAudiobooks">更多 ></view>
          </view>

          <view class="sample-book-card fade-in" style="animation-delay: 0.3s" @click="playSampleBook">
            <image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop"
              class="sample-cover" mode="aspectFill"></image>
            <view class="sample-info">
              <view class="smp-title">被讨厌的勇气</view>
              <view class="sample-author">岸见一郎 / 古贺史健</view>
              <view class="sample-desc">学会课题分离，拥抱真正的自由</view>
              <view class="sample-meta">
                <view>
                  <view class="fas fa-clock"></view> 38分钟
                </view>
                <view>
                  <view class="fas fa-headphones"></view> 3.2万次
                </view>
              </view>
            </view>
            <view class="sample-play-btn">
              <view class="fas fa-play"></view>
            </view>
          </view>

          <view class="section-header fade-in" style="animation-delay: 0.35s">
            <view class="sec-title">觉察日记</view>
            <view class="section-tag free">免费体验</view>
          </view>

          <view class="journal-promo fade-in" style="animation-delay: 0.4s">
            <view class="journal-promo-icon">
              <view class="fas fa-feather"></view>
            </view>
            <view class="journal-promo-content">
              <view>记录此刻的感受和觉察</view>
              <view class="journal-promo-hint">AI 会帮你发现成长的轨迹</view>
            </view>
            <view class="btn-journal-start" @click="writeJournal">
              开始写
            </view>
          </view>
        </template>

        <template v-else-if="hasAudiobook && !hasBootcamp">
          <view v-if="user.audiobook?.info.currentBook" class="current-listen fade-in" style="animation-delay: 0.05s">
            <view class="current-listen-label">
              <view class="fas fa-headphones"></view> 继续收听
            </view>
            <view class="current-listen-card" @click="continueListening">
              <image :src="user.audiobook.info.currentBook.cover" class="listen-cover" mode="aspectFill"></image>
              <view class="listen-info">
                <view>{{ user.audiobook.info.currentBook.title }}</view>
                <view class="listen-progress">
                  <view class="listen-progress-bar">
                    <view class="listen-progress-fill"
                      :style="{ width: user.audiobook.info.currentBook.progress + '%' }"></view>
                  </view>
                  <view>{{ user.audiobook.info.currentBook.progress }}%</view>
                </view>
              </view>
              <view class="listen-play-btn">
                <view class="fas fa-play"></view>
              </view>
            </view>
          </view>

          <view class="listen-stats fade-in" style="animation-delay: 0.1s">
            <view class="listen-stat">
              <view class="stat-value">{{ user.audiobook?.info.listenedBooks || 0 }}</view>
              <view class="stat-label">已听书籍</view>
            </view>
            <view class="listen-stat">
              <view class="stat-value">{{ Math.floor((user.stats.totalListenMinutes || 0) / 60) }}</view>
              <view class="stat-label">收听小时</view>
            </view>
            <view class="listen-stat">
              <view class="stat-value">{{ user.audiobook?.info.totalBooks || 0 }}</view>
              <view class="stat-label">书库总数</view>
            </view>
          </view>

          <view class="section-header fade-in" style="animation-delay: 0.15s">
            <view>为你推荐</view>
            <view href="#" @click.prevent="goToAudiobooks">全部 ></view>
          </view>

          <view class="book-scroll fade-in" style="animation-delay: 0.2s">
            <view v-for="book in recommendedBooks" :key="book.id" class="book-card" @click="goToBook(book.id)">
              <image :src="book.cover" class="book-cover" mode="aspectFill"></image>
              <view class="book-title">{{ book.title }}</view>
              <view class="book-duration">
                <view class="fas fa-clock"></view> {{ book.duration }}
              </view>
            </view>
          </view>

          <view class="upgrade-banner fade-in" style="animation-delay: 0.25s" @click="goToBootcampIntro">
            <view class="upgrade-icon">
              <view class="fas fa-graduation-cap"></view>
            </view>
            <view class="upgrade-content">
              <view>想要深度学习？</view>
              <view>加入共读营，30天班级陪伴共读</view>
            </view>
            <view class="upgrade-tag">了解更多</view>
          </view>

          <view class="task-card fade-in" style="animation-delay: 0.3s">
            <view class="task-header">
              <view class="task-icon">
                <view class="fas fa-feather"></view>
              </view>
              <view class="task-title">
                <view class="task-title-text">今日觉察</view>
                <view class="task-title-source">听完书后，写下你的感悟</view>
              </view>
            </view>
            <view class="btn-task" @click="writeJournal">
              <view class="fas fa-feather"></view> 写下此刻的觉察
            </view>
          </view>
        </template>

        <template v-else-if="hasBootcamp && !hasAudiobook">
          <view class="class-badge fade-in" style="animation-delay: 0.05s">
            <view class="fas fa-users"></view>
            <view>觉醒者 · {{ bootcampMyClass?.name }}</view>
          </view>

          <view class="my-class-section fade-in" style="animation-delay: 0.1s">
            <view class="my-class-header">
              <view class="my-class-label">
                <view class="fas fa-star"></view> 我的班级
              </view>
              <view class="my-class-book">{{ user.bootcamp?.info.currentBook.title }} · {{
                user.bootcamp?.info.currentBook.chapter }}</view>
            </view>

            <view class="my-class-card"
              :class="{ completed: myClassStatus === 'completed', active: myClassStatus === 'active', upcoming: myClassStatus === 'upcoming' }"
              @click="myClassStatus !== 'completed' && enterBookroom(bootcampMyClass?.type)">
              <view class="my-class-icon">
                <view :class="myClassIcon"></view>
              </view>
              <view class="my-class-content">
                <view class="my-class-info">
                  <view class="my-class-name">{{ bootcampMyClass?.name }}</view>
                  <view class="my-class-time">{{ bootcampMyClass?.timeRange }}</view>
                </view>
                <view class="my-class-status">
                  <view v-if="myClassStatus === 'completed'" class="status-badge completed">
                    <view class="fas fa-check"></view> 已完成
                  </view>
                  <view v-else-if="myClassStatus === 'active'" class="status-badge active">
                    <view class="live-dot"></view> 进行中
                  </view>
                  <view v-else class="status-badge upcoming">
                    {{ myClassCountdown }}
                  </view>
                </view>
              </view>
              <view v-if="myClassStatus !== 'completed'" class="my-class-action">
                <view class="my-class-avatars">
                  <image v-for="avatar in sessionAvatars" :key="avatar.id" :src="avatar.src" class="my-class-avatar"
                    mode="aspectFill"></image>
                  <view class="my-class-avatar-more">+8</view>
                </view>
                <view v-if="myClassStatus === 'active'" class="btn-enter-class">
                  <view class="fas fa-door-open"></view> 进入
                </view>
              </view>
              <view v-else class="my-class-completed-info">
                <view>
                  <view class="fas fa-clock"></view> 参与 62 分钟
                </view>
                <view>
                  <view class="fas fa-feather"></view> 已写觉察
                </view>
              </view>
            </view>

            <view class="audit-section">
              <view class="audit-header" @click="showAuditClasses = !showAuditClasses">
                <view class="audit-label">
                  <view class="fas fa-book-reader"></view> 旁听其他班级
                </view>
                <view class="fas" :class="showAuditClasses ? 'fa-chevron-down' : 'fa-chevron-right'"></view>
              </view>
              <Transition name="slide-down">
                <view v-if="showAuditClasses" class="audit-list">
                  <view v-for="cls in auditableClasses" :key="cls.id" class="audit-item"
                    :class="{ completed: getClassStatus(cls) === 'completed', active: getClassStatus(cls) === 'active' }"
                    @click="getClassStatus(cls) !== 'completed' && enterBookroom(cls.type, true)">
                    <view :class="cls.type.includes('morning') ? 'fas fa-sun' : 'fas fa-moon'" class="audit-item-icon">
                    </view>
                    <view class="audit-item-name">{{ cls.name }}</view>
                    <view class="audit-item-time">{{ cls.timeRange }}</view>
                    <view v-if="getClassStatus(cls) === 'completed'" class="audit-item-status completed">已结束</view>
                    <view v-else-if="getClassStatus(cls) === 'active'" class="audit-item-status active">旁听</view>
                    <view v-else class="audit-item-status upcoming">{{ getClassCountdown(cls) }}</view>
                  </view>
                </view>
              </Transition>
            </view>
          </view>

          <view class="task-card fade-in" style="animation-delay: 0.2s">
            <view class="task-header">
              <view class="task-icon">
                <view class="fas fa-feather"></view>
              </view>
              <view class="task-title">
                <view class="task-title-text">今日觉察任务</view>
                <view class="task-title-source">来自{{ user.bootcamp?.info.currentBook.chapter }}</view>
              </view>
              <view class="task-badge">待完成</view>
            </view>
            <view class="task-content">
              今天遇到让你不舒服的事时，先问自己：<view>「这是谁的课题？」</view>
            </view>
            <view class="task-action">
              <view class="btn-task" @click="recordAwareness">
                <view class="fas fa-feather"></view> 写下此刻的觉察
              </view>
            </view>
          </view>

          <view class="upgrade-banner audiobook fade-in" style="animation-delay: 0.25s" @click="goToAudiobooks">
            <view class="upgrade-icon">
              <view class="fas fa-headphones"></view>
            </view>
            <view class="upgrade-content">
              <view>想要更多好书？</view>
              <view>开通听书房，100+本书随时畅听</view>
            </view>
            <view class="upgrade-tag">了解更多</view>
          </view>
        </template>

        <template v-else>
          <view v-if="isVip" class="vip-badge fade-in" style="animation-delay: 0.05s">
            <view class="fas fa-crown"></view>
            <view>超级会员</view>
            <view class="vip-remain">剩余 {{ user.vip?.remainingBootcampPeriods }} 期共读</view>
          </view>

          <view class="class-badge fade-in" style="animation-delay: 0.08s">
            <view class="fas fa-users"></view>
            <view>觉醒者 · {{ bootcampMyClass?.name }}</view>
          </view>

          <view class="my-class-section fade-in" style="animation-delay: 0.1s">
            <view class="my-class-header">
              <view class="my-class-label">
                <view class="fas fa-star"></view> 我的班级
              </view>
              <view class="my-class-book">{{ user.bootcamp?.info.currentBook.title }} · {{
                user.bootcamp?.info.currentBook.chapter }}</view>
            </view>

            <view class="my-class-card"
              :class="{ completed: myClassStatus === 'completed', active: myClassStatus === 'active', upcoming: myClassStatus === 'upcoming' }"
              @click="myClassStatus !== 'completed' && enterBookroom(bootcampMyClass?.type)">
              <view class="my-class-icon">
                <view :class="myClassIcon"></view>
              </view>
              <view class="my-class-content">
                <view class="my-class-info">
                  <view class="my-class-name">{{ bootcampMyClass?.name }}</view>
                  <view class="my-class-time">{{ bootcampMyClass?.timeRange }}</view>
                </view>
                <view class="my-class-status">
                  <view v-if="myClassStatus === 'completed'" class="status-badge completed">
                    <view class="fas fa-check"></view> 已完成
                  </view>
                  <view v-else-if="myClassStatus === 'active'" class="status-badge active">
                    <view class="live-dot"></view> 进行中
                  </view>
                  <view v-else class="status-badge upcoming">
                    {{ myClassCountdown }}
                  </view>
                </view>
              </view>
              <view v-if="myClassStatus !== 'completed'" class="my-class-action">
                <view class="my-class-avatars">
                  <image v-for="avatar in sessionAvatars" :key="avatar.id" :src="avatar.src" class="my-class-avatar"
                    mode="aspectFill"></image>
                  <view class="my-class-avatar-more">+8</view>
                </view>
                <view v-if="myClassStatus === 'active'" class="btn-enter-class">
                  <view class="fas fa-door-open"></view> 进入
                </view>
              </view>
              <view v-else class="my-class-completed-info">
                <view>
                  <view class="fas fa-clock"></view> 参与 62 分钟
                </view>
                <view>
                  <view class="fas fa-feather"></view> 已写觉察
                </view>
              </view>
            </view>

            <view class="audit-section">
              <view class="audit-header" @click="showAuditClasses = !showAuditClasses">
                <view class="audit-label">
                  <view class="fas fa-book-reader"></view> 旁听其他班级
                </view>
                <view class="fas" :class="showAuditClasses ? 'fa-chevron-down' : 'fa-chevron-right'"></view>
              </view>
              <Transition name="slide-down">
                <view v-if="showAuditClasses" class="audit-list">
                  <view v-for="cls in auditableClasses" :key="cls.id" class="audit-item"
                    :class="{ completed: getClassStatus(cls) === 'completed', active: getClassStatus(cls) === 'active' }"
                    @click="getClassStatus(cls) !== 'completed' && enterBookroom(cls.type, true)">
                    <view :class="cls.type.includes('morning') ? 'fas fa-sun' : 'fas fa-moon'" class="audit-item-icon">
                    </view>
                    <view class="audit-item-name">{{ cls.name }}</view>
                    <view class="audit-item-time">{{ cls.timeRange }}</view>
                    <view v-if="getClassStatus(cls) === 'completed'" class="audit-item-status completed">已结束</view>
                    <view v-else-if="getClassStatus(cls) === 'active'" class="audit-item-status active">旁听</view>
                    <view v-else class="audit-item-status upcoming">{{ getClassCountdown(cls) }}</view>
                  </view>
                </view>
              </Transition>
            </view>
          </view>

          <view class="task-card fade-in" style="animation-delay: 0.2s">
            <view class="task-header">
              <view class="task-icon">
                <view class="fas fa-feather"></view>
              </view>
              <view class="task-title">
                <view class="task-title-text">今日觉察任务</view>
                <view class="task-title-source">来自{{ user.bootcamp?.info.currentBook.chapter }}</view>
              </view>
              <view class="task-badge">待完成</view>
            </view>
            <view class="task-content">
              今天遇到让你不舒服的事时，先问自己：<view>「这是谁的课题？」</view>
            </view>
            <view class="task-action">
              <view class="btn-task" @click="recordAwareness">
                <view class="fas fa-feather"></view> 写下此刻的觉察
              </view>
            </view>
          </view>

          <view class="section-header fade-in" style="animation-delay: 0.25s">
            <view>听书房</view>
            <view href="#" @click.prevent="goToAudiobooks">全部 ></view>
          </view>

          <view class="book-scroll fade-in" style="animation-delay: 0.3s">
            <view v-for="book in recommendedBooks" :key="book.id" class="book-card" @click="goToBook(book.id)">
              <image :src="book.cover" class="book-cover" mode="aspectFill"></image>
              <view class="book-title">{{ book.title }}</view>
              <view class="book-duration">
                <view class="fas fa-clock"></view> {{ book.duration }}
              </view>
            </view>
          </view>
        </template>

        <view v-if="isLoggedIn && user.stats.totalJournals > 0" class="insight-card fade-in"
          style="animation-delay: 0.4s">
          <view class="insight-header">
            <view class="insight-icon">
              <view class="fas fa-sparkles"></view>
            </view>
            <view class="insight-title">AI 本周洞见</view>
            <view href="#" class="insight-more" @click.prevent="viewInsightDetails">
              详情 <view class="fas fa-chevron-right"></view>
            </view>
          </view>
          <view class="insight-content">
            这周你在日记中3次提到「边界感」，相比上周对「压力」的关注，你的觉察方向正在从情绪转向关系。这是很棒的进步
          </view>
        </view>

        <view class="dev-switcher fade-in" style="animation-delay: 0.5s">
          <view class="dev-label">
            <view class="fas fa-code"></view> 开发模式 - 切换用户状态
          </view>
          <view class="dev-buttons">
            <view v-for="status in userStatuses" :key="status.value" class="dev-btn"
              :class="{ active: user.status === status.value }" @click="switchUserStatus(status.value)">
              {{ status.label }}
            </view>
          </view>
        </view>

        <view style="height: 160rpx"></view>

        <view class="fab" @click="writeJournal">
          <view class="fab-label">记录此刻</view>
          <view class="fas fa-feather"></view>
        </view>

        <CelebrationModal :visible="showCelebration" :icon="celebrationData.icon" :title="celebrationData.title"
          :message="celebrationData.message" :stats="celebrationData.stats" :encourage="celebrationData.encourage"
          :button-text="celebrationData.buttonText" @close="showCelebration = false" />
      </view>
    </template>
  </page-root>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CelebrationModal from './components/CelebrationModal.vue'
import { useUser, type UserStatus } from '@/composables/useUser'

const router = useRouter()

const {
  user,
  isLoggedIn,
  hasAudiobook,
  hasBootcamp,
  isVip,
  isFreeUser,
  isGuest,
  auditableClasses,
  getClassStatus,
  getClassCountdown,
  switchUserStatus
} = useUser()

const userStatuses: { value: UserStatus; label: string }[] = [
  { value: 'guest', label: '游客' },
  { value: 'free', label: '免费' },
  { value: 'audiobook', label: '听书房' },
  { value: 'bootcamp', label: '共读营' },
  { value: 'audiobook_bootcamp', label: '双产品' },
  { value: 'vip', label: 'VIP' }
]

const showCelebration = ref(false)
const showAuditClasses = ref(false)

const bootcampMyClass = computed(() => user.value.bootcamp?.info.myClass)

const myClassStatus = computed(() => {
  if (!bootcampMyClass.value) return 'upcoming'
  return getClassStatus(bootcampMyClass.value)
})

const myClassCountdown = computed(() => {
  if (!bootcampMyClass.value) return ''
  return getClassCountdown(bootcampMyClass.value)
})

const myClassIcon = computed(() => {
  if (!bootcampMyClass.value) return 'fas fa-moon'
  return bootcampMyClass.value.type.includes('morning') ? 'fas fa-sun' : 'fas fa-moon'
})

const streakEncouragement = computed(() => {
  const days = user.value.stats.streakDays
  if (days >= 30) return '一个月了！你已经养成了觉察的习惯'
  if (days >= 21) return '21天！习惯正在形成，继续保持'
  if (days >= 14) return '两周了！你的坚持让人钦佩'
  if (days >= 7) return '一周了！觉察的种子正在生根发芽'
  if (days >= 3) return '连续3天！好的开始是成功的一半'
  if (days >= 1) return '今天也要记得觉察哦'
  return '开始你的觉察之旅吧'
})

const celebrationData = computed(() => {
  const days = user.value.stats.streakDays
  if (days === 7) {
    return {
      icon: 'fas fa-fire',
      title: '一周成就达成！',
      message: '连续7天的觉察，你已经迈出了改变的第一步',
      stats: [
        { value: 7, label: '连续天数' },
        { value: user.value.stats.totalJournals, label: '觉察日记' }
      ],
      encourage: '习惯正在萌芽，继续浇灌它',
      buttonText: '继续加油'
    }
  }
  if (days === 21) {
    return {
      icon: 'fas fa-seedling',
      title: '21天习惯养成！',
      message: '心理学说21天可以养成一个习惯，你做到了',
      stats: [
        { value: 21, label: '连续天数' },
        { value: user.value.stats.totalJournals, label: '觉察日记' }
      ],
      encourage: '觉察已经成为你生活的一部分',
      buttonText: '太棒了'
    }
  }
  if (days === 30) {
    return {
      icon: 'fas fa-trophy',
      title: '满月成就！',
      message: '整整一个月，你的内在正在发生深刻的变化',
      stats: [
        { value: 30, label: '连续天数' },
        { value: user.value.stats.totalJournals, label: '觉察日记' }
      ],
      encourage: '你已经是一个觉察者了',
      buttonText: '继续前行'
    }
  }
  return {
    icon: 'fas fa-star',
    title: `连续${days}天！`,
    message: '每一天的觉察都是送给自己的礼物',
    stats: [
      { value: days, label: '连续天数' }
    ],
    encourage: '保持这份觉知，继续前行',
    buttonText: '好的'
  }
})

const showStreakCelebration = () => {
  showCelebration.value = true
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  const nickname = user.value.nickname || '探索者'
  const greetings = {
    morning: {
      title: `早安，${nickname}`,
      subtitle: '新的一天，新的觉察'
    },
    noon: {
      title: `中午好，${nickname}`,
      subtitle: '忙碌中别忘了关照自己'
    },
    afternoon: {
      title: `下午好，${nickname}`,
      subtitle: '今天有什么新发现吗？'
    },
    evening: {
      title: `晚上好，${nickname}`,
      subtitle: hasBootcamp.value ? '书房的伙伴们在等你' : '来听一本好书吧'
    },
    night: {
      title: `夜深了，${nickname}`,
      subtitle: '今天辛苦了，好好休息'
    }
  }

  if (hour >= 5 && hour < 11) return greetings.morning
  if (hour >= 11 && hour < 13) return greetings.noon
  if (hour >= 13 && hour < 18) return greetings.afternoon
  if (hour >= 18 && hour < 23) return greetings.evening
  return greetings.night
})

const todayDate = computed(() => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[now.getDay()]
  return `${month}月${day}日 ${weekday}`
})

const sessionAvatars = [
  { id: 1, src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 2, src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 3, src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' }
]

const recommendedBooks = [
  { id: '1', title: '被讨厌的勇气', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop', duration: '38分钟' },
  { id: '2', title: '非暴力沟通', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&h=160&fit=crop', duration: '42分钟' },
  { id: '3', title: '心流', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=120&h=160&fit=crop', duration: '35分钟' },
  { id: '4', title: '当下的力量', cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=120&h=160&fit=crop', duration: '40分钟' }
]

const handleTabChange = (tab: string) => {
  const routes: Record<string, string> = {
    home: '/home',
    bookroom: hasBootcamp.value ? '/bookroom-hub' : '/audiobooks',
    journal: '/journal',
    plaza: '/plaza',
    profile: '/profile'
  }
  router.push(routes[tab] || '/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToAudiobooks = () => {
  router.push('/audiobooks')
}

const goToBootcampIntro = () => {
  router.push('/bootcamp-intro')
}

const goToBook = (bookId: string) => {
  router.push(`/book/${bookId}`)
}

const playSampleBook = () => {
  router.push('/book/1')
}

const continueListening = () => {
  if (user.value.audiobook?.info.currentBook) {
    router.push(`/book/${user.value.audiobook.info.currentBook.id}`)
  }
}

const enterBookroom = (classType?: string, isAudit?: boolean) => {
  const params = new URLSearchParams()
  if (classType) params.append('class', classType)
  if (isAudit) params.append('audit', 'true')
  const queryString = params.toString()
  router.push(`/bookroom${queryString ? `?${queryString}` : ''}`)
}

const recordAwareness = () => {
  router.push('/write-journal')
}

const writeJournal = () => {
  router.push('/write-journal')
}

const viewInsightDetails = () => {
  router.push('/report')
}
</script>

<style scoped>
.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.date-info {
  display: flex;
  flex-direction: column;
}

.date-greeting {
  font-size: 44rpx;
  color: var(--text-primary);
  font-weight: 700;
}

.date-subtitle {
  font-size: 28rpx;
  color: var(--accent-gold);
  margin-top: 4rpx;
}

.date-today {
  font-size: 26rpx;
  color: var(--text-muted);
  margin-top: 8rpx;
}

.streak-badge {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 28rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.2) 0%, rgba(243, 156, 18, 0.1) 100%);
  border-radius: 40rpx;
  border: 2rpx solid rgba(244, 208, 63, 0.3);
  cursor: pointer;
}

.streak-badge view {
  color: var(--accent-gold);
}

.streak-badge view {
  font-size: 26rpx;
  color: var(--accent-gold);
  font-weight: 600;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 28rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40rpx;
  cursor: pointer;
}

.login-btn view {
  color: var(--text-muted);
}

.login-btn view {
  font-size: 26rpx;
  color: var(--text-primary);
}

.streak-encourage {
  margin-bottom: 32rpx;
  padding: 20rpx 28rpx;
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.1) 0%, rgba(46, 204, 113, 0.05) 100%);
  border-radius: 24rpx;
  border: 2rpx solid rgba(88, 214, 141, 0.2);
}

.streak-encourage-text {
  font-size: 26rpx;
  color: var(--accent-green);
  font-weight: 500;
}

.welcome-banner {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 40rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.15) 0%, rgba(243, 156, 18, 0.08) 100%);
  border-radius: var(--radius-lg);
  margin-bottom: 40rpx;
  border: 2rpx solid rgba(244, 208, 63, 0.2);
}

.welcome-icon {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  color: #1a1a2e;
}

.welcome-content {
  flex: 1;
}

.welcome-content .wel-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4rpx;
}

.welcome-content .wel-subtitle {
  font-size: 26rpx;
  color: var(--text-muted);
}

.btn-register {
  padding: 20rpx 36rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border: none;
  border-radius: 40rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a2e;
  cursor: pointer;
}

.trial-status {
  display: flex;
  gap: 24rpx;
  margin-bottom: 40rpx;
}

.trial-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
  background: var(--bg-card);
  border-radius: 24rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
}

.trial-item view {
  color: var(--accent-gold);
}

.trial-item view {
  color: var(--accent-gold);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.section-header .sec-title {
  font-size: 32rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.section-header view {
  font-size: 26rpx;
  color: var(--text-muted);
  text-decoration: none;
}

.section-tag {
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  border-radius: 16rpx;
}

.section-tag.free {
  background: rgba(88, 214, 141, 0.15);
  color: var(--accent-green);
}

.promo-card {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 32rpx;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  margin-bottom: 24rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.promo-card:hover {
  transform: translateY(-4rpx);
}

.promo-card.audiobook {
  border: 2rpx solid rgba(93, 173, 226, 0.2);
}

.promo-card.bootcamp {
  border: 2rpx solid rgba(244, 208, 63, 0.2);
}

.promo-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
}

.promo-card.audiobook .promo-icon {
  background: rgba(93, 173, 226, 0.2);
  color: var(--accent-blue);
}

.promo-card.bootcamp .promo-icon {
  background: rgba(244, 208, 63, 0.2);
  color: var(--accent-gold);
}

.promo-content {
  flex: 1;
}

.promo-content .proc-name {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 8rpx;
}

.promo-content view {
  font-size: 26rpx;
  color: var(--text-muted);
  margin-bottom: 8rpx;
}

.promo-tag {
  font-size: 22rpx;
  color: var(--text-muted);
  opacity: 0.8;
}

.promo-arrow {
  color: var(--text-muted);
  font-size: 28rpx;
}

.sample-book-card {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 32rpx;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  margin-bottom: 40rpx;
  cursor: pointer;
}

.sample-cover {
  width: 120rpx;
  height: 160rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
}

.sample-info {
  flex: 1;
}

.sample-info .smp-title {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4rpx;
}

.sample-author {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-bottom: 8rpx;
}

.sample-desc {
  font-size: 26rpx;
  color: var(--text-secondary);
  margin-bottom: 12rpx;
}

.sample-meta {
  display: flex;
  gap: 24rpx;
  font-size: 22rpx;
  color: var(--text-muted);
}

.sample-meta view {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.sample-play-btn {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 32rpx;
  cursor: pointer;
}

.journal-promo {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.1) 0%, rgba(46, 204, 113, 0.05) 100%);
  border: 2rpx solid rgba(88, 214, 141, 0.2);
  border-radius: var(--radius-lg);
  margin-bottom: 40rpx;
}

.journal-promo-icon {
  width: 88rpx;
  height: 88rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-green);
  font-size: 36rpx;
}

.journal-promo-content {
  flex: 1;
}

.journal-promo-content view {
  font-size: 28rpx;
  color: var(--text-primary);
}

.journal-promo-hint {
  font-size: 24rpx;
  color: var(--text-muted);
  margin-top: 4rpx;
}

.btn-journal-start {
  padding: 20rpx 36rpx;
  background: rgba(88, 214, 141, 0.2);
  border: 2rpx solid rgba(88, 214, 141, 0.3);
  border-radius: 36rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--accent-green);
  cursor: pointer;
}

.current-listen {
  margin-bottom: 32rpx;
}

.current-listen-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 26rpx;
  color: var(--accent-blue);
  margin-bottom: 20rpx;
}

.current-listen-card {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 28rpx;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  cursor: pointer;
}

.listen-cover {
  width: 112rpx;
  height: 112rpx;
  border-radius: 20rpx;
}

.listen-info {
  flex: 1;
}

.listen-info view {
  font-size: 30rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 16rpx;
}

.listen-progress {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.listen-progress-bar {
  flex: 1;
  height: 8rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4rpx;
  overflow: hidden;
}

.listen-progress-fill {
  height: 100%;
  background: var(--accent-blue);
  border-radius: 4rpx;
}

.listen-progress view {
  font-size: 22rpx;
  color: var(--text-muted);
}

.listen-play-btn {
  width: 80rpx;
  height: 80rpx;
  background: var(--accent-blue);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28rpx;
  cursor: pointer;
}

.listen-stats {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.listen-stat {
  flex: 1;
  text-align: center;
  padding: 28rpx;
  background: var(--bg-card);
  border-radius: var(--radius-md);
}

.stat-value {
  display: block;
  font-size: 44rpx;
  color: var(--text-primary);
  font-weight: 700;
}

.stat-label {
  font-size: 22rpx;
  color: var(--text-muted);
}

.book-scroll {
  display: flex;
  gap: 24rpx;
  overflow-x: auto;
  padding-bottom: 16rpx;
  margin-bottom: 40rpx;
}

.book-card {
  flex-shrink: 0;
  width: 200rpx;
  cursor: pointer;
}

.book-cover {
  width: 200rpx;
  height: 280rpx;
  border-radius: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
}

.book-title {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 4rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-duration {
  font-size: 22rpx;
  color: var(--text-muted);
}

.upgrade-banner {
  display: flex;
  align-items: center;
  gap: 28rpx;
  padding: 32rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.12) 0%, rgba(243, 156, 18, 0.06) 100%);
  border: 2rpx solid rgba(244, 208, 63, 0.2);
  border-radius: var(--radius-lg);
  margin-bottom: 40rpx;
  cursor: pointer;
}

.upgrade-banner.audiobook {
  background: linear-gradient(135deg, rgba(93, 173, 226, 0.12) 0%, rgba(52, 152, 219, 0.06) 100%);
  border-color: rgba(93, 173, 226, 0.2);
}

.upgrade-icon {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 36rpx;
}

.upgrade-banner.audiobook .upgrade-icon {
  background: linear-gradient(135deg, var(--accent-blue) 0%, #3498db 100%);
}

.upgrade-content {
  flex: 1;
}

.upgrade-content view {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 4rpx;
}

.upgrade-content view {
  font-size: 24rpx;
  color: var(--text-muted);
}

.upgrade-tag {
  font-size: 24rpx;
  color: var(--accent-gold);
}

.upgrade-banner.audiobook .upgrade-tag {
  color: var(--accent-blue);
}

.vip-badge {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 28rpx;
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.2) 0%, rgba(243, 156, 18, 0.1) 100%);
  border: 2rpx solid rgba(244, 208, 63, 0.3);
  border-radius: 40rpx;
  margin-bottom: 24rpx;
}

.vip-badge view {
  color: var(--accent-gold);
}

.vip-badge view {
  font-size: 26rpx;
  color: var(--accent-gold);
  font-weight: 600;
}

.vip-remain {
  font-size: 22rpx;
  color: var(--text-muted);
  font-weight: 400;
  margin-left: 8rpx;
}

.class-badge {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 24rpx;
  background: rgba(93, 173, 226, 0.15);
  border-radius: 24rpx;
  font-size: 24rpx;
  color: var(--accent-blue);
  margin-bottom: 32rpx;
}

.my-class-section {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.my-class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}

.my-class-label {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 28rpx;
  color: var(--accent-gold);
  font-weight: 600;
}

.my-class-label view {
  font-size: 24rpx;
}

.my-class-book {
  font-size: 24rpx;
  color: var(--text-muted);
}

.my-class-card {
  background: linear-gradient(135deg, rgba(244, 208, 63, 0.12) 0%, rgba(243, 156, 18, 0.06) 100%);
  border: 2rpx solid rgba(244, 208, 63, 0.25);
  border-radius: 28rpx;
  padding: 32rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.my-class-card:hover {
  border-color: rgba(244, 208, 63, 0.4);
  transform: translateY(-2rpx);
}

.my-class-card.completed {
  opacity: 0.8;
  cursor: default;
}

.my-class-card.completed:hover {
  transform: none;
}

.my-class-card.active {
  background: linear-gradient(135deg, rgba(88, 214, 141, 0.15) 0%, rgba(46, 204, 113, 0.08) 100%);
  border-color: rgba(88, 214, 141, 0.4);
}

.my-class-icon {
  width: 88rpx;
  height: 88rpx;
  background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-orange) 100%);
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1a2e;
  font-size: 36rpx;
  margin-bottom: 24rpx;
}

.my-class-card.active .my-class-icon {
  background: linear-gradient(135deg, var(--accent-green) 0%, #2ecc71 100%);
}

.my-class-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
}

.my-class-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.my-class-name {
  font-size: 36rpx;
  color: var(--text-primary);
  font-weight: 700;
}

.my-class-time {
  font-size: 26rpx;
  color: var(--text-muted);
}

.my-class-status .status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 28rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.status-badge.completed {
  background: rgba(88, 214, 141, 0.15);
  color: var(--accent-green);
}

.status-badge.active {
  background: rgba(88, 214, 141, 0.2);
  color: var(--accent-green);
}

.status-badge.upcoming {
  background: rgba(244, 208, 63, 0.15);
  color: var(--accent-gold);
}

.live-dot {
  width: 12rpx;
  height: 12rpx;
  background: var(--accent-green);
  border-radius: 50%;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.my-class-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.my-class-avatars {
  display: flex;
  align-items: center;
}

.my-class-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(26, 26, 46, 0.5);
  margin-left: -16rpx;
}

.my-class-avatar:first-child {
  margin-left: 0;
}

.my-class-avatar-more {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 4rpx solid rgba(26, 26, 46, 0.5);
  margin-left: -16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  color: var(--text-muted);
}

.btn-enter-class {
  padding: 20rpx 36rpx;
  background: linear-gradient(135deg, var(--accent-green) 0%, #2ecc71 100%);
  border: none;
  border-radius: 36rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 12rpx;
  cursor: pointer;
}

.my-class-completed-info {
  display: flex;
  gap: 40rpx;
  font-size: 26rpx;
  color: var(--text-muted);
}

.my-class-completed-info view {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.my-class-completed-info view {
  font-size: 24rpx;
  color: var(--accent-green);
}

.audit-section {
  margin-top: 28rpx;
  padding-top: 28rpx;
  border-top: 2rpx solid rgba(255, 255, 255, 0.08);
}

.audit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 16rpx 0;
}

.audit-label {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 26rpx;
  color: var(--text-secondary);
}

.audit-label view {
  color: var(--text-muted);
}

.audit-header>view {
  font-size: 24rpx;
  color: var(--text-muted);
}

.audit-list {
  margin-top: 20rpx;
}

.audit-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20rpx;
  margin-bottom: 16rpx;
  cursor: pointer;
  transition: all 0.2s;
}

.audit-item:last-child {
  margin-bottom: 0;
}

.audit-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.audit-item.completed {
  opacity: 0.6;
  cursor: default;
}

.audit-item.completed:hover {
  background: rgba(255, 255, 255, 0.03);
}

.audit-item-icon {
  font-size: 28rpx;
  color: var(--accent-gold);
  width: 40rpx;
  text-align: center;
}

.audit-item-name {
  font-size: 26rpx;
  color: var(--text-primary);
  font-weight: 500;
}

.audit-item-time {
  font-size: 24rpx;
  color: var(--text-muted);
  flex: 1;
}

.audit-item-status {
  font-size: 22rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-weight: 500;
}

.audit-item-status.completed {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
}

.audit-item-status.active {
  background: rgba(93, 173, 226, 0.2);
  color: var(--accent-blue);
}

.audit-item-status.upcoming {
  background: rgba(244, 208, 63, 0.15);
  color: var(--accent-gold);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 400rpx;
}

.task-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 32rpx;
  border: 2rpx solid rgba(88, 214, 141, 0.2);
}

.task-header {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.task-icon {
  width: 80rpx;
  height: 80rpx;
  background: rgba(88, 214, 141, 0.2);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-green);
  font-size: 32rpx;
}

.task-title {
  flex: 1;
}

.task-title-text {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.task-title-source {
  font-size: 24rpx;
  color: var(--text-muted);
}

.task-badge {
  padding: 8rpx 20rpx;
  background: rgba(88, 214, 141, 0.15);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: var(--accent-green);
  font-weight: 600;
}

.task-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 24rpx;
  padding-left: 104rpx;
}

.task-content view {
  color: var(--accent-green);
}

.task-action {
  padding-left: 104rpx;
}

.btn-task {
  width: 100%;
  padding: 24rpx;
  background: rgba(88, 214, 141, 0.15);
  border: 2rpx solid rgba(88, 214, 141, 0.3);
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: var(--accent-green);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  cursor: pointer;
}

.insight-card {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.12) 0%, rgba(142, 68, 173, 0.06) 100%);
  border-radius: var(--radius-lg);
  padding: 32rpx;
  margin-bottom: 32rpx;
  border: 2rpx solid rgba(155, 89, 182, 0.2);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.insight-icon {
  width: 64rpx;
  height: 64rpx;
  background: rgba(155, 89, 182, 0.2);
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9b59b6;
  font-size: 28rpx;
}

.insight-title {
  font-size: 28rpx;
  color: var(--text-primary);
  font-weight: 600;
}

.insight-more {
  margin-left: auto;
  font-size: 24rpx;
  color: var(--text-muted);
  text-decoration: none;
}

.insight-content {
  font-size: 28rpx;
  color: var(--text-secondary);
  line-height: 1.7;
}

.dev-switcher {
  padding: 32rpx;
  background: rgba(155, 89, 182, 0.1);
  border: 2rpx dashed rgba(155, 89, 182, 0.3);
  border-radius: var(--radius-lg);
  margin-bottom: 32rpx;
}

.dev-label {
  font-size: 24rpx;
  color: #9b59b6;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.dev-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.dev-btn {
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.1);
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 16rpx;
  font-size: 24rpx;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.dev-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.dev-btn.active {
  background: rgba(155, 89, 182, 0.3);
  border-color: rgba(155, 89, 182, 0.5);
  color: #b39ddb;
}

.fab {
  position: fixed;
  bottom: 20rpx;
  right: 40rpx;
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, #f8a5c2 0%, #f78fb3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 44rpx;
  box-shadow: 0 8rpx 40rpx rgba(248, 165, 194, 0.4);
  cursor: pointer;
  z-index: 50;
  border: none;
}

.fab-label {
  position: absolute;
  right: 132rpx;
  background: var(--bg-card);
  padding: 12rpx 24rpx;
  border-radius: 16rpx;
  font-size: 26rpx;
  color: var(--text-primary);
  white-space: nowrap;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.2);
}
</style>
