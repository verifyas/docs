# Getting Started

Processing bank transfer with Verify Payments is a two-step process, involving
both server-side and client-side steps:

1. (Server) Create a session using your Private API key including the `amount`, 
   `currency` and `description`.
1. (Client) Initiate a Transfer from your website using the session created 
   earlier with your Public API key.
1. (Client) Customer completes the Transfer.

Here is how it looks:

<div id="scheme">
  <img src="/images/how-it-works.png" />
</div>

## 1. Create a Session

In order to create a session you have to make an API request including the `amount`,
`currency` and `description` to the following endpoint:

`POST %api_endpoint%/sessions/`

<aside class=notice>
   Authentication and request parameters are described in <a href="/api/#create-a-session">API Reference</a>.
</aside>

Here is an example in NodeJS:

```js
require('request');
var request = require('request-promise');

request.post({
  url: 'https://api.verifypayments.com/sessions/',
  'auth': {
    'bearer': '%test_secret_key%' /* secret key */
  },
  json: {
    currency: 'AED',
    amount: 1,
    description: 'Order #123 at Acme Inc'
  }
}).then(function(session) {
  /* Session successfully created */
  console.log('Session ID: ' + session.id);
}).catch(function(err) {
  console.log('Error: ' + err.response.body.message);
});
```

## 2. Initiate Transfer

Now that the session is created, the client can use the Verify Javascript SDK 
to begin a transfer. On page load, create a `VerifyPayments` object, passing 
the appropriate [configuration parameters](#configuration-options). You may 
call the `open()` method on this object in response to any event (e.g. a button
click):

```html
<button id='btn-pay'>Pay</button>

<script src="https://js.verifypayments.com/sdk.js"></script>
<script>
const payment = new VerifyPayments({
   /* configuration parameters: */
   sessionId: 'SESSION_ID_SHOULD_BE_RENDERED_HERE',
   publicKey: '%test_public_key%',
   onComplete: function(transfer) { console.log('Transfer completed', transfer); },
   onClose: function() { console.log('Transfer window closed'); }
});

/* Add button click handler */
const button = document.getElementById('btn-pay');
button.addEventListener('click', payment.show);
</script>
```

## 3. Process Transfer

When your customer clicks the 'Pay' button, a popup is loaded inside an iframe
that allows the user to complete the Transfer. When the transfer is processed,
the `onComplete` callback is called with a `Transfer` object parameter.

<aside class=warning>
   Make sure to validate the Transfer <a href="/api/#retrieve-a-transfer">on your server</a>. 
   Only `Transfer` objects with status <strong>`succeeded`</strong> should be considered 
   successful.
</aside>

# Javascript SDK

## Configuration options

The following options should be passed to `VerifyPayments` class:

Parameter | Description
--------- | -----------
`sessionId` | The ID of the session created by your server-side script
`publicKey` | Your public API key
`onComplete` | The callback that is triggered after a Transfer is completed (includes `transfer` parameter)
`onClose` | The callback triggered when the payment popup is closed

# Support

If you need any help integrating Verify Payments, let us know at [team@verify.as](mailto:team@verify.as)
