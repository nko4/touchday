var getPath;

$(function() {
  var fish, fish_animate, fish_diagram, life, life_animate, life_diagram;
  $('#login .btn-login').on('click', function() {
    return chrome.tabs.create({
      url: "http://touchday.2013.nodeknockout.com/user/authorize"
    });
  });
  chrome.runtime.sendMessage({
    v: 'whoami'
  }, function(res) {
    if (res.value !== false) {
      $('body').addClass('passport');
      return $('#info .name').text(res.value);
    } else {
      return $('body').removeClass('passport');
    }
  });
  life = Snap(".life .diagram");
  life_diagram = life.path({
    path: getPath(50, 100, 28),
    fill: "none",
    stroke: "#ff9f16",
    strokeWidth: 8
  });
  life_animate = Snap.animate(50, 100, (function(val) {
    return life_diagram.attr({
      path: getPath(val, 100, 28)
    });
  }), 1000);
  fish = Snap(".fish .diagram");
  fish_diagram = fish.path({
    path: getPath(50, 100, 28),
    fill: "none",
    stroke: "#24df9a",
    strokeWidth: 8
  });
  return fish_animate = Snap.animate(50, 100, (function(val) {
    return fish_diagram.attr({
      path: getPath(val, 100, 28)
    });
  }), 1000);
});

getPath = function(value, total, R) {
  var S, a, alpha, path, x, y;
  S = 64 / 2;
  alpha = 360 / total * value;
  a = (90 - alpha) * Math.PI / 180;
  x = S + R * Math.cos(a);
  y = S - R * Math.sin(a);
  if (total === value) {
    path = [["M" + S, S - R], ["A" + R, R, 0, 1, 1, S - 0.01, S - R]];
  } else {
    path = [["M" + S, S - R], ["A" + R, R, 0, +(alpha > 180), 1, x, y]];
  }
  return path.join();
};

/*
//@ sourceMappingURL=popup.js.map
*/