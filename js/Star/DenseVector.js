//clase para los vectores densos
function DenseVector(){
	this.DELTA=0.00001;
	AbstractVector.apply(this,[]); //herencia
	
	//sacar la norma de un vector
	this.dot=function(vector){
		if(this.valores.length!=this.size){
			alert('ERROR: vectors of different sizes');
			return 0;
		}else{
			var dot=0;
			for(i=0;i<parseInt(this.valores.length);i++){
				dot=parseFloat(dot)+parseFloat(this.valores[i])*parseFloat(vector.getValores()[i]);
				
			}
			return dot;
		}
	}
	
	//funcion que escala segun un rango
	this.Scale=function(xScale){
		for(i=0;i<this.valores.length;i++){
				this.valores[i]=parseFloat(xScale(this.valores[i]));
		}
	}
	
	//normalizacion
	this.normalize=function(){
		if(parseFloat(this.norm())>this.DELTA){
			
			for(i=0;i<this.valores.length;i++){
				this.valores[i]=parseFloat(this.valores[i])/parseFloat(this.norm());
			}
			this.norma=1.0;
		}else{
			this.norma=0.0;
		}
	}
	
	this.getValue=function(index){
		return this.valores[index];
	}
	
	this.setValue=function(index,value){
		this.actualizarNorma=true;
		this.valores[index]=value;
	}
	
	this.create=function(vector,id,klass){
		this.valores=vector;
		this.size=vector.length;
		this.id=id;
		this.klass=klass;
		this.actualizarNorma=true;
	}
	
	this.toArray=function(){
		return this.valores;
	}
	
	this.toArrayFromIndexs=function(ArrelogIndices){
		var ArregloRespuesta=new Array();
		var valoresAux=this.valores;
		ArrelogIndices.forEach(function(d){ArregloRespuesta.push(valoresAux[parseInt(d)])});
		return ArregloRespuesta;
	} 
	
	this.updateNorm=function(){
		this.norma=0;
		for(i=0;i<this.valores.length;i++){
			this.norma=parseFloat(this.norma)+parseFloat(this.valores[i])*parseFloat(this.valores[i]);
		}
		this.norma=Math.sqrt(parseFloat(this.norma));
		this.actualizarNorma=false;
	}

	this.write=function(){
		var text=this.id+";";
		var lenth=parseInt(this.valores.length);
		for(i=0;i<lenth;i++){
			text=text+this.valores[i]+";";
		}
		text+=this.klass+"\n"
		return text;
	}
}
DenseVector.prototype=AbstractVector;