const questionArea = document.getElementById('question-area');
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
        text = `<p class="question-text">${questionText}</p>
    <div id="${question.id}">
    ${choices.map((choice) =>
            `<button onclick="${choice === correctAnswer ? 'check(this, true)' : 'check(this, false)'}">${choice}</button>`
        ).join('')}
    </div>`;//put each choice in a button element and join them together
    }

    else {
        console.log('Invalid question type');
        text = `<p> invalid q</p>\n`;
    }
    questionArea.innerHTML = text;

}
function check(element, isCorrect) {
    if (isCorrect) {
        score++;
        console.log('Correct answer!');
    } else {
        console.log('Incorrect answer!');
    }
    [...element.parentElement.children].forEach(child => {
        child.style.backgroundColor = isCorrect ? 'green' : 'red';
        child.style.backgroundColor = isCorrect ? child.classList.add('correct') : child.classList.add('incorrect');
        child.disabled = true;
    });
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = () => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            displayQuestion(questions[currentQuestion]);
        } else {
            questionArea.innerHTML = `<p>Quiz completed! Your score is ${score}/${questions.length}.</p>`;
        }
    };
    questionArea.appendChild(nextButton);
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

function reset() {
    score = 0;
    currentQuestion = 0;
    initQuiz();
}

