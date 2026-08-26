/* マエダ Alert ── 通知の受け口（Service Worker・Phase B）
   アプリを閉じていても、ここが通知を受け取って表示し、タップでアプリを開く。
   ▼2026-08-26 自前実装に全面書き換え（依存ゼロ）
     理由：Firebase v10のcompat部品は中でwindowを参照しており、Service Workerでは
     評価した瞬間に落ちる（「CORS-cross-origin」等の誤表示の正体）。部品を読まなければ
     この問題ごと消える。通知の表示とタップ処理は下の素のWeb Push APIで足りる。 */

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

// 通知が届いたら表示する（GAS側は notification{title,body} と data.link を入れて送る）
self.addEventListener('push', function (e) {
  var p = {};
  try { p = e.data ? e.data.json() : {}; } catch (err) {}
  var n = p.notification || {};
  var d = p.data || {};
  var title = n.title || d.title || 'マエダ Alert';
  var opts = {
    body: n.body || d.body || '',
    icon: n.icon || './icon-192.png',
    badge: './icon-192.png',
    tag: 'maeda-alert',            // 同時多発時は最新1件にまとめる（音は毎回鳴る）
    renotify: true,
    data: { link: d.link || (p.fcmOptions && p.fcmOptions.link) || './' }
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

// 通知をタップ → 開いているアプリがあれば前面に、なければ開く
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var link = (e.notification.data && e.notification.data.link) || './';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ('focus' in list[i]) { list[i].navigate && list[i].navigate(link); return list[i].focus(); }
      }
      if (self.clients.openWindow) return self.clients.openWindow(link);
    })
  );
});
