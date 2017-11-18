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

export { alphabetize, checkIndexOf }