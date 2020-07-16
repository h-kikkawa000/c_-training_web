<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper" @click.self="$emit('close')">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>

          <div class="modal-body">
            <!--Body-->
            <div class="-mx-3 mb-6">
              <div class="flex flex-wrap mb-6 md:mb-0">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-first-name"
                  >ユーザー名</label>
                  <input
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    type="text"
                    placeholder="Jane"
                    v-model="user_id"
                  />
                </div>
                <div class="w-full md:w-1/2 px-3">
                  <label
                    class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-last-name"
                  >パスワード</label>
                  <input
                    class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-last-name"
                    type="text"
                    placeholder="Doe"
                    v-model="user_pass"
                  />
                </div>

                <div class="md:flex text-xs md:items-center px-4 mt-4">
                  <div class></div>
                  <label class="block text-gray-500 font-bold">
                    <input
                      class="mr-2 leading-tight"
                      type="checkbox"
                      v-model="staff_kbn"
                      @click="change(staff_kbn)"
                    />
                    <span class="text-sm">{{this.staff_desc}}</span>
                  </label>
                </div>
              </div>

              <div class="w-full md:w-1/2 py-5 px-3">
                <label
                  class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-last-name"
                >店舗コード</label>
                <input
                  class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-last-name"
                  type="text"
                  placeholder="Doe"
                  v-model="store_code"
                />
              </div>
            </div>

            <div>
              <button
                class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="alertDisplay()"
              >更新</button>

              <button
                class="bg-red-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="$emit('close')"
              >キャンセル</button>
            </div>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  props: {
    // 受け取る属性名を指定
    val: Object // オブジェクトのみ受け取る
  },
  created() {
    if (this.val) {
      this.id = this.val.id;
      this.user_id = this.val.user_id;
      this.user_pass = this.val.user_pass;
      this.staff_kbn = !Boolean(this.val.staff_kbn);
      this.staff_desc = this.val.staff_desc;
      this.store_code = this.val.store_code;
    }
  },
  data() {
    return {
      id: "",
      user_id: "",
      user_pass: "",
      staff_kbn: false,
      staff_desc: "商品部",
      store_code: ""
    };
  },
  methods: {
    change: function(_change) {
      // 動的にプロパティとして値を追加する
      if (_change) {
        this.staff_desc = "商品部";
        return;
      }
      this.staff_desc = "店舗";
    },
    addUser() {
      this.$emit("close");
      this.$swal({
        title: "更新確認",
        type: "warning",
        text:
          "対応種別を選択してください：" +
          "<form name =dealTypeForm style=display: inline>" +
          "<select name=dealTypeSelect>" +
          "<option value=デフォルト>---</option>" +
          "<option value=メール>メール</option>" +
          "<option value=電話>電話</option>" +
          "<option value=トラブル>トラブル</option>" +
          "<option value=その他>その他</option>" +
          "</select></form>",
        showCancelButton: true,
        showConfirmButton: true,
        focusConfirm: true,
        focusCancel: true
      }).then(result => {
        if (result.value) {
          this.$swal.fire({
            type: "success",
            text: "更新しました。"
          });
        }
      });
    },
    async alertDisplay() {
      const { value: formValues } = await this.$swal.fire({
        title: "Create private customer",
        html:
          '<div class="-mx-3 mb-6">' +
          '<div class="flex flex-wrap mb-6 md:mb-0">' +
          '<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0"> ' +
          '<label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">ユーザー名</label>' +
          '<input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="ユーザ名"v-model="user_id"/>' +
          "</div>" +
          '<div class="flex flex-wrap mb-6 md:mb-0">' +
          '<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0"> ' +
          '<label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">パスワード</label>' +
          '<input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-last-name" type="text" placeholder="パスワード"v-model="user_pass"/>' +
          "</div>" +
          '<div class="flex flex-wrap mb-6 md:mb-0">' +
          '<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0"> ' +
          '<label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">ユーザー名</label>' +
          '<input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane"v-model="user_id"/>' +
          "</div>" +
          '<div class="md:flex text-xs md:items-center px-4 mt-4">' +
          "<div class></div>" +
          '<label class="block text-gray-500 font-bold"> <input class="mr-2 leading-tight" type="checkbox" v-model="staff_kbn" @click="change(staff_kbn)"/> <span class="text-sm">{{this.staff_desc}}</span></label> ' +
          "</div>" +
          "</div>" +
          "</div>",
        focusConfirm: false,
        preConfirm: () => {
          return [
            document.getElementById("grid-first-name").value,
            document.getElementById("user_pass").value,
            document.getElementById("swal-input3").value,
            document.getElementById("swal-input4").value,
            document.getElementById("swal-input5").value
          ];
        }
      });
      if (formValues) {
        this.createdCustomer = formValues;
        console.log("the content of this.createdCustomer");
        console.log(this.createdCustomer);
        console.log("the content of this.createdCustomer.address");
        console.log(this.createdCustomer.address);
      }
    }
  }
};
</script>

<style>
#modal {
  margin: 3vw;
}

#modal ul {
  overflow: hidden;
  padding: 0;
  list-style: none;
}

#modal .modalArea ul li {
  display: inline-block;
  width: 100px;
  text-align: center;
  line-height: 30px;
  background: rgba#ddd;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.5s, color 0.3s;
}

#modal .modalArea ul li:hover {
  color: #fff;
  background: #42b983;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(199, 199, 199, 0.1);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
}

.modal-container {
  width: 80%;
  max-width: 840px;
  margin: 0 auto;
  padding: 60px 2vw 80px;

  text-align: center;
  background: rgba(255, 255, 255, 1);
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(141, 140, 140, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
  font-size: 30px;
  text-align: center;
  font-weight: bold;
}

.modal-body {
  margin: 20px 0;
}

.link_area {
  overflow: hidden;
  max-width: 410px;
  margin: auto;
  text-align: center;
}

.link_area .modal-default-button {
  cursor: pointer;
  display: inline-block;
  background: #e6e6e6;
  width: 180px;
  line-height: 40px;
  text-decoration: none;
  color: #000;
  margin: 0 10px;
  font-size: 14px;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: translateY(30px);
}
</style>