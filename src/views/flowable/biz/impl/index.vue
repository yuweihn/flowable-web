<!--业务管理——实施启动-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px" v-show="showSearch">
      <el-form-item label="客户" prop="customerNo">
        <el-select v-model="queryParams.customerNo" filterable remote :remote-method="(query) => remoteMethod(query)"
          clearable size="small" placeholder="请选择客户">
          <el-option v-for="item in customerList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="实施启动标题" prop="title" label-width="auto">
        <el-input v-model="queryParams.title" placeholder="请输入实施启动标题" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="实施启动编号" prop="fuzzyImplNo">
        <el-input v-model="queryParams.fuzzyImplNo" placeholder="请输入实施启动编号" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker clearable size="small" v-model="value" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始时间" end-placeholder="结束时间" @change="changeTime" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini"  @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"  @click="handleDelete"
          v-hasPermi="['system:impl:delete']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="implList" @selection-change="handleSelectionChange">
      <el-table-column type="expand" width="18">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="ID：">
              <span>{{scope.row.id}}</span>
            </el-form-item>
            <el-form-item label="流程ID：">
              <span>{{ scope.row.procInsId }}</span>
            </el-form-item>
            <el-form-item label="实施启动编号：">
              <span>{{scope.row.implNo}}</span>
            </el-form-item>
            <el-form-item label="实施启动标题：">
              <span>{{ scope.row.title }}</span>
            </el-form-item>
            <el-form-item label="客户：">
              <span>{{scope.row.customerNo}} - {{scope.row.enterpriseName}}</span>
            </el-form-item>
            <el-form-item label="项目名称：">
              <span>{{ getDicValue(scope.row.prjCode, projectList)}}</span>
            </el-form-item>
            <el-form-item label="售前：">
              <span>{{ scope.row.preSalesName }}</span>
            </el-form-item>
             <el-form-item label="项目经理：">
              <span>{{ scope.row.prjManagerName }}</span>
            </el-form-item>
            <el-form-item label="实施方案：">
              <el-input
                type="textarea"
                v-model="scope.row.solution"
                size="small"
                style="width:500px"
                disabled>
              </el-input>
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
      <el-table-column label="实施启动编号" align="left" prop="implNo" width="180" />
      <el-table-column label="实施启动标题" align="left" prop="title" :show-overflow-tooltip="true" width="220" />
      <el-table-column label="客户编号" align="left" prop="customerNo" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="企业名称" align="left" prop="enterpriseName" :show-overflow-tooltip="true" width="220" />
      <el-table-column label="项目经理" align="left" prop="prjManagerName" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-document" @click="checkImplDetail(scope.row)">详情</el-button>
          <el-dropdown v-hasPermi="['system:impl:delete']">
            <el-button type="text" class="el-icon-more" style="margin-left: 10px" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleDelete(scope.row)" v-hasPermi="['system:impl:delete']">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList"></pagination>
     <!-- 实施启动单详情弹框 -->
    <el-dialog title="实施启动单详情" :visible.sync="implFormDetailVisable" width="70%" v-drag>
      <implForm :formValue="implDetailValue"></implForm>
    </el-dialog>
  </div>
</template>

<script>
import { getImplList, deleteImpl,getImplInfoById } from "@/api/biz/impl";
import { getCustomerList } from "@/api/flowable/form";
import implForm from '@/components//StaticForm/implForm';
export default {
  components: {
    implForm
  },
  data() {
    return {
      projectList: [],
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
        fuzzyImplNo: null,
        startTime: null,
        endTime: null,
        pageNo: 1,
        pageSize: 10
      },
      value: [],
      implFormDetailVisable: false,
      implDetailValue: {},
      // 实施启动列表
      implList: [],
      // 客户列表
      customerList: [],
      tabelName: "",
      searchCustomer: {
        keywords: "",
        pageNo: 1,
        pageSize: 1000,
      },


    };
  },
  created() {
    this.getDicts('project_list').then(response => {
      this.projectList = response.data;
    });
  },
  mounted() {
    this.getList();
    this.getCustomerList();
  },
  methods: {
    getDicValue(i, list) {
      let resdata = "";
      list.forEach((item) => {
        if (item.dictValue == i) {
          resdata = item.dictLabel;
        }
      });
      return resdata;
    },
    // 获取客户列表
    getCustomerList() {
      getCustomerList(this.searchCustomer).then((res) => {
        this.customerList = res.data;
      });
    },
    handleSizeChange(psize) {
      this.queryParams.pageNo = 1;
      this.queryParams.pageSize = psize;
      this.getList();
    },
    handleCurrentChange(pno) {
      this.queryParams.pageNo = pno;
      this.getList();
    },
    //获取实施启动列表
    getList() {
      this.loading = true;
      getImplList(this.queryParams).then((res) => {
        this.implList = res.data.list;
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
      this.value=[];
      this.queryParams.startTime=null;
      this.queryParams.endTime=null;
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
          deleteImpl(params).then((res) => {
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
    remoteMethod(keywords) {
      this.searchCustomer.keywords = keywords;
      this.getCustomerList();
    },
    checkImplDetail(i) {
      this.implFormDetailVisable = true;
      let params = {
        implId: i.id,
      };
      getImplInfoById(params).then((res) => {
        this.implDetailValue = res.data
      });
    }
  },
};
</script>

<style scoped>
</style>

