<template>
  <v-card>
    <v-snackbar
      v-model="snackbar.active"
      multi-line
      :color="snackbar.error ? 'red' : 'green'"
    >
      {{ snackbar.message }}
      <v-btn
        text
        @click="snackbar.active = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-card-title>
      Songs
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :loading="loading"
      loading-text="Loading... Please wait"
      :headers="headers"
      :items="songs"
      :search="search"
    >
    <template v-slot:item.actions="{ item }">
        <v-btn color="primary" @click="request(item)">
            Request
        </v-btn>
    </template>
    </v-data-table>
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
            headers: [
                { text: "Name", value: "song.title" },
                { text: "Artist", value: "song.artist" },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            snackbar: {
                active: false,
                error: false,
                message: ""
            }
        }
    },
    methods: {
        load() {
            get(`https://radio.chickenfm.com/api/station/${this.$parent.$parent.$parent.station}/requests`)
                .then(res => this.songs = res.data)
                .catch(() => this.errored = true)
                .finally(() => this.loading = false)
        },
        request(song) {
            get(`https://radio.chickenfm.com/api/station/${this.$parent.$parent.$parent.station}/request/${song.request_id}`)
                .then(res => {
                    this.snackbar.active = false
                    this.snackbar.error = false
                    this.snackbar.message = res.data.formatted_message
                    this.snackbar.active = true
                })
                .catch(err => {
                    this.snackbar.active = false
                    this.snackbar.error = true
                    this.snackbar.message = err.response.data.formatted_message
                    this.snackbar.active = true
                })
        }
    },
    mounted() {
        this.load()
    }
}
</script>
<style scoped>
</style>