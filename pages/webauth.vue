<template>
  <div class="h-screen">
    <div class="container mx-auto h-full flex justify-center items-center">
      <div class="w-1/3">
        <h1 class="font-hairline mb-6 text-center">Login to our Website</h1>
        <div
          class="border-teal p-8 border-t-12 bg-white mb-6 rounded-lg shadow-lg"
        >
          <div class="mb-4">
            <label class="font-bold text-grey-darker block mb-2"
              >Username</label
            >
            <input
              type="text"
              class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              v-model="formUsername"
              placeholder="Your Username"
            />
          </div>

          <div class="flex items-center justify-between">
            <button
              class="bg-teal-400 hover:bg-teal text-white font-bold py-2 px-4 rounded"
              v-on:click="handleSignInSubmit"
            >
              Login
            </button>
          </div>
        </div>
        <div class="text-center">
          <p class="text-grey-dark text-sm">Don't have an account?</p>
          <button
            class="bg-teal-400 hover:bg-teal text-white font-bold py-2 px-4 rounded"
            v-on:click="login2"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modal from "../components/modal";
import axios from "axios";

const BASE_URL = process.env.API;

export default {
  data() {
    return {
      formUsername: "",
      formPassword: ""
    };
  },
  methods: {
    async handleSignInSubmit(event) {
      event.preventDefault();
      let username = this.formUsername;

      // prepare form post data
      var formData = new FormData();
      formData.append("username", username);

      // send to server for registering
      let makeAssertionOptions;
      try {
        var res = await fetch(BASE_URL + "/assertionOptions", {
          method: "POST", // or 'PUT'
          body: formData, // data can be `string` or {object}!
          headers: {
            Accept: "application/json"
          }
        });

        makeAssertionOptions = await res.json();
      } catch (e) {
        //showErrorAlert("Request to server failed", e);
      }

      console.log("Assertion Options Object", makeAssertionOptions);

      // show options error to user
      if (makeAssertionOptions.status !== "ok") {
        console.log("Error creating assertion options");
        console.log(makeAssertionOptions.errorMessage);
        //showErrorAlert(makeAssertionOptions.errorMessage);
        return;
      }

      // todo: switch this to coercebase64
      const challenge = makeAssertionOptions.challenge
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      makeAssertionOptions.challenge = Uint8Array.from(atob(challenge), c =>
        c.charCodeAt(0)
      );

      // fix escaping. Change this to coerce
      makeAssertionOptions.allowCredentials.forEach(function(listItem) {
        var fixedId = listItem.id.replace(/\_/g, "/").replace(/\-/g, "+");
        listItem.id = Uint8Array.from(atob(fixedId), c => c.charCodeAt(0));
      });

      console.log("Assertion options", makeAssertionOptions);

      this.$swal.fire({
        title: "Logging In...",
        text: "セキュリティキーをタップしてログインしてください。",
        imageUrl: require("../assets/images/securitykey.min.svg"),
        showCancelButton: true,
        showConfirmButton: false,
        focusConfirm: false,
        focusCancel: false
      });

      // ask browser for credentials (browser will ask connected authenticators)
      let credential;
      try {
        credential = await navigator.credentials.get({
          publicKey: makeAssertionOptions
        });
      } catch (err) {
        console.log("navigator.credentials.get", err);
        //showErrorAlert(err.message ? err.message : err);
      }
      let ret;
      try {
        ret = await verifyAssertionWithServer(credential);
      } catch (e) {
        console.log("Could not verify assertion", e);
        //showErrorAlert("Could not verify assertion", e);
      }
      if (ret) {
        this.$swal.fire({
          title: "Logged In!",
          text: "ログイン成功！",
          type: "success",
          timer: 2000
        });
        this.$router.push("/menu");
      } else {
        this.$swal.fire({
          type: "error",
          title: "ログイン失敗"
        });
      }

      /**
       * Sends the credential to the the FIDO2 server for assertion
       * @param {any} assertedCredential
       */
      async function verifyAssertionWithServer(assertedCredential) {
        // Move data into Arrays incase it is super long
        let authData = new Uint8Array(
          assertedCredential.response.authenticatorData
        );
        let clientDataJSON = new Uint8Array(
          assertedCredential.response.clientDataJSON
        );
        let rawId = new Uint8Array(assertedCredential.rawId);
        let sig = new Uint8Array(assertedCredential.response.signature);
        const data = {
          id: assertedCredential.id,
          rawId: coerceToBase64Url(rawId),
          type: assertedCredential.type,
          extensions: assertedCredential.getClientExtensionResults(),
          response: {
            authenticatorData: coerceToBase64Url(authData),
            clientDataJson: coerceToBase64Url(clientDataJSON),
            signature: coerceToBase64Url(sig)
          }
        };

        let response;
        try {
          let res = await fetch(BASE_URL + "/makeAssertion", {
            method: "POST", // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          });

          response = await res.json();
        } catch (e) {
          showErrorAlert("Request to server failed", e);
          throw e;
        }

        console.log("Assertion Object", response);

        // show error
        if (response.status !== "ok") {
          console.log("Error doing assertion");
          console.log(response.errorMessage);
          // showErrorAlert(response.errorMessage);
          return false;
        }

        return true;
        // redirect to dashboard to show keys
        //window.location.href = "/dashboard/" + value("#login-username");
      }

      function coerceToBase64Url(thing) {
        // Array or ArrayBuffer to Uint8Array
        if (Array.isArray(thing)) {
          thing = Uint8Array.from(thing);
        }

        if (thing instanceof ArrayBuffer) {
          thing = new Uint8Array(thing);
        }

        // Uint8Array to base64
        if (thing instanceof Uint8Array) {
          var str = "";
          var len = thing.byteLength;

          for (var i = 0; i < len; i++) {
            str += String.fromCharCode(thing[i]);
          }
          thing = window.btoa(str);
        }

        if (typeof thing !== "string") {
          throw new Error("could not coerce to string");
        }

        // base64 to base64url
        // NOTE: "=" at the end of challenge is optional, strip it off here
        thing = thing
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=*$/g, "");

        return thing;
      }

      function showErrorAlert(message, error) {
        let footermsg = "";
        if (error) {
          footermsg = "exception:" + error.toString();
        }
        this.$swal.fire({
          type: "error",
          title: "エラーが発生しました。",
          text: message,
          footer: footermsg
        });
      }
    },

    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    async login2(section) {
      let displayName = "";
      let attestation_type = "none";
      let authenticator_attachment = "";
      let user_verification = "preferred";
      let require_resident_key = false;

      var data = new FormData();
      data.append("username", this.formUsername);
      data.append("displayName", displayName);
      data.append("attType", attestation_type);
      data.append("authType", authenticator_attachment);
      data.append("userVerification", user_verification);
      data.append("requireResidentKey", require_resident_key);
      // send to server for registering
      let makeCredentialOptions;
      try {
        makeCredentialOptions = await fetchMakeCredentialOptions(data);
      } catch (e) {
        console.error(e);
        let msg = "Something wen't really wrong";
        // showErrorAlert(msg);
      }

      console.log("Credential Object", makeCredentialOptions);

      console.log(
        "makeCredentialOptions.status ",
        makeCredentialOptions.status
      );
      if (makeCredentialOptions.status !== "ok") {
        console.log("Error creating credential options");
        console.log(makeCredentialOptions.errorMessage);
        showErrorAlert(makeCredentialOptions.errorMessage);
        return;
      }

      // Turn the challenge back into the accepted format of padded base64
      makeCredentialOptions.challenge = coerceToArrayBuffer(
        makeCredentialOptions.challenge
      );
      console.log(
        "makeCredentialOptions.challenge",
        makeCredentialOptions.challenge
      );
      // Turn ID into a UInt8Array Buffer for some reason
      makeCredentialOptions.user.id = coerceToArrayBuffer(
        makeCredentialOptions.user.id
      );
      console.log(
        "makeCredentialOptions.user.id",
        makeCredentialOptions.user.id
      );

      makeCredentialOptions.excludeCredentials = makeCredentialOptions.excludeCredentials.map(
        c => {
          c.id = coerceToArrayBuffer(c.id);
          return c;
        }
      );

      console.log(
        "makeCredentialOptions.excludeCredentials",
        makeCredentialOptions.excludeCredentials
      );

      if (
        makeCredentialOptions.authenticatorSelection.authenticatorAttachment ===
        null
      )
        makeCredentialOptions.authenticatorSelection.authenticatorAttachment = undefined;

      console.log("Credential Options Formatted", makeCredentialOptions);

      this.$swal.fire({
        title: "Registering...",
        text: "セキュリティキーをタップして登録を完了します。",
        imageUrl: require("../assets/images/securitykey.min.svg"),
        showCancelButton: true,
        showConfirmButton: false,
        focusConfirm: false,
        focusCancel: false
      });

      let newCredential;
      try {
        console.log("はじまり");
        newCredential = await navigator.credentials.create({
          publicKey: makeCredentialOptions
        });
        console.log("おわり");
      } catch (e) {
        var msg =
          "Could not create credentials in browser. Probably because the username is already registered with your authenticator. Please change username or authenaticator.";
        console.error(msg, e);
        //showErrorAlert(msg, e);
      }

      console.log("PublicKeyCredential Created", newCredential);

      try {
        registerNewCredential(newCredential);
      } catch (e) {
        console.log("registerNewCredential", newCredential);
        showErrorAlert(err.message ? err.message : err);
      }

      async function fetchMakeCredentialOptions(formData) {
        let response = await fetch(BASE_URL + "/makeCredentialOptions", {
          method: "POST", // or 'PUT'
          body: formData, // data can be `string` or {object}!
          headers: {
            Accept: "application/json"
          }
        });

        let data = await response.json();
        console.log("fetchMakeCredentialOptions", data);
        return data;
      }

      // This should be used to verify the auth data with the server
      async function registerNewCredential(newCredential) {
        // Move data into Arrays incase it is super long
        let attestationObject = new Uint8Array(
          newCredential.response.attestationObject
        );
        let clientDataJSON = new Uint8Array(
          newCredential.response.clientDataJSON
        );
        let rawId = new Uint8Array(newCredential.rawId);

        const data = {
          id: newCredential.id,
          rawId: coerceToBase64Url(rawId),
          type: newCredential.type,
          extensions: newCredential.getClientExtensionResults(),
          response: {
            AttestationObject: coerceToBase64Url(attestationObject),
            clientDataJson: coerceToBase64Url(clientDataJSON)
          }
        };

        let response;
        try {
          response = await registerCredentialWithServer(data);
        } catch (e) {
          showErrorAlert(e);
        }

        console.log("Credential Object", response);

        // show error
        if (response.status !== "ok") {
          console.log("Error creating credential");
          console.log(response.errorMessage);
          //showErrorAlert(response.errorMessage);
          return;
        }

        // show success

        // redirect to dashboard?
        //window.location.href = "/dashboard/" + state.user.displayName;
      }

      async function registerCredentialWithServer(formData) {
        let response = await fetch(BASE_URL + "/makeCredential", {
          method: "POST", // or 'PUT'
          body: JSON.stringify(formData), // data can be `string` or {object}!
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        });
        console.log("registerCredentialWithServer");
        let data = await response.json();

        return data;
      }

      function coerceToArrayBuffer(thing, name) {
        if (typeof thing === "string") {
          // base64url to base64
          thing = thing.replace(/-/g, "+").replace(/_/g, "/");

          // base64 to Uint8Array
          var str = window.atob(thing);
          var bytes = new Uint8Array(str.length);
          for (var i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
          }
          thing = bytes;
        }

        // Array to Uint8Array
        if (Array.isArray(thing)) {
          thing = new Uint8Array(thing);
        }

        // Uint8Array to ArrayBuffer
        if (thing instanceof Uint8Array) {
          thing = thing.buffer;
        }

        // error if none of the above worked
        if (!(thing instanceof ArrayBuffer)) {
          throw new TypeError("could not coerce '" + name + "' to ArrayBuffer");
        }
        console.log("coerceToArrayBuffer", thing);
        return thing;
      }

      function coerceToBase64Url(thing) {
        // Array or ArrayBuffer to Uint8Array
        if (Array.isArray(thing)) {
          thing = Uint8Array.from(thing);
        }

        if (thing instanceof ArrayBuffer) {
          thing = new Uint8Array(thing);
        }

        // Uint8Array to base64
        if (thing instanceof Uint8Array) {
          var str = "";
          var len = thing.byteLength;

          for (var i = 0; i < len; i++) {
            str += String.fromCharCode(thing[i]);
          }
          thing = window.btoa(str);
        }

        if (typeof thing !== "string") {
          throw new Error("could not coerce to string");
        }

        // base64 to base64url
        // NOTE: "=" at the end of challenge is optional, strip it off here
        thing = thing
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=*$/g, "");

        return thing;
      }
    }
  }
};
</script>

<style></style>
