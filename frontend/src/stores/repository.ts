import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Repository, RepositoryParams } from '@/types/repository';
import { repositoryApi } from '@/api/repository';

export const useRepositoryStore = defineStore('repository', () => {
  const repositories = ref<Repository[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchRepositories(params: RepositoryParams) {
    try {
      loading.value = true;
      const response = await repositoryApi.getRepositories(params);
      repositories.value = response.data;
      total.value = response.total;
    } catch (err) {
      error.value = 'Failed to fetch repositories';
    } finally {
      loading.value = false;
    }
  }

  return {
    repositories,
    total,
    loading,
    error,
    fetchRepositories,
  };
}); 