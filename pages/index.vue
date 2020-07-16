<template>
  <div class="h-screen">
    <div class="container mx-auto h-full flex justify-center items-center">
      <div class="w-1/3">
        <h1 class="font-hairline mb-6 text-center">Login to our Website</h1>
        <div class="border-teal p-8 border-t-12 bg-white mb-6 rounded-lg shadow-lg">
          <div class="mb-4">
            <label class="font-bold text-grey-darker block mb-2">Username</label>
            <input
              type="text"
              class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              v-model="formUsername"
              placeholder="Your Username"
            />
          </div>

          <div class="mb-4">
            <label class="font-bold text-grey-darker block mb-2">Password</label>
            <input
              type="password"
              class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              id="password"
              v-model="formPassword"
              placeholder="Your Password"
            />
          </div>

          <div class="flex items-center justify-between">
            <button
              class="bg-teal-400 hover:bg-teal text-white font-bold py-2 px-4 rounded"
              v-on:click="login"
            >Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modal from "../components/modal";
import axios from "axios";
const BASE_URL = "https://localhost:44313/";

export default {
  data() {
    return {
      formUsername: "",
      formPassword: ""
    };
  },
  methods: {
    login: function(section) {
      const data = {
        user_name: this.formUsername,
        user_pass: this.formPassword
      };
      if (data.user_name == "" || data.user_pass == "") {
        this.$swal.fire({
          text: "ユーザー名またはパスワードを入力してください。",
          type: "warning"
        });
        return;
      }

      axios
        .post(BASE_URL + "api/Authentication/IsAuthentication", data)
        .then(response => {
          if (!response.data.result.length == 0) {
            this.$store.commit("auth/login", response.data.result[0]);
            this.$router.push("/menu");
          } else {
            this.$swal.fire({
              title: "認証エラー",
              text: "ユーザー名またはパスワードが間違っています。",
              type: "error"
            });
          }
        });
    }
  }
};
</script>

<style>
</style>
