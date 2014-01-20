      var container, stats;

      var camera, controls, scene, renderer;

      var cross;

      init();
      animate();

      function init() {

        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.z = 500;

        controls = new THREE.OrbitControls( camera );
        controls.addEventListener( 'change', render );

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

        // world

          var cube = new THREE.Mesh(
              new THREE.CubeGeometry( 5, 5, 5 ),
              new THREE.MeshLambertMaterial( { color: 0xFF0000 } )
          );
          scene.add( cube );


        // lights

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        light = new THREE.DirectionalLight( 0x002288 );
        light.position.set( -1, -1, -1 );
        scene.add( light );

        light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );


        // renderer

        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setClearColor( scene.fog.color, 1 );
        renderer.setSize( window.innerWidth, window.innerHeight );

        container = document.getElementById( 'container' );
        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.zIndex = 100;
        container.appendChild( stats.domElement );

        //

        window.addEventListener( 'resize', onWindowResize, false );

      }

      function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        render();

      }

      function animate() {

        requestAnimationFrame( animate );
        controls.update();

      }

      function render() {

        renderer.render( scene, camera );
        stats.update();

      }


