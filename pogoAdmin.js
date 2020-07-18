
const scriptName="pogoAdmin.js";
const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
const nickFile = "data.txt";
const nickFile2 = "data2.txt";
const accountFile = "account.txt";
const adminRoom = ['포고 모임방', '제주 포고 단톡방들 비번 알려주는방','Risen','테스트테스트','pogo admin','관리자방']

function response(room, msg, sender, isGroupChat, replier, imageDB) {

   var commandArray = msg.split(" ");
   var command = commandArray[0];
   var argument = commandArray[1];

   var duplecheck = false;
   var similarcheck = false;
   var similarNick = "";

  var hellomsg ="\n ※입장을 위한 필수절차※ \n"  +
  "1) 어디서 오셨나요~? (제주도민은 활동 지역) \n" +
    "\n (도민-활동지역, 여행객-숙소근처와 여행기간) \n\n"  +
  "2) 이방을 어떻게 알게 되었나요?\n" +
       "  (지인 소개 시 활동 닉네임 기재)\n\n" +
  "3) 본인의 대략적인 나이대\n\n" +
  "4) 트레이너 화면 캡쳐\n" +
  "4) (게임 내 메인화면 왼쪽 하단 트레이너 얼굴 클릭해서 나오는 화면 캡쳐)\n\n" +
  "5) 제주방 양식에 맞춘 프로필 설정\n" +
  "[Lv.00/한글닉네임]활동지역.팀이름\n" +
  "(비번 안내자 프로필 참고)\n\n" +
  "6) 관리자의 안내를 기다려 주세요. 사람이 언제나 있는게 아니라 오래 걸릴 수 있습니다.\n" +
  var hellomsg2 = "\n 본방에 동일한  닉네임이 있습니다. 닉네임을 변경해 주시고 상단의 공지를 읽어주세요 " ;

  if(room != '포고 모임방'){
	if(command.indexOf("안녕하세요") > -1 || command.indexOf("반갑습니다") > -1 || command.indexOf("안녕") > -1) {
	  if(/^\[Lv.\d+\/\S+\]\S+/.exec(sender.replace(/\s/gi,"")) != null) {
		  if(!isSameNick(sender.substring(7,sender.indexOf("\]")))) {
				  replier.reply("안녕하세요 " + sender.substring(7,sender.indexOf('\]')) +"님" + hellomsg);
			}
	  } else {
        if(room == 'pogo admin') {
		  if( !isSameNick(sender)) {
			  replier.reply("안녕하세요 " + sender +"님" + hellomsg );
		  } else{
			  replier.reply("안녕하세요 " + sender +"님" + "\n" + hellomsg2);
        }
      } else {
         replier.reply("안녕하세요." + sender + "님");
      }
	  }
	}
  }
   if(msg == "@업데이트" && getNickName(sender) == ("라이슨" || "Risen")){
      // let cnt = 0;
      // let idx = 0;
      // let check = false;
      // //let rooms = msg.replace(/^@업데이트/, '').split(",");
      //rooms[0] = rooms[0].replace(/ /gi,"");
      // adminRoom.forEach(function(name){
      //    let orgName = rooms[0];
      //    let compareName = name.replace(/ /gi ,"" );
      //    if(orgName === compareName) {
      //       idx = cnt;
      //       check = true;
      //    }
      //    cnt++;
      // })

      // if(check == true) {
      //    adminRoom[idx] = rooms[1];
      //    replier.reply("방이름 변경이 성공했습니다." +"\n" + adminRoom);
      // }else {
      //    replier.reply("방이름 변경 실패");
      // }
      adminRoom.push(room);
      replier.reply("방이름 변경 추가 성공: " + room )

   }

   if(adminRoom.find(name=>{
	   return name == room ? true : false ;
   })) {
   if(command === "@파일읽기") {

      var dataArray = readData("katalkbot","data.txt");

   }
else if(command === "@디비생성") {
    var fileName = "test.txt";
	   DataBase.setDataBase(fileName,"이건테스트야아아아아");
      Log.d("생성완료");

   }
	else if (command ==="@등록") {
		if(argument != undefined) {
	         var userInfo = argument.replace(/\s/gi,"");
	         var searchNick = /^\[Lv.\d+\/\S+\]\S+/.exec(userInfo);
	         var validAccount = funci
				if(searchNick != null) {
			         let dataArray = readData(nickFile);
			         let sameNick = dataArray.find(nick=>{
			             return nick.substring(7,nick.indexOf('\]')) === argument.substring(7,argument.indexOf('\]'))
					})

					if(sameNick == undefined) {
						DataBase.appendDataBase(nickFile,argument + "#$");
						Log.d(sender +"가" + argument +  "을 등록");
			 			replier.reply("등록완료");
					} else {
						replier.reply("중복된 닉네임");
					}

		         }else {
		        	 replier.reply("닉네임 형식이 틀립니다. 올바른 형식으로 입력하세요. [Lv.00/닉네임]제주");
		         }
		}else {

			replier.reply("등록할 닉네임을 입력해 주세요 ");
		}
	}
	else if(command === "@닉삭제") {
		if(argument != undefined) {
			let dataArray = readData(nickFile);
			let sameNick = dataArray.find(nick=>{
				 var searchNick =  /\/\S+\]/.exec(nick);
				 var value = searchNick != null ? searchNick[0].substring(1,searchNick[0].indexOf('\]')) :"";
	             return value === argument;
			})
			Log.d(sameNick);
			if(sameNick != undefined) {
				const nickIndex = dataArray.indexOf(sameNick);
				dataArray.splice(nickIndex, 1);
				var newData = dataArray.map(function(nickname) {
					return nickname  + "#$";
				});
				DataBase.setDataBase(nickFile,newData.join("\n"));
				Log.d(sender +"가" + sameNick +  "을 삭제");
				replier.reply("삭제되었습니다");

			}else {

				replier.reply("등록된 닉네임이 아닙니다.");
			}
		}
	}
   else if(command === "@닉체크" || command ==="@닉") {
         let dataArray = readData(nickFile);

         if (argument != undefined) {
            var name = "";
            for( var i= 0; i < dataArray.length; i ++) {
               var userInfo = dataArray[i];
               var searchNick =  /\/\S+\]/.exec(userInfo);
               var nick = searchNick != null ? searchNick[0].substring(1,searchNick[0].indexOf('\]')) : "";
               if(nick === argument){
                  duplecheck = true;
                  name = userInfo;

                  continue;
               }
                     if(argument.length >= 2 && nick.length >= 2 ){
                        if((argument.search(nick.substring(0,2)) > -1 || nick.substring(0,2).search(argument) > -1 )) {
                           Log.d(argument.search(nick) + ":" + argument + ":" + nick);
                           similarNick = nick + "," + similarNick;
                        }
                     }

            }
            var simmsg = similarNick != "" ?  "\n 유사한 닉네임:" + similarNick  : "";
            if(duplecheck == true) {
               replier.reply("중복 된 닉네임: \n"  + name.replace(/\n/gi,"")  + simmsg);
            } else {
                  replier.reply("중복 된 닉네임 없음 "+ simmsg);

            }
      }else {
         replier.reply("닉네임을 입력해주세요.  ex)@중복체크 닉네임 or @닉 닉네임")
      }
   }
    else if(command == "@데이터체크") {

    Log.d("asdfasdf");
      var dataArray = readData(nickFile2);
      var nickList = "";
      for(var i = 0 ; i < dataArray.length; i++){
         var userInfo = dataArray[i] + "";
         userInfo = userInfo.replace(/\s/gi,"").replace(/\n/g,"");
         var searchNick = /^\[Lv.\d+\/\S+\]\S+/.exec(userInfo);
         var nick = searchNick == null ? userInfo : "";

         if(nick != null && nick.length > 0 ) {
               nickList = nickList + "," +  userInfo
         }
      }
        replier.reply(nickList);
   }
  else if(command == "@양식") {
    	var msg = "0성레이드\n장소:\n부화시간:\n시작시간:\n인원:";
    	replier.reply(msg);
   }
   else if(command == "@절차") {
      replier.reply(hellomsg);
   }
  }

}


// [Lv.40/단톡아이디] 연동 #게임아이디1 #게임아이디2
function checkGameAccount(userInfo) {
    return userInfo.split("#").length > 0
}



function getNickName(nick){
	 if(/^\[Lv.\d+\/\S+\]\S+/.exec(nick.replace(/\s/gi,"")) != null) {
	   return  nick.substring(7,nick.indexOf('\]'));
	  } else {
        return nick;
     }

}

function validAccount(userInfo, ignored) {
    let userInfo.replace(i)

}
function isSameNick(nickname) {
	  let dataArray = readData(nickFile);
	  var same = false;
      var name = "";
      for( var i= 0; i < dataArray.length; i ++) {
         var userInfo = dataArray[i];
         var searchNick =  /\/\S+\]/.exec(userInfo);
         var nick = searchNick != null ? searchNick[0].substring(1,searchNick[0].indexOf('\]')) : "";
         if(nick === nickname){
            same = true;
            break;
         }
      }
      return same;
}

function readData(folderName, fileName) {

   var b = new java.io.File(sdcard + "/" + folderName + "/" + fileName);
   if(!(b.exists())) return null;

   var c = new java.io.FileInputStream(b);
   var d = new java.io.InputStreamReader(c);
   var e = new java.io.BufferedReader(d);
   var f = e.readLine();
   var g = "";

   while((g = e.readLine())!= null) {
      f+="\n" + g;
   }
   c.close();
   d.close();
   e.close();
   return f.toString().split("#$");
}

function readData(fileName) {

	let f =  DataBase.getDataBase(fileName);
	if(f != null) {
		 return f.toString().split("#$");
	}else {
		return null;
	}
}

