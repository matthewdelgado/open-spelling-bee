<script setup lang="ts">
import { ref } from "vue";
import { useMainStore } from "../store";

const store = useMainStore();
const showRanking = ref(false);
</script>

<template>
  <el-dialog v-model="showRanking" :title="$t('Ranking')">
    <div class="ranking-dialog">
      <p>{{ $t("RankMSG") }}:</p>
      <ul>
        <li
          v-for="(scoreLevel, index) in store.getScoreLevels"
          :key="`ranking${index}`">
          {{ $t(`rank.${index}`) }} ({{ scoreLevel }})
        </li>
      </ul>
    </div>
  </el-dialog>
  <div class="row" @click="showRanking = false">
    <el-progress
      :percentage="store.getProgressPercentage"
      :stroke-width="20"
      color="#880818"
      :format="() => store.getUserScore" />
  </div>
</template>

<style scoped lang="scss">
@import "../assets/styles/_variables";

.row {
  margin: 20px;
}

.ranking-dialog {
  text-align: left;
}

html.dark .row strong {
  color: $red;
}

@media only screen and (max-width: 700px) {
  .row {
    margin: 10px;
  }
}
</style>
