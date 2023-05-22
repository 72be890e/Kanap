(function () {
    window.__product_id =
        new URLSearchParams(document.location.search).get("id") ||
        alert("Mauvaise URL !");

    const BASE_URL = "http://localhost:3000/api";
    /**
     * fetchProduct request the given productID data to the API
     * @param {string} productID - The product id
     * @returns {Object} productContent - The product content
     */
    const fetchProduct = async function (productID) {
        let response = await fetch(`${BASE_URL}/products/${productID}`);
        return await response.json();
    };

    /**
     * addToCart fills or update the current cart
     */
    const addToCart = function () {
        let cart;
        let present = false;
        let orderInfo = collectOrderInfo();

        if (orderInfo.color == "") return;

        if (((cart = localStorage.getItem("cart")), cart)) {
            let items = JSON.parse(cart);

            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (
                    item.productID == orderInfo.productID &&
                    item.color == orderInfo.color
                ) {
                    present = true;
                    if (items[i].quantity + orderInfo.quantity > 100) {
                        alert("Out of stock");
                        return;
                    }
                    items[i].quantity += orderInfo.quantity;
                }
            }

            if (!present) {
                items.push(orderInfo);
            }

            localStorage.setItem("cart", JSON.stringify(items));
        } else {
            if (orderInfo.quantity > 100) {
                alert("Out of stock");
                return;
            }
            localStorage.setItem("cart", JSON.stringify([orderInfo]));
        }
    };
    /**
     * collectOrderInfo query the DOM to extract the infos about and order
     * @returns {Object} orderInfo - the order info object containing the quantity,color and productId
     */
    const collectOrderInfo = function () {
        let orderInfo = {};
        let quantity = document.getElementById("quantity").value;
        let color = document.getElementById("colors").value;

        orderInfo.productID = window.__product_id;
        orderInfo.quantity = parseInt(quantity, 10);
        orderInfo.color = color;

        return orderInfo;
    };

    /**
     * fillProduct fill the product content onto the DOM
     */
    const fillProduct = async function () {
        let productID = window.__product_id;
        let productContent = await fetchProduct(productID);
        let article = document.querySelector("article");

        fillImage(article, productContent);
        fillProductInfo(productContent);
        fillColorSelect(productContent);
    };
    /**
     * fillImage create the image element of a specified product
     */
    const fillImage = function (article, product) {
        let element = article.firstElementChild;
        let image = document.createElement("img");

        image.setAttribute("src", product.imageUrl);
        image.setAttribute("alt", product.altTxt);

        element.appendChild(image);
    };
    /**
     * fillProductInfo fill the product description
     */
    const fillProductInfo = function (product) {
        let title = document.getElementById("title");
        let price = document.getElementById("price");
        let description = document.getElementById("description");

        title.innerText = product.name;
        price.innerText = product.price;
        description.innerText = product.description;
    };
    /**
     * fillColorSelect creates the necessary color select options
     * of the given product
     */
    const fillColorSelect = function (product) {
        let colorSelect = document.getElementById("colors");
        let colorsElement = product.colors.map((color) => {
            let option = document.createElement("option");
            option.setAttribute("value", color);
            option.innerText = color;
            return option;
        });

        colorSelect.append(...colorsElement);
    };
    /**
     * setupCallback adds the 'click' event listener on the addToCart element
     */
    const setupCallback = function () {
        let element = document.getElementById("addToCart");
        element.addEventListener("click", addToCart);
    };

    setupCallback();
    fillProduct();
})();
