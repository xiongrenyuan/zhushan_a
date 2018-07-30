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
	
	var push = function(){
		var req={
			"material_id":dataApp.material_id,
		}
		function onSuccess(){
			
		}
		
		function onError(){
			
		}
		utils.ajaxPost("https://zszxapi.yuanyuedu.com/teacher_material/push",req,onSuccess,onError)
	}
	$(function(){
		
		
		var dataApp = new Vue({
			el:"#all_con",
			data:{
				union_id:null,
				dataCon:null,
			    ip:"https://zszxapi.yuanyuedu.com/",
			    ipinfo:"https://zszxapi.yuanyuedu.com/",
			    material_id:null
			},
			mounted(){
				this.getuserid();
				this.centralize();
			},
			methods:{
			//获取当前用户id
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
//                  that.union_id = '14281';
//                  that.required();
			},
			required:function(){
            		var that = this;

                    //根据用户id，显示展示情况                   
                    $.ajax({
                    	headers:{
						    union_id:that.union_id		
                    	},
                    	type:"get",
                    	url:that.ip +  "teacher_material/progress",
                    	async:false,
                    	data:{
                    		type:1
                    	},
                    	success:function(data){
                     		    if(data.error_code != 1000){
                    				$(".all_box").append('<p class="middleF" style="color:#6ab85c;">服务器正忙,请稍后重试...</p>');
                    				setTimeout('$(".middleF").hide()',3000);
                    				
                    			}									
									
                    			
                    		console.log("获取进度列表成功！！！");
                    		console.log(data);
                    		that.dataCon = data.extra.data;
                    		$(".loading").hide();
                    		$(".all_box").show();
                    		that.$nextTick(function () {
                             //dom已更新
                            var l = $(".info_num").length;
							for(var i =0;i<l;i++){
								var num1 = $($(".info_num")[i]).attr("fida");
								var num2 = $($(".info_num")[i]).attr("fidb");
								endW = (num1/num2)*100 +'%';   
								console.log(endW);
								$($(".info_num")[i]).prev().children().animate({width:endW},1000);
								
							}                     
                           })
                            
                    	},
                    	error:function(err){
                    		console.log("获取进度列表失败！！！");
                    		console.log(err);
                    		
                    	}
                    });
   
            },
            centralize:function(){
            	var that = this;        	
	            $(".main_all").on("click",".conList",function () {
	            	var fid = $(this).attr("fid");
	            	var title = $(this).find($(".data_title")).text();
	            	var para = {
	            		"fid":fid,
	            		"title":title
	            	}
                    utils.openNewWindow("compare_detail_admin.html",para);
                    return false;
              })               
               
               $(".main_all ").on("click"," .info_title",function(event){
                
               	    event.stopPropagation();
               	    var material_id = $(this).parents("li").attr("fid");

//             	     that.material_id = material_id;
//                   push();
                     var jsondata={"material_id":material_id};
                     $.ajax({
                    	headers:{
                            school_id:"1003"	
                    	},                     	
                     	type:"post",
                     	url: that.ipinfo + "teacher_material/push",
                     	async:false,
                     	contentType: "application/json;charset=utf-8",
                     	data: JSON.stringify(jsondata),
                     	dataType:"json",
                     	success:function(data){
                     		    if(data.error_code != 1000){
                    				$(".all_box").append('<p class="middleF" style="color:#6ab85c;">服务器正忙,请稍后重试...</p>');
                    				setTimeout('$(".middleF").hide()',3000);
                    				
                    			}									
									
                     		if(data.error_code == 1000){
                     	    $(".info_box").show();
                            setTimeout('$(".info_box").hide()',3000);

                     			
                     		}
                     	},
                     	error:function(){
                     		console.log("失败！");
                     	}
                     });
	
               	
               })
            		
            		
            		
            	},
      
          				
			},
			
			
		})	

	})
})
