const TelegramBot = require('node-telegram-bot-api');

const token = '5396980613:AAGPi7X4TUEjLL-wNU5FmmiIqFNkGjVOwkw';

const bot = new TelegramBot(token, {polling: true});

const arr = require('./module');
let {groups, result} = arr;


const func = require('./module');
let {addGroup, removeGroup, addStudent, removeStudent, acceptTask, showStatus} = func;


const homeTask= require('./table');
let {task} = homeTask;






bot.onText(/\/add_next (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const idGroup = Number(match[1]); 
  let date = new Date()

  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timezone: 'UTC',
  };

 if(date.getDay() !== 1){
  do { 
    date.setDate(date.getDate() + 1);
  } while (date.getDay() !== 1);
 }
  addGroup(idGroup, date);
  console.log(groups);
  bot.sendMessage(chatId, `Группа ${idGroup} зарегистрирована на ${date.toLocaleString("ru", options)}`);

});


bot.onText(/\/add_next_next (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const idGroup = Number(match[1]); 
  let date = new Date()


  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timezone: 'UTC',
  };

  if (date.getDay() == 1) {
  date.setDate(date.getDate() + 7);
  } else if(date.getDay() !== 1){
  do { 
  date.setDate(date.getDate() + 1);
  }
  while (date.getDay() !== 1);
  }
  addGroup(idGroup, date);
  console.log(groups);
  bot.sendMessage(chatId, `Группа ${idGroup} зарегистрирована на ${date.toLocaleString("ru", options)}`);
  
});




bot.onText(/\/remove (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const idGroup = match[1]; 
    removeGroup(idGroup);
    console.log(groups);
    bot.sendMessage(chatId, `Группа ${idGroup} удалена`);
});

bot.onText(/\/add_student (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; 
  let student =  resp.split(',');
  let idGroup = Number(student[0]);
  let id = Number(student[1]);
  let stuname = student[2];
   addStudent(idGroup, id, stuname);
   console.log(groups[1].students);
  bot.sendMessage(chatId, `Студент ${id} ${stuname} добавлен`);
});


bot.onText(/\/remove_student (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const id = match[1]; 
  removeStudent(id)
  console.log(groups[1].students);
  bot.sendMessage(chatId, `Студент ${id} удален`);
});


bot.onText(/\/done (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; 
  let student =  resp.split(',');
  let idGroup = Number(student[0]);
  let id = Number(student[1]);

  acceptTask(idGroup, id)
  console.log(groups[1].students);
  bot.sendMessage(chatId, `Студент ${id} выполнил задание`);
});

bot.onText(/\/show_status (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const idGroup = match[1]; 

  showStatus(idGroup);
  console.log(groups[1].students);
  bot.sendMessage(chatId, `Результаты группы ${idGroup} ${result}`);
});


bot.onText(/\/send_task (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const stepType = match[1]; 
  const notifications = (messages, startDate, stepType) => {
    let date = new Date(startDate);
    let tableDate;
  
    for (let i = 0; i < messages.length; i++) {
      if (stepType == 'minutes') {
        messages[i].tableDate = new Date(
          date.setMinutes(date.getMinutes() + messages[i].step)
        );
      }
      if (stepType == 'seconds') {
        messages[i].tableDate = new Date(
          date.setSeconds(date.getSeconds() + messages[i].step)
        );
      }
      if (stepType == 'days') {
        messages[i].tableDate = new Date(
          date.setDate(date.getDate() + messages[i].step)
        );
      }
    }
  
    setInterval(() => {
      for (let n = 0; n < messages.length; n++) {
        if (
          messages[n].tableDate.getDate() == new Date().getDate() &&
          messages[n].tableDate.getMinutes() == new Date().getMinutes() &&
          messages[n].tableDate.getSeconds() == new Date().getSeconds()
        ) {
          bot.sendMessage(chatId, String(messages[n].title + '\n' + messages[n].link));
        }
      }
    }, 1000);
  };
  let day = groups[1].startDate;
  notifications(task, day, stepType)
  console.log(groups[1].students);

});


