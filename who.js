importPackage(org.json);
const scriptName="who.js";

//const scriptName="who.js";
const adminRoom = ['포고 모임방','Risen',"제주방 사진링크봇",'제주 포고 단톡방들 비번 알려주는방','화북방','pogo admin','관리자방']
var dataValue = null; 
var cnt = 0;

function response(room, msg, sender, isGroupChat, replier, imageDB) {


	 if(adminRoom.find(name=>{
		   return name == room ? true : false ; 
	   })) {
		 Log.d("아이디이이이이이:" + findId);
		if(msg.indexOf("@누구 ") == 0) {
			var findId = msg.replace(/[\u3164]|[\s*]/gi, '#');
			findId = findId.replace(/^@누구/,"").replace(/#+/g,'#');
			findId = findId.split("#")[1];
			
			if(findId != undefined) {
				setDataSheet();
				Log.d(cnt);
				var check = false ; 
				var result = "";
				findId = findId.toLowerCase(); 
			    var regex = new RegExp('^' + findId);		
			    Log.d(regex);
				  for(var data of dataValue)  {
					    var pogoId = data[0];
					    var pogoIds = pogoId.toLowerCase();
					    var chatId = data[1];
					    var regresult = regex.exec(pogoIds); 
					   if(regresult != null && regresult.index == 0 ) {
						   check = true; 
						   result = result+ "("+ pogoId+ ")" +  chatId +  "\n"; 
					   }
				  }
				  
				  if(check) {
					   replier.reply("포고 닉네임: \n " +result);
				  }else {
					  replier.reply("등록된 아이디가 아닙니다. ");
				  }
			}else {
				
				 replier.reply("검색할 닉네임을 입력해 주세요. ");
			}
		
		 }
		else if(msg == "@리로드") {
			dataValue = null; 
			setDataSheet(); 
		}
		
	 }
}

function setDataSheet() {
	if(dataValue == null) {
		 var sheet_id = '1vZ_Aq1IoJV1s2nJInARVHnGkH7XrgTStgnhSWN8mtgE';
		  var api_key = 'AIzaSyDibFqgSsj4oRc-tWkPdGs61hTedbKThKM';
		  
		  var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheet_id + '/values/설문지 응답 시트1!B2:C' +"?key=" + api_key;
		  
		  var result = Utils.parse(url).select('body').text();
		  var obj = JSON.parse(result);
		  dataValue = obj.values;	
		  cnt++; 
	}
}
