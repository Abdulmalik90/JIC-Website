self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("portal-cache").then((cache) => {
      return cache.addAll(["/", "/index.html", "/404.html"]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
