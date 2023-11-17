<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      fixed
    >
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 文章频道列表 -->
  <van-tabs
    class="channel-tabs"
    v-model="active"
    animated
    swipeable
    >
    <van-tab
      v-for="channel in channels"
      :key="channel.id"
      :title="channel.name"
    >
    <!-- 频道的文章列表 -->
      <article-list :channel="channel"/>
    <!-- /频道的文章列表 -->
    </van-tab>
    <div slot="nav-right" class="placeholder"></div>
    <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
    </div>
  </van-tabs>
    <!-- /文章频道列表 -->

    <!-- 频道编辑 -->
    <van-popup
      v-model="isChannelEditShow"
      round
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <channel-edit :myChannels="channels" :active="active" @update-active="onUpdateActive"/>
    </van-popup>
    <!-- /频道编辑 -->
  </div>
</template>

<script>
// 1、导入获取频道列表的方法
import { getUserChannels } from '@/api/channel.js'
import { getItem } from '@/utils/storage.js'
import { mapState } from 'vuex'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {},
  data () {
    return {
      active: 0,
      // 4、定义数据接收频道列表
      channels: [],
      isChannelEditShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    // 3. 调用获取频道列表
    this.loadChannels()
  },
  mounted () {},
  methods: {
    // 2. 定义加载频道列表数据的方法
    async loadChannels () {
      try {
        let channels = []
        const localChannels = getItem('TOUTIAO_CHANNELS')
        if (this.user || !localChannels) {
          // 登录 或者 未登录本地没有存储 获取后端数据
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录并且本地有数据
          channels = localChannels
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    onUpdateActive (index, isChannelEditShow = true) {
      // 更新激活的频道项
      this.active = index
      // 关闭编辑频道弹层
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon {
        font-size: 32px;
      }
    }
  }
  /deep/.channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      width: 100%;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &::before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>
