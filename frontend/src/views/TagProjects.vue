<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getProjectsByTag } from '@/api/project';
import ProjectCard from '@/components/project/ProjectCard.vue';

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  coverImage: string;
  images: Array<{ url: string }>;
  tags: Array<{ id: string; name: string }>;
}

const route = useRoute();
const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref('');
const tagName = ref('');

const fetchProjects = async () => {
  try {
    loading.value = true;
    error.value = '';
    const tagId = route.params.id as string;
    const data = await getProjectsByTag(tagId);
    console.log('Tag projects data:', data);
    projects.value = data.projects;
    tagName.value = data.tag.name;
  } catch (err: any) {
    console.error('Error fetching projects:', err);
    error.value = err.response?.data?.error || err.message;
    projects.value = [];
  } finally {
    loading.value = false;
  }
};

// 监听路由参数变化，重新获取数据
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchProjects();
    }
  }
);

onMounted(fetchProjects);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- 标题 -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">
        标签：{{ tagName }}
        <span class="text-gray-400 text-lg ml-2">({{ projects.length }}个项目)</span>
      </h1>
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
    <div v-else-if="projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center text-gray-400 py-8">
      该标签下暂无项目
    </div>
  </div>
</template> 