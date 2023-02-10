(function () {
    const BASE_URL = "http://localhost:3000/api/products"

    const fetchProduct = async function (productID) {
        let response = await fetch(`${BASE_URL}/${productID}`)
        return await response.json()
    }

    const fillProduct = async function () {
        let productID = new URLSearchParams(document.location.search).get("id");
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

    const fillProductInfo = function(product) {
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

    fillProduct()
}())