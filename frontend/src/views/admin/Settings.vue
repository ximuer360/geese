<script setup lang="ts">
import { ref } from 'vue';

const settings = ref({
  siteName: '项目资源分享',
  siteDescription: '分享优质开源项目和学习资源',
  allowRegistration: true,
  requireApproval: true
});

const saving = ref(false);

const handleSubmit = async () => {
  try {
    saving.value = true;
    // TODO: 实现保存设置的逻辑
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('设置已保存');
  } catch (error) {
    console.error('保存设置失败:', error);
    alert('保存设置失败');
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="bg-[#1a1f2d] rounded-lg p-6">
    <h2 class="text-xl font-bold mb-6">系统设置</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl">
      <!-- 站点名称 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          站点名称
        </label>
        <input
          v-model="settings.siteName"
          type="text"
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <!-- 站点描述 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          站点描述
        </label>
        <textarea
          v-model="settings.siteDescription"
          rows="3"
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        ></textarea>
      </div>

      <!-- 开关选项 -->
      <div class="space-y-4">
        <div class="flex items-center">
          <input
            v-model="settings.allowRegistration"
            type="checkbox"
            class="w-4 h-4 text-blue-500"
          />
          <label class="ml-2 text-sm text-gray-300">
            允许新用户注册
          </label>
        </div>

        <div class="flex items-center">
          <input
            v-model="settings.requireApproval"
            type="checkbox"
            class="w-4 h-4 text-blue-500"
          />
          <label class="ml-2 text-sm text-gray-300">
            新项目需要审核
          </label>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div>
        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </form>
  </div>
</template> 