function PCA(X){
    var m = X.length;
    var sigma = numeric.div(numeric.dot(numeric.transpose(X), X), m);
	//var u=numeric.svd(sigma).U;
    //console.log(u);
	var uwvt = thinsvd(sigma);
	var U = uwvt[0];
	var equ=new Array();
	var texto="";
	for(i=0;i<X[0].length;i++){
		
		equ.push([parseFloat(U[i][0]),parseFloat(U[i][1])]);
		if(parseFloat(equ[i][0])<=0){equ[i][0]=parseFloat(-1*Math.abs(equ[i][0]));}
		if(parseFloat(equ[i][1])<=0){equ[i][1]=parseFloat(-1*Math.abs(equ[i][1]));}
		texto+=equ[i][0]+"\t"+equ[i][1]+"\n";
	}
	return equ;
}