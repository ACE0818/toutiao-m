<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-history')">全部删除</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true"/>
    </van-cell>
    <van-cell
      v-for="(item, index) in searchHistories"
      :key="index"
      :title="item"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    searchHistories: {
      type: Array,
      require: true
    }
  },
  data () {
    return {
      // 定义当前是否是删除状态
      isDeleteShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style scoped lang="less">

</style>
