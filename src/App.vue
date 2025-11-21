<script setup lang="ts">
import Environment from '@components/config/Environment.vue';
import AppHeader from './shared/components/AppHeader.vue';
</script>

<template>
  <Environment />
  <AppHeader />
  <router-view> </router-view>
</template>
