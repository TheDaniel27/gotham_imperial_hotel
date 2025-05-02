var CACHE_NAME = "gih-cache";//// Define el nombre que tendrá la caché donde guardaremos los archivos.


// Define una lista (array) de las URLs de los archivos que queremos guardar
// para que estén disponibles sin conexión (precaching).
var CACHED_URLS = [
  "/index-offline.html",
  "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
  "/css/gih-offline.css",
  "/img/jumbo-background-sm.jpg",
  "/img/logo-header.png"
];

self.addEventListener("install", function(event) {//// Es el momento ideal para preparar todo, como guardar archivos en caché.
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {  // Abre (o crea si no existe) la caché con el nombre que definimos antes.
      return cache.addAll(CACHED_URLS);
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(//asegurar que la instalación no termine hasta que el cacheo se complete.
    fetch(event.request).catch(function() {//Intenta obtener la respuesta desde la RED.
      return caches.match(event.request).then(function(response) {//buscar una respuesta en caché que coincida con una solicitud.
        if (response) {
          return response;// Si encontramos una respuesta en caché, la devolvemos.
        } else if (event.request.headers.get("accept").includes("text/html")) {// Si encontramos una respuesta en caché, la devolvemos. 
          return caches.match("/index-offline.html");
        }
      });
    })
  );
});