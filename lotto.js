const scriptName="lotto.js";

function response(room, msg, sender, isGroupChat, replier, imageDB) {
	const maxNum = 45;
	const numList = setNumber(maxNum);
	let result = [];
	
   if(msg.indexOf("@로또추첨") == 0) {
	   for(var i = 0 ; i < 6; i++) {
		   var resultIdx = Math.floor(Math.random() * numList.length);   
		   result[i] = numList[resultIdx];
		   numList.splice(resultIdx,1);
	   }
	   
	   replier.reply("이번주 로또 추천:" + result);
   }

  
}

function setNumber(maxNum) {
	var numList = [];
	for(var i = 0 ; i <maxNum; i++) {
		numList[i] = i + 1;  
	}
	
	return numList; 
	
}

