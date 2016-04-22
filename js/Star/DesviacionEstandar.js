function desviacionEstandar(Matrix,dimensiones,puntos){
		var renglon=0;
		var columna=0;
		console.log("ESTOS SON LOS PUNTOS: "+puntos);
		var respuesta=new Array();
		for(i=0;i<parseInt(dimensiones);i++){
			var Aritmetico=0;
			for(j=0;j<parseInt(puntos);j++){
				Aritmetico=parseFloat(Aritmetico)+parseFloat(Matrix[j][i]);
			}
			Aritmetico=parseFloat(Aritmetico)/parseFloat(puntos);
			var SumaPotencias=0;
			for(j=0;j<parseInt(puntos);j++){
				SumaPotencias=parseFloat(SumaPotencias)+parseFloat(Math.pow(Aritmetico-parseFloat(Matrix[j][i]),2));
			}
			respuesta.push(Math.sqrt(SumaPotencias/parseFloat(puntos)).toFixed(4));
		}
		return respuesta;
	}
	