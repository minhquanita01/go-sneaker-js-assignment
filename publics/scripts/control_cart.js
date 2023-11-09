var noItemElement = document.querySelector(".cart .no-item");

document.addEventListener('DOMContentLoaded', function () 
{
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (storedCart.length > 0) 
    {
        document.querySelector('.cart.column-body').insertAdjacentHTML("beforeend", storedCart.map(item => createCartItemHTML(item)).join(""));
        noItemElement.style.display = "none";
        updateTotalCost(Number(localStorage.getItem("total_cost")))
    }

    document.querySelectorAll('.add-to-cart-btn').forEach((button) => 
    {
        var shoeId = button.getAttribute('data-shoe-id');
        if (localStorage.getItem('added-' + shoeId) === 'true') 
        {
            button.style.display = 'none';
            button.nextElementSibling.style.display = 'flex';
        }
    });

    document.body.addEventListener("click", (event) =>
    {
        var button = event.target.closest(".add-to-cart-btn");
        if (button)
        {
            var shoeId = button.getAttribute('data-shoe-id');
            button.style.display = 'none';
            button.nextElementSibling.style.display = 'flex';
            localStorage.setItem('added-' + shoeId, 'true');   
            fetch(`/api/v1/add_to_cart/${shoeId}`, 
            {
                method: 'POST',
                headers: 
                {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((data) => 
                {
                    document.querySelector(".cart.column-body").insertAdjacentHTML("beforeend", createCartItemHTML(data.item));
                    noItemElement.style.display = "none";

                    var total_cost = Number(localStorage.getItem('total_cost')) || 0;
                    total_cost += data.item.shoes_price;
                    total_cost = +(total_cost.toFixed(2));
                    localStorage.setItem('total_cost', total_cost);
                    updateTotalCost(total_cost);

                    var cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart.push(data.item);
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
            )
            .catch(error => {
                console.error('There was a problem when fetching:', error);
            });;
        }
    });
});

function updateTotalCost(totalCost)
{
    document.querySelector(".cart .total-cost").textContent = '$' + totalCost.toFixed(2);
}

function createCartItemHTML(item)
{
    return `
    <div class="cart-item-container">
        <div style="background-color: ${item.shoes_color};" class="cart-item-image">
            <img src="${item.shoes_image_path}" alt="">
        </div>
        <div class="cart-item-info-zone">
            <div class="cart-item-name">${item.shoes_name}</div>
            <div class="cart-item-price">$${item.shoes_price}</div>
            <div data-shoe-id=${item.shoes_ID} class="cart-item-quantity-control-zone">
                <div class="cart-item-quantity-adjust">
                    <span class="item-dec-quantity">-</span>
                    <span class="item-quantity">${item.buy_quantity}</span>
                    <span class="item-inc-quantity">+</span>
                </div>
                <div class="cart-item-remove">
                    <img src="./img/trash.png" alt="">
                </div>
            </div>
        </div>
    </div>`;
}

function isCartEmpty()
{
    return document.querySelector(".cart.column-body").childElementCount === 0;
}

//Increase item quantity
document.addEventListener('DOMContentLoaded', function () 
{
    document.body.addEventListener("click", (event) =>
    {
        var button = event.target.closest(".item-inc-quantity")
        if (button)
        {
            var shoeId = button.parentElement.parentElement.getAttribute("data-shoe-id");
            var total_cost = Number(localStorage.getItem('total_cost')) || 0;
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            for (item of cart)
                if (item.shoes_ID == shoeId)
                {
                    button.previousElementSibling.textContent = item.buy_quantity = item.buy_quantity + 1;
                    total_cost += item.shoes_price;
                    break;
                }

            localStorage.setItem('total_cost', total_cost);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateTotalCost(total_cost);
        }
    });
});

//Decrease item quantity 
document.addEventListener('DOMContentLoaded', function () 
{
    document.body.addEventListener("click", (event) =>
    {
        var button = event.target.closest(".item-dec-quantity")
        if (button)
        {
            var shoeId = button.parentElement.parentElement.getAttribute("data-shoe-id");
            var total_cost = Number(localStorage.getItem('total_cost')) || 0;
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            for (item of cart)
                if (item.shoes_ID == shoeId)
                {
                    button.nextElementSibling.textContent = item.buy_quantity = item.buy_quantity - 1;
                    total_cost -= item.shoes_price;
                    total_cost = +(total_cost.toFixed(2));
                    if (item.buy_quantity === 0)
                    {
                        cart.splice(cart.indexOf(item), 1);

                        // Remove item container in HTML
                        var cartItemContainer = button.closest('.cart-item-container');
                        if (cartItemContainer) 
                            cartItemContainer.remove();

                        var addedCheckIcon = document.querySelector(`.added-to-cart-container[data-shoe-id="${shoeId}"]`);
                        addedCheckIcon.style.display = "none";
                        addedCheckIcon.previousElementSibling.style.display = "block";
                        localStorage.removeItem('added-' + shoeId);
                        if (isCartEmpty())
                            noItemElement.style.display = "block";
                    }
                    break;
                }
            
            localStorage.setItem('total_cost', total_cost);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateTotalCost(total_cost);
        }
    });
});

// Remove from cart
document.addEventListener('DOMContentLoaded', function () 
{
    document.body.addEventListener('click', (event) =>
    {
        var button = event.target.closest('.cart-item-remove');
        if (button) 
        {
            var shoeId = button.parentElement.getAttribute("data-shoe-id");
            var total_cost = Number(localStorage.getItem('total_cost')) || 0;
            var cart = JSON.parse(localStorage.getItem('cart')) || [];
            for (item of cart)
                if (item.shoes_ID == shoeId)
                {
                    total_cost -= (item.shoes_price * item.buy_quantity);
                    total_cost = +(total_cost.toFixed(2));
                    cart.splice(cart.indexOf(item), 1);

                    // Remove item container in HTML
                    var cartItemContainer = button.closest('.cart-item-container');
                    if (cartItemContainer) 
                        cartItemContainer.remove();

                    var addedCheckIcon = document.querySelector(`.added-to-cart-container[data-shoe-id="${shoeId}"]`);
                    addedCheckIcon.style.display = "none";
                    addedCheckIcon.previousElementSibling.style.display = "block";
                    localStorage.removeItem('added-' + shoeId);
                    if (isCartEmpty())
                        noItemElement.style.display = "block";
                    break;
                }
            
            localStorage.setItem('total_cost', total_cost);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateTotalCost(total_cost);
        } 
    });
});