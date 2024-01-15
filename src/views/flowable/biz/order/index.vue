<!--业务管理——订单-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" v-show="showSearch">
      <el-form-item label="客户" prop="customerNo">
        <el-select v-model="queryParams.customerNo" filterable remote :remote-method="(query) => remoteMethod(query)"
          clearable size="small" placeholder="请选择客户">
          <el-option v-for="item in customerList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入标题" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="订单编号" prop="fuzzyOrderNo">
        <el-input v-model="queryParams.fuzzyOrderNo" placeholder="请输入订单编号" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker clearable size="small" v-model="value" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期" end-placeholder="结束日期" @change="changeTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:order:delete']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="expand" width="18">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="ID：">
              <span>{{scope.row.id}}</span>
            </el-form-item>
            <el-form-item label="流程ID：">
              <span>{{ scope.row.procInsId }}</span>
            </el-form-item>
            <el-form-item label="订单编号：">
              <span>{{scope.row.orderNo}}</span>
            </el-form-item>
            <el-form-item label="标题：">
              <span>{{ scope.row.title }}</span>
            </el-form-item>
            <el-form-item label="客户：">
              <span>{{scope.row.customerNo}} - {{scope.row.enterpriseName}}</span>
            </el-form-item>
            <el-form-item label="客户邮箱：">
              <span>{{ scope.row.customerEmail }}</span>
            </el-form-item>
            <el-form-item label="客户联系电话：">
              <span>{{ scope.row.customerPhoneNo }}</span>
            </el-form-item>
            <el-form-item label="服务期(月)：">
              <span>{{ scope.row.serviceDuration }}</span>
            </el-form-item>
            <el-form-item label="是否涉及非标：">
              <span>{{ scope.row.involveNonStandard ? "是" : "否" }}</span>
            </el-form-item>
            <el-form-item label="售前：">
              <span>{{scope.row.preSalesName}} {{scope.row.preSalesNickName}}</span>
            </el-form-item>
            <el-form-item label="是否涉及其他费用：">
              <span>{{ scope.row.involveOtherFee ? "是" : "否" }}</span>
            </el-form-item>
            <el-form-item label="其他费用：">
              <span>{{ scope.row.otherFee }}</span>
            </el-form-item>
            <el-form-item label="其他费用描述：">
              <span>{{ scope.row.otherFeeDesc }}</span>
            </el-form-item>
            <el-form-item label="其他费用支付方式：">
              <span>{{getDicValue(scope.row.otherFeePayType, payTypeList)}}</span>
            </el-form-item>
            <el-form-item label="结算货币：">
              <span>{{getDicValue(scope.row.currencyType, currencyTypeList)}}</span>
            </el-form-item>
            <el-form-item label="销售：">
              <span>{{scope.row.userName}} {{scope.row.userNickName}}</span>
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
      <el-table-column label="订单编号" align="left" prop="orderNo" width="200px" />
      <el-table-column label="标题" align="left" prop="title" :show-overflow-tooltip="true" width="220" />
      <el-table-column label="客户编号" align="left" prop="customerNo" :show-overflow-tooltip="true" width="100" />
      <el-table-column label="企业名称" align="left" prop="enterpriseName" :show-overflow-tooltip="true" width="220" />
      <el-table-column label="是否涉及非标" align="center" width="100">
        <template slot-scope="scope">
          {{ scope.row.involveNonStandard ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="是否涉及其他费用" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.involveOtherFee ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="销售" align="left" prop="userNickName" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="创建时间" align="center" prop="createTime" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-document" @click="checkOrderDetail(scope.row)">详情</el-button>
          <el-dropdown>
            <el-button type="text" class="el-icon-more" style="margin-left: 10px" />
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item v-for="(item, index) in childTables" :key="index"
                @click.native="showTableDetail(scope, item)">{{ item.label }}</el-dropdown-item> -->
                <el-dropdown-item @click.native="showTableDetail(scope)">产品</el-dropdown-item>
                <el-dropdown-item @click.native="handleDelete(scope.row)" v-hasPermi="['system:order:delete']">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList"></pagination>

    <!-- 子表弹框 -->
    <el-dialog title="产品详情" :visible.sync="dialogVisible" width="1000px" :before-close="handleClose" v-drag>
      <orderProForm :params="childTableParams"
      :dialogVisible="dialogVisible"
      :tableConfig="tableConfig"
      :childTables="childTables" />
    </el-dialog>
    <!-- 订单详情弹框 -->
    <el-dialog title="订单详情" :visible.sync="orderDetailVisable" width="70%">
      <orderForm :formValue="orderDetailValue" :bizDetail="true" :isStart ="true"></orderForm>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderList, deleteOrder } from "@/api/biz/order";
import { getCustomerList,getOrderDetail, } from "@/api/flowable/form";
import orderForm from "@/components/StaticForm/orderForm";
import orderProForm from "@/views/flowable/biz/order/orderProForm";
export default {
  components: {
    orderProForm,
    orderForm
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
        fuzzyOrderNo: null,
        startTime: null,
        endTime: null,
        pageNo: 1,
        pageSize: 10
      },
      value: [],
      // 订单列表
      orderList: [],
      // 客户列表
      customerList: [],
      // 结算货币
      currencyTypeList: [],
      // 支付方式
      payTypeList: [],
      orderDetailVisable: false,
      // 订单详情
      orderDetailValue: {},
      // 八张子表
      childTables: [
        {
          id: 1,
          label: "端口",
        },
        {
          id: 2,
          label: "设备",
        },
        {
          id: 3,
          label: "MPLS/IPSec",
        },
        {
          id: 4,
          label: "专线",
        },
        {
          id: 5,
          label: "Internet",
        },
        {
          id: 6,
          label: "IDC",
        },
        {
          id: 7,
          label: "服务",
        },
        {
          id: 8,
          label: "集成",
        },
      ],
      // 子表弹框的显隐
      dialogVisible: false,
      // 子表参数
      childTableParams: {
        pageNo: 1,
        pageSize: 10,
        orderId: null,
      },
      searchCustomer: {
        keywords: "",
        pageNo: 1,
        pageSize: 1000,
      },
      //八张子表对应显示的列参数
      tableConfig: {
        端口: {
          bandWidthVisable: true,
          popNoVisable: true,
          portNoVisable: true,
          priceVisable: true,
          siteAddrVisable: true,
          unitPriceVisable: true,
          expDeliveryDateVisable: true,
        },
        设备: {
          priceVisable: true,
          unitPriceVisable: true,
          siteAddrVisable: true,
        },
        "MPLS/IPSec": {
          bandWidthVisable: true,
          addrVisable: true,
          popNoVisable: true,
          ispVisable: true,
          deliveryDateVisable: true,
          purchaseRemarksVisabel: true,
        },
        专线: {
          bandWidthVisable: true,
          aAddrVisable: true,
          aPortTypeVisable: true,
          zAddrVisable: true,
          zPortTypeVisable: true,
          ispVisable: true,
          deliveryDateVisable: true,
        },
        Internet: {
          bandWidthVisable: true,
          addrVisable: true,
          ipCountVisable: true,
          portTypeVisable: true,
          ispVisable: true,
          upDownSymmetryVisable: true,
          deliveryDateVisable: true,
        },
        IDC: {
          bandWidthVisable: true,
          bandwidthTypeVisable: true,
          addrVisable: true,
          frameNoVisable: true,
          ipCountVisable: true,
          deliveryDateVisable: true,
          electricPowerVisable:true,
        },
        服务: {
          deliveryDateVisable: true,
        },
        集成: {
          descVisable: true,
          deviceModelVisable: true,
          deliveryDateVisable: true,
          oneTimeFeeVisable: true,
          oneTimeMgtFeeVisable: true,
        },
      },
    };
  },
  created() {
    //获取结算货币
    this.getDicts("currency_Type").then((response) => {
      this.currencyTypeList = response.data;
    });
    //获取支付方式类型
    this.getDicts("feepay_type").then((response) => {
      this.payTypeList = response.data;
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
    //获取订单列表
    getList() {
      this.loading = true;
      getOrderList(this.queryParams).then((res) => {
        this.orderList = res.data.list;
        this.total = res.data.size;
        this.loading = false;
      });
    },
    // 获取客户列表
    getCustomerList() {
      getCustomerList(this.searchCustomer).then((res) => {
        this.customerList = res.data;
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
      _this.$confirm("是否确认删除选中记录?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        deleteOrder(params).then((res) => {
          _this.$message({ type: "success", message: res.msg });
          _this.getList();
        });
      }).catch(() => {});
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
      this.childTableParams.orderId = scope.row.id;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    remoteMethod(keywords) {
      this.searchCustomer.keywords = keywords;
      this.getCustomerList();
    },
    // 查看订单详情
    checkOrderDetail(i) {
      this.orderDetailVisable = true;
      let params = {
        orderId: i.id
      }
      getOrderDetail(params).then((res)=> {
        this.orderDetailValue = res.data;
      })
    }
  },
};
</script>
