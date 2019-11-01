const scriptName="link.js";
const fileName = "link.txt";
const adminRoom = ['포고 모임방', 'Risen','제주방 사진링크봇'];
var linkArray = [];


function response(room, msg, sender, isGroupChat, replier, imageDB) {
   
   if(adminRoom.find(name=>{
	   return name == room ? true : false ; 
   })) {
	   
	   if(linkArray.length == 0 ) {
		   
		   makeCommand(); 
	   } 
	   
	   
	   if(msg.indexOf("/") == 0) {
		   if(msg.indexOf("/입력 ") == 0) {
			   Log.d("ㄴㅇㄹㅇㄹ");
			   var newObj = {}; 
			   var argument = msg.replace("/입력 ",'');
			   newObj.name = argument.split("|")[0];
			   newObj.url = argument.split("|")[1];
			   linkArray.push(newObj);
			   DataBase.appendDataBase(fileName,"\n" + argument + "#$");
			   Log.d(newObj.name +"을(를)" + newObj.url + "로 기록하였습니다.");
		   } else if(msg.indexOf("/삭제 ") == 0){
			   let idx = -1; 
			   var argument = msg.replace("/삭제 ",'');
			   for(var i = 0; i < linkArray.length; i++) {
				   var obj = linkArray[i]
				   Log.d(obj.name + ":" + argument);
				   if(obj.name.trim() === argument.trim()) {
					   idx = i ; 
					   Log.d(idx);
					   break; 
				   }
			   }
			   if(idx > -1) {
				   linkArray.splice(idx, 1);
				   DataBase.setDataBase(fileName,linkArray.join("#$\n"));
				   Log.d(argument +"를 삭제했습니다.");
			   }
			   
		   } else if(room != '제주방 사진링크봇' && msg == "/목록") {
			   var result = "";
			   for(var i = 0; i<linkArray.length; i++){
					var obj  = linkArray[i];
					result += obj.name.trim() +"\n";
			   }
			   
			   replier.reply(result);
		   }
	   } else if(room != '제주방 사진링크봇') {
		   var obj = isCommand(msg);
		   if(obj.name != undefined) {
			   replier.reply(obj.url);
		   }
	   }
   }
}

function isCommand(data) {
	var result = new Object(); 
	for(var i = 0; i<linkArray.length; i++){
		var obj  = linkArray[i];
		if(obj.name.trim() === data.trim()) {
			result = obj;
			break;
		}
	}
	
	return result;
	
}
function makeCommand() {
	var dataArray = readData(fileName);
	dataArray.splice(dataArray.length-1, 1);
	dataArray.forEach(function(cmd){
		var linkInfo = {}; 
		linkInfo.name = cmd.split("|")[0] + "";		
		linkInfo.url = cmd.split("|")[1] + "";
		linkArray.push(linkInfo);
	});
    
}
				 
function readData(fileName) {
	
	let f =  DataBase.getDataBase(fileName);
	if(f != null) {
		 return f.toString().split("#$");
	}else { 
		return null; 
	}
}
	  
