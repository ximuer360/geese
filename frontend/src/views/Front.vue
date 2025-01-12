<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import Sidebar from '@/components/layout/Sidebar.vue';
</script>

<template>
  <div class="min-h-screen bg-[#13151f]">
    <AppHeader />
    <div class="max-w-[1440px] mx-auto px-6">
      <div class="flex gap-6 py-6">
        <!-- 左侧导航 -->
        <div class="w-[200px] flex-shrink-0">
          <div class="sticky top-6">
            <Sidebar />
          </div>
        </div>

        <!-- 主内容区 -->
        <div class="flex-1 min-w-0">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticky {
  position: sticky;
  top: 1.5rem;
}
</style> 