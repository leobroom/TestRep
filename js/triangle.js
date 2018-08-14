/**
 * @author leobroom
 **/

Triangle = {  

    createRows: function(cp1 , cp2, rows) 
    {
       var count = cp1.length;
       var lists =  new Array(rows+1);      
     
       for (u = 0; u < rows+1; u++) 
       { 
           var ptCs =  new Array(count);

           for ( i = 0; i < count; i++)
           {
               var vA = cp1[i];
               var vB = cp2[i];
       
               var vC = new THREE.Vector3();
 
               vC = vC.subVectors(vB, vA ) ;
               vC.multiplyScalar (u/ rows);        
               vC.add(vA);
       
               ptCs[i] = vC; 
           }
           lists[u] = ptCs;
       }
       return lists;
   }

}