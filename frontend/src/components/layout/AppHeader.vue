<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Icon } from '@iconify/vue';

const searchQuery = ref('');
</script>

<template>
  <header class="bg-dark-card border-b border-dark-hover">
    <div class="max-w-[1440px] mx-auto px-6">
      <div class="flex items-center h-16">
        <!-- Logo 和搜索框 -->
        <div class="flex items-center flex-1">
          <RouterLink to="/" class="flex items-center space-x-2">
            <Icon icon="simple-icons:github" class="w-8 h-8 text-blue-500" />
            <span class="text-xl font-bold text-white">项目资源分享</span>
          </RouterLink>
          
          <div class="relative ml-8 flex-1 max-w-lg">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索开源项目"
              class="w-full px-4 py-1.5 bg-dark-hover rounded-full text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex items-center space-x-8 ml-8">
          <RouterLink 
            v-for="item in [
              { to: '/', label: '首页' },
              { to: '/monthly', label: '月刊' },
              { to: '/ranking', label: '🏆榜单' },
              { to: '/articles', label: '文章' }
            ]"
            :key="item.to"
            :to="item.to"
            class="text-gray-300 hover:text-white transition-colors"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- 右侧按钮 -->
        <div class="flex items-center space-x-4 ml-8">
          <RouterLink 
            to="/admin"
            class="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm text-white transition-colors"
          >
            后台管理
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  color: white;
}
</style> 