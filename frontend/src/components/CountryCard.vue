<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group">
    <div>
      <div class="mb-3 group-hover:scale-110 transition-transform origin-left h-10 flex items-center">
        <!-- Vraie image si ISO fourni, sinon émoji -->
        <img v-if="country.iso" :src="`https://flagcdn.com/w80/${country.iso}.png`" class="h-8 w-auto shadow-sm rounded-sm" :alt="country.name">
        <span v-else class="text-4xl">{{ country.flag }}</span>
      </div>
      <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 transition-colors">{{ country.name }}</h3>
      
      <div class="space-y-1 text-sm text-gray-500 dark:text-gray-400 transition-colors">
        <p class="flex items-center gap-2">
          <i class="fas fa-star text-xs w-4"></i> {{ $t('common.capital') }} : {{ country.capital }}
        </p>
        <p class="flex items-center gap-2">
          <!-- Si on veut traduire aussi le nom du continent, il faudra adapter la base de données plus tard, 
               mais le mot "Continent :" lui, sera bien traduit ! -->
          <i class="fas fa-globe text-xs w-4"></i> {{ $t('common.continent') }} : {{ country.continent }}
        </p>
      </div>
    </div>
    
    <div class="mt-4 flex justify-end">
      <i class="fas fa-arrow-right text-brandBlue group-hover:translate-x-1 transition-transform"></i>
    </div>
  </div>
</template>

<script setup>
defineProps({
  country: {
    type: Object,
    required: true
  }
});
</script>