# PTT 股票版「低調」爬蟲 - PTTPotentialStockCrawler

這是一個會每天自動幫你查看 PTT 股票版，並且從各種文章留言中，找出被大量網友推薦的「低調優質股」的工具。他會檢查每一天的股版標的文中，是否有鄉民留言「低調」，並計算這隻股票到底有多少人「低調相挺」，再每天寄信到你的信箱，以防你錯過這些低調的訊息。

PS: 這個爬蟲主要使用 Google Apps Script，只要你有 Gmail，就可以透過簡單設定，免費的讓這個工具每天穩定運行。

![那麼在哪裡才能買的到呢](https://i.imgur.com/OLtIEDk.jpg)

設定步驟 1（匯入程式碼）
===
1. Fork 這個 repo 到你自己的 Github 中
2. 到你的 Chrome 線上程式應用商店中下載 [Google Apps Script GitHub 助手](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo?hl=zh-TW&utm_source=chrome-ntp-launcher)，並且依照指示與 Github 之間完成綁定
3. 到 [Google Apps Script 主頁](https://script.google.com/home)中，新建立一個專案
4. 在上方操作欄位中的 Repository 處，找到剛剛 Fork 的 Repo，並且按下「⬇︎」，就會把檔案 Pull 到你的新專案中
![Github Pull示意圖](https://i.imgur.com/1wrYclX.png)
<br>

設定步驟 2（自動寄信功能）
===
1. 在 pttPotentialStockCrawler.gs 檔案中，在第一行中加入自己想要寄信的 Email 對象
2. 在上方操作欄位中找到時鐘圖示，點開後進入「觸發條件」設定，選擇「新增觸發條件」
![找到觸發條件](https://i.imgur.com/1cYr9k6.png)
3. 在選擇要執行的功能中，選擇主要的 Function - pttPotentialStockParser，並且設定時間驅動 > 日計時器 > 你想寄信的時間
<img src="https://i.imgur.com/LjY2NeU.png" alt="觸發條件設定" width="500"/>

設定步驟 3 (寄出第一封信)
===
1. 因為 Google Apps Script 會需要一些權限，才能自動工作，所以需要先跑一次，寄出第一封信
2. 找到上方操作欄位中「選取函式」（在剛剛時鐘旁邊），並且選擇主要的 Function - pttPotentialStockParser，並且按下「▶︎」圖示就會開始跑了
3. 通過 Google Drive, Spreadsheet 等權限設定
4. 信箱中會出現一封「PTT低調清單」！而且之後每天，在指定時間，也都會持續有更新的「PTT低調警報」寄到信箱！
5. 另外，你的 Google Drive 中會出現一個名為「PTT股票版低調爬蟲資料庫」的 Spreadsheet 檔案，用於紀錄每天的低調股，可以用於回測。

信件示意圖
===

![信件示意圖](https://i.imgur.com/4XCHFQM.png)

<br>
<br>

那就祝福大家低調賺到第一桶金啦！
---
PS: 如果覺得有幫助，也麻煩幫我按個星星，讓我有動力來寫更多有趣的免費小工具喔
