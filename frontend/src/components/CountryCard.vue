<template>
  <div 
    @click="$emit('select', country)"
    class="group bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1.5 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 cursor-pointer flex flex-col justify-between"
  >
    <div>
      <!-- Drapeau + Badge sous-région -->
      <div class="flex items-start justify-between gap-2 mb-4">
        <img 
          :src="`https://flagcdn.com/w160/${country.iso}.png`" 
          :alt="country.name"
          class="h-12 w-auto max-w-[76px] object-cover rounded-md shadow-sm border border-gray-100 dark:border-gray-700 group-hover:scale-105 transition-transform duration-300"
        >
        <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 truncate max-w-[130px]">
          {{ country.subregion || country.continent }}
        </span>
      </div>

      <!-- Nom du pays & Capitale -->
      <h3 class="font-extrabold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
        {{ country.name }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {{ t('common.capital') }} : <strong class="text-gray-800 dark:text-gray-200">{{ country.capital }}</strong>
      </p>
    </div>

    <!-- Pied de carte : Population + Indication de retournement -->
    <div class="pt-3 border-t border-gray-100 dark:border-gray-700/70 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <span class="font-semibold">
        👥 {{ country.population }}
      </span>
      <span class="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
        {{ locale === 'fr' ? 'Voir la fiche' : 'View card' }} ↻
      </span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

defineProps({
  country: {
    type: Object,
    required: true
  }
});

defineEmits(['select']);
</script>