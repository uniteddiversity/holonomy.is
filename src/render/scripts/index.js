var $ = window.jQuery = require('jquery/dist/jquery')(window);
require('jquery-waypoints');
var _ = require('lodash');

var gears = require('./gears');

$(function () {
  window.onresize = setGears;
  setGears();
  setWaypoints();
});

var setGears = function () {
  var gearsSelector = 'body > header .gears';
  var gearsContainerEl = document.querySelector(gearsSelector);
  var gearsSvgEl = gearsContainerEl.querySelector('svg');
  if (gearsSvgEl) {
    gearsContainerEl.removeChild(gearsSvgEl)
  }
  
  gears({
    selector: gearsSelector,
    width: gearsContainerEl.clientWidth,
    height: gearsContainerEl.clientHeight,
  });
};

var setWaypoints = function () {
  var nav = $('body > nav');
  var mainMenu = $('body > nav > ul');
  
  mainMenu.waypoint({
    handler: function (direction) {
      if (direction == 'down') {
        nav.css({ 'height': mainMenu.outerHeight() });
      } else {
        nav.css({ 'height':'auto' });
      }
      mainMenu.toggleClass('sticky', direction === 'down');
    },
  });

  // setup waypoints for nested menus
  var setMenuWaypoints = function (menu) {
    console.log("waypoints!", menu);
    // if no menu or array of 0 menus, return
    if (!(menu && menu.length)) { return; }

    // for each menu item
    menu.find('li').each(function (index, itemEl) {

      var item = $(itemEl);

      // get the link id of the current menu item
      var linkId = item.find('a').first().attr('href');
      // handle slashes within link id
      linkId = linkId.replace('/', '\\/');
      // get link by id
      var link = $(linkId);

      // when the link is hit,
      link.waypoint({
        handler: function (direction) {
          var isDown = (direction === 'down');
          var isUp = (direction === 'up');

          // when scrolling down,
          if (isDown) {
            // activate current item
            item.toggleClass('active', true);
            // deactivate previous item
            item.prev().toggleClass('active', false);
          } // when scrolling up,
          else if (isUp) {
            // deactivate current item
            item.toggleClass('active', false);
            // activate previous item
            item.prev().toggleClass('active', true);
          }
        },
      });

      setMenuWaypoints(item.find('ul'));
    });
  };

  setMenuWaypoints($('body > nav > ul'));
};