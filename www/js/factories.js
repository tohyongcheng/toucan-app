// for storage purpose only
app.factory('GlobalFactory', function() {
  var my_children;

  var _get_my_children = function() {
    return my_children;
  }

  var _set_my_children = function(data) {
    my_children = data;
  }

  return {
    _get_my_children: _get_my_children,
    _set_my_children: _set_my_children
  };
});