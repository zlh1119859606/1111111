/* ============================================
   tsParticles 初始化 - 动态数据光带背景
   ============================================ */

/**
 * 初始化所有章节的粒子系统
 */
function initDataStreams() {
    // 检查 tsParticles 是否已加载
    if (typeof tsParticles === 'undefined') {
        console.warn('tsParticles 未加载，粒子效果将无法显示');
        return;
    }

    // 初始化"道"章节 - 混沌初开，能量生灭
    initDaoParticles();
    
    // 初始化"法"章节 - 笔直的光脉
    initFaParticles();
    
    // 初始化"器"章节 - 有序工具基础与迸发创造过程
    initQiParticles();
    
    // 初始化"术"章节 - 升腾的光尘
    initShuParticles();
}

/**
 * "道"章节粒子配置 - 混沌初开，能量流动
 * 粒子颜色：#40e0d0
 * 效果：稀疏、空灵，持续流动，能量潮汐感
 * 特性：粒子持续存在，通过透明度动画营造呼吸感
 */
async function initDaoParticles() {
    await tsParticles.load('particles-dao', {
        fpsLimit: 60,
        particles: {
            number: {
                value: 60,
                density: {
                    enable: true,
                    value_area: 1000
                }
            },
            color: {
                value: '#40e0d0'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 0.1,
                    opacity_max: 0.6,
                    sync: false
                }
            },
            size: {
                value: 2,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    size_min: 1,
                    size_max: 3,
                    sync: false
                }
            },
            links: {
                enable: true,
                distance: 120,
                color: '#40e0d0',
                opacity: 0.2,
                width: 0.5
            },
            move: {
                enable: true,
                speed: 0.8,
                direction: 'none',
                random: true,
                straight: false,
                outMode: 'bounce',
                bounce: true,
                attract: {
                    enable: false
                }
            }
        },
        interactivity: {
            detectsOn: 'canvas',
            events: {
                onHover: {
                    enable: true,
                    mode: 'attract',
                    parallax: {
                        enable: false,
                        force: 60,
                        smooth: 10
                    }
                },
                onClick: {
                    enable: false
                },
                resize: true
            },
            modes: {
                attract: {
                    distance: 120,
                    duration: 0.4,
                    speed: 1
                }
            }
        },
        detectRetina: true
    });
}

/**
 * "法"章节粒子配置 - 笔直的光脉
 * 粒子颜色：#ffffff
 * 运动：沿水平方向有明确、稳定的单向流动
 */
async function initFaParticles() {
    await tsParticles.load('particles-fa', {
        fpsLimit: 60,
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#ffffff'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.6,
                random: false,
                anim: {
                    enable: false
                }
            },
            size: {
                value: 2,
                random: false,
                anim: {
                    enable: false
                }
            },
            links: {
                enable: true,
                distance: 200,
                color: '#ffffff',
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'right',
                random: false,
                straight: true,
                outMode: 'out',
                bounce: false,
                attract: {
                    enable: false
                }
            }
        },
        interactivity: {
            detectsOn: 'canvas',
            events: {
                onHover: {
                    enable: false
                },
                onClick: {
                    enable: false
                },
                resize: true
            }
        },
        detectRetina: true
    });
}

/**
 * "器"章节粒子配置 - 有序工具基础与迸发创造过程
 * 使用 emitters 实现两层结构：
 * 1. 底层：静态网格发射器（金色），象征工具基础
 * 2. 上层：动态点发射器（白色），从网格位置向上发射，象征创造火花
 */
async function initQiParticles() {
    await tsParticles.load('particles-qi', {
        fpsLimit: 60,
        particles: {
            number: {
                value: 0  // 粒子由发射器生成，初始数量为0
            },
            color: {
                value: ['#f0e68c', '#ffffff']
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.8,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.3,
                    sync: false
                }
            },
            size: {
                value: 2,
                random: true,
                anim: {
                    enable: true,
                    speed: 1.5,
                    size_min: 1,
                    sync: false
                }
            },
            links: {
                enable: true,
                distance: 100,
                color: '#f0e68c',
                opacity: 0.5,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: 'top',
                random: true,
                straight: false,
                outMode: 'out',
                bounce: false,
                attract: {
                    enable: false
                }
            },
        },
        interactivity: {
            detectsOn: 'canvas',
            events: {
                onHover: {
                    enable: true,
                    mode: 'grab'
                },
                onClick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 120,
                    links: {
                        opacity: 0.8
                    }
                },
                push: {
                    quantity: 3
                }
            }
        },
        detectRetina: true,
        emitters: [
            // 底层：静态网格发射器（工具基础）- 持续存在
            {
                direction: 'none',
                life: {
                    count: -1,
                    delay: {
                        value: 0,
                        sync: false
                    },
                    duration: {
                        value: 0,
                        sync: false
                    }
                },
                rate: {
                    delay: {
                        value: 0.05,
                        sync: false
                    },
                    quantity: {
                        value: 1,
                        sync: false
                    }
                },
                position: {
                    x: 50,
                    y: 80
                },
                size: {
                    mode: 'square',
                    width: {
                        min: 0,
                        max: 100
                    },
                    height: {
                        min: 0,
                        max: 20
                    }
                },
                particles: {
                    color: {
                        value: '#f0e68c'
                    },
                    move: {
                        enable: true,
                        speed: 0.05,
                        direction: 'none',
                        random: false,
                        straight: false,
                        outMode: 'bounce',
                        bounce: true
                    },
                    opacity: {
                        value: 0.6,
                        random: false,
                        anim: {
                            enable: true,
                            speed: 0.3,
                            opacity_min: 0.4,
                            opacity_max: 0.8,
                            sync: false
                        }
                    },
                    size: {
                        value: 2,
                        random: false,
                        anim: {
                            enable: true,
                            speed: 0.5,
                            size_min: 1.5,
                            size_max: 2.5,
                            sync: false
                        }
                    }
                }
            },
            // 上层：动态点发射器（创造火花）- 持续生成
            {
                direction: 'top',
                life: {
                    count: -1,
                    delay: {
                        value: 0,
                        sync: false
                    },
                    duration: {
                        value: 0,
                        sync: false
                    }
                },
                rate: {
                    delay: {
                        value: 0.2,
                        sync: false
                    },
                    quantity: {
                        value: 2,
                        sync: false,
                        random: {
                            enable: true,
                            minimumValue: 1
                        }
                    }
                },
                position: {
                    x: {
                        min: 20,
                        max: 80
                    },
                    y: 75
                },
                size: {
                    mode: 'percent',
                    value: {
                        min: 0,
                        max: 5
                    }
                },
                particles: {
                    color: {
                        value: '#ffffff'
                    },
                    move: {
                        enable: true,
                        speed: 2.5,
                        direction: 'top',
                        random: true,
                        straight: false,
                        outMode: 'bounce',
                        bounce: false
                    },
                    opacity: {
                        value: 0.8,
                        random: false,
                        anim: {
                            enable: true,
                            speed: 0.8,
                            opacity_min: 0.3,
                            opacity_max: 1,
                            sync: false
                        }
                    },
                    size: {
                        value: 2.5,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 0.8,
                            size_min: 1.5,
                            size_max: 3.5,
                            sync: false
                        }
                    },
                    links: {
                        enable: true,
                        distance: 80,
                        color: '#ffffff',
                        opacity: 0.4,
                        width: 1
                    }
                }
            }
        ]
    });
}

/**
 * "术"章节粒子配置 - 升腾的光尘
 * 粒子颜色：#e6e6fa (淡紫色)
 * 运动：持续从底部生成，缓缓向上飘散，循环流动
 */
async function initShuParticles() {
    await tsParticles.load('particles-shu', {
        fpsLimit: 60,
        particles: {
            number: {
                value: 120,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#e6e6fa'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.4,
                    opacity_min: 0.2,
                    opacity_max: 0.7,
                    sync: false
                }
            },
            size: {
                value: 2,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    size_min: 1,
                    size_max: 3,
                    sync: false
                }
            },
            links: {
                enable: false
            },
            move: {
                enable: true,
                speed: 1,
                direction: 'top',
                random: true,
                straight: false,
                outMode: 'bounce',
                bounce: true,
                attract: {
                    enable: false
                }
            }
        },
        interactivity: {
            detectsOn: 'canvas',
            events: {
                onHover: {
                    enable: false
                },
                onClick: {
                    enable: false
                },
                resize: true
            }
        },
        detectRetina: true,
        emitters: [
            {
                direction: 'top',
                life: {
                    count: -1,
                    delay: {
                        value: 0,
                        sync: false
                    },
                    duration: {
                        value: 0,
                        sync: false
                    }
                },
                rate: {
                    delay: {
                        value: 0.1,
                        sync: false
                    },
                    quantity: {
                        value: 2,
                        sync: false,
                        random: {
                            enable: true,
                            minimumValue: 1
                        }
                    }
                },
                position: {
                    x: {
                        min: 10,
                        max: 90
                    },
                    y: 95
                },
                size: {
                    mode: 'percent',
                    value: {
                        min: 0,
                        max: 100
                    }
                },
                particles: {
                    color: {
                        value: '#e6e6fa'
                    },
                    move: {
                        enable: true,
                        speed: 1.2,
                        direction: 'top',
                        random: true,
                        straight: false,
                        outMode: 'bounce',
                        bounce: true
                    },
                    opacity: {
                        value: 0.4,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 0.3,
                            opacity_min: 0.2,
                            opacity_max: 0.6,
                            sync: false
                        }
                    },
                    size: {
                        value: 1.5,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 0.8,
                            size_min: 1,
                            size_max: 2.5,
                            sync: false
                        }
                    }
                }
            }
        ]
    });
}

// 等待 DOM 和 tsParticles 加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保 tsParticles 已加载
    setTimeout(function() {
        if (typeof tsParticles !== 'undefined') {
            initDataStreams();
        } else {
            console.warn('tsParticles 加载失败，请检查网络连接');
        }
    }, 100);
});

// 页面加载完成后再次尝试初始化
window.addEventListener('load', function() {
    if (typeof tsParticles !== 'undefined' && typeof initDataStreams === 'function') {
        // 检查是否已经初始化
        const daoCanvas = document.getElementById('particles-dao');
        if (daoCanvas && !daoCanvas.querySelector('canvas')) {
            initDataStreams();
        }
    }
});
