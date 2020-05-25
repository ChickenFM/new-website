<template>
  <v-app id="inspire">
    <audio ref="audio"></audio>
    <!-- <Loading :loading="loading" /> -->
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="9" md="5">
            <v-card :loading="loading" class="mx-auto my-12" max-width="374">
              <v-img max-height="374" :src="nowplaying.cover_xl"></v-img>

              <v-card-title>{{ nowplaying.title }}</v-card-title>
              <v-card-subtitle>{{ nowplaying.artist }}</v-card-subtitle>

              <v-divider class="mx-4"></v-divider>
              <v-flex class="d-flex">
                <v-card-subtitle>{{ elapsedTime }}</v-card-subtitle>
                <v-spacer></v-spacer>
                <v-card-subtitle>{{ totalTime }}</v-card-subtitle>
              </v-flex>
              
              <v-container>
                <v-progress-linear v-model="songProgress" color="deep-purple accent-4" />
              </v-container>

              <v-card-actions>
                <v-btn color="blue" class="ma-2 white--text" fab @click="toggleStream">
                  <v-icon dark>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { get } from "axios";
export default {
  name: "Home",
  data() {
    return {
      nowplaying: {},
      id: 1,
      loading: true,
      errored: false,
      stream: "https://radio.chickenfm.com/radio/8000/radio.mp3",
      playing: false,
      songProgress: 0,
      totalTime: "",
      elapsedTime: ""
    };
  },
  methods: {
    load() {
      get(`https://api.chickenfm.com/nowplaying/${this.id}`)
        .then(res => (this.nowplaying = res.data))
        .catch(() => (this.errored = true))
        .finally(() => (this.loading = false));
    },
    playStream() {
      this.$refs.audio.src = this.stream + `?${Date.now()}`;
      this.streamLoading = true;
      this.$refs.audio.play().then(() => {
        this.playing = true;
      });
    },
    async pauseStream(stop) {
      await this.$refs.audio.pause();
      if (stop) this.$refs.audio.src = "";
      this.playing = false;
    },
    toggleStream() {
      if (this.playing) {
        this.pauseStream(false);
      } else {
        this.playStream();
      }
    },
    calculateSongProgress() {
      const duration = this.nowplaying.duration;
      const startUnix = this.nowplaying.played_at;
      const endUnix = startUnix + duration;

      const now = new Date();
      const start = new Date(startUnix * 1000);
      const end = new Date(endUnix * 1000);
      const percentage = ((now - start) / (end - start)) * 100;
      this.songProgress = percentage;

      const nowUnix = Math.round(now.getTime() / 1000);
      var currentSeconds = nowUnix - startUnix;

      if (currentSeconds < 0) currentSeconds = 0;

      if (percentage < 100) {
        this.elapsedTime = this.getTime(currentSeconds * 1000);
        this.totalTime = this.getTime(duration * 1000);
      }
    },
    getTime(millisec) {
      // Credit: https://stackoverflow.com/questions/19700283/how-to-convert-time-milliseconds-to-hours-min-sec-format-in-javascript
      var seconds = (millisec / 1000).toFixed(0);
      var minutes = Math.floor(seconds / 60);
      var hours = "";
      if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = hours >= 10 ? hours : "0" + hours;
        minutes = minutes - hours * 60;
        minutes = minutes >= 10 ? minutes : "0" + minutes;
      }
      seconds = Math.floor(seconds % 60);
      seconds = seconds >= 10 ? seconds : "0" + seconds;
      if (hours != "") {
        return hours + ":" + minutes + ":" + seconds;
      }
      return minutes + ":" + seconds;
    }
  },
  mounted() {
    this.load();
    setInterval(this.load, 5000);
    setInterval(this.calculateSongProgress, 500);
  }
};
</script>
