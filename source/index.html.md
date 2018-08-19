---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ

search: true
---

# Introduction

Welcome to the Verify Payments API 👋! The reference documentation below describes the various functions that you can use to initiate, track and manage fiat transfer using the Verify Payments API.

<aside class="notice">
This API is currently in beta. We may push breaking changes to the API endpoints on short notice. Make sure to <a href="https://groups.google.com/a/lists.verify.as/forum/#!forum/api-announcements" target="_blank" data-link="_">join our mailing list</a> to get notified of such changes ahead of time.
</aside>

# Authentication

> To authorize, use this code:

```shell
# With shell, you can just pass the correct header with each request
curl "https://api.stgverifypayments.com/" \
  -H "Authorization: Token %test_secret_key%"
```

> The code above actually works. You can paste it directly in your terminal to try it out!

You can authenticate requests to the Verify Payments API by including your public key or secret key in the request that you send, depending on the endpoint. Each endpoint will indicate which key it expects from you. We currently use [Token authentication](https://tools.ietf.org/html/rfc6750) without the underlying OAuth 2.0 protocol.

<aside class=notice>
<strong>Heads up</strong> &mdash; Never use your <strong>secret key</strong> in any public environments including client-side web apps or mobile applications. It should only be used in direct server-to-server calls.
</aside>

The private keys used to authenticate with the API are generated through the Dashboard &mdash; keep these private! Make sure not to commit them to your source code repositories or share them.

Include the API key for all requests to the server in a header that looks like the following: `Authorization: Token "%test_secret_key%"`

All API calls must be made using [HTTPS](http://en.wikipedia.org/wiki/HTTP_Secure). Calls made over unsecured HTTP connections will fail.

# Banks

Before the user can sign in to their bank, they must select one from a list of supported banks.

## The bank object

```json
{
  "id": "test_bank",
  "object": "bank",
  "name": "Test Bank"
}
```

### Parameters

Parameter | Description
--------- | -----------
id | The unique ID of this specific bank
object | The type of the object (always `bank` for Banks)
name | The name of the bank in user-readable form

## List all banks

> Example Request:

```shell
curl https://api.stgverifypayments.com/banks \
  -H "Authorization: Token %test_public_key%"
```

### HTTP Request

`GET https://api.stgverifypayments.com/banks`

### Query Parameters

This endpoint does not require any parameters

> Example Response:

```json
[
  {
    "id": "test_bank",
    "name": "Test Bank",
    "object": "bank"
  }
]
```

# Sessions

A Session represents a connection with a customers bank account. An active session must exist beforer a Transfer can be initiated.

## The session object

```json
{
  "id": "ses_pvhOgYMSNPpM",
  "object": "session",
  "status": "initial",
  "created_at": "2018-08-19T10:10:43.612Z",
  "updated_at": "2018-08-19T10:10:43.612Z"
}
```

### Parameters

Parameter | Description
--------- | -----------
id | The unique ID of this specific session
object | The type of the object (always `session` for Sessions)
status | The status of the session. Can be either `initial`,  `pending_verification`, `connected`, `failed` or `completed`

## Create a session

> A session can only be created using your **secret key**

```shell
curl "https://api.stgverifypayments.com/sessions/" \
  -H "Authorization: Token %test_secret_key%" \
  -d "currency=AED" \
  -d "amount=10000" \
  -d "description=My First Session" \
```

### HTTP Request

`POST https://api.stgverifypayments.com/sessions/`

### URL Parameters

Parameter | Description
--------- | -----------
currency | The 3-letter [ISO4217 currency code](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) for the transfer that you will create after this session is established
amount | The transfer amount, in fils (e.g. 1000 = AED10.00)
description | A desciption that can be included on the checkout screen shown to the user

# Verifications

A Verification object is created whenever additional verification is required in order for a transfer to be completed.

There are various methods for verification:

- SMS Verification (`sms`)
- Two Factor Authentication, or 2FA (`two_factor_auth`)
- Secret Question (`secret_question`)

The specific verification method required will depend on the bank account that a transfer is initiated from.

## The verification object

```json
{
  "id": "vrf_dd2e878a149ab1d6b3df3a3cb1f060a4",
  "object": "verification",
  "method": "sms",
  "challenge_text": "Enter the SMS code sent to your mobile number ending in 789",
  "challenge_response": "124990",
  "status": "passed",
  "transfer_id": "tr_a52e8452378ed0f77540a5084fc3b702",
  "expires_on": "2018-03-01T13:12:22-08:00"
}
```

### Parameters

Parameter | Description
--------- | -----------
id | The unique ID of this verification
object | The type of the object (always `verification` for Verifications)
method | The method of verification required (either `sms`, `two_factor_auth` or `secret_question`)
challenge_text | A human-friendly text that can be displayed to users in your custom UI
challenge_response | The response that was submitted for this verification attempt
status | The status of the verification. Can be either `pending`, `failed` or `success`
transfer_id | The [Transfer](#the-transfer-object) to which this verification belongs

## Submit a verification

```shell
curl "https://api.stgverifypayments.com/verifications/<ID>" \
  -X PUT \
  -H "Authorization: Token %test_secret_key%" \
  -d "challenge_response=123456"
```

Submit the `challenge_response` for a verification. This request is idempotent, and you can safely submit the request multiple times.

### HTTP Request

`PUT https://api.stgverifypayments.com/verifications/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
id<div class=how_required>Required</div> | The ID of the verification that we're submitting the `challenge_response` for
challenge_response<div class=how_required>Required</div> | The response provided by the customer to the verification challenge
