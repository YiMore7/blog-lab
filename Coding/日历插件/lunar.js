/**
 * 农历日期计算工具
 * 基于寿星万年历：https://github.com/6tail/lunar-javascript
 * 简化版本，仅保留日历必需功能
 */

const Lunar = (function() {
  // 农历1900-2100的闰大小信息表
  const LUNAR_INFO = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0
  ];

  // 农历月份名
  const LUNAR_MONTH = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  
  // 农历日期名
  const LUNAR_DAY = [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ];

  // 二十四节气
  const SOLAR_TERM = [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
  ];

  // 传统节日
  const FESTIVAL = {
    '正月初一': '春节',
    '正月十五': '元宵节',
    '五月初五': '端午节',
    '七月初七': '七夕节',
    '八月十五': '中秋节',
    '九月初九': '重阳节',
    '腊月三十': '除夕'
  };

  class Lunar {
    constructor(date) {
      this.date = date;
      this.compute();
    }

    compute() {
      let year = this.date.getFullYear();
      let month = this.date.getMonth() + 1;
      let day = this.date.getDate();

      // 计算距离1900年1月31日的天数
      let offset = (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000;

      // 计算农历年份
      let lunarYear = 1900;
      let yearDays = 0;
      for (; lunarYear < 2101 && offset > 0; lunarYear++) {
        yearDays = this.getLunarYearDays(lunarYear);
        offset -= yearDays;
      }
      if (offset < 0) {
        offset += yearDays;
        lunarYear--;
      }

      this.year = lunarYear;
      
      // 计算农历月份
      let isLeap = false;
      let lunarMonth = 1;
      let monthDays;
      
      let leapMonth = this.getLeapMonth(lunarYear);
      for (; lunarMonth < 13 && offset > 0; lunarMonth++) {
        if (leapMonth > 0 && lunarMonth === leapMonth + 1 && !isLeap) {
          lunarMonth--;
          isLeap = true;
          monthDays = this.getLeapDays(lunarYear);
        } else {
          monthDays = this.getLunarMonthDays(lunarYear, lunarMonth);
        }
        
        if (isLeap && lunarMonth === leapMonth + 1) {
          isLeap = false;
        }
        offset -= monthDays;
      }

      if (offset < 0) {
        offset += monthDays;
        lunarMonth--;
      }

      this.month = lunarMonth;
      this.day = offset + 1;
      this.isLeap = isLeap;
    }

    // 获取农历年总天数
    getLunarYearDays(year) {
      let sum = 348;
      for (let i = 0x8000; i > 0x8; i >>= 1) {
        sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
      }
      return sum + this.getLeapDays(year);
    }

    // 获取闰月天数
    getLeapDays(year) {
      if (this.getLeapMonth(year)) {
        return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
      }
      return 0;
    }

    // 获取闰月月份
    getLeapMonth(year) {
      return LUNAR_INFO[year - 1900] & 0xf;
    }

    // 获取农历月份天数
    getLunarMonthDays(year, month) {
      return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
    }

    // 获取农历日期字符串
    getDayInChinese() {
      return LUNAR_DAY[this.day - 1];
    }

    // 获取农历月份字符串
    getMonthInChinese() {
      return LUNAR_MONTH[this.month - 1] + '月';
    }

    // 获取节日
    getFestivals() {
      let festivals = [];
      let monthDay = LUNAR_MONTH[this.month - 1] + '月' + LUNAR_DAY[this.day - 1];
      if (FESTIVAL[monthDay]) {
        festivals.push(FESTIVAL[monthDay]);
      }
      return festivals;
    }

    // 获取节气
    getTerm() {
      // 简化版本暂不实现节气计算
      return '';
    }

    static fromDate(date) {
      return new Lunar(date);
    }
  }

  return Lunar;
})();

// 导出 Lunar 类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Lunar;
} 