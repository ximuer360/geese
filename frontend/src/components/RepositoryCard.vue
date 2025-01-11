<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { Repository } from '@/types/repository';
import { useI18n } from 'vue-i18n';

defineProps<{
  repository: Repository;
}>();

const { locale } = useI18n();
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
    <div class="p-4">
      <div class="flex items-start space-x-3">
        <img
          :src="repository.authorAvatar"
          :alt="repository.author"
          class="w-10 h-10 rounded-full"
        />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-medium truncate">
            <a
              :href="repository.url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-primary"
            >
              {{ repository.name }}
            </a>
          </h3>
          <p class="text-gray-500 text-sm truncate">{{ repository.fullName }}</p>
        </div>
      </div>

      <p class="mt-3 text-gray-600 line-clamp-2">
        {{ locale === 'zh' ? repository.description : repository.descriptionEn }}
      </p>

      <div class="mt-4 flex items-center justify-between text-sm">
        <div class="flex items-center space-x-4">
          <span class="flex items-center text-yellow-600">
            <Icon icon="mdi:star" class="mr-1" />
            {{ repository.stars.toLocaleString() }}
          </span>
          <span v-if="repository.language" class="flex items-center text-gray-600">
            <Icon icon="mdi:code-tags" class="mr-1" />
            {{ repository.language }}
          </span>
        </div>
        <div class="flex gap-2">
          <span
            v-for="tag in repository.tags"
            :key="tag.id"
            class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
          >
            {{ locale === 'zh' ? tag.name : tag.nameEn }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template> 