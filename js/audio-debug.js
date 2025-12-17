/* ============================================
   音频系统调试工具 - 全面自检与诊断
   ============================================ */

/**
 * 强大的音频系统调试函数
 * 使用方法：在浏览器控制台输入 debugAudioSystem()
 */
function debugAudioSystem() {
    console.clear();
    console.log('%c🎵 音频系统全面诊断开始', 'font-size: 20px; font-weight: bold; color: #40e0d0;');
    console.log('='.repeat(60));
    
    // ==================== 1. 收集所有音频元素 ====================
    const audioElements = document.querySelectorAll('audio');
    const audioObjects = [];
    
    // 从HTML中收集
    audioElements.forEach(audio => {
        const source = audio.querySelector('source');
        audioObjects.push({
            element: audio,
            id: audio.id || '(无ID)',
            src: source ? source.src : audio.src || '(无源)',
            type: 'HTML Audio Element',
            readyState: audio.readyState,
            error: audio.error,
            muted: audio.muted,
            volume: audio.volume,
            paused: audio.paused,
            duration: audio.duration || 'N/A',
            currentTime: audio.currentTime
        });
    });
    
    // ==================== 2. 详细状态报告 ====================
    console.log('\n📊 音频元素状态报告:');
    console.log(`找到 ${audioObjects.length} 个音频元素\n`);
    
    const readyStateMap = {
        0: 'HAVE_NOTHING (无数据)',
        1: 'HAVE_METADATA (元数据)',
        2: 'HAVE_CURRENT_DATA (当前数据)',
        3: 'HAVE_FUTURE_DATA (未来数据)',
        4: 'HAVE_ENOUGH_DATA (全部数据) ✓'
    };
    
    audioObjects.forEach((audio, index) => {
        console.group(`🎵 ${index + 1}. ${audio.id || '未命名音频'}`);
        console.log(`类型: ${audio.type}`);
        console.log(`路径: ${audio.src}`);
        console.log(`就绪状态: ${audio.readyState} - ${readyStateMap[audio.readyState] || '未知'}`);
        console.log(`静音: ${audio.muted ? '🔇 是' : '🔊 否'}`);
        console.log(`音量: ${audio.volume} (0-1)`);
        console.log(`播放状态: ${audio.paused ? '⏸ 暂停' : '▶ 播放中'}`);
        console.log(`时长: ${audio.duration !== 'N/A' ? audio.duration.toFixed(2) + '秒' : '未知'}`);
        console.log(`当前位置: ${audio.currentTime.toFixed(2)}秒`);
        
        if (audio.error) {
            console.error(`❌ 错误: ${audio.error.message}`);
            console.error(`错误代码: ${audio.error.code}`);
            if (audio.error.code === 4) {
                console.error('💡 可能原因: 文件不存在或路径错误');
            }
        } else if (audio.readyState === 4) {
            console.log('✅ 状态: 正常');
        } else {
            console.warn('⚠️ 状态: 未完全加载');
        }
        
        console.groupEnd();
    });
    
    // ==================== 3. 路径分析 ====================
    console.log('\n🔍 路径分析:');
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
    console.log(`当前页面URL: ${window.location.href}`);
    console.log(`基础URL: ${baseUrl}`);
    console.log(`GitHub Pages 仓库路径: ${window.location.pathname.split('/')[1] || '根目录'}`);
    
    audioObjects.forEach(audio => {
        const src = audio.src;
        if (src.startsWith('http')) {
            console.log(`✓ ${audio.id}: 绝对路径 - ${src}`);
        } else if (src.startsWith('/')) {
            console.log(`✓ ${audio.id}: 根相对路径 - ${src}`);
        } else {
            console.warn(`⚠ ${audio.id}: 相对路径 - ${src} (可能在某些部署环境下失效)`);
        }
    });
    
    // ==================== 4. 测试播放功能 ====================
    console.log('\n🧪 测试播放功能:');
    console.log('开始测试每个音频元素的播放能力...\n');
    
    async function testPlay(audioObj) {
        return new Promise((resolve) => {
            const audio = audioObj.element;
            const originalTime = audio.currentTime;
            const originalVolume = audio.volume;
            const originalMuted = audio.muted;
            
            // 设置测试参数
            audio.currentTime = 0;
            audio.volume = 0.1; // 低音量测试
            audio.muted = false;
            
            const timeout = setTimeout(() => {
                audio.pause();
                audio.currentTime = originalTime;
                audio.volume = originalVolume;
                audio.muted = originalMuted;
                resolve({ success: false, error: '超时' });
            }, 100);
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    clearTimeout(timeout);
                    setTimeout(() => {
                        audio.pause();
                        audio.currentTime = originalTime;
                        audio.volume = originalVolume;
                        audio.muted = originalMuted;
                        resolve({ success: true });
                    }, 100);
                }).catch(err => {
                    clearTimeout(timeout);
                    audio.currentTime = originalTime;
                    audio.volume = originalVolume;
                    audio.muted = originalMuted;
                    resolve({ success: false, error: err.message });
                });
            } else {
                clearTimeout(timeout);
                resolve({ success: false, error: '不支持Promise' });
            }
        });
    }
    
    // 顺序测试所有音频
    (async () => {
        for (const audioObj of audioObjects) {
            const result = await testPlay(audioObj);
            if (result.success) {
                console.log(`✅ ${audioObj.id}: 可以播放`);
            } else {
                console.error(`❌ ${audioObj.id}: 无法播放 - ${result.error}`);
            }
            await new Promise(resolve => setTimeout(resolve, 200)); // 间隔200ms
        }
        
        // ==================== 5. 生成诊断报告 ====================
        console.log('\n📋 诊断报告:');
        const errors = audioObjects.filter(a => a.error || a.readyState < 4);
        const canPlay = audioObjects.filter(a => !a.error && a.readyState === 4);
        
        console.log(`✅ 正常音频: ${canPlay.length}/${audioObjects.length}`);
        console.log(`❌ 异常音频: ${errors.length}/${audioObjects.length}`);
        
        if (errors.length > 0) {
            console.log('\n⚠️ 发现的问题:');
            errors.forEach(audio => {
                console.log(`  - ${audio.id}: ${audio.error ? audio.error.message : '未完全加载'}`);
            });
        }
        
        console.log('\n💡 建议:');
        if (errors.length > 0) {
            console.log('  1. 检查音频文件是否存在于服务器');
            console.log('  2. 检查文件路径是否正确（GitHub Pages可能需要绝对路径）');
            console.log('  3. 检查浏览器控制台是否有404错误');
            console.log('  4. 尝试手动访问音频文件URL');
        } else {
            console.log('  ✓ 所有音频文件加载正常');
            console.log('  ✓ 如果仍无法播放，可能是浏览器自动播放策略限制');
            console.log('  ✓ 请进行用户交互（点击、滚动）后再试');
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('%c🎵 诊断完成', 'font-size: 16px; font-weight: bold; color: #40e0d0;');
    })();
    
    // 返回音频对象数组供外部使用
    return audioObjects;
}

/**
 * 快速测试单个音频
 * 使用方法：testAudio('bgm') 或 testAudio('sound-dao')
 */
function testAudio(audioId) {
    const audio = document.getElementById(audioId);
    if (!audio) {
        console.error(`音频元素不存在: ${audioId}`);
        return;
    }
    
    console.log(`测试播放: ${audioId}`);
    audio.currentTime = 0;
    audio.volume = 0.3;
    audio.muted = false;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log(`✅ ${audioId} 播放成功`);
            setTimeout(() => audio.pause(), 1000);
        }).catch(err => {
            console.error(`❌ ${audioId} 播放失败:`, err);
        });
    }
}

/**
 * 激活所有音频元素（用于调试）
 */
function activateAllAudio() {
    console.log('🔓 激活所有音频元素...');
    const audioElements = document.querySelectorAll('audio');
    let activated = 0;
    
    audioElements.forEach(audio => {
        audio.muted = false;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                audio.pause();
                audio.currentTime = 0;
                activated++;
                console.log(`✓ 已激活: ${audio.id || '未命名'}`);
            }).catch(() => {
                console.warn(`⚠ 无法激活: ${audio.id || '未命名'}`);
            });
        }
    });
    
    setTimeout(() => {
        console.log(`\n✅ 已激活 ${activated}/${audioElements.length} 个音频元素`);
    }, 1000);
}

// 导出到全局作用域
window.debugAudioSystem = debugAudioSystem;
window.testAudio = testAudio;
window.activateAllAudio = activateAllAudio;

console.log('%c🎵 音频调试工具已加载', 'color: #40e0d0; font-weight: bold;');
console.log('可用命令:');
console.log('  - debugAudioSystem()  : 全面诊断音频系统');
console.log('  - testAudio("bgm")    : 测试指定音频');
console.log('  - activateAllAudio()  : 激活所有音频元素');


