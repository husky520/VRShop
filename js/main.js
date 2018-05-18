/**
 * Main.js
 */








/**
 * Create a mesh with .obj and .mtl files
 */
function createObjMtl (options) {
	// options = {
	// 	objPath: '',
	// 	objFileName: '',
	// 	mtlBaseUrl: '',
	// 	mtlPath: '',
	// 	mtlFileName: '',
	// 	completeCallback: function (object) {},
	// 	progress: function (persent) {}
	// }

	// when .mtl file used .dds images (???)
	// THREE.loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

	// Load mtl and obj
	var mtlLoader = new THREE.MTLLoader();
	// mtlLoader.setBaseUrl(options.mtlBaseUrl); // set ??? path
	mtlLoader.setPath(options.mtlPath); // set mtl file path

	mtlLoader.load(options.mtlFileName, function (materials){
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials); // set obj material
		objLoader.setPath(options.objPath); // set obj file path

		objLoader.load(options.objFileName, function (object) {
			if (typeof options.completeCallback == 'function') {
				options.completeCallback(object);
			}
		},function (xhr) {
			if (xhr.lengthComputable) {
				var percentComplete = xhr.loaded / xhr.total * 100;
				if (typeof options.progress == 'function') {
					var randomNumber = Math.round(percentComplete, 2);
					options.progress(randomNumber);
					console.log(randomNumber + '% downloaded');
				}
			}
		}, function (error) {
			// ...
		});
	});
}


/**
 * Main
 */
var container, stats;
var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

function init () {
	// Get container
	container = document.getElementById('app');
	
	// Create camera and scene
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100000);
	camera.position.set(8000, 5000, 8000);

	scene = new THREE.Scene();

	// Global Light
	var ambient = new THREE.AmbientLight(0xffffff, 1);
	scene.add(ambient);

	// Lights

  var pointlight1 = new THREE.PointLight(0xffffaa, 1, 0); 
  pointlight1.position.set(1000, 5000, 2000);
  scene.add( pointlight1 );

  var pointlight2 = new THREE.PointLight(0xffffff, 0.5, 0); 
  pointlight2.position.set(5000, 10000, -10000);
  scene.add( pointlight2 );

  // scene.add( new THREE.PointLightHelper( pointlight1 ) );
  // scene.add( new THREE.PointLightHelper( pointlight2 ) );

	// Create main object with .mtl and .obj
	createObjMtl({
			objPath: '../model/demo2/',
			objFileName: 'demo2.obj',
			mtlBaseUrl: '../model/demo2/',
			mtlPath: '../model/demo2/',
			mtlFileName: 'demo2.mtl',
			completeCallback: function (object) {
				object.traverse(function (child) {
					if (child instanceof THREE.Mesh) {
						// child.material.side = THREE.DoubleSide;
						// child.material.emissive.r = 0;
						// child.material.emissice.g = 0.01;
						// child.material.emissice.b = 0.05;
						child.material.transparent = true;
						// child.material.opacity = 0;
						// child.material.shading = THREE.SmoothShading;
					}
				});

				object.emissice = 0x00ffff;
				object.ambient = 0x00ffff;
				object.position.x = 0;
				object.position.y = 0;
				object.position.z = 0;
				object.scale.x = 1;
				object.scale.y = 1;
				object.scale.z = 1;
				object.name = 'happy';
				scene.add(object);
			},
			progress: function (percent) {
				// if (percent < 100) {
				// 	$('.progress').show();
				// }
				$('.progress-bar').css("width",percent+"%");
				$('.progress-percent').text(percent + '%');
				if (percent >= 100) {
					$('.progress').hide();
				}
			}
	});

	// Render
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	// Listen events
	// document.addEventListener('mousemove', onDocumentMouseMove, false);
	// document.addEventListener('resize', onWindowResize, false);
	console.log('init over');
}

init();

/**
 * Control page
 */
var controls = new THREE.OrbitControls(camera, container);

// controls.minPolarAngle = 1; // 极坐标最小值
// controls.maxPolarAngle = 1.5; // 极坐标最大值
controls.enableDamping = true; // 是否有惯性
controls.dampingFactor = 0.25; // 鼠标拖拽灵敏度
controls.enableZoom = true; // 是否可以缩放
// controls.autoRotate = true; // 是否自动旋转
controls.rotateSpeed = 0.1; // ???
controls.minDistance = 3000; // 相机距离原点最近距离
controls.maxDistance = 50000; // 相机距离原点最远距离
controls.enablePan = true; // 是否开启右键拖拽
controls.enableKeys = false; // ???


/**
 * Animation
 */
animate();

function animate () {
	requestAnimationFrame (animate);
	render();
}

function render () {
	camera.lookAt(scene.position);
	renderer.render(scene, camera);
}
