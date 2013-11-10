jQuery(function ($) {
  'use strict';

  var $win = $(window);

  var home = {
    elems: {},

    elemSelectors: {
      'video': '#video',
      'videoLoading': '.video-loading',
      'videoSection': '#video-section',
      'sections': '.section',
      'menu': '#menu',
      'mac': '.drag-section__mac',
      'takeabreak': '.drag-section__take-a-break',
      'hand': '.pitch-section__hand',
      'cats': '.cats-section__cats__line',
      'login': '.intro-section__mbp__screen__login',
      'intro': '.intro-section__text'
    },

    page: null,

    main: function () {
      this.queryElems();
      this.initPage();
      this.videoInit();
      this.bindWindowEvents();
    },

    queryElems: function () {
      var i;
      var selectors = this.elemSelectors;
      var elems = this.elems;
      for (i in selectors) {
        if (selectors.hasOwnProperty(i)) {
          elems[i] = $(selectors[i]);
        }
      }
    },

    bindWindowEvents: function () {
      $win.on('resize', this.onResize.bind(this));
      $win.resize();
    },
    
    onResize: function () {
      this.videoOnResize();
    },

    getWinSize: function () {
      return {
        width: $win.width(),
        height: $win.height()
      };
    },
    
    // page
    pageTransition: function (target, progress, transition) {
      var prop, range;
      for (prop in transition) {
        if (transition.hasOwnProperty(prop)) {
          range = transition[prop].to - transition[prop].from;
          target.css(prop, range / 100 * progress + transition[prop].from + (transition[prop].unit || ''));
        }
      }
    },

    initPage: function () {
      var page = this.page = sections.create({
        interval: 25
      });

      page.on('changed', function () {
        home.selectSection(page.__currentIndex);
      });

      page.section(0, function (section) {
        var scrollDown = home.elems.videoSection.find('.video-scroll-down');
        var scrollDownTransition = {
          'margin-top': {
            from: 120,
            to: 300,
            unit: 'px'
          }
        };
        section.on('progress', function (progress) {
          if (progress < 0) {
            home.pageTransition(scrollDown, -1 * progress, scrollDownTransition);
          }
        });
      });

      page.section(1, function (section) {
        var macTransition = {
          'margin-right': {
            from: 300,
            to: -100,
            unit: 'px'
          },
          'opacity': {
            from: 0,
            to: 1
          }
        };
        var takeabreakTransition = {
          'opacity': {
            from: 0,
            to: 1
          },
          'margin-left': {
            from: 300,
            to: 80,
            unit: 'px'
          }
        };
        section.on('progress', function (progress, pageHeight, pageTop) {
          if (progress > 0) {
            var mac = home.elems.mac;
            var takeabreak = home.elems.takeabreak;
            home.pageTransition(mac, progress, macTransition);
            home.pageTransition(takeabreak, progress, takeabreakTransition);
          }
        });
      });

      page.section(2, function (section) {
        var handTransition = {
          'margin-right': {
            from: -1200,
            to: -826,
            unit: 'px'
          }
        };
        section.on('progress', function (progress) {
          if (progress > 0) {
            var hand = home.elems.hand;
            home.pageTransition(hand, progress, handTransition);
          }
        });
      });

      page.section(3, function (section) {
        var evenTransition = {
          top: {
            from: 900,
            to: 0,
            unit: 'px'
          }
        };
        var oddTransition = {
          top: {
            from: 0,
            to: 900,
            unit: 'px'
          }
        };
        var cats = home.elems.cats;
        section.on('progress', function (progress) {
          if (progress < 0) {
            progress = 100 - progress * -1;
          }
          home.pageTransition(cats.eq(0), progress, evenTransition);
          home.pageTransition(cats.eq(2), progress, evenTransition);
          home.pageTransition(cats.eq(1), progress, oddTransition);
          home.pageTransition(cats.eq(3), progress, oddTransition);
        });
      });

      page.section(4, function (section) {
        var loginTransition = {
          'top': {
            from: -500,
            to: 45,
            unit: 'px'
          }
        };
        var introTrinsition = {
          'margin-left': {
            from: -800,
            to: -500,
            unit: 'px'
          },
          opacity: {
            from: 0,
            to: 1
          }
        };
        section.on('progress', function (progress) {
          if (progress > 0) {
            var login = home.elems.login;
            var intro = home.elems.intro;
            home.pageTransition(login, progress, loginTransition);
            home.pageTransition(intro, progress, introTrinsition);
          }
        });
      });

      page.start();

      this.createSectionMenu();
    },

    createSectionMenu: function () {
      var page = this.page;
      var html = '';
      page.each(function (index, section) {
        html += '<li class="menu__sections__item"><a class="menu__sections__btn" href="">' + index + '</a></li>';
      });
      html += '<li class="menu__sections__item"><a class="menu__sections__download" href="https://chrome.google.com/webstore/detail/hoaghoddfoiocckakhkkfgmjhieinlbf"></a></li>';
      var nav = $(html);
      var sections = this.elems.sections;
      nav.on('click', '.menu__sections__btn', function () {
        var $this = $(this);
        var index = $this.parent().index();
        home.selectSection(index);
        $('html, body').animate({
          scrollTop: sections.eq(index).offset().top
        }, 'fast');
        return false;
      });
      var menu = this.elems.menu.find('.menu__sections').append(nav);
      menu.css({marginTop: -(menu.height() / 2) + 'px'});
    },

    selectSection: function (i) {
      var btn = this.elems.menu.find('.menu__sections .menu__sections__item').eq(i);
      var last = this.elems.menu.find('.menu__sections .menu__sections__item.current');
      last.removeClass('current');
      btn.addClass('current');
    },

    // video
    videoInit: function () {
      var $video = this.elems.video;
      var $loading = this.elems.videoLoading;
      this.loadVideo();
      $video.on('canplay', function () {
        $loading.removeClass('display');
        $video.addClass('display');
        home.playVideo();
      });
      $video.on('loadstart', function () {
        $loading.addClass('display');
      });
      $video.on('timeupdate', this.videoTimeupdate.bind(this));
    },

    videoOnResize: function () {
      var size = this.scaleVideoSize();
      var $video = this.elems.video;
      var $section = this.elems.videoSection;
      $video.css({
        width: size.width + 'px',
        height: size.height + 'px',
        marginLeft: -(size.width / 2) + 'px'
      });
      $section.css({
        minHeight: size.height + 'px'
      });
      this.page.updateWindowSize();
    },

    scaleVideoSize: function () {
      var loop = true;
      var winSize = this.getWinSize();
      var size = {
        width: winSize.width,
        height: 1080 * winSize.width / 1920
      };
      var tmp;
      while (loop) {
        loop = false;
        if (winSize.width > size.width) {
          tmp = size.width / winSize.width;
          size.width = winSize.width;
          size.height /= tmp;
          loop = true;
        }
        if (winSize.height > size.height) {
          tmp = size.height / winSize.height;
          size.height = winSize.height;
          size.width /= tmp;
          loop = true;
        }
      }
      return size;
    },

    videoActions: [
      {
        startTime: 6.3,
        started: false,
        startAction: function () {
          home.elems.videoSection.find('.video-slogan').addClass('display');
          var letters = home.elems.videoSection.find('.video-slogan__letter');
          letters.each(function (index) {
            var $letter = $(this);
            setTimeout(function () {
              $letter.addClass('display');
            }, index * 150 + 100);
          });
        }
      },
      {
        startTime: 7.3,
        started: false,
        startAction: function () {
          home.elems.menu.addClass('display');
        }
      }
    ],

    videoTimeupdate: function () {
      var $video = this.elems.video;
      var video = $video[0];
      var actions = this.videoActions;
      var i, len = actions.length;
      var action;
      var current = video.currentTime;
      for (i = 0; i < len; i += 1) {
        action = actions[i];
        if (action.startTime <= current && !action.started) {
          action.started = true;
          action.startAction.call(this);
        }
      }
    },

    loadVideo: function () {
      var video = this.elems.video[0];
      video.load();
    },

    playVideo: function () {
      var video = this.elems.video[0];
      video.play();
    },

    pauseVideo: function () {
      var video = this.elems.video[0];
      video.pause();
    }
  };

  home.main();
});
