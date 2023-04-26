<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Hive from "./components/Hive.vue";
import CorrectGuesses from "./components/CorrectGuesses.vue";
import Progress from "./components/Progress.vue";
import Info from "./components/Info.vue";
import GameWon from "./components/GameWon.vue";
import allAnswers from "../data/allAnswers.json";
import { useMainStore } from "./store";
import { InfoFilled, Sunny, Moon } from "@element-plus/icons-vue";

const store = useMainStore();
const showInfo = ref(false);
const zindex = ref(0);
const gameWonModalShown = ref(false);
let timer: any;

const darkmode = ref(store.theme === "dark");

const onToggleDarkMode = () => {
  if (darkmode.value === true) {
    store.theme = "dark";
    document.documentElement.classList.add("dark");
  } else {
    store.theme = "light";
    document.documentElement.classList.remove("dark");
  }
};

const showGameWonModal = computed(
  () => store.getProgressPercentage === 100 && gameWonModalShown.value === false
);

const onOpenCorrectGuesses = () => {
  clearTimeout(timer);
  zindex.value = -1;
};

const onCloseCorrectGuesses = () => {
  timer = setTimeout(() => {
    zindex.value = 0;
  }, 2000);
};

onMounted(onToggleDarkMode);

store.startGame({ allAnswers });
</script>

<template>
  <el-dialog
    v-model="showGameWonModal"
    @closed="gameWonModalShown = true"
    title="Congratulations!">
    <GameWon />
  </el-dialog>
  <el-dialog v-model="showInfo" :title="$t('How to play')">
    <Info />
  </el-dialog>
  <div class="common-layout fireworks">
    <div class="beforeFireworks" v-if="showGameWonModal" />
    <div class="afterFireworks" v-if="showGameWonModal" />
    <el-header height="2em" id="title-header">
      <h2>
        <strong>FIT Spelling Bee</strong>
      </h2>
    </el-header>
    <el-menu mode="horizontal" :ellipsis="false">
      <el-menu-item index="1" @click="showInfo = true">
        <el-tooltip :content="$t('Info')" placement="top">
          <el-icon class="menu-icon">
            <InfoFilled />
          </el-icon>
        </el-tooltip>
        <span class="responsive-menu-text">{{ $t("Info") }}</span>
      </el-menu-item>
      <el-menu-item index="3">
        <el-switch
          v-model="darkmode"
          @change="onToggleDarkMode"
          class="darkmode-switch"
          style="--el-switch-on-color: $gold"
          inline-prompt
          size="large"
          :active-icon="Sunny"
          :inactive-icon="Moon" />
      </el-menu-item>
    </el-menu>
    <Progress />
    <CorrectGuesses
      @open="onOpenCorrectGuesses"
      @close="onCloseCorrectGuesses" />
    <Hive :ZIndex="zindex" />
  </div>
</template>

<style lang="scss">
@import "element-plus/dist/index.css";
@import "element-plus/theme-chalk/dark/css-vars.css";
@import "./assets/styles/fireworks.scss";
@import "./assets/styles/_variables.scss";

* {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

:root {
  --el-color-success: $gold;
  --el-primary-color: $gold;
}


html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

div {
  white-space: pre-wrap;
  word-break: break-word;
}

.darkmode-switch {
  margin-top: 5px;
}

h2 span {
  color: #bebebe;
  font-weight: lighter;
}

.main-container {
  padding-top: 3em;
}

.common-layout {
  max-width: 1000px;
  margin: auto;
}

.el-header h2 {
  padding: 0;
  margin: 0;
}
.el-menu--horizontal {
  border-top: solid 1px var(--el-menu-border-color);
  justify-content: space-between;
  .el-menu-item {
    padding: 0;
  }
}
.is-focused {
  border-color: $gold !important;
}
.is-selected {
  color: $gold !important;
  &::after {
    color: $gold;
    background-color: $gold !important;
  }
}
.el-dialog {
  width: 80%;
}
.el-table {
  --el-table-header-bg-color: unset;
}
.el-message--success {
  --el-message-bg-color: unset;
  --el-message-text-color: unset;
  background-color: $gold !important;
  color: black !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  padding: 0 10px;

  max-width: calc(100% - 20px);
  max-height: 100vh;
  #title-header {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
}

.pangram {
  font-weight: bold;
}

.toast-message {
  max-width: 80%;
  margin: 0, 1em;
  margin-top: 25vh;
}

html.dark {
  header strong {
    color: $gold;
  }
  .pangram {
    color: $gold;
  }
}

@media only screen and (max-height: 500px) {
  .toast-message {
    margin-top: 50px;
  }
}

@media only screen and (max-width: 700px) {
  #app {
    margin-top: 10px;
  }
  .menu-icon {
    margin: 19px 5px;
  }
}

@media only screen and (max-width: 400px) {
  .responsive-menu-text {
    display: none;
  }
}
</style>
