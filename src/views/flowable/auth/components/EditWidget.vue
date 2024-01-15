<template>
  <el-dialog title="编辑权限组件" :visible.sync="editFormVisible" :close-on-click-modal="true" width="600px" v-drag>
    <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
      <el-form-item label="流程类别" prop="procCategory">
        <el-select v-model="editForm.procCategory" clearable placeholder="" style="width: 95%">
          <el-option v-for="dict in procCategoryList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组件编码" prop="code">
        <el-input v-model="editForm.code" autocomplete="off" style="width: 95%"></el-input>
      </el-form-item>
      <el-form-item label="组件名称" prop="name">
        <el-input v-model="editForm.name" autocomplete="off" clearable style="width: 95%"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="editFormVisible = false">取消</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {updateFlowAuthWidget} from "@/api/flowable/auth";
	export default {
		data() {
			return {
        procCategoryList: [],    //流程类别列表

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
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
        //编辑界面数据
        editForm: {

        }
      }
		},
		methods: {
      getProcCategoryList() {
        this.getDicts("sys_process_category").then(resp => {
          this.procCategoryList = resp.data;
        });
      },
			show: function(index, row) {
				this.editFormVisible = true;
        this.editForm = {
          id: row.id,
          procCategory: row.procCategory,
          code: row.code,
          name: row.name
        };
        this.resetForm("editForm");

        this.getProcCategoryList();
			},

			//编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            var params = "id=" + this.editForm.id
              + (this.editForm.procCategory ? "&procCategory=" + this.editForm.procCategory : "")
              + (this.editForm.code ? "&code=" + this.editForm.code : "")
              + (this.editForm.name ? "&name=" + this.editForm.name : "");

            this.editLoading = true;
            updateFlowAuthWidget(params).then(res => {
              this.$message({type: "success", message: res.msg});
              this.$refs['editForm'].resetFields();
              this.editFormVisible = false;
              this.editLoading = false;
              this.$emit("success", 1);
            }).catch((err) => {
              this.editLoading = false;
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

