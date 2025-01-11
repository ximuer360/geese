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
    <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-dark-hover rounded-lg p-6 hover:bg-opacity-80 transition-colors cursor-pointer"
        @click="handleProjectClick(project.id)"
      >
        <!-- 项目图片 -->
        <div v-if="project.images?.length" class="aspect-w-16 aspect-h-9 mb-4">
          <img
            :src="project.images[0].url"
            :alt="project.name"
            class="object-cover w-full h-full rounded-lg"
          />
        </div>

        <!-- 项目信息 -->
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-bold hover:text-blue-400">
                {{ project.name }}
              </h3>
              <div class="flex items-center space-x-2 mt-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag.id"
                  class="px-3 py-1 bg-dark-card rounded-full text-sm text-gray-400"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>
            <div class="text-sm text-gray-400">
              {{ new Date(project.createdAt).toLocaleDateString() }}
            </div>
          </div>

          <p class="text-gray-300 line-clamp-2">{{ project.description }}</p>

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
              @click.stop
            >
              查看源码
            </a>
          </div>
        </div>
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