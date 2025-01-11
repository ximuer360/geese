<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProject } from '@/api/project';

const route = useRoute();
const router = useRouter();
const project = ref(null);
const loading = ref(true);
const error = ref('');
const currentImageIndex = ref(0);
const currentImage = computed(() => {
  return project.value?.images?.[currentImageIndex.value]?.url || '';
});

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
</script>

<template>
  <div>
    <!-- 返回按钮 -->
    <button
      @click="router.back()"
      class="mb-4 text-gray-400 hover:text-white flex items-center"
    >
      <span class="mr-2">←</span>
      返回
    </button>

    <div class="bg-[#1a1f2d] rounded-lg overflow-hidden">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error" class="text-red-500 text-center py-8">
        {{ error }}
      </div>

      <!-- 项目详情 -->
      <div v-else-if="project" class="p-6">
        <h1 class="text-2xl font-bold mb-4">{{ project.name }}</h1>
        
        <!-- 项目图片 -->
        <div v-if="project.images?.length" class="mb-6">
          <!-- 主图展示 -->
          <div class="aspect-video rounded-lg overflow-hidden mb-4">
            <img
              :src="currentImage"
              :alt="project.name"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- 缩略图列表 -->
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="(image, index) in project.images"
              :key="image.id"
              @click="currentImageIndex = index"
              class="aspect-video rounded-lg overflow-hidden cursor-pointer"
              :class="{ 'ring-2 ring-blue-500': currentImageIndex === index }"
            >
              <img
                :src="image.url"
                :alt="`${project.name} - ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- 项目信息 -->
        <div class="space-y-4">
          <p class="text-gray-300">{{ project.description }}</p>
          
          <div class="flex items-center space-x-4 text-sm text-gray-400">
            <span v-if="project.language" class="flex items-center">
              <span class="mr-1">🔤</span>
              {{ project.language }}
            </span>
            <span class="flex items-center">
              <span class="mr-1">⭐</span>
              {{ project.stars }}
            </span>
            <a
              :href="project.repoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-400 hover:text-blue-300"
            >
              查看源码
            </a>
          </div>

          <!-- 标签 -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag.id"
              class="px-2 py-1 text-xs bg-gray-700 rounded"
            >
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 