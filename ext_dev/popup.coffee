$ ->
  $('#login').on 'click', () ->
    chrome.tabs.create({url:"http://localhost:8080/user/authorize"})