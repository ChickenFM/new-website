<template>
  <v-app id="inspire">
    <v-content>
      <v-row align="center" justify="center">
        <v-card :loading="loading != 2" class="mx-auto my-12" max-width="900">
          <v-card-title>{{ song.title }}</v-card-title>
          <v-card-subtitle>{{ song.artist }}</v-card-subtitle>
          <v-card-text>
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
      loading: 0,
      errored: false,
      lyrics: {},
      song: {}
    };
  },
  methods: {
    load() {
      get(
        `https://api.chickenfm.com/nowplaying/${this.$parent.$parent.$parent.station}`
      )
        .then(res => (this.song = res.data))
        .finally(() => this.loading++);
      get(
        `https://api.chickenfm.com/lyrics/${this.$parent.$parent.$parent.station}`
      )
        .then(res => (this.lyrics = res.data))
        .finally(() => this.loading++);
    }
  },
  mounted() {
    this.load();
  }
};
</script>
