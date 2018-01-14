var htmm, htmm1, htmm2, cotr1 = 0,
	chh1 = 1,
	pf1 = 2,
	dat1 = 74,
	jpjp, poiu, jpjp1,
	
	seleclist = document.getElementById('port1'),
	seleclist1 = document.getElementById('cc1'),
	seleclist2 = document.getElementById('chann'),
	
	seleclist3 = document.getElementById('port2'),
	seleclist4 = document.getElementById('cc2'),
	seleclist5 = document.getElementById('chann2'),
	
	seleclist6 = document.getElementById('port3'),
	seleclist7 = document.getElementById('cc3'),
	seleclist8 = document.getElementById('chann3'),
	
	seleclist9 = document.getElementById('port4'),
	seleclist10 = document.getElementById('cc4'),
	seleclist11 = document.getElementById('chann4');


function myFunction1() {

	'use strict'
	WebMidi.enable();
	outlist.forEach(function (port) {
		htmm += '<option>' + port.name + '</option>';

	});
	seleclist.innerHTML = htmm;
	seleclist3.innerHTML = htmm;
	seleclist6.innerHTML = htmm;
	seleclist9.innerHTML = htmm;
	
	for (var i = 1; i <= 16; i++) {

		htmm2 += '<option value="' + i + ' ">' + 'cha' + i + '</option>';
	}
	
	seleclist2.innerHTML = htmm2;
	seleclist5.innerHTML = htmm2;
	seleclist8.innerHTML = htmm2;
	seleclist11.innerHTML = htmm2;
	for (var i = 2; i <= 127; i++) {

		htmm1 += '<option>' + i + '</option>';
	}
	seleclist1.innerHTML = htmm1;
	seleclist4.innerHTML = htmm1;
	seleclist7.innerHTML = htmm1;
	seleclist10.innerHTML = htmm1;


	// document.getElementById("jj").onclick = function() {
	//     dat1= document.getElementById("jj").value;
	//     console.log(dat1);
	//   
	// }

}
var trtre = document.getElementById('jj');
trtre.addEventListener('input', function () {
	cotr1 = document.getElementById('jj').value;
	send1(dat1, cotr1, pf1, chh1);
	console.log(cotr1 + 'oooooooo');

}, true);


var xxx1 = document.getElementById('cc1');
xxx1.onchange = function () {
	jpjp = document.getElementById('cc1').value;
	dat1 = Number(jpjp);

	console.log(dat1);
	return dat1;

}
var xxx2 = document.getElementById("chann");
xxx2.onchange = function () {
	jpjp1 = xxx2.value;
	chh1 = jpjp1;

	console.log(chh1);
	//return chh1;

}


function send1(dat1, cotr1, pf1, chh1) {

	WebMidi.outputs[pf1].sendControlChange(dat1, cotr1, chh1);

}
// Close the dropdown menu if the user clicks outside of it
