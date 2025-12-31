async function analyzeArticle() {
    const articleUrl = document.getElementById('articleUrl').value;
    if (!articleUrl) {
        alert('请输入文章链接');
        return;
    }

    try {
        // 显示加载状态
        document.querySelector('.result-section').style.display = 'block';
        document.getElementById('summary').innerHTML = '<div class="text-center">正在分析文章...</div>';
        document.getElementById('mindmap').innerHTML = '<div class="text-center">正在生成思维导图...</div>';
        document.getElementById('qa').innerHTML = '<div class="text-center">正在生成问答...</div>';

        // 这里将来需要添加后端API调用来获取文章内容和分析结果
        // 目前使用模拟数据演示界面效果
        const mockData = await getMockAnalysis();
        
        // 更新界面显示
        displayResults(mockData);

    } catch (error) {
        console.error('分析文章时出错:', error);
        alert('分析文章时出错，请稍后重试');
    }
}

async function getMockAnalysis() {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        summary: '这是一篇关于人工智能发展的文章。文章主要讨论了AI技术的现状、未来发展趋势以及可能带来的社会影响。作者认为，AI技术将在未来十年内显著改变我们的生活方式。',
        mindmap: {
            title: '人工智能发展',
            children: [
                { title: '现状分析', content: '当前AI技术已经在多个领域取得突破' },
                { title: '发展趋势', content: '未来十年将迎来快速发展期' },
                { title: '社会影响', content: '将改变工作方式和生活方式' }
            ]
        },
        qa: [
            {
                question: '文章提到的AI技术主要应用领域有哪些？',
                answer: '文章提到AI技术主要应用于医疗、教育、交通等领域。'
            },
            {
                question: '作者对AI发展持什么态度？',
                answer: '作者持积极乐观的态度，认为AI将带来积极的社会变革。'
            }
        ]
    };
}

function displayResults(data) {
    // 显示文章总结
    document.getElementById('summary').innerHTML = `
        <p class="lead">${data.summary}</p>
    `;

    // 显示思维导图（简化版本）
    const mindmapHtml = generateMindmapHtml(data.mindmap);
    document.getElementById('mindmap').innerHTML = mindmapHtml;

    // 显示问答部分
    const qaHtml = data.qa.map(item => `
        <div class="mb-4">
            <h6 class="text-primary">问：${item.question}</h6>
            <p class="ms-3">${item.answer}</p>
        </div>
    `).join('');
    document.getElementById('qa').innerHTML = qaHtml;
}

function generateMindmapHtml(mindmap) {
    const childrenHtml = mindmap.children.map(child => `
        <div class="card mb-2">
            <div class="card-body">
                <h6 class="card-title">${child.title}</h6>
                <p class="card-text small">${child.content}</p>
            </div>
        </div>
    `).join('');

    return `
        <div class="text-center mb-3">
            <h5>${mindmap.title}</h5>
        </div>
        <div class="mindmap-children">
            ${childrenHtml}
        </div>
    `;
}