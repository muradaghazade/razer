(function() {
    function enableMiniCart() {
        // var searchParams = new URLSearchParams(location.search)
        var minicartContainers = document.querySelectorAll('.MiniCart');
        var returnVal = false;

        if ( /* +searchParams.get('mc') === 1 && */ minicartContainers.length > 0) {

            minicartContainers.forEach(element => {

                element.classList.add('enabled');
                returnVal = returnVal || true;
            })
        }

        return returnVal;
    }

    var e = document.createElement('script');
    e.async = true;
    e.src = 'https://sso-static.razer.com/sso-1.3.0.min.js'; // production

    if (enableMiniCart()) {
        document.getElementById('razer').appendChild(e);
    }

}());

window.RzSdk = async function() {
    rz.init({
        // client_id: 'a998637ab863975b4dc14fa02b7c68b32477285d', // support
        client_id: 'c839026333341c074b79b27149f3783215c27663', // s2
        client_key: '',
        scope: 'openid profile cop sso email',
        // scope: 'cop sso',
    });
    const razerIdToken = Cookies.get('razerid_token') ? JSON.parse(Cookies.get('razerid_token')) : undefined;
    if (!razerIdToken || Date.now() >= razerIdToken.expire_ts) {
        // console.log(`rz verify`)
        await rz.verify();
    } else {
        window.razerid_token = razerIdToken
        updateLoginLogout()
        getCart()
    }
};

window.setInfo = function(info) {
    if (!info.error) {
        expire_ts = (info.expires_in * 1000) + Date.now()
        var inFiveMinutes = new Date(new Date().getTime() + 5 * 60 * 1000);
        window.razerid_token = { ...info,
            expire_ts
        }
        Cookies.set('razerid_token', { ...info,
            expire_ts
        }, {
            expires: inFiveMinutes,
            secure: true
        })
        updateLoginLogout()
        getCart()
    } else {
        getCart()
    }
};

window.cart = {
    "items": [],
    "totalItems": 0,
};

window.support = {
    "configs": [{
            basestore: 'razerUs',
            locale: null,
            lang: 'en',
            api: {
                lang: 'en_US',
                curr: 'USD'
            }
        },
        {
            basestore: 'razerCa',
            locale: 'ca-en',
            lang: 'en',
            api: {
                lang: 'en_CA',
                curr: 'CAD'
            }
        },
        {
            basestore: 'razerUk',
            locale: 'gb-en',
            lang: 'en',
            api: {
                lang: 'en_GB',
                curr: 'GBP'
            }
        },
        {
            basestore: 'razerFr',
            locale: 'fr-fr',
            lang: 'fr',
            api: {
                lang: 'fr_FR',
                curr: 'EUR'
            }
        },
        {
            basestore: 'razerEu',
            locale: 'eu-en',
            lang: 'en',
            api: {
                lang: 'en_EU',
                curr: 'EUR'
            }
        },
        {
            basestore: 'razerDe',
            locale: 'de-de',
            lang: 'de',
            api: {
                lang: 'de_DE',
                curr: 'EUR'
            }
        },
        {
            basestore: 'razerSg',
            locale: 'sg-en',
            lang: 'en',
            api: {
                lang: 'en_SG',
                curr: 'SGD'
            }
        },
        {
            basestore: 'razerHk',
            locale: 'hk-zh',
            lang: 'zh',
            api: {
                lang: 'zh_HK',
                curr: 'HKD'
            }
        },
    ]
};

/**
 * Get configuration by basestore
 *
 * @param {string} basestore - Selected basestore
 *
 */
function getConfigByBasestore(basestore) {
    const selectedBasestores = ['razerUs', basestore];
    const configs = window ? .support ? .configs.filter(locale => selectedBasestores.includes(locale.basestore));

    return configs.pop();
}

var hasMiniCartWindowEventListener = false;

function miniCartCloseEvent(event) {
    const {
        target
    } = event
    const cartDropDown = document.querySelector('#cartDropDown') || null;
    const miniCartButtonElems = document.querySelectorAll('.MiniCart') || null;
    var hasTargetInMiniCartButtonContiners = false;

    miniCartButtonElems.forEach(element => {
        hasTargetInMiniCartButtonContiners = hasTargetInMiniCartButtonContiners || element.contains(target)
    })

    if (!cartDropDown.contains(target) && !hasTargetInMiniCartButtonContiners) {

        cartDropDown.classList.toggle('cart-open');
        window.removeEventListener('click', miniCartCloseEvent, false);
        hasMiniCartWindowEventListener = false;
    }
}


function miniCartButtonClickEvent(event) {
    const cartDropDown = document.querySelector('#cartDropDown') || null;
    miniCartButton.forEach(button => {
        if (button.ariaExpanded === 'true') {
            button.ariaExpanded = 'false'
        } else {
            button.ariaExpanded = 'true'
        }
    })
    if (cartDropDown) {
        cartDropDown.classList.toggle('cart-open');
    }

    if (cartDropDown.classList.contains('cart-open') && !hasMiniCartWindowEventListener) {
        window.addEventListener('click', miniCartCloseEvent, false);
        hasMiniCartWindowEventListener = true
    } else {
        window.removeEventListener('click', miniCartCloseEvent, false);
        hasMiniCartWindowEventListener = false
    }
}

const miniCartButton = document.querySelectorAll('.mini-cart-icon');

if (miniCartButton.length > 0) {
    miniCartButton.forEach(element => {
        element.addEventListener('click', miniCartButtonClickEvent);
    })
}

function getCart() {
    razerIdToken = undefined
    if (Cookies.get('razerid_token')) {
        razerIdToken = JSON.parse(Cookies.get('razerid_token'))
    }

    var myHeaders = new Headers();
    if (razerIdToken) {
        myHeaders.append("Authorization", `${razerIdToken.token_type} ${razerIdToken.access_token}`);
    }
    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    const {
        basestore = 'razerUs', cart_id = ''
    } = Cookies.get('cartData') ? JSON.parse(Cookies.get('cartData')) : {};
    window.cart.basestore = basestore;
    const config = getConfigByBasestore(window.cart.basestore);
    const endpointUrl = `https://api-p1.phoenix.razer.com/rest/v2/`;
    let cartUserID = 'anonymous';
    let cartQueryString = `fields=DEFAULT%2CpotentialProductPromotions%2CappliedProductPromotions%2CpotentialOrderPromotions%2CappliedOrderPromotions%2Centries(totalPrice(formattedValue)%2Cproduct(images(FULL)%2Cstock(FULL))%2CbasePrice(formattedValue%2Cvalue)%2Cupdateable)%2CtotalPrice(formattedValue)%2CtotalItems%2CtotalPriceWithTax(formattedValue)%2CtotalDiscounts(value%2CformattedValue)%2CsubTotal(formattedValue)%2CdeliveryItemsQuantity%2CdeliveryCost(formattedValue)%2CtotalTax(formattedValue%2C%20value)%2CpickupItemsQuantity%2Cnet%2CappliedVouchers%2CproductDiscounts(formattedValue)%2Cuser&lang=${config.api.lang}&curr=${config.api.curr}`;

    // localize links in mini cart
    document.querySelectorAll('.MiniCart nav > ul a').forEach(aTag => {
        const matached = aTag.href.match(/\/\/(?:www.)?razer.com/);
        const razerIdMatches = aTag.href.match(/\/\/razerid.razer.com/);
        let options = {};
        if (matached) {
            options.type = 'razer.com';
        } else if (razerIdMatches) {
            options.type = 'razerId';
        }
        aTag.href = generateLocalizeUrl(aTag.href, options);
    });

    // .catch(error => console.log('error', error));
    if (cart_id && cart_id.length != 0) {
        let cartUrl = '';

        // const user = window.user ;
        if (razerIdToken && basestore && cart_id) {
            cartUserID = razerIdToken.uuid;
            cartQueryString = `fields=DEFAULT,potentialProductPromotions,appliedProductPromotions(FULL),deliveryAddress(FULL),deliveryMode,potentialOrderPromotions,appliedOrderPromotions(FULL),entries(totalPrice(formattedValue),product(images(FULL),stock(FULL),baseOptions(selected(priceData(FULL)))),basePrice(formattedValue),updateable),totalPrice(formattedValue),totalItems,formattedTotal(FULL),totalPriceWithTax(formattedValue),totalDiscounts(value,formattedValue),subTotal(formattedValue),deliveryItemsQuantity,deliveryCost(FULL),totalTax(FULL),razerSilverTax(FULL),pickupItemsQuantity,net,appliedVouchers,productDiscounts(formattedValue),user,warrantyInfo(DEFAULT,productReferences(target(code,baseOptions(selected(categories(code))),name,price(formattedValue),url)))&lang=${config.api.lang}&curr=${config.api.curr}`;
        }


        cartUrl = `${endpointUrl}${basestore}/users/${cartUserID}/carts/${cart_id}?${cartQueryString}`;

        fetch(cartUrl, requestOptions)
            .then(response => response.text())
            .then(result => {
                order = []
                const {
                    errors,
                    entries
                } = JSON.parse(result)
                if (entries) {
                    for (const entry of entries) {
                        order.push({
                            code: entry.product.code,
                            name: entry.product.name,
                            images: entry.product.images ? entry.product.images.filter(item => item.format === 'thumbnail') : [],
                            quantity: entry.product.quantity,
                            url: entry.product.url
                        })
                    }
                }

                window.cart.items = order
                window.cart.totalItems = order.length

                updateProductDetailMinicart()
                updateItemCount()
            })
            .catch(error => {
                window.cart.items = []
                window.cart.totalItems = 0
                updateProductDetailMinicart()
                updateItemCount()
            });
    }

}

function updateProductDetailMinicart() {
    items = `<li class="m-0 list-group-item d-flex justify-content-center align-items-center ng-star-inserted">
      <div class="media-body">
        <div class="empty-cart-message mt-0 text-center">Your Cart is empty.</div>
      </div>
    </li>`

    cartTemplate = `<div class="empty-cart-message mt-0 text-center">Your Cart is empty.</div>`

    checkout = `
  <div class="col-auto cta-checkout ng-star-inserted">
    <button type="button" class="button-primary ng-star-inserted">
      checkout</button
    ><!---->
  </div>`


    if (window.cart.items.length > 0) {
        items = '';
        displayLimitedItems = window.cart.items.length > 3 ? window.cart.items.slice(0, 3) : window.cart.items

        moreItemsInCart = ` <div class="over-hr ng-star-inserted">
      <span> ${window.cart.items.length - displayLimitedItems.length} more items in your cart </span>
    </div>`

        displayLimitedItems.forEach(element => {
            image = element.images[0];
            items += `
      <li class="list-group-item d-flex justify-content-between align-items-center ng-star-inserted">
        <div class="image-parent">
          <img class="align-self-center ng-star-inserted"
            src="${typeof image !== 'undefined' && 'url' in image ? image.url : ''}"
            alt="${typeof image !== 'undefined' && 'altText' in image ? image.altText : ''}"
          /><!----><!----><!----><!---->
        </div>
        <div class="media-body">
          <span class="media-body-header m-0">${element.name}</span>
          <!---->
        </div>
      </li>`
        })

        cartTemplate = `<ul class="list-group ng-star-inserted">
      ${items}
      ${window.cart.items.length - displayLimitedItems.length > 0 ? moreItemsInCart : ''}
    </ul>`
        document.querySelector('.product-detail-minicart').innerHTML = cartTemplate + checkout
        document.querySelector('.cta-checkout').addEventListener('click', (e) => {
            document.querySelector('.cart-link').click()
        })

    } else {
        document.querySelector('.product-detail-minicart').innerHTML = cartTemplate
    }
}

function updateItemCount() {
    if (window.cart.items.length > 0) {
        document.querySelectorAll('.count').forEach(element => {
            element.innerText = window.cart.items.length
            element.classList.remove('hide')
        })
        return;
    }
    document.querySelectorAll('.count').forEach(element => element.classList.add('hide'));
}

/**
 * Convert URLs to localize URLs
 *
 * @param {string} urlString - URL to localize
 * @param {object} options - Options for URL localization
 * @param {string} options.type - Type of link to localize (razer.com, razerId)
 *
 */
function generateLocalizeUrl(urlString, options) {
    try {
        const {
            type = 'razer.com'
        } = options;
        const config = getConfigByBasestore(window.cart.basestore);
        const url = new URL(urlString);
        switch (type) {
            case 'razer.com':
                if (config.locale && !url.pathname.match(/\/[a-z]{2}-[a-z]{2}\//)) {
                    url.pathname = `/${config.locale}${url.pathname}`;
                }
                break;
            case 'razerId':
                if (config.lang) {
                    url.searchParams.set('l', config.lang);
                }
                break;
            default:
                break;
        }

        return url.toString();
    } catch (error) {
        return urlString;
    }

}

function updateLoginLogout() {
    const loginLink = document.querySelector('.login-link')

    const razerIdToken = window.razerid_token

    if (razerIdToken) {
        const config = getConfigByBasestore(window.cart.basestore);
        loginLink.href = `https://razerid.razer.com/log-out?client_id=c839026333341c074b79b27149f3783215c27663&l=${config.lang}&redirect=${window.location.href}`; // production
        loginLink.innerHTML = `<i class="icons login-icon"></i>  Log Out ${razerIdToken.firstname.toUpperCase()}`
        loginLink.addEventListener('click', function(e) {
            Cookies.remove('razerid_token', {
                path: ''
            })
        })
    } else {
        updatedHref = new URL(loginLink.href)
        updatedHref.searchParams.set('redirect', window.location.href)
        updatedHref.searchParams.set('l', lang)
        loginLink.href = updatedHref.href
    }

    return;
}