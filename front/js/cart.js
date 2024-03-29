(function () {
    window.__products = {};

    const BASE_URL = "http://localhost:3000/api/products";
    const ORDER_URL = "http://localhost:3000/api/products/order";
    const ValidationTable = {
        firstName: {
            validate: function (input) {
                // Must not match this regex
                return !/\d/.test(input);
            },
            field: "firstNameErrorMsg",
            message: "Entrez un prénom valide. Pas de chiffre autorisé",
        },
        lastName: {
            validate: function (input) {
                // Must not match this regex
                return !/\d/.test(input);
            },
            field: "lastNameErrorMsg",
            message: "Entrez un nom de famille valide. Pas de chiffre autorisé",
        },
        address: {
            // no-op
            validate: function () {
                return true;
            },
            field: "addressErrorMsg",
            message: "Entrez une adresse valide.",
        },
        city: {
            validate: function () {
                return true;
            },
            field: "cityErrorMsg",
            message: "Entrez une ville valide.",
        },
        email: {
            validate: function (input) {
                return /^[A-Za-z0-9+.-]+@[a-z]+\.[a-z]{2,3}/.test(input);
            },
            field: "emailErrorMsg",
            message: "Adresse email invalide.",
        },
    };
    /**
     * loadAllProducts fetch the api to load all the products
     */
    const loadAllProducts = async function () {
        let response = await fetch(BASE_URL);
        let data = await response.json();

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            window.__products[item._id] = item;
        }
    };
    /**
     * getCartContent fetch the localstorage to retrieve the current cart content
     * @returns {Object} cartContent - Content of the current cart
     */
    const getCartContent = function () {
        let cart;

        if (((cart = localStorage.getItem("cart")), cart)) {
            return JSON.parse(cart);
        }
    };
    /**
     * getInputValue return the ["value"] attribute of a given DOM element
     * @param {String} elementID - The target element ID
     * @returns {String} value - The value
     */
    const getInputValue = function (elementID) {
        return document.getElementById(elementID).value;
    };

    /**
     * modifyCartContent update the cart content of the given productID
     * @param {String} newQuantity - The new quantity after updating the item, if it exceeds or equal to 100 nothing will be done
     * @param {String} productID - The productID of the item to modify
     * @param {String} color - Color of the item to modify
     */
    const modifyCartContent = function (newQuantity, productID, color) {
        let cartItems = getCartContent();

        for (let i = 0; i < cartItems.length; i++) {
            let item = cartItems[i];

            if (
                item.productID == productID &&
                item.color == color &&
                newQuantity < 100
            ) {
                item.quantity = newQuantity;
                cartItems[i] = item;
                localStorage.setItem("cart", JSON.stringify(cartItems));
            }
        }
    };
    /**
     * deleteItem deletes an item from the cart
     * @param {String} productID - The productID of the item to delete
     * @param {String} color - Color of the item to modify
     */
    const deleteItem = function (productID, color) {
        let cartItems = getCartContent();

        for (let i = 0; i < cartItems.length; i++) {
            let item = cartItems[i];

            if (item.productID == productID && item.color == color) {
                cartItems.splice(i, 1);
                localStorage.setItem("cart", JSON.stringify(cartItems));
            }
        }
    };
    /**
     * buildArticle construct the article
     * @param {Object} product - The product object with all the informations about the product
     * @param {Object} orderInfo - Infos about the current order
     * @returns {HTMLElement} container - The DOM element of the article built
     */
    const buildArticle = function (product, orderInfo) {
        let container = document.createElement("article");
        let image = buildArticleImage(product);
        let content = buildArticleContent(product, orderInfo);

        container.classList.add("cart__item");
        container.setAttribute("data-id", orderInfo.productID);
        container.setAttribute("data-color", orderInfo.color);

        container.append(image, content);

        return container;
    };
    /**
     * buildArticleImage construct the article image
     * @param {Object} product - The product object with all the informations about the product
     * @returns {HTMLDivElement} container - The DOM element of the image
     */
    const buildArticleImage = function (product) {
        let container = document.createElement("div");
        let image = document.createElement("img");

        image.setAttribute("src", product.imageUrl);
        image.setAttribute("alt", product.altTxt);

        container.classList.add("cart__item__img");
        container.appendChild(image);

        return container;
    };
    /**
     * buildArticleContent construct the full article content
     * @param {Object} product - The product object with all the informations about the product
     * @param {Object} orderInfo - Infos about the current order
     * @returns {HTMLDivElement} container - The container element which has the description and settings of the product
     */
    const buildArticleContent = function (product, orderInfo) {
        let contentDescription = () => {
            let container = document.createElement("div");
            let title = document.createElement("h2");
            let color = document.createElement("p");
            let price = document.createElement("p");

            container.classList.add("cart__item__content__description");
            title.innerText = product.name;
            color.innerText = orderInfo.color;
            price.innerText = `${product.price},00 €`;

            container.append(title, color, price);

            return container;
        };

        let contentSettings = () => {
            let containerSettings = document.createElement("div");
            let containerQty = document.createElement("div");
            let containerDelete = document.createElement("div");

            containerSettings.classList.add("cart__item__content__settings");
            containerQty.classList.add(
                "cart__item__content__settings__quantity"
            );
            containerDelete.classList.add(
                "cart__item__content__settings__delete"
            );

            let quantity = document.createElement("p");
            let quantityInput = document.createElement("input");
            let deleteText = document.createElement("p");
            let attributes = {
                type: "number",
                name: "itemQuantity",
                min: "1",
                max: "100",
                value: "" + orderInfo.quantity,
            };

            for (let key in attributes) {
                quantityInput.setAttribute(key, attributes[key]);
            }

            quantity.innerText = "Qté : ";
            quantityInput.classList.add("itemQuantity");

            deleteText.classList.add("deleteItem");
            deleteText.innerText = "Supprimer";

            containerDelete.appendChild(deleteText);
            containerQty.append(quantity, quantityInput);

            containerSettings.append(containerQty, containerDelete);

            return containerSettings;
        };

        let container = document.createElement("div");
        let description = contentDescription();
        let settings = contentSettings();

        container.classList.add("cart__item__content");

        container.append(description, settings);

        return container;
    };
    /**
     * calculateQuantity extract the contact details from the DOM and return them
     * @returns {Object} contact- The contact object which contain the email,city,address ...
     */
    const calculateQuantity = function () {
        let totalQuantity = document.getElementById("totalQuantity");
        let totalPrice = document.getElementById("totalPrice");
        let cart = getCartContent();

        let rawQuantity = 0;
        let rawPrice = 0;

        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            const product = window.__products[item.productID];

            rawPrice += item.quantity * product.price;
            rawQuantity += item.quantity;
        }

        totalQuantity.innerText = rawQuantity;
        totalPrice.innerText = `${rawPrice},00`;
    };
    /**
     * getContactDetails extract the contact details from the DOM and return them
     * @returns {Object} contact- The contact object which contain the email,city,address ...
     */
    const getContactDetails = function () {
        return {
            firstName: getInputValue("firstName"),
            lastName: getInputValue("lastName"),
            address: getInputValue("address"),
            city: getInputValue("city"),
            email: getInputValue("email"),
        };
    };
    /**
     * validDetails validates the contact fields
     * @param {Object} contact - The contact object which contain the email,city,address ...
     * @returns {Boolean} valid - wether the details are valid or not
     */
    const validDetails = function (contact) {
        let valid = true;
        const showMessage = function (elementID, message) {
            document.getElementById(elementID).innerText = message;
        };

        for (let entry in ValidationTable) {
            let field = contact[entry];
            let element = ValidationTable[entry];

            if (field === "" || !element.validate(field)) {
                showMessage(element.field, element.message);
                valid = false;
            } else {
                showMessage(element.field, "");
            }
        }

        return valid;
    };
    /**
     * redirectToConfirmation changes the location to the confirmation page of the
     * given order id
     * @param {string} orderID - The order id
     */
    const redirectToConfirmation = function (orderID) {
        window.location.href = `confirmation.html?orderId=${orderID}`;
    };
    /**
     * orderCallback is callback triggered when the order form is submitted
     * it will send the post request to the API
     * @param {Event} event - The click event
     */
    const orderCallback = async function (event) {
        event.preventDefault();
        let contact = getContactDetails();
        let cart = getCartContent();
        let productIDs = cart.map((product) => product.productID);

        if (!validDetails(contact) || productIDs.length == 0) return;

        let response = await fetch(ORDER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contact: contact,
                products: productIDs,
            }),
        });

        let data = await response.json();
        redirectToConfirmation(data.orderId);
    };

    /**
     * changeCallback is callback triggered when a product quantity is changed
     * it will modify the cart content and update the total quantity
     * @param {Event} event - The change event
     */
    const changeCallback = function (event) {
        let closest = event.target.closest(".cart__item");
        let productID = closest.getAttribute("data-id");
        let color = closest.getAttribute("data-color");

        modifyCartContent(parseInt(event.target.value, 10), productID, color);
        // update DOM
        calculateQuantity();
    };
    /**
     * deleteCallback is callback triggered when a delete element is clicked
     * and will delete the closest attributes and re-calculate the quantity
     * @param {Event} event - The click event
     */
    const deleteCallback = function (event) {
        let closest = event.target.closest(".cart__item");
        let productID = closest.getAttribute("data-id");
        let color = closest.getAttribute("data-color");

        deleteItem(productID, color);
        // delete article from DOM
        closest.remove();
        // update DOM
        calculateQuantity();
    };
    /**
     * setupListeners registers all the needed event listeners for the elements targeted
     */
    const setupListeners = function () {
        let elements = document.getElementsByClassName("itemQuantity");
        let deleteElements = document.getElementsByClassName("deleteItem");
        let orderButton = document.getElementById("order");

        orderButton.addEventListener("click", orderCallback);

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];

            element.addEventListener("change", changeCallback);
        }

        for (let i = 0; i < deleteElements.length; i++) {
            let element = deleteElements[i];

            element.addEventListener("click", deleteCallback);
        }
    };

    loadAllProducts().then(() => {
        let cart = document.getElementById("cart__items");
        let cartContent = getCartContent();
        let cartElements = [];

        for (let i = 0; i < cartContent.length; i++) {
            let order = cartContent[i];
            let product = window.__products[order.productID];

            cartElements.push(buildArticle(product, order));
        }

        cart.append(...cartElements);

        setupListeners();
        calculateQuantity();
    });
})();
