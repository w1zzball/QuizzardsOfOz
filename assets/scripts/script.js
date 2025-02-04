const questionArea = document.getElementById('questions');
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text');
const scoreElement = document.getElementById('score');
const resetButton = document.getElementById('reset-button');
let score = 0;
let currentQuestion = 0;
let questions = [];
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
    [...element.parentElement.children].forEach(child => {
        // child.style.backgroundColor = isCorrect ? 'green' : 'red';
        child.style.backgroundColor = isCorrect ? child.classList.add('correct') : child.classList.add('incorrect');
        child.disabled = true;
    });
    // const nextButton = document.createElement('button');
    // nextButton.textContent = 'Next';
    nextButton = document.getElementById('next-button');
    nextButton.onclick = () => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            displayQuestion(questions[currentQuestion]);
        } else {
            questionArea.innerHTML = `<p>Quiz completed! Your score is ${score}/${questions.length}.</p>`;
        }
        [...element.parentElement.children].forEach(child => {
            child.style.backgroundColor = '';
            child.disabled = false;
            child.classList.remove('correct');
            child.classList.remove('incorrect');
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

initQuiz();





