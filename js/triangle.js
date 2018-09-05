/**
 * @author leobroom
 **/

Triangle = {


    constructTriangle: function (a, b, c, all, u, idx) {
        // *3 wegen des BufferArrays

        var aBuf = Triangle.deconstructVec(a);
        var bBuf = Triangle.deconstructVec(b);
        var cBuf = Triangle.deconstructVec(c);

        for (i = 0; i < 3; i++) {
            all[(idx + i) + u * 2] = aBuf[i];
        }

        for (i = 0; i < 3; i++) {
            all[(idx + i+3) + u * 2] = bBuf[i];
        }

        for (i = 0; i < 3; i++) {
            all[(idx + i+6) + u * 2] = cBuf[i];
        }
        // console.log("a:" +aBuf)
        // console.log("b:" +bBuf)
        // console.log("c:" +cBuf)

        return all;
    },

    
    constructTriangle: function (a, b, c, all, u, idx) {
        // *3 wegen des BufferArrays

        var aBuf = Triangle.deconstructVec(a);
        var bBuf = Triangle.deconstructVec(b);
        var cBuf = Triangle.deconstructVec(c);

        for (i = 0; i < 3; i++) {
            all[(idx + i) + u * 2] = aBuf[i];
        }

        for (i = 0; i < 3; i++) {
            all[(idx + i+3) + u * 2] = bBuf[i];
        }

        for (i = 0; i < 3; i++) {
            all[(idx + i+6) + u * 2] = cBuf[i];
        }
        // console.log("a:" +aBuf)
        // console.log("b:" +bBuf)
        // console.log("c:" +cBuf)

        return all;
    },


    deconstructVec: function (vec) {
        // *3 wegen des BufferArrays

        var bufVec = new Float32Array(3);

        bufVec[0] = vec.x;
        bufVec[1] = vec.y;
        bufVec[2] = vec.z;

        return bufVec;
    },


    constructIdx: function (v, triangleEachRow, modificator) {
        return modificator + (triangleEachRow * v * 2);
    }


    //     createRows: function(cp1 , cp2, rows) 
    //     {
    //        var count = cp1.length;
    //        var lists =  new Array(rows+1);      

    //        for (u = 0; u < rows+1; u++) 
    //        { 
    //            var cps =  new Array(count);

    //            for ( i = 0; i < count; i++)
    //            {
    //                var vA = cp1[i];
    //                var vB = cp2[i];

    //                var vC = new THREE.Vector3();

    //                vC = vC.subVectors(vB, vA ) ;
    //                vC.multiplyScalar (u/ rows);        
    //                vC.add(vA);

    //                cps[i] = vC; 
    //            }

    //            lists[u] = new THREE.NURBSCurve( nurbsDegree, nurbsKnots, cps );
    //        }


    //        return lists;
    //    },

}