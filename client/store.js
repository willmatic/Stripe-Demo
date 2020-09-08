var stripe = Stripe(stripePublicKey.replace(/\&#34;/g, ""));
var elements = stripe.elements();
var selectedItems;
var paymentButton = document.querySelector('#paymentButton');
var stripeApiObject = {
    clientSecret: null
}
var form = document.getElementById('form');
var card;
var style = {
    base: {
        color: "#32325d",
    }
};

/* Item prices, (demo only uses Jordans) */
const itemPrices = {
    jordans: 49,
    adidas: 35
}

/*setUpElements: Sets up card Element */
let setUpElements = () => {
    card = elements.create("card", { style: style });
    card.mount("#card-element");
    card.on('change', ({ error }) => {
        const displayError = document.getElementById('card-errors');
        if (error) {
            displayError.textContent = error.message;
        } else {
            displayError.textContent = '';
        }
    });
    return card;
}


/* Add event listener to submit button, uses confirmCardPayment to submit payment. Returns Payment Intent ID and fetches Charge */
form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!stripe || !elements) {
        return;
    }

    stripe.confirmCardPayment(stripeApiObject.clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                name: 'Michael Jordan',
            },
        }
    }).then(function (result) {
        if (result.error) {
            console.log(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                fetchCharge(result.paymentIntent.id);
            }
        }
    }).catch(function (error) {
        console.error('Error:', error);
    });
});

/*collectOrderData: Generates order information from shopping cart */
let collectOrderData = () => {
    let itemElements = document.querySelectorAll('.item-amount');
    if (!itemElements) {
        return;
    }
    itemElements = Array.from(itemElements);
    items = itemElements.map(element =>
        ({
            amount: parseInt(element.value),
            id: element.id,
            name: element.name,
            price: element.dataset.price

        })
    );
    let orderData = {
        items: items,
        currency: "usd"
    };

    return orderData;
}

/*generatePaymentIntent: Makes request to Payment Intents API to create a PI, returns the client secret */

let generatePaymentIntent = () => {
    fetch("/create-payment-intent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(collectOrderData())
    })
        .then(function (result) {
            return result.json();
        })
        .then(function (data) {
            return data.clientSecret;
        })
        .then(function (clientSecret) {
            if (!card) {
                card = setUpElements();
            }
            stripeApiObject.clientSecret = clientSecret;
            paymentButton.disabled = false;
        })
}

/* fetchCharge: Returns Charge ID and outputs a success message */

let fetchCharge = (paymentIntentId) => {
    fetch('/charges/' + paymentIntentId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }

    })
        .then(function (result) {
            return result.json();
        })
        .then(function (data) {
            let textContent = 'Payment successful, charge id: ' + data.chargeId;
            document.querySelector('#card-success-message').textContent = textContent;
        })
}




/* Code below this line is used to handle updates to the UI  */

let addItemToCart = () => {
    selectedItems = collectOrderData().items;
    if (!selectedItems) {
        return;
    }
    let itemCountElem = document.querySelector('#item-count');
    let orderSummaryElem = document.querySelector('#order-summary');
    let totalCostElement = document.querySelector('#total-cost');
    let itemCount = selectedItems.reduce((a, b) => a + (b['amount'] || 0), 0);
    let totalAmount = items.reduce(function (accumulator, currentValue) {
        return accumulator + (currentValue.amount * itemPrices[currentValue.id])
    }, 0)
    itemCountElem.textContent = itemCount;
    orderSummaryElem.innerHTML = '';

    selectedItems.forEach(function (item) {
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(item.name + ' x ' + item.amount));
        orderSummaryElem.appendChild(li);
    })

    totalCostElement.textContent = 'Total Cost: $' + totalAmount;
    document.querySelector('#checkout').disabled = false;
}

/* Resets form */
$("#modal").on("hidden.bs.modal", function () {
    if (card) {
        card.clear();
        document.querySelector('#card-success-message').textContent = '';

    }
});