(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3c9adc44"],{1538:function(e,t,n){"use strict";n.d(t,"h",(function(){return o})),n.d(t,"f",(function(){return a})),n.d(t,"b",(function(){return i})),n.d(t,"g",(function(){return s})),n.d(t,"n",(function(){return u})),n.d(t,"o",(function(){return c})),n.d(t,"k",(function(){return l})),n.d(t,"j",(function(){return d})),n.d(t,"e",(function(){return f})),n.d(t,"l",(function(){return p})),n.d(t,"a",(function(){return m})),n.d(t,"m",(function(){return h})),n.d(t,"c",(function(){return g})),n.d(t,"d",(function(){return b})),n.d(t,"i",(function(){return v}));var r=n("b775");function o(e){return Object(r["a"])({url:"/flowable/definition/list",method:"get",params:e})}function a(e){return Object(r["a"])({url:"/flowable/definition/info/by-deploy-id",method:"get",params:{deployId:e}})}function i(e,t){return Object(r["a"])({url:"/flowable/definition/start/"+e,method:"post",data:t})}function s(e){return Object(r["a"])({url:"/flowable/task/processVariables/"+e,method:"get"})}function u(e){return Object(r["a"])({url:"/flowable/definition/updateState",method:"put",params:e})}function c(e){return Object(r["a"])({url:"/flowable/definition/userList",method:"get",params:e})}function l(e){return Object(r["a"])({url:"/flowable/definition/roleList",method:"get",params:e})}function d(e){return Object(r["a"])({url:"/flowable/definition/readXml/"+e,method:"get"})}function f(e){return Object(r["a"])({url:"/flowable/task/flowViewer/"+e,method:"get"})}function p(e){return Object(r["a"])({url:"/flowable/definition/save",method:"post",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=utf-8"},data:e})}function m(e){return Object(r["a"])({url:"/system/deployment",method:"post",data:e})}function h(e){return Object(r["a"])({url:"/system/deployment",method:"put",data:e})}function g(e){return Object(r["a"])({url:"/flowable/definition/"+e,method:"delete"})}function b(e){return Object(r["a"])({url:"/system/deployment/export",method:"get",params:e})}function v(e){return Object(r["a"])({url:"/flowable/definition/deploy-to-def-id",method:"get",params:e})}},"251b":function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("bpmn-modeler",{ref:"refNode",attrs:{xml:e.xml,users:e.users,groups:e.groups,categorys:e.categorys,"is-view":!1},on:{save:e.save,showXML:e.showXML,dataType:e.dataType}}),n("el-dialog",{directives:[{name:"drag",rawName:"v-drag"}],attrs:{title:e.xmlTitle,visible:e.xmlOpen,width:"60%","append-to-body":""},on:{"update:visible":function(t){e.xmlOpen=t}}},[n("div",[n("pre",{directives:[{name:"highlight",rawName:"v-highlight"}]},[e._v("         "),n("code",{staticClass:"xml"},[e._v("\n              "+e._s(e.xmlContent)+"\n         ")]),e._v("\n      ")])])])],1)},o=[],a=(n("159b"),n("b0c0"),n("d3b7"),n("25f0"),n("1538")),i=n("ae3a"),s=n("347e"),u=n.n(s),c=n("1487"),l=n.n(c),d=(n("9f21"),n("5c96")),f={name:"Model",components:{bpmnModeler:i["a"],vkbeautify:u.a},directives:{highlight:function(e){var t=e.querySelectorAll("pre code");t.forEach((function(e){l.a.highlightBlock(e)}))}},data:function(){return{xml:"",modeler:"",xmlOpen:!1,xmlTitle:"",xmlContent:"",users:[],groups:[],categorys:[]}},created:function(){var e=this,t=this.$route.query&&this.$route.query.deployId;t&&this.getModelDetail(t),this.getDicts("sys_process_category").then((function(t){e.categorys=t.data})),this.getDataList()},methods:{getModelDetail:function(e){var t=this;Object(a["j"])(e).then((function(e){t.xml=e.data,t.modeler=e.data}))},save:function(e){var t=this;if(!e.process.name)return d["Message"].error("请输入流程名称");if(!e.process.id||" "===e.process.id)return d["Message"].error("请输入流程标识");if(!e.process.category)return d["Message"].error("请选择流程分类");var n="_fk=u"+(e.process.name?"&name="+e.process.name:"")+(e.process.category?"&category="+e.process.category:"")+(e.xml?"&xml="+e.xml:"");Object(a["l"])(n).then((function(e){t.$message(e.msg),t.$store.dispatch("tagsView/delView",t.$route),t.$router.go(-1)})).catch((function(){}))},getDataList:function(){var e=this;Object(a["o"])().then((function(t){t.data.forEach((function(e){e.userId=e.userId.toString()})),e.users=t.data;var n={nickName:"流程发起人",userId:"${INITIATOR}"};e.users.push(n)})),Object(a["k"])().then((function(t){t.data.forEach((function(e){e.roleId=e.roleId.toString()})),e.groups=t.data}))},showXML:function(e){this.xmlTitle="xml查看",this.xmlOpen=!0,this.xmlContent=u.a.xml(e)},dataType:function(e){this.users=[],this.groups=[],e&&("dynamic"===e.dataType?"assignee"===e.userType?this.users=[{nickName:"${INITIATOR}",userId:"${INITIATOR}"},{nickName:"#{approval}",userId:"#{approval}"}]:"candidateUsers"===e.userType?this.users=[{nickName:"#{approval}",userId:"#{approval}"}]:this.groups=[{roleName:"#{approval}",roleId:"#{approval}"}]:this.getDataList())}}},p=f,m=n("0c7c"),h=Object(m["a"])(p,r,o,!1,null,null,null);t["default"]=h.exports}}]);