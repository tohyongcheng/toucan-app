// for storage purpose only
app.factory('GlobalFactory', function() {
  var my_children;
  var my_family;

  var _get_my_children = function() {
    return my_children;
  }

  var _set_my_children = function(data) {
    my_children = data;
  }

  var _get_my_family = function() {
    return my_family;
  }

  var _set_my_family = function(data) {
    my_family = data;
  }

  return {
    _get_my_children: _get_my_children,
    _set_my_children: _set_my_children,
    _get_my_family: _get_my_family,
    _set_my_family: _set_my_family
  };
});