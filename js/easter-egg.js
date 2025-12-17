/* ============================================
   Easter Egg JavaScript - 彩蛋章节交互逻辑
   ============================================ */

// 滚动计数器
let scrollCount = 0;
// 已触发的缓冲节标记（避免重复计数）
const triggeredBuffers = new Set();
// 彩蛋是否已解锁
let isUnlocked = false;

/**
 * 初始化彩蛋系统
 */
function initEasterEgg() {
    const bufferSections = document.querySelectorAll('.buffer-section.scroll-trigger');
    const easterEggSection = document.getElementById('easter-egg');
    
    if (!bufferSections.length || !easterEggSection) {
        console.warn('彩蛋章节元素未找到');
        return;
    }
    
    // 检查浏览器是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
        console.warn('浏览器不支持 Intersection Observer，彩蛋功能可能无法正常工作');
        // 降级方案：直接解锁（可选）
        // unlockEasterEgg();
        return;
    }
    
    // 创建 Intersection Observer
    const observerOptions = {
        root: null, // 使用视口作为根
        rootMargin: '0px', // 不提前触发
        threshold: 0 // 当元素顶部刚进入视口时触发
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 元素进入视口
                const bufferId = entry.target.getAttribute('data-buffer');
                
                // 检查是否已经触发过
                if (!triggeredBuffers.has(bufferId)) {
                    triggeredBuffers.add(bufferId);
                    scrollCount++;
                    
                    console.log(`缓冲节 ${bufferId} 已触发，当前计数: ${scrollCount}`);
                    
                    // 检查是否达到解锁条件
                    if (scrollCount >= 3 && !isUnlocked) {
                        unlockEasterEgg();
                    }
                }
            }
        });
    }, observerOptions);
    
    // 观察所有缓冲节
    bufferSections.forEach(section => {
        observer.observe(section);
    });
    
    console.log('彩蛋系统已初始化，等待用户滚动触发...');
}

/**
 * 解锁彩蛋
 */
function unlockEasterEgg() {
    if (isUnlocked) {
        return; // 已经解锁，避免重复触发
    }
    
    const easterEggSection = document.getElementById('easter-egg');
    if (!easterEggSection) {
        return;
    }
    
    isUnlocked = true;
    easterEggSection.classList.add('is-unlocked');
    
    console.log('🎉 彩蛋已解锁！');
    
    // 可选：添加一些额外的视觉效果
    // 例如：播放音效、添加粒子效果等
}

/**
 * 重置彩蛋
 */
function resetEasterEgg() {
    const easterEggSection = document.getElementById('easter-egg');
    if (!easterEggSection) {
        return;
    }
    
    // 移除解锁状态
    easterEggSection.classList.remove('is-unlocked');
    
    // 重置计数器
    scrollCount = 0;
    triggeredBuffers.clear();
    isUnlocked = false;
    
    console.log('彩蛋已重置');
    
    // 平滑滚动到术章节
    const shuSection = document.getElementById('shu');
    if (shuSection) {
        shuSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    initEasterEgg();
});

// 页面加载完成后再次初始化（确保所有元素都已渲染）
window.addEventListener('load', function() {
    // 延迟一点时间，确保所有样式都已应用
    setTimeout(function() {
        initEasterEgg();
    }, 100);
});



