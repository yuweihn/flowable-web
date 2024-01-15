<template>
	<el-dialog :title="(operation== 'add'? '新增':'修改') + '客户'" :visible.sync="dialogVisable" @close="dialogClose" :close-on-click-modal="false" width="1000px" v-drag>
    <el-form :model="formValue" label-width="110px" :rules="addFormRules" ref="formValue">
      <el-form-item label="客户编号" prop="customerNo" v-if="operation== 'edit'">
        <el-input v-model="formValue.customerNo" autocomplete="off" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="enterpriseName">
        <el-input v-model="formValue.enterpriseName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态" prop="statusCode">
            <el-select v-model="formValue.statusCode" clearable placeholder="" style="width:100%">
              <el-option v-for="dict in statusList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Tenant ID" prop="tenantId">
            <el-input v-model="formValue.tenantId" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="formValue.contacts" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="phoneNo">
            <el-input v-model="formValue.phoneNo" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formValue.email" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="margin-left:40px;margin-bottom:20px;color:#979ba3">第二联系人：</div>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人" prop="contacts2">
            <el-input v-model="formValue.contacts2" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="phoneNo2">
            <el-input v-model="formValue.phoneNo2" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="email2">
            <el-input v-model="formValue.email2" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="类型" prop="typeCode">
            <el-select v-model="formValue.typeCode" clearable placeholder="" style="width:100%">
              <el-option v-for="dict in typeList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业" prop="industryCode">
            <el-select v-model="formValue.industryCode" clearable placeholder="" style="width:100%">
              <el-option v-for="dict in industryList" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址" prop="addr">
            <el-input v-model="formValue.addr" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户经理" prop="salesUserId">
            <el-select v-model="formValue.salesUserId" placeholder="" @change="onSalesChanged($event)"
                    :remote-method="initSalesList" clearable filterable remote style="width:100%">
              <el-option v-for="item in salesSlt.result.list" :key="item.val" :label="item.label" :value="item.val" />
              <el-pagination layout="total, prev, pager, next"
                    hide-on-single-page
                    @current-change="onSalesPageChanged"
                    :current-page="salesSlt.pageNo"
                    :page-size="salesSlt.pageSize"
                    :total="salesSlt.result.size"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="margin-left:40px;margin-bottom:20px;color:#979ba3">开票信息：</div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发票抬头" prop="fpTitle">
            <el-input v-model="formValue.fpTitle" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行" prop="fpBankName">
            <el-input v-model="formValue.fpBankName" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="银行账号" prop="fpBankAccNo">
            <el-input v-model="formValue.fpBankAccNo" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票电话" prop="fpPhoneNo">
            <el-input v-model="formValue.fpPhoneNo" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="税号" prop="fpTaxNo">
            <el-input v-model="formValue.fpTaxNo" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票地址" prop="fpAddr">
            <el-input v-model="formValue.fpAddr" autocomplete="off" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="5" placeholder="" v-model="formValue.remark" autocomplete="off" clearable></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialogVisable = false">取消</el-button>
      <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
	import {validatePhone} from '@/utils/validate';
	import {addCustomer,updateCustomer} from "@/api/system/customer";
  import {getUserDropDownListByRoleKey} from "@/api/system/user";
	export default {
    props: {
      operation: {
        type: String,
        default: ''
      },
      isShow: {
        type:Boolean,
        default: false,
      },
      FormData: {
        type:Object,
        default:() => {}
      }
  },
		data() {
			return {
        statusList: [],
        typeList: [],
        industryList: [],
        regionList:[],
        addLoading: false,
        addFormRules: {
          enterpriseName: [
            {required: true, message: '请输入企业名称', trigger: 'blur'}
          ],
          statusCode: [
            {required: true, message: '请选择状态', trigger: 'change'}
          ],
          tenantId: [
            {required: true, message: '请输入Tenant ID', trigger: 'blur'}
          ],
          contacts: [
            {required: true, message: '请输入联系人', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ],
          phoneNo: [
            {required: true, message: '请输入联系电话', trigger: 'blur'}
            , {validator: validatePhone, trigger: 'blur'}
          ],
          typeCode: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ],
          industryCode: [
            {required: true, message: '请选择行业', trigger: 'change'}
          ],
          addr: [
            {required: true, message: '请输入地址', trigger: 'blur'}
          ],
          salesUserId: [
            {required: true, message: '请选择客户经理', trigger: 'change'}
          ],
          fpTitle: [
            {required: true, message: '请输入发票抬头', trigger: 'blur'}
          ],
          fpBankName: [
            {required: true, message: '请输入开户行', trigger: 'blur'}
          ],
          fpBankAccNo: [
            {required: true, message: '请输入银行账号', trigger: 'blur'}
          ],
          fpPhoneNo: [
            {required: true, message: '请输入开票电话', trigger: 'blur'}
          ],
          fpTaxNo: [
            {required: true, message: '请输入税号', trigger: 'blur'}
          ],
          fpAddr: [
            {required: true, message: '请输入开票地址', trigger: 'blur'}
          ],
        },
        //新增界面数据
        formValue: {},
        //销售下拉列表
        salesSlt: {
          result: {
            size: 0,
            list: []
          },
          keywords: "",
          pageNo: 1,
          pageSize: 10
        },
        dialogVisable: false
			}
		},
    mounted() {
      this.getCustomerStatusList();
      this.getCustomerTypeList();
      this.getCustomerIndustryList();
      this.getCustomerRegionList();
      this.initSalesList();
    },
		methods: {
      getCustomerStatusList() {
        this.getDicts("sys_customer_status").then(response => {
          this.statusList = response.data;
        });
      },
      getCustomerTypeList() {
        this.getDicts("sys_customer_type").then(response => {
          this.typeList = response.data;
        });
      },
      getCustomerIndustryList() {
        this.getDicts("sys_customer_industry").then(response => {
          this.industryList = response.data;
        });
      },
      getCustomerRegionList() {
        this.getDicts("sys_customer_region").then(response => {
          this.regionList = response.data;
        });
      },
			//新增
      addSubmit: function () {
        this.$refs.formValue.validate((valid) => {
          if (valid) {
             var params = (this.operation == 'add'? '_fk=u': "id=" + this.formValue.id)
              +(this.formValue.enterpriseName ? "&enterpriseName=" + this.formValue.enterpriseName : "")
              + (this.formValue.contacts ? "&contacts=" + this.formValue.contacts : "")
              + (this.formValue.phoneNo ? "&phoneNo=" + this.formValue.phoneNo : "")
              + (this.formValue.email ? "&email=" + this.formValue.email : "")
              + (this.formValue.contacts2 ? "&contacts2=" + this.formValue.contacts2 : "")
              + (this.formValue.phoneNo2 ? "&phoneNo2=" + this.formValue.phoneNo2 : "")
              + (this.formValue.email2 ? "&email2=" + this.formValue.email2 : "")
              + (this.formValue.tenantId ? "&tenantId=" + this.formValue.tenantId : "")
              + (this.formValue.statusCode ? "&statusCode=" + this.formValue.statusCode : "")
              + (this.formValue.typeCode ? "&typeCode=" + this.formValue.typeCode : "")
              + (this.formValue.industryCode ? "&industryCode=" + this.formValue.industryCode : "")
              + (this.formValue.addr ? "&addr=" + this.formValue.addr : "")
              + (this.formValue.fpTitle ? "&fpTitle=" + this.formValue.fpTitle : "")
              + (this.formValue.fpBankName ? "&fpBankName=" + this.formValue.fpBankName : "")
              + (this.formValue.fpBankAccNo ? "&fpBankAccNo=" + this.formValue.fpBankAccNo : "")
              + (this.formValue.fpPhoneNo ? "&fpPhoneNo=" + this.formValue.fpPhoneNo : "")
              + (this.formValue.fpTaxNo ? "&fpTaxNo=" + this.formValue.fpTaxNo : "")
              + (this.formValue.fpAddr ? "&fpAddr=" + this.formValue.fpAddr : "")
              + (this.formValue.salesUserId ? "&salesUserId=" + this.formValue.salesUserId : "")
              + (this.formValue.remark ? "&remark=" + this.formValue.remark : "");
            this.addLoading = true;
            if (this.operation == 'add') {
              addCustomer(params).then(res => {
                this.$message({type: "success", message: res.msg});
                this.$refs['formValue'].resetFields();
                this.dialogVisable = false;
                this.addLoading = false;
                this.$emit("success", 1);
              }).catch((err) => {
                this.addLoading = false;
              });
            } else if(this.operation == 'edit') {
              updateCustomer(params).then(res => {
                this.$message({type: "success", message: res.msg});
                this.$refs['formValue'].resetFields();
                this.dialogVisable = false;
                this.addLoading = false;
                this.$emit("success", 1);
              }).catch((err) => {
                this.addLoading = false;
              });
            }
          }
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
      dialogClose() {
        this.dialogVisable = false;
        this.$emit('dialogClose', false)
      }
		},
    watch:{
      isShow: {
        handler(newVal) {
            this.dialogVisable = newVal
        }
      },
      FormData: {
        handler(newVal) {
          if(newVal) {
            console.log(newVal)
            this.formValue = newVal
          }
        }
      }
    }

	}
</script>

<style>

</style>

