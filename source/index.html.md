---
title: Verify Payments Documentation
toc_footers:
  - <a href='/api'>API Reference</a>
  - <a href='https://demo.verifypayments.com' target="_blank">Demo <sup><i class="fas fa-external-link-alt"></i></sup></a>
---

# Getting Started

## Overview

Processing bank transfer with Verify Payments is a two-step process, involving
both server-side and client-side steps:

1. (Server) Create a session using your Private API key including the `amount`, 
   `currency` and `description`.
1. (Client) Initiate a Transfer from your website using the session created 
   earlier with your Public API key.
1. (Client) Customer completes the Transfer.

Here is how it looks:

<p id="scheme">
  <img src="/images/how-it-works.png" />
</p>

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


If you need any help integrating Verify Payments, [let us know](/#support).

# Javascript SDK

## Configuration options

The following options should be passed to `VerifyPayments` class:

Parameter | Description
--------- | -----------
`sessionId` | The ID of the session created by your server-side script
`publicKey` | Your public API key
`onComplete` | The callback that is triggered after a Transfer is completed (includes `transfer` parameter)
`onClose` | The callback triggered when the payment popup is closed

# API Keys

You can authenticate requests to the Verify Payments API by including an API key
in the request that you send. Every account (whether Test or Live) has a pair of API
keys: **secret** and **public**.

<aside class=notice>
<strong>Heads up</strong> &mdash; Never use your <strong>secret key</strong> in any 
  public environments including client-side web apps or mobile applications. It should 
  only be used in direct server-to-server calls.
</aside>

The secret keys are used to authenticate with the API — keep these private! Make
sure not to commit them to your source code repositories or share them. The
public keys used on the client side with our [Javascript SDK] in web or mobile
application where they can be easily seen by other developers.

We tried to make it easy to distinguish test API Keys from live ones and secret
from private. Here is how. Each API key has a prefix **sk** or **pk** which
means *secret key* or *public key*. Also, each API key contains the word **live** or
**test**.  If your API key looks like this: `pk_test_aPx0PtQprQ...` it's a public test
API key. If it looks like this `sk_live_dQODRGgH...` it's a secret key of a live account.

[Contact us](#support) to get your API keys for test or live account.

# Testing

Thoroughly test your integration before going live using test information provided below.

## Test Account

Inside VerifyPayments you have a **Test Account** which lets you test your
integration. Test Account works with a **Test Bank**. So, all transactions are
imitated and you can perform testing without being worred about real money.

### Test API Keys

When you perform API requests or use Javascript SDK you have to use API Keys
of a test account.

### Currencies and Balance

Test Bank supports *AED*, *BHD* and *USD* currencies. Inside Test Bank you have three accounts:

* AED account with 10.00 AED balance
* BHD account with 1.000 BHD balance
* USD account with 10.00 USD balance


## Test Credentials

The following usernames can be used during login to produce specific results,
useful for testing different scenarios:

Username | Result
--------- | -----------
`failure` | Login fails
`test` | Login succeeds and transfer succeeds as well
`test_otp` | Request for OTP during login, transfer succeeds
`test_questions` | Request for secret questions during login, transfer succeeds
`test_transfer_failure` | Login succeeds but transfer fails
`test_transfer_otp` | Request for otp before transfer, transfer succeeds
`test_transfer_questions` | Request for otp before transfer, transfer succeeds

# Support

We would be glad to help you with any questions. Just let us know if you need
any help at [team@verify.as](team@verify.as).
