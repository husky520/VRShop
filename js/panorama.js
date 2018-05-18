/**
 * Main.js
 *
 * Load page config from url query string;
 * Create mesh, camera and renderer;
 */

class CreateScene {
	// 
  constructor (FOV, element, imgUrl, geometryObj) {
      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth/window.innerHeight, 0.1, 1000 );

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( window.innerWidth, window.innerHeight );

      element.appendChild( this.renderer.domElement );

      this.texture = CreateScene.loadImg(imgUrl);

      this.material = new THREE.MeshBasicMaterial();
      this.material.map = this.texture;
      this.material.side = THREE.DoubleSide;

      this.object = new THREE.Mesh(geometryObj , this.material);
  }
  // Load Image
  static loadImg (imgUrl) {
      return new THREE.TextureLoader().load(imgUrl);
  }
}



/**
 * Load page config
 */

const app = document.getElementById('app');

// ### Sphere ###
const sphereScene = new CreateScene(60, app, 'img/picture.jpg', new THREE.SphereGeometry(500, 100, 100));
const sphere = sphereScene.object;

sphere.scale.x = -1;

sphereScene.scene.add( sphere );


sphereScene.camera.position.x = 0;
sphereScene.camera.position.z = 0;

const animate = function () {
	requestAnimationFrame( animate );
	sphereScene.renderer.render(sphereScene.scene, sphereScene.camera);
};
animate();



// ####################################################################################

function move(distanceX, distanceY) {
	
	sphere.rotation.x += distanceY;
	sphere.rotation.y += distanceX;

	// Stop if rotate to top and bottom
	if (sphere.rotation.x > Math.PI * 0.5){
		sphere.rotation.x = Math.PI * 0.5;
	}
	if (sphere.rotation.x < -Math.PI * 0.5){
		sphere.rotation.x = -Math.PI * 0.5;
	}
}


window.onload = function(){
	let x, y, client_x, client_y;

	// PC
	app.addEventListener('mousedown', function() {
		app.addEventListener('mousemove', listenMove);
	});
	app.addEventListener('mouseup', function() {
		app.removeEventListener('mousemove', listenMove);
	});

	// Mobile Phone
	app.addEventListener('touchstart', function(event) {
		const e = event || window.event;
		e.preventDefault();
		app.addEventListener('touchmove', listenMove);
	});
	app.addEventListener('touchend', function() {
		x = y = undefined;
		app.removeEventListener('touchmove', listenMove);
	});

	
	function listenMove (event) {
		const e = event || window.event;

		if (e.changedTouches) {
			if (x === undefined) {
				x = 0;
				y = 0;
				client_x = e.changedTouches[0].clientX;
				client_y = e.changedTouches[0].clientY;
			}

			x = -(e.changedTouches[0].clientX - client_x) * 0.002;
			y = -(e.changedTouches[0].clientY - client_y) * 0.002;
			client_x = e.changedTouches[0].clientX;
			client_y = e.changedTouches[0].clientY;
		} else {
			x = -e.movementX * 0.002;
			y = -e.movementY * 0.002;
		}
		
		move(x, y);
	}
}








