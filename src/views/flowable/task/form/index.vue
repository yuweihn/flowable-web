<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="表单名称" prop="formName">
        <el-input v-model="queryParams.formName" placeholder="请输入表单名称" clearable size="small" @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                      v-hasPermi="['flowable:form:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                      v-hasPermi="['flowable:form:remove']">删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                      v-hasPermi="['flowable:form:export']">导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="formList" @selection-change="handleSelectionChange">
      <el-table-column type="expand" width="18">
				<template slot-scope="scope">
					<el-form label-position="left" inline class="table-expand">
						<el-form-item label="ID：">
							<span>{{scope.row.id}}</span>
						</el-form-item>
						<el-form-item label="表单名称：">
							<span>{{scope.row.formName}}</span>
						</el-form-item>
						<el-form-item label="备注：">
							<el-input type="textarea" :rows="4" style="width: 600px;" readonly placeholder="" v-model="scope.row.remark"></el-input>
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
      <el-table-column label="表单主键" prop="id" width="90px" />
      <el-table-column label="表单名称" prop="formName" width="200px" :show-overflow-tooltip="true" />
      <el-table-column label="备注" prop="remark" width="220px" :show-overflow-tooltip="true">
        <template slot-scope="scope">{{$utils.slice(scope.row.remark, 20)}}</template>
      </el-table-column>
      <el-table-column label="创建人" prop="creator" width="120px" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" prop="createTime" width="180px" :show-overflow-tooltip="true" />
      <el-table-column label="操作" fixed="right" width="180px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handleDetail(scope.row)">详情</el-button>
          <el-button v-if="scope.row.formType == 0" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                      v-hasPermi="['flowable:form:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                      v-hasPermi="['flowable:form:remove']">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column />
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改流程表单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body v-drag>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="form.formName" placeholder="请输入表单名称" />
        </el-form-item>
        <el-form-item label="表单内容">
          <editor v-model="form.formContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--表单配置详情弹框-->
    <el-dialog :title="formTitle" :visible.sync="formConfOpen" append-to-body v-drag center :width="dialogWidth">
      <div class="test-form" v-if="isShow ==0">
        <parser :key="new Date().getTime()" :form-conf="formConf" />
      </div>
      <div class="static-form" v-if="isShow ==1">
        <orderForm :isDetail ='isDetail'></orderForm>
      </div>
      <div class="static-form" v-if="isShow ==2">
        <contactForm :isDetail ='isDetail'></contactForm>
      </div>
      <div class="static-form" v-if="isShow ==3">
        <implForm :isDetail ='isDetail'></implForm>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {findFormList, getForm, delForm, addForm, updateForm, exportForm} from "@/api/flowable/form";
import Editor from '@/components/Editor';
import Parser from '@/components/parser/Parser';
import orderForm from '@/components/StaticForm/orderForm'; //订单申请单
import contactForm from '@/components/StaticForm/contractForm'; //合同申请单
import implForm from '@/components/StaticForm/implForm'; //实施启动单

export default {
  name: "FormList",
  components: {
    Editor,
    Parser,
    orderForm,
    contactForm,
    implForm
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 流程表单表格数据
      formList: [],
      // 弹出层标题
      title: "",
      formConf: {}, // 默认表单数据
      formConfOpen: false,
      formTitle: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        formName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {

      },
      dialogWidth:"",
      // 控制自定义以及静态表单的显隐藏
      isShow: 0,
      isDetail: true
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流程表单列表 */
    getList() {
      var params = {
        formName: this.queryParams.formName ? this.queryParams.formName : null,
        pageNo: this.queryParams.pageNo,
        pageSize: this.queryParams.pageSize
      }
      this.loading = true;
      findFormList(params).then(resp => {
        this.formList = resp.data.list;
        this.total = resp.data.size;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        formId: null,
        formName: null,
        formContent: null,
        createTime: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 表单配置信息 */
    handleDetail(row){
      this.formConfOpen = true;
      this.formTitle = "流程表单配置详细";
      this.isShow = row.formType;
      this.dialogWidth = "60%";
      this.formConf = JSON.parse(row.formContent);
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({ path: '/tool/build/index', query: {formId: null }});
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({ path: '/tool/build/index', query: {formId: row.id }});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.formId != null) {
            updateForm(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addForm(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const formIds = row.id || this.ids;
      this.$confirm('是否删除编号为"' + formIds + '"的表单?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delForm(formIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(() => {

      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有流程表单数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return exportForm(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
