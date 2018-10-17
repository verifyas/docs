# Getting Started

Processing bank transfer with Verify Payments is a two-step process, with a
server-side and a client-side actions:

1. Using your private API key your server-side code creates a session which
   includes amount, currency and description.
1. From your website or mobile application, using our JS-SDK, you initiate bank
   transfer for created session using public API key.
1. Customer confirms and Verify Payments processes transfer by moving money
   from to your bank account.

Here is how it looks:


<div id="scheme">
    <img src="/images/how-it-works.png" />
</div>

## 1. Create a Session. 

In order to create a session you have to make an API request with amount,
currency and description at this endpoint:

`POST %api_endpoint%/sessions/`


<aside class=notice>Authentication and request parameters are described in <a href="/api/#create-a-session">API Reference</a>.</aside>

Here is the code example for Node.js:

```js
require('request');
var request = require('request-promise');

request.post({
  url: 'https://api.verifypayments.com/sessions/',
  'auth': {
    'bearer': '%test_secret_key%'
  },
  json: {
    currency: 'BHD',
    amount: 1,
    description: 'Order #123 at Merchant Name'
  }
}).then(function(session) {
  console.log('Session ID: ' + session.id);
}).catch(function(err) {
  console.log('Error: ' + err.response.body.message);
});
```

## 2. Initiate Transfer

Once a session is created, you can render a web page with our JS-SDK to
initiate transfer. When page loads, you should create a `VerifyPayments`
object, passing [configuration parameters](#configuration-options). Then you
can call `open()` method on the object in response to any event (like button
click):

```html
<button id='opener'>Pay</button>

<script src="https://js.verifypayments.com/sdk.js"></script>
<script>
const payment = new VerifyPayments({
  sessionId: 'SESSION_ID_SHOULD_BE_RENDERED_HERE',
  publicKey: publicKey,
  onComplete: function(transfer) { console.log(transfer); },
  onClose: function() { console.log('onClose called'); }
});

const button = document.getElementById('opener');
button.addEventListener('click', payment.show);
</script>
```

## 3. Process Transfer

When customer clicks the 'Pay' button JS-SDK opens a popup inside the iframe
with the necessary steps to complete transfer. Once the transfer is processed,
the callback 'onComplete' will be called with transfer object as argument.

<aside class=warning>Regardless of returned transfer object you have to make a server-side call to
<a href="/api/#retrieve-a-transfer">Retrieve Tranfer API</a> to double check transfer
status. Only Transfer with status <strong>succeeded</strong> can be considered as
a successfully processed transfer.</aside>

# JS-SDK

## Configuration options

The following options should be passed to `VerifyPayments` class:

Parameter | Description
--------- | -----------
sessionId | The ID of created session
publicKey | Public API Key
onComplete | The callback to handle transfer object after it's created
onClose | The callback to handle close event (when popup is closed)


# Support

If you have any questions on Verify Payments integration please, let us know at [team@verify.as](mailto:team@verify.as)
