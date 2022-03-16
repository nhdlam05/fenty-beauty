const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const apiProducts = "http://localhost:3000/products";
const menuIcon = $(".menu-icon");
const responsiveMenu = $(".responsive-menu");
const closeIcon = $(".close-icon");
const cartIcon = $(".cart-icon");
const cartDiv = $(".cart");
const layout = $(".layout");
const closeCart = $(".close-cart");
const container = $(".container");
closeCart.onclick = function () {
  cartDiv.classList.remove("show-menu");
};
menuIcon.onclick = function () {
  responsiveMenu.classList.add("show-menu");
};
closeIcon.onclick = function () {
  responsiveMenu.classList.remove("show-menu");
};
cartIcon.onclick = function () {
  displayCart(cart);
  layout.style.display = "block";
  if ($(".show-cart")) {
    cartDiv.classList.remove("show-cart");
  } else {
    cartDiv.classList.add("show-cart");
  }
};
layout.onclick = function () {
  layout.style.display = "none";
  cartDiv.classList.remove("show-cart");
};
closeCart.onclick = function () {
  cartDiv.classList.remove("show-cart");
  layout.style.display = "none";
};
let cart = [];
let quality = 0;
const getProducts = () => {
  fetch(apiProducts)
    .then((response) => {
      return response.json();
    })
    .then((products) => {
      let html = "";
      products.map((product) => {
        let price = product.price;
        price = price.toLocaleString("en-US", {
          style: "currency",
          currency: "VND",
        });
        html += `<div class="product">
                        <div class="circle">
                        <i class="fa-solid fa-heart" id="icon"></i>
                        </div>
                        <img id="product-layout-1" src="${product.img}"></img>
                        <img id="product-layout-2" src="${product.imgLayout}"></img>
                        <p id="product-title">${product.name}</p>
                        <p id="product-price">${price}</p>
                        <button onclick="addCart(${product.id})" id="add-cart">Add to cart</button>
                    </div>`;
      });
      $("#content").innerHTML = html;
    });
};
async function getIdCart(id) {
  const response = await fetch(apiProducts);
  const products = await response.json();
  let x = await products.find((product) => product.id === id);
  return x;
}
async function addCart(id) {
  let storage = sessionStorage.getItem("cart");
  if (storage) {
    cart = JSON.parse(storage);
  }
  let product = await getIdCart(id);
  let item = cart.find((c) => c.product.id == id);
  if (item) {
    item.quality += 1;
  } else {
    cart.push({ product, quality: 1 });
  }
  sessionStorage.setItem("cart", JSON.stringify(cart));
  displayCart(cart);
  container.innerHTML += `      <div class="toast">
  <p>Bạn đã thêm giỏ hàng thành công!</p>
</div>`;
  setTimeout(() => {
    $(".toast").remove();
  }, 5000);
}
function displayCart(newCart) {
  let cartBody = $("#cart-body");
  cartBody.innerHTML = "";
  let storage = sessionStorage.getItem("cart");
  if (storage) {
    cart = JSON.parse(storage);
  }
  newCart.map((item) => {
    cartBody.innerHTML += `
                          <tr>
                            <td><img src="${item.product.img}" alt="" /></td>
                            <td>${item.product.name}</td>
                            <td>${item.quality}</td>
                            <td>${item.product.price * item.quality}</td>
                            <td><button onclick="removeCart(${
                              item.product.id
                            })">Remove product</button></td>
                          </tr>
      `;
  });
}
function removeCart(id) {
  let storage = sessionStorage.getItem("cart");
  if (storage) {
    cart = JSON.parse(storage);
  }
  cart = cart.filter((item) => item.product.id !== id);
  sessionStorage.setItem("cart", JSON.stringify(cart));
  displayCart(cart);
}
const start = () => {
  displayCart(cart);
  getProducts();
};
start();

// //format còn có thể dùng Intl.NumberFormat('vi-VN',{
//         style: currency
//         currency: VND
// }).format(price)
