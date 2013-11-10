var getCat, hold, nTime, service, setAction, todo, touch, walk;

todo = false;

hold = false;

nTime = null;

service = true;

getCat = function() {
  var cat;
  cat = $('#touchcat-cat');
  if (cat.length < 1) {
    cat = $('<div id="touchcat-cat"><div class="touchcat-message" /></div>').appendTo('body');
    if (todo !== false) {
      $('.touchcat-message', cat).text(todo.message).addClass('has-todo');
    } else {
      $('.touchcat-message', cat).text('').removeClass('has-todo');
    }
    $(cat).on('dragover', (function(e) {
      return e.preventDefault();
    }));
    $(cat).on('drop', function(e) {
      var file, files, heat, total_size, _i, _len;
      e.preventDefault();
      files = e.originalEvent.dataTransfer.files;
      heat = 0;
      if (files.length > 0) {
        total_size = 0;
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          total_size += file.size;
        }
        heat += total_size / 1000;
      } else {
        heat += 2;
        if (/fish/gi.exec(location.href)) {
          heat += 2;
        }
      }
      console.log('eat eat up', heat);
      if (heat > 0) {
        return chrome.runtime.sendMessage({
          v: 'eat',
          value: heat
        });
      }
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
  if (service === false) {
    return;
  }
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

walk = function() {
  var cat;
  window.hold = true;
  cat = getCat();
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
};

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  switch (req.v) {
    case 'service':
      if (req.value) {
        walk();
      } else {
        $('#touchcat-cat').remove();
        window.hold = false;
      }
      return window.service = req.value;
    case 'assign':
      if (req.todo) {
        console.log('new task');
        window.todo = {
          "name": req.todo.name,
          "message": req.todo.message,
          "url": req.todo.url,
          "value": req.todo.value,
          "type": req.todo.type
        };
        if ($('#touchget-cat').length > 0) {
          return $('.touchcat-message', getCat()).text(req.todo.message).addClass('has-todo');
        }
      } else {
        window.todo = false;
        if ($('#touchcat-cat').length > 0) {
          return $('.touchcat-message', getCat()).text('').removeClass('has-todo');
        }
      }
      break;
    case 'active':
      if (hold || service === false) {
        return;
      }
      return walk();
  }
});

/*
//@ sourceMappingURL=content.js.map
*/