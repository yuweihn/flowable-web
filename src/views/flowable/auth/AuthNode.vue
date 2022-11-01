<!--权限节点-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="nodeForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
              v-hasPermi="['flow:auth:node:list']">搜索</el-button>
        <el-button type="primary" icon="el-icon-caret-left" size="mini" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['flow:auth:node:delete']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getFlowAuthNodeList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="nodeList" @selection-change="handleSelectionChange">
			<el-table-column type="expand" width="18">
				<template slot-scope="scope">
					<el-form label-position="left" inline class="table-expand">
						<el-form-item label="流程定义ID：">
							<span>{{scope.row.procDefId}}</span>
						</el-form-item>
						<el-form-item label="节点Key：">
							<span>{{scope.row.nodeKey}}</span>
						</el-form-item>
						<el-form-item label="节点名称：">
							<span>{{scope.row.nodeName}}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
      <el-table-column type="selection" :selectable="row => !row.valid" width="55" align="center" />
      <el-table-column label="流程定义ID" prop="procDefId" :show-overflow-tooltip="true" width="400px" />
      <el-table-column label="节点Key" prop="nodeKey" :show-overflow-tooltip="true" width="160px" />
      <el-table-column label="节点名称" prop="nodeName" :show-overflow-tooltip="true" width="160px" />
      <el-table-column label="操作" fixed="right" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-files" @click="$refs.editNodeSettings.show(scope.row)"
                  v-hasPermi="['flow:auth:node:setting:list']">节点组件</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['flow:auth:node:delete']" v-if="!scope.row.valid">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column />
    </el-table>

		<!--节点组件设置界面-->
		<edit-settings ref="editNodeSettings" v-on:success="getFlowAuthNodeList"/>
  </div>
</template>

<script>
import {queryFlowAuthNodeList, deleteFlowAuthNode} from "@/api/flowable/auth";
import {queryProcDefIdByDeployId} from "@/api/flowable/definition";
import EditNodeSettings from './components/EditNodeSettings';

export default {
  name: "FlowAuthNode",
  components: {
    'edit-settings': EditNodeSettings
  },

  data() {
    return {
      deployId: null,
      procDefId: null,
      // 遮罩层
      loading: true,
      // 选中数组
      nodeKeys: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {

      },
      // 权限节点数据
      nodeList: []
    };
  },
  created() {
    this.loading = false;
    this.deployId = this.$route.query && this.$route.query.deployId;
    if (!this.deployId) {
      return;
    }
    this.getProcDefIdByDeployId();
    this.getFlowAuthNodeList();
  },
  mounted() {

  },
  methods: {
    /** 根据deployId查询procDefId */
    getProcDefIdByDeployId() {
      if (!this.deployId) {
        this.procDefId = null;
        return;
      }
      var params = {
        "deployId": this.deployId
      };
      queryProcDefIdByDeployId(params).then(resp => {
        this.procDefId = resp.data;
      }).catch((err) => {
        this.$message.error("查询流程定义ID失败");
      });
    },

    /** 查询权限节点列表 */
    getFlowAuthNodeList() {
      if (!this.deployId) {
        this.nodeList = [];
        this.loading = false;
        return;
      }
      var params = {
        "deployId": this.deployId
      };
      this.loading = true;
      queryFlowAuthNodeList(params).then(resp => {
        this.nodeList = resp.data;
        this.loading = false;
      }).catch((err) => {
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getFlowAuthNodeList();
    },
    // 多选框选中数据
    handleSelectionChange(slt) {
      this.nodeKeys = slt.map(item => item.nodeKey).filter(s => s);
      this.multiple = !this.nodeKeys.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const _nodeKeys = row.nodeKey || this.nodeKeys.toString();
      var params = {
        procDefId: this.procDefId,
        nodeKeys: _nodeKeys
      };
      var _this = this;
      _this.$confirm('是否确认删除选中记录?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        deleteFlowAuthNode(params).then(res => {
          _this.$message({type: "success", message: res.msg});
          _this.getFlowAuthNodeList();
        });
      }).catch(() => {

      });
    },
    /** 返回页面 */
    goBack() {
      // 关闭当前标签页并返回上个页面
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.go(-1);
    }
  }
};
</script>
