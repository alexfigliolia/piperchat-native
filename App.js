import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Animated,
  Dimensions,
  Keyboard
} from 'react-native';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Dashboard from './components/dashboard/Dashboard';
import Menu from './components/menu/Menu';
import FriendList from './components/friendList/FriendList';
import ReportAbuse from './components/reportAbuse/ReportAbuse';
import RemoveFriend from './components/removeFriend/RemoveFriend';
import Modal from './components/modal/Modal';
import Chat from './components/chat/Chat';
import Meteor, { createContainer } from 'react-native-meteor';
import PushNotification from 'react-native-push-notification';
import StatusBarSizeIOS from 'react-native-status-bar-size';
import update from 'immutability-helper';
import { alphabetize, checkIndexOf } from './components/helpers';
const SERVER_URL = 'ws://piper-rtc.herokuapp.com/websocket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: '100%',
      inCall: false,
      loggedIn: false,
      user: null,
      menuActive: 0,
      reportAbuseActive: 0,
      removeFriendActive: 0,
      friendListActive: 0,
      friends: [],
      sentRequests: [],
      requests: [],
      openChats: [],
      currentFriendSelection: {},
      unread: []
    }
    this.width = null,
    this.height = null,
    this.menuAnim = new Animated.Value(0);
    this.menuMove = new Animated.Value(0);
    this.raAnim = new Animated.Value(0);
    this.rfAnim = new Animated.Value(0);
    this.friendsAnim = new Animated.Value(0);
    this.modalAnim = new Animated.Value(0);
  }

  componentWillMount = () => {
    Meteor.connect(SERVER_URL); 
  }

  componentDidMount = () => {
    const {height, width} = Dimensions.get('window');
    this.width = width;
    // this.height = height;
    this.setState({height})
    PushNotification.configure({
      onNotification: (notification) => {
        console.log('noty: ', notification);
        if(notification.userInteraction) {
          const oc = this.state.openChats;
          const ns = update(oc, {$unshift: [this.props.messages[this.props.messages.length - 1].from]});
          console.log(ns);
          this.setState({openChats: ns});
        }
      }
    });
    StatusBarSizeIOS.addEventListener('willChange', this.adjustHeight);
  }

  componentWillUnmount = () => {
    StatusBarSizeIOS.removeEventListener('willChange', this.adjustHeight);
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps);
    if(nextProps.user === null || nextProps.id === null) {
      this.getAuth();
    } else {
      this.letEmIn(nextProps);
      const buddyList = nextProps.buddyList[0];
      const unread = nextProps.user.newMessages;
      if(unread !== undefined && unread.length !== 0 && buddyList !== undefined) {
        this.sortFriendsUnread(unread, alphabetize(buddyList.friends));
      }
    }
    if(nextProps.messages.length > 0) {
      this.checkMessages(nextProps.messages);
    }
  }

  getAuth = () => {
    this.setState({ loggedIn: false, friends: [], user: null, search: [], sentRequests: [], requests: [], unread: [], openChats: [], currentFriendSelection: {} });
  }

  letEmIn = (path) => {
    this.setState({
      loggedIn: true,
      user: path.user,
      friends: path.buddyList.length > 0 ? alphabetize(path.buddyList[0].friends) : [],
      search: path.buddyList.length > 0 ? alphabetize(path.buddyList[0].friends) : [],
      sentRequests: path.buddyList.length > 0 ? path.buddyList[0].sentRequests : [],
      requests: path.buddyList.length > 0 ? path.buddyList[0].requests : [],
      unread: path.user.newMessages !== undefined ? path.user.newMessages : []
    });
    if(path.buddyList.length > 0) {
      this.checkSelfFriend(path);
    }
  }

  checkMessages = (messageList) => {
    const last = messageList[messageList.length - 1];
    if(last.to._id === Meteor.userId()) this.sendNotification(last);
  }

  sendNotification = (message) => {
    PushNotification.localNotificationSchedule({
      message: `New message from ${message.from.name}`,
      date: new Date()
    });
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

  openMenu = () => {
    if(this.state.friendListActive === 1) this.openFriendList();
    if(this.state.reportAbuseActive === 1) {
      this.openReportAbuse();
    } else if(this.state.removeFriendActive === 1) {
      this.openRemoveFriend();
    } else {
      this.setState(prevState => {
        if(prevState.menuActive === 0) {
          Animated.spring(this.menuAnim, { toValue: 1, userNativeDriver: true }).start();
        } else {
          Animated.spring(this.menuAnim, { toValue: 0, userNativeDriver: true }).start();
        }
        return { menuActive: prevState.menuActive == 0 ? 1 : 0 }
      });
    }
    Keyboard.dismiss();
  }

  openReportAbuse = () => {
    if(this.state.reportAbuseActive === 0) {
      Animated.spring(this.raAnim, { toValue: 1 }).start();
      Animated.timing(this.menuMove, { toValue: 1, duration: 300 }).start();
    } else {
      Animated.spring(this.raAnim, { toValue: 0, userNativeDriver: true }).start();
      Animated.spring(this.menuMove, { toValue: 0, userNativeDriver: true }).start();
    }
    this.setState(prevState => {
      return { reportAbuseActive: prevState.reportAbuseActive == 0 ? 1 : 0 }
    });
  }

  openRemoveFriend = () => {
    if(this.state.removeFriendActive === 0) {
      Animated.spring(this.rfAnim, { toValue: 1 }).start();
      Animated.timing(this.menuMove, { toValue: 1, duration: 300 }).start();
    } else {
      Animated.spring(this.rfAnim, { toValue: 0, userNativeDriver: true }).start();
      Animated.spring(this.menuMove, { toValue: 0, userNativeDriver: true }).start();
    }
    this.setState(prevState => {
      return { removeFriendActive: prevState.removeFriendActive == 0 ? 1 : 0 }
    });
  }

  openFriendList = () => {
    if(this.state.removeFriendActive === 1) this.closeMenuAndRemoveFriend();
    if(this.state.reportAbuseActive === 1) this.closeMenuAndReportAbuse();
    if(this.state.menuActive === 1) this.openMenu();
    if(this.state.friendListActive === 0) {
      Animated.spring(this.friendsAnim, {toValue: 1}).start();
    } else {
      Animated.spring(this.friendsAnim, {toValue: 0}).start();
    }
    this.setState(prevState => {
      return {
        friendListActive: prevState.friendListActive == 0 ? 1 : 0 
      }
    });
    Keyboard.dismiss();
    if(this.modalAnim._value === 1) {
      Animated.spring(this.modalAnim, { toValue: 0}).start();
    }
  }

  closeMenuAndRemoveFriend = () => {
    Animated.spring(this.menuAnim, { toValue: 0, userNativeDriver: true }).start();
    Animated.spring(this.rfAnim, { toValue: 0, userNativeDriver: true }).start();
    Animated.spring(this.menuMove, { toValue: 0, userNativeDriver: true }).start();
    this.setState(prevState => {
      return { menuActive: prevState.menuActive == 0 ? 1 : 0 }
    });
  }

  closeMenuAndReportAbuse = () => {
    Animated.spring(this.menuAnim, { toValue: 0, userNativeDriver: true }).start();
    Animated.spring(this.raAnim, { toValue: 0, userNativeDriver: true }).start();
    Animated.spring(this.menuMove, { toValue: 0, userNativeDriver: true }).start();
    this.setState(prevState => {
      return { menuActive: prevState.menuActive == 0 ? 1 : 0 }
    });
  }

  toggleChatOptions = (e, person) => {
    if(person !== undefined) {
      this.setState({currentFriendSelection: person});
    }
    if(this.modalAnim._value === 0) {
      Animated.spring(this.modalAnim, { toValue: 1}).start();
    } else {
      Animated.spring(this.modalAnim, { toValue: 0}).start();
    }
  }

  checkSelfFriend = (path) => {
    if(path.users.length > 0) {
      const users = path.users;
      const friends = path.buddyList[0].friends;
      const requests = path.buddyList[0].requests;
      const sent = path.buddyList[0].sentRequests;
      const arr = friends.concat(requests, sent);
      const unique = [];
      for(let i = 0; i<users.length; i++) {
        let isUnique = true;
        for(let j = 0; j<arr.length; j++) {
          if(users[i]._id === arr[j]._id || users[i]._id === Meteor.userId()) {
            isUnique = false;
            break;
          }
        }
        if(isUnique) unique.push(users[i]);
      }
      this.setState({users: unique});
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
    this.setState({openChats: ns}, () => {
      this.toggleChatOptions();
      this.openFriendList();
      if(this.state.unread.indexOf(cf._id) !== -1) {
        Meteor.call('user.removeNew', cf._id, (err, res) => {
          if(err) console.log(err);
        });
      }
    });
  }

  closeChat = () => {
    const chats = this.state.openChats;
    const u = update(chats, {$splice: [[0, 1]]});
    this.setState({openChats: u});
  }

  sortFriendsUnread = (unread, friends) => {
    for(let i = 0; i<friends.length; i++) {
      for(let j = 0; j<unread.length; j++) {
        if(friends[i]._id === unread[j]) {
          const r = update(friends, {$splice: [[i, 1]]});
          const ns = update(r, {$unshift: [friends[i]]});
          this.setState({friends: ns});
        }
      }
    }
  }

  sortFriendsOpenChat = () => {
    for(let i = 0; i<this.state.friends.length; i++) {
      for(let k = 0; k<this.state.openChats.length; k++) {
        if(friends[i]._id === this.state.openChats[k]._id) {
          const r = update(friends, {$splice: [[i, 1]]});
          const ns = update(r, {$unshift: [friends[i]]});
          this.setState({friends: ns});
        }
      }
    }
  }

  updateUnread(){
    const ns = this.state.unread.filter(str => {
      return str !== this.state.currentFriendSelection._id;
    });
    this.setState({unread: ns});
    this.sortFriends(
      ns,
      this.props.buddyList[0].friends
    );
  }

  render = () => {
    return (
      <View style={styles.container}>
        <StatusBar
           barStyle="light-content" />
        <Login 
          user={this.props.user}
          width={this.width}
          height={this.state.height}
          loggedIn={this.state.loggedIn} />
        <Header
          openMenu={this.openMenu}
          raActive={this.state.reportAbuseActive}
          rfActive={this.state.removeFriendActive}
          menuActive={this.state.menuActive}
          openFriendList={this.openFriendList}  />
        <Dashboard 
          height={this.state.height} />
        {
          this.state.loggedIn &&
          <Menu 
            height={this.state.height}
            user={this.state.user}
            active={this.state.menuActive}
            menuAnim={this.menuAnim}
            menuMove={this.menuMove}
            openRA={this.openReportAbuse}
            openRF={this.openRemoveFriend}
            openMenu={this.openMenu}/>
        }

        {
          this.state.loggedIn &&
          <ReportAbuse
            height={this.state.height}
            raAnim={this.raAnim}
            openRA={this.openReportAbuse} />
        }

        {
          this.state.loggedIn &&
          <RemoveFriend
            height={this.state.height}
            friends={this.state.friends}
            rfAnim={this.rfAnim}
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
            anim={this.friendsAnim}
            toggleChatOptions={this.toggleChatOptions}
            unread={this.state.unread}
            resortFriends={this.resortFriends} />
        }

        <Modal 
          anim={this.modalAnim}
          toggleChatOptions={this.toggleChatOptions}
          openChat={this.openChat} />

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
            unread={this.state.unread} />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: this.height,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative'
  },
});

export default AppContainer = createContainer(() => {
  const userSub = Meteor.subscribe('userData');
  const id = Meteor.userId();
  const user = Meteor.user();
  const usersSub = Meteor.subscribe('allUserData');
  const usersState = Meteor.subscribe('userPresence');
  const userBuddyList = Meteor.subscribe('buddyLists');
  const userConversations = Meteor.subscribe('conversations');
  const userMessages = Meteor.subscribe('messages');
  const usersReady = usersSub.ready();
  const statesReady = usersState.ready();
  const buddyListReady = userBuddyList.ready();
  const conversationsReady = userConversations.ready();
  const messagesReady = userMessages.ready();
  const users = Meteor.collection('users').find();
  const states = Meteor.collection('presences').find();
  const buddyList = Meteor.collection('buddyLists').find();
  const conversations = Meteor.collection('conversations').find();
  const messages = Meteor.collection('messages').find({}, {sort: {date: 1}});
  const usersExist = usersReady && !!users;
  const statesExist = usersState && !!states;
  const buddyListExist = buddyListReady && !!buddyList;
  const conversationsExist = conversationsReady && !!conversations;
  const messagesExists = messagesReady && !!messages;
  return {
    id,
    user,
    usersReady,
    statesReady,
    buddyListReady,
    conversationsReady,
    messagesReady,
    usersSub,
    usersState,
    userBuddyList,
    userConversations,
    userMessages,
    usersExist,
    statesExist,
    buddyListExist,
    conversationsExist,
    messagesExists,
    users,
    states,
    buddyList,
    conversations,
    messages
  };
}, App);
