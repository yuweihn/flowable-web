<template>
  <div>
    <el-tabs v-model="activeTab">
     <el-tab-pane v-for="item in tabList" :key="item.id" :label="item.label" :name="item.label">
      <div slot="label"  @click="clickTab(item)">{{item.label}}</div>
      <el-table :data="tableList" style="width: 100%">
        <el-table-column type="expand" width="18">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="table-expand">
              <el-form-item label="附件:" v-if="attachVisable">
                <span>{{ (scope.row.fileName) }}</span>
              </el-form-item>
              <el-form-item label="附件类型:" v-if="typeVisable">
                <span>{{ scope.row.typeName }}</span>
              </el-form-item>
              <el-form-item label="标题" v-if="titleVisable">
                  <span>{{ scope.row.title }}</span>
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
        <el-table-column prop="attachUrl" label="附件" align="left" :show-overflow-tooltip="true" width="255px" v-if="attachVisable">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击下载附件" placement="top-start">
              <a href="#" style="color:#46a6ff;text-decoration:underline"  @click="downloadFile(scope.row.attachUrl)">{{scope.row.fileName}}</a>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="附件类型" align="center" v-if="typeVisable">
          <template slot-scope="scope">
            <span>{{scope.row.typeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" align="left" :show-overflow-tooltip="true" width="400px" v-if="titleVisable">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.creator}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createtime" label="创建时间" align="center" width="170">
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
      <el-pagination layout="total, prev, pager, next, jumper" background @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :current-page="queryParams.pageNo"
            :page-size="queryParams.pageSize" :total="total" style="float: right;margin-top: 10px;margin-bottom: 10px" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {getContractAttachList, getContractOrderList} from "@/api/biz/contract";
export default {
  props: {
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
      attachVisable: true,
      typeVisable: true,
      titleVisable: true,
      // 总条数
      total: 0,
      tabList: [],
      tableList: [], //列表数据
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      config: {},
      attachList: [],//合同附件
      contractOrderList: [],//合同订单
      activeTab:"附件",
    };
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if(!val) {
          this.tableList = [];
        } else {
          this.activeTab = "附件"
          this.getAttachList(this.params)
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

  },
  methods: {
    clickTab(item) {
      const indexMap = {
          1: this.getAttachList,
          2: this.getContractOrderList,

        };
        if (indexMap[item.id]) {
          indexMap[item.id](this.params);
        }
    },
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
    // 合同附件
    getAttachList(params) {
      getContractAttachList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        this.titleVisable = false;
        this.attachVisable = true;
        this.typeVisable = true;
        // console.log('1',this.tableList)
      });
    },
    // 合同订单
    getContractOrderList(params) {
      getContractOrderList(params).then((res) => {
        this.tableList = res.data.list;
        this.total = res.data.size;
        this.attachVisable = false;
        this.typeVisable = false;
        this.titleVisable = true;
        // console.log('2',this.tableList)
      });
    },

    // 下载附件
    downloadFile(path) {
       window.open(path);
    }
  },
};
</script>
