require.config({
	baseUrl:'../common/',
	paths:{
		jquery:"js/jquery-1.8.3.min",
		h5utils: "js/h5_utils",
		vue:"js/vue221"
		
	}
});
define(function(require,exports,module){
	var $ = require('jquery');
	var utils = require('h5utils');
	var Vue = require('vue');	
	$(function(){
	utils.clearNativeMenu();
	var dataApp = new Vue({
		el:"#all_con",
		data:{
			union_id:null,
			dataCon:null,
			ip:"https://zszxapi.yuanyuedu.com/",
		},
		mounted(){
			this.getuserid();
			this.centralize();
		},
		methods:{
			getuserid:function(){
				var that = this;
				utils.getUserInfo(1, function (rsp) {
					
	            if (!rsp.account_id) {
	                utils.exitApp();
	            }
	            else {
	            	that.union_id = rsp.union_id;

	                that.required();
	            }
               });
               
               
               
			},	
			required:function(){
				var that = this;
                    //根据用户id，显示展示情况                   
                    $.ajax({
                    	headers:{
                    		union_id:that.union_id
//                          unicon_id:"00004"
                    	},
                    	type:"get",
                    	url:that.ip +  "teacher_material/progress",
                    	async:false,
                    	data:{
                    		type:5
                    	},
                    	success:function(data){
                     		    if(data.error_code != 1000){
                    				$(".all_box").append('<p class="middleF" style="color:#6ab85c;">服务器正忙,请稍后重试...</p>');
                    				setTimeout('$(".middleF").hide()',3000);
                    				
                    			}									
									                    		
                    		console.log(data);
                    		that.dataCon = data.extra.data;
                            $(".loading").hide();
                            $("#all_con").show();
                            
                    	},
                    	error:function(err){
                    		console.log(err);
                    	}
                    });				
				
				
				
				
			},			
             centralize:function(){
	            $(".main_all").on("click", ".conList", function () {
	            	var fid = $(this).attr("fid");
	            	var title = $(this).find($(".data_title")).text();
	            	console.log(title);
	            	var para = {
	            		"fid":fid,
	            		"title":title
	            	}
					utils.openNewWindow("submit_detail_admin.html",para);
               })  
             	
             	
             	
             	
             },
			
			
			
			
			
		}
	})
	
	
})

	
	
	
	
	
	
	
	
	
	
})