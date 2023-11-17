<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text, index) in suggestion"
      :key="index"
      @click="$emit('search', text)"
      icon="search">
        <span slot="title" v-html="highlight(text)"></span>
      </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    searchText: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  computed: {},
  watch: {
    searchText: {
      // handler (val) {
      //   this.loadSearchSuggestions(val)
      // },
      handler: debounce(function (val) {
        this.loadSearchSuggestions(val)
      }, 400),
      immediate: true
    }
  },
  created () {},
  mounted () {},
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('获取失败')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      // 字面量的方式创建正则表达式 /正则表达式/gi  /this.searchText/gi  /he/gi
      // text.replace(/匹配的内容/gi, highlightStr)
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
