
let countSpan = document.querySelector('.quiz-info .count span');
let bulletsSpanCountainer = document.querySelector('.bullets .spans');
let quezArea = document.querySelector('.quiz-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let countDownElement = document.querySelector('.countdown');


let currentIndex = 0;
let rightAnswer = 0;
let countDownIterval;  /* خليت دا جلوبال علشان من اي مكان في البرنامج اقدر اوقف الكاونت داون دا */

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            
            createBullets(qCount);
            addQuestionData(questionsObject[currentIndex], qCount);
            countDown(15, qCount);

            submitButton.onclick = function() {
                
                checkAnswer(questionsObject[currentIndex].right_answer);  // if (currentIndex < qCount) {checkAnswer(questionsObject[currentIndex].right_answer);} // مش لازم نعمل الشرط دا لانو اول ما يخلص الاسئلة الزرار هيتشال و المكان اللي بيتحكط فية الخيارات و المكان اللي بيتحص فية السوال كمان هيتشالو فمش لازم تكتب الشرط دا لوكن لو مش هيتشالو و الزرار هيفضل شغال و مش حتي هتديلو بوينتر ايفنتس نون يبقي لازم تعمل السرط دا
                currentIndex++;
                answersArea.innerHTML = '';
                //or
                /*for (let x = 0; x < childNum ;x++) {
                    document.querySelector('.answers-area .answer').remove();
                }*/
                quezArea.innerHTML = '';
                //or
                /*document.querySelector('.quiz-area h2').remove();*/
                
                clearInterval(countDownIterval);
                countDown(15, qCount);
                
                if (currentIndex === qCount) { showResult(qCount) }
                addQuestionData(questionsObject[currentIndex], qCount);
                handleBullets();
            }

        }
    };

    myRequest.open('Get', 'json/html_questions.json', true);
    myRequest.send();
}

getQuestions();

function createBullets(numOfQuestions) {
    countSpan.textContent = numOfQuestions; 
    
    for (let i = 0; i < numOfQuestions; i++) {
        
        let span = document.createElement('span');
        bulletsSpanCountainer.appendChild(span);

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
            
            if (i === 1) {
                radioInput.checked = true // لو عاوز اعمل تشيك علي الانبوت دا 
            }
            
            let theLabel = document.createElement('label');
            theLabel.htmlFor = `answer_${i}`; //dont do that theLabel.for  //or you can do  //theLabel.setAttribute('for', `answer_${i}`)  /* علشان لما ادوس علي الليبول دا يختارلي الانبوت اللي لية نفس الاي دي دا */
            let theLabelText = document.createTextNode(obj[`answer_${i}`]); 
            theLabel.appendChild(theLabelText);
    
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);
    
            answersArea.appendChild(mainDiv);
    
        }
        
    }

}

function checkAnswer(rAnswer) {
    
    let answers = document.getElementsByName('questions'); /* اي حاجة فيها اتربيوت اسمو نيم و الاتربيوت دا فيمتة ب كويسشن */
    let theChoosenAnswer;
    
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked === true) {
            theChoosenAnswer = answers[i].dataset.answer /* علشان يجيب الفالية بتعت الاتربيوت اللي اسمو داتا انسير اللي في الانبوت */
        }
    }
    if (theChoosenAnswer === rAnswer) {
        rightAnswer++;
    } else {
        console.log('wrong answer');
    }
    
}


function handleBullets() {

    let AllSpan = Array.from(document.querySelectorAll('.bullets .spans span'));
    AllSpan.forEach((span, index) => { // كدا انا هشوف لو السباد دي الاندكس باعها هوا الكرانت كويسشن يعني هوا السوال اللي علية الدور هحطلو كلاس اون و مش هشيلو و لما يضغط علي السابميت و يجي السال اللي بعدو هيلف عليهم و مش هيشيل الكلاس الموجود بل هيجيب اللي عليها الدول و يديها كلاس الاون
        if (index === currentIndex) {
            span.className = 'on';
        }
    });
    // or // لو عاوز اشيل كل التظليل ما عدا علي اللي عليها الدور
    /*AllSpan.forEach((span, index) => {
        if (index === currentIndex) {
            span.className = 'on';
        } else {
            span.className = '';
        }
    });*/
    // or
    /*for (let span of AllSpan) {
        span.classList.contains('on');
        span.className = '';  // or  // span.classList.remove('on');
        
        bulletsSpanCountainer.children[currentIndex].classList.add('on');
    }*/
    
}

function showResult(count) {
    quezArea.remove(); // quezArea.innerHTML = ''; // لو عاوز افضية من كل الابناء اللي فية فقط بدون ما امسحة
    answersArea.remove(); // answersArea.innerHTML = ''; // لو عاوز افضية من كل الابناء اللي فية فقط بدون ما امسحة
    submitButton.remove();
    document.querySelector('.bullets').remove(); // document.querySelector('.bullets').innerHTML = ''; // لو عاوز افضية من كل الابناء اللي فية فقط بدون ما امسحة

    let theResult;
    if (rightAnswer > (count / 2) && rightAnswer < count) {
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
            seconds = parseInt(time % 60); // or (count % 2) with out parseInt
            
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            
            countDownElement.innerHTML = `${minutes} : ${seconds}`; // or // countDownElement.innerHTML = `<span class="minutes">${minutes}</span> : <span class="seconds">${seconds}</span>`
            // time--; // ممكن بدل ما اكتبها هنا اكتبها جوا الاف بحيث كل لما يجي يعمل تشيك ينقص واحد من التايم او ممكن تكتبها هنا و تشيل ال ناقص ناقص من الاف
            if (--time < 0 || currentIndex === count) {
                clearInterval(countDownIterval);
                submitButton.click();
            }
        },1000)
    }
}