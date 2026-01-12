#!/usr/bin/env python3
"""
深度分析写作内容的脚本
为周洞察生成提供原始数据和初步分析
"""

import os
import sys
import re
from datetime import datetime, timedelta
from pathlib import Path
import json
from collections import defaultdict
from typing import List, Dict, Any


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


def extract_keywords(files: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    基于多维度权重提取5个关键词

    权重计算:
    - 主题相关性 (40%): 周月刊×3, AI相关/工作项目×2, 剪藏中转×1
    - 情感强度 (30%): 情绪标记词×2, 认知动词×1.5
    - 行动导向 (30%): 义务动词×1.5, 时间标记×1.3
    """

    # 文件夹权重
    folder_weights = {
        '周月刊': 3.0,
        'AI相关': 2.0,
        '工作项目': 2.0,
        '剪藏中转': 1.0
    }

    # 情绪标记词
    emotion_markers = [
        '焦虑', '兴奋', '困惑', '决心', '害怕', '期待',
        '犯怵', '抗拒', '躲避', '平常心', '意识到',
        '发现', '学到', '明白了', '不清楚', '担心'
    ]

    # 认知动词
    cognition_verbs = [
        '意识到', '发现', '学到', '明白', '理解',
        '认识到', '看清楚', '想清楚', '反思'
    ]

    # 义务动词
    obligation_verbs = [
        '应该', '需要', '要', '必须', '得',
        '准备', '计划', '想要', '希望'
    ]

    # 时间标记
    time_markers = [
        '接下来', '下周', '明天', '以后',
        '未来', '以后', '将来'
    ]

    # 通用词过滤表
    stop_words = {
        # 基础通用词
        'AI', '学习', '工作', '时间', '内容', '东西',
        '问题', '方法', '方向', '感觉', '觉得', '认为',
        '可能', '应该', '这个', '那个', '什么', '怎么',
        '数据', '模型', '产品', '使用', '用户', '系统',
        '功能', '能力', '评估', '评测', '一个', '可以',
        '进行', '实现', '基于', '通过', '需要', '如果',
        '但是', '所以', '还是', '已经', '可以', '如何',
        '这些', '那些', '哪些', '什么', '怎么',

        # 技术相关通用词
        '产品经理', '品经理', '技术', '开发', '设计',
        '分析', '测试', '优化', '管理', '流程',
        '项目', '业务', '服务', '平台', '应用',
        '代码', '算法', '架构', '部署', '运维',

        # 常见虚词
        '的', '了', '在', '是', '我', '有', '和',
        '就', '不', '人', '都', '一', '一个', '上',
        '也', '很', '到', '说', '要', '去', '你',
        '会', '着', '没有', '看', '好', '自己', '这',

        # 无意义的词组
        '的评测', '的评分', '的理解', '的判断',
        '的构建', '的衡量', '的识别', '的优化'
    }

    # 统计词频和权重
    word_scores = defaultdict(float)
    word_evidence = defaultdict(list)

    for file in files:
        content = file['content']
        folder = file['folder']
        base_weight = folder_weights.get(folder, 1.0)

        # 简单分词 (中文按空格和标点分割)
        words = re.findall(r'[\u4e00-\u9fa5]{2,4}', content)

        for word in words:
            if word in stop_words:
                continue

            # 基础权重
            score = base_weight

            # 情感强度加成
            if word in emotion_markers:
                score *= 2.0

            # 检查词所在句子的上下文
            sentences = re.split(r'[。！？；\n]', content)
            for sentence in sentences:
                if word in sentence:
                    # 认知动词加成
                    if any(v in sentence for v in cognition_verbs):
                        score *= 1.5

                    # 义务动词加成
                    if any(v in sentence for v in obligation_verbs):
                        score *= 1.5

                    # 时间标记加成
                    if any(t in sentence for t in time_markers):
                        score *= 1.3

                    # 标题加成 (行首的词)
                    sentence_stripped = sentence.strip()
                    if sentence_stripped.startswith(word):
                        score *= 3.0
                        break

            word_scores[word] += score

            # 收集证据 (最多保存3条)
            if len(word_evidence[word]) < 3:
                # 找到包含这个词的句子片段作为上下文
                for sentence in sentences:
                    if word in sentence and len(sentence.strip()) > 5:
                        word_evidence[word].append({
                            'source': f"{folder}/{file['filename']}",
                            'context': sentence.strip()[:80]
                        })
                        break

    # 排序并取前5
    sorted_words = sorted(word_scores.items(), key=lambda x: x[1], reverse=True)[:5]

    keywords = []
    for word, score in sorted_words:
        keywords.append({
            'word': word,
            'score': round(score, 1),
            'evidence': word_evidence.get(word, [])
        })

    return {'keywords': keywords}


def extract_todos(files: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    提取显性Todo (第一层识别)

    匹配模式: [应该|需要|要|准备|计划] + [动词短语]
    """

    # Todo匹配模式
    todo_patterns = [
        r'(?:应该|需要|要|必须|得)([^。！？；\n]{1,50})',
        r'(?:准备|计划|想要|希望)(?:去|[^。！？；\n]{1,50})',
        r'(?:接下来|下周|明天)([^。！？；\n]{1,50})'
    ]

    todos = []
    todo_id = 1

    for file in files:
        # 只从周月刊和工作项目中提取
        if file['folder'] not in ['周月刊', '工作项目']:
            continue

        content = file['content']

        for pattern in todo_patterns:
            matches = re.finditer(pattern, content)

            for match in matches:
                todo_text = match.group(0).strip()

                # 过滤太短或太长的
                if len(todo_text) < 5 or len(todo_text) > 100:
                    continue

                # 确定优先级
                priority = 'medium'
                if any(word in todo_text for word in ['必须', '一定要', '急', '重要']):
                    priority = 'high'
                elif any(word in todo_text for word in ['可以', '也许', '可能']):
                    priority = 'low'

                todos.append({
                    'id': f'todo-{todo_id:03d}',
                    'content': todo_text,
                    'type': 'extracted',
                    'priority': priority,
                    'source': f"{file['folder']}/{file['filename']}",
                    'status': 'pending'
                })

                todo_id += 1

    return {'todos': todos}


def infer_todos_from_insight(files: List[Dict[str, Any]], extracted_todos: List[Dict]) -> Dict[str, Any]:
    """
    推演型Todo生成 (第二层识别)

    基于盲点反推行动项
    """
    inferred_todos = []
    todo_id = len(extracted_todos) + 1

    # 分析内容特征,识别盲点模式
    all_content = '\n'.join([f['content'] for f in files])
    week_words = len(all_content)

    # 统计各文件夹字数
    folder_word_counts = {}
    for file in files:
        folder = file['folder']
        folder_word_counts[folder] = folder_word_counts.get(folder, 0) + file['word_count']

    # 模式1: 收集不实践
    clipping_count = folder_word_counts.get('剪藏中转', 0)
    own_content_count = folder_word_counts.get('周月刊', 0) + folder_word_counts.get('AI相关', 0)

    if clipping_count > 50000 and own_content_count < 10000:
        # 收集了大量内容但产出很少
        inferred_todos.append({
            'id': f'todo-{todo_id:03d}',
            'content': f'本周选择1个剪藏主题实践,不再继续收集新内容',
            'type': 'inferred',
            'priority': 'high',
            'source': '推演: 剪藏/产出比过高',
            'blindspot': f'剪藏{clipping_count//10000}万字内容,但仅产出{own_content_count//10000}万字',
            'minimal_action': '从剪藏中转选择1篇文章,实践其中1个方法',
            'expected_outcome': '产出至少1个实践结果或笔记',
            'status': 'pending'
        })
        todo_id += 1

    # 模式2: AI学习但无实践
    ai_keywords = ['AI', '模型', '评测', '评估', '产品经理']
    ai_mention = sum(1 for kw in ai_keywords if kw in all_content)
    has_ai_projects = '博客' in all_content or 'skill' in all_content or '工具' in all_content

    if ai_mention >= 3 and has_ai_projects:
        inferred_todos.append({
            'id': f'todo-{todo_id:03d}',
            'content': '给个人AI项目添加简单的评测指标',
            'type': 'inferred',
            'priority': 'high',
            'source': '推演: 关注AI但无评测体系',
            'blindspot': '剪藏AI评测方法论,但个人项目无评测',
            'minimal_action': '选择1个AI项目,定义3个核心指标',
            'expected_outcome': '建立基础评测体系',
            'status': 'pending'
        })
        todo_id += 1

    # 模式3: 提到人脉但无行动
    if '人脉' in all_content or '积累' in all_content:
        has_plan = '清单' in all_content or '列表' in all_content
        if not has_plan:
            inferred_todos.append({
                'id': f'todo-{todo_id:03d}',
                'content': '列出10个想深入沟通的人',
                'type': 'inferred',
                'priority': 'medium',
                'source': '推演: 意识到要积累人脉但无清单',
                'blindspot': '意识到重要性但没有具体行动计划',
                'minimal_action': '写下10个名字,每个标注1个沟通话题',
                'expected_outcome': '完成人脉清单,预约至少1人',
                'status': 'pending'
            })
            todo_id += 1

    # 模式4: 工具学习提到多次但未开始
    tool_keywords = ['Figma', 'figma', '工具', '软件']
    tool_mentions = sum(1 for kw in tool_keywords if kw in all_content)
    if tool_mentions >= 2:
        inferred_todos.append({
            'id': f'todo-{todo_id:03d}',
            'content': '开始学习提到的工具(如Figma)',
            'type': 'inferred',
            'priority': 'medium',
            'source': '推演: 多次提到需要学习但未开始',
            'blindspot': '反复提到需求但缺乏行动',
            'minimal_action': '本周观看1个入门教程(30分钟)',
            'expected_outcome': '完成基础入门,能做简单操作',
            'status': 'pending'
        })
        todo_id += 1

    return {'inferred_todos': inferred_todos}


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
    parser.add_argument('--extract-keywords', action='store_true',
                       help='提取关键词')
    parser.add_argument('--extract-todos', action='store_true',
                       help='提取Todo')

    args = parser.parse_args()

    end_date = datetime.now()
    start_date = end_date - timedelta(days=args.days)
    week_id = end_date.isocalendar()
    week_str = f"{end_date.year}-W{week_id[1]:02d}"

    print(f"正在分析 {args.writing_dir} ...")
    print(f"时间范围: {start_date.strftime('%Y-%m-%d')} 到 {end_date.strftime('%Y-%m-%d')}")
    print(f"周次: {week_str}")
    print(f"监控文件夹: {', '.join(args.folders)}")

    files = find_markdown_files(args.writing_dir, args.folders, start_date, end_date)
    print(f"找到 {len(files)} 个文件")

    if not files:
        print("未找到符合条件的文件")
        return

    report = generate_analysis_report(files)

    # 提取关键词
    keywords = None
    if args.extract_keywords:
        keywords_data = extract_keywords(files)
        keywords = keywords_data['keywords']
        report['keywords'] = keywords
        print(f"\n提取了 {len(keywords)} 个关键词")

    # 提取Todo
    todos = None
    all_todos = []
    if args.extract_todos:
        # 第一层: 显性Todo提取
        extracted_data = extract_todos(files)
        extracted_todos = extracted_data['todos']
        all_todos.extend(extracted_todos)
        print(f"提取了 {len(extracted_todos)} 个显性Todo")

        # 第二层: 推演型Todo生成
        inferred_data = infer_todos_from_insight(files, extracted_todos)
        inferred_todos = inferred_data['inferred_todos']
        all_todos.extend(inferred_todos)
        print(f"推演了 {len(inferred_todos)} 个Todo")

        # 合并所有Todo
        todos = all_todos
        report['todos'] = todos
        report['extracted_todos_count'] = len(extracted_todos)
        report['inferred_todos_count'] = len(inferred_todos)
        print(f"总共 {len(todos)} 个Todo")

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
