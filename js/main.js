// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// create a spot light
var spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 0, 10);
scene.add(spotLight);


// ------------------------------------------------
// TRIANGLE
// ------------------------------------------------

var geom = new THREE.Geometry();

var v0 = new THREE.Vector3(0, 0, 0);
var v1 = new THREE.Vector3(0, 1, 0);
var v2 = new THREE.Vector3(1, 1, 0);
var v3 = new THREE.Vector3(1, 0, 0);

geom.vertices.push(v0);
geom.vertices.push(v1);
geom.vertices.push(v2);
geom.vertices.push(v3);
geom.faces.push(new THREE.Face3(0, 1, 2));
geom.faces.push(new THREE.Face3(0, 2, 3));
geom.computeFaceNormals();
geom.castShadow = false; //default is false
geom.receiveShadow = false; //default

var material2 = new THREE.MeshPhongMaterial ({ color: "#433F81"  });
material2.side = THREE.DoubleSide;

var object = new THREE.Mesh(geom, material2);

//scene.add(object);

// ------------------------------------------------
// SPHERE
// ------------------------------------------------

var geometry = new THREE.SphereGeometry( 0.03, 4, 4);
var yellow = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var red = new THREE.MeshBasicMaterial( {color: 0xff0000} );
var yellowPt = new THREE.Mesh( geometry, yellow );
var redPt = new THREE.Mesh( geometry, red );
//scene.add( yellowPt );
//scene.add( redPt );


yellowPt.position.copy(v0);
redPt.position.copy(v2);

// ------------------------------------------------
// Wireframe
// ------------------------------------------------

// THREE.Wireframe ( WireframeGeometry2, LineMaterial )
var geometry = new THREE.WireframeGeometry2( geom );

var matLine = new THREE.LineMaterial( {
    color: 0xffffff,
    linewidth: 0.001, // in pixels
    //resolution:  // to be set by renderer, eventually
    dashed: false
} );

wireframe = new THREE.Wireframe( geometry, matLine );
wireframe.computeLineDistances();
wireframe.scale.set( 1, 1, 1 );
//scene.add( wireframe );

// ------------------------------------------------
// NurbsCurve
// ------------------------------------------------
var group = new THREE.Group();
    group.position.y = 0;

scene.add( group );

var nurbsControlPoints = [];
var nurbsKnots = [];
var nurbsDegree = 2;

for ( var i = 0; i <= nurbsDegree; i ++ ) 
{
    nurbsKnots.push( 0 );
}

for ( var i = 0, j = 3; i < j; i ++ ) 
{
    nurbsControlPoints.push
    (
        new THREE.Vector4
        (
		    Math.random() ,
		    Math.random() ,
		    Math.random() ,
		    1
	    )
    );
    
    var knot = ( i + 1 ) / ( j - nurbsDegree );

    console.log("i: " + i);
    console.log("j: " + j);
    console.log("knot: " + knot);
    console.log("---------------");

    nurbsKnots.push( THREE.Math.clamp( knot, 0, 1 ) );
}

var nurbsCurve = new THREE.NURBSCurve( nurbsDegree, nurbsKnots, nurbsControlPoints );
var nurbsGeometry = new THREE.BufferGeometry();
    nurbsGeometry.setFromPoints( nurbsCurve.getPoints( 200 ) );
    
var nurbsMaterial = new THREE.LineBasicMaterial( { linewidth: 0.1, color: 0xFFFFFF } );
var nurbsLine = new THREE.Line( nurbsGeometry, nurbsMaterial );
	nurbsLine.position.set( 0, 0, 0 );
    group.add( nurbsLine );
    
var nurbsControlPointsGeometry = new THREE.BufferGeometry();
    nurbsControlPointsGeometry.setFromPoints( nurbsCurve.controlPoints );
    
var nurbsControlPointsMaterial = new THREE.LineBasicMaterial( { linewidth: 2, color: 0xFF00FF, opacity: 0.75, transparent: true } );
var nurbsControlPointsLine = new THREE.Line( nurbsControlPointsGeometry, nurbsControlPointsMaterial );
	nurbsControlPointsLine.position.copy( nurbsLine.position );
	group.add( nurbsControlPointsLine );


renderer.render(scene, camera);

// Render Loop
var render = function () {
    requestAnimationFrame(render);

    //  object.rotation.y += 0.005;

    // Render the scene
    renderer.render(scene, camera);
};

render();