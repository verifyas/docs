function findAndReplaceApiEndpoint(){window.findAndReplaceDOMText(document.getElementsByTagName("body")[0],{find:/%api_endpoint%/g,replace:API_BASE})}function findAndReplaceApiKeys(e){window.findAndReplaceDOMText(document.getElementsByTagName("body")[0],{find:/%test_secret_key%/g,replace:e.secret}),window.findAndReplaceDOMText(document.getElementsByTagName("body")[0],{find:/%test_public_key%/g,replace:e["public"]})}const API_BASE="https://api.verifypayments.com";$(function(){findAndReplaceApiEndpoint(),fetch(API_BASE+"/test_data").then(function(e){return e.json()}).then(function(e){findAndReplaceApiKeys(e.api_keys[0])})});