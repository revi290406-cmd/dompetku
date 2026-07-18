self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('dompetku-cache').then((cache) => {
            return cache.addAll([
                './',
                'index.html',
                'style.css',
                'script.js',
                'manifest.json'
            ]);
        }).then(() => self.skipWaiting()) // Memaksa aplikasi langsung aktif saat diinstal
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim()); // Langsung mengambil alih kendali browser tanpa refresh
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            // Jika filenya ada di memori HP, langsung tampilkan
            if (response) {
                return response;
            }
            
            // Antisipasi darurat: jika internet mati total, paksa buka halaman utama
            if (e.request.mode === 'navigate') {
                return caches.match('index.html');
            }
            
            return fetch(e.request);
        })
    );
});
