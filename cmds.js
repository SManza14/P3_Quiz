const model = require('./model');
const {log, biglog, errorlog, colorize} = require('./out');


exports.helpCmd = rl => {

      log('  Commandos:');
      log('  h/help - Muestra este menú de ayuda.');
      log('  list - Listar los quizzes existentes.');
      log('  show <id> - Muestra la pregunta y la respuesta del quiz indicado');
      log('  add - Añadir un nuevo quiz interactivamente.');
      log('  delete <id> - Borrar el Quiz indicado.');
      log('  edit <id> - Editar el quiz indicado.');
      log('  test <id> - Probar el Quiz indicado.');
      log('  p/play - Jugar a preguntar aleatoriamente todos los quizzes.');
      log('  credits - Créditos.');
      log('  q/quit - Salir del programa.');
      rl.prompt();
};

exports.listCmd = rl => {
  
  model.getAll().forEach((quiz, id) =>{

    log(` [${colorize(id, 'magenta')}]: ${quiz.question}`);
  });
  rl.prompt();

};

exports.showCmd = (rl, id) => {

  if (typeof id === "undefined"){
    errorlog('Falta el parámetro id.');
  } else{
      try{
        const quiz = model.getByIndex(id);
        log(` [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
      } catch(error){
          errorlog(error.message);
      }
  }


  rl.prompt();

};

exports.addCmd = rl => {
  rl.question(colorize('  Introduzca una pregunta: ', 'red'), question => {

    rl.question(colorize('  Introduzca la respuesta: ', 'red'), answer => {

      model.add(question, answer);
      log(` ${colorize('se ha añadido', 'magenta')}: ${question} ${colorize(' => ', 'magenta')} ${answer}`);
      rl.prompt();
    })
  })
  

};

exports.deleteCmd = (rl, id) => {
  
  if (typeof id === "undefined"){
    errorlog('Falta el parámetro id.');
  } else{
      try{
        model.deleteByIndex(id);
      } catch(error){
          errorlog(error.message);
      }
  }
  rl.prompt();

};

exports.editCmd = (rl, id) => {
  if (typeof id === "undefined"){
    errorlog('Falta el parámetro id.');
    rl.prompt();
  } else{
      try{
          const quiz = model.getByIndex(id);

          process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
          rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
        
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
            rl.question(colorize('Introduzca una respuesta: ', 'red'), answer =>{
              model.update(id, question, answer);
              log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
              rl.prompt();          
            });
          });
      } catch(error){
          errorlog(error.message);
      }
  }
  rl.prompt();

};

exports.testCmd = (rl, id) => {
  
  if (typeof id === "undefined"){
    errorlog('Falta el parámetro id.');
    rl.prompt();
  } else{
       try{
          const quiz = model.getByIndex(id);

          rl.question(quiz.question + ` ${colorize('=>', 'magenta')} `, answer => {
            if(quiz.answer.toLowerCase() === answer.toLowerCase().trim()){
              log('Su respuesta es: ');
              log('Correcta', 'green');
              rl.prompt();
            } else{
              log('Su respuesta es: ');
              log('Incorrecta', 'red');
              rl.prompt();
            }
          })
        } catch(error){
          errorlog(error.message);
          rl.prompt();
      }
  }
};

exports.playCmd = rl => {
  
  let score = 0;
  let toBeAnswered = [];
  for(let i = 0; i < model.count(); i++){
    toBeAnswered[i] = i;
  };

  const playOne = () =>{
    if(toBeAnswered.length === 0){

      log('Fin del test.')
      log('Error! Número de acietos: ');
      biglog(score, 'green');
      rl.prompt();
    } else {
      let id = Math.floor(Math.random() * toBeAnswered.length);
      let quiz = model.getByIndex(toBeAnswered[id]);
      toBeAnswered.splice(id, 1);

      rl.question(quiz.question + ` ${colorize('=>', 'magenta')} `, answer => {
        if(quiz.answer.toLowerCase() === answer.toLowerCase().trim()){
          
          score += 1;
          log(`Correcto! Lleva ${colorize(score, 'green')} aciertos.`);
          playOne();

        } else {
          log('Incorrecto');
          log(score);
          log('fin');
          rl.prompt();

        }
      }
    )
  };
};

  playOne();

};

exports.creditsCmd = rl => {
  log('  Autor de la práctica:');
  	log('  Sergio Manzanero', 'green');
  	rl.prompt();

};

exports.quitCmd = rl => {
  rl.close();
};