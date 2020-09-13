//const yourMailLst = ['']
const TEMPLATE_ID = '1N68i5_oEJQ1VlHY-S8V3-iYytnoDzRkvRve6kp0mm_4'

function pttPotentialStockParser() {
  let postObj = {};
  const baseUrl = 'https://www.ptt.cc/';
  let targetUrl = 'bbs/Stock/index.html';
  
  // Set Time Control
  let latestDate = new Date();
  const thisYear = latestDate.getFullYear()
  const endDate = new Date().setDate(latestDate.getDate()-2); // Only fetch the lasest data within 2 days
  
  while(latestDate > endDate){
    let xml = UrlFetchApp.fetch(baseUrl + targetUrl).getContentText();
    targetUrl = xml.replace(/[\s\S]*?最舊<\/a>[\s]*<a class="btn wide" href="([\s\S]*?)">&lsaquo; 上頁<\/a>[\s\S]*/, '$1')
    let titleLst = xml.match(/<div class="title">[\s]*?<a href="([\s\S]*?)">([\s\S]*?)<\/a>[\s\S]*?<div class="date">([\s\S]*?)<\/div>/g)
    for(let no in titleLst){
      let postUrl = titleLst[no].replace(/<div class="title">[\s]*?<a href="([\s\S]*?)">([\s\S]*?)<\/a>[\s\S]*?<div class="date">([\s\S]*?)<\/div>/, '$1')
      let title = titleLst[no].replace(/<div class="title">[\s]*?<a href="([\s\S]*?)">([\s\S]*?)<\/a>[\s\S]*?<div class="date">([\s\S]*?)<\/div>/, '$2')
      //Fetch created date of each post, so that we can tell when should we stop crawling
      let date = titleLst[no].replace(/<div class="title">[\s]*?<a href="([\s\S]*?)">([\s\S]*?)<\/a>[\s\S]*?<div class="date">([\s\S]*?)<\/div>/, '$3') 
      postObj[postUrl] = {title: title, date:date}
      Logger.log(postObj[postUrl])
      
      // Pass 置底公告 and 閒聊區
      if(title.includes('公告') || title.includes('閒聊')) continue;
      
      // The "latestDate" showes that any data before this date has been processed
      latestDate = Date.parse(thisYear + '/' + date)
    }
  }
  
  // Open the document for data recording, if no such file then create one
  const files = DriveApp.getFilesByName('PTT股票版低調爬蟲資料庫')
  if(files.hasNext()){
    var yourSpreadsheetID = files.next().getId();
  }else{
    // Copy db template from existed sheet
    Logger.log("Initial Setting")
    var yourSpreadsheetID = DriveApp.getFileById(TEMPLATE_ID).makeCopy('PTT股票版低調爬蟲資料庫').getId()
    Logger.log("A Spreadsheet has been created for data recording: " + yourSpreadsheetID)
  }
  const doc = SpreadsheetApp.openById(yourSpreadsheetID);
  let mailObj = {}
  
  // So far, we've got a post list with 2 days, now we need to check each post and see if it's a '標的文' or not
  
  for(let postUrl in postObj){
    let postDetail = postObj[postUrl]
    // If this is a "標的文" then start further analyzation
    if(postDetail.title.includes('標的')){
      let postContent = UrlFetchApp.fetch(baseUrl + postUrl).getContentText();
      let potentialScore = 0
      // Examine comments and see if there is the target string '低調'
      let commentLst = postContent.match(/<span class="f3 push-content">[\s\S]*?<\/span>/g)
      for(let commentNo in commentLst){
        if(commentLst[commentNo].includes('低調')) potentialScore += 1
      }
      
      // check if the post has been reocrded and save to Spreadsheet
      var targetRow = onSearch(doc, postUrl, searchTargetCol=0)
      if(targetRow){
        targetRow += 1
        doc.getRange('A' + targetRow + ':D' + targetRow).setValues([[postUrl, postDetail.date, postDetail.title, potentialScore]]) // Write over with lastet data
      }else{
        doc.insertRowBefore(2);
        doc.getRange('A2:D2').setValues([[postUrl, postDetail.date, postDetail.title, potentialScore]])
      }
      
      // Set Mail Content
      mailObj[postUrl] = postObj[postUrl]
      mailObj[postUrl].score = potentialScore
    }
  }
  mailer(yourMailLst, mailObj)
}

// Helping Functuon: Search Certain Column in the Spreadsheet
function onSearch(sheetName, searchString, searchTargetCol) {
  var values = sheetName.getDataRange().getValues();
  for(var i=0; i<values.length; i++) {
    if(values[i][searchTargetCol] == searchString) {return i}
  }
}

// Mailer
function mailer(emailLst, mailObj){
  var title = "PTT低調警報"
  var htmlTemp = HtmlService.createTemplateFromFile('pttPotentialStockEmail')
  htmlTemp.mailObj = mailObj
  var htmlBody = htmlTemp.evaluate().getContent()
  for(no in emailLst){
    let email = emailLst[no]
    Logger.log("Mail to: " + email)
    MailApp.sendEmail(email, title, '', {htmlBody:htmlBody})
  }
}
