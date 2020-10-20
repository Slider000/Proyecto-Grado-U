 // Codigo del TTS
 var voiceList = document.querySelector('#voiceList');
 var data_result = document.querySelector('#result');
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
    async  function btnHablar(index) {
     // SpeechSynthesisUtterance sirve para leer la informacion que digito en el input
     var toSpeak = await new SpeechSynthesisUtterance("Puede ser el numero " + index);
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

let canvas, c, size, clicked = false, path = [], result, nn;

async function load(){

	let nrequest = await fetch('../public/data/nn.json');
	n = await nrequest.json();

	init();
}

load();

function init(){

	nn = new Dejavu();
	
	nn.load( n );

	canvas = document.querySelector('.canvas');
	size = Math.min(innerWidth, innerHeight);
	canvas.width = size;
	canvas.height = size;
	c = canvas.getContext('2d');
	
	c.fillStyle = "white";
	c.fillRect(0,0,size,size);
	c.fillStyle = "black";

	// const main = document.getElementById('main');
	// main.innerHTML = "";

	// const left = document.createElement('div');
	// left.id = "left";
	// const right = document.document.querySelector('#right');

	//Botones para la prediccion y limpiar el canvas
	
	// const predictBtn = document.createElement('button');
	// predictBtn.innerText = "Predict";
	// predictBtn.addEventListener('click', predict );
	
	// const clear = document.createElement('button');
	// clear.innerText = "Clear";
	// clear.addEventListener('click', function(){
	// 	erase();
	// });

	// result = document.createElement('strong');
	// result.innerHTML = "<br>";

	// right.appendChild(predictBtn);
	// right.appendChild(clear);
	// right.appendChild(result);
	
	

	// left.appendChild( canvas );

	// main.appendChild(left);
	// main.appendChild(right);
	// document.body.appendChild(main);

	canvas.addEventListener('mouseup', function(){
		clicked = false;
		path = [];
	});

	canvas.addEventListener('mousedown', function(e){
		clicked = true;
		drawPoint( getPos(e) );
	});

	canvas.addEventListener('touchstart', function(e){
		drawPoint( getPos(e) );
	});

	canvas.addEventListener('touchmove', function(e){ 
		drawLine( getPos(e) );
	});

	canvas.addEventListener('mousemove', function(e){
		if( clicked )
			drawLine( getPos(e) );
	});

	canvas.addEventListener('touchend', function(e){
		path = [];
	});

}

function predict(){

	let img = new Image();
	img.src = canvas.toDataURL();
	img.onload = function(){
		let tmpCanvas = document.createElement('canvas');
		tmpCanvas.width = 28;
		tmpCanvas.height = 28;
		let cT = tmpCanvas.getContext('2d');
		cT.drawImage(img,0,0,28,28);
		let resizedImg = cT.getImageData(0,0,28,28);
		let finalData = Array(28*28);
		for(let i = 0; i < finalData.length; i++){
			finalData[i] = (255-resizedImg.data[ i * 4 ])/255;
		}
		let res = nn.predict( finalData ).data;
		let _min = -Infinity;
		let index = -1;
		for(let i = 0; i < res.length; i++){
			if( res[i] > _min ){
				_min = res[i];
				index = i;
			}
		}

		console.log(index);
		
		btnHablar(index);	
	}

}

getVoices();

const getPos = function(e){
	e.preventDefault();
	
	let x, y;
	let rect = canvas.getBoundingClientRect();
	
	const _x = canvas.width/rect.width,
				_y = canvas.height/rect.height;
	
	if( e.touches ){
		x = (e.targetTouches[0].pageX - rect.left) * _x;
		y = (e.targetTouches[0].pageY - rect.top) * _y;
	}else{
		x = e.offsetX * _x;
		y = e.offsetY * _y;
	}
	return {x, y};
}

const drawLine = function(p){
	
	path.push( {x: p.x, y: p.y} );

	if (path.length > 1) {
	  c.beginPath();
	  c.lineWidth = size/28 * 3;
	  c.lineCap = "round";
	  c.moveTo(path[path.length - 2].x, path[path.length - 2].y);
	  c.lineTo(path[path.length - 1].x, path[path.length - 1].y);
	  c.stroke();
	  path.shift();
	} 
  
}

const drawPoint = function(p){
	if( !path.length ){
		path.push( {x: p.x, y: p.y} );
		c.beginPath();
		c.arc(p.x, p.y, (size/28 * 3)/2, 0, Math.PI*2);
		c.fill();
	}
}

function erase(){
	c.fillStyle = "white";
	c.fillRect(0,0,size,size);
	c.fillStyle = "black";
	// result.innerHTML = "<br>";
}

function prediccion(index){
	var predict = document.getElementById('predict');
	predict.innerHTML = "<strong>La prediccion fue el #: "+index+"</strong>" ;

}


