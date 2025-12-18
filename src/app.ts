///////////////////////////////////////////////////////////////////// DOM Elements /////////////////////////////////////////////////////////////////////
const productsGrid = document.getElementById("products-grid") as HTMLDivElement;

const cartItems = document.getElementById("cart-items") as HTMLDivElement;
const subTotal = document.getElementById("subtotal") as HTMLDivElement;
const Tax = document.getElementById("tax") as HTMLDivElement;
const Total = document.getElementById("total") as HTMLDivElement;
const checkOutBtn = document.getElementById("checkout-btn") as HTMLButtonElement;
const clearCart = document.getElementById("clear-cart") as HTMLButtonElement;

///////////////////////////////////////////////////////////////////// Types /////////////////////////////////////////////////////////////////////
type Category = "Electronics" | "Books" | "Mugs";

interface Product {
    id: string;
    name: string;
    price: number;
    category: Category;
    image?: string;
    description?: string;
}

interface CartItem {
    id: string;
    name: string;
    price: number;
    count: number;
    image?: string;
}

///////////////////////////////////////////////////////////////////// States /////////////////////////////////////////////////////////////////////
let products: Product[] = createProducts();
let cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

///////////////////////////////////////////////////////////////////// Checkout /////////////////////////////////////////////////////////////////////

function checkout() {
    let subtotal: number = 0;
    let tax: number = 0;
    let total: number = 0;

    for (let p of cart) {
        subtotal += Number((p.price * p.count).toFixed(2));
        tax = Number((0.1 * subtotal).toFixed(2));
        total =Number((subtotal + tax).toFixed(2));
    }

    subTotal.textContent = `${subtotal}$`;
    Tax.textContent = `${tax}$`;
    Total.textContent = `${total}$`;
}

clearCart.addEventListener("click",() => {
    cart = [];
    localStorage.setItem("cart",JSON.stringify(cart));
    renderCart();
});

checkOutBtn.addEventListener("click", () => {
    cart = [];
    localStorage.setItem("cart",JSON.stringify(cart));
    renderCart();
    alert("Payment was successful.")
});

///////////////////////////////////////////////////////////////////// Rendering /////////////////////////////////////////////////////////////////////
function renderProducts() {
    productsGrid.innerHTML = "";
    products.forEach(p => {

    const card = document.createElement("div");
    card.className = "product";
    const thumb = document.createElement("div");
    thumb.className = "thumb";
    if (p.image) {
      thumb.style.backgroundImage = `url(${p.image})`;
      thumb.style.backgroundSize = "cover";
      thumb.style.backgroundPosition = "center";
      thumb.textContent = "";
    } else {
      thumb.textContent = p.name.split(" ").map(s=>s[0]?.toUpperCase()||"").slice(0,2).join("");
    }

    const meta = document.createElement("div");
    meta.classList = "meta";
    const title = document.createElement("h4");
    title.textContent = p.name;
    const desc = document.createElement("small");
    desc.textContent = p.description || "";
    const price = document.createElement("div");
    price.className = "price";
    price.textContent = `${p.price}$`;

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";
    const addBtn = document.createElement("button");
    addBtn.className = "btn";
    addBtn.textContent = "Add to cart";
    addBtn.addEventListener("click", () => addToCart(p));

    actions.appendChild(addBtn);

    meta.appendChild(title);
    meta.appendChild(desc);
    meta.appendChild(price);
    meta.appendChild(actions);

    card.appendChild(thumb);
    card.appendChild(meta);
    productsGrid.appendChild(card);
    });
}

function renderCart() {
    cartItems.innerHTML = "";
    cart.forEach(item => {
       const card = document.createElement("div");
       card.className = "cart-row";
       const thumb = document.createElement("div");
       thumb.className = "recipe-thumb";
       thumb.style.width = "56px"; thumb.style.height = "56px";
       thumb.style.borderRadius = "6px"; thumb.style.flexShrink = "0";
       if (item.image) { thumb.style.backgroundImage = `url(${item.image})`; thumb.style.backgroundSize = "cover"; thumb.textContent = ""; }
       else thumb.textContent = item.name.split(" ").map(s=>s[0]?.toUpperCase()||"").slice(0,2).join("");

        const details = document.createElement("div");
        details.className = "info";
        const name = document.createElement("h5");
        name.textContent = item.name;
        const price = document.createElement("h5");
        price.textContent = `price : ${item.price}$`;

        const controls = document.createElement("div");
        controls.className = "controls";
        const minus = document.createElement("button");
        minus.className = "controls button";
        minus.textContent = "-";
        minus.addEventListener("click",() => cartActions(item,"minus"));
        const count = document.createElement("p");
        count.className = "controls p";
        count.textContent = `${item.count}`;
        const plus = document.createElement("button");
        plus.className = "controls button";
        plus.textContent = "+";
        plus.addEventListener("click",() => cartActions(item,"plus"));

        controls.appendChild(minus);
        controls.appendChild(count);
        controls.appendChild(plus);

        details.appendChild(name);
        details.appendChild(price);
        details.appendChild(controls);

        card.appendChild(details);
        card.appendChild(thumb);
        cartItems.appendChild(card);
    });
    checkout();
}

///////////////////////////////////////////////////////////////////// Cart logics /////////////////////////////////////////////////////////////////////
function addToCart(p: Product) {
    const addToLocal: CartItem = {id:p.id,name:p.name,price:p.price,count:1,image:p.image || ""};
    const existing = cart.find(item=> item.id === addToLocal.id);
    if (existing) {
        existing.count++;
    } else {
        cart.push(addToLocal);
    }
    localStorage.setItem("cart",JSON.stringify(cart));
    renderCart();
}

function cartActions(item:CartItem,action:"minus" | "plus") {
    if (action === "minus") {
        item.count--;
        if (item.count === 0) {
            cart = cart.filter(i => i.id !== item.id);
        }
        localStorage.setItem("cart",JSON.stringify(cart));
        renderCart();
    } else {
        item.count++;
        localStorage.setItem("cart",JSON.stringify(cart));
        renderCart();
    }
}

///////////////////////////////////////////////////////////////////// Create products /////////////////////////////////////////////////////////////////////
function createProducts(): Product[] {
    return [
        {id:"p1",name:"Computer Programming Book",price:120,category:"Books",image:"https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1590635454i/53540086.jpg",description:"Programming book collection"},
        {id:"p2",name:"Python Book",price:49,category:"Books",image:"https://content.packt.com/_/image/original/B30992/cover_image.jpg",description:"The guide to learning python"},
        {id:"p3",name:"Blue mug",price:13,category:"Mugs",image:"https://www.vanhelden.nl/media/catalog/product/i/m/impr_1111555-PDP_1.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",description:"Blue mug for programmers"},
        {id:"p4",name:"White mug",price:15,category:"Mugs",image:"https://www.vanhelden.nl/media/catalog/product/i/m/impr_932624-PDP_2.jpg?optimize=high&bg-color=255,255,255&fit=bounds&height=700&width=700&canvas=700:700",description:"white mug for programmers"},
        {id:"p5",name:"Black headphones",price:290,category:"Electronics",image:"https://tse3.mm.bing.net/th/id/OIP.3qO8tgBuNRWbqP5gKfVmdwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",description:"Headphones for programmers"},
        {id:"p6",name:"White headphones",price:279,category:"Electronics",image:"https://th.bing.com/th/id/R.384c541196887bd76f9bbc676a74bf85?rik=0jjzNgsj2%2bCtew&pid=ImgRaw&r=0",description:"Headphones for programmers"}
    ]
}

///////////////////////////////////////////////////////////////////// Start the app /////////////////////////////////////////////////////////////////////
renderProducts();
renderCart();