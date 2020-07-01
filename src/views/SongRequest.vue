<template>
  <v-card>
    <v-snackbar v-model="snackbar.active" multi-line :color="snackbar.error ? 'red' : 'green'">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.active = false">Close</v-btn>
    </v-snackbar>
    <v-card-title>
      Songs
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        :label="$t('search')"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :loading="loading"
      :loading-text="$t('loadingtext')"
      :headers="headers"
      :items="songs"
      :search="search"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn icon color="primary" @click="request(item)">
          <v-icon>mdi-send</v-icon>
        </v-btn>
        <v-btn icon color="secondary" @click="openSongInfoDialog(item)">
          <v-icon>mdi-information</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog max-width="374" v-model="songInfoDialog">
      <v-card class="mx-auto" max-width="374" v-if="songInfoDialog">
        <v-img :src="songData.song.art" max-height="350" />
        <v-container fluid class="no-top-padding">
          <v-card-title>{{ songData.song.title }}</v-card-title>
          <v-card-subtitle>{{ $t("ArtistAlbumMessage", songData.song) }}</v-card-subtitle>

          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item v-if="songData.song.custom_fields.eurovision_country">
                <v-list-item-content>
                  <v-list-item-title>{{ $t("country") }}</v-list-item-title>
                  <v-list-item-subtitle>{{ songData.song.custom_fields.eurovision_country}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line v-if="songData.song.custom_fields.eurovision_result">
                <v-list-item-content>
                  <v-list-item-title>{{ $t("eurovision result") }}</v-list-item-title>
                  <v-list-item-subtitle>{{ songData.song.custom_fields.eurovision_result }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line v-if="songData.song.custom_fields.eurovision_result">
                <v-list-item-content>
                  <v-list-item-title>{{ $t("eurovision year") }}</v-list-item-title>
                  <v-list-item-subtitle>{{ songData.song.custom_fields.eurovision_year }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="request(songData)">
              {{
              $t("request")
              }}
            </v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { get } from "axios";

export default {
  data() {
    return {
      songs: [],
      loading: true,
      errored: false,
      search: "",
      snackbar: {
        active: false,
        error: false,
        message: ""
      },
      songInfoDialog: false,
      songData: {}
    };
  },
  props: {
    station: Number || String
  },
  computed: {
    headers() {
      if (this.station == 8) {
        return [
          { text: this.$t("name"), value: "song.title" },
          { text: this.$t("artist"), value: "song.artist" },
          {
            text: this.$t("country"),
            value: "song.custom_fields.eurovision_country"
          },
          {
            text: this.$t("eurovision year"),
            value: "song.custom_fields.eurovision_year"
          },
          { text: this.$t("actions"), value: "actions", sortable: false }
        ];
      } else
        return [
          { text: this.$t("name"), value: "song.title" },
          { text: this.$t("artist"), value: "song.artist" },
          { text: this.$t("actions"), value: "actions", sortable: false }
        ];
    }
  },
  methods: {
    load() {
      get(`https://radio.chickenfm.com/api/station/${this.station}/requests`)
        .then(res => (this.songs = res.data))
        .catch(() => (this.errored = true))
        .finally(() => (this.loading = false));
    },
    request(song) {
      get(
        `https://radio.chickenfm.com/api/station/${this.station}/request/${song.request_id}`
      )
        .then(res => {
          this.snackbar.active = false;
          this.snackbar.error = false;
          this.snackbar.message = res.data.formatted_message;
          this.snackbar.active = true;
        })
        .catch(err => {
          this.snackbar.active = false;
          this.snackbar.error = true;
          this.snackbar.message = err.response.data.formatted_message;
          this.snackbar.active = true;
        });
    },
    openSongInfoDialog(song) {
      this.songData = song;
      this.songInfoDialog = true;
    }
  },
  mounted() {
    this.load();
  }
};
</script>
<style scoped></style>
