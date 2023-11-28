<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="黑马头条"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >
          加载中
        </van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详细 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
          <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
          <van-cell
            class="user-info"
            center
            :border="false"
          >
            <van-image
              class="avatar"
              slot="icon"
              round
              fit="cover"
              :src="article.aut_photo"
            />
            <div slot="title" class="user-name">{{ article.aut_name }}</div>
            <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
            <follow-user
              class="follow-btn"
              :user-id="article.aut_id"
              v-model="article.is_followed"
            />
          </van-cell>
        <!-- /用户信息 -->
        <!-- 测试文章 http://localhost:8080/#/article/7386 -->
        <!-- 文章内容 -->
          <div ref="article-content" class="article-content markdown-body" v-html="article.content"></div>
          <van-divider>正文结束</van-divider>
        <!-- /文章内容 -->
          <!-- 文章评论列表 -->
          <comment-list
            :source="article.art_id"
            @onload-success="totalCommentCount = $event.total_count"
            :list="commentList"
            @reply-click="onReplyClick"
          />
          <!-- /文章评论列表 -->
        <!-- 底部区域 -->
      <div class="article-bottom">
        <van-button
          class="comment-btn"
          type="default"
          round
          size="small"
          @click="isPostShow = true">写评论
        </van-button>
        <van-icon class="comment-icon" name="comment-o" color="#777" :badge="totalCommentCount" />
        <collect-article
          class="btn-item"
          v-model="article.is_collected"
          :article-id="article.art_id"
        />
        <like-article
          class="btn-item"
          v-model="article.attitude"
          :article-id="article.art_id"
        />
        <!-- <van-button class="btn-item" icon="star-o" /> -->
        <!-- <van-button class="btn-item" icon="good-job-o" /> -->
        <van-icon name="share" color="#777"></van-icon>
      </div>
    <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详细 -->

      <!-- 加载失败: 404 -->
        <div v-else-if="errStatus === 404" class="error-wrap">
          <van-icon name="failure"/>
          <p class="text">该资源不存在或已删除！</p>
        </div>
      <!-- /加载失败: 404 -->

      <!-- 加载失败: 其他未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure"/>
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败: 其他未知错误（例如网络原因或服务端异常） -->
    </div>
    <!-- 发布评论弹出层 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <comment-post
        :target="article.art_id"
        @post-success="onPostSuccess"
      />
    </van-popup>
    <!-- /发布评论弹出层 -->
    <!-- 评论回复 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 100%"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 给所有的后代组件提供数据
  // 然后在任何后代组件里，我们都可以使用 inject 选项来接收指定的我们想要添加在这个实例上的属性
  provide () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      commentList: [], // 评论列表
      article: {}, // 文章详情
      loading: false, // 加载中的loading状态
      errStatus: 0, // 失败的状态码
      totalCommentCount: 0,
      isPostShow: false, // 控制发布评论弹层
      isReplyShow: false, // 控制评论回复弹层
      currentComment: {} // 点击回复的那个评论对象
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errStatus = 404
        }
      }
      this.loading = false
    },
    previewImage () {
      // 获取所有的img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')

      // 获取所有img 地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组 注意：images属性名是固定的发布法
            images,
            // 起始位置，从 0 开始
            startPosition: index
          })
        }
      })
    },
    onPostSuccess (data) {
      // 关闭发布评论弹层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)

      // 实时更新评论数
      this.totalCommentCount++
    },
    onReplyClick (comment) {
      // console.log(comment)
      // 将子组件中传给我评论对象存储到当前组件
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import './github-markdown.css';
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
    .article-detail {
      position: fixed;
      left: 0;
      right: 0;
      top: 92px;
      bottom: 88px;
      overflow-y: scroll;
      background-color: #fff;
      .article-title {
        padding: 50px 32px;
        margin: 0;
        font-size: 40px;
        color: #3a3a3a;
      }
      .user-info{
        padding: 0 32px;
        .avatar {
          margin-right: 17px;
          width: 70px;
          height: 70px;
        }
        .van-cell__label {
          margin-top: 0;
        }
        .user-name {
          font-size: 24px;
          color: #3a3a3a;
        }
        .publish-date {
          font-size: 23px;
          color: #b7b7b7;
        }
        .follow-btn {
          width: 170px;
          height: 58px;
        }
      }
      .article-content {
        padding: 55px 32px;
        /deep/ p {
          text-align: justify;
        }
      }
    }
    .loading-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 200px 32px;
      background-color: #fff;
    }
    .error-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 200px 32px;
      background-color: #fff;
      .van-icon {
        font-size: 122px;
        color: #b4b4b4;
      }
      .text {
        margin: 33px 0 46px;
        font-size: 30px;
        color: #666;
      }
      .retry-btn {
        width: 280px;
        height: 70px;
        line-height: 70;
        border: 1px solid #c3c3c3;
        font-size: 30px;
        color: #666;
      }
    }
  }
  .article-bottom {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      border-top: 1px solid #d8d8d8;
      height: 88px;
      background-color: #fff;
      .comment-btn {
        width: 282px;
        height: 46px;
        border: 2px solid #eee;
        font-size: 30px;
        line-height: 46px;
        color: #a7a7a7;
      }
      /deep/ .van-icon {
        font-size: 40px;
      }
      .comment-icon {
        top: 2px;
        color: #777;
        .van-info {
          font-size: 16px;
          background-color: #e22829;
        }
      }
      .btn-item {
        border: none;
        padding: 0;
        height: 40px;
        line-height: 40px;
        .collect-btn--collected {
          color: #ffa500;
        }
        .like-btn--liked {
          color: #e5645f;
        }
      }
    }
}
</style>
