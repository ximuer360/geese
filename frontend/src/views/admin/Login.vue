<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '@/api/axios';

const router = useRouter();
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  try {
    loading.value = true;
    const response = await axios.post('/auth/login', { password: password.value });
    if (response.data.success) {
      localStorage.setItem('admin_token', response.data.token);
      router.push('/admin/projects');
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || '登录失败';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#13151f]">
    <div class="bg-[#1a1f2d] p-8 rounded-lg w-[400px]">
      <h2 class="text-2xl font-bold mb-6 text-center">后台登录</h2>
      <form @submit="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            密码
          </label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            placeholder="请输入管理密码"
          />
        </div>
        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template> 