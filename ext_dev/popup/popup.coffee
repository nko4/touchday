$ ->
  $('#login').on 'click', () ->
    chrome.tabs.create({url:"http://touchday.2013.nodeknockout.com/user/authorize"})