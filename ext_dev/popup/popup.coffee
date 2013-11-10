$ ->
  $('#login .btn-login').on 'click', () ->
    chrome.tabs.create({url:"http://touchday.2013.nodeknockout.com/user/authorize"})

  chrome.runtime.sendMessage {v:'whoami'}, (res) ->
    if res.value isnt no
      $('body').addClass 'passport'
      $('#info .name').text res.value
    else
      $('body').removeClass 'passport'

  life = Snap(".life .diagram")
  life_diagram = life.path
        path: getPath(50,100,28),
        fill: "none",
        stroke: "#ff9f16",
        strokeWidth: 8
  life_animate = Snap.animate 50, 100, ((val) -> life_diagram.attr({path: getPath(val,100,28)})), 1000
  
  fish = Snap(".fish .diagram")
  fish_diagram = fish.path
        path: getPath(50,100,28),
        fill: "none",
        stroke: "#24df9a",
        strokeWidth: 8
  fish_animate = Snap.animate 50, 100, ((val) -> fish_diagram.attr({path: getPath(val,100,28)})), 1000

getPath = (value, total, R) ->
  S = 64 / 2
  alpha = 360 / total * value
  a = (90 - alpha) * Math.PI / 180
  x = S + R * Math.cos(a)
  y = S - R * Math.sin(a)
  if total is value
    path = [["M"+ S, S - R], ["A"+ R, R, 0, 1, 1, S - 0.01, S - R]]
  else
    path = [["M"+ S, S - R], ["A"+ R, R, 0, +(alpha > 180), 1, x, y]]
  return path.join()        