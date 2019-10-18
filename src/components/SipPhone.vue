<template>
 <!--  <q-page padding class="row justify-center"> -->
   <div>
    <q-card
      square
      class="shadow-4"
      style="width: 330px; min-height:450px; height: max-content; position:relative"
    >
      <div class="row">
        <div class="col" style="text-align:left; padding:5px 0 0 5px">
          <q-btn flat dense icon="menu"/>
        </div>
        <div class="col" style="text-align:right; padding:5px 5px 0 0">
          <q-btn flat dense :color="state.color" :label="state.label" :icon="state.icon">
            <q-popover v-model="statePopoverShow">
              <div class="group" style="width: 120px;">
                <div>
                  <q-btn flat dense color="green" label="online" icon="check" @click="goOnline"></q-btn>
                </div>
                <!--  <div>
                <q-btn flat dense color="primary" icon="thumb_up"  @click="notify">
                </q-btn>
                </div>-->
                <div>
                  <q-btn flat dense color="orange" icon="schedule" label="busy" @click="notify"></q-btn>
                </div>
                <div>
                  <q-btn flat dense color="red" label="offline" icon="clear" @click="goOffline"></q-btn>
                </div>
              </div>
            </q-popover>
          </q-btn>
        </div>
      </div>
      <q-card-main>
        <div class="container" style="position:relative">
          <q-field>
            <q-search
              inline
              icon="call"
              style="font-size:2em;"
              placeholder=" "
              v-model="phoneNumber"
              :after="[{icon: 'backspace', content: true, handler () { backSpace()}}]"
            >
              <q-autocomplete
                :debounce="150"
                @search="searchNumber"
                :min-characters="0"
                @selected="numberSelected"
              />
            </q-search>
          </q-field>

          <div class="hidespan" v-bind:class="callShow">
            <div class="calling shadow-3">
              <div>
                <div style="font-size:1.75em;">{{callingNumber}}</div>
              </div>
              <div class="row">
                <div class="col">
                  <q-btn
                    flat
                    dense
                    round
                    :color="micState.color"
                    :icon="micState.icon"
                    @click="mic"
                  />
                </div>
                <div class="col" style="max-width: 45px; text-align: right;">
                  <q-btn round dense color="red" icon="call_end" class @click="stopCall"/>
                  <div style="clear:both"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="hidespan" v-bind:class="answerShow">
            <div class="calling shadow-3">
              <div>
                <div class="abonent">{{abonent}}</div>
                <div style="abonentNumber">{{abonentNumber}}</div>
              </div>
              <div class="row" style="margin-top:5px">
                <div class="col" style=" text-align: left;">
                  <q-btn
                    flat
                    dense
                    round
                    :color="micState.color"
                    :icon="micState.icon"
                    @click="mic"
                  />
                </div>

                <div class="col" style=" text-align: right;">
                  <q-btn round dense color="red" icon="call_end" @click="stopCall"/>
                  <div style="clear:both"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pad">
            <div class="row">
              <div class="col-4 key" @click="numclick(1)">
                <div class="num">1</div>
              </div>
              <div class="col-4 key" @click="numclick(2)">
                <div class="num">2</div>
              </div>
              <div class="col-4 key" @click="numclick(3)">
                <div class="num">3</div>
              </div>
            </div>
            <div class="row">
              <div class="col-4 key" @click="numclick(4)">
                <div class="num">4</div>
              </div>
              <div class="col-4 key" @click="numclick(5)">
                <div class="num">5</div>
              </div>
              <div class="col-4 key" @click="numclick(6)">
                <div class="num">6</div>
              </div>
            </div>
            <div class="row">
              <div class="col-4 key" @click="numclick(7)">
                <div class="num">7</div>
              </div>
              <div class="col-4 key" @click="numclick(8)">
                <div class="num">8</div>
              </div>
              <div class="col-4 key" @click="numclick(9)">
                <div class="num">9</div>
              </div>
            </div>
            <div class="row">
              <div class="col-4 key" @click="numclick(11)">
                <div class="num">*</div>
              </div>
              <div class="col-4 key" @click="numclick(10)">
                <div class="num">0</div>
              </div>
              <div class="col-4 key" @click="numclick(12)">
                <div class="num">#</div>
              </div>
            </div>
          </div>
        </div>
      </q-card-main>
      <q-card-actions align="end" style="padding:0 20px 0 10px">
        <div style="text-align:center; width:100%; padding-bottom:20px">
          <q-btn
            color="primary"
            round
            :icon="buttonState.icon"
            :class="buttonState.class"
            size="lg"
            @click="call"
          />

          <!--  <q-btn color="primary" round icon="call" size="lg" @click="call"/> -->
        </div>
        <div style="display:none">
          <q-btn color="red" round icon="call" @click="stopCall"/>

          <q-btn flat label="7:30PM" @click="answerShow='show'"/>
          <q-btn flat label="9:00PM" @click="answerShow='hide'"/>
          <q-btn color="primary" round icon="call" @click="call"/>
        </div>
      </q-card-actions>
    </q-card>

    <audio id="a1" preload>
      <source src="../assets/sounds/Dtmf-1.wav" type="audio/wav">
    </audio>
    <audio id="a2" preload>
      <source src="../assets/sounds/Dtmf-2.wav" type="audio/wav">
    </audio>
    <audio id="a3" preload>
      <source src="../assets/sounds/Dtmf-3.wav" type="audio/wav">
    </audio>
    <audio id="a4" preload>
      <source src="../assets/sounds/Dtmf-4.wav" type="audio/wav">
    </audio>
    <audio id="a5" preload>
      <source src="../assets/sounds/Dtmf-5.wav" type="audio/wav">
    </audio>
    <audio id="a6" preload>
      <source src="../assets/sounds/Dtmf-6.wav" type="audio/wav">
    </audio>
    <audio id="a7" preload>
      <source src="../assets/sounds/Dtmf-7.wav" type="audio/wav">
    </audio>
    <audio id="a8" preload>
      <source src="../assets/sounds/Dtmf-8.wav" type="audio/wav">
    </audio>
    <audio id="a9" preload>
      <source src="../assets/sounds/Dtmf-9.wav" type="audio/wav">
    </audio>
    <audio id="a10" preload>
      <source src="../assets/sounds/Dtmf-0.wav" type="audio/wav">
    </audio>
    <audio id="a11" preload>
      <source src="../assets/sounds/Dtmf-star.wav" type="audio/wav">
    </audio>
    <audio id="a12" preload>
      <source src="../assets/sounds/Dtmf-pound.wav" type="audio/wav">
    </audio>
    <audio id="ring" preload loop>
      <source src="../assets/sounds/rtc_ringtone.wav" type="audio/wav">
    </audio>
    <audio id="incom" preload loop>
      <source src="../assets/sounds/antique_phone.mp3" type="audio/mp3">
    </audio>
<!--   </q-page> -->
   </div>
</template>
 

<script>
import { filter } from "quasar";

import SIP from "../classes/sip";
//import {EventBus} from "../event-bus";

const states = {
  online: { color: "green", label: "online", icon: "check" },
  offline: { color: "red", label: "offline", icon: "clear" },
  busy: { color: "orange", icon: "schedule", label: "busy" }
};
const micStates = {
  on: { icon: "mic", color: "primary" },
  off: { icon: "mic_off", color: "#ccc" }
};
const buttonStates = {
  incom: { icon: "notifications_active", class: "incom" },
  normal: { icon: "call", class: "" }
};
export default {
  name: "SipPhone",
  data() {
    return {
      phoneNumber: "", //"sip:290@94.253.12.254:6050",
      sip: null,
      state: { icon: "clear", color: "red", label: "offline" },
      statePopoverShow: false,
      ringPlayed: false,
      callShow: "hide",
      answerShow: "hide",
      ///callShow1: false,
      callingNumber: "",
      abonentNumber: "289@aaa-bbb.com",
      abonent: "aaaaaaaa",
      micState: { icon: "mic", color: "primary" },
      micOn: true,
      callState: "idle",
      buttonState: buttonStates["normal"]
      //callHistory: []
    };
  },
  props: {
    msg: String,
    callHistory: Array
  },
  methods: {
    // setCallHistory: function(arrHistory) {
    //   this.callHistory = arrHistory.map(v => v);
    // },
    mic: function() {
      if (this.micOn) {
        this.micState = micStates["off"];
        this.micOn = false;
      } else {
        this.micState = micStates["on"];
        this.micOn = true;
      }
    },
    goOffline: function() {
      this.sip.stop();
      this.statePopoverShow = false;
    },
    goOnline: function() {
      this.sip.init();
      this.statePopoverShow = false;
    },
    searchNumber: function(terms, done) {
      console.log(terms);
      done(
        filter(terms, {
          field: "value",
          list: this.callHistory.map(n => ({ value: n, label: n }))
        })
      );
    },
    numberSelected: function(number) {
      //console.log(number.value)
      this.phoneNumber = number.value;
      //this.saveNumber();
      //this.call();
    },
    notify: function() {},
    numclick: function(e) {
      //console.log(e)
      document.getElementById("a" + e).play();
      if (e == 10) e = "0";
      else if (e == 11) e = "*";
      else if (e == 12) e = "#";
      this.phoneNumber += e;
      this.sip.sendDTMF(e);
    },
    backSpace: function(e) {
      if (this.phoneNumber.length) {
        this.phoneNumber = this.phoneNumber.substring(
          0,
          this.phoneNumber.length - 1
        );
        //document.getElementById("del").play();
      }
    },
    call() {
      if (this.callState == "idle") {
        this.saveNumber();
        this.callingNumber = this.phoneNumber;
        this.phoneNumber = "";
        this.callShow = "show";
        this.sip.startCall(this.callingNumber);
      } else if (this.callState == "incom") {
        this.answer();
        this.buttonState = buttonStates["normal"];
      }
    },
    saveNumber() {
      if (!this.callHistory.includes(this.phoneNumber)) {
        this.callHistory.push(this.phoneNumber);
      }
    },
    stopCall() {
      this.phoneNumber = "";
      this.sip.stopCall();
      document.getElementById("ring").pause();
      document.getElementById("incom").pause();
      this.callState = "idle";
      this.ringPlayed = false;
      this.buttonState = buttonStates["normal"];
    },
    online() {
      this.state = states.online;
    },
    offline() {
      this.state = states.offline;
    },
    callConfirmed() {
      document.getElementById("ring").pause();
      this.ringPlayed = false;
    },
    callInProggress() {
      if (!this.ringPlayed) {
        document.getElementById("ring").play();
        this.ringPlayed = true;
      }
    },
    callEnded(e) {
      this.hideCalling();
    },
    callFailed(e) {
      this.hideCalling();
    },
    hideCalling() {
      this.callShow = "hide";
    },
    hideAnswer() {
      this.answerShow = "hide";
    },
    sessionFailed() {
      document.getElementById("ring").pause();
      document.getElementById("incom").pause();
      this.hideCalling();
      this.hideAnswer();
      this.buttonState = buttonStates["normal"];
    },
    sessionEnded() {
      document.getElementById("ring").pause();
      document.getElementById("incom").pause();
      this.hideCalling();
      this.hideAnswer();
    },
    answer() {
      document.getElementById("incom").pause();

      this.sip.answerCall();
    },
    callIncom(from) {
      this.buttonState = buttonStates["incom"];

      this.answerShow = "show";
      this.callState = "incom";
      const audio = document.getElementById("incom");
      audio.currentTime = 0;
      audio.play();
      // const a = from.split(' ')
      // this.abonent = a[0];
      // this.abonentNumber = a[1];
      const ad = /\"(.+)\"\s\<(.+)\>/i;

      const a = ad.exec(from);
      this.abonent = a[1];
      this.abonentNumber = a[2];
      this.$emit('incomCall',{abonent:this.abonent, abonentNumber:this.abonentNumber})
      //console.log("from:", from);
    }
    // register() {
    //   this.sip.init();
    //   console.log(this.sip._state);
    // },
    // unregister() {
    //   this.sip.unregister();
    // }
  },
  mounted() {
    this.sip = SIP.Instance({});
    this.sip.on("register", this.online);
    this.sip.on("disconnected", this.offline);
    this.sip.on("call:confirmed", this.callConfirmed);
    this.sip.on("call:progress", this.callInProggress);
    //this.sip.on("call:ended", this.callEnded);
    //this.sip.on("call:failed", this.callFailed);
    this.sip.on("call:incoming", this.callIncom);
    this.sip.on("session:ended", this.sessionEnded.bind(this));
    this.sip.on("session:failed", this.sessionFailed.bind(this));

    this.sip.init();
  }
};
</script>
<style>
/* .container {
} */
.abonent {
  font-size: 1.7em;
  color: #212121;
}
.abonentNumber {
  font-size: 1.2em;
  color: #212121;
}
.hidespan {
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  margin-top: 10px;
}
.calling {
  border: solid 1px #ccc;
  border-radius: 3px;
  padding: 10px;
  /*  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12); */
}
.hide {
  height: 0;
}
.show {
  height: 115px;
}
/* .dcontent {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  overflow-y: auto;
  will-change: scroll-position;
  min-width: 280px;
  max-height: 80%;
  -webkit-backface-visibility: hidden;
  outline: 0;
  transition: all 0.2s ease-in-out;
} */

.dialog {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.4);
}
.key {
  height: 55px !important;
  border-bottom: solid 1px #ccc;
  border-right: solid 1px #ccc;
  text-align: center;
  cursor: pointer;
  color: #828a99;
  font-weight: 400;
  font-size: 16px;
}
.num {
  user-select: none;
  font-size: 24px;
  color: #212121;
}
.key:hover {
  background-color: #cecfcf;
  color: white;
}
.row .key:last-child {
  border-right: none;
}
.pad {
  padding: 20px 10px;
}
.pad .row:last-child .key {
  border-bottom: none;
}
.num {
  height: 20px;
  width: 40px;
  margin: 15px auto;
}

.incom .q-icon {
  animation: shake 0.72s cubic-bezier(0.36, 0.07, 0.19, 0.97) infinite;
  transform: translate3d(0, 0, 0);
  transform-origin: 50% 0;
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: /* translate3d(-2px, 0, 0) */ rotate(-2deg);
    filter: blur(0);
  }

  20%,
  80% {
    transform: /* translate3d(4px, 0, 0) */ rotate(4deg);
    filter: blur(0.25px);
  }

  30%,
  50%,
  70% {
    transform: /* translate3d(-8px, 0, 0) */ rotate(-9deg);
    filter: blur(1px);
  }

  40%,
  60% {
    transform: /* translate3d(8px, 0, 0) */ rotate(9deg);
    filter: blur(0.25px);
  }
}
</style>