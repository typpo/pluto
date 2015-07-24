(function () {
  var maps = [
    {
      mappedBy: 'Hubble Space Telescope (ESA Faint Object Camera)',
      path: 'hs-2010-06-f-full_jpg.jpg',
      date: '1994',
      desc: 'Texture courtesy of NASA and Marc W. Buie (Southwest Research Institute).',
    },
    {
      mappedBy: 'Hubble Space Telescope (ESA Faint Object Camera)',
      path: 'hs-1996-09-c-full_jpg.jpg',
      date: 'March 7, 1996',
      desc: 'Texture courtesy of NASA.',
    },
    {
      mappedBy: 'Hubble Space Telescope (Advanced Camera for Surveys)',
      path: 'hs-2010-06-g-full_jpg.jpg',
      date: '2002-2003',
      desc: 'Texture courtesy of NASA and Marc W. Buie (Southwest Research Institute).',
    },
    {
      mappedBy: 'Hubble Space Telescope',
      path: 'pluto_all-long0.png',
      date: 'February 4, 2010',
      desc: 'Texture courtesy of Marc W. Buie (Southwest Research Institute).',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150625.png',
      date: 'June 25, 2015',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA.',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150703.png',
      date: 'July 3, 2015',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA.',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150707.png',
      date: 'July 7, 2015',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA.',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150709.png',
      date: 'July 9, 2015',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA.',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150711.0.png',
      date: 'July 11, 2015',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA.',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150711.png',
      date: 'July 11, 2015 evening',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA.',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150712.png',
      date: 'July 12, 2015',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA.',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150714.png',
      date: 'July 14, 2015',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA.',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150719.png',
      date: 'July 19, 2015',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA.',
    },
    {
      mappedBy: 'New Horizons',
      path: 'pluto-bjorn-20150719-filled.png',
      date: 'July 19, 2015',
      desc: 'Texture courtesy of Björn Jónsson, images from NASA. Area around south pole added artificially.',
    }
  ];

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius   = 0.5,
		segments = 32,
		rotation = 80;

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x333333));

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	scene.add(light);

  var sphere;
  var mapIndex = maps.length;   // Start at the most recent.
  function step(forwards) {
    if (forwards) {
      mapIndex++;
    } else {
      mapIndex--;
    }

    mapIndex = Math.min(maps.length - 1, mapIndex);
    mapIndex = Math.max(0, mapIndex);

    document.getElementById('jump-to').value = mapIndex + '';

    var timestep = maps[mapIndex];

    // Details setup.
    document.getElementById('mapped-by').innerHTML = timestep.mappedBy;
    document.getElementById('mapped-when').innerHTML = timestep.date;
    document.getElementById('credit').innerHTML = timestep.desc;

    // Sphere setup.
    var oldRotation = rotation;
    if (sphere) {
      oldRotation = sphere.rotation.y;
      scene.remove(sphere);
    }
    sphere = createSphere(timestep.path, radius, segments);
    if (mapIndex == maps.length) {
      mapIndex = 0;
    }
    sphere.rotation.y = oldRotation;
    scene.add(sphere)

    if (mapIndex == maps.length - 1) {
      document.getElementById('btn-next').style.display = 'none';
      mapIndex = maps.length - 1;
    } else {
      document.getElementById('btn-next').style.display = '';
    }

    if (mapIndex == 0) {
      document.getElementById('btn-prev').style.display = 'none';
      mapIndex = 0;
    } else {
      document.getElementById('btn-prev').style.display = '';
    }

    clearSelection();   // Sometimes part of the page can be selected on fast click.
  }

  step(false);

  var t = -1;
  document.addEventListener('keydown', function(e) {
    var now = new Date().getTime();
    if (now - t > 150) {
      // Left and right keys are 37 and 39 respectively, they step through the
      // select.
      var select = document.getElementById('years-ago');
      if (e.keyCode == 37) {
        step(false);
      } else if (e.keyCode == 39) {
        step(true);
      }
      t = now;
    }
  }, false);

  document.getElementById('btn-prev').onclick = function() {
    step(false);
  };
  document.getElementById('btn-next').onclick = function() {
    step(true);
  };

  var selectHtml = '';
  var jumpToElt = document.getElementById('jump-to');
  for (var i=maps.length-1; i > -1; i--) {
    var timestep = maps[i];
    selectHtml += '<option value="' + i + '">' + timestep.date + '</option>';
  }
  jumpToElt.value = maps.length - 1;
  jumpToElt.innerHTML = selectHtml;
  jumpToElt.onchange = function() {
    mapIndex = jumpToElt.value - 1;
    step(true);
  };

  var simulationClicked = false;
  webglEl.addEventListener( 'mousedown', function() {
    simulationClicked = true;
  }, false);

  setTimeout(function preloadTextures() {
    for (var i=0; i < maps.length; i++) {
      var im = new Image()
      im.src = 'images/' + maps[i].path;
    }
  }, 3000);

  /*
    var clouds = createClouds(radius, segments);
	clouds.rotation.y = rotation;
	scene.add(clouds)
 */

	var stars = createStars(90, 64);
	scene.add(stars);

  var controls = new THREE.OrbitControls(camera, webglEl);
  controls.minDistance = 1;
  controls.maxDistance = 20;
  controls.noKeys = true;
  controls.rotateSpeed = 1.4;

  THREEx.WindowResize(renderer, camera);

	webglEl.appendChild(renderer.domElement);

  //startCountdown();

	render();

	function render() {
		controls.update();
    if (sphere && !simulationClicked) {
      sphere.rotation.y += 0.0005;
    }
		//clouds.rotation.y += 0.0005;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

  function startCountdown() {
    setInterval(function() {
      var time = countdown(new Date(Date.UTC(2015, 6, 14, 11, 49)) ).toString();
      document.getElementById('timer').innerHTML = time;
    }, 1000);
  }

	function createSphere(texturePath, radius, segments) {
    //var map = THREE.ImageUtils.loadTexture('images/pluto_art.png');
    //var map = THREE.ImageUtils.loadTexture('images/pluto-bjorn-20150719-filled.png');
    //var map = THREE.ImageUtils.loadTexture('images/pluto-bjorn-20150625.png');
    var map = THREE.ImageUtils.loadTexture('images/' + texturePath);

		var mesh = new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				//map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
				map:         map,
        /*
        "color": 0xbbbbbb, "specular": 0x111111, "shininess": 1,
				bumpMap:     map,
				bumpScale:   0.02,
				specularMap: map,
       */
				//specular:    new THREE.Color('grey')
        /*
				bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
				specular:    new THREE.Color('grey')
        */
			})
		);
    return mesh;
	}

	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
				transparent: true
			})
		);
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
				side: THREE.BackSide
			})
		);
	}

  function clearSelection() {
    if(document.selection && document.selection.empty) {
      document.selection.empty();
    } else if(window.getSelection) {
      var sel = window.getSelection();
      sel.removeAllRanges();
    }
  }
}());
