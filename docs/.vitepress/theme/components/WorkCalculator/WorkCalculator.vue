<template>
  <div class="job-worth-calculator">
    <!-- 标题区域 -->
    <div class="calculator-header">
      <h1>📊 工作性价比计算器</h1>
      <p>全面考量，计算薪资之外的工作真实价值</p>

      <!-- 语言切换器 -->
      <div class="language-switcher">
        <button :class="{ active: language === 'zh' }" @click="setLanguage('zh')">中文</button>
        <button :class="{ active: language === 'en' }" @click="setLanguage('en')">English</button>
        <button :class="{ active: language === 'ja' }" @click="setLanguage('ja')">日本語</button>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="calculator-content">
      <!-- 表单区域 -->
      <div class="calculator-form">
        <!-- 基本薪资信息 -->
        <section class="form-section">
          <h2>{{ t("salary_info") }}</h2>
          <div class="form-group">
            <label>{{ t("annual_salary") }}</label>
            <div class="input-with-symbol">
              <span>{{ getCurrencySymbol() }}</span>
              <input type="number" v-model="formData.salary" placeholder="0" @input="calculateWorth" />
            </div>
          </div>

          <div class="form-group">
            <label>{{ t("country_region") }}</label>
            <select v-model="selectedCountry" @change="handleCountryChange">
              <option v-for="(country, code) in countryNames[language]" :value="code" :key="code">
                {{ country }}
              </option>
            </select>
          </div>
        </section>

        <!-- 工作时间信息 -->
        <section class="form-section">
          <h2>{{ t("work_time") }}</h2>
          <div class="form-group">
            <label>{{ t("work_days_per_week") }}</label>
            <input type="number" v-model.number="workDaysPerWeek" @input="calculateWorth" />
          </div>

          <div class="form-group">
            <label>{{ t("daily_work_hours") }}</label>
            <input type="number" v-model="formData.workHours" min="1" max="24" @input="calculateWorth" />
          </div>

          <div class="form-group">
            <label>{{ t("daily_commute_hours") }}</label>
            <input type="number" v-model="formData.commuteHours" min="0" max="10" step="0.5" @input="calculateWorth" />
          </div>

          <div class="form-group">
            <label>{{ t("wfh_days_per_week") }}</label>
            <input
              type="number"
              v-model="formData.wfhDaysPerWeek"
              min="0"
              :max="formData.workDaysPerWeek"
              @input="calculateWorth"
            />
          </div>

          <div class="form-group">
            <label>{{ t("daily_rest_time") }}</label>
            <input type="number" v-model="formData.restTime" min="0" max="5" step="0.5" @input="calculateWorth" />
          </div>
        </section>

        <!-- 假期信息 -->
        <section class="form-section">
          <h2>{{ t("holidays") }}</h2>
          <div class="form-group">
            <label>{{ t("annual_leave") }}</label>
            <input type="number" v-model="formData.annualLeave" min="0" max="60" @input="calculateWorth" />
          </div>

          <div class="form-group">
            <label>{{ t("paid_sick_leave") }}</label>
            <input type="number" v-model="formData.paidSickLeave" min="0" max="30" @input="calculateWorth" />
          </div>

          <div class="form-group">
            <label>{{ t("public_holidays") }}</label>
            <input type="number" v-model="formData.publicHolidays" min="0" max="30" @input="calculateWorth" />
          </div>
        </section>

        <!-- 工作环境与地点 -->
        <section class="form-section">
          <h2>{{ t("work_environment") }}</h2>

          <div class="form-group">
            <label>{{ t("job_stability") }}</label>
            <div class="button-group">
              <button
                v-for="(item, index) in formData.jobStabilityGroup"
                :key="index"
                type="button"
                class="form-group-button"
                :class="{ 'form-group-button-active': formData.jobStability === item.rating }"
                @click="
                  formData.jobStability = item.rating;
                  calculateWorth();
                "
              >
                {{ t(item.text) }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t("city_level") }}</label>
            <div class="button-group">
              <button
                v-for="(item, index) in formData.cityFactorGroup"
                :key="index"
                type="button"
                class="form-group-button"
                :class="{ 'form-group-button-active': formData.cityFactor === item.rating }"
                @click="
                  formData.cityFactor = item.rating;
                  calculateWorth();
                "
              >
                {{ t(item.text) }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t("work_environment_rating") }}</label>
            <div class="button-group">
              <button
                v-for="(item, index) in formData.workEnvironmentGroup"
                :key="index"
                type="button"
                class="form-group-button"
                :class="{ 'form-group-button-active': formData.workEnvironment === item.rating }"
                @click="
                  formData.workEnvironment = item.rating;
                  calculateWorth();
                "
              >
                {{ item.text }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t("leadership_rating") }}</label>
            <div class="button-group">
              <button
                v-for="(item, index) in formData.leadershipGroup"
                :key="index"
                type="button"
                class="form-group-button"
                :class="{ 'form-group-button-active': formData.leadership === item.rating }"
                @click="
                  formData.leadership = item.rating;
                  calculateWorth();
                "
              >
                {{ item.text }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t("teamwork_rating") }}</label>
            <div class="button-group">
              <button
                v-for="(item, index) in formData.teamworkGroup"
                :key="index"
                type="button"
                class="form-group-button"
                :class="{ 'form-group-button-active': formData.teamwork === item.rating }"
                @click="
                  formData.teamwork = item.rating;
                  calculateWorth();
                "
              >
                {{ item.text }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>{{ t("hometown") }}</label>
            <select v-model="formData.homeTown" @change="calculateWorth">
              <option value="yes">{{ t("yes") }}</option>
              <option value="no">{{ t("no") }}</option>
            </select>
          </div>
        </section>

        <!-- 公司福利 -->
        <section class="form-section">
          <h2>{{ t("company_benefits") }}</h2>
          <div class="form-group">
            <label>{{ t("shuttle_service") }}</label>
            <div class="checkbox-group">
              <input type="checkbox" id="hasShuttle" v-model="formData.hasShuttle" @change="calculateWorth" />
              <label for="hasShuttle">{{ t("has_shuttle") }}</label>
            </div>
            <select v-model="formData.shuttle" @change="calculateWorth" :disabled="!formData.hasShuttle">
              <option value="1.0">{{ t("shuttle_none") }}</option>
              <option value="0.9">{{ t("shuttle_inconvenient") }}</option>
              <option value="0.7">{{ t("shuttle_convenient") }}</option>
              <option value="0.5">{{ t("shuttle_direct") }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ t("canteen_service") }}</label>
            <div class="checkbox-group">
              <input type="checkbox" id="hasCanteen" v-model="formData.hasCanteen" @change="calculateWorth" />
              <label for="hasCanteen">{{ t("has_canteen") }}</label>
            </div>
            <select v-model="formData.canteen" @change="calculateWorth" :disabled="!formData.hasCanteen">
              <option value="1.0">{{ t("canteen_none") }}</option>
              <option value="1.05">{{ t("canteen_average") }}</option>
              <option value="1.1">{{ t("canteen_good") }}</option>
              <option value="1.15">{{ t("canteen_excellent") }}</option>
            </select>
          </div>
        </section>

        <!-- 个人因素 -->
        <section class="form-section">
          <h2>{{ t("personal_factors") }}</h2>
          <div class="form-group">
            <label>{{ t("education") }}</label>
            <select v-model="formData.degreeType" @change="calculateWorth">
              <option value="belowBachelor">{{ t("below_bachelor") }}</option>
              <option value="bachelor">{{ t("bachelor") }}</option>
              <option value="masters">{{ t("masters") }}</option>
              <option value="phd">{{ t("phd") }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ t("school_type") }}</label>
            <select v-model="formData.schoolType" @change="calculateWorth">
              <option value="secondTier">{{ t("school_second_tier") }}</option>
              <option value="firstTier">{{ t("school_first_tier") }}</option>
              <option value="elite">{{ t("school_elite") }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>{{ t("work_experience") }}</label>
            <select v-model="formData.workYears" @change="calculateWorth">
              <option value="0">{{ t("fresh_graduate") }}</option>
              <option value="1">{{ t("years_1_3") }}</option>
              <option value="2">{{ t("years_3_5") }}</option>
              <option value="4">{{ t("years_5_8") }}</option>
              <option value="6">{{ t("years_8_10") }}</option>
              <option value="10">{{ t("years_10_12") }}</option>
              <option value="15">{{ t("years_above_12") }}</option>
            </select>
          </div>
        </section>
      </div>

      <!-- 结果展示区域 -->
      <div class="calculator-result" v-if="result">
        <h2 class="result-title">{{ t("calculation_result") }}</h2>

        <div class="result-overview">
          <div class="result-score">
            <span class="emoji">{{ getEmoji() }}</span>
            <span class="score" :style="{ color: result.assessmentColor }">
              {{ result.value.toFixed(2) }}
            </span>
            <span class="assessment">{{ t(result.assessment) }}</span>
          </div>

          <div class="result-main">
            <div class="main-stat">
              <span class="label">{{ t("standardized_daily_salary") }}:</span>
              <span class="value">{{ result.dailySalary?.toFixed(2) }} {{ getCurrencySymbol() }}</span>
            </div>
            <div class="main-stat">
              <span class="label">{{ t("effective_daily_hours") }}:</span>
              <span class="value">{{ getEffectiveWorkTime()?.toFixed(1) }} {{ t("hours") }}</span>
            </div>
            <div class="main-stat">
              <span class="label">{{ t("work_days_per_year") }}:</span>
              <span class="value">{{ result.workDaysPerYear }} {{ t("days") }}</span>
            </div>
          </div>
        </div>

        <div class="result-details">
          <h3>{{ t("detailed_analysis") }}</h3>

          <div class="detail-section">
            <h4>{{ t("work_balance") }}</h4>
            <div class="detail-item">
              <span class="label">{{ t("weekly_work_days") }}:</span>
              <span class="value">{{ formData.workDaysPerWeek }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t("wfh_days") }}:</span>
              <span class="value">{{ formData.wfhDaysPerWeek }}/{{ formData.workDaysPerWeek }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t("total_vacation") }}:</span>
              <span class="value">
                {{
                  parseInt(formData.annualLeave) + parseInt(formData.paidSickLeave) + parseInt(formData.publicHolidays)
                }}
                {{ t("days") }}
              </span>
            </div>
          </div>

          <div class="detail-section">
            <h4>{{ t("environment_factors") }}</h4>
            <div class="detail-item">
              <span class="label">{{ t("city_level") }}:</span>
              <span class="value">{{ getCityName() }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t("work_env_rating") }}:</span>
              <span class="value">{{ formData.workEnvironment }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t("leadership_rating") }}:</span>
              <span class="value">{{ formData.leadership }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t("team_rating") }}:</span>
              <span class="value">{{ formData.teamwork }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>{{ t("personal_factors") }}</h4>
            <div class="detail-item">
              <span class="label">{{ t("education") }}:</span>
              <span class="value">{{ t(getDegreeDesc()) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">{{ t("work_experience") }}:</span>
              <span class="value">{{ t(getWorkYearsDesc()) }}</span>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button class="btn generate-report" @click="generateReport">
            {{ t("generate_report") }}
          </button>
          <button class="btn save-history" @click="saveToHistory">
            {{ t("save_history") }}
          </button>
          <button class="btn toggle-history" @click="showHistory = !showHistory">
            {{ showHistory ? t("hide_history") : t("show_history") }}
          </button>
        </div>

        <!-- 历史记录 -->
        <div class="history-section" v-if="showHistory && history.length">
          <h3>{{ t("calculation_history") }}</h3>
          <div class="history-list">
            <div class="history-item" v-for="item in history" :key="item.id">
              <div class="history-score" :style="{ color: item.assessmentColor }">
                {{ item.value }}
              </div>
              <div class="history-details">
                <div class="history-assessment">{{ t(item.assessment) }}</div>
                <div class="history-date">{{ formatDate(item.timestamp) }}</div>
              </div>
              <button class="history-load" @click="loadHistoryItem(item)">
                {{ t("load") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

// 国家名称多语言映射
const countryNames = {
  zh: {
    CN: "中国",
    US: "美国",
    JP: "日本",
    GB: "英国",
    DE: "德国",
    FR: "法国",
    CA: "加拿大",
    AU: "澳大利亚",
    SG: "新加坡",
    KR: "韩国"
  },
  en: {
    CN: "China",
    US: "United States",
    JP: "Japan",
    GB: "United Kingdom",
    DE: "Germany",
    FR: "France",
    CA: "Canada",
    AU: "Australia",
    SG: "Singapore",
    KR: "South Korea"
  },
  ja: {
    CN: "中国",
    US: "アメリカ",
    JP: "日本",
    GB: "イギリス",
    DE: "ドイツ",
    FR: "フランス",
    CA: "カナダ",
    AU: "オーストラリア",
    SG: "シンガポール",
    KR: "韓国"
  }
};

// 翻译文本
const translations = {
  zh: {
    salary_info: "💰 薪资信息",
    annual_salary: "年薪",
    country_region: "国家/地区",
    work_time: "⏱️ 工作时间",
    work_days_per_week: "每周工作天数",
    daily_work_hours: "每天工作小时数",
    daily_commute_hours: "每天通勤小时数",
    wfh_days_per_week: "每周远程工作日数",
    daily_rest_time: "每天休息时间(小时)",
    holidays: "🏖️ 假期信息",
    annual_leave: "年假天数",
    paid_sick_leave: "带薪病假天数",
    public_holidays: "公共假期天数",
    work_environment: "🏢 工作环境与地点",
    city_level: "工作城市等级",
    work_environment_rating: "工作环境评分",
    leadership_rating: "领导关系评分",
    teamwork_rating: "团队氛围评分",
    hometown: "是否在老家工作",
    company_benefits: "🏥 公司福利",
    shuttle_service: "班车服务",
    has_shuttle: "有班车",
    canteen_service: "食堂服务",
    has_canteen: "有食堂",
    job_stability: "工作稳定性/类型",
    personal_factors: "👤 个人因素",
    education: "学历",
    school_type: "学校类型",
    work_experience: "工作经验",
    calculation_result: "📈 计算结果",
    standardized_daily_salary: "标准化日薪",
    effective_daily_hours: "有效日工作时间",
    work_days_per_year: "每年工作日",
    hours: "小时",
    days: "天",
    detailed_analysis: "详细分析",
    work_balance: "工作生活平衡",
    weekly_work_days: "每周工作天数",
    wfh_days: "远程工作日数",
    total_vacation: "总假期天数",
    environment_factors: "环境因素",
    work_env_rating: "工作环境评分",
    team_rating: "团队评分",
    generate_report: "生成详细报告",
    save_history: "保存到历史",
    show_history: "查看历史",
    hide_history: "隐藏历史",
    calculation_history: "计算历史",
    load: "加载",
    yes: "是",
    no: "否",
    city_tier1: "一线城市",
    city_newtier1: "新一线城市",
    city_tier2: "二线城市",
    city_tier3: "三线城市",
    city_tier4: "四线城市",
    city_county: "县城",
    city_town: "乡镇",
    shuttle_none: "无班车",
    shuttle_inconvenient: "班车不便",
    shuttle_convenient: "班车便利",
    shuttle_direct: "直达班车",
    canteen_none: "无食堂",
    canteen_average: "食堂一般",
    canteen_good: "食堂良好",
    canteen_excellent: "食堂优秀",
    job_private: "民营企业",
    job_foreign: "外资企业",
    job_state: "国有企业",
    job_government: "政府机关",
    job_dispatch: "派遣/外包",
    job_freelance: "自由职业",
    below_bachelor: "本科以下",
    bachelor: "本科",
    masters: "硕士",
    phd: "博士",
    school_second_tier: "二本/普通院校",
    school_first_tier: "一本院校",
    school_elite: "顶尖院校",
    fresh_graduate: "应届毕业生",
    years_1_3: "1-3年",
    years_3_5: "3-5年",
    years_5_8: "5-8年",
    years_8_10: "8-10年",
    years_10_12: "10-12年",
    years_above_12: "12年以上",
    rating_terrible: "惨绝人寰",
    rating_poor: "略惨",
    rating_average: "一般",
    rating_good: "还不错",
    rating_great: "很爽",
    rating_excellent: "爽到爆炸",
    rating_perfect: "人生巅峰",
    rating_enter_salary: "请输入年薪"
  },
  en: {
    salary_info: "💰 Salary Information",
    annual_salary: "Annual Salary",
    country_region: "Country/Region",
    work_time: "⏱️ Work Time",
    work_days_per_week: "Work Days per Week",
    daily_work_hours: "Daily Work Hours",
    daily_commute_hours: "Daily Commute Hours",
    wfh_days_per_week: "WFH Days per Week",
    daily_rest_time: "Daily Rest Time (hours)",
    holidays: "🏖️ Holidays",
    annual_leave: "Annual Leave Days",
    paid_sick_leave: "Paid Sick Leave Days",
    public_holidays: "Public Holidays",
    work_environment: "🏢 Work Environment & Location",
    city_level: "City Level",
    work_environment_rating: "Work Environment Rating",
    leadership_rating: "Leadership Rating",
    teamwork_rating: "Teamwork Rating",
    hometown: "Working in hometown",
    company_benefits: "🏥 Company Benefits",
    shuttle_service: "Shuttle Service",
    has_shuttle: "Has shuttle",
    canteen_service: "Canteen Service",
    has_canteen: "Has canteen",
    job_stability: "Job Stability/Type",
    personal_factors: "👤 Personal Factors",
    education: "Education",
    school_type: "School Type",
    work_experience: "Work Experience",
    calculation_result: "📈 Calculation Result",
    standardized_daily_salary: "Standardized Daily Salary",
    effective_daily_hours: "Effective Daily Hours",
    work_days_per_year: "Work Days per Year",
    hours: "hours",
    days: "days",
    detailed_analysis: "Detailed Analysis",
    work_balance: "Work-Life Balance",
    weekly_work_days: "Weekly Work Days",
    wfh_days: "WFH Days",
    total_vacation: "Total Vacation Days",
    environment_factors: "Environmental Factors",
    work_env_rating: "Work Env Rating",
    team_rating: "Team Rating",
    generate_report: "Generate Detailed Report",
    save_history: "Save to History",
    show_history: "Show History",
    hide_history: "Hide History",
    calculation_history: "Calculation History",
    load: "Load",
    yes: "Yes",
    no: "No",
    city_tier1: "Tier 1 City",
    city_newtier1: "New Tier 1 City",
    city_tier2: "Tier 2 City",
    city_tier3: "Tier 3 City",
    city_tier4: "Tier 4 City",
    city_county: "County Town",
    city_town: "Township",
    shuttle_none: "No shuttle",
    shuttle_inconvenient: "Inconvenient shuttle",
    shuttle_convenient: "Convenient shuttle",
    shuttle_direct: "Direct shuttle",
    canteen_none: "No canteen",
    canteen_average: "Average canteen",
    canteen_good: "Good canteen",
    canteen_excellent: "Excellent canteen",
    job_private: "Private Enterprise",
    job_foreign: "Foreign Enterprise",
    job_state: "State-owned Enterprise",
    job_government: "Government Agency",
    job_dispatch: "Dispatched/Outsourced",
    job_freelance: "Freelance",
    below_bachelor: "Below Bachelor",
    bachelor: "Bachelor",
    masters: "Masters",
    phd: "PhD",
    school_second_tier: "Second-tier College",
    school_first_tier: "First-tier College",
    school_elite: "Elite College",
    fresh_graduate: "Fresh Graduate",
    years_1_3: "1-3 years",
    years_3_5: "3-5 years",
    years_5_8: "5-8 years",
    years_8_10: "8-10 years",
    years_10_12: "10-12 years",
    years_above_12: "Above 12 years",
    rating_terrible: "Terrible",
    rating_poor: "Poor",
    rating_average: "Average",
    rating_good: "Good",
    rating_great: "Great",
    rating_excellent: "Excellent",
    rating_perfect: "Perfect",
    rating_enter_salary: "Please enter salary"
  },
  ja: {
    salary_info: "💰 給与情報",
    annual_salary: "年収",
    country_region: "国/地域",
    work_time: "⏱️ 労働時間",
    work_days_per_week: "週当たりの稼働日数",
    daily_work_hours: "1日の労働時間",
    daily_commute_hours: "1日の通勤時間",
    wfh_days_per_week: "週当たりの在宅勤務日数",
    daily_rest_time: "1日の休憩時間（時間）",
    holidays: "🏖️ 休暇情報",
    annual_leave: "有給休暇日数",
    paid_sick_leave: "有給病気休暇日数",
    public_holidays: "祝祭日数",
    work_environment: "🏢 職場環境と場所",
    city_level: "勤務先の都市規模",
    work_environment_rating: "職場環境評価",
    leadership_rating: "上司関係評価",
    teamwork_rating: "チーム雰囲気評価",
    hometown: "実家での勤務有無",
    company_benefits: "🏥 会社福利厚生",
    shuttle_service: "社用バスサービス",
    has_shuttle: "社用バス有り",
    canteen_service: "社員食堂サービス",
    has_canteen: "社員食堂有り",
    job_stability: "職務安定性/種類",
    personal_factors: "👤 個人要因",
    education: "学歴",
    school_type: "学校の種類",
    work_experience: "職務経験",
    calculation_result: "📈 計算結果",
    standardized_daily_salary: "標準化日給",
    effective_daily_hours: "実効的な1日の労働時間",
    work_days_per_year: "年間稼働日数",
    hours: "時間",
    days: "日",
    detailed_analysis: "詳細分析",
    work_balance: "ワークライフバランス",
    weekly_work_days: "週当たりの稼働日数",
    wfh_days: "在宅勤務日数",
    total_vacation: "総休暇日数",
    environment_factors: "環境要因",
    work_env_rating: "職場環境評価",
    team_rating: "チーム評価",
    generate_report: "詳細レポートを生成",
    save_history: "履歴に保存",
    show_history: "履歴を表示",
    hide_history: "履歴を非表示",
    calculation_history: "計算履歴",
    load: "読み込み",
    yes: "はい",
    no: "いいえ",
    city_tier1: "一線都市",
    city_newtier1: "新一線都市",
    city_tier2: "二線都市",
    city_tier3: "三線都市",
    city_tier4: "四線都市",
    city_county: "県城",
    city_town: "町村",
    shuttle_none: "社用バスなし",
    shuttle_inconvenient: "社用バスが不便",
    shuttle_convenient: "社用バスが便利",
    shuttle_direct: "直達社用バス",
    canteen_none: "社員食堂なし",
    canteen_average: "社員食堂が普通",
    canteen_good: "社員食堂が良好",
    canteen_excellent: "社員食堂が優秀",
    job_private: "民間企業",
    job_foreign: "外資系企業",
    job_state: "国営企業",
    job_government: "政府機関",
    job_dispatch: "派遣/アウトソーシング",
    job_freelance: "フリーランス",
    below_bachelor: "学士未満",
    bachelor: "学士",
    masters: "修士",
    phd: "博士",
    school_second_tier: "二本/普通大学",
    school_first_tier: "一本大学",
    school_elite: "トップ大学",
    fresh_graduate: "新卒",
    years_1_3: "1-3年",
    years_3_5: "3-5年",
    years_5_8: "5-8年",
    years_8_10: "8-10年",
    years_10_12: "10-12年",
    years_above_12: "12年以上",
    rating_terrible: "最悪",
    rating_poor: "悪い",
    rating_average: "普通",
    rating_good: "良い",
    rating_great: "非常に良い",
    rating_excellent: "優れている",
    rating_perfect: "完璧",
    rating_enter_salary: "年収を入力してください"
  }
};

// PPP转换因子映射表
const pppFactors = {
  CN: 4.19,
  US: 1.0,
  JP: 102.84,
  GB: 0.7,
  DE: 0.75,
  FR: 0.73,
  CA: 1.21,
  AU: 1.47,
  SG: 0.84,
  KR: 861.82
};

// 货币符号映射表
const currencySymbols = {
  CN: "¥",
  US: "$",
  JP: "¥",
  GB: "£",
  DE: "€",
  FR: "€",
  CA: "C$",
  AU: "A$",
  SG: "S$",
  KR: "₩"
};

// 初始化语言状态
const language = ref("zh");
const setLanguage = lang => {
  language.value = lang;
  localStorage.setItem("language", lang);
};

// 翻译函数
const t = key => {
  return translations[language.value][key] || key;
};

// 初始化表单数据
const formData = ref({
  salary: "0",
  workDaysPerWeek: "5",
  workHours: "10",
  commuteHours: "2",
  restTime: "2",
  wfhDaysPerWeek: "0",
  annualLeave: "5",
  paidSickLeave: "3",
  publicHolidays: "13",
  jobStability: "2",
  jobStabilityGroup: [
    { text: "job_government", rating: "3" },
    { text: "job_state", rating: "2.5" },
    { text: "job_foreign", rating: "2" },
    { text: "job_private", rating: "1.5" },
    { text: "job_dispatch", rating: "1" },
    { text: "job_freelance", rating: "0.5" }
  ],
  cityFactor: "1.0",
  cityFactorGroup: [
    { text: "city_tier1", rating: "0.70" },
    { text: "city_newtier1", rating: "0.80" },
    { text: "city_tier2", rating: "1.0" },
    { text: "city_tier3", rating: "1.10" },
    { text: "city_tier4", rating: "1.25" },
    { text: "city_county", rating: "1.40" },
    { text: "city_town", rating: "1.50" }
  ],
  workEnvironment: "1.0",
  workEnvironmentGroup: [
    { text: "偏僻的工厂/工地/户外", rating: "0.7" },
    { text: "工厂/工地/户外", rating: "0.9" },
    { text: "普通环境", rating: "1.0" },
    { text: "CBD", rating: "1.2" }
  ],
  leadership: "1.0",
  leadershipGroup: [
    { text: "对我不爽", rating: "0.5" },
    { text: "管理严格", rating: "0.9" },
    { text: "中规中矩", rating: "1.0" },
    { text: "善解人意", rating: "1.2" },
    { text: "我是嫡系", rating: "1.5" }
  ],
  teamwork: "1.0",
  teamworkGroup: [
    { text: "都是傻逼", rating: "0.5" },
    { text: "萍水相逢", rating: "1.0" },
    { text: "和和睦睦", rating: "1.2" },
    { text: "私交甚好", rating: "1.5" }
  ],
  homeTown: "no",
  hasShuttle: false,
  shuttle: "1.0",
  hasCanteen: false,
  canteen: "1.0",
  degreeType: "bachelor",
  schoolType: "firstTier",
  workYears: "0"
});

// 创建计算属性用于双向绑定
const workDaysPerWeek = computed({
  get() {
    return formData.value.workDaysPerWeek;
  },
  set(value) {
    const num = Number(value);
    // 限制范围
    if (num < 1) {
      formData.value.workDaysPerWeek = 1;
    } else if (num > 7) {
      formData.value.workDaysPerWeek = 7;
    } else if (isNaN(num)) {
      formData.value.workDaysPerWeek = 1;
    } else {
      formData.value.workDaysPerWeek = num;
    }
    calculateWorth();
  }
});

// 国家选择
const selectedCountry = ref("CN");

// 初始化时从localStorage加载国家和语言设置
onMounted(() => {
  if (typeof window !== "undefined") {
    const savedCountry = localStorage.getItem("selectedCountry");
    if (savedCountry && pppFactors[savedCountry]) {
      selectedCountry.value = savedCountry;
    }

    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && translations[savedLanguage]) {
      language.value = savedLanguage;
    }

    // 加载历史记录
    const savedHistory = localStorage.getItem("jobValueHistory");
    if (savedHistory) {
      try {
        history.value = JSON.parse(savedHistory);
      } catch (e) {
        console.error("加载历史记录失败", e);
      }
    }
  }
});

// 当国家选择改变时保存到localStorage
const handleCountryChange = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("selectedCountry", selectedCountry.value);
  }
  calculateWorth();
};

// 计算结果
const result = ref(null);

// 历史记录
const history = ref([]);
const showHistory = ref(false);

// 计算工作性价比
const calculateWorth = () => {
  // 验证必要的输入
  if (!formData.value.salary || isNaN(formData.value.salary)) {
    result.value = {
      value: 0,
      assessment: "rating_enter_salary",
      assessmentColor: "#6b7280"
    };
    return;
  }

  // 处理薪资为0的特殊情况（提前定义结果结构）
  const isZeroSalary = Number(formData.value.salary) === 0;

  // 1. 计算每年工作日（避免出现0）
  const workDaysPerYear = Math.max(
    1, // 确保至少为1，避免后续除法问题
    Math.round(
      parseInt(formData.value.workDaysPerWeek) * 52 -
        parseInt(formData.value.annualLeave) -
        parseInt(formData.value.publicHolidays) -
        parseInt(formData.value.paidSickLeave) * 0.6
    )
  );

  // 2. 计算日薪 (考虑PPP转换)
  const pppFactor = pppFactors[selectedCountry.value] || 4.19;
  const standardizedSalary = Number(formData.value.salary) * (0.9 / pppFactor);
  const dailySalary = isZeroSalary ? 0 : standardizedSalary / workDaysPerYear;

  // 3. 计算工作环境因子（略）
  const environmentFactor =
    parseFloat(formData.value.workEnvironment) *
    parseFloat(formData.value.leadership) *
    parseFloat(formData.value.teamwork);

  // 4. 计算通勤因子（略）
  const commuteFactor =
    1 /
    (1 +
      (parseFloat(formData.value.commuteHours) *
        (1 - parseInt(formData.value.wfhDaysPerWeek) / parseInt(formData.value.workDaysPerWeek))) /
        10);

  // 5-10. 其他因子计算（保持不变）
  const cityFactor = parseFloat(formData.value.cityFactor);
  const shuttleFactor = formData.value.hasShuttle ? parseFloat(formData.value.shuttle) : 1.0;
  const canteenFactor = formData.value.hasCanteen ? parseFloat(formData.value.canteen) : 1.0;
  const benefitFactor = shuttleFactor * canteenFactor;

  const stabilityFactor = Number(formData.value.jobStability);

  let educationFactor = 1.0;
  if (formData.value.degreeType === "bachelor") educationFactor = 1.1;
  if (formData.value.degreeType === "masters") educationFactor = 1.3;
  if (formData.value.degreeType === "phd") educationFactor = 1.5;

  let schoolFactor = 1.0;
  if (formData.value.schoolType === "firstTier") schoolFactor = 1.05;
  if (formData.value.schoolType === "elite") schoolFactor = 1.15;
  const totalEducationFactor = educationFactor * schoolFactor;

  const experienceFactor = 1 + Math.min(parseInt(formData.value.workYears), 10) * 0.05;
  const hometownFactor = formData.value.homeTown === "yes" ? 1.1 : 1.0;

  // 11. 综合计算性价比分数（薪资为0时直接返回0）
  const totalHours = Math.max(
    1, // 确保至少为1，避免除以0
    parseFloat(formData.value.workHours) +
      parseFloat(formData.value.commuteHours) *
        (1 - parseInt(formData.value.wfhDaysPerWeek) / parseInt(formData.value.workDaysPerWeek)) -
      parseFloat(formData.value.restTime)
  );

  console.log("totalHours", dailySalary, totalHours, dailySalary / totalHours);
  const worthScore = isZeroSalary
    ? 0
    : ((dailySalary / totalHours) *
        environmentFactor *
        commuteFactor *
        cityFactor *
        benefitFactor *
        stabilityFactor *
        totalEducationFactor *
        experienceFactor *
        hometownFactor) /
      10;

  // 12. 评估结果（薪资为0时强制设为最低等级）
  let assessment = "";
  let assessmentColor = "";

  if (isZeroSalary) {
    assessment = "rating_terrible";
    assessmentColor = "#9d174d";
  } else if (worthScore < 0.6) {
    assessment = "rating_terrible";
    assessmentColor = "#9d174d";
  } else if (worthScore < 1.0) {
    assessment = "rating_poor";
    assessmentColor = "#ef4444";
  } else if (worthScore <= 2) {
    assessment = "rating_average";
    assessmentColor = "#f97316";
  } else if (worthScore <= 2.5) {
    assessment = "rating_good";
    assessmentColor = "#3b82f6";
  } else if (worthScore <= 4.3) {
    assessment = "rating_great";
    assessmentColor = "#22c55e";
  } else if (worthScore <= 5.5) {
    assessment = "rating_excellent";
    assessmentColor = "#a855f7";
  } else {
    assessment = "rating_perfect";
    assessmentColor = "#facc15";
  }

  // 更新结果（确保即使薪资为0也能正常显示）
  result.value = {
    value: worthScore,
    workDaysPerYear,
    dailySalary,
    assessment,
    assessmentColor
  };
};

// 生成详细报告
const generateReport = () => {
  if (!result.value) return;
  // 在实际应用中，可以生成分享链接或图片
  console.log("生成报告数据:", { formData: formData.value, result: result.value, country: selectedCountry.value });
};

// 保存到历史记录
const saveToHistory = () => {
  if (!result.value || result.value.assessment === "rating_enter_salary") return;

  const historyItem = {
    id: Date.now().toString(),
    timestamp: Date.now(),
    value: result.value.value.toFixed(2),
    assessment: result.value.assessment,
    assessmentColor: result.value.assessmentColor,
    salary: formData.value.salary,
    countryCode: selectedCountry.value,
    countryName: countryNames[language.value][selectedCountry.value],
    ...formData.value
  };

  // 添加新记录到头部
  history.value.unshift(historyItem);

  // 限制最多保存3条记录，超出则移除最旧的
  if (history.value.length > 3) {
    history.value = history.value.slice(0, 3);
  }

  // 保存到localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("jobValueHistory", JSON.stringify(history.value));
  }
};

// 加载历史记录项
const loadHistoryItem = item => {
  // 恢复表单数据
  Object.keys(formData.value).forEach(key => {
    if (item[key] !== undefined) {
      formData.value[key] = item[key];
    }
  });

  // 恢复国家选择
  selectedCountry.value = item.countryCode;

  // 重新计算
  calculateWorth();
};

// 格式化日期
const formatDate = timestamp => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 获取货币符号
const getCurrencySymbol = () => {
  return currencySymbols[selectedCountry.value] || "$";
};

// 计算有效工作时间
const getEffectiveWorkTime = () => {
  return (
    parseFloat(formData.value.workHours) +
    parseFloat(formData.value.commuteHours) *
      (1 - parseInt(formData.value.wfhDaysPerWeek) / parseInt(formData.value.workDaysPerWeek)) -
    parseFloat(formData.value.restTime)
  );
};

// 获取城市名称
const getCityName = () => {
  return t(
    `city_${
      formData.value.cityFactor === "0.70"
        ? "tier1"
        : formData.value.cityFactor === "0.80"
          ? "newtier1"
          : formData.value.cityFactor === "1.0"
            ? "tier2"
            : formData.value.cityFactor === "1.10"
              ? "tier3"
              : formData.value.cityFactor === "1.25"
                ? "tier4"
                : formData.value.cityFactor === "1.40"
                  ? "county"
                  : "town"
    }`
  );
};

// 获取学历描述
const getDegreeDesc = () => {
  return formData.value.degreeType;
};

// 获取工作年限描述
const getWorkYearsDesc = () => {
  switch (formData.value.workYears) {
    case "0":
      return "fresh_graduate";
    case "1":
      return "years_1_3";
    case "2":
      return "years_3_5";
    case "4":
      return "years_5_8";
    case "6":
      return "years_8_10";
    case "10":
      return "years_10_12";
    case "15":
      return "years_above_12";
    default:
      return "fresh_graduate";
  }
};

// 获取表情符号
const getEmoji = () => {
  if (!result.value) return "📊";

  const value = result.value.value;
  if (value < 0.6) return "😭";
  if (value < 1.0) return "😔";
  if (value <= 1.8) return "😐";
  if (value <= 2.5) return "😊";
  if (value <= 3.2) return "😁";
  if (value <= 4.0) return "🤩";
  return "🎉";
};

// 监听表单变化自动计算
watch([formData, selectedCountry], calculateWorth, { deep: true, immediate: true });
</script>

<style scoped>
.job-worth-calculator {
  --bg-color: #fff;
}

html.dark .job-worth-calculator {
  --bg-color: #202127;
}

.job-worth-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.calculator-header {
  text-align: center;
  margin-bottom: 30px;
}

.calculator-header h1 {
  color: #1e40af;
  margin-bottom: 10px;
}

.language-switcher {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.language-switcher button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.language-switcher button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.calculator-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .calculator-content {
    grid-template-columns: 1fr;
  }
}

.form-section {
  background: var(--bg-color);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-section h2,
.result-title {
  color: cornflowerblue;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.checkbox-group input {
  width: auto;
  margin-right: 8px;
}

.input-with-symbol {
  position: relative;
}

.input-with-symbol input {
  padding-left: 30px;
}

.input-with-symbol span {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

/* 按钮组容器样式 */
.button-group {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  gap: 0.5rem; /* 按钮间距 */
}

/* 子元素样式 - 限制最多4列 */
.button-group > button {
  /* 计算每列宽度：100% / 4列 = 25%，减去间距补偿 */
  flex: 1;
  min-width: calc(25% - 0.5rem); /* 确保最少占1/4宽度 */
  max-width: calc(25% - 0.5rem); /* 最多占1/4宽度 */
}

/* 响应式调整：在小屏幕上自动减少列数 */
@media (max-width: 768px) {
  .button-group > button {
    min-width: calc(50% - 0.5rem); /* 屏幕较小时最多2列 */
    max-width: calc(50% - 0.5rem);
  }
}

@media (max-width: 480px) {
  .button-group > button {
    min-width: 100%; /* 超小屏幕时1列 */
    max-width: 100%;
  }
}

.form-group-button {
  background-color: #f9fafb;
  padding: 10px 5px;
  font-size: small;
  border-radius: 0.375rem;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;
}

.form-group-button-active {
  background-color: #dee9fc;
}

.calculator-result {
  position: sticky;
  top: 80px;
  background: var(--bg-color);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: start;
}

@media (max-width: 768px) {
  .calculator-result {
    position: relative;
    top: auto;
  }
}

.result-overview {
  margin-bottom: 30px;
}

.result-score {
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.emoji {
  font-size: 2rem;
  display: block;
  margin-bottom: 10px;
}

.score {
  font-size: 3rem;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

.assessment {
  font-size: 1.2rem;
  padding: 5px 15px;
  border-radius: 20px;
  background: #e0f2fe;
  color: #0369a1;
}

.result-main {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 15px;
  text-align: center;
}

.main-stat {
  background: #f1f5f9;
  padding: 15px;
  border-radius: 8px;
}

.main-stat .label {
  display: block;
  color: #64748b;
  margin-bottom: 5px;
}

.main-stat .value {
  font-weight: bold;
  font-size: 1.1rem;
}

.result-details {
  margin-bottom: 30px;
}

.result-details h3 {
  color: #1e40af;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 10px;
  margin-top: 0;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  color: #3b82f6;
  margin-bottom: 10px;
  margin-top: 15px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  color: #64748b;
}

.value {
  font-weight: 500;
}

.result-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.generate-report {
  background: #3b82f6;
  color: white;
}

.generate-report:hover {
  background: #2563eb;
}

.save-history {
  background: #10b981;
  color: white;
}

.save-history:hover {
  background: #059669;
}

.toggle-history {
  background: #f59e0b;
  color: white;
}

.toggle-history:hover {
  background: #d97706;
}

.history-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.history-section h3 {
  color: #1e40af;
  margin-top: 0;
}

.history-list {
  max-height: 300px;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8fafc;
  border-radius: 4px;
  margin-bottom: 10px;
}

.history-score {
  font-weight: bold;
  font-size: 1.2rem;
  min-width: 60px;
  text-align: center;
}

.history-details {
  flex-grow: 1;
  margin: 0 15px;
}

.history-assessment {
  font-weight: 500;
}

.history-date {
  font-size: 0.8rem;
  color: #64748b;
}

.history-load {
  padding: 5px 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
