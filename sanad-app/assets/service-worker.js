const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/report.html',
  '/admin.html',
  '/map.html',          // أضفنا صفحة الخريطة
  '/style.css',
  '/app.js',
  '/report.js',
  '/admin.js',
  '/manifest.json',
  '/assets/gaza-map.png' // أضفنا مسار صورة الخريطة المحلية ليتم حفظها في الكاش
];

// 1. حدث التثبيت: حفظ الملفات في الكاش لأول مرة
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('جاري حفظ ملفات تطبيق سند في الكاش المحلي...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. حدث جلب البيانات: تشغيل الملفات من الكاش في حال انقطاع الشبكة
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // إذا كان الملف موجوداً في الكاش، أرجعه فوراً (حتى بدون إنترنت)
      if (cachedResponse) {
        return cachedResponse;
      }
      // إذا لم يكن في الكاش (مثل رابط خارجي)، حاول جلبه من الإنترنت
      return fetch(event.request);
    })
  );
});