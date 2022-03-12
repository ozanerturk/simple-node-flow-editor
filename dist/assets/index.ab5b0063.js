var ne=Object.defineProperty;var oe=(n,e,t)=>e in n?ne(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var c=(n,e,t)=>(oe(n,typeof e!="symbol"?e+"":e,t),t);import{r as H,d as B,a as O,o as v,c as m,b as a,e as se,w as ie,u as k,D as ae,f as F,t as b,g as $,L as P,p as T,h as X,i as D,F as V,j as C,k as M,l as ue,n as le,m as de,q as re,s as ce}from"./vendor.1a2613cc.js";const pe=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerpolicy&&(o.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?o.credentials="include":s.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}};pe();function A(){var n,e,t;for(n="",t=0;t<32;t++)(t==8||t==12||t==16||t==20)&&(n=n+"-"),e=Math.floor(Math.random()*16).toString(16).toUpperCase(),n=n+e;return n}class U{constructor(e){c(this,"inputs",[]);c(this,"outputs",[]);c(this,"parameters",[]);c(this,"name");c(this,"x",0);c(this,"y",0);c(this,"id");this.name=e,this.id=A()}serialize(){return{x:this.x,y:this.y,initialX:this.x,initialY:this.y,id:this.id,name:this.name,inputs:this.inputs.map(e=>e.serialize()),outputs:this.outputs.map(e=>e.serialize()),parameters:this.parameters}}setId(e){this.id=e}execution(){}onExecuted(e){}canExecute(){return console.log(this.inputs.length,this.inputs.map(e=>e.hasValue())),this.inputs.every(e=>e.hasValue())}tryExecution(){this.canExecute()?(this.execution(),this.outputs.forEach(e=>{this.onExecuted(e)})):this.notReady()}updateCoordinates(e,t){this.x=e,this.y=t}notReady(){console.log(this,"not ready")}}class q{constructor(e){c(this,"value");c(this,"hasValue",!1);this.value=e}setValue(e){console.log(e),this.value=e,this.hasValue=!0}clear(){this.value=null,this.hasValue=!1}}class j{constructor(e,t,i=void 0){c(this,"name");c(this,"node");c(this,"value",new q(null));c(this,"id");this.node=e,this.name=t,this.id=i||A()}serialize(){return{id:this.id,name:this.name,value:this.value.value,hasValue:this.value.hasValue,nodeId:this.node.id}}getValue(){return this.value.value}setValue(e){this.value.setValue(e),console.log("attached inputs notified")}}class J{constructor(e,t,i=""){c(this,"name");c(this,"required",!0);c(this,"default");c(this,"value",new q(null));c(this,"node");c(this,"id");this.node=e,this.name=t,this.id=i||A()}serialize(){return{id:this.id,name:this.name,value:this.value.value,hasValue:this.value.hasValue,nodeId:this.node.id}}hasValue(){return this.value.hasValue}setValue(e){this.value.setValue(e)}getValue(){return this.value.value}clearValue(){this.value.clear()}}class he extends U{constructor(){super("Bearing");c(this,"speedInput",new J(this,"speed"));c(this,"bpfoOutput",new j(this,"bpfo"));c(this,"bpfiOutput",new j(this,"bfio"));c(this,"model",{key:"model",value:"2616"});this.inputs.push(this.speedInput),this.outputs.push(this.bpfoOutput),this.outputs.push(this.bpfiOutput),this.parameters.push(this.model)}execution(){let e=this.speedInput.getValue()/10,t=this.speedInput.getValue()/15;this.bpfiOutput.setValue(t),this.bpfoOutput.setValue(e)}}class fe extends U{constructor(){super("Engine");c(this,"powerInput",new J(this,"power"));c(this,"powerOutput",new j(this,"power"));c(this,"tolerance",{key:"tolerance",value:"0.1"});this.inputs.push(this.powerInput),this.outputs.push(this.powerOutput),this.parameters.push(this.tolerance)}execution(){let e=Number(this.powerInput.getValue())*2+Number(this.tolerance.value);this.powerOutput.setValue(e),console.log("power output set to",e)}}const G=[fe,he];function ve(n){for(let e of G)if(e.name==n.name)return e;return U}class L{constructor(){c(this,"nodes",[]);c(this,"connections",[])}addNewNode(e){e.onExecuted=t=>{this.connections.filter(s=>s.from.id==t.id).forEach(s=>{s.to.setValue(t.getValue()),s.to.node.tryExecution()})},this.nodes.push(e)}execute(){this.nodes.forEach(e=>e.tryExecution())}serialize(){return{nodes:this.nodes.map(e=>e.serialize()),connections:this.connections.map(e=>[e.from.id,e.to.id])}}static parse(e){let t=new L,i=e.nodes.map(o=>{console.log(o.parameters[0]);let l=new(ve(o))(o.name);return l.setId(String(o.id)),l.updateCoordinates(o.x,o.y),l.outputs.forEach((f,r)=>{f.name=o.outputs[r].name,f.id=o.outputs[r].id,f.value.setValue(o.outputs[r].value)}),l.inputs.forEach((f,r)=>{f.name=o.inputs[r].name,f.id=o.inputs[r].id,f.value.setValue(o.inputs[r].value)}),l.parameters.forEach((f,r)=>{f.key=o.parameters[r].key,f.value=o.parameters[r].value}),l}),s=e.connections.map(o=>{let[l,f]=o,r=i.flatMap(x=>x.outputs).find(x=>x.id==l),I=i.flatMap(x=>x.inputs).find(x=>x.id==f);return{from:r,to:I}});return t.nodes=i,t.connections=s,t}removeNode(e){this.nodes=this.nodes.filter(t=>t.id!=e.id),this.connections=this.connections.filter(t=>t.from.node.id!=e.id&&t.to.node.id!=e.id)}getInputById(e){return this.nodes.flatMap(t=>t.inputs).find(t=>t.id==e)}getOutputById(e){return this.nodes.flatMap(t=>t.outputs).find(t=>t.id==e)}attachNode(e,t){console.log("attachNode",e,t),console.log(this);let i=this.getOutputById(e),s=this.getInputById(t);if(console.log("output",i),console.log("input",s),i&&s){if(this.isAttachmentRecursive(i,s)){alert("recursive connection");return}this.detachInput(s);let o={from:i,to:s};this.connections.push(o)}}isAttachmentRecursive(e,t){let i=[t.node];for(;;){let s=this.connections.filter(o=>i.map(l=>l.outputs).flat().map(l=>l.id).includes(o.from.id));if(s.length==0)break;if(i=s.map(o=>o.to.node),i.map(o=>o.id).includes(e.node.id))return!0}return i.map(s=>s.id).includes(e.node.id)}getNodeById(e){return this.nodes.find(t=>t.id==e)}detachInput(e){let t=this.connections.findIndex(i=>i.to==e);return t>-1?this.connections.splice(t,1)[0]:null}}const y=H({draggingOutputId:"",droppedInputId:"",selectedNodeId:""});var z=(n,e)=>{const t=n.__vccOpts||n;for(const[i,s]of e)t[i]=s;return t};const ge={class:"hello"},me={key:0,class:"output-name"},_e={key:0},ye=B({props:{output:Object},setup(n){const e=n,t=O(),i=O(),s=H({x:0,y:0});let o=null;function l(){o=new P(t.value,i.value,{dash:{animation:!0},size:2})}function f(I){o&&o.position();const{x,y:E}=I.data;s.x=x,s.y=E}function r(I){console.log(I.event.target),o&&o.remove(),I.data,s.x=0,s.y=0,setTimeout(()=>{y.droppedInputId?y.draggingOutputId=e.output.id:y.draggingOutputId=""},2)}return(I,x)=>(v(),m("div",ge,[a("div",{class:"output-droppable",ref_key:"lineStart",ref:t},null,512),se(k(ae),{onMove:f,"enable-transform-fix":!0,"enable-user-select-hack":!0,position:k(s),onStart:l,onStop:r},{default:ie(()=>[a("div",{class:"output-droppable",style:{position:"absolute",opacity:"0"},ref_key:"lineEnd",ref:i},null,512)]),_:1},8,["position"]),k(y).selectedNodeId==n.output.node.id?(v(),m("div",me,[F(b(n.output.name)+" ",1),n.output.value.hasValue?(v(),m("span",_e,"("+b(n.output.getValue())+")",1)):$("",!0)])):$("",!0)]))}});var xe=z(ye,[["__scopeId","data-v-3b40ae2c"]]);const Ie=n=>(T("data-v-28df0072"),n=n(),X(),n),we=["id"],be={key:0,class:"input-name"},ke=Ie(()=>a("div",{class:"dont-drag-me-father input-draggable output-drop-target"},null,-1)),Ne=B({props:{input:Object},setup(n){return(e,t)=>{var i,s,o,l,f;return v(),m("div",{id:`node-${(i=n.input)==null?void 0:i.node.id}-input-${(s=n.input)==null?void 0:s.id}`,class:"input"},[((o=n.input)==null?void 0:o.node.id)==k(y).selectedNodeId?(v(),m("div",be,[F(b((l=n.input)==null?void 0:l.name)+"("+b((f=n.input)==null?void 0:f.getValue())+") ",1),ke])):$("",!0)],8,we)}}});var Ve=z(Ne,[["__scopeId","data-v-28df0072"]]);const S=n=>(T("data-v-763a1faf"),n=n(),X(),n),Ce={class:"box"},Ee={key:0,style:{position:"absolute"}},Oe={class:"dialog"},$e={class:"dialog-header"},Se={class:"dialog-title"},Le={class:"dialog-body"},Be=S(()=>a("h3",null,"Parameters",-1)),Me={class:"dialog-parameters"},ze={class:"dialog-parameter"},Re={class:"dialog-parameter-name"},je=["value","onChange"],Fe=S(()=>a("hr",null,null,-1)),Te=S(()=>a("h3",null,"Inputs",-1)),Xe={class:"dialog-inputs"},Ae={class:"dialog-input"},Ue={class:"dialog-input-name"},Ye=["value","onChange"],De=S(()=>a("br",null,null,-1)),He=S(()=>a("hr",null,null,-1)),Pe=S(()=>a("h3",null,"Outputs",-1)),qe={class:"dialog-outputs"},Je={class:"dialog-output"},Ge={class:"dialog-output-name"},Ke={class:"inputs"},We={class:"center"},Qe={class:"outputs"},Ze=B({props:{node:Object},emits:["inputClicked","removed"],setup(n,{emit:e}){function t(f,r){y.droppedInputId=r.id}function i(f){y.droppedInputId="",y.draggingOutputId=""}function s(f,r){e("inputClicked",r)}function o(f){e("removed",f)}let l=O(!1);return(f,r)=>{var I,x,E;return v(),m("div",Ce,[k(l)?(v(),m("div",Ee,[a("div",Oe,[a("div",$e,[a("div",Se,b(n.node.name),1),a("div",{class:"dialog-close",onClick:r[0]||(r[0]=h=>D(l)?l.value=!1:l=!1)},"X")]),a("div",Le,[Be,a("div",Me,[(v(!0),m(V,null,C(n.node.parameters,(h,N)=>(v(),m("div",null,[a("div",ze,[a("div",Re,b(h.key),1),a("input",{value:h.value,onChange:w=>{h.value=w.target.value}},null,40,je)])]))),256))]),Fe,Te,a("div",Xe,[(v(!0),m(V,null,C(n.node.inputs,h=>(v(),m("div",Ae,[a("div",Ue,[a("label",null,b(h.name),1),a("input",{value:h.value.value,onChange:N=>{h.setValue(N.target.value)}},null,40,Ye)])]))),256))]),De,He,Pe,a("div",qe,[(v(!0),m(V,null,C(n.node.outputs,h=>(v(),m("div",Je,[a("div",Ge,[a("label",null,b(h.name),1),F(" ("+b(h.getValue())+") ",1)])]))),256))])])])])):$("",!0),n.node.id==k(y).selectedNodeId?(v(),m("button",{key:1,onClick:r[1]||(r[1]=()=>D(l)?l.value=!0:l=!0),style:{position:"absolute",left:"0px",top:"-20px",width:"20px",height:"20px",padding:"0px"}},"S")):$("",!0),n.node.id==k(y).selectedNodeId?(v(),m("button",{key:2,onClick:r[2]||(r[2]=()=>o(n.node)),style:{position:"absolute",right:"0px",top:"-20px",width:"20px",height:"20px",padding:"0px"}},"X")):$("",!0),a("div",Ke,[(v(!0),m(V,null,C((I=n.node)==null?void 0:I.inputs,(h,N)=>(v(),M(Ve,{onMouseenter:w=>t(w,h),onMouseleave:r[3]||(r[3]=w=>i()),onClick:w=>s(w,h),input:h},null,8,["onMouseenter","onClick","input"]))),256))]),a("div",We,b((x=n.node)==null?void 0:x.name),1),a("div",Qe,[(v(!0),m(V,null,C((E=n.node)==null?void 0:E.outputs,(h,N)=>{var w;return v(),M(xe,{class:"dont-drag-me-father output",id:`node-${(w=n.node)==null?void 0:w.id}-output-${h.id}`,output:h},null,8,["id","output"])}),256))])])}}});var et=z(Ze,[["__scopeId","data-v-763a1faf"]]);const tt=n=>(T("data-v-58c6370e"),n=n(),X(),n),nt=tt(()=>a("label",null,"load",-1)),ot={style:{"margin-left":"10px"}},st={style:{display:"flex",width:"100%",height:"800px","background-color":"grey",position:"relative"}},it={class:"toolbox",style:{border:"1px solid black",display:"flex","flex-direction":"column"}},at=["onClick"],ut=B({setup(n){let e=O(new L),t=O();O(!1);let i=[];ue(()=>y.draggingOutputId,(u,p)=>{e.value.attachNode(y.draggingOutputId,y.droppedInputId),h()});function s(){let u=JSON.stringify(e.value.serialize());localStorage.setItem("engine",u),ee(u,"engine.json","text/plain")}function o(){let u=localStorage.getItem("engine");u&&(e.value=L.parse(JSON.parse(u)),h())}function l(u){let p=u.target.files[0];if(p){var d=new FileReader;d.onload=function(g){if(g.target.readyState==2){if(g.target.error){alert("Error while reading file");return}try{let _=JSON.parse(g.target.result);e.value=L.parse(_)}catch{alert("Error while parsing file")}}},d.readAsText(p,"UTF-8")}}function f(u){let p=new u;e.value.addNewNode(p),h()}function r(){e.value.execute(),h()}function I(u,p){let d=`node-${u.node.id}-output-${u.id}`,g=`node-${p.node.id}-input-${p.id}`;setTimeout(()=>{let _=new P(document.getElementById(d),document.getElementById(g),{dash:{animation:!0},size:2});i.push(_)},1)}function x(u){e.value.detachInput(u),h()}function E(u){e.value.removeNode(u),h()}function h(){i.forEach(u=>{u.remove()}),i=[];for(let u of e.value.connections){let p=u;I(p.from,p.to)}}let N=0,w=0,R=0,Y=0;function W(u){u.target===u.currentTarget&&(console.log("clicked on container"),y.selectedNodeId="")}function Q(u,p,d){{let g=N+p.pageX-R,_=w+p.pageY-Y;g<0&&(g=0),_<0&&(_=0),d.x=g,d.y=_,i.forEach(te=>{te.position()})}}function Z(u,p){t.value=p;let d=u.target;if([...d.classList].some(_=>_.startsWith("dialog"))||d.classList.contains("output-droppable")||d.classList.contains("dialog"))return;N=p.x,w=p.y,R=u.pageX,Y=u.pageY,console.log(p.x,N,R);const g=function(_){return Q(d,_,p)};d.addEventListener("mousemove",g,!1),window.addEventListener("mouseup",function(){d.removeEventListener("mousemove",g,!1)},!1)}const ee=(u,p,d)=>{const g=document.createElement("a"),_=new Blob([u],{type:d});g.href=URL.createObjectURL(_),g.download=p,g.click(),URL.revokeObjectURL(g.href)};return h(),(u,p)=>(v(),m(V,null,[a("button",{onClick:s},"save"),a("button",{onClick:o},"loadFromStorage"),nt,a("input",{type:"file",onChange:p[0]||(p[0]=d=>l(d))},null,32),a("button",{onClick:r},"execute"),a("div",ot,[a("div",st,[a("div",it,[(v(!0),m(V,null,C(k(G),(d,g)=>(v(),m("button",{style:{"margin-left":"10px","margin-right":"10px","margin-top":"10px"},key:g,onClick:()=>f(d)},b(d.name),9,at))),128))]),a("div",{class:"editor-container",style:{flex:"1",position:"relative"},onClick:p[1]||(p[1]=d=>{W(d)})},[(v(!0),m(V,null,C(k(e).nodes,(d,g)=>(v(),M(et,{onRemoved:E,onInputClicked:x,onMousedown:_=>{Z(_,d),k(y).selectedNodeId=d.id},class:le({selected:k(y).selectedNodeId===d.id}),style:de({position:"absolute",left:d.x+"px",top:d.y+"px"}),key:g,node:d},null,8,["onMousedown","class","style","node"]))),128))])])])],64))}});var lt=z(ut,[["__scopeId","data-v-58c6370e"]]);const dt=B({setup(n){return(e,t)=>(v(),M(lt))}}),K=re(dt);K.use(ce);K.mount("#app");
