<template>
  <v-card :loading="loading">
    <v-card-title class="headline">Song history</v-card-title>
    <v-list-item v-for="song in songHistory" :key="song.text">
      <v-list-item-avatar>
        <v-img :src="song.cover_medium"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ song.title }}</v-list-item-title>
        <v-list-item-subtitle
          >{{ song.artist }} -
          {{ formatTime(song.played_at) }}</v-list-item-subtitle
        >
      </v-list-item-content>

      <v-list-item-action>
        <v-tooltip top :open-on-click="true">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon color="grey lighten-1">mdi-clock</v-icon>
            </v-btn>
          </template>
          <span>{{ getTimeFromNow(song.played_at) }}</span>
        </v-tooltip>
      </v-list-item-action>
    </v-list-item>
    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn text @click="closeSongHistoryDialog">
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { get } from "axios";
import moment from "moment";

export default {
  props: {
    closeSongHistoryDialog: Function,
    nowplaying: Object
  },
  data: () => ({
    songHistory: [],
    loading: true,
    errored: false
  }),
  methods: {
    loadQueue() {
      get(`https://api.chickenfm.com/queue/${this.nowplaying.station_id}`)
        .then(r => (this.songHistory = r.data))
        .catch(() => (this.errored = true))
        .finally(() => (this.loading = false));
    },
    formatTime(time) {
      return moment(time * 1000).format("LT");
    },
    getTimeFromNow(time) {
      return moment(time * 1000).fromNow();
    }
  },
  mounted() {
    this.loadQueue();
  }
};
</script>
