action = ['yawn','walk_normal_tails','sleep','hungry','walk_normal']

getCat = () ->
  cat = $('#touchcat-cat')
  if cat.length < 1
    cat = $('<div id="touchcat-cat" />').appendTo('body')
    $(cat).on 'mousedown', (e) ->
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
        setAction('front_swing_nose')

  return cat

setAction = (action) ->
  cat = getCat()
  $(cat).attr 'class', 'cat-'+action
  $(cat).css 'background-image', "url('chrome-extension://"+chrome.runtime.id+'/action/'+action+".png')"

chrome.runtime.onMessage.addListener (req, sender, sendResponse)->
  switch req.v
    when 'assign'
      setAction('yawn')