<!--合同申请单-->
<template>
	<div v-loading="loading">
		<el-form label-width="100px" :model="FormData" :rules="rules" ref="FormData">
			<el-form-item label="标题" prop="title" v-if="setVisable('title')">
				<el-input v-model="FormData.title" placeholder="请输入标题" size="small" :disabled="setDisable('title')">
				</el-input>
			</el-form-item>
			<el-row>
				<el-col :span="8">
					<el-form-item label="合同类型" prop="contractType" v-if="setVisable('contractType')">
						<el-select v-model="FormData.contractType" clearable placeholder="请选择" size="small"
							:disabled="setDisable('contractType')" style="width: 100%">
							<el-option v-for="dict in contractTypes" :key="dict.dictValue" :label="dict.dictLabel"
								:value="dict.dictValue"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="客户" prop="customerNo" v-if="setVisable('customerNo') && isStart&& !bizDetail">
						<el-select v-model="FormData.customerNo" filterable remote
							:remote-method="(query) => remoteMethod(query, 'customer')" clearable placeholder="请选择"
							@change="selectChange" @clear="clearCustomerInfo" size="small"
							:disabled="setDisable('customerNo')" style="width: 100%">
							<el-option v-for="item in customerList" :key="item.value" :label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="客户" v-if="setVisable('customerNo')&&!isStart" prop="customerNo">
						<el-input v-model="FormData.customerName" disabled></el-input>
					</el-form-item>
					<el-form-item label="客户" v-if="setVisable('customerNo')&& bizDetail" prop="customerNo">
						<el-input v-model="FormData.customerName" disabled size="small"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="乙方企业" prop="agsCompanyCode" v-if="setVisable('agsCompanyCode')">
						<el-select v-model="FormData.agsCompanyCode" clearable placeholder="请选择" size="small"
							:disabled="setDisable('agsCompanyCode')">
							<el-option v-for="item in agsCompanyList" :key="item.id" :label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="8">
					<el-form-item label="客户联系人" v-if="setVisable('customerNo')">
						<el-input disabled v-model="FormData.customerContacts" size="small"
							suffix-icon="el-icon-s-custom">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="邮箱" prop="customerEmail" v-if="setVisable('customerNo')">
						<el-input v-model="FormData.customerEmail" size="small" suffix-icon="el-icon-message" disabled>
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="电话" prop="customerPhoneNo" v-if="setVisable('customerNo')">
						<el-input v-model="FormData.customerPhoneNo" size="small" suffix-icon="el-icon-mobile-phone"
							disabled>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="授权签字人" prop="authSigner" v-if="setVisable('authSigner')">
						<el-input v-model="FormData.authSigner" placeholder="请输入授权签字人" size="small"
							:disabled="setDisable('authSigner')">
						</el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="联系电话" prop="agsPhoneNo" v-if="setVisable('agsPhoneNo')">
						<el-input v-model="FormData.agsPhoneNo" size="small" disabled>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
            <el-row>
				<el-col :span="12">
					<el-form-item label="关联订单" prop="orderList" v-if="setVisable('associatedOrderList')&& isStart&& !bizDetail">
						<el-select v-model="FormData.orderList" multiple
							style="width: 100%" filterable remote
							:remote-method="(query) => remoteMethod(query, 'order')" clearable placeholder="请选择"
							size="small" :disabled="setDisable('associatedOrderList')" value-key="orderId" @change="selectOrderChange">
							<el-option v-for="item in associatedOrderList" :key="item.orderId" :label="item.title"
								:value="item.orderId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="关联订单" v-if="setVisable('associatedOrderList')&&!isStart">
						<el-input v-model="FormData.associatedOrderName" disabled size="small"></el-input>
					</el-form-item>
                     <el-form-item label="关联订单" v-if="setVisable('associatedOrderList')&&bizDetail">
						<el-input v-model="FormData.associatedOrderName" disabled size="small"></el-input>
					</el-form-item>
				</el-col>
                <el-col :span="11">
					<el-form-item label="签订日期" prop="signDate" v-if="setVisable('signDate')">
						<el-date-picker v-model="FormData.signDate" type="date" placeholder="选择日期" format="yyyy-MM-dd"
							value-format="yyyy-MM-dd" size="small" :disabled="setDisable('signDate')">
						</el-date-picker>
					</el-form-item>
				</el-col>
            </el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="开始日期" prop="contractStartDate"
						v-if="setVisable('contractStartDate')">
						<el-date-picker v-model="FormData.contractStartDate" type="date" placeholder="选择日期"
							format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small"
							:disabled="setDisable('contractStartDate')">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="结束日期" prop="contractEndDate"
						v-if="setVisable('contractEndDate')">
						<el-date-picker v-model="FormData.contractEndDate" type="date" placeholder="选择日期"
							format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small"
							:disabled="setDisable('contractEndDate')">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-form-item label="备注：" v-if="setVisable('remarks')">
				<el-input type="textarea" v-model="FormData.remarks" size="small" :disabled="setDisable('remarks')">
				</el-input>
			</el-form-item>
			<div class="formTitle" v-if="setVisable('fpTitle')">客户开票信息</div>
			<el-form-item label="客户开票抬头" prop="fpTitle" v-if="setVisable('fpTitle')">
				<el-input v-model="FormData.fpTitle" placeholder="请输入客户开票抬头" size="small"
					:disabled="setDisable('fpTitle')">
				</el-input>
			</el-form-item>
			<el-form-item label="开户行" prop="fpBankName" v-if="setVisable('fpBankName')">
				<el-input v-model="FormData.fpBankName" placeholder="请输入开户行" size="small"
					:disabled="setDisable('fpBankName')">
				</el-input>
			</el-form-item>
			<el-form-item label="税号" prop="fpTaxNo" v-if="setVisable('fpTaxNo')">
				<el-input v-model="FormData.fpTaxNo" placeholder="请输入税号" size="small" :disabled="setDisable('fpTaxNo')">
				</el-input>
			</el-form-item>
			<el-form-item label="银行账号" prop="fpBankAccNo" v-if="setVisable('fpBankAccNo')">
				<el-input v-model="FormData.fpBankAccNo" placeholder="请输入银行账号" size="small"
					:disabled="setDisable('fpBankAccNo')">
				</el-input>
			</el-form-item>
			<el-form-item label="开票地址" prop="fpAddr" v-if="setVisable('fpAddr')">
				<el-input v-model="FormData.fpAddr" placeholder="请输入开票地址" size="small" :disabled="setDisable('fpAddr')">
				</el-input>
			</el-form-item>
			<el-form-item label="开票电话" prop="fpPhoneNo" v-if="setVisable('fpPhoneNo')">
				<el-input v-model="FormData.fpPhoneNo" placeholder="请输入开票电话" size="small"
					:disabled="setDisable('fpPhoneNo')">
				</el-input>
			</el-form-item>
			<el-form-item label="合同附件" v-if="setVisable('contractAttaches')">
				<el-upload class="upload-demo" :action="uploadUrl" :on-preview="handlePreview"
					:on-remove="handleRemove1" :before-remove="beforeRemove" :on-success="uploadSuccess1" multiple
					:file-list="FormData.contractAttaches" :disabled="setDisable('contractAttaches')">
					<el-button size="small" type="primary" :disabled="setDisable('contractAttaches')">点击上传</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item label="订单附件" v-if="setVisable('orderAttaches')">
				<el-upload class="upload-demo" :action="uploadUrl" :on-preview="handlePreview"
					:on-remove="handleRemove2" :before-remove="beforeRemove" :on-success="uploadSuccess2" multiple
					:file-list="FormData.orderAttaches" :disabled="setDisable('orderAttaches')">
					<el-button size="small" type="primary" :disabled="setDisable('orderAttaches')">点击上传</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item label="补充协议" v-if="setVisable('suppleAgreement')">
				<el-input type="textarea" v-model="FormData.suppleAgreement" size="small"
					:disabled="setDisable('suppleAgreement')"></el-input>
			</el-form-item>
			<el-form-item v-if="btnVisable">
				<el-button v-if="btnHidden" @click="submitForm('FormData')" type="primary">提交</el-button>
				<el-button @click="resetForm('FormData')" v-if="btnHidden">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { getCustomerList, getAgsCompanyDropDownList, getUnboundContractOrderDropDownList} from "@/api/flowable/form";
	import { definitionStart } from "@/api/flowable/definition";
	import { getSalesCustomerList } from "@/api/system/customer";
	export default {
		props: {
			formValue: {
				type: Object,
				default: () => {
					return {};
				},
			},
			taskFormValue: {
				type: Object,
				default: () => {
					return {};
				},
			},
			flowAuthSettingList: {
				type: Array,
				default: () => [],
			},
			isStart: {
				type: Boolean,
				default: true,
			},
			isDetail: {
				type: Boolean,
				default: true,
			},
			detailType: {
				type: String,
				default: "",
			},
			procDefId: {
				type: String,
				default: "",
			},
			bizDetail: {
                type: Boolean,
                default: false,
            },
		},
		data() {
			return {
				loading: false,
				readOnly: false,
				btnVisable: true,
				btnHidden: true,
				contractTypes: [], //合同类型
				customerList: [], //客户
				agsCompanyList: [], //乙方企业列表
				associatedOrderList: [], //关联订单
				uploadUrl: process.env.VUE_APP_BASE_API + "/file/upload", //上传文件地址
				//表单数据
				FormData: {
					title: "",
					contractType: "",
					customerNo: "",
					customerContacts: "",
					customerEmail: "",
					customerPhoneNo: "",
					agsCompanyCode: "",
					authSigner: "",
					agsPhoneNo: "400-100-1730",
					orderList: [],
					signDate: "",
					contractStartDate: "",
					contractEndDate: "",
					remarks: "",
					fpTitle: "",
					fpBankName: "",
					fpTaxNo: "",
					fpBankAccNo: "",
					fpAddr: "",
					fpPhoneNo: "",
					contractAttaches: [], //合同附件
					orderAttaches: [], //订单附件
					suppleAgreement: "",
					customerName: "", //客户名称
					associatedOrderName: "", //关联订单名称
				},
				searchParams: {
					customerNo: "",
					title: "",
					pageNo: 1,
					pageSize: 10000,
				},
				searchCustomer: {
					keywords: "",
					pageNo: 1,
					pageSize: 100,
				},
				//验证规则
				rules: {
					title: [{
						required: true,
						message: "请输入标题",
						trigger: "blur"
					}],
					contractType: [{
						required: true,
						message: "请选择合同类型",
						trigger: "change"
					}, ],
					customerNo: [{
						required: true,
						message: "请选择客户",
						trigger: "change"
					}, ],
					agsCompanyCode: [{
						required: true,
						message: "请选择乙方抬头",
						trigger: "change"
					}, ],
					authSigner: [{
						required: true,
						message: "请输入授权签字人",
						trigger: "blur"
					}, ],
					orderList: [{
						required: true,
						message: "请选择关联订单",
						trigger: "change"
					}, ],
					signDate: [{
						required: true,
						message: "请选择日期",
						trigger: "change"
					}, ],
					contractStartDate: [{
						required: true,
						message: "请选择日期",
						trigger: "change"
					}, ],
					contractEndDate: [{
						required: true,
						message: "请选择日期",
						trigger: "change"
					}, ],
				},
			};
		},
		watch: {
			//流程详情数据
			formValue: {
				handler(newVal, oldVal) {
					if (JSON.stringify(newVal) !== "{}") {
						this.FormData = newVal;
					    let orderName =  "";
						this.FormData.orderList.forEach(i=> {
							if(Object.keys(i)[0] == 'orderId') {
								this.FormData.orderList = [];
							}
							if(i.relationTitle) {
								orderName += i.relationTitle +',';
								this.FormData.associatedOrderName = orderName
							}
						})
						this.readOnly = true;
						if (!this.isStart) {
							this.btnVisable = false;
						}
						this.getUnboundContractOrderDropDownList({
							customerNo: this.FormData.customerNo,
						});
					}
				},
				immediate: true,
                deep: true
			},
			//待办任务处理页面表单数据
			taskFormValue: {
				handler(newVal) {
					if (JSON.stringify(newVal) !== "{}") {
						this.FormData = newVal;
						this.btnHidden = false;
						this.getUnboundContractOrderDropDownList({
							customerNo: this.FormData.customerNo,
						});
					}
				},
			},
			//权限配置列表
			flowAuthSettingList: {
				handler(newVal) {
					// console.log("权限列表", newVal);
				},
			},
			isDetail: {
				handler(newVal) {
					if (newVal) {
						this.btnVisable = false;
					}
				},
				deep: true,
				immediate: true,
			},
		},
		created() {
			//获取合同类型
			this.getDicts("contract_type").then((response) => {
				this.contractTypes = response.data;
			});
		},
		mounted() {
			this.getCustomerList();
			this.getAgsCompanyList();
		},
		methods: {
			//指定客户未绑定合同的订单下拉列表
			getUnboundContractOrderDropDownList(data) {
				getUnboundContractOrderDropDownList(data).then((response) => {
					this.associatedOrderList = response.data;
				});
			},
			// 获取客户信息
			getCustomerList() {
				getSalesCustomerList(this.searchCustomer).then((response) => {
					this.customerList = response.data;
				});
			},
			//  清除客户选项数据
			clearCustomerInfo() {
				this.FormData.customerContacts = "";
				this.FormData.customerEmail = "";
				this.FormData.customerPhoneNo = "";
			},
			// 选择客户触发change事件
			selectChange(val) {
				this.customerList.forEach((item) => {
					if (item.value == val) {
						this.FormData.customerContacts = item.contacts;
						this.FormData.customerEmail = item.email;
						this.FormData.customerPhoneNo = item.phoneNo;
						this.FormData.customerName = item.label;
					}
				});
				this.searchParams.customerNo = val;
				this.getUnboundContractOrderDropDownList({
					customerNo: val
				});
			},
			// 选择关联订单触发事件
			selectOrderChange(val) {
				this.FormData.associatedOrderName = "";
				this.associatedOrderList.forEach(i=> {
					val.forEach(v=> {
						if(i.orderId == v) {
                          this.FormData.associatedOrderName +=  i.title+','
						}
					})
				})
			},
			remoteMethod(keywords, type) {
				if (type == "order") {
					this.searchParams.title = keywords;
					this.getUnboundContractOrderDropDownList(this.searchParams);
				} else if (type == "customer") {
					this.searchCustomer.keywords = keywords;
					this.getCustomerList();
				}
			},
			//获取乙方企业下拉列表
			getAgsCompanyList() {
				getAgsCompanyDropDownList().then((response) => {
					this.agsCompanyList = response.data;
				});
			},
			uploadSuccess1(res, file, fileList) {
				this.FormData.contractAttaches.push({
					name: file.name,
					url: file.response.data.url2,
					previewUrl: file.response.data.url,
					fileName: file.name,
				});
			},
			uploadSuccess2(res, file, fileList) {
				this.FormData.orderAttaches.push({
					name: file.name,
					url: file.response.data.url2,
					previewUrl: file.response.data.url,
					fileName: file.name,
				});
			},
			handleRemove1(file, fileList) {
				this.FormData.contractAttaches.splice(
					this.FormData.contractAttaches.findIndex(
						(item) => item.name == file.name
					),
					1
				);
			},
			handleRemove2(file, fileList) {
				this.FormData.orderAttaches.splice(
					this.FormData.orderAttaches.findIndex((item) => item.name == file.name),
					1
				);
			},
			handlePreview(file) {
				window.open(file.previewUrl, "_blank");
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${file.name}？`);
			},
			// 提交
			submitForm(formName) {
				let objString = JSON.stringify(this.FormData);
				let queryParams = JSON.parse(objString);
				queryParams.orderList = queryParams.orderList.map((item) => ({
				   orderId: item,
				}));
				this.loading = true;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						definitionStart(
								this.$route.query.procDefId ?
								this.$route.query.procDefId :
								this.procDefId,
								queryParams
							)
							.then((response) => {
								this.loading = false;
								this.msgSuccess("流程发起成功");
								// 关闭当前标签页并返回上个页面
								this.$store.dispatch("tagsView/delView", this.$route);
								this.$router.push("/task/myProcess")
							})
							.catch((err) => {
								this.loading = false;
							});
					} else {
						this.loading = false;
						return false;
					}
				});
			},
			//重置表单
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},

			//设置表单权限
			setVisable(name) {
				let isShow = true;
				if (
					this.flowAuthSettingList.length === 0 &&
					this.detailType !== "allProcess" &&
					this.isStart !== true
				) {
					return !isShow;
				} else {
					this.flowAuthSettingList.forEach((item) => {
						if (name == item.widgetCode) {
							isShow = item.viewable;
						}
					});
					return isShow;
				}
			},

			setDisable(name) {
				let isDisable = false;
				if (this.isDetail) {
					return !isDisable;
				} else if (this.isStart) {
					return isDisable;
				} else {
					this.flowAuthSettingList.forEach((item) => {
						if (name == item.widgetCode) {
							isDisable = item.editable;
						}
					});
					return !isDisable;
				}
			},
		},
	};
</script>
<style scoped lang="scss">
	.formTitle {
		line-height: 40px;
		color: #31708f;
	}
</style>
