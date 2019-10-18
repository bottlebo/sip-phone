import JsSIP from 'jssip'
import * as constants from './constants'
import EventEmmitter, {EventEmitter} from './eventemitter'
//
export default (() => {
  class SIP extends EventEmitter {
    static instance;
    constructor(props) {
      super();
      this._socket = null;
      this._state = {
        sipStatus: constants.SIP_STATUS_DISCONNECTED,
        sipErrorType: null,
        sipErrorMessage: null,
        rtcSession: null,
        // errorLog: [],
        callStatus: constants.CALL_STATUS_IDLE,
        callDirection: null,
        callCounterpart: null
      };
      this._defaultProps = {
        host: '94.253.12.254',
        port: '8888',
        sipPort: '6050',
        pathname: "/ws",
        user: '291',
        password: '12344321',//'2db02e35810b4a722bdc6c71ec843f3d',
        autoRegister: true,
        autoAnswer: false,
        iceRestart: false,
        sessionTimersExpires: 20000,
        extraHeaders: {register: [], invite: []},
        iceServers: [],
        debug: false
      }
      this._ua = null;
      //
      this._props = Object.assign({}, this._defaultProps, props);


      this.remoteAudio = window.document.createElement("audio");
      this.remoteAudio.id = "sip-provider-audio";
      window.document.body.appendChild(this.remoteAudio);
    }
    registerSip() {
      if (this._props.autoRegister) {
        throw new Error(
          "Calling registerSip is not allowed when autoRegister === true"
        );
      }
      if (this._state.sipStatus !== constants.SIP_STATUS_CONNECTED) {
        throw new Error(
          `Calling registerSip is not allowed when sip status is ${
          this._state.sipStatus
          } (expected ${constants.SIP_STATUS_CONNECTED})`,
        );
      }
      return this._ua.register();
    }
    unregister() {
      if (this._state.sipStatus !== constants.SIP_STATUS_REGISTERED) {
        throw new Error(
          `Calling unregisterSip is not allowed when sip status is ${
          this._state.sipStatus
          } (expected ${constants.SIP_STATUS_CONNECTED})`,
        );
      }
      return this._ua.unregister();
    }
    setState(state) {
      this._state = Object.assign({}, this._state, state)
    }
    startCall(destination) {
      if (!destination) {
        //throw new Error(`Destination must be defined (${destination} given)`);
        console.log(`Destination must be defined (${destination} given)`);
        return;
      }
      if (
        this._state.sipStatus !== constants.SIP_STATUS_CONNECTED &&
        this._state.sipStatus !== constants.SIP_STATUS_REGISTERED
      ) {
        // throw new Error(
        console.log(
          `Calling startCall() is not allowed when sip status is ${
          this._state.sipStatus
          } (expected ${constants.SIP_STATUS_CONNECTED} or ${constants.SIP_STATUS_REGISTERED})`,
        );
        return;
      }

      if (this._state.callStatus !== constants.CALL_STATUS_IDLE) {
        //throw new Error(
        console.log(
          `Calling startCall() is not allowed when call status is ${
          this._state.callStatus
          } (expected ${constants.CALL_STATUS_IDLE})`,
        );
        return;
      }
      if (destination.length == 3) {
        destination += `@${this._props.host}:${this._props.sipPort}`
      }
      const {iceServers, sessionTimersExpires} = this._props;
      const extraHeaders = this._props.extraHeaders.invite;
      const self = this;
      var eventHandlers = {
        'progress': function(e) {
          //console.log('call is in progress');
          self.emit('call:progress')
        },
        'failed': function(e) {
          //console.log('call failed with cause: ' + e.cause)
          //console.log(e.message)
          self.emit('call:failed', e)
        },
        'ended': function(e) {
          //console.log('call ended with cause: ');
          //console.log(e);
          self.emit('call:ended', e)
        },
        'confirmed': function(e) {
          //console.log('=call confirmed');
          self.emit('call:confirmed')
        },
        'sdp': function(e) {
          //console.log('===================sdp')
          //console.log(e)
          //e.sdp = e.sdp.replace('UDP/TLS/RTP/SAVPF', 'UDP/RTP/AVPF')
          //console.log(e.sdp)
          //console.log('===================sdp')
        },
        'icecandidate': function(e) {
          //console.log('candidate')
          //console.log(e)
          if (e.lLast) {e.ready();}
        }
      }
      const options = {
        'eventHandlers': eventHandlers,
        //extraHeaders,
        mediaConstraints: {audio: true, video: false},
        rtcOfferConstraints: {iceRestart: this._props.iceRestart},
        pcConfig: {
          //iceServers,
          iceTransports: 'relay',
          iceTransportPolicy: "all",

        },
        sessionTimersExpires
      };

      // console.log(options)
      // console.log('***** call', destination)
      this._ua.call(destination, options);
      this.setState({callStatus: constants.CALL_STATUS_STARTING});
    };
    stopCall() {
      this.setState({callStatus: constants.CALL_STATUS_STOPPING});
      //console.log(this._state)
      this._ua.terminateSessions();
      //console.log(this._ua)
    };
    stop() {
      if (this._ua)
        this._ua.stop()
    }
    // callConfirmed(){
    //   console.log('-- call confirmed')
    //   this.emit('callconfirmed')

    // }
    init() {
      // console.log('*** init')
      // console.log(this._socket)
      if (this._ua) {
        //console.log('ua not null')
        this._ua.stop();
        this._ua = null;
      }
      const {host, port, pathname, user, password, autoRegister, sipPort} = this._props;
      if (!host || !port || !user) {
        this.setState({
          sipStatus: constants.SIP_STATUS_DISCONNECTED,
          sipErrorType: null,
          sipErrorMessage: null,
        });
        return;
      }
      try {
        const _socket = new JsSIP.WebSocketInterface(
          `ws://${host}:${port}${pathname}`,
        );
        const configuration = {
          sockets: [_socket],
          uri: `sip:${user}@${host}:${sipPort}`,
          password,
          register: autoRegister,
          contact_uri: `sip:${user}@${host}:${sipPort}`,
          realm: `${host}:${sipPort}`,
        };
        this._ua = new JsSIP.UA(configuration);
      }
      catch (error) {
        this.setState({
          sipStatus: constants.SIP_STATUS_ERROR,
          sipErrorType: constants.SIP_ERROR_TYPE_CONFIGURATION,
          sipErrorMessage: error.message,
        });
        console.log('* init error',error.message)
        return;
      }
      this._ua.on('registrationFailed', (e) => {
        console.log('* registrationFailed',e)
      })
      this._ua.on('connected', () => {
        //console.log('* connected')
        this.setState({
          sipStatus: constants.SIP_STATUS_CONNECTED,
          sipErrorType: null,
          sipErrorMessage: null,
        });
      });
      this._ua.on("disconnected", () => {
        //console.log('* disconnected')
        this.emit('disconnected')

        this.setState({
          sipStatus: constants.SIP_STATUS_ERROR,
          sipErrorType: constants.SIP_ERROR_TYPE_CONNECTION,
          sipErrorMessage: "disconnected",
        });
      });
      //
      this._ua.on("registered", (data) => {
        //console.log('UA "registered" event', data);
        this.emit('register')
        this.setState({
          sipStatus: constants.SIP_STATUS_REGISTERED,
          callStatus: constants.CALL_STATUS_IDLE,
        });
      });
      //
      this._ua.on("unregistered", () => {
        //console.log('UA "unregistered" event');

        if (this._ua.isConnected()) {
          this.setState({
            sipStatus: constants.SIP_STATUS_CONNECTED,
            callStatus: constants.CALL_STATUS_IDLE,
            callDirection: null,
          });
        } else {
          this.setState({
            sipStatus: constants.SIP_STATUS_DISCONNECTED,
            callStatus: constants.CALL_STATUS_IDLE,
            callDirection: null,
          });
        }
      });
      this._ua.on("newRTCSession",
        ({originator, session: rtcSession, request: rtcRequest}) => {
          // if (!this || this.ua !== ua) {
          //   return;
          // }

          // identify call direction
          if (originator === "local") {
            const foundUri = rtcRequest.to.toString();
            const delimiterPosition = foundUri.indexOf(";") || null;
            this.setState({
              callDirection: constants.CALL_DIRECTION_OUTGOING,
              callStatus: constants.CALL_STATUS_STARTING,
              callCounterpart:
                foundUri.substring(0, delimiterPosition) || foundUri,
            });
          } else if (originator === "remote") {
            const foundUri = rtcRequest.from.toString();
            const delimiterPosition = foundUri.indexOf(";") || null;
            this.setState({
              callDirection: constants.CALL_DIRECTION_INCOMING,
              callStatus: constants.CALL_STATUS_STARTING,
              callCounterpart:
                foundUri.substring(0, delimiterPosition) || foundUri,
            });
            this.emit('call:incoming', this._state.callCounterpart)
          }
          const {rtcSession: rtcSessionInState} = this._state;

          // Avoid if busy or other incoming
          if (rtcSessionInState) {
            console.log('incoming call replied with 486 "Busy Here"');
            rtcSession.terminate({
              status_code: 486,
              reason_phrase: "Busy Here",
            });
            return;
          }

          this.setState({rtcSession});
          rtcSession.on("failed", (e) => {
            // if (this.ua !== ua) {
            //   return;
            // }
            console.log('* session failed', e)
            this.setState({
              rtcSession: null,
              callStatus: constants.CALL_STATUS_IDLE,
              callDirection: null,
              callCounterpart: null,
            });
            this.emit('session:failed')

          });

          rtcSession.on("ended", () => {
            // if (this.ua !== ua) {
            //   return;
            // }
            //console.log('session ended')

            this.setState({
              rtcSession: null,
              callStatus: constants.CALL_STATUS_IDLE,
              callDirection: null,
              callCounterpart: null,
            });
            this.emit('session:ended')
          });

          rtcSession.on("accepted", () => {
            // if (this.ua !== ua) {
            //   return;
            // }

            //console.log('session accepted')

            //console.log(rtcSession)
            let [v] = rtcSession.connection.getRemoteStreams();
            try {
              this.remoteAudio.srcObject = v
            }
            catch (err) {
              this.remoteAudio.src = window.URL.createObjectURL(v);
            }
            const played = this.remoteAudio.play();

            if (typeof played !== "undefined") {
              played
                .catch(() => {
                  /**/
                })
                .then(() => {
                  setTimeout(() => {
                    this.remoteAudio.play();
                  }, 2000);
                });
              this.setState({callStatus: constants.CALL_STATUS_ACTIVE});
              return;
            }

            setTimeout(() => {
              this.remoteAudio.play();
            }, 2000);

            this.setState({callStatus: constants.CALL_STATUS_ACTIVE});
          });

          if (
            this._state.callDirection === constants.CALL_DIRECTION_INCOMING &&
            this._props.autoAnswer
          ) {
            //this.logger.log("Answer auto ON");
            this.answerCall();
          } else if (
            this._state.callDirection === constants.CALL_DIRECTION_INCOMING &&
            !this._props.autoAnswer
          ) {
            //this.logger.log("Answer auto OFF");
          } else if (this._state.callDirection === constants.CALL_DIRECTION_OUTGOING) {
            //this.logger.log("OUTGOING call");
          }
        },
      );

      // const extraHeadersRegister = this.props.extraHeaders.register || [];
      // if (extraHeadersRegister.length) {
      //   ua.registrator().setExtraHeaders(extraHeadersRegister);
      // }
      this._ua.start();
    }
    sendDTMF(tone) {
      if (this._state.rtcSession && this._state.callStatus == constants.CALL_STATUS_ACTIVE) {
        this._state.rtcSession.sendDTMF(tone)
      }
      else {
        console.log('session not active')
      }
    }
    answerCall() {
      //console.log('answer', this._state)
      if (
        this._state.callStatus !== constants.CALL_STATUS_STARTING ||
        this._state.callDirection !== constants.CALL_DIRECTION_INCOMING
      ) {
        //throw new Error(
        console.log(
          `Calling answerCall() is not allowed when call status is ${
          this._state.callStatus
          } and call direction is ${
          this._state.callDirection
          }  (expected ${constants.CALL_STATUS_STARTING} and ${constants.CALL_DIRECTION_INCOMING})`,
        );
        return;
      }

      this._state.rtcSession.answer({
        mediaConstraints: {
          audio: true,
          video: false,
        },
        pcConfig: {
          iceServers: this._props.iceServers,
        },
      });
    };
  }
  return {
    // Public static factory method
    Instance(props) {
      if (!SIP.instance) {
        SIP.instance = new SIP(props);
      }
      return SIP.instance;
    }
  };
})();
