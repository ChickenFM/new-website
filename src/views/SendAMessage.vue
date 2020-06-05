<template>
  <v-content>
    <v-snackbar v-model="snackbar.active" multi-line :color="snackbar.error ? 'red' : 'green'">
      {{ snackbar.message }}
      <v-btn text @click="snackbar.active = false">Close</v-btn>
    </v-snackbar>

    <v-row align="center" justify="center">
      <v-col cols="12" md="5" sm="5" xs="3">
        <v-card class="mx-auto" max-width="800">
          <v-card-title>Send a message</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <input name="bot-field" hidden v-model="form.botField" />

              <v-text-field v-model="form.name" :rules="nameRules" label="Name" required></v-text-field>

              <v-text-field v-model="form.email" :rules="emailRules" label="E-mail" required></v-text-field>

              <v-textarea
                name="message"
                filled
                label="Message"
                auto-grow
                required
                :rules="messageRules"
                v-model="form.message"
              ></v-textarea>

              <v-btn color="primary" :disabled="!valid" class="mr-4" @click="submit">Submit</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>
<script>
import axios from "axios";

export default {
  data: () => ({
    valid: true,
    nameRules: [
      v => !!v || "Name is required",
      v => v.replace(/\s/g, "").length > 1 || "Name is required"
    ],
    emailRules: [
      v => !!v || "E-mail is required",
      v => !!/.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    messageRules: [
      v => v.replace(/\s/g, "").length > 1 || "Message is required"
    ],
    form: {
      botField: "",
      name: "",
      email: "",
      message: ""
    },
    snackbar: {
        active: false,
        error: false,
        message: ""
    },
  }),

  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join("&");
    },
    submit() {
      // Validate form
      this.$refs.form.validate();

      if (this.valid) {
        const axiosConfig = {
          header: { "Content-Type": "application/x-www-form-urlencoded" }
        };
        
        axios.post(
          "/",
          this.encode({
            "form-name": "send a message",
            ...this.form
          }),
          axiosConfig
        )
        .then(() => {
          this.snackbar.message = "Message successfully sent!"
          this.snackbar.error = false
          this.snackbar.active = true
          this.$refs.form.reset()
        })
        .catch(() => {
          this.snackbar.message = "An error occurred while sending your message!"
          this.snackbar.error = true
          this.snackbar.active = true
          this.$refs.form.reset()
        })
      }
    }
  }
};
</script>