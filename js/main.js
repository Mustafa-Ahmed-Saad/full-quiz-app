let countSpan = document.querySelector('.quiz-info .count span');
let bulletsSpanContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.all-button .next-button');
let backButton = document.querySelector('.all-button .back-button');
let iconMark = document.querySelector('.all-button i');
let countDownElement = document.querySelector('.countdown');

let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;
let qCount;
let userAnswerArray;
let rightAnswerArray;
let questionsArray;

// add event click on back button to back to prev quesstion
backButton.onclick = function () {
  if (currentIndex != 0) {
    currentIndex--;
    answersArea.innerHTML = '';
    quizArea.innerHTML = '';
    addQuestionData(questionsArray[currentIndex], qCount);
    handelbullets(qCount);
    checkedLastAnswer();
  }
};

// add event click on next button
submitButton.onclick = function () {
  // if currentIndex < qCount is mean that user want to move to next question so we will save his answer of current question and the move hem to next question
  if (currentIndex < qCount) {
    addUserAnswer();
  }
  // if currentIndex === qCount - 1 is mean that user want to submit her answer
  if (currentIndex === qCount - 1) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to submit all your answer now!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit.',
    }).then((result) => {
      if (result.isConfirmed) {
        showResult(qCount);
        Swal.fire('Done', 'All your answers has been submited Successfully.', 'success');
      } else {
        backButton.click();
      }
    });
  }
  // after add user answer or back we will get next question and handel bullet and check of last answer is founded
  nextQuestion(questionsArray, qCount);
  handelbullets(qCount);
  // check last answer of user for this question if founded
  checkedLastAnswer();
};

// this function to create XMLHttpRequest to get question
function getQuestions() {
  // create new XML Http Request
  let myRequest = new XMLHttpRequest();

  // this function will run when state of request change // or we can use axios
  myRequest.onreadystatechange = function () {
    // when request is success // or we can use axios
    if (this.readyState === 4 && this.status === 200) {
      questionsArray = JSON.parse(this.responseText);
      qCount = questionsArray.length;

      // create number of bullet === number of question
      createBullets(qCount);
      // create empty array with length === number of question to make user put her answer inside it
      userAnswerArray = Array(qCount);
      // add question data to dom
      addQuestionData(questionsArray[currentIndex], qCount);
      // create time with 100 seconds
      countDown(100, qCount);

      // create array of correct answer
      rightAnswerArray = Array(qCount);
      for (let i = 0; i < qCount; i++) {
        rightAnswerArray[i] = questionsArray[i]['right_answer'];
      }
    }
  };
  // put method and url of request
  myRequest.open('get', 'json/html_questions.json', true);
  // send this request
  myRequest.send();
}

getQuestions();

// this function to create Bullets === number of questions
function createBullets(qCount) {
  // this will appear number of current question like that  6 / 10
  countSpan.textContent = `${currentIndex + 1} / ${qCount}`;

  for (let i = 0; i < qCount; i++) {
    let span = document.createElement('span');
    bulletsSpanContainer.appendChild(span);
    // create event click on each bullet
    span.addEventListener('click', () => {
      quizArea.innerHTML = '';
      answersArea.innerHTML = '';
      // remove class on from all bullet
      removeAllClass();
      // add class on from this bullet that was clicked
      span.className = 'on';
      // add question that have index === index of this bullet that was clicked
      addQuestionData(questionsArray[i], qCount);
      currentIndex = i;
      // handel countSpan ( 6 / 10 )
      countSpan.textContent = `${currentIndex + 1} / ${qCount}`;
      checkedLastAnswer();
    });

    if (i === 0) {
      span.classList.add('on');
    }
  }
}

// add Question to dom
function addQuestionData(obj, qCount) {
  if (currentIndex < qCount) {
    let questionTitle = document.createElement('h2');
    // square brackets is better than dot notation in this case
    let questionText = document.createTextNode(obj['title']);
    questionTitle.appendChild(questionText);

    quizArea.appendChild(questionTitle);

    let namePropArray = Array.from(Object.keys(obj));
    // we create namePropArray and then - 2 because we dont need to calculat (title, right_answer) but we want to the number of answer in each object (answer_4, answer_3, answer_2, answer_1)
    for (let i = 1; i <= namePropArray.length - 2; i++) {
      // create div to contain radio button (radioInput)
      let mainDiv = document.createElement('div');
      mainDiv.className = 'answer';

      let radioInput = document.createElement('input');
      radioInput.name = 'questions';
      radioInput.type = 'radio';
      radioInput.id = `answer_${i}`;
      // we add custom attribute dataset answer to compare with the current answer and user answer when get the result
      radioInput.dataset.answer = obj[`answer_${i}`];
      radioInput.onclick = function () {
        addUserAnswer();
      };

      let theLabel = document.createElement('label');
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.htmlFor = `answer_${i}`; //or //theLabel.addAttribute('for', `answer_${i}`)  /* علشان لما ادوس علي الليبول دا يختارلي الانبوت اللي لية نفس الاي دي دا */
      theLabel.appendChild(theLabelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      answersArea.appendChild(mainDiv);
    }
  }
}

// when user click on radio button
function addUserAnswer() {
  // let inputs = Array.from(document.querySelectorAll('.answers-area .answer input')); // or // document.querySelectorAll('input')  with put array.from
  // get all element that has attribule name and it's value is 'questions'
  let inputs = Array.from(document.getElementsByName('questions'));
  let theChoosenAnswer;

  for (let input of inputs) {
    if (input.checked === true) {
      theChoosenAnswer = input.dataset.answer;
    }
  }
  userAnswerArray[currentIndex] = theChoosenAnswer;
  // or // userAnswerArray.splice(currentIndex, 0, theChoosenAnswer)
}

// when click on next button
function nextQuestion(questionsArray, qCount) {
  if (currentIndex < qCount) {
    currentIndex++;
    let newQuestion = questionsArray[currentIndex];
    answersArea.innerHTML = '';
    quizArea.innerHTML = '';
    addQuestionData(newQuestion, qCount);
  }
}

// add class "on" on buttet that active now to make this bullet is blue
function handelbullets(qCount) {
  let AllSpan = Array.from(document.querySelectorAll('.bullets .spans span'));
  // handel countSpan ( 6 / 10)
  if (currentIndex < qCount) {
    countSpan.textContent = `${currentIndex + 1} / ${qCount}`;
  }

  AllSpan.forEach((span, index) => {
    if (index === currentIndex) {
      span.className = 'on';
    } else {
      span.className = '';
    }
  });
}

function showResult(qCount) {
  // or // quizArea.innerHTML = ''; // if i want to empty this instead of remove it
  quizArea.remove();
  answersArea.remove();
  submitButton.remove();

  if (document.querySelector('.bullets')) {
    document.querySelector('.bullets').remove();
  }
  if (document.querySelector('.all-button')) {
    document.querySelector('.all-button').remove();
  }
  backButton.remove();

  // know number of currect answers
  for (let m = 0; m < rightAnswerArray.length; m++) {
    if (userAnswerArray[m] === rightAnswerArray[m]) {
      rightAnswer++;
    }
  }
  // rightAnswerArray.forEach((answer, index) => {
  //     if (answer === userAnswerArray[index]) {
  //         rightAnswer++;
  //     }
  // })

  // create span message
  let theResult;
  if (rightAnswer > qCount / 2 && rightAnswer < qCount) {
    theResult = `<span class='good'>good</span> you answers is good, the right answer is <span>${rightAnswer} from ${qCount}</span>`;
  } else if (rightAnswer === qCount) {
    theResult = `<span class='perfect'>perfect</span> you answers is perfect, All answers is <span>right</span>`;
  } else {
    theResult = `<span class='bad'>sorry</span> you answers is not good, the right answer is <span>${rightAnswer} from ${qCount}</span>`;
  }
  document.querySelector('.result').innerHTML = theResult;
}

// create count down accebt time with seconds
function countDown(time, qCount) {
  if (currentIndex < qCount) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(time / 60); // or // Math.floor(count / 2)
      seconds = time % 60; // or parseInt(count % 2)

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      // or // countDownElement.innerHTML = `<span class="minutes">${minutes}</span> : <span class="seconds">${seconds}</span>`
      countDownElement.innerHTML = `${minutes} : ${seconds}`;
      // we here want to make (time = time - 1) every time we check so we cen make it like that if(--time<0) or like that if(time<0) {...... ; time--;}
      if (--time < 0) {
        clearInterval(countDownInterval);
        showResult(qCount);
        Swal.fire({
          icon: 'error',
          title: 'sorry',
          text: 'time is out!',
        });
      } else if (currentIndex === qCount + 1) {
        clearInterval(countDownInterval);
      }
    }, 1000);
  }
}

// when move to any question this function make checked on the radio button that we choosed it from before
function checkedLastAnswer() {
  if (!(userAnswerArray[currentIndex] === undefined)) {
    // allInputs here is [input#answer_1, input#answer_2, input#answer_3, input#answer_4]
    let allInputs = Array.from(document.getElementsByName('questions'));

    // we loop on 4 answer and check if answer of this input (input.dataset.answer) === answer of user for this question
    allInputs.forEach((input) => {
      if (userAnswerArray[currentIndex] === input.dataset.answer) {
        input.checked = true;
      }
    });
  }
}

// remove class on from all bullet
function removeAllClass() {
  let allSpansBull = Array.from(bulletsSpanContainer.children);
  allSpansBull.forEach((bullet) => {
    if (bullet.className === 'on') {
      bullet.className = '';
    }
  });
}

// add attribute mark to bullet when click mark icon
iconMark.onclick = function () {
  let allSpanBullet = Array.from(bulletsSpanContainer.children);
  allSpanBullet.forEach((bull) => {
    if (bull.classList.contains('on')) {
      bull.hasAttribute('mark') ? bull.removeAttribute('mark') : bull.setAttribute('mark', 'kk'); /* بستخدام اف المختصرة */
      // or // if (bull.hasAttribute('mark')) {bull.removeAttribute('mark')} else {bull.setAttribute('mark', 'kk')}
    }
  });
};
