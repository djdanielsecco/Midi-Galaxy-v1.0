window.onload = 
	
function () {

	'use strict';

	var
		divLog = document.getElementById('con2'),
		divLog1 = document.getElementById('con3'),
		divLog2 = document.getElementById('con4'),
		divLog3 = document.getElementById('con5'),
		divLog4 = document.getElementById('con6'),
		divLog5 = document.getElementById('con7'),
		divLog6 = document.getElementById('con8'),
		divLog7 = document.getElementById('con9'),
		divLog8 = document.getElementById('con10'),
		divLog9 = document.getElementById('con11'),
		divLog10 = document.getElementById('con12'),
		divLog11 = document.getElementById('con13'),
		
		divInputs = document.getElementById('inputs'),
		divOutputs = document.getElementById('outputs'),
		midiAccess,
		checkboxMIDIInOnChange,
		checkboxMIDIOutOnChange,
		activeInputs = {},
		activeOutputs = {};
	
/*	var context = new AudioContext(),*/
	var 	oscillators = {};

var AudioContext = window.AudioContext // Default
    || window.webkitAudioContext // Safari and old versions of Chrome
    || false; 

if (AudioContext) {
    // Do whatever you want using the Web Audio API
    var context = new AudioContext;
    // ...
} else {
    // Web Audio API is not supported
    // Alert the user
    alert("Sorry, but the Web Audio API is not supported by your browser. Please, consider upgrading to the latest version or downloading Google Chrome or Mozilla Firefox");
}
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	
	if (navigator.requestMIDIAccess !== undefined) {
		navigator.requestMIDIAccess({
			sysex: true
		})
			
			
		.then(

			function onFulfilled(access) {
				midiAccess = access;

				// create list of all currently connected MIDI devices
				showMIDIPorts();
				//CreateControles(8);
			
				LoadFades();
				
//myFunction1();
				// update the device list when devices get connected, disconnected, opened or closed
				midiAccess.onstatechange = function (e) {
					var port = e.port;
					var div = port.type === 'input' ? divInputs : divOutputs;
					var listener = port.type === 'input' ? checkboxMIDIInOnChange : checkboxMIDIOutOnChange;
					var activePorts = port.type === 'input' ? activeInputs : activeOutputs;
					var checkbox = document.getElementById(port.type + port.id);
					var label;

					// device disconnected
					if (port.state === 'disconnected') {
						port.close();
						label = checkbox.parentNode;
						checkbox.nextSibling.nodeValue = port.name + ' (' + port.state + ', ' + port.connection + ')';
						checkbox.disabled = true;
						checkbox.checked = false;
						delete activePorts[port.type + port.id];

						// new device connected
					} else if (checkbox === null) {
						label = document.createElement('label');
						checkbox = document.createElement('input');
						checkbox.type = 'checkbox';
						checkbox.id = port.type + port.id;
						checkbox.addEventListener('change', listener, false);
						label.appendChild(checkbox);
						label.appendChild(document.createTextNode(port.name + ' (' + port.state + ', ' + port.connection + ')'));
						div.appendChild(label);
						div.appendChild(document.createElement('br'));

						// device opened or closed
					} else if (checkbox !== null) {
						label = checkbox.parentNode;
						checkbox.disabled = false;
						checkbox.nextSibling.nodeValue = port.name + ' (' + port.state + ', ' + port.connection + ')';
					}
				};
				
				
			},

			function onRejected(e) {
				divInputs.innerHTML = e.message;
				divOutputs.innerHTML = '';
			}
			
		)
		
		.then(
			
			
			console.log('promisse')
				
		);
			  
	}

	// browsers without WebMIDI API or Jazz plugin
	else {
		divInputs.innerHTML = 'No access to MIDI devices: browser does not support WebMIDI API, please use the WebMIDIAPIShim together with the Jazz plugin';
		divOutputs.innerHTML = '';
	}
	
	
	
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	
	
	
	

	function showMIDIPorts() {
		var
			html,
			checkbox,
			checkboxes,
			inputs, outputs,
			i, maxi;

		inputs = midiAccess.inputs;
		html = '<h4>Midi Inputs:</h4>';
		inputs.forEach(function (port) {
			console.log('in', port.name, port.id, port.state);
			html += '<label><input type="checkbox" class="poplo" id="' + port.type + port.id + '">' + port.name + ' (' + port.state + ', ' + port.connection + ')</label><br>';
		});
		divInputs.innerHTML = html;

		outputs = midiAccess.outputs;

		html = '<h4>Input to Midi Outputs:</h4>';
		outputs.forEach(function (port) {
			//console.log('out', port.name, port.id);
			html += '<label><input type="checkbox" class="poplo" id="' + port.type + port.id + '">' + port.name + ' (' + port.state + ', ' + port.connection + ')</label><br>';
		});
		divOutputs.innerHTML = html;

		checkboxes = document.querySelectorAll('#inputs input[type="checkbox"]');
		for (i = 0, maxi = checkboxes.length; i < maxi; i++) {
			checkbox = checkboxes[i];
			checkbox.addEventListener('change', checkboxMIDIInOnChange, false);
		}

		checkboxes = document.querySelectorAll('#outputs input[type="checkbox"]');
		for (i = 0, maxi = checkboxes.length; i < maxi; i++) {
			checkbox = checkboxes[i];
			checkbox.addEventListener('change', checkboxMIDIOutOnChange, false);
		}
		
	}

	function extractMidiCommand(data) {
		var raw = data[0];
		var cmd = data[0] >> 4;
		var channel = data[0] & 0xf;
		var type = data[0] & 0xf0;
		var data1 = data[1];
		var data2 = data[2];
		var frequency = cmd === 8 || cmd === 9 ? midiNoteToStandardFrequency(data1 - 69) : null;
		var note = cmd === 8 || cmd === 9 ? midiNoteNumberToNote(data1) : null;
		var cmdName = '';
		switch (cmd) {
			case 8:
				cmdName = 'noteOff';
				break;
			case 9:
				cmdName = 'noteOn';
				break;
			case 11:
				cmdName = `${controllerObject[data1]}`;
				break;
			case 12:
				cmdName = `Progam Change`;
				break;
			case 13:
				cmdName = 'AfterTouch';
				break;
			case 14:
				cmdName = 'pitchBend';
				break;
			default:
				cmdName = 'unknown';
		}
		var midiCommand = {
			raw: raw,
			cmd: cmd,
			channel: channel + 1,
			type: type,
			data1: data1,
			data2: data2,
			frequency: frequency,
			note: note,
			cmdName: cmdName,
		};
		return midiCommand;
	}

	function extractMidiRealtime(data) {
		var realtimeMessage = '';
		switch (data[0]) {
			case 240:
				realtimeMessage = 'SYSEX';
				break;
			case 241:
				realtimeMessage = 'timecode';
				break;
			case 242:
				realtimeMessage = 'Song Position';
				break;
			case 243:
				realtimeMessage = 'Songselect';
				break;
			case 246:
				realtimeMessage = 'Tune request';
				break;
			case 247:
				realtimeMessage = 'End of SysEx ';
				break;

			case 248:
				realtimeMessage = 'Clock';
				break;
			case 250:
				realtimeMessage = 'Start';
				break;
			case 251:
				realtimeMessage = 'Continue';
				break;
			case 252:
				realtimeMessage = 'Stop';
				break;
			case 254:
				realtimeMessage = 'ActiveSensing';
				break;
			case 255:
				realtimeMessage = 'SystemReset';
				break;
			default:
				realtimeMessage = 'Udefined';
		}
		return realtimeMessage;
	}

	function midiNoteToStandardFrequency(note) {
		return 440 * Math.pow(2, (note) / 12);
	}

	function midiNoteNumberToNote(noteNumber) {
		var note = `${noteArray[noteNumber % 12]}${Math.floor((noteNumber / 12)-2)}`;
		console.log(note, noteNumber);
		divLog7.innerHTML = note + ' ' + noteNumber + '<br>' + divLog7.innerHTML;
		return note;

	}
	
	const noteArray = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
	
	const controllerObject = {
		'0': 'bankselectcoarse',
		'1': 'modulationwheelcoarse',
		'2': 'breathcontrollercoarse',
		'4': 'footcontrollercoarse',
		'5': 'portamentotimecoarse',
		'6': 'dataentrycoarse',
		'7': 'volumecoarse',
		'8': 'balancecoarse',
		'9': 'Pan',
		'10': 'pancoarse',
		'11': 'expressioncoarse',
		'12': 'effectcontrol1coarse',
		'13': 'effectcontrol2coarse',
		'16': 'generalpurposeslider1',
		'17': 'generalpurposeslider2',
		'18': 'generalpurposeslider3',
		'19': 'generalpurposeslider4',
		'32': 'bankselectfine',
		'33': 'modulationwheelfine',
		'34': 'breathcontrollerfine',
		'36': 'footcontrollerfine',
		'37': 'portamentotimefine',
		'38': 'dataentryfine',
		'39': 'volumefine',
		'40': 'balancefine',
		'42': 'panfine',
		'43': 'expressionfine',
		'44': 'effectcontrol1fine',
		'45': 'effectcontrol2fine',
		'64': 'holdpedal',
		'65': 'portamento',
		'66': 'sustenutopedal',
		'67': 'softpedal',
		'68': 'legatopedal',
		'69': 'hold2pedal',
		'70': 'soundvariation',
		'71': 'resonance',
		'72': 'soundreleasetime',
		'73': 'soundattacktime',
		'74': 'brightness',
		'75': 'soundcontrol6',
		'76': 'soundcontrol7',
		'77': 'soundcontrol8',
		'78': 'soundcontrol9',
		'79': 'soundcontrol10',
		'80': 'generalpurposebutton1',
		'81': 'generalpurposebutton2',
		'82': 'generalpurposebutton3',
		'83': 'generalpurposebutton4',
		'91': 'reverblevel',
		'92': 'tremololevel',
		'93': 'choruslevel',
		'94': 'celestelevel',
		'95': 'phaserlevel',
		'96': 'databuttonincrement',
		'97': 'databuttondecrement',
		'98': 'nonregisteredparametercoarse',
		'99': 'nonregisteredparameterfine',
		'100': 'registercoarse',
		'101': 'registeredparameterfine',
		'120': 'allsoundoff',
		'121': 'resetallcontrollers',
		'122': 'localcontrol',
		'123': 'allnotesoff',
		'124': 'omnimodeoff',
		'125': 'omnimodeon',
		'126': 'monomodeon',
		'127': 'polymodeon'

	}

	function inputListener(midimessageEvent) {

		var frequency = midiNoteToFrequency(midimessageEvent.data[1]);

		var port, portId,
			data = midimessageEvent.data,
			type = data[0],
			data1 = data[1],
			data2 = data[2];
		var tarimai = extractMidiCommand(data);
		// do something graphical with the incoming midi data
		divLog.innerHTML = type + ' ' + data1 + ' ' + data2 + '<br>' + divLog.innerHTML;



		var arr = [];
		for (var i = 0; i < midimessageEvent.data.length; i++) {
			arr.push((midimessageEvent.data[i] < 16 ? '0' : '') + midimessageEvent.data[i].toString(16));
		}
		console.log('MIDI:', arr.join(' '));
		divLog9.innerHTML = arr.join(' ') + '<br>' + divLog9.innerHTML;


		for (portId in activeOutputs) {
			if (activeOutputs.hasOwnProperty(portId)) {
				port = activeOutputs[portId];
				port.send(data);
			}
		}

		if (tarimai.cmd === 9 && midimessageEvent.data[2] > 0 && checkaudio === true) {
			playNote(tarimai.frequency);

		}

		if (tarimai.cmd === 8 || midimessageEvent.data[2] === 0 && checkaudio === true) {
			stopNote(tarimai.frequency);
		}

		if (midimessageEvent.data.length > 1) {

console.log(extractMidiCommand(midimessageEvent.data));
			divLog1.innerHTML = "Fre:  " + tarimai.frequency + '<br>' + divLog1.innerHTML;
			divLog2.innerHTML = "CMD: " + tarimai.cmdName + '<br>' + divLog2.innerHTML;
			divLog3.innerHTML = "Channel:  " + tarimai.channel + '<br>' + divLog3.innerHTML;
			divLog4.innerHTML = "Data:  " + tarimai.cmd + '<br>' + divLog4.innerHTML;
			divLog5.innerHTML = "Data1:  " + tarimai.data1 + '<br>' + divLog5.innerHTML;
			divLog6.innerHTML = "Data2:  " + data2 + '<br>' + divLog6.innerHTML;
			divLog10.innerHTML = "Port " + midimessageEvent.currentTarget.name + '<br>' + divLog10.innerHTML;
			divLog11.innerHTML = "TIME:" + midimessageEvent.timeStamp + '<br>' + divLog11.innerHTML;
		} else if (midimessageEvent.data[0] > 239) { //ignore clock for now

			console.log(extractMidiRealtime(midimessageEvent.data));
			divLog8.innerHTML = extractMidiRealtime(midimessageEvent.data) + '<br>' + divLog8.innerHTML;





		}


	}


	checkboxMIDIInOnChange = function () {
		// port id is the same a the checkbox id
		var inputss = Array.from(midiAccess.inputs.values());
		var id = this.id;
		var port = midiAccess.inputs.get(id.replace('input', ''));
		if (this.checked === true) {
			activeInputs[id] = port;
			// implicitly open port by adding an onmidimessage listener
			
			MidiInKey1 = inputss.indexOf(port);
			console.log(MidiInKey1);
			port.onmidimessage = inputListener;
			rep1();
		} else {
			delete activeInputs[id];
			port.close();
			rep1();
		}
	};


	checkboxMIDIOutOnChange = function () {
		// port id is the same a the checkbox id
		var id = this.id;
		var port = midiAccess.outputs.get(id.replace('output', ''));
		if (this.checked === true) {
			activeOutputs[id] = port;
			port.open();
		} else {
			delete activeOutputs[id];
			port.close();
		}
	};

	
	function midiNoteToFrequency(note) {
		return Math.pow(2, ((note - 69) / 12)) * 440;
	}

	
	function playNote(frequency) {
		oscillators[frequency] = context.createOscillator();
		oscillators[frequency].frequency.value = frequency;
		oscillators[frequency].connect(context.destination);
		oscillators[frequency].start(context.currentTime);
	}

	function stopNote(frequency) {
		oscillators[frequency].stop(context.currentTime);
		oscillators[frequency].disconnect();
	}

	// handle incoming MIDI messages

};
