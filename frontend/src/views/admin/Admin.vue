<script setup lang="ts">
import AdminHeader from '@/components/layout/AdminHeader.vue';
</script>

<template>
  <div class="min-h-screen bg-[#13151f]">
    <AdminHeader />
    <div class="max-w-[1440px] mx-auto px-6 py-6">
      <RouterView />
    </div>
  </div>
</template>

<style>
html {
  background-color: #13151f;
  color: white;
}
</style> 