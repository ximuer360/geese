<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { createProject } from '@/api/project';
import { useRouter } from 'vue-router';

interface ProjectForm {
  name: string;
  description: string;
  repoUrl: string;
  language: string;
  tags: string[];
}

const form = ref<ProjectForm>({
  name: '',
  description: '',
  repoUrl: '',
  language: '',
  tags: []
});

const loading = ref(false);
const error = ref('');
const router = useRouter();

const handleSubmit = async () => {
  try {
    loading.value = true;
    const result = await createProject(form.value);
    // 提交成功后跳转到首页
    router.push('/');
  } catch (err: any) {
    error.value = err.message || '提交失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bg-dark-card rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6">提交项目</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- 项目名称 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          项目名称
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-2 bg-dark-hover rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例如：vue"
        />
      </div>

      <!-- 仓库地址 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          仓库地址
        </label>
        <input
          v-model="form.repoUrl"
          type="url"
          required
          class="w-full px-4 py-2 bg-dark-hover rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://github.com/username/repo"
        />
      </div>

      <!-- 项目描述 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          项目描述
        </label>
        <textarea
          v-model="form.description"
          required
          rows="4"
          class="w-full px-4 py-2 bg-dark-hover rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="请简要描述项目的主要功能和特点..."
        />
      </div>

      <!-- 编程语言 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          主要编程语言
        </label>
        <input
          v-model="form.language"
          type="text"
          class="w-full px-4 py-2 bg-dark-hover rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例如：JavaScript"
        />
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">提交中...</span>
          <span v-else>提交项目</span>
        </button>
      </div>
    </form>
  </div>
</template> 