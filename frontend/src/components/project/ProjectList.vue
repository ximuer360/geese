<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getProjects } from '@/api/project';

interface Project {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  language: string;
  stars: number;
  images: Array<{
    id: string;
    url: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  coverImage: string;
}

const router = useRouter();
const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref('');

const fetchProjects = async () => {
  try {
    loading.value = true;
    console.log('Fetching projects...');
    const data = await getProjects();
    console.log('Received projects:', data);
    projects.value = data;
  } catch (err: any) {
    console.error('Error fetching projects:', err);
    error.value = err.response?.data?.error || err.message || '加载失败';
  } finally {
    loading.value = false;
  }
};

const handleProjectClick = (id: string) => {
  router.push(`/projects/${id}`);
};

onMounted(() => {
  console.log('ProjectList component mounted');
  fetchProjects();
});
</script>

<template>
  <div class="space-y-4">
    <div class="text-sm text-gray-400">
      Debug Info:
      <pre>{{ { loading, error, projectsCount: projects.length } }}</pre>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <!-- 项目列表 -->
    <div v-else-if="projects.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-[#1a1f2d] rounded-lg overflow-hidden hover:bg-[#242938] transition-colors"
      >
        <RouterLink :to="`/projects/${project.id}`">
          <!-- 封面图片 -->
          <div class="aspect-video relative overflow-hidden">
            <img
              v-if="project.coverImage"
              :src="project.coverImage"
              :alt="project.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full bg-gray-700 flex items-center justify-center">
              <span class="text-gray-400">暂无图片</span>
            </div>
          </div>

          <!-- 项目信息 -->
          <div class="p-4">
            <h3 class="text-lg font-medium mb-2 text-white">{{ project.name }}</h3>
            <p class="text-gray-400 text-sm mb-4 line-clamp-2">
              {{ project.description }}
            </p>
            
            <!-- 标签 -->
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in project.tags"
                :key="tag.id"
                class="px-2 py-1 text-xs bg-gray-700 rounded-full text-gray-300"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- 项目信息 -->
            <div class="flex items-center justify-between mt-4 text-sm text-gray-400">
              <span>{{ project.language }}</span>
              <div class="flex items-center">
                <span class="mr-1">⭐</span>
                {{ project.stars }}
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-8 text-gray-400">
      暂无项目
    </div>
  </div>
</template>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
}

.aspect-w-16 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 