<!--实施启动单-->
<template>
  <div v-loading="loading">
    <el-form
      label-width="100px"
      :model="FormData"
      :rules="rules"
      ref="FormData"
    >
      <el-form-item
        label="订单"
        prop="orderId"
        v-if="setVisable('associatedOrderList')"
      >
        <el-select
          v-model="FormData.orderId"
          filterable
          remote
          :remote-method="(query) => remoteMethod(query)"
          clearable
          placeholder="请选择"
          size="small"
          :disabled="setDisable('associatedOrderList')"
          style="width: 80%"
          @change="handleChangeOrder"
          @clear="handleClearOrder"
        >
          <el-option
            v-for="item in associatedOrderList"
            :key="item.orderId"
            :label="item.fullTitle"
            :value="item.orderId"
          >
          </el-option>
        </el-select>
        <a
          v-if="setVisable('orderDetail') && setVisable('associatedOrderList')"
          style="
            font-size: 12px;
            padding-left: 15px;
            color: #46a6ff;
            cursor: pointer;
          "
          @click="checkOrderDetail"
          >订单详情</a
        >
      </el-form-item>
      <el-form-item label="标题" prop="title" v-if="setVisable('title')">
        <el-input
          v-model="FormData.title"
          placeholder="请输入标题"
          size="small"
          :disabled="setDisable('title')"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="客户" prop="customer" v-if="setVisable('customer')">
        <el-input v-model="customer" disabled size="small"></el-input>
      </el-form-item>
      <!-- <el-form-item label="项目" prop="prjCode" v-if="setVisable('prjCode')">
        <el-select
          v-model="FormData.prjCode"
          filterable
          clearable
          placeholder="请选择"
          size="small"
          :disabled="setDisable('prjCode')"
          style="width: 80%"
        >
          <el-option
            v-for="dict in projectList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="合同" prop="contract" v-if="setVisable('contract')">
        <el-input type="small" v-model="contract" disabled></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="售前"
            prop="preSales"
            v-if="setVisable('preSales')"
          >
            <el-input v-model="preSales" size="small" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="项目经理"
            prop="prjManagerId"
            v-if="setVisable('prjManagerId')"
          >
            <el-select
              v-model="FormData.prjManagerId"
              filterable
              clearable
              placeholder="请选择"
              size="small"
              :disabled="setDisable('prjManagerId')"
            >
              <el-option
                v-for="item in proManagerList"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="实施方案：" v-if="setVisable('solution')">
        <el-input
          type="textarea"
          v-model="FormData.solution"
          size="small"
          :disabled="setDisable('solution')"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="btnVisable">
        <el-button
          v-if="btnHidden"
          @click="submitForm('FormData')"
          type="primary"
          >提交</el-button
        >
        <el-button @click="resetForm('FormData')" v-if="btnHidden"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 订单详情弹框 -->
    <el-dialog title="订单详情" :visible.sync="orderDetailVisable" width="70%" append-to-body v-drag>
      <orderForm :formValue="orderDetailValue"></orderForm>
    </el-dialog>
  </div>
</template>
<script>
import { getUserDropDownListByRoleKey } from "@/api/system/user";
import {
  getAssociatedOrderList,
  findRelatedInfoByOrderId,
  getOrderDetail,
} from "@/api/flowable/form";
import {
  definitionStart,
  getProcessVariables,
} from "@/api/flowable/definition";
import orderForm from "@/components/StaticForm/orderForm";
export default {
  components: {
    orderForm,
  },
  props: {
    formValue: {
      type: Object,
      default: () => {
        return {};
      },
    },
    taskFormValue: {
      type: Object,
      default: () => {
        return {};
      },
    },
    flowAuthSettingList: {
      type: Array,
      default: () => [],
    },
    isStart: {
      type: Boolean,
      default: true,
    },
    isDetail: {
      type: Boolean,
      default: true,
    },
    detailType: {
      type: String,
      default: "",
    },
    procDefId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      readOnly: false,
      btnVisable: true,
      btnHidden: true,
      projectList: [], //项目列表
      associatedOrderList: [], //订单列表
      proManagerList: [], //项目经理列表
      //表单数据
      FormData: {
        title: "",
        orderId: null,
        orderList:[],
        customerNo: "",
        prjManagerId: null,
        solution: "",
        preSalesId: null,
      },
      customer: "", // 客户
      preSales: "", // 售前
      contract: "", // 合同
      //验证规则
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        orderId: [{ required: true, message: "请选择订单", trigger: "change" }],
        prjManagerId: [
          { required: true, message: "请选择项目经理", trigger: "change" },
        ],
      },
      searchParams: {
        keywords: "",
        pageNo: 1,
        pageSize: 100,
      },
      orderDetailVisable: false,
      orderDetailValue: {},
    };
  },
  created() {
    //获取项目字典
    this.getDicts("project_list").then((response) => {
      this.projectList = response.data;
    });
  },
  mounted() {
    this.getAssociatedOrderList();
    this.getProjectManagerList();
  },
  watch: {
    //流程详情数据
    formValue: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== "{}") {
          this.FormData = newVal;
          // console.log("1", this.FormData);
          this.FormData.orderId = this.FormData.orderList[0].orderId;
          this.getRelatedInfoByOrderId({orderId: this.FormData.orderList[0].orderId});
          this.readOnly = true;
          if(!this.isStart) {
           this.btnVisable = false;
          }
        }
      },
      immediate: true,
      deep: true
    },
    //待办任务处理页面表单数据
    taskFormValue: {
      handler(newVal) {
        if (JSON.stringify(newVal) !== "{}") {
          this.FormData = newVal;
          // console.log("2", this.FormData);
          this.getRelatedInfoByOrderId({ orderId: this.FormData.orderList[0].orderId });
          this.btnHidden = false;
        }
      },
    },
    //权限配置列表
    flowAuthSettingList: {
      handler(newVal) {
        // console.log("权限列表", newVal);
      },
    },
    isDetail: {
      handler(newVal) {
          if(newVal) {
              this.btnVisable = false
          }
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    // 获取订单下拉列表
    getAssociatedOrderList(data) {
      getAssociatedOrderList(data).then((res) => {
        this.associatedOrderList = res.data;
      });
    },
    // 切换订单操作
    handleChangeOrder(val) {
      if (val) {
        let params = {
          orderId: val,
        };
        this.getRelatedInfoByOrderId(params);
        this.associatedOrderList.forEach((item) => {
          if (item.orderId == val) {
            this.FormData.title = item.title;
          }
        });
        this.FormData.orderList = [];
        this.FormData.orderList.push({orderId:val})
      }
    },
    handleClearOrder() {
      this.customer = "";
      this.preSales = "";
      this.contract = "";
      this.FormData.orderList[0].orderId = null;     
    },
    // 根据订单获取相关信息
    getRelatedInfoByOrderId(data) {
      findRelatedInfoByOrderId(data).then((res) => {
        this.customer = "[" + res.data.customerNo + "]" + res.data.enterpriseName;
        this.preSales = res.data.preSalesUserName;
        this.contract = res.data.contractTitle;
        this.FormData.customerNo = res.data.customerNo;
        this.FormData.preSalesId = res.data.preSalesId;
      });
    },
    // 查看订单详情
    checkOrderDetail() {
      if (this.FormData.orderList[0].orderId !== null) {
        this.orderDetailVisable = true;
        this.getOrderDetail({
          orderId: this.FormData.orderList[0].orderId,
        });
      } else {
        this.$message.error("请选择订单");
      }
    },
    getOrderDetail(data) {
      getOrderDetail(data).then((res) => {
        this.orderDetailValue = res.data;
      });
    },
    // 获取项目经理列表
    getProjectManagerList() {
      getUserDropDownListByRoleKey({ roleKey: "prj_manager" }).then((res) => {
        this.proManagerList = res.data.list;
      });
    },
    remoteMethod(keywords) {
      this.searchParams.keywords = keywords;
      this.getAssociatedOrderList(this.searchParams);
    },
    // 提交
    submitForm(formName) {
      this.loading = true;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          definitionStart(this.$route.query.procDefId? this.$route.query.procDefId : this.procDefId, this.FormData).then(
            (response) => {
              this.msgSuccess("流程发起成功");
              // 关闭当前标签页并返回上个页面
              this.$store.dispatch("tagsView/delView", this.$route);
              this.$router.push("/task/myProcess")
              this.loading = false
            }).catch((err)=> {
              this.loading = false;
            })
        } else {
          this.loading = false
          return false;
        }
      });
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //设置表单权限
    setVisable(name) {
      let isShow = true;
      if (
        this.flowAuthSettingList.length === 0 &&
        this.detailType !== "allProcess" &&
        this.isStart !== true
      ) {
        return !isShow;
      } else {
        this.flowAuthSettingList.forEach((item) => {
          if (name == item.widgetCode) {
            isShow = item.viewable;
          }
        });
        return isShow;
      }
    },

    setDisable(name) {
      let isDisable = false;
      if (this.isDetail) {
        return !isDisable;
      } else if (this.isStart) {
        return isDisable;
      } else {
        this.flowAuthSettingList.forEach((item) => {
          if (name == item.widgetCode) {
            isDisable = item.editable;
          }
        });
        return !isDisable;
      }
    },
  },
};
</script>
<style scoped>
</style>
