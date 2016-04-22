function loadFile(file) {
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
		var rows = request.responseText;
		return JSON.parse(rows);//request.responseText;
	   // parseCSV(request.responseText);
   }

function SalvarEstados(){
  var filename =MyFileName;// $("#input-fileName").val()
  //var s="ESTE ES UNA PRUEBA \n"+HISTORIALESTADOS;
  var mYoBJECT={"FileName":MyFileName,"rows":GENERALMATRIX.rows.length,"attributes":GENERALMATRIX.attributes.length,"HISTORIALESTADOS":HISTORIALESTADOS}
   var s=MyFileName+"\n";
   // s+=GENERALMATRIX.rows.length+"\n";
  // s+=GENERALMATRIX.attributes.length+"\n";
  // s+=JSON.stringify(HISTORIALESTADOS);
   //console.log(HISTORIALESTADOS);
   //console.log(JSON.stringify(HISTORIALESTADOS));
   var s=JSON.stringify(mYoBJECT);
   var blob = new Blob([s], {type: "text/plain;charset=utf-8"});
   saveAs(blob, filename+".istar");
 }

 function ActualizarEstadosCargados(MyObjexct){
   var a=loadFile("fin.malos.istar");

    // HISTORIALESTADOS=HISTORIALESTADOS.concat([MyObjexct.HISTORIALESTADOS[0],MyObjexct.HISTORIALESTADOS[1],MyObjexct.HISTORIALESTADOS[2],MyObjexct.HISTORIALESTADOS[3]]);
        MyObjexct.HISTORIALESTADOS.forEach(function(d,i){
            a.HISTORIALESTADOS.push(d);
        });
        a.HISTORIALESTADOS.forEach(function(d,i){
            d.id=i;
        });

     a.HISTORIALESTADOS.sort(function (a, b) {
         return (parseInt(a.dunn) - parseInt(b.dunn));
     })


    console.log(a);

     HISTORIALESTADOS=HISTORIALESTADOS.concat(a.HISTORIALESTADOS);
     estados(GENERALMATRIX,'wiggle');
     ProyectarEstado(a.HISTORIALESTADOS.length-1);
     //actualizamos los eliminados, grupos y lista de atributos
     //restartNewPoints;

 }