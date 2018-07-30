require.config({
	baseUrl:'../common/',
	paths:{
		jquery:"js/jquery-3.2.1.min",
		h5utils: "js/h5_utils",
		vue:"js/vue221"
		
	}
});

define(function(require,exports,module){
	var $ = require('jquery');
	var utils = require('h5utils');
	var Vue = require('vue');		
	
	$(function(){
		var dataApp = new Vue({
			el:"#all_con",
			data:{
				title:null,		
				union_id:null,
				id:null,		
				dataContop:[],
				dataCon:null,
				ip:"https://zszxapi.yuanyuedu.com/",

			},
			mounted(){
    			this.getuserid();		
//              this.move();
			},
			methods:{
			// 获取用户id以及访问参数
	            getuserid:function(){
	            	var that = this;
	                that.id = utils.getQueryParam("fid");
	                that.title = utils.getQueryParam("title");


	                if(that.title.length>13){
	                	that.title = that.title.substring(0,13)+"...";
	                }                
	                $("title").text(that.title);
					utils.getUserInfo(1, function (rsp) {
						
		            if (!rsp.account_id) {
		                utils.exitApp();
		            }
		            else {
		            	that.union_id = rsp.union_id;	
	                    that.required();
		            }
	               });            	
//                 that.union_id = '14281';
//                 that.required();

	            },	
    	         required:function(){
    	         	var that = this;
//	                    获取班级评比的详细数据    	 
					$.ajax({
	                    	headers:{
	                  		union_id:that.union_id
//	                            union_id:"00004"	                    		
	                    	},						
						type:"get",
						url:that.ip +  "teacher_material/detail",
						async:false,
						data:{
							id:that.id,
//                          id:17
						},
	                    success:function(data){
                     		    if(data.error_code != 1000){
                    				$(".all_box").append('<p class="middleF" style="color:#6ab85c;">服务器正忙,请稍后重试...</p>');
                    				setTimeout('$(".middleF").hide()',3000);
                    				
                    			}									
																	
										                    	
	                    	console.log(data);
      		                that.dataContop = data.extra;
	                        that.dataCon = data.extra.data;
	                        $(".loading").hide();
	                        $(".all_box").show();
	                        that.move();

	                    	},
	                    	error:function(err){
	                    		console.log("获取评比项情失败");
	                    		console.log(err);
	                    	}						
	
					});	
    	         },
	            test:function(e){
	               	if(e == "已上传"){
	               		return 'finish_status';
	               	}
	               	else if(e == "未上传"){
	               		return 'undone_status';
	               	}
	               	else{
	               		return 'core_status';
	               	} 
	              },
				move: function() {
					var that = this;
						$(".all_box").bind("scroll", function() {
							var moveH = $('.all_box').scrollTop();
							console.log(moveH);
							if(moveH >= 195) {
								$("thead").addClass("move");
							}
							if(moveH <= 155) {
								$("thead").removeClass("move");
							}
	
						})
	
	               },				
			
			
			
				
           
	            
	            
	            
			}
		})
		
		
		
	})
	
	
	
	
})
