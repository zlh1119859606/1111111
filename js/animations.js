/* ============================================
   Animations JavaScript - 动画控制
   ============================================ */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    initPageAnimations();
    initHoverEffects();
    initScrollAnimations();
});

/**
 * 初始化页面加载动画
 * 处理页面首次加载时的动画效果
 */
function initPageAnimations() {
    // 为需要延迟显示的元素添加动画
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2');
    
    // 确保动画在页面加载后执行
    requestAnimationFrame(() => {
        animatedElements.forEach((element, index) => {
            // 使用 requestAnimationFrame 确保动画流畅
            setTimeout(() => {
                element.style.opacity = '1';
            }, index * 100);
        });
    });
}

/**
 * 初始化悬停效果
 * 为特定元素添加交互式悬停动画
 */
function initHoverEffects() {
    // 为作品项添加悬停效果
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 为联系链接添加悬停效果
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--color-black)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = 'var(--color-gray-dark)';
        });
    });
}

/**
 * 初始化滚动动画
 * 处理滚动时的动画效果
 */
function initScrollAnimations() {
    // 这个功能已经在 scroll.js 中实现
    // 这里可以添加额外的滚动动画逻辑
    
    // 例如：视差滚动效果（可选）
    // initParallaxEffect();
}

/**
 * 添加淡入动画到元素
 * @param {HTMLElement} element - 要添加动画的元素
 * @param {number} delay - 延迟时间（毫秒）
 */
function addFadeInAnimation(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

/**
 * 添加缩放动画到元素
 * @param {HTMLElement} element - 要添加动画的元素
 * @param {number} delay - 延迟时间（毫秒）
 */
function addScaleAnimation(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.9)';
    element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    }, delay);
}

/**
 * 创建滚动提示动画
 * 为滚动提示箭头添加持续动画
 */
function initScrollHintAnimation() {
    const scrollHint = document.querySelector('.scroll-hint');
    if (!scrollHint) return;
    
    // 使用 CSS 动画，这里只是确保元素存在
    // 动画已在 CSS 中定义
}

/**
 * 工具函数：requestAnimationFrame 封装
 * 确保动画在下一帧执行
 * @param {Function} callback - 回调函数
 */
function nextFrame(callback) {
    requestAnimationFrame(() => {
        requestAnimationFrame(callback);
    });
}

/**
 * 工具函数：检查元素是否在视口中
 * @param {HTMLElement} element - 要检查的元素
 * @returns {boolean} 元素是否在视口中
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * 工具函数：获取元素距离顶部的距离
 * @param {HTMLElement} element - 目标元素
 * @returns {number} 距离顶部的像素值
 */
function getElementTop(element) {
    let top = 0;
    while (element) {
        top += element.offsetTop;
        element = element.offsetParent;
    }
    return top;
}



