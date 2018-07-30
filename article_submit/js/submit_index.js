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
    var menujson = [{
        "name": "manage",
        "title": "管理"
    }];	
	
	$(function(){
	var dataApp = new Vue({
		el:"#all_con",
		data:{
			admin:false,
			undoneShow :true,
			completeShow : false,
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
				var  that = this;
				utils.getUserInfo(1, function (rsp) {
					
	            if (!rsp.account_id) {
	                utils.exitApp();
	            }
	            else {
	            	that.union_id = rsp.union_id;
	                that.required();
	            }
               });
//              that.union_id = '14281';
//              that.required();
			},	
			required:function(){
            var that = this;
            //判断当前用户是否是管理员
            $.ajax({
            	type:"get",
            	url: that.ip +  "/teacher_material/admin",
            	async:false,
            	data:{
            		type:5,  
            	},
            	success:function(data){
            		      if(data.error_code != 1000){
                    			$(".all_box").append('<p class="middleF" style="color:#6ab85c;">无法获取权限,请稍后重试...</p>');
                    			setTimeout('$(".middleF").hide()',3000);
                    				
                    		}            		
                    if (data.error_code === 1000) {
                         for(var i = 0 ;i < data.extra.data.length;i++){
                            if( that.union_id == data.extra.data[i]){
                            	that.admin = true;
                            }
                                
                         }
                            
                       }
                    if(that.admin == true){
                    	    utils.setupNativeMenu(menujson,function(data){
                    	    	var url = utils.getAbsoluteUrl("submit_progress.html");
							    utils.openNewWindow(url);
                    	    });
					}
       
                    //根据用户id，显示展示情况                   
                    $.ajax({
                    	headers:{
                    		union_id:that.union_id
                            
                        },
                    	type:"get",
                    	url:that.ip +  "teacher_material/list",
                    	async:false,
                    	data:{
                    		type:5
                    	},
                    	success:function(data){
                     		    if(data.error_code != 1000){
                    				$(".all_box").append('<p class="middleF" style="color:#6ab85c;">服务器正忙,请稍后重试...</p>');
                    				setTimeout('$(".middleF").hide()',3000);
                    				
                    			}									
																	
									                    		
                    		that.dataCon = data.extra.data;
                    		$(".loading").hide();
                    		$(".data_show").show();

                            
                    	},
                    	error:function(err){
                    		console.log(err);
                    	}
                    });
   
            	},
            	error:function(err){
                    console.log(err);            		
            	}
            	
            });
            
        },// 集中绑定事件
	            centralize: function () {
	                var that = this;
	                $(".top_con").click(function () {
	                    $(this).siblings().removeClass("topFocus");
	                    $(this).addClass("topFocus");
	
	                });
	              $(".topL").click(function () {
	                  that.undoneShow = true;
	                  that.completeShow = false;
	              });
	
	              $(".topR").click(function () {
	                  that.undoneShow = false;
	                  that.completeShow = true;
	              });

	              $(".main").on("click", ".conList", function () {
	              	var fid = $(this).attr("fid");
	                var title = $(this).find($(".data_title")).text();
	              	var para = {
	              		"fid":fid,
	              		"title":title
	              	}

                    utils.openNewWindow("submit_detail_user.html", para);
                    
                })
                
	            },

            myfilter: function (value) {
                var date = value;
                var time = new Date(date.replace(/-/g,'/')).getTime();
                var nowTime = new Date().getTime()
                if (time > nowTime) {
                    return 1;
                } else {
                    return 0;
                }
            },
			
		}
	})
	
	
	
	
	
})	
	
	
	
	
	
	
	
	
	
})