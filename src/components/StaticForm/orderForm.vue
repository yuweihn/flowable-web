<!-- 订单表单 -->
<template>
    <div v-loading="loading">
        <el-form label-width="90px" :model="FormData" :rules="rules" ref="FormData">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="标题" prop="title" v-if="setVisable('title')">
                     <el-input v-model="FormData.title" placeholder="请输入标题" size="small" :disabled="setDisable('title')"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="订单类型" prop="orderType" v-if="setVisable('orderType')">
                        <el-select v-model="FormData.orderType" clearable placeholder="请选择类型" size="small"
                            :disabled="setDisable('orderType')" style="width:100%">
                            <el-option v-for="dict in orderTypes" :key="dict.dictValue" :label="dict.dictLabel"
                                :value="dict.dictValue"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="选择售前" prop="preSalesId" v-if="setVisable('preSalesId')">
                        <el-select v-model="FormData.preSalesId" clearable placeholder="请选择" size="small"
                            :disabled="setDisable('preSalesId')" style="width:100%">
                            <el-option v-for="item in preSalesList" :key="item.userId" :label="item.userName"
                                :value="item.userId"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="业务类型" prop="bizType" v-if="setVisable('bizType')">
                        <el-select v-model="FormData.bizType" clearable placeholder="请选择" size="small"
                            :disabled="setDisable('bizType')" style="width: 100%">
                            <el-option v-for="dict in bizTypes" :key="dict.dictValue" :label="dict.dictLabel"
                                :value="dict.dictValue"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="setVisable('bizType')&&associatedOrderVisible? 8 : 0">
                    <el-form-item label="关联订单" prop="orderId" v-if="setVisable('bizType')&&associatedOrderVisible">
                        <el-select v-model="FormData.orderId" filterable remote
                            :remote-method="(query)=>remoteMethod(query,'order')" clearable placeholder="请选择"
                            size="small" :disabled="setDisable('bizType')" style="width:100%" >
                            <el-option v-for="item in associatedOrderList" :key="item.orderId" :label="item.title"
                                :value="item.orderId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="setVisable('bizType')&&associatedOrderVisible? 8 : 12">
                    <el-form-item label="关联客户" prop="customerNo" v-if="setVisable('customerNo')&&isStart && !bizDetail">
                        <el-select v-model="FormData.customerNo" filterable remote
                            :remote-method="(query)=>remoteMethod(query,'customer')" clearable placeholder="请选择"
                            @change="selectChange" @clear="clearCustomerInfo" size="small" :disabled="setDisable('customerNo')"  style="width:100%">
                            <el-option v-for="item in customerList" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关联客户" v-if="!isStart"  prop="customerNo" >
                      <el-input v-model="FormData.customerName" disabled size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="关联客户" v-if="bizDetail" prop="customerNo" >
                      <el-input v-model="FormData.customerName" disabled size="small"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="setVisable('bizType')&&associatedOrderVisible? 8 : 10" :offset="setVisable('bizType')&&associatedOrderVisible? 0: 2">
                    <el-form-item label="是否涉及非标产品" prop="involveNonStandard" label-width="140px" v-if="setVisable('involveNonStandard')">
                        <el-radio-group v-model="FormData.involveNonStandard" :disabled="setDisable('involveNonStandard')">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
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
            <el-form-item label="备注："  v-if="setVisable('remarks')" >
                <el-input type="textarea" v-model="FormData.remarks" size="small" :disabled="setDisable('remarks')"></el-input>
            </el-form-item>

            <!-- 标准产品table -->
            <div class="addRow" v-if="setVisable('standardProducts')">
                <div class="formTitle">服务内容-标准产品</div>
                <div class="el-icon-circle-plus-outline" @click="addRow(1)" v-show="btnVisable" v-if="!(setDisable('standardProducts'))"></div>
            </div>
            <el-table border show-summary :summary-method="getSummaries" style="width: 100%;" :data="FormData.portList"
                :header-cell-style="{'text-align':'center'}" class="table-fixed" v-if="setVisable('standardProducts')">
                <el-table-column width="160" v-if="setVisable('port_portNo')">
                    <template slot="header">
                        选择骨干网端口产品<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'portList.'+scope.$index+'.portNo'" :rules="rules.portNo">
                            <el-cascader :disabled="setDisable('port_portNo')" v-model="scope.row.portNo" :options="portProductList"></el-cascader>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column width="160" v-if="setVisable('port_siteAddr')">
                    <template slot="header">
                        站点地址<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'portList.'+scope.$index+'.siteAddr'" :rules="rules.siteAddr">
                            <el-input v-model="scope.row.siteAddr" placeholder="请输入站点地址" size="small"
                                :disabled="setDisable('port_siteAddr')"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column width="170" v-if="setVisable('port_bandwidth')">
                    <template slot="header">
                        带宽(Mbps)<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'portList.'+scope.$index+'.bandwidth'" :rules="rules.bandwidth">
                            <el-input v-model="scope.row.bandwidth" placeholder="请输入带宽(Mbps)" size="small"
                                :disabled="setDisable('port_bandwidth')"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="接入PoP" width="150" v-if="setVisable('port_popNo')">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.popNo" clearable placeholder="请选择" size="small"
                            :disabled="setDisable('port_popNo')">
                            <el-option v-for="dict in popList" :key="dict.dictValue" :label="dict.dictLabel"
                                :value="dict.dictValue"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="150" v-if="setVisable('port_quantity')">
                    <template slot="header">
                        数量(项)<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'portList.'+scope.$index+'.quantity'" :rules="rules.quantity">
                            <el-input v-model="scope.row.quantity" placeholder="请输入数量" size="small"
                                :disabled="setDisable('port_quantity')"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="oneTimeFee" v-if="setVisable('port_oneTimeFee')">
                    <template slot="header">
                        骨干网端口一次性费用<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'portList.'+scope.$index+'.oneTimeFee'" :rules="rules.oneTimeFee">
                            <el-input v-model="scope.row.oneTimeFee" placeholder="请输入骨干网端口一次性费用" size="small"
                                :disabled="setDisable('port_oneTimeFee')">
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="骨干网端口一次性费用管理价" width="190" prop="oneTimeMgtFee" v-if="setVisable('port_oneTimeMgtFee')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.oneTimeMgtFee" placeholder="请输入骨干网端口一次性费用管理价" size="small"
                            :disabled="setDisable('port_oneTimeMgtFee')">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="price" v-if="setVisable('port_price')">
                    <template slot="header">
                        骨干网端口销售价(元/月)<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'portList.'+scope.$index+'.price'" :rules="rules.price">
                            <el-input v-model="scope.row.price" placeholder="请输入骨干网端口销售价" size="small"
                                :disabled="setDisable('port_price')"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="期望交付日期" width="250" v-if="setVisable('port_expDeliveryDate')">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.expDeliveryDate" type="date" placeholder="选择日期"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" :disabled="setDisable('port_expDeliveryDate')">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="180" v-if="setVisable('port_remarks')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remarks" placeholder="请输入备注" size="small" :disabled="setDisable('port_remarks')">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100" v-if="setVisable('port_delete')">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="deleteRow(scope.row,1)" :disabled="setDisable('port_delete')">
                            移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align: right; padding-right: 20px;margin-top: 20px;" v-if="setVisable('standardProducts')" >
                <div class="el-icon-circle-plus-outline" @click="addRow(2)" v-show="btnVisable" v-if="!(setDisable('standardProducts'))"></div>
            </div>
            <el-table border show-summary :summary-method="getSummaries2" :data="FormData.deviceList"
                style="width: 100%;margin-top: 10px; margin-bottom: 20px;" :header-cell-style="{'text-align':'center'}"
                class="table-fixed" v-if="setVisable('standardProducts')">
                <el-table-column width="160" prop="name" v-if="setVisable('device_deviceNo')">
                    <template slot="header">
                        选择其他标准产品<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'deviceList.'+scope.$index+'.deviceNo'" :rules="rules.deviceNo">
                            <el-cascader :disabled="setDisable('device_deviceNo')" v-model="scope.row.deviceNo" :options="otherStardPro" ></el-cascader>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column width="140" v-if="setVisable('device_siteAddr')">
                    <template slot="header">
                        站点地址<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'deviceList.'+scope.$index+'.siteAddr'" :rules="rules.devSiteUrl">
                            <el-input v-model="scope.row.siteAddr" placeholder="请输入站点地址" size="small"
                                :disabled="setDisable('device_siteAddr')"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column width="150" prop="quantity" v-if="setVisable('device_quantity')">
                    <template slot="header">
                        数量(个)<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'deviceList.'+scope.$index+'.quantity'" :rules="rules.devAmount">
                            <el-input v-model="scope.row.quantity" placeholder="请输入数量" size="small"
                                :disabled="setDisable('device_quantity')"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="oneTimeFee" v-if="setVisable('device_oneTimeFee')">
                    <template slot="header">
                        其他标准产品一次性费用<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'deviceList.'+scope.$index+'.oneTimeFee'" :rules="rules.devOneTimeCost">
                            <el-input v-model="scope.row.oneTimeFee" placeholder="请输入其他标准产品一次性费用" size="small"
                                :disabled="setDisable('device_oneTimeFee')">
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="其他标准产品一次性费用管理价" width="210" prop="oneTimeMgtFee" v-if="setVisable('device_oneTimeMgtFee')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.oneTimeMgtFee" placeholder="请输入其他标准产品一次性费用管理价" size="small"
                            :disabled="setDisable('device_oneTimeMgtFee')">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column width="200" prop="price" v-if="setVisable('device_price')">
                    <template slot="header">
                        其他标准产品销售价格(元/月)<span class="head-required">*</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :prop="'deviceList.'+scope.$index+'.price'" :rules="rules.devSalesPrice">
                            <el-input v-model="scope.row.price" placeholder="请输入其他标准产品销售价格(元/月)" size="small"
                                :disabled="setDisable('device_price')">
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="其他标准产品管理单价(元/台/月)" width="220" prop="devManageUnitPrice" v-if="setVisable('device_devManageUnitPrice')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.devManageUnitPrice" placeholder="请输入其他标准产品管理单价(元/台/月)" disabled
                            size="small">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="其他标准产品管理价(元/月)" width="180" prop="devManagePrice"  v-if="setVisable('device_devManagePrice')">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.devManagePrice" disabled size="small">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="备注" width="160" v-if="setVisable('device_remarks')">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remarks" placeholder="请输入备注" size="small" :disabled="setDisable('device_remarks')">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100" v-if="setVisable('device_delete')">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="deleteRow(scope.row,2)" :disabled="setDisable('device_delete')">
                            移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="font-size: 14px; color: #ccc;line-height: 20px;" v-if="setVisable('standardProducts')">
                <div style="font-size: 14px;">合计销售利润率（标准产品）（%）</div>
                <div>0.00</div>
            </div>
            <!-- 非标产品 -->
            <div v-if="FormData.involveNonStandard">
                <div class="formTitle" v-if="setVisable('NonStandardProducts')">服务内容-非标产品</div>
                <el-form-item label="非标产品类型" prop="prdTypeList" label-width="250" v-if="setVisable('NonStandardProducts')">
                    <el-checkbox-group v-model="FormData.prdTypeList" :disabled="setDisable('NonStandardProducts')">
                        <el-checkbox v-for="(item,index) in tabList" :label="item.name" :key="index">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-tabs v-model="activeName" @tab-click="handleClick" v-if="setVisable('NonStandardProducts')">
                    <el-tab-pane v-for="(item,index) in tabList" :label="item.label" :name="item.name" :key="index">
                    </el-tab-pane>
                    <nonStandardProForm ref="child" :is_Show="isShow" :selected="selected" :formValue="formValue"
                        :taskFormValue="taskFormValue" :flowAuthSettingList="flowAuthSettingList" :isStart="isStart" :isDetail="isDetail">
                    </nonStandardProForm>
                </el-tabs>
            </div>
            <el-form-item label="是否涉及其他费用" prop="involveOtherFee" label-width="140px" v-if="setVisable('involveOtherFee')">
                <el-radio-group v-model="FormData.involveOtherFee" :disabled="setDisable('involveOtherFee')">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <div v-if="FormData.involveOtherFee">
                <div class="formTitle" v-if="setVisable('otherFeeDesc')|| setVisable('otherFee') || setVisable('otherFeePayType')">其他费用</div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="费用说明" prop="otherFeeDesc" v-if="setVisable('otherFeeDesc')">
                            <el-input v-model="FormData.otherFeeDesc" size="small" :disabled="setDisable('otherFeeDesc')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="费用金额" prop="otherFee" v-if="setVisable('otherFee')">
                            <el-input v-model="FormData.otherFee" size="small" :disabled="setDisable('otherFee')"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="支付方式" prop="otherFeePayType" v-if="setVisable('otherFeePayType')">
                            <el-select v-model="FormData.otherFeePayType" clearable placeholder="请选择" size="small"
                                :disabled="setDisable('otherFeePayType')">
                                <el-option v-for="dict in feepayTypes" :key="dict.dictValue" :label="dict.dictLabel"
                                    :value="dict.dictValue"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div class="formTitle" v-if="setVisable('currencyType')||setVisable('serviceDuration')||setVisable('totalContractAmount')">合计汇总</div>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="结算货币" prop="currencyType" v-if="setVisable('currencyType')">
                        <el-select v-model="FormData.currencyType" clearable placeholder="请选择" size="small"
                            :disabled="setDisable('currencyType')">
                            <el-option v-for="dict in currencyTypeList" :key="dict.dictValue" :label="dict.dictLabel"
                                :value="dict.dictValue"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="服务期(月)" prop="serviceDuration" v-if="setVisable('serviceDuration')">
                        <el-input v-model="FormData.serviceDuration" size="small" :disabled="setDisable('serviceDuration')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="总合同额" v-if="setVisable('totalContractAmount')">
                        <el-input disabled v-model="FormData.totalContractAmount" size="small">
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item v-if="btnVisable" label-width="0" style="text-align:center">
                <el-button type="primary" @click="submitForm('FormData')" v-if="btnHidden">提交</el-button>
                <el-button @click="resetForm('FormData')" v-if="btnHidden">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { getUserDropDownListByRoleKey } from "@/api/system/user";
    import { getCustomerList, getAssociatedOrderList } from "@/api/flowable/form";
    import { getProductPortOptions, queryProductDeviceOptions } from "@/api/system/product.js";
    import { definitionStart } from "@/api/flowable/definition";
    import nonStandardProForm from "@/components/StaticForm/nonStandardProForm";
    import { getSalesCustomerList } from "@/api/system/customer";
    export default {
        components: {
            nonStandardProForm
        },
        props: {
            formValue: {
                type: Object,
                default: () => { return {} }
            },
            taskFormValue: {
                type: Object,
                default: () => { return {} }
            },
            flowAuthSettingList: {
                type: Array,
                default: () => []
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
                default: '',
            },
             procDefId: {
                type: String,
                default: ""
            },
            bizDetail: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                loading: false,
                btnVisable: true,
                btnHidden: true,
                associatedOrderVisible: false, // 关联订单选项框
                isShow: 'first',
                selected: [],
                orderTypes: [], //订单类型
                bizTypes: [], //业务类型
                feepayTypes: [], //支付方式
                currencyTypeList: [], //结算货币
                preSalesList: [], // 售前
                customerList: [], // 客户
                associatedOrderList: [], //关联订单
                portProductList: [], //骨干网络端口产品
                otherStardPro: [],// 其他标准产品
                popList: [], //接入pop
                activeName: 'first',
                tabList: [
                    {
                        label: 'MPLS/IPSec',
                        name: 'first'
                    }, {
                        label: '专线',
                        name: 'second'
                    }, {
                        label: 'Internet',
                        name: 'third'
                    }, {
                        label: 'IDC',
                        name: 'fourth'
                    }, {
                        label: '服务',
                        name: 'five'
                    }, {
                        label: '集成',
                        name: 'six'
                    }
                ],
                searchParams: {
                    keywords: '',
                    pageNo: 1,
                    pageSize: 100
                },
                searchCustomer: {
                    keywords: '',
                    pageNo: 1,
                    pageSize: 100
                },
                FormData: {
                    title: '',
                    orderType: '',
                    bizType: '',
                    orderId: '',
                    customerNo: '',
                    customerContacts: '',
                    customerEmail: '',
                    customerPhoneNo: '',
                    preSalesId: '',
                    involveNonStandard: '', //是否涉及非标产品
                    remarks: '',
                    //标准产品
                    portList: [],
                    deviceList: [],
                    standard_tspm: null, //合计销售利润率(标准产品-totalSalesProfitMargin)
                    //非标准产品
                    mplsIpsecList: [],
                    specialLineList: [],
                    internetList: [],
                    idcList: [],
                    srvList: [],
                    integrationList: [],
                    involveOtherFee: '', //是否涉及其他费用
                    otherFeeDesc: '',
                    otherFee: '',
                    otherFeePayType: '',
                    currencyType: '',
                    serviceDuration: '',
                    totalContractAmount: '',
                    prdTypeList: [], //选中的非标产品类型
                    customerName: ''
                },

                //    表单验证
                rules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' },
                    ],
                    orderType: [
                        { required: true, message: '请选择订单类型', trigger: 'change' }
                    ],
                    bizType: [
                        { required: true, message: '请选择业务类型', trigger: 'change' }
                    ],
                    orderId: [
                        { required: true, message: '请选择关联订单', trigger: 'change' }
                    ],
                    customerNo: [
                        { required: true, message: '请选择关联客户', trigger: 'change' }
                    ],
                    customerEmail: [
                        {
                            type: "email",
                            message: "请输入正确的邮箱地址",
                            trigger: ["blur", "change"]
                        }
                    ],
                    customerPhoneNo: [
                        {
                            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                            message: "请输入正确的手机号码",
                            trigger: "blur"
                        }
                    ],
                    project: [
                        { required: true, message: '请选择项目', trigger: 'change' }
                    ],
                    preSalesId: [
                        { required: true, message: "请选择售前", trigger: 'change' }
                    ],
                    prdTypeList: [
                        { required: true, message: "请选择产品类型", trigger: 'blur' }
                    ],
                    involveNonStandard: [
                        { required: true, message: "请选择是否涉及非标产品", trigger: 'change' }
                    ],
                    involveOtherFee: [
                        { required: true, message: "请选择是否涉及其他费用", trigger: 'change' }
                    ],
                    otherFeeDesc: [
                        { required: true, message: "请输入费用说明", trigger: 'blur' }
                    ],
                    otherFee: [
                        { required: true, message: "请输入费用金额", trigger: 'blur' }
                    ],
                    otherFeePayType: [
                        { required: true, message: "请输入支付方式", trigger: 'blur' }
                    ],
                    currencyType: [
                        { required: true, message: "请输入结算货币", trigger: 'change' }
                    ],
                    serviceDuration: [
                        { required: true, message: "请输入服务期", trigger: 'blur' }
                    ],
                    // table1 表格验证
                    siteAddr: [
                        { required: true, message: "请输入站点地址", trigger: 'blur' }
                    ],
                    portNo: [
                        { required: true, message: "请选择骨干网端口产品", trigger: 'change' }
                    ],
                    bandwidth: [
                        { required: true, message: "请输入带宽", trigger: 'blur' }
                    ],
                    quantity: [
                        { required: true, message: "请输入数量", trigger: 'blur' }
                    ],
                    oneTimeFee: [
                        { required: true, message: "请输入骨干网端口一次性费用", trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: "请输入骨干网端口销售价", trigger: 'blur' }
                    ],
                    //table2 表格验证
                    deviceNo: [
                        { required: true, message: "请选择其他标准产品", trigger: 'change' }
                    ],
                    devSiteUrl: [
                        { required: true, message: "请输入站点地址", trigger: 'blur' }
                    ],
                    devAmount: [
                        { required: true, message: "请输入数量", trigger: 'blur' }
                    ],
                    devOneTimeCost: [
                        { required: true, message: "请输入其他标准产品一次性费用", trigger: 'blur' }
                    ],
                    devSalesPrice: [
                        { required: true, message: "请输入其他标准产品销售价格", trigger: 'blur' }
                    ]
                }

            }
        },
        watch: {
            "FormData.prdTypeList": {
                handler(newVal, oldVal) {
                    if(newVal) {
                        this.selected = newVal
                    }
                },
                deep: true,
                immediate: true
            },
            "FormData.bizType": {
                handler(newVal, oldVal) {
                    if (newVal == 1 || newVal == 2 || newVal == 3 || newVal == 4 || newVal == 5) {
                        this.associatedOrderVisible = true;
                    } else {
                        this.associatedOrderVisible = false;
                    }
                }
            },
            //流程详情数据
            formValue: {
                handler(newVal) {
                    if (JSON.stringify(newVal) !== '{}') {
                        this.FormData = newVal;
                        this.getProductPortOptions();
                        this.queryProductDeviceOptions();
                        if(!this.isStart) {
                          this.btnVisable = false
                        }
                    }
                },
                immediate: true,
                deep: true
            },
            //代办任务处理页面订单表单数据
            taskFormValue: {
                handler(newVal) {
                    if (JSON.stringify(newVal) !== '{}') {
                        this.FormData = newVal;
                        this.btnHidden = false;
                    }
                }
            },
            flowAuthSettingList: {
                handler(newVal) {
                    // console.log('权限列表',newVal)
                }
            },
            isDetail: {
                handler(newVal) {
                    if(newVal) {
                        this.btnVisable = false
                    }
                },
                deep: true,
                immediate: true
            },
        },
        created() {
            //获取订单类型
            this.getDicts("order_type").then(response => {
                this.orderTypes = response.data;
            });
            //获取业务类型
            this.getDicts("service_type").then(response => {
                this.bizTypes = response.data;
            });
            //获取支付方式
            this.getDicts("feepay_type").then(response => {
                this.feepayTypes = response.data;
            });
            //获取结算货币
            this.getDicts("currency_Type").then(response => {
                this.currencyTypeList = response.data;
            });
            //接入PoP
            this.getDicts("pop_list").then(response => {
                this.popList = response.data;
            });
        },
        mounted() {
            this.getProductPortOptions();
            this.queryProductDeviceOptions();
            this.getgetPreSalesList();
            this.getCustomerList();
            this.getAssociatedOrderList();
        },
        methods: {
            // 获取售前信息
            getgetPreSalesList() {
                getUserDropDownListByRoleKey({roleKey: 'pre_sale'}).then(response => {
                    this.preSalesList = response.data.list
                })
            },
            // 获取客户信息
            getCustomerList() {
                getSalesCustomerList(this.searchCustomer).then(response => {
                    this.customerList = response.data
                })
            },
            //获取关联订单数据
            getAssociatedOrderList() {
                getAssociatedOrderList(this.searchParams).then(response => {
                    this.associatedOrderList = response.data
                })
            },
           //获取骨干网络端口产品
           getProductPortOptions() {
              getProductPortOptions().then(res=> {
                res.data.forEach(item=> {
                    item.children.forEach(v=> {
                        delete v.children
                    })
                })
                this.portProductList = res.data;

                // 标准产品和其他标准产品的下拉选项的回显
                this.portProductList.forEach(i=> {
                    i.children.forEach(j=> {
                        this.FormData.portList.forEach(h=> {
                            if(j.value == h.portNo) {
                                h.portNo = [i.value,h.portNo]
                            }
                        })
                    })
                })
              })
           },
           //获取其他标准产品
           queryProductDeviceOptions() {
             queryProductDeviceOptions().then(res=> {
                res.data.forEach(item=> {
                    item.children.forEach(v=> {
                        delete v.children
                    })
                })
                this.otherStardPro = res.data;
                // 标准产品和其他标准产品的下拉选项的回显
                this.otherStardPro.forEach(i=> {
                    i.children.forEach(j=> {
                        this.FormData.deviceList.forEach(h=> {
                            if(j.value == h.deviceNo) {
                                h.deviceNo = [i.value,h.deviceNo]
                            }
                        })
                    })
               })

             })
           },
            // 选择客户触发change事件
            selectChange(val) {
                this.customerList.forEach(item => {
                    if (item.value == val) {
                        this.FormData.customerContacts = item.contacts;
                        this.FormData.customerEmail = item.email;
                        this.FormData.customerPhoneNo = item.phoneNo;
                        this.FormData.customerName = item.label;
                    }
                })
            },
            //  清除客户选项数据
            clearCustomerInfo() {
                this.FormData.customerContacts = '';
                this.FormData.customerEmail = '';
                this.FormData.customerPhoneNo = '';
            },
            // 新增标准产品表格行
            addRow(i) {
                if (i == 1) {
                    this.FormData.portList.push({
                        key: Math.random(),
                        portNo: '',
                        siteAddr: '',
                        bandwidth: '',
                        popNo: '',
                        quantity: '',
                        oneTimeFee: '',
                        oneTimeMgtFee: '',
                        price: '',
                        expDeliveryDate: '',
                        remarks: '',
                    })
                } else if (i == 2) {
                    this.FormData.deviceList.push({
                        key: Math.random(),
                        deviceNo: '',
                        siteAddr: '',
                        quantity: '',
                        oneTimeFee: '',
                        oneTimeMgtFee: '',
                        price: '',
                        devManageUnitPrice: '',
                        devManagePrice: 0.00,
                        remarks: '',
                    })
                }

            },
            // 删除标准产品表格行
            deleteRow(row, i) {
                if (i == 1) {
                    this.FormData.portList = this.FormData.portList.filter(item => {
                        return item.key != row.key
                    })
                } else if (i == 2) {
                    this.FormData.deviceList = this.FormData.deviceList.filter(item => {
                        return item.key != row.key
                    })
                }
            },
            // 提交
            submitForm(formName) {
                this.$nextTick(() => {
                    if (this.$refs.child !== undefined) {
                        this.FormData.mplsIpsecList = this.$refs.child.tableData.mplsIpsecList;
                        this.FormData.specialLineList = this.$refs.child.tableData.specialLineList;
                        this.FormData.internetList = this.$refs.child.tableData.internetList;
                        this.FormData.idcList = this.$refs.child.tableData.idcList;
                        this.FormData.srvList = this.$refs.child.tableData.srvList;
                        this.FormData.integrationList = this.$refs.child.tableData.integrationList;
                    }
                    this.loading = true;
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.FormData.portList.forEach(i=> {
                                i.portNo = i.portNo[1]
                            })
                            this.FormData.deviceList.forEach(i=> {
                                i.deviceNo = i.deviceNo[1]
                            })
                            definitionStart(this.$route.query.procDefId ? this.$route.query.procDefId : this.procDefId, this.FormData).then(response => {
                                this.loading = false;
                                this.msgSuccess("流程发起成功");
                                // 关闭当前标签页并返回上个页面
                                this.$store.dispatch("tagsView/delView", this.$route);
                                this.$router.push("/task/myProcess")
                            }).catch((err) => {
                              this.loading = false;
                            });
                        } else {
                            this.loading = false;
                            return false;
                        }
                    })
                })
            },
            //重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            handleClick(v) {
                this.isShow = v.name;
            },
            //table表格合计
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 5 || index === 6 || index === 7) {
                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] = '合计: ' + sums[index];
                        } else {
                            sums[index] = 'N/A';
                        }
                    }
                });
                return sums;
            },
            getSummaries2(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7) {
                        const values = data.map(item => Number(item[column.property]));
                        if (!values.every(value => isNaN(value))) {
                            sums[index] = values.reduce((prev, curr) => {
                                const value = Number(curr);
                                if (!isNaN(value)) {
                                    return prev + curr;
                                } else {
                                    return prev;
                                }
                            }, 0);
                            sums[index] = '合计: ' + sums[index];
                        } else {
                            sums[index] = 'N/A';
                        }
                    }
                });
                return sums;
            },
            remoteMethod(keywords, type) {
                if (type == 'order') {
                    this.searchParams.keywords = keywords;
                    this.getAssociatedOrderList();
                } else if (type == 'customer') {
                    this.searchCustomer.keywords = keywords;
                    this.getCustomerList();
                }
            },

            setVisable(name) {
              let isShow = true;
              if(this.flowAuthSettingList.length === 0 && this.detailType !== 'allProcess' && this.isStart !== true) {
                  return !isShow
               } else {
                    this.flowAuthSettingList.forEach(item=> {
                        if(name == item.widgetCode) {
                            isShow = item.viewable;
                        }
                    })
                    return isShow
               }
            },

            setDisable(name) {
              let isDisable = false;
              if(this.isDetail) {
                  return !isDisable
              } else if(this.isStart) {
                  return isDisable
              } else {
                this.flowAuthSettingList.forEach(item=> {
                    if(name == item.widgetCode) {
                        isDisable = item.editable;
                    }
                })
                return !isDisable
              }
            }
        },

    }
</script>
<style lang="scss" scoped>
    .formTitle {
        line-height: 40px;
        color: #31708f;
    }

    .addRow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 20px;
    }

    .table-fixed ::v-deep .el-table__fixed-right {
        height: 100% !important;
    }

    .table-fixed ::v-deep .el-table__fixed {
        height: 100% !important;
    }

    .table-fixed ::v-deep .el-form-item__content {
        margin-left: 0 !important;
    }

    .table-fixed ::v-deep .el-form-item {
        margin-bottom: 0 !important;
    }

    .head-required {
        color: red;
        font-size: 16px;
    }
    .el-icon-circle-plus-outline {
        cursor: pointer;
    }
</style>
