import httpRequest from '../common/http.js';
import fit from '../common/fit.js';

let from = {
    page: 1,
    limit: 8,
    category: null
}
let totalCount = 0;

$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    from.category = urlParams.get('category');
    from.page = 1;
    getBlogList()
});

// 文章列表
const getBlogList = () => {
    $("#blog-grid").html(
        `<div style="font-size: 30px; text-align: center; width: 100%; color: #cf9163; margin: 20px 0; padding: 10px 0; background: linear-gradient(90deg, #f4e2d8, #f8f4e5); border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            loading...
        </div>`
    );

    // 构建请求参数
    const params = {
        page: from.page,
        limit: from.limit
    };

    if (from.category) {
        params.category = from.category;
    }

    // 调用API获取博客数据
    httpRequest('/blog_posts/index', 'GET', params)
        .then(response => {
            if (response.code === 1) {
                const data = response.data;
                let html = "";

                if (data.list && data.list.length > 0) {
                    data.list.forEach(item => {
                        html += `
                            <article class="post-item post-grid col-bg-4 col-xl-4 col-lg-4 col-md-4 col-sm-6 col-ts-12">
                                <div class="blog-wrap mb-30">
                                    <div class="blog-content">
                                        <h2>
                                            <a href="blog-detail.html?id=${item.id}">${item.title}</a>
                                        </h2>
                                        <div class="blog-meta">
                                            <a href="#"><i class="la la-user"></i> ${item.author || 'Admin'}</a>
                                            <a href="#"><i class="la la-clock-o"></i> ${item.date}</a>
                                            ${item.domain ? `<span class="post-domain"> - ${item.domain}</span>` : ''}
                                        </div>
                                        <p>${item.content}</p>
                                        <div class="blog-btn">
                                            <a href="blog-detail?id=${item.id}">read more</a>
                                        </div>
                                    </div>
                                </div>
                            </article>`;
                    });

                    $("#blog-grid").html(html);

                    // 更新分页
                    totalCount = data.total;
                    if (totalCount && Math.ceil(totalCount / from.limit) > 1) {
                        $("#pagination .nav-links").html(createPagination(from.page, Math.ceil(totalCount / from.limit)));
                    } else {
                        $("#pagination .nav-links").html("");
                    }
                } else {
                    $("#blog-grid").html(
                        `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">There is no blog data for the time being</div>`
                    );
                    $("#pagination .nav-links").html("");
                }
            } else {
                $("#blog-grid").html(
                    `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">fail to load: ${response.msg || '未知错误'}</div>`
                );
            }
        })
        .catch(error => {
            console.error('获取博客列表失败:', error);
            $("#blog-grid").html(
                `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">Network error. Please try again later</div>`
            );
        });

        // 图片已移除，不再需要适配高度
}

// 分页函数 - 根据用户要求的结构重新设计
const createPagination = (currentPage, totalPages) => {
    let paginationHtml = "";

    // 添加上一页按钮
    if (currentPage > 1) {
        paginationHtml += `<a class="prev page-numbers" href="#" data-page="${currentPage - 1}"><i class="fa fa-angle-left"></i></a>`;
    }

    // 生成页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHtml += `<span class="page-numbers current">${i}</span>`;
        } else {
            paginationHtml += `<a class="page-numbers" href="#" data-page="${i}">${i}</a>`;
        }
    }

    // 添加下一页按钮
    if (currentPage < totalPages) {
        paginationHtml += `<a class="next page-numbers" href="#" data-page="${currentPage + 1}"><i class="fa fa-angle-right"></i></a>`;
    }

    return paginationHtml;
}

const selectPage = (pageNumber) => {
    from.page
 = pageNumber;
    getBlogList()
}

// 分页点击事件
$("#pagination").on("click", "a", function (event) {
    event.preventDefault();

    const pageNumber = parseInt($(this).data('page'));
    if (!isNaN(pageNumber)) {
        // 平滑滚动到内容区域
        $('html, body').animate({
            scrollTop: 350
        }, 500);

        selectPage(pageNumber);
    }
});
