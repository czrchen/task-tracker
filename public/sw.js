if (!self.define) {
  let e,
    s = {};
  const n = (n, a) => (
    (n = new URL(n + ".js", a).href),
    s[n] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = n), (e.onload = s), document.head.appendChild(e);
        } else (e = n), importScripts(n), s();
      }).then(() => {
        let e = s[n];
        if (!e) throw new Error(`Module ${n} didn’t register its module`);
        return e;
      })
  );
  self.define = (a, t) => {
    const i =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[i]) return;
    let c = {};
    const r = (e) => n(e, i),
      o = { module: { uri: i }, exports: c, require: r };
    s[i] = Promise.all(a.map((e) => o[e] || r(e))).then((e) => (t(...e), c));
  };
}
define(["./workbox-4754cb34"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/4bd1b696-deba172d32c79f82.js",
          revision: "deba172d32c79f82",
        },
        {
          url: "/_next/static/chunks/609-3ce10297dc1d604c.js",
          revision: "3ce10297dc1d604c",
        },
        {
          url: "/_next/static/chunks/794-e02d285919b32be1.js",
          revision: "e02d285919b32be1",
        },
        {
          url: "/_next/static/chunks/83-a664c0c18bbb6592.js",
          revision: "a664c0c18bbb6592",
        },
        {
          url: "/_next/static/chunks/899.1813981119fa1f8a.js",
          revision: "1813981119fa1f8a",
        },
        {
          url: "/_next/static/chunks/966.1775eb621d8d3e09.js",
          revision: "1775eb621d8d3e09",
        },
        {
          url: "/_next/static/chunks/app/_global-error/page-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-200d05ccb1660f46.js",
          revision: "200d05ccb1660f46",
        },
        {
          url: "/_next/static/chunks/app/api/addEvents/%5Bid%5D/route-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/app/api/addEvents/route-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/app/api/events/route-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/app/api/modifyEvents/%5Bid%5D/route-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/app/api/semesters/route-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/app/api/user/%5Bid%5D/route-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/app/layout-7b1d2a6f419c544a.js",
          revision: "7b1d2a6f419c544a",
        },
        {
          url: "/_next/static/chunks/app/page-ba41678f14d35c05.js",
          revision: "ba41678f14d35c05",
        },
        {
          url: "/_next/static/chunks/framework-d7de93249215fb06.js",
          revision: "d7de93249215fb06",
        },
        {
          url: "/_next/static/chunks/main-a1542a0757805119.js",
          revision: "a1542a0757805119",
        },
        {
          url: "/_next/static/chunks/main-app-453fa3c229d70b17.js",
          revision: "453fa3c229d70b17",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/app-error-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/forbidden-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/global-error-86fe6579e3830e6a.js",
          revision: "86fe6579e3830e6a",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/not-found-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/next/dist/client/components/builtin/unauthorized-be65f3b1536c0a6d.js",
          revision: "be65f3b1536c0a6d",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-a3ae7aaa81e2bd3c.js",
          revision: "a3ae7aaa81e2bd3c",
        },
        {
          url: "/_next/static/css/cf810893c0a8f28b.css",
          revision: "cf810893c0a8f28b",
        },
        {
          url: "/_next/static/uBtavLwjAVsraPssXUiHs/_buildManifest.js",
          revision: "a73cd17eb564680a61a7ab23a5de79a9",
        },
        {
          url: "/_next/static/uBtavLwjAVsraPssXUiHs/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        {
          url: "/icons/icon-192.png",
          revision: "338181bcddad160739f520a6650d80d9",
        },
        {
          url: "/icons/icon-512.png",
          revision: "cf4dd22df37e51cab969eddd443fb04f",
        },
        { url: "/manifest.json", revision: "a80a81cf5fbc7b8101d875948e52025b" },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: n,
              state: a,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
