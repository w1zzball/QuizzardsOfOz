const questionArea = document.getElementById('questions');
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text');
const scoreElement = document.getElementById('score');
const resetButton = document.getElementById('reset-button');
let score = 0;
let currentQuestion = 0;
let questions = [];

let timer;
let timeLeft = 30;

async function getQuestions(amount, catagories, difficulty) {
    try {
        const response = await fetch(`https://the-trivia-api.com/v2/questions?limit=${amount}&categories=${catagories}&difficulties=${difficulty}`);//attempt to get data
        const data = await response.json();//parse json into js object
        console.log(data);//log data
        return data;
    } catch (error) {
        console.error('Error:', error);//log error
    }
}

resetButton.onclick = ()=>{//add event listener to reset button
    score = 0;
    currentQuestion = 0;
    initQuiz();
};


function displayQuestion(question) {
    if (!question) {//if question exists
        console.error('Question is undefined');
        return;
    }
    const questionText = question.question.text;
    const correctAnswer = question.correctAnswer;
    const choices = [...question.incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);//the .sort randomsies the order
    let text = "";

    if (question.type === "text_choice") {
        questionNumberElement.textContent = `Question ${currentQuestion + 1}/${questions.length}`;//display the question number
        questionTextElement.textContent = questionText;//display the question text
        choices.forEach((choice, index)=>{
            console.log(`button-${index+1}`);
            document.getElementById(`button-${index+1}`).onclick = function() {choice === correctAnswer ? check(this, true) : check(this, false)};
            document.getElementById(`button-${index+1}`).innerText = choice;
        })
    }

    else {
        console.log('Invalid question type');
        text = `<p> invalid q</p>\n`;
    }
}
function check(element, isCorrect) {
    if (isCorrect) {
        score++;
        console.log('Correct answer!');
    } else {
        console.log('Incorrect answer!');
    }
    
    // Only select the answer buttons
    const answerButtons = document.querySelectorAll('#questions button');
    answerButtons.forEach(button => {
        const isCorrectButton = button.innerText === questions[currentQuestion].correctAnswer;
        button.classList.add(isCorrectButton ? 'correct' : 'incorrect');
        button.disabled = true;
    });

    nextButton = document.getElementById('next-button');
    nextButton.onclick = () => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            displayQuestion(questions[currentQuestion]);
        } else {
            questionArea.innerHTML = `<p>Quiz completed! Your score is ${score}/${questions.length}.</p>`;
        }
        answerButtons.forEach(button => {
            button.disabled = false;
            button.classList.remove('correct');
            button.classList.remove('incorrect');
        });
    };
    scoreElement.textContent = `Score: ${score}`;
}

async function initQuiz() {
    questions = await getQuestions(10, "general_knowledge", "easy");
    if (questions) {
        displayQuestion(questions[currentQuestion]);
    }
    else {
        console.error('No questions found');
    }
}

/**
 * Function to start the timer
 * setInterval is used to call countDown function every 1000ms (1s)
 */
function startTimer() {
    document.getElementById('timer').innerText = timeLeft;
    timer = setInterval(countDown, 1000);
}

/**
 * Function to stop the timer when it reaches 0
 * displays time up message
 */

function countDown() {
    timeLeft--;
    if (timeLeft <= 0) {
        clearInterval(timer);
        document.getElementById('timer').innerText = '';
        document.getElementById('result').innerText = 'Time\'s up! The question is marked as incorrect.';
    } else {
        document.getElementById('timer').innerText = timeLeft;
    }
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById('timer').innerText = '30';
}

initQuiz();

