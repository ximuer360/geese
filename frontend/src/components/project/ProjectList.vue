<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProjects, deleteProject } from '@/api/project';
import ProjectEditForm from './ProjectEditForm.vue';

interface Project {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  language: string;
  stars: number;
  tags: Array<{
    id: string;
    name: string;
    nameEn: string;
  }>;
  createdAt: string;
}

const projects = ref<Project[]>([]);
const loading = ref(true);
const error = ref('');
const editingProject = ref<Project | null>(null);

const fetchProjects = async () => {
  try {
    loading.value = true;
    error.value = '';
    console.log('Fetching projects...');
    const data = await getProjects();
    console.log('Received projects:', data);
    projects.value = data;
  } catch (err: any) {
    console.error('Error fetching projects:', err);
    error.value = err.response?.data?.error || err.message || '加载失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  console.log('Component mounted, fetching projects...');
  fetchProjects();
});

const handleEdit = (project: Project) => {
  editingProject.value = project;
};

const handleDelete = async (id: string) => {
  if (!confirm('确定要删除这个项目吗？')) return;
  
  try {
    await deleteProject(id);
    projects.value = projects.value.filter(p => p.id !== id);
  } catch (err: any) {
    console.error('Error deleting project:', err);
    error.value = err.response?.data?.error || err.message || '删除失败，请稍后重试';
  }
};

const handleProjectUpdated = (updatedProject: Project) => {
  const index = projects.value.findIndex(p => p.id === updatedProject.id);
  if (index !== -1) {
    projects.value[index] = updatedProject;
  }
  editingProject.value = null;
};
</script>

<template>
  <div class="space-y-4">
    <!-- 编辑表单 -->
    <ProjectEditForm
      v-if="editingProject"
      :project="editingProject"
      @updated="handleProjectUpdated"
      @cancel="editingProject = null"
    />

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <!-- 项目列表 -->
    <div v-else class="space-y-4">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-dark-hover rounded-lg p-6 hover:bg-opacity-80 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-xl font-bold hover:text-blue-400">
              <a :href="project.repoUrl" target="_blank" rel="noopener noreferrer">
                {{ project.name }}
              </a>
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
        <p class="mt-4 text-gray-300">{{ project.description }}</p>
        <div class="mt-4 flex items-center space-x-4 text-sm text-gray-400">
          <span v-if="project.language" class="flex items-center">
            <span class="mr-1">🔤</span>
            {{ project.language }}
          </span>
          <span class="flex items-center">
            <span class="mr-1">⭐</span>
            {{ project.stars }}
          </span>
        </div>
        
        <!-- 添加操作按钮 -->
        <div class="mt-4 flex justify-end space-x-4">
          <button
            @click="handleEdit(project)"
            class="px-4 py-1 text-sm text-gray-300 hover:text-white transition-colors"
          >
            编辑
          </button>
          <button
            @click="handleDelete(project.id)"
            class="px-4 py-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 