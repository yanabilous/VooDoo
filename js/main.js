// ______info_____
document.addEventListener("DOMContentLoaded", function () {
  const betaInfo = document.getElementById("betaInfo");
  const loremText = document.getElementById("loremText");

  betaInfo.addEventListener("click", function () {
    if (loremText.style.display === "none") {
      loremText.style.display = "block";
    } else {
      loremText.style.display = "none";
    }
  });
});
// _______modal______

const STORAGE_KEY = "voodoo_cart";
const SUM_STORAGE_KEY = "voodoo_cart_sum";

function loadHeader() {
  fetch("components/header.html")
    .then(response => response.text())
    .then(html => {
      const headerContainer = document.createElement("div");
      document.body.insertBefore(headerContainer, document.body.firstChild);


      const modal = document.getElementById("myModal");
      const closeButton = document.getElementsByClassName("close")[0];
      const cartButton = document.getElementsByClassName("cart")[0];


      cartButton.onclick = function () {
        modal.style.display = "block";
      };


      closeButton.onclick = function () {
        modal.style.display = "none";
      };


      window.onclick = function (event) {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      };
    })
    .catch(error => {
      console.error("Помилка завантаження хедера:", error);
    });
}


loadHeader();


function calculateTotalPrice() {
  const voodoo_cart_products = get_cart_products();
  let total = 0;

  for (const product of voodoo_cart_products) {
    total += parseFloat(product.productPrice) * product.qty;
  }

  return total.toFixed(2);
}



function updateTotalPrice() {
  const totalElement = document.querySelector(".total-price");
  totalElement.textContent = `${calculateTotalPrice()} KR.`;


  const cartCountElement = document.querySelector(".cart-count-number");
  const voodoo_cart_products = get_cart_products();
  let totalQuantity = 0;

  for (const product of voodoo_cart_products) {
    totalQuantity += product.qty;
  }

  cartCountElement.textContent = totalQuantity;
}
function removeProductFromCart(productId) {
  const voodoo_cart_products = get_cart_products();
  const productIndex = voodoo_cart_products.findIndex(product => product.productId === productId);

  if (productIndex !== -1) {
    voodoo_cart_products.splice(productIndex, 1);
    set_cart_products(voodoo_cart_products);
    render_cart();
  }
}

function updateProductQuantity(productId, change) {
  const quantityElement = document.getElementById(`cartItemQuantity-${productId}`);
  const currentQuantity = parseInt(quantityElement.textContent, 10);
  const newQuantity = currentQuantity + change;
  const voodoo_cart_products = get_cart_products();
  const productIndex = voodoo_cart_products.findIndex(product => product.productId === productId);
  if (newQuantity < 0) {
    return;
  }

  quantityElement.textContent = newQuantity;
  if (productIndex !== -1) {
    voodoo_cart_products[productIndex].qty += change;


    if (voodoo_cart_products[productIndex].qty <= 0) {
      voodoo_cart_products.splice(productIndex, 1);
    }


    set_cart_products(voodoo_cart_products);
    render_cart();
  }
}


function get_cart_products() {
  const voodoo_cart = localStorage.getItem(STORAGE_KEY);
  if (voodoo_cart) {
    return JSON.parse(voodoo_cart);
  } else return [];
}

function set_cart_products(products_array) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products_array));
}

function render_cart() {
  const all_products = get_cart_products();
  const cart = document.getElementById("cart");
  cart.innerHTML = "";
  for (const product of all_products) {
    const cartItemHTML = `
              <div id="cart-item-${product.productId}" class="modal-card flex flex-row mb-10 justify-between" data-product-id="${product.productId}">
              <div class="flex">
                <img class="img-modal" src="${product.productImg}" alt="img-product" id="cartItemImg-${product.productId}">
                <div class="info mx-3.5">
                  <p class="product-name truncate-text-modal" id="cartItemName-${product.productId}">${product.productName}</p>
                  <p class="product-price"  id="cartItemPrice-${product.productId}">${product.productPrice}</p>
                  <div>
                    <button class="decr" data-product-id="${product.productId}">-</button>
                    <span class="cartItemQuantity" id="cartItemQuantity-${product.productId}">${product.qty}</span>
                    <button class="incr" data-product-id="${product.productId}">+</button>
                  </div>
                </div>
                </div>
                <svg class="remove-from-cart cursor-pointer" data-product-id="${product.productId}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g clip-path="url(#clip0_0_524)">
                    <path d="M7 4V2H17V4H22V6H20V21C20 21.2652 19.8946 21.5196 19.7071 21.7071C19.5196 19.8946 19.2652 22 19 22H5C4.73478 22 4.48043 21.8946 4.29289 21.7071C4.10536 21.5196 4 21.2652 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z" fill="#FCF7E6"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_0_524">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            `;


    cart.insertAdjacentHTML("beforeend", cartItemHTML);
    updateTotalPrice();
  }


  const decrButtons = document.querySelectorAll(".decr");
  const incrButtons = document.querySelectorAll(".incr");
  const removeFromCartButtons = document.querySelectorAll(".remove-from-cart");
  decrButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      updateProductQuantity(productId, -1);
      updateTotalPrice();
    });
  });

  incrButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      updateProductQuantity(productId, 1);
      updateTotalPrice();
    });
  });

  removeFromCartButtons.forEach(button => {
    button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      removeProductFromCart(productId);
      updateTotalPrice();
    });
  });
}


// _____________product-list_________________

document.addEventListener("DOMContentLoaded", function () {
  render_cart();
  const shopifyUrl = "https://voodoo-sandbox.myshopify.com/products.json?limit=24";

  fetch(shopifyUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Помилка Shopify API");
      }
      return response.json();
    })
    .then(data => {
      const productsContainer = document.querySelector("#product-list");

      if (data.products.length > 0) {
        const productHTMLArray = data.products.map(productData => {
          const productId = productData.id;
          const productTitle = productData.title;
          const productPrice = productData.variants[0].price;
          const productImageSrc = productData.images[0] ? productData.images[0].src : "";

          return `
          <div id="product-card" class="product-card w-300" data-product-id="${productId}">
            <div class="product-photo img border-black border-2 border-solid  mb-3">
              <img class="product-img m-0" src="${productImageSrc}" alt="${productTitle}">
            </div>
            <div class="product-info flex flex-row justify-between mb-3">
              <div>
                <p class="name-product truncate-text">${productTitle}</p>
                <p class="product-price">${productPrice} KR.</p>
              </div>
              <div>
                <p>Condition</p>
                <p>Slightly used</p>
              </div>
            </div>
            <button id="add-to-cart" class="p-4 bg-black text-white w-300" data-product-id="${productId}" >ADD TO CART</button>
          </div>
        `;
        });
        productsContainer.innerHTML = productHTMLArray.join("");

        // __________add product to card_______
        productsContainer.addEventListener("click", function (event) {
          if (event.target.id === "add-to-cart") {
            const productCard = event.target.closest(".product-card");
            const productId = productCard.getAttribute("data-product-id");
            const productName = productCard.querySelector(".name-product").textContent;
            const productPrice = productCard.querySelector(".product-price").textContent;
            const productImg = productCard.querySelector(".product-img").getAttribute("src");
            const product = {
              productId,
              productName,
              productPrice,
              productImg,
              qty: 1
            };
            let voodoo_cart_products = get_cart_products();
            const productIndex = voodoo_cart_products.findIndex(product => product.productId === productId);

            if (productIndex !== -1) {

              voodoo_cart_products[productIndex].qty += 1;
            } else {
              voodoo_cart_products.push(product);
            }
            set_cart_products(voodoo_cart_products);

            render_cart();
            updateTotalPrice();
          }
        });


      } else {
        productsContainer.textContent = "Товари не знайдені";
      }
    })
    .catch(error => {
      console.error(error);
    });
});


// ___________pagination_____


function createPaginationButtons(currentPage, totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  paginationContainer.innerHTML = "";

  const buttonsToShow = 5;
  const halfButtons = Math.floor(buttonsToShow / 2);

  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "...";
    prevButton.classList.add("border-black", "border-2", "border-solid", "rounded-full", "px-6", "py-4", "mr-2.5");
    // prevButton.classList.add("border-black"," border-2", "border-solid", "rounded-full", "active:bg-black", "active:text-white"," w-12", "h-12", "flex"," justify-center", "items-center");
    prevButton.addEventListener("click", () => goToPage(currentPage - 1));
    paginationContainer.appendChild(prevButton);
  }


  for (let i = currentPage - halfButtons; i <= currentPage + halfButtons; i++) {
    if (i > 0 && i <= totalPages) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.classList.add("border-black", "border-2", "border-solid", "rounded-full", "px-6", "py-4", "mr-2.5");

      if (i === currentPage) {
        pageButton.classList.add("active:bg-black", "active:text-white", "border-black", "border-2", "border-solid", "rounded-full", "px-6", "py-4", "mr-2.5");

      }
      pageButton.addEventListener("click", () => goToPage(i));
      paginationContainer.appendChild(pageButton);
    }
  }


  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "...";
    nextButton.classList.add("border-black", "border-2", "border-solid", "rounded-full", "px-6", "py-4");
    nextButton.addEventListener("click", () => goToPage(currentPage + 1));
    paginationContainer.appendChild(nextButton);
  }
}


function goToPage(pageNumber) {

  const productsPerPage = 24;
  fetch(`https://voodoo-sandbox.myshopify.com/products.json?limit=${productsPerPage}&page=${pageNumber}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Помилка Shopify API");
      }
      return response.json();
    })
    .then(data => {

      renderProductList(data.products);
      const totalPages = 461;
      createPaginationButtons(pageNumber, totalPages);
    })
    .catch(error => {
      console.error(error);
    });
}


function renderProductList(products) {

  const productsContainer = document.querySelector("#product-list");
  if (products.length > 0) {
  const productHTMLArray = products.map(productData => {
      const productId = productData.id;
      const productTitle = productData.title;
      const productPrice = productData.variants[0].price;
      const productImageSrc = productData.images[0] ? productData.images[0].src : "";

      return `
          <div id="product-card" class="product-card w-300" data-product-id="${productId}">
            <div class="product-photo img border-black border-2 border-solid  mb-3">
              <img class="product-img m-0" src="${productImageSrc}" alt="${productTitle}">
            </div>
            <div class="product-info flex flex-row justify-between mb-3">
              <div>
                <p class="name-product truncate-text">${productTitle}</p>
                <p class="product-price">${productPrice} KR.</p>
              </div>
              <div>
                <p>Condition</p>
                <p>Slightly used</p>
              </div>
            </div>
            <button id="add-to-cart" class="p-4 bg-black text-white w-300" data-product-id="${productId}" >ADD TO CART</button>
          </div>
        `;
    });
    productsContainer.innerHTML = productHTMLArray.join("");
  }

}


goToPage(1);
