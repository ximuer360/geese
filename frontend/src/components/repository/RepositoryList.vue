<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RepositoryCard from './RepositoryCard.vue';

const props = defineProps<{
  sort?: 'latest' | 'hot';
}>();

const repositories = ref([]);
const loading = ref(false);

// 模拟数据
const mockData = [
  {
    id: '1',
    name: 'vue',
    fullName: 'vuejs/core',
    description: 'Vue.js 是一套用于构建用户界面的渐进式框架。',
    descriptionEn: 'Vue.js - The Progressive JavaScript Framework',
    url: 'https://github.com/vuejs/core',
    stars: 200000,
    language: 'TypeScript',
    author: 'vuejs',
    authorAvatar: 'https://avatars.githubusercontent.com/u/6128107',
    isHot: true,
    tags: [
      { id: '1', name: 'JavaScript', nameEn: 'JavaScript', slug: 'javascript' },
      { id: '2', name: '框架', nameEn: 'Framework', slug: 'framework' }
    ]
  },
  {
    id: '2',
    name: 'react',
    fullName: 'facebook/react',
    description: 'React 是一个用于构建用户界面的 JavaScript 库。',
    descriptionEn: 'A JavaScript library for building user interfaces',
    url: 'https://github.com/facebook/react',
    stars: 180000,
    language: 'JavaScript',
    author: 'facebook',
    authorAvatar: 'https://avatars.githubusercontent.com/u/69631',
    isHot: true,
    tags: [
      { id: '1', name: 'JavaScript', nameEn: 'JavaScript', slug: 'javascript' },
      { id: '3', name: '前端', nameEn: 'Frontend', slug: 'frontend' }
    ]
  },
  {
    id: '3',
    name: 'tensorflow',
    fullName: 'tensorflow/tensorflow',
    description: 'TensorFlow 是一个端到端的开源机器学习平台。',
    descriptionEn: 'An end-to-end open source machine learning platform',
    url: 'https://github.com/tensorflow/tensorflow',
    stars: 170000,
    language: 'Python',
    author: 'tensorflow',
    authorAvatar: 'https://avatars.githubusercontent.com/u/15658638',
    isHot: true,
    tags: [
      { id: '4', name: 'Python', nameEn: 'Python', slug: 'python' },
      { id: '5', name: '机器学习', nameEn: 'Machine Learning', slug: 'ml' }
    ]
  }
];

onMounted(() => {
  loading.value = true;
  setTimeout(() => {
    repositories.value = mockData;
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <div class="space-y-4">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- 仓库列表 -->
    <div v-else class="space-y-3">
      <RepositoryCard
        v-for="repo in repositories"
        :key="repo.id"
        :repository="repo"
        class="block"
      />
    </div>
  </div>
</template> 