<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getProjects, deleteProject } from '@/api/project';

const router = useRouter();
const projects = ref([]);
const loading = ref(true);
const error = ref('');

const fetchProjects = async () => {
  try {
    loading.value = true;
    const data = await getProjects();
    projects.value = data;
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
};

const handleEdit = (id: string) => {
  router.push(`/admin/projects/${id}/edit`);
};

const handleDelete = async (id: string) => {
  if (!confirm('确定要删除这个项目吗？')) return;
  
  try {
    await deleteProject(id);
    await fetchProjects();
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  }
};

onMounted(fetchProjects);
</script>

<template>
  <div class="bg-[#1a1f2d] rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">项目管理</h2>
      <router-link
        to="/admin/projects/new"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        添加项目
      </router-link>
    </div>

    <!-- 项目列表 -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="py-3 text-left">项目名称</th>
            <th class="py-3 text-left">语言</th>
            <th class="py-3 text-left">标签</th>
            <th class="py-3 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id" class="border-b border-gray-700">
            <td class="py-4">{{ project.name }}</td>
            <td class="py-4">{{ project.language }}</td>
            <td class="py-4">
              <div class="flex gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag.id"
                  class="px-2 py-1 text-xs bg-gray-700 rounded"
                >
                  {{ tag.name }}
                </span>
              </div>
            </td>
            <td class="py-4">
              <button
                @click="handleEdit(project.id)"
                class="text-blue-400 hover:text-blue-300 mr-4"
              >
                编辑
              </button>
              <button
                @click="handleDelete(project.id)"
                class="text-red-400 hover:text-red-300"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template> 