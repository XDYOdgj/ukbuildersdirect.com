import httpRequest from '../common/http.js';
import storage from '../common/storage.js';
import calculation from '../common/calculation.js';
import appConfig from '../config/appConfig.js';
import common from '../common/index.js';

$(document).ready(function() {
	//加载头部
	if (common.isSingleProduct()) {
		$('#foot').load('../static/html/foot  #footer-single-product', function() {
			// footer加载完成后初始化
			getInit();
			$('.clickAccountBut').click(function() {
				console.log("clickAccountBut")
				if (storage.getStorageData("token")) {
					window.location.href = "../edit-account"
				} else {
					window.location.href = "../login"
				}
			});
		});
	} else {
		$('#foot').load('./static/html/foot.html #footer-html', function() {
			// footer加载完成后初始化
			getInit();
			$('.clickAccountBut').click(function() {
				console.log("clickAccountBut")
				if (storage.getStorageData("token")) {
					window.location.href = "./edit-account"
				} else {
					window.location.href = "./login"
				}
			});
		});
	}

	//判断token  渲染下拉列表
	if (storage.getStorageData("token")) {
		$(".sub-menu").show();
	} else {
		$(".sub-menu").hide();
	}


	//监听输入框搜索回车搜索
	$('#livesearch1').keypress(function(event) {
		if (event.which === 13) { // 检查按键是否是回车键
			window.fnSearch(1)
		}
	});
	$('#livesearch2').keypress(function(event) {
		if (event.which === 13) { // 检查按键是否是回车键
			window.fnSearch(2)
		}
	});

});


/**
 * @Description:头部搜索
 * @author:Howe
 * @param
 * @return
 * @createTime: 2024-11-05 10:00:58
 * @Copyright by 红逸
 */
window.fnSearch = (type) => {
	if (common.isSingleProduct()) {
		window.location.href = `../shop-list?search=${$('#livesearch' + type).val()}`
	} else {
		window.location.href = `./shop-list?search=${$('#livesearch' + type).val()}`
	}
}

/**
 * @Description:退出登录
 * @author:Howe
 * @param
 * @return
 * @createTime: 2024-11-05 10:00:58
 * @Copyright by 红逸
 */
window.fnLogout = () => {
	if (confirm("Are you sure you want to log out ?")) { //if语句内部判断确认框
		storage.setStorageData("token", "");
		if (common.isSingleProduct()) {
			window.location.href = "../login"
		} else {
			window.location.href = "./login"
		}
	} else {}
}


//请求导航栏数据(分类)
const getGoodsCategoryList = async () => {
	let  category_list=[];
	await httpRequest("/goods_category/list", "GET").then(res => {
		category_list = res.data;
		storage.setStorageData("category_list", category_list);
	}).catch().finally()

	let html = ""
	category_list.forEach(item => {
		let itemhtml = "";
		if (item.children && item.children.length) {
			item.children.forEach(listitem => {
				let name = listitem.name.replace(/ /g, "_");
				itemhtml = itemhtml +
					`<li><a href="${common.isSingleProduct()?'../shop-list':'shop-list'}?id=${listitem.id}&title=`+name+`" target="_self">${listitem.name}</a></li>`
			})
		}
		let name = item.name.replace(/ /g, "_");
		html = html + `<div class="col-md-4">
								<div class="lynessa-listitem style-01">
								<div class="listitem-inner">
								<h4 class="title">
								<a href="${common.isSingleProduct()?'../shop-list':'shop-list'}?id=${item.id}&title=`+name+`" target="_self">
								${item.name} 
								</a>
								</h4>
								<ul class="listitem-list">
								${itemhtml}
								</ul>
								</div>
								</div>
								</div> `
	})

	$("#listitem-inner").html(html)
}


//
const getInit = async () => {
	let siteUpdateDate = storage.getStorageData("siteUpdateDate");
	const currentDate = common.getCurrentDate();
	const siteConfig = storage.getStorageData("siteConfig");
	//加载头部分类
	var category_list = storage.getStorageData("category_list");

	if (siteConfig && (currentDate === siteUpdateDate)) {
		console.log('使用缓存数据渲染联系信息:', siteConfig);
		$(".copyright").html(siteConfig.bottonIinformation)
		// 从缓存渲染联系信息
		renderContactInfo(siteConfig);
		return;
	};
	//站点访问+1
	await httpRequest("/statistics/visit", "GET").then(res => {}).catch().finally()
	//站点底部信息
	await httpRequest("/config", "GET", {
		type: ['phone', 'mail', 'site', 'bottonIinformation']
	}).then(res => {
		console.log('从服务器获取数据渲染联系信息:', res.data);
		$(".copyright").html(res.data.bottonIinformation)
		// 渲染联系信息
		renderContactInfo(res.data);
		storage.setStorageData("siteConfig", res.data)
	}).catch(err => {
		console.error('获取配置信息失败:', err);
	}).finally()
	//缓存日期
	storage.setStorageData("siteUpdateDate", currentDate);
}

// 渲染联系信息的辅助函数
const renderContactInfo = (data) => {
	console.log('开始渲染联系信息，数据:', data);
	console.log('footer元素数量:', $('.foot-la-phone').length, $('.foot-la-email').length, $('.foot-la-map').length);
	
	if ($('.foot-la-phone').length > 0) {
		$(".foot-la-phone").html(data.phone || '');
		console.log('手机号渲染完成:', data.phone);
	} else {
		console.warn('未找到 .foot-la-phone 元素');
	}
	
	if ($('.foot-la-email').length > 0) {
		$(".foot-la-email").html(data.mail || '');
		console.log('邮箱渲染完成:', data.mail);
	} else {
		console.warn('未找到 .foot-la-email 元素');
	}
	
	if ($('.foot-la-map').length > 0) {
		$(".foot-la-map").html(data.site || '');
		console.log('地址渲染完成:', data.site);
	} else {
		console.warn('未找到 .foot-la-map 元素');
	}
}

export default{
	getGoodsCategoryList
}
