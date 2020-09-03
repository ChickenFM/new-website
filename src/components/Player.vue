<template>
  <v-skeleton-loader
    :loading="loading"
    type="card-avatar, article, actions"
    class="mx-auto"
    max-width="374"
  >
    <v-card class="mx-auto" max-width="374">
      <v-img max-height="350" :src="cover"></v-img>

      <v-card-title>
        {{ nowplaying.title }}
        <v-chip v-if="nowplaying.requested" pill small class="chip">{{
          $t("requested")
        }}</v-chip>
      </v-card-title>
      <v-card-subtitle>{{ nowplaying.artist }}</v-card-subtitle>

      <v-container>
        <v-progress-linear
          rounded
          v-model="songProgress"
          color="deep-purple accent-4"
        />
      </v-container>
      <v-flex class="d-flex">
        <v-card-subtitle>{{ elapsedTime }}</v-card-subtitle>
        <v-spacer></v-spacer>
        <v-card-subtitle>{{ totalTime }}</v-card-subtitle>
      </v-flex>

      <v-card-actions>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="blue"
              class="ma-2 white--text"
              fab
              @click="toggleStream"
            >
              <v-icon dark>
                {{ playing ? "mdi-pause" : "mdi-play" }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ playing ? $t("pause") : $t("play") }}</span>
        </v-tooltip>
        <v-slider
          v-model="volume"
          min="0"
          max="100"
          :hint="$t('volume')"
          persistent-hint
        />
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="blue"
              class="ma-2 white--text"
              fab
              @click="openStationModal"
            >
              <v-icon dark>mdi-radio</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("Select station") }}</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-skeleton-loader>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    nowplaying: Object,
    cover: String,
    listen_url: String,
    playStream: Function,
    pauseStream: Function,
    toggleStream: Function,
    playing: Boolean,
    openStationModal: Function
  },
  data: () => ({
    songProgress: 0,
    totalTime: "",
    elapsedTime: "",
    volume: 50
  }),
  methods: {
    getAudioElement() {
      return this.$parent.$parent.$parent.$parent.$parent.$parent.$refs.audio;
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
  created() {
    this.volume = this.getAudioElement().volume * 100;
    setInterval(this.calculateSongProgress, 500);
  },
  watch: {
    volume: function(v) {
      this.getAudioElement().volume = v / 100;
    },
    "$parent.$parent.$parent.$parent.$parent.$parent.station": function() {
      var audio = this.getAudioElement();
      if (!audio.paused) {
        this.pauseStream(true);
        setTimeout(() => {
          this.playStream();
        }, 1000);
      }
    }
  }
};
</script>
