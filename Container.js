import Meteor, { createContainer } from 'react-native-meteor';
import App from './App';

export default AppContainer = createContainer(() => {
  const userSub = Meteor.subscribe('userData');
  const id = Meteor.userId();
  const user = Meteor.user();
  const usersSub = Meteor.subscribe('allUserData');
  const usersState = Meteor.subscribe('presences');
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