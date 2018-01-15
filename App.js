import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Animated,
  Dimensions,
  Keyboard,
  ActivityIndicator,
  AppState
} from 'react-native';
import { 
  checkSelfFriend, 
  sortFriendsUnread, 
  alphabetize, 
  checkIndexOf,
  loadSound,
  sendNotification,
  requestPermission
} from './components/helpers';
import { MediaStream, MediaStreamTrack, getUserMedia } from 'react-native-webrtc';
import Permissions from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Dashboard from './components/dashboard/Dashboard';
import Menu from './components/menu/Menu';
import FriendList from './components/friendList/FriendList';
import ReportAbuse from './components/reportAbuse/ReportAbuse';
import RemoveFriend from './components/removeFriend/RemoveFriend';
import Modal from './components/modal/Modal';
import Chat from './components/chat/Chat';
import Meteor from 'react-native-meteor';
import StatusBarSizeIOS from 'react-native-status-bar-size';
import LinearGradient from 'react-native-linear-gradient';
import Sound from 'react-native-sound';
import update from 'immutability-helper';
import Peer from './Peer';

const SERVER_URL = 'ws://piper-rtc.herokuapp.com/websocket';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rp: false,
      height: '100%',
      width: 230,
      inCall: false,
      loggedIn: false,
      user: null,
      menuActive: 0,
      reportAbuseActive: 0,
      removeFriendActive: 0,
      friendListActive: 0,
      modalActive: 0,
      connectionError: '',
      connectingActive: false,
      initializingCall: false,
      friends: [],
      sentRequests: [],
      requests: [],
      openChats: [],
      currentFriendSelection: {},
      unread: [],
      local: null,
      remote: null,
      canMakeCalls: false,
      menuAnim: new Animated.Value(0),
      menuMove: new Animated.Value(0),
      raAnim: new Animated.Value(0),
      rfAnim: new Animated.Value(0),
      friendsAnim: new Animated.Value(0),
      modalAnim: new Animated.Value(0),
      body: new Animated.Value(1),
      scale: new Animated.Value(0),
      dim: new Animated.Value(0),
      with: new Animated.Value(0),
      hangUp: new Animated.Value(0),
      accept: new Animated.Value(0),
      errorScale: new Animated.Value(0),
      errorTranslate: new Animated.Value(0),
    }
    this.ring = null;
    this.appState = null;
  }

  componentWillMount = () => Meteor.connect(SERVER_URL);

  componentDidMount = () => {
    const {height, width} = Dimensions.get('window');
    this.setState({ height, width });
    PushNotification.configure({ 
      onNotification: (notification) => {
        console.log(notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      } 
    });
    StatusBarSizeIOS.addEventListener('willChange', this.adjustHeight);
    this.ring = loadSound();
    AppState.addEventListener('change', this.handleStateChange);
  }

  componentWillUnmount = () => {
    StatusBarSizeIOS.removeEventListener('willChange', this.adjustHeight);
    AppState.removeEventListener('change', this.handleStateChange);
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps);
    if(!this.state.rp) this.setState({rp: true});
    if(nextProps.user === null || nextProps.id === null) {
      this.getAuth();
    } else {
      const buddyList = nextProps.buddyList[0];
      const exists = buddyList !== undefined && 'friends' in buddyList;
      this.letEmIn(nextProps, exists);
    }
    if(nextProps.messages.length > 0) this.checkMessages(nextProps.messages);
  }

  getAuth = () => this.setState({ loggedIn: false, friends: [], user: null, search: [], sentRequests: [], requests: [], unread: [], openChats: [], currentFriendSelection: {} });

  letEmIn = (path, budsExist) => {
    const buds = path.buddyList;
    const newM = path.user.newMessages;
    this.setState({
      loggedIn: true,
      user: path.user,
      unread: newM !== undefined ? newM : []
    });
    if(buds.length > 0) {
      checkSelfFriend(path)
        .then( users => this.setState({users}) )
        .catch( err => console.log(err) );
    }
    if(budsExist && buds[0].friends.length !== this.state.friends.length) {
      this.fillContacts(buds[0].friends);
    }
    if(budsExist && buds[0].requests.length !== this.state.requests.length) {
      this.fillReqs(buds[0].requests);
    }
    if(budsExist && buds[0].sentRequests.length !== this.state.sentRequests.length) {
      this.fillSentReqs(buds[0].sentRequests);
    }
    Permissions.checkMultiple(['notification', 'photo']).then(res => {
      if(res.photo !== 'authorized') requestPermission('photo');
      if(res.notification !== 'authorized') requestPermission('notification');
    });
  }

  fillContacts = async (arr) => {
    Meteor.call('users.getObjects', arr, (err, res) => {
      if(err) { console.log(err) } else { this.setState({ friends: alphabetize(res) }) }
    });
  }

  fillReqs = async (arr) => {
    Meteor.call('users.getObjects', arr, (err, res) => {
      if(err) { console.log(err) } else { this.setState({ requests: res }) }
    });
  }

  fillSentReqs = async (arr) => {
    Meteor.call('users.getObjects', arr, (err, res) => {
      if(err) { console.log(err) } else { this.setState({ sentRequests: res }) }
    });
  }

  handleStateChange = (nextState) => {
    if(this.appState === 'inactive' && nextState === 'active') {
      this.terminatePeer();
      this.getLocalStream();
    }
    this.appState = nextState;
  }

  checkMessages = async (messageList) => {
    const last = messageList[messageList.length - 1];
    if(last.to === Meteor.userId()) sendNotification(last);
  }

  adjustHeight = (nSBH) => {
    if(nSBH !== null) {
      const {height} = Dimensions.get('window');
      if(nSBH > 20) {
        this.setState({height: height - 20, inCall: true});
      } else {
        this.setState({height: height, inCall: false});
      }
    }
  }

  openMenu = async () => {
    if(this.state.friendListActive === 1) this.openFriendList();
    if(this.state.reportAbuseActive === 1) {
      this.openReportAbuse();
    } else if(this.state.removeFriendActive === 1) {
      this.openRemoveFriend();
    } else {
      this.setState(prevState => {
        if(prevState.menuActive === 0) {
          Animated.spring(this.state.menuAnim, { toValue: 1, useNativeDriver: true, tension: 120, friction: 12.5 }).start();
          Animated.timing(this.state.body, { toValue: 0, useNativeDriver: true, duration: 200 }).start();
        } else {
          Animated.spring(this.state.menuAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 12.5 }).start();
          Animated.timing(this.state.body, { toValue: 1, useNativeDriver: true, duration: 125 }).start();
        }
        return { menuActive: prevState.menuActive == 0 ? 1 : 0 }
      });
    }
    Keyboard.dismiss();
  }

  openReportAbuse = async () => {
    if(this.state.reportAbuseActive === 0) {
      Animated.parallel([
        Animated.spring(this.state.raAnim, { toValue: 1, useNativeDriver: true, tension: 120, friction: 11 }),
        Animated.timing(this.state.menuMove, { toValue: 1, duration: 250, useNativeDriver: true })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(this.state.raAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 11 }),
        Animated.spring(this.state.menuMove, { toValue: 0, useNativeDriver: true })
      ]).start();
    }
    this.setState(prevState => {
      return { reportAbuseActive: prevState.reportAbuseActive == 0 ? 1 : 0 }
    });
  }

  openRemoveFriend = async () => {
    if(this.state.removeFriendActive === 0) {
      Animated.spring(this.state.rfAnim, { toValue: 1, useNativeDriver: true, tension: 120, friction: 11 }).start();
      Animated.timing(this.state.menuMove, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    } else {
      Animated.spring(this.state.rfAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 11 }).start();
      Animated.spring(this.state.menuMove, { toValue: 0, useNativeDriver: true }).start();
    }
    this.setState(prevState => {
      return { removeFriendActive: prevState.removeFriendActive == 0 ? 1 : 0 }
    });
  }

  openFriendList = async () => {
    if(this.state.removeFriendActive === 1) this.closeMenuAndRemoveFriend();
    if(this.state.reportAbuseActive === 1) this.closeMenuAndReportAbuse();
    if(this.state.menuActive === 1) this.openMenu();
    if(this.state.modalActive === 1) this.toggleChatOptions();
    if(this.state.friendListActive === 0) {
      Animated.spring(this.state.friendsAnim, {toValue: 1, useNativeDriver: true, tension: 150, friction: 12.5 }).start();
      Animated.timing(this.state.body, { toValue: 2, useNativeDriver: true, duration: 200 }).start();
    } else {
      Animated.spring(this.state.friendsAnim, {toValue: 0, useNativeDriver: true, tension: 150, friction: 12.5 }).start();
      Animated.timing(this.state.body, { toValue: 1, useNativeDriver: true, duration: 125 }).start();
    }
    this.setState(prevState => {
      return {
        friendListActive: prevState.friendListActive == 0 ? 1 : 0 
      }
    });
    Keyboard.dismiss();
    if(this.state.modalAnim._value === 1) {
      Animated.spring(this.state.modalAnim, { toValue: 0, useNativeDriver: true }).start();
    }
  }

  closeMenuAndRemoveFriend = async () => {
    Animated.spring(this.state.menuAnim, { toValue: 0, useNativeDriver: true, tension: 100, friction: 10 }).start();
    Animated.spring(this.state.rfAnim, { toValue: 0, useNativeDriver: true }).start();
    Animated.spring(this.state.menuMove, { toValue: 0, useNativeDriver: true }).start();
    this.setState(prevState => {
      return { menuActive: prevState.menuActive == 0 ? 1 : 0 }
    });
  }

  closeMenuAndReportAbuse = async () => {
    Animated.spring(this.state.menuAnim, { toValue: 0, useNativeDriver: true, tension: 100, friction: 10 }).start();
    Animated.spring(this.state.raAnim, { toValue: 0, useNativeDriver: true }).start();
    Animated.spring(this.state.menuMove, { toValue: 0, useNativeDriver: true }).start();
    this.setState(prevState => {
      return { menuActive: prevState.menuActive == 0 ? 1 : 0 }
    });
  }

  toggleChatOptions = async (e, person) => {
    if(person !== undefined) {
      this.setState({currentFriendSelection: person});
    }
    if(this.state.modalActive === 0) {
      Animated.spring(this.state.modalAnim, { toValue: 1, useNativeDriver: true }).start();
      this.setState({ modalActive: 1 });
    } else {
      Animated.spring(this.state.modalAnim, { toValue: 0, useNativeDriver: true }).start();
      this.setState({ modalActive: 0});
    }
  }

  openChat = () => {
    const chats = this.state.openChats;
    const cf = this.state.currentFriendSelection;
    const check = checkIndexOf(chats, cf);
    let ns;
    if(check.bool) {
      const r = update(chats, {$splice: [[check.pos, 1]]});
      ns = update(r, {$unshift: [cf]});
    } else {
      ns = update(chats, {$unshift: [cf]});
    }
    this.toggleChatOptions();
    setTimeout(() => { this.openFriendList() }, 300);
    setTimeout(() => {
      this.setState({ openChats: ns }, () => {
        if(this.state.unread.indexOf(cf._id) !== -1) {
          Meteor.call('user.removeNew', cf._id, (err, res) => {
            if(err) console.log(err);
          });
        }
      });
    }, 500)
  }

  closeChat = () => {
    const chats = this.state.openChats;
    const u = update(chats, {$splice: [[0, 1]]});
    this.setState({openChats: u});
  }

  displayConnecting = async () => {
    Animated.parallel([
      Animated.timing(this.state.scale, { toValue: 1, duration: 0, useNativeDriver: true }),
      Animated.timing(this.state.dim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(this.state.with, { toValue: 1, delay: 500, useNativeDriver: true }),
      Animated.spring(this.state.hangUp, { toValue: 1, delay: 700, tension: 5, friction: 4.5, useNativeDriver: true }),
      Animated.spring(this.state.accept, { toValue: 1, delay: 800, tension: 5, friction: 4.5, useNativeDriver: true })
    ]).start();
    this.setState({ connectingActive: true });
  }

  hideConnecting = async () => {
    Animated.parallel([
      Animated.spring(this.state.accept, { toValue: 0, tension: 5, friction: 4.5, useNativeDriver: true }),
      Animated.spring(this.state.hangUp, { toValue: 0, tension: 5, friction: 4.5, delay: 100, useNativeDriver: true }),
      Animated.spring(this.state.with, { toValue: 0, delay: 300, useNativeDriver: true }),
      Animated.timing(this.state.dim, { toValue: 0, duration: 300, delay: 500, useNativeDriver: true }),
      Animated.timing(this.state.scale, { toValue: 0, duration: 0, delay: 800, useNativeDriver: true })
    ]).start(() => {
      this.setState({initializingCall: false, connectingActive: false, remote: this.state.local}, () => {
        this.ring.stop();
      });
    });
  }

  callInProgress = async () => {
    Animated.parallel([
      Animated.spring(this.state.hangUp, { toValue: 1, tension: 5, friction: 4.5, delay: 100, useNativeDriver: true }),
      Animated.spring(this.state.with, { toValue: 0, delay: 300, useNativeDriver: true }),
      Animated.timing(this.state.dim, { toValue: 0, duration: 300, delay: 0, useNativeDriver: true }),
    ]).start(() => {this.ring.stop()});
  }

  openCall = () => {
    this.toggleChatOptions();
    this.setState({ initializingCall: true });
    setTimeout(() => { this.openFriendList() }, 300);
    setTimeout(() => { 
      Meteor.call('user.getPeerId', this.state.currentFriendSelection._id, (err, res) => {
        if(err) { console.log(err); } else { this.setUpCall(res); }
      });
    }, 500);
  }

  setUpCall = (res) => {
    this.displayConnecting();
    this.playRing();
    Peer.startCall(res);
    this.setState({ initializingCall: true, remote: null });
  }

  playRing = async () => {
    this.ring.play((success) => {
      if (success) { } else { this.ring.reset() }
    });
  }

  getLocalStream = () => {
    MediaStreamTrack
      .getSources()
      .then(sourceInfos => {
        // console.log(sourceInfos);
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
            videoSourceId = sourceInfo.id;
          }
        }
        return getUserMedia({
          audio: true,
          video: {
            // mandatory: {
            //   minWidth: this.props.width,
            //   minHeight: this.props.height,
            //   minFrameRate: 30
            // },
            facingMode: 'user',
            optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
          }
        });
      })
      .then(stream => {
        this.setState({ local: stream.toURL(), remote: stream.toURL() });
        Peer.setLocalStream(stream);
        this.initPeer();
      })
      .catch(err => {
        console.log(err);
        Meteor.call('user.updatePresence', (err, res) => {
          if(err) console.log(err);
        });
      });
  }

  initPeer = () => {
    Peer.init(Meteor.userId());
    this.socket = Peer.socket;
    this.socket.on('offer', (offer) => {
      // console.log('receiving an offer');
      if(Peer.accepted === null || Peer.accepted === false) {
        this.displayConnecting();
        this.playRing();
      }
      this.offer = offer;
    });
    this.socket.on('accepted', (id) => {
      console.log('offer was accepted', id);
      Peer.accepted = true;
      Meteor.call('user.getPeerId', id, (err, res) => {
        if(err) { console.log(err) } else { Peer.startCall(res) }
      });
    });
    this.socket.on('answer', () => {
      if(Peer.peerConnection) {
        Peer.peerConnection.onaddstream = this.setRemoteStream;
      }
    })
    this.socket.on('candidate', () => {
      if(Peer.accepted) this.callInProgress();
      if(Peer.peerConnection) {
        Peer.peerConnection.onaddstream = this.setRemoteStream;
      }
    });
    this.socket.on('friendConnectionError', (err) => this.displayConnectionError(err));
    this.socket.on("connect", () => this.setState({canMakeCalls: true}));
    this.socket.on("connect_failed", () => this.setState({canMakeCalls: false}));
    this.socket.on('disconnect', () => this.setState({canMakeCalls: false}));
    this.socket.on('remoteStream', (stream) => {
      console.log('receiving remote stream', stream);
      this.setState({ remote: stream.toURL() });
    });
    this.socket.on('endChat', (res) => this.terminatePeer());
  }

  setRemoteStream = (e) => {
    this.setState({ remote: e.stream.toURL() }, () => {
      this.callInProgress();
      this.ring.stop();
    });
  }

  acceptCall = () => {
    this.ring.stop();
    Peer.accepted = true;
    this.socket.emit('accepted', { to: Peer.sendAnswerTo, from: Meteor.userId()});
    this.setState({ initializingCall: true });
  }

  endCall = () => {
    console.log('called endCall');
    const other = Peer.receivingUser === null ? Peer.sendAnswerTo : Peer.receivingUser;
    this.socket.emit('endChat', other);
    this.terminatePeer();
  }

  terminatePeer = () => {
    if(Peer.peerConnection) Peer.peerConnection.close();
    Peer.receivingUser = null;
    Peer.sendAnswerTo = null;
    Peer.accepted = null;
    this.hideConnecting();
  }

  displayConnectionError = (err) => {
    this.setState({connectionError: err});
    Animated.parallel([
      Animated.spring(this.state.errorScale, {toValue: 1, useNativeDriver: true}),
      Animated.spring(this.state.errorTranslate, {toValue: 1, useNativeDriver: true})
    ]).start();
  }

  dismissConnectionError = () => {
    Animated.parallel([
      Animated.spring(this.state.errorScale, {toValue: 0, useNativeDriver: true}),
      Animated.spring(this.state.errorTranslate, {toValue: 0, useNativeDriver: true})
    ]).start(() => {
      this.endCall();
    });
  }

  render = () => {
    return (
      <View style={styles.container}>
        <LinearGradient
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%'
          }}
          colors={['#139A8F', '#0F776E']}>
          <StatusBar
             barStyle="light-content" />

          {
            this.state.rp &&
            <Login 
              user={this.state.user}
              width={this.state.width}
              height={this.state.height}
              loggedIn={this.state.loggedIn} />
          }

          {
            !this.state.rp &&
            <ActivityIndicator
              color="#fff"
              size="large"
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2
              }}>
            </ActivityIndicator>
          }

          {
            this.state.rp && 
            <Header
              openMenu={this.openMenu}
              raActive={this.state.reportAbuseActive}
              rfActive={this.state.removeFriendActive}
              menuActive={this.state.menuActive}
              openFriendList={this.openFriendList}
              unread={this.state.unread} />
          }
              
          {
            this.state.loggedIn &&
            <Dashboard 
              height={this.state.height}
              anim={this.state.body}
              width={this.state.width}
              local={this.state.local}
              remote={this.state.remote}
              scale={this.state.scale}
              dim={this.state.dim}
              with={this.state.with}
              acceptAnim={this.state.accept}
              hangUpAnim={this.state.hangUp}
              endCall={this.endCall}
              acceptCall={this.acceptCall}
              hideConnecting={this.hideConnecting}
              initializingCall={this.state.initializingCall}
              currentFriend={this.state.currentFriendSelection}
              getLocalStream={this.getLocalStream}
              initPeer={this.initPeer}
              connectionError={this.state.connectionError}
              errorScale={this.state.errorScale}
              errorTranslate={this.state.errorTranslate}
              dismissConnectionError={this.dismissConnectionError} />
          }

          {
            this.state.loggedIn &&
            <Menu 
              height={this.state.height}
              user={this.state.user}
              active={this.state.menuActive}
              menuAnim={this.state.menuAnim}
              menuMove={this.state.menuMove}
              openRA={this.openReportAbuse}
              openRF={this.openRemoveFriend}
              openMenu={this.openMenu}/>
          }

          {
            this.state.loggedIn &&
            <ReportAbuse
              height={this.state.height}
              raAnim={this.state.raAnim}
              openRA={this.openReportAbuse} />
          }

          {
            this.state.loggedIn &&
            <RemoveFriend
              height={this.state.height}
              friends={this.state.friends}
              rfAnim={this.state.rfAnim}
              openRF={this.openRemoveFriend} />
          }

          {
            this.state.loggedIn &&
            <FriendList
              height={this.state.height}
              friends={this.state.friends}
              requests={this.state.requests}
              sentRequests={this.state.sentRequests}
              users={this.state.users}
              states={this.props.states}
              anim={this.state.friendsAnim}
              toggleChatOptions={this.toggleChatOptions}
              unread={this.state.unread} />
          }

          <Modal 
            anim={this.state.modalAnim}
            toggleChatOptions={this.toggleChatOptions}
            openChat={this.openChat}
            openCall={this.openCall}
            states={this.props.states}
            currentFriend={this.state.currentFriendSelection}
            canMakeCalls={this.state.canMakeCalls} />

          {
            this.state.loggedIn &&
            this.state.openChats.length > 0 &&
            <Chat 
              height={this.state.height}
              name={this.state.openChats[0].name}
              id={this.state.openChats[0]._id}
              image={this.state.openChats[0].image}
              openChats={this.state.openChats}
              messages={this.props.messages}
              closeChat={this.closeChat}
              unread={this.state.unread}
              connectingActive={this.state.connectingActive} />
          }
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: this.height,
    backgroundColor: '#2F3034',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative'
  },
});
