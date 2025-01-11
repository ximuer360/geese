<script setup lang="ts">
import { ref } from 'vue';

interface MonthlyIssue {
  id: string;
  number: number;
  title: string;
  description: string;
  date: string;
  items: {
    id: string;
    title: string;
    description: string;
    category: string;
    url: string;
  }[];
}

const issues = ref<MonthlyIssue[]>([
  {
    id: '1',
    number: 82,
    title: '2024年1月刊',
    description: '本月优选开源项目',
    date: '2024-01-01',
    items: [
      {
        id: '1',
        title: 'vue-next',
        description: 'Vue.js 3.0 核心库',
        category: 'JavaScript',
        url: 'https://github.com/vuejs/core'
      },
      // 添加更多项目...
    ]
  }
]);

const activeIssue = ref(issues.value[0]);
</script>

<template>
  <div class="space-y-6">
    <!-- 月刊列表 -->
    <div class="bg-dark-card rounded-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">月刊</h1>
        <div class="flex space-x-2">
          <button class="px-4 py-2 bg-dark-hover rounded-lg text-gray-300 hover:text-white">
            上一期
          </button>
          <button class="px-4 py-2 bg-dark-hover rounded-lg text-gray-300 hover:text-white">
            下一期
          </button>
        </div>
      </div>

      <!-- 月刊内容 -->
      <div v-if="activeIssue" class="space-y-8">
        <div class="text-center py-8 border-y border-dark-hover">
          <h2 class="text-3xl font-bold mb-2">第 {{ activeIssue.number }} 期</h2>
          <p class="text-gray-400">{{ activeIssue.date }}</p>
          <p class="mt-4 text-lg text-gray-300">{{ activeIssue.description }}</p>
        </div>

        <!-- 项目列表 -->
        <div class="space-y-6">
          <div
            v-for="item in activeIssue.items"
            :key="item.id"
            class="bg-dark-hover rounded-lg p-6 hover:bg-opacity-80 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-xl font-bold hover:text-blue-400">
                  <a :href="item.url" target="_blank" rel="noopener noreferrer">
                    {{ item.title }}
                  </a>
                </h3>
                <span class="inline-block px-3 py-1 bg-dark-card rounded-full text-sm text-gray-400 mt-2">
                  {{ item.category }}
                </span>
              </div>
            </div>
            <p class="mt-4 text-gray-300">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 