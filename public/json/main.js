$(document).ready(function(){
	$("#add-car").click(function(){
		$(".table-car").hide(100);
		$(".form-car").show(100);
		$("#section-1").show(100);
		$(".add-object").hide(100);
	   	$.ajax({ 
	   		type: 'GET', 
	   		url: 'json/Carros.json', 
	   		dataType: 'json',
	   		success: function (data) {
	   				 var array =data[1].marca;
	   				 
	   			for (var i = 0; i < array.length; i++) {
	   					$("#career-list").append("<option value="+ array[i] +">" + array[i] + "</option>");
	   				};	

	   			 
	   		},
	   		error:function(msg) {
	   			// body...
	   			console.log(msg+":P");
	   		}
	   	});
	   	$.ajax({ 
	   		type: 'GET', 
	   		url: 'json/estilo.json', 
	   		dataType: 'json',
	   		success: function (data) {
	   				 var array =data[1].estilo;
	   			for (var i = 0; i < array.length; i++) {
	   					$("#style-car").append("<option value="+ array[i] +">" + array[i] + "</option>");
	   				};	

	   			 
	   		},
	   		error:function(msg) {
	   			// body...
	   			console.log(msg+":P");
	   		}
	   	});
	   	$.ajax({ 
	   		type: 'GET', 
	   		url: 'json/ano.json', 
	   		dataType: 'json',
	   		success: function (data) {
	   				 var array =data[1].ano;
	   			for (var i = 0; i < array.length; i++) {
	   					$("#ano-car").append("<option value="+ array[i] +">" + array[i] + "</option>");
	   				};	

	   			 
	   		},
	   		error:function(msg) {
	   			// body...
	   			console.log(msg+":P");
	   		}
	   	});
	   	$.ajax({ 
	   		type: 'GET', 
	   		url: 'json/Puertas.json', 
	   		dataType: 'json',
	   		success: function (data) {
	   				 var array =data[1].puertas;
	   			for (var i = 0; i < array.length; i++) {
	   					$("#door-car").append("<option value="+ array[i]+">" + array[i] + "</option>");
	   				};	

	   			 
	   		},
	   		error:function(msg) {
	   			// body...
	   			console.log(msg+":P");
	   		}
	   	});
	});
	$("#form-date").click(function(){
			demo.initChartist();
        	
        	$.notify({
            	icon: 'pe-7s-gift',
            	message: "<b>Ahora suba las fotos</b>"
            	
            },{
                type: 'info',
                timer: 4000
            });
            $.notify({
            	icon: 'pe-7s-gift',
            	message: "<b>Recuerde que son necesarias para la publicación del auto</b>"
            	
            },{
                type: 'danger',
                timer: 4000
            });
		$("#form-car").show(100);
		$("#form-car2").show(100);
		$("#section-1").hide(100);
	});
	$('.btnCarRemove').click(function(){
    var dataId = this.id;
	var clase = "."+dataId;
		$.ajax({
    		type    : 'get',
    		url     : '/destroy/' + dataId,
    		success : function(response) {
		    	if ( response === 'error' ) {
	           		alert('crap!');
	       		} else if (response === 'success' ) {
	          		demo.initChartist();
	          		 $(clase).remove();    	
		        	$.notify({
		            	icon: 'pe-7s-gift',
		            	message: "<b>Objeto Eliminado</b>"
		            	
		            },{
		                type: 'info',
		                timer: 4000
		            })
	          		 ;
	          	}

    		}
		});
	});
	$(".123").click(function(){
		alert();
	});
		
	
		

	
});
var countries = [
   { value: 'Verde', data: 'VE' },
   { value: 'Rojo', data: 'RO' },
   { value: 'Violeta', data: 'VI' },
   { value: 'Amarillo', data: 'AM' },
   { value: 'Azul', data: 'AZ' },
   { value: 'Negro', data: 'NE' },
   { value: 'Blanco', data: 'BL' },
   { value: 'Naranja', data: 'NA' },
   { value: 'Beige', data: 'BE' },
   { value: 'Gris', data: 'GR' },
   { value: 'Cafe', data: 'CA' },
   { value: 'Rosado', data: 'RO' },
   { value: 'Plata', data: 'Pl' },
];

$('#color-front').autocomplete({
    lookup: countries,
    onSelect: function (suggestion) {
    }
});
$('#color-back').autocomplete({
    lookup: countries,
    onSelect: function (suggestion) {
    }
});
