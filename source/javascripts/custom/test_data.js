/**
 * Automatically replaces the following strings with real keys:
 *   %test_secret_key%
 *   %test_public_key%
 */

$(function(){
  fetch('http://api.verifypayments.com/test_data')
    .then(function(response) {
      return response.json();
    })
    .then(function(obj) {
      findAndReplaceApiKeys(obj.api_keys);
    });
});

function findAndReplaceApiKeys(keys) {
  window.findAndReplaceDOMText(
    document.getElementsByTagName('body')[0], {
    find: /%test_secret_key%/g,
    replace: keys.secret_key
  });

  window.findAndReplaceDOMText(
    document.getElementsByTagName('body')[0], {
    find: /%test_public_key%/g,
    replace: keys.public_key
  });
}
