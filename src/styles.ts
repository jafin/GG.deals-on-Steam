const CONTENT_CSS = `
:root {
    --priceColor: #BEEE11;
    --hoverPriceColor: #a6cc1b;
    --priceBgColor: #344654;
    --settingAlertBg: #00000000;
}

.ggdeals_dlc_price, .ggdeals_bundle_price {
    line-height: 12px;
    font-size: 11px;
    padding: 1px 3px;
    padding-left: 17px;
    color: var(--priceColor);
    background-color: var(--priceBgColor);
    position: absolute;
    right: 9px;
}

.ggdeals_dlc_price:hover, .ggdeals_bundle_price:hover, .ggdeals_similar_game_price:hover, .ggdeals_lowest .ggdeals_price, .ggdeals_other_cart_price:hover, .ggdeals_recommended_price:hover, .ggdeals_main_recommended_price:hover, .ggdeals_wishlist_price:hover, .ggdeals_main_cart_price:hover {
    color: var(--hoverPriceColor);
}

.ggdeals_dlc_price::before, .ggdeals_bundle_price::before, .ggdeals_other_cart_price::before, .ggdeals_main_recommended_price::before, .ggdeals_recommended_price::before, .ggdeals_similar_game_price::before, .ggdeals_wishlist_price::before, .ggdeals_main_cart_price::before {
    content: "";
    left: 2px;
    position: absolute;
    width: 11px;
    height: 11px;
    background-image: url(https://github.com/Juzlus/GG.deals-on-Steam/blob/server/icons/ggdeals-16x16.png?raw=true);
    background-size: contain;
    background-repeat: no-repeat;
    border-radius: 20%;
}

.ggdeals_similar_game_price, .ggdeals_other_cart_price {
    padding: 11px 4px;
    font-size: 11px;
    position: absolute !important;
    left: 0px;
    bottom: 0;
    z-index: 10 !important;
    color: var(--priceColor);
    padding-left: 22px;
}

.ggdeals_similar_game_price::before, .ggdeals_other_cart_price::before {
    left: 6px;
}

.ggdeals_price_history {
    display: inline-block;
    background-color: rgba(0, 0, 0, 0.2);
    margin-bottom: 10px;
    font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
    color: rgb(198, 212, 223);
    display: flex;
    border-radius: 4px;
    padding: 8px 16px;
    gap: 10px;
}

.ggdeals_price_history .ggdeals_lowest {
    color: rgb(143, 152, 160);
    font-style: italic;
    font-size: 12px;
}

.ggdeals_price_history:hover .ggdeals_current {
    text-decoration: underline;
}

.ggdeals_price_history:hover .ggdeals_lowest {
    color: #c6d4df;
}

.ggdeals_price_history:hover img {
    opacity: 1;
    transition: 0.2s opacity;
}

.ggdeals_price_history img {
    width: 32px;
    height: 32px;
    opacity: 0.5;
    transition: 0.2s opacity;
    background-repeat: no-repeat;
    background-position: center;
}

.ggdeals_price {
    color: var(--priceColor);
}

.ggdeals_price_diff {
    font-size: 11px;
    opacity: 0.7;
}

.ggdeals_recommended_price {
    line-height: 12px;
    font-size: 11px;
    padding: 1px 3px 2px 17px;
    color: var(--priceColor);
    background-color: var(--priceBgColor);
    left: -3px;
    position: relative;
    top: -45px;
    float: right;
}

.ggdeals_recommended_price::before {
    height: 12px;
}

.ggdeals_main_recommended_price {
    line-height: 16px;
    font-size: 13px;
    margin-top: 8px;
    display: inline-block;
    padding: 3px 5px 1px 22px;
    color: var(--priceColor);
    background-color: var(--priceBgColor);
    position: relative;
}

.ggdeals_main_recommended_price::before {
    width: 13px;
    height: 13px;
    left: 4px;
    top: 3px;
}

.ggdeals_wishlist_price, .ggdeals_main_cart_price {
    position: absolute;
    display: inline-block;
    right: 0px;
    font-size: 15px;
    color: var(--priceColor);
    background-color: var(--priceBgColor);
    text-decoration: none;
    padding: 4px;
    padding-left: 23px;
    border-radius: 1px;
    top: -36px;
}

.ggdeals_wishlist_price::before, .ggdeals_main_cart_price::before {
    left: 4px;
    width: 15px;
    height: 15px;
    top: 7px;
}

.ggdeals_wishlist_priceBox {
    position: absolute;
    right: 16px;
    margin-top: 11px;
}

#ggdeals_settings_btn {
    display: inline-block;
    width: 46px;
    height: 24px;
    background-color: rgba(103,112,123,.2);
    margin: 0px 7px;
    transition: background-color .2s ease-in-out;
    cursor: pointer;
    position: relative;
}

#ggdeals_settings_btn:hover {
    background-color: #3d4450;
    transition: background-color .2s ease-in-out;
}

#ggdeals_settings_btn::before {
    content: "";
    background-image: url(https://raw.githubusercontent.com/Juzlus/GG.deals-on-Steam/refs/heads/server/icons/ggdeals_logo_white.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: absolute;
    width: 20px;
    height: 20px;
    opacity: 0.6;
    margin-left: 13px;
    margin-top: 2px;
}

#ggdeals_settings_btn::after {
    content: "";
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: var(--settingAlertBg);
    opacity: 0.6;
    margin-left: 35px;
    margin-top: 5px;
}

.ggdeals_main_cart_price {
    top: 26px;
    right: 15px;
}

.ggdeals_other_cart_price {
    background-color: black;
}

.ggdeals_other_cart_price::before {
    top: 13px;
}

.ggdeals_search_prices {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
    gap: 4px;
    padding: 2px 0;
}

.ggdeals_search_price_official,
.ggdeals_search_price_keyshop {
    line-height: 12px;
    font-size: 11px;
    padding: 1px 3px 1px 17px;
    color: var(--priceColor);
    background-color: var(--priceBgColor);
    white-space: nowrap;
    position: relative;
    display: block;
    text-decoration: none;
}

.ggdeals_search_price_official:hover,
.ggdeals_search_price_keyshop:hover {
    color: var(--hoverPriceColor);
}

.ggdeals_search_price_official::before,
.ggdeals_search_price_keyshop::before {
    content: "";
    left: 2px;
    position: absolute;
    width: 11px;
    height: 11px;
    background-image: url(https://github.com/Juzlus/GG.deals-on-Steam/blob/server/icons/ggdeals-16x16.png?raw=true);
    background-size: contain;
    background-repeat: no-repeat;
    border-radius: 20%;
}

.ggdeals_search_price_official::after {
    content: "official";
    font-size: 8px;
    opacity: 0.6;
    margin-left: 3px;
}

.ggdeals_search_price_keyshop::after {
    content: "key";
    font-size: 8px;
    opacity: 0.6;
    margin-left: 3px;
}

.ggdeals_search_prices--single .ggdeals_search_price_official::after,
.ggdeals_search_prices--single .ggdeals_search_price_keyshop::after {
    display: none;
}

.search_result_row .col.search_name {
    width: 175px !important;
}

.tab_item.tablet_list_item .discount_block {
    right: 110px;
}

.ggdeals_bundle_price {
    font-size: 13px;
    padding: 3px 6px;
    right: 18px;
    top: 31px;
    z-index: 999;
    padding-left: 24px;
}

.ggdeals_bundle_price::before {
    left: 6px;
    width: 13px;
    height: 13px;
    top: 1.2px;
}
`;

const SETTINGS_CSS = `
.ggdeals-settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 100000;
    display: flex;
    justify-content: center;
    align-items: center;
}

.ggdeals-settings-panel {
    all: initial;
    display: block;
    background-color: #1b2838;
    color: #DCDEDF;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    line-height: 1.4;
    width: 750px;
    max-height: 85vh;
    overflow-y: auto;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
}

.ggdeals-settings-panel *, .ggdeals-settings-panel *::before, .ggdeals-settings-panel *::after {
    box-sizing: border-box;
}

.ggdeals-settings-panel header {
    background-color: #171d25;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 8px 8px 0 0;
}

.ggdeals-settings-panel header h1 {
    color: #DCDEDF;
    font-size: 24px;
    margin: 0;
}

.ggdeals-close-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #ccc;
    font-size: 20px;
    cursor: pointer;
}

.ggdeals-close-btn:hover {
    color: white;
}

.ggdeals-settings-panel main {
    padding: 0 30px 30px;
}

.ggdeals-settings-panel h3 {
    font-size: 22px;
    border-bottom: 1px solid #ccc;
    margin: 15px 0; 10px 0;
    padding-bottom: 6px;
}

.ggdeals-row {
    display: flex;
    gap: 16px;
}

.ggdeals-row > .optionBlock {
    flex: 1;
    min-width: 0;
}

.ggdeals-settings-panel .optionBlock {
    display: block;
    margin: 15px 0;
}

.ggdeals-settings-panel p {
    font-size: 16px;
    margin: 0;
}

.ggdeals-settings-panel small {
    font-size: 12px;
    opacity: 0.8;
}

.ggdeals-settings-panel input[type="password"],
.ggdeals-settings-panel input[type="text"],
.ggdeals-settings-panel select {
    width: 100%;
    padding: 5px;
    border: none;
    border-radius: 3px;
    font-size: 13px;
    margin: 10px 0;
    cursor: pointer;
    background-color: rgba(103, 193, 245, 0.2);
    color: #67c1f5;
    box-shadow: 1px 1px 0px rgba(103, 193, 245, 0.15);
    appearance: none;
    box-sizing: border-box;
}

.ggdeals-settings-panel input:focus,
.ggdeals-settings-panel select:focus {
    outline: none;
}

.ggdeals-settings-panel select option {
    background-color: rgba(43, 71, 94);
    border: none;
}

.ggdeals-show-key {
    float: right;
    background-color: transparent;
    border: none;
    color: #ccc;
    cursor: pointer;
}

.ggdeals-settings-panel a:link,
.ggdeals-settings-panel a:visited {
    color: #67c1f5;
    text-decoration: none;
}

.ggdeals-settings-panel a:hover {
    text-decoration: underline;
}

.ggdeals-checkbox-group label {
    font-size: 13px;
    display: flex;
    align-items: center;
    cursor: pointer;
    width: 100%;
    line-height: 28px;
    margin-bottom: 2px;
    border-radius: 3px;
    transition: all 0.1s ease-in-out;
    padding: 0 10px;
    box-sizing: border-box;
}

.ggdeals-checkbox-group label:hover {
    background-color: #4e5157;
    color: white;
}

.ggdeals-checkbox-group label.checked {
    background-color: #67c1f588;
    color: white;
}

.ggdeals-checkbox-group label input[type="checkbox"] {
    display: none;
}

.ggdeals-checkbox-group label span {
    padding: 0 10px;
    color: inherit !important;
}

.ggdeals-checkbox-group label span.desc {
    margin-left: auto;
    opacity: 0.6;
    text-align: right;
    max-width:550px;
}

.ggdeals-btn {
    border: none;
    border-radius: 3px;
    cursor: pointer;
    padding: 5px 10px;
    margin: 8px 0;
    background-color: rgba(103, 193, 245, 0.2);
    color: #67c1f5;
    box-shadow: 1px 1px 0px rgba(103, 193, 245, 0.15);
    transition: all 0.1s ease-in-out;
    font-size: 13px;
}

.ggdeals-btn:hover {
    background-color: #67c1f5;
    color: white;
}

.ggdeals-colors {
    display: flex;
    gap: 16px;
    margin: 10px 0;
}

.ggdeals-colors > div {
    flex: 1;
}

.ggdeals-colors input[type="color"] {
    width: 100%;
    height: 30px;
    padding: 2px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    background-color: rgba(103, 193, 245, 0.2);
    transition: all 0.1s ease-in-out;
}

.ggdeals-colors input[type="color"]:hover {
    background-color: #67c1f5;
}
`;

export function injectStyles(): void {
  const style = document.createElement('style');
  style.textContent = CONTENT_CSS + SETTINGS_CSS;
  document.head.appendChild(style);
}
