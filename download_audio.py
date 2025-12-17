#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
音频文件下载脚本
使用Python下载免费音频资源
"""

import os
import requests
from pathlib import Path

# 创建音频目录
audio_dir = Path("assets/audio")
audio_dir.mkdir(parents=True, exist_ok=True)

# 音频文件URL和文件名映射
audio_files = {
    "bgm_ambient.mp3": "https://assets.mixkit.co/music/preview/mixkit-driving-ambient-32.mp3",
    "dao_enter.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-bell-notification-933.mp3",
    "fa_enter.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-page-turn-1104.mp3",
    "qi_enter.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-echo-blip-919.mp3",
    "qi_tool_hover.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-click-button-1117.mp3",
    "qi_card_flip.mp3": "https://assets.mixkit.co/sfx/preview/mixkit-card-flip-914.mp3"
}

# 备用URL（如果Mixkit失败）
backup_urls = {
    "bgm_ambient.mp3": [
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    ],
    "dao_enter.mp3": [
        "https://notificationsounds.com/storage/sounds/notification-sounds-882.mp3",
    ],
    "fa_enter.mp3": [
        "https://notificationsounds.com/storage/sounds/notification-sounds-882.mp3",
    ],
    "qi_enter.mp3": [
        "https://notificationsounds.com/storage/sounds/notification-sounds-882.mp3",
    ],
    "qi_tool_hover.mp3": [
        "https://notificationsounds.com/storage/sounds/notification-sounds-882.mp3",
    ],
    "qi_card_flip.mp3": [
        "https://notificationsounds.com/storage/sounds/notification-sounds-882.mp3",
    ]
}

def download_file(url, filepath, headers=None):
    """下载文件"""
    try:
        if headers is None:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5',
                'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'Referer': 'https://mixkit.co/',
            }
        
        print(f"正在下载: {filepath.name}...")
        response = requests.get(url, headers=headers, timeout=30, stream=True, allow_redirects=True)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        downloaded = 0
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
                    downloaded += len(chunk)
                    if total_size > 0:
                        percent = (downloaded / total_size) * 100
                        print(f"\r  进度: {percent:.1f}%", end='', flush=True)
        
        print()  # 换行
        file_size = filepath.stat().st_size / 1024  # KB
        print(f"✓ 下载成功: {filepath.name} ({file_size:.2f} KB)")
        return True
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 403:
            print(f"✗ 403禁止访问: {filepath.name} (可能需要浏览器下载)")
        else:
            print(f"✗ HTTP错误 {e.response.status_code}: {filepath.name}")
        return False
    except Exception as e:
        print(f"✗ 下载失败: {filepath.name} - {e}")
        return False

def main():
    print("开始下载音频文件...\n")
    
    downloaded = 0
    failed = []
    
    for filename, urls in audio_files.items():
        filepath = audio_dir / filename
        
        # 如果文件已存在，跳过
        if filepath.exists():
            file_size = filepath.stat().st_size / 1024
            print(f"⏭ 文件已存在: {filename} ({file_size:.2f} KB)")
            downloaded += 1
            continue
        
        # 尝试所有URL
        success = False
        for url in urls:
            if download_file(url, filepath):
                downloaded += 1
                success = True
                break
        
        if not success:
            failed.append(filename)
            print(f"  ⚠ 所有URL都失败，请手动下载: {filename}")
    
    print(f"\n下载完成!")
    print(f"成功: {downloaded}/{len(audio_files)}")
    if failed:
        print(f"失败: {', '.join(failed)}")
        print("\n提示: 失败的音频文件需要手动下载")
        print("请参考 assets/audio/README.md 中的备选方案")

if __name__ == "__main__":
    main()

