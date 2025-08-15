import common from '../common/index.js';

var swiper = new Swiper(".mySwiper", {
	spaceBetween: 10,
	slidesPerView: 4,
	freeMode: true,
	watchSlidesProgress: true,
});
var swiper2 = new Swiper(".mySwiper2", {
	spaceBetween: 10,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
	thumbs: {
		swiper: swiper,
	},
});

if (!common.isMobile()) {
	jQuery(function(productImageEnlarged) {
		productImageEnlarged(".lynessa-product-gallery .lynessa-product-gallery__image").zoom()
	})
} else {
	var targetOffset = $('#product-27').offset().top;
	$('html, body').animate({
		scrollTop: targetOffset
	}, 10); // 动画持续时间为1000毫秒
}