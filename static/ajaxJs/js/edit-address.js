import httpRequest from '../common/http.js';
import storage from '../common/storage.js';
import calculation from '../common/calculation.js';
import common from '../common/index.js';

window.saveAddress = () => {


	common.showLoading()
	//表单校验
	let billformData = {};
	let isError = false;
	$($("#bill-form").serializeArray()).each(function () {
		billformData[this.name] = this.value;
		// if (!billformData[this.name]) {
		// 	$(`#${this.name}`).css('border', ' 1px solid red')
		// 	isError = true;
		// } else {
		// 	$(`#${this.name}`).css('border', '1px solid #ebebeb')
		// }
	}); 
	let shipformData = {};

	$($("#ship-form").serializeArray()).each(function () {
		shipformData[this.name] = this.value;
		// if (!shipformData[this.name]) {
		// 	$(`#${this.name}`).css('border', ' 1px solid red')
		// 	isError = true;
		// } else {
		// 	$(`#${this.name}`).css('border', '1px solid #ebebeb')
		// }
	}); 

	// if (isError) {
	// 	common.hideLoading()
	// 	$.toast({
	// 		text: 'Please provide complete information',
	// 		icon: 'error',
	// 	})
	// 	return;
	// }

	httpRequest("/account/amendmentBill", "post", {
		param: {
			bill: billformData,
			ship: shipformData
		}
	}).then(res => {

	}).catch().finally()

}


const getUserInfo = () => {
	if(!storage.getStorageData("token"))return;
	httpRequest("/account/getUserInfo", "get").then(res => {
		let param = res.data.param;
		if (param) {
			$.each(param.bill, function (key, value) {
				$('#' + key).val(value);
			});
			$.each(param.ship, function (key, value) {
				$('#' + key).val(value);
			});
		}
	}).catch().finally()
}
getUserInfo()