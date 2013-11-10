class Config extends Backbone.Model
  defaults:
    token: false
    name: null

config = new Config()

config.on 'change:token', (model, value) ->
  console.log 'change:token', value
  if value
    config.set 'name', ''
    if socket?
      console.log 'send token', config.get('token')
      socket.emit 'user.kiss', {what: 'my ass', token: config.get('token')}, () ->
        socket.emit 'user.whoami', ((status,res) -> config.set 'name', res.name)
    else
      window.socket = io.connect('http://touchday.2013.nodeknockout.com/')
      socket.on 'connect', () ->
        console.log 'send token', config.get('token')
        socket.emit 'user.kiss', {what: 'my ass', token: config.get('token')}, () ->
          socket.emit 'user.whoami', ((status,res) -> config.set 'name', res.name)
      socket.on 'shit', (taskid, assign) ->
        console.log taskid, assign

chrome.tabs.onActiveChanged.addListener (id) ->
  console.log 'change tab', id
  chrome.tabs.sendMessage id,
    v: 'assign'
    action: 'xyz'

chrome.tabs.onUpdated.addListener (id,status,tab) ->
  if tab.active
    console.log 'update tab', id
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
    when 'whoami'
      name = config.get('name')
      sendResponse {status: 1, value: if name? then name else false}
    else
      sendResponse {status: 0}