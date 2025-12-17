/* ============================================
   音频系统核心逻辑 - 沉浸式音频体验
   ============================================ */

// ==================== 0. 路径修复（支持GitHub Pages） ====================
/**
 * 修复音频路径，确保在GitHub Pages上正常工作
 * 如果路径是相对路径，转换为基于当前页面的绝对路径
 */
function fixAudioPaths() {
    const audioElements = document.querySelectorAll('audio source');
    const basePath = window.location.pathname.replace(/\/[^\/]*$/, '') || '';
    
    audioElements.forEach(source => {
        const src = source.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('/')) {
            // 相对路径，转换为绝对路径
            const newSrc = basePath + (basePath.endsWith('/') ? '' : '/') + src.replace(/^\.\//, '');
            source.setAttribute('src', newSrc);
            console.log(`路径修复: ${src} -> ${newSrc}`);
        }
    });
}

// ==================== 0.1 全局错误监听 ====================
window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'AUDIO') {
        console.error('🔴 音频加载错误:', e.target.src || e.target.querySelector('source')?.src);
        console.error('错误详情:', e.message);
    }
}, true);

// 等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 首先修复路径
    fixAudioPaths();
    
    // 检查音频元素是否存在
    const bgm = document.getElementById('bgm');
    const soundDao = document.getElementById('sound-dao');
    const soundFa = document.getElementById('sound-fa');
    const soundQi = document.getElementById('sound-qi');
    const soundToolHover = document.getElementById('sound-tool-hover');
    const soundCardFlip = document.getElementById('sound-card-flip');

    if (!bgm) {
        console.warn('音频元素未找到，音频系统将无法工作');
        return;
    }

    // ==================== 1. 背景音乐控制 ====================
    const bgmToggleBtn = document.getElementById('bgm-toggle');
    const bgmVolumeSlider = document.getElementById('bgm-volume');
    const bgmIcon = bgmToggleBtn ? bgmToggleBtn.querySelector('.audio-icon') : null;
    
    // 标记音频是否已解锁（用于首次交互后自动播放）
    let bgmAutoPlayEnabled = false;
    
    if (bgmToggleBtn && bgmVolumeSlider && bgmIcon) {
        // 初始化：静音，设置音量（等待用户交互后自动播放）
        bgm.muted = true;
        bgm.volume = 0.3;
        bgmVolumeSlider.value = bgm.volume;
        bgmIcon.textContent = '🔇'; // 静音图标

        // 音量控制
        bgmVolumeSlider.addEventListener('input', function() {
            bgm.volume = parseFloat(this.value);
            // 如果取消静音且有音量，更新图标
            if (!bgm.muted && bgm.volume > 0) {
                bgmIcon.textContent = '🔊';
            } else if (bgm.volume === 0) {
                bgmIcon.textContent = '🔇';
            }
        });

        // 静音/取消静音
        bgmToggleBtn.addEventListener('click', function() {
            bgm.muted = !bgm.muted;
            
            // 更新图标
            if (bgm.muted || bgm.volume === 0) {
                bgmIcon.textContent = '🔇';
            } else {
                bgmIcon.textContent = '🔊';
            }
            
            // 如果取消静音且音乐暂停，尝试播放
            if (!bgm.muted && bgm.paused && bgm.volume > 0) {
                bgm.play().catch(e => {
                    console.log('BGM播放被阻止:', e);
                });
            }
        });
    }

    // ==================== 2. 章节触发音效函数 ====================
    function playSectionSound(sectionClass, audioElement, soundName) {
        if (!audioElement) {
            console.warn(`音频元素不存在: ${soundName}`);
            return;
        }
        
        // 记录是否已播放，避免重复触发
        let hasPlayed = false;
        // 标记音频是否已激活（通过用户交互）
        let audioActivated = false;
        
        // 检查音频文件是否加载成功
        audioElement.addEventListener('canplaythrough', function() {
            console.log(`音频文件已加载: ${soundName}`);
        }, { once: true });
        
        audioElement.addEventListener('error', function(e) {
            console.error(`音频文件加载失败: ${soundName}`, e);
            console.error(`文件路径: ${audioElement.querySelector('source')?.src || '未知'}`);
        }, { once: true });
        
        // 激活音频元素的函数
        function activateAudio() {
            if (!audioActivated) {
                audioActivated = true;
                audioElement.muted = false;
                // 尝试播放一次以激活（静默捕获错误）
                audioElement.play().catch(() => {});
                audioElement.pause();
                audioElement.currentTime = 0;
                console.log(`音频元素已激活: ${soundName}`);
            }
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // 当章节进入视口时（降低阈值，更容易触发）
                if (entry.isIntersecting && entry.intersectionRatio > 0.3 && !hasPlayed) {
                    // 确保音频已激活
                    activateAudio();
                    
                    hasPlayed = true;
                    console.log(`尝试播放: ${soundName}`);
                    console.log(`触发章节音效: ${soundName} (intersectionRatio: ${entry.intersectionRatio.toFixed(2)})`);
                    
                    // 重置并播放音效
                    audioElement.currentTime = 0;
                    audioElement.volume = 0.6; // 章节音效音量
                    audioElement.muted = false; // 确保未静音
                    
                    const playPromise = audioElement.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            console.log(`✓ 音效播放成功: ${soundName}`);
                        }).catch(e => {
                            console.error(`✗ 音效播放失败: ${soundName}`, e);
                            console.log('提示: 可能需要用户交互后才能播放音频');
                        });
                    }
                    
                    // 播放完成后，允许再次触发（如果用户滚动回来）
                    audioElement.addEventListener('ended', function resetPlayFlag() {
                        hasPlayed = false;
                        audioElement.removeEventListener('ended', resetPlayFlag);
                    }, { once: true });
                } else if (!entry.isIntersecting && entry.intersectionRatio < 0.2) {
                    // 当章节离开视口时，重置播放标志
                    hasPlayed = false;
                }
            });
        }, { 
            threshold: [0.2, 0.3, 0.5, 0.7], // 降低初始阈值，更容易触发
            rootMargin: '0px 0px -10% 0px' // 提前10%触发
        });

        const section = document.querySelector(sectionClass);
        if (section) {
            observer.observe(section);
            console.log(`已监听章节: ${sectionClass} (${soundName})`);
        } else {
            console.warn(`章节 ${sectionClass} 未找到`);
        }
        
        // 返回激活函数，供外部调用
        return activateAudio;
    }

    // 为四个章节绑定触发音效（保存激活函数）
    let activateDaoAudio = null;
    let activateFaAudio = null;
    let activateQiAudio = null;
    
    if (soundDao) {
        soundDao.muted = false; // 确保未静音
        activateDaoAudio = playSectionSound('.dao-section', soundDao, 'dao_enter');
    }
    if (soundFa) {
        soundFa.muted = false;
        activateFaAudio = playSectionSound('.fa-section', soundFa, 'fa_enter');
    }
    if (soundQi) {
        soundQi.muted = false;
        activateQiAudio = playSectionSound('.qi-section', soundQi, 'qi_enter');
    }
    // 术章节暂时没有音效，可根据需要添加

    // ==================== 3. 交互音效绑定 ====================
    
    // 工具悬停音效
    if (soundToolHover) {
        soundToolHover.muted = false; // 确保未静音
        const toolItems = document.querySelectorAll('.tool-item');
        console.log(`找到 ${toolItems.length} 个工具项`);
        toolItems.forEach(tool => {
            tool.addEventListener('mouseenter', () => {
                console.log('尝试播放: qi_tool_hover');
                console.log('工具悬停音效触发');
                soundToolHover.currentTime = 0;
                soundToolHover.volume = 0.3;
                soundToolHover.muted = false;
                const playPromise = soundToolHover.play();
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.error('工具悬停音效播放失败:', e);
                    });
                }
            });
        });
    } else {
        console.warn('工具悬停音效元素未找到');
    }

    // 卡片翻转音效
    if (soundCardFlip) {
        soundCardFlip.muted = false; // 确保未静音
        const projectCards = document.querySelectorAll('.project-card');
        console.log(`找到 ${projectCards.length} 个项目卡片`);
        projectCards.forEach(card => {
            let isFlipped = false;
            card.addEventListener('mouseenter', () => {
                if (!isFlipped) {
                    isFlipped = true;
                    console.log('尝试播放: qi_card_flip');
                    console.log('卡片翻转音效触发');
                    soundCardFlip.currentTime = 0;
                    soundCardFlip.volume = 0.4;
                    soundCardFlip.muted = false;
                    const playPromise = soundCardFlip.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => {
                            console.error('卡片翻转音效播放失败:', e);
                        });
                    }
                }
            });
            card.addEventListener('mouseleave', () => {
                // 重置翻转状态，允许再次播放
                setTimeout(() => {
                    isFlipped = false;
                }, 500);
            });
        });
    } else {
        console.warn('卡片翻转音效元素未找到');
    }

    // ==================== 4. 解决浏览器自动播放策略 ====================
    // 页面首次交互后解锁音频
    let audioUnlocked = false;
    function unlockAudioOnFirstInteraction() {
        if (!audioUnlocked) {
            audioUnlocked = true;
            console.log('🎵 音频已解锁（用户交互后）');
            
            // 解锁所有音频元素
            const allAudioElements = [
                { element: bgm, name: 'BGM' },
                { element: soundDao, name: 'dao_enter' },
                { element: soundFa, name: 'fa_enter' },
                { element: soundQi, name: 'qi_enter' },
                { element: soundToolHover, name: 'qi_tool_hover' },
                { element: soundCardFlip, name: 'qi_card_flip' }
            ];
            
            // 解锁并激活所有音频元素（更激进的激活策略）
            allAudioElements.forEach(({ element, name }) => {
                if (element) {
                    // 确保未静音
                    element.muted = false;
                    
                    // 设置合理的音量（如果为0）
                    if (element.volume === 0) {
                        element.volume = element === bgm ? 0.3 : 0.5;
                    }
                    
                    // 强制加载音频（如果未加载）
                    if (element.readyState === 0) {
                        element.load();
                    }
                    
                    // 主动尝试播放一次以"激活"音频元素
                    const activatePromise = element.play();
                    if (activatePromise !== undefined) {
                        activatePromise.then(() => {
                            // 立即暂停（除了BGM）
                            if (element !== bgm) {
                                element.pause();
                                element.currentTime = 0;
                            }
                            console.log(`✓ 已激活音频元素: ${name}`);
                        }).catch(err => {
                            console.warn(`⚠ 音频元素激活失败: ${name}`, err.message);
                            // 即使失败也标记为已尝试激活
                            console.log(`  (已标记为激活，后续播放可能成功)`);
                        });
                    }
                }
            });
            
            // 激活章节音效
            if (activateDaoAudio) activateDaoAudio();
            if (activateFaAudio) activateFaAudio();
            if (activateQiAudio) activateQiAudio();
            
            // 自动播放背景音乐
            if (bgm) {
                bgm.muted = false;
                bgmAutoPlayEnabled = true;
                if (bgmIcon) {
                    bgmIcon.textContent = '🔊';
                }
                // 尝试播放背景音乐
                bgm.play().then(() => {
                    console.log('✓ BGM 自动播放成功');
                }).catch(e => {
                    console.warn('⚠ BGM 自动播放被阻止:', e.message);
                    console.log('提示: 请点击左下角的音频控制按钮手动播放');
                });
            }
        }
    }
    
    // 添加多种首次交互监听（更激进，覆盖更多事件）
    const interactionEvents = [
        'click', 'mousedown', 'mouseup', 'touchstart', 'touchend',
        'scroll', 'wheel', 'keydown', 'keyup',
        'pointerdown', 'pointerup'
    ];
    
    interactionEvents.forEach(event => {
        document.addEventListener(event, unlockAudioOnFirstInteraction, { once: true, passive: true });
    });
    
    // 立即解锁（用于测试，实际使用时可以注释掉）
    // unlockAudioOnFirstInteraction();

    // ==================== 5. 音频加载错误处理和调试信息 ====================
    const audioElements = [
        { element: bgm, name: 'BGM' },
        { element: soundDao, name: '道章节音效' },
        { element: soundFa, name: '法章节音效' },
        { element: soundQi, name: '器章节音效' },
        { element: soundToolHover, name: '工具悬停音效' },
        { element: soundCardFlip, name: '卡片翻转音效' }
    ];
    
    audioElements.forEach(({ element, name }) => {
        if (element) {
            // 确保所有音效未静音
            element.muted = false;
            
            // 检查加载状态
            element.addEventListener('loadeddata', function() {
                console.log(`✓ ${name} 已加载`);
            }, { once: true });
            
            element.addEventListener('error', function(e) {
                console.error(`✗ ${name} 加载失败:`, e);
                const source = element.querySelector('source');
                if (source) {
                    console.error(`  文件路径: ${source.src}`);
                    console.error(`  提示: 请检查文件是否存在，路径是否正确`);
                }
            }, { once: true });
            
            // 检查文件是否存在（通过尝试加载）
            if (element.readyState === 0) {
                element.load(); // 强制加载
            }
        } else {
            console.warn(`音频元素不存在: ${name}`);
        }
    });

    console.log('音频系统已初始化');
    console.log('提示: 如果音效没有声音，请检查：');
    console.log('1. 音频文件是否存在于 assets/audio/ 目录');
    console.log('2. 文件名是否完全匹配（区分大小写）');
    console.log('3. 浏览器控制台是否有错误信息');
    console.log('4. 是否进行了用户交互（点击、滚动等）');
    
    // 延迟检查音频文件加载状态（2秒后）
    setTimeout(function() {
        console.log('\n=== 音频文件加载状态检查 ===');
        const audioFiles = [
            { id: 'bgm', name: 'bgm_ambient.mp3' },
            { id: 'sound-dao', name: 'dao_enter.mp3' },
            { id: 'sound-fa', name: 'fa_enter.mp3' },
            { id: 'sound-qi', name: 'qi_enter.mp3' },
            { id: 'sound-tool-hover', name: 'qi_tool_hover.mp3' },
            { id: 'sound-card-flip', name: 'qi_card_flip.mp3' }
        ];
        
        audioFiles.forEach(({ id, name }) => {
            const audio = document.getElementById(id);
            if (audio) {
                const source = audio.querySelector('source');
                if (source) {
                    console.log(`\n${name}:`);
                    console.log(`  路径: ${source.src}`);
                    console.log(`  就绪状态: ${audio.readyState} (0=无数据, 1=元数据, 2=当前数据, 3=未来数据, 4=全部数据)`);
                    if (audio.error) {
                        console.error(`  ✗ 错误: ${audio.error.message}`);
                        console.error(`  ✗ 错误代码: ${audio.error.code}`);
                        if (audio.error.code === 4) {
                            console.error(`  ✗ 文件不存在或无法访问`);
                        }
                    } else if (audio.readyState >= 2) {
                        console.log(`  ✓ 已加载 (就绪状态: ${audio.readyState})`);
                    } else {
                        console.warn(`  ⚠ 未加载或加载中 (就绪状态: ${audio.readyState})`);
                        console.warn(`  ⚠ 可能原因: 文件不存在或路径错误`);
                    }
                }
            } else {
                console.error(`  ✗ 音频元素不存在: ${id}`);
            }
        });
        console.log('\n=== 检查完成 ===');
    }, 2000);
    
    // ==================== 6. 可视化调试面板（可选） ====================
    // 在开发环境或需要调试时，取消注释以下代码
    /*
    function createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'audio-debug-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.85);
            color: #40e0d0;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            min-width: 200px;
            border: 1px solid #40e0d0;
            box-shadow: 0 4px 12px rgba(64, 224, 208, 0.3);
        `;
        
        const status = document.createElement('div');
        status.id = 'audio-debug-status';
        status.textContent = '音频状态: 检查中...';
        status.style.marginBottom = '10px';
        
        const activateBtn = document.createElement('button');
        activateBtn.textContent = '🔓 激活音频';
        activateBtn.style.cssText = `
            background: #40e0d0;
            color: #000;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            margin-top: 8px;
            font-weight: bold;
        `;
        activateBtn.onclick = () => {
            if (window.activateAllAudio) {
                window.activateAllAudio();
            } else {
                unlockAudioOnFirstInteraction();
            }
        };
        
        const testBtn = document.createElement('button');
        testBtn.textContent = '🧪 运行诊断';
        testBtn.style.cssText = activateBtn.style.cssText;
        testBtn.style.marginTop = '5px';
        testBtn.onclick = () => {
            if (window.debugAudioSystem) {
                window.debugAudioSystem();
            } else {
                console.log('调试工具未加载，请确保 audio-debug.js 已引入');
            }
        };
        
        panel.appendChild(status);
        panel.appendChild(activateBtn);
        panel.appendChild(testBtn);
        document.body.appendChild(panel);
        
        // 更新状态
        setTimeout(() => {
            const allLoaded = audioElements.every(({ element }) => 
                element && element.readyState >= 2 && !element.error
            );
            status.textContent = allLoaded 
                ? '✅ 音频状态: 就绪' 
                : '⚠️ 音频状态: 部分异常';
            status.style.color = allLoaded ? '#40e0d0' : '#ff6b6b';
        }, 3000);
    }
    
    // 取消注释以启用调试面板
    // createDebugPanel();
    */
});

