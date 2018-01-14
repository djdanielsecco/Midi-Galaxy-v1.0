'use strict';

var bb,
	divLog12 = document.getElementById('con14'),
	divLog13 = document.getElementById('con15');

function myFunction(aas) {
	bb = aas;
	console.log('oooooooiiii' + bb);
	return bb;
} 


(function (window, document, undefined) {


	var notes, midi, currentInput,  zeca;

	function onMidiMessage(msg) {
		var action = isNoteOffMessage(msg) ? 'remove' : isNoteOnMessage(msg) ? 'add' : null,
			noteDiv;

		if (action && (noteDiv = getNoteDiv(msg))) {
			noteDiv.classList[action]('piano-key-pressed');

			console.log('oi   ' + msg.currentTarget.manufacturer + noteDiv);
		}
	}

	var MIDI_A0_NUM = 33;

	function getNoteDiv(msg) {
		var noteNum = getMessageNote(msg) - MIDI_A0_NUM;

		if (notes && 0 <= noteNum && noteNum < notes.length) {
			zeca = notes[noteNum];
			console.log(noteNum + '  a  ' + zeca.dataset.note);
			return notes[noteNum];
		}
	}

	var CMD_NOTE_ON = 9;
	var CMD_NOTE_OFF = 8;

	function isNoteOnMessage(msg) {
		return getMessageCommand(msg) == CMD_NOTE_ON;
		console.log('oiee');
	}

	function isNoteOffMessage(msg) {
		var cmd = getMessageCommand(msg);
		return cmd == CMD_NOTE_OFF || cmd == CMD_NOTE_ON && getMessageVelocity(msg) == 0;

		console.log(cmd);
	}

	function getMessageCommand(msg) {
		return msg.data[0] >> 4;
	}

	function getMessageNote(msg) {
		return msg.data[1];
	}

	function getMessageVelocity(msg) {
		return msg.data[2];
	}

	function selectInput(input) {
		if (input != currentInput) {
			if (currentInput) {
				currentInput.removeEventListener('midimessage', onMidiMessage);
				currentInput.close();
			}

			input.addEventListener('midimessage', onMidiMessage);
			currentInput = input;
		}
	}

	function populateInputList() {
		var inputs = Array.from(midi.inputs.values());
		var outputs = Array.from(midi.outputs.values());
outlist = outputs
		if (inputs.length > 1) {
			selectInput(inputs[MidiInKey1]);
		} else {
			// TODO: handle multiple MIDI inputs
			selectInput(inputs[MidiInKey1]);
		}
	}
	rep1 = function () {
		populateInputList();
	}

	function onMIDIAccessSuccess(access) {
		midi = access;
		access.addEventListener('statechange', populateInputList, false);
		populateInputList();
		
		var inputs = midi.inputs;

		inputs.forEach(function (port) {
			console.log('is2222', port.name, port.id, port.state, port.connection);

		});
	}

	function onMIDIAccessFail() {
		console.error('Request for MIDI access was denied!');
	}

	if ('requestMIDIAccess' in window.navigator) {
		window.navigator.requestMIDIAccess({
			sysex: true
		}).then(onMIDIAccessSuccess, onMIDIAccessFail);
	} else {
		console.error('Your device doesn\' support WebMIDI or its polyfill');
		
		
		
		
	}
	
/*	document.getElementById("piui").addEventListener('input', function () {
	var oiuyt = document.activeElement;
		console.log(oiuyt + '<------------------');
	
	
	},false);*/
	
    var ddd1 = document.getElementById("piui");
	ddd1.addEventListener("mousedown", function () {
	var	peps;
	var	tarima1 = document.getElementsByClassName('piano-key');
		peps = tarima1[bb].dataset.note;
		divLog12.innerHTML = "noteon  " + peps + '<br>' + divLog12.innerHTML;
		console.log('noteon  ' + peps);
		WebMidi.outputs[seloutportvirtual].playNote(peps,seloutportvirtual1);
peps=null;
	}, false);
	
	
	ddd1.addEventListener("mouseup", function () {
		var	torts ;
	var	tarima1 = document.getElementsByClassName('piano-key');
		torts = tarima1[bb].dataset.note;
		divLog12.innerHTML = "noteoff  " + torts + '<br>' + divLog12.innerHTML;
		console.log('noteoff  ' + torts);
		WebMidi.outputs[seloutportvirtual].stopNote(torts,seloutportvirtual1);
	torts = null;
		}, false);

	document.addEventListener('DOMContentLoaded', function () {
		notes = document.getElementsByClassName('piano-key');
	}, false);
	
})(window, window.document);
