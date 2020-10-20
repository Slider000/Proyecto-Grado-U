 // Codigo del TTS
 var txtInput = document.querySelector('#txtInput');
 var voiceList = document.querySelector('#voiceList');
 var btnSpeak = document.querySelector('#btnSpeak');
 // llamamos el objeto window que contiene todos los metodos y propiedades del navegador
 // llamamos el objeto speechSynthesis que nos sirve para llamar la propiedad de voz de google 
 // para que pueda hablar y escuchar lo que se le escribe 
 // speechSynthesis se usa para obtener informacion sobre las voces sintetizadas y disponibles en el dispositivo
 var tts = window.speechSynthesis;
 // creacion del array para obtener y mostrar todas las voces disponibles
 var voices = [];

 //validacion: si las voces estan disponibles entonces traigamelas
 if(speechSynthesis !== undefined){
     speechSynthesis.onvoiceschanged = getVoices;
 }

 // boton de hablar ejecutese cuando le click
    async  function btnHablar(tempNumber) {
     // SpeechSynthesisUtterance sirve para leer la informacion que digito en el input
     var toSpeak = await new SpeechSynthesisUtterance(`puede ser ${tempNumber}`);
     // me selecciona una opcion de la lista segun su nombre 
     var selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
     // ciclo para saber que voz seleccione
     voices.forEach((voice)=>{
         if(voice.name === selectedVoiceName){
             toSpeak.voice = voice;
         }
     });

     //llamado de la variable para que me ejecute la voz que seleccione
     tts.speak(toSpeak);

     console.log(toSpeak);
 }

 // funcion para obtener las voces
 function getVoices(){
     voices = tts.getVoices();
     var selectedIndex = voiceList.selectedIndex < 0 ? 0 : voiceList.selectedIndex;
     voiceList.innerHTML = '';

     // ciclo para que me aparescan en lista todas las voces disponibles por su nombre y lenguaje
     voices.forEach((voice)=>{
         var listItem = document.createElement('option');
         listItem.textContent = voice.name;
         listItem.setAttribute('data-lang', voice.lang);
         listItem.setAttribute('data-name', voice.name);
         voiceList.appendChild(listItem);
     });

     voiceList.selectedIndex = selectedIndex;
 }

     // Codigo del core de los numero
     var pm = new PerceptronMulticapas();
     var analize = new ImageAnalize();
     analize.crossOrigin = "Anonymous";

     var inputs = [];

     $(document).ready(function(){
         var total = 0;
         var count = 0;

         $('.scream').each(function(){
             total++;
         });

         $('.scream').one("load", function() {
             count++;
             if(count === total){
                 inicialize();
             }
         }).each(function() {
             if(this.complete) {
                 $(this).load();

             }
         });
     });

     function inicialize(){
         //cantidad de cuadros a analizar de las imagenes. Cuanto más cuadros más precisa es la detección
         var framesCount = 10;

         //inicializamos el objeto indicando la cantidad de cuadros a analizar
         analize.init(framesCount);

         //obtenemos las entradas de las imagenes para enviar al perceptron y que este aprenda de estos datos
         inputs = analize.get("myCanvas", "scream");

         var lienzo = new Lienzo();
         lienzo.init("perceptronPaint");

         document.getElementById("perceptronPaint").onmouseup = function (e){
             lienzo.generateThumbnail(function(){
                 var input = analize.get("perceptronPaint", "", 0);

                 $('#perceptron_status').html("Procesando ...");
                 setTimeout(function(){
                     predic(input);
                 },100);
             });
         };
     }

     function predic(values){
         var tempNumber = 0;
         var tempMaxValue = 0;

         var tasa_aprendizaje = parseFloat($('#perceptron_tasa_aprendizaje').val());
         var error_deseado = parseFloat($('#perceptron_error_deseado').val());
         var epocas = parseInt($('#perceptron_epocas').val());            

         var out = [];
         var i = 0;
         for(var i=0; i < 9; i++){
             for(var n=0; n < inputs.length; n++){
                 if(inputs[n].id !== i){
                     inputs[n].out[0] = 0;
                 }else{
                     inputs[n].out[0] = 1;
                 }
                 if(inputs[n].main === 1 || (inputs[n].main === 0 && inputs[n].id === i)){
                     out.push(inputs[n]);
                 }
             }

             pm.init(inputs, tasa_aprendizaje, error_deseado, -0.25, 0.25, epocas);

             var val = pm.predic(values);
             $("#result_" + i).html(val);
             $("#acierto_" + i).html(parseInt(val*100) + " %");
         }
         for(var i=0; i < 9; i++){
             var v = parseFloat($("#result_" + i).html());
             $("#result_" + i).parents("tr").removeClass("table-success");
             if(v > tempMaxValue){
                 tempMaxValue = v;
                 tempNumber = i;
             }
         }
         $("#result_" + tempNumber).parents("tr").addClass("table-success");
         $('#perceptron_status').html("Proceso completado");
        //llamado de la funcion getVoices
         btnHablar(tempNumber);
 }
        getVoices();
