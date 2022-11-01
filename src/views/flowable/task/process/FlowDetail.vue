<template>
  <div class="app-container">
    <!--表单模块-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="表单信息" name="first">
        <span slot="label">
          <span class="el-icon-document">表单信息</span>
        </span>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button style="float: right;" type="primary" size="small" @click="goBack">返回</el-button>
            <el-button style="float: right; margin-right:10px" type="primary" size="small" plain v-if="isCopy" @click="copyData">复制</el-button>
          </div>
          <el-col :span="20" :offset="2">
            <div>
              <parser :key="new Date().getTime()" :form-conf="formConf" />
            </div>
            <div v-if="isShow == 'order'">
              <orderForm :formValue="formData" :flowAuthSettingList="flowAuthSettingList" :isStart="isStart" :isDetail="isDetail" :detailType="detailType"></orderForm>
            </div>
            <div v-if="isShow == 'contract'">
              <contractForm :formValue="formData" :flowAuthSettingList="flowAuthSettingList" :isStart="isStart" :isDetail="isDetail" :detailType="detailType"></contractForm>
            </div>
            <div v-if="isShow == 'impl'">
              <implForm :formValue="formData" :flowAuthSettingList="flowAuthSettingList" :isStart="isStart" :isDetail="isDetail" :detailType="detailType"></implForm>
            </div>
          </el-col>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="审批记录" name="second">
        <span slot="label">
          <span class="el-icon-notebook-1">审批记录</span>
        </span>
        <!--流程审批记录-->
        <el-card class="box-card" v-if="flowRecordList">
          <el-col :span="16" :offset="4" >
            <div class="block">
              <el-timeline>
                <el-timeline-item v-for="(item, index) in flowRecordList" :key="index"
                        :icon="setIcon(item.finishTime)" :color="setColor(item.finishTime)">
                  <p style="font-weight: 700">{{item.taskName}}</p>
                  <el-card :body-style="{padding: '10px'}">
                    <label v-if="item.assigneeName" style="font-weight: normal;margin-right: 30px;">实际办理： {{item.assigneeName}} <el-tag type="info" size="mini">{{item.deptName}}</el-tag></label>
                    <label v-if="item.candidate" style="font-weight: normal;margin-right: 30px;">候选办理： {{item.candidate}}</label>
                    <label style="font-weight: normal">接收时间： </label><label style="color:#8a909c;font-weight: normal">{{parseTime(item.createTime)}}</label>
                    <label v-if="item.finishTime" style="margin-left: 30px;font-weight: normal">办结时间： </label><label style="color:#8a909c;font-weight: normal">{{parseTime(item.finishTime)}}</label>
                    <label v-if="item.duration" style="margin-left: 30px;font-weight: normal">耗时： </label><label style="color:#8a909c;font-weight: normal">{{item.duration}}</label>

                    <p v-if="item.comment">
                      <el-tag type="success" v-if="item.comment.type === '1'">  {{item.comment.comment}}</el-tag>
                      <el-tag type="warning" v-if="item.comment.type === '2'">  {{item.comment.comment}}</el-tag>
                      <el-tag type="danger" v-if="item.comment.type === '3'">  {{item.comment.comment}}</el-tag>
                    </p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-col>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="流程图" name="third">
        <span slot="label">
           <span class="el-icon-picture-outline">流程图</span>
        </span>
        <!--流程图-->
        <el-card class="box-card">
          <flow :xmlData="xmlData" :taskData="taskList" v-if="activeName== 'third'"></flow>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getFlowRecords} from "@/api/flowable/finished";
import Parser from '@/components/parser/Parser';
import orderForm from '@/components/StaticForm/orderForm';
import contractForm from '@/components/StaticForm/contractForm';
import implForm from '@/components//StaticForm/implForm';
import {getProcessVariables, readXml, getFlowViewer} from "@/api/flowable/definition";
import flow from '@/views/flowable/task/record/flow';
import { queryFlowAuthSettingListByTaskId, queryStartNodeFlowAuthSettingList } from "@/api/flowable/auth";

export default {
  name: "FlowDetail",
  components: {
    'parser': Parser,
    'flow': flow,
    'orderForm': orderForm,
    'contractForm':contractForm,
    'implForm':implForm
  },
  data() {
    return {
      formConf: {}, // 流程表单变量数据
      flowRecordList: [], // 流程审批记录数据
      xmlData: "",
      taskList: [],
      isShow: 'order', //控制表单的显隐藏
      formData:{},
      isStart: false,
      isDetail: true,
      flowAuthSettingList: [], //权限配置列表
      detailType:'',
      activeName:'first',
      isCopy: false,
      deployId: null,
      taskId: null,
    };
  },
  created() {
  },
  mounted() {
    this.deployId = this.$route.query && this.$route.query.deployId;
    this.taskId = this.$route.query && this.$route.query.taskId;
    var category = this.$route.query && this.$route.query.category;
    var detailType = this.$route.query && this.$route.query.detailType;
    var procInsId = this.$route.query && this.$route.query.procInsId;
    this.isShow = category;
    this.detailType = detailType;
    if(detailType == 'myProcess') {
      // console.log('我的流程')
      //获取我的流程详情权限配置列表
      this.getStartNodeFlowAuthSettingList(this.taskId);
    } else if (detailType == 'completedTasks') {
      // console.log('已办任务')
      //获取权限配置列表
      this.getFlowAuthSettingList(this.taskId);
      this.isCopy = true;
    } else if(detailType == 'allProcess') {
      // console.log('全部流程')
      this.detailType = 'allProcess'
    }

    //获取流程表单数据
    this.processVariables(this.taskId);

    //获取审批记录
    this.getFlowRecordList(procInsId);

    //流程图显示
    this.getFlowViewer(procInsId).then(val=> {
      this.getModelDetail(this.deployId)
    })
  },
  methods: {

    /** 回显流程图流转记录 */
    getFlowViewer(procInsId) {
      return new Promise((resolve,reject)=> {
        getFlowViewer(procInsId).then(res => {
          this.taskList = res.data;
          resolve(this.taskList)
        }).catch(res => {
           reject()
        });
      })
    },

    /** xml 文件(画流程图) */
    getModelDetail(deployId) {
      // 发送请求，获取xml
      return new Promise((resolve,reject)=> {
        readXml(deployId).then(res => {
          this.xmlData = res.data;
          resolve(this.xmlData)
        }).catch(res => {
          reject()
        });
      })
    },
    setIcon(val) {
      if (val) {
        return "el-icon-check";
      } else {
        return "el-icon-time";
      }
    },
    setColor(val) {
      if (val) {
        return "#2bc418";
      } else {
        return "#b3bdbb";
      }
    },
    /** 流程流转记录 */
    getFlowRecordList(procInsId) {
      const params = {procInsId: procInsId};
      getFlowRecords(params).then(res => {
        this.flowRecordList = res.data;
      }).catch(res => {
        this.goBack();
      });
    },
    /** 获取流程表单内容 */
    processVariables(taskId) {
      if (taskId) {
        // 提交流程申请时填写的表单存入了流程变量中后续任务处理时需要展示
        getProcessVariables(taskId).then(res => {
          this.formConf = res.data.variables;
          this.formData = res.data
        }).catch(() => {
          this.$message.error(err.message);
        });
      }
    },
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    // 获取权限配置列表
    getFlowAuthSettingList(taskId) {
      queryFlowAuthSettingListByTaskId(taskId).then(res=> {
        this.flowAuthSettingList = res.data;
      })
    },
    getStartNodeFlowAuthSettingList(taskId) {
       queryStartNodeFlowAuthSettingList(taskId).then(res=> {
         this.flowAuthSettingList = res.data
       })
    },
    // 复制表单数据重新发起任务
    copyData() {
      this.$router.push({path: '/flowable/task/start',
        query: {
           taskId: this.taskId,
           deployId: this.deployId,
           procDefId: null,
           formType: null,
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
 ::v-deep .el-card__header {
  border-bottom: none;
}
</style>
