const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/logo.svg'
];

// 서비스 워커 설치 및 파일 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then((cache) => {
      console.log('캐시 저장 완료');
      return cache.addAll(urlsToCache);
    })
  );
});

// 네트워크 요청 가로채기 (캐시에서 제공)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      return response || fetch(event.request);
    })
  );
});

// 새로운 서비스 워커 활성화 및 기존 캐시 삭제
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
    .then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
