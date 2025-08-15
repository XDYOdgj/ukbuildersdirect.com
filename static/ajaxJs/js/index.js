import httpRequest from '../common/http.js';
import storage from '../common/storage.js';
import fit from '../common/fit.js';

/**
 * @Description:首页
 * @author:Howe
 * @param 商品列表
 * @return
 * @createTime: 2024-11-05 10:00:58
 * @Copyright by 红逸
 */



$(document).ready(function () {
	category()

});


//商品类型
const getRecommendList = async (type, id) => {
	await httpRequest("/goods/recommendList", "GET", {
		limit: 8,
		type: type,
		//	categoryId: id
	}).then(res => {
		let html = "";
		let rollHtml = "";

		res.data.forEach(item => {
			html = html + `<div
										class="product-item recent-product style-01 rows-space-30 col-bg-3 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-ts-6 post-36 product type-product status-publish has-post-thumbnail product_cat-table product_cat-bed product_tag-light product_tag-table product_tag-sock first instock sale shipping-taxable purchasable product-type-simple">
										<div class="product-inner tooltip-left">
											<div class="product-thumb">
												<a class="thumb-link" href="details/${item.linkTitle}">
													<img class="img-responsive  responsive-img"     style="object-fit:contain;background-color:#fff;"
														src="${item.image}" alt="${item.name}" >
												</a>
											</div>
											<div class="product-info equal-elem">
												<h3 class="product-name product_title ellipsis-omit">  
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
									</div>`

			rollHtml = rollHtml + `<div class="product-item recent-product style-01 rows-space-0 post-93 product type-product status-publish has-post-thumbnail product_cat-light product_cat-table product_cat-new-arrivals product_tag-table product_tag-sock first instock shipping-taxable purchasable product-type-simple  ">
                        <div class="product-inner tooltip-left">
                            <div class="product-thumb">
                                <a class="thumb-link" href="details/${item.linkTitle}" tabindex="0">
                                    <img  class="img-responsive  responsive-img" style="object-fit:contain;background-color:#fff;" src="${item.image}" alt="${item.name}" width="270" height="350">
                                </a>
                                <div class="flash">
                                    <span class="onnew"><span class="text">New</span></span></div>
                            </div>
                            <div class="product-info equal-elem">
                                <h3 class="product-name product_title ellipsis-omit">
                                    <a href="details/${item.linkTitle}" tabindex="0">${item.name}</a>
                                </h3>
                                <div class="rating-wapper nostar">
                                    <div class="star-rating"><span style="width:${item.score/5*100}%">Rated <strong class="rating">0</strong> out of 5</span></div>
                                   <span class="price"><del><span class="lynessa-Price-amount amount"><span
																class="lynessa-Price-currencySymbol">$</span>${item.price}</span></del>
													<ins><span class="lynessa-Price-amount amount"><span
																class="lynessa-Price-currencySymbol">$</span>${item.selling_price}</span></ins></span>
                            </div>
                        </div>
                    </div>
				</div>`;
		})

		$(`#response-product_${type}`).html(html);
		$(`#response-product_roll_${type}`).html(rollHtml);

		//渲染轮播
		setTimeout(() => {
			if ($('.owl-slick').length) {
				$('.owl-slick').each(function () {
					window.lynessa_init_carousel($(this));
				});
			}
		}, 200)

		setTimeout(() => {
			fit.adaptImgHeight(".responsive-img", 1);
		}, 300)
	}).catch().finally()
}


// 商品分类 随机取
const category = async () => {
	var category_list = storage.getStorageData("category_list");

	if (!category_list.length) {
		await httpRequest("/goods_category/list", "GET").then(res => {
			category_list = res.data;
			storage.setStorageData("category_list", category_list);
		}).catch().finally()
	}



	var categorys = [];

	category_list.forEach(item => {
		if (item.children && item.children.length) {
			item.children.forEach(listitem => {
				categorys.push(listitem)
			})
		}
	});

	// 随机取categorys中的3个
	let randomCategorys = [];
	for (let i = 0; i < 3; i++) {
		let index = Math.floor(Math.random() * categorys.length);
		randomCategorys.push(categorys[index]);
		categorys.splice(index, 1);
	}

	getRecommendList(2, randomCategorys[0].id)
	getRecommendList(4, randomCategorys[0].id)
	randomCategorys.forEach((item, index) => {
		let name = item.name.replace(/ /g, "_");
		let html = `<a target="_self" href="shop-list?id=${item.id}&title=`+name+`">${item.name}</a>`
		$(`.random_classify_${index+1}`).html(html)
	})

}
