const express = require("express");
const app = express();
const cors = require('cors');
const fs = require('fs')
const bodyParser = require('body-parser');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs')
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../client'));


const itemPrices = {
    jordans: 4900,
    adidas: 3500
}

const calculateOrderAmount = items => {
    var totalAmount = items.reduce(function (accumulator, item) {
        return accumulator + (item.amount * itemPrices[item.id])
    }, 0)
    return totalAmount;
};


app.get('/store', function (req, res) {
    fs.readFile('storeItems.json', function (error, data) {
        if (error) {
            res.status(500).end()
        } else {
            res.render('store.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
});

app.post("/create-payment-intent", async (req, res) => {
    const { items, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        expand: ['charges'],
        amount: calculateOrderAmount(items),
        currency: currency,
        payment_method_types: ['card']
    });
    res.send({
        clientSecret: paymentIntent.client_secret
    });
});

app.get("/charges/:paymentIntentId", async (req, res) => {
    const paymentIntentId = req.params.paymentIntentId;
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.send({
        chargeId: intent.charges.data[0].id
    });
});



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});