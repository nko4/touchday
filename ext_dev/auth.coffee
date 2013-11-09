$ ->
  taken = /token=([^&]+)/i.exec(location.href)
  if taken
    chrome.runtime.sendMessage 
      v: "set_config"
      key: 'taken'
      value: taken[1]