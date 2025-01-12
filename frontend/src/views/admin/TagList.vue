<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAdminTags, createTag, updateTag, deleteTag } from '@/api/tag';
import type { Tag } from '@/api/tag';

const categories = ref([]);
const loading = ref(true);
const error = ref('');
const showModal = ref(false);
const editingTag = ref<Tag | null>(null);

const formData = ref({
  name: '',
  nameEn: '',
  slug: ''
});

// 获取标签列表
const fetchTags = async () => {
  try {
    loading.value = true;
    const data = await getAdminTags();
    categories.value = data;
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
};

// 添加/编辑标签
const handleSubmit = async () => {
  try {
    if (editingTag.value) {
      await updateTag(editingTag.value.id, formData.value);
    } else {
      await createTag(formData.value);
    }
    await fetchTags();
    showModal.value = false;
    resetForm();
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  }
};

// 删除标签
const handleDelete = async (id: string) => {
  if (!confirm('确定要删除这个标签吗？')) return;
  try {
    await deleteTag(id);
    await fetchTags();
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  }
};

// 编辑标签
const handleEdit = (tag: Tag) => {
  editingTag.value = tag;
  formData.value = {
    name: tag.name,
    nameEn: tag.nameEn || '',
    slug: tag.slug || ''
  };
  showModal.value = true;
};

// 重置表单
const resetForm = () => {
  editingTag.value = null;
  formData.value = {
    name: '',
    nameEn: '',
    slug: ''
  };
};

onMounted(() => {
  fetchTags();
});
</script>

<template>
  <div class="bg-[#1a1f2d] rounded-lg p-6">
    <!-- 头部操作区 -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">标签管理</h2>
      <button
        @click="() => { showModal = true; resetForm(); }"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        添加标签
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="mb-4 text-red-500">
      {{ error }}
    </div>

    <!-- 标签分类列表 -->
    <div class="space-y-6">
      <div v-for="category in categories" :key="category.name">
        <h3 class="text-lg font-medium mb-4 text-gray-300">{{ category.name }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="tag in category.items"
            :key="tag.id"
            class="bg-gray-800 rounded-lg p-4"
          >
            <div class="flex justify-between items-center">
              <span class="text-lg text-white">{{ tag.name }}</span>
              <span class="text-sm text-gray-400">{{ tag.count }} 个项目</span>
            </div>
            <div class="mt-4 flex gap-2">
              <button
                @click="handleEdit(tag)"
                class="text-blue-400 hover:text-blue-300"
              >
                编辑
              </button>
              <button
                @click="handleDelete(tag.id)"
                class="text-red-400 hover:text-red-300"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑标签弹窗 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-[#1a1f2d] rounded-lg p-6 w-[500px]">
        <h3 class="text-lg font-medium mb-4">
          {{ editingTag ? '编辑标签' : '添加标签' }}
        </h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              标签名称
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              英文名称
            </label>
            <input
              v-model="formData.nameEn"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Slug
            </label>
            <input
              v-model="formData.slug"
              type="text"
              required
              class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
            />
          </div>
          <div class="flex justify-end gap-4 mt-6">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 text-gray-300 hover:text-white"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              确定
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
</style> 