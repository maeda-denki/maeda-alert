/* マエダ Alert ── 通知の受け口（Service Worker・Phase B）
   アプリを閉じていても、ここが通知を受け取って表示する。
   ★FB_CONFIG に Firebase の firebaseConfig を貼ると有効になる（空のあいだは何もしない） */
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

var FB_CONFIG = {
      apiKey: "AIzaSyDYj-b1qg_VBM2CsElt7gKnfnEAz-dni2o",
      authDomain: "maeda-alert.firebaseapp.com",
      projectId: "maeda-alert",
      storageBucket: "maeda-alert.firebasestorage.app",
      messagingSenderId: "1077728788153",
      appId: "1:1077728788153:web:d411a7757f143ba5dca568"
    };

if (FB_CONFIG) {
  firebase.initializeApp(FB_CONFIG);
  firebase.messaging();  // 通知の表示とタップ時のリンク（fcm_options.link）はSDKが処理する
}
