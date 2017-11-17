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
import update from 'immutability-helper';
const SERVER_URL = 'ws://piper-rtc.herokuapp.com/websocket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.height = height;
    PushNotification.configure({
      onNotification: function(notification) {
        console.log('noty: ', notification);
        if(notification.userInteraction) {
          const oc = this.state.openChats;
          const ns = update(oc, {$unshift: [this.props.messages[this.props.messages.length - 1].from]});
          console.log(ns);
          this.setState({openChats: ns});
        }
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(nextProps);
    if(nextProps.user === null) {
      this.getAuth();
    } else {
      this.letEmIn(nextProps);
    }
    if(nextProps.messages.length > 0) {
      this.checkMessages(nextProps.messages);
    }
  }

  getAuth = () => {
    this.setState({ loggedIn: false, friends: [], user: null });
  }

  letEmIn = (path) => {
    this.checkSelfFriend(path);
    this.setState({
      loggedIn: true,
      user: path.user,
      friends: path.buddyList.length > 0 ? path.buddyList[0].friends.sort((a, b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      }) : [],
      search: path.buddyList.length > 0 ? path.buddyList[0].friends.sort((a, b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      }) : [],
      sentRequests: path.buddyList.length > 0 ? path.buddyList[0].sentRequests : [],
      requests: path.buddyList.length > 0 ? path.buddyList[0].requests : []
    });
  }

  checkMessages = (messageList) => {
    if(messageList[messageList.length - 1].from._id !== Meteor.userId() &&
      messageList[messageList.length - 1].to._id === Meteor.userId()) 
    {
      this.sendNotification(messageList[messageList.length - 1]);
      const ur = this.state.unread;
      const ns = update(ur, {$push: [messageList[messageList.length - 1]]});
      this.setState({unread: ns});
    }
    //CREATE COLLECTION OR PIECE OF USER OBJECT THAT CAN TRACK UNREAD MESSAGES
    //FOR NOTIFICATIONS
  }

  sendNotification = (message) => {
    PushNotification.localNotificationSchedule({
      message: `New message from ${message.from.name}`,
      date: new Date()
    });
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

  openChat = () => {
    const chats = this.state.openChats;
    const u = update(chats, {$unshift: [this.state.currentFriendSelection]});
    this.setState({openChats: u}, () => {
      this.toggleChatOptions();
      this.openFriendList();
      this.removeFromUnread();
    });
  }

  closeChat = () => {
    const chats = this.state.openChats;
    const u = update(chats, {$splice: [[0, 1]]});
    this.setState({openChats: u});
  }

  removeFromUnread = () => {
    const ur = this.state.unread;
    const ns = ur.filter(message => {
      return message.from._id !== this.state.currentFriendSelection._id;
    });
    this.setState({unread: ns});
  }

  render = () => {
    return (
      <View style={styles.container}>
        <StatusBar
           barStyle="light-content" />
        <Login 
          user={this.props.user}
          width={this.width}
          height={this.height} />
        <Header
          openMenu={this.openMenu}
          raActive={this.state.reportAbuseActive}
          rfActive={this.state.removeFriendActive}
          menuActive={this.state.menuActive}
          openFriendList={this.openFriendList}  />
        <Dashboard 
          height={this.props.height} />
        {
          this.state.loggedIn &&
          <Menu 
            height={this.height}
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
            height={this.height}
            raAnim={this.raAnim}
            openRA={this.openReportAbuse} />
        }

        {
          this.state.loggedIn &&
          <RemoveFriend
            height={this.height}
            friends={this.state.friends}
            rfAnim={this.rfAnim}
            openRF={this.openRemoveFriend} />
        }

        {
          this.state.loggedIn &&
          <FriendList
            height={this.height}
            friends={this.state.friends}
            requests={this.state.requests}
            sentRequests={this.state.sentRequests}
            users={this.state.users}
            states={this.props.states}
            anim={this.friendsAnim}
            toggleChatOptions={this.toggleChatOptions}
            unread={this.state.unread} />
        }

        <Modal 
          anim={this.modalAnim}
          toggleChatOptions={this.toggleChatOptions}
          openChat={this.openChat} />

        {
          this.state.loggedIn &&
          this.state.openChats.length > 0 &&
          <Chat 
            height={this.height}
            name={this.state.openChats[0].name}
            id={this.state.openChats[0]._id}
            image={this.state.openChats[0].image}
            openChats={this.state.openChats}
            messages={this.props.messages}
            closeChat={this.closeChat} />
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
