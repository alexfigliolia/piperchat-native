import React, { Component } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Animated 
} from 'react-native';
import Login from './components/login/Login';
import Header from './components/header/Header';
import Dashboard from './components/dashboard/Dashboard';
import Menu from './components/menu/Menu';
import ReportAbuse from './components/reportAbuse/ReportAbuse';
import RemoveFriend from './components/removeFriend/RemoveFriend';
import Meteor, { createContainer } from 'react-native-meteor';

const SERVER_URL = 'ws://piper-rtc.herokuapp.com/websocket';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      menuActive: 0,
      reportAbuseActive: 0,
      removeFriendActive: 0
    }
    this.menuAnim = new Animated.Value(0);
    this.menuMove = new Animated.Value(0);
    this.raAnim = new Animated.Value(0);
    this.rfAnim = new Animated.Value(0);
  }

  componentWillMount() {
    Meteor.connect(SERVER_URL); 
  }

  componentDidMount() {
    setTimeout(() => { console.log(this.props) }, 5000);
  }

  openMenu = () => {
    if(this.state.reportAbuseActive === 1) {
      this.openReportAbuse();
    } else if(this.state.removeFriendActive === 1) {
      this.openRemoveFriend();
    } else {
      this.setState(prevState => {
        if(prevState.menuActive === 0) {
          Animated.spring(this.menuAnim, { duration: 300, toValue: 1 }).start();
        } else {
          Animated.timing(this.menuAnim, { duration: 350, toValue: 0 }).start();
        }
        return { menuActive: prevState.menuActive == 0 ? 1 : 0 }
      });
    }
  }

  openReportAbuse = () => {
    this.setState(prevState => {
      if(prevState.reportAbuseActive === 0) {
        Animated.spring(this.raAnim, { toValue: 1 }).start();
        Animated.timing(this.menuMove, { toValue: 1, duration: 300 }).start();
      } else {
        Animated.spring(this.raAnim, { toValue: 0 }).start();
        Animated.spring(this.menuMove, { toValue: 0 }).start();
      }
      return { reportAbuseActive: prevState.reportAbuseActive == 0 ? 1 : 0 }
    });
  }

  openRemoveFriend = () => {
    this.setState(prevState => {
      if(prevState.removeFriendActive === 0) {
        Animated.spring(this.rfAnim, { toValue: 1 }).start();
        Animated.timing(this.menuMove, { toValue: 1, duration: 300 }).start();
      } else {
        Animated.spring(this.rfAnim, { toValue: 0 }).start();
        Animated.spring(this.menuMove, { toValue: 0 }).start();
      }
      return { removeFriendActive: prevState.removeFriendActive == 0 ? 1 : 0 }
    });
  }

  render = () => {
    return (
      <View style={styles.container}>
        <StatusBar
           barStyle="light-content"
         />
        <Login />
        <Header
          openMenu={this.openMenu}
          raActive={this.state.reportAbuseActive}
          rfActive={this.state.removeFriendActive} />
        <Dashboard />
        <Menu 
          active={this.state.menuActive}
          menuAnim={this.menuAnim}
          menuMove={this.menuMove}
          openRA={this.openReportAbuse}
          openRF={this.openRemoveFriend} />
        <ReportAbuse
          raAnim={this.raAnim}
          openRA={this.openReportAbuse} />
        <RemoveFriend
          rfAnim={this.rfAnim}
          openRF={this.openRemoveFriend} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  const users = Meteor.collection('allUserData').find();
  const states = Meteor.collection('userPresence').find();
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
