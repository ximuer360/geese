<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ProjectCard from '@/components/project/ProjectCard.vue';
import { getProjects } from '@/api/project';

const route = useRoute();
const loading = ref(false);
const error = ref('');
const projects = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);

const fetchProjects = async (page = 1, tag = '') => {
  try {
    loading.value = true;
    const response = await getProjects({
      page,
      pageSize: pageSize.value,
      tag
    });
    projects.value = page === 1 
      ? response.data 
      : [...projects.value, ...response.data];
    total.value = response.pagination.total;
    currentPage.value = page;
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
};

// 加载更多
const loadMore = () => {
  if (!loading.value) {
    fetchProjects(currentPage.value + 1, route.query.tag as string);
  }
};

// 监听路由参数变化
watch(
  () => route.query.tag,
  (newTag) => {
    fetchProjects(1, newTag as string);
  }
);

onMounted(() => {
  fetchProjects(1, route.query.tag as string);
});
</script>

<template>
  <div class="flex-1 min-w-0">
    <!-- 加载状态 -->
    <div v-if="loading && currentPage === 1" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <!-- 项目列表 -->
    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>

      <!-- 加载更多 -->
      <div v-if="projects.length < total" class="flex justify-center mt-8">
        <button
          @click="loadMore"
          :disabled="loading"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>

      <!-- 无数据提示 -->
      <div v-else-if="projects.length === 0" class="text-center py-8 text-gray-400">
        暂无项目
      </div>
    </template>
  </div>
</template>

<style>
html {
  background-color: #13151f;
  color: white;
}
</style> 