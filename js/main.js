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

var spHgeometry = new THREE.SphereGeometry( 0.04, 4, 4);
var yellow = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var red = new THREE.MeshBasicMaterial( {color: 0xff0000} );
// var yellowPt = new THREE.Mesh( spHgeometry, yellow );
// var redPt = new THREE.Mesh( spHgeometry, red );
// scene.add( yellowPt );
// scene.add( redPt );


// yellowPt.position.copy(v0);
// redPt.position.copy(v2);

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
scene.add( group );


var nurbsDegree = 2;

var nurbsControlPointsUp= [
    new THREE.Vector4 ( -5 ,2.5, 0,1),
    new THREE.Vector4 ( -2.5 ,3, 0,1),
    new THREE.Vector4 ( 2.5 ,2, 0,1),
    new THREE.Vector4 ( 5 ,2.5, 0,1),
];

var nurbsControlPointsDown= [
    new THREE.Vector4 ( -5 ,-2.5, 0,4),
    new THREE.Vector4 ( -3 ,-3, 0,1),
    new THREE.Vector4 ( 2 ,-2, 0,2),
    new THREE.Vector4 ( 5 ,-2.5, 0,1),
];

var pointValue =200;
var nurbsKnots = NURBSHelper.getNurbsKnots(nurbsControlPointsUp, nurbsDegree);
var pointArray = Triangle.createRows(nurbsControlPointsUp,nurbsControlPointsDown,5);
var nurbsMaterial = new THREE.LineBasicMaterial( { linewidth: 0.1, color: 0xFFFFFF } );

pointArray.forEach(cps => {

    var nC = new THREE.NURBSCurve( nurbsDegree, nurbsKnots, cps );
    var nCGeo= new THREE.BufferGeometry();
    nCGeo.setFromPoints( nC.getPoints( pointValue ) );
    var nLine = new THREE.Line( nCGeo, nurbsMaterial );
    group.add( nLine );

    cps.forEach(vec4 => {

        var pt = new THREE.Mesh( spHgeometry, red );
        scene.add( pt );
    
        pt.position.copy(new THREE.Vector3(vec4.x, vec4.y, vec4.z))
    });
    
});

renderer.render(scene, camera);

// Render Loop
var render = function () {
    requestAnimationFrame(render);

    //  object.rotation.y += 0.005;

    // Render the scene
    renderer.render(scene, camera);
};

render();