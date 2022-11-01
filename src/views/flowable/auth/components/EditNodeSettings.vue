<!--节点权限设置-->
<template>
  <div class="app-container">
    <el-dialog title="节点权限设置" :visible.sync="formVisible" width="1000px" :close-on-click-modal="true" v-drag>
      <el-form :model="queryParams" ref="nodeForm" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
                v-hasPermi="['flow:auth:node:setting:list']">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                v-hasPermi="['flow:auth:node:setting:delete']">删除</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getFlowAuthNodeSettingList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="settingList" @selection-change="handleSelectionChange">
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
              <el-form-item label="组件ID：">
                <span>{{scope.row.widgetId}}</span>
              </el-form-item>
              <el-form-item label="组件编码：">
                <span>{{scope.row.widgetCode}}</span>
              </el-form-item>
              <el-form-item label="组件名称：">
                <span>{{scope.row.widgetName}}</span>
              </el-form-item>
              <el-form-item label="可见：">
                <span><el-checkbox v-model="scope.row.viewable" disabled /></span>
              </el-form-item>
              <el-form-item label="可编辑：">
                <span><el-checkbox v-model="scope.row.editable" disabled /></span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="selection" :selectable="row => !row.valid" width="55" align="center"/>
        <el-table-column label="组件编码" prop="widgetCode" :show-overflow-tooltip="true" width="180px" />
        <el-table-column label="组件名称" prop="widgetName" :show-overflow-tooltip="true" width="400px" />
        <el-table-column label="可见" prop="viewable" width="90px">
          <template slot="header" slot-scope="scope">
             <el-checkbox :scope="scope" @change="handleChangeView" v-model="checkAllViewable" :indeterminate="viewIndeterminate">
               可见
             </el-checkbox>
          </template>
          <template slot-scope="scope2">
            <el-checkbox v-model="scope2.row.viewable" @change="tableCheckboxChange" />
          </template>
        </el-table-column>
        <el-table-column label="可编辑" prop="editable" width="100px">
          <template slot="header" slot-scope="scope">
             <el-checkbox :scope="scope" @change="handleChangeEdit" v-model="checkAllEditable" :indeterminate="editIndeterminate">
               可编辑
             </el-checkbox>
          </template>
          <template slot-scope="scope2">
            <el-checkbox v-model="scope2.row.editable" @change="tableCheckboxChange" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                    v-hasPermi="['flow:auth:node:setting:delete']" v-if="!scope.row.valid">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column/>
      </el-table>
       <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveChange">保存</el-button>
        <el-button @click="formVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {queryFlowAuthNodeSettingList, deleteFlowAuthNodeSetting, saveFlowAuthNodeSetting} from "@/api/flowable/auth";

export default {
  name: "FlowAuthNodeSetting",
  data() {
    return {
      formVisible: false,//是否显示
      loading: false,// 遮罩层
      procDefId: null,
      nodeKey: null,

      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 查询参数
      queryParams: {

      },
      // 权限设置数据
      settingList: [],
      // 可见半选标志
      viewIndeterminate: false,
       // 可编辑半选标志
      editIndeterminate: false,
      // 可见全选标志
      checkAllViewable: false,
      // 可编辑全选标志
      checkAllEditable: false
    };
  },
  created() {
  },
  mounted() {
  },
  methods: {
    show: function(row) {
      this.procDefId = row.procDefId;
      this.nodeKey = row.nodeKey;
      this.formVisible = true;

      this.getFlowAuthNodeSettingList();
    },

    /** 查询权限设置列表 */
    getFlowAuthNodeSettingList() {
      var params = {
        "procDefId": this.procDefId,
        "nodeKey": this.nodeKey
      };
      this.loading = true;
      queryFlowAuthNodeSettingList(params).then(resp => {
        this.settingList = resp.data;
        this.loading = false;
        this.tableCheckboxChange();
      }).catch((err) => {
        this.settingList = [];
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getFlowAuthNodeSettingList();
    },
    // 多选框选中数据
    handleSelectionChange(slt) {
      this.ids = slt.map(item => item.id).filter(s => s);
      this.multiple = !this.ids.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const _ids = row.id || this.ids.toString();
      if (!_ids) {
        this.$message.error("未选择数据项");
        return;
      }
      var params = {
        "ids": _ids
      };
      var _this = this;
      _this.$confirm('是否确认删除选中记录?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        deleteFlowAuthNodeSetting(params).then(res => {
          _this.$message({type: "success", message: res.msg});
          _this.getFlowAuthNodeSettingList();
        });
      }).catch(() => {

      });
    },

    /** 节点组件可见全选 */
    handleChangeView(val) {
      if(val) {
        this.settingList.forEach(item=> {
          item.viewable = true
        })
        this.viewIndeterminate = false;
      } else  {
        this.settingList.forEach(item=> {
          item.viewable = false;
        })
        this.viewIndeterminate = false;
      }
    },
    /** 节点组件可编辑全选 */
    handleChangeEdit(val) {
      if(val) {
        this.settingList.forEach(item=> {
          item.editable = true
        })
        this.editIndeterminate = false;
      } else  {
        this.settingList.forEach(item=> {
          item.editable = false;
        })
        this.editIndeterminate = false;
      }
    },

    tableCheckboxChange() {
       setTimeout(() => {
        let isAllTrueViewable = this.settingList.every(
          item => item.viewable === true
        ); 
        let isAllFalseViewable = this.settingList.every(
          item => item.viewable === false || item.viewable === null
        ); 
        let isAllTrueEditable = this.settingList.every(
          item => item.editable === true
        ); 
        let isAllFalseEditable = this.settingList.every(
          item => item.editable === false || item.editable === null
        );  
        if (isAllTrueViewable) {
          this.viewIndeterminate= false;
          this.checkAllViewable = true;
        } else if (isAllFalseViewable) {
          this.viewIndeterminate = false;
          this.checkAllViewable = false;
        } else {
          this.checkAllViewable = false;
          this.viewIndeterminate = true;
        }
        if (isAllTrueEditable) {
          this.editIndeterminate= false;
          this.checkAllEditable = true;
        } else if (isAllFalseEditable) {
          this.editIndeterminate = false;
          this.checkAllEditable = false;
        } else {
          this.checkAllEditable = false;
          this.editIndeterminate = true;
        }
      }, 0);
    },
    // 保存
    saveChange() {
      let data = [];
      this.settingList.forEach(item=> {
        data.push({
          widgetId: item.widgetId,
          viewable: item.viewable ? true : false,
          editable: item.editable ? true : false,
          })
      })
       saveFlowAuthNodeSetting(this.procDefId,this.nodeKey,data).then(res=> {
         if(res.code == 200) {
           this.$message({type: "success", message: '保存成功'});
           this.formVisible = false;
         } else {
            this.$message.error(res.msg);
         }
       })
    },
  }
};
</script>
