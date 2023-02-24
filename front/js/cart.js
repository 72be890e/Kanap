(function () {
    window.__products = {};

    const BASE_URL = "http://localhost:3000/api/products"
    const ValidationTable = {
        firstName: {
            field: "firstNameErrorMsg",
            message: "Entrez un prénom valide."
        },
        lastName: {
            field: "lastNameErrorMsg",
            message: "Entrez un nom de famille valide."
        },
        address: {
            field: "addressErrorMsg",
            message: "Entrez une adresse valide."
        },
        city: {
            field: "cityErrorMsg",
            message: "Entrez une ville valide."
        },
        email: {
            regex: /^[A-Za-z0-9+.-]+@[a-z]+\.[a-z]{2,3}/,
            field: "firstNameErrorMsg",
            message: "Adresse email invalide."
        },
    };

    const loadAllProducts = async function () {
        let response = await fetch(BASE_URL);
        let data = await response.json();

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            window.__products[item._id] = item;
        }
    }

    const getCartContent = function () {
        let cart;

        if (cart = localStorage.getItem("cart"), cart) {
            return JSON.parse(cart);
        }
        // what if?
    }

    const getInputValue = function (elementID) {
        return document.getElementById(elementID).value
    }

    const modifyCartContent = function (newQuantity, productID, color) {
        let cartItems = getCartContent();

        for (let i = 0; i < cartItems.length; i++) {
            let item = cartItems[i];

            if (
                item.productID == productID &&
                item.color == color &&
                newQuantity < 100
            ) {
                item.quantity = newQuantity
                cartItems[i] = item
                localStorage.setItem("cart", JSON.stringify(cartItems))
            }
        }
    }

    const deleteItem = function (productID, color) {
        let cartItems = getCartContent();

        for (let i = 0; i < cartItems.length; i++) {
            let item = cartItems[i];

            if (
                item.productID == productID &&
                item.color == color
            ) {
                cartItems.splice(i, 1)
                localStorage.setItem("cart", JSON.stringify(cartItems))
            }
        }
    }


    const buildArticle = function (product, orderInfo) {
        let container = document.createElement("article");
        let image = buildArticleImage(product);
        let content = buildArticleContent(product, orderInfo)

        container.classList.add("cart__item");
        container.setAttribute("data-id", orderInfo.productID);
        container.setAttribute("data-color", orderInfo.color);

        container.append(
            image,
            content
        )

        return container;
    }

    const buildArticleImage = function (product) {
        let container = document.createElement("div");
        let image = document.createElement("img");

        image.setAttribute("src", product.imageUrl);
        image.setAttribute("alt", product.altTxt);

        container.classList.add("cart__item__img")
        container.appendChild(image)

        return container;
    }

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

            container.append(
                title,
                color,
                price
            );

            return container;
        }

        let contentSettings = () => {
            let containerSettings = document.createElement("div");
            let containerQty = document.createElement("div");
            let containerDelete = document.createElement("div");

            containerSettings.classList.add("cart__item__content__settings");
            containerQty.classList.add("cart__item__content__settings__quantity");
            containerDelete.classList.add("cart__item__content__settings__delete");

            let quantity = document.createElement("p");
            let quantityInput = document.createElement("input");
            let deleteText = document.createElement("p");
            let attributes = {
                "type": "number",
                "name": "itemQuantity",
                "min": "1",
                "max": "100",
                "value": "" + orderInfo.quantity
            };

            for (let key in attributes) {
                quantityInput.setAttribute(key, attributes[key]);
            };

            quantity.innerText = "Qté : ";
            quantityInput.classList.add("itemQuantity");

            deleteText.classList.add("deleteItem");
            deleteText.innerText = "Supprimer";

            containerDelete.appendChild(deleteText)
            containerQty.append(
                quantity,
                quantityInput
            )

            containerSettings.append(
                containerQty,
                containerDelete
            );

            return containerSettings;
        }

        let container = document.createElement("div");
        let description = contentDescription();
        let settings = contentSettings();

        container.classList.add("cart__item__content");

        container.append(
            description,
            settings
        );

        return container;
    }

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
    }

    const getContactDetails = function () {
        return {
            firstName: getInputValue("firstName"),
            lastName: getInputValue("lastName"),
            address: getInputValue("address"),
            city: getInputValue("city"),
            email: getInputValue("email")
        };
    };

    const validDetails = function (contact) {
        let valid = true;
        const showMessage = function (elementID, message) {
            document.getElementById(elementID).innerText = message
        }

        for (let entry in ValidationTable) {
            let field = contact[element];
            let element = ValidationTable[entry];

            if (field === '' || !(element.regex && element.regex.test(field))) {
                showMessage(element.field, element.message)
                valid = false;
            }
        }

        return valid
    }

    const orderCallback = function () {
        let contact = getContactDetails();

        if (!validDetails(contact)) return


    }


    const changeCallback = function (event) {
        let closest = event.target.closest(".cart__item");
        let productID = closest.getAttribute("data-id");
        let color = closest.getAttribute("data-color");

        modifyCartContent(parseInt(event.target.value, 10), productID, color);
        // update DOM
        calculateQuantity();
    }

    const deleteCallback = function (event) {
        let closest = event.target.closest(".cart__item");
        let productID = closest.getAttribute("data-id");
        let color = closest.getAttribute("data-color");

        deleteItem(productID, color);
        // delete article from DOM
        closest.remove();
        // update DOM
        calculateQuantity();
    }

    const setupListeners = function () {
        let elements = document.getElementsByClassName('itemQuantity');
        let deleteElements = document.getElementsByClassName('deleteItem');
        let orderButton = document.getElementById("order");

        orderButton.addEventListener("click", orderCallback)

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];

            element.addEventListener('change', changeCallback);
        }

        for (let i = 0; i < deleteElements.length; i++) {
            let element = deleteElements[i];

            element.addEventListener('click', deleteCallback);
        }
    }

    loadAllProducts().then(() => {
        let cart = document.getElementById("cart__items");
        let cartContent = getCartContent();
        let cartElements = [];

        for (let i = 0; i < cartContent.length; i++) {
            let order = cartContent[i];
            let product = window.__products[order.productID];

            cartElements.push(buildArticle(product, order))
        }

        cart.append(...cartElements)

        setupListeners()
        calculateQuantity()
    })
}())