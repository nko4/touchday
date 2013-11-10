var getCat, hold, nTime, setAction, todo, touch;

todo = false;

hold = false;

nTime = null;

getCat = function() {
  var cat;
  cat = $('#touchcat-cat');
  if (cat.length < 1) {
    cat = $('<div id="touchcat-cat"><div class="touchcat-message" /></div>').appendTo('body');
    $(cat).on('dragover', (function(e) {
      return e.preventDefault();
    }));
    $(cat).on('drop', function(e) {
      var files;
      e.preventDefault();
      files = e.originalEvent.dataTransfer.files;
      return console.log(files);
    });
    $(cat).on('mousedown', function(e) {
      window.hold = true;
      if (nTime) {
        clearTimeout(nTime);
      }
      setAction('pitch');
      $('body').attr('onselectstart', 'return false');
      $(cat).css('right', (100 - e.clientX / $(window).width() * 100) + '%');
      $(cat).css('bottom', (100 - e.clientY / $(window).height() * 100) + '%');
      $(window).on('mousemove', function(e) {
        $(cat).css('right', (100 - e.clientX / $(window).width() * 100) + '%');
        return $(cat).css('bottom', (100 - e.clientY / $(window).height() * 100) + '%');
      });
      return $(window).on('mouseup mouseleave', function(e) {
        $(window).off('mouseup mouseleave mousemove');
        $('body').removeAttr('onselectstart');
        $(cat).css('right', (100 - ($(cat).position().left + 300) / $(window).width() * 100) + '%');
        $(cat).css('bottom', '0%');
        setAction('drag');
        return nTime = setTimeout((function() {
          window.hold = false;
          return setAction('front_swing_tails');
        }), 500);
      });
    });
  }
  return cat;
};

setAction = function(action) {
  var cat;
  cat = getCat();
  $(cat).attr('class', 'cat-' + action);
  return $(cat).css('background-image', "url('chrome-extension://" + chrome.runtime.id + '/action/' + action + ".png')");
};

(touch = function() {
  var cat, pass;
  cat = getCat();
  if (!hold) {
    switch (Math.floor(Math.random() * 10)) {
      case 1:
        setAction('front_swing_nose');
        break;
      case 2:
        setAction('front_swing_tails');
        break;
      case 3:
        setAction('hungry');
        break;
      case 4:
        setAction('sleep');
        break;
      case 5:
        setAction('yawn');
        break;
      case 6:
        setAction('walk_normal_tails');
    }
  }
  if (todo) {
    pass = true;
    if (todo.url) {
      if (!new RegExp(todo.url, 'gi').exec(location.href)) {
        pass = false;
      }
    }
    if (todo.value) {
      if (!new RegExp(todo.value, 'gi').exec($('html').html())) {
        pass = false;
      }
    }
    if (pass === true) {
      console.log('PASS', todo);
      window.todo = false;
      chrome.runtime.sendMessage({
        v: 'task_pass'
      });
      $('.touchcat-message', cat).text('').removeClass('has-todo');
    }
  }
  return setTimeout(touch, 3000);
})();

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  var cat;
  cat = getCat();
  switch (req.v) {
    case 'assign':
      if (req.todo) {
        window.todo = {
          "name": req.todo.name,
          "message": req.todo.message,
          "url": req.todo.url,
          "value": req.todo.value,
          "type": req.todo.type
        };
        return $('.touchcat-message', cat).text(req.todo.message).addClass('has-todo');
      } else {
        window.todo = false;
        return $('.touchcat-message', cat).text('').removeClass('has-todo');
      }
      break;
    case 'active':
      if (hold) {
        return;
      }
      window.hold = true;
      $(cat).attr('class', '');
      $(cat).css('right', '-10%');
      return setTimeout(function() {
        setAction('walk_normal');
        $(cat).css('right', Math.floor(Math.random() * 40) + '%');
        return nTime = setTimeout((function() {
          window.hold = false;
          return setAction('walk_normal_tails');
        }), 1000);
      }, 500);
  }
});

/*
//@ sourceMappingURL=content.js.map
*/