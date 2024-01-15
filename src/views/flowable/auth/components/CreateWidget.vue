<template>
	<el-dialog title="新增权限组件" :visible.sync="addFormVisible" :close-on-click-modal="true" width="600px" v-drag>
    <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addForm">
      <el-form-item label="流程类别" prop="procCategory">
        <el-select v-model="addForm.procCategory" clearable placeholder="" style="width: 95%">
          <el-option v-for="dict in procCategoryList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组件编码" prop="code">
        <el-input v-model="addForm.code" autocomplete="off" clearable style="width: 95%"></el-input>
      </el-form-item>
      <el-form-item label="组件名称" prop="name">
        <el-input v-model="addForm.name" autocomplete="off" clearable style="width: 95%"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click.native="addFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {addFlowAuthWidget} from "@/api/flowable/auth";
	export default {
		data() {
			return {
        procCategoryList: [],    //流程类别列表

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          procCategory: [
            {required: true, message: '请选择流程类别', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入组件编码', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入组件名称', trigger: 'blur'}
          ]
        },
        //新增界面数据
        addForm: {

        }
			}
		},
		methods: {
      getProcCategoryList() {
        this.getDicts("sys_process_category").then(resp => {
          this.procCategoryList = resp.data;
        });
      },
			show: function() {
        this.addFormVisible = true;
        this.addForm = {
          procCategory: null,
          code: null,
          name: null
        };
        this.resetForm("addForm");

        this.getProcCategoryList();
			},
			//新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            var params = "_fk=u"
              + (this.addForm.procCategory ? "&procCategory=" + this.addForm.procCategory : "")
              + (this.addForm.code ? "&code=" + this.addForm.code : "")
              + (this.addForm.name ? "&name=" + this.addForm.name : "");

            this.addLoading = true;
            addFlowAuthWidget(params).then(res => {
              this.$message({type: "success", message: res.msg});
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
              this.addLoading = false;
              this.$emit("success", 1);
            }).catch((err) => {
              this.addLoading = false;
            });
          }
        });
      }
		},
		mounted() {

		}
	}
</script>

<style>

</style>

