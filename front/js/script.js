(function () {
    const BASE_URL = "http://localhost:3000/api/products";
    /**
     * fetchAllProducts fetch the api to load all the products
     * @returns {Object} products - The products from the api
     */
    const fetchAllProducts = async function () {
        let response = await fetch(BASE_URL);
        return await response.json();
    };

    // displayProducts iterate through all the given products and appends them in DOM
    const displayProducts = function (products) {
        if (products.length > 0) {
            let itemsContainer = document.getElementById("items");

            products.forEach((product) => {
                let productElement = buildProduct(product);
                itemsContainer.appendChild(productElement);
            });
        }
    };

    // buildProduct return the given product as a DOM Element
    const buildProduct = function (product) {
        let itemContainer = buildAnchor(product._id);
        let itemContent = buildArticle(product);

        itemContainer.appendChild(itemContent);

        return itemContainer;
    };

    // buildArticle return the anchor element that points to the product page
    const buildAnchor = function (productID) {
        let element = document.createElement("a");

        element.setAttribute("href", `./product.html?id=${productID}`);

        return element;
    };

    // buildArticle build the "article" container with the given product object
    const buildArticle = function (product) {
        // imageElement returns the "img" element that points to the product image
        let imageElement = () => {
            let image = document.createElement("img");
            image.setAttribute("src", product.imageUrl);
            image.setAttribute("alt", product.altTxt);
            return image;
        };
        // nameElement returns the "h3" element that contains the product name
        let nameElement = () => {
            let name = document.createElement("h3");
            name.classList.add("productName");
            name.innerText = product.name;
            return name;
        };
        // descriptionElement returns the "p" element that contains the product description
        let descriptionElement = () => {
            let description = document.createElement("p");
            description.classList.add("productDescription");
            description.innerText = product.description;
            return description;
        };
        let articleContainer = document.createElement("article");

        articleContainer.append(
            imageElement(),
            nameElement(),
            descriptionElement()
        );

        return articleContainer;
    };
    /*
        Main routine
    */
    fetchAllProducts().then((products) => {
        displayProducts(products);
    });
})();
