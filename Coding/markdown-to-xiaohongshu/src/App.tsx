import { useState, useEffect, useRef } from 'react'
import { Download, Palette, MessageCircle, Bot, User, ChevronDown, ChevronUp, Settings, Eye } from 'lucide-react'
import * as htmlToImage from 'html-to-image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Theme = 'minimal' | 'aurora' | 'glass' | 'gradient'

const themes = {
  minimal: {
    name: '极简黑白',
    bg: 'bg-gray-50',
    text: 'text-gray-900',
    accent: 'text-gray-600',
    userBubble: 'bg-blue-500 text-white',
    aiBubble: 'bg-gray-200 text-gray-900'
  },
  aurora: {
    name: '渐变极光',
    bg: 'bg-gradient-to-br from-purple-400 via-pink-400 to-red-400',
    text: 'text-white',
    accent: 'text-white/80',
    userBubble: 'bg-white/20 backdrop-blur text-white border border-white/30',
    aiBubble: 'bg-white/10 backdrop-blur text-white border border-white/20'
  },
  glass: {
    name: '毛玻璃',
    bg: 'bg-white/20 backdrop-blur-xl',
    text: 'text-gray-900',
    accent: 'text-gray-600',
    userBubble: 'bg-blue-500/80 backdrop-blur text-white',
    aiBubble: 'bg-gray-300/80 backdrop-blur text-gray-900'
  },
  gradient: {
    name: '梦幻渐变',
    bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
    text: 'text-gray-900',
    accent: 'text-gray-600',
    userBubble: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    aiBubble: 'bg-white border-2 border-gray-200 text-gray-900 shadow-sm'
  }
}

interface Message {
  role: 'user' | 'ai'
  content: string
}

function parseMarkdownToMessages(markdown: string): Message[] {
  const lines = markdown.split('\n')
  const messages: Message[] = []
  let currentRole: 'user' | 'ai' = 'user'
  let currentContent = ''

  for (const line of lines) {
    if (line.startsWith('**用户**:')) {
      if (currentContent.trim()) {
        messages.push({ role: currentRole, content: currentContent.trim() })
      }
      currentRole = 'user'
      currentContent = line.replace('**用户**:', '').trim()
    } else if (line.startsWith('**AI**:')) {
      if (currentContent.trim()) {
        messages.push({ role: currentRole, content: currentContent.trim() })
      }
      currentRole = 'ai'
      currentContent = line.replace('**AI**:', '').trim()
    } else {
      currentContent += (currentContent ? '\n' : '') + line
    }
  }

  if (currentContent.trim()) {
    messages.push({ role: currentRole, content: currentContent.trim() })
  }

  return messages
}

function App() {
  // 全局错误监控
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 全局错误捕获:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        type: 'error'
      })
    }
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 未处理的Promise拒绝:', {
        reason: event.reason,
        type: 'promise'
      })
    }
    
    const handleResourceError = (event: Event) => {
      const target = event.target as any
      if (target && target.tagName) {
        console.error('🚨 资源加载错误:', {
          tagName: target.tagName,
          src: target.src,
          href: target.href,
          type: 'resource'
        })
      }
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleResourceError, true) // 捕获阶段
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleResourceError, true)
    }
  }, [])
  const [markdown, setMarkdown] = useState(`**用户**: 你好，我最近在学习编程，但是感觉很迷茫，不知道从哪里开始。

**AI**: 你好！我完全理解你的感受。编程学习确实容易让人感到overwhelmed，但这是很正常的。

**用户**: 是啊，网上有太多的资源和教程了，反而不知道该怎么选择。有什么建议吗？

**AI**: 这是个很好的问题！让我给你一些实用的建议：

1. **先确定目标**：你是想找工作、做项目，还是纯粹兴趣？
2. **选择一门语言**：Python对初学者很友好
3. **找一个好的入门课程**：比如CS50或Python Crash Course
4. **动手实践**：边学边做项目

记住，编程是马拉松，不是短跑！

**用户**: 你说得对，我可能太急于求成了。那具体怎么安排学习时间呢？

**AI**: 很高兴你有这个觉悟！关于时间安排：

- **每天1-2小时**比周末突击10小时更有效
- **建立学习习惯**，比如每天早上或晚上固定时间
- **番茄工作法**：25分钟专注学习，5分钟休息
- **记录学习进度**，看到自己的进步会很有成就感

最重要的是：**不要完美主义，先完成再完美**！

**用户**: 谢谢你的建议！我现在感觉清晰多了。最后一个问题，怎么保持学习动力？

**AI**: 很好的问题！保持动力的秘诀：`)
  
  const [theme, setTheme] = useState<Theme>('gradient')
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [letterSpacing, setLetterSpacing] = useState(0)
  const [showTimestamp, setShowTimestamp] = useState(true)
  const [showAvatars, setShowAvatars] = useState(true)
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'justify'>('left')
  const [exportQuality, setExportQuality] = useState<'high' | 'medium' | 'low'>('high')
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportHistory, setExportHistory] = useState<Array<{ time: string; width: number; height: number; sizeKB: number; quality: string }>>([])
  const [exportFormat, setExportFormat] = useState<'png' | 'jpg'>('png')
  const [exportMode, setExportMode] = useState<'fixed' | 'adaptive'>('fixed')
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [importError, setImportError] = useState<string | null>(null)
  const [importFileInfo, setImportFileInfo] = useState<{ name: string; sizeKB: number; modified?: string } | null>(null)
  const [previousMarkdown, setPreviousMarkdown] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [showPaginationPreview, setShowPaginationPreview] = useState(true)
  const [paginationCuts, setPaginationCuts] = useState<number[]>([])
  const [paginationWarnings, setPaginationWarnings] = useState<string[]>([])

  // 手风琴面板状态
  const [accordionState, setAccordionState] = useState({
    theme: true,
    text: true,
    export: false,
    display: false
  })

  // 移动端模式切换
  const [mobileMode, setMobileMode] = useState<'settings' | 'preview'>('settings')

  // 运行兼容性测试
  useEffect(() => {
    runCompatibilityTest()
  }, [])

  // 智能边界检测函数
  const detectContentBounds = (element: HTMLElement) => {
    // 获取所有有意义的子元素
    const meaningfulElements = element.querySelectorAll('p, div, h1, h2, h3, span, .message-bubble, .text-content')
    let minTop = Infinity
    let maxBottom = -Infinity
    let minLeft = Infinity
    let maxRight = -Infinity

    console.log('检测到有意义元素数量:', meaningfulElements.length)

    // 遍历所有有意义的元素找到实际内容边界
    meaningfulElements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const parentRect = element.getBoundingClientRect()
      
      // 计算相对于父元素的位置
      const relativeTop = rect.top - parentRect.top
      const relativeBottom = rect.bottom - parentRect.top
      const relativeLeft = rect.left - parentRect.left
      const relativeRight = rect.right - parentRect.left
      
      // 只包含有实际文本内容的元素
      const textContent = el.textContent?.trim()
      const hasVisibleContent = textContent && textContent.length > 0
      
      if (hasVisibleContent) {
        minTop = Math.min(minTop, relativeTop)
        maxBottom = Math.max(maxBottom, relativeBottom)
        minLeft = Math.min(minLeft, relativeLeft)
        maxRight = Math.max(maxRight, relativeRight)
        
        console.log(`元素边界: ${el.tagName}, 顶部: ${relativeTop}, 底部: ${relativeBottom}, 内容: "${textContent?.substring(0, 20)}..."`)
      }
    })

    // 如果没有找到有意义的内容，使用元素本身的尺寸
    if (minTop === Infinity) {
      const rect = element.getBoundingClientRect()
      minTop = 0
      maxBottom = rect.height
      minLeft = 0
      maxRight = rect.width
      console.log('未找到有意义内容，使用元素本身尺寸')
    }

    // 添加适当的边距
    const padding = 60 // 增加边距
    const finalBounds = {
      top: Math.max(0, minTop - padding),
      bottom: Math.min(element.scrollHeight, maxBottom + padding),
      left: Math.max(0, minLeft - padding),
      right: Math.min(element.scrollWidth, maxRight + padding),
      width: maxRight - minLeft + padding * 2,
      height: maxBottom - minTop + padding * 2
    }

    console.log('最终边界:', finalBounds)
    return finalBounds
  }

  const readMarkdownFile = async (file: File): Promise<string> => {
    if (file.size > 10 * 1024 * 1024) throw new Error('文件大小超过10MB限制')
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)
    let encoding: string = 'utf-8'
    if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) encoding = 'utf-8'
    else if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) encoding = 'utf-16le'
    else if (bytes.length >= 2 && bytes[0] === 0xFE && bytes[1] === 0xFF) encoding = 'utf-16be'
    const decoder = new TextDecoder(encoding as any, { fatal: false })
    return decoder.decode(bytes)
  }

  const importMarkdownFromFile = async (file: File) => {
    try {
      setImportStatus('loading')
      setImportError(null)
      setPreviousMarkdown(markdown)
      const text = await readMarkdownFile(file)
      setMarkdown(text)
      setImportStatus('success')
      const dt = file.lastModified ? new Date(file.lastModified) : null
      setImportFileInfo({ name: file.name, sizeKB: Math.round(file.size / 1024), modified: dt ? `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}` : undefined })
    } catch (e) {
      setImportStatus('error')
      setImportError((e as Error).message)
    }
  }

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) await importMarkdownFromFile(f)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.name.toLowerCase().endsWith('.md')) {
      await importMarkdownFromFile(f)
    } else {
      setImportStatus('error')
      setImportError('仅支持导入 .md 文件')
    }
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setDragActive(true) }
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setDragActive(false) }

  const undoImport = () => {
    if (previousMarkdown !== null) {
      setMarkdown(previousMarkdown)
      setPreviousMarkdown(null)
      setImportStatus('idle')
      setImportError(null)
      setImportFileInfo(null)
    }
  }

  const waitForResources = async (container: HTMLElement) => {
    console.log('🔍 开始等待资源加载...')
    
    try {
      // 等待字体加载
      const fontReady = (document as any).fonts?.ready ?? Promise.resolve()
      console.log('📜 字体加载状态:', fontReady ? '有字体API' : '无字体API')
      
      // 检查图片资源
      const images = Array.from(container.querySelectorAll('img')) as HTMLImageElement[]
      console.log(`🖼️ 发现 ${images.length} 张图片`)
      
      const imageDecodes = images.map((img, index) => {
        return new Promise<void>((resolve) => {
          try {
            console.log(`  图片 ${index + 1}: src=${img.src}, complete=${img.complete}`)
            
            if (img.complete) {
              console.log(`  图片 ${index + 1} 已加载完成`)
              resolve()
              return
            }
            
            if (img.decode) {
              img.decode()
                .then(() => {
                  console.log(`  图片 ${index + 1} decode 成功`)
                  resolve()
                })
                .catch((err) => {
                  console.warn(`  图片 ${index + 1} decode 失败:`, err)
                  resolve() // 即使失败也继续
                })
            } else {
              const loadHandler = () => {
                console.log(`  图片 ${index + 1} 加载成功`)
                cleanup()
                resolve()
              }
              
              const errorHandler = () => {
                console.warn(`  图片 ${index + 1} 加载失败`)
                cleanup()
                resolve() // 即使失败也继续
              }
              
              const cleanup = () => {
                img.removeEventListener('load', loadHandler)
                img.removeEventListener('error', errorHandler)
              }
              
              img.addEventListener('load', loadHandler)
              img.addEventListener('error', errorHandler)
            }
          } catch (err) {
            console.error(`  图片 ${index + 1} 处理异常:`, err)
            resolve() // 即使异常也继续
          }
        })
      })
      
      console.log('⏳ 等待所有资源加载完成...')
      await Promise.all([fontReady, ...imageDecodes])
      console.log('✅ 所有资源加载完成')
      
      // 额外等待一帧确保渲染完成
      await new Promise(r => requestAnimationFrame(() => setTimeout(r, 50)))
      console.log('✅ 渲染帧等待完成')
      
    } catch (err) {
      console.error('❌ 资源加载过程出错:', err)
      // 即使出错也继续，不要阻塞导出流程
    }
  }

  const checkDataUrlNotBlank = async (dataUrl: string) => {
    const img = new Image()
    img.src = dataUrl
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('dataUrl 加载失败'))
    })
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return false
    ctx.drawImage(img, 0, 0)
    const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    // 简单判定：非零像素比例
    let nonZero = 0
    for (let i = 0; i < sample.length; i += 4) {
      if (sample[i + 3] > 10) { nonZero++; if (nonZero > 1000) break }
    }
    return nonZero > 1000
  }

  const sanitizeForExport = (root: HTMLElement) => {
    const els = Array.from(root.getElementsByTagName('*')) as HTMLElement[]
    els.forEach(el => {
      // 停止动画与过渡，避免渲染差异
      el.style.animation = 'none'
      el.style.transition = 'none'
      // 移除容易导致空白的滤镜
      el.style.filter = 'none'
      ;(el.style as any).backdropFilter = 'none'
      // 统一溢出
      el.style.overflow = el.style.overflow || 'visible'
      // 图片跨域安全
      if (el.tagName === 'IMG') {
        const img = el as HTMLImageElement
        try { img.crossOrigin = 'anonymous' } catch {}
      }
    })
  }

  const trimTransparentBorders = async (dataUrl: string, minWidth: number, minHeight: number, backgroundColor?: string) => {
    const img = new Image()
    img.src = dataUrl
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('导出图像加载失败'))
    })
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.drawImage(img, 0, 0)
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    const w = canvas.width, h = canvas.height
    let top = 0, bottom = h - 1, left = 0, right = w - 1
    const alphaAt = (x: number, y: number) => data[(y * w + x) * 4 + 3]
    // 找上边界
    for (let y = 0; y < h; y++) {
      let found = false
      for (let x = 0; x < w; x++) { if (alphaAt(x, y) > 10) { found = true; break } }
      if (found) { top = y; break }
    }
    // 找下边界
    for (let y = h - 1; y >= 0; y--) {
      let found = false
      for (let x = 0; x < w; x++) { if (alphaAt(x, y) > 10) { found = true; break } }
      if (found) { bottom = y; break }
    }
    // 找左边界
    for (let x = 0; x < w; x++) {
      let found = false
      for (let y = 0; y < h; y++) { if (alphaAt(x, y) > 10) { found = true; break } }
      if (found) { left = x; break }
    }
    // 找右边界
    for (let x = w - 1; x >= 0; x--) {
      let found = false
      for (let y = 0; y < h; y++) { if (alphaAt(x, y) > 10) { found = true; break } }
      if (found) { right = x; break }
    }
    const cropW = Math.max(minWidth, right - left + 1)
    const cropH = Math.max(minHeight, bottom - top + 1)
    const out = document.createElement('canvas')
    out.width = cropW
    out.height = cropH
    const octx = out.getContext('2d')!
    if (backgroundColor) { octx.fillStyle = backgroundColor; octx.fillRect(0, 0, cropW, cropH) }
    octx.drawImage(canvas, left, top, right - left + 1, bottom - top + 1, 0, 0, right - left + 1, bottom - top + 1)
    return out.toDataURL('image/png')
  }

  const formatError = (err: any): string => {
    try {
      if (!err) return '未知错误'
      if (err instanceof Error) return `${err.name}: ${err.message}`
      if (typeof err === 'string') return err
      if (err.type || (err.target && err.target.tagName)) {
        const t = err.type ?? (err.target && err.target.tagName)
        return `资源事件错误: ${String(t)}`
      }
      // 更详细的错误信息捕获
      if (err.target && err.target.src) {
        return `资源加载失败: ${err.target.src} (${err.type || 'unknown'})`
      }
      if (err.filename) {
        return `脚本错误: ${err.filename}:${err.lineno || 0}:${err.colno || 0} - ${err.message || '未知错误'}`
      }
      const msg = (err && err.message) ? err.message : undefined
      return msg ?? JSON.stringify(err)
    } catch {
      return '[无法解析错误]'
    }
  }

  const computePaginationOffsets = (element: HTMLElement, _targetWidth: number, targetHeight: number, bounds: { top: number; height: number; width: number }, scaleWidth: number) => {
    const warnings: string[] = []
    const temp = element.cloneNode(true) as HTMLElement
    temp.style.position = 'absolute'
    temp.style.top = '-9999px'
    temp.style.left = '-9999px'
    temp.style.width = '1080px'
    temp.style.height = 'auto'
    temp.style.transform = 'none'
    temp.style.transformOrigin = 'top left'
    document.body.appendChild(temp)
    const contentRoot = temp.querySelector('.space-y-6') as HTMLElement | null
    const cuts: number[] = []
    if (!contentRoot) {
      document.body.removeChild(temp)
      setPaginationCuts([])
      setPaginationWarnings(['未找到内容根节点，采用默认分页'])
      return { offsets: [bounds.top], warnings: ['未找到内容根节点'] }
    }
    const blocks = Array.from(contentRoot.children) as HTMLElement[]
    const parentRect = temp.getBoundingClientRect()
    let pageLimit = targetHeight / scaleWidth
    let pageStart = bounds.top
    let acc = 0
    let lastBottom = pageStart
    const offsets: number[] = [pageStart]
    blocks.forEach((block, idx) => {
      const rect = block.getBoundingClientRect()
      const h = rect.height
      const bottom = rect.bottom - parentRect.top
      if (h > pageLimit) {
        const tag = block.tagName.toLowerCase()
        warnings.push(`第${idx + 1}个块(${tag})高度(${Math.round(h)}px)超过单页限制(${Math.round(pageLimit)}px)，将跨页显示`)
      }
      if (acc + h <= pageLimit) {
        acc += h
        lastBottom = bottom
      } else {
        cuts.push(lastBottom)
        offsets.push(lastBottom)
        acc = h
        lastBottom = bottom
      }
    })
    document.body.removeChild(temp)
    // 将切线转换到预览缩放坐标（预览固定 scale(0.3)）
    const previewScale = 0.3
    setPaginationCuts(cuts.map(c => (c - bounds.top) * scaleWidth * previewScale))
    setPaginationWarnings(warnings)
    return { offsets, warnings }
  }

  const exportImage = async () => {
    const element = document.getElementById('preview-card')
    if (!element) {
      console.error('预览元素未找到')
      setExportError('预览元素未找到')
      return
    }

    // 在try块外声明变量，以便在catch块中访问
    let originalOnerror: any = null
    let originalOnunhandledrejection: any = null
    let capturedError: any = null

    try {
      setIsExporting(true)
      setExportError(null)
      
      // 添加全局错误监听
      originalOnerror = window.onerror
      originalOnunhandledrejection = window.onunhandledrejection
      
      window.onerror = (message, source, lineno, colno, error) => {
        capturedError = { message, source, lineno, colno, error, type: 'script' }
        console.error('全局脚本错误:', capturedError)
        return true
      }
      
      window.onunhandledrejection = (event) => {
        capturedError = { reason: event.reason, type: 'promise' }
        console.error('全局Promise错误:', capturedError)
      }

      // 获取导出质量设置
      const pixelRatio = exportQuality === 'high' ? 3 : exportQuality === 'medium' ? 2 : 1
      
      console.log('🔥 开始导出图片...')
      console.log('📱 像素比例:', pixelRatio)
      console.log('📐 元素尺寸:', element.offsetWidth, 'x', element.offsetHeight)
      console.log('🎨 当前主题:', theme)
      console.log('📊 导出模式:', exportMode)
      console.log('💾 导出格式:', exportFormat)

      // 检查元素状态
      if (!element.isConnected) {
        throw new Error('预览元素已从DOM中移除')
      }
      
      if (element.offsetWidth === 0 || element.offsetHeight === 0) {
        throw new Error('预览元素尺寸为0，可能未正确渲染')
      }

      // 智能检测内容边界
      console.log('🔍 开始检测内容边界...')
      const bounds = detectContentBounds(element)
      console.log('✅ 检测到内容边界:', bounds)

      // 确保最小尺寸为小红书标准，但使用检测到的边界
      const finalWidth = Math.max(1080, bounds.width)
      const finalHeight = Math.max(1440, bounds.height)

      console.log('📏 最终导出尺寸:', finalWidth, 'x', finalHeight)
      console.log('📍 内容边界 - 顶部:', bounds.top, '底部:', bounds.bottom, '高度:', bounds.height)

      const targetWidth = exportMode === 'fixed' ? 1080 : finalWidth
      const targetHeight = exportMode === 'fixed' ? 1440 : finalHeight

      const scaleWidth = Math.min(targetWidth / Math.max(bounds.width, 1), 1)
      const scaledHeight = bounds.height * scaleWidth
      let pageOffsets: number[] = []
      
      if (exportMode === 'fixed') {
        console.log('📄 计算分页偏移...')
        const result = computePaginationOffsets(element, targetWidth, targetHeight, { top: bounds.top, height: bounds.height, width: bounds.width }, scaleWidth)
        pageOffsets = result.offsets
        console.log('📑 分页偏移结果:', pageOffsets)
      }

      const exportOnePage = async (pageIndex: number) => {
        console.log(`📄 开始导出第 ${pageIndex + 1} 页...`)
        
        try {
          const tempContainer = document.createElement('div')
          tempContainer.style.position = 'absolute'
          tempContainer.style.top = '-9999px'
          tempContainer.style.left = '-9999px'
          tempContainer.style.width = `${targetWidth}px`
          tempContainer.style.height = `${targetHeight}px`
          tempContainer.style.overflow = 'hidden'
          tempContainer.style.background = theme === 'glass' ? 'transparent' : getComputedStyle(element).background

          console.log('🎯 创建临时容器:', {
            width: targetWidth,
            height: targetHeight,
            background: tempContainer.style.background || 'default'
          })

          const clone = element.cloneNode(true) as HTMLElement
          clone.style.position = 'absolute'
          const offsetY = exportMode === 'fixed' ? ((pageOffsets[pageIndex] ?? bounds.top) - bounds.top) : 0
          clone.style.top = `-${bounds.top + offsetY}px`
          clone.style.left = `-${bounds.left}px`
          clone.style.width = '1080px'
          clone.style.height = 'auto'
          clone.style.transform = `scale(${scaleWidth})`
          clone.style.transformOrigin = 'top left'
          
          console.log('🧬 克隆元素样式设置完成')
          sanitizeForExport(clone)

          tempContainer.appendChild(clone)
          document.body.appendChild(tempContainer)
          
          console.log('⏳ 等待资源加载...')
          await waitForResources(tempContainer)
          console.log('✅ 资源加载完成')

          let dataUrl: string
          try {
            console.log('🎨 开始图片转换...')
            if (exportFormat === 'png') {
              console.log('📸 使用PNG格式导出')
              dataUrl = await htmlToImage.toPng(tempContainer, {
                width: targetWidth,
                height: targetHeight,
                pixelRatio: pixelRatio,
                quality: 1,
                backgroundColor: theme === 'glass' ? 'transparent' : undefined,
                cacheBust: true
              })
            } else {
              console.log('📷 使用JPG格式导出')
              dataUrl = await htmlToImage.toJpeg(tempContainer, {
                width: targetWidth,
                height: targetHeight,
                pixelRatio: pixelRatio,
                quality: 0.92,
                backgroundColor: getComputedStyle(tempContainer).backgroundColor || '#ffffff',
                cacheBust: true
              })
            }
            console.log('✅ 图片转换成功')
          } catch (e) {
            console.warn('🚨 toPng/toJpeg 失败，尝试 toSvg 回退', formatError(e))
            console.log('🔄 开始SVG回退方案...')
            
            const svgUrl = await htmlToImage.toSvg(tempContainer, {
              width: targetWidth,
              height: targetHeight,
              cacheBust: true
            })
            console.log('✅ SVG转换成功')
            
            // 将SVG绘制到Canvas，生成最终PNG/JPG
            const svgImg = new Image()
            svgImg.crossOrigin = 'anonymous'
            
            console.log('🖼️ 开始SVG到图片转换...')
            await new Promise<void>((resolve, reject) => {
              svgImg.onload = () => {
                console.log('✅ SVG图片加载成功')
                resolve()
              }
              svgImg.onerror = (err) => {
                console.error('❌ SVG图片加载失败:', err)
                reject(err)
              }
              svgImg.src = svgUrl
            })
            
            const cvs = document.createElement('canvas')
            cvs.width = targetWidth
            cvs.height = targetHeight
            const cctx = cvs.getContext('2d')!
            
            if (exportFormat === 'jpg') {
              cctx.fillStyle = getComputedStyle(tempContainer).backgroundColor || '#ffffff'
              cctx.fillRect(0, 0, targetWidth, targetHeight)
            }
            
            cctx.drawImage(svgImg, 0, 0, targetWidth, targetHeight)
            dataUrl = cvs.toDataURL(exportFormat === 'png' ? 'image/png' : 'image/jpeg', exportFormat === 'png' ? undefined : 0.92)
            console.log('✅ SVG回退方案完成')
          }

          document.body.removeChild(tempContainer)
          console.log('🧹 临时容器已清理')

          console.log('🔍 开始验证导出结果...')
          let ok = await checkDataUrlNotBlank(dataUrl)
          console.log('✅ 导出结果验证:', ok ? '通过' : '失败')
          
          if (!ok) {
            console.warn('⚠️ 分页导出检测为空白，尝试退化管线')
            console.log('🔄 开始退化管线...')
            
            const fallbackUrl = await htmlToImage.toPng(element, {
              width: 1080,
              height: Math.max(1440, element.scrollHeight),
              pixelRatio: pixelRatio,
              quality: 1,
              style: { transform: 'none', overflow: 'visible', width: '1080px', height: `${Math.max(1440, element.scrollHeight)}px` },
              cacheBust: true
            })
            
            dataUrl = await trimTransparentBorders(fallbackUrl, targetWidth, targetHeight, exportFormat === 'jpg' ? '#ffffff' : undefined)
            ok = await checkDataUrlNotBlank(dataUrl)
            
            if (!ok) {
              throw new Error('导出结果为空白，请重试')
            }
            
            console.log('✅ 退化管线成功')
          }

          console.log('📊 计算文件大小...')
          let sizeKB = 0
          try {
            const blob = await (await fetch(dataUrl)).blob()
            sizeKB = Math.round(blob.size / 1024)
            console.log(`📏 文件大小: ${sizeKB}KB`)
          } catch {
            const base = dataUrl.split(',')[1] || ''
            sizeKB = Math.round((base.length * 3 / 4) / 1024)
            console.log(`📏 估算文件大小: ${sizeKB}KB`)
          }
          
          console.log('💾 开始下载...')
          const link = document.createElement('a')
          link.download = `ai-talk-${Date.now()}-p${pageIndex + 1}-${exportQuality}.${exportFormat}`
          link.href = dataUrl
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          console.log('✅ 下载完成')

          const now = new Date()
          const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
          setExportHistory((prev) => [{ time, width: targetWidth, height: targetHeight, sizeKB, quality: exportQuality }, ...prev].slice(0, 5))
          
          console.log(`🎉 第 ${pageIndex + 1} 页导出成功`)
          
        } catch (pageError) {
          console.error(`❌ 第 ${pageIndex + 1} 页导出失败:`, formatError(pageError))
          throw pageError
        }
      }

      if (exportMode === 'fixed' && (pageOffsets.length > 1 || scaledHeight > targetHeight)) {
        const pageCount = Math.max(pageOffsets.length, Math.ceil(scaledHeight / targetHeight))
        console.log(`📄 启用分屏导出，页数: ${pageCount}`)
        for (let i = 0; i < pageCount; i++) {
          await exportOnePage(i)
        }
      } else {
        console.log('📄 单页导出模式')
        await exportOnePage(0)
      }
      
      // 恢复原始错误处理
      window.onerror = originalOnerror
      window.onunhandledrejection = originalOnunhandledrejection
      
      if (capturedError) {
        console.warn('⚠️ 导出过程中捕获到错误:', capturedError)
      }
      
    } catch (error) {
      // 恢复原始错误处理
      window.onerror = originalOnerror
      window.onunhandledrejection = originalOnunhandledrejection
      
      const msg = formatError(error)
      console.error('❌ 导出图片失败:', msg, error)
      console.error('📋 错误详情:', {
        message: msg,
        error: error,
        capturedError: capturedError,
        elementInfo: element ? {
          id: element.id,
          connected: element.isConnected,
          dimensions: `${element.offsetWidth}x${element.offsetHeight}`,
          scrollHeight: element.scrollHeight
        } : null
      })
      setExportError(msg)
      alert('导出失败，请重试: ' + msg)
    }
    finally {
      setIsExporting(false)
    }
  }

  // 设备兼容性测试
  const runCompatibilityTest = () => {
    const tests = [
      {
        name: '屏幕尺寸',
        test: () => {
          const width = window.screen.width
          const height = window.screen.height
          return width >= 375 && height >= 667 // iPhone 6最小尺寸
        }
      },
      {
        name: 'DPR (设备像素比)',
        test: () => {
          const dpr = window.devicePixelRatio || 1
          return dpr >= 1 && dpr <= 4 // 合理范围
        }
      },
      {
        name: 'Canvas支持',
        test: () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          return !!ctx
        }
      },
      {
        name: '图片导出能力',
        test: () => {
          return typeof HTMLCanvasElement !== 'undefined' && 
                 typeof HTMLCanvasElement.prototype.toDataURL === 'function'
        }
      }
    ]

    console.log('🔍 开始设备兼容性测试...')
    let passedTests = 0
    
    tests.forEach(test => {
      const result = test.test()
      console.log(`${result ? '✅' : '❌'} ${test.name}: ${result ? '通过' : '失败'}`)
      if (result) passedTests++
    })

    const score = (passedTests / tests.length) * 100
    console.log(`📊 兼容性测试得分: ${score.toFixed(0)}%`)
    
    return score >= 75 // 75%以上认为兼容性良好
  }

  // 手风琴面板切换函数
  const toggleAccordion = (key: keyof typeof accordionState) => {
    setAccordionState(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // 手风琴面板组件
  const AccordionSection = ({ title, icon, sectionKey, children }: {
    title: string
    icon: React.ReactNode
    sectionKey: keyof typeof accordionState
    children: React.ReactNode
  }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleAccordion(sectionKey)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-sm font-medium text-gray-700">{title}</span>
        </div>
        {accordionState[sectionKey] ? 
          <ChevronUp className="w-4 h-4 text-gray-500" /> : 
          <ChevronDown className="w-4 h-4 text-gray-500" />
        }
      </button>
      {accordionState[sectionKey] && (
        <div className="p-4 bg-white border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  )


  const currentTheme = themes[theme]
  const messages = parseMarkdownToMessages(markdown)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Talk 图片生成器
          </h1>
          <p className="text-gray-600 text-lg">
            将 AI 对话转换为精美的小红书风格图片
          </p>
        </div>

        {/* 双列布局 - 桌面端 40%:60%，移动端单列 */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {/* 移动端浮动切换按钮 */}
          <div className="xl:hidden fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setMobileMode(prev => prev === 'settings' ? 'preview' : 'settings')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {mobileMode === 'settings' ? <Eye className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
            </button>
          </div>

          {/* 左侧操作区 - 40% 宽度 */}
          <div className={`xl:col-span-2 space-y-4 ${mobileMode === 'preview' ? 'hidden xl:block' : ''}`}>
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-xl p-6 border border-white/50">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                对话内容
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 rounded-lg border border-gray-300 text-sm bg-white hover:bg-gray-50">选择 .md 文件</button>
                <button onClick={undoImport} disabled={!previousMarkdown} className={`px-3 py-2 rounded-lg text-sm ${previousMarkdown ? 'border border-gray-300 bg-white hover:bg-gray-50' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>撤销导入</button>
                <input ref={fileInputRef} type="file" accept=".md,text/markdown" className="hidden" onChange={onFileInputChange} />
              </div>
              {importStatus !== 'idle' && (
                <div className={`mb-3 text-sm rounded-lg p-2 ${importStatus === 'loading' ? 'bg-blue-50 text-blue-700 border border-blue-200' : importStatus === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {importStatus === 'loading' && '正在导入...'}
                  {importStatus === 'success' && (
                    <span>导入成功{importFileInfo ? `：${importFileInfo.name} · ${importFileInfo.sizeKB}KB${importFileInfo.modified ? ' · ' + importFileInfo.modified : ''}` : ''}</span>
                  )}
                  {importStatus === 'error' && `导入失败：${importError ?? '未知错误'}`}
                </div>
              )}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">💡 使用格式：</p>
                <code className="text-xs bg-blue-100 px-2 py-1 rounded">**用户**: 你的问题</code>
                <br />
                <code className="text-xs bg-blue-100 px-2 py-1 rounded mt-1 inline-block">**AI**: AI的回答</code>
              </div>
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`relative rounded-lg ${dragActive ? 'ring-2 ring-purple-400' : ''}`}
              >
                <textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  className="w-full h-80 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm bg-white/50"
                  placeholder="输入或拖拽 .md 文件到此..."
                />
                {dragActive && (
                  <div className="absolute inset-0 bg-purple-50/70 border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center text-purple-700 text-sm">
                    释放以导入 .md 文件
                  </div>
                )}
              </div>
            </div>

            {/* 样式控制 */}
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-xl p-4 border border-white/50">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                样式设置
              </h3>
              
              <div className="space-y-2">
                {/* 主题选择 */}
                <AccordionSection title="主题选择" icon={<Palette className="w-4 h-4" />} sectionKey="theme">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(themes).map(([key, themeConfig]) => (
                      <button
                        key={key}
                        onClick={() => setTheme(key as Theme)}
                        className={`p-2 rounded-lg border transition-all ${
                          theme === key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-full h-4 rounded mb-1 ${themeConfig.bg}`}></div>
                        <span className="text-xs font-medium">{themeConfig.name}</span>
                      </button>
                    ))}
                  </div>
                </AccordionSection>

                {/* 文本样式 */}
                <AccordionSection title="文本样式" icon={<Settings className="w-4 h-4" />} sectionKey="text">
                  <div className="space-y-3">
                    {/* 字体大小 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        大小: <span className="text-blue-600 font-semibold">{fontSize}px</span>
                      </label>
                      <input
                        type="range"
                        min="14"
                        max="22"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* 文本对齐 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">对齐</label>
                      <div className="flex space-x-1">
                        {[{value: 'left', label: '左'}, {value: 'center', label: '中'}, {value: 'justify', label: '两'}].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTextAlign(option.value as any)}
                            className={`flex-1 px-2 py-1 rounded border text-xs transition-all ${
                              textAlign === option.value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 字体间距 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        行距: <span className="text-blue-600 font-semibold">{lineHeight}</span>
                      </label>
                      <input
                        type="range"
                        min="1.2"
                        max="2.0"
                        step="0.1"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>

                    {/* 字间距 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        字距: <span className="text-blue-600 font-semibold">{letterSpacing}px</span>
                      </label>
                      <input
                        type="range"
                        min="-0.5"
                        max="1.0"
                        step="0.1"
                        value={letterSpacing}
                        onChange={(e) => setLetterSpacing(Number(e.target.value))}
                        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </AccordionSection>

                {/* 导出设置 */}
                <AccordionSection title="导出设置" icon={<Download className="w-4 h-4" />} sectionKey="export">
                  <div className="space-y-3">
                    {/* 导出质量 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">质量</label>
                      <div className="flex space-x-1">
                        {[{value: 'high', label: '高'}, {value: 'medium', label: '中'}, {value: 'low', label: '低'}].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setExportQuality(option.value as any)}
                            className={`flex-1 px-2 py-1 rounded border text-xs transition-all ${
                              exportQuality === option.value
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 导出格式 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">格式</label>
                      <div className="flex space-x-1">
                        {[{value: 'png', label: 'PNG'}, {value: 'jpg', label: 'JPG'}].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setExportFormat(option.value as any)}
                            className={`flex-1 px-2 py-1 rounded border text-xs transition-all ${
                              exportFormat === option.value
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 导出模式 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">模式</label>
                      <div className="flex space-x-1">
                        {[{value: 'fixed', label: '固定'}, {value: 'adaptive', label: '自适应'}].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setExportMode(option.value as any)}
                            className={`flex-1 px-2 py-1 rounded border text-xs transition-all ${
                              exportMode === option.value
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* 显示选项 */}
                <AccordionSection title="显示选项" icon={<Eye className="w-4 h-4" />} sectionKey="display">
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showTimestamp}
                        onChange={(e) => setShowTimestamp(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-xs text-gray-700">时间戳</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showAvatars}
                        onChange={(e) => setShowAvatars(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-xs text-gray-700">头像</span>
                    </label>
                  </div>
                </AccordionSection>
              </div>
            </div>
          </div>

          {/* 右侧预览区 */}
          <div className={`xl:col-span-3 ${mobileMode === 'settings' ? 'hidden xl:block' : ''}`}>
            <div className="bg-white/80 backdrop-blur rounded-xl shadow-xl p-6 border border-white/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">预览效果</h2>
                <button
                  onClick={exportImage}
                  disabled={isExporting}
                  className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl ${isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'}`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isExporting ? '导出中…' : '下载高清图片'}
                </button>
              </div>

              {exportError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
                  导出失败：{exportError}
                </div>
              )}

              {exportHistory.length > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-gray-50 text-gray-700 border border-gray-200 text-sm">
                  <div className="font-medium mb-2">最近导出</div>
                  <ul className="space-y-1">
                    {exportHistory.map((h, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{h.time}</span>
                        <span>{h.width}×{h.height} · {h.sizeKB}KB · {h.quality.toUpperCase()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* 预览容器 */}
              <div className="flex justify-center">
                <div className="relative" style={{ width: '324px', height: '432px', overflow: 'hidden' }}>
                  {/* 实际的导出卡片 */}
                  <div
                    id="preview-card"
                    className={`${currentTheme.bg} w-full h-full relative ${
                      theme === 'glass' ? 'border border-white/30' : ''
                    }`}
                    style={{
                      width: '1080px',
                      height: 'auto',
                      minHeight: '1440px',
                      transform: 'scale(0.3)',
                      transformOrigin: 'top left'
                    }}
                  >
                    {/* 头部装饰 */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent"></div>
                    
                    {/* 主要内容区域 */}
                    <div className="relative z-10 flex flex-col p-12 pt-20" style={{ minHeight: '1440px' }}>
                      

                      {/* 对话内容 */}
                      <div className="space-y-6 px-4 flex-1">
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex items-start space-x-4 bubble-animate ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            {message.role === 'ai' && showAvatars && (
                              <div className="flex-shrink-0">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                  currentTheme === themes.minimal ? 'bg-gray-300' : 
                                  currentTheme === themes.aurora ? 'bg-white/20 border border-white/30' :
                                  currentTheme === themes.glass ? 'bg-blue-500/80' :
                                  'bg-gradient-to-r from-blue-500 to-purple-500'
                                }`}>
                                  <Bot className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            )}
                            
                            <div className={`max-w-2xl ${
                              message.role === 'user' ? 'order-1' : ''
                            }`}>
                              <div 
                                className={`inline-block px-6 py-4 rounded-2xl leading-relaxed transition-all duration-300 ${
                                  message.role === 'user' 
                                    ? currentTheme.userBubble 
                                    : currentTheme.aiBubble
                                }`}
                                style={{ 
                                  fontSize: `${fontSize}px`,
                                  lineHeight: lineHeight,
                                  letterSpacing: `${letterSpacing}px`,
                                  textAlign: textAlign
                                }}
                              >
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({ children }) => <div className={`mb-3 last:mb-0`} style={{ textAlign, lineHeight: lineHeight, letterSpacing: `${letterSpacing}px` }}>{children}</div>,
                                    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                                    em: ({ children }) => <em className="italic">{children}</em>,
                                    ul: ({ children }) => (
                                      <ul className="list-disc list-outside ml-6 my-2 space-y-2" style={{ textAlign, lineHeight: lineHeight, letterSpacing: `${letterSpacing}px` }}>
                                        {children}
                                      </ul>
                                    ),
                                    ol: ({ children }) => (
                                      <ol className="list-decimal list-outside ml-6 my-2 space-y-2" style={{ textAlign, lineHeight: lineHeight, letterSpacing: `${letterSpacing}px` }}>
                                        {children}
                                      </ol>
                                    ),
                                    li: ({ children }) => <li style={{ textAlign, lineHeight: lineHeight, letterSpacing: `${letterSpacing}px` }}>{children}</li>,
                                    code: ({ children }) => (
                                      <code className="bg-black/10 px-2 py-1 rounded" style={{ fontSize: `${fontSize - 2}px` }}>
                                        {children}
                                      </code>
                                    )
                                  }}
                                >
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            </div>

                            {message.role === 'user' && showAvatars && (
                              <div className="flex-shrink-0 order-2">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                  currentTheme === themes.minimal ? 'bg-blue-500' : 
                                  currentTheme === themes.aurora ? 'bg-white/20 border border-white/30' :
                                  currentTheme === themes.glass ? 'bg-blue-500/80' :
                                  'bg-gradient-to-r from-blue-500 to-purple-500'
                                }`}>
                                  <User className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      
                    </div>
                  </div>
                  {showPaginationPreview && paginationCuts.length > 0 && (
                    <div className="pointer-events-none absolute left-0 right-0" style={{ top: 0 }}>
                      {paginationCuts.map((y, i) => (
                        <div key={i} style={{ position: 'absolute', top: `${y * 0.3}px`, left: 0, right: 0 }}>
                          <div className="mx-2 border-t-2 border-dashed border-purple-400 opacity-70"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {paginationWarnings.length > 0 && (
                    <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 rounded px-3 py-2">
                      检测到分页提示：{paginationWarnings.slice(0,3).join('；')}{paginationWarnings.length>3?'…':''}
                    </div>
                  )}
                </div>
                <label className="flex items-center text-sm text-gray-700">
                  <input type="checkbox" checked={showPaginationPreview} onChange={(e)=>setShowPaginationPreview(e.target.checked)} className="mr-2" />显示分页预览切线
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App