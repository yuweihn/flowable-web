<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="16">
        <div class="block">
          <el-card class="update-log">
            <div class="menu">
              <div
                class="menu-item"
                v-for="(item, index) in menuList"
                :key="index"
                @click="goTarget(item.path)"
              >
                <div v-if="item.name == '待办任务'&& todoListCount !== 0" class="notice">
                  {{ todoListCount }}
                </div>
                <svg-icon :icon-class="item.icon" />
                <div class="menu-name">{{ item.name }}</div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div class="userInfo">
            <div class="avatar">
              <img :src="$store.state.user.avatar" alt="#" />
            </div>
            <div class="infomation">
              <div>
                <span style="color: #3493cb">{{ $store.state.user.name }}</span>
                <span style="margin-left: 5px">{{
                  $store.state.user.userInfo.phonenumber
                }}</span>
              </div>
              <div class="department">
                {{ $store.state.user.userInfo.dept.deptName }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>联系信息</span>
          </div>
          <div class="body">
            <p>
              <i class="el-icon-phone"></i> 24小时热线：
              <a href="javascript:;">021-31600201</a>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>更新日志</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item title="v1.0.0 - 2021-04-07">
              <ol>
                <li>初始化</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>加入畅诺</span>
          </div>
          <div class="body">
            <img
              src="@/assets/images/join-us.png"
              alt="donate"
              style="width: 178px; height: 178px"
            />
            <span class="tip">扫码关注畅诺科技</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getTodoListCount } from "@/api/home";
export default {
  name: "index",
  data() {
    return {
      // 版本号
      version: "1.0.0",
      // 快捷入口
      routerList: [
        {
          icon: "user",
          name: "用户管理",
          path: "/system/user",
        },
        {
          icon: "people",
          name: "客户管理",
          path: "/system/customer",
        },
        {
          icon: "cascader",
          name: "待办任务",
          path: "/task/todolist",
        },
        {
          icon: "time-range",
          name: "已办任务",
          path: "/task/finished",
        },
        {
          icon: "tree",
          name: "全部流程",
          path: "/task/process",
        },
        {
          icon: "shopping",
          name: "订单",
          path: "/biz/order",
        },
      ],
      menuList: [],
      todoListCount: 0,
    };
  },
  mounted() {
    this.getTodoListCount();
    this.showQuickEntrance();
  },
  methods: {
    //展示首页快捷菜单
    showQuickEntrance() {
      let routers = this.$store.state.permission.routes.filter(
        (item) => item.hidden !== true
      );
      routers.forEach((item) => {
        if (item.children) {
          item.children.forEach((t) => {
            this.routerList.forEach((r) => {
              if (r.name == t.meta.title) {
                this.menuList.push(r);
              }
            });
          });
        }
      });
    },
    //快捷入口跳转
    goTarget(href) {
      this.$router.push(href);
    },

    //获取待办任务数量
    getTodoListCount() {
      getTodoListCount().then((res) => {
        this.todoListCount = res.data;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
.menu {
  display: flex;
  justify-content: space-around;
  .menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    .notice {
      position: absolute;
      min-width: 24px;
      height: 15px;
      border-radius: 10px;
      background: #f4523b;
      z-index: 1000;
      color: #fff;
      vertical-align: middle;
      padding: 2px;
      text-align: center;
      box-sizing: content-box;
      left: 20px;
      top: -13px;
    }
    .svg-icon {
      font-size: 24px;
      color: #3493cb;
    }
    .menu-name {
      margin-top: 15px;
    }
  }
}
.userInfo {
  display: flex;
  align-content: center;
  .avatar {
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .infomation {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    .department {
      margin-top: 15px;
    }
  }
}
.tip {
  display: flex;
  flex-wrap: wrap;
  height: 30px;
  line-height: 30px;
}
</style>

