    /*-----------------------------------------------------------------------------------------*/
    var radioMainProjection=8;
    var velocidadAnimacion=100;
    var tolerancia=10;
    var FocusControlPointIndex=-1;
    var tamanioFirstDetail=200;
    var tamanioSecondDetail=300;
    var marginNP = {top: 5, right: 0, bottom: 55, left: 0};
    var NP_width=$("#NPreservation" ).width();
    var NP_height=$("#NPreservation" ).width()*0.6;
        NP_width= NP_width - marginNP.left - marginNP.right;
        NP_height= NP_height - marginNP.top - marginNP.bottom;

    var ColordeDato="#fff";
    var strokeData=0.4;
    var ColordeControl="#000";
    var strokeControl=0.3;
    var focusX;
    var focusY;
    /*---------------------------------------------------------------------------------------*/
    SIZEMAINPROJECTION=$("#maincontainer").width();
    var contro=0;//20;                                  //variable para regulat el tamaño de la ventana;


    SIZESECONDPROJECTION=$("#secondProj").width();
    /*-------------------------------------InitMainProjection--------------------------*/
    var div = d3.select("body").append("div")
        .attr("class", "otherGraph")
        .style("opacity", 0);

    var divSecondDetail = d3.select("body").append("div")
        .attr("class", "otherGraph")
        .style("opacity", 0);


    var panel=d3.select("#maincontainer")
             .append("svg")
             .attr("width",SIZEMAINPROJECTION)
             .attr("height",SIZEMAINPROJECTION+parseInt(contro))
             .append("g");
    var STAR=panel.append("svg:g").attr("id","STAR")
                        .attr("transform",function(){return "translate("+0+","+0+")";});

    /*
    STAR.append("rect")
            .attr("class","frame")
            .attr("x", tolerancia / 2)
            .attr("y", tolerancia/ 2)
            .attr("width", SIZEMAINPROJECTION - tolerancia)
            .attr("height", SIZEMAINPROJECTION- tolerancia);*/


    var SecondDetail=d3.select("#secondProj")
             .append("svg")
             .attr("width",SIZESECONDPROJECTION)
             .attr("height",SIZESECONDPROJECTION)
             .append("g");
    /*
    SecondDetail.append("rect")
                .attr("class","frame")
                .attr("x",tolerancia / 2)
                .attr("y",tolerancia / 2)
                .attr("width", SIZESECONDPROJECTION-tolerancia )
                .attr("height", SIZESECONDPROJECTION-tolerancia );*/



    var FirstDetail=div.append("svg")
                            .attr("width",tamanioFirstDetail)
                            .attr("height",tamanioFirstDetail)
                            .append("g");


    var NPDIV=d3.select("#NPreservation")
             .append("svg")
             .attr("width",NP_width+marginNP.left + marginNP.right)
             .attr("height",NP_height+marginNP.top + marginNP.bottom)
             .append("g")
             .attr("transform", "translate(" + marginNP.left + "," + marginNP.top + ")");


    /*-------------------------------------InitMainProjection--------------------------*/
    function StarCoordinatesRender(){
            STAR.selectAll("*").remove();
            SecondDetail.selectAll("*").remove();
         //   NPDIV.selectAll("*").remove();

    /*
     SecondDetail.append("rect")
                                .attr("class","frame")
                                .attr("x",tolerancia / 2)
                                .attr("y",tolerancia / 2)
                                .attr("width", SIZESECONDPROJECTION-tolerancia )
                                .attr("height", SIZESECONDPROJECTION-tolerancia );

    STAR.append("rect")
            .attr("class","frame")
            .attr("x", tolerancia / 2)
            .attr("y", tolerancia/ 2)
            .attr("width", SIZEMAINPROJECTION - tolerancia)
            .attr("height", SIZEMAINPROJECTION- tolerancia);*/

            var menor=1; //menor, mayor calcular el numero minimo y el maximo de dimensiones en un grupo
             var mayor=0;

             var SCMenorX=MAS_INFINITO;
             var SCMayorX=MENOS_INFINITO;
             var SCMenorY=MAS_INFINITO;
             var SCMayorY=MENOS_INFINITO;

             var theMainScScalenumber=MENOS_INFINITO;
             osDados=new Array(); //conjunto de datos
                        /*tambien se hace el calculo de STARCOORDINATES*/
             var VArrayControlPoints=new Array();
             MYCONTROLPOINTS.forEach(function(d,i){VArrayControlPoints[i]=[parseFloat(d.x),parseFloat(d.y)]});

             /*GENERAMOS LA LISTA DE DATOS QUE ESTAMOS MANEJANDO A PARTIR DE LA MATRIZ GENERAL*/
             GENERALMATRIX.rows.forEach(function (d,i) {
                            var valores=d.valores;
                            //sacamos todos los valores para los puntos de controlPoints1
                            var GroupValores=new Array();
                            MYCONTROLPOINTS.forEach(function(g,i){
                                var val=0;
                                //var mensaje="";
                                 g.valores.forEach(function(va){
                                //	mensaje+=valores[parseInt(va.indice)]+"	 .	";
                                    val=parseFloat(val)+parseFloat(valores[parseInt(va.indice)]);
                                    });

                                val=parseFloat(val)/parseFloat(g.valores.length);
                                //mensaje+=val;
                                //console.log(mensaje);
                                GroupValores[i]=val;
                                if(g.valores.length>mayor){mayor=g.valores.length;}
                            });
                            var Aux=STARCOORDINATESFor_Point(GroupValores,VArrayControlPoints);

                            if(SCMenorX>Aux[0]){SCMenorX=Aux[0];}else{if(SCMayorX<Aux[0]){SCMayorX=Aux[0];}}
                             if(SCMenorY>Aux[1]){SCMenorY=Aux[1];}else{ if(SCMayorY<Aux[1]){SCMayorY=Aux[1];}}



                            if(Math.abs(Aux[0])>theMainScScalenumber){theMainScScalenumber=Math.abs(Aux[0]);}
                            if(Math.abs(Aux[1])>theMainScScalenumber){theMainScScalenumber=Math.abs(Aux[1]);}

                            osDados.push({"id":d.id,"klasses":d.klass,"valores":GroupValores,"xStar":Aux[0],"yStar":Aux[1]});
             });
            //------------------------------------INSERTAR LO QUE ESTA COMENTADO ------------------------------
            DistanceMatrixMainProjectionFunction(osDados);
            klasesIndices=GetKlasses(osDados);

            /*-calculamos los menores y mayores en los puntos de control-*/
            MYCONTROLPOINTS.forEach(function(d){
                        if(d.x>SCMayorX){SCMayorX=d.x;}else{if(d.x<SCMenorX){SCMenorX=d.x;}}
                        if(d.y>SCMayorY){SCMayorY=d.y;}else{if(d.y<SCMenorY){SCMenorY=d.y;}}

                        if(theMainScScalenumber<Math.abs(d.x)){theMainScScalenumber=Math.abs(d.x);}
                        if(theMainScScalenumber<Math.abs(d.y)){theMainScScalenumber=Math.abs(d.y);}
            });
            //DECLARAMOS LA ESCALA
           //var xStarCoordinates=d3.scale.linear().domain([-1*theMainScScalenumber,theMainScScalenumber]).range([ tolerancia/2,SIZEMAINPROJECTION-tolerancia/2]);
           //var yStarCoordinates=d3.scale.linear().domain([-1*theMainScScalenumber,theMainScScalenumber]).range([ tolerancia/2,SIZEMAINPROJECTION-tolerancia/2]);
     /*  100 DIMENSIONES
        var xStarCoordinates=d3.scale.linear().domain([SCMenorX,SCMayorX]).range([ tolerancia/2,SIZEMAINPROJECTION-tolerancia/2]);
              var yStarCoordinates=d3.scale.linear().domain([SCMenorX,SCMayorX]).range([ tolerancia/2,SIZEMAINPROJECTION-tolerancia/2]);
         */
       /*  var xxscale=d3.scale.linear().domain([SCMenorX,SCMayorX]).range([-10,10]);
         var yyscale=d3.scale.linear().domain([SCMenorY,SCMayorY]).range([-10,10]);
         osDados.forEach(function(d){
            d.xStar=xxscale(d.xStar);
            d.yStar=yyscale(d.yStar);
         });

         MYCONTROLPOINTS.forEach(function(r){
                r.x=xxscale(r.x);
                r.y=yyscale(r.y);
         });*/

         // var xStarCoordinates=d3.scale.linear().domain([SCMenorX,SCMayorX]).range([ tolerancia/2,SIZEMAINPROJECTION-tolerancia/2]);
        //  var yStarCoordinates=d3.scale.linear().domain([SCMenorY,SCMayorY]).range([ tolerancia/2,SIZEMAINPROJECTION-tolerancia/2]);
            var xStarCoordinates=d3.scale.linear().domain([-1*theMainScScalenumber,theMainScScalenumber]).range([ tolerancia/2,SIZEMAINPROJECTION-tolerancia/2]);
            var yStarCoordinates=d3.scale.linear().domain([-1*theMainScScalenumber,theMainScScalenumber]).range([ tolerancia/2,SIZEMAINPROJECTION+parseInt(contro)-tolerancia/2]);
            var CpScale=d3.scale.linear().domain([menor,mayor]).range([11,18]);// ESCALA DEL NUMERO DE PUNTOS DE CONTROL



            var BrushStar = d3.svg.polybrush()
                                .x(xStarCoordinates)
                                .y(yStarCoordinates)
                                .on("brushstart",function(){
                                 //   estados(GENERALMATRIX,'wiggle');
                                    BrushStar.clear();
                                    clearALLTable("tableDetail");


                                                    STAR.selectAll("circle")
                                                    .attr("class","circle")
                                                    .attr("stroke",ColordeDato)
                                                        .attr("stroke-width",strokeData);


                                                    SecondDetail.selectAll("circle")
                                                    .attr("class","circle")
                                                    .attr("stroke",ColordeDato)
                                                     .attr("stroke-width",strokeData);



                                                            })
                                  .on("brush",function(){
                                       // NPDIV.selectAll("*").remove();
                                        // estados(GENERALMATRIX,'wiggle');
                                        STAR.selectAll("circle")
                                        .attr("class",function(d){
                                                    if ( BrushStar.isWithinExtent(xStarCoordinates(d.xStar), yStarCoordinates(d.yStar))) {
                                                            d.drag=1;
                                                            return "circle";
                                                    } else {
                                                     d.drag=0;
                                                           return "no_selected";

                                                    }
                                                    })
                                        .attr("stroke",ColordeDato)
                                        .attr("stroke-width",strokeData);

                                        SecondDetail.selectAll("circle")
                                        .attr("class",function(d){
                                                if ( BrushStar.isWithinExtent(xStarCoordinates(d.xStar), yStarCoordinates(d.yStar))) {
                                                            return "circle";
                                                    } else {
                                                           return "no_selected";
                                                    }
                                            }
                                        )
                                        .attr("stroke",ColordeDato)
                                                                                        .attr("stroke-width",strokeData);



                                    })
                                    .on("brushend",function(){
                                      // estados(GENERALMATRIX,'wiggle');
                                        clearALLTable("tableDetail");


                                    });

                    //Llamada de Brush
                    STAR.append("svg:g")
                    .attr("class", "brush")
                    .call(BrushStar);



                             STAR.selectAll(".star_points")
                            .data(osDados)
                            .enter().append("g").append("circle")

                                .attr("cx",function(d){return xStarCoordinates(d.xStar);})
                                .attr("cy",function(d){return yStarCoordinates(d.yStar);})
                                .attr("r",radioMainProjection)
                                .attr("stroke",ColordeDato)
                                 .attr("stroke-width",strokeData)
                                .attr("fill",function(d){return DataColor(parseInt(d.klasses),1000);})
                                .attr("class","circleData");

                // misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial

             STAR.selectAll("line")
                                                     .data(MYCONTROLPOINTS)
                                                     .enter()
                                                     .append("line")
                                                     .attr("id",function(d,i){  return "lcp"+i;})
                                                     .attr("x1",function(d){ return xStarCoordinates(0);})
                                                     .attr("y1",function(d){ return yStarCoordinates(0);})
                                                     .attr("x2",function(d){ return xStarCoordinates(d.x);})
                                                     .attr("y2",function(d){ return yStarCoordinates(d.y);})
                                                     .attr("stroke-width",2)
                                                      .attr("stroke",function(d,i){return d.color;});



                                         STAR.selectAll(".head_coordinates")
                                         .data(MYCONTROLPOINTS)
                                         .enter()
                                         .append("circle")
                                         .attr("stroke", ColordeControl)
                                         .attr("stroke-width",strokeControl)
                                         .attr("id",function(d,i){return "cp";})
                                         .attr("cx",function(d){ return xStarCoordinates(d.x);})
                                         .attr("cy",function(d){ return yStarCoordinates(d.y);})
                                         .attr("r",function(d){return CpScale(d.valores.length);})
                                         .attr("fill",function(d,i){return d.color; })
                                         .attr("class","circleControl")
                                         .on("mouseover",mouseover)
                                         .on("mouseout",mouseout)
                                         .on("mousedown",mousedown)
                                         .call(d3.behavior.drag()
                                        .on("dragstart",dragstart)
                                        .on("drag",drag)
                                        .on("dragend",dragend));

            /*-----------------------------------------------------------------------------------------*/


            function dragstart(){
                            d3.event.sourceEvent.stopPropagation();

            }
            function drag(d,i){

                            d3.select(this)
                            .attr("class","Selected")
                            .attr("cx",function(d){
                                            d.x=xStarCoordinates.invert(Math.max(6, Math.min(SIZEMAINPROJECTION - tolerancia , d3.event.x)));

                                            return xStarCoordinates(d.x);//Math.max(6, Math.min(size - tolerancia , d3.event.x));
                                        })
                            .attr("cy",function(d){
                                            d.y=yStarCoordinates.invert(Math.max(6, Math.min(SIZEMAINPROJECTION+parseInt(contro) - tolerancia , d3.event.y)));
                                            return yStarCoordinates(d.y);// Math.max(6, Math.min(size - tolerancia , d3.event.y));
                                        })
                            .attr("r",radioMainProjection);

                            STAR.selectAll("line")
                                .data(MYCONTROLPOINTS)
                                .transition()
                                .duration(1)
                                .each("start", function() {  // Start animation
                                 d3.select(this);  // 'this' means the current element
                               //.attr("fill", "red");  // Change color

                                    })
                                    .delay(function(d, i) {
                                        return 1;// i / controlPoints1.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
                                    })
                                    .attr("x1",function(d){ return xStarCoordinates(0);})
                                    .attr("y1",function(d){ return yStarCoordinates(0);})
                                    .attr("x2",function(d){ return xStarCoordinates(d.x);})
                                    .attr("y2",function(d){ return yStarCoordinates(d.y);})
                                    .attr("stroke-width",2)
                                    .attr("stroke",function(d,i){return d.color;})
                                    .each("end", function() {  // End animation
                                    d3.select(this)  // 'this' means the current element
                                        .transition()
                                        .duration(500);
                                        //.attr("fill",function(d){return myColors(parseInt(d.klasses));});
                                    });

                                    var V=new Array();
                                    MYCONTROLPOINTS.forEach(function(d){
                                        V.push([d.x,d.y]);
                                    });

                                    STAR.selectAll("circle")
                                          .data(osDados)
                                          .transition()
                                          .duration(1)
                                          .each("start", function() {  // Start animation
                                              d3.select(this)  // 'this' means the current element
                                             // .attr("fill", "red");  // Change color
                                               })
                                            .delay(function(d, i) {
                                                        return i / osDados.length * velocidadAnimacion;  // Dynamic delay (i.e. each item delays a little longer)
                                               })
                                            .attr("cx",function(d){
                                                    var Aux=STARCOORDINATESFor_Point(d.valores,V);
                                                        d.xStar=Aux[0];
                                                        d.yStar=Aux[1];
                                                    return xStarCoordinates(d.xStar);
                                                    })
                                            .attr("cy",function(d){return yStarCoordinates(d.yStar);})
                                            .each("end", function() {  // End animation
                                               d3.select(this)  // 'this' means the current element
                                                       .transition()
                                                      .duration(velocidadAnimacion)
                                                      .attr("fill",function(d){return DataColor(parseInt(d.klasses),1000);});
                                                });
                }


                function dragend(d,i){


                      d3.select(this)
                      .attr("class","circle")
                      .attr("r",function(d){return CpScale(d.valores.length);});
                      var vectorPromedio=[];
                      d3.select(window).on("click", function(evt) {

                                                           if(d3.event.button == 0) {

                                                             if(d3.event.shiftKey){

                                                                 FocusControlPointIndex=i;
                                                                 llenar_CheckBox(MYCONTROLPOINTS[i].valores,"myTableGroup","Group","checkboxGroup");
                                                                 //DeleteDimensions(d,i);
                                                             }
                                                             if (d3.event.ctrlKey) {
                                                                 var punto=MYCONTROLPOINTS[i];
                                                                 var xx=xStarCoordinates(d.x);
                                                                 var yy=yStarCoordinates(d.y);

                                                                 var valorMayor;
                                                                 //recorremos los puntos de control para ver si hay interseccion
                                                                 MYCONTROLPOINTS.forEach(function(c,j){
                                                                     if(j!=i){
                                                                         var xAux=xStarCoordinates(c.x);
                                                                         var yAux=yStarCoordinates(c.y);
                                                                         //hallamos la distacia=
                                                                         var distance=Math.sqrt((xx-xAux)*(xx-xAux)+(yy-yAux)*(yy-yAux));
                                                                         //console.log("distancia:"+distance+" el radio:"+CpScale(c.valores.length));
                                                                         if(distance<CpScale(c.valores.length)){
                                                                             valorMayor=j;
                                                                         }
                                                                     }
                                                                 });
                                                                 //JUNTAMOS LOS VALORES DE LOS DOS GRUPOS
                                                                 //Juntamos los puntos de control
                                                                 //console.log(MycontrolPoints1);
                                                                 if(parseInt(valorMayor)>=0){ //habra union
                                                                         //	d3.select("#cp"+i).remove();
                                                                         //	d3.select("#lcp"+i).remove();
                                                                     //juntamos el texto y los valores
                                                                     var aux=HallarMaximoIndiceGrupos();
                                                                     MYCONTROLPOINTS[parseInt(valorMayor)].id="Group_"+aux;
                                                                     MYCONTROLPOINTS[parseInt(valorMayor)].text="Group_"+aux;//MYCONTROLPOINTS[parseInt(valorMayor)].text+MYCONTROLPOINTS[i].text;
                                                                     MYCONTROLPOINTS[parseInt(valorMayor)].valores=MYCONTROLPOINTS[parseInt(valorMayor)].valores.concat(MYCONTROLPOINTS[i].valores);
                                                                     MYCONTROLPOINTS[parseInt(valorMayor)].color=ConcatColor(MYCONTROLPOINTS[parseInt(valorMayor)].color,MYCONTROLPOINTS[i].color);
                                                                     //Actualizamos los valores
                                                                     MYCONTROLPOINTS.splice(i,1);
                                                                     var VArrayControlPointss=new Array();
                                                                     var theMainScScalenumber=MENOS_INFINITO;
                                                                     MYCONTROLPOINTS.forEach(function(d,i){
                                                                         VArrayControlPointss[i]=[parseFloat(d.x),parseFloat(d.y)];

                                                                         if(Math.abs(d.x)>theMainScScalenumber){theMainScScalenumber=Math.abs(d.x);}
                                                                         if(Math.abs(d.y)>theMainScScalenumber){theMainScScalenumber=Math.abs(d.y);}

                                                                         });
                                                                     osDados.forEach(function(dado){
                                                                         dado.valores[parseInt(valorMayor)]=parseFloat((dado.valores[parseInt(valorMayor)]+dado.valores[i])/2.0);
                                                                         //finalmente eliminamos de los valores
                                                                         dado.valores.splice(i,1);
                                                                         var Aux=STARCOORDINATESFor_Point(dado.valores,VArrayControlPointss);
                                                                         dado.xStar=Aux[0];
                                                                         dado.yStar=Aux[1];
                                                                         if(Math.abs(Aux[0])>theMainScScalenumber){theMainScScalenumber=Math.abs(Aux[0]);}
                                                                          if(Math.abs(Aux[1])>theMainScScalenumber){theMainScScalenumber=Math.abs(Aux[1]);}

                                                                     });

                                                                 //	xStarCoordinates.domain([-1*theMainScScalenumber,theMainScScalenumber]);
                                                                  //                               yStarCoordinates.domain([-1*theMainScScalenumber,theMainScScalenumber]);
                                                                     refreshControlPoints(); //
                                                                     restartNewPoints(); //Actualizamos las listas de ListaDeAtributos y lista de Grupos de dimensiones
                                                                     resto(); //EVALUAR, NO ES NECESARIO REALIZAR DE NUEVO ESTA OPERACION--0000000000000000000000000000000000000000
                                                                 }
                                                             }
                                                           }
                                                           //else{
                                                             //       console.log(d);

                                                           //}
                                                         });

                                    //resto();
                                 var SCMenorX=MAS_INFINITO;
                                  var SCMayorX=MENOS_INFINITO;
                                   var SCMenorY=MAS_INFINITO;
                                  var SCMayorY=MENOS_INFINITO;

                                  var theMainScScalenumber=MENOS_INFINITO;

                                var VArrayControlPointss=new Array();
                                MYCONTROLPOINTS.forEach(function(d,i){
                                                    if(d.x>SCMayorX){SCMayorX=d.x;}if(d.y>SCMayorY){SCMayorY=d.y;}
                                                    if(d.x<SCMenorX){SCMenorX=d.x;}if(d.y<SCMenorY){SCMenorY=d.y;}

                                                    VArrayControlPointss[i]=[parseFloat(d.x),parseFloat(d.y)]

                                                    if(Math.abs(d.x)>theMainScScalenumber){theMainScScalenumber=Math.abs(d.x);}
                                                    if(Math.abs(d.y)>theMainScScalenumber){theMainScScalenumber=Math.abs(d.y);}
                                });
                                osDados.forEach(function(dado){
                                    var Aux=STARCOORDINATESFor_Point(dado.valores,VArrayControlPointss);
                                    dado.xStar=Aux[0];
                                    dado.yStar=Aux[1];
                                    if(SCMenorX>Aux[0]){SCMenorX=Aux[0];} if(SCMenorY>Aux[1]){SCMenorY=Aux[1];}
                                    if(SCMayorX<Aux[0]){SCMayorX=Aux[0];} if(SCMayorY<Aux[1]){SCMayorY=Aux[1];}

                                    if(Math.abs(Aux[0])>theMainScScalenumber){theMainScScalenumber=Math.abs(Aux[0]);}
                                     if(Math.abs(Aux[1])>theMainScScalenumber){theMainScScalenumber=Math.abs(Aux[1]);}
                                });
                                //console.log("raro");
                                if(Boolean(document.getElementById("LifePreview").checked)){
                                    BuildMetrics();
                                }
                            //	xStarCoordinates.domain([SCMenorX,SCMayorX]);
                            //	yStarCoordinates.domain([SCMenorY,SCMayorY]);

                            //	xStarCoordinates.domain([-1*theMainScScalenumber,theMainScScalenumber]);
                           //    yStarCoordinates.domain([-1*theMainScScalenumber,theMainScScalenumber]);
                            //   resto();
                              // refreshControlPoints();

                }

                 function DeleteDimensions(d,i){
                                        var punto=MYCONTROLPOINTS[i];
                                            var xx=xStarCoordinates(d.x);
                                            var yy=yStarCoordinates(d.y);

                                                    //	d3.select("#cp"+i).remove();
                                                    //	d3.select("#lcp"+i).remove();
                                                        //juntamos el texto y los valores

                                                //pasamos los puntos de control a la lista de los eliminados
                                                MYCONTROLPOINTS[i].valores.forEach(function(val){
                                                    ListOfRemovedDimensions.push(val);
                                                });

                                                llenar_CheckBox(ListOfRemovedDimensions,"myTableRemoved","Removed","checkboxRemoved");


                                                MYCONTROLPOINTS.splice(i,1);
                                                var VArrayControlPointss=new Array();
                                                MYCONTROLPOINTS.forEach(function(d,i){VArrayControlPointss[i]=[parseFloat(d.x),parseFloat(d.y)]});

                                                osDados.forEach(function(dado){
                                                    dado.valores.splice(i,1);
                                                    var Aux=STARCOORDINATESFor_Point(dado.valores,VArrayControlPointss);
                                                    dado.xStar=Aux[0];
                                                    dado.yStar=Aux[1];
                                                });
                                                refreshControlPoints(); //
                                                restartNewPoints(); //Actualizamos las listas de ListaDeAtributos y lista de Grupos de dimensiones
                                                resto(); //EVALUAR, NO ES NECESARIO REALIZAR DE NUEVO ESTA OPERACION--0000000000000000000000000000000000000000

                                delete d;
                                    }

                function restartNewPoints(){
                            LISTOFDIMENSIONS=new Array();
                            ListOfGroupsOfDimensions=new Array();

                            MYCONTROLPOINTS.forEach(function(d){
                                if(d.valores.length==1){
                                    var myindex=-1;

                                    ListOfGroupsOfDimensions.forEach(function(g,k){
                                        g.valores.forEach(function(g1){if(d.valores[0].indice==g1.indice)
                                                myindex=k;
                                            });
                                    });

                                    if(myindex==-1){
                                        d.valores[0];
                                          var vi=[{"indice":d.valores[0].indice,"text":d.text,"color":d.valores[0].color}];

                                          LISTOFDIMENSIONS.push({"indice":d.valores[0].indice,"text":d.text,"valores":vi,"color":d.valores[0].color});
                                    }
                                }else{
                                    if(d.valores.length>1){
                                    ListOfGroupsOfDimensions.push({"indice":d.text,"text":d.text,"valores":d.valores,"color":d.color});
                                    }
                                }
                            });

                            llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");
                            llenar_CheckBox(ListOfGroupsOfDimensions,"myTableLeft","ATTRIBUTES2","checkbox2");
                        }

                function refreshControlPoints(){
                             var menor=1;
                            var mayor=0;
                            MYCONTROLPOINTS.forEach(function(d){
                                if(d.valores.length>mayor){mayor=d.valores.length;}
                            });
                            CpScale.domain([menor,mayor]);

                            STAR.selectAll("#cp").remove();
                            STAR.selectAll("line").remove();

                            STAR.selectAll("line")
                                 .data(MYCONTROLPOINTS)
                                 .enter()
                                 .append("line")
                                 .attr("id",function(d,i){  return "lcp"+i;})
                                 .attr("x1",function(d){ return xStarCoordinates(0);})
                                 .attr("y1",function(d){ return yStarCoordinates(0);})
                                 .attr("x2",function(d){ return xStarCoordinates(d.x);})
                                 .attr("y2",function(d){ return yStarCoordinates(d.y);})
                                 .attr("stroke-width",2)
                                 .attr("stroke",function(d,i){return d.color;});

                            STAR.selectAll(".head_coordinates")
                             .data(MYCONTROLPOINTS)
                             .enter()
                             .append("circle")
                             .attr("id",function(d,i){return "cp";})
                             .attr("cx",function(d){ return xStarCoordinates(d.x);})
                             .attr("cy",function(d){ return yStarCoordinates(d.y);})
                             .attr("r",function(d){return CpScale(d.valores.length);})
                             .attr("fill",function(d,i){return d.color;})
                             .on("mouseover",mouseover)
                              .on("mousedown",mousedown)
                             .on("mouseout",mouseout)
                             .call(d3.behavior.drag()
                                .on("dragstart",dragstart)
                                .on("drag",drag)
                                .on("dragend",dragend));
                        }
                /**************************************************FIN DRAGS FUNCTION******************************/
               /*****************************************MOUSE EVENT*******************************************************/
               function mouseover(d){
                        if(d3.event.shiftKey){
                            if(d.valores.length>1){
                            //	FirstDetail.selectAll("*").remove();
                                FirstDetail.selectAll("#dcp").remove();
                                FirstDetail.selectAll("#dps").remove();
                                FirstDetail.selectAll("line").remove();
                                FirstDetail.selectAll("text").remove();

                                mycontrolPointsFirstDetails=new Array();
                                osDadosFirstDetail=new Array();

                                var grupos=new Array();

                                d.valores.forEach(function(mi,i){
                                    grupos.push({"indice":mi.indice,"text":mi.text,"valores":mi.valores,"color":SecondControPointColor(i,d.valores.length)});
                                });


                                var xStarCoordinatesFirstDetail=d3.scale.linear().domain([-1.5,1.5]).range([ 0,tamanioFirstDetail]);
                                var yStarCoordinatesFirstDetail=d3.scale.linear().domain([-1.5,1.5]).range([ 0,tamanioFirstDetail]);
                                mycontrolPointsFirstDetails=distribucion(1,grupos);
                                /*sacamos los puntos*/
                                var V=new Array();
                                // console.log(vectorPromedio);
                                mycontrolPointsFirstDetails.forEach(function(d,i){V[i]=[parseFloat(d.x),parseFloat(d.y)]});
                                var min=-1;
                                var max=1;
                                GENERALMATRIX.rows.forEach(function(d,i) {
                                        var valores=d.valores;
                                        var GroupValores=new Array();
                                        mycontrolPointsFirstDetails.forEach(function(g,j){
                                                var val=valores[parseInt(g.id)];
                                                GroupValores[j]=parseFloat(val);
                                        });
                                        var Aux=numeric.dot(GroupValores,V);
                                        if(Aux[0]>max){max=Aux[0];} if(Aux[0]<min){min=Aux[0];}
                                        if(Aux[1]<min){min=Aux[1];} if(Aux[1]>max){max=Aux[1];}
                                        osDadosFirstDetail.push({"id":d.id,"klasses":d.klass,"valores":GroupValores,"xStar":Aux[0],"yStar":Aux[1],"color":DataColor(parseInt(d.klass),1000)});
                                });
                                xStarCoordinatesFirstDetail.domain([parseFloat(min)-0.2,parseFloat(max)+0.2]);
                                yStarCoordinatesFirstDetail.domain([parseFloat(min)-0.2,parseFloat(max)+0.2]);

                            FirstDetail.selectAll(".star_points")
                            .data(osDadosFirstDetail)
                            .enter().append("g").append("circle")
                                    .attr("id",function(d,i){return "dps";})
                                .attr("class",function(d){ return "circle";})
                                .attr("cx",function(d){return xStarCoordinatesFirstDetail(d.xStar);})
                                .attr("cy",function(d){return yStarCoordinatesFirstDetail(d.yStar);})
                                .attr("r",4)
                                .attr("stroke",ColordeDato)
                                                    .attr("stroke-width",strokeData)
                                .attr("fill",function(d){return d.color;});


                                 FirstDetail.selectAll(".head_coordinates_Detail")
                                 .data(mycontrolPointsFirstDetails)
                                 .enter()
                                 .append("circle")
                                 .attr("id",function(d,i){return "dcp";})
                                 .attr("cx",function(d){ return xStarCoordinatesFirstDetail(d.x);})
                                 .attr("cy",function(d){ return yStarCoordinatesFirstDetail(d.y);})
                                 .attr("r",6)
                                 .attr("stroke",ColordeControl)
                                                     .attr("stroke-width",strokeControl)
                                 .attr("fill",function(d,i){return d.color;})

                                var text = FirstDetail.selectAll("text")
                                       .data(mycontrolPointsFirstDetails)
                                       .enter()
                                       .append("text")
                                        .attr("x", function(d,i) { return xStarCoordinatesFirstDetail(d.x); })
                                        .attr("y", function(d,i) { return yStarCoordinatesFirstDetail(d.y); })
                                        .text( function (d,i) { return GENERALMATRIX.attributes[parseInt(d.id)];
                                        })
                                        .attr("font-family", "sans-serif")
                                        .attr("font-size", "15px")
                                        .attr("stroke","white")
                                        .attr("stroke-width","0.3px")
                                        .attr("opacity", "0.9")
                                        .attr("fill", "black");


                            FirstDetail.selectAll("line")
                                 .data(mycontrolPointsFirstDetails)
                                 .enter()
                                 .append("line")
                                 .attr("id",function(d,i){  return "lcp"+i;})
                                 .attr("x1",function(d){ return xStarCoordinatesFirstDetail(0);})
                                 .attr("y1",function(d){ return yStarCoordinatesFirstDetail(0);})
                                 .attr("x2",function(d){ return xStarCoordinatesFirstDetail(d.x);})
                                 .attr("y2",function(d){ return yStarCoordinatesFirstDetail(d.y);})
                                 .attr("stroke-width",2)
                                 .attr("stroke",function(d,i){return d.color;});
                                //osDadosFirstDetail=new Array();


                                //mostramos el grafico generado
                                div.transition()
                                .duration(25)
                                .style("border","solid 1px "+ d.color)
                                .style("left", (d3.event.pageX)-(tamanioFirstDetail)/2+ "px")
                                .style("top",  (d3.event.pageY)-(tamanioFirstDetail)/2+ "px")
                                .style("opacity", .9);
                            }
                        }else{
                            if(d3.event.altKey){
                                renderSecondDetail(d);
                            }else{

                                divSecondDetail.transition()
                                                .duration(25)
                                                .style("border","solid 1px "+ d.color)
                                                .style("opacity", .9);
                                                 var mensaje=d.text;

                                                 divSecondDetail.html(mensaje)
                                                .style("left", (d3.event.pageX) + "px")
                                                .style("top", (d3.event.pageY) + "px");
                            }
                        }

                }
               function mouseout() {
                                div.transition()
                                    .duration(500)
                                    .style("opacity", 0);

                                    divSecondDetail.transition()
                                    .duration(500)
                                    .style("opacity", 0);
                }

               function mousedown(d,i){
                    if(d3.event.button == 0){ }else{
                        DeleteDimensions(d,i);
                        d3.event.stopPropagation();
                    }
               }

                function resto(){

                            //STARCOORDINATESProTERCERO(osDados,MycontrolPoints1);
                            STAR.selectAll("circle")
                            .data(osDados)
                            .transition()
                            .duration(1)
                            .each("start", function() {  // Start animation
                                d3.select(this)  // 'this' means the current element
                                //.attr("fill", "red");  // Change color
                                 })
                                .delay(function(d, i) {
                                          return i / osDados.length * velocidadAnimacion;  // Dynamic delay (i.e. each item delays a little longer)
                                 })
                                .attr("cx",function(d){return xStarCoordinates(d.xStar);})
                                .attr("cy",function(d){return yStarCoordinates(d.yStar);})
                                .each("end", function() {  // End animation
                                 d3.select(this)  // 'this' means the current element
                                         .transition()
                                        .duration(velocidadAnimacion)
                                        .attr("fill",function(d){return DataColor(parseInt(d.klasses),1000);});
                                  });
                                //refreshControlPoints();
                           /*STAR.selectAll("line")
                                                    .data(MYCONTROLPOINTS)
                                                    .transition()
                                                    .duration(1)
                                                    .each("start", function() {  // Start animation
                                                        d3.select(this)  // 'this' means the current element
                                                       .attr("fill", "red");  // Change color

                                                           })
                                                        .delay(function(d, i) {
                                                               return 1;// i / controlPoints1.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
                                                           })
                                                        .attr("x1",function(d){ return xStarCoordinates(0);})
                                                        .attr("y1",function(d){ return yStarCoordinates(0);})
                                                        .attr("x2",function(d){ return xStarCoordinates(d.x);})
                                                        .attr("y2",function(d){ return yStarCoordinates(d.y);})
                                                        .attr("stroke-width",2)
                                                        .attr("stroke",function(d,i){return d.color;})
                                                        .each("end", function() {  // End animation
                                                           d3.select(this)  // 'this' means the current element
                                                               .transition()
                                                               .duration(500);
                                                               //.attr("fill",function(d){return myColors(parseInt(d.klasses));});
                                                           });

                                STAR.selectAll(".head_coordinates")
                                                    .data(MYCONTROLPOINTS)
                                                    .transition()
                                                    .duration(1000)
                                                    .each("start", function() {  // Start animation
                                                        d3.select(this)  // 'this' means the current element
                                                        .attr("fill", "red");  // Change color
                                                         })
                                                        .delay(function(d, i) {
                                                                  return i / MYCONTROLPOINTS.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
                                                         })
                                                        .attr("cx",function(d){return xStarCoordinates(d.x);})
                                                        .attr("cy",function(d){return yStarCoordinates(d.y);})
                                                        .each("end", function() {  // End animation
                                                         d3.select(this)  // 'this' means the current element
                                                                 .transition()
                                                                .duration(500)
                                                                .attr("fill",function(d){return d.color});
                                                          });*/

                        }


               /*panel.append("text")
                        .attr("x", 10)
                                .attr("y", SIZEMAINPROJECTION)

                                .style("fill", "steelblue")
                                .on("click", function(){
                                    translateControlPoints();
                                   // 	panel.selectAll("#cp").remove();
                                   // panel.selectAll("line").remove();
                                   // panel.selectAll("text").remove();
                                    //panel.selectAll("rect").remove();
                                    //NPDIV.selectAll("rect").remove();
                                })
                                .text("ControlPointsView");*/


                function translateControlPoints(){
                    STAR.selectAll("#cp").remove();
                    STAR.selectAll("line").remove();

                    var CMenorX=MAS_INFINITO;
                    var CMayorX=MENOS_INFINITO;
                    var CMenorY=MAS_INFINITO;
                    var CMayorY=MENOS_INFINITO;

                    MYCONTROLPOINTS.forEach(function(d){
                            if(d.x>CMayorX){CMayorX=d.x;}else{if(d.x<CMenorX){CMenorX=d.x;}}
                            if(d.y>CMayorY){CMayorY=d.y;}else{if(d.y<CMenorY){CMenorY=d.y;}}
                    });


                    var xxxscale=d3.scale.linear().domain([Math.min(CMenorX,CMenorY),Math.max(CMayorX,CMayorY)]).range([-8.5,8.5]);
                    var yyyscale=d3.scale.linear().domain([Math.min(CMenorX,CMenorY),Math.max(CMayorX,CMayorY)]).range([-8.5,8.5]);


                     MYCONTROLPOINTS.forEach(function(r){
                            r.x=xxxscale(r.x);
                            r.y=yyyscale(r.y);
                     });

                      var miescala=d3.scale.linear().domain([-10,10]).range([ tolerancia/2,SIZEMAINPROJECTION-tolerancia/2]);

                     STAR.selectAll("line")
                      .data(MYCONTROLPOINTS)
                      .enter()
                      .append("line")
                      .attr("id",function(d,i){  return "lcp"+i;})
                      .attr("x1",function(d){ return miescala(xxxscale(0));})
                      .attr("y1",function(d){ return miescala(xxxscale(0));})
                      .attr("x2",function(d){ return miescala(d.x);})
                      .attr("y2",function(d){ return miescala(d.y);})
                      .attr("stroke-width",2)
                       .attr("stroke",function(d,i){return d.color;});



                       STAR.selectAll(".head_coordinates")
                        .data(MYCONTROLPOINTS)
                        .enter()
                        .append("circle")
                        .attr("id",function(d,i){return "cp";})
                        .attr("cx",function(d){ return miescala(d.x);})
                        .attr("cy",function(d){ return miescala(d.y);})
                        .attr("r",function(d){return CpScale(d.valores.length);})
                        .attr("stroke",ColordeControl)
                        .attr("stroke-width",strokeControl)
                        .attr("fill",function(d,i){return d.color;});

                           STAR.selectAll(".star_points")
                                                .data(osDados)
                                                .enter().append("g").append("circle")
                                                    .attr("class",function(d){ return "circle";})
                                                    .attr("cx",function(d){return xStarCoordinates(d.xStar);})
                                                    .attr("cy",function(d){return yStarCoordinates(d.yStar);})
                                                    .attr("r",radioMainProjection)
                                                    .attr("stroke",ColordeDato)
                                                                        .attr("stroke-width",strokeData)
                                                    .attr("fill",function(d){return DataColor(parseInt(d.klasses),1000);});
                }
    }


    function renderSecondDetail(d){
                //	FirstDetail.selectAll("*").remove();
                  /*  SecondDetail.append("rect")
                                .attr("class","frame")
                                .attr("x",tolerancia / 2)
                                .attr("y",tolerancia / 2)
                                .attr("width", SIZESECONDPROJECTION-tolerancia )
                                .attr("height", SIZESECONDPROJECTION-tolerancia );*/

                    if(d.valores.length>1){
                        DistanceMatrixSecondDetailFunction(osDados);
                        SecondDetail.selectAll("#dcp").remove();
                        SecondDetail.selectAll("#dps").remove();
                        SecondDetail.selectAll("line").remove();


                        mycontrolPointsSecondDetails=new Array();
                        //osDadosSecondDetail=new Array();

                        var gruposs=new Array();

                        d.valores.forEach(function(mi,i){
                            gruposs.push({"indice":mi.indice,"text":GENERALMATRIX.attributes[parseInt(mi.indice)],"valores":mi.valores,"color":SecondControPointColor(i,1000)});
                        });

                        var theSecondScScalenumber=MENOS_INFINITO;


                        mycontrolPointsSecondDetails=distribucion(1,gruposs);


                        /*sacamos los puntos*/
                        var V=new Array();
                        // console.log(vectorPromedio);
                        mycontrolPointsSecondDetails.forEach(function(d,i){
                                if(theSecondScScalenumber<Math.abs(d.x)){theSecondScScalenumber=Math.abs(d.x);}
                                if(theSecondScScalenumber<Math.abs(d.y)){theSecondScScalenumber=Math.abs(d.y);}
                            V[i]=[parseFloat(d.x),parseFloat(d.y)]}
                            );
                        var min=-1;
                        var max=1;
                        GENERALMATRIX.rows.forEach(function(d,i) {
                                var valores=d.valores;
                                var GroupValores=new Array();
                                mycontrolPointsSecondDetails.forEach(function(g,j){
                                        var val=valores[parseInt(g.id)];
                                        GroupValores[j]=parseFloat(val);
                                });
                                var Aux=numeric.dot(GroupValores,V);
                                if(Aux[0]>max){max=Aux[0];}if(Aux[0]<min){min=Aux[0];}
                                if(Aux[1]<min){min=Aux[1];} if(Aux[1]>max){max=Aux[1];}
                                //osDadosSecondDetail.push({"id":"cp"+d.id,"klasses":d.klass,"valores":GroupValores,"xStar":Aux[0],"yStar":Aux[1]});
                                osDados[i].valoresSecondDetail=GroupValores;
                                osDados[i].xStarSecondDetail=Aux[0];
                                osDados[i].yStarSecondDetail=Aux[1];
                                if(Math.abs(Aux[0])>theSecondScScalenumber){theSecondScScalenumber=Math.abs(Aux[0]);}
                                if(Math.abs(Aux[1])>theSecondScScalenumber){theSecondScScalenumber=Math.abs(Aux[1]);}
                        });
                        //xStarCoordinatesSecondDetail.domain([parseFloat(min),parseFloat(max)]);
                        //yStarCoordinatesSecondDetail.domain([parseFloat(min),parseFloat(max)]);
                        var xStarCoordinatesSecondDetail=d3.scale.linear().domain([-1*theSecondScScalenumber,theSecondScScalenumber]).range([ 0,SIZESECONDPROJECTION]);
                        var yStarCoordinatesSecondDetail=d3.scale.linear().domain([-1*theSecondScScalenumber,theSecondScScalenumber]).range([ 0,SIZESECONDPROJECTION]);
                        //var xStarCoordinatesSecondDetail=d3.scale.linear().domain([-1*theSecondScScalenumber,theSecondScScalenumber]).range([ 0,SIZESECONDPROJECTION]);
                           //var yStarCoordinatesSecondDetail=d3.scale.linear().domain([-1*theSecondScScalenumber,theSecondScScalenumber]).range([ 0,SIZESECONDPROJECTION]);
                    /*agregamos el brush***********************************************************************/

                        var BrushStarSecond = d3.svg.polybrush()
                            .x(xStarCoordinatesSecondDetail)
                            .y(yStarCoordinatesSecondDetail)
                            .on("brushstart",function(){
                                BrushStarSecond.clear();
                                            STAR.selectAll("circle")
                                            .attr("class","circle");

                                            SecondDetail.selectAll("circle")
                                                .attr("class","circle");

                                                        })
                                .on("brush",function(){
                               // NPDIV.selectAll("*").remove();
                                                                        // estados(GENERALMATRIX,'wiggle');
                                    STAR.selectAll("circle")
                                    .attr("class",function(d){
                                                if ( BrushStarSecond.isWithinExtent(xStarCoordinatesSecondDetail(d.xStarSecondDetail), yStarCoordinatesSecondDetail(d.yStarSecondDetail))) {
                                                        d.drag=1;
                                                        return "circle";
                                                } else {
                                                        d.drag=0;
                                                       return "no_selected";
                                                }
                                                });
                                    SecondDetail.selectAll("circle")
                                    .attr("class",function(d){
                                            if ( BrushStarSecond.isWithinExtent(xStarCoordinatesSecondDetail(d.xStarSecondDetail), yStarCoordinatesSecondDetail(d.yStarSecondDetail))) {
                                                        return "circle";
                                                } else {
                                                       return "no_selected";
                                                }
                                        }
                                    );
                                })
                                .on("brushend",function(){
                                    // estados(GENERALMATRIX,'wiggle');
                                });


                    //Llamada de Brush
                    SecondDetail.append("svg:g")
                    .attr("class", "brush")
                    .call(BrushStarSecond);

                     /*funciones de mouse****************************************************************************/
                                 function mouseoverSecond(d){
                                         //console.log(mycontrolPointsSecondDetails);
                                         divSecondDetail.transition()
                                                                            .duration(25)
                                                                            .style("border","solid 1px "+d.color)
                                                                            .style("opacity", .9);
                                                                             var mensaje=d.text;

                                                                             divSecondDetail.html(mensaje)
                                                                            .style("left", (d3.event.pageX) + "px")
                                                                            .style("top", (d3.event.pageY) + "px");
                                 }
                            function mouseOUTSecond(){
                                            divSecondDetail.transition()
                                                                            .duration(500)
                                                                            .style("opacity", 0);
                                         }
                             function DragStarSecond(){
                                            d3.event.sourceEvent.stopPropagation();
                                         }
                             function DragSecond(){
                                            d3.select(this)
                                            .attr("class","Selected")
                                            .attr("cx",function(d){
                                            d.x=xStarCoordinatesSecondDetail.invert(Math.max(8, Math.min(SIZESECONDPROJECTION , d3.event.x)));
                                                                        return xStarCoordinatesSecondDetail(d.x);//Math.max(6, Math.min(size - tolerancia , d3.event.x));
                                                                                            })
                                                                     .attr("cy",function(d){
                                        d.y=yStarCoordinatesSecondDetail.invert(Math.max(8, Math.min(SIZESECONDPROJECTION , d3.event.y)));
                                      return yStarCoordinatesSecondDetail(d.y);// Math.max(6, Math.min(size - tolerancia , d3.event.y));
                                                                                            })
                                                                                 .attr("r",8);

                                                                                SecondDetail.selectAll("line")
                                                                                    .data(mycontrolPointsSecondDetails)
                                                                                    .transition()
                                                                                    .duration(1)
                                                                                    .each("start", function() {  // Start animation
                                                                                        d3.select(this)  // 'this' means the current element
                                                                                          //  .attr("fill", "red");  // Change color

                                                                                    })
                                                                                    .delay(function(d, i) {
                                                                                        return 1;// i / controlPoints1.length * 500;  // Dynamic delay (i.e. each item delays a little longer)
                                                                                    })
                                                                                    .attr("x1",function(d){ return xStarCoordinatesSecondDetail(0);})
                                                                                     .attr("y1",function(d){ return yStarCoordinatesSecondDetail(0);})
                                                                                     .attr("x2",function(d){ return xStarCoordinatesSecondDetail(d.x);})
                                                                                     .attr("y2",function(d){ return yStarCoordinatesSecondDetail(d.y);})

                                                                                     .attr("stroke-width",2)
                                                                                     .attr("stroke",function(d,i){return d.color;})
                                                                                     .each("end", function() {  // End animation
                                                                                        d3.select(this)  // 'this' means the current element
                                                                                            .transition()
                                                                                            .duration(velocidadAnimacion);
                                                                                            //.attr("fill",function(d){return myColors(parseInt(d.klasses));});
                                                                                    });
                                                   var V=new Array();
                                                    mycontrolPointsSecondDetails.forEach(function(d,i){

                                                              V[i]=[parseFloat(d.x),parseFloat(d.y)]
                                                       });

                                                      SecondDetail.selectAll("circle")
                                                            .data(osDados)
                                                            .transition()
                                                            .duration(1)
                                                            .each("start", function() {  // Start animation
                                                                d3.select(this)  // 'this' means the current element
                                                               // .attr("fill", "red");  // Change color
                                                                 })
                                                                .delay(function(d, i) {
                                                                          return i / osDados.length * velocidadAnimacion;  // Dynamic delay (i.e. each item delays a little longer)
                                                                 })
                                                                .attr("cx",function(d){
                                                                        var Aux=STARCOORDINATESFor_Point(d.valoresSecondDetail,V);
                                                                          d.xStarSecondDetail=Aux[0];
                                                                          d.yStarSecondDetail=Aux[1];
                                                                        return xStarCoordinatesSecondDetail(d.xStarSecondDetail);
                                                                        })
                                                                .attr("cy",function(d){return yStarCoordinatesSecondDetail(d.yStarSecondDetail);})
                                                                .each("end", function() {  // End animation
                                                                 d3.select(this)  // 'this' means the current element
                                                                         .transition()
                                                                        .duration(velocidadAnimacion)
                                                                        .attr("fill",function(d){return DataColor(parseInt(d.klasses),1000);});
                                                                  });
                                         }


                                         function DragEndSecond(){
                                                 //Actualizamos los puntos las ubicaciones de los puntos de control
                                                                                    var V=new Array();
                                                                                        // console.log(vectorPromedio);
                                                                                 /*       var theSecondScScalenumber=MENOS_INFINITO;
                                                                                     mycontrolPointsSecondDetails.forEach(function(d,i){
                                                                                           if(Math.abs(d.x)>theSecondScScalenumber){theSecondScScalenumber=Math.abs(d.x);}
                                                                                           if(Math.abs(d.y)>theSecondScScalenumber){theSecondScScalenumber=Math.abs(d.y);}
                                                                                            V[i]=[parseFloat(d.x),parseFloat(d.y)]
                                                                                     });
                                                                                       osDados.forEach(function(f){
                                                                                          var Aux=numeric.dot(f.valoresSecondDetail,V);
                                                                                          f.xStarSecondDetail=Aux[0];
                                                                                          f.yStarSecondDetail=Aux[1];
                                                                                            if(Math.abs(Aux[0])>theSecondScScalenumber){theSecondScScalenumber=Math.abs(Aux[0]);}
                                                                                          if(Math.abs(Aux[1])>theSecondScScalenumber){theSecondScScalenumber=Math.abs(Aux[1]);}
                                                                                    });*/

                                                                                //xStarCoordinatesSecondDetail.domain(-1*theSecondScScalenumber,theSecondScScalenumber);
                                                                                //yStarCoordinatesSecondDetail.domain(-1*theSecondScScalenumber,theSecondScScalenumber);

                                                                                /*SecondDetail.selectAll("circle")
                                                                                .data(osDados)
                                                                                .transition()
                                                                                .duration(1000)
                                                                                .each("start", function() {  // Start animation
                                                                                    d3.select(this)  // 'this' means the current element
                                                                                       // .attr("fill", "red");  // Change color

                                                                                })
                                                                                .delay(function(d, i) {
                                                                                    return i / osDados.length * velocidadAnimacion;  // Dynamic delay (i.e. each item delays a little longer)
                                                                                })
                                                                                .attr("cx",function(d){return xStarCoordinatesSecondDetail(d.xStarSecondDetail);})
                                                                                .attr("cy",function(d){return yStarCoordinatesSecondDetail(d.yStarSecondDetail);})
                                                                                 .each("end", function() {  // End animation
                                                                                    d3.select(this)  // 'this' means the current element
                                                                                        .transition()
                                                                                        .duration(velocidadAnimacion)
                                                                                        .attr("fill",function(d){return  DataColor(parseInt(d.klasses),1000);});

                                                                                    }); */
                                                                                  //  refreshSecondPointDetails();
                                       }
                      /****************************************************************************************************/
                    SecondDetail.selectAll(".star_points")
                    .data(osDados)
                    .enter().append("g").append("circle")
                            .attr("id",function(d,i){return "dps";})
                        .attr("class",function(d){ return "circle";})
                        .attr("cx",function(d){return xStarCoordinatesSecondDetail(d.xStarSecondDetail);})
                        .attr("cy",function(d){return yStarCoordinatesSecondDetail(d.yStarSecondDetail);})
                        .attr("stroke",ColordeDato)
                        .attr("stroke-width",strokeData)
                        .attr("r",6)
                        .attr("fill",function(d){return  DataColor(parseInt(d.klasses),1000);  });


                        SecondDetail.selectAll(".head_coordinates_Detail")
                        .data(mycontrolPointsSecondDetails)
                        .enter()
                        .append("circle")
                         .attr("id",function(d,i){return "dcp";})
                         .attr("cx",function(d){ return xStarCoordinatesSecondDetail(d.x);})
                         .attr("cy",function(d){ return yStarCoordinatesSecondDetail(d.y);})
                         .attr("stroke",ColordeControl)
                           .attr("stroke-width",strokeControl)
                         .attr("r",8)
                         .attr("fill",function(d,i){return d.color})
                         .on("mouseover",mouseoverSecond)

                        .on("mouseout",mouseOUTSecond)
                         .call(d3.behavior.drag()
                            .on("dragstart",DragStarSecond)
                            .on("drag",DragSecond)
                            .on("dragend",DragEndSecond));



                            //}));
                SecondDetail.selectAll("line")
                                     .data(mycontrolPointsSecondDetails)
                                     .enter()
                                     .append("line")
                                     .attr("id",function(d,i){  return "lcp"+i;})
                                     .attr("x1",function(d){ return xStarCoordinatesSecondDetail(0);})
                                     .attr("y1",function(d){ return yStarCoordinatesSecondDetail(0);})
                                     .attr("x2",function(d){ return xStarCoordinatesSecondDetail(d.x);})
                                     .attr("y2",function(d){ return yStarCoordinatesSecondDetail(d.y);})
                                     .attr("stroke-width",2)
                                     .attr("stroke",function(d,i){return SecondControPointColor(i,mycontrolPointsSecondDetails.length);});





                function refreshSecondPointDetails(){
                    SecondDetail.selectAll("#dcp").remove();
                                                 SecondDetail.selectAll("line").remove();

                                                  SecondDetail.selectAll("line")
                                                             .data(mycontrolPointsSecondDetails)
                                                                             .enter()
                                                                            .append("line")
                                                                              .attr("id",function(d,i){  return "lcp"+i;})
                                                                              .attr("x1",function(d){ return xStarCoordinatesSecondDetail(0);})
                                                                              .attr("y1",function(d){ return yStarCoordinatesSecondDetail(0);})
                                                                              .attr("x2",function(d){ return xStarCoordinatesSecondDetail(d.x);})
                                                                              .attr("y2",function(d){ return yStarCoordinatesSecondDetail(d.y);})
                                                                              .attr("stroke-width",2)
                                                                              .attr("stroke",function(d,i){d.color});

                                                                        SecondDetail.selectAll(".head_coordinates")
                                                                         .data(mycontrolPointsSecondDetails)
                                                                         .enter()
                                                                         .append("circle")
                                                                         .attr("id",function(d,i){return "cp";})
                                                                         .attr("cx",function(d){ return xStarCoordinatesSecondDetail(d.x);})
                                                                         .attr("cy",function(d){ return yStarCoordinatesSecondDetail(d.y);})
                                                                         .attr("r",6)
                                                                         .attr("fill",function(d,i){return d.color;})
                                                                          .on("mouseover",mouseoverSecond)
                                                                                            .on("mouseout",mouseOUTSecond)
                                                                                             .call(d3.behavior.drag()
                                                                                                .on("dragstart",DragStarSecond)
                                                                                                .on("drag",DragSecond)
                                                                                                .on("dragend",DragEndSecond));
                }

             }
     }
    function Proyectar(){
            var misGrupos=new Array()
             misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial
             MYCONTROLPOINTS=new Array();
            MYCONTROLPOINTS=distribucion(1,misGrupos); //Distribucion inicial de los puntos de control

            StarCoordinatesRender();
            //RadViz();
    }
    function RadViz()
    {
        //STAR.selectAll("rect").remove();
        var misGrupos=new Array()
        misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial
        MYCONTROLPOINTS=new Array();
        MYCONTROLPOINTS=distribucion(1,misGrupos); //Distribucion inicial de los puntos de control
        var VArrayControlPoints=new Array();
        MYCONTROLPOINTS.forEach(function(d,i){VArrayControlPoints[i]=[parseFloat(d.x),parseFloat(d.y)]});

        GENERALMATRIX.rows.forEach(function (d,i) {
                            var valores=d.valores;
                            //sacamos todos los valores para los puntos de controlPoints1
                            var Suma=0;
                            valores.forEach(function(f){
                                Suma=parseFloat(Suma)+parseFloat(f);
                            });
                            var Aux=STARCOORDINATESFor_Point(valores,VArrayControlPoints);

                osDados.push({"id":d.id,"klasses":d.klass,"valores":valores,"xStar":parseFloat(Aux[0]/Suma),"yStar":parseFloat(Aux[1]/Suma)});
             });

        DistanceMatrixMainProjectionFunction(osDados);
            klasesIndices=GetKlasses(osDados);


         var xStarCoordinates=d3.scale.linear().domain([-1.2,1.2]).range([ tolerancia/2,SIZEMAINPROJECTION-tolerancia/2]);
           var yStarCoordinates=d3.scale.linear().domain([-1.2,1.2]).range([ tolerancia/2,SIZEMAINPROJECTION+parseInt(contro)-tolerancia/2]);
            var CpScale=d3.scale.linear().domain([1,1]).range([10,10]);// ESCALA DEL NUMERO DE PUNTOS DE CONTROL
                         STAR.selectAll(".star_points")
                            .data(osDados)
                            .enter().append("g").append("circle")

                                .attr("cx",function(d){return xStarCoordinates(d.xStar);})
                                .attr("cy",function(d){return yStarCoordinates(d.yStar);})
                                .attr("r",radioMainProjection)
                                .attr("stroke",ColordeDato)
                                 .attr("stroke-width",strokeData)
                                .attr("fill",function(d){return DataColor(parseInt(d.klasses),1000);})
                                .attr("class","circleData");

                // misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial
                      STAR.selectAll(".head_coordinates")
                                         .data(MYCONTROLPOINTS)
                                         .enter()
                                         .append("circle")
                                         .attr("stroke", ColordeControl)
                                         .attr("stroke-width",strokeControl)
                                         .attr("id",function(d,i){return "cp";})
                                         .attr("cx",function(d){ return xStarCoordinates(d.x);})
                                         .attr("cy",function(d){ return xStarCoordinates(d.y);})
                                         .attr("r",function(d){return CpScale(d.valores.length);})
                                         .attr("fill",function(d,i){return d.color;});

    }
    /*Input:
            - porcentage: porcentege de consideracion de vecindad
            - AbstractMatrix: matrix con el que se hara la Proyeccion
        */
        function distribucion(radio,attributos){
             var puntos=new Array(parseInt(attributos.length));
            // var radio=(parseFloat(BEST)+parseFloat(WORST))/2.0;
             var PI=3.14159;
             var b=parseFloat(360.0/parseFloat(attributos.length));
            // console.log("	NUM:"+num);
            var vector=new Array(attributos.length);
            for(i=0;i<parseInt(attributos.length);i++){
                 var valor=(i)*parseFloat(b);
                 var Radianes=(parseFloat(valor)*parseFloat(PI)/parseFloat(180.0));
                 var x=Math.cos(parseFloat(Radianes))*parseFloat(radio);
                 var y=Math.sin(parseFloat(Radianes))*parseFloat(radio);
                 vector[i]={"id":attributos[i].indice,"text":attributos[i].text,"x":parseFloat((x)),"y":parseFloat((y)),"valores":attributos[i].valores,"color":attributos[i].color};

             }
            return vector;
        }


    function distribucionLocal(ControlPoints,distancias){

             var radio=1;//(parseFloat(BEST)+parseFloat(WORST))/2.0;
             var PI=3.14159;
            // var b=parseFloat(360.0/parseFloat(attributos.length));
            // console.log("	NUM:"+num);
            var Acumulado=0;
            for(i=0;i<parseInt(ControlPoints.length);i++){
                Acumulado+=parseFloat(distancias[i]);
                 var valor=Acumulado;//+parseFloat(distancias[i]);
                 var Radianes=(parseFloat(valor)*parseFloat(PI)/parseFloat(180.0));
                 var x=Math.cos(parseFloat(Radianes))*parseFloat(radio);
                 var y=Math.sin(parseFloat(Radianes))*parseFloat(radio);
                 ControlPoints[i].x=x;
                 ControlPoints[i].y=y;
             }
        }

    function CalcularNeighborhoodPreservation(){

       if(DistanceMatrixGeneralMatrixOriginal.length==0){  MakeDistanceMatrixGeneralMatrixOriginal();}
        DistanceMatrixMainProjectionFunction(osDados);

        var intt=parseInt(document.getElementById("percentage").value);
        var Arraynum=new Array();//[3,6,9,12,15,18,21,24,27,30];
        var inter=parseInt(intt/10);
        for(i=0;i<10;i++){
            Arraynum[i]=(i+1)*inter;
        }
        var valores=PorcentajeVecinosPoints(Arraynum);
        if(DistanceMatrixSecondDetail.length>0){
            DistanceMatrixSecondDetailFunction(osDados);
            var valoresSecond=PorcentajeVecinosPointsSECONDDETAIL(Arraynum);
            AddNeighborhoodPreservationDoble(Arraynum,valores,valoresSecond);
        }else{
            AddNeighborhoodPreservation(Arraynum,valores);
        }
    }
    function AddNeighborhoodPreservationDoble(ArrayVecino,ArrayValores,ArrayValoresSecond){
        NPDIV.selectAll("*").remove();
        var misNPdados=new Array();
        var misNPdadosSecond=new Array();
        ArrayVecino.forEach(function(d,i){
            misNPdados.push({"i":parseInt(d),"val":parseFloat(ArrayValores[i])});
            misNPdadosSecond.push({"i":parseInt(d),"val":parseFloat(ArrayValoresSecond[i])});
        });

        var x = d3.time.scale()
        .range([0,NP_width ]);

        var y = d3.scale.linear()
            .range([NP_height, 0]);

        var xAxis = d3.svg.axis()
            .ticks(5)
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
        .x(function(d) { return x(d.i); })
        .y(function(d) { return y(d.val); });

        var lineSecond = d3.svg.line()
        .x(function(d) { return x(d.i); })
        .y(function(d) { return y(d.val); });

          x.domain([ArrayVecino[0],ArrayVecino[ArrayVecino.length-1]]);
          y.domain([Math.min(d3.min(ArrayValores),d3.min(ArrayValoresSecond)),Math.max(d3.max(ArrayValores),d3.max(ArrayValoresSecond))]);

          NPDIV.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + NP_height + ")")
              .call(xAxis)
              .append("text")
              .attr("x", NP_width)
              .attr("dx", ".71em")
              .style("text-anchor", "end")
              .text("Number Neighbors");

          NPDIV.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Precision");

         NPDIV.append("path")
          .datum(misNPdados)
          .attr("class", "line")
          .attr("d", line);

         NPDIV.append("path")
          .datum(misNPdadosSecond)
          .attr("class", "line2")
          .attr("d", lineSecond);
    }
    function AddNeighborhoodPreservation(ArrayVecino,ArrayValores){
        NPDIV.selectAll("*").remove();
        var misNPdados=new Array();
        ArrayVecino.forEach(function(d,i){
            misNPdados.push({"i":parseInt(d),"val":parseFloat(ArrayValores[i])});
        });

        var x = d3.time.scale()
        .range([0,NP_width ]);

        var y = d3.scale.linear()
            .range([NP_height, 0]);

        var xAxis = d3.svg.axis()
            .ticks(5)
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
        .x(function(d) { return x(d.i); })
        .y(function(d) { return y(d.val); });

          x.domain([ArrayVecino[0],ArrayVecino[ArrayVecino.length-1]]);
          y.domain([d3.min(ArrayValores),d3.max(ArrayValores)]);

          NPDIV.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + NP_height + ")")
              .call(xAxis)
              .append("text")
              .attr("x", NP_width)
              .attr("dx", ".71em")
              .style("text-anchor", "end")
              .text("Number Neighbors");

          NPDIV.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Precision");
         NPDIV.append("path")
          .datum(misNPdados)
          .attr("class", "line")
          .attr("d", line);
    }

    /*-----------------------------------------------------------------ALGORITMOS DE CLUSTERIZACION-------------------------------*/
    function clusterizacionMain(){
        ListOfRemovedDimensions=new Array();
        clearALLTable("myTableRemoved");
        var e = document.getElementById("typeMethod");
        var str =e.selectedIndex;
        if(parseInt(str)==3){
            clusterizacionPrueba();
        }else{
        if(parseInt(str)==0){
            GroupYsimilaridad_PCA();
        }else{
            if(parseInt(str)==0){
                GroupYsimilaridad();
              }else	{
                GroupYsimilaridad_VARIANZA();
            }
        }}
    }

    function clusterizacionPrueba(){
    LISTOFDIMENSIONS=new Array();
        ListOfGroupsOfDimensions=new Array();
         GENERALMATRIX.attributes.forEach(function(d,i){
              var color=ControlPointColor(i, GENERALMATRIX.attributes.length);
              var vi=[{"indice":i,"text":d}]
              LISTOFDIMENSIONS.push({"indice":i,"text":d,"valores":vi,"color":color});
          });


        var Clasess=new Array();
        var ContadorClases=new Array();
        var MatrixPromedio=new Array();
        GENERALMATRIX.rows.forEach(function(d){
            var valores=d.valores;

            var indice=Clasess.indexOf(parseInt(d.klass));
            if(indice>=0){
                ContadorClases[indice]++;
                var varAux=MatrixPromedio[indice];
                valores.forEach(function(val,j){
                    MatrixPromedio[indice][j]=parseFloat(parseFloat(MatrixPromedio[indice][j])+parseFloat(valores[j]))/2.0;
                });
            }
            else{
                ContadorClases.push(1);
                MatrixPromedio.push(valores);
                Clasess.push(parseInt(d.klass));
            }
        });

      //  console.log("este es  la matriz a verificar");
     //   console.log(MatrixPromedio);
        var rese=numeric.transpose(MatrixPromedio);
        var NumeroGroups=document.getElementById("numGroup").value;
        var clusters = figue.kmeans(parseInt(NumeroGroups), rese);

        var klasses=clusters.assignments;

            var respuesta=new Array();
            for(i=0;i<clusters.centroids.length;i++){
                var aux=new Array();
                respuesta.push({"text":"","valores":aux,"color":"#fff"});
            }

            for(i=0;i<klasses.length;i++){
                respuesta[parseInt(klasses[i])].text+="|"+i;
                respuesta[parseInt(klasses[i])].valores.push(LISTOFDIMENSIONS[i]);
                respuesta[parseInt(klasses[i])].color=ConcatColor(LISTOFDIMENSIONS[i].color,respuesta[parseInt(klasses[i])].color);
            }

            for(i=0;i<clusters.centroids.length;i++){
                ListOfGroupsOfDimensions.push({"indice":"Group_"+i,"text":"Group_"+i,"valores":respuesta[i].valores,"color":respuesta[i].color});
            }


            LISTOFDIMENSIONS=new Array();
                        llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");
                        llenar_CheckBox(ListOfGroupsOfDimensions,"myTableLeft","ATTRIBUTES2","checkbox2");

              var misGrupos=new Array()
                         misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial
                        MYCONTROLPOINTS=new Array();
                        MYCONTROLPOINTS=distribucion(1,misGrupos); //Distribucion inicial de los puntos de control

            StarCoordinatesRender();
    }

    function GroupYsimilaridad(){
        var AResult=getSimilarityMatrix(GENERALMATRIX);
        var A=AResult.A;
        var porcentage=document.getElementById("numGroup").value;
        //inicializamos todos los datos******************************************************
        LISTOFDIMENSIONS=new Array();
        ListOfGroupsOfDimensions=new Array();

        GENERALMATRIX.attributes.forEach(function(d,i){
             var color=ControlPointColor(i, GENERALMATRIX.attributes.length);
              var vi=[{"indice":i,"text":d,"color":color}]
              LISTOFDIMENSIONS.push({"indice":i,"text":d,"valores":vi,"color":color});
          });

        //inicializamos todos los datos******************************************************
        if(parseInt(porcentage)>=A.length){
            StarCoordinatesFunction(false);
        }else{
             var e = document.getElementById("typecluster");
             var str =e.selectedIndex;
            if(parseInt(str)==1){
                var ind=Math.ceil(A.length/parseInt(porcentage));

                ListOfGroupsOfDimensions=new Array();
                var i=0;
                while(i<A.length){
                        var valores=new Array();
                        var text="";
                        var color="#fff";
                        for(k=i;k<(i+ind)&&k<A.length;k++){
                            valores.push(LISTOFDIMENSIONS[A[k]]);
                            text+="|"+A[k];
                            color=ConcatColor(LISTOFDIMENSIONS[A[k]].color,color);
                        }

                        //ListOfGroupsOfDimensions.push({"indice":text,"text":text,"valores":valores,"color":color});
                        ListOfGroupsOfDimensions.push({"indice":"Group_"+i,"text":"Group_"+i,"valores":valores,"color":color});
                        i=i+(ind);
                }
                    LISTOFDIMENSIONS=new Array();
                    llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");
                    llenar_CheckBox(ListOfGroupsOfDimensions,"myTableLeft","ATTRIBUTES2","checkbox2");
                    if(osDados.length>0){
                    StarCoordinatesFunction(false);
                    }
            }else{
                var val=AResult.ArregloVal;
                var arry=new Array();
                for(i=0;i<val.length;i++){
                    arry.push([i,val[i]]);
                }
                var clusters = figue.kmeans(parseInt(porcentage), arry);
                var klasses=clusters.assignments;


                var valores=new Array();
                var text="|"+A[0];
                valores.push(LISTOFDIMENSIONS[A[0]]);
                var i=1;
                color="#fff";
                while(i<A.length){
                    if(parseInt(klasses[i])==parseInt(klasses[i-1])){
                        valores.push(LISTOFDIMENSIONS[A[i]]);
                        text+="|"+A[i];
                        color=ConcatColor(LISTOFDIMENSIONS[A[k]].color,color);
                    }else{
                        //ListOfGroupsOfDimensions.push({"indice":text,"text":text,"valores":valores,"color":color});
                        ListOfGroupsOfDimensions.push({"indice":klasses[i],"text":klasses[i],"valores":valores,"color":color});
                        color="#fff";
                        valores=new Array();
                        valores.push(LISTOFDIMENSIONS[A[i]]);
                        text="|"+A[i];
                    }
                    i++;
                }
                //insertamos los valores restantes
                ListOfGroupsOfDimensions.push({"indice":"Group_"+i,"text":"Group_"+i,"valores":valores});


                LISTOFDIMENSIONS=new Array();
                    llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");
                    llenar_CheckBox(ListOfGroupsOfDimensions,"myTableLeft","ATTRIBUTES2","checkbox2");
                    if(osDados.length>0){
                    StarCoordinatesFunction(false);
                    }
            }
        }
        StarCoordinatesFunction(false);
    }
    function GroupYsimilaridad_VARIANZA(){

        LISTOFDIMENSIONS=new Array();
        ListOfGroupsOfDimensions=new Array();
         GENERALMATRIX.attributes.forEach(function(d,i){
              var color=ControlPointColor(i, GENERALMATRIX.attributes.length);
              var vi=[{"indice":i,"text":d}]
              LISTOFDIMENSIONS.push({"indice":i,"text":d,"valores":vi,"color":color});
          });
        var NumeroGroups=document.getElementById("numGroup").value;

        var datos=desviacionEstandar(GENERALMATRIX.getMatrix(),GENERALMATRIX.attributes.length,GENERALMATRIX.rows.length);

        var rese=new Array();

        datos.forEach(function(d){
            var val;
            if(parseFloat(d)==0.0000){val=0.0001;}else{val=parseFloat(d);}
            rese.push([parseFloat(val),parseFloat(val)]);
        })

        var clusters = figue.kmeans(parseInt(NumeroGroups), rese);

        var klasses=clusters.assignments;

        var respuesta=new Array();
        for(i=0;i<clusters.centroids.length;i++){
            var aux=new Array();
            respuesta.push({"text":"","valores":aux,"color":"#fff"});
        }

        for(i=0;i<klasses.length;i++){
            respuesta[parseInt(klasses[i])].text+="|"+i;
            respuesta[parseInt(klasses[i])].valores.push(LISTOFDIMENSIONS[i]);
            respuesta[parseInt(klasses[i])].color=ConcatColor(LISTOFDIMENSIONS[i].color,respuesta[parseInt(klasses[i])].color);
        }

        for(i=0;i<clusters.centroids.length;i++){
            ListOfGroupsOfDimensions.push({"indice":"Group_"+i,"text":"Group_"+i,"valores":respuesta[i].valores,"color":respuesta[i].color});
        }


        LISTOFDIMENSIONS=new Array();
                    llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");
                    llenar_CheckBox(ListOfGroupsOfDimensions,"myTableLeft","ATTRIBUTES2","checkbox2");

          var misGrupos=new Array()
                     misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial
                    MYCONTROLPOINTS=new Array();
                    MYCONTROLPOINTS=distribucion(1,misGrupos); //Distribucion inicial de los puntos de control

             StarCoordinatesRender();

    }
    function GroupYsimilaridad_PCA(){
        //inicializamos todos los datos******************************************************
        LISTOFDIMENSIONS=new Array();
        ListOfGroupsOfDimensions=new Array();
        GENERALMATRIX.attributes.forEach(function(d,i){
             var color=ControlPointColor(i, GENERALMATRIX.attributes.length);
              var vi=[{"indice":i,"text":d,"color":color}]
               var c=[{"indice":i,"text":d,"color":color}];
              vi.valores=c;
              LISTOFDIMENSIONS.push({"indice":i,"text":d,"valores":vi,"color":color});
        });



        //inicializamos todos los datos******************************************************
        var porcentage=document.getElementById("numGroup").value;
        //prueba de exoneracion de indices
        var ArrayIndexs=new Array();
        LISTOFDIMENSIONS.forEach(function(d){ArrayIndexs.push(parseInt(d.indice));});

        //var matrixPura=GENERALMATRIX.getMatrix();
        var matrixPura=GENERALMATRIX.GetMatrixFromIndexs(ArrayIndexs);
        var rese=PCA(matrixPura);
        //var rese=pcaKlasses;
        for(i=0;i<rese.length;i++){
            rese[i][0]=parseFloat(rese[i][0]);
            rese[i][1]=parseFloat(rese[i][1]);
        }
        //console.log(rese);

        //var clusters = figue.kmeans(parseInt(porcentage), rese);
        /*
        var klasses=[1,3,10,11,10,11,8,9,0,0,5,17,1,8,16,3,11,10,2,1,11,0,19,11,19,3,8,16,6,10,9,0,4,19,18,11,17,18,2,5,10,9,3,16,0,8,16,18,7,10,18,10,13,19,1,3,3,8,17,10,3,9,4,5,12,8,16,4,17,1,0,10,16,18,8,3,3,3,11,3,0,5,5,5,18,8,10,18,11,11,10,10,13,3,17,18,1,16,5,2,18,8,17,4,4,6,19,8,5,2,0,9,17,10,11,8,9,8,16,10,0,19,3,16,16,5,9,18,6,8,8,10,4,18,10,10,8,10,19,16,16,9,16,18,17,0,8,18,0,8,3,2,18,12,10,3,9,10,0,1,13,1,8,16,8,10,11,18,13,9,5,5,5,19,19,11,9,5,13,5,0,8,3,18,9,0,3,17,0,17,1,9,19,4,0,0,18,18,5,17,11,16,8,17,2,10,17,18,8,4,9,10,5,3,11,9,0,8,10,10,2,8,11,5,5,2,19,10,8,2,2,10,3,4,3,18,0,11,16,19,0,14,2,8,0,8,8,16,0,18,10,8,3,8,19,19,3,8,1,2,4,9,0,16,3,5,8,1,16,10,0,19,8,19,10,19,3,0,18,0,2,12,1,8,16,3,10,8,10,19,8,1,8,10,5,2,4,0,0,16,16,19,2,8,1,4,11,16,0,19,5,10,11,5,3,13,17,17,6,8,5,16,19,4,13,10,8,18,10,4,19,0,3,9,3,11,12,4,15,10,1,19,2,3,0,3,2,0,3,5,0,5,3,3,10,0,1,4,19,10,3,13,4,1,9,10,17,1,9,2,10,3,1,16,1,1,2,3,7,2,19,1,16,2,3,8,8,10,9,3,13,10,5,19,9,19,4,1,13,8,8,17,9,10,9,0,10,18,4,10,17,3,0,2,19,17,4,3,8,10,3,10,3,3,8,8,17,1,16,2,3,8,13,12,17,2,0,18,5,5,10,1,15,17,10,11,10,10,16,18,17,6,2,12,8,1,5,0,19,10,0,11,8,10,10,8,11,4,5,11,11,18,15,4,11,14,16,10,1,5,3,8,10,3,17,11,18,1,3,17,18,8,3,12,3,19,16,18,5,18];
        var centroids=new Array(20);

        var respuesta=new Array();
        for(i=0;i<centroids.length;i++){
            var aux=new Array();
            respuesta.push({"text":"","valores":aux});
        }

        for(i=0;i<klasses.length;i++){
            respuesta[parseInt(klasses[i])].text+="|"+i;
            respuesta[parseInt(klasses[i])].valores.push(LISTOFDIMENSIONS[i]);
        }

        for(i=0;i<centroids.length;i++){
            ListOfGroupsOfDimensions.push({"indice":respuesta[i].text,"text":respuesta[i].text,"valores":respuesta[i].valores});
        }*/

        //KMEANSFunction(rese,parseInt(porcentage));

        var clusters = figue.kmeans(parseInt(porcentage), rese);
        var klasses=clusters.assignments;
      /*  var ckll=new Array();
        var kk=1;
        var group=0;
        for(jj=0;jj<384;jj++){
           if(kk<=6){
                ckll[jj]=parseInt(group);
           }else{
                group=group+1;
                kk=1;
                ckll[jj]=parseInt(group);
           }
           kk++;
        }
        console.log(clusters);
         var klasses=ckll;
         console.log(klasses);*/
        //console.log(ckll);

        //console.log(clusters);
      //  console.log(klasses);

        var respuesta=new Array();
        for(i=0;i<clusters.centroids.length;i++){
            var aux=new Array();
            respuesta.push({"text":"","valores":aux,"color":"#fff"});
        }

        for(i=0;i<klasses.length;i++){
            respuesta[parseInt(klasses[i])].text+="|"+i;
            respuesta[parseInt(klasses[i])].valores.push(LISTOFDIMENSIONS[i]);
            respuesta[parseInt(klasses[i])].color=ConcatColor(LISTOFDIMENSIONS[i].color,respuesta[parseInt(klasses[i])].color);

        }

        for(i=0;i<clusters.centroids.length;i++){
            //ListOfGroupsOfDimensions.push({"indice":respuesta[i].text,"text":respuesta[i].text,"valores":respuesta[i].valores,"color":respuesta[i].color});
            ListOfGroupsOfDimensions.push({"indice":"Group_"+i,"text":"Group_"+i,"valores":respuesta[i].valores,"color":respuesta[i].color});
        }


        LISTOFDIMENSIONS=new Array();
                    llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");
                    llenar_CheckBox(ListOfGroupsOfDimensions,"myTableLeft","ATTRIBUTES2","checkbox2");

        var misGrupos=new Array()
                 misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial
                MYCONTROLPOINTS=new Array();
                MYCONTROLPOINTS=distribucion(1,misGrupos); //Distribucion inicial de los puntos de control

         StarCoordinatesRender();

    }
    /******************************************************************************Reordering**************************************************/
      function  ReorderingMain(){

            var e = document.getElementById("typeMethodReordering");
                var str =e.selectedIndex;
                if(parseInt(str)==0){
                    VarianceReordering();
                }else{
                   if(DistanceMatrixGeneralMatrixOriginal.length==0){ MakeDistanceMatrixGeneralMatrixOriginal();}
                    MetricReordering();
                }
      }

    function MetricReordering(){
        flagOrder=1;
        var varmio=new Array();
        MYCONTROLPOINTS.forEach(function(a,s){varmio.push(s);});

        var V=new Array(MYCONTROLPOINTS.length);
          MYCONTROLPOINTS.forEach(function(d,i){V[i]=[parseFloat(d.x),parseFloat(d.y)]});

        var cmb = Combinatorics.permutation(varmio); // assumes 4
        var combinaciones=cmb.toArray();//[[0,1,2,3],[0,2,1,3]];

        var may=0;
        var ArregloMayor=new Array();
        combinaciones.forEach(function(Arrays){
             var x=new Array();
             Arrays.forEach(function(g){x.push(V[parseInt(g)])});

             var meus=STARCOORDINATESTERCEROPROArrayArray(osDados,x);

             DistanceMatrixMainProjectionFunction(osDados);
            //  var ratio=IndiceDum(osDados,klasesIndices);

              var topologica=PreservacionTopologica([30,40]);
              var np=PorcentajeVecinosPoints([30]);
              var promedio=parseFloat(parseFloat(topologica+np)/2);
              if(parseFloat(promedio)>parseFloat(may)){may=promedio; ArregloMayor=Arrays;}
              console.log("topologica"+topologica+" -  NpRESE"+np);
        });
        var BestOrder=ArregloMayor;
        var V=new Array(MYCONTROLPOINTS.length);
                        MYCONTROLPOINTS.forEach(function(d,i){V[i]=[parseFloat(d.x),parseFloat(d.y)]});
                        var Auxiliar=new Array();
                        BestOrder.forEach(function(d){Auxiliar.push(MYCONTROLPOINTS[parseInt(d)])});
                        MYCONTROLPOINTS=Auxiliar;
                        MYCONTROLPOINTS.forEach(function(d,i){d.x=parseFloat(V[i][0]); d.y=parseFloat(V[i][1]);});

        StarCoordinatesRender();
      }


      function VarianceReordering(){
        flagOrder=0;
        //console.log("INFORMACION DE LOS PUNTOS DE CONTROL");
        //console.log(MYCONTROLPOINTS);
        var distancia=GetPureSimilarityMatrix(MYCONTROLPOINTS,osDados);
        var points=MYCONTROLPOINTS;

        initData();
        GAInitialize(distancia,points);

        for(i=0;i<100;i++){
             GANextGeneration();
        }
        var BestOrder=best;
        //hallamos las mejores distancias
        var BestDistances=new Array();

        for(i=0;i<MYCONTROLPOINTS.length-1;i++){
            BestDistances.push(distancia[i][i+1]);
        }

        BestDistances.push(distancia[MYCONTROLPOINTS.length-1][0]);

        var sum=0; BestDistances.forEach(function(f){sum+=f;});
        var scale=d3.scale.linear().domain([0,sum]).range([0,360]);
        BestDistances.forEach(function(f,i){BestDistances[i]=scale(f);});

        var Auxiliar=new Array();
        BestOrder.forEach(function(d){Auxiliar.push(MYCONTROLPOINTS[parseInt(d)])});
        distribucionLocal(Auxiliar,BestDistances);
         MYCONTROLPOINTS=new Array();
         MYCONTROLPOINTS=Auxiliar;

        StarCoordinatesRender();
      }

    function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor(); // give temp the original obj's constructor
        for (var key in obj) {
            temp[key] = cloneObject(obj[key]);
        }

        return temp;
    }


       function BuildMetrics(){
          //Optimizacion(MycontrolPoints1,osDados);
          if(DistanceMatrixGeneralMatrixOriginal.length==0){  MakeDistanceMatrixGeneralMatrixOriginal();}
           DistanceMatrixMainProjectionFunction(osDados);

          var ratio;
          if(klasesIndices.length>1){
            ratio=IndiceDum(osDados,klasesIndices);
           }else
           {
           ratio=0.0001;
           }
          	  var topologica=PreservacionTopologica([30,40]);
          				   //console.log("topologica: "+topologica);
          				   //console.log("ratio: "+ratio);
          				   //document.getElementById("ratio").value = ratio;

          				     var h = document.getElementById("ratio");  					 // Create a <h1> element
          					 while ( h.firstChild ) h.removeChild( h.firstChild );
          					var t1 = document.createTextNode("Topology: "+topologica+"  - Dunn: "+ratio );     // Create a text node
          				//	var t2 = document.createTextNode("Siluette: "+ratio);     // Create a text node
          					h.appendChild(t1);
          			//		h.appendChild(t2);
          	/*GUARDAMOS HISTORIAL DE LAS POSICIONES*/
          	var copiaSeguridad=cloneObject(MYCONTROLPOINTS);
             //MYCONTROLPOINTS.forEach(function(d){
                //  var a=d;
              //    copiaSeguridad.push(a);
            // });
             HISTORIALESTADOS.push({"id":HISTORIALESTADOS.length,"topology":topologica,"dunn":ratio,"controlpoints":copiaSeguridad,"values":[ratio,topologica]});
             //SaveStates('zero');
             estados(GENERALMATRIX,'wiggle');

        }

        function estados(newMatrix,offset){
                      NPDIV.selectAll("*").remove();
                      var valores=["Dunn","Topology"];
                      var xSixth = d3.scale.ordinal().rangeRoundBands([0, NP_width], .1);
              		var ySixth = d3.scale.linear().rangeRound([NP_height,0]);

              		var stack = d3.layout.stack()
                      .values(function (d) { return d.values; })
                      .x(function (d) { return xSixth(d.label) + xSixth.rangeBand() / 2; })
                      .y(function (d) { return d.value; });

              		 var area = d3.svg.area()
                      .interpolate("cardinal")
                      .x(function (d)  { return xSixth(d.label) + xSixth.rangeBand() / 2; })
                      .y0(function (d) { return ySixth(d.y0); })
                      .y1(function (d) { return ySixth(d.y0 + d.y); });

              		 var seriesArr = [], series = {};
              		 valores.forEach(function (name,i) {
              		 series[name] = {name: name, values:[]};
              		 seriesArr.push(series[name]);
              		});


              		 HISTORIALESTADOS.forEach(function (d,i) {
              		    valores.map(function (name,j) {
              			    series[name].values.push({name: name, label: d.id, value: +d.values[j]});
              			});
              		});


              		 xSixth.domain(HISTORIALESTADOS.map(function (d) { return d.id; }));

              		stack.offset(offset)
              		stack(seriesArr);

              		ySixth.domain([0, d3.max(seriesArr, function (c) {
              			return d3.max(c.values, function (d) { return d.y0 + d.y; });
              		})]);

              		var color = d3.scale.ordinal()
                     .range(["#604715","#F2B236","#024E66","#01CFFE","#952500","#955600","#4B1424","#144B3B","#109618","#475003","#f0a417", "#b00d08","#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#001c9c","#101b4d","#475003","#9c8305","#d3c47c"]);

      /*
              		NPDIV.append("rect")
              		.attr("class","frame")
              		.attr("x", tolerancia / 2)
              		.attr("y", tolerancia/ 2)
              		.attr("width", NP_width)
              		.attr("height", NP_height);*/

              		var selection = NPDIV.selectAll(".series")
                    .data(seriesArr)
                    .enter().append("g")
                      .attr("class", "series");

              		selection.append("path")
                    .attr("class", "streamPath")
                    .attr("d", function (d) { return area(d.values); })
                    .style("fill", function (d) { return color(d.name); })
                    .style("stroke", "grey");


              	  var points = NPDIV.selectAll(".seriesPoints")
                    .data(seriesArr)
                    .enter().append("g")
                    .attr("class", "seriesPoints");

                   points.selectAll(".point")
                     .data(function (d) { return d.values; })
                     .enter().append("circle")
                     .attr("class", "point")
                     .attr("cx", function (d) { return xSixth(d.label) + xSixth.rangeBand() / 2; })
                     .attr("cy", function (d) { return ySixth(d.y0 + d.y); })
                     .attr("r", "4px")
                     .attr("fill","black")
              	   .attr("opacity","1")
                     .style("fill",function (d) { return color(d.name); })

                     .on("mouseover", function (d) {
              				 $(this).popover({
              				  title: d.label,
              				  placement: 'auto top',
              				  container: 'body',
              				  trigger: 'manual',
              				  html : true,
              				  content: function() {
              					return "Attr: " + d.name +
              						   "<br/>Value: " + d3.format(",")(d.value ? d.value.toFixed(4): (d.y1 - d.y0).toFixed(4)); }
              				});
              				$(this).popover('show')
              		})
                      .on("mouseout",  function (d) {$('.popover').each(function() {
              											  $(this).remove();
              											});
              		})
              		.on("click", function(d,i) {
              		            ProyectarEstado(d.label);
                                  //alert(d.label);
                                                });
        }
      function ProyectarEstado(indice){
                //var misGrupos=new Array()
                    // misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial
                MYCONTROLPOINTS=new Array();
                osDados=new Array();
                MYCONTROLPOINTS=HISTORIALESTADOS[parseInt(indice)].controlpoints;

                ListOfRemovedDimensions=HISTORIALESTADOS[parseInt(indice)].deleted;
                  restartNewPoints();
                //	MYCONTROLPOINTS=distribucion(1,misGrupos); //Distribucion inicial de los puntos de control
                //SACAMMOS LOS PUNTOS DE CONTROL DE

                StarCoordinatesRender();
      }
      /*
      function SaveStates(offset){
           NPDIV.selectAll("*").remove();
           var valores=["Topology","Dunn"];

           HISTORIALESTADOS.forEach(function(d,i){
                var y0=0;
                d.mapping=d.values.map(function(name,j){
                    return{
                        name:valores[j],
                        label:d.id,
                        x0:i,
                        y0:y0,
                        y1:y0+=+d.values[j]
                    };
                }
                );

                d.total=d.mapping[d.mapping.length-1].y1;
           });
           /*


           var xSixth = d3.scale.ordinal().rangeRoundBands([0,4*NP_width], .1);
           var ySixth = d3.scale.linear().rangeRound([NP_height,0]);

          var stack = d3.layout.stack()
          .values(function (d) { return d.values; })
          .x(function (d) { return xSixth(d.label) + xSixth.rangeBand() / 2; })
          .y(function (d) { return d.value; });

          var area=d3.svg.area()
                   .interpolate("cardinal")
                   .x(function(d){return xSixth(d.label)+xSixth.rangeBand()/2;})
                   .y0(function (d) { return ySixth(d.y0); })
                   .y1(function (d) { return ySixth(d.y0 + d.y); });

          var seriesArr = [], series = {};
          HISTORIALESTADOS.forEach(function(name,i){
                series[name.id]={name:name.id,values:[]};
                seriesArr.push(series[name.id]);
          });

          HISTORIALESTADOS.forEach(function(name,j){
                series[name.id].values.push({name:"Topology",label:name.id,value:name.topology});
                series[name.id].values.push({name:"Dunn",label:name.id,value:name.dunn});
          });


           xSixth.domain(HISTORIALESTADOS.map(function (d) { return d.id; }));


            stack.offset(offset)
            stack(seriesArr);

            ySixth.domain([0, d3.max(seriesArr, function (c) {
                        return d3.max(c.values, function (d) { return d.y0 + d.y; });
                    })]);

                    var color = d3.scale.ordinal()
                   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#001c9c","#101b4d","#475003","#9c8305","#d3c47c",]);


            NPDIV.append("rect")
                    .attr("class","frame")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width",  NP_width )
                    .attr("height", NP_height);

            var selection = NPDIV.selectAll(".series")
                  .data(seriesArr)
                  .enter().append("g")
                  .attr("class", "series");

               selection.append("path")
                  .attr("class", "streamPath")
                  .attr("d", function (d) { return area(d.values); })
                  .style("fill", function (d) { return color(d.name); })
                  .style("stroke", "grey");


                 var points = NPDIV.selectAll(".seriesPoints")
                  .data(seriesArr)
                  .enter().append("g")
                    .attr("class", "seriesPoints");

                 points.selectAll(".point")
                  .data(function (d) { return d.values; })
                  .enter().append("circle")
                   .attr("class", "point")
                   .attr("cx", function (d) { return xSixth(d.label) + xSixth.rangeBand() / 2; })
                   .attr("cy", function (d) { return ySixth(d.y0 + d.y); })
                   .attr("r", "2px")
                   .attr("opacity","0.5")
                   .style("fill",function (d) { return color(d.name); })
                   .on("mouseover", function (d) {
                                 $(this).popover({
                                  title: d.label,
                                  placement: 'auto top',
                                  container: 'body',
                                  trigger: 'manual',
                                  html : true,
                                  content: function() {
                                    return "Attr: " + d.name +
                                           "<br/>Value: " + d3.format(",")(d.value ? d.value.toFixed(4): (d.y1 - d.y0).toFixed(4)); }
                                });
                                $(this).popover('show')
                        })
                           .on("mouseout",  function (d) {$('.popover').each(function() {
                                                              $(this).remove();
                                                            });
                        });

      }
      */
      /*----------------------------------------------------------------------SEPARACION-----------------------------------------*/
      function SplitDimensions(){
                        RefreshCheckBoxTable();
                        restartNewPoints();
                        StarCoordinatesRender();
      }
      function RefreshCheckBoxTable(){
                    var x=document.getElementsByName("checkboxGroup");
                    var valores=new Array();
                    var text="";
                    var ListOfDimensionsAux=new Array();
                    var count=0;
                    var indices=new Array();
                    var indiceNo=new Array();
                    for(i=0;i<x.length;i++){
                        if(x[i].checked){
                            count++;
                            indices.push(i);
                        }else{indiceNo.push(i);}
                    }
                //	GeneralMatrix.rows.forEach(function (d,i) {

                    if(count<MYCONTROLPOINTS[FocusControlPointIndex].valores.length && count>0){ //se asegura que el numero escogido sea menor al total ademas sea positivo

                        osDados.forEach(function(d,i){
                            /*estamos considerando la media*/
                            var promedio=0;
                            indices.forEach(function(ind){ //promedio de todos los marcados
                                promedio=parseFloat(promedio)+parseFloat(GENERALMATRIX.rows[i].valores[parseInt(MYCONTROLPOINTS[FocusControlPointIndex].valores[ind].indice)]);
                            });
                            var promedioNO=0;
                                indiceNo.forEach(function(ind){ //promedio de los no marcados
                                promedioNO=parseFloat(promedioNO)+parseFloat(GENERALMATRIX.rows[i].valores[parseInt(MYCONTROLPOINTS[FocusControlPointIndex].valores[ind].indice)]);
                            });
                        //promedio=parseFloat(promedio/indices.length);
                            d.valores[FocusControlPointIndex]=parseFloat(promedioNO/parseFloat(indiceNo.length));//parseFloat(d.valores[FocusControlPointIndex])-parseFloat(promedio/MYCONTROLPOINTS[FocusControlPointIndex].valores.length);
                            d.valores.push(parseFloat(promedio/parseFloat(indices.length)));
                        });


                        //eliminamos los valores del punto de control
                        var id="";
                        var controlAux=new Array(); var textoAux="";
                        var valor=new Array();
                        var newClor="#ff0000";


                        indices.forEach(function(ind){
                           // id+="|"+MYCONTROLPOINTS[FocusControlPointIndex].valores[ind].text;
                            valor.push(MYCONTROLPOINTS[FocusControlPointIndex].valores[ind]);
                            newClor=ConcatColor(MYCONTROLPOINTS[FocusControlPointIndex].valores[ind].color,newClor);
                        });
                        /*if(indices.length==1){
                            id=id.
                        }else{

                        }*/

                        id= HallarMaximoIndiceGrupos();

                        var color="#ff0000";
                        indiceNo.forEach(function(ind){
                            controlAux.push(MYCONTROLPOINTS[FocusControlPointIndex].valores[ind]);
                            textoAux+=MYCONTROLPOINTS[FocusControlPointIndex].valores[ind].text;
                             color=ConcatColor(MYCONTROLPOINTS[FocusControlPointIndex].valores[ind].color,color);
                        });


                        /*
                        MYCONTROLPOINTS[FocusControlPointIndex].valores.forEach(function(aux,l){
                             if(indices.indexOf(parseInt(l))<0){
                                 console.log(aux);
                                 controlAux.push(aux);
                                 textoAux+=aux.text;
                                 color=ConcatColor(aux.color,color);
                             }
                        });*/
                        //Actualizamos el nuevo Arreglo;
                        MYCONTROLPOINTS[FocusControlPointIndex].valores=controlAux;


                       // MYCONTROLPOINTS[FocusControlPointIndex].id=textoAux;
                       // MYCONTROLPOINTS[FocusControlPointIndex].text=textoAux;

                        MYCONTROLPOINTS[FocusControlPointIndex].color=color;



                        MYCONTROLPOINTS.push({"id":"Group_"+id,"text":"Group_"+id,"valores":valor,"x":0,"y":0,"color":newClor});
                        //refreshControlPoints();
                        //FALTA ACTUALIZAR LOS GRUPOS


                    }
                    clearTable("myTableGroup");
                    FocusControlPointIndex=-1;
      }

         function restartNewPoints(){
                            LISTOFDIMENSIONS=new Array();
                            ListOfGroupsOfDimensions=new Array();

                            MYCONTROLPOINTS.forEach(function(d){
                                if(d.valores.length==1){
                                    var myindex=-1;

                                    ListOfGroupsOfDimensions.forEach(function(g,k){
                                        g.valores.forEach(function(g1){if(d.valores[0].indice==g1.indice)
                                                myindex=k;
                                            });
                                    });

                                    if(myindex==-1){
                                        d.valores[0];
                                          var vi=[{"indice":d.valores[0].indice,"text":d.text,"color":d.valores[0].color}];

                                          LISTOFDIMENSIONS.push({"indice":d.valores[0].indice,"text":d.text,"valores":vi,"color":d.valores[0].color});
                                    }
                                }else{
                                    if(d.valores.length>1){
                                    ListOfGroupsOfDimensions.push({"indice":d.text,"text":d.text,"valores":d.valores,"color":d.color});
                                    }
                                }
                            });

                            llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");
                            llenar_CheckBox(ListOfGroupsOfDimensions,"myTableLeft","ATTRIBUTES2","checkbox2");
                             llenar_CheckBox(ListOfRemovedDimensions,"myTableRemoved","Removed","checkboxRemoved");
                        }

       /*******************************************************************************/
       function InsertDeletedDimensionsMain(){
                InsertDeletedDimensions();
                restartNewPoints();
                StarCoordinatesRender();
       }
       function InsertDeletedDimensions(){
                    var x=document.getElementsByName("checkboxRemoved");
                        var valores=new Array();
                        var text="";
                        var ListOfDimensionsRemovedAux=new Array();
                        var count=0;
                        var indices=new Array();
                        var valoresDeleted=new Array();
                        for(i=0;i<x.length;i++){
                            if(x[i].checked){
                                count++;
                                indices.push(i);
                                valoresDeleted.push(ListOfRemovedDimensions[i]);

                            }else{
                                ListOfDimensionsRemovedAux.push(ListOfRemovedDimensions[i]);
                            }
                        }
                    //	GENERALMATRIX.rows.forEach(function (d,i) {
                        if(count>0){
                            osDados.forEach(function(d,i){
                                /*															estamos considerando la media*/
                                var promedio=0;
                                valoresDeleted.forEach(function(val){
                                    promedio=parseFloat(promedio)+parseFloat(GENERALMATRIX.rows[i].valores[parseInt(val.indice)]);
                                });
                                d.valores.push(parseFloat(promedio/parseFloat(indices.length)));
                            });
                            //eliminamos los valores del punto de control
                            var id="Group_"+HallarMaximoIndiceGrupos();
                            var newColor="#fff";
                            valoresDeleted.forEach(function(ind){
                               // id+="|"+ind.text;
                                newColor=ConcatColor(ind.color,newColor);
                            });

                            MYCONTROLPOINTS.push({"id":id,"text":id,"valores":valoresDeleted,"x":0,"y":0,"color":newColor});


                        }
                        //clearTable("myTableRemoved");
                        ListOfRemovedDimensions=ListOfDimensionsRemovedAux;
                        llenar_CheckBox(ListOfRemovedDimensions,"myTableRemoved","Removed","checkboxRemoved");
                }


    /***********************************************************MOVIMIENTOS LEFT RIGHT*********************************************/
    function moveRight(){
            //recuperamos los objetos con ese nombre
            var x=document.getElementsByName("checkbox");
            var valores=new Array();
            var text="";
            var ListOfDimensionsAux=new Array();
            var count=0;
            for(i=0;i<x.length;i++){
                if(x[i].checked){
                    //valores.push({"indice":x[i].id,"text":x[i].value});
                    valores.push(LISTOFDIMENSIONS[i]);
                    text+="|"+x[i].value;
                    //ListOfDimensions.splice(i,1);
                    count++;
                }
                else
                {
                    ListOfDimensionsAux.push(LISTOFDIMENSIONS[i]);
                }
            }
            LISTOFDIMENSIONS=ListOfDimensionsAux;
            if(count>0){
            var color=valores[0].color;
            valores.forEach(function(d){
                color=ConcatColor(color,d.color)
            });

            var id=HallarMaximoIndiceGrupos();
            ListOfGroupsOfDimensions.push({"indice":"Group_"+id,"text":"Group_"+id,"valores":valores,"color":color});}
            llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");
            llenar_CheckBox(ListOfGroupsOfDimensions,"myTableLeft","ATTRIBUTES2","checkbox2");

          var misGrupos=new Array()
           misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial
           MYCONTROLPOINTS=new Array();
           MYCONTROLPOINTS=distribucion(1,misGrupos); //Distribucion inicial de los puntos de control
           StarCoordinatesRender();
    }

    function moveLeft(){
        var x=document.getElementsByName("checkbox2");
        var ListOfGroupsOfDimensionsAux=new Array();

        for(i=0;i<x.length;i++){
            if(x[i].checked){
                var valores=ListOfGroupsOfDimensions[i].valores;

                valores.forEach(function(d){
                    LISTOFDIMENSIONS.push(d);
                })
                //ListOfGroupsOfDimensions.splice(i,1);
            }else{
                ListOfGroupsOfDimensionsAux.push(ListOfGroupsOfDimensions[i]);
            }
        }
        ListOfGroupsOfDimensions=new Array();
        ListOfGroupsOfDimensions=ListOfGroupsOfDimensionsAux;
        llenar_CheckBox(LISTOFDIMENSIONS,"myTable","ATTRIBUTES","checkbox");
        llenar_CheckBox(ListOfGroupsOfDimensions,"myTableLeft","ATTRIBUTES2","checkbox2");
        //if(osDados.length>0){
         // StarCoordinatesFunction(false);
    //	}

        var misGrupos=new Array()
               misGrupos=misGrupos.concat(LISTOFDIMENSIONS,ListOfGroupsOfDimensions); //cinjunto de puntos de control inicial
               MYCONTROLPOINTS=new Array();
               MYCONTROLPOINTS=distribucion(1,misGrupos); //Distribucion inicial de los puntos de control
               StarCoordinatesRender();
    }
    /*------------------------------------------------------------------------------------------------------------------------------*/

    function ChargeDetailTable(){
        var id=["id"];
        var titulo=id.concat(GENERALMATRIX.attributes,["clase"]);
        var matrix=new Array();

        osDados.forEach(function(d,i){
            if(d.drag==1){
            var id=[d.id];
            var myArray=id.concat(GENERALMATRIX.rows[i].toArray(),[d.klasses]);
            matrix.push(myArray);
            }
        })

        chargeTable(titulo,matrix,"tableDetail");
    }