// 农历数据
const lunarData = {
  "2025-02": {
    "1": "初四",
    "2": "初五",
    "3": "初六",
    "4": "初七",
    // ... 其他日期
  }
};

// 节假日数据
let holidays = {
  "2025": {
    "01-01": { name: "元旦", type: "holiday", isCustom: false },
    "01-29": { name: "春节", type: "holiday", isCustom: false },
    "01-30": { name: "春节", type: "holiday", isCustom: false },
    "01-31": { name: "春节", type: "holiday", isCustom: false },
    "02-01": { name: "春节", type: "holiday", isCustom: false },
    "02-02": { name: "春节", type: "holiday", isCustom: false },
    "02-03": { name: "春节", type: "holiday", isCustom: false },
    "02-04": { name: "春节", type: "holiday", isCustom: false },
    "04-05": { name: "清明节", type: "holiday" },
    "04-06": { name: "清明节", type: "holiday" },
    "04-07": { name: "清明节", type: "holiday" },
    "05-01": { name: "劳动节", type: "holiday" },
    "05-02": { name: "劳动节", type: "holiday" },
    "05-03": { name: "劳动节", type: "holiday" },
    "05-04": { name: "劳动节", type: "holiday" },
    "05-05": { name: "劳动节", type: "holiday" },
    "06-22": { name: "端午节", type: "holiday" },
    "06-23": { name: "端午节", type: "holiday" },
    "06-24": { name: "端午节", type: "holiday" },
    "09-29": { name: "中秋节", type: "holiday" },
    "09-30": { name: "中秋节", type: "holiday" },
    "10-01": { name: "国庆节", type: "holiday" },
    "10-02": { name: "国庆节", type: "holiday" },
    "10-03": { name: "国庆节", type: "holiday" },
    "10-04": { name: "国庆节", type: "holiday" },
    "10-05": { name: "国庆节", type: "holiday" },
    "10-06": { name: "国庆节", type: "holiday" },
    "10-07": { name: "国庆节", type: "holiday" }
  }
};

// 添加法定节假日的初始数据常量
const LEGAL_HOLIDAYS = {
  "2025": {
    "01-01": { name: "元旦", type: "holiday", isCustom: false },
    "01-29": { name: "春节", type: "holiday", isCustom: false },
    "01-30": { name: "春节", type: "holiday", isCustom: false },
    "01-31": { name: "春节", type: "holiday", isCustom: false },
    "02-01": { name: "春节", type: "holiday", isCustom: false },
    "02-02": { name: "春节", type: "holiday", isCustom: false },
    "02-03": { name: "春节", type: "holiday", isCustom: false },
    "02-04": { name: "春节", type: "holiday", isCustom: false },
    "04-05": { name: "清明节", type: "holiday", isCustom: false },
    "04-06": { name: "清明节", type: "holiday", isCustom: false },
    "04-07": { name: "清明节", type: "holiday", isCustom: false },
    "05-01": { name: "劳动节", type: "holiday", isCustom: false },
    "05-02": { name: "劳动节", type: "holiday", isCustom: false },
    "05-03": { name: "劳动节", type: "holiday", isCustom: false },
    "05-04": { name: "劳动节", type: "holiday", isCustom: false },
    "05-05": { name: "劳动节", type: "holiday", isCustom: false },
    "06-22": { name: "端午节", type: "holiday", isCustom: false },
    "06-23": { name: "端午节", type: "holiday", isCustom: false },
    "06-24": { name: "端午节", type: "holiday", isCustom: false },
    "09-29": { name: "中秋节", type: "holiday", isCustom: false },
    "09-30": { name: "中秋节", type: "holiday", isCustom: false },
    "10-01": { name: "国庆节", type: "holiday", isCustom: false },
    "10-02": { name: "国庆节", type: "holiday", isCustom: false },
    "10-03": { name: "国庆节", type: "holiday", isCustom: false },
    "10-04": { name: "国庆节", type: "holiday", isCustom: false },
    "10-05": { name: "国庆节", type: "holiday", isCustom: false },
    "10-06": { name: "国庆节", type: "holiday", isCustom: false },
    "10-07": { name: "国庆节", type: "holiday", isCustom: false }
  }
};

const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "十一月", "十二月"];

let currentDate = new Date();

function getLunarDate(year, month, day) {
  const lunar = Lunar.fromDate(new Date(year, month - 1, day));
  return {
    lunarDay: lunar.getDayInChinese(),
    lunarMonth: lunar.getMonthInChinese(),
    festival: lunar.getFestivals().join(' '),
    term: lunar.getTerm()
  };
}

function renderCalendar(year, month) {
  const daysElement = document.getElementById('calendarDays');
  daysElement.innerHTML = '';
  
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const prevMonthLastDay = new Date(year, month - 1, 0);
  
  document.getElementById('yearDisplay').textContent = `${year}年`;
  document.getElementById('monthDisplay').textContent = `${month}月`;
  
  // 填充上个月的日期
  const firstDayWeek = (firstDay.getDay() + 6) % 7; // 调整为周一开始
  for (let i = firstDayWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay.getDate() - i;
    const prevMonth = month - 1;
    const prevYear = prevMonth === 0 ? year - 1 : year;
    const actualMonth = prevMonth === 0 ? 12 : prevMonth;
    
    const dayCell = createDayCell(prevYear, actualMonth, day, true);
    daysElement.appendChild(dayCell);
  }
  
  // 填充当前月的日期
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dayCell = createDayCell(year, month, day, false);
    daysElement.appendChild(dayCell);
  }
  
  // 填充下个月的日期
  const lastDayWeek = (lastDay.getDay() + 6) % 7;
  if (lastDayWeek !== 6) { // 如果不是周六结束，需要填充到本周末
    for (let i = 1; i < 7 - lastDayWeek; i++) {
      const nextMonth = month + 1;
      const nextYear = nextMonth === 13 ? year + 1 : year;
      const actualMonth = nextMonth === 13 ? 1 : nextMonth;
      
      const dayCell = createDayCell(nextYear, actualMonth, i, true);
      daysElement.appendChild(dayCell);
    }
  }
}

function createDayCell(year, month, day, isOtherMonth) {
  const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const holiday = holidays[year] && holidays[year][dateStr];
  const lunarInfo = getLunarDate(year, month, day);
  
  const dayCell = document.createElement('div');
  dayCell.className = 'day-cell';
  if (isOtherMonth) {
    dayCell.classList.add('other-month');
  }
  
  if (holiday && holiday.type === 'holiday') {
    dayCell.classList.add('rest-day');
  }
  
  const solarDate = document.createElement('div');
  solarDate.className = 'solar-date';
  solarDate.textContent = day;
  
  const lunarDate = document.createElement('div');
  lunarDate.className = 'lunar-date';
  
  // 显示农历信息
  if (holiday) {
    lunarDate.textContent = holiday.name;
    lunarDate.classList.add('holiday');
    if (holiday.isCustom) {
      lunarDate.classList.add('custom-holiday');
    }
  } else if (lunarInfo.festival) {
    lunarDate.textContent = lunarInfo.festival;
    lunarDate.classList.add('festival');
  } else if (lunarInfo.term) {
    lunarDate.textContent = lunarInfo.term;
    lunarDate.classList.add('term');
  } else {
    lunarDate.textContent = lunarInfo.lunarDay;
  }
  
  if (year === currentDate.getFullYear() && 
      month === currentDate.getMonth() + 1 && 
      day === currentDate.getDate()) {
    dayCell.classList.add('current-day');
  }
  
  dayCell.appendChild(solarDate);
  dayCell.appendChild(lunarDate);
  return dayCell;
}

// 获取所有不重复的节假日名称
const getAllHolidays = () => {
  const uniqueHolidays = new Set();
  Object.values(holidays).forEach(yearHolidays => {
    Object.values(yearHolidays).forEach(holiday => {
      uniqueHolidays.add(holiday.name);
    });
  });
  return Array.from(uniqueHolidays);
};

// 更新节假日选择器
function updateHolidaySelect() {
  const holidaySelect = document.getElementById('holidaySelect');
  holidaySelect.innerHTML = '<option value="">节假日</option>';
  getAllHolidays().forEach(holidayName => {
    const option = document.createElement('option');
    option.value = holidayName;
    option.textContent = holidayName;
    holidaySelect.appendChild(option);
  });
}

// 初始化年月选择器
function initializeSelectors() {
  document.getElementById('prevYear').addEventListener('click', () => {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
  });
  
  document.getElementById('nextYear').addEventListener('click', () => {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
  });
  
  document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
  });
  
  document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
  });
  
  document.getElementById('todayBtn').addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
  });

  document.getElementById('holidaySelect').addEventListener('change', (event) => {
    const selectedHoliday = event.target.value;
    if (selectedHoliday) {
      // 查找选中节假日的第一天
      for (const [year, yearHolidays] of Object.entries(holidays)) {
        for (const [date, holiday] of Object.entries(yearHolidays)) {
          if (holiday.name === selectedHoliday) {
            const [month, day] = date.split('-').map(Number);
            currentDate = new Date(Number(year), month - 1, day);
            renderCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
            return;
          }
        }
      }
    }
  });
}

// 添加 toast 显示函数
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.textContent = message;
  toast.classList.add('show');
  
  // 2秒后隐藏
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// 修改保存按钮的处理逻辑
function initializeSettings() {
  const modal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('settingsBtn');
  const closeBtn = document.querySelector('.close-btn');
  const saveBtn = document.getElementById('saveHoliday');
  
  // 打开设置
  settingsBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    updateHolidayList();
  });
  
  // 关闭设置
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  // 点击外部关闭
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // 保存节假日设置
  saveBtn.addEventListener('click', () => {
    const holidayName = document.getElementById('holidayName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // 添加输入验证
    if (!holidayName || !startDate || !endDate) {
      showToast('请填写完整的节假日信息');
      return;
    }
    
    // 转换日期
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // 验证日期
    if (end < start) {
      showToast('结束日期不能早于开始日期');
      return;
    }
    
    // 保存节假日
    addCustomHoliday(holidayName, start, end);
    
    // 更新显示
    updateHolidayList();
    updateHolidaySelect();
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
    
    // 显示成功提示
    showToast('保存成功');
    
    // 关闭弹窗
    setTimeout(() => {
      modal.style.display = 'none';
    }, 500);
  });
}

// 修改添加节假日的函数
function addCustomHoliday(name, startDate, endDate) {
  const currentYear = startDate.getFullYear();
  if (!holidays[currentYear]) {
    holidays[currentYear] = {};
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  let addedCount = 0;
  let skippedCount = 0;
  
  while (start <= end) {
    const month = String(start.getMonth() + 1).padStart(2, '0');
    const day = String(start.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    
    // 检查是否是法定节假日
    const isLegalHoliday = LEGAL_HOLIDAYS[currentYear] && 
                          LEGAL_HOLIDAYS[currentYear][dateKey];
    
    if (!isLegalHoliday) {
      // 只有非法定节假日才添加自定义标识
      holidays[currentYear][dateKey] = {
        name: name,
        type: "holiday",
        isCustom: true
      };
      addedCount++;
    } else {
      skippedCount++;
    }
    
    start.setDate(start.getDate() + 1);
  }
  
  saveHolidays();
  
  // 返回添加结果
  if (skippedCount > 0) {
    showToast(`已添加${addedCount}天假期，${skippedCount}天与法定节假日重叠已跳过`);
  } else {
    showToast(`已添加${addedCount}天假期`);
  }
  
  return true;
}

// 修改节假日列表显示
function updateHolidayList() {
  const listContainer = document.getElementById('holidayList');
  listContainer.innerHTML = '';
  
  Object.entries(holidays).forEach(([year, yearHolidays]) => {
    Object.entries(yearHolidays).forEach(([date, holiday]) => {
      const item = document.createElement('div');
      item.className = 'holiday-item';
      
      const span = document.createElement('span');
      // 添加自定义标识显示
      const customTag = holiday.isCustom ? '<span class="custom-tag">自定义添加</span>' : '';
      span.innerHTML = `${year}年 ${date} ${holiday.name} ${customTag}`;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '删除';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', () => {
        removeHoliday(year, date);
        showToast('删除成功');
      });
      
      item.appendChild(span);
      item.appendChild(deleteBtn);
      listContainer.appendChild(item);
    });
  });
}

function removeHoliday(year, date) {
  if (holidays[year] && holidays[year][date]) {
    delete holidays[year][date];
    updateHolidayList();
    updateHolidaySelect(); // 同时更新下拉选择框
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
    saveHolidays();
  }
}

function saveHolidays() {
  localStorage.setItem('holidays', JSON.stringify(holidays));
}

function loadHolidays() {
  const savedHolidays = localStorage.getItem('holidays');
  if (savedHolidays) {
    // 合并保存的节假日和法定节假日
    const customHolidays = JSON.parse(savedHolidays);
    holidays = {};
    
    // 先加载法定节假日
    Object.keys(LEGAL_HOLIDAYS).forEach(year => {
      holidays[year] = { ...LEGAL_HOLIDAYS[year] };
    });
    
    // 再加载自定义节假日，但不覆盖法定节假日
    Object.entries(customHolidays).forEach(([year, yearHolidays]) => {
      if (!holidays[year]) {
        holidays[year] = {};
      }
      Object.entries(yearHolidays).forEach(([date, holiday]) => {
        if (!LEGAL_HOLIDAYS[year] || !LEGAL_HOLIDAYS[year][date]) {
          holidays[year][date] = holiday;
        }
      });
    });
  } else {
    // 如果没有保存的节假日，直接使用法定节假日
    holidays = JSON.parse(JSON.stringify(LEGAL_HOLIDAYS));
  }
}

// 在初始化函数中添加主题相关代码
function initializeTheme() {
  const themeModal = document.getElementById('themeModal');
  const themeBtn = document.getElementById('themeBtn');
  const closeBtn = themeModal.querySelector('.close-btn');
  const themeItems = document.querySelectorAll('.theme-item');
  
  // 从本地存储加载主题，默认使用 default 主题
  const savedTheme = localStorage.getItem('calendar-theme') || 'default';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // 打开主题设置
  themeBtn.addEventListener('click', () => {
    themeModal.style.display = 'block';
  });
  
  // 关闭主题设置
  closeBtn.addEventListener('click', () => {
    themeModal.style.display = 'none';
  });
  
  // 点击外部关闭
  window.addEventListener('click', (event) => {
    if (event.target === themeModal) {
      themeModal.style.display = 'none';
    }
  });
  
  // 切换主题
  themeItems.forEach(item => {
    item.addEventListener('click', () => {
      const theme = item.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('calendar-theme', theme);
      showToast('主题切换成功');
      themeModal.style.display = 'none';
    });
  });
}

// 在 DOMContentLoaded 事件中调用主题初始化
document.addEventListener('DOMContentLoaded', () => {
  loadHolidays();
  updateHolidaySelect();
  initializeSelectors();
  initializeSettings();
  initializeTheme();
  renderCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
}); 