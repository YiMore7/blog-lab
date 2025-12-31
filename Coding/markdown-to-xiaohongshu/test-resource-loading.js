/**
 * 资源加载测试脚本
 * 用于验证图片导出功能的资源加载机制
 */

// 模拟资源加载错误
function simulateResourceError() {
  console.log('🧪 开始资源加载测试...')
  
  // 测试1: 模拟图片加载失败
  const testImg = new Image()
  testImg.onerror = (e) => {
    console.log('✅ 图片错误事件正常触发:', e.type)
  }
  testImg.src = 'data:image/png;base64,invalid'
  
  // 测试2: 模拟字体加载
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      console.log('✅ 字体加载API可用')
    }).catch(err => {
      console.log('⚠️ 字体加载失败:', err)
    })
  } else {
    console.log('⚠️ 字体加载API不可用')
  }
  
  // 测试3: 模拟Canvas操作
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 100
    canvas.height = 100
    
    // 测试toDataURL
    const dataUrl = canvas.toDataURL('image/png')
    console.log('✅ Canvas toDataURL 正常:', dataUrl.length > 0)
    
    // 测试像素操作
    const imageData = ctx.getImageData(0, 0, 10, 10)
    console.log('✅ Canvas getImageData 正常:', imageData.data.length)
    
  } catch (err) {
    console.error('❌ Canvas 操作失败:', err)
  }
  
  // 测试4: 模拟html-to-image库调用
  if (typeof window.htmlToImage !== 'undefined') {
    console.log('✅ html-to-image 库已加载')
  } else {
    console.log('⚠️ html-to-image 库未找到')
  }
  
  console.log('🎯 资源加载测试完成')
}

// 运行测试
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(simulateResourceError, 1000)
  })
}

// 导出测试函数供外部调用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { simulateResourceError }
}