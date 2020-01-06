function getWeather() {
  
  // データ取得
  var url = "http://www.jma.go.jp/jp/yoho/333.html";
  var response = UrlFetchApp.fetch(url);
  var data = response.getContentText();

  // weatherごとに分ける　ary[1]が今日の1カラム
  var ary = data.split("<th class=\"weather\">");
  
  // 今日の天気
  var today_info = data.split("<td class=\"info\">");
  today_info_num = today_info[1].indexOf("<br>");
  today_info = "天気　　　　　　:　" + today_info[1].substr(0, today_info_num);
  
  // 18時から24時までの降水確率
  var ary2 = ary[1].split("%");
  ary2.pop();
  var ary3 = [];
  for (var i in ary2) {
    ary3.push(ary2[i].substr(-2)+"%");
  }
  var percent = "降水確率(18-24)　:　"+ary3[3];
  
  //最高気温　記録がない場合は「---」に置き換える
  var max1 = ary[1].split("max")[1].substr(2,3);
  if (max1 == "</t") max = "---";
  var today_max = "\n最高気温　　　　 :　"+max1;
  
  // 今日の分の出力
  var today = today_info + "\n" + today_max + "\n" + percent;
  
  
  
  //明日の天気
  var next_info = data.split("<td class=\"info\">");
  next_info_num = next_info[2].indexOf("<br>");
  next_info = "天気　　　:　" + next_info[2].substr(0, next_info_num);


  // 明日朝最低気温 記録がない場合は「---」に置き換える
  var min = ary[2].split("min")[1].substr(2,3);
  if (min == "</t") min = "---";
  var next_min = "\n最低気温　:　"+min;
  
  // 明日朝最高気温 記録がない場合は「---」に置き換える
  var max2 = ary[2].split("max")[1].substr(2,3);
  if (max2 == "</t") max2 = "---";
  var next_max = "\n最高気温　:　"+max2;
  
  // 明日の分の出力
  var nextday = next_info + "\n" + next_min + "\n" + next_max;
  
  // 概況
  var attention="";
  var overview = data.split("<pre class=\"textframe\">");
  
  //注意、警報があった場合
  if(overview[1].match("<b>")) {
    //　注意・警報開始位置
    attention_startnum = overview[1].indexOf("<b>");
    //　注意・警報終了位置
    attention_endnum = overview[1].indexOf("</b>");    
    attention = "\n注意・警報　: " +  overview[1].slice(attention_startnum+3, attention_endnum) + "\n\n\n";
    
    //　概況開始位置
    overview_startnum = overview[1].indexOf("/b>");
  } else{
    attention = "";
    //　概況開始位置
    overview_startnum = overview[1].indexOf("発表");
  }
  //　概況終了位置
  overview_endnum = overview[1].indexOf("</pre>");
  overview = "概況　：　" + attention + overview[1].slice(overview_startnum+2, overview_endnum);
 
  // Slackへ流す
  var payload = {
  "text" : "\n----- 今日 ----- \n" + overview + "\n\n" + today + "\n\n\n ----- 明日 ----- \n" + nextday + "\n",
  "channel" : "#help-weather",
  "username" : "weather"
  }
  var options = {
    "method" : "POST",
    "payload" : JSON.stringify(payload)
  }
  var url = "https://hooks.slack.com/services/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";
  var response = UrlFetchApp.fetch(url, options);
  var content = response.getContentText("UTF-8");
}
