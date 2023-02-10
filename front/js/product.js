(function () {
    window.__product_id = new URLSearchParams(document.location.search).get("id") || alert("Mauvaise URL !")


    const BASE_URL = "http://localhost:3000/api"

    const fetchProduct = async function (productID) {
        let response = await fetch(`${BASE_URL}/products/${productID}`)
        return await response.json()
    }

    const addToCart = function () {
        let cart;
        let present = false;
        let orderInfo = collectOrderInfo();

        if (cart = localStorage.getItem("cart"), cart) {
            let items = JSON.parse(cart)

            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (
                    item.productID == orderInfo.productID &&
                    item.color == orderInfo.color
                ) {
                    present = true;
                    items[i].quantity += orderInfo.quantity
                }
            }

            if (!present) {
                items.push(orderInfo)
            }

            localStorage.setItem("cart", JSON.stringify(items))
        } else {
            localStorage.setItem("cart", JSON.stringify([orderInfo]))
        }
    }

    const collectOrderInfo = function () {
        let orderInfo = {};
        let quantity = document.getElementById("quantity").value;
        let color = document.getElementById("colors").value;

        orderInfo.productID = window.__product_id;
        orderInfo.quantity = parseInt(quantity, 10);
        orderInfo.color = color;

        return orderInfo
    }


    const fillProduct = async function () {
        let productID = window.__product_id
        let productContent = await fetchProduct(productID)
        let article = document.querySelector("article")

        fillImage(article, productContent)
        fillProductInfo(productContent)
        fillColorSelect(productContent)
    }

    const fillImage = function (article, product) {
        let element = article.firstElementChild
        let image = document.createElement("img")

        image.setAttribute("src", product.imageUrl)
        image.setAttribute("alt", product.altTxt)

        element.appendChild(image)
    }

    const fillProductInfo = function (product) {
        let title = document.getElementById("title");
        let price = document.getElementById("price");
        let description = document.getElementById("description")

        title.innerText = product.name
        price.innerText = product.price
        description.innerText = product.description
    }

    const fillColorSelect = function (product) {
        let colorSelect = document.getElementById("colors")
        let colorsElement = product.colors.map(color => {
            let option = document.createElement("option")
            option.setAttribute("value", color)
            option.innerText = color
            return option
        })

        colorSelect.append(...colorsElement)
    }

    const setupCallback = function () {
        let element = document.getElementById("addToCart");
        element.addEventListener("click", addToCart)
    }

    setupCallback()
    fillProduct()
}())