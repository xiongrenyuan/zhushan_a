require.config({
	baseUrl: '../common/',
	paths: {
		jquery: "js/jquery-3.2.1.min",
		h5utils: "js/h5_utils",
		vue: "js/vue221"

	}
});

define(function(require, exports, module) {
	var $ = require('jquery');
	var utils = require('h5utils');
	var Vue = require('vue');

	$(function() {
		var dataApp = new Vue({
			el: "#all_con",
			data: {
				title: null,
				percent: 100,
				left: 225,
				leftBC: "#ccc",
				right: 225,
				rightBC: "#ccc",
				undone_num: 0,
				finish_num: 0,
				all_num: null,
				union_id: null,
				id: null,
				admin: true,
				dataContop: [],
				dataCon: null,
				ip: "https://zszxapi.yuanyuedu.com/",
			},
			mounted() {
				this.getuserid();
			},
			methods: {
				// 获取用户id以及访问参数
				getuserid: function() {
					var that = this;
//					that.union_id = '14281';
//					that.required();
					
//					//获取上一页传递的参数
					that.id = utils.getQueryParam("fid");
					that.title = utils.getQueryParam("title");
					if(that.title.length > 13) {
						that.title = that.title.substring(0, 13) + "...";
					}
					$("title").text(that.title);
					utils.getUserInfo(1, function(rsp) {

						if(!rsp.account_id) {
							utils.exitApp();
						} else {
							that.union_id = rsp.union_id;
							that.required();
						}
					});
                    

				},
				required: function() {
					var that = this;

					//  获取班级评比的详细数据
					$.ajax({
						headers: {
							union_id: that.union_id
						},
						type: "get",
						url: that.ip + "teacher_material/detail",
						async: false,
						data: {
							id: that.id,
//                          id:17
						},
						success: function(data) {
                     		    if(data.error_code != 1000){
                    				$(".all_box").append('<p class="middleF" style="color:#6ab85c;">服务器正忙,请稍后重试...</p>');
                    				setTimeout('$(".middleF").hide()',3000);
                    				
                    			}									
																	
																
							that.dataContop = data.extra;
							that.dataCon = data.extra.data;
							that.all_num = data.extra.data.length;
						    that.finish_num = 0;
						    that.undone_num = 0;
							console.log(that.dataContop);
							for(var i = 0; i < that.dataCon.length; i++) {
								if((that.dataCon[i].status) == "未上传") {
									that.undone_num++;

								}
							}
					        that.finish_num = that.all_num - that.undone_num;
							$(".loading").hide();
							$(".all_box").show();
							that.loadPercent(that.finish_num, that.all_num);
							that.move();
							that.$nextTick(function() {
								that.tankuang();
							})

						},
						error: function(err) {

							console.log("获取评比项情失败");
							console.log(err);
						}
					});

				},
				loadPercent: function(num1, num2) {
					console.log(num1);
					console.log(num2);
					var percent = num1 / num2 * 100;
					var allDeg = percent * 3.6;
					console.log(allDeg);
					if(allDeg >= 180) {
						var tmpDeg = allDeg - 180;
						this.left = 45 + tmpDeg;
						this.right = 225
						this.leftBC = "#53B369";
						this.rightBC = "#53B369";
					} else {
						this.right = 45 + allDeg;
						this.rightBC = "#53B369";
						this.leftBC = "#E6E6E6";
					}
					$(".circleProgress.rightcircle").css({
						"-webkit-transform": "rotate(" + this.right + "deg)",
						"border-left": "20px solid " + this.rightBC,
						"border-bottom": "20px solid " + this.rightBC
					});
					$(".circleProgress.leftcircle").css({
						"-webkit-transform": "rotate(" + this.left + "deg)",
						"border-top": "20px solid " + this.leftBC,
						"border-right": "20px solid " + this.leftBC
					})
				},
				move: function() {
					console.log("hello");
					var that = this;
					$(".all_box").bind("scroll", function() {
						console.log("111111");
						var moveH = $(".all_box").scrollTop();
						console.log(moveH);
						if(moveH >= 315) {
							$("thead").addClass("move");
						}
						if(moveH <= 280) {
							$("thead").removeClass("move");
						}

					})

				},
				tankuang: function() {
					console.log("1111");
					console.log($(".title_con"));
					$(".title_con").bind("click", function() {
						$(".choose_url").show();
					});
					$(".cancel").bind("click", function() {
						$(".choose_url").hide();
					})
					$(".li_all li").bind("click", function() {
						var url = $(this).attr("fid");
						$("body").append("<iframe src='https://view.officeapps.live.com/op/view.aspx?src=" + url + "'" +
							"width='100%' height='100%' frameborder='0'>This is an embedded" +
							+"</iframe>");
					})

				},

				test: function(e) {
					if(e == "已上传") {
						return 'finish_status';
					} else if(e == "未上传") {
						return 'undone_status';
					} else {
						return 'core_status';
					}

				}
			}

		})

	})
})