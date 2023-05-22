(function () {
    window.__order_id =
        new URLSearchParams(document.location.search).get("orderId") ||
        alert("Mauvaise URL !");

    let element = document.getElementById("orderId");
    element.innerText = window.__order_id;
})();
