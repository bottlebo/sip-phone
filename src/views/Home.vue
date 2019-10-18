<template>
  <q-page class="flex1 flex-center1">
    <q-page-sticky position="top-right" :offset="[18, 18]">
      <q-btn round color="primary" @click="phoneShow=!phoneShow" icon="call" size="lg"/>
    </q-page-sticky>
    <div class="row">
      <div class="col">
        <div></div>
      </div>
      <div class="col">
        <!-- <sip-phone ref="sipphone" v-bind:callHistory="callHistory" ></sip-phone> -->
      </div>
    </div>
    <q-modal v-model="phoneShow" position-classes="phonePos" position="right" class="phone-modal">
      <div>
        <sip-phone ref="sipphone" v-bind:callHistory="callHistory" v-on:incomCall="incomCall"></sip-phone>
      </div>
    </q-modal>
    <q-modal v-model="incomShow" position="right">
      <h4>Входящий вызов</h4>
      <div>{{abonent}}</div>
      <div>{{abonentNumber}}</div>
      <div>
        <q-btn round color="red" icon="call_end" @click="stopCall"/>
        <q-btn color="primary" round icon="call" @click="call"/>
      </div>
    </q-modal>
  </q-page>
</template>

<style>
</style>

<script>
import SipPhone from "../components/SipPhone";
//import {EventBus} from "../event-bus";

export default {
  name: "PageHome",
  data() {
    return {
      callHistory: [],
      abonent: "",
      abonentNumber: "",
      phoneShow: false,
      incomShow: false
    };
  },
  methods: {
    incomCall: function(objAbonent) {
      console.log("****", objAbonent);
      this.incomShow = true;
      this.abonent = objAbonent.abonent;
      this.abonentNumber = objAbonent.abonentNumber;
    },
    showPhone: function() {},
    call: function() {
      this.$refs["sipphone"].call();
    },
    stopCall: function() {
      this.incomShow = false;
      this.$refs["sipphone"].stopCall();
    }
  },
  async mounted() {
    this.callHistory = ["14", "25"];
    // await this.$nextTick()
    // EventBus.$on('incomCall', this.incomCall)
  },
  components: {
    SipPhone
  }
};
</script>
<style>
.phone-modal .modal-content {
  margin-right: 50px;
}
.phonePos {
  /*  right:50px!important;
  top:50px!important */
}
</style>