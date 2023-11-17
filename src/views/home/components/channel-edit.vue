<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}
      </van-button>
    </van-cell>
      <van-grid class="my-grid" :gutter="10">
        <van-grid-item
          class="grid-item"
          v-for="(channel, index) in myChannels"
          :key="index"
          @click="onMyChannelClick(channel, index)"
        >
          <van-icon
            v-show="isEdit && !fiexdChannels.includes(channel.id)"
            slot="icon"
            name="clear"
          ></van-icon>
          <span class="text" :class="{active:  index === active}" slot="text">
            {{ channel.name }}
          </span>
        </van-grid-item>
      </van-grid>
    <!-- /我的频道 -->
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
        <van-grid-item
          class="grid-item"
          v-for="(channel, index) in recommendChannels"
          :key="index"
          :text="channel.name"
          icon='plus'
          @click="onAddChannel(channel)"
        />
      </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态的显示
      fiexdChannels: [0] // 固定频道的id，不允许删除
    }
  },
  computed: {
    recommendChannels () {
      const channels = []
      this.allChannels.forEach(channel => {
        // find 遍历数组，找到满足条件的元素项，如果没找到则返回undefined
        const ret = this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        // 如果我的频道中不包括该频道项，则收集到推荐频道中
        if (!ret) {
          channels.push(channel)
        }
      })
      // 把计算结果返回
      return channels
    },
    // 获取user
    ...mapState(['user'])
    // 简化版本
    // recommendChannels () {
    //   // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
    //   return this.allChannels.filter(channel => {
    //     // const channels = []

    //     // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
    //     return !this.myChannels.find(myChannel => {
    //       return myChannel.id === channel.id
    //     })

    //     // return channels
    //   })
    // }
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    // 加载所有频道
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (error) {
        this.$toast('获取频道列表数据失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)
      if (this.user) {
        // 已登录
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
          this.$toast('添加成功')
        } catch (error) {
          this.$toast('保存失败')
        }
      } else {
        // 未登陆
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，将数据存储到线上
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据存储到本地
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (error) {
        console.log(error)
        this.$toast('删除频道失败，请稍后重试')
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 编辑状态 删除频道
        // 1. 如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          // 后续代码不再执行
          return
        }
        // 删除频道项
        this.myChannels.splice(index, 1)
        // 2. 如果删除的激活频道之前的频道，则更新激活的频道项
        if (index <= this.active) {
          // 让激活频道的索引 - 1
          this.$emit('update-active', this.active - 1, true)
        }
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index, false)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    border: 1px solid #f85959;
    font-size: 26px;
    color: #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
    }
    /* 在.grid-item 新增这一行代码 去除定位设置 */
    .van-grid-item__icon-wrapper {
        position: unset;
    }
    .van-grid-item__text,
    .text  {
            font-size: 28px;
            color: #222;
            margin-top: 0;
        }
        .active {
            color: red;
        }
  }
  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
        // .van-grid-item__text {
        //   margin-top: 0;
        // }
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 32px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>
