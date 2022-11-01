<!--发起任务-->
<template>
  <div class="app-container">
    <!--表单模块-->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="表单信息" name="first">
        <span slot="label">
          <span class="el-icon-document">表单信息</span>
        </span>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button style="float: right;" size="small" type="primary" @click="goBack">返回</el-button>
          </div>
         <!--初始化流程加载表单信息-->
          <el-col :span="20" :offset="2">
            <div class="test-form" v-if="isShow==0">
              <parser :key="new Date().getTime()" :form-conf="formConf" @submit="submitForm"/>
            </div>
            <div class="static-form" v-if="isShow==1">
              <orderForm :isStart ='isStart' :isDetail='isDetail' :formValue="formData" :procDefId ="procDefId"></orderForm>
            </div>
            <div class="static-form" v-if="isShow==2">
              <contractForm :isStart ='isStart' :isDetail='isDetail' :formValue="formData" :procDefId ="procDefId"></contractForm>
            </div>
            <div class="static-form" v-if="isShow==3">
              <implForm :isStart ='isStart' :isDetail='isDetail' :formValue="formData" :procDefId ="procDefId"></implForm>
            </div>
          </el-col>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="流程图" name="second">
        <span slot="label">
           <span class="el-icon-picture-outline">流程图</span>
        </span>
        <!--流程图-->
        <el-card class="box-card">
          <flow :xmlData="xmlData" :taskData="taskList" v-if="activeName == 'second'"></flow>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {getFlowForm} from "@/api/flowable/finished";
import Parser from '@/components/parser/Parser'
import {definitionStart, readXml,getProcDefInfoByDeployId, getProcessVariables} from "@/api/flowable/definition";
import flow from '@/views/flowable/task/record/flow';
import orderForm from '@/components/StaticForm/orderForm';
import contractForm from '@/components/StaticForm/contractForm';
import implForm from '@/components//StaticForm/implForm'

export default {
  name: "StartTask",
  components: {
     Parser,
     flow,
     orderForm,
     contractForm,
     implForm
  },
  props: {},
  data() {
    return {
      deployId: null,   // 流程定义编号
      procDefId: null,  // 流程定义编号
      taskId: null, // 复制流程获取复制的流程数据

      formConf: {}, // 默认表单数据
      formData:{},

      xmlData: "",
      taskList: [],
      isShow: 0,
      isStart: true,
      isDetail: false,
      activeName:'first',
    };
  },
  created() {
    if(!this.isNull(this.$route.query.formType)) {
      this.isShow = this.$route.query.formType
    }
  },
  mounted() {
    this.deployId = this.$route.query && this.$route.query.deployId;
    this.procDefId = this.$route.query && this.$route.query.procDefId;
    // 已办任务复制流程重新发起
    this.getProcDefInfo(this.deployId);

    //获取流程表单数据
    this.getFlowFrm(this.deployId);

    //画流程图
    this.getModelDetail(this.deployId);

    this.taskId = this.$route.query && this.$route.query.taskId;
    //复制流程获取复制的流程数据
    if(!this.isNull(this.taskId)) {
      getProcessVariables(this.taskId).then(res => {
          this.formConf = res.data.variables;
          this.formData = res.data;
        }).catch(() => {
          this.$message.error(err.message);
        });
    }

  },
  methods: {
    /** xml 文件 */
    getModelDetail(deployId) {
      // 发送请求，获取xml
      readXml(deployId).then(res => {
        this.xmlData = res.data;
      }).catch(res => {
        this.$message.error(err.message);
      });
    },
    /**流程表单**/
    getFlowFrm(deployId) {
      if (deployId == null) {
        return;
      }
      const params = {deployId: deployId};
      getFlowForm(params).then(res => {
        this.formConf = res.data;
      }).catch(res => {
        this.goBack();
      });
    },
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    },
    /** 申请流程表单数据提交 */
    submitForm(data) {
      if (data) {
        const valData = data.valData;
        const formData = data.formData;
        formData.disabled = true;
        formData.formBtns = false;
        if (this.procDefId) {
          valData.variables = formData;
           // 启动流程并将表单数据加入流程变量
          definitionStart(this.procDefId, JSON.stringify(valData)).then(res => {
            this.msgSuccess(res.msg);
            this.goBack();
          }).catch(() => {
            this.$message.error(err.message);
          });
        }
      }
    },
    getProcDefInfo(deployId) {
      let that = this;
      getProcDefInfoByDeployId(deployId).then(res=> {
        if(this.isNull(that.procDefId)) {
          that.procDefId = res.data.id;
        }
        if(this.isNull(this.$route.query.formType)) {
          that.isShow = res.data.formType
        }
      })
    },
    handleClick(tab, event) {
        // console.log(tab, event);
    }
  },
};
</script>
<style lang="scss" scoped>
.test-form {
  margin: 15px auto;
  width: 800px;
  padding: 15px;
}

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
