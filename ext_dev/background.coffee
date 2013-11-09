class Config extends Backbone.Model
  defaults:
    token: false

config = new Config()

config.on 'change:token', (model, value) ->
  console.log 'change:token', value
  if value
    if socket?
      console.log 'send token', config.get('token')
      socket.emit 'user.kiss', {what: 'my ass', token: config.get('token')}
    else
      window.socket = io.connect('http://touchday.2013.nodeknockout.com/')
      socket.on 'connect', () ->
        console.log 'send token', config.get('token')
        socket.emit 'user.kiss', {what: 'my ass', token: config.get('token')}

chrome.tabs.onActiveChanged.addListener (id) ->
  chrome.tabs.sendMessage id,
    v: 'assign'
    action: 'xyz'

chrome.tabs.onActiveChanged.addListener (id,status,tab) ->
  if status.status is 'loading' and tab.active
    chrome.tabs.sendMessage id,
      v: 'assign'
      action: 'xyz'

chrome.extension.onMessage.addListener (req, sender, sendResponse)->
  switch req.v
    when 'set_config'
      config.set req.key, req.value
      sendResponse {status: 1}
    when 'get_config'
      value = config.get(req.key)
      if value?
        sendResponse {status: 1, value: value}
      else
        sendResponse {status: -1, value: false}
    else
      sendResponse {status: 0}