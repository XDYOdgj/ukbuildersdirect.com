import httpRequest from '../common/http.js';

$(document).ready(function () {
    // 获取URL参数中的文章ID
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        $('#blog-detail').html(
            `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">文章ID参数缺失</div>`
        );
        return;
    }

    getBlogDetail(articleId);
});

// 获取文章详情
const getBlogDetail = (id) => {
    $('#blog-detail').html(
        `<div style="font-size: 30px; text-align: center; width: 100%; color: #cf9163; margin: 20px 0; padding: 10px 0; background: linear-gradient(90deg, #f4e2d8, #f8f4e5); border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            loading...
        </div>`
    );

    // 调用API获取文章详情
    httpRequest('/blog_posts/detail', 'GET', { id: id })
        .then(response => {
            if (response.code === 1) {
                const article = response.data;

                // 构建上一篇和下一篇导航HTML
                let navigationHtml = '<div class="post-navigation">';

                // 上一篇文章
                if (article.prev_article) {
                    navigationHtml += `
                        <div class="prev-post">
                            <a href="blog-detail?id=${article.prev_article.id}" class="nav-link">
                                <i class="fa fa-arrow-left"></i>
                                <span>Previous Post</span>
                                <h4>${article.prev_article.title}</h4>
                            </a>
                        </div>
                    `;
                } else {
                    navigationHtml += `
                        <div class="prev-post disabled">
                            <span class="nav-link">
                                <i class="fa fa-arrow-left"></i>
                                <span>Previous Post</span>
                                <h4>No Previous Post</h4>
                            </span>
                        </div>
                    `;
                }

                // 下一篇文章
                if (article.next_article) {
                    navigationHtml += `
                        <div class="next-post">
                            <a href="blog-detail?id=${article.next_article.id}" class="nav-link">
                                <span>Next Post</span>
                                <i class="fa fa-arrow-right"></i>
                                <h4>${article.next_article.title}</h4>
                            </a>
                        </div>
                    `;
                } else {
                    navigationHtml += `
                        <div class="next-post disabled">
                            <span class="nav-link">
                                <span>Next Post</span>
                                <i class="fa fa-arrow-right"></i>
                                <h4>No Next Post</h4>
                            </span>
                        </div>
                    `;
                }

                navigationHtml += '</div>';

                const html = `
                        
                <div class="single-post-info">
                    <h2 class="post-title"><a href="#">${article.title}</a></h2>
                    <div class="post-meta">
                        <div class="date">
                            <a href="#">${article.date} </a>
                        </div>
                        <div class="post-author">
                            By:<a href="#"> ${article.author} </a>
                        </div>
                    </div>
                </div>
                        
                <div class="post-content">
                    ${article.content}
                </div>
                
                ${navigationHtml}
                        
                <footer class="post-footer">
                    <div class="post-actions">
                        <a href="blog-grid" class="btn btn-primary">back</a>
                    </div>
                </footer>
                    </article>
                `;

                $('#blog-detail').html(html);

                // 更新页面标题
                document.title = article.title + ' - Blog Detail';

            } else {
                $('#blog-detail').html(
                    `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">fail to load: ${response.msg || '未知错误'}</div>`
                );
            }
        })
        .catch(error => {
            console.error('获取文章详情失败:', error);
            $('#blog-detail').html(
                `<div style="font-size:30px;text-align: center;width: 100%;color: #cf9163;">Network error. Please try again later</div>`
            );
        });
};
