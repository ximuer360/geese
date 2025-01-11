<script setup lang="ts">
import { ref } from 'vue';
import { updateProject } from '@/api/project';

const props = defineProps<{
  project: {
    id: string;
    name: string;
    description: string;
    repoUrl: string;
    language: string;
    tags: Array<{ name: string }>;
  };
}>();

const emit = defineEmits(['updated', 'cancel']);

const form = ref({
  name: props.project.name,
  description: props.project.description,
  repoUrl: props.project.repoUrl,
  language: props.project.language,
  tags: props.project.tags.map(tag => tag.name)
});

const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  try {
    loading.value = true;
    const result = await updateProject(props.project.id, form.value);
    emit('updated', result);
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message || '更新失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bg-dark-card rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6">编辑项目</h2>
    
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
        />
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>

      <!-- 按钮组 -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          class="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-400"
          @click="emit('cancel')"
        >
          取消
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">更新中...</span>
          <span v-else>更新</span>
        </button>
      </div>
    </form>
  </div>
</template> 