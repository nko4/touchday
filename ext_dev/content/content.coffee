action = ['yawn','walk_normal_tails','sleep','hungry','walk_normal']

getCat = () ->
  cat = $('#touchcat-cat')
  cat = $('<div id="touchcat-cat" class="cat-yawn" />').appendTo('body') if cat.length < 1
  return cat

setAction = (action) ->
  $(getCat()).css 'background-image', "url('chrome-extension://"+chrome.runtime.id+'/action/'+action+".png')"

chrome.runtime.sendMessage {greeting: "hello"}, (response) ->
  console.log(response)

chrome.runtime.onMessage.addListener (req, sender, sendResponse)->
  switch req.v
    when 'assign'
      setAction('yawn')