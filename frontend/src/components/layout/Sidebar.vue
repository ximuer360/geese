<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

interface Category {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

const categories = [
  { id: 'hot', name: '热门标签', icon: 'ph:fire-fill' },
  { id: 'python', name: 'Python', icon: 'logos:python', count: 1234 },
  { id: 'java', name: 'Java', icon: 'logos:java', count: 890 },
  { id: 'cpp', name: 'C++', icon: 'logos:c-plusplus', count: 567 },
  { id: 'javascript', name: 'JavaScript', icon: 'logos:javascript', count: 789 },
  { id: 'tutorial', name: '教程', icon: 'ph:book-fill', count: 345 },
  { id: 'ai', name: 'AI', icon: 'ph:robot-fill', count: 234 },
  { id: 'algorithm', name: '算法', icon: 'ph:function-fill', count: 123 },
  { id: 'rust', name: 'Rust', icon: 'logos:rust', count: 89 },
  { id: 'game', name: '游戏', icon: 'ph:game-controller-fill', count: 67 }
] as Category[];

const activeCategory = ref('hot');
</script>

<template>
  <nav class="bg-dark-card rounded-lg overflow-hidden">
    <div class="p-2">
      <button
        v-for="category in categories"
        :key="category.id"
        :class="[
          'w-full px-4 py-2.5 text-left rounded-lg flex items-center justify-between transition-colors',
          activeCategory === category.id
            ? 'bg-blue-500 text-white'
            : 'text-gray-400 hover:bg-dark-hover hover:text-white'
        ]"
        @click="activeCategory = category.id"
      >
        <div class="flex items-center space-x-3">
          <Icon :icon="category.icon" class="w-5 h-5" />
          <span>{{ category.name }}</span>
        </div>
        <span v-if="category.count" class="text-sm opacity-60">{{ category.count }}</span>
      </button>
    </div>
  </nav>
</template> 