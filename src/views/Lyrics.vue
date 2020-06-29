<template>
  <v-app id="inspire">
    <v-content>
      <v-row align="center" justify="center">
        <v-card :loading="loading" class="mx-auto my-12" max-width="900">
          <v-card-title>{{ nowplaying.title }}</v-card-title>
          <v-card-subtitle>{{ nowplaying.artist }}</v-card-subtitle>
          <v-card-text v-if="!loading">
            <span
              v-for="(text, index) in lyrics.lyrics.split('\n')"
              :key="index"
            >
              {{ text }}
              <br />
            </span>
          </v-card-text>
        </v-card>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import { get } from "axios";

export default {
  data() {
    return {
      loading: true,
      errored: false,
      lyrics: {},
    };
  },
  props: {
    station: Number || String,
    nowplaying: Object
  },
  methods: {
    load() {
      get(
        `https://api.chickenfm.com/lyrics/${this.station}`
      )
        .then(res => (this.lyrics = res.data))
        .finally(() => this.loading = false);
    }
  },
  mounted() {
    this.load();
  }
};
</script>
