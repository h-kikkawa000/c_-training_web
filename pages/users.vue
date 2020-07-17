<template>
  <div class="h-screen h-full">
    <nav class="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <svg
          class="fill-current h-8 w-8 mr-2"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
          />
        </svg>
        <span class="font-semibold text-xl tracking-tight">研修用</span>
      </div>

      <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow"></div>
        <div
          class="inline-block font-semibold text-xl px-4 py-2 text-white border-white mt-4 lg:mt-0"
        >{{ $store.state.auth.user_name }}</div>
        <div
          class="inline-block font-semibold text-xl px-4 py-2 text-white border-white mt-4 lg:mt-0"
        >{{ $store.state.auth.staff_desc }}</div>
        <div
          class="inline-block font-semibold text-xl px-4 py-2 text-white border-white mt-4 lg:mt-0"
        >{{ $store.state.auth.store_code }}</div>
        <div>
          <button
            class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            v-on:click="logout"
          >logout</button>
        </div>
      </div>
    </nav>
    <div class="px-6 py-8">
      <div class="w-2/3 mx-auto">
        <div class="static bg-white shadow-2xl rounded my-6">
          <table class="text-left w-full border-collapse">
            <!--Border collapse doesn't work on this site yet but it's available in newer tailwind versions -->
            <thead>
              <tr>
                <th
                  class="py-2 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light"
                >＃</th>
                <th
                  class="py-2 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light"
                >ユーザー名</th>
                <th
                  class="py-2 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light"
                >パスワード</th>
                <th
                  class="py-2 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light"
                >店舗スタッフ区分</th>
                <th
                  class="py-2 px-6 bg-grey-lightest font-bold uppercase text-sm text-grey-dark border-b border-grey-light"
                >所属店舗</th>
                <th
                  class="py-4 px-6 bg-grey-lightest font-bold uppercase text-sm border-b border-grey-light"
                >action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="hover:bg-grey-lighter hover:bg-blue-100"
                v-for="user in users"
                v-bind:key="user.id"
              >
                <td class="py-1 px-6 border-b border-grey-light">{{ user.id }}</td>
                <td class="py-1 px-6 border-b border-grey-light">{{ user.user_id }}</td>
                <td class="py-1 px-6 border-b border-grey-light">{{ user.user_pass }}</td>
                <td class="py-1 px-6 border-b border-grey-light">{{ user.staff_desc }}</td>
                <td class="py-1 px-6 border-b border-grey-light">{{ user.store_code }}</td>
                <td
                  class="py-1 px-6 border-b border-grey-light container mx-auto flex justify-between"
                >
                  <svg
                    class="fill-current text-pink-500 inline-block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    @click="alertDisplay(user)"
                  >
                    <path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z" />
                  </svg>
                  <modal :val="postItem" v-if="showModal" @close="closeModal"></modal>
                  <svg
                    class="fill-current text-pink-500 inline-block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    @click="userdelete(user.id, user.user_id)"
                  >
                    <path
                      d="M0 2C0 .9.9 0 2 0h16a2 2 0 0 1 2 2v2H0V2zm1 3h18v13a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5zm6 2v2h6V7H7z"
                    />
                  </svg>

                  <div class="absolute bottom-0 right-0 py-8 px-8">
                    <svg
                      class="fill-current text-pink-400 inline-block h-16 w-16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      @click="registUser()"
                    >
                      <path
                        d="M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"
                      />
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modal from "~/components/modal.vue";
import axios from "axios";
const BASE_URL = "https://localhost:44313/";

export default {
  components: {
    modal
  },
  data() {
    return {
      users: [],
      showModal: false,
      postItem: "",
      items: [
        { id: 1, name: "aのitem" },
        { id: 2, name: "bのitem" }
      ]
    };
  },
  mounted() {
    axios.get(BASE_URL + "api/Users/GetAll").then(response => {
      if (!response.data.result.length == 0) {
        this.users = response.data.result;
        console.log("users", response.data.result);
      }
    });
  },
  methods: {
    openModal(item) {
      this.postItem = item;
      console.log("item", item);
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },

    logout() {
      this.$store.commit("logout");
      this.$router.push("/");
    },
    userdelete(_id, _user_name) {
      this.$swal({
        title: "削除確認",
        type: "warning",
        text: _user_name + "を本当に削除しますか。",
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: true,
        focusCancel: true
      }).then(result => {
        if (result.value) {
          const data = {
            id: _id
          };
          axios.post(BASE_URL + "api/Users/Delete", data).then(response => {
            if (!response.data == 0) {
              this.$swal
                .fire({
                  type: "success",
                  text: _user_name + "を削除しました。"
                })
                .then(result => {
                  if (result.value) {
                    location.reload();
                  }
                });
            }
          });
        }
      });
    },
    async alertDisplay(_values) {
      let fromTitle = "ユーザー更新フォーム";
      this.createdCustomer = _values;
      const { value: formValues } = await this.$swal.fire({
        title: fromTitle,
        showLoaderOnConfirm: true,
        html:
          "<input v-model=createdCustomer.id value=" +
          this.createdCustomer.user_id +
          ' id="swal-input1" class="swal2-input" placeholder="ユーザー名">' +
          '<input id="swal-input2" value=' +
          this.createdCustomer.user_pass +
          ' class="swal2-input" placeholder="パスワード">' +
          '<select id="swal-input3" class="swal2-input" value="0"><option value="0">店舗</option> <option value="1">商品部</option> </select>' +
          '<input id="swal-input4" value=' +
          this.createdCustomer.store_code +
          ' class="swal2-input" placeholder="所属店舗">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            _values.id,
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
            document.getElementById("swal-input3").value,
            document.getElementById("swal-input4").value
          ];
        }
      });
      if (formValues) {
        this.createdCustomer = formValues;
        const data = {
          id: this.createdCustomer[0],
          user_id: this.createdCustomer[1],
          user_pass: this.createdCustomer[2],
          staff_kbn: this.createdCustomer[3],
          store_code: this.createdCustomer[4]
        };
        axios.post(BASE_URL + "api/Users/Update", data).then(response => {
          if (!response.data == 0) {
            this.$swal
              .fire({
                type: "success",
                text: this.createdCustomer[1] + "を更新しました。"
              })
              .then(result => {
                if (result.value) {
                  location.reload();
                }
              });
          }
        });
      }
    },
    async registUser() {
      let fromTitle = "ユーザー登録フォーム";
      const { value: formValues } = await this.$swal.fire({
        title: fromTitle,
        showLoaderOnConfirm: true,
        html:
          '<input id="swal-input1" class="swal2-input" placeholder="ユーザー名">' +
          '<input id="swal-input2" class="swal2-input" placeholder="パスワード">' +
          '<select id="swal-input3" class="swal2-input" value="0"><option value="0">店舗</option> <option value="1">商品部</option> </select>' +
          '<input id="swal-input4"  class="swal2-input" placeholder="所属店舗">',
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value,
            document.getElementById("swal-input3").value,
            document.getElementById("swal-input4").value
          ];
        }
      });
      if (formValues) {
        this.createdCustomer = formValues;
        const data = {
          id: 0,
          user_id: this.createdCustomer[0],
          user_pass: this.createdCustomer[1],
          staff_kbn: this.createdCustomer[2],
          store_code: this.createdCustomer[3]
        };
        axios.post(BASE_URL + "api/Users/Register", data).then(response => {
          if (!response.data == 0) {
            this.$swal
              .fire({
                type: "success",
                text: this.createdCustomer[0] + "を登録しました。"
              })
              .then(result => {
                if (result.value) {
                  location.reload();
                }
              });
          }
        });
      }
    }
  }
};
</script>

<style></style>
