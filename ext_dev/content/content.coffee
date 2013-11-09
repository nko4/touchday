drawCat = () ->
  $('<div id="touchcat-cat" />').appendTo('body')

chrome.runtime.sendMessage {greeting: "hello"}, (response) ->
  console.log(response)

chrome.runtime.onMessage.addListener (req, sender, sendResponse)->