// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "H0use!99"
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });


// Example of constructing pdfform
// If you don't care about which PDF library to use, just call without arguments, as in
// pdfform().transform(..) / pdfform().list_fields(...)

function make_pdfform() {
	var lib_name = document.querySelector('input[name="pdflib"]:checked').value;
	console.log(lib_name,'lib_name');
	console.log(minipdf);
	console.log(pdfform);
	return pdfform((lib_name === 'minipdf') ? minipdf : minipdf_js);
}

// Example of listing all fields
function list(buffs,information) {	
	//this is where it reads the file and creates the list 
	try {
		let field_specs = make_pdfform().list_fields(buffs);
		console.log('field_spec',field_specs)
		fill(buffs,field_specs,information)
	} catch (e) {
		on_error(e);
		return;
	}
}

// Example of filling out fields
function fill(buf,field_specs,information) {
	console.log('got to fill')

	for(var key in field_specs){
		if(key === 'cl_1'){
			field_specs[key] = [false,true,false,false,false,false];
		} else if(key === 'f1_1'){
			field_specs[key] = [information['firstname'] + " "+ information['lastname']];
		} else if(key === 'f1_2'){
			field_specs[key] = [information['business_name']];
		} else if(key === 'f1_7'){
			field_specs[key] = [information['address']];
		} else if(key === 'f1_8'){
			field_specs[key] = [information['city'] + " " + information['state'] +" "+ information['zipcode']];
		} else if (key === 'f1_11'){
			field_specs[key] = [information['ssn'].slice(0,3)];
		} else if (key === 'f1_12'){
			field_specs[key] = [information['ssn'].slice(4,6)];
		} else if (key === 'f1_13'){
			field_specs[key] = [information['ssn'].slice(7,11)];
		}else{
			field_specs[key] = [''];
		}
	}
	//this is the part where it puts the data and downloads the pdf file

	var filled_pdf; // Uint8Array
	try {
		filled_pdf = make_pdfform().transform(buf, field_specs);
	} catch (e) {
		return on_error(e);
	}
	var blob = new Blob([filled_pdf], {type: 'application/pdf'});
	saveAs(blob, 'pdfform.js_generated.pdf');
}


// From here on just code for this demo.
// This will not feature in your website
function on_error(e) {
	console.error(e, e.stack);  // eslint-disable-line no-console
	var div = document.createElement('div');
	div.appendChild(document.createTextNode(e.message));
	document.querySelector('.error').appendChild(div);
}

function empty(node) {
	var last;
	while ((last = node.lastChild)) {
		node.removeChild(last);
	}
}

// var current_buffer;

function on_file(filename, buf) {
	console.log(buf,"it'sbuffer");
	var current_buffer = buf;
	// document.querySelector('.url_form').setAttribute('style', 'display: none');
	// var cur_file = document.querySelector('.cur_file');
	// empty(cur_file);
	// cur_file.setAttribute('style', 'display: block');
	// cur_file.appendChild(document.createTextNode('loaded file ' + filename + ' (' + buf.byteLength + ' Bytes)'));
	// var reload_btn = document.createElement('button');
	// reload_btn.appendChild(document.createTextNode('use another file'));
	// cur_file.appendChild(reload_btn);
	// document.querySelector('.fill').removeAttribute('disabled');

	console.log('filename is ',filename)
	console.log(current_buffer)

	var information ={
		firstname : 'andy',
		lastname: 'oe',
		ssn:'123-45-7891',
		address:'7810 bellaire blvd',
		city:'houston',
		state: 'tx',
		zipcode: '77036',
		marital_status:'single',
		business_name:"heart and brain center"
	}

	list(current_buffer,information);
}

document.addEventListener('DOMContentLoaded', function() {
	// Download by URL
	// Note that this just works for URLs in the same origin, see Same-Origin Policy
	var url_form = document.querySelector('.url_form');
	url_form.addEventListener('submit', function(e) {
		e.preventDefault();
		var url = document.querySelector('input[name="url"]').value;
		console.log(url,'submitted');

		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';

		xhr.onload = function() {
			if (this.status == 200) {
				on_file(url.split(/\//).pop(), this.response);
			} else {
				on_error('failed to load URL (code: ' + this.status + ')');
			}
		};

		xhr.send();
	});

	document.querySelector('.url_form input[name="file"]').addEventListener('change', function(e) {
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onload = function(ev) {
			console.log(ev.target.result,"ev.target.result")
			on_file(file.name, ev.target.result);
		};
		console.log(file.name,'insid change event listener')
		reader.readAsArrayBuffer(file);
	
	});

	var fill_form = document.querySelector('.fill_form');

	fill_form.addEventListener('submit', function(e) {
		e.preventDefault();
		console.log(current_buffer,'currentbuffer')
		fill(current_buffer);

	});

	var cur_file = document.querySelector('.cur_file');
	cur_file.addEventListener('submit', function(e) {
		e.preventDefault();
		empty(document.querySelector('.error'));
		cur_file.setAttribute('style', 'display: none');
		url_form.setAttribute('style', 'display: block');
	});

	var pdflib_radios = document.querySelectorAll('input[name="pdflib"]');
	for (var i = 0;i < pdflib_radios.length;i++) {
		var r = pdflib_radios[i];
		r.addEventListener('change', function() {
			if (current_buffer) {
				var information ={
					firstname : 'andy',
					lastname: 'oe',
					ssn:'123-45-7891',
					address:'7810 bellaire blvd',
					city:'houston',
					state: 'tx',
					zipcode: '77036',
					marital_status:'single',
					business_name:"heart and brain center"
				
				}

				list(current_buffer,information);
			}
		});
	}

	document.querySelector('.loading').setAttribute('style', 'display: none');
});
