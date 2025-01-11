<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  descriptionEn: string;
  url: string;
  stars: number;
  language: string;
  author: string;
  authorAvatar: string;
  isHot: boolean;
  tags: Array<{
    id: string;
    name: string;
    nameEn: string;
    slug: string;
  }>;
}

defineProps<{
  repository: Repository;
}>();

const { locale } = useI18n();

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239CA3AF"%3E%3Cpath d="M12 12a5 5 0 100-10 5 5 0 000 10zm0-2a3 3 0 110-6 3 3 0 010 6zm9 11a1 1 0 01-2 0v-2a3 3 0 00-3-3H8a3 3 0 00-3 3v2a1 1 0 01-2 0v-2a5 5 0 015-5h8a5 5 0 015 5v2z"/%3E%3C/svg%3E';
};
</script>

<template>
  <div class="bg-[#2d3343] rounded-lg overflow-hidden hover:bg-[#353e52] transition-colors duration-200">
    <div class="p-5">
      <div class="flex items-start space-x-3">
        <div class="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
          <img
            :src="repository.authorAvatar"
            :alt="repository.author"
            class="w-full h-full object-cover"
            @error="handleImageError"
          />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="font-medium text-white truncate">
            <a
              :href="repository.url"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-blue-400 transition-colors"
            >
              {{ repository.name }}
            </a>
          </h3>
          <p class="text-gray-400 text-sm truncate">{{ repository.fullName }}</p>
        </div>
      </div>

      <p class="mt-3 text-gray-300 text-sm line-clamp-2">
        {{ locale === 'zh' ? repository.description : repository.descriptionEn }}
      </p>

      <div class="mt-4 flex items-center justify-between text-sm">
        <div class="flex items-center space-x-4">
          <span class="flex items-center text-yellow-500">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {{ repository.stars.toLocaleString() }}
          </span>
          <span v-if="repository.language" class="flex items-center text-gray-400">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {{ repository.language }}
          </span>
        </div>
        <div class="flex gap-2">
          <span
            v-for="tag in repository.tags"
            :key="tag.id"
            class="px-2 py-1 text-xs rounded-full bg-[#13151f] text-gray-300 hover:bg-opacity-80 cursor-pointer transition-colors"
          >
            {{ locale === 'zh' ? tag.name : tag.nameEn }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template> 