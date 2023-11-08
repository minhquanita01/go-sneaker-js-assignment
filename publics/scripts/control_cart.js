var noItemElement = document.querySelector(".cart .no-item");

document.addEventListener('DOMContentLoaded', function () 
{
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
            fetch('/go_shoes/add_to_cart/', 
            {
                method: 'POST',
                body: JSON.stringify({ 'shoe_id': shoeId }),
                headers: 
                {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((data) => 
                {
                    addHTMLCodeIntoBlock(".cart.column-body", data.html);
                    updateToTalCostDisplay(data.total_cost);
                    noItemElement.style.display = "none";
                }
            );
        }
    });
});

function addHTMLCodeIntoBlock(selector, html)
{
    document.querySelector(selector).innerHTML += html;
}

function updateToTalCostDisplay(total_cost) 
{
    document.querySelector(".cart .total-cost").textContent = `$${total_cost.toFixed(2)}`;
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

            fetch('/go_shoes/inc_quantity/', 
            {
                method: 'POST',
                body: JSON.stringify({ 'shoe_id': shoeId }),
                headers: 
                {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((data) => 
                {
                    updateToTalCostDisplay(data.total_cost);
                    button.previousElementSibling.textContent = data.item_quantity;
                }
            );
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

            fetch('/go_shoes/dec_quantity/', 
            {
                method: 'POST',
                body: JSON.stringify({ 'shoe_id': shoeId }),
                headers: 
                {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((data) => 
                {
                    updateToTalCostDisplay(data.total_cost);
                    if (data.item_quantity > 0)
                        button.nextElementSibling.textContent = data.item_quantity;
                    else
                    {
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
                }
            );
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

            fetch('/go_shoes/remove_cart_item/', 
            {
                method: 'POST',
                body: JSON.stringify({ 'shoe_id': shoeId }),
                headers: 
                {
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((data) => 
                {
                    updateToTalCostDisplay(data.total_cost);
                }
            );
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
    });
});