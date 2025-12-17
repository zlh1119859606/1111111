# 音频文件说明

## 所需音频文件

请将以下音频文件放置在此目录下（`assets/audio/`）：

### 必需文件列表

1. **bgm_ambient.mp3** - 背景音乐
   - 格式：MP3
   - 大小：建议 < 3MB
   - 类型：氛围电子/禅意音乐
   - 要求：循环播放，无突兀的起始和结束

2. **dao_enter.mp3** - "道"章节音效
   - 格式：MP3
   - 大小：建议 < 500KB
   - 类型：钟声/空灵音效
   - 时长：1-3秒

3. **fa_enter.mp3** - "法"章节音效
   - 格式：MP3
   - 大小：建议 < 500KB
   - 类型：翻书/笔触音效
   - 时长：1-3秒

4. **qi_enter.mp3** - "器"章节音效
   - 格式：MP3
   - 大小：建议 < 500KB
   - 类型：科技嗡鸣音效
   - 时长：1-3秒

5. **qi_tool_hover.mp3** - 工具悬停音效
   - 格式：MP3
   - 大小：建议 < 200KB
   - 类型：轻微点击音效
   - 时长：0.5-1秒

6. **qi_card_flip.mp3** - 卡片翻转音效
   - 格式：MP3
   - 大小：建议 < 300KB
   - 类型：纸牌翻转音效
   - 时长：0.5-1.5秒

## 备选方案（临时测试用）

如果暂无音频文件，可以使用以下免版税资源：

### 背景音乐
```
https://assets.mixkit.co/music/preview/mixkit-driving-ambient-32.mp3
```

### 章节音效
- 道章节（钟声）：
  ```
  https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3
  ```

- 法章节（翻书）：
  ```
  https://assets.mixkit.co/sfx/preview/mixkit-page-turn-1104.mp3
  ```

- 器章节（科技音）：
  ```
  https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-echo-blip-919.mp3
  ```

- 工具悬停（点击）：
  ```
  https://assets.mixkit.co/sfx/preview/mixkit-click-button-1117.mp3
  ```

- 卡片翻转：
  ```
  https://assets.mixkit.co/sfx/preview/mixkit-card-flip-914.mp3
  ```

## 下载方法

1. 访问上述链接
2. 右键点击音频播放器，选择"另存为"
3. 重命名为对应的文件名
4. 保存到 `assets/audio/` 目录

## 注意事项

- 所有音频文件必须使用 **MP3 格式**以确保最佳兼容性
- 文件路径区分大小写，请确保文件名完全匹配
- 如果音频文件不存在，系统会在控制台显示警告，但不会影响网站其他功能
- 建议使用音频编辑软件（如 Audacity）优化音频文件大小和音量

## 测试方法

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签，确认音频系统已初始化
3. 检查 Network 标签，确认音频文件已加载
4. 测试功能：
   - 点击左下角音频控制按钮，切换背景音乐
   - 调整音量滑块
   - 滚动到不同章节，听章节触发音效
   - 悬停在"器"章节的工具上，听悬停音效
   - 悬停在项目卡片上，听翻转音效




