/*------------------------------Siluette Derived Metric------------------------*/
function DistanceToArray(Array1,Array2){
	var sum=0;
	Array1.forEach(function(d,i){
		var df=parseFloat(d);
		var df2=parseFloat(Array2[i]);
		sum=parseFloat(sum)+parseFloat((df-df2)*(df-df2));
	});
	return (sum);
}
function GetKlasses(osDados){//sacamos las clases y los indices
	var Respuesta=new Array();
	centroX=0;
	controY=0;
	osDados.forEach(function(d,i){
		var busqueda=false; var index;
		Respuesta.forEach(function(r,i){
			if(parseInt(r.indice)==parseInt(d.klasses))	{
				busqueda=true;
				index=i;  return;
			}
		});
		if(Boolean(busqueda)){
			Respuesta[index].ccx=parseFloat(parseFloat(Respuesta[index].ccx+d.xStar)/2.0);
			Respuesta[index].ccy=parseFloat(parseFloat(Respuesta[index].ccy+d.yStar)/2.0);
			Respuesta[index].indexs.push(i);
		}else{
			Respuesta.push({"indice":parseInt(d.klasses),"ccx":d.xStar,"ccy":d.yStar,"indexs":[i]});
		}
	});
	return Respuesta;
}
function SiluetteDerivedMatric(klasses,osDadosAux){
	//sacamos las clases y los centros de esas clases {"idclass",centrox,centroY}
	
	var Scala=d3.scale.linear().domain([-1,1]).range([ 0,1]);
	respuesta=0;
	osDadosAux.forEach(function(d){
		var sumPointM=0; 
		var Ai;
		klasses.forEach(function(k){
			if(parseInt(k.indice)==parseInt(d.klasses)){
				Ai=DistanceToArray([k.ccx,k.ccy],[d.xStar,d.yStar]);
				return;
			}
		});

		klasses.forEach(function(k){
			if(parseInt(k.indice)!=parseInt(d.klasses)){
				var Bi=DistanceToArray([k.ccx,k.ccy],[d.xStar,d.yStar]);
				sumPointM=parseFloat(sumPointM)+Scala(parseFloat((Bi-Ai)/Math.max(Bi,Ai)));
				
			}
		});

		respuesta+=parseFloat(sumPointM/(klasses.length-1))
	});
	//console.log(respuesta/osDados.length);
	return parseFloat(respuesta);
	//recorremos el osDados para calcular la metrica
}

function Optimizacion(controlPoints1,osDados){

	var klasses=GetKlasses(osDados);
	var V=new Array(controlPoints1.length);
    controlPoints1.forEach(function(d,i){V[i]=[parseFloat(d.x),parseFloat(d.y)]});
	var osDadosAux=new Array();
	osDados.forEach(function(d){osDadosAux.push(d)});
	var varmio=new Array();
	controlPoints1.forEach(function(a,s){varmio.push(s);})
	var cmb = Combinatorics.permutation(varmio); // assumes 4

	var combinaciones=cmb.toArray();//[[0,1,2,3],[0,2,1,3]];
	
	var may=0;
	var ArregloMayor=new Array();
	combinaciones.forEach(function(Arrays){
		
		 var x=new Array();
		 Arrays.forEach(function(g){x.push(V[parseInt(g)])});
		var meus=STARCOORDINATESProTERCEROPRO(osDadosAux,x);
		 var res=SiluetteDerivedMatric(klasses,meus);	
		// console.log(res);
		 if(res>may){
			 may=res;
			 ArregloMayor=Arrays;
		 }
	});
	
	//console.log("***************************************"+may);
	var ant=new Array();
	ArregloMayor.forEach(function(d){ant.push(controlPoints1[parseInt(d)].text);});
	
	var Array2=new Array();
	controlPoints1.forEach(function(d){Array2.push(d.text);});
	console.log("ES="+Array2);
	console.log("deberia="+ant);
}

//suponiendo que ya tenemos los indices de las clases [1,2,3,4,5]
//klassesArray=[{"klasse":1,"indexs":[1,4,6,2...]}]
function IndiceDum(osDados,klassesArray)
{
	var MatrixClusterDistaces=new Array();
	klassesArray.forEach(function(x,i){
		MatrixClusterDistaces[i]=new Array(klassesArray.length);
		klassesArray.forEach(function(y,j){MatrixClusterDistaces[i][j]=10000;});
	});
//	console.log(DistanceMatrixMainProjection);
	//UTILIZAMOS LAS DISTANCIAS EN EL ESPACIO PROYECTADO
	for(i=0;i<klassesArray.length;i++){
		//hallamos el Diametro de cada
		var max=0;
		klassesArray[i].indexs.forEach(function(x){
			klassesArray[i].indexs.forEach(function(y){
			    if(parseInt(x)!=parseInt(y)){
                   if(DistanceMatrixMainProjection[parseInt(x)][parseInt(y)]>max){
                        max=DistanceMatrixMainProjection[parseInt(x)][parseInt(y)];
                    }
				}
			});
		});
		klassesArray[i].diam=max;

		for(j=i+1;j<klassesArray.length;j++){
			//hallamos la distancia entre los clusters, como el minimo valor entre las dos clases
			//var sum=0;
			var MINIMUN=100000;
				klassesArray[i].indexs.forEach(function(di){
					klassesArray[j].indexs.forEach(function(dj){
					    if(parseInt(di)!=parseInt(dj)){
						    if(DistanceMatrixMainProjection[parseInt(di)][parseInt(dj)]<MINIMUN)

						     MINIMUN=DistanceMatrixMainProjection[parseInt(di)][parseInt(dj)];
						     /*if(MINIMUN==0){
						        console.log("ESTOS SON LOS PUNTOS: "+di+"   -   "+dj );
						     }*/
						}
					});
				});
			//sum=parseFloat(sum/parseFloat(klassesArray[i].indexs.length+klassesArray[j].indexs.length));
			MatrixClusterDistaces[i][j]=MINIMUN;
		}
	}

	//hallamos el maximoDiametrp
	var maxDiam=0; klassesArray.forEach(function(d){if(parseFloat(d.diam)>maxDiam){maxDiam=d.diam;}}) 
	//una vez con la matriz de distancias
	var ratio=10000;
	for(i=0;i<klassesArray.length;i++){
		for(j=i+1;j<klassesArray.length;j++){
			var value=parseFloat(parseFloat(MatrixClusterDistaces[i][j])/parseFloat(maxDiam));
			if(value<ratio){ratio=value;}
		}
	}
	
	return ratio;
}