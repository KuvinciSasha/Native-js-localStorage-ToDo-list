let wrapper, mainbtn, board, boardTitleInput, closeCross, boardCaption, boardInput, boardButton, boardUl;
let storeData = [];
wrapper = document.querySelector('.wrapper');
mainbtn = document.querySelector('.mainBtn');
let boardsData = localStorage.getItem('boards');

// Грузим из localStorage доски, если они там есть
if(boardsData !== null) {
  wrapper.innerHTML = boardsData;
  document.querySelector('.wrapper').addEventListener('click', listener);
  dragListener();
}

// Создаёт доску для заданий
document.querySelector('.addBoard').onclick = function () {
  // Генерим элементы одного борда
  board = document.createElement('div');
  closeCross = document.createElement('div');
  boardCaption = document.createElement('h1');
  boardInput = document.createElement('input');
  boardButton = document.createElement('button');
  boardUl = document.createElement('ul');

  // Нужные классы и value для всех элементов
  board.classList.add('board');

  closeCross.classList.add('close');
  closeCross.innerHTML = 'x';

  boardTitleInput = document.querySelector('.boardTitle').value;

  boardCaption.classList.add('listCaption');
  boardCaption.innerHTML = boardTitleInput;

  boardInput.classList.add('boardInput');
  boardInput.placeholder = 'Задача...';

  boardButton.classList.add('addTaskButton');
  boardButton.innerHTML = 'Добавить';

  boardUl.classList.add('taskList');

  board.appendChild(closeCross);
  board.appendChild(boardCaption);
  board.appendChild(boardInput);
  board.appendChild(boardButton);
  board.appendChild(boardUl);

  if (document.querySelector('.boardTitle').value == '') {
    console.error('Назовите список');
  } else if (document.querySelector('.boardTitle').value > '') {
    // localStorage.setItem('boards', board.innerHTML);
    wrapper.append(board);
    storeData = document.querySelector('.wrapper').innerHTML;
    localStorage.setItem('boards', storeData);
  }
  document.querySelector('.boardTitle').value = ''; //Обнуляем инпут для создания бордов
};



document.querySelector('.addBoard').addEventListener('click', addBoardListener);
function addBoardListener () {
  document.querySelector('.wrapper').addEventListener('click', listener);
  document.querySelector('.wrapper').addEventListener('click', dragListener);
}

// Манипуляции с таском и и доской
function listener (e) {
  // Добавляем таск по нажатию
  if (e.target.classList.contains('addTaskButton')) {
    taskCreate(e);
  }
  // Нажатие на кнопку "готово"
  else if (e.target.classList.contains('doneImage')){
    taskDone(e);
  }
  // Удаляет доску при нажатии на крест
  else if (e.target.classList.contains('close')){
    bordDelete(e);
  }
  // Удаляет таск
  else if (e.target.classList.contains('deleteImage')){
    taskDelete(e);
  }
}

// Создаёт и собирает весь таск
function taskCreate(e) {
  let boardLi = document.createElement('li');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  boardLi.classList.add('liElem');
  let dragg = document.createAttribute('draggable');
  dragg.value = 'true';
  boardLi.setAttributeNode(dragg);

  doneButton.classList.add('doneButton');
  deleteButton.classList.add('deleteButton');

  doneButton.innerHTML = '<img src="img/done.png" alt="image" class="doneImage">';
  deleteButton.innerHTML = '<img src="img/delete.png" alt="image" class="deleteImage">';
  boardLi.innerHTML = e.target.previousElementSibling.value;
  boardLi.appendChild(doneButton);
  boardLi.appendChild(deleteButton);
  if (e.target.previousElementSibling.value == '') {
    console.error('Задача пуста');
  } else if (e.target.previousElementSibling.value > '') {
    e.target.nextElementSibling.appendChild(boardLi);
    storeData = document.querySelector('.wrapper').innerHTML;
    localStorage.setItem('boards', storeData);
  }
  e.target.previousElementSibling.value = ''; //Обнуляем инпут для создания тасков
}

function bordDelete(e) {
  e.target.parentNode.remove();
  storeData = document.querySelector('.wrapper').innerHTML;
  localStorage.setItem('boards', storeData);
}

function taskDone(e) {
  if (e.target.parentNode.parentNode.classList.contains('taskDoneStyle')) {//если таск выполнен то:
    e.target.parentNode.parentNode.classList.remove('taskDoneStyle');
    e.target.setAttribute("src", "img/done.png");
  } else {
    e.target.parentNode.parentNode.classList.add('taskDoneStyle');
    e.target.setAttribute("src", "img/doneGrey.png");
  }
  storeData = document.querySelector('.wrapper').innerHTML;
  localStorage.setItem('boards', storeData);
}

function taskDelete(e) {
  e.target.parentNode.parentNode.remove();
}

/*============================================
  =               Drag & Drop                =
  ============================================*/
function dragListener() {
  const liElem = document.querySelectorAll('.liElem');

  // Вешает EventListener на каждый таск
  for(const elem of liElem){
    elem.addEventListener('dragstart', dragStart);
    elem.addEventListener('dragend', dragEnd);
  }
  
  const empties = document.querySelectorAll('.taskList');

  // Вешает EventListener для приёма Drag элемента на каждый список
  for(const empty of empties){
    empty.addEventListener('dragenter', dragEnter);
    empty.addEventListener('dragleave', dragLeave);
    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('drop', dragDrop);
  }

  //drag функции
  function dragStart() {
    dragElem = this;
    setTimeout(() => this.className = 'invisible' , 0);
  }
  function dragEnd() {
    this.className = 'liElem';
  }
  function dragEnter() {
    this.parentNode.className += ' over';
  }
  function dragOver(e) {
    this.parentNode.className += ' over';
    e.preventDefault();
  }
  function dragLeave() {
    this.parentNode.className = 'board';
  }
  function dragDrop() {
    dragElem.className = 'liElem';
    this.appendChild(dragElem);
    this.parentNode.className = 'board';

    storeData[1] = this.innerHTML;
    storeData = document.querySelector('.wrapper').innerHTML;
    localStorage.setItem('boards', storeData);
  }
}

