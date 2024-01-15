<!--权限组件-->
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="流程类别" prop="procCategory">
        <el-select v-model="queryParams.procCategory" clearable size="small" placeholder="请选择流程类别">
          <el-option v-for="dict in procCategoryList" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
              v-hasPermi="['flow:auth:widget:list']">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="$refs.createWidget.show()"
              v-hasPermi="['flow:auth:widget:create']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['flow:auth:widget:delete']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getFlowAuthWidgetList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="widgetList" @selection-change="handleSelectionChange">
			<el-table-column type="expand" width="18">
				<template slot-scope="scope">
					<el-form label-position="left" inline class="table-expand">
						<el-form-item label="ID：">
							<span>{{scope.row.id}}</span>
						</el-form-item>
						<el-form-item label="流程分类：">
							<span>{{scope.row.procCategory}} - {{procCategoryFormat(scope.row)}}</span>
						</el-form-item>
						<el-form-item label="组件编码：">
							<span>{{scope.row.code}}</span>
						</el-form-item>
						<el-form-item label="组件名称：">
							<span>{{scope.row.name}}</span>
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
      <el-table-column label="ID" align="center" prop="id" sortable />
      -->
      <el-table-column label="流程分类" prop="procCategory" :formatter="procCategoryFormat" :show-overflow-tooltip="true" width="220px" />
      <el-table-column label="组件编码" prop="code" :show-overflow-tooltip="true" width="160px" />
      <el-table-column label="组件名称" prop="name" :show-overflow-tooltip="true" width="240px" />
      <el-table-column label="操作" fixed="right" width="120px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="$refs.editWidget.show(scope.$index, scope.row)"
                  v-hasPermi="['flow:auth:widget:update']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                  v-hasPermi="['flow:auth:widget:delete']">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column />
    </el-table>

    <el-pagination layout="total, sizes, prev, pager, next, jumper" background
          @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[10,20,50,100]" :current-page="queryParams.pageNo" :page-size="queryParams.pageSize"
          :total="total" style="float:right;">
    </el-pagination>

		<!--新增界面-->
		<create-widget ref="createWidget" v-on:success="getFlowAuthWidgetList"/>
		<!--编辑界面-->
		<edit-widget ref="editWidget" v-on:success="getFlowAuthWidgetList"/>
  </div>
</template>

<script>
import {getFlowAuthWidgetList, deleteFlowAuthWidget} from "@/api/flowable/auth";
import CreateWidget from './components/CreateWidget';
import EditWidget from './components/EditWidget';

export default {
  components: {
    'create-widget': CreateWidget,
    'edit-widget': EditWidget
  },

  name: "FlowAuthWidget",
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
      // 权限组件表格数据
      widgetList: [],
      // 查询参数
      queryParams: {
        procCategory: 'order',
        pageNo: 1,
        pageSize: 10
      },
      procCategoryList: []    //流程类别列表
    };
  },
  created() {
    this.getDicts("sys_process_category").then(resp => {
      this.procCategoryList = resp.data;
    });
    this.getFlowAuthWidgetList();
  },
  methods: {
    handleSizeChange(psize) {
      this.queryParams.pageNo = 1;
      this.queryParams.pageSize = psize;
      this.getFlowAuthWidgetList();
    },
    handleCurrentChange(pno) {
      this.queryParams.pageNo = pno;
      this.getFlowAuthWidgetList();
    },
    /** 查询权限组件列表 */
    getFlowAuthWidgetList() {
      if (!this.queryParams || !this.queryParams.procCategory) {
        this.total = 0;
        this.widgetList = [];
        this.loading = false;
        //this.$message.error("请选择流程类别");
        return;
      }
      this.loading = true;
      getFlowAuthWidgetList(this.queryParams).then(resp => {
        this.total = resp.data.size;
        this.widgetList = resp.data.list;
        this.loading = false;
      }).catch((err) => {
        this.loading = false;
      });
    },
    // 流程分类字典翻译
    procCategoryFormat(row, column) {
      return this.selectDictLabel(this.procCategoryList, row.procCategory);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getFlowAuthWidgetList();
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
        deleteFlowAuthWidget(params).then(res => {
          _this.$message({type: "success", message: res.msg});
          _this.getFlowAuthWidgetList();
        });
      }).catch(() => {

      });
    }
  }
};
</script>
