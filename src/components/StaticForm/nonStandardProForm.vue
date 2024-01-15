<!-- 非标产品表单 -->
<template>
   <div>
      <el-form :model="tableData" :rules="rules" ref="tableData">
         <!-- MPLS/IPSec -->
         <div v-if="is_Show=='first'&&selected.includes('first')">
            <div class="addRow">
               <div class="el-icon-circle-plus-outline" @click="addRow(1)" v-if="!(setDisable('NonStandardProducts'))"></div>
            </div>
            <el-table border show-summary :summary-method="getSummaries" style="width: 100%;"
               :data="tableData.mplsIpsecList" :header-cell-style="{'text-align': 'center'}" class="table-fixed">
               <el-table-column width="160" v-if="setVisable('MPLS_prodNo')">
                  <template slot="header">
                     关联产品<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'mplsIpsecList.'+scope.$index+'.prodNo'"
                        :rules="{ required: true, message: '请选择关联产品', trigger: 'change' }">
                        <el-select v-model="scope.row.prodNo" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('MPLS_prodNo')">
                           <el-option v-for="dict in MplsIpsecPro_list" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="160" v-if="setVisable('MPLS_isp')">
                  <template slot="header">
                     运营商<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'mplsIpsecList.'+scope.$index+'.isp'"
                        :rules="{ required: true, message: '请选择运营商', trigger: 'change' }">
                        <el-select v-model="scope.row.isp" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('MPLS_isp')">
                           <el-option v-for="dict in operatorList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="170" v-if="setVisable('MPLS_addr')">
                  <template slot="header">
                     接入地址<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'mplsIpsecList.'+scope.$index+'.addr'"
                        :rules="{ required: true, message: '请输入接入地址', trigger: 'blur' }">
                        <el-input v-model="scope.row.addr" placeholder="请输入接入地址" size="small" :disabled="setDisable('MPLS_addr')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="150" v-if="setVisable('MPLS_popNo')">
                  <template slot="header">
                     接入PoP<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'mplsIpsecList.'+scope.$index+'.popNo'" :rules="rules.popNo">
                        <el-select v-model="scope.row.popNo" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('MPLS_popNo')">
                           <el-option v-for="dict in popList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" v-if="setVisable('MPLS_bandwidth')">
                  <template slot="header">
                     带宽(Mbps)<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'mplsIpsecList.'+scope.$index+'.bandwidth'" :rules="rules.bandwidth">
                        <el-input v-model="scope.row.bandwidth" placeholder="请输入带宽（Mbps)" size="small"
                           :disabled="setDisable('MPLS_bandwidth')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column label="VPN销售单价(元/项/月)" width="190" prop="unitPrice" v-if="setVisable('MPLS_unitPrice')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.unitPrice" placeholder="请输入VPN销售单价" size="small" :disabled="setDisable('MPLS_unitPrice')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="quantity" v-if="setVisable('MPLS_quantity')">
                  <template slot="header">
                     数量（项）<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'mplsIpsecList.'+scope.$index+'.quantity'" :rules="rules.quantity">
                        <el-input v-model="scope.row.quantity" placeholder="请输入数量（项）" size="small" :disabled="setDisable('MPLS_quantity')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="190" prop="oneTimeFee" v-if="setVisable('MPLS_oneTimeFee')">
                  <template slot="header">
                     VPN一次性费用<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'mplsIpsecList.'+scope.$index+'.oneTimeFee'" :rules="rules.oneTimeFee">
                        <el-input v-model="scope.row.oneTimeFee" placeholder="请输入VPN一次性费用" size="small"
                           :disabled="setDisable('MPLS_oneTimeFee')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column label="VPN一次性费用管理价" width="190" prop="oneTimeMgtFee" v-if="setVisable('MPLS_oneTimeMgtFee')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.oneTimeMgtFee" placeholder="请输入VPN一次性费用管理价" size="small"
                        :disabled="setDisable('MPLS_oneTimeMgtFee')"></el-input>
                  </template>
               </el-table-column>
               <el-table-column label="VPN销售价(元/月）" width="190" prop="salesPrice" v-if="setVisable('MPLS_salesPrice')">
                  <template slot-scope="scope">
                     <el-input disabled v-model="scope.row.salesPrice" value="0.00" size="small">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column label="交付截至日期" width="250" v-if="setVisable('MPLS_deliveryDate')">
                  <template slot-scope="scope">
                     <el-date-picker v-model="scope.row.deliveryDate" type="date" placeholder="选择日期"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" :disabled="setDisable('MPLS_deliveryDate')">
                     </el-date-picker>
                  </template>
               </el-table-column>
               <el-table-column label="备注" width="240" v-if="setVisable('MPLS_remarks')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.remarks" placeholder="请输入备注" size="small" :disabled="setDisable('MPLS_remarks')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column label="采购备注信息" width="200" v-if="setVisable('MPLS_purchaseRemarks')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.purchaseRemarks" placeholder="请输入备注" size="small"
                        :disabled="setDisable('MPLS_purchaseRemarks')"></el-input>
                  </template>
               </el-table-column>
               <el-table-column fixed="right" label="操作" width="100" v-if="setVisable('MPLS_delete')">
                  <template slot-scope="scope">
                     <el-button type="text" size="small" @click="deleteRow(scope.row,1)" :disabled="setDisable('MPLS_delete')">
                        移除
                     </el-button>
                  </template>
               </el-table-column>
            </el-table>
         </div>
         <div class="mt" v-if="is_Show=='first'">
            <div style="font-size: 12px;margin-bottom: 10px;">合计销售利润率(MPLS/IPSec)(%)</div>
            <div>
               <el-input disabled value="0.00" size="small"></el-input>
            </div>
         </div>
         <!-- 专线 -->
         <div v-if="is_Show=='second'&&selected.includes('second')">
            <div class="addRow">
               <div class="el-icon-circle-plus-outline" @click="addRow(2)" v-if="!(setDisable('NonStandardProducts'))"></div>
            </div>
            <el-table border show-summary :summary-method="getSummaries" style="width: 100%;"
               :data="tableData.specialLineList" :header-cell-style="{'text-align':'center'}" class="table-fixed">
               <el-table-column width="160" v-if="setVisable('SL_prodNo')">
                  <template slot="header">
                     关联产品<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'specialLineList.'+scope.$index+'.prodNo'" :rules="rules.s_prodNo">
                        <el-select v-model="scope.row.prodNo" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('SL_prodNo')">
                           <el-option v-for="dict in speialLinePro_list" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="160" v-if="setVisable('SL_isp')">
                  <template slot="header">
                     运营商<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'specialLineList.'+scope.$index+'.isp'" :rules="rules.s_isp">
                        <el-select v-model="scope.row.isp" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('SL_isp')">
                           <el-option v-for="dict in operatorList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="170" v-if="setVisable('SL_aAddr')">
                  <template slot="header">
                     A端地址<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'specialLineList.'+scope.$index+'.aAddr'" :rules="rules.aAddr">
                        <el-input v-model="scope.row.aAddr" placeholder="请输入A端地址" size="small" :disabled="setDisable('SL_aAddr')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="150" v-if="setVisable('SL_aPortType')">
                  <template slot="header">
                     A端端口类型<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'specialLineList.'+scope.$index+'.aPortType'" :rules="rules.aPortType">
                        <el-select v-model="scope.row.aPortType" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('SL_aPortType')">
                           <el-option v-for="dict in aPortTypeList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" v-if="setVisable('SL_zAddr')">
                  <template slot="header">
                     Z端地址<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'specialLineList.'+scope.$index+'.zAddr'" :rules="rules.zAddr">
                        <el-input v-model="scope.row.zAddr" placeholder="请输入Z端地址" size="small" :disabled="setDisable('SL_zAddr')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="150" v-if="setVisable('SL_zPortType')">
                  <template slot="header">
                     Z端端口类型<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'specialLineList.'+scope.$index+'.zPortType'" :rules="rules.zPortType">
                        <el-select v-model="scope.row.zPortType" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('SL_zPortType')">
                           <el-option v-for="dict in zPortTypeList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="bandwidth" v-if="setVisable('SL_bandwidth')">
                  <template slot="header">
                     带宽(Mbps)<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'specialLineList.'+scope.$index+'.bandwidth'" :rules="rules.s_bandwidth">
                        <el-input v-model="scope.row.bandwidth" placeholder="请输入带宽(Mbps)" size="small"
                           :disabled="setDisable('SL_bandwidth')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column label="专线销售单价（元/项/月）" width="190" prop="unitPrice" v-if="setVisable('SL_unitPrice')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.unitPrice" placeholder="请输入专线销售单价" size="small" :disabled="setDisable('SL_unitPrice')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="quantity" v-if="setVisable('SL_quantity')">
                  <template slot="header">
                     专线数量<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'specialLineList.'+scope.$index+'.quantity'" :rules="rules.s_quantity">
                        <el-input v-model="scope.row.quantity" placeholder="请输入专线数量" size="small" :disabled="setDisable('SL_quantity')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="oneTimeFee" v-if="setVisable('SL_oneTimeFee')" >
                  <template slot="header">
                     专线一次性费用<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'specialLineList.'+scope.$index+'.oneTimeFee'" :rules="rules.s_oneTimeFee">
                        <el-input v-model="scope.row.oneTimeFee" placeholder="请输专线一次性费用" size="small"
                           :disabled="setDisable('SL_oneTimeFee')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column label="专线一次性费用管理价" width="190" prop="oneTimeMgtFee" v-if="setVisable('SL_oneTimeMgtFee')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.oneTimeMgtFee" placeholder="请输入专线一次性费用管理价" size="small"
                        :disabled="setDisable('SL_oneTimeMgtFee')"></el-input>
                  </template>
               </el-table-column>
               <el-table-column label="专线销售价（元/月）" width="250" prop="salesPrice" v-if="setVisable('SL_salesPrice')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.salesPrice" placeholder="请输入专线销售价" size="small" :disabled="setDisable('SL_salesPrice')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column label="交付截至日期" width="250" v-if="setVisable('SL_deliveryDate')">
                  <template slot-scope="scope">
                     <el-date-picker v-model="scope.row.deliveryDate" type="date" placeholder="选择日期"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" :disabled="setDisable('SL_deliveryDate')">
                     </el-date-picker>
                  </template>
               </el-table-column>
               <el-table-column label="备注" width="240" v-if="setVisable('SL_remarks')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.remarks" placeholder="请输入备注" size="small" :disabled="setDisable('SL_remarks')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column fixed="right" label="操作" width="100" v-if="setVisable('SL_delete')">
                  <template slot-scope="scope">
                     <el-button type="text" size="small" @click="deleteRow(scope.row,2)" :disabled="setDisable('SL_delete')">
                        移除
                     </el-button>
                  </template>
               </el-table-column>
            </el-table>
         </div>
         <div class="mt" v-if="is_Show=='second'">
            <div style=" font-size: 12px;margin-bottom: 10px;">合计销售利润率(专线)(%)</div>
            <div>
               <el-input disabled value="0.00" size="small"></el-input>
            </div>
         </div>
         <!-- Internet -->
         <div v-if="is_Show=='third'&&selected.includes('third')">
            <div class="addRow">
               <div class="el-icon-circle-plus-outline" @click="addRow(3)" v-if="!(setDisable('NonStandardProducts'))"></div>
            </div>
            <el-table border show-summary :summary-method="getSummaries" style="width: 100%;"
               :data="tableData.internetList" :header-cell-style="{'text-align':'center'}" class="table-fixed">
               <el-table-column width="160" v-if="setVisable('internet_prodNo')">
                  <template slot="header">
                     关联产品<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'internetList.'+scope.$index+'.prodNo'" :rules="rules.i_prodNo">
                        <el-select v-model="scope.row.prodNo" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('internet_prodNo')">
                           <el-option v-for="dict in InternetPro_list" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="160" v-if="setVisable('internet_isp')">
                  <template slot="header">
                     运营商<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'internetList.'+scope.$index+'.isp'" :rules="rules.i_isp">
                        <el-select v-model="scope.row.isp" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('internet_isp')">
                           <el-option v-for="dict in operatorList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="170" v-if="setVisable('internet_addr')">
                  <template slot="header">
                     站点地址<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'internetList.'+scope.$index+'.addr'" :rules="rules.i_addr">
                        <el-input v-model="scope.row.addr" placeholder="请输入站点地址" size="small" :disabled="setDisable('internet_addr')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="150"  v-if="setVisable('internet_portType')">
                  <template slot="header">
                     端口类型<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'internetList.'+scope.$index+'.portType'" :rules="rules.i_portType">
                        <el-select v-model="scope.row.portType" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('internet_portType')">
                           <el-option v-for="dict in portTypeList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="bandwidth" v-if="setVisable('internet_bandwidth')">
                  <template slot="header">
                     带宽(Mbps)<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'internetList.'+scope.$index+'.bandwidth'" :rules="rules.i_bandwidth">
                        <el-input v-model="scope.row.bandwidth" placeholder="请输入带宽(Mbps)" size="small"
                           :disabled="setDisable('internet_bandwidth')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="ipCount" v-if="setVisable('internet_ipCount')">
                  <template slot="header">
                     IP数量<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'internetList.'+scope.$index+'.ipCount'" :rules="rules.ipCount">
                        <el-input v-model="scope.row.ipCount" placeholder="请输入IP数量" size="small" :disabled="setDisable('internet_ipCount')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" v-if="setVisable('internet_upDownSymmetry')" >
                  <template slot="header">
                     上下行对称<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'internetList.'+scope.$index+'.upDownSymmetry'" :rules="rules.upDownSymmetry">
                        <el-select v-model="scope.row.upDownSymmetry" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('internet_upDownSymmetry')">
                           <el-option v-for="dict in upDownSymmetry" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="quantity" v-if="setVisable('internet_quantity')">
                  <template slot="header">
                     数量<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'internetList.'+scope.$index+'.quantity'" :rules="rules.i_quantity">
                        <el-input v-model="scope.row.quantity" placeholder="请输入数量" size="small" :disabled="setDisable('internet_quantity')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="220" prop="unitPrice" v-if="setVisable('internet_unitPrice')">
                  <template slot="header">
                     Internet 销售单价（元/项/月）<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'internetList.'+scope.$index+'.unitPrice'" :rules="rules.i_unitPrice">
                        <el-input v-model="scope.row.unitPrice" placeholder="请输入Internet 销售单价" size="small"
                           :disabled="setDisable('internet_unitPrice')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column label="Internet 一次性费用" width="190" prop="oneTimeFee" v-if="setVisable('internet_oneTimeFee')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.oneTimeFee" placeholder="Internet 一次性费用" size="small"
                        :disabled="setDisable('internet_oneTimeFee')"></el-input>
                  </template>
               </el-table-column>
               <el-table-column label="Internet 一次性费用管理价" width="250" prop="oneTimeMgtFee" v-if="setVisable('internet_oneTimeMgtFee')" >
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.oneTimeMgtFee" placeholder="请输入Internet 一次性费用管理价" size="small"
                        :disabled="setDisable('internet_oneTimeMgtFee')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column label="Internet 销售价（元/月）" width="250" prop="salesPrice" v-if="setVisable('internet_salesPrice')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.salesPrice" placeholder="请输入Internet 销售价（元/月）" size="small"
                        :disabled="setDisable('internet_salesPrice')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column label="交付截至日期" width="250" v-if="setVisable('internet_deliveryDate')">
                  <template slot-scope="scope">
                     <el-date-picker v-model="scope.row.deliveryDate" type="date" placeholder="选择日期"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" :disabled="setDisable('internet_deliveryDate')">
                     </el-date-picker>
                  </template>
               </el-table-column>
               <el-table-column label="备注" width="240" v-if="setVisable('internet_remarks')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.remarks" placeholder="请输入备注" size="small" :disabled="setDisable('internet_remarks')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column fixed="right" label="操作" width="100" v-if="setVisable('internet_delete')">
                  <template slot-scope="scope">
                     <el-button type="text" size="small" @click="deleteRow(scope.row,3)" :disabled="setDisable('internet_delete')">
                        移除
                     </el-button>
                  </template>
               </el-table-column>
            </el-table>
         </div>
         <div class="mt" v-if="is_Show=='third'">
            <div style="font-size: 12px;margin-bottom: 10px;">合计销售利润率(internet)(%)</div>
            <div>
               <el-input disabled value="0.00" size="small"></el-input>
            </div>
         </div>
         <!-- IDC -->
         <div v-if="is_Show=='fourth'&&selected.includes('fourth')">
            <div class="addRow">
               <div class="el-icon-circle-plus-outline" @click="addRow(4)" v-if="!(setDisable('NonStandardProducts'))"></div>
            </div>
            <el-table border show-summary :summary-method="getSummaries" style="width: 100%;" :data="tableData.idcList"
               :header-cell-style="{'text-align':'center'}" class="table-fixed">
               <el-table-column width="160" v-if="setVisable('IDC_prodNo')">
                  <template slot="header">
                     关联产品<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.prodNo'" :rules="rules.idc_prodNo">
                        <el-select v-model="scope.row.prodNo" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('IDC_prodNo')">
                           <el-option v-for="dict in IDCPro_list" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="160" v-if="setVisable('IDC_roomNo')">
                  <template slot="header">
                     机房名称<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.roomNo'" :rules="rules.roomNo">
                        <el-select v-model="scope.row.roomNo" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('IDC_roomNo')">
                           <el-option v-for="dict in roomList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="170" v-if="setVisable('IDC_frameNo')">
                  <template slot="header">
                     机框<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.frameNo'" :rules="rules.frameNo">
                        <el-select v-model="scope.row.frameNo" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('IDC_frameNo')">
                           <el-option v-for="dict in frameList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="electricPower" v-if="setVisable('IDC_electricPower')">
                  <template slot="header">
                     电力（KVA）<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.electricPower'" :rules="rules.electricPower">
                        <el-input v-model="scope.row.electricPower" placeholder="请输入 电力（KVA）" size="small"
                           :disabled="setDisable('IDC_electricPower')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" v-if="setVisable('IDC_addr')">
                  <template slot="header">
                     机房地址<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.addr'" :rules="rules.idc_addr">
                        <el-input v-model="scope.row.addr" placeholder="请输入机房地址" size="small" :disabled="setDisable('IDC_addr')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="170" v-if="setVisable('IDC_bandwidthType')">
                  <template slot="header">
                     带宽类型<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.bandwidthType'" :rules="rules.bandwidthType">
                        <el-select v-model="scope.row.bandwidthType" clearable placeholder="请选择" size="small"
                           :disabled="setDisable('IDC_bandwidthType')">
                           <el-option v-for="dict in bandwidthList" :key="dict.dictValue" :label="dict.dictLabel"
                              :value="dict.dictValue"></el-option>
                        </el-select>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="220" prop="ipCount"  v-if="setVisable('IDC_ipCount')">
                  <template slot="header">
                     IP数量<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.ipCount'" :rules="rules.idc_ipCount">
                        <el-input v-model="scope.row.ipCount" placeholder="请输入IP数量" size="small" :disabled="setDisable('IDC_ipCount')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="bandwidth" v-if="setVisable('IDC_bandwidth')">
                  <template slot="header">
                     带宽（Mbps）<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.bandwidth'" :rules="rules.idc_bandwidth">
                        <el-input v-model="scope.row.bandwidth" placeholder="请输入带宽（Mbps）" size="small"
                           :disabled="setDisable('IDC_bandwidth')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="220" prop="quantity" v-if="setVisable('IDC_quantity')">
                  <template slot="header">
                     数量<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.quantity'" :rules="rules.idc_quantity">
                        <el-input v-model="scope.row.quantity" placeholder="请输入数量" size="small" :disabled="setDisable('IDC_quantity')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="220" prop="unitPrice" v-if="setVisable('IDC_unitPrice')">
                  <template slot="header">
                     IDC 销售单价（元/项/月）<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'idcList.'+scope.$index+'.unitPrice'" :rules="rules.idc_unitPrice">
                        <el-input v-model="scope.row.unitPrice" placeholder="请输入 IDC 销售单价" size="small"
                           :disabled="setDisable('IDC_unitPrice')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column label="IDC 一次性费用" width="190" prop="oneTimeFee"  v-if="setVisable('IDC_oneTimeFee')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.oneTimeFee" placeholder="请输入IDC 一次性费用" size="small"
                        :disabled="setDisable('IDC_oneTimeFee')"></el-input>
                  </template>
               </el-table-column>
               <el-table-column label="IDC 一次性费用管理价" width="250" prop="oneTimeMgtFee"  v-if="setVisable('IDC_oneTimeMgtFee')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.oneTimeMgtFee" placeholder="请输入IDC 一次性费用管理价" size="small"
                        :disabled="setDisable('IDC_oneTimeMgtFee')"></el-input>
                  </template>
               </el-table-column>
               <el-table-column label="IDC 销售价（元/月）" width="250" prop="salesPrice" v-if="setVisable('IDC_salesPrice')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.salesPrice" placeholder="请输入IDC 销售价（元/月）" size="small"
                        :disabled="setDisable('IDC_salesPrice')"></el-input>
                  </template>
               </el-table-column>
               <el-table-column label="交付截至日期" width="250" v-if="setVisable('IDC_deliveryDate')">
                  <template slot-scope="scope">
                     <el-date-picker v-model="scope.row.deliveryDate" type="date" placeholder="选择日期"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" :disabled="setDisable('IDC_deliveryDate')">
                     </el-date-picker>
                  </template>
               </el-table-column>
               <el-table-column label="备注" width="240" v-if="setVisable('IDC_remarks')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.remarks" placeholder="请输入备注" size="small" :disabled="setDisable('IDC_remarks')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column fixed="right" label="操作" width="100" v-if="setVisable('IDC_delete')">
                  <template slot-scope="scope">
                     <el-button type="text" size="small" @click="deleteRow(scope.row,4)" :disabled="setDisable('IDC_delete')">
                        移除
                     </el-button>
                  </template>
               </el-table-column>
            </el-table>
         </div>
         <div class="mt" v-if="is_Show=='fourth'">
            <div style="font-size: 12px;margin-bottom: 10px;">合计销售利润率(IDC)(%)</div>
            <div>
               <el-input disabled value="0.00" size="small"></el-input>
            </div>
         </div>
         <!-- 服务 -->
         <div v-if="is_Show=='five'&&selected.includes('five')">
            <div class="addRow">
               <div class="el-icon-circle-plus-outline" @click="addRow(5)" v-if="!(setDisable('NonStandardProducts'))"></div>
            </div>
            <el-table border show-summary :summary-method="getSummaries" style="width: 100%;" :data="tableData.srvList"
               :header-cell-style="{'text-align':'center'}" class="table-fixed">
               <el-table-column width="180" v-if="setVisable('service_unitPrice')">
                  <template slot="header">
                     服务描述<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'srvList.'+scope.$index+'.desc'" :rules="rules.desc">
                        <el-input v-model="scope.row.desc" placeholder="请输入服务描述" size="small" :disabled="setDisable('service_unitPrice')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="unitPrice" v-if="setVisable('service_unitPrice')">
                  <template slot="header">
                     服务销售单价（元/月）<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'srvList.'+scope.$index+'.unitPrice'" :rules="rules.srv_unitPrice">
                        <el-input v-model="scope.row.unitPrice" placeholder="请输入服务销售单价" size="small"
                           :disabled="setDisable('service_unitPrice')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column label="数量" width="190" prop="quantity" v-if="setVisable('service_quantity')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.quantity" placeholder="请输入数量" size="small" :disabled="setDisable('service_quantity')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column label="服务销售价（元/月）" width="250" prop="salesPrice" v-if="setVisable('service_salesPrice')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.salesPrice" placeholder="请输入服务销售价" size="small" :disabled="setDisable('service_salesPrice')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column label="一次性服务费销售价" width="250" prop="oneTimeFee" v-if="setVisable('service_oneTimeFee')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.oneTimeFee" placeholder="请输入一次性服务费销售价" size="small"
                        :disabled="setDisable('service_oneTimeFee')"></el-input>
                  </template>
               </el-table-column>
               <el-table-column label="交付截至日期" width="250" v-if="setVisable('service_deliveryDate')">
                  <template slot-scope="scope">
                     <el-date-picker v-model="scope.row.deliveryDate" type="date" placeholder="选择日期"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" :disabled="setDisable('service_deliveryDate')">
                     </el-date-picker>
                  </template>
               </el-table-column>
               <el-table-column label="备注" width="240" v-if="setVisable('service_remarks')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.remarks" placeholder="请输入备注" size="small" :disabled="setDisable('service_remarks')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column label="一次性服务费管理价" width="240" prop="oneTimeMgtFee" v-if="setVisable('service_oneTimeMgtFee')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.oneTimeMgtFee" placeholder="请输一次性服务费管理价" size="small"
                        :disabled="setDisable('service_oneTimeMgtFee')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column fixed="right" label="操作" width="100" v-if="setVisable('service_delete')">
                  <template slot-scope="scope">
                     <el-button type="text" size="small" @click="deleteRow(scope.row,5)" :disabled="setDisable('service_delete')">
                        移除
                     </el-button>
                  </template>
               </el-table-column>
            </el-table>
         </div>
         <div class="mt" v-if="is_Show=='five'">
            <div style=" font-size: 12px;margin-bottom: 10px;">合计销售利润率(服务)(%)</div>
            <div>
               <el-input disabled value="0.00" size="small"></el-input>
            </div>
         </div>
         <!-- 集成 -->
         <div v-if="is_Show=='six'&&selected.includes('six')">
            <div class="addRow">
               <div class="el-icon-circle-plus-outline" @click="addRow(6)" v-if="!(setDisable('NonStandardProducts'))"></div>
            </div>
            <el-table border show-summary :summary-method="getSummaries" style="width: 100%;"
               :data="tableData.integrationList" :header-cell-style="{'text-align':'center'}" class="table-fixed">
               <el-table-column width="180" v-if="setVisable('integration_deviceModel')">
                  <template slot="header">
                     设备型号<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'integrationList.'+scope.$index+'.deviceModel'" :rules="rules.deviceModel">
                        <el-input v-model="scope.row.deviceModel" placeholder="请输入设备型号" size="small"
                           :disabled="setDisable('integration_deviceModel')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="200" v-if="setVisable('integration_desc')">
                  <template slot="header">
                     产品描述<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'integrationList.'+scope.$index+'.desc'" :rules="rules.int_desc">
                        <el-input v-model="scope.row.desc" placeholder="请输入产品描述" size="small" :disabled="setDisable('integration_desc')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="200" prop="unitPrice" v-if="setVisable('integration_unitPrice')">
                  <template slot="header">
                     集成销售单价（元）<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'integrationList.'+scope.$index+'.unitPrice'" :rules="rules.int_unitPrice">
                        <el-input v-model="scope.row.unitPrice" placeholder="请输入集成销售单价" size="small"
                           :disabled="setDisable('integration_unitPrice')"></el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column width="180" prop="quantity" v-if="setVisable('integration_quantity')">
                  <template slot="header">
                     数量<span class="head-required">*</span>
                  </template>
                  <template slot-scope="scope">
                     <el-form-item :prop="'integrationList.'+scope.$index+'.quantity'" :rules="rules.int_quantity">
                        <el-input v-model="scope.row.quantity" placeholder="请输入数量" size="small" :disabled="setDisable('integration_quantity')">
                        </el-input>
                     </el-form-item>
                  </template>
               </el-table-column>
               <el-table-column label="集成销售价" width="250" prop="salesPrice" v-if="setVisable('integration_salesPrice')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.salesPrice" placeholder="请输入集成销售价" size="small" :disabled="setDisable('integration_salesPrice')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column label="交付截至日期" width="250" v-if="setVisable('integration_deliveryDate')">
                  <template slot-scope="scope">
                     <el-date-picker v-model="scope.row.deliveryDate" type="date" placeholder="选择日期"
                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="small" :disabled="setDisable('integration_deliveryDate')">
                     </el-date-picker>
                  </template>
               </el-table-column>
               <el-table-column label="备注" width="240" v-if="setVisable('integration_remarks')">
                  <template slot-scope="scope">
                     <el-input v-model="scope.row.remarks" placeholder="请输入备注" size="small" :disabled="setDisable('integration_remarks')">
                     </el-input>
                  </template>
               </el-table-column>
               <el-table-column fixed="right" label="操作" width="100" v-if="setVisable('integration_delete')">
                  <template slot-scope="scope">
                     <el-button type="text" size="small" @click="deleteRow(scope.row,6)" :disabled="setDisable('integration_delete')">
                        移除
                     </el-button>
                  </template>
               </el-table-column>
            </el-table>
         </div>
         <div class="mt " v-if="is_Show=='six'">
            <div style="font-size: 12px;margin-bottom: 10px;">合计销售利润率(集成)(%)</div>
            <div>
               <el-input disabled value="0.00" size="small"></el-input>
            </div>
         </div>
      </el-form>
   </div>
</template>
<script>
   export default {
      props: {
         is_Show: {
            type: String,
            default: 'first'
         },
         selected: {
            type: Array,
            default: []
         },
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
         isDetail:  {
            type: Boolean,
            default: true,
         }
      },
      data() {
         return {
            MplsIpsecPro_list: [], //MPLS/IPSec关联产品
            speialLinePro_list: [], //专线关联产品
            InternetPro_list: [], //Internet关联产品
            IDCPro_list: [], //IDC关联产品
            operatorList: [], //运营商
            popList: [], //PoP列表
            aPortTypeList: [], //A端端口类型
            zPortTypeList: [], //Z端端口类型
            portTypeList: [], //端口类型
            upDownSymmetry: [], //上下行对称
            roomList: [], //机房名称
            frameList: [], //机框
            bandwidthList: [], //带宽类型

            //表单数据
            tableData: {
               mplsIpsecList: [], //MPLS/IPSec
               specialLineList: [], //专线
               internetList: [], //Internet
               idcList: [], //IDC
               srvList: [], //服务
               integrationList: [], //集成
            },
            mpls_tspm: null, //合计销售利润率（MPLS/IPSec)
            sl_tspm: null,
            internet_tspm: null,
            IDC_tspm: null,
            service_tspm: null,
            integration_tspm: null,
            // 表单验证
            rules: {
               // MPLS/IPSec
               prodNo: [
                  { required: true, message: '请选择关联产品', trigger: 'change' },
               ],
               isp: [
                  { required: true, message: '请选择运营商', trigger: 'change' }
               ],
               addr: [
                  { required: true, message: '请输入接入地址', trigger: 'blur' }
               ],
               popNo: [
                  { required: true, message: '请选择接入PoP', trigger: 'change' }
               ],
               bandwidth: [
                  { required: true, message: '请输入带宽', trigger: 'blur' }
               ],
               unitPrice: [
                  { required: true, message: '请输入VPN销售单价', trigger: 'blur' }
               ],
               quantity: [
                  { required: true, message: '请输入数量（项）', trigger: 'blur' }
               ],
               oneTimeFee: [
                  { required: true, message: '请输入VPN一次性费用', trigger: 'blur' }
               ],
               // 专线
               s_prodNo: [
                  { required: true, message: '请选择关联产品', trigger: 'change' },
               ],
               s_isp: [
                  { required: true, message: '请选择运营商', trigger: 'change' }
               ],
               aAddr: [
                  { required: true, message: '请输入A端地址', trigger: 'blur' }
               ],
               aPortType: [
                  { required: true, message: '请选择A端端口类型', trigger: 'change' }
               ],
               zAddr: [
                  { required: true, message: '请输入Z端地址', trigger: 'blur' }
               ],
               zPortType: [
                  { required: true, message: '请选择Z端端口类型', trigger: 'change' }
               ],
               s_bandwidth: [
                  { required: true, message: '请输入带宽', trigger: 'blur' }
               ],
               s_quantity: [
                  { required: true, message: '请输入数量', trigger: 'blur' }
               ],
               s_oneTimeFee: [
                  { required: true, message: '请输入专线一次性费用', trigger: 'blur' }

               ],
               //  Internet
               i_prodNo: [
                  { required: true, message: '请选择关联产品', trigger: 'change' },
               ],
               i_isp: [
                  { required: true, message: '请选择运营商', trigger: 'change' }
               ],
               i_addr: [
                  { required: true, message: '请输入站点地址', trigger: 'blur' }
               ],
               i_portType: [
                  { required: true, message: '请选择端口类型', trigger: 'change' }
               ],
               i_bandwidth: [
                  { required: true, message: '请输入带宽', trigger: 'blur' }
               ],
               ipCount: [
                  { required: true, message: '请输入IP数量', trigger: 'blur' }
               ],
               upDownSymmetry: [
                  { required: true, message: '请选择', trigger: 'change' }
               ],
               i_quantity: [
                  { required: true, message: '请输入数量', trigger: 'blur' }
               ],
               i_unitPrice: [
                  { required: true, message: '请输入 Internet 销售单价', trigger: 'blur' }
               ],
               //  IDC

               idc_prodNo: [
                  { required: true, message: '请选择关联产品', trigger: 'change' },
               ],
               roomNo: [
                  { required: true, message: '请选择机房名称', trigger: 'change' },
               ],
               frameNo: [
                  { required: true, message: '请选择机框', trigger: 'change' },
               ],
               electricPower: [
                  { required: true, message: '请输入电力', trigger: 'blur' },
               ],
               idc_addr: [
                  { required: true, message: '请输入机房地址', trigger: 'blur' },
               ],
               bandwidthType: [
                  { required: true, message: '请选择宽带类型', trigger: 'change' },
               ],
               idc_ipCount: [
                  { required: true, message: '请输入IP数量', trigger: 'blur' },
               ],
               idc_bandwidth: [
                  { required: true, message: '请输入带宽(Mbps)', trigger: 'blur' },
               ],
               idc_quantity: [
                  { required: true, message: '请输入数量', trigger: 'blur' },
               ],
               idc_unitPrice: [
                  { required: true, message: '请输入IDC 销售单价', trigger: 'blur' },
               ],

               //服务
               desc: [
                  { required: true, message: '请输入服务描述', trigger: 'blur' },
               ],
               srv_unitPrice: [
                  { required: true, message: '请输入服务销售单价', trigger: 'blur' },
               ],
               //集成
               deviceModel: [
                  { required: true, message: '请输入设备型号', trigger: 'blur' },
               ],
               int_desc: [
                  { required: true, message: '请输入产品描述', trigger: 'blur' },
               ],
               int_unitPrice: [
                  { required: true, message: '请输入产品描述', trigger: 'blur' },
               ],
               int_quantity: [
                  { required: true, message: '请输入数量', trigger: 'blur' },
               ],

            }
         }
      },
      watch: {
         formValue: {
            handler(newVal) {
               if (JSON.stringify(newVal) !== '{}') {
                  this.tableData.mplsIpsecList = newVal.mplsIpsecList;
                  this.tableData.specialLineList = newVal.specialLineList;
                  this.tableData.internetLis = newVal.internetList;
                  this.tableData.idcList = newVal.idcList;
                  this.tableData.srvList = newVal.srvList;
                  this.tableData.integrationList = newVal.integrationList;
               } else {
                  // console.log('为空', newVal)
               }
            },
            deep: true,
            immediate: true
         },
         taskFormValue: {
            handler(newVal) {
               if (JSON.stringify(newVal) !== '{}') {
                  this.tableData.mplsIpsecList = newVal.mplsIpsecList;
                  this.tableData.specialLineList = newVal.specialLineList;
                  this.tableData.internetLis = newVal.internetList;
                  this.tableData.idcList = newVal.idcList;
                  this.tableData.srvList = newVal.srvList;
                  this.tableData.integrationList = newVal.integrationList;
               }
            },
            deep: true,
            immediate: true
         },
         flowAuthSettingList: {
            handler(newVal) {
               // console.log('非标产品权限',newVal)
            },
            deep: true,
            immediate: true
         }
      },
      created() {
         //获取非标准产品类型关联产品
         this.getDicts("mpls_ipsec_products").then(response => {
            this.MplsIpsecPro_list = response.data;
         });
         this.getDicts("special_line_products").then(response => {
            this.speialLinePro_list = response.data;
         });
         this.getDicts("Internet_products").then(response => {
            this.InternetPro_list = response.data;
         });
         this.getDicts("idc_products").then(response => {
            this.IDCPro_list = response.data;
         });
         //运营商
         this.getDicts("operator_list").then(response => {
            this.operatorList = response.data;
         });

         //接入PoP
         this.getDicts("pop_list").then(response => {
            this.popList = response.data;
         });
         //A端端口类型
         this.getDicts("a_port_type").then(response => {
            this.aPortTypeList = response.data;
         });
         //Z端端口类型
         this.getDicts("z_port_type").then(response => {
            this.zPortTypeList = response.data;
         });
         //端口类型
         this.getDicts("port_type").then(response => {
            this.portTypeList = response.data;
         });
         //上下行对称
         this.getDicts("up_down_symmetry").then(response => {
            this.upDownSymmetry = response.data;
         });
         //机房名称
         this.getDicts("room_name").then(response => {
            this.roomList = response.data;
         });
         //机框
         this.getDicts("frame_type").then(response => {
            this.frameList = response.data;
         });
         //带宽类型
         this.getDicts("bandwidth_type").then(response => {
            this.bandwidthList = response.data;
         });

      },
      mounted() {

      },
      methods: {
         addRow(i) {
            if (i == 1) {
               this.tableData.mplsIpsecList.push({
                  key: Math.random(),
                  prodNo: '',
                  isp: '',
                  addr: '',
                  popNo: '',
                  bandwidth: '',
                  unitPrice: '',
                  quantity: '',
                  oneTimeFee: '',
                  oneTimeMgtFee: '',
                  salesPrice: '',
                  deliveryDate: '',
                  remarks: '',
                  purchaseRemarks: '',
               })
            } else if (i == 2) {
               this.tableData.specialLineList.push({
                  key: Math.random(),
                  prodNo: '',
                  isp: '',
                  aAddr: '',
                  aPortType: '',
                  zAddr: '',
                  zPortType: '',
                  bandwidth: '',
                  unitPrice: '',
                  quantity: '',
                  oneTimeFee: '',
                  oneTimeMgtFee: '',
                  salesPrice: '',
                  deliveryDate: '',
                  remarks: '',
               })
            } else if (i == 3) {
               this.tableData.internetList.push({
                  key: Math.random(),
                  prodNo: '',
                  isp: '',
                  addr: '',
                  portType: '',
                  bandwidth: '',
                  ipCount: '',
                  upDownSymmetry: '',
                  quantity: '',
                  unitPrice: '',
                  oneTimeFee: '',
                  oneTimeMgtFee: '',
                  salesPrice: '',
                  deliveryDate: '',
                  remarks: '',
               })
            } else if (i == 4) {
               this.tableData.idcList.push({
                  key: Math.random(),
                  prodNo: '',
                  roomNo: '',
                  frameNo: '',
                  electricPower: '',
                  addr: '',
                  bandwidthType: '',
                  ipCount: '',
                  bandwidth: '',
                  quantity: '',
                  unitPrice: '',
                  oneTimeFee: '',
                  oneTimeMgtFee: '',
                  salesPrice: '',
                  deliveryDate: '',
                  remarks: '',
               })
            } else if (i == 5) {
               this.tableData.srvList.push({
                  key: Math.random(),
                  desc: '',
                  unitPrice: '',
                  quantity: '',
                  salesPrice: '',
                  oneTimeFee: '',
                  oneTimeMgtFee: '',
                  deliveryDate: '',
                  remarks: '',
               })
            } else if (i == 6) {
               this.tableData.integrationList.push({
                  key: Math.random(),
                  deviceModel: '',
                  desc: '',
                  unitPrice: '',
                  quantity: '',
                  salesPrice: '',
                  deliveryDate: '',
                  remarks: '',
               })
            }
         },
         // 删除标准产品表格行
         deleteRow(row, i) {
            if (i == 1) {
               this.tableData.mplsIpsecList = this.tableData.mplsIpsecList.filter(item => {
                  return item.key != row.key
               })
            } else if (i == 2) {
               this.tableData.specialLineList = this.tableData.specialLineList.filter(item => {
                  return item.key != row.key
               })
            } else if (i == 3) {
               this.tableData.internetList = this.tableData.internetList.filter(item => {
                  return item.key != row.key
               })
            } else if (i == 4) {
               this.tableData.idcList = this.tableData.idcList.filter(item => {
                  return item.key != row.key
               })
            } else if (i == 5) {
               this.tableData.srvList = this.tableData.srvList.filter(item => {
                  return item.key != row.key
               })
            } else if (i == 6) {
               this.tableData.integrationList = this.tableData.integrationList.filter(item => {
                  return item.key != row.key
               })
            }
         },
         getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
               const showSum = function () {
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

               const indexMap = {
                  first: [5, 6, 7, 8, 9],
                  second: [6, 7, 8, 9, 10, 11],
                  third: [4, 5, 7, 8, 9, 10, 11],
                  fourth: [3, 6, 7, 8, 9, 10, 11, 12],
                  five: [1, 2, 3, 4, 7],
                  six: [2, 3, 4]
               }
               if (indexMap[this.is_Show] && indexMap[this.is_Show].includes(index)) {
                  showSum()
               }
            });
            return sums;
         },
         // 设置显示与隐藏
         setVisable(name) {
            let isShow = true;
            this.flowAuthSettingList.forEach(item=> {
               if(name == item.widgetCode) {
                  isShow = item.viewable;
               }
            })
            return isShow
         },
         setDisable(name) {
            let isDisable = false;
            if(this.isDetail) {
               return !isDisable
              }else if(this.isStart) {
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
      }
   }

</script>
<style lang="scss" scoped>
   .addRow {
      text-align: right;
      margin: 5px;
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

   .mt {
      margin-top: 10px;
   }
</style>
