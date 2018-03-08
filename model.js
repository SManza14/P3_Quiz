//Modelo de datos

const fs = require('fs');

//Fichero en el que se van a guardar las actualizaciones de las preguntas
const DB_FILENAME = 'quizzes.json';

//Quizzes iniciales
let quizzes = [
	{
		question: "Capital de Italia",
		answer: "Roma"
	},
	{
		question: "Capital de Francia",
		answer: "París"
	},
	{
		question: "Capital de España",
		answer: "Madrid"
	},
	{
		question: "Capital de Portugal",
		answer: "Lisboa"
	}
];

//Cargar las preguntas en el fichero
const load = () => {

	fs.readFile(DB_FILENAME, (err, data)=> {
		if (err){
		//introducir valores la primera vez
		if(err.code === "ENOENT") {
			save();
			return;
		}
		throw err;
	}
		let json = JSON.parse(data);

		if(json){
		quizzes = json;
		}
	});
};

//guardar preguntas en el fichero
const save = () => {

	fs.writeFile(DB_FILENAME,
		JSON.stringify(quizzes),
		err =>{
			if (err) throw err;
		});
};

//Número de Quizzes
exports.count = () => quizzes.length;

//Añadir un nuevo Quiz
exports.add = (question, answer) => {

	quizzes.push({
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};

//Actualiza el quiz situado en la posición especificada
exports.update = (id, question, answer) => {

	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error('El valor del parámetro id no es válido.');
	}
	quizzes.splice(id, 1, {
		question: (question || "").trim(),
		answer: (answer || "").trim()
	});
	save();
};

//Devuelve todos los Quizzes actuales
exports.getAll = () => JSON.parse(JSON.stringify(quizzes));

//devuelve el Quiz indicado
exports.getByIndex = id => {

	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error('El valor del parámetro id no es válido.');
	}
	return JSON.parse(JSON.stringify(quiz));
};

//Borra el Quiz indicado
exports.deleteByIndex = id =>{

	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error('El valor del parámetro id no es válido.');
	}
	quizzes.splice(id, 1);
	save();
};

load();