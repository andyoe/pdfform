
var mysql = require('mysql');
var express = require('express');
const app = express();
const fs = require('fs');
var pdfFillForm = require('pdf-fill-form');
// const {pdfform} = require('../pdfform.js');
// var minipdf = require('../minipdf.js')



app.use(express.static('/public/demo.html'))

var db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "H0use!99",
	database: "orangehrm_mysql"
});


db.connect(function (err) {
	if (err) throw err;
	console.log("Connected to database");
});

var field;

db.query("SELECT * FROM hs_hr_employee WHERE emp_lastname = 'oe1'", (err, res) => {
	field = res[0];
	console.log(field);
	pdfFillForm.write('fw9.pdf',
		{
			'topmostSubform[0].Page1[0]﻿.f1_1[0]': `${field.emp_firstname} ` + `${field.emp_lastname}`,
			'topmostSubform[0].Page1[0].FederalClassification[0]﻿.c1_1[1]': true,
			'topmostSubform[0].Page1[0].Address[0]﻿.f1_7[0]': "Bellaire Blvd",
			'topmostSubform[0].Page1[0].Address[0]﻿.f1_8[0]': " Houston TX 77036",
			'topmostSubform[0].Page1[0].SSN[0]﻿.f1_11[0]': `${(field.emp_ssn_num).slice(0,3)}`,
			'topmostSubform[0].Page1[0].SSN[0]﻿.f1_12[0]': `${(field.emp_ssn_num).slice(3,5)}`,
			'topmostSubform[0].Page1[0].SSN[0]﻿.f1_13[0]': `${(field.emp_ssn_num).slice(5,9)}`
		},

		{ "save": "pdf" })
		.then(function (result) {
			fs.writeFile("test1234.pdf", result, function (err) {
				if (err) {
					return// return console.log(err);
				}
				console.log("The file was saved!");
			});
		}, function (err) {
			// console.log(err);
		});
})



app.listen(5501, () => {
	console.log("server listening")
})



// pdfFillForm.read('fw9.pdf')
// .then(function(result) {
// 	field = result;


// 	console.log(field);
// }, function(err) {
// 	console.log(err);
// });



pdfFillForm.write('fw9.pdf',
	{
		'topmostSubform[0].Page1[0]﻿.f1_1[0]': "Andy kyoung won Oe",
		'topmostSubform[0].Page1[0].FederalClassification[0]﻿.c1_1[1]': true,
		'topmostSubform[0].Page1[0].Address[0]﻿.f1_7[0]': "Bellaire Blvd",
		'topmostSubform[0].Page1[0].Address[0]﻿.f1_8[0]': " Houston TX 77036",
		'topmostSubform[0].Page1[0].SSN[0]﻿.f1_11[0]': '123',
		'topmostSubform[0].Page1[0].SSN[0]﻿.f1_12[0]': "45",
		'topmostSubform[0].Page1[0].SSN[0]﻿.f1_13[0]': "6789"
	},

	{ "save": "pdf", 'cores': 4, 'scale': 0.2, 'antialias': true })
	.then(function (result) {
		fs.writeFile("test1234.pdf", result, function (err) {
			if (err) {
				return// return console.log(err);
			}
			console.log("The file was saved!");
		});
	}, function (err) {
		// console.log(err);
	});

// pdfFillForm.write('fw9.pdf', { 
// 	"topmostSubform[0].Page1[0].f1_1[0]": "Andy kyoung won Oe",
// 	'topmostSubform[0].Page1[0].SSN[0].f1_11[0]':"123",
// 	'topmostSubform[0].Page1[0].SSN[0].f1_12[0]' : "45",
// 	'topmostSubform[0].Page1[0].SSN[0].f1_13[0]' : '6789'
//  },
// 	 { "save": "pdf"} )
// .then(function(result) {
// 	fs.writeFile("test1234.pdf", result, function(err) {
// 		if(err) {
// 	   		return console.log(err);
// 	   	}
// 	   	console.log("The file was saved!");
// 	}); 
// }, function(err) {
//   	console.log(err);
// });