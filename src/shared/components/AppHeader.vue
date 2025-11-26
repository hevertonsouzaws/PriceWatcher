<script setup lang="ts">

</script>

<template>
  <header class="flex justify-center gap-20 items-center w-full mx-auto border-b border-orange-700 p-5 bg-slate-900">


    <div class="flex justify-between items-center gap-20 border border-orange-500 rounded-2xl py-3 p-8">
      <div class="flex items-center space-x-3">
        <i class="fi fi-rr-dollar text-xl text-orange-400 mt-1"></i>
        <h1 class="text-xl text-gray-100">Notreveh Inv.</h1>
      </div>
      <nav class="text-gray-200 text-xl flex gap-14 py-0 p-4">
        <router-link to="/">
          <i class="fi fi-rr-chart-simple rounded-full hover:text-orange-500"></i>
        </router-link>
        <router-link to="/bitcoin">
          <i class="fi fi-rr-calculator rounded-full hover:text-orange-500"></i>
        </router-link>
        <router-link to="simulador">
          <i class="fi fi-rr-loading rounded-full hover:text-orange-500"></i>
        </router-link>
      </nav>
    </div>
  </header>
</template>