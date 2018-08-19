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
id | The unique ID of this specific bank account
object | The type of the object (always `bank_account` for Bank Accounts)
name | The name of the person or business that owns the bank account
is_individual | Indicates if the owner of the bank account is an individual or a corporate entity
account_number | The bank-specific account number for this bank account
iban | The unique, internationally-recognized bank account ID for this account
currency | The 3-letter [ISO4217 currency code](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) for the bank account

## Create a bank account

When you create a bank account, you must specify the bank account holder (`Sender` or `Receiver`). The bank account will then be associated exclusively with that account holder.

```shell
curl https://api.verifypayments.com/bank_accounts \
  -H "Authorization: Bearer %test_secret_key%" \
  -d "sender={SENDER_ID}" \
  -d "name=Abdullah Mohamed Alahmed" \
  -d "iban=AE070331234567890123456" \
  -d "currency=AED"
```

### HTTP Request

`POST https://api.verifypayments.com/bank_accounts`

### Query Parameters

Parameter | Description
--------- | -----------
sender<div class=how_required>Optional</div> | The Sender ID that this bank account is associated with. Required when account is associated with a sender.
receiver<div class=how_required>Optional</div> | The Receiver ID that this bank account is associated with. Required when account is associated with a receiver.
name | The name of the person or business that owns the bank account
iban | The unique, internationally-recognized bank account ID for this account
currency | The 3-letter [ISO4217 currency code](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) for the bank account

## Retrieve a bank account

```shell
curl https://api.verifypayments.com/bank_accounts/<ID> \
  -H "Authorization: Bearer %test_secret_key%"
```

### HTTP Request

`GET https://api.verifypayments.com/bank_accounts/<ID>`

### Query Parameters

Parameter | Description
--------- | -----------
id<div class=how_required>Required</div> | The bank account you'd like to retrieve the details for

# Transfers

A Transfer object is created when you initiate a transfer from a `source` bank account to a `destination` bank account. Most transfers require [Verifications](#verifications) to complete.

## The transfer object

```json
{
  "id": "tr_a52e8452378ed0f77540a5084fc3b702",
  "object": "transfer",
  "currency": "AED",
  "amount": "10000",
  "status": "success",
  "source_id": "ba_8676aa794678cc51c9f1538893518e6d",
  "destination_id": "ba_b7739d06fbf4d4aa2460c69686eb1d56",
  "created_at": "2018-03-01T13:12:22-08:00"
}
```

### Parameters

Parameter | Description
--------- | -----------
id | The unique ID of this specific bank transfer
object | The type of the object (always `transfer` for Transfers)
currency | The 3-letter [ISO4217 currency code](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) for the transfer
amount | The transfer amount, in fils (e.g. 1000 = AED10.00)
status | The status of the transfer. Can be either `pending`, `failed` or `success`
source_id | The source [Bank Account](#the-bank-account-object) from which funds will be withdrawn. This must belong to a `sender`
destination_id | The destination [Bank Account](#the-bank-account-object) to which funds will be deposited. This must belong to a `receiver`

## Create a transfer

```shell
curl "https://api.verifypayments.com/transfers/" \
  -H "Authorization: Bearer %test_secret_key%" \
  -d "currency=AED" \
  -d "amount=10000" \
  -d "source_id=ba_8676aa794678cc51c9f1538893518e6d" \
  -d "destination_id=ba_b7739d06fbf4d4aa2460c69686eb1d56"
```

### HTTP Request

`POST https://api.verifypayments.com/transfers/`

### URL Parameters

Parameter | Description
--------- | -----------
currency | The 3-letter [ISO4217 currency code](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) for the transfer
amount | The transfer amount, in fils (e.g. 1000 = AED10.00)
source_id | The source [Bank Account](#the-bank-account-object) from which funds will be withdrawn. This must belong to the presently authenticated `sender` (i.e. whose API key is used to submit the request)
destination_id | The destination [Bank Account](#the-bank-account-object) to which funds will be deposited. This must belong to a `receiver`

## Get all transfers

```shell
curl "https://api.verifypayments.com/transfers" \
  -H "Authorization: Bearer %test_secret_key%"
```

This endpoint retrieves all transfers, sorted in reverse-chronological order (i.e. from newest to oldest).

### HTTP Request

`GET https://api.verifypayments.com/transfers`

## Retrieve a specific transfer

```shell
curl "https://api.verifypayments.com/transfers/<ID>" \
  -H "Authorization: Bearer %test_secret_key%"
```

### HTTP Request

`GET https://api.verifypayments.com/transfers/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
id<div class=how_required>Required</div> | The ID of the transfer we'd like to retrieve

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
curl "https://api.verifypayments.com/verifications/<ID>" \
  -X PUT \
  -H "Authorization: Bearer %test_secret_key%" \
  -d "challenge_response=123456"
```

Submit the `challenge_response` for a verification. This request is idempotent, and you can safely submit the request multiple times.

### HTTP Request

`PUT https://api.verifypayments.com/verifications/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
id<div class=how_required>Required</div> | The ID of the verification that we're submitting the `challenge_response` for
challenge_response<div class=how_required>Required</div> | The response provided by the customer to the verification challenge
