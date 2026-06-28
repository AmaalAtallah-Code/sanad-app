const CACHE_NAME = 'sanad-v1';
// مصفوفة الملفات المرفوعة مباشرة في الواجهة الرئيسية للمستودع
const assets = [
  "./",
  "./index.html",
  "./style.css",
  "./data.js",
  "./app.js",
  "./manifest.json"
];

// مرحلة التثبيت وحفظ الملفات في الكاش
self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// استرجاع الملفات من الكاش لضمان عمل التطبيق بدون إنترنت (Offline)
self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request);
    })
  );
});