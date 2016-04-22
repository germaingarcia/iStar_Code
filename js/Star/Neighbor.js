function DistanceMatrixMainProjectionFunction(osDados){
	DistanceMatrixMainProjection=new Array();
	for(i=0;i<osDados.length;i++){
		var arrays=new Array();
		for(j=0;j<osDados.length;j++){
			arrays.push(100000.000);
		}
		DistanceMatrixMainProjection[i]=arrays;
	}

	for(i=0;i<osDados.length;i++){
		for(j=i+1;j<osDados.length;j++){
			var a1=[osDados[i].xStar,osDados[i].yStar];
			var a2=[osDados[j].xStar,osDados[j].yStar];
			var distance=DistanceArrayToArray(a1,a2);
			DistanceMatrixMainProjection[i][j]=distance;
			DistanceMatrixMainProjection[j][i]=distance;
		}
	}
}
function DistanceMatrixSecondDetailFunction(osDados){
	DistanceMatrixSecondDetail=new Array();
	for(i=0;i<osDados.length;i++){
		var arrays=new Array();
		for(j=0;j<osDados.length;j++){
			arrays.push(100000.000);
		}
		DistanceMatrixSecondDetail[i]=arrays;
	}

	for(i=0;i<osDados.length;i++){
		for(j=i+1;j<osDados.length;j++){
			var a1=[osDados[i].xStarSecondDetail,osDados[i].yStarSecondDetail];
			var a2=[osDados[j].xStarSecondDetail,osDados[j].yStarSecondDetail];
			var distance=DistanceArrayToArray(a1,a2);
			DistanceMatrixSecondDetail[i][j]=distance;
			DistanceMatrixSecondDetail[j][i]=distance;
		}
	}
}
//Arreglo de distancias y el numero de vecinos que se precisa sacar
function NvecinosProximos(numVecinos,Arreglo){
	var respuesta=new Array(parseInt(numVecinos));
	var objetos=new Array();
	Arreglo.forEach(function(d,i){
		objetos.push({"i":i,"distance":d});
	});
	objetos.sort(function (a, b) {
	  if (a.distance > b.distance) {
		return 1;
	  }
	  if (a.distance < b.distance) {
		return -1;
	  }
	  return 0;
	});

	var citrus = objetos.slice(0, parseInt(numVecinos));
	citrus.forEach(function(d,i){respuesta[i]=parseInt(d.i);});
	return respuesta;
}
/*
function PorcentajeVecinosPoints(numVecinos){
	var prom=0;
	for(i=0;i<GeneralMatrix.rows.length;i++){
		var arregloEspacioOriginal=NvecinosProximos(numVecinos,DistanceMatrixGeneralMatrixOriginal[i]);
		var arregloEspacio2D=NvecinosProximos(numVecinos,DistanceMatrixMainProjection[i]);
		var conteo=0;
		arregloEspacioOriginal.forEach(function(d){
			if(arregloEspacio2D.indexOf(parseInt(d))>=0){
				conteo++;
		    }
		});

		prom=parseFloat(prom)+parseFloat(parseFloat(conteo)/parseFloat(numVecinos));
	}
	return parseFloat(prom/GeneralMatrix.rows.length);
}*/
function PreservacionTopologica(numerosOrdenados){
	var PromRespuesta=new Array(numerosOrdenados.length);
	for(i=0;i<numerosOrdenados.length;i++){PromRespuesta[i]=0;}
	var conteo=0;
		var n=numerosOrdenados[0];
	var k=numerosOrdenados[1];
	for(i=0;i<GENERALMATRIX.rows.length;i++){


		var arregloEspacioOriginal=NvecinosProximos(parseInt(numerosOrdenados[numerosOrdenados.length-1]),DistanceMatrixGeneralMatrixOriginal[i]);
		var arregloEspacio2D=NvecinosProximos(parseInt(numerosOrdenados[numerosOrdenados.length-1]),DistanceMatrixMainProjection[i]);
		//consideramos que como entrada tenemos un arreglo con 2 elementos

		var arreglorealOriginal=arregloEspacioOriginal.slice(0,parseInt(n));
		var arreglo2D=arregloEspacio2D.slice(0,parseInt(n));
		var RestoK=arregloEspacio2D.slice(parseInt(n),parseInt(k));
		arreglorealOriginal.forEach(function(A,j){
				var indiceEcontrado=arreglo2D.indexOf(parseInt(A));
				if(indiceEcontrado>=0){
					if(indiceEcontrado==parseInt(j)){
						conteo=parseInt(conteo)+3;
					}else{
						conteo=parseInt(conteo)+2;
					}
				}else
				{
					if(RestoK.indexOf(parseInt(A))){
						conteo=parseInt(conteo)+1;
					}
				}
			});
	}

	return parseFloat(conteo/parseFloat(3*n*GENERALMATRIX.rows.length));

}
function PorcentajeVecinosPoints(numerosOrdenados){

	var PromRespuesta=new Array(numerosOrdenados.length);
	for(i=0;i<numerosOrdenados.length;i++){PromRespuesta[i]=0;}
	var prom=0;
	for(i=0;i<GENERALMATRIX.rows.length;i++){

		var arregloEspacioOriginal=NvecinosProximos(parseInt(numerosOrdenados[numerosOrdenados.length-1]),DistanceMatrixGeneralMatrixOriginal[i]);
		var arregloEspacio2D=NvecinosProximos(parseInt(numerosOrdenados[numerosOrdenados.length-1]),DistanceMatrixMainProjection[i]);
		numerosOrdenados.forEach(function(d,k){
			var arreglorealOriginal=arregloEspacioOriginal.slice(0,parseInt(d));
			var arreglo2D=arregloEspacio2D.slice(0,parseInt(d));
			var conteo=0;
			arreglorealOriginal.forEach(function(A){
				if(arreglo2D.indexOf(parseInt(A))>=0){
					conteo++;
				}
			});
			conteo=parseFloat(conteo/parseFloat(d));
			PromRespuesta[k]=parseFloat(PromRespuesta[k])+parseFloat(conteo/GENERALMATRIX.rows.length);
		});
	}
	return PromRespuesta;
}
function PorcentajeVecinosPointsSECONDDETAIL(numerosOrdenados){

	var PromRespuesta=new Array(numerosOrdenados.length);
	for(i=0;i<numerosOrdenados.length;i++){PromRespuesta[i]=0;}
	var prom=0;
	for(i=0;i<GENERALMATRIX.rows.length;i++){
		var arregloEspacioOriginal=NvecinosProximos(parseInt(numerosOrdenados[numerosOrdenados.length-1]),DistanceMatrixGeneralMatrixOriginal[i]);
		var arregloEspacio2D=NvecinosProximos(parseInt(numerosOrdenados[numerosOrdenados.length-1]),DistanceMatrixSecondDetail[i]);
		numerosOrdenados.forEach(function(d,k){
			var arreglorealOriginal=arregloEspacioOriginal.slice(0,parseInt(d));
			var arreglo2D=arregloEspacio2D.slice(0,parseInt(d));
			var conteo=0;
			arreglorealOriginal.forEach(function(A){
				if(arreglo2D.indexOf(parseInt(A))>=0){
					conteo++;
				}
			});
			conteo=parseFloat(conteo/parseFloat(d));
			PromRespuesta[k]=parseFloat(PromRespuesta[k])+parseFloat(conteo/GENERALMATRIX.rows.length);
		});
	}
	return PromRespuesta;
}
/*function CalculoVecindad(NumPuntos,NumGrupo){
	var intt=parseInt(NumPuntos/NumGrupo);
	var Myres=new Array(NumGrupo);

		//console.log(PorcentajeVecinosPoints(parseInt(i+1)));
		console.log("asd");

	for(i=1;i<=NumGrupo;i++){
		//Myres[i-1]=PorcentajeVecinosPoints(parseInt(i));
		console.log(PorcentajeVecinosPoints(parseInt(i+1)));
	}
	console.log(Myres);
	return Myres;
}*/

