$(function(){
url = window.location.search.substr(1);
	
$("body").append("<iframe src='https://view.officeapps.live.com/op/view.aspx?src=" + url + "'" +
					"width='100%' height='100%' frameborder='0'>This is an embedded" +
					+"</iframe>");	
})

