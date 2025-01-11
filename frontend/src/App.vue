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

        <!-- 右侧信息栏 -->
        <div class="w-[280px] flex-shrink-0">
          <div class="sticky top-6">
            <!-- 登录卡片 -->
            <div class="bg-[#1a1f2d] rounded-lg p-4">
              <button class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                立即登录
              </button>
            </div>

            <!-- 统计信息 -->
            <div class="bg-[#1a1f2d] rounded-lg p-4 mt-4">
              <div class="space-y-4">
                <div>
                  <div class="text-gray-400 text-sm mb-1">用户总数</div>
                  <div class="text-2xl font-bold text-white">2.8w</div>
                </div>
                <div>
                  <div class="text-gray-400 text-sm mb-1">开源项目</div>
                  <div class="text-2xl font-bold text-white">3588</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
html {
  background-color: #13151f;
  color: white;
}
</style> 