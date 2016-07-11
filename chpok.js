var THREE = THREE || {};


THREE.Chpok = (function(){

  function Chpok( container, camera, intersects ){

    var Chpok = {
      Mouse: {
        current: new THREE.Vector2(),
        previous: new THREE.Vector2(),
        gap: new THREE.Vector2(),
        down: false
      },
      raycaster: new THREE.Raycaster(),
      camera: camera,
      container: container,
      intersects: intersects
    };

    Chpok.Intersects = [];

    // EVENTS
    Chpok.Events = {

      _: {
        dragged: false,
        active: false,
        hover: false
      },

      EventSwitcher: function( event ){

      },

      MouseDown:  function (event) {
        var _inter = Chpok.Events.INTER(event);
        if( _inter ){
            _inter.event = event;
            Chpok.Events._.active = _inter;
            _inter.object.dispatchEvent({ type: 'mousedown', inter: _inter });
            _inter.object.dispatchEvent({ type: 'click', inter: _inter });
        };
        Chpok.Mouse.down = true;
      },

      MouseUp: function(event){
        var _inter = Chpok.Events.INTER(event);
        if( _inter ){
            _inter.event = event;
            Chpok.Events._.active = false;
            _inter.object.dispatchEvent({ type: 'mouseup', inter: _inter });
        };
        Chpok.Mouse.down = false;
      },

      MouseMove: function(event){
        Chpok.Events.MouseResetPosition(event);

        var _inter = Chpok.Events.INTER(event);

        if( _inter ){

          _inter.event = event;

          if( Chpok.Events._.hover ){
            if( _inter.object != Chpok.Events._.hover.object ){
              Chpok.Events._.hover.object.dispatchEvent({ type: 'mouseleave', inter: _inter });
              Chpok.Events._.hover = _inter;
              Chpok.Events._.hover.object.dispatchEvent({ type: 'mouseenter', inter: _inter });
              Chpok.Events._.hover.object.dispatchEvent({ type: 'mousemove', inter: _inter });
            }
          } else {
            Chpok.Events._.hover = _inter;
            Chpok.Events._.hover.object.dispatchEvent({ type: 'mouseenter', inter: _inter });
            Chpok.Events._.hover.object.dispatchEvent({ type: 'mousemove', inter: _inter });
          }
        } else {
          if(Chpok.Events._.hover){
            Chpok.Events._.hover.event = event;
            Chpok.Events._.hover.object.dispatchEvent({ type: 'mouseleave', inter: _inter });
            Chpok.Events._.hover = false;
          };
        };

      },

      MouseResetPosition: function(eve){
        eve.offsetX = eve.offsetX || eve.clientX;
        eve.offsetY = eve.offsetY || eve.clientY;
        Chpok.Mouse.previous.copy( Chpok.Mouse.current );
        Chpok.Mouse.current.set(((eve.offsetX / Chpok.container.offsetWidth ) * 2) - 1, -((eve.offsetY / Chpok.container.offsetHeight ) * 2) + 1);
        Chpok.Mouse.gap.set( Chpok.Mouse.current.x - Chpok.Mouse.previous.x,  Chpok.Mouse.current.y - Chpok.Mouse.previous.y);
      },

      INTER: function( event ){
        Chpok.raycaster.setFromCamera( Chpok.Mouse.current, Chpok.camera );
        var Intersects = Chpok.raycaster.intersectObjects( Chpok.intersects , true );
        //if(event.type == 'mousedown') console.log( Intersects );
        return Intersects[0];
      },

      Context: function( event ){
        event.stopPropagation();
      },

      Listen: function () {
        Chpok.container.addEventListener( "mouseup", Chpok.Events.MouseUp, false);
        Chpok.container.addEventListener( "mousedown",  Chpok.Events.MouseDown, false);
        Chpok.container.addEventListener( "mousemove",  Chpok.Events.MouseMove, false);
        Chpok.container.addEventListener( 'contextmenu', Chpok.Events.Context, false );
      },

      Unlisten: function(){
        Chpok.container.removeEventListener( "mouseup", Chpok.Events.MouseUp, false);
        Chpok.container.removeEventListener( "mousedown",  Chpok.Events.MouseDown, false);
        Chpok.container.removeEventListener( "mousemove",  Chpok.Events.MouseMove, false);
        Chpok.container.removeEventListener( 'contextmenu', Chpok.Events.Context, false );
      }

    };


    Chpok.Events.Listen();
  };

  Chpok.storage = [];

  return Chpok;
})();