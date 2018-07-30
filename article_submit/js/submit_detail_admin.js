require.config({
	baseUrl: '../common/',
	paths: {
		jquery: "js/jquery-1.8.3.min",
		h5utils: "js/h5_utils",
		vue: "js/vue221"

	}
});
define(function(require, exports, module) {
		var $ = require('jquery');
		var utils = require('h5utils');
		var Vue = require('vue');	
	    $(function(){
	    	var dataApp = new Vue({
	    		el:"#all_con",
	    		data:{
						id: null,
						dataContop: null,
						dataCon: null,
						union_id: null,
						title:null,
						ip: "https://zszxapi.yuanyuedu.com/",

	    		},
	    		mounted() {
					this.getuserid();
					this.$nextTick(function(){
						this.move();
					})	    			
	    		},
	    		methods:{
						getuserid: function() {
							var that = this;
                            that.id = utils.getQueryParam("fid");

                            that.title = utils.getQueryParam("title");
                            $("title").text(that.title);                           
							utils.getUserInfo(1, function(rsp) {

								if(!rsp.account_id) {
									utils.exitApp();
								} else {
									that.union_id = rsp.union_id;
									that.centralize();
								}
							});

						},
						centralize: function() {
							var that = this;
							//	                    获取论文提交的详细数据
							$.ajax({
								headers: {
								  union_id:that.union_id
								},
								type: "get",
								url: that.ip + "teacher_material/detail",
								async: false,
								data: {
									id: that.id,
//                                  id:5
								},
								success: function(data) {
                     		    if(data.error_code != 1000){
                    				$(".all_box").append('<p class="middleF" style="color:#6ab85c;">服务器正忙,请稍后重试...</p>');
                    				setTimeout('$(".middleF").hide()',3000);
                    				
                    			}									
									
									that.dataContop = data.extra;
									that.dataCon = data.extra.data;
									$(".loading").hide();
									$("#all_con").show();
									that.move();
									that.$nextTick(function(){
										that.tankuang();
									})									
								},
								error: function(err) {
									console.log(err);
								}
							});
						},
						move: function() {
							$(".all_box").bind("scroll", function() {
								var moveH = $('.all_box').scrollTop();
								if(moveH >= 195) {
									$("thead").addClass("move");
								}
								if(moveH <= 155) {
									$("thead").removeClass("move");
								}

							})
						},						
						tankuang:function(){
							$(".title_con").bind("click",function(){
								$(".choose_url").show();
							});
							$(".cancel").bind("click",function(){
								$(".choose_url").hide();
							})
							$(".li_all li").bind("click",function(){
								var url = $(this).attr("fid");
								window.location.href="show.html?"+url;

							})
							
							
						} 						
						
						
	    	},
	    		
	    		
	    		
	    		
	    		
	    		
	    })
	    	    	
	})
})
