import httpRequest from '../common/http.js';
import storage from '../common/storage.js';


httpRequest("/order/list", "GET").then(res => {
	let html = "";
	res.data.forEach(item => {
		html = html + `<tr class="lynessa-orders-table__row lynessa-orders-table__row--status-on-hold order">
  					<td class="lynessa-orders-table__cell lynessa-orders-table__cell-order-number"
					 data-title="Order">
					 <a href="#">${item.orderNo}</a>
												</td>
												<td class="lynessa-orders-table__cell lynessa-orders-table__cell-order-date"
													data-title="Date">
													<time >${item.createtime}</time>

												</td>
												<td class="lynessa-orders-table__cell lynessa-orders-table__cell-order-status"
													data-title="Status">
													${item.status}
												</td>
												<td class="lynessa-orders-table__cell lynessa-orders-table__cell-order-total"
													data-title="Total">
													<span class="lynessa-Price-amount amount"><span
															class="lynessa-Price-currencySymbol">£</span>${item.amount}</span>
													for ${item.total} items
												</td>
											</tr>`
	})


	html ? '' : html = '<div  style="padding:20px;">no data</div>'
	$("#tbody").html(html);

}).catch().finally()
