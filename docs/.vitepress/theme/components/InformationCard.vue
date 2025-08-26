<!-- 欢迎卡片组件 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';

// ------------------ 天气 Hook ------------------
function useWeather() {
  const weatherData = ref({
    city: '',
    temperature: '',
    type: '',
    date: '',
    week: ''
  });
  const error = ref(false);
  const loading = ref(false);

  const getWeatherInfo = async () => {
    loading.value = true;
    error.value = false;
    try {
      const response = await fetch('https://api.vvhan.com/api/weather');
      const data = await response.json();
      if (data.success) {
        weatherData.value = {
          city: data.city,
          temperature: `${data.data.low}-${data.data.high}`,
          type: data.data.type,
          date: data.data.date,
          week: data.data.week
        };
      } else {
        error.value = true;
      }
    } catch (err) {
      error.value = true;
    } finally {
      loading.value = false;
    }
  };

  return {weatherData, error, loading, getWeatherInfo};
}

// ------------------ 舔狗日记 Hook ------------------
function useDiary() {
  const diaryContent = ref('');
  const diaryError = ref(false);

  const getDiary = async () => {
    diaryError.value = false;
    try {
      const response = await fetch('https://api.vvhan.com/api/text/dog?type=json');
      const data = await response.json();
      if (data.success) {
        diaryContent.value = data.data.content;
      } else {
        diaryError.value = true;
      }
    } catch (fetchError) {
      diaryError.value = true;
    }
  };

  return {diaryContent, diaryError, getDiary};
}

// ------------------ 使用 Hook ------------------
const {weatherData, error, loading, getWeatherInfo} = useWeather();
const {diaryContent, diaryError, getDiary} = useDiary();

// ------------------ 初始化 ------------------
const init = async () => {
  await getWeatherInfo();
  await getDiary();
};

onMounted(async () => {
  await init();
});
</script>

<template>
  <div class="welcome-card mobile-card" shadow="hover">
    <div class="welcome-content">
      <template v-if="!error">
        <h2 v-if="weatherData.city" class="greeting">
          欢迎来自
          <span class="highlight">{{ weatherData.city }}</span>
          的小伙伴！🎉🎉🎉
        </h2>

        <div class="info-container">
          <div class="info-item">
            <i class="el-icon-sunny"></i>
            <span v-if="weatherData.city">
              今日温度：
              <span class="highlight">{{ weatherData.temperature }}</span>
            </span>
          </div>
          <div class="info-item">
            <i class="el-icon-cloudy"></i>
            <span v-if="weatherData.city">
              天气：
              <span class="highlight">{{ weatherData.type }}</span>
            </span>
          </div>
          <div class="info-item">
            <i class="el-icon-date"></i>
            <span v-if="weatherData.city">
              日期：
              <span class="highlight">{{ weatherData.date }}</span>
            </span>
          </div>
          <div class="info-item">
            <i class="el-icon-calendar"></i>
            <span v-if="weatherData.city">
              星期：
              <span class="highlight">{{ weatherData.week }}</span>
            </span>
          </div>
        </div>
      </template>

      <template v-if="!diaryError">
        <div class="diary-container">
          <p class="diary-content">
            <span v-if="diaryContent">舔狗语录：{{ diaryContent }}</span>
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.welcome-card {
  margin: 4px;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  background: var(--day-bg);
  color: var(--day-text);
  box-shadow: 0 4px 6px var(--day-shadow);
  transform: translateY(0);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0); /* 完全透明的边框 */

  .welcome-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .greeting {
    font-size: 1.5rem;
    margin: 0;
    font-weight: bold;
  }

  .highlight {
    color: var(--vp-c-brand-1);
  }

  .info-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      font-size: 1.2rem;
    }
  }
}

.diary-container{
  max-width: 70vw;
  margin: 0 auto;
}
</style>
