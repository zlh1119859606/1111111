/* ============================================
   Main JavaScript - 主逻辑文件
   ============================================ */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('网站已加载');
    
    // 强制滚动到顶部，确保显示英雄界面
    window.scrollTo(0, 0);
    
    // 检查并清除URL哈希（如果不是 #home）
    const hash = window.location.hash;
    if (hash && hash !== '#home' && hash !== '') {
        // 清除哈希，回到顶部
        window.history.replaceState(null, null, window.location.pathname);
        window.scrollTo(0, 0);
        console.log('已清除URL哈希:', hash);
    }
    
    // 初始化所有功能
    initNavbar();
    initSmoothScroll();
    
    // 页面加载完成后的处理
    handlePageLoad();
});

/**
 * 初始化导航栏
 * 处理导航栏滚动效果和响应式菜单
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    // 监听滚动事件，改变导航栏样式
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加滚动后的样式
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

/**
 * 初始化平滑滚动
 * 为所有锚点链接添加平滑滚动行为
 */
function initSmoothScroll() {
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 如果是锚点链接
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 计算目标位置（考虑导航栏高度）
                    const navbarHeight = document.getElementById('navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    // 平滑滚动到目标位置
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // 更新活动导航项
                    updateActiveNavItem(this);
                }
            }
        });
    });
}

/**
 * 更新活动导航项
 * @param {HTMLElement} activeLink - 当前活动的导航链接
 */
function updateActiveNavItem(activeLink) {
    // 移除所有活动状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 添加当前活动状态
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * 处理页面加载
 * 页面加载完成后的初始化操作
 */
function handlePageLoad() {
    // 添加页面加载完成的类
    document.body.classList.add('loaded');
    
    // 可以在这里添加其他初始化逻辑
    console.log('页面初始化完成');
}

// 页面完全加载后，再次确保滚动到顶部
window.addEventListener('load', function() {
    // 清除历史滚动位置，强制滚动到顶部
    window.scrollTo(0, 0);
    
    // 再次检查URL哈希
    const hash = window.location.hash;
    if (hash && hash !== '#home' && hash !== '') {
        // 清除哈希，回到顶部
        window.history.replaceState(null, null, window.location.pathname);
        window.scrollTo(0, 0);
        console.log('页面加载完成后已清除URL哈希:', hash);
    }
    
    console.log('页面完全加载，已重置滚动位置');
});

/**
 * 工具函数：节流
 * 限制函数执行频率
 * @param {Function} func - 要节流的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 工具函数：防抖
 * 延迟函数执行
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


