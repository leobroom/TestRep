/**
 * @author leobroom
 **/

NURBSHelper = {  

    getKnot: function(cpIndex, cpCount, nurbsDegree) 
    {
        var knot = ( cpIndex + 1 ) / ( cpCount - nurbsDegree );   
        
        return  THREE.Math.clamp( knot, 0, 1 );
    },

    getNurbsKnots: function(nurbsControlPoints, nurbsDegree) 
    {
        var cpCount = nurbsControlPoints.length;
        var nurbsKnots = [];

        for ( var i = 0; i <= nurbsDegree; i ++ ) 
        {
            nurbsKnots.push( 0 );
        }
        
        for ( var i = 0, j = cpCount; i < j; i ++ ) 
        {       
            nurbsKnots.push( NURBSHelper.getKnot(i,j, nurbsDegree) );
        }

        return nurbsKnots;
    }
}