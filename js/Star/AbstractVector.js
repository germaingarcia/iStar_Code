function AbstractVector(){
	this.valores==new Array();
	this.norma=0;
	this.actualizarNorma=true;
	this.size=0;
	this.id=0;
	this.klass=0;
	
	/*los procedimientos*/
	this.normalize=function(){}
	this.dot=function(vector){};
	this.toArray=function(){};
	this.getValue=function(index){};
	this.setValue=function(index,value){};
	this.create=function(vector,id,klass){};
	this.updateNorm=function(){};
	
	this.norm=function(){
		if(Boolean(this.actualizarNorma)){
			this.updateNorm();
		}
		return this.norma;
	}
	
	this.shouldUpdateNorm=function(){
		this.actualizarNorma=true;
	}
	
	this.getSize=function(){
		return this.size;
	}
	this.setSize=function(size){
		this.size=size;
	}
	this.getId=function(){
		return this.id;
	}
	
	this.setId=function(id){
		this.id=id;
	}
	
	this.getKlass=function(){
		return this.klass;
	}
	
	this.setKlass=function(klass){
		this.klass=klass;
	}
	
	this.getValores=function(){
		return this.valores;
	}
}