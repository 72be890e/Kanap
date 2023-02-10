(function () {
    window.__products = {};
    const BASE_URL = "http://localhost:3000/api/products"

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
            price.innerText = product.price;

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

    const calculateQuantity  = function () {
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
        totalPrice.innerText = rawPrice;
    }

    loadAllProducts().then(() => {

    })
}())