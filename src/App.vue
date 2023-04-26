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

// Create the Vuex store using the useMainStore function
const store = useMainStore();

// Create reactive variables for various functionalities
const showInfo = ref(false); // Display the information modal
const zindex = ref(0); // Z-index of the correct guesses display
const gameWonModalShown = ref(false); // Display the game won modal
let timer: any; // Timer used for displaying the correct guesses

// Create a reactive variable for the dark mode theme
const darkmode = ref(store.theme === "dark");

// Function to toggle the dark mode theme
const onToggleDarkMode = () => {
  if (darkmode.value === true) {
    store.theme = "dark"; // Set the Vuex store's theme to dark
    document.documentElement.classList.add("dark"); // Add the dark class to the document element
  } else {
    store.theme = "light"; // Set the Vuex store's theme to light
    document.documentElement.classList.remove("dark"); // Remove the dark class from the document element
  }
};

// Computed property to show the game won modal when the game is won
const showGameWonModal = computed(
  () => store.getProgressPercentage === 100 && gameWonModalShown.value === false
);

// Function to show the correct guesses display
const onOpenCorrectGuesses = () => {
  clearTimeout(timer); // Clear the timer
  zindex.value = -1; // Set the z-index to -1 to show the correct guesses display
};

// Function to hide the correct guesses display
const onCloseCorrectGuesses = () => {
  timer = setTimeout(() => {
    zindex.value = 0; // Set the z-index to 0 to hide the correct guesses display
  }, 2000); // Display the correct guesses for 2 seconds before hiding it
};

// Call the onToggleDarkMode function when the component is mounted
onMounted(onToggleDarkMode);

// Start the game by calling the startGame function on the Vuex store
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
