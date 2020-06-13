module.exports = {
  transpileDependencies: ["vuetify"],

  pwa: {
    name: "ChickenFM",
    themeColor: "#003AFF"
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  }
};
