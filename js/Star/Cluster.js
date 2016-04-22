require('should');
var DBSCAN = require('JS/clustering/lib/index.js').DBSCAN;
var KMEANS = require('JS/clustering/lib/index.js').KMEANS;

function BDScanFunction(datoss,epsilon,minPoints)
{
    var dbscan = new DBSCAN();
	//var result=dbscan.run(A,0.007, 2);
	
	var respuesta=(dbscan.run(datoss,parseFloat(epsilon),parseInt(minPoints)));
	console.log(respuesta);
	var res=new Array();
	respuesta.forEach(function(d,i){
		d.forEach(function(v){res[parseInt(v)]=i;});
	});
	return {"centroids":respuesta.length,"assignments":res};
}

function KMEANSFunction(dataset,k){
	 var kmeans = new KMEANS();
	 var clusters = kmeans.run(dataset, k);
      clusters.should.have.lengthOf(k);
      clusters.forEach(function(cluster) {
        (cluster instanceof Array).should.be.true;
        cluster.length.should.be.greaterThan(0);
      });
	  console.log("kmeans AQUI");
}