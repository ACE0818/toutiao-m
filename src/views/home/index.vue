<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
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
    <div slot="nav-right" class="hamburger-btn">
        <i class="toutiao toutiao-gengduo"></i>
    </div>
  </van-tabs>
    <!-- /文章频道列表 -->
  </div>
</template>

<script>
// 1、导入获取频道列表的方法
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  props: {},
  data () {
    return {
      active: 0,
      // 4、定义数据接收频道列表
      channels: []
    }
  },
  computed: {},
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
        const { data } = await getUserChannels()
        this.channels = data.data.channels
      } catch (error) {
        this.$toast('获取频道列表数据失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
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
    .van-tabs_wrap {
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
