const scriptName="pogoAdmin.js";
//const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
const nickFile = "raid.txt";
const adminRoom = ['포고 모임방', '제주 포고 단톡방들 비번 알려주는방','Risen','테스트테스트','제주 화북 삼양(삼화) 포켓몬고']
const admin = ['Risen','인군','곰플','만쉐','밍몽','피곤한 몽이','랴밍','라이슨'];
var pk = 0; 
var raidList = null;

function response(room, msg, sender, isGroupChat, replier, imageDB) {
   
   var commandArray = msg.split(" ");
   var command = commandArray[0];
   var argument = commandArray[1];
   var argument2 = commandArray[2];
   
   
   if(adminRoom.find(name=>{
	   return name == room ? true : false ; 
   })) {
	   if(msg.indexOf("/") == 0){
		  let cmd = msg.replace("/","");
		  raidList = readData(nickFile);
		  if(isNum(cmd)) {
			  
			  for(var i=0;  i < raidList.length; i++) {
				  var contents = (raidList[i] + '').split("\n");
				  let idx = (contents[0] + '').substring(0,(contents[0] + '').indexOf("."));
					if(cmd == idx) {
						replier.reply(raidList[i])
						break;
					}
			  }
			  
		  } else if(msg.indexOf("/등록 ") == 0){
			   let name ="";
			   let place ="";
			   let time = "";
			   let stime = "";
			   let join ="";
			   
			   argument = msg.split("/등록 ");
			  
			   if(argument[1] != null ) {
				   let content = argument[1].split(",")
				   if(content.length != 4) {
					   replier.reply("올바른 양식을 입력하세요.\n/등록 5성 아머드뮤츠,세븐일레븐00점,1711,1730")
				   }else {
				   name = content[0];
				   place = content[1];
				   
				   time = (content[2] + "").replace(/\s/gi, "");   
				   stime = (content[3] + "").replace(/\s/gi, "");   
				   
				   if(isNum(time.substring(0,2))){
					if(time.indexOf("시") == -1){
					   
						time = time.length < 4 ? '0'+ time : time; 
						time = time.substring(0,2) + "시" + time.substring(2,4)  + "분";   
					}
				   } 
				   if(isNum(stime.substring(0,2))){
				   
				   if(stime.indexOf("분") == -1){
					stime = stime.length < 4 ? '0'+ stime: stime; 
					   stime = stime.substring(0,2) + "시" + stime.substring(2,4)  + "분";
				   }
				}
				   join = content[4] != undefined ? content[4] : "";
				   
				   var txt = pk + "." + name + "\n장소:" + place + "\n부화시간:" + time + 
				   "\n시작시간:"+ stime + "\n인원:" + join +"\n등록자:" + getNickName(sender) +"\n\n";
				   DataBase.appendDataBase(nickFile,txt);
				   replier.reply("등록되었습니다.\n" + txt);
				   raidList = readData(nickFile);
				   pk++;
				
			  }
				   
			   }else {
				   
				   replier.reply("올바른 양식을 입력하세요.\n/등록 5,세븐일레븐00점,0411,0430")
			   }
		   }
		   else if(msg.indexOf("/보기") == 0) {
			   raidList = readData(nickFile);
			   if(raidList != ""){
				var simpleList = new Array(); 
				raidList.forEach(function(raid){
					let content = (raid + "").split("\n");
					if(content[3] != undefined) {
						var s = (content[3] + "").replace("시작시간:","").trim();
						if(isNum(s.substring(0,2))){
							let stDate = s.replace("시","").replace("분","");
							if( !isEnd(stDate)) {
								let title = content[0] +" " + (content[1]+"").replace("장소:","") +":" + stDate ;
								simpleList.push(title);
							}
						} else {
								let title = content[0] +" " + (content[1]+"").replace("장소:","") +":" + (content[3] + "").replace("시작시간:","") ;
								simpleList.push(title);
						} 			

					}
												
				});
				if(simpleList.length > 0 )
					replier.reply(simpleList.join("\n"));
				else
					replier.reply("예정 된 레이드가 없습니다.");
			   }else {
				   replier.reply("등록 된 레이드가 없습니다.");
			   }
		   }
		   else if(msg.indexOf("/전체보기") == 0) {
			   raidList = readData(nickFile);
			   if(raidList != ""){			
				   replier.reply(raidList.join("\n\n"));
			   }else {
				   replier.reply("등록 된 레이드가 없습니다.");
			   }
		   }
		   else if(msg.indexOf("/양식") == 0) {
			   var msg = "/등록 5성 아머드뮤츠,세븐일레븐 00점,1611,1630 \n /보기 (간략한 리스트로보기 현재시간 기준 끝난 레이드는 보이지않음)\n /전체보기\n /0(상세보기)\n/수정 0,1313 (해당 레이드 시작시간 수정)\n /참가 0,지우4(레이드번호,닉네임[없어도 동작 /참가 0]) \n /불참 0,지우4(레이드번호,닉네임[없어도 동작 /불참 0]) \n /삭제(운영진 또는 등록자만가능)\n /리셋(운영진만가능) \n ※시간은 24시간 기준으로 표시 ex)오후 한시 ->1300";
		    	replier.reply(msg);
		   }
		   else if(msg.indexOf("/참가 ") == 0){
			   argument = msg.split("/참가 ");
			   if(argument[1] != null) {
				   var raidNum = argument[1].split(",")[0];
				   var name = argument[1].split(",")[1];
				   if(name != undefined) {
					   if(!isNotNum(raidNum)){
					   raidList.forEach(function(raid, index){
						  if(!isNotNum(raidNum) && raidNum == (raid+'').split('.')[0]) {
							   var content = raid.split("\n");
							   content[4] =  content[4] +","+  name.trim();
							   raidList[index] = content.join("\n"); 
							   DataBase.setDataBase(nickFile,raidList.join("\n\n")); 
							   replier.reply(raidList[index]);   
						  }    });
				   		} else {
						  replier.reply("참가 할 레이드 번호를 선택해주세요");
					  }
				   }
				   else {
					   if(!isNotNum(raidNum)){
						   raidList.forEach(function(raid, index){
							  if(!isNotNum(raidNum) && raidNum == (raid+'').split('.')[0]) {
								   var content = raid.split("\n");
								   content[4] =  content[4] +","+  getNickName(sender);
								   raidList[index] = content.join("\n"); 
								   DataBase.setDataBase(nickFile,raidList.join("\n\n")); 
								   replier.reply(raidList[index]);   
							  }    });
					   		} else {
							  replier.reply("참가 할 레이드 번호를 선택해주세요");
						  }
				   }
			   }else {
				   replier.reply("레이드번호와 참가자 명을 입력해주세요.");
			   }
			   
		   }
		   else if(msg.indexOf("/불참 ") == 0){
			   argument = msg.split("/불참 ");
			   if(argument[1] != null) {
				   var raidNum = argument[1].split(",")[0];
				   var name = argument[1].split(",")[1];
				   if(name != undefined) {
					   if(!isNotNum(raidNum)){
					   raidList.forEach(function(raid, index){
						  if(raidNum == (raid+'').split('.')[0]) {
							   var content = raid.split("\n");						  
							   var nicks= (content[4] +'').trim().split(",");
							   
							   for(var i = 0; i<nicks.length; i++) {
								   if(isSameNick(name,nicks[i])) {
									   content[4] =(content[4]+ '').replace(','+ nicks[i], ''); 
									   raidList[index] = content.join("\n"); 
									   DataBase.setDataBase(nickFile,raidList.join("\n\n")); 
									   replier.reply(raidList[index]);   
								   }
							   }
							 
						  }    });
				   		} else {
						  replier.reply("불참 할 레이드 번호를 선택해주세요");
					  }
				   }
				   else {
					   if(!isNotNum(raidNum)){
						   raidList.forEach(function(raid, index){
							  if(raidNum == (raid+'').split('.')[0]) {
								   var content = raid.split("\n");						  
								   var nicks= (content[4] +'').trim().split(",");
								   for(var i = 0; i<nicks.length; i++) {
									   if(isSameNick(getNickName(sender),nicks[i])) {
										   content[4] =(content[4]+ '').replace(','+ nicks[i], ''); 
										   raidList[index] = content.join("\n"); 
										   DataBase.setDataBase(nickFile,raidList.join("\n\n")); 
										   replier.reply(raidList[index]);   
									   }
								   }
							  }    });
					   		} else {
							  replier.reply("불참 할 레이드 번호를 선택해주세요");
						  }
				   }
			   }else {
				   replier.reply("레이드번호와 참가자 명을 입력해주세요.");
			   }
		   }
		   else if(msg.indexOf("/수정 ") == 0) {
			   argument = msg.replace("/수정 ","");
			   var arg = argument.split(",");
			   if(isNum(arg[0])) {
				   if(arg[1] != undefined && isNum(arg[1]) && raidList != null && arg[1].length == 4 ) {
					   raidList.forEach(function(raid,index,raidList) {
						   var content = raid.split("\n");					   
						   var regId = (content[5]+'').replace("등록자:",'');
						   if(isAllow(regId,getNickName(sender)) && arg[0].trim() === raid.split('.')[0]){
							   let sttime = content[3];
							   content[3] = "시작시간:" + (isNum(arg[1]) == true ? arg[1].substring(0,2) + "시" + arg[1].substring(2,4)  + "분" : arg[1]);
							   raidList[index] = content.join("\n"); 
							   DataBase.setDataBase(nickFile,raidList.join("\n\n")); 
							   replier.reply(raidList[index]);
							   return;
						   }
					   })
					   
					  
				   } else {
					   replier.reply("변경 할 시작시간(4자리)을 입력하세요. ex)/수정 0,1300")
				   }
				   
			   }else {
				   replier.reply("수정 할 레이드 번호를 선택해 주세요.");
			   }
			   
			   
		   }
		   else if(msg.indexOf("/삭제 ") == 0) {
			   argument = msg.split("/삭제 ");
			   if(argument[1] != null) {
				   if(!isNotNum(argument[1]) && raidList != null ) {
					   raidList.forEach(function(raid,index,raidList) {
						   var content = raid.split("\n");					   
						   var regId = (content[5]+'').replace("등록자:",'');
						   if(isAllow(regId,getNickName(sender)) && argument[1].trim() === raid.split('.')[0]){
							   raidList.splice(index,1);
							   DataBase.setDataBase(nickFile,raidList.join("\n\n")); 
							   replier.reply(raid.split('.')[0]+"레이드가 삭제되었습니다.");
							   return; 
						   }
					   })
					   
					  
				   } 
				   
			   }else {
				   replier.reply("레이드 목록을 확인하고 삭제할 레이드 번호를 선택해 주세요.");
			   }
			   
			   
		   }
		   else if(msg.indexOf("/리셋") == 0 && isAllow(getNickName(sender))){
			   DataBase.setDataBase(nickFile,"");
			   raidList = null;
			   pk = 0;
			   replier.reply("데이터가 삭제 되었습니다.");
		   }
	   }
	   }
	  
 
}

function isAllow(name1, name2) {
	var check = false; 
	check = admin.find(name =>{
		   return name == name1 ? true : false ; 
	   });
    if(!check){
    	if(name1 === name2 ) {
    		
    		check = true; 
    	}
    }
	return check; 
}

function isEnd(stTime) {	
	var today = new Date(); 
	var stime = new String(stTime);
	var startDate = new Date(today.getFullYear(),today.getMonth(),today.getDate(),stime.substring(0,2),Number(stime.substring(2,4)) + 1);
	var result = startDate.getTime() > today.getTime() ? false : true;
	
	return result; 
}

function change24Hour(hour) {
	
	var date = new Date();
	if(date.getHours() > 12 && hour < 12) {
		let h = Number(hour);
		h = 12 + h;
		hour = h.toString();
	}
	
	return hour; 
	
}

function isSameNick(name,name2) {
	var regexp = new RegExp(name + "$|" + name + "(?=[0-9])");
	return regexp.test(name2);
}
function isNotNum(str) {
	var num =  str.trim(); 
	var regexp = /^[0-9]*$/;
	return !regexp.test(num);
}

function isNum(str) {
	var num = str.trim(); 
	var regexp = /^[0-9]*$/;
	return regexp.test(num);
}


function getNickName(nick){
	
	 if(/^\[Lv.\d+\/\S+\]\S+/.exec(nick.replace(/\s/gi,"")) != null) {
	   return  nick.substring(7,nick.indexOf('\]'));
	  } else {
		  return nick;
	  }

}


function readData(fileName) {
	
	let f =  DataBase.getDataBase(fileName);
	if(f != null) {
		 return f.toString().split("\n\n");
	}else { 
		return null; 
	}
}
	  
