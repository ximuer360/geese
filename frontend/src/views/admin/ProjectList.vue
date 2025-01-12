<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getProjects } from '@/api/project';

const router = useRouter();
const loading = ref(false);
const error = ref('');
const projects = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

// 获取项目列表
const fetchProjects = async (page = 1) => {
  try {
    loading.value = true;
    const response = await getProjects({ page, pageSize: pageSize.value });
    projects.value = response.data;
    total.value = response.pagination.total;
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
};

// 格式化标签显示
const formatTags = (tags: any[]) => {
  return tags.map(tag => tag.name).join(', ');
};

// 计算总页数
const totalPages = computed(() => Math.ceil(total.value / pageSize.value));

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchProjects(page);
};

// 编辑项目
const handleEdit = (id: string) => {
  router.push(`/admin/projects/${id}/edit`);
};

// 创建新项目
const handleCreate = () => {
  router.push('/admin/projects/new');
};

onMounted(() => {
  fetchProjects();
});
</script>

<template>
  <div class="bg-[#1a1f2d] rounded-lg p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">项目管理</h2>
      <button
        @click="handleCreate"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        添加项目
      </button>
    </div>

    <!-- 项目列表 -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left border-b border-gray-700">
            <th class="p-4">项目名称</th>
            <th class="p-4">语言</th>
            <th class="p-4">Stars</th>
            <th class="p-4 w-1/4">标签</th>
            <th class="p-4">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id" class="border-b border-gray-700">
            <td class="p-4">{{ project.name }}</td>
            <td class="p-4">{{ project.language }}</td>
            <td class="p-4">{{ project.stars }}</td>
            <td class="p-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in project.tags"
                  :key="tag.id"
                  class="px-2 py-1 text-sm bg-gray-700 rounded-lg"
                >
                  {{ tag.name }}
                </span>
              </div>
            </td>
            <td class="p-4">
              <button
                @click="handleEdit(project.id)"
                class="text-blue-400 hover:text-blue-300 mr-4"
              >
                编辑
              </button>
              <button
                class="text-red-400 hover:text-red-300"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="flex justify-between items-center mt-6">
      <div class="text-sm text-gray-400">
        共 {{ total }} 条记录
      </div>
      <div class="flex gap-2">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="handlePageChange(page)"
          :class="[
            'px-3 py-1 rounded',
            currentPage === page
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          ]"
        >
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overflow-x-auto {
  position: relative;
  min-height: 200px;
}
</style> 