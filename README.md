## Stripe E-commerce Project
This project demonstrates how to integrate Stripe Payments by way of example - a simple ecommerce store with a working checkout. In this store, a user can:
- View an item
- Select an item quantity
- Add the item(s) to a shopping cart
- Purchase their item(s) after completing the payment form

After the purchase is completed, the checkout form will display a success message and Charge ID associated with the payment. 

## Approach
The tech stack uses vanilla JavaScript and Bootstrap for simplicity. HTML renders the demo server-side. I chose to use Stripe Elements and the Payment Intents API (over the older Charges API and Stripe JS library) to create a payment form for credit cards.

## Preview
![Demo](https://i.ibb.co/MSbDsdd/Shoe-Store.gif)


## Features
- Simple E-commerce Experience
- Confirmed payments using Stripe Payment Intents and Stripe Elements

## Technologies Used

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [EJS](https://ejs.co/)
- [Stripe](https://stripe.com/docs)
- [Bootstrap](https://getbootstrap.com/)


## How it works

The demo is a server-side rendered web app using Stripe’s latest APIs and libraries. Express provides the middleware for routing and serving the HTML, while Javascript’s Fetch API is used to make requests to Stripe’s Payment Intent API. Stripe Elements and Stripe JS v2 are used to create a payment form and handle the payment, respectively. 

The user is able to select a quantity of the item to add to the cart (a Nike shoe in this demo). When the user clicks “add to cart”, the data is sent to the backend. Adding an item to the cart also triggers the creation of a Payment Intent. The Payment Intent’s client secret ID is then returned to the client. When the user enters their card information into the Stripe Element and clicks the Pay button, Stripe JS uses the client secret ID to confirm and complete the payment. Once the payment is complete, a client-side request is made to the backend, which in turn calls Stripe’s Payment Intent API to retrieve the Charge ID. The Charge ID is returned to the client and outputted in the UI, completing the demo.


## Installation

- Run `npm install` to install all necessary dependencies

## Starting Server
- Navigate to the "backend" folder
- In the terminal, run `npm start`, or `nodemon server` if using nodemon


## How to Use
- In `.env`, replace **STRIPE_SECRET_KEY** and **STRIPE_PUBLIC_KEY** with your own API keys (optional)
- The server runs on port 5000. Navigate to http://localhost:5000/ .
- Click **'Begin Demo'**
- Add the desired quantity of shoes to purchase
- Click **'Add to Cart'**. This will enable the checkout button.
- Click **'Checkout'**. This will open a modal displaying the order and the payment form.
- Click **'Submit Payment'**. The payment will be submitted and if successful, the Charge ID will be returned on the modal (this may take a few seconds).

## API Reference

- [Payment Intents](https://stripe.com/docs/api/payment_intents)
- [Stripe Elements](https://stripe.com/payments/elements)


## My Approach

I took a methodical approach to building my app to ensure that it spoke to the demo requirements. First, I outlined which capabilities I wanted my app to demonstrate, knowing that I wanted the app to accept card payments, be easy to modify, and even easier to reason about. Second, I scoured the Stripe documentation to see if there were multiple ways to accept a payment. I found that there were multiple APIs and frontend tools for building an Integration, and decided on using Stripe Elements and the Payment Intents API. Finally, I chose an opinionated, easy to understand stack that would put the primary focus on Stripe.

The demo is a server-side rendering web app to enable rapid prototyping and easy extensibility. The backend is written with Express, a minimalist Node.js framework for building web apps. The frontend is Bootstrap, a CSS framework for making responsive frontends. Lastly, I used EJS (a  templating engine), enabling myself to write less HTML while injecting data into it. All of these technologies helped me create an app that is easy to understand and even easier to extend. My goal in picking these technologies was to make it clear that the primary focus of the demo is Stripe and how it makes accepting payments simple.


## Why this tech stack?
I chose my stack because it uses common, unopinionated technologies that use the basic building blocks of the web: JavaScript, HTML and CSS. Most software engineers and engineering managers know some JavaScript, HTML and CSS even if they don’t write it everyday. Because these languages are so common, I feel confident that I could explain my code to an engineer or an IT executive without spending an unnecessary amount of time explaining the languages themselves. By choosing the basics, I kept the primary focus of the demo on Stripe and how it makes accepting payments seamless.

## How would I extend this application?

If I were building a more robust instance of this application, I would include more payment methods (such as digital wallets) and more functionality, i.e. saving a credit card for future payments. I would use the Payment Request button to show how Stripe can be used to accept digital wallets, and implement the Customer and Setup Intents APIs to demonstrate how to save cards for future use. I would start with these two use cases because they’re common payment scenarios that build off of the existing integration in different ways.
