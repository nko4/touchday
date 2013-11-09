config =
  token: null

chrome.extension.onMessage.addListener (req, sender, sendResponse)->
  switch req.v
    when 'set_config'
      config[req.key] = req.value
      sendResponse {status: 1}
    when 'get_config'
      if req.key? and config[req.key]?
        sendResponse {status: 1, value: config[req.key]}
      else
        sendResponse {status: -1, value: false}
    else
      sendResponse {status: 0}