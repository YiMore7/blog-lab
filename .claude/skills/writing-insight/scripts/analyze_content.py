#!/usr/bin/env python3
"""
深度分析写作内容的脚本
为周洞察生成提供原始数据和初步分析
"""

import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
import json
from collections import defaultdict

def find_markdown_files(base_dir, folders, start_date=None, end_date=None):
    """查找指定文件夹和时间范围内的 Markdown 文件"""
    markdown_files = []
    base_path = Path(base_dir)

    for folder in folders:
        folder_path = base_path / folder
        if not folder_path.exists():
            continue

        for md_file in folder_path.rglob("*.md"):
            mtime = datetime.fromtimestamp(md_file.stat().st_mtime)

            if start_date and mtime < start_date:
                continue
            if end_date and mtime > end_date:
                continue

            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                markdown_files.append({
                    'path': str(md_file),
                    'relative_path': str(md_file.relative_to(base_path)),
                    'mtime': mtime,
                    'content': content,
                    'folder': folder,
                    'filename': md_file.stem,
                    'word_count': len(content)
                })
            except Exception as e:
                print(f"Warning: Could not read {md_file}: {e}", file=sys.stderr)

    markdown_files.sort(key=lambda x: x['mtime'])
    return markdown_files


def analyze_by_folder(files):
    """按文件夹分析内容分布"""
    folder_stats = defaultdict(lambda: {
        'count': 0,
        'total_words': 0,
        'files': []
    })

    for file in files:
        folder = file['folder']
        folder_stats[folder]['count'] += 1
        folder_stats[folder]['total_words'] += file['word_count']
        folder_stats[folder]['files'].append({
            'filename': file['filename'],
            'mtime': file['mtime'].isoformat(),
            'word_count': file['word_count'],
            'path': file['relative_path']
        })

    return dict(folder_stats)


def generate_analysis_report(files):
    """生成分析报告"""
    report = {
        'summary': {
            'total_files': len(files),
            'time_range': {}
        },
        'by_folder': analyze_by_folder(files),
        'files': []
    }

    if files:
        report['summary']['time_range'] = {
            'start': files[0]['mtime'].isoformat(),
            'end': files[-1]['mtime'].isoformat()
        }

    # 只保留必要信息
    for file in files:
        report['files'].append({
            'path': file['relative_path'],
            'filename': file['filename'],
            'mtime': file['mtime'].isoformat(),
            'folder': file['folder'],
            'word_count': file['word_count'],
            'content_preview': file['content'][:500]  # 只保留前500字符
        })

    return report


def main():
    import argparse

    parser = argparse.ArgumentParser(description='分析写作内容')
    parser.add_argument('writing_dir', help='Writing 文件夹路径')
    parser.add_argument('--days', type=int, default=7, help='分析最近几天的内容（默认7天）')
    parser.add_argument('--folders', nargs='+',
                       default=['工作项目', '剪藏中转', '周月刊', 'AI相关'],
                       help='要分析的文件夹列表')
    parser.add_argument('--output', help='输出 JSON 文件路径（可选）')

    args = parser.parse_args()

    end_date = datetime.now()
    start_date = end_date - timedelta(days=args.days)

    print(f"正在分析 {args.writing_dir} ...")
    print(f"时间范围: {start_date.strftime('%Y-%m-%d')} 到 {end_date.strftime('%Y-%m-%d')}")
    print(f"监控文件夹: {', '.join(args.folders)}")

    files = find_markdown_files(args.writing_dir, args.folders, start_date, end_date)
    print(f"找到 {len(files)} 个文件")

    if not files:
        print("未找到符合条件的文件")
        return

    report = generate_analysis_report(files)

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"\n分析报告已保存到: {args.output}")
    else:
        print("\n" + "="*60)
        print(json.dumps(report, ensure_ascii=False, indent=2))
        print("="*60)


if __name__ == '__main__':
    main()
