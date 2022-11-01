<!--业务管理——合同-->
<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
      v-show="showSearch"
    >
      <el-form-item label="客户" prop="customerNo">
        <el-select
          v-model="queryParams.customerNo"
          filterable
          remote
          :remote-method="(query) => remoteMethod(query)"
          clearable
          size="small"
          placeholder="请选择客户"
        >
          <el-option
            v-for="item in customerList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="合同标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入合同标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同编号" prop="fuzzyContractNo">
        <el-input v-model="queryParams.fuzzyContractNo" placeholder="请输入合同编号" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          clearable
          size="small"
          v-model="value"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="changeTime"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:contract:delete']"
          >删除</el-button
        >
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="contractList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand" width="18">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="ID：">
              <span>{{scope.row.id}}</span>
            </el-form-item>
            <el-form-item label="流程ID：">
              <span>{{ scope.row.procInsId }}</span>
            </el-form-item>
            <el-form-item label="合同编号：">
              <span>{{scope.row.contractNo}}</span>
            </el-form-item>
            <el-form-item label="合同标题：">
              <span>{{ scope.row.title }}</span>
            </el-form-item>
            <el-form-item label="客户：">
              <span
                >{{ scope.row.customerNo }} -
                {{ scope.row.enterpriseName }}</span
              >
            </el-form-item>
            <el-form-item label="客户联系人：">
              <span>{{ scope.row.customerContacts }}</span>
            </el-form-item>
            <el-form-item label="乙方企业编号：">
              <span>{{ scope.row.agsCompanyCode }}</span>
            </el-form-item>
            <el-form-item label="乙方企业名称：">
              <span>{{ scope.row.agsCompanyName }}</span>
            </el-form-item>
            <el-form-item label="售权签字人：">
              <span>{{ scope.row.authSigner }}</span>
            </el-form-item>
            <el-form-item label="联系电话：">
              <span>{{ scope.row.agsPhoneNo }}</span>
            </el-form-item>
            <el-form-item label="客户邮箱：">
              <span>{{ scope.row.customerEmail }}</span>
            </el-form-item>
            <el-form-item label="客户电话：">
              <span>{{ scope.row.customerPhoneNo }}</span>
            </el-form-item>
            <el-form-item label="合同签订日期：">
              <span>{{ scope.row.signDate }}</span>
            </el-form-item>
            <el-form-item label="合同开始日期：">
              <span>{{ scope.row.contractStartDate }}</span>
            </el-form-item>
            <el-form-item label="合同结束日期：">
              <span>{{ scope.row.contractEndDate }}</span>
            </el-form-item>
            <el-form-item label="发票抬头：">
              <span>{{ scope.row.fpTitle }}</span>
            </el-form-item>
            <el-form-item label="开户行：">
              <span>{{ scope.row.fpBankName }}</span>
            </el-form-item>
            <el-form-item label="税号：">
              <span>{{ scope.row.fpTaxNo }}</span>
            </el-form-item>
            <el-form-item label="银行账号：">
              <span>{{ scope.row.fpBankAccNo }}</span>
            </el-form-item>
            <el-form-item label="开票地址：">
              <span>{{ scope.row.fpAddr }}</span>
            </el-form-item>
            <el-form-item label="开票电话：">
              <span>{{ scope.row.fpPhoneNo }}</span>
            </el-form-item>
            <el-form-item label="补充协议：">
              <span>{{ scope.row.suppleAgreement }}</span>
            </el-form-item>
            <el-form-item label="销售：">
              <span>{{ scope.row.userName }} {{ scope.row.userNickName }}</span>
            </el-form-item>
            <el-form-item label="创建人：">
              <span>{{ scope.row.creator }}</span>
            </el-form-item>
            <el-form-item label="创建时间：">
              <span>{{ scope.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="修改人：">
              <span>{{ scope.row.modifier }}</span>
            </el-form-item>
            <el-form-item label="修改时间：">
              <span>{{ scope.row.modifyTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <!--<el-table-column label="流程ID" align="center" prop="procInsId" :show-overflow-tooltip="true" width="150" />-->
      <el-table-column label="合同编号" align="left" prop="contractNo" width="180" />
      <el-table-column
        label="合同标题"
        align="left"
        prop="title"
        :show-overflow-tooltip="true"
        width="220"
      />
      <el-table-column
        label="客户编号"
        align="left"
        prop="customerNo"
        :show-overflow-tooltip="true"
        width="100"
      />
      <el-table-column
        label="企业名称"
        align="left"
        prop="enterpriseName"
        :show-overflow-tooltip="true"
        width="220"
      />
      <el-table-column
        label="销售"
        align="left"
        prop="userNickName"
        :show-overflow-tooltip="true"
        width="120"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-document" @click="checkContractDetail(scope.row)">详情</el-button>
          <el-dropdown>
            <el-button type="text" class="el-icon-more" style="margin-left: 10px" />
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item v-for="(item, index) in childTable" :key="index" @click.native="showTableDetail(scope, item)"
                >{{item.label}}</el-dropdown-item> -->
              <el-dropdown-item @click.native="showTableDetail(scope)">产品</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(scope.row)" v-hasPermi="['system:contract:delete']">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList"></pagination>
    <!-- 子表弹框 -->
    <el-dialog
      :title="tabelName"
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="handleClose"
      v-drag
    >
      <contractProForm
        :params="childTableParams"
        :dialogVisible="dialogVisible"
        :childTables="childTables"
      />
    </el-dialog>
    <!-- 合同详情弹框 -->
    <el-dialog
      title="合同详情"
      :visible.sync="contractDetailVisable"
      width="70%"
    >
      <contractForm :formValue="contractDetailValue" :bizDetail="true" :isStart ="true"></contractForm>
    </el-dialog>
  </div>
</template>

<script>
import {
  getContractList,
  deleteContract,
  getContracInfoById,
} from "@/api/biz/contract";
import { getCustomerList } from "@/api/flowable/form";
import contractForm from "@/components/StaticForm/contractForm";
import contractProForm from "@/views/flowable/biz/contract/contractProForm";
export default {
  components: {
    contractProForm,
    contractForm,
  },
  data() {
    return {
      // 总条数
      total: 0,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {
        customerNo: null,
        title: null,
        fuzzyContractNo: null,
        startTime: null,
        endTime: null,
        pageNo: 1,
        pageSize: 10
      },
      value: [],
      contractDetailVisable: false,
      contractDetailValue: {},
      // 合同列表
      contractList: [],
      // 客户列表
      customerList: [],
      // 两张子表
      childTables: [
        {
          id: 1,
          label: "附件",
        },
        {
          id: 2,
          label: "订单",
        },
      ],
      // 子表弹框的显隐
      dialogVisible: false,
      // 子表参数
      childTableParams: {
        pageNo: 1,
        pageSize: 10,
        contractId: null,
      },
      tabelName: "",
      searchCustomer: {
        keywords: "",
        pageNo: 1,
        pageSize: 1000,
      },
    };
  },
  created() {},
  mounted() {
    this.getList();
    this.getCustomerList();
  },
  methods: {
    // 获取客户列表
    getCustomerList() {
      getCustomerList(this.searchCustomer).then((res) => {
        this.customerList = res.data;
      });
    },
    //获取合同列表
    getList() {
      this.loading = true;
      getContractList(this.queryParams).then((res) => {
        this.contractList = res.data.list;
        this.total = res.data.size;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.value = [];
      this.queryParams.startTime = null;
      this.queryParams.endTime = null;
      this.handleQuery();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const _ids = row.id || this.ids.toString();
      var params = { ids: _ids };
      var _this = this;
      _this
        .$confirm("是否确认删除选中记录?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(function () {
          deleteContract(params).then((res) => {
            _this.$message({ type: "success", message: res.msg });
            _this.getList();
          });
        })
        .catch(() => {});
    },
    // 多选框选中数据
    handleSelectionChange(slt) {
      this.ids = slt.map((item) => item.id);
      this.multiple = !slt.length;
    },
    // 修改时间范围
    changeTime(arr) {
      this.queryParams.startTime = arr[0].toString();
      this.queryParams.endTime = arr[1].toString();
    },
    // 展示子表详情
    showTableDetail(scope) {
      this.dialogVisible = true;
      this.childTableParams.contractId = scope.row.id;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    remoteMethod(keywords) {
      this.searchCustomer.keywords = keywords;
      this.getCustomerList();
    },
    checkContractDetail(i) {
      this.contractDetailVisable = true;
      let params = {
        contractId: i.id,
      };
      getContracInfoById(params).then((res) => {
        this.contractDetailValue = res.data;
      });
    },
  },
};
</script>

<style scoped>
</style>

