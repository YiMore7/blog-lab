// 个人资料配置
export const profile = {
  // 基本信息
  name: "YiM",
  title: "后端产品经理",
  bio: "我是一个有着10年工作经验的后端产品经理，擅长将复杂的业务需求转化为简洁优雅的产品解决方案，热衷于探索AI技术在产品中的应用。",
  
  // 头像设置
  avatar: {
    type: "image", // "text" 或 "image"
    text: "AC",   // 如果type为"text"，显示的文字
    imageUrl: "https://example.com/avatar.jpg"  // 如果type为"image"，图片URL
  },
  
  // 技能标签
  skills: [
    "Python", "Product Management","Data Analysis", "AI/ML"
  ],
  
  // 社交媒体链接
  social: {
    github: "https://github.com/yourusername",
    twitter: "https://twitter.com/yourusername",
    wechat: "your-wechat-id"
  },
  
  // 联系信息
  contact: {
    email: "power_lens@126.com",
    phone: "+86 18509270712",
    location: "北京",
    responseTime: "24小时内回复"
  }
};