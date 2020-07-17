<template>
  <div class="h-screen">
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
            d="M13.5 22.1c1.8-7.
            2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"
          />
        </svg>
        <span class="font-semibold text-xl tracking-tight">研修用ページ</span>
      </div>

      <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div class="text-sm lg:flex-grow"></div>
        <div
          class="inline-block font-semibold text-xl px-4 py-2 text-white border-white mt-4 lg:mt-0"
        >
          {{ $store.state.auth.user_name }}
        </div>
        <div
          class="inline-block font-semibold text-xl px-4 py-2 text-white border-white mt-4 lg:mt-0"
        >
          {{ $store.state.auth.staff_desc }}
        </div>
        <div
          class="inline-block font-semibold text-xl px-4 py-2 text-white border-white mt-4 lg:mt-0"
        >
          {{ $store.state.auth.store_code }}
        </div>
        <div>
          <button
            class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0"
            v-on:click="logout"
          >
            logout
          </button>
        </div>
      </div>
    </nav>
    <div class="w-full max-w-screen-xl mx-auto p-6">
      <div class="border-b border-grey-light p-4 bg-grey-lighter py-8">
        <div
          class="bg-white mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden"
        >
          <div class="sm:flex sm:items-center px-2 py-4">
            <div class="flex-grow">
              <h3 class="font-normal px-2 py-3 leading-tight">
                メニューリスト
              </h3>
              <div class="w-full">
                <div class="flex cursor-pointer my-1 hover:bg-blue-100 rounded">
                  <div class="w-8 h-10 text-center py-1">
                    <p class="text-3xl p-0 text-grey-dark">&bull;</p>
                  </div>
                  <div class="w-4/5 h-10 py-3 px-1" @click="aaaa">
                    <p class="hover:text-blue-dark">売上実績</p>
                  </div>
                </div>
                <div class="flex cursor-pointer my-1 hover:bg-blue-100 rounded">
                  <div class="w-8 h-10 text-center py-1">
                    <p class="text-3xl p-0 text-green-dark">&bull;</p>
                  </div>
                  <div class="w-4/5 h-10 py-3 px-1" v-on:click="user">
                    <p class="hover:text-blue-dark">ユーザー管理</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: "authenticated",
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/");
    },
    user() {
      this.$router.push("users");
    },
    aaaa() {
      this.$swal({
        title: "工事中",
        type: "warning",
        text: "自分たちで考えてね。",
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: true,
        focusCancel: true
      });
    }
  }
};
</script>
