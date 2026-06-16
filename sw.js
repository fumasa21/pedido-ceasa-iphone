const CACHE_NAME = "pedido-ceasa-iphone-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./apple-touch-icon.png",
  "./assets/product-images/2001-abacate.png",
  "./assets/product-images/2004-berga-pokan.png",
  "./assets/product-images/2007-caqui-branco.png",
  "./assets/product-images/2010-suco.png",
  "./assets/product-images/2011-ceu.png",
  "./assets/product-images/2012-laranja-umbigo.png",
  "./assets/product-images/2013-umbigo-importada.png",
  "./assets/product-images/2014-limao.png",
  "./assets/product-images/2017-melao-rei.png",
  "./assets/product-images/2018-fuji.png",
  "./assets/product-images/2019-gala.png",
  "./assets/product-images/2021-manga.png",
  "./assets/product-images/2022-maracuja.png",
  "./assets/product-images/2023-formosa-capixaba.png",
  "./assets/product-images/2024-papaia-capixaba.png",
  "./assets/product-images/2025-moranguinho.png",
  "./assets/product-images/2025-moranguinho-extra.png",
  "./assets/product-images/2030-pera-importada.png",
  "./assets/product-images/2043-uva.png",
  "./assets/product-images/2044-melao-espanhol-barato.png",
  "./assets/product-images/2056-caqui-chocolate.png",
  "./assets/product-images/2059-caqui-mel.png",
  "./assets/product-images/2066-berga-cai.png",
  "./assets/product-images/2041-abacaxi-graudo.png",
  "./assets/product-images/380-melancia.png",
  "./assets/product-images/1474-uva-sem-semente.png",
  "./assets/product-images/3002-abobrinha.png",
  "./assets/product-images/3003-alho.png",
  "./assets/product-images/3004-cebola-roxa.png",
  "./assets/product-images/3005-batata-branca.png",
  "./assets/product-images/3008-batata-doce-rosa.png",
  "./assets/product-images/3009-berinjela.png",
  "./assets/product-images/3011-cebola-cx3.png",
  "./assets/product-images/3012-cenoura-top-papelao.png",
  "./assets/product-images/3013-chuchu.png",
  "./assets/product-images/3014-gengibre.png",
  "./assets/product-images/3015-moranga-cabutia.png",
  "./assets/product-images/3016-pepino-salada.png",
  "./assets/product-images/3017-pepino-japones.png",
  "./assets/product-images/3018-pimentao-verde.png",
  "./assets/product-images/3019-pimentao-colorido.png",
  "./assets/product-images/3020-pinhao-top.png",
  "./assets/product-images/3021-rabanete.png",
  "./assets/product-images/3022-tomate-lv.png",
  "./assets/product-images/3023-tomate-rasteiro.png",
  "./assets/product-images/3028-tomate-italiano.png",
  "./assets/product-images/3029-beterraba-molho.png",
  "./assets/product-images/4000-alface-crespa.png",
  "./assets/product-images/4001-alface-lisa.png",
  "./assets/product-images/4003-alface-americana.png",
  "./assets/product-images/4005-tempero-verde.png",
  "./assets/product-images/4006-salsa.png",
  "./assets/product-images/4008-rucula.png",
  "./assets/product-images/4011-espinafre.png",
  "./assets/product-images/4012-couve-folha.png",
  "./assets/product-images/4013-couve-manteiga.png",
  "./assets/product-images/4015-couve-flor.png",
  "./assets/product-images/4016-brocolis.png",
  "./assets/product-images/4017-alho-poro.png",
  "./assets/product-images/4018-milho-verde.png",
  "./assets/product-images/4019-repolho-verde.png",
  "./assets/product-images/4020-repolho-roxo.png",
  "./assets/product-images/4021-tomate-cereja-bdj.png",
  "./assets/product-images/4022-vagem-bdj-c6.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
