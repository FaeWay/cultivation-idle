"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[8674],{8674:(Z,a,s)=>{s.r(a),s.d(a,{OverviewRoutingModule:()=>y});var c=s(9705),m=s(9398),u=s(6445),p=s(9253),e=s(9863),v=s(9870),n=s(2159),l=s(9808);function d(t,i){if(1&t&&(e.TgZ(0,"span"),e._uU(1),e.qZA()),2&t){const o=e.oxw();e.xp6(1),e.hij(" (",o.item.baseResourceAmount.div(o.item.loopTime/1e3),"/ sec) ")}}let g=(()=>{class t{constructor(){this.onClick=new e.vpe,this.displayItemsPerSec=!1}ngOnInit(){}}return t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=e.Xpm({type:t,selectors:[["cvi-item-progress-bar"]],inputs:{item:"item",totalHeld:"totalHeld",action:"action",actionDisplayOverride:"actionDisplayOverride",displayItemsPerSec:"displayItemsPerSec"},outputs:{onClick:"onClick"},decls:8,vars:4,consts:[[4,"ngIf"],[1,"action-progress-bar",3,"value"]],template:function(o,r){1&o&&(e.TgZ(0,"ion-card")(1,"ion-card-header"),e._uU(2),e.YNc(3,d,2,1,"span",0),e._uU(4),e.qZA(),e.TgZ(5,"ion-card-content")(6,"ion-row"),e._UZ(7,"ion-progress-bar",1),e.qZA()()()),2&o&&(e.xp6(2),e.hij("",r.item.displayName," "),e.xp6(1),e.Q6J("ngIf",r.displayItemsPerSec),e.xp6(1),e.hij(" : ",r.totalHeld," "),e.xp6(3),e.s9C("value",r.item.barValue))},directives:[n.PM,n.Zi,l.O5,n.FN,n.Nd,n.X7],styles:[".action-progress-bar[_ngcontent-%COMP%]{align-self:center}"]}),t})();function f(t,i){if(1&t&&e._UZ(0,"cvi-item-progress-bar",3),2&t){const o=i.$implicit,r=e.oxw();e.Q6J("action","")("item",o)("totalHeld",r.gds.GetResourceValue(o))}}const O=[{path:"",component:(()=>{class t{constructor(o){this.gameData=o,this.gds=o,this.updateInt=100}ngOnInit(){this.testItem=new m.f(p.W.earth),this.testAmount=new u.Z(1)}addResource(o){}}return t.\u0275fac=function(o){return new(o||t)(e.Y36(v.u))},t.\u0275cmp=e.Xpm({type:t,selectors:[["cvi-overview"]],decls:13,vars:1,consts:[["value","resources"],["value","player"],[3,"action","item","totalHeld",4,"ngFor","ngForOf"],[3,"action","item","totalHeld"]],template:function(o,r){1&o&&(e.TgZ(0,"ion-content")(1,"ion-toolbar")(2,"ion-segment",0)(3,"ion-segment-button",0),e._uU(4,"Resources"),e.qZA(),e.TgZ(5,"ion-segment-button",1),e._uU(6,"Player"),e.qZA()()(),e.TgZ(7,"ion-card")(8,"ion-card-header"),e._uU(9,"Fae-Way Proclaims"),e.qZA(),e.TgZ(10,"ion-card-content"),e._uU(11," This of this as 'Home'. A Grid of quick-actions (for all unlocked features)& some quick-look stats is envisioned here. "),e.qZA()(),e.YNc(12,f,1,3,"cvi-item-progress-bar",2),e.qZA()),2&o&&(e.xp6(12),e.Q6J("ngForOf",r.gds.GetAllKnownResources()))},directives:[n.W2,n.sr,n.cJ,n.QI,n.GO,n.PM,n.Zi,n.FN,l.sg,g],styles:[".tabs-bottom[_ngcontent-%COMP%]{height:32px!important}"]}),t})()}];let y=(()=>{class t{}return t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=e.oAB({type:t}),t.\u0275inj=e.cJS({imports:[[c.Bz.forChild(O)],c.Bz]}),t})()}}]);