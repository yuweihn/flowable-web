<template>
  <div>
    <el-tabs v-model="activeTab">
     <el-tab-pane v-for="item in tabList" :key="item.id" :label="item.label" :name="item.label">
      <div slot="label"  @click="clickTab(item)">{{item.label}}</div>
      <el-table :data="tableList" style="width: 100%">
        <el-table-column type="expand" width="18">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="宽带：" v-if="config.bandWidthVisable">
                <span>{{ scope.row.bandwidth }}</span>
              </el-form-item>
              <el-form-item label="带宽类型：" v-if="config.bandwidthTypeVisable">
                <span>{{ getDicValue(scope.row.bandwidthType,bandwidthList) }}</span>
              </el-form-item>
              <el-form-item label="A端地址:" v-if="config.aAddrVisable">
                <span>{{ scope.row.aAddr }}</span>
              </el-form-item>
              <el-form-item label="A端端口类型:" v-if="config.aPortTypeVisable">
                <span>{{ getDicValue(scope.row.aPortType,aPortTypeList) }}</span>
              </el-form-item>
              <el-form-item label="Z端地址:" v-if="config.zAddrVisable">
                <span>{{ scope.row.zAddr }}</span>
              </el-form-item>
              <el-form-item label="Z端端口类型:" v-if="config.zPortTypeVisable">
                <span>{{ getDicValue(scope.row.zPortType,zPortTypeList) }}</span>
              </el-form-item>
              <el-form-item label="接入地址:" v-if="config.addrVisable">
                <span>{{ scope.row.addr }}</span>
              </el-form-item>
              <el-form-item label="电力(KVA):" v-if="config.electricPowerVisable">
                <span>{{ scope.row.electricPower }}</span>
              </el-form-item>
              <el-form-item label="机框:" v-if="config.frameNoVisable">
                <span>{{ getDicValue(scope.row.frameNo,frameList) }}</span>
              </el-form-item>
              <el-form-item label="服务描述:" v-if="config.descVisable">
                <span>{{ scope.row.desc }}</span>
              </el-form-item>
              <el-form-item label="设备型号:" v-if="config.deviceModelVisable">
                <span>{{ scope.row.deviceModel }}</span>
              </el-form-item>
              <el-form-item label="接入POP:" v-if="config.popNoVisable">
                <span>{{ getDicValue(scope.row.popNo,popList)}}</span>
              </el-form-item>
              <el-form-item label="骨干网端口产品:" v-if="config.portNoVisable">
                <span>{{ getDicValue(scope.row.portNo,portProductList)}}</span>
              </el-form-item>
              <el-form-item label="IP数量:" v-if="config.ipCountVisable">
                <span>{{ scope.row.ipCount }}</span>
              </el-form-item>
              <el-form-item label="端口类型:" v-if="config.portTypeVisable">
                <span>{{ getDicValue(scope.row.portType,portTypeList)}}</span>
              </el-form-item>
              <el-form-item label="运营商:" v-if="config.ispVisable">
                <span>{{ getDicValue(scope.row.isp,operatorList)}}</span>
              </el-form-item>
              <el-form-item label="上下行对称:" v-if="config.upDownSymmetryVisable">
                  <span>{{scope.row.upDownSymmetry? '是':'否'}}</span>
              </el-form-item>
              <el-form-item label="一次性费用:" v-if="!(config.oneTimeFeeVisable)">
                <span>{{ scope.row.oneTimeFee }}</span>
              </el-form-item>
              <el-form-item label="一次性费用管理价:" v-if="!(config.oneTimeMgtFeeVisable)">
                <span>{{ scope.row.oneTimeMgtFee }}</span>
              </el-form-item>
              <el-form-item label="销售价格(元/月):" v-if="config.priceVisable">
                <span>{{ scope.row.price }}</span>
              </el-form-item>
              <el-form-item label="销售单价（元/项/月）:" v-if="!(config.unitPriceVisable)">
                <span>{{ scope.row.unitPrice}}</span>
              </el-form-item>
              <el-form-item label="数量(项):">
                <span>{{ scope.row.quantity }}</span>
              </el-form-item>
              <el-form-item label="站点地址:" v-if="config.siteAddrVisable">
                <span>{{ scope.row.siteAddr }}</span>
              </el-form-item>
              <el-form-item label="交付时间:" v-if="config.deliveryDateVisable">
                <span>{{ scope.row.deliveryDate }}</span>
              </el-form-item>
              <el-form-item label="期望交付日期:" v-if="config.expDeliveryDateVisable">
                <span>{{ scope.row.expDeliveryDate }}</span>
              </el-form-item>
              <el-form-item label="备注:">
                <span>{{ scope.row.remarks }}</span>
              </el-form-item>
              <el-form-item label="采购备注信息:" v-if="config.purchaseRemarksVisabel">
                <span>{{ scope.row.purchaseRemarks }}</span>
              </el-form-item>
              <el-form-item label="创建人:">
                <span>{{ scope.row.creator }}</span>
              </el-form-item>
              <el-form-item label="创建时间:">
                <span>{{ scope.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="修改人:">
                <span>{{ scope.row.modifier }}</span>
              </el-form-item>
              <el-form-item label="修改时间:">
                <span>{{ scope.row.modifyTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="bandwidth" label="带宽" align="center" v-if="config.bandWidthVisable">
          <template slot-scope="scope">
              <span>{{ scope.row.bandwidth}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bandwidthType" label="带宽类型" align="center" v-if="config.bandwidthTypeVisable">
          <template slot-scope="scope">
              <span>{{ getDicValue(scope.row.bandwidthType,bandwidthList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="aAddr" label="A端地址" align="center" v-if="config.aAddrVisable">
          <template slot-scope="scope">
              <span>{{ scope.row.aAddr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="aPortType" label="A端端口类型" align="center" v-if="config.aPortTypeVisable" width="140">
          <template slot-scope="scope">
              <span>{{ getDicValue(scope.row.aPortType,aPortTypeList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zAddr" label="Z端地址" align="center" v-if="config.zAddrVisable">
          <template slot-scope="scope">
              <span>{{ scope.row.zAddr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zPortType" label="Z端端口类型" align="center" v-if="config.zPortTypeVisable" width="140">
          <template slot-scope="scope">
              <span>{{ getDicValue(scope.row.zPortType,zPortTypeList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addr" label="接入地址" align="center" v-if="config.addrVisable">
          <template slot-scope="scope">
              <span>{{ scope.row.addr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="electricPower" label="电力(KVA)" align="center" v-if="config.electricPowerVisable" width="140">
          <template slot-scope="scope">
              <span>{{ scope.row.electricPower}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="frameNo" label="机框" align="center" v-if="config.frameNoVisable">
          <template slot-scope="scope">
              <span>{{ getDicValue(scope.row.frameNo,frameList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="服务描述" align="center" width="160" v-if="config.descVisable">
          <template slot-scope="scope">
              <span>{{ scope.row.desc}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceModel" label="设备型号" align="center" width="160" v-if="config.deviceModelVisable">
          <template slot-scope="scope">
              <span>{{ scope.row.deviceModel }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="popNo" label="接入POP" align="center" width="160" v-if="config.popNoVisable">
          <template slot-scope="scope">
              <span>{{ getDicValue(scope.row.popNo,popList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="portNo" label="骨干网端口产品" align="center" width="180" v-if="config.portNoVisable">
          <template slot-scope="scope">
              <span>{{ getDicValue(scope.row.portNo,portProductList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ipCount" label="IP数量" align="center" width="160" v-if="config.ipCountVisable">
            <template slot-scope="scope">
              <span>{{scope.row.ipCount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="portType" label="端口类型" align="center" width="160" v-if="config.portTypeVisable">
          <template slot-scope="scope">
              <span>{{ getDicValue(scope.row.portType,portTypeList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isp" label="运营商" align="center" width="160" v-if="config.ispVisable">
          <template slot-scope="scope">
              <span>{{ getDicValue(scope.row.isp,operatorList)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="upDownSymmetry" label="上下行对称" align="center" width="160" v-if="config.upDownSymmetryVisable">
          <template slot-scope="scope">
              <span>{{scope.row.upDownSymmetry? '是':'否'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oneTimeFee" label="一次性费用" width="140" align="center" v-if="!(config.oneTimeFeeVisable)">
          <template slot-scope="scope">
              <span>{{scope.row.oneTimeFee}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="oneTimeMgtFee" label="一次性费用管理价" align="center" width="160" v-if="!(config.oneTimeMgtFeeVisable)">
          <template slot-scope="scope">
              <span>{{scope.row.oneTimeMgtFee}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="销售价格(元/月)" align="center" width="150"  v-if="config.priceVisable">
          <template slot-scope="scope">
              <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice" label="销售单价（元/项/月）" align="center" width="150" v-if="!(config.unitPriceVisable)">
            <template slot-scope="scope">
              <span>{{scope.row.unitPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量(项)" align="center">
          <template slot-scope="scope">
              <span>{{scope.row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="siteAddr" label="站点地址" align="center" v-if="config.siteAddrVisable" width="150">
          <template slot-scope="scope">
              <span>{{scope.row.siteAddr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryDate" label="交付时间" align="center" width="160" v-if="config.deliveryDateVisable">
          <template slot-scope="scope">
            <span>{{scope.row.deliveryDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expDeliveryDate" label="期望交付日期" align="center" width="160" v-if="config.expDeliveryDateVisable">
          <template slot-scope="scope">
              <span>{{scope.row.expDeliveryDate}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" align="center" :show-overflow-tooltip="true" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.remarks}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseRemarks" label="采购备注信息" align="center" v-if="config.purchaseRemarksVisabel" overflow-tooltip="true" width="150">
          <template slot-scope="scope">
              <span>{{scope.row.purchaseRemarks}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" align="center" width="220">
          <template slot-scope="scope">
              <span>{{scope.row.creator}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="170">
          <template slot-scope="scope">
              <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="modifier" label="修改人" align="center">
          <template slot-scope="scope">
              <span>{{scope.row.modifier}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="modifyTime" label="修改时间" align="center" width="170">
          <template slot-scope="scope">
              <span>{{scope.row.modifyTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="queryParams.pageNo"
        :page-size="queryParams.pageSize"
        :total="total"
        style="float: right;margin-top: 10px;margin-bottom: 10px"
      >
      </el-pagination>
     </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  OSP_PortList,
  OSP_DevList,
  ONSP_MpLsList,
  ONSP_SpecialLineList,
  ONSP_InternetList,
  ONSP_IDCList,
  ONSP_ServiceList,
  ONSP_IntegrationList,
} from "@/api/biz/order";
export default {
  props: {
    tableConfig:{
      type: Object,
      default: () => {},
    },
    params: {
      type: Object,
      default: () => {},
    },
    dialogVisible: {
      type: Boolean,
      default:false,
    },
    childTables: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 总条数
      total: 0,
      tableList: [], //列表数据
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      config: {},
      portProductList: [], //骨干网络端口产品
      popList: [], //接入pop
      operatorList: [], //运营商
      aPortTypeList:[], //A端端口类型
      zPortTypeList:[], //Z端端口类型
      portTypeList:[], //端口类型
      frameList:[], //机框
      bandwidthList:[], //带宽类型
      tabList:[],
      activeTab: "端口",
    };
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if(!val) {
          this.tableList = [];
        } else {
          this.activeTab = "端口";
          this.getPortList(this.params);
        }
      },
      deep: true,
      immediate: true,
    },
    childTables: {
      handler(val) {
        this.tabList = val
      },
      deep: true,
      immediate: true
    },
  },
  created() {
    //获取骨干网络端口产品
    this.getDicts('backbone _network _port _products').then(response => {
      this.portProductList = response.data;
    });
    //接入PoP
    this.getDicts("pop_list").then(response => {
      this.popList = response.data;
    });
    //获取运营商
    this.getDicts("operator_list").then(response => {
      this.operatorList = response.data;
    });
     //A端端口类型
    this.getDicts("a_port_type").then(response => {
      this.aPortTypeList = response.data;
    });
    //Z端端口类型
    this.getDicts("z_port_type").then(response => {
      this.zPortTypeList = response.data;
    });
    //端口类型
    this.getDicts("port_type").then(response => {
      this.portTypeList = response.data;
    });
     //机框
    this.getDicts("frame_type").then(response => {
      this.frameList = response.data;
    });
    //带宽类型
    this.getDicts("bandwidth_type").then(response => {
      this.bandwidthList = response.data;
    });
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
    handleSizeChange(psize) {
      this.queryParams.pageNo = 1;
      this.queryParams.pageSize = psize;
    },
    handleCurrentChange(pno) {
      this.queryParams.pageNo = pno;
    },
    clickTab(item) {
      const indexMap = {
        1: this.getPortList,
        2: this.getdevList,
        3: this.getMPLSList,
        4: this.getSpecialLineList,
        5: this.getInternetList,
        6: this.getIDCList,
        7: this.getServiceList,
        8: this.getIntegrationList,
      };
      if (indexMap[item.id]) {
        indexMap[item.id](this.params);
      }
    },
    // 订单标准产品(端口)
    getPortList(params) {
      OSP_PortList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        const tableType = "端口";
        this.config = this.tableConfig[tableType];
        // console.log("1", this.tableList);
      });
    },
    // 订单标准产品(设备)
    getdevList(params) {
      OSP_DevList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        const tableType = "设备";
        this.config = this.tableConfig[tableType];
        // console.log("2", this.tableList);
      });
    },
    // 订单非标准产品(MPLS/IPSec)
    getMPLSList(params) {
      ONSP_MpLsList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        const tableType = "MPLS/IPSec";
        this.config = this.tableConfig[tableType];
        // console.log("3", this.tableList);
      });
    },
    // 订单非标准产品(专线)
    getSpecialLineList(params) {
      ONSP_SpecialLineList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        const tableType = "专线";
        this.config = this.tableConfig[tableType];
        // console.log("4", this.tableList);
      });
    },
    // 订单非标准产品(Internet)
    getInternetList(params) {
      ONSP_InternetList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        const tableType = "Internet";
        this.config = this.tableConfig[tableType];
        // console.log("5", this.tableList);
      });
    },
    // 订单非标准产品(IDC)
    getIDCList(params) {
      ONSP_IDCList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        const tableType = "IDC";
        this.config = this.tableConfig[tableType];
        // console.log("6", this.tableList);
      });
    },
    // 订单非标准产品(服务)
    getServiceList(params) {
      ONSP_ServiceList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        const tableType = "服务";
        this.config = this.tableConfig[tableType];
        // console.log("7", this.tableList);
      });
    },
    // 订单非标准产品(集成)
    getIntegrationList(params) {
      ONSP_IntegrationList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        const tableType = "集成";
        this.config = this.tableConfig[tableType];
        // console.log("8", this.tableList);
      });
    },
  },
};
</script>
