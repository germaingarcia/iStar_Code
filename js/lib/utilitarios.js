function DistanceArrayToArray(Array1,Array2){
	var sum=0;
	Array1.forEach(function(d,i){
		var df=parseFloat(d);
		var df2=parseFloat(Array2[i]);
		sum=parseFloat(sum)+parseFloat((df-df2)*(df-df2));
	});
	return Math.sqrt(sum);
}

function MakeDistanceMatrixGeneralMatrixOriginal(){

    DistanceMatrixGeneralMatrixOriginal=new Array();
	for(i=0;i<GENERALMATRIX.rows.length;i++){
		var arrays=new Array();
		for(j=0;j<GENERALMATRIX.rows.length;j++){
			arrays.push(100000.000);
		}
		DistanceMatrixGeneralMatrixOriginal[i]=arrays;
	}

	for(i=0;i<GENERALMATRIX.rows.length;i++){
		for(j=i+1;j<GENERALMATRIX.rows.length;j++){
			var dista=DistanceArrayToArray(GENERALMATRIX.rows[i].valores,GENERALMATRIX.rows[j].valores);
			DistanceMatrixGeneralMatrixOriginal[i][j]=dista;
			DistanceMatrixGeneralMatrixOriginal[j][i]=dista;
		}
	}

}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function HallarMaximoIndiceGrupos(){

    var arreglo=new Array();
    MYCONTROLPOINTS.forEach(function(d){

        if(d.id.toString().indexOf("Group")>-1){
            arreglo.push(parseInt(d.id.substring(6, d.id.length)));
        }
    });
    if(arreglo.length>0){
    return parseInt(getMaxOfArray(arreglo))+1;
    }
    else{return 1;}
}