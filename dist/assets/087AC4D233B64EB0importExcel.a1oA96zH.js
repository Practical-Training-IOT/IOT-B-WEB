/*! 
 Build based on gin-vue-admin 
 Time : 1746843967000 */
import{k as e,g as s,i as t,o as a,w as o,f as c,h as r,v as p,E as l}from"./087AC4D233B64EB0index.CO5TVuii.js";const n={__name:"importExcel",props:{templateId:{type:String,required:!0}},emits:["on-success"],setup(n,{emit:i}){const m=n,u=e().token,d=i,x="".concat("/api","/sysExportTemplate/importExcel?templateID=").concat(m.templateId),f=e=>{0===e.code?(l.success("导入成功"),d("on-success")):l.error(e.msg)};return(e,l)=>{const n=s("el-button"),i=s("el-upload");return a(),t(i,{action:x,"show-file-list":!1,"on-success":f,multiple:!1,headers:{"x-token":p(u)}},{default:o((()=>[c(n,{type:"primary",icon:"upload",class:"ml-3"},{default:o((()=>l[0]||(l[0]=[r(" 导入 ")]))),_:1})])),_:1},8,["headers"])}}};export{n as _};
