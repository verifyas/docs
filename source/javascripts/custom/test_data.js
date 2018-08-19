/**
 * Automatically replaces the following strings with real keys:
 *   %test_secret_key%
 *   %test_public_key%
 */

$(function(){
  fetch('https://api.stgverifypayments.com/test_data')
    .then(function(response) {
      return response.json();
    })
    .then(function(obj) {
      findAndReplaceApiKeys(obj.api_keys[0]);
    });
});

function findAndReplaceApiKeys(keys) {
  window.findAndReplaceDOMText(
    document.getElementsByTagName('body')[0], {
    find: /%test_secret_key%/g,
    replace: keys.secret
  });

  window.findAndReplaceDOMText(
    document.getElementsByTagName('body')[0], {
    find: /%test_public_key%/g,
    replace: keys.public
  });
}
