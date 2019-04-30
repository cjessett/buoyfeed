/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.0/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.js",
    "revision": "3bc28d41794368619f34e62295ae15ee"
  },
  {
    "url": "public/assets.json",
    "revision": "b426bc0d9131c9825bff61f1f7151714"
  },
  {
    "url": "public/bundle-6c44dc1ff6.css",
    "revision": "6c44dc1ff6569d8d00067d0bc0388a30"
  },
  {
    "url": "public/bundle-844e07a6b3.js",
    "revision": "844e07a6b3d0cae98ef8a2ddbcc30257"
  },
  {
    "url": "public/bundle.css",
    "revision": "6c44dc1ff6569d8d00067d0bc0388a30"
  },
  {
    "url": "public/bundle.js",
    "revision": "844e07a6b3d0cae98ef8a2ddbcc30257"
  },
  {
    "url": "public/manifest-09ca0d1859.json",
    "revision": "09ca0d1859929ef7fce243822c25e98b"
  },
  {
    "url": "public/manifest.json",
    "revision": "09ca0d1859929ef7fce243822c25e98b"
  },
  {
    "url": "worker.js",
    "revision": "8e330417a545b2edd54ec5a42792bb9f"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
