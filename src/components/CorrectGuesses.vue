<script setup lang="ts">
import { computed, ref } from "vue";
import { useMainStore } from "../store";
import { gridify } from "../utils";

import { useI18n } from "vue-i18n";
import en from "../locales/en.json";

// Create an instance of the useI18n function for internationalization
const { t } = useI18n({
  inheritLocale: true, // Inherit the locale from the parent component
  messages: {
    en, // Use the English locale
  },
});

// Create the Vuex store using the useMainStore function
const store = useMainStore();

// Create a reactive variable to show the found words
const showWords = ref([false]);

// Computed property to display the number of correct guesses found
const numCorrectMessage = computed(() => {
  return t("foundWords", store.getCorrectGuesses.length); // Display the number of correct guesses found using the localized message
});

// Computed property to display the last five correct guesses found
const lastFiveGuesses = computed(() => {
  const numGuessesToShow = Math.min(store.getCorrectGuesses.length, 5); // Get the number of correct guesses to show, maximum 5
  return store.getCorrectGuesses.reverse().slice(0, numGuessesToShow); // Reverse the array and slice the first 5 elements
});

// Computed property to display the grid of correct guesses found
const gridData = computed(
  () => gridify({ arr: Array.from(store.getCorrectGuesses).sort(), size: 3 }) // Gridify the correct guesses array and display in groups of 3
);
</script>

<template>
  <el-collapse
    v-model="showWords"
    @change="showWords.length == 2 ? $emit('open') : $emit('close')">
    <el-collapse-item>
      <template #title>
        <template v-if="showWords.length === 2">
          {{ numCorrectMessage }}
        </template>
        <template v-else-if="lastFiveGuesses.length === 0">
          {{ t("Your words") }}...
        </template>
        <template v-else>
          <span
            v-for="(guess, index) in lastFiveGuesses"
            :key="guess"
            :class="store.cellClassName({ row: [guess], columnIndex: -1 })">
            {{ guess }}{{ index === lastFiveGuesses.length - 1 ? "" : ", " }}
          </span>
          <span v-if="lastFiveGuesses.length === 5"> ... </span>
        </template>
      </template>
      <el-table
        :data="gridData"
        class="correct-guesses-table"
        :cell-class-name="store.cellClassName">
        <el-table-column property="1" label="" />
        <el-table-column property="2" label="" />
        <el-table-column property="3" label="" />
      </el-table>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped lang="scss">
@import "../assets/styles/_variables";

.correct-guesses-table {
  min-height: 50vh;
}

html.dark .el-collapse {
  background-color: $bl-el-plus-dark-bg;
}
</style>