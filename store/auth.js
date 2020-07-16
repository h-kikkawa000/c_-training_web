export const state = () => ({
  loggedIn: false,
  user_name: "",
  staff_kbn: 0,
  staff_desc: "",
  store_code: ""
});

export const mutations = {
  login(state, _value) {
    state.loggedIn = true;
    state.user_name = _value.user_name;
    state.staff_kbn = _value.staff_kbn;
    state.staff_desc = _value.staff_desc;
    state.store_code = _value.store_code;
  },
  logout(state) {
    state.loggedIn = false;
    state.user_name = "";
    state.staff_desc = "";
    state.staff_kbn = 0;
    state.store_code = "";
  }
};
