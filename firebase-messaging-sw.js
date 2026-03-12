importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyB-URByQJZkJ0pMNJK0qTSzBsVJuy4FNk0",
    authDomain: "anti-planer.firebaseapp.com",
    projectId: "anti-planer",
    storageBucket: "anti-planer.firebasestorage.app",
    messagingSenderId: "235332843252",
    appId: "1:235332843252:web:8e95f47f1736017fcc50a1",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const assetBase = self.location.pathname.replace(/firebase-messaging-sw\.js$/, '');

// 백그라운드 메시지 수신 핸들러 (앱이 꺼져있거나 백그라운드일 때)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background Message received:', payload);
    const notificationTitle = payload?.notification?.title || 'Anti Planer 업데이트';
    const notificationOptions = {
        body: payload?.notification?.body || '새 알림이 도착했습니다.',
        icon: `${assetBase}vite.svg`,
        badge: `${assetBase}vite.svg`,
        data: payload?.data || {},
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = event.notification?.data?.link || `${self.location.origin}${assetBase}`;
    event.waitUntil(clients.openWindow(targetUrl));
});
