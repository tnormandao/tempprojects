var Zegla = (function(){

  var Instruction = function( i1, i2 ){
    this.constructor = Instruction;
    this._S = [];
    if ( i1 && i2 && typeof i1 == 'string' && typeof i2 == 'function') {
      this.add( i1, i2);
    } else if(i1 && !i2 && typeof i1 == 'function'){
      this.add( i1 );
    }
  };
  Instruction.prototype.add = function(a1, a2){
    if (a1 && !a2 && typeof a1 == 'function'){
      this._S.push( { n: 'f_'+this._S.length, f: a1 } );
    } else if ( a1 && a2 && typeof a1 == 'string' && typeof a2 == 'function') {
      this._S.push( { n: a1, f: a2 } );
    }
  };
  Instruction.prototype.set = function(a1, a2){
    if ( a1 && a2 && typeof a1 == 'string' && typeof a2 == 'function') {
      var fo = false;
      if(this._S.length > 0){
        for(var i = 0; i < this._S.length; i++){
          if(this._S[i].n == a1) {
            this._S[i] = { n: a1, f: a2 };
            fo = true;
          }
          if( i == this._S.length-1 && !fo){
            this.add( a1, a2);
          }
        }
      } else {
        this.add( a1, a2);
      }
    } else if(a1 && !a2 && typeof a1 == 'function'){
      this.add( a1 );
    }
  };
  Instruction.prototype.get = function(n){
    var N = (typeof n == 'string') ? 'n' : 'f';
    if(n){
      for(var i = 0; i < this._S.length; i++){
        if(this._S[i][N] == n){
          return this._S[i].f;
        }
      }
    } else {
      return this._S;
    }
    return false;
  };
  Instruction.prototype.drop = function(n){
    if(n){
      var N = (typeof n == 'string') ? 'n' : 'f';
      for(var i = 0; i < this._S.length; i++){
        if(this._S[i][N] == n){
          this._S.splice(i, 1);
        }
      }
    } else {
      this._S = [];
    }
  };
  Instruction.prototype.run = function( t, ff, cb ){
    var t = t ? t : false, ff = ff ? ff : false;
    for(var i = 0; i < this._S.length; i++){
      if(!ff){
        this._S[i].f(t , this._S[i].n );
      } else {
        if( ff( this._S[i].n, i ) ){
          this._S[i].f( t , this._S[i].n );
        }
      } if( cb && i == this._S.length-1){
        cb();
      }
    }
  };


  function Zegla( containerID ){
    var App = this;
    App._ = {}; // Utility namespace

    var containerID = containerID || 'three_container';
    // Load container
    App.container = document.getElementById( containerID );

    App._.Instruction = Instruction;

    App.Animations = new Instruction;

    // set Scene to App object
    App.scene = new THREE.Scene();

    // ini View methods
    App.View = {
      _SW: function(){ return App.container.offsetWidth},
      _SH: function(){ return App.container.offsetHeight},
      view_angle: 45,
      aspect: function(){ return App.View._SW() / App.View._SH() },
      near: 0.1,
      far: 30000,
      center: new THREE.Vector3( -0.5, 3, -0.5 ),
      resize: function( event ){
        App.gl.setSize( App.View._SW(), App.View._SH());
        App.camera.aspect = App.View.aspect();
        App.camera.updateProjectionMatrix();
      }
    };
    window.addEventListener( "resize",  App.View.resize, false);

    // CAMERA INI
    App.camera = new THREE.PerspectiveCamera(  App.View.view_angle,  App.View.aspect(),  App.View.near,  App.View.far );
    App.scene.add(App.camera);
    App.camera.position.set( -0.5, 5, -0.5 );


    // GL INI
    App.gl = new THREE.WebGLRenderer({
      clearAlpha: 1,
      antialias: true,
      sortObjects: false
    });
    App.gl.setClearColor(0x000000);
    App.gl.setSize( App.View._SW(), App.View._SH() );
    App.gl.sortObjects = true;

    App.container.appendChild( App.gl.domElement );

    // CONTROLS INI
    App.controls = new THREE.OrbitControls( App.camera, App.gl.domElement );
    App.controls.enablePan = true;
    App.controls.enableRotate = true;
    App.controls.enableZoom = true;
    App.controls.minDistance = 0.3;
    App.controls.maxDistance = 11110.3;

    //FOG INI
    App.scene.fog = new THREE.Fog( '#ffffff', 5, 50000000000 );

    // LIGHT
    App.ambientLight = new THREE.AmbientLight(0x555555);
    App.scene.add(App.ambientLight);


    App.directionalLight = new THREE.DirectionalLight( 0xcccccc );
    App.directionalLight.position.set( 1, 1, 0.5 );
    App.scene.add( App.directionalLight );

    // ANIMATION SETTINGS
    App.Animate = function(){
      App.frame++;
      App.gl.render( App.scene,  App.camera );
      App.Animations.run();
      requestAnimationFrame( App.Animate );
    };
    App.Animate();

  }

  return Zegla;
})();