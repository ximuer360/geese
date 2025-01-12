<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Icon } from '@iconify/vue';

const router = useRouter();

const handleLogout = () => {
  localStorage.removeItem('admin_token');
  router.push('/admin/login');
};
</script>

<template>
  <header class="bg-dark-card border-b border-dark-hover">
    <div class="max-w-[1440px] mx-auto px-6">
      <div class="flex items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <RouterLink to="/admin/projects" class="flex items-center space-x-2">
            <Icon icon="simple-icons:github" class="w-8 h-8 text-blue-500" />
            <span class="text-xl font-bold text-white">后台管理系统</span>
          </RouterLink>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex items-center space-x-8 ml-8">
          <RouterLink 
            v-for="item in [
              { to: '/admin/projects', label: '项目管理' },
              { to: '/admin/tags', label: '标签管理' },
              { to: '/admin/settings', label: '系统设置' }
            ]"
            :key="item.to"
            :to="item.to"
            class="text-gray-300 hover:text-white transition-colors"
          >
            {{ item.label }}
          </RouterLink>
        </nav>

        <!-- 右侧按钮 -->
        <div class="flex items-center gap-4 ml-auto">
          <RouterLink to="/" class="text-gray-300 hover:text-white">
            返回前台
          </RouterLink>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            退出登录
          </button>
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