let products = [
    {
        id: 1,
        name: "Whey Protein",
        price: 40,
        stock: true,
        image: "1.png",
        desc: "Muscle recovery protein supplement",
        ingredients: "Whey isolate, amino acids",
        reviews: "4.5/5 ⭐"
    },
    {
        id: 2,
        name: "Gym Gloves",
        price: 15,
        stock: true,
        image: "2.jpg",
        desc: "Grip gloves for weight training",
        ingredients: "Leather, foam",
        reviews: "4.2/5 ⭐"
    },
    {
        id: 3,
        name: "Resistance Bands",
        price: 25,
        stock: false,
        image: "3.png",
        desc: "Full body resistance training kit",
        ingredients: "Latex rubber",
        reviews: "4.7/5 ⭐"
    },
    {
        id: 4,
        name: "Pre-Workout Powder",
        price: 30,
        stock: true,
        image: "4.png",
        desc: "Energy boost before training",
        ingredients: "Caffeine, beta-alanine",
        reviews: "4.3/5 ⭐"
    },
    {
        id: 5,
        name: "BCAA Drink",
        price: 20,
        stock: true,
        image: "5.jpg",
        desc: "Hydration and muscle recovery drink",
        ingredients: "BCAA, electrolytes",
        reviews: "4.4/5 ⭐"
    },
    {
        id: 6,
        name: "Gym Belt",
        price: 35,
        stock: true,
        image: "6.png",
        desc: "Lower back support for lifting",
        ingredients: "Leather, steel buckle",
        reviews: "4.6/5 ⭐"
    },
    {
        id: 7,
        name: "Dumbbells Set",
        price: 60,
        stock: false,
        image: "7.jfif",
        desc: "Adjustable dumbbells for home gym",
        ingredients: "Cast iron, rubber coating",
        reviews: "4.8/5 ⭐"
    },
    {
        id: 8,
        name: "Yoga Mat",
        price: 18,
        stock: true,
        image: "8.png",
        desc: "Non-slip exercise mat",
        ingredients: "TPE foam",
        reviews: "4.5/5 ⭐"
    },
    {
        id: 9,
        name: "Skipping Rope",
        price: 10,
        stock: true,
        image: "9.png",
        desc: "Cardio jump rope",
        ingredients: "Steel cable, plastic handles",
        reviews: "4.1/5 ⭐"
    },
    {
        id: 10,
        name: "Protein Bars",
        price: 12,
        stock: true,
        image: "10.png",
        desc: "High protein snack bars",
        ingredients: "Oats, whey, chocolate",
        reviews: "4.3/5 ⭐"
    },
    {
        id: 11,
        name: "Shaker Bottle",
        price: 8,
        stock: true,
        image: "11.png",
        desc: "Protein mixing bottle",
        ingredients: "BPA-free plastic",
        reviews: "4.2/5 ⭐"
    },
    {
        id: 12,
        name: "Creatine Powder",
        price: 28,
        stock: true,
        image: "12.png",
        desc: "Strength and performance supplement",
        ingredients: "Creatine monohydrate",
        reviews: "4.6/5 ⭐"
    },
    {
        id: 13,
        name: "Foam Roller",
        price: 22,
        stock: true,
        image: "13.png",
        desc: "Muscle recovery roller",
        ingredients: "EVA foam",
        reviews: "4.5/5 ⭐"
    },
    {
        id: 14,
        name: "Smart Fitness Watch",
        price: 120,
        stock: true,
        image: "14.png",
        desc: "Track workouts and heart rate",
        ingredients: "Silicone, electronics",
        reviews: "4.7/5 ⭐"
    },
    {
        id: 15,
        name: "Gym Backpack",
        price: 45,
        stock: true,
        image: "15.png",
        desc: "Storage for gym essentials",
        ingredients: "Polyester",
        reviews: "4.4/5 ⭐"
    },
    {
        id: 16,
        name: "Weight Plates",
        price: 80,
        stock: false,
        image: "16.png",
        desc: "Barbell weight plates set",
        ingredients: "Cast iron",
        reviews: "4.6/5 ⭐"
    },
    {
        id: 17,
        name: "Pull-Up Bar",
        price: 25,
        stock: true,
        image: "17.png",
        desc: "Door frame pull-up bar",
        ingredients: "Steel",
        reviews: "4.3/5 ⭐"
    },
    {
        id: 18,
        name: "Ankle Straps",
        price: 12,
        stock: true,
        image: "18.png",
        desc: "Cable machine ankle straps",
        ingredients: "Neoprene, metal ring",
        reviews: "4.2/5 ⭐"
    },
    {
        id: 19,
        name: "Massage Gun",
        price: 90,
        stock: true,
        image: "19.png",
        desc: "Deep tissue muscle massage device",
        ingredients: "Plastic, metal motor",
        reviews: "4.8/5 ⭐"
    },
    {
        id: 20,
        name: "Workout T-Shirt",
        price: 18,
        stock: true,
        image: "20.png",
        desc: "Breathable gym shirt",
        ingredients: "Polyester blend",
        reviews: "4.4/5 ⭐"
    },
    {
        id: 21,
        name: "Workout Pants",
        price: 25,
        stock: true,
        image: "21.png",
        desc: "Breathable and flexible gym pants",
        ingredients: "Polyester blend",
        reviews: "4.7/5 ⭐"
    }
];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* PRODUCTS */
function displayProducts(list = products) {
    const container = document.getElementById("productList");
    container.innerHTML = "";

    list.forEach(p => {
        container.innerHTML += `
        <div class="product" onclick="openModal(${p.id})">
            <img src="${p.image}" class="product-img">
            <h4>${p.name}</h4>
            <p>£${p.price}</p>
            <p class="stock ${p.stock ? 'instock' : 'outstock'}">
                ${p.stock ? "In Stock" : "Out of Stock"}
            </p>
            <button onclick="addToCart(event, ${p.id})">Add to Cart</button>
        </div>
        `;
    });
}

/* SEARCH */
function filterProducts() {
    let value = document.getElementById("search").value.toLowerCase();
    let filtered = products.filter(p =>
        p.name.toLowerCase().includes(value)
    );
    displayProducts(filtered);
}

/* CART */
function addToCart(event, id) {
    event.stopPropagation();

    let product = products.find(p => p.id === id);
    let item = cart.find(c => c.id === id);

    if (item) item.qty++;
    else cart.push({...product, qty: 1});

    saveCart();
}

function renderCart() {
    let container = document.getElementById("cartItems");
    container.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;

        container.innerHTML += `
        <div class="cart-item">
            <span>${item.name} x${item.qty}</span>
            <button onclick="removeItem(${item.id})">X</button>
        </div>
        `;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("cartCount").innerText = cart.length;
}

function removeItem(id) {
    cart = cart.filter(c => c.id !== id);
    saveCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

/* MODAL */
function openModal(id) {
    let p = products.find(x => x.id === id);

    document.getElementById("modalBody").innerHTML = `
        <img src="${p.image}" class="modal-img">
        <h2>${p.name}</h2>
        <p>${p.desc}</p>
        <p><b>Price:</b> £${p.price}</p>
        <p><b>Ingredients:</b> ${p.ingredients}</p>
        <p><b>Reviews:</b> ${p.reviews}</p>
        <p class="${p.stock ? 'instock' : 'outstock'}">
            ${p.stock ? "In Stock" : "Out of Stock"}
        </p>
    `;

    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

/* CHECKOUT */
function checkout() {
    alert("Order placed successfully!");
    cart = [];
    saveCart();
}

/* INIT */
displayProducts();
renderCart();