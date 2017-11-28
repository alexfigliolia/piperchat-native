import Meteor from 'react-native-meteor';
import update from 'immutability-helper';

const checkSelfFriend = async (path) =>{
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
    return unique;
  }
}

const sortFriendsUnread = async (unread, friends) => {
  for(let i = 0; i<friends.length; i++) {
    for(let j = 0; j<unread.length; j++) {
      if(friends[i]._id === unread[j]) {
        const r = update(friends, {$splice: [[i, 1]]});
        const ns = update(r, {$unshift: [friends[i]]});
        return ns;
      }
    }
  }
}

function alphabetize(arr){
	return arr.sort((a, b) => {
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  });
}

function checkIndexOf(arr, obj){
	let exists = false;
	let index = null;
	for(let i = 0; i<arr.length; i++) {
    if(arr[i]._id === obj._id) {
    	exists = true;
    	index = i;
    	break;
    }
  }
  return {bool: exists, pos: index };
}

export { checkSelfFriend, sortFriendsUnread, alphabetize, checkIndexOf }