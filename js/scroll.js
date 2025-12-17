/* ============================================
   Scroll JavaScript - 滚动相关功能
   ============================================ */

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initNavHighlight();
    initHeroBackgroundFade();
    initDaoSectionFade();
    initFaSectionFade();
    initQiSectionFade();
    initShuSectionFade();
});

/**
 * 初始化滚动动画
 * 使用 Intersection Observer 检测元素进入视口
 */
function initScrollAnimations() {
    // 检查浏览器是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
        // 不支持的情况下，直接显示所有元素
        document.querySelectorAll('.content-section, .scroll-text-block').forEach(section => {
            section.classList.add('visible');
        });
        return;
    }
    
    // 创建 Intersection Observer
    const observerOptions = {
        root: null, // 使用视口作为根
        rootMargin: '0px 0px -50px 0px', // 提前触发，当元素距离底部50px时就开始触发
        threshold: [0, 0.05, 0.1, 0.2] // 多个阈值，更容易触发（从0%开始）
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口，添加可见类
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // 观察所有需要动画的内容区块
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        observer.observe(section);
        // 备用方案：如果元素已经在视口中，立即显示
        const rect = section.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
            section.classList.add('visible');
        }
    });
    
    // 观察滚动文本区块（包括道章节）
    const scrollTextBlocks = document.querySelectorAll('.scroll-text-block');
    scrollTextBlocks.forEach(block => {
        observer.observe(block);
        // 备用方案：如果元素已经在视口中，立即显示
        const rect = block.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (isInViewport) {
            block.classList.add('visible');
        }
    });
    
    // 观察其他需要动画的元素
    const animatedElements = document.querySelectorAll('.fade-up, .work-item');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // 页面加载完成后，再次检查所有内容区块
    window.addEventListener('load', function() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInViewport && !section.classList.contains('visible')) {
                section.classList.add('visible');
            }
        });
    });
}

/**
 * 初始化导航高亮
 * 根据滚动位置高亮对应的导航项
 */
function initNavHighlight() {
    const sections = document.querySelectorAll('.content-section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar.offsetHeight;
    
    // 节流函数，优化性能
    const handleScroll = throttle(function() {
        let currentSection = '';
        
        // 获取当前视口位置
        const scrollPosition = window.pageYOffset + navbarHeight + 100;
        
        // 遍历所有区块，找到当前应该高亮的区块
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        // 更新导航链接的活动状态
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // 特殊处理：如果滚动到顶部，高亮首页链接
        if (window.pageYOffset < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            const homeLink = document.querySelector('a[href="#home"]');
            if (homeLink && homeLink.classList.contains('nav-link')) {
                homeLink.classList.add('active');
            }
        }
    }, 100);
    
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 页面加载时也执行一次
    handleScroll();
}

/**
 * 节流函数
 * 限制函数执行频率，优化性能
 * @param {Function} func - 要节流的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, wait) {
    let timeout;
    let previous = 0;
    
    return function executedFunction(...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            func.apply(this, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}

/**
 * 初始化英雄区域背景图淡出效果
 * 根据滚动位置控制背景图透明度
 * 淡出从滚动一个屏幕高度后开始
 */
function initHeroBackgroundFade() {
    const hero = document.querySelector('.hero');
    const backgroundLayer = document.querySelector('.hero-background-layer');
    const fadeMask = document.querySelector('.hero-fade-mask');
    
    if (!hero || !backgroundLayer || !fadeMask) return;
    
    // 节流函数，优化性能
    const handleScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroTop = hero.offsetTop;
        const heroHeight = hero.offsetHeight;
        const heroBottom = heroTop + heroHeight;
        const viewportHeight = window.innerHeight;
        
        // 计算视口顶部位置
        const viewportTop = scrollTop;
        
        // 计算背景图透明度和蒙版透明度
        let bgOpacity = 1;
        let maskOpacity = 0;
        
        // 淡出开始点：滚动一个屏幕高度后（100vh）
        const fadeStartPoint = heroTop + viewportHeight;
        
        // 如果视口顶部已经超过淡出开始点
        if (viewportTop > fadeStartPoint) {
            // 计算淡出进度：从淡出开始点到英雄区域底部
            const fadeStart = fadeStartPoint;
            const fadeEnd = heroBottom;
            const fadeRange = fadeEnd - fadeStart;
            const scrollProgress = viewportTop - fadeStart;
            
            if (fadeRange > 0) {
                // 计算透明度：0 到 1 之间
                const fadeProgress = Math.min(1, scrollProgress / fadeRange);
                bgOpacity = Math.max(0, 1 - fadeProgress);
                
                // 蒙版从淡出开始点逐渐显示
                maskOpacity = fadeProgress;
            } else {
                bgOpacity = 0;
                maskOpacity = 1;
            }
        }
        
        // 应用透明度到背景图层
        backgroundLayer.style.opacity = bgOpacity;
        
        // 应用透明度到淡出蒙版
        fadeMask.style.opacity = maskOpacity;
    }, 16); // 约 60fps 的更新频率
    
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 页面加载时也执行一次
    handleScroll();
}

/**
 * 初始化道章节淡出效果
 * 当用户继续向下滚动时，道章节顶部淡出
 */
function initDaoSectionFade() {
    const daoSection = document.querySelector('.dao-section');
    if (!daoSection) return;
    
    const handleScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const daoTop = daoSection.offsetTop;
        const daoHeight = daoSection.offsetHeight;
        const daoBottom = daoTop + daoHeight;
        const viewportHeight = window.innerHeight;
        
        // 当视口顶部超过道章节中间位置时，开始淡出
        const fadeStartPoint = daoTop + daoHeight * 0.5;
        
        if (scrollTop > fadeStartPoint && scrollTop < daoBottom) {
            daoSection.classList.add('fading-out');
        } else {
            daoSection.classList.remove('fading-out');
        }
    }, 16);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * 初始化法章节淡出效果
 * 当用户继续向下滚动时，法章节顶部淡出
 */
function initFaSectionFade() {
    const faSection = document.querySelector('.fa-section');
    if (!faSection) return;
    
    const handleScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const faTop = faSection.offsetTop;
        const faHeight = faSection.offsetHeight;
        const faBottom = faTop + faHeight;
        const viewportHeight = window.innerHeight;
        
        // 当视口顶部超过法章节中间位置时，开始淡出
        const fadeStartPoint = faTop + faHeight * 0.5;
        
        if (scrollTop > fadeStartPoint && scrollTop < faBottom) {
            faSection.classList.add('fading-out');
        } else {
            faSection.classList.remove('fading-out');
        }
    }, 16);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * 初始化器章节淡出效果
 * 当用户继续向下滚动时，器章节顶部淡出
 */
function initQiSectionFade() {
    const qiSection = document.querySelector('.qi-section');
    if (!qiSection) return;
    
    const handleScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const qiTop = qiSection.offsetTop;
        const qiHeight = qiSection.offsetHeight;
        const qiBottom = qiTop + qiHeight;
        const viewportHeight = window.innerHeight;
        
        // 当视口顶部超过器章节中间位置时，开始淡出
        const fadeStartPoint = qiTop + qiHeight * 0.5;
        
        if (scrollTop > fadeStartPoint && scrollTop < qiBottom) {
            qiSection.classList.add('fading-out');
        } else {
            qiSection.classList.remove('fading-out');
        }
    }, 16);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

/**
 * 初始化术章节淡出效果
 * 当用户继续向下滚动时，术章节顶部淡出
 */
function initShuSectionFade() {
    const shuSection = document.querySelector('.shu-section');
    if (!shuSection) return;
    
    const handleScroll = throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shuTop = shuSection.offsetTop;
        const shuHeight = shuSection.offsetHeight;
        const shuBottom = shuTop + shuHeight;
        const viewportHeight = window.innerHeight;
        
        // 当视口顶部超过术章节中间位置时，开始淡出
        const fadeStartPoint = shuTop + shuHeight * 0.5;
        
        if (scrollTop > fadeStartPoint && scrollTop < shuBottom) {
            shuSection.classList.add('fading-out');
        } else {
            shuSection.classList.remove('fading-out');
        }
    }, 16);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}


/**
 * 滚动到指定元素
 * @param {string} elementId - 目标元素的 ID
 * @param {number} offset - 偏移量（默认使用导航栏高度）
 */
function scrollToElement(elementId, offset = null) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const navbar = document.getElementById('navbar');
    const navbarHeight = offset !== null ? offset : navbar.offsetHeight;
    const targetPosition = element.offsetTop - navbarHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

