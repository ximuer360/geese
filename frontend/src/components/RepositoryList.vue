<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRepositoryStore } from '@/stores/repository';
import RepositoryCard from './RepositoryCard.vue';

const props = defineProps<{
  sort?: 'latest' | 'hot';
  tag?: string;
}>();

const store = useRepositoryStore();
const page = ref(1);
const pageSize = 12;

async function loadRepositories() {
  await store.fetchRepositories({
    page: page.value,
    pageSize,
    sort: props.sort,
    tag: props.tag,
  });
}

onMounted(loadRepositories);
</script>

<template>
  <div class="space-y-6">
    <div v-if="store.loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
    </div>
    
    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RepositoryCard
          v-for="repo in store.repositories"
          :key="repo.id"
          :repository="repo"
        />
      </div>

      <div v-if="store.total > page * pageSize" class="text-center mt-6">
        <button
          @click="page++"
          class="px-6 py-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
          :disabled="store.loading"
        >
          {{ store.loading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
  </div>
</template> 