const questionArea = document.getElementById('questions');
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text');
const scoreElement = document.getElementById('score');
const resetButton = document.getElementById('reset-button');
const startButton = document.getElementById('start-button');
const gameSection = document.getElementById('game');
let score = 0;
let currentQuestion = 0;
let questions = [];

startButton.onclick = () => {
    initQuiz();
    startButton.classList.add('hidden');
};

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
    scoreElement.textContent = `Score: ${score}`;
    currentQuestion = 0;
    startButton.classList.remove('hidden');
    gameSection.classList.add('hidden');
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
        questionArea.innerHTML = 
        `<div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 d-flex flex-column align-items-center">
                    <div class="text-center mb-4">
                        <h3 id="question-number" class="text-center">Question 1</h3>
                        <p id="question-text" class="mt-2">${questions[0].question.text}</p>
                    </div>
                    <div class="row g-2 w-100">
                        <div class="col-6"><button id="button-1" class="btn btn-primary w-100"></button></div>
                        <div class="col-6"><button id="button-2" class="btn btn-primary w-100"></button></div>
                        <div class="col-6"><button id="button-3" class="btn btn-primary w-100"></button></div>
                        <div class="col-6"><button id="button-4" class="btn btn-primary w-100"></button></div>
                    </div>
                </div>
            </div>
        </div>`;
        
        displayQuestion(questions[currentQuestion]);
        // .classList.remove('hidden');
        gameSection.classList.remove('hidden');
    }
    else {
        console.error('No questions found');
    }
}

// initQuiz();





