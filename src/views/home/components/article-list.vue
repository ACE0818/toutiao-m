<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
          />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      list: [], // 文章列表数据
      loading: false, // 上拉加载更多的 loading 状态
      finished: false, // 是否加载结束
      error: false, // 是否加载失败
      timestamp: null, // 请求下一页数据的时间戳
      isreFreshLoading: false, // 控制下拉刷新的失败状态
      refreshSuccessText: '' // 下来刷新成功的提示文案
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        // 1、请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          // 第一次获取数据时，传递Date.now()； 后续翻页传递this.timestamp (这个后续有处理)
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 2. 把数据添加到 list 数组中
        const { results } = data.data
        this.list.push(...results)
        // 3. 设置本次加载中 loading 状态结束
        this.loading = false

        // 4. 判断数据是否加载结束
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
      } catch (error) {
        console.log(error)
        this.loading = false // 关闭 loading 效果
        this.error = true // 开启错误提示
      }
    },
    // 当触发下拉刷新的时候调用该函数
    async onRefresh () {
      try {
        // 1、请求数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1
        })
        // 2、追加数据到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 3、关闭下拉刷新的loading状态
        this.isreFreshLoading = false

        // 4、提示成功
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (error) {
        this.refreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;

// 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  height: 79vh;
  overflow-y: auto;
}
</style>
