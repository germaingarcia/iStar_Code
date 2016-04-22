function STARCOORDINATESFor_Point(valores,V){
	var Aux=numeric.dot(valores,V);
	return Aux;
}



function STARCOORDINATESProTERCERO(osDados,V){

	 osDados.forEach(function (d,i) {
			var valores=d.valores;
			var Aux=numeric.dot(valores,V);
			var paraXNum=0;
			var paraYNum=0;

			//console.log(Aux[0]+" 	"+Aux[1]);
			 d.xStar=Aux[0];
			 d.yStar=Aux[1];
		 });

}
function STARCOORDINATESProTERCEROPRO(osDados,V){

	 var PI=3.14159;
	var respuesta=new Array();
	 osDados.forEach(function (d,i) {
			var valores=d.valores;

			var Aux=numeric.dot(valores,V);
			var paraXNum=0;
			var paraYNum=0;

			//console.log(Aux[0]+" 	"+Aux[1]);
			respuesta.push({"id":d.id,"valores":d.valores,"klasses":d.klasses,"xStar":Aux[0],"yStar":Aux[1]});
			 /*d.xStar=Aux[0];
			 d.yStar=Aux[1];*/
		 });
	return respuesta;
}
function STARCOORDINATESTERCEROPROArrayArray(osDados,V){

	 var PI=3.14159;
	var respuesta=new Array();
	 osDados.forEach(function (d,i) {
			var valores=d.valores;

			var Aux=numeric.dot(valores,V);
			var paraXNum=0;
			var paraYNum=0;

			//console.log(Aux[0]+" 	"+Aux[1]);
			respuesta.push({"id":d.id,"valores":d.valores,"klasses":d.klasses,"xStar":Aux[0],"yStar":Aux[1]});
			 d.xStar=Aux[0];
			 d.yStar=Aux[1];
		 });
}

function STARCOORDINATESProTERCERO(osDados,controlPoints1){

	 var PI=3.14159;
	 var V=new Array();
	// console.log(vectorPromedio);
	 controlPoints1.forEach(function(d,i){V[i]=[parseFloat(d.x),parseFloat(d.y)]});

	 osDados.forEach(function (d,i) {
			var valores=d.valores;

			var Aux=numeric.dot(valores,V);
			var paraXNum=0;
			var paraYNum=0;

			//console.log(Aux[0]+" 	"+Aux[1]);
			 d.xStar=Aux[0];
			 d.yStar=Aux[1];
		 });

}

function STARCOORDINATESGroups(osDados,controlPoints1){

	 var PI=3.14159;
	 var V=new Array();
	 controlPoints1.forEach(function(d,i){V[i]=[parseFloat(d.x),parseFloat(d.y)]});
	 var menor=1;
	 var mayor=0;
	 osDados.forEach(function (d,i) {

			var valores=d.valores;
			//sacamos todos los valores para los puntos de controlPoints1
			var GroupValores=new Array();
			controlPoints1.forEach(function(g,i){
				var val=0;

				g.valores.forEach(function(va){
					val=parseFloat(val)+valores[parseInt(va.indice)];
					});
				val=parseFloat(val)/parseFloat(g.valores.length);
				GroupValores[i]=val;
				if(g.valores.length>mayor){mayor=g.valores.length;}
			});

			var Aux=numeric.dot(GroupValores,V);

			//console.log(Aux[0]+" 	"+Aux[1]);
			 d.xStar=Aux[0];
			 d.yStar=Aux[1];
		 });
		 return {"mayor":mayor,"menor":menor};
}
function getMatrixOsDados(osDados,nrdims){
	var min=-1000000;
	var max=1000000;
	var matrix=new Array();
	var AuxBest=new Array();
	var AuxWorst =new Array();
	for(i=0;i<parseInt(nrdims);i++){
		   AuxBest[i]=min;	  AuxWorst[i]=max;
	}

	osDados.forEach(function(d){
		matrix.push(d.valores);
		d.valores.forEach(function(a,i){
			if(AuxBest[i]<a){AuxBest[i]=a;}
			if(AuxWorst[i]>a){AuxWorst[i]=a;}
		});
	});
	return {"matrix":matrix,"AuxBest":AuxBest,"AuxWorst":AuxWorst};
}
function GetPureSimilarityMatrix(MyControlPoints,osDados){
	//var attributes=generalMatrix.getAttributes();

	//console.log("TENEMOS ESTOS ATRIBUTOS"+attributes.length);
	//var attributes=['a1','a2','a3','a4','a5','a6'];
	var Matrix=new Array();
	MyControlPoints.forEach(function(d,i){
		var arreglo=new Array();
		MyControlPoints.forEach(function(d2,i2){
			arreglo.push(0);
		});
		Matrix.push(arreglo);
	});
	//primero hallamos los mayores y los menores de cada dimension
	var Prepro=getMatrixOsDados(osDados,MyControlPoints.length);
	var matrixPura=Prepro.matrix;
	var mejores=Prepro.AuxBest;
	var peores=Prepro.AuxWorst;
	console.log("best"+mejores);
	var NumPuntos=osDados.length;
	var length=MyControlPoints.length;

	for(i=0;i<parseInt(length);i++){
		for(j=i+1;j<parseInt(length);j++){
			var sumatoria=0;
			//recorremos k
			for(k=0;k<parseInt(NumPuntos);k++){
				var uno,dos;
				if(mejores[i]==peores[i]){uno=0;}else{
				uno=parseFloat(matrixPura[k][i]-peores[i])/parseFloat(mejores[i]-peores[i]);}

				if(mejores[j]==peores[j]){dos=0;}else{
				 dos=parseFloat(matrixPura[k][j]-peores[j])/parseFloat(mejores[j]-peores[j]);
				}
				var re=Math.abs(uno-dos);
				sumatoria=parseFloat(sumatoria)+parseFloat(re);
			}
			//Matrix[j][i]=(1-parseFloat(1.0/parseFloat(NumPuntos))*sumatoria).toFixed(2); //paper
			var re=(parseFloat(1.0/parseFloat(NumPuntos))*sumatoria).toFixed(4); //sacar la matriz de disimilaridad
			Matrix[j][i]=parseFloat(re);
			Matrix[i][j]=parseFloat(re);
		}
	}
	return Matrix;
}
function getSimilarityMatrix(generalMatrix){
	var attributes=generalMatrix.getAttributes();

	//console.log("TENEMOS ESTOS ATRIBUTOS"+attributes.length);
	//var attributes=['a1','a2','a3','a4','a5','a6'];
	var Matrix=new Array();
	attributes.forEach(function(d,i){
		var arreglo=new Array();
		attributes.forEach(function(d2,i2){
			arreglo.push(-1);
		});
		Matrix.push(arreglo);
	});
	//primero hallamos los mayores y los menores de cada dimension
	var matrixPura=generalMatrix.getMatrix();
	//var matrixPura=[[1,0,1,0,1,0],[0,1,0,1,0,1]];
	var NumPuntos=generalMatrix.getRowCount();
	var length=generalMatrix.getDimensions();

	for(i=0;i<parseInt(length);i++){
		for(j=i+1;j<parseInt(length);j++){
			var sumatoria=0;
			//recorremos k
			for(k=0;k<parseInt(NumPuntos);k++){
				var uno,dos;
				if(Best_Array_General[i]==Worst_Array_General[i]){uno=0;}else{
				uno=parseFloat(matrixPura[k][i]-Worst_Array_General[i])/parseFloat(Best_Array_General[i]-Worst_Array_General[i]);}

				if(Best_Array_General[j]==Worst_Array_General[j]){dos=0;}else{
				 dos=parseFloat(matrixPura[k][j]-Worst_Array_General[j])/parseFloat(Best_Array_General[j]-Worst_Array_General[j]);
				}
				var re=Math.abs(uno-dos);
				sumatoria=parseFloat(sumatoria)+parseFloat(re);
			}
			//Matrix[j][i]=(1-parseFloat(1.0/parseFloat(NumPuntos))*sumatoria).toFixed(2); //paper
			Matrix[j][i]=(parseFloat(1.0/parseFloat(NumPuntos))*sumatoria).toFixed(4); //sacar la matriz de disimilaridad
		}
	}
	//console.log("Matrix de disimilaridad");
	//PrintMatrix(Matrix)
	//console.log("primero");
	//PrintMatrix(Matrix);
	var CopiaMatrix=new Array();
	Matrix.forEach(function(d){
		var arreglo=d;
		var Arreglo2=new Array();
		arreglo.forEach(function(d2){
			Arreglo2.push(d2);
		});
		CopiaMatrix.push(Arreglo2);
	});

	//hallamos el arreglo de similaridades (GET THE LARGEST SIMILARITY)
	var largest=-1;
	var EL,ER;

	for(i=0;i<parseInt(length);i++){
		for(j=i+1;j<parseInt(length);j++){
			if(Matrix[j][i]>largest){
				largest=Matrix[j][i];
				EL=i;
				ER=j;
			}
		}
	}
	var A=new Array();
	A.push(EL);
	A.push(ER);
	//A.push(EL);
	//A.push(ER);
	Matrix[ER][EL]=-1;
	/*primero*/


	RecursivaA(Matrix,length,A,EL,ER);
	var arregloVal=new Array();
	for(i=1;i<A.length;i++){
		arregloVal.push(Math.max(CopiaMatrix[A[i-1]][A[i]],CopiaMatrix[A[i]][A[i-1]]));
	}
	arregloVal.push(Math.max(CopiaMatrix[A[0]][A[A.length-1]],CopiaMatrix[A[A.length-1]][A[0]]));

	//console.log("Val"+arregloVal);

	//console.log("A: "+A);
	return {"A":A,"ArregloVal":arregloVal};
}

function RecursivaA(Matrix,length,A,EL,ER){
//	console.log("EL:"+EL+" ER: "+ER);
	//PrintMatrix(Matrix);
//	console.log("E:"+A);
	var k1,k2;
	var Mayk1=-1,Mayk2=-1;
	for(k=0;k<length;k++){
			var bo=A.indexOf(k)==-1?true:false;
			if(Matrix[k][EL]>Mayk1&&Boolean(bo))
			{
				Mayk1=Matrix[k][EL]; k1=k;
			}else if(Matrix[EL][k]>Mayk1&&Boolean(bo)){
				Mayk1=Matrix[EL][k]; k1=k;
			}

			if(Matrix[k][ER]>Mayk2&&Boolean(bo))
			{
				Mayk2=Matrix[k][ER]; k2=k;
			}else if(Matrix[ER][k]>Mayk2&&Boolean(bo)){
				Mayk2=Matrix[ER][k]; k2=k;
			}

	}
	if(Mayk1>Mayk2){
			var aux=EL;
			EL=k1;
			A.unshift(EL);//+"|"+A;
			//debemos poner en -1 algunos casilleros
			for(m=0;m<length;m++){
				Matrix[m][aux]=-1;
				Matrix[aux][m]=-1;
			}
		}else{
			var aux=ER;
			ER=k2;
			A.push(ER);
			for(m=0;m<length;m++){
				Matrix[m][aux]=-1;
				Matrix[aux][m]=-1;
			}
		}

	if(A.length<Matrix[0].length){
	//	console.log("ESTO ES A:"+A);
	//	console.log(A.length);
		RecursivaA(Matrix,length,A,EL,ER);
	}else{
		return;
	}
}

 function existe(A,j){
	for(i=0;i<A.length;i++){
	  if(parseInt(A[i])==j){
		return true;
	  }
	}
	return false;
   }


function PrintMatrix(Matrix)
{
	var texto="";
	Matrix.forEach(function(d,i){
		d.forEach(function(a){
			if(parseFloat(a)!=-1){
			texto+=a+";";
			}
		});
		texto+="**";
	});
	document.write(texto);
}

function auxiliar()
{
	var ma=[[1,0,0.5,0],[1,0,0.5,0],[0,1,0,0.5],[0,1,0,0.5]];
	getSimilarityMatrix(ma);
}