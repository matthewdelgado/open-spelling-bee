import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { differenceInDays, isSameDay } from "date-fns";
import { incrementDups } from "./utils";
import { Answer } from "./models/answer";

const epoch = new Date("2022-01-01");

export const useMainStore = defineStore({
  id: "main", // Set the store ID to "main"
  state: () => ({
    // Define the store's initial state
    correctGuesses: useStorage("correctGuesses", new Set([]) as Set<string>),
    answers: useStorage("answers", [] as Array<string>),
    availableLetters: useStorage("availableLetters", "" as string),
    middleLetter: useStorage("middleLetter", "" as string),
    gameDate: useStorage("gameDate", epoch as Date),
    lastGameDate: useStorage("lastGameDate", new Date() as Date),
    yesterdaysAnswers: useStorage("yesterdaysAnswers", [] as Array<string>),
    yesterdaysAvailableLetters: useStorage(
      "yesterdaysAvailableLetters",
      "" as string
    ),
    yesterdaysMiddleLetter: useStorage("yesterdaysMiddleLetter", "" as string),
    theme: useStorage("theme", "light" as string),
    pointsMessages: {
      1: "Good",
      5: "Nice",
      6: "Great",
      7: "Excellent",
      8: "Amazing",
    } as { [key: number]: string },
  }),
  getters: {
    // Define the store's getters
    getMaxScore(): number {
      // Get the maximum possible score
      return this.answers.reduce((acc: number, word: string): number => {
        // @ts-ignore issue with this ref? says .calculatePoints is undefined here but not outside arrow funcs
        return acc + this.calculatePoints({ word });
      }, 0);
    },
    getMinScore(): number {
      // Get the minimum possible score
      const minNumWords = 20;
      return minNumWords - 1 + 14; // The minimum score is 33
    },
    getScoreLevels(): Array<number> {
      // Get the score levels
      const levels = [
        0,
        5,
        Math.floor(this.getMaxScore * 0.1),
        Math.floor(this.getMaxScore * 0.2),
        Math.floor(this.getMaxScore * 0.3),
        Math.floor(this.getMaxScore * 0.4),
        Math.floor(this.getMaxScore * 0.5),
        Math.floor(this.getMaxScore * 0.55),
        Math.floor(this.getMaxScore * 0.6),
      ].sort((a, b) => a - b);
      const uniqueLevels = incrementDups(levels); // Use the incrementDups function to remove duplicates
      const minUniqueLevel = Math.min(...uniqueLevels);
      return uniqueLevels.map((l: number) => l - minUniqueLevel); // Map the levels to start at zero
    },
    getCorrectGuesses(): Array<string> {
      // Get the correct guesses array
      return Array.from(this.correctGuesses);
    },
    getProgressIndex(): number {
      return (
        this.getScoreLevels.filter((v) => v <= this.getUserScore).length - 1
      );
    },
    getProgressPercentage(): number {
      const progressPercentages = [0, 20, 40, 50, 60, 70, 80, 90, 100];
      return progressPercentages[this.getProgressIndex];
    },
    getUserScore(): number {
      return this.getCorrectGuesses.reduce(
        (acc: number, word: string): number => {
          // @ts-ignore issue with this ref? says .calculatePoints is undefined here but not outside arrow funcs
          return acc + this.calculatePoints({ word });
        },
        0
      );
    },
    getColor(): string {
      return this.theme === "light" ? "white" : "#1c1b22";
    },
    getGameDate(): Date {
      return typeof this.gameDate === "string"
        ? new Date(this.gameDate)
        : this.gameDate;
    },
    getGameDateString(): string {
      return this.getGameDate.toISOString().split("T")[0];
    },
  },
  actions: {
    showMessage(args: object) {
      return ElMessage({
        duration: 2000,
        appendTo: "#app",
        customClass: "toast-message",
        grouping: true,
        showClose: true,
        ...args,
      });
    },
    submitGuess({ $t, guess }: { $t: Function; guess: string }) {
      if (guess.length < 4) {
        return this.showMessage({
          message: $t("Too short"),
        });
      }
      if (!guess.split("").includes(this.middleLetter)) {
        return this.showMessage({
          message: $t("Missing middle letter"),
        });
      }
      if (!this.answers.includes(guess)) {
        return this.showMessage({
          message: $t("Not in word list"),
        });
      }
      if (this.correctGuesses.has(guess)) {
        return this.showMessage({
          message: $t("Already found"),
        });
      }

      this.correctGuesses.add(guess);
      const points = this.calculatePoints({ word: guess });
      if (this.isPangram({ word: guess })) {
        this.showMessage({
          type: "Success",
          message: `Pangram! +${points}`,
        });
      } else {
        this.showMessage({
          type: "Success",
          message: this.generatePointsMessage({ $t, points }),
        });
      }
    },
    startGame({ allAnswers }: { allAnswers: Array<Answer> }) {
      const now = new Date();
      if (isSameDay(this.getGameDate, now)) return false;

      this.gameDate = now;
      this.correctGuesses = new Set([]);
      const daysSinceEpoch = differenceInDays(this.gameDate, epoch);
      const todaysAnswerObj = allAnswers[daysSinceEpoch % allAnswers.length];
      const yesterdaysAnswerObj =
        allAnswers[(daysSinceEpoch - 1) % allAnswers.length];

      this.setYesterdaysAnswersAndLastGameDate({ yesterdaysAnswerObj });

      const { answers, availableLetters, middleLetter } = todaysAnswerObj;

      this.answers = answers;
      this.availableLetters = availableLetters;
      this.middleLetter = middleLetter;
    },
    setYesterdaysAnswersAndLastGameDate({
      yesterdaysAnswerObj,
    }: {
      yesterdaysAnswerObj: Answer;
    }): string {
      if (differenceInDays(this.gameDate, this.lastGameDate) === 1) {
        this.yesterdaysAnswers = this.answers;
        this.yesterdaysAvailableLetters = this.availableLetters;
        this.yesterdaysMiddleLetter = this.middleLetter;
        return "local-storage-cache";
      } else {
        const {
          answers: yesterdaysAnswers,
          availableLetters: yesterdaysAvailableLetters,
          middleLetter: yesterdaysMiddleLetter,
        } = yesterdaysAnswerObj;
        this.yesterdaysAnswers = yesterdaysAnswers;
        this.yesterdaysAvailableLetters = yesterdaysAvailableLetters;
        this.yesterdaysMiddleLetter = yesterdaysMiddleLetter;
        this.lastGameDate = this.gameDate;
        return "cache-bust";
      }
    },
    calculatePoints({ word }: { word: string }): number {
      if (word.length === 4) return 1;
      if (this.isPangram({ word })) return word.length + 7;
      return word.length;
    },
    isPangram({ word }: { word: string }): boolean {
      return new Set(word).size === 7;
    },
    generatePointsMessage({
      $t,
      points,
    }: {
      $t: Function;
      points: number;
    }): string {
      const message = this.pointsMessages[points] || "awesome";
      return `${$t(`points.${message}`)}! +${points}`;
    },
    cellClassName({ row, columnIndex }: { row: any; columnIndex: number }) {
      const word = row[columnIndex + 1];
      if (word && this.isPangram({ word })) {
        return "pangram";
      }
    },
  },
});
