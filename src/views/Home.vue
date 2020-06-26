<template class="no-top-padding">
  <v-app id="inspire">
    <v-content>
      <Error :show="errored" :reload="reload" />
      <v-container fluid class="no-top-padding">
        <v-row align="center" justify="center" class="no-top-padding">
          <v-col cols="12" sm="9" md="5" class="no-top-padding">
            <v-card :loading="loading" class="mx-auto" max-width="374">
              <v-img max-height="350" :src="cover"></v-img>

              <v-card-title>
                {{ nowplaying.title }}
                <v-chip v-if="nowplaying.requested" pill small class="chip">
                  {{$t('requested')}}
                </v-chip>
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
                <v-btn
                  color="blue"
                  class="ma-2 white--text"
                  fab
                  @click="toggleStream"
                >
                  <v-icon dark>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
                </v-btn>
                <v-slider
                  v-model="volume"
                  thumb-label
                  min="0"
                  max="100"
                  :hint="$t('volume')"
                  persistent-hint
                />
                <v-btn
                  color="blue"
                  class="ma-2 white--text"
                  fab
                  @click="openStationModal"
                >
                  <v-icon dark>mdi-radio</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-dialog v-model="dialog.open" scrollable max-width="300px">
            <v-card :loading="dialog.loading">
              <v-card-title>{{$t('Select station')}}</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 300px;">
                <v-radio-group v-model="$parent.$parent.$parent.station" column>
                  <v-radio
                    v-for="station in dialog.stations"
                    :key="station.id"
                    :label="station.name"
                    :value="station.id"
                  ></v-radio>
                </v-radio-group>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="blue darken-1" text @click="dialog.open = false"
                  >Close</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { get } from "axios";
import Error from "@/components/Error";

export default {
  name: "Home",
  data() {
    return {
      nowplaying: {},
      cover: "",
      loading: true,
      errored: false,
      playing: false,
      listen_url: "",
      songProgress: 0,
      totalTime: "",
      elapsedTime: "",
      volume: 50,
      dialog: {
        open: false,
        loading: true,
        stations: []
      }
    };
  },
  components: {
    Error
  },
  watch: {
    volume: function(v) {
      this.$parent.$parent.$parent.$refs.audio.volume = v / 100;
    },
    "$parent.$parent.$parent.station": function(v) {
      var audio = this.$parent.$parent.$parent.$refs.audio;
      this.reload();
      if (!audio.paused) {
        this.pauseStream(true);
        setTimeout(() => {
          const station = this.dialog.stations.find(a => a.id == v);
          this.listen_url = station.listen_url;
          this.playStream();
        }, 1000);
      }
    }
  },
  methods: {
    load() {
      get(
        `https://api.chickenfm.com/nowplaying/${this.$parent.$parent.$parent.station}`
      )
        .then(res => {
          this.errored = false
          this.listen_url = res.data.listen_url;
          if (this.nowplaying.text !== res.data.text) {
            this.cover = res.data.cover_xl;
          }
          this.nowplaying = res.data;
          if ("mediaSession" in navigator) {
            /* eslint-disable-next-line */
            navigator.mediaSession.metadata = new MediaMetadata({
              title: res.data.title,
              artist: res.data.artist,
              album: res.data.station,
              artwork: [
                {
                  src: res.data.cover_medium,
                  sizes: "250x250",
                  type: "image/jpg"
                },
                {
                  src: res.data.cover_xl,
                  sizes: "1000x1000",
                  type: "image/jpg"
                }
              ]
            });
            navigator.mediaSession.setActionHandler("play", () => {
              this.playStream();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
              this.pauseStream(false);
            });
            navigator.mediaSession.setActionHandler("stop", () => {
              this.pauseStream(true);
            });
          }
        })
        .catch(() => (this.errored = true))
        .finally(() => (this.loading = false));
    },
    reload() {
      this.errored = false;
      this.loading = true;
      this.load();
    },
    playStream() {
      var audio = this.$parent.$parent.$parent.$refs.audio;
      audio.src = this.listen_url;
      audio.play().then(() => {
        this.playing = true;
      });
    },
    async pauseStream(stop) {
      var audio = this.$parent.$parent.$parent.$refs.audio;
      await audio.pause();
      if (stop) audio.src = "";
      this.playing = false;
    },
    toggleStream() {
      if (this.$parent.$parent.$parent.$refs.audio.paused) {
        this.playStream();
      } else {
        this.pauseStream(false);
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
    },
    openStationModal() {
      this.dialog.open = true;
      this.dialog.loading = true;
      get("https://radio.chickenfm.com/api/stations")
        .then(res => (this.dialog.stations = res.data))
        .finally(() => (this.dialog.loading = false));
    }
  },
  mounted() {
    var audio = this.$parent.$parent.$parent.$refs.audio;
    if (!audio.paused) {
      this.playing = true;
    }
    this.volume = audio.volume * 100;
    this.load();
    setInterval(this.load, 5000);
    setInterval(this.calculateSongProgress, 500);
  }
};
</script>
<style scoped>
.no-top-padding {
  padding-top: 0px;
  margin-top: 0px;
}
.chip {
  margin-left: 0.5em;
}
</style>
