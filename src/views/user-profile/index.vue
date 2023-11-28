<template>
  <div class="user-profile-container">
    <!-- 导航栏 -->
    <van-nav-bar
    class="page-nav-bar"
    title="个人信息"
    left-arrow @click-left="$router.back()" />
    <!-- /导航栏 -->
    <input
      type="file"
      hidden
      ref="file"
      @change='onFileChange'
    >
    <van-cell
      title="头像"
      is-link
      class="photo-cell"
      center
      @click="$refs.file.click()">
      <van-image
               class="avatar"
               fit="cover"
               round
               :src="user.photo"
               />
    </van-cell>
    <van-cell title="昵称" @click="isUpdateNameShow = true" :value="user.name" is-link />
    <van-cell title="性别" @click="isUpdateGenderShow = true" :value="user.gender === 0 ? '男' : '女'" is-link />
    <van-cell title="生日" @click="isUpdateBirthdayShow = true" :value="user.birthdy" is-link />
    <!-- 编辑头像弹层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      style="height: 100%"
      position="bottom">
      <update-photo
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
    <!-- 编辑头像弹层 -->
    <!-- 编辑昵称弹层 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%;"
      position="bottom">
      <update-name
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>
    <!-- 编辑昵称弹层 -->
    <!-- 编辑性别弹层 -->
    <van-popup
      v-model="isUpdateGenderShow"
      position="bottom"
    >
      <update-gender v-if="isUpdateGenderShow" v-model="user.gender" @close="isUpdateGenderShow = false" />
    </van-popup>
    <!-- 编辑性别弹层 -->
    <!-- 编辑生日弹层 -->
    <van-popup
      v-model="isUpdateBirthdayShow"
      position="bottom">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        @close="isUpdateBirthdayShow = false"
        v-model="user.birthday"/>
    </van-popup>
    <!-- 编辑生日弹层 -->
  </div>
</template>

<script>
import { getUserProfile, getUserInfo } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfileIndex',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  props: {},
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    async loadUserProfile () {
      try {
        const data1 = await getUserInfo()
        console.log(data1.data.data)
        const { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
      } catch (error) {
        this.$toast.fail('获取数据失败')
      }
    },
    onFileChange () {
      // 获取上传文件
      const file = this.$refs.file.files[0]
      // 通过调用 URL.createObjectURL(file) 来生成图片的一张缩略预览图
      this.img = window.URL.createObjectURL(file)
      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的 value 清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.user-profile-container {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background: #f5f7f9;
  }
  .photo-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
  }
}
</style>
