  var progress = document.querySelector('.percent');
  function abortRead() {
    reader.abort();
  }

  function errorHandler(evt) {
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    };
  }


  function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
      var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
      // Increase the progress bar length.
      if (percentLoaded < 100) {
        progress.style.width = percentLoaded + '%';
        progress.textContent = percentLoaded + '%';
      }
    }
  }

  function handleFileSelect(evt) {
    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
	 reader.onabort = function(e) {
      alert('File read cancelled');
    };
    reader.onloadstart = function(e) {
      document.getElementById('progress_bar').className = 'loading';
    };
    reader.onload = function(e) {
      // Ensure that the progress bar displays 100% at the end.
      progress.style.width = '100%';
      progress.textContent = '100% Updated File';
     // setTimeout("document.getElementById('progress_bar').className='';", 2000);
	  var filename=document.getElementById('uploadFile');

	  filename.value=evt.target.files[0].name;

	   MyFileName=filename.value;

  	  osDados=new Array();
	  rows = reader.result.split("\n");
	  //cargamos los datos
	  GENERALMATRIX.ConvertDataFromArray(rows);
//      console.log(GENERALMATRIX);
      var ArrayColor=GetControlPointsColor(GENERALMATRIX.attributes.length);
      console.log(ArrayColor);
	  GENERALMATRIX.attributes.forEach(function(d,i){

		   //var color=ControlPointColor(i, GENERALMATRIX.attributes.length);
		   var color=ArrayColor[i];
           var vi=[{"indice":i,"text":d,"color":color}]
		   var c=[{"indice":i,"text":d,"color":color}];
		  vi.valores=c;
		  LISTOFDIMENSIONS.push({"indice":i,"text":d,"valores":vi,"color":color});
	  });
	  /*calculamos la matriz de distancias en el espacio original*/
	  //-----------------------------------------------------------------------------------------

	  //  MakeDistanceMatrixGeneralMatrixOriginal();

      llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");

	 // console.log(rows);
	  //document.write(reader.name);
    }

    // Read in the image file as a binary string.
     reader.readAsBinaryString(evt.target.files[0]);

  }



    function handleFileSelectEstates(evt) {


      reader = new FileReader();
      reader.onerror = errorHandler;
      reader.onprogress = updateProgress;
  	 reader.onabort = function(e) {
        alert('File read cancelled');
      };
      reader.onloadstart = function(e) {
        document.getElementById('progress_bar').className = 'loading';
      };
      reader.onload = function(e) {

    // osDados=new Array();
  	  var MyrowsObject =JSON.parse(reader.result);
  	  if(parseInt(GENERALMATRIX.attributes.length)==parseInt(MyrowsObject.attributes) && parseInt(GENERALMATRIX.rows.length)==parseInt(MyrowsObject.rows))
  	  {
  	     ActualizarEstadosCargados(MyrowsObject);
  	  }else{
  	    alert("Incorrect data");
  	  }
  	  //console.log(MyrowsObject);
  	  //cargamos los datos
  	/*  GENERALMATRIX.ConvertDataFromArray(rows);
  //      console.log(GENERALMATRIX);

  	  GENERALMATRIX.attributes.forEach(function(d,i){
  		   var color=ControlPointColor(i, GENERALMATRIX.attributes.length);
             var vi=[{"indice":i,"text":d,"color":color}]
  		   var c=[{"indice":i,"text":d,"color":color}];
  		  vi.valores=c;
  		  LISTOFDIMENSIONS.push({"indice":i,"text":d,"valores":vi,"color":color});
  	  });
  	  //-----------------------------------------------------------------------------------------

  	  //  MakeDistanceMatrixGeneralMatrixOriginal();

        llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");*/

  	 // console.log(rows);
  	  //document.write(reader.name);
      }

      // Read in the image file as a binary string.
       reader.readAsBinaryString(evt.target.files[0]);

    }


  document.getElementById('files').addEventListener('change', handleFileSelect, false);
  document.getElementById('EstatesFiles').addEventListener('change', handleFileSelectEstates, false);
 // document.getElementById('files').addEventListener('change', esperar, false);

function clearTable(id){
  $("#"+id+" tr").remove();
}

function clearALLTable(tableID){
	var Parent = document.getElementById(tableID);
    while(Parent.hasChildNodes())
    {
       Parent.removeChild(Parent.firstChild);
    }
}
function chargeTable(titles,matrix,id){
     var table = document.getElementById(id);
    	// clearTable(id);
        $("#"+id+" tr").remove();
          $("#"+id+" td").remove();
            $("#"+id+" *").remove();
        clearALLTable(id);

    //    console.log("este es el numero: "+matrix.length);
        matrix.forEach(function(d,i){
             var row = table.insertRow(i);
             d.forEach(function(a,j){
                 var cell1 = row.insertCell(j);
                 cell1.innerHTML = "<th>"+a+"</th>";
             });

        });
       var header = table.createTHead();
       var row = header.insertRow(0);

       titles.forEach(function(d,i){
             var cell1 = row.insertCell(i);
             cell1.innerHTML = "<td>"+titles[i]+"</td>";
       });




       /*
        var cell1 = row.insertCell(0);
        cell1.innerHTML = "<th>"+titles[0]+"</th>";

        var cell2 = row.insertCell(1);
        cell2.innerHTML = "<th>"+titles[1]+"</th>";

        var cell3 = row.insertCell(1);
                cell3.innerHTML = "<th>"+titles[2]+"</th>";*/
    // });

}


function llenar_CheckBox(listaAtributos,id,title,name)
{
	 var table = document.getElementById(id);
	// clearTable(id);
    $("#"+id+" tr").remove();

	 listaAtributos.forEach(function(d,i){
		 var row = table.insertRow(i);
		 var cell1 = row.insertCell(0);

		 cell1.innerHTML = "<input type='checkbox' style='padding:0px;' class='Att-checkbox' id='"+d.indice+"' name='"+name+"' value='"+d.text+"' > "+d.text+"<br>";
	 });
	/*for(var op in listaAtributos){
		var row = table.insertRow(i);
		var cell1 = row.insertCell(0);

		cell1.innerHTML = "<input type='checkbox' class='Att-checkbox' id='"+op+"' name='checkbox' value='"+op+"' > "+listaAtributos[op]+"<br>";
		i++;
	}
	*/
	/*par poner estilo*/
	var rows = table.getElementsByTagName("tr");

    var header = table.createTHead();
	var row = header.insertRow(0);

	var cell1 = row.insertCell(0);

	cell1.innerHTML = "<b class='tituloTable'> "+title+"</b>";
}


