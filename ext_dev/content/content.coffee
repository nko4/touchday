todo = false

hold = off

nTime = null

getCat = () ->
  cat = $('#touchcat-cat')
  if cat.length < 1
    cat = $('<div id="touchcat-cat"><div class="touchcat-message" /></div>').appendTo('body')
    $(cat).on 'mousedown', (e) ->
      window.hold = on
      clearTimeout(nTime) if nTime
      setAction('pitch')
      $('body').attr('onselectstart','return false')
      $(cat).css('right', (100 - e.clientX / $(window).width() * 100) + '%')
      $(cat).css('bottom', (100 - e.clientY / $(window).height() * 100) + '%')
      $(window).on 'mousemove', (e) ->
        $(cat).css('right', (100 - e.clientX / $(window).width() * 100) + '%')
        $(cat).css('bottom', (100 - e.clientY / $(window).height() * 100) + '%')
      $(window).on 'mouseup mouseleave', (e)->
        $(window).off 'mouseup mouseleave mousemove'
        $('body').removeAttr('onselectstart')
        $(cat).css('right', (100 - ($(cat).position().left+300) / $(window).width() * 100)+'%')
        $(cat).css('bottom', '0%')
        setAction('drag')
        nTime = setTimeout (->
          window.hold = off
          setAction('front_swing_tails')
        ), 500

  return cat

setAction = (action) ->
  cat = getCat()
  $(cat).attr 'class', 'cat-'+action
  $(cat).css 'background-image', "url('chrome-extension://"+chrome.runtime.id+'/action/'+action+".png')"

(touch = () ->
  cat = getCat()
  unless hold
    switch Math.floor(Math.random() * 10)
      when 1 then setAction('front_swing_nose')
      when 2 then setAction('front_swing_tails')
      when 3 then setAction('hungry')
      when 4 then setAction('sleep')
      when 5 then setAction('yawn')
      when 6 then setAction('walk_normal_tails')

  if todo
    pass = yes
    if todo.url
      pass = no unless new RegExp(todo.url,'gi').exec(location.href)
    if todo.value
      pass = no unless new RegExp(todo.value,'gi').exec($('html').html())
    if pass is yes
      console.log 'PASS', todo
      window.todo = false
      chrome.runtime.sendMessage {v:'task_pass'}
      $('.touchcat-message',cat).text('').removeClass('has-todo')
  setTimeout touch, 3000
)()

chrome.runtime.onMessage.addListener (req, sender, sendResponse)->
  cat = getCat()
  switch req.v
    when 'assign'
      if req.todo
        window.todo = 
          "name": req.todo.name
          "message": req.todo.message
          "url": req.todo.url
          "value": req.todo.value
          "type": req.todo.type
        $('.touchcat-message',cat).text(req.todo.message).addClass('has-todo')
      else
        window.todo = false
        $('.touchcat-message',cat).text('').removeClass('has-todo')
    when 'active'
      return if hold
      window.hold = on
      $(cat).attr('class', '')
      $(cat).css('right', '-10%')
      setTimeout () ->
        setAction('walk_normal')
        $(cat).css('right', Math.floor(Math.random() * 40)+'%')
        nTime = setTimeout (->
          window.hold = off
          setAction('walk_normal_tails')
        ), 1000
      , 500