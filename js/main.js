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

var material2 = new THREE.MeshPhongMaterial({ color: "#433F81" });
material2.side = THREE.DoubleSide;

var object = new THREE.Mesh(geom, material2);

//scene.add(object);

// ------------------------------------------------
// SPHERE
// ------------------------------------------------

var spHgeometry = new THREE.SphereGeometry(0.04, 4, 4);
var yellow = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
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
var geometry = new THREE.WireframeGeometry2(geom);

var matLine = new THREE.LineMaterial({
    color: 0xffffff,
    linewidth: 0.001, // in pixels
    //resolution:  // to be set by renderer, eventually
    dashed: false
});

wireframe = new THREE.Wireframe(geometry, matLine);
wireframe.computeLineDistances();
wireframe.scale.set(1, 1, 1);
//scene.add( wireframe );

// ------------------------------------------------
// NurbsCurve
// ------------------------------------------------
var group = new THREE.Group();
scene.add(group);

var nurbsDegree = 2;

var nurbsControlPointsUp = [
    new THREE.Vector4(-5, 2.5, 0, 1),
    new THREE.Vector4(-2.5, 3, 0, 1),
    new THREE.Vector4(2.5, 2, 0, 1),
    new THREE.Vector4(5, 2.5, 0, 1),
];

var nurbsControlPointsDown = [
    new THREE.Vector4(-5, -2.5, 0, 4),
    new THREE.Vector4(-3, -3, 0, 1),
    new THREE.Vector4(2, -2, 0, 2),
    new THREE.Vector4(5, -2.5, 0, 1),
];

var pointValue = 20;
var uDivision = 40;
var vDivision = 300;
var nurbsKnots = NURBSHelper.getNurbsKnots(nurbsControlPointsUp, nurbsDegree);
var nurbsMaterial = new THREE.LineBasicMaterial({ linewidth: 0.15, color: 0xFFFFFF });

// ------------------------------------------------
// NurbsCurves Erstellung
// ------------------------------------------------

var nurbsCrvs = new Array(vDivision + 1);

var p = 1.00 / vDivision;
var cpCount = nurbsControlPointsUp.length;


for (u = 0; u < vDivision + 1; u++) {

    var pts = new Array(cpCount);

    for (i = 0; i < cpCount; i++) {
        var vA = nurbsControlPointsUp[i];
        var vB = nurbsControlPointsDown[i];

        var vC = new THREE.Vector3();

        vC = vC.subVectors(vB, vA);
        vC.multiplyScalar(u / uDivision);
        vC.add(vA);

        pts[i] = vC;
    }

    nurbsCrvs[u] = new THREE.NURBSCurve(nurbsDegree, nurbsKnots, pts);
}

// ------------------------------------------------
// NurbsCurves Darstellung
// ------------------------------------------------

nurbsCrvs.forEach(nurbsCrv => {

    var nCGeo = new THREE.BufferGeometry();
    nCGeo.setFromPoints(nurbsCrv.getPoints(pointValue));
    var nLine = new THREE.Line(nCGeo, nurbsMaterial);
    group.add(nLine);
});

// ------------------------------------------------
// CreateParams
// ------------------------------------------------

// Parameterraum ist 0-1
var uLength = 1.00 / uDivision;

//Count of Points for each Row
var aCount = uDivision + 2;
var bCount = uDivision + 1;

//RowA
var paramA = new Array(aCount);

paramA[0] = 0;
paramA[bCount] = 1;

var halfLength = uLength / 2.00;

for (i = 0; i < uDivision; i++) {
    paramA[i + 1] = uLength * i + halfLength;
}

//RowB

var paramB = new Array(bCount);

for (i = 0; i <= uDivision; i++)
    paramB[i] = uLength * i;

//-------------------------------------------
//Count Even Odd
//-------------------------------------------

var countVEven = 0;
var countVOdd = 0;

for (i = 0; i < vDivision + 1; i++) {
    if ((i % 2) == 0)
        countVEven++;
    else
        countVOdd++;
}

//-------------------------------------------
//rowA
//-------------------------------------------

//THREE.Vector3
var rowA = new Array(aCount * countVEven);

var count = 0;

//Anzahl der Reihen
for (v = 0; v < vDivision + 1; v += 2) {
    for (u = 0; u < aCount; u++) {
        rowA[count] = nurbsCrvs[v].getPointAt(paramA[u]);
        count++;
    }
}

//-------------------------------------------
//rowB
//-------------------------------------------

var rowB = new Array(bCount * countVOdd);

count = 0;

//Anzahl der Reihen
for (v = 1; v < vDivision + 1; v += 2) {
    for (u = 0; u < bCount; u++) {
        rowB[count] = nurbsCrvs[v].getPointAt(paramB[u]);
        count++;
    }
}



rowA.forEach(cp => {
    var pt = new THREE.Mesh(spHgeometry, red);
    scene.add(pt);

    pt.position.copy(cp);
});

rowB.forEach(cp => {
    var pt = new THREE.Mesh(spHgeometry, red);
    scene.add(pt);

    pt.position.copy(cp);
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