<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getTagCategories } from '@/api/tag';
import type { TagCategory } from '@/api/tag';

const router = useRouter();
const route = useRoute();
const categories = ref<TagCategory[]>([]);
const selectedTag = ref('');

const fetchCategories = async () => {
  try {
    const data = await getTagCategories();
    categories.value = data;
  } catch (err: any) {
    console.error('Error fetching categories:', err);
  }
};

const handleTagClick = (tag: string) => {
  selectedTag.value = tag;
  router.push({
    path: '/',
    query: tag ? { tag } : undefined
  });
};

onMounted(async () => {
  await fetchCategories();
  if (route.query.tag) {
    selectedTag.value = route.query.tag as string;
  }
});
</script>

<template>
  <div class="bg-[#1a1f2d] rounded-lg p-4">
    <h2 class="text-lg font-medium mb-4">热门标签</h2>
    <div class="space-y-4">
      <div v-for="category in categories" :key="category.name">
        <h3 class="text-sm font-medium text-gray-400 mb-2">{{ category.name }}</h3>
        <div class="space-y-1">
          <button
            v-for="item in category.items"
            :key="item.id"
            class="w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
            :class="selectedTag === item.name ? 'bg-blue-500 text-white' : 'text-gray-300'"
            @click="handleTagClick(item.name)"
          >
            <div class="flex justify-between items-center">
              <span>{{ item.name }}</span>
              <span class="text-xs text-gray-500">{{ item.count }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 