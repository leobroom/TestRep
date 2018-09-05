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
// var spotLight = new THREE.SpotLight(0xffffff, 1);
// spotLight.position.set(0,10, 10);
// scene.add(spotLight);
var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );

light1.position.set( 10, 10, 10 );
scene.add( light1 );
                
// var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );

// light2.position.set( 0, -10, 0 );
// scene.add( light2 );


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

var objectBLA = new THREE.Mesh(geom, material2);

scene.add(objectBLA);

// ------------------------------------------------
// SPHERE
// ------------------------------------------------

var spHgeometry = new THREE.SphereGeometry(0.02, 4, 4);
var yellow = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var red = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// var yellowPt = new THREE.Mesh( spHgeometry, yellow );
// var redPt = new THREE.Mesh( spHgeometry, red );
// scene.add( yellowPt );
// scene.add( redPt );

// yellowPt.position.copy(v0);
// redPt.position.copy(v2);

// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
var vertices = new Float32Array( [
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0
] );




// itemSize = 3 because there are 3 values (components) per vertex
var blaaa = new THREE.BufferGeometry();
blaaa.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
blaaa.addAttribute( 'normal', new THREE.BufferAttribute( vertices, 3 ) );
//blaaa.addAttribute( 'color', new THREE.BufferAttribute( vertices, 3 ) );
//var material = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
// var material = new THREE.MeshPhongMaterial( {
//     color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
//     side: THREE.DoubleSide, vertexColors: THREE.VertexColors
// } );
// var meshSquare = new THREE.Mesh( blaaa, material2 );



//    scene.add( meshSquare );

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
    new THREE.Vector4(-4, 2.5, 0, 1),
    new THREE.Vector4(-2.5, 2.8, 0, 1),
    new THREE.Vector4(2.5, 2, 0, 1),
    new THREE.Vector4(3, 2.5, 0, 1),
];

var nurbsControlPointsDown = [
    new THREE.Vector4(-3.4, -2.5, 0, 4),
    new THREE.Vector4(-3, -2.3, 0, 1),
    new THREE.Vector4(2, -2, 0, 2),
    new THREE.Vector4(3.6, -2.1, 0, 1),
];

var pointValue = 50;
var uDivision = 2;
var vDivision = 3;
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



//-------------------------------------------
//TriangleCount
//-------------------------------------------

var triangleEachRow = 2 * uDivision + 1;
var triangleCount = triangleEachRow * (vDivision-1);

console.log("triangleEachRow: " + triangleEachRow);
console.log("triangleCount: " + triangleCount);

console.log("ALL Size: " + triangleCount*3);

// 9 ,da 3 float * 3 Vec
var all = new Float32Array(triangleCount*3);

all.forEach(numb => {
numb =0.0;
});

// End

//-------------------------------------------
//Triangle Up A
//-------------------------------------------

//Anzahl der Reihen
for (v = 0; v < countVOdd; v++) {
    var rowAIndex = v * aCount;
    var rowBIndex = v * bCount;

    var idx = Triangle.constructIdx(v, triangleEachRow, 1);

    console.log("idx: " + idx);

    for (u = 0; u < uDivision; u++) {
        var aIndex = rowAIndex + u;
        var bIndex = rowBIndex + u;

      all =  Triangle.constructTriangle(
            rowB[bIndex],
            rowA[aIndex + 1],
            rowB[bIndex + 1],
             all, u, idx);
    }
}

console.log("ALL-----------------------------------------------------");
all.forEach(numb => {
console.log(numb);
});

 var geometryTri = new THREE.BufferGeometry();

 geometryTri.addAttribute( 'position', new THREE.BufferAttribute( all, 3 ) );
 geometryTri.addAttribute( 'normal', new THREE.BufferAttribute( all, 3 ) );

 var meshTri = new THREE.Mesh( geometryTri, material2 );

  scene.add(meshTri);

// //-------------------------------------------
// //Triangle Down A
// //-------------------------------------------

// //Anzahl der Reihen
// for (int v = 0; v < countVOdd; v++)
// {
//   int rowAIndex = v * aCount;
//   int rowBIndex = v * bCount;

//   int idx = ConstructIdx(v, triangleEachRow, 0);

//   for (int u = 0; u < bCount; u++)
//   {
//     int aIndex = rowAIndex + u;
//     int bIndex = rowBIndex + u;

//     ConstructTriangle(
//       rowA[aIndex],
//       rowA[aIndex + 1],
//       rowB[bIndex],
//       ref all, u, idx);
//   }
// }

// //-------------------------------------------
// //Triangle Down B
// //-------------------------------------------

// //Anzahl der Reihen
// for (int v = 0; v < countVEven - 1; v++)
// {
//   int rowAIndex = (v + 1) * aCount;
//   int rowBIndex = v * bCount;

//   int idx = ConstructIdx(v, triangleEachRow, triangleEachRow + 1);

//   for (int u = 0; u < uDivision; u++)
//   {
//     int aIndex = rowAIndex + u;
//     int bIndex = rowBIndex + u;

//     ConstructTriangle(
//       rowB[bIndex],
//       rowA[aIndex + 1],
//       rowB[bIndex + 1],
//       ref all, u, idx);
//   }
// }

// //-------------------------------------------
// //Triangle Up B
// //-------------------------------------------

// //Anzahl der Reihen
// for (int v = 0; v < countVEven - 1; v++)
// {
//   int rowAIndex = (v + 1) * aCount;
//   int rowBIndex = v * bCount;

//   int idx = ConstructIdx(v, triangleEachRow, triangleEachRow);

//   for (int u = 0; u < bCount; u++)
//   {
//     int aIndex = rowAIndex + u;
//     int bIndex = rowBIndex + u;

//     ConstructTriangle(
//       rowA[aIndex],
//       rowA[aIndex + 1],
//       rowB[bIndex],
//       ref all, u, idx);
//   }
// }


renderer.render(scene, camera);

// Render Loop
var render = function () {
    requestAnimationFrame(render);

    // geometryBla.rotation.y += 0.005;
  //  meshSquare.rotation.x += 0.005;

    // Render the scene
    renderer.render(scene, camera);
};

render();