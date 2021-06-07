
let countSpan = document.querySelector('.quiz-info .count span');
let bulletsSpanCountainer = document.querySelector('.bullets .spans');
let quezArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.all-button .next-button');
let backButton = document.querySelector('.all-button .back-button');
let iconMark = document.querySelector('.all-button i');
let countDownElement = document.querySelector('.countdown');

let currentIndex = 0;
let rightAnswer = 0;
let countDownIterval;
let qCount;
let userAnswerArray;
let rightAnswerArray;
let questionsObject;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            questionsObject = JSON.parse(this.responseText);
            qCount = questionsObject.length;
            rightAnswerArray = Array(qCount);

            createBullets(qCount);
            userAnswerArray = Array(qCount);
            addQuestionData(questionsObject[currentIndex], qCount);
            countDown(1000, qCount);

            for (let i = 0; i < qCount; i++) {
                rightAnswerArray[i] = questionsObject[i]['right_answer']
            }

            submitButton.onclick = function() {

                if (currentIndex < qCount) { addUserAnswer(questionsObject[currentIndex].right_answer); }// if (currentIndex < qCount) {checkAnswer(questionsObject[currentIndex].right_answer);} // مش لازم نعمل الشرط دا لانو اول ما يخلص الاسئلة الزرار هيتشال و المكان اللي بيتحكط فية الخيارات و المكان اللي بيتحص فية السوال كمان هيتشالو فمش لازم تكتب الشرط دا لوكن لو مش هيتشالو و الزرار هيفضل شغال و مش حتي هتديلو بوينتر ايفنتس نون يبقي لازم تعمل السرط دا
                if (currentIndex === qCount-1) { 
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "You want to submit all your answer now!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, submit.'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          showResult(qCount);
                          Swal.fire(
                            'Done',
                            'All your answers has been submited Successfully.',
                            'success'
                          )
                        } else {
                            backButton.click();
                        }
                      })
                }
                nextQuestion(questionsObject, qCount);
                handelbullets(qCount);
                checkedLastAnswer();
            }

            backButton.onclick = function() {
                if (currentIndex != 0) {
                    currentIndex--;
                    answersArea.innerHTML = '';
                    quezArea.innerHTML = '';
                    addQuestionData(questionsObject[currentIndex], qCount);
                    handelbullets(qCount);
                    checkedLastAnswer();
                }
            }
        }
    };

    myRequest.open('get', 'json/html_questions.json', true);
    myRequest.send();
}

getQuestions();

function createBullets(numOfQuestions) {
    countSpan.textContent = `${currentIndex + 1} / ${numOfQuestions}`; 

    for (let i = 0; i < numOfQuestions; i++) {
        
        let span = document.createElement('span');
        bulletsSpanCountainer.appendChild(span);

        span.addEventListener('click', () => {
            quezArea.innerHTML = '';
            answersArea.innerHTML = '';
            removeAllClass();
            span.className = 'on';
            addQuestionData(questionsObject[i] ,qCount);
            currentIndex = i;
            countSpan.textContent = `${currentIndex + 1} / ${qCount}`
            checkedLastAnswer();
        })

        if (i === 0) {
            span.classList.add('on');
        }
    }
}

function addQuestionData(obj, count) {
    
    if (currentIndex < count) {
        let questionTitle = document.createElement('h2');
        let questionText = document.createTextNode(obj['title']);  //or // obj.title // طريقة السكوير براكيت افضل من الدوت نوتيشن تقريبا
        questionTitle.appendChild(questionText);
    
        quezArea.appendChild(questionTitle);
    
        let namePropArray = Array.from(Object.keys(obj)); /* علشان عدد الديفات اللي كل واحد فيهم فية الانبوت و اللابول و بيمثل اختيار اللي ختتكون تكون دينامك علس حسب عدد الاختيارات اللي في السوال دا في فايل الجيسون */
        for (let i = 1; i <= namePropArray.length - 2; i++) { // or //  // law 3awez tkaly el asela dinamek we anan nakast etnen alshan el title msh men el e5tyarat we el answer_sight mesh men el e5tyarat // for (let i = 1; i <= 4; i++) // ممكن نعمل كدا لو الاوبجيكت بتاع الجيسون فية كل سوال فية عدد اختيارات مختلفة
            let mainDiv = document.createElement('div');
            mainDiv.className = 'answer';
    
            let radioInput = document.createElement('input');
            radioInput.name = 'questions';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`]; // dehatkon fe el html data-answer='' //or // obj.right_answer // لو كان عندك مسافات او سلاش او كدا الافضل انك تستخدم الاقواس مش الدوت
            // عشان لما نقارن نجيب الاجابة اللي موجودة في الداتا انسر دا و نشوفها هل بتساوي الاجابة الصحيحة ولا لا
            
            radioInput.onclick = function() {
                addUserAnswer();
            }

            let theLabel = document.createElement('label');
            let theLabelText = document.createTextNode(obj[`answer_${i}`]); 
            theLabel.htmlFor = `answer_${i}`; //or //theLabel.addAttribute('for', `answer_${i}`)  /* علشان لما ادوس علي الليبول دا يختارلي الانبوت اللي لية نفس الاي دي دا */
            theLabel.appendChild(theLabelText);
    
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
    
            answersArea.appendChild(mainDiv);
    
            // if (i === 1) {
            //     radioInput.checked = true
            // }
        }
    }
}


function addUserAnswer() {
    // let inputs = Array.from(document.querySelectorAll('.answers-area .answer input')); // or // document.querySelectorAll('input')  with put array.from
    let inputs = Array.from(document.getElementsByName('questions')); /* دي هتجبلك كل العناصر اللي واخدة اتربيوت اسمو نيم و لكن الفيمة بتاعتو كويسشن فقط */
    let thechoosenAnswer;

    for (let input of inputs) {
        if (input.checked === true) {
            thechoosenAnswer = input.dataset.answer;
        }
    }
    userAnswerArray[currentIndex] = thechoosenAnswer;
    // or // userAnswerArray.splice(currentIndex, 0, thechoosenAnswer)
}


function nextQuestion(questionsObject, count) {
    if (currentIndex < count) {
        currentIndex++;
        let newQuestion = questionsObject[currentIndex];
        // let childNum = answersArea.children.length;

        answersArea.innerHTML = '';
        //or
        /*for (let x = 0; x < childNum ;x++) {
            document.querySelector('.answers-area .answer').remove();
        }*/

        quezArea.innerHTML = '';
        //or
        /*document.querySelector('.quiz-area h2').remove();*/
        
        addQuestionData(newQuestion, count);

        // or
        /*for (let span of AllSpan) {
            span.classList.contains('on');
            span.className = '';  // or  // span.classList.remove('on');
            
            bulletsSpanCountainer.children[currentIndex].classList.add('on');
        }*/
    }
    
}

function handelbullets(count) {
    let AllSpan = Array.from(document.querySelectorAll('.bullets .spans span'));
    /*AllSpan.forEach((span, index) => { // كدا انا هشوف لو السباد دي الاندكس باعها هوا الكرانت كويسشن يعني هوا السوال اللي علية الدور هحطلو كلاس اون و مش هشيلو و لما يضغط علي السابميت و يجي السال اللي بعدو هيلف عليهم و مش هيشيل الكلاس الموجود بل هيجيب اللي عليها الدول و يديها كلاس الاون
        if (index === currentIndex) {
            span.className = 'on';
        }
    });*/
    // or // لو عاوز اشيل كل التظليل ما عدا علي اللي عليها الدور
    
    // if (currentIndex < count) { countSpan.textContent = `${currentIndex + 1} / ${count}` }; 
    if (currentIndex < count) { countSpan.textContent = `${currentIndex + 1} / ${count}` }; 

    AllSpan.forEach((span, index) => {
        if (index === currentIndex) {
            span.className = 'on';
        } else {
            span.className = '';
        }
    });
}

function showResult(count) {

    quezArea.remove(); // quezArea.innerHTML = ''; // لو عاوز افضية من كل الابناء اللي فية فقط بدون ما امسحة
    answersArea.remove(); // answersArea.innerHTML = ''; // لو عاوز افضية من كل الابناء اللي فية فقط بدون ما امسحة
    submitButton.remove();
    if (document.querySelector('.bullets')) {document.querySelector('.bullets').remove()}; // document.querySelector('.bullets').innerHTML = ''; // لو عاوز افضية من كل الابناء اللي فية فقط بدون ما امسحة
    if (document.querySelector('.all-button')) {document.querySelector('.all-button').remove()}; // document.querySelector('.bullets').innerHTML = ''; // لو عاوز افضية من كل الابناء اللي فية فقط بدون ما امسحة
    backButton.remove();

    
    for (let m =0; m < rightAnswerArray.length; m++) {
        if (userAnswerArray[m] === rightAnswerArray[m]) {
            rightAnswer++;

        }
    }
    // rightAnswerArray.forEach((answer, index) => {
    //     if (answer === userAnswerArray[index]) {
    //         rightAnswer++;
    //     }
    // })

    let theResult;
    if (rightAnswer > count / 2 && rightAnswer < count) {
        theResult = `<span class='good'>good</span> you answers is good, the right answer is <span>${rightAnswer} from ${count}</span>`;
    } else if (rightAnswer === count) {
        theResult = `<span class='perfect'>perfect</span> you answers is perfect, All answers is <span>right</span>`;
    } else {
        theResult = `<span class='bad'>sorry</span> you answers is not good, the right answer is <span>${rightAnswer} from ${count}</span>`;
    }
    document.querySelector('.result').innerHTML = theResult;
}


function countDown(time, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownIterval = setInterval(() => {
            minutes = parseInt(time / 60); // or // Math.floor(count / 2)
            seconds = time % 60; // or parseInt(count % 2)
            
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            
            countDownElement.innerHTML = `${minutes} : ${seconds}`; // or // countDownElement.innerHTML = `<span class="minutes">${minutes}</span> : <span class="seconds">${seconds}</span>`
            // time--; // ممكن بدل ما اكتبها هنا اكتبها جوا الاف بحيث كل لما يجي يعمل تشيك ينقص واحد من التايم او ممكن تكتبها هنا و تشيل ال ناقص ناقص من الاف
            if (--time < 0) {
                clearInterval(countDownIterval);
                showResult(qCount);
                Swal.fire({
                    icon: 'error',
                    title: 'sorry',
                    text: 'time is out!',
                })
            } else if (currentIndex === count) {
                clearInterval(countDownIterval);
                // Swal.fire({
                //     icon: 'success',
                //     title: 'done',
                //     text: 'you finish the exam before the time expires.',
                //     footer: '<a href>Why do I have this issue?</a>'
                // })

            }
        },1000)
    }   
}

function checkedLastAnswer() {
    if (!(userAnswerArray[currentIndex] === undefined)) {
        let allInputs = Array.from(document.getElementsByName('questions'));

        allInputs.forEach((input,index) => {
            if (userAnswerArray[currentIndex] === input.dataset.answer) {
                input.checked = true;
            }
        });
    }
    
}

function removeAllClass() {
    let allSpansBull = Array.from(bulletsSpanCountainer.children);
    allSpansBull.forEach((bullet) => {
        if (bullet.className === 'on') {
            bullet.className = '';
        }
    })
}

iconMark.onclick = function() {
    let allSpanBullet = Array.from(bulletsSpanCountainer.children);
    allSpanBullet.forEach((bull) => {
        if (bull.classList.contains('on')) {
            bull.hasAttribute('mark') ? bull.removeAttribute('mark') : bull.setAttribute('mark', 'kk'); /* بستخدام اف المختصرة */
            // or // if (bull.hasAttribute('mark')) {bull.removeAttribute('mark')} else {bull.setAttribute('mark', 'kk')}
        }
    })
}
