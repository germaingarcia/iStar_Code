//la clase abstracta de matriz
function AbstractMatrix(){
	this.dimensions;
	this.attributes=[];
	this.labels=[];
	this.rows=[];
	this.min=-1000000;
	this.max=1000000;
	this.Mayor=0;
	this.Menor=0;
	
	this.addRow=function(vector){
		//if(parseInt(dimensions)!=vector.getSize()){
			//alert('ERROR: vector of wrong size');
		//}else{
			this.rows.push(vector);
			this.dimensions=vector.getSize();
		//}
	}
	this.addRowWLabel=function(vector,label){
		this.labels.push(label);
		this.rows.push(vector);
		this.dimensions=vector.getSize();
	}
	
	this.getMatrix=function(){
		var Matr=[];
		for(i=0;i<this.getRowCount();i++)
		{
			var vector=this.getRow(i).toArray();
			Matr[i]=vector;
		}
		return Matr;
	}
	
	this.GetMatrixFromIndexs=function(Arreglo){
		var Matr=[];
		for(i=0;i<this.getRowCount();i++)
		{
			var vector=this.getRow(i).toArrayFromIndexs(Arreglo);
			Matr[i]=vector;
		}
		return Matr;
	}
	
	this.getMatrixWithKlasses=function(){
		var Matr=[];
		for(i=0;i<this.getRowCount();i++)
		{
			var vector=this.getRow(i).toArray();
			var myvec=[];
			for(j=0;j<vector.length;j++){
				myvec[j]=vector[j];
			}
			myvec[vector.length]=parseFloat(this.getRow(i).getKlass());
			Matr[i]=myvec;
		}
		return Matr;
	}
	
	/*******************/
	this.getRowCount=function(){
		return this.rows.length;
	}
	
	this.getDimensions=function(){
		return this.dimensions;
	}
	
	this.getRows=function(){
		return this.rows;
	}
	
	this.getRow=function(index){
		return this.rows[index];
	}
	
	
	
	
	this.getLabel=function(index){
		return labels[index];
	}
	this.setLabels=function(labels){
		this.labels=labels;
	}
	
	this.Scale=function(xScale){
		for(i=0;i<parseInt(size);i++){
			this.rows[i].Scale(xScale);
		}
	}
	
	//revizar esto de normalizar
	this.normalize=function(){
		var size=this.rows.length;
		for(i=0;i<parseInt(size);i++){
			//if(!this.rows[i])
			this.rows[i].normalize();
		}
	}
	
	/******************+*/
	this.getAttributes=function(){
		return this.attributes;
	}
	
	this.setAttributes=function(attributes){
		this.attributes=attributes;
	}
	
	this.getIds=function(){
		var ids=new Array();
		var size=this.rows.length;
		for(i=0;i<parseInt(size);i++){
			ids.push(this.rows[i].getId());
		}
		return ids;
	}
	this.getClassData=function(){
		var cdata=new Array();
		var size=this.rows.length;
		for(i=0;i<parseInt(size);i++){
			cdata.push(this.rows[i].getKlass());
		}
		return cdata;
	}
	this.getLabels=function(){
		return this.labels;
	}
	
	this.loadFile=function(file) {
		var request;
		if (window.XMLHttpRequest) {
			// IE7+, Firefox, Chrome, Opera, Safari
			request = new XMLHttpRequest();
		} else {
			// code for IE6, IE5
			request = new ActiveXObject('Microsoft.XMLHTTP');
		}
		// load
		request.open('GET', file, false);
		request.send();
		//alert(request.responseText);
		var rows = request.responseText.split("\n");
		return rows;//request.responseText;
	   // parseCSV(request.responseText);
   }
   
   //ARREGLAR ESTO PARA QUE CUMPLA CON TODAS LAS CONDICIONES DE FORMATO
   this.loadData=function(file){
	   var arreglo=this.loadFile(file);
	   var nrobjs=arreglo[1];
	   var nrdims=arreglo[2];
	   var dimensioness=arreglo[3].split(";");
	   for(i=0;i<parseInt(nrdims);i++){
		   this.attributes.push(dimensioness[i].trim());
	   }
	   //VERIFICAMOS SI LOS ATRIBUTOS TIENEN LA MSIMA CANTIDAD QUE LAS DIMENSIONES
	   
	   //leemos los vectores
	   for(i=4;i<arreglo.length;i++){
		   var tokenizer=arreglo[i].split(";");
		   //leemos el ids
		   var id=tokenizer[0];
		   //la clase
		   var klass=0;
		   var vector=new Array();
		  for(j=0;j<parseInt(nrdims);j++){
			   vector.push(tokenizer[j+1]);
		   }
		   klass=tokenizer[parseInt(nrdims)+1];
		   var dense=new DenseVector();
		   dense.create(vector,id,klass);
		   this.addRow(dense);
		 // this.rows[i-4]=dense;
	   }
   }
   
   this.ConvertDataFromArray=function(arreglo){
		var nrobjs=arreglo[1];
	   var nrdims=arreglo[2];
	   var dimensioness=arreglo[3].split(";");
	   
	   //definimos los puntos de control
	   var best=new Array(nrdims);
	   var worst=new Array(nrdims);
	   var average=new Array(nrdims);
	   for(i=0;i<parseInt(nrdims);i++){
		   this.attributes.push(dimensioness[i].trim());
		   best[i]=this.min;	  worst[i]=this.max;
	   }

	   
	   //leemos los vectores
	   for(i=4;i<arreglo.length;i++){
		   var tokenizer=arreglo[i].split(";");
		   //leemos el ids
		   var id=tokenizer[0];
		   //la clase
		   var klass=0;
		   var vector=new Array();
		
		  for(j=0;j<parseInt(nrdims);j++){
			   vector.push(parseFloat(tokenizer[j+1]).toFixed(4));
			 
			   if(parseFloat(tokenizer[j+1])>parseFloat(best[j])){best[j]=tokenizer[j+1];}
			   if(parseFloat(tokenizer[j+1])<parseFloat(worst[j])){worst[j]=tokenizer[j+1];}
			   average[j]=(parseFloat(best[j])+parseFloat(worst[j]))/2.0;
		   }
		
		   klass=tokenizer[parseInt(nrdims)+1];
		   var dense=new DenseVector();
		   dense.create(vector,id,klass);
		   this.addRow(dense);
		 // this.rows[i-4]=dense;
	   }
	    Best_Array_General=best
		Worst_Array_General=worst;
	
	   this.Mayor=d3.max(best);
	   this.Menor=d3.min(worst);
	   return {"BEST":best,"WORST":worst,"AVERAGE":average};
   }
   
   this.getBEST_WORST_AVERAGE=function(){
	   
	   var nrdims=this.attributes.length;
	   //alert(nrdims);
	   var best=new Array(nrdims);
	   var worst=new Array(nrdims);
	   var average=new Array(nrdims);
	   
	   for(i=0;i<parseInt(nrdims);i++){
		  // this.attributes.push(this.dimensioness[i]);
		  best[i]=this.min;	  worst[i]=this.max;
	   }
	   var numPuntos=this.getRowCount();
	   for(i=0;i<numPuntos;i++){
		   var MyArray=this.getRow(i).toArray();
		    for(j=0;j<parseInt(nrdims);j++){
				
				 if(parseFloat(MyArray[j])>parseFloat(best[j])){best[j]=MyArray[j];}
			   if(parseFloat(MyArray[j])<parseFloat(worst[j])){worst[j]=MyArray[j];}
			   average[j]=(parseFloat(best[j])+parseFloat(worst[j]))/2.0;
			}
	   }
	   return {"BEST":best,"WORST":worst,"AVERAGE":average};
   }
  
   
   this.write=function(){
	   var text="";
	   var length=this.rows.length;
	   
	   for(j=0;j<parseInt(length);j++){
		   var a= this.getRow(j).write();
		   text+=a;
	  }
	   return text;
   }
   
   
}