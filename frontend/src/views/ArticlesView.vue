<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

interface Article {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  tags: string[];
}

const articles = ref<Article[]>([
  {
    id: '1',
    title: 'Vue 3 组合式 API 完全指南',
    description: '本文将详细介绍 Vue 3 组合式 API 的使用方法，包括 setup、ref、reactive 等核心概念...',
    author: {
      name: 'Vue Team',
      avatar: 'https://avatars.githubusercontent.com/u/6128107'
    },
    date: '2024-01-10',
    readTime: '10 min',
    tags: ['Vue', 'JavaScript', '前端']
  },
  // 添加更多文章...
]);
</script>

<template>
  <div class="space-y-6">
    <!-- 文章列表 -->
    <div class="bg-dark-card rounded-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">技术文章</h1>
        <div class="flex space-x-4">
          <button class="px-4 py-2 bg-dark-hover rounded-lg text-gray-300 hover:text-white">
            最新
          </button>
          <button class="px-4 py-2 bg-dark-hover rounded-lg text-gray-300 hover:text-white">
            热门
          </button>
        </div>
      </div>

      <!-- 文章卡片列表 -->
      <div class="space-y-6">
        <article
          v-for="article in articles"
          :key="article.id"
          class="bg-dark-hover rounded-lg p-6 hover:bg-opacity-80 transition-colors"
        >
          <div class="flex items-start space-x-4">
            <img
              :src="article.author.avatar"
              :alt="article.author.name"
              class="w-12 h-12 rounded-full"
            />
            <div class="flex-1 min-w-0">
              <h2 class="text-xl font-bold hover:text-blue-400">
                <a href="#">{{ article.title }}</a>
              </h2>
              <div class="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                <span>{{ article.author.name }}</span>
                <span>{{ article.date }}</span>
                <span>{{ article.readTime }}</span>
              </div>
              <p class="mt-4 text-gray-300">{{ article.description }}</p>
              <div class="flex items-center space-x-2 mt-4">
                <span
                  v-for="tag in article.tags"
                  :key="tag"
                  class="px-3 py-1 bg-dark-card rounded-full text-sm text-gray-400"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- 加载更多 -->
      <div class="text-center mt-8">
        <button class="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-400">
          加载更多
        </button>
      </div>
    </div>
  </div>
</template> 