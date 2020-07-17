<template>
  <v-app
    :dark="settings.darkMode"
    :class="{ darkbackground: settings.darkMode }"
  >
    <v-sheet
      :dark="settings.darkMode"
      :class="{ darkbackground: settings.darkMode }"
    >
      <v-dialog
        v-model="errorDialog"
        max-width="500"
        min-width="400"
        persistent
      >
        <v-card>
          <v-card-title class="headline"
            >Couldn't connect to the server!</v-card-title
          >

          <v-card-text>
            We couldn't (re)connect to the server, or we were disconnected.
            We're currently trying to reconnect. If this dialog doesn't
            disappear in the next minute, try reloading the page. If that also
            doesn't work, try again later.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="reloadPage">
              Reload
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <transition name="background-fade" mode="in-out">
        <div
          class="background"
          v-if="!loading && settings.coverBackground && showBackground"
        >
          <div
            class="backgroundimage"
            v-bind:style="{ backgroundImage: `url(${cover})` }"
          ></div>
        </div>
      </transition>
      <!-- Premid extension data -->
      <span id="premidStationName">{{ stationName || "Loading..." }}</span>
      <span id="nowPlayingTitle">{{ nowplaying.title || "Loading..." }}</span>
      <span id="nowPlayingArtist">{{ nowplaying.artist || "Loading..." }}</span>
      <!-- /Premid extension data -->
      <v-app-bar app color="primary" dark clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <div class="d-flex align-center">
          <v-img
            alt="ChickenFM Logo"
            class="shrink mr-2 rounded-image"
            contain
            src="./assets/images/cover.png"
            transition="scale-transition"
            width="100"
          />
        </div>
        <v-spacer />
        <div class="text-center">
          <v-menu offset-y :dark="settings.darkMode">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on">{{
                $t(`languages.${$i18n.locale}`)
              }}</v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in $i18n.availableLocales"
                :key="index"
                @click="$i18n.locale = item"
              >
                <v-list-item-title>{{
                  $t(`languages.${item}`)
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
      <v-navigation-drawer
        :mobile-breakpoint="600"
        app
        :expand-on-hover="$vuetify.breakpoint.smAndUp"
        :mini-variant="$vuetify.breakpoint.smAndUp"
        clipped
        v-model="drawer"
      >
        <v-list nav dense shaped>
          <v-tooltip bottom v-if="showDJStatus">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item link class="px-0" v-bind="attrs" v-on="on">
                <v-list-item-avatar>
                  <v-icon>mdi-microphone</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ nowplaying.presenter }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>DJ</span>
          </v-tooltip>

          <v-tooltip bottom v-if="showPlayingStatus">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item link class="px-0" v-bind="attrs" v-on="on">
                <v-list-item-avatar>
                  <v-img v-if="$route.name == 'Home'" :src="nextCover" />
                  <v-img v-if="$route.name != 'Home'" :src="cover" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{
                      $route.name == "Home"
                        ? nowplaying.next.title
                        : nowplaying.title
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      $route.name == "Home"
                        ? nowplaying.next.artist
                        : nowplaying.artist
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>
              {{
                $route.name == "Home" ? $t("playing next") : $t("nowplaying")
              }}
            </span>
          </v-tooltip>

          <v-divider></v-divider>

          <!-- <v-list-item-group v-model="group" :active-class="listGroupClass"> -->
          <v-list-item tag="router-link" to="/" :active-class="listGroupClass">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t("nav.home") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            tag="router-link"
            to="/songrequest"
            :active-class="listGroupClass"
          >
            <v-list-item-icon>
              <v-icon>mdi-music-box-multiple</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{
                $t("nav.song requests")
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            tag="router-link"
            to="/lyrics"
            :active-class="listGroupClass"
          >
            <v-list-item-icon>
              <v-icon>mdi-music-note</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t("nav.lyrics") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item tag="router-link" to="/sendmessage">
            <v-list-item-icon>
              <v-icon>mdi-android-messages</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{
                $t("nav.send a message")
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group
            prepend-icon="mdi-link"
            link
            :value="false"
            no-action
            :active-class="listGroupClass"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ $t("nav.links") }}</v-list-item-title>
            </template>

            <v-list-group
              no-action
              sub-group
              :value="false"
              :active-class="listGroupClass"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Discord</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                link
                href="https://l.chickenfm.com/discord"
                target="_blank"
                :active-class="listGroupClass"
              >
                <v-list-item-title>Discord server</v-list-item-title>
              </v-list-item>
              <v-list-item
                link
                href="http://l.chickenfm.com/bot"
                target="_blank"
                :active-class="listGroupClass"
              >
                <v-list-item-title>Discord bot</v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-group
              no-action
              sub-group
              :value="false"
              :active-class="listGroupClass"
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{
                    $t("nav.where to listen")
                  }}</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                link
                href="https://l.chickenfm.com/onlineradiobox"
                target="_blank"
                :active-class="listGroupClass"
              >
                <v-list-item-title>OnlineRadioBox</v-list-item-title>
              </v-list-item>
              <v-list-item
                link
                href="https://www.radionomy.com/en/radio/chickenfm/index"
                target="_blank"
                :active-class="listGroupClass"
              >
                <v-list-item-title>Radionomy</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list-group>
          <v-list-item link @click="settingsDialog = true">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Settings</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- </v-list-item-group> -->
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <audio ref="audio" :title="loading ? '' : nowplaying.text"></audio>
        <transition name="fade" mode="out-in">
          <router-view
            :nowplaying="nowplaying"
            :station="station"
            :loading="loading"
            :cover="cover"
            :listen_url="listen_url"
            :reload="reload"
            :settings="settings"
            :playStream="playStream"
            :pauseStream="pauseStream"
            :toggleStream="toggleStream"
            :playing="playing"
          ></router-view>
        </transition>
      </v-main>

      <v-dialog
        v-model="settingsDialog"
        max-width="290"
        :dark="settings.darkMode"
      >
        <v-card>
          <v-card-title class="headline">Settings</v-card-title>

          <v-card-text>
            <v-switch
              v-for="(settingName, setting) in settingsNames"
              :key="setting"
              v-model="settings[setting]"
              :label="settingName"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="settingsDialog = false"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-footer color="light-blue lighten-4" light app>
        <span class="black--text text-center">
          Made with ❤️ by
          <a
            class="text-decoration-none"
            target="_blank"
            href="https://github.com/TheChicken14"
            >TheChicken</a
          >
          &copy; {{ new Date().getFullYear() }}
        </span>
      </v-footer>
    </v-sheet>
  </v-app>
</template>

<script>
import { get } from "axios";
import io from "socket.io-client";

export default {
  name: "App",
  data: () => ({
    playing: false,
    loading: true,
    errorDialog: false,
    errored: false,
    nowplaying: {},
    cover: "",
    nextCover: "",
    listen_url: "",
    drawer: false,
    group: null,
    togglingDrawer: false,
    station: localStorage.getItem("station")
      ? parseInt(localStorage.getItem("station"))
      : 1,
    stationName: "",
    settingsDialog: false,
    settings: {
      darkMode: false,
      coverBackground: false
    },
    settingsNames: {
      darkMode: "Dark mode",
      coverBackground: "Cover art background"
    },
    showBackground: true,
    io: {}
  }),
  watch: {
    station(v) {
      localStorage.setItem("station", v);
      this.reload();
      get(`https://radio.chickenfm.com/api/station/${v}`)
        .then(res => (this.stationName = res.data.name))
        .catch();
    },
    "$i18n.locale"(v) {
      localStorage.setItem("locale", v);
    },
    settings: {
      handler: function(v) {
        localStorage.setItem("settings", JSON.stringify(v));
      },
      deep: true
    },
    cover() {
      this.showBackground = false;
      setTimeout(() => (this.showBackground = true), 550);
    },
    errored(v) {
      this.errorDialog = v;
    }
  },
  computed: {
    showPlayingStatus() {
      if (this.$route.name == "Home" && this.nowplaying.presenter == "AutoDJ")
        return true;
      else if (this.$route.name != "Home") return true;
      else return false;
    },
    showDJStatus() {
      if (this.nowplaying.presenter != "AutoDJ") return true;
      else return false;
    },
    listGroupClass() {
      return this.settings.darkMode ? "" : "deep-purple--text text--accent-4";
    }
  },
  methods: {
    load() {
      this.io.emit("getData", this.station);
    },
    reload() {
      this.errored = false;
      this.loading = true;
      this.load();
    },
    setData(data) {
      if (this.nowplaying.text !== data.text) {
        this.cover = data.cover_xl;
        this.nextCover = data.next.cover_xl;
      }
      this.listen_url = data.listen_url;
      this.nowplaying = data;
      if ("mediaSession" in navigator) {
        /* eslint-disable-next-line */
            navigator.mediaSession.metadata = new MediaMetadata({
          title: data.title,
          artist: data.artist,
          album: data.station,
          artwork: [
            {
              src: data.cover_medium,
              sizes: "250x250",
              type: "image/jpg"
            },
            {
              src: data.cover_xl,
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
      this.errored = false;
    },
    playStream() {
      var audio = this.$refs.audio;
      audio.src = this.listen_url;
      audio.play().then(() => {
        this.playing = true;
      });
    },
    async pauseStream(stop) {
      var audio = this.$refs.audio;
      await audio.pause();
      if (stop) audio.src = "";
      this.playing = false;
    },
    toggleStream() {
      if (this.$refs.audio.paused) {
        this.playStream();
      } else {
        this.pauseStream(false);
      }
    },
    ioError(immediate = false) {
      if (immediate) {
        this.errored = true;
      } else {
        setTimeout(() => {
          if (!this.io.connected) {
            this.errored = true;
          }
        }, 2000);
      }
    },
    reloadPage() {
      window.location.reload(false);
    }
  },
  mounted() {
    this.io = io("https://api.chickenfm.com");
    this.io.on("connect", () => {
      this.loading = false;
      this.errored = false;
    });
    this.io.on("disconnect", () => this.ioError());
    this.io.on("error", () => this.ioError(true));
    this.io.on("connect_error", () => this.ioError(true));
    this.io.on("stations", stations => {
      for (let i in stations) {
        this.io.on(`station_${stations[i].id}`, data => {
          if (data.station_id == this.station) {
            this.setData(data);
          }
        });
      }
    });
    if (navigator.language) {
      const userLang = navigator.language.split("-")[0];
      if (this.$i18n.availableLocales.includes(userLang)) {
        this.$i18n.locale = userLang;
      }
    }
    this.drawer = this.$vuetify.breakpoint.smAndUp;
    if (!localStorage.getItem("station")) {
      localStorage.setItem("station", 1);
    }
    if (localStorage.getItem("locale")) {
      this.$i18n.locale = localStorage.getItem("locale");
    }
    if (!localStorage.getItem("settings")) {
      localStorage.setItem("settings", JSON.stringify(this.settings));
    } else {
      try {
        this.settings = JSON.parse(localStorage.getItem("settings"));
      } catch (e) {
        localStorage.setItem("settings", JSON.stringify(this.settings));
      }
    }
    get(`https://radio.chickenfm.com/api/station/${this.station}`)
      .then(res => (this.stationName = res.data.name))
      .catch();
    this.load();
    //setInterval(this.load, 5000);
  }
};
</script>
<style scoped>
.rounded-image {
  border-radius: 10px;
}
.footer {
  text-align: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(1%);
}
.darkbackground {
  background-color: black;
  height: 100%;
}
.background-fade-enter-active,
.background-fade-leave-active {
  transition: all 0.5s ease;
}
.background-fade-enter {
  transform: scale(90%);
  opacity: 0;
}
.background-fade-enter-to {
  transform: scale(100%);
  opacity: 1;
}

.background-fade-leave-to {
  transform: scale(90%);
  opacity: 0;
}

.background {
  position: fixed;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.backgroundimage {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: blur(7.5px);
  -webkit-filter: blur(7.5px);
}
</style>
