<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = defineProps<{
  project: {
    id: string;
    name: string;
    description: string;
    language: string;
    stars: number;
    images: Array<{ url: string }>;
    tags: Array<{ id: string; name: string }>;
    coverImage: string;
  }
}>();

const router = useRouter();

const handleClick = () => {
  router.push(`/projects/${props.project.id}`);
};

// 格式化 stars 数字
const formatStars = (stars: number) => {
  if (!stars) return 0;
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`;
  }
  return stars;
};
</script>

<template>
  <div
    class="bg-[#1a1f2d] rounded-lg overflow-hidden cursor-pointer hover:bg-[#1e2433] transition-colors"
    @click="handleClick"
  >
    <!-- 项目封面图 -->
    <div v-if="project.coverImage" class="aspect-video">
      <img
        :src="project.coverImage"
        :alt="project.name"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- 项目信息 -->
    <div class="p-3">
      <!-- 标题 -->
      <h3 class="text-base font-medium mb-1.5 truncate">{{ project.name }}</h3>
      
      <!-- 描述 -->
      <p class="text-sm text-gray-400 mb-2 line-clamp-2">{{ project.description }}</p>
      
      <!-- 底部信息 -->
      <div class="flex items-center justify-between text-xs text-gray-400">
        <div class="flex items-center gap-3">
          <span v-if="project.language" class="flex items-center">
            <span class="mr-1">🔤</span>
            {{ project.language }}
          </span>
          <span class="flex items-center">
            <span class="mr-1">⭐</span>
            {{ formatStars(project.stars) }}
          </span>
        </div>
        
        <!-- 标签 -->
        <div class="flex gap-1">
          <span
            v-for="tag in project.tags.slice(0, 2)"
            :key="tag.id"
            class="px-1.5 py-0.5 bg-gray-700 rounded text-xs"
          >
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 