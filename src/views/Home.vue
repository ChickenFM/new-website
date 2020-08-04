<template class="no-top-padding">
  <div>
    <v-main>
      <v-container fluid class="no-top-padding">
        <v-row align="center" justify="center" class="no-top-padding">
          <v-col cols="12" sm="9" md="5" class="no-top-padding">
            <Player
              :loading="loading"
              :nowplaying="nowplaying"
              :cover="cover"
              :playStream="playStream"
              :pauseStream="pauseStream"
              :toggleStream="toggleStream"
              :playing="playing"
              :listen_url="listen_url"
              :openStationModal="openStationModal"
            />
          </v-col>
          <v-dialog
            v-model="dialog.open"
            scrollable
            max-width="300px"
            :dark="settings.darkMode"
          >
            <v-card :loading="dialog.loading">
              <v-card-title>{{ $t("Select station") }}</v-card-title>
              <v-divider></v-divider>
              <v-card-text style="height: 300px;">
                <v-radio-group
                  v-model="$parent.$parent.$parent.$parent.station"
                  column
                >
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
    </v-main>
  </div>
</template>

<script>
import { get } from "axios";
import Player from "../components/Player";

export default {
  name: "Home",
  data() {
    return {
      volume: 50,
      dialog: {
        open: false,
        loading: true,
        stations: []
      }
    };
  },
  components: {
    Player
  },
  props: {
    nowplaying: Object,
    cover: String,
    loading: Boolean,
    errored: Boolean,
    listen_url: String,
    reload: Function,
    settings: Object,
    playStream: Function,
    pauseStream: Function,
    toggleStream: Function,
    playing: Boolean
  },
  methods: {
    openStationModal() {
      this.dialog.open = true;
      this.dialog.loading = true;
      get("https://radio.chickenfm.com/api/stations")
        .then(res => (this.dialog.stations = res.data))
        .finally(() => (this.dialog.loading = false));
    }
  },
  mounted() {}
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
