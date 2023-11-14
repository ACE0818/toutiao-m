<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录">
      <van-icon
        slot="left"
        name="cross"
        @click="$router.back()"
      />
    </van-nav-bar>
    <!-- 导航栏 -->

    <!-- 登录表单 -->
    <van-form
      ref="loginForm"
      @submit="onSubmit"
    >
        <van-field
          v-model = "user.mobile"
          clearable
          :rules="userFormRules.mobile"
          type="number"
          maxlength="11"
          placeholder = "请输入手机号"
          name="mobile"
        >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
        </van-field>
        <van-field
          v-model = "user.code"
          :rules="userFormRules.code"
          type="number"
          maxlength="6"
          placeholder="请输入验证码"
          name="code"
        >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!-- time: 倒计时时间 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            @click="onSendSms"
          >发送验证码</van-button>
        </template>
        </van-field>
        <div class="login-btn-wrap">
            <van-button class="login-btn"  block type="info" native-type="submit">
                登录
            </van-button>
        </div>
    </van-form>
    <!-- 登录表单 -->
    <div>
      测试账号：用自己的手机号(18612345678)
      万能验证码：246810
    </div>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      // 1、获取表单数据
      const user = this.user

      // 2、表单验证

      // 3、提交表单请求登录
      this.$toast.loading({
        duration: 0, // 持续时间，默认时间2s，0表示持续展示不停止，直到成功或失败
        forbidClick: true, // 是否禁止背景点击（forbid：禁止）
        message: '登录中...' // 提示消息
      })
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')

        // 登录成功，跳转回原来页面
        this.$router.back()
      } catch (error) {
        if (error.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }

      // 4、根据请求响应结果处理后续操作
    },
    async onSendSms () {
      // 1、校验手机号
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (error) {
        return console.log('验证失败', error)
      }

      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
    .toutiao {
        font-size: 37.5px;
    }
    .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
    // 清除按钮默认的内边距
    padding: 0;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
