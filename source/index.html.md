---
title: API Reference

language_tabs: # must be one of https://git.io/vQNgJ

search: true
---

# Introduction

Welcome to the Verify Payments API 👋! The reference documentation below describes the various functions that you can use to initiate, track and manage fiat payments using the Verify Payments API.

<aside class="notice">
This API is currently in alpha. We may make breaking changes to the API endpoints on short notice. Make sure to <a href="#">subscribe to our mailing list</a> to get notified of such changes ahead of time.
</aside>

# Authentication

> To authorize, use this code:

```shell
# With shell, you can just pass the correct header with each request
curl "https://api.verifypayments.com/" \
  -H "Authorization: Bearer %test_secret_key%"
```

> The code above actually works. You can paste it directly in your terminal to try it out!

You can authenticate requests to the Verify Payments API by including your secret key in the request that you send. We currently use [Bearer authentication](https://tools.ietf.org/html/rfc6750) without the underlying OAuth 2.0 protocol.

<aside class=notice>
<strong>Heads up</strong> &mdash; We plan to add SSL/TLS certificate-based authentication in the near future.
</aside>

The token access keys used to authenticate with the API are generated through the Dashboard &mdash; keep these private! Make sure not to commit them to your source code repositories or share them.

Include the API key for all requests to the server in a header that looks like the following: `Authorization: Bearer "%test_secret_key%"`

All API calls must be made using [HTTPS](http://en.wikipedia.org/wiki/HTTP_Secure). Calls made over unsecured HTTP connections will fail.

# Bank Accounts

A Bank Account object is created when a user logs in with their online banking credentials. Verify retrieves the various account details and creates Bank Account objects for each supported account. These objects can then be used to initiate [Transfers](#transfers).

## The bank account object

```json
{
  "id": "ba_81047f09b378e5fe896372868579fb06",
  "object": "bank_account",
  "name": "Abdullah Mohamed Alahmed",
  "is_individual": "true",
  "account_number": "67890123456",
  "iban": "AE070331234567890123456",
  "currency": "AED",
  "last_accessed": "2018-03-01T13:12:22-08:00"
}
```

<!-- TODO: Update this to include the Bank details in the Bank Account object -->

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
curl https://api.verifypayments.com/bank_accounts/ \
  -H "Authorization: Bearer %test_secret_key%" \
  -d "sender={SENDER_ID}" \
  -d "name=Abdullah Mohamed Alahmed" \
  -d "iban=AE070331234567890123456" \
  -d "currency=AED"
```

### HTTP Request

`POST https://api.verifypayments.com/bank_accounts/`

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

## Get All Transfers

```shell
curl "https://api.verifypayments.com/transfers"
  -H "Authorization: %test_secret_key%"
```

This endpoint retrieves all transfers, sorted in reverse-chronological order (i.e. from newest to oldest).

### HTTP Request

`GET https://api.verifypayments.com/transfers/`

## Get a Specific Transfer

```shell
curl "https://api.verifypayments.com/transfers/<ID>/" \
  -H "Authorization: %test_secret_key%"
```

### HTTP Request

`GET https://api.verifypayments.com/transfers/<ID>`

### URL Parameters

Parameter | Description
--------- | -----------
id<div class=how_required>Required</div> | The ID of the transfer we'd like to retrieve

# Verifications
