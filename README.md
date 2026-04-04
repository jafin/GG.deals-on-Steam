<div align="center">
  <img height="200px" src="https://raw.githubusercontent.com/Juzlus/GG.deals-on-Steam/refs/heads/server/icons/2048.png">
</div>

<div align="center">
  <a href="https://github.com/jafin/GG.deals-on-Steam/releases/"><img alt="GitHub release" src="https://img.shields.io/github/release/jafin/GG.deals-on-Steam.svg?style=social"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://github.com/jafin/GG.deals-on-Steam/commits/"><img alt="GitHub latest commit" src="https://img.shields.io/github/last-commit/jafin/GG.deals-on-Steam.svg?style=social&logo=github"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://github.com/jafin/GG.deals-on-Steam/releases/"><img alt="Github all releases" src="https://img.shields.io/github/downloads/jafin/GG.deals-on-Steam/total.svg?style=social"></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://github.com/jafin/GG.deals-on-Steam/stargazers/"><img alt="GitHub stars" src="https://img.shields.io/github/stars/jafin/GG.deals-on-Steam.svg?style=social"></a>
</div>


# About

**GG.deals-on-Steam** is a userscript for [Steam](https://store.steampowered.com) that shows the **current lowest prices** of games from [GG.deals](https://gg.deals), directly on Steam pages.

> [!NOTE]
> The userscript is limited to **1000 price lookups per hour**.

## 🔍 Supported Steam pages
- App page
- Wishlist
- Bundle page
- Cart page
- Search page
- Recommended page


## 📁 How to install

1. Install a userscript manager in your browser:
    - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Edge, Firefox, Opera, Safari)
    - [Greasemonkey](https://www.greasespot.net/) (Firefox)
    - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Edge, Firefox, Opera)
2. Install the userscript from the [latest release](https://github.com/jafin/GG.deals-on-Steam/releases/latest) - click the `.user.js` file and your userscript manager will prompt you to install it
3. Visit any [Steam store](https://store.steampowered.com) page
4. Click the GG.deals settings button in the Steam header to open settings
5. Enter your API key from [gg.deals/api](https://gg.deals/api/)


<!-- ## 🔥 Screenshots -->

<!-- ![Prieview 1](https://github.com/jafin/GG.deals-on-Steam/blob/server/icons/preview_1.png?raw=true)
![Prieview 2](https://github.com/jafin/GG.deals-on-Steam/blob/server/icons/preview_2.png?raw=true)
![Prieview 3](https://github.com/jafin/GG.deals-on-Steam/blob/server/icons/preview_3.png?raw=true)
![Prieview 4](https://github.com/jafin/GG.deals-on-Steam/blob/server/icons/preview_4.png?raw=true)
![Prieview 5](https://github.com/jafin/GG.deals-on-Steam/blob/server/icons/preview_5.png?raw=true) -->

## 🔧 Changes from upstream

This fork converts the original Chrome/Firefox extension into a userscript and modernises the codebase:

- **Converted to userscript** -- no longer requires installing a browser extension; works with Tampermonkey, Greasemonkey, or Violentmonkey
- **Rewritten in TypeScript + Preact** -- built with Vite and [vite-plugin-monkey](https://github.com/nickyam/vite-plugin-monkey), with Preact loaded from CDN
- **Parallel API fetches** -- chunked requests run concurrently via `Promise.all` instead of sequentially
- **1-hour cache staleness** -- cached prices are automatically refreshed after 1 hour, replacing the old rate-limit-based heuristic
- **Price diff display** -- app page now shows the difference between current and historical lowest prices
- **Dual-price search results** -- search page shows both official and keyshop prices side by side
- **Settings panel built in Preact** -- uses `@preact/signals` for reactive state; settings panel is injected directly into the Steam page
- **XSS and security fixes** -- sanitised DOM injection, added `rel="noopener"` to external links
- **CI pipeline** -- GitHub Actions builds the userscript on every push, with git-tag-based versioning (`v1.0.0` for releases, `1.0.0-beta.N` for dev builds)


## 🙏 Credits

This is a fork of the original [GG.deals-on-Steam](https://github.com/Juzlus/GG.deals-on-Steam) by [Juzlus](https://github.com/Juzlus). All credit for the original concept and design goes to them.


## ⚠️ Disclaimer

_This project is not endorsed or affiliated with [GG.deals](https://gg.deals) or [Steam](https://steamcommunity.com). Use at your own risk._
