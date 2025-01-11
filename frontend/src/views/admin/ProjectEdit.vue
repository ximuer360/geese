<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProject, createProject, updateProject } from '@/api/project';

const route = useRoute();
const router = useRouter();
const isEdit = route.params.id !== undefined;

interface FormData {
  name: string;
  description: string;
  repoUrl: string;
  language: string;
  stars: number;
  tags: string[];
  images: { url: string }[];
}

const form = ref<FormData>({
  name: '',
  description: '',
  repoUrl: '',
  language: '',
  stars: 0,
  tags: [],
  images: []
});

const loading = ref(false);
const error = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

// 如果是编辑模式，加载项目数据
onMounted(async () => {
  if (isEdit) {
    try {
      loading.value = true;
      const data = await getProject(route.params.id as string);
      form.value = {
        ...data,
        tags: data.tags.map(tag => tag.name)
      };
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message;
    } finally {
      loading.value = false;
    }
  }
});

// 处理表单提交
const handleSubmit = async () => {
  try {
    loading.value = true;
    if (isEdit) {
      await updateProject(route.params.id as string, form.value);
    } else {
      await createProject(form.value);
    }
    router.push('/admin/projects');
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
};

// 修改图片上传处理函数
const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    try {
      loading.value = true;
      error.value = ''; // 清除之前的错误信息

      for (const file of Array.from(input.files)) {
        // 检查文件大小
        if (file.size > 10 * 1024 * 1024) { // 10MB
          error.value = '图片大小不能超过10MB';
          continue;
        }

        try {
          // 压缩图片
          const compressedDataUrl = await compressImage(file);
          form.value.images.push({ url: compressedDataUrl });
        } catch (err) {
          console.error('Error compressing image:', err);
          error.value = '图片处理失败，请重试';
        }
      }
    } catch (err: any) {
      error.value = '图片上传失败：' + (err.message || '未知错误');
    } finally {
      loading.value = false;
      if (input) input.value = ''; // 清空 input，允许重复选择相同文件
    }
  }
};

// 优化图片压缩函数
const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // 计算压缩后的尺寸，保持宽高比
        let width = img.width;
        let height = img.height;
        const maxSize = 1200; // 最大尺寸

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height);

        // 转换为 base64，控制质量
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        
        // 检查压缩后的大小
        const base64Size = compressedDataUrl.length * 0.75; // 估算大小
        if (base64Size > 5 * 1024 * 1024) { // 5MB
          reject(new Error('压缩后的图片仍然太大，请选择更小的图片'));
          return;
        }

        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
};

// 删除图片
const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
};

// 处理标签输入
const tagInput = ref('');
const addTag = () => {
  const tag = tagInput.value.trim();
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag);
  }
  tagInput.value = '';
};

const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag);
};
</script>

<template>
  <div class="bg-[#1a1f2d] rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">{{ isEdit ? '编辑项目' : '创建项目' }}</h2>
      <button
        @click="router.push('/admin/projects')"
        class="text-gray-400 hover:text-white"
      >
        返回列表
      </button>
    </div>

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
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
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
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        ></textarea>
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
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <!-- 编程语言 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          编程语言
        </label>
        <input
          v-model="form.language"
          type="text"
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <!-- Star 数量 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          Star 数量
        </label>
        <input
          v-model.number="form.stars"
          type="number"
          min="0"
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <!-- 标签 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          标签
        </label>
        <div class="flex gap-2 mb-2">
          <input
            v-model="tagInput"
            type="text"
            @keyup.enter="addTag"
            placeholder="输入标签后按回车"
            class="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-white"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in form.tags"
            :key="tag"
            class="px-2 py-1 bg-gray-700 rounded-lg text-sm flex items-center"
          >
            {{ tag }}
            <button
              type="button"
              @click="removeTag(tag)"
              class="ml-2 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </span>
        </div>
      </div>

      <!-- 图片上传 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          项目截图
        </label>
        <div class="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleImageUpload"
            class="hidden"
            ref="fileInput"
          />
          <button
            type="button"
            @click="fileInput?.click()"
            :disabled="loading"
            class="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 disabled:opacity-50"
          >
            {{ loading ? '处理中...' : '选择图片' }}
          </button>
          <span class="text-sm text-gray-400">
            支持多张图片上传（每张不超过10MB）
          </span>
        </div>
        <div v-if="error" class="mt-2 text-red-500 text-sm">
          {{ error }}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div
            v-for="(image, index) in form.images"
            :key="index"
            class="relative group"
          >
            <img
              :src="image.url"
              :alt="form.name"
              class="w-full aspect-video object-cover rounded-lg"
            />
            <button
              type="button"
              @click="removeImage(index)"
              class="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end gap-4">
        <button
          type="button"
          @click="router.push('/admin/projects')"
          class="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
        >
          取消
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? '保存中...' : (isEdit ? '保存' : '创建') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style> 