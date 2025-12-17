@echo off
chcp 65001 >nul
echo ========================================
echo 音频文件下载助手
echo ========================================
echo.
echo 此脚本将帮助您下载所需的音频文件
echo.

cd assets\audio

echo 正在检查已存在的文件...
if exist "bgm_ambient.mp3" echo [已存在] bgm_ambient.mp3
if exist "dao_enter.mp3" echo [已存在] dao_enter.mp3
if exist "fa_enter.mp3" echo [已存在] fa_enter.mp3
if exist "qi_enter.mp3" echo [已存在] qi_enter.mp3
if exist "qi_tool_hover.mp3" echo [已存在] qi_tool_hover.mp3
if exist "qi_card_flip.mp3" echo [已存在] qi_card_flip.mp3

echo.
echo ========================================
echo 下载链接（请复制到浏览器下载）:
echo ========================================
echo.
echo 1. 背景音乐 (bgm_ambient.mp3):
echo    https://assets.mixkit.co/music/preview/mixkit-driving-ambient-32.mp3
echo.
echo 2. 道章节音效 (dao_enter.mp3):
echo    https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3
echo.
echo 3. 法章节音效 (fa_enter.mp3):
echo    https://assets.mixkit.co/sfx/preview/mixkit-page-turn-1104.mp3
echo.
echo 4. 器章节音效 (qi_enter.mp3):
echo    https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-echo-blip-919.mp3
echo.
echo 5. 工具悬停音效 (qi_tool_hover.mp3):
echo    https://assets.mixkit.co/sfx/preview/mixkit-click-button-1117.mp3
echo.
echo 6. 卡片翻转音效 (qi_card_flip.mp3):
echo    https://assets.mixkit.co/sfx/preview/mixkit-card-flip-914.mp3
echo.
echo ========================================
echo 下载说明:
echo 1. 复制上述链接到浏览器
echo 2. 右键点击播放器，选择"另存为"
echo 3. 保存到当前目录 (assets\audio\)
echo 4. 确保文件名完全匹配
echo ========================================
echo.
pause

