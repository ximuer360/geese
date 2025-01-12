<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getProject } from '@/api/project';
import { Viewer } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import { Icon } from '@iconify/vue';

// 导入样式
import 'bytemd/dist/index.css';
import 'highlight.js/styles/vs2015.css';

const plugins = [gfm(), highlight()];
const route = useRoute();
const project = ref<any>(null);
const loading = ref(true);
const error = ref('');
const previewImage = ref('');

const fetchProject = async () => {
  try {
    loading.value = true;
    const data = await getProject(route.params.id as string);
    project.value = data;
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchProject);

// 打开图片预览
const openImage = (url: string) => {
  previewImage.value = url;
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <!-- 项目详情 -->
    <div v-else-if="project" class="space-y-6">
      <!-- 面包屑导航 -->
      <div class="flex items-center text-sm text-gray-400">
        <router-link to="/" class="hover:text-white">首页</router-link>
        <span class="mx-2">/</span>
        <span>项目详情</span>
      </div>

      <!-- 项目标题 -->
      <h1 class="text-2xl font-bold text-white">{{ project.name }}</h1>

      <!-- 作者信息和更新时间 -->
      <div class="flex items-center gap-4 text-sm text-gray-400">
        <div class="flex items-center gap-2">
          <Icon icon="ph:user" class="w-4 h-4" />
          <span>{{ project.author || 'Admin' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon icon="ph:clock" class="w-4 h-4" />
          <span>{{ new Date(project.createdAt).toLocaleDateString() }}</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon icon="ph:eye" class="w-4 h-4" />
          <span>0</span>
        </div>
        <div class="flex items-center gap-2">
          <Icon icon="ph:thumbs-up" class="w-4 h-4" />
          <span>0</span>
        </div>
      </div>

      <!-- 标签 -->
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag.id"
          class="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
        >
          {{ tag.name }}
        </span>
      </div>

      <!-- 项目图片 -->
      <div v-if="project.images?.length" class="bg-[#1a1f2d] rounded-lg p-6">
        <div class="grid grid-cols-1 gap-4">
          <img
            v-for="image in project.images"
            :key="image.id"
            :src="image.url"
            :alt="project.name"
            class="w-full rounded-lg"
            @click="openImage(image.url)"
          />
        </div>
      </div>

      <!-- 项目描述 -->
      <div class="markdown-content bg-[#1a1f2d] rounded-lg p-6">
        <Viewer
          :value="project.description"
          :plugins="plugins"
        />
      </div>

      <!-- 项目链接 -->
      <div v-if="project.repoUrl" class="flex items-center gap-4">
        <a
          :href="project.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Icon icon="ph:link" class="w-5 h-5" />
          课程资源官方链接
        </a>
      </div>

      <!-- 版权信息 -->
      <div class="mt-8 p-4 bg-[#1a1f2d] rounded-lg text-sm text-gray-400">
        <p>© 版权声明</p>
        <p class="mt-2">本站资源属网友自发共享，均为网友共享的网盘链接，仅限于学习研究，不得将上述内容用于商业或非法用途，否则，一切后果请用户自负。平台不参与分享资源失效充值，如果觉得资源损失请支付正版，如果发现本站有侵权快速处理内容，请发送邮件至 1114920468@qq.com，我们将立即删除。</p>
      </div>
    </div>

    <!-- 图片预览弹窗 -->
    <div
      v-if="previewImage"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="previewImage = ''"
    >
      <img
        :src="previewImage"
        :alt="project?.name"
        class="max-w-[90%] max-h-[90vh] object-contain"
      />
      <button
        class="absolute top-4 right-4 text-white hover:text-gray-300"
        @click="previewImage = ''"
      >
        <Icon icon="ph:x" class="w-8 h-8" />
      </button>
    </div>
  </div>
</template>

<style>
.markdown-content {
  color: #e5e7eb;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin-top: 1.5em;
  margin-bottom: 1em;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(p) {
  margin: 1em 0;
  line-height: 1.75;
}

.markdown-content :deep(a) {
  color: #60a5fa;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(pre) {
  margin: 1em 0;
  padding: 1em;
  background-color: #2d3748 !important;
  border-radius: 0.5em;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.9em;
}

.markdown-content :deep(blockquote) {
  margin: 1em 0;
  padding-left: 1em;
  border-left: 4px solid #4a5568;
  color: #a0aec0;
}

/* 添加图片相关样式 */
.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

/* 图片悬停效果 */
.grid img {
  transition: transform 0.2s;
  cursor: zoom-in;
}

.grid img:hover {
  transform: scale(1.02);
}
</style> 