<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
    <el-form-item label="客户编号" prop="customerNo" >
        <el-input v-model="queryParams.customerNo" placeholder="请输入客户编号" clearable size="small"
                    style="width: 140px;" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input v-model="queryParams.enterpriseName" placeholder="请输入企业名称" clearable size="small"
                     style="width: 255px;" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="客户状态" prop="statusCode">
        <el-select v-model="queryParams.statusCode" placeholder="客户状态" clearable size="small" style="width: 150px;">
          <el-option v-for="dict in statusList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleClick('add')"
              v-hasPermi="['system:customer:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['system:customer:remove']" >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getSaleCustomerList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
			<el-table-column type="expand" width="18">
				<template slot-scope="scope">
					<el-form label-position="left" inline class="table-expand">
						<el-form-item label="客户编号：">
							<span>{{scope.row.customerNo}}</span>
						</el-form-item>
						<el-form-item label="企业名称：">
							<span>{{scope.row.enterpriseName}}</span>
						</el-form-item>
						<el-form-item label="联系人：">
							<span>{{scope.row.contacts}}</span>
						</el-form-item>
						<el-form-item label="电话：">
							<span>{{scope.row.phoneNo}}</span>
						</el-form-item>
            <el-form-item label="邮箱：">
							<span>{{scope.row.email}}</span>
						</el-form-item>
            <el-form-item label="第二联系人：">
							<span>{{scope.row.contacts2}}</span>
						</el-form-item>
						<el-form-item label="第二联系人电话：">
							<span>{{scope.row.phoneNo2}}</span>
						</el-form-item>
            <el-form-item label="第二联系人邮箱：">
							<span>{{scope.row.email2}}</span>
						</el-form-item>
						<el-form-item label="Tenant ID：">
							<span>{{scope.row.tenantId}}</span>
						</el-form-item>
						<el-form-item label="状态：">
							<span>{{scope.row.statusCode}} - {{statusFormat(scope.row)}}</span>
						</el-form-item>
						<el-form-item label="类型：">
							<span>{{scope.row.typeCode}} - {{typeFormat(scope.row)}}</span>
						</el-form-item>
						<el-form-item label="行业：">
							<span>{{scope.row.industryCode}} - {{industryFormat(scope.row)}}</span>
						</el-form-item>
						<!-- <el-form-item label="地区：">
							<span>{{scope.row.regionCode}} - {{regionFormat(scope.row)}}</span>
						</el-form-item>
						<el-form-item label="传真：">
							<span>{{scope.row.fax}}</span>
						</el-form-item> -->
						<!-- <el-form-item label="邮编：">
							<span>{{scope.row.zipCode}}</span>
						</el-form-item>
						<el-form-item label="网站：">
							<span>{{scope.row.website}}</span>
						</el-form-item> -->
						<el-form-item label="地址：">
							<span>{{scope.row.addr}}</span>
						</el-form-item>
						<el-form-item label="发票抬头：">
							<span>{{scope.row.fpTitle}}</span>
						</el-form-item>
						<el-form-item label="开户行：">
							<span>{{scope.row.fpBankName}}</span>
						</el-form-item>
						<el-form-item label="银行账号：">
							<span>{{scope.row.fpBankAccNo}}</span>
						</el-form-item>
						<el-form-item label="开票电话：">
							<span>{{scope.row.fpPhoneNo}}</span>
						</el-form-item>
						<el-form-item label="税号：">
							<span>{{scope.row.fpTaxNo}}</span>
						</el-form-item>
						<el-form-item label="开票地址：">
							<span>{{scope.row.fpAddr}}</span>
						</el-form-item>
						<el-form-item label="客户经理：">
							<span>{{scope.row.salesUserName}} {{scope.row.salesNickName}}</span>
						</el-form-item>
						<el-form-item label="客户经理电话：">
							<span>{{scope.row.salesUserPhone}}</span>
						</el-form-item>
						<el-form-item label="客户经理邮箱：">
							<span>{{scope.row.salesUserEmail}}</span>
						</el-form-item>
						<el-form-item label="备注：">
							<el-input type="textarea" :rows="10" style="width: 700px;" readonly placeholder="" v-model="scope.row.remark"></el-input>
						</el-form-item>
						<el-form-item label="创建人：">
							<span>{{scope.row.creator}}</span>
						</el-form-item>
						<el-form-item label="创建时间：">
							<span>{{scope.row.createTime}}</span>
						</el-form-item>
						<el-form-item label="修改人：">
							<span>{{scope.row.modifier}}</span>
						</el-form-item>
						<el-form-item label="修改时间：">
							<span>{{scope.row.modifyTime}}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <!--
      <el-table-column label="ID" align="center" prop="id" />
      -->
      <el-table-column label="客户编号" prop="customerNo" :show-overflow-tooltip="true" width="120" sortable />
      <el-table-column label="企业名称" prop="enterpriseName" :show-overflow-tooltip="true" width="320" />
      <el-table-column label="Tenant ID" prop="tenantId" width="130" />
      <el-table-column label="客户状态" prop="statusCode" :formatter="statusFormat" width="100" />
			<el-table-column prop="phoneNo" label="电话" width="130" />
			<el-table-column label="客户经理" :show-overflow-tooltip="true" width="220">
        <template slot-scope="scope">{{scope.row.salesUserName}} {{scope.row.salesNickName}}</template>
      </el-table-column>
			<el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" width="230" />
      <el-table-column label="创建时间" prop="createTime" width="170" />
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleClick('edit',scope.row)"
                  v-hasPermi="['system:customer:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['system:customer:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo"
              @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,50,100]"
              :limit.sync="queryParams.pageSize" @pagination="getSaleCustomerList"/>
    -->
    <el-pagination layout="total, sizes, prev, pager, next, jumper" background
          @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[10,20,50,100]" :current-page="queryParams.pageNo" :page-size="queryParams.pageSize"
          :total="total" style="float:right;">
    </el-pagination>

		<!--新增界面-->
		<create-customer ref="createCustomer" @dialogClose="dialogClose" :operation ="operation"
     v-on:success="getSaleCustomerList" :isShow = "isShow" :FormData = "FormData" />
  </div>
</template>

<script>
import {delCustomer,listSaleCustomer} from "@/api/system/customer";
import {getUserDropDownListByRoleKey} from "@/api/system/user";
import CreateCustomer from './components/CreateCustomer';

export default {
  components: {
    'create-customer': CreateCustomer,
  },

  name: "Customer",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户表格数据
      customerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 客户状态数据列表
      statusList: [],
      // 客户类型数据列表
      typeList: [],
      // 客户行业数据列表
      industryList: [],
      // 客户地区数据列表
      regionList: [],
      // 查询参数
      queryParams: {
        customerNo: null,
        enterpriseName: null,
        statusCode: null,
        salesUserId: null,
        pageNo: 1,
        pageSize: 10
      },

      // 销售下拉列表
      salesSlt: {
        result: {
          size: 0,
          list: []
        },
        keywords: "",
        pageNo: 1,
        pageSize: 10
      },
      // 新增/修改客户
      operation: "",
      isShow: false,
      // 弹框数据
      FormData:{}
    };
  },
  created() {
    this.getSaleCustomerList();
    this.getDicts("sys_customer_status").then(resp => {
      this.statusList = resp.data;
    });
    this.getDicts("sys_customer_type").then(resp => {
      this.typeList = resp.data;
    });
    this.getDicts("sys_customer_industry").then(resp => {
      this.industryList = resp.data;
    });
    this.getDicts("sys_customer_region").then(resp => {
      this.regionList = resp.data;
    });
    this.initSalesList();
  },
  methods: {
    handleSizeChange(psize) {
      this.queryParams.pageNo = 1;
      this.queryParams.pageSize = psize;
      this.getSaleCustomerList();
    },
    handleCurrentChange(pno) {
      this.queryParams.pageNo = pno;
      this.getSaleCustomerList();
    },
    /** 查询客户列表 */
    getSaleCustomerList() {
      this.loading = true;
      listSaleCustomer(this.queryParams).then(resp => {
        this.customerList = resp.data.list;
        this.total = resp.data.size;
        this.loading = false;
      });
    },
    // 客户状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusList, row.statusCode);
    },
    // 客户类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeList, row.typeCode);
    },
    // 客户行业字典翻译
    industryFormat(row, column) {
      return this.selectDictLabel(this.industryList, row.industryCode);
    },
    // 客户地区字典翻译
    regionFormat(row, column) {
      return this.selectDictLabel(this.regionList, row.regionCode);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getSaleCustomerList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(slt) {
      this.ids = slt.map(item => item.id);
      this.multiple = !slt.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const _ids = row.id || this.ids.toString();
      var params = {ids: _ids};
      var _this = this;
      _this.$confirm('是否确认删除选中记录?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        delCustomer(params).then(res => {
          _this.$message({type: "success", message: res.msg});
          _this.getSaleCustomerList();
        });
      }).catch(() => {

      });
    },

    initSalesList(keywords) {
      this.salesSlt.keywords = keywords;
      this.onSalesPageChanged(1, 10);
    },
    onSalesPageChanged(pno, psize) {
      if (pno != null) {
        this.salesSlt.pageNo = pno;
      }
      if (psize != null) {
        this.salesSlt.pageSize = psize;
      }
      var params = {
        roleKey: 'sale',
        keywords: this.salesSlt.keywords,
        pageNo: this.salesSlt.pageNo,
        pageSize: this.salesSlt.pageSize
      };
      getUserDropDownListByRoleKey(params).then(resp => {
        this.salesSlt.result.size = resp.data.size;
        this.salesSlt.result.list = resp.data.list.map(item => {
          return {val: item.userId, label: item.userName + " " + item.nickName};
        });
      }).catch(resp => {
        this.salesSlt.result.size = 0;
        this.salesSlt.result.list = [];
      });
    },
    onSalesChanged(salesUserId) {
      if (salesUserId) {
        return;
      }
      this.initSalesList();
    },
    handleClick(opt,data) {
      this.isShow = true;
      this.operation = opt;
      this.FormData = data
    },
    dialogClose(val) {
      this.isShow = val;
      this.FormData = {};
    }
  }
};
</script>
