(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["LotteryWrapper"],{"1f09":function(t,e,a){},3129:function(t,e,a){"use strict";var n=a("3835"),r=a("5530"),i=(a("ac1f"),a("1276"),a("d81d"),a("a630"),a("3ca3"),a("5319"),a("1f09"),a("c995")),s=a("24b2"),o=a("7560"),c=a("58df"),l=a("80d2");e["a"]=Object(c["a"])(i["a"],s["a"],o["a"]).extend({name:"VSkeletonLoader",props:{boilerplate:Boolean,loading:Boolean,tile:Boolean,transition:String,type:String,types:{type:Object,default:function(){return{}}}},computed:{attrs:function(){return this.isLoading?this.boilerplate?{}:Object(r["a"])({"aria-busy":!0,"aria-live":"polite",role:"alert"},this.$attrs):this.$attrs},classes:function(){return Object(r["a"])(Object(r["a"])({"v-skeleton-loader--boilerplate":this.boilerplate,"v-skeleton-loader--is-loading":this.isLoading,"v-skeleton-loader--tile":this.tile},this.themeClasses),this.elevationClasses)},isLoading:function(){return!("default"in this.$scopedSlots)||this.loading},rootTypes:function(){return Object(r["a"])({actions:"button@2",article:"heading, paragraph",avatar:"avatar",button:"button",card:"image, card-heading","card-avatar":"image, list-item-avatar","card-heading":"heading",chip:"chip","date-picker":"list-item, card-heading, divider, date-picker-options, date-picker-days, actions","date-picker-options":"text, avatar@2","date-picker-days":"avatar@28",heading:"heading",image:"image","list-item":"text","list-item-avatar":"avatar, text","list-item-two-line":"sentences","list-item-avatar-two-line":"avatar, sentences","list-item-three-line":"paragraph","list-item-avatar-three-line":"avatar, paragraph",paragraph:"text@3",sentences:"text@2",table:"table-heading, table-thead, table-tbody, table-tfoot","table-heading":"heading, text","table-thead":"heading@6","table-tbody":"table-row-divider@6","table-row-divider":"table-row, divider","table-row":"table-cell@6","table-cell":"text","table-tfoot":"text@2, avatar@2",text:"text"},this.types)}},methods:{genBone:function(t,e){return this.$createElement("div",{staticClass:"v-skeleton-loader__".concat(t," v-skeleton-loader__bone")},e)},genBones:function(t){var e=this,a=t.split("@"),r=Object(n["a"])(a,2),i=r[0],s=r[1],o=function(){return e.genStructure(i)};return Array.from({length:s}).map(o)},genStructure:function(t){var e=[];t=t||this.type||"";var a=this.rootTypes[t]||"";if(t===a);else{if(t.indexOf(",")>-1)return this.mapBones(t);if(t.indexOf("@")>-1)return this.genBones(t);a.indexOf(",")>-1?e=this.mapBones(a):a.indexOf("@")>-1?e=this.genBones(a):a&&e.push(this.genStructure(a))}return[this.genBone(t,e)]},genSkeleton:function(){var t=[];return this.isLoading?t.push(this.genStructure()):t.push(Object(l["t"])(this)),this.transition?this.$createElement("transition",{props:{name:this.transition},on:{afterEnter:this.resetStyles,beforeEnter:this.onBeforeEnter,beforeLeave:this.onBeforeLeave,leaveCancelled:this.resetStyles}},t):t},mapBones:function(t){return t.replace(/\s/g,"").split(",").map(this.genStructure)},onBeforeEnter:function(t){this.resetStyles(t),this.isLoading&&(t._initialStyle={display:t.style.display,transition:t.style.transition},t.style.setProperty("transition","none","important"))},onBeforeLeave:function(t){t.style.setProperty("display","none","important")},resetStyles:function(t){t._initialStyle&&(t.style.display=t._initialStyle.display||"",t.style.transition=t._initialStyle.transition,delete t._initialStyle)}},render:function(t){return t("div",{staticClass:"v-skeleton-loader",attrs:this.attrs,on:this.$listeners,class:this.classes,style:this.isLoading?this.measurableStyles:void 0},[this.genSkeleton()])}})},"3a2f":function(t,e,a){"use strict";var n=a("ade3"),r=(a("a9e3"),a("9734"),a("4ad4")),i=a("a9ad"),s=a("16b7"),o=a("b848"),c=a("f573"),l=a("f2e7"),u=a("80d2"),h=a("d9bd"),d=a("58df");e["a"]=Object(d["a"])(i["a"],s["a"],o["a"],c["a"],l["a"]).extend({name:"v-tooltip",props:{closeDelay:{type:[Number,String],default:0},disabled:Boolean,openDelay:{type:[Number,String],default:0},openOnHover:{type:Boolean,default:!0},tag:{type:String,default:"span"},transition:String},data:function(){return{calculatedMinWidth:0,closeDependents:!1}},computed:{calculatedLeft:function(){var t=this.dimensions,e=t.activator,a=t.content,n=!this.bottom&&!this.left&&!this.top&&!this.right,r=!1!==this.attach?e.offsetLeft:e.left,i=0;return this.top||this.bottom||n?i=r+e.width/2-a.width/2:(this.left||this.right)&&(i=r+(this.right?e.width:-a.width)+(this.right?10:-10)),this.nudgeLeft&&(i-=parseInt(this.nudgeLeft)),this.nudgeRight&&(i+=parseInt(this.nudgeRight)),"".concat(this.calcXOverflow(i,this.dimensions.content.width),"px")},calculatedTop:function(){var t=this.dimensions,e=t.activator,a=t.content,n=!1!==this.attach?e.offsetTop:e.top,r=0;return this.top||this.bottom?r=n+(this.bottom?e.height:-a.height)+(this.bottom?10:-10):(this.left||this.right)&&(r=n+e.height/2-a.height/2),this.nudgeTop&&(r-=parseInt(this.nudgeTop)),this.nudgeBottom&&(r+=parseInt(this.nudgeBottom)),!1===this.attach&&(r+=this.pageYOffset),"".concat(this.calcYOverflow(r),"px")},classes:function(){return{"v-tooltip--top":this.top,"v-tooltip--right":this.right,"v-tooltip--bottom":this.bottom,"v-tooltip--left":this.left,"v-tooltip--attached":""===this.attach||!0===this.attach||"attach"===this.attach}},computedTransition:function(){return this.transition?this.transition:this.isActive?"scale-transition":"fade-transition"},offsetY:function(){return this.top||this.bottom},offsetX:function(){return this.left||this.right},styles:function(){return{left:this.calculatedLeft,maxWidth:Object(u["h"])(this.maxWidth),minWidth:Object(u["h"])(this.minWidth),top:this.calculatedTop,zIndex:this.zIndex||this.activeZIndex}}},beforeMount:function(){var t=this;this.$nextTick((function(){t.value&&t.callActivate()}))},mounted:function(){"v-slot"===Object(u["u"])(this,"activator",!0)&&Object(h["b"])("v-tooltip's activator slot must be bound, try '<template #activator=\"data\"><v-btn v-on=\"data.on>'",this)},methods:{activate:function(){this.updateDimensions(),requestAnimationFrame(this.startTransition)},deactivate:function(){this.runDelay("close")},genActivatorListeners:function(){var t=this,e=r["a"].options.methods.genActivatorListeners.call(this);return e.focus=function(e){t.getActivator(e),t.runDelay("open")},e.blur=function(e){t.getActivator(e),t.runDelay("close")},e.keydown=function(e){e.keyCode===u["y"].esc&&(t.getActivator(e),t.runDelay("close"))},e},genActivatorAttributes:function(){return{"aria-haspopup":!0,"aria-expanded":String(this.isActive)}},genTransition:function(){var t=this.genContent();return this.computedTransition?this.$createElement("transition",{props:{name:this.computedTransition}},[t]):t},genContent:function(){var t;return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-tooltip__content",class:(t={},Object(n["a"])(t,this.contentClass,!0),Object(n["a"])(t,"menuable__content__active",this.isActive),Object(n["a"])(t,"v-tooltip__content--fixed",this.activatorFixed),t),style:this.styles,attrs:this.getScopeIdAttrs(),directives:[{name:"show",value:this.isContentActive}],ref:"content"}),this.getContentSlot())}},render:function(t){var e=this;return t(this.tag,{staticClass:"v-tooltip",class:this.classes},[this.showLazyContent((function(){return[e.genTransition()]})),this.genActivator()])}})},8169:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",{attrs:{"fill-height":"",fluid:""}},[t.callResult.loading?a("v-sheet",{staticClass:"pa-3",attrs:{color:"grey lighten-2"}},[a("v-skeleton-loader",{attrs:{type:"card"}})],1):t._e(),a("v-row",{attrs:{justify:"center"}},t._l(t.projectData,(function(e){return a("v-col",{key:e.projectTitle},[a("LotteryCard",{attrs:{ethereumData:t.ethereumData,archive:t.archive,lottery:e}})],1)})),1)],1)},r=[],i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",{staticClass:"rounded-lg",staticStyle:{width:"450px"},attrs:{color:"blue lighten-1",elevation:"0",height:"300"}},[a("v-card-title",{staticClass:"white--text subtitle-2"},[t._v(t._s(t.lottery.projectTitle))]),a("v-card-text",[a("v-row",{staticClass:"text-center"},[a("v-col",[a("span",{staticClass:"title white--text"},[t._v("Jackpot "),a("br")]),a("span",{staticClass:"headline white--text"},[t._v(" "+t._s(t.calculateEthAmount())+" "+t._s(null!=this.ethereumData?this.ethereumData.symbol:""))]),a("br"),a("span",{staticClass:"subtitle-1 white--text"},[t._v(" "+t._s(t.calculateEthPrice())+" ")]),a("br"),a("span",{staticClass:"subtitle-1 white--text"},[t._v(" "+t._s(t.lottery.lotteryRewards.length)+" winners ")])])],1),a("v-row",{staticClass:"text-center"},[a("v-col",{staticClass:"white--text"},[a("div",[t._v(" "+t._s(t._f("two_digits")(t.days))+" days "+t._s(t._f("two_digits")(t.hours))+":"+t._s(t._f("two_digits")(t.minutes))+":"+t._s(t._f("two_digits")(t.seconds))+" ")])])],1)],1),a("v-card-actions",{staticClass:"justify-center"},[a("v-chip",{attrs:{color:"accent","text-color":"white"},on:{click:function(e){return t.lotteryDetail(t.lottery)}}},[t._v(t._s(t.getBtnLabel()))])],1)],1)},s=[],o=a("5530"),c=(a("b65f"),a("b680"),{name:"LotteryCard",data:function(){return{now:Math.trunc((new Date).getTime()/1e3)}},props:{ethereumData:{type:Object,default:null},lottery:{type:Object,required:!0},archive:{type:Boolean,default:!1}},computed:{dateInMilliseconds:function(){return Math.trunc(Date.parse(this.formatDateToTimer(this.lottery.deadlineTime))/1e3)},seconds:function(){return(this.dateInMilliseconds-this.now)%60},minutes:function(){return Math.trunc((this.dateInMilliseconds-this.now)/60)%60},hours:function(){return Math.trunc((this.dateInMilliseconds-this.now)/60/60)%24},days:function(){return Math.trunc((this.dateInMilliseconds-this.now)/60/60/24)}},mounted:function(){var t=this;window.setInterval((function(){t.now=Math.trunc((new Date).getTime()/1e3)}),1e3)},methods:{calculateEthAmount:function(){return parseFloat(this.$web3.utils.fromWei(this.lottery.currentAmount,"ether")).toFixed(3)},calculateEthPrice:function(){var t=null!=this.ethereumData?parseFloat(this.ethereumData.current_price)*this.$web3.utils.fromWei(this.lottery.currentAmount,"ether"):0;return t.toFixed(2)+"€"},formatDateToTimer:function(t){return this.$utils.formatDateToTimer(new Date(+t))},getLotteryStatus:function(){return this.lottery.deadlineTime<(new Date).getTime()?"closed":"open"},getBtnLabel:function(){return this.archive?"See Details":"Get tickets from "+this.lottery.ticketPrice+" ETH"},lotteryDetail:function(t){this.$router.push({name:"LotteryDetail",params:{address:this.lottery.contract._address,obj:Object(o["a"])({},t),ethData:Object(o["a"])({},this.ethereumData)}})}}}),l=c,u=a("2877"),h=a("6544"),d=a.n(h),f=a("b0af"),p=a("99d9"),m=a("cc20"),v=a("62ad"),g=a("0fd9"),b=Object(u["a"])(l,i,s,!1,null,"35712360",null),y=b.exports;d()(b,{VCard:f["a"],VCardActions:p["a"],VCardText:p["c"],VCardTitle:p["d"],VChip:m["a"],VCol:v["a"],VRow:g["a"]});var _={name:"LotteryList",components:{LotteryCard:y},props:{ethereumData:{type:Object,default:null},projectData:{type:Array,required:!0},archive:{type:Boolean,default:!1},callResult:{type:Object,required:!0}},methods:{closedOpenLabel:function(){return this.archive?"CLOSED":"OPEN"}}},w=_,x=a("a523"),k=a("8dd9"),T=a("3129"),D=Object(u["a"])(w,n,r,!1,null,null,null);e["a"]=D.exports;d()(D,{VCol:v["a"],VContainer:x["a"],VRow:g["a"],VSheet:k["a"],VSkeletonLoader:T["a"]})},9734:function(t,e,a){},"9b95":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",[a("v-card-title",[t._v(" Recent transactions "),a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Search by Address / Txn Hash","single-line":"",outlined:"",dense:"","hide-details":""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),a("v-data-table",{attrs:{headers:t.headers,items:t.transactions,search:t.search,loading:t.loading,"sort-by":t.sortBy,"sort-desc":t.sortDesc,page:t.page,"items-per-page":t.offset,"no-data-text":"No transactions found","loading-text":"Loading transactions. Please wait."},on:{"update:sortBy":function(e){t.sortBy=e},"update:sort-by":function(e){t.sortBy=e},"update:sortDesc":function(e){t.sortDesc=e},"update:sort-desc":function(e){t.sortDesc=e},"update:page":function(e){t.page=e}},scopedSlots:t._u([{key:"header.age",fn:function(e){var n=e.header;return[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on,i=e.attrs;return[a("span",t._g(t._b({staticClass:"primary--text",staticStyle:{cursor:"pointer"},attrs:{attrs:"attrs"},on:{click:function(e){return t.changeTimeFormat()}}},"span",i,!1),r),[t._v(t._s(n.text))])]}}],null,!0)},[a("span",[t._v("Click to show "+t._s(t.dateTimeFormat?"Age Format":"Datetime Format"))])])]}},{key:"item.value",fn:function(e){var n=e.item;return["buyTicket"==n.method?a("v-chip",{attrs:{color:"accent"}},[t._v(" "+t._s(t.$web3.utils.fromWei(n.value,"ether"))+" ")]):t._e()]}},{key:"item.hash",fn:function(e){var n=e.item;return[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on,i=e.attrs;return[a("a",t._g(t._b({attrs:{href:"https://rinkeby.etherscan.io/tx/"+n.hash,target:"_blank"}},"a",i,!1),r),[t._v(t._s(t.truncateStart(n.hash)))])]}}],null,!0)},[a("span",[t._v(t._s(n.hash))])])]}},{key:"item.from",fn:function(e){var n=e.item;return[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on,i=e.attrs;return[a("span",t._g(t._b({},"span",i,!1),r),[t._v(t._s(t.truncateStart(n.from)))])]}}],null,!0)},[a("span",[t._v(t._s(n.from))])])]}},{key:"item.to",fn:function(e){var n=e.item;return[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on,i=e.attrs;return[a("span",t._g(t._b({},"span",i,!1),r),[a("v-icon",{attrs:{small:""}},[t._v("mdi-file-document")]),t._v(t._s(t.truncateStart(n.to)))],1)]}}],null,!0)},[a("span",[t._v(" "+t._s(n.to)+" ")])])]}},{key:"item.age",fn:function(e){var a=e.item;return[t._v(" "+t._s(t.dateTimeFormat?a.dateTime:t.dateInMilliseconds(a.age))+" ")]}}],null,!0)})],1)},r=[],i=a("1da1"),s=(a("96cf"),a("b65f"),a("a630"),a("3ca3"),a("d3b7"),a("99af"),a("b0c0"),a("14b0"),a("dde5")),o={name:"RecentTransactions",props:{projectAddresses:{type:Array,required:!0}},data:function(){return{search:"",loading:!1,headers:[{text:"Tx Hash",align:"start",sortable:!1,value:"hash"},{text:"From",value:"from",sortable:!1},{text:"To",value:"to",sortable:!1},{text:"Value (eth)",value:"value",sortable:!1},{text:"Age",value:"age",sortable:!1},{text:"Method",value:"method",sortable:!1},{text:"Tickets",value:"tickets",sortable:!1}],sortBy:"timeStamp",sortDesc:!0,transactions:[],page:1,pageCount:2,offset:10,dateTimeFormat:!1,now:Math.trunc((new Date).getTime()/1e3)}},created:function(){0!=this.projectAddresses.length&&this.getAllTransactions()},methods:{updatePage:function(){this.getAllTransactions()},dateInMilliseconds:function(t){var e=Math.trunc(Date.parse(t)/1e3),a=Math.abs((e-this.now)%60),n=Math.abs(Math.trunc((e-this.now)/60)%60),r=Math.abs(Math.trunc((e-this.now)/60/60)%24),i=Math.abs(Math.trunc((e-this.now)/60/60/24)),s="",o=Math.abs(e-this.now);return s=o<60?a+" sec":o>=60&&o<3600?n+" mins":o>=3600&&o<86400?r+" hrs "+n+" mins":i+" days ",s+" ago"},parseDateToAge:function(){return this.minutes},changeTimeFormat:function(){this.dateTimeFormat=!this.dateTimeFormat},decodeInputData:function(t){var e=this.$abiDecoder.decodeMethod(t);return e},getDateFormat:function(t){return this.$utils.formatDate(new Date(1e3*+t))},truncateMiddle:function(t,e){return t?t.substr(0,18)+"..."+t.substr(t.length-3,t.length):""},truncateStart:function(t){return t?t.substr(0,18)+"...":""},getAllTransactions:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.transactions=[],t.loading=!0,e.next=4,Array.from(t.projectAddresses,(function(e){s["a"].getTransactionsByAccount(e,t.page,t.offset).then((function(e){null!=e.data&&(t.transactions=t.transactions.concat(e.data.result),Array.from(t.transactions,(function(e){e.age=new Date(1e3*e.timeStamp),e.dateTime=t.getDateFormat(e.timeStamp);var a=t.decodeInputData(e.input);e.method=a.name,0!=a.params.length&&(e.tickets=a.params[1].value)})))})).catch((function(t){})).finally((function(){t.loading=!1}))}));case 4:case"end":return e.stop()}}),e)})))()},createProject:function(){this.$router.push("/CreateProject")}}},c=o,l=a("2877"),u=a("6544"),h=a.n(u),d=a("b0af"),f=a("99d9"),p=a("cc20"),m=a("8fea"),v=a("132d"),g=a("2fa4"),b=a("8654"),y=a("3a2f"),_=Object(l["a"])(c,n,r,!1,null,null,null);e["a"]=_.exports;h()(_,{VCard:d["a"],VCardTitle:f["d"],VChip:p["a"],VDataTable:m["a"],VIcon:v["a"],VSpacer:g["a"],VTextField:b["a"],VTooltip:y["a"]})},dde5:function(t,e,a){"use strict";a("96cf");var n=a("1da1"),r=a("82c7");function i(t){return s.apply(this,arguments)}function s(){return s=Object(n["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,r["a"].get("",{params:{module:"account",action:"balance",address:e,tag:"latest"}});case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)}))),s.apply(this,arguments)}function o(t,e,a){return c.apply(this,arguments)}function c(){return c=Object(n["a"])(regeneratorRuntime.mark((function t(e,a,n){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,r["a"].get("",{params:{module:"account",action:"txlist",address:e,startblock:0,endblock:"latest",sort:"desc"}});case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)}))),c.apply(this,arguments)}function l(){return u.apply(this,arguments)}function u(){return u=Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,r["a"].get("",{params:{module:"account",action:"txlistinternal",startblock:0,endblock:99999999,page:1,offset:10,sort:"asc"}});case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)}))),u.apply(this,arguments)}function h(t){return d.apply(this,arguments)}function d(){return d=Object(n["a"])(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,r["a"].get("",{params:{module:"proxy",action:"eth_getTransactionCount",address:e,endblock:"latest"}});case 2:return t.abrupt("return",t.sent);case 3:case"end":return t.stop()}}),t)}))),d.apply(this,arguments)}var f={getBalanceByAccount:function(t){return i(t)},getTransactionCountByAccount:function(t){return h(t)},getTransactionsByAccount:function(t,e,a){return o(t,e,a)},getTransactionsByBlockRange:function(){return l()}};e["a"]=f},f301:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("LotteryWrapper")},r=[],i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("v-list",[a("LotteryList",{attrs:{"call-result":t.callResult,ethereumData:null!=t.ethereumData?t.ethereumData[0]:null,projectData:t.projectData}}),a("RecentWinners",{staticClass:"ma-2"}),t.callResult.finished?a("RecentTransactions",{staticClass:"ma-2",attrs:{"project-addresses":t.projectAddresses}}):t._e()],1)],1)},s=[],o=a("3835"),c=a("1da1"),l=(a("d3b7"),a("159b"),a("25f0"),a("96cf"),a("14b0")),u=a("0f22"),h=a("8169"),d=a("9b95"),f=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",[a("v-card-title",[t._v("Recent Winners ")]),a("v-card-text",[a("v-fade-transition",[t.loadingState.finished?a("v-row",[t._l(t.lotteries,(function(e){return t._l(e,(function(e){return a("v-col",{key:e.id},[a("v-card",{staticStyle:{"min-width":"240px"},attrs:{elevation:"0"}},[a("v-card-title",[t._v(t._s(e.value)+" eth")]),a("v-card-subtitle",[t._v(t._s(e.account))])],1)],1)}))}))],2):t._e()],1),t.loadingState.finished?t._e():a("v-sheet",{staticClass:"pa-3",attrs:{color:"grey lighten-2"}},[a("v-skeleton-loader",{attrs:{type:"list-item-two-line"}})],1)],1),a("v-card-actions")],1)},p=[],m=(a("b680"),{name:"RecentWinners",data:function(){return{loadingState:{finished:!0,error:""},search:"",lotteries:[]}},created:function(){this.loadData()},methods:{loadData:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.loadingState.finished=!1,e.next=3,t.$utils.delay(200).then((function(){l["a"].methods.getLatestWinners().call().then((function(e){for(var a=0;a<e.length;a++){t.winners=[];for(var n=e[a],r=n[0],i=n[1],s=n[2],o=0;o<r.length;o++){var c={};c.value=parseFloat(t.$web3.utils.fromWei(r[o],"ether")).toFixed(3),c.account=i[o],c.id=c.account+s,t.winners.push(c)}t.lotteries.push(t.winners)}})).catch((function(e){t.loadingState.error=e})).finally((function(){t.loadingState.finished=!0}))}));case 3:case"end":return e.stop()}}),e)})))()}}}),v=m,g=a("2877"),b=a("6544"),y=a.n(b),_=a("b0af"),w=a("99d9"),x=a("62ad"),k=a("0789"),T=a("0fd9"),D=a("8dd9"),j=a("3129"),S=Object(g["a"])(v,f,p,!1,null,null,null),C=S.exports;y()(S,{VCard:_["a"],VCardActions:w["a"],VCardSubtitle:w["b"],VCardText:w["c"],VCardTitle:w["d"],VCol:x["a"],VFadeTransition:k["d"],VRow:T["a"],VSheet:D["a"],VSkeletonLoader:j["a"]});a("dde5");var O={name:"LotteryWrapper",components:{LotteryList:h["a"],RecentTransactions:d["a"],RecentWinners:C},data:function(){return{projectData:[],account:null,ethereumData:null,projectAddresses:[],callResult:{finished:!1,error:""}}},mounted:function(){},created:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.$xapi.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=ethereum").then((function(e){t.ethereumData=e.data})),e.next=3,t.$web3.eth.getAccounts().then((function(e){var a=Object(o["a"])(e,1);t.account=a[0]}));case 3:t.getProjects();case 4:case"end":return e.stop()}}),e)})))()},methods:{getProjects:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return l["a"].methods.returnAllLotteries().call().then((function(e){t.projectAddresses=e,console.log(e)})).catch((function(t){})).finally((function(){})),e.next=3,l["a"].methods.returnOpenProjects().call().then((function(e){e.forEach((function(e){var a=Object(u["a"])(e),n=null;a.methods.getDetails(t.account).call().then((function(e){n=e,n.isLoading=!1,n.contract=a,n.ticketPrice=t.$web3.utils.fromWei(n.ticketPrice,"ether"),n.deadlineTime=n.deadlineTime.toString()+"000",n.lotteryDateCreated=n.lotteryDateCreated.toString()+"000",t.projectData.push(n)})).catch((function(t){console.log(t)})).finally((function(){t.callResult.finished=!0})),a.methods.getPlayersDetails().call().then((function(t){n.players=t.lotteryPlayers,n.tickets=t.lotteryTickets})).catch((function(t){}))}))})).catch((function(t){console.log(t)})).finally((function(){t.callResult.finished=!0}));case 3:case"end":return e.stop()}}),e)})))()}}},A=O,L=a("a523"),R=a("8860"),B=Object(g["a"])(A,i,s,!1,null,null,null),V=B.exports;y()(B,{VContainer:L["a"],VList:R["a"]});var M={name:"LotteryPage",components:{LotteryWrapper:V}},$=M,E=Object(g["a"])($,n,r,!1,null,null,null);e["default"]=E.exports}}]);
//# sourceMappingURL=LotteryWrapper.36c81e5f.js.map