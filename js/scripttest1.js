/*
Escopo Global
*/
'use strict'
var HTm = document.getElementById('geral1');
var listkeyssel = document.getElementById('keysel');
var LISTCHANKEY = document.getElementById('chansel');
var faderLiveCC = document.getElementById('con15');
var faderLiveDATA = document.getElementById('con16');
var faderLiveCHN = document.getElementById('con17');
var divdevices = []; // divisoes para o css
var Selectss = []; // Select Ports
var SelectssCC = []; // Select CC
var SelectssCH = []; // Select channel
var CreFaders = []; // Faders
var optiosss = []; // Options Port
var conTro = []; // Options CC
var optchannels = []; // option chanels
var ploc = []; // array das div dos controles
var findlist = []; // addlistner
var getglobPort = 0;
var getblobCC = 74;
var getGlobControlr = 0;
var getGlobCha = [1];
var devicesInfPor = [];
var devicesInfcc = [];
var devicesInfComan = [];
var devicesInfcha = [];
var checkboxes, checkaudio = true;
/////////////////////////////////////////////////////////////////////
function CreateSell(Dorph) {
	ShowOutPortlist();
	CreateCC();
	CreatChanel();
	creatDIV(Dorph);
	creatFaders(Dorph);
	for (var i = 0; i < Dorph; i++) {

		Selectss[i] = '<select id="' + 'selportPort' + i + ' "  class="form-control-sm">' + optiosss + '</select>';

		SelectssCC[i] = '<select id="' + 'selCC' + i + ' "  class="form-control-sm">' + conTro + '</select>';

		SelectssCH[i] = '<select id="' + 'chid' + i + ' "  class="form-control-sm">' + optchannels + '</select>';

	};

}
/////////////////////////////////////////////////////////////////////
function ShowOutPortlist() {
	outlist.forEach(function (port, i) {

		optiosss += '<option  value="' + i + '"class="' + 'Oport' + i + ' portcla ">' + port.name + '</option>';
	});
	console.log(optiosss);
	return optiosss;
}
/////////////////////////////////////////////////////////////////////
function creatDIV(NdiV) {
	for (var i = 0; i < NdiV; i++) {
		divdevices[i] = '<div id="' + 'div' + i + ' " class="' + 'devi-' + i + ' clasize "></div>';

	}

	console.log(divdevices);
	return divdevices;
}
/////////////////////////////////////////////////////////////////////
function creatFaders(Nfad) {
	for (var i = 0; i < Nfad; i++) {

		CreFaders[i] = '<input id="' + 'fd' + i + ' "  type="range"  min="0" max="127" step="1"  class="faders1" data-ind="' + i + '">';
	}
	console.log(CreFaders);
	return CreFaders;
}


/////////////////////////////////////////////////////////////////////
function CreateCC() {
	for (var i = 1; i <= 127; i++) {

		conTro += '<option value="' + i + '"class="' + 'Occ' + i + ' cccla ">' + 'CC Number: ' + i + '</option>';

	}
	console.log(conTro);
	return conTro;
}
/////////////////////////////////////////////////////////////////////
function CreatChanel() {
	for (var i = 1; i <= 16; i++) {

		optchannels += '<option value="' + i + '"class="' + 'Och' + i + ' chcla ">' + 'Channel:  ' + i + '</option>';

	}
	console.log(optchannels);
	return optchannels;
}
/////////////////////////////////////////////////////////////////////

function CreateControles(numeControles) {
	CreateSell(numeControles);
	for (var i = 0; i < numeControles; i++) {
		HTm.innerHTML += divdevices[i];

		ploc[i] = document.getElementById('div' + i + ' ');
		ploc[i].innerHTML = Selectss[i] +
			SelectssCC[i] + SelectssCH[i] + CreFaders[i];
	};
listkeyssel.innerHTML += optiosss;
LISTCHANKEY.innerHTML += optchannels;
}
/////////////////////////////////////////////////////////////////////


function listFader() {
	var test1 = [];

	for (var i = 0; i < CreFaders.length; i++) {

		//////////////////


		Selectss[i] = document.getElementById('selportPort' + i + ' ');
		SelectssCH[i] = document.getElementById('chid' + i + ' ');
		SelectssCC[i] = document.getElementById('selCC' + i + ' ');
		CreFaders[i] = document.getElementById('fd' + i + ' ');



		////////////////


		CreFaders[i].addEventListener('input', function () {

//sho();
			/*findlist = document.activeElement;
			getGlobControlr = findlist;*/
			var popo = this.dataset.ind;
			console.log(this.dataset.ind + '   ' + this.value);
			WebMidi.outputs[devicesInfPor[popo]].sendControlChange(Number(devicesInfcc[popo]), this.value, devicesInfcha[popo]);
			
			/*CreateMidiMensage(getglobPort, getblobCC, getGlobControlr, getGlobCha);*/
		
			faderLiveDATA.innerHTML = "DATA2: " + this.value + '<br>' + faderLiveDATA.innerHTML;
				faderLiveCC.innerHTML = "CC: " + devicesInfcc[popo] + '<br>' + faderLiveCC.innerHTML;
			faderLiveCHN.innerHTML = "CH: " + devicesInfcha[popo] + '<br>' + faderLiveCHN.innerHTML;
			return getGlobControlr;


		}, false);


		////////



		Selectss[i].addEventListener('input', function () {


			var portgr = document.activeElement;

			getglobPort = portgr;
			//console.log(portgr.value + '   ' + portgr.id + portgr.innerText);
			sho();
			return getglobPort;


		}, false);

		//////////


		SelectssCC[i].addEventListener('input', function () {


			var cccc = document.activeElement;
			getblobCC = cccc;
			console.log(cccc.value + '   ' + cccc.id);
			sho();
			
			return getblobCC;


		}, false);



		//////////


		SelectssCH[i].addEventListener('input', function () {
			var cha = document.activeElement;
			getGlobCha = cha;
			//console.log(cha.value + '   ' + cha.id);
			sho();
			return getGlobCha;
		}, false);
	}

	Getdata();
	tarima();
	tarima2();
	
}

/////////////////////////////////////////////////////////////////////
function tarima(){
listkeyssel.addEventListener('input', function () {
	var keysselc =  document.activeElement;
	
		
seloutportvirtual = keysselc.value;
			console.log(seloutportvirtual + '  porta virtual');
		return seloutportvirtual;
	
	},false);

	/*checkboxes = document.getElementById('checkbox6');
		
			
			checkboxes.addEventListener('change', function(){
				
	
			var tatata1 = document.activeElement;
				checkaudio = tatata1.checked;
			console.log(checkboxes.checked);
			return checkaudio;
			}, false);*/
		

}


function tarima2(){
LISTCHANKEY.addEventListener('input', function () {
	var TREWS =  document.activeElement;
	
		
seloutportvirtual1 = TREWS.value;
			console.log(seloutportvirtual1 + '  porta virtual');
		return seloutportvirtual1;
	
	},false);


}
/////////////////////////////////////////////////////////////////////

/*

function CreateMidiMensage(getglobPort, getblobCC, getGlobControlr, getGlobCha) {

	console.log(getglobPort.value, getGlobControlr.key, getblobCC.value, getGlobCha.value);







}
*/

////////////////////////////////////////////////////////////////////////////////////


function Getdata() {

	Selectss.forEach(function (currentValue, i) {

		devicesInfPor.push(currentValue.value);




	});
	
	
	//console.log(devicesInfPor);
	
	

	CreFaders.forEach(function (currentValue, i) {

		devicesInfComan.push(currentValue.value);




	});
	//console.log(devicesInfComan);



	SelectssCC.forEach(function (currentValue, i) {

		devicesInfcc.push(currentValue.value);



	});
	//console.log(devicesInfPor);


	SelectssCH.forEach(function (currentValue, i) {

		devicesInfcha.push(currentValue.value);




	});

	//console.log(devicesInfcha);

sho();
	/*devicesInfPor
devicesInfcc
devicesInfComan
devicesInfcha*/
}


/////////////////////////////////////////////////////////////////////

////  lista os estados e valores cos faders


function sho() {
	
	Selectss.forEach(function (currentValue, i) {

		devicesInfPor[i] = currentValue.value;

		


	});

	//console.log(b);
	console.log(devicesInfPor);

	SelectssCC.forEach(function (currentValue, i) {

	devicesInfcc[i] = currentValue.value;




	});

	console.log(devicesInfcc);
	//console.log(devicesInfPor);

	
	CreFaders.forEach(function (currentValue, i) {

	devicesInfComan[i] = currentValue.value;




	});

	console.log(devicesInfComan);
	//console.log(devicesInfPor);


	SelectssCH.forEach(function (currentValue, i) {

		devicesInfcha[i] = currentValue.value;






	});
	console.log(devicesInfcha);
	
	//console.log(devicesInfcha);

}



function LoadFades(){

CreateControles(8);
	if(Selectss.length > 0){
	   
	   listFader();
	   
	   } else {
	   
	   alert("Not Load");
	   }


}





/*
funciona


function listFader() {

	for (var i = 0; i < CreFaders.length; i++) {
		 Selectss[i] = document.getElementById('selportPort' + i + ' ');
		SelectssCH[i] = document.getElementById('chid' + i + ' ');
		SelectssCC[i] = document.getElementById('selCC' + i + ' ');
		CreFaders[i] = document.getElementById('fd' + i + ' ');
		CreFaders[i].addEventListener('input', function () {
			findlist = document.activeElement;

			console.log(findlist.value + '   ' + findlist.id);

		}, false);
		Selectss[i].addEventListener('input', function () {
			var portgr = document.activeElement;

			console.log(portgr.value + '   ' + portgr.id);

		}, false);
		SelectssCC[i].addEventListener('input', function () {
			var cccc = document.activeElement;

			console.log(cccc.value + '   ' + cccc.id);

		}, false);
		SelectssCH[i].addEventListener('input', function () {
			var cha = document.activeElement;

			console.log(cha.value + '   ' + cha.id);

		}, false);
	}


}



function listFader() {

	for (var i = 0; i < CreFaders.length; i++) {
		CreFaders[i] = document.getElementById('fd' + i + ' ');
		CreFaders[i].addEventListener('input', function () {
			findlist = document.activeElement;

			console.log(findlist.value + '   ' + findlist.id);

		}, false);
	}


}





function listFader(){

for(var i=0; i < CreFaders.length; i++){
findlist = document.getElementById('fd' + i + ' ');
findlist.addEventListener('input', function(){
console.log();

},false);
}


}


function adlist(){
	var fadas, find1;
fadas = document.querySelectorAll('.faders1 input[type="range"]');
	
		for (i = 0, maxi = fadas.length; i < maxi; i++) {
			find1 = fadas[i];
			find1.addEventListener('input', function(){
			
			console.log('oioioi--------->');
			
			
			
			}, false);
		}


}






function CreateControles(numeControles){
	CreateSell(numeControles);
	HTm.innerHTML = divdevices[0];
	var ploc = document.getElementById('div0 ' );
	ploc.innerHTML = SelectssCC[0] + Selectss[0]
+ SelectssCH[0] + CreFaders[0];
}

var oeee = String('div' + i)
	ploc = document.getElementById(oeee);
	ploc.innerHTML = SelectssCC[i] + Selectss[i]
+ SelectssCH[i] + CreFaders[i];



*/
