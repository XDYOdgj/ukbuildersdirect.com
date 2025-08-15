/**
 * @Description:
 * @author:Howe
 * @param 商品列表
 * @return
 * @createTime: 2024-11-05 10:00:58
 * @Copyright by 红逸
 */


import httpRequest from '../common/http.js';
import fit from '../common/fit.js';

let from = {
	page: 1,
	limit: 16,
	category: null,
	search: ""
}
let totalCount = 0;

window.fnListSearch = () => {
	from.search = $('#lynessa-product-search-list').val();
	from.page = 1;
	getGoodsList();
}


$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	from.category = urlParams.get('id');
	from.search = urlParams.get('search');
	if (from.search) {
		$('#lynessa-product-search-list').val(from.search);
	}
	from.page = 1;
	getGoodsList()
});

//商品列表
const getGoodsList = () => {

	$("#products-list").html(
		`<div style="font-size: 30px; text-align: center; width: 100%; color: #cf9163; margin: 20px 0; padding: 10px 0; background: linear-gradient(90deg, #f4e2d8, #f8f4e5); border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    loading...
</div>`
	);

	httpRequest("/goods/list", "GET", from).then(res => {
		let html = "";
		res.data.data.forEach(item => {
			html = html + `<li class="product-item wow fadeInUp   rows-space-30 col-md-12   col-bg-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-ts-6 style-01  post-30 product type-product status-publish has-post-thumbnail product_cat-light product_cat-bed product_cat-specials product_tag-light product_tag-table product_tag-sock last instock featured downloadable shipping-taxable purchasable product-type-simple"
			data-wow-duration="1s" data-wow-delay="0ms" data-wow="fadeInUp">
							<div class="product-inner tooltip-left">
								<div class="product-thumb">
									<a class="thumb-link" href="details/${item.linkTitle}">
										<img class="img-responsive  responsive-img"     style="object-fit:contain;background-color:#fff;"
											src="${item.image}" alt="${item.name}" >
									</a> 
								</div>
								<div class="product-info equal-elem">
									<h3 class="product-name product_title ellipsis-multiline2">
										<a href="details/${item.linkTitle}">${item.name}</a>
									</h3>
									<div class="rating-wapper ">
										<div class="star-rating"><span style="width:${item.score/5*100}%">Rated <strong
													class="rating">5.00</strong> out of 5</span></div>
										<span class="review">(1)</span>
									</div>
									<span class="price"><del><span class="lynessa-Price-amount amount"><span
													class="lynessa-Price-currencySymbol">$</span>${item.price}</span></del>
										<ins><span class="lynessa-Price-amount amount"><span
													class="lynessa-Price-currencySymbol">$</span>${item.selling_price}</span></ins></span>
								</div>
							</div>
						</li>`
		})
		if (res.data.data.length) {
			$(`#products-list`).html(html);
		} else {
			$(`#products-list`).html(
				`<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">no data</div>`);
		}

		setTimeout(() => {
			fit.adaptImgHeight(".responsive-img", 1);
		}, 500)

		totalCount = res.data.count;
		// 初始化分页条，默认显示第一页

		if (totalCount && Math.ceil(totalCount / from.limit) > 1) {
			$("#pagination").html(createPagination(from.page, Math.ceil(totalCount / from.limit)));
		} else {
			$("#pagination").html("");
		}
	}).catch().finally()
}


/**
 * @Description:创建分页条的函数
 * @author:Howe
 * @param currentPage  当前页面
 * @param totalPages  总页数
 * @return
 * @createTime: 2024-11-04 23:43:55
 * @Copyright by 红逸
 */
const createPagination = (currentPage, totalPages) => {
	let paginationHtml = ""; // 初始化一个字符串，用于存放分页条的HTML代码
	// 如果当前页不是第一页，则生成一个“上一页”按钮
	if (currentPage > 1) {
		paginationHtml += "<li class='pagination-li'>&lt;</li>";
	}
	// 始终显示第一页的页码
	paginationHtml += generatePageNumberHtml(1, currentPage);
	// 如果总页数大于1页，则继续生成分页条的其余部分
	if (totalPages > 1) {
		// 如果当前页码大于3，则在第一页和当前页之间添加省略号
		if (currentPage > 3) {
			paginationHtml += "<li class='pagination-li'>...</li>";
		}
		// 遍历当前页附近的页码，并生成对应的分页按钮
		for (
			let i = Math.max(currentPage - 2, 2); i <= Math.min(currentPage + 2, totalPages - 1); i++
		) {
			paginationHtml += generatePageNumberHtml(i, currentPage);
		}
		// 如果当前页码小于总页数减去2，则在当前页和最后一页之间添加省略号
		if (currentPage < totalPages - 2) {
			paginationHtml += "<li class='pagination-li'>...</li>";
		}
	}

	// 始终显示最后一页的页码
	paginationHtml += generatePageNumberHtml(totalPages, currentPage);

	// 如果当前页不是最后一页，则生成一个“下一页”按钮
	if (currentPage < totalPages) {
		paginationHtml += "<li class='pagination-li'>&gt;</li>";
	}

	// 返回生成的分页条HTML字符串
	return paginationHtml;
}

// 生成单个页码按钮的HTML的函数
const generatePageNumberHtml = (pageNumber, currentPage) => {
	// 返回一个格式化后的HTML字符串，包含激活状态的判断
	return (
		'<li class="pagination-li ' +
		(pageNumber === currentPage ? "pagination-active" : "") +
		'">' +
		pageNumber +
		"</li>"
	);
}

// 选择页码的函数
const selectPage = (pageNumber) => {
	// 更新当前页码的变量，并重新生成分页条
	from.page = pageNumber;
	getGoodsList()
}


// 为分页条上的每个按钮绑定点击事件
$("#pagination").on("click", "li", function (event) {
	let pageNumber = $(this).text(); // 获取点击的页码或按钮文本

	// 如果点击的是省略号，则不执行任何操作
	if (pageNumber === "...") {
		event.preventDefault();
		return;
	}

	// 移动到页面顶部 加载动画
	$('html, body').animate({
		scrollTop: 350
	}, 500);

	var currentPage = from.page;

	// 根据点击的按钮，调用selectPage函数更新当前页码
	if (pageNumber === "<") {
		selectPage(currentPage - 1);
	} else if (pageNumber === ">") {
		selectPage(currentPage + 1);
	} else {
		selectPage(parseInt(pageNumber));
	}
});
