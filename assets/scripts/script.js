const questionArea = document.getElementById('questions');
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text');
const scoreElement = document.getElementById('score');
const resetButton = document.getElementById('reset-button');
const startButton = document.getElementById('start-button');
const gameSection = document.getElementById('game');
let catagories = "general_knowledge";
let difficulty = "easy";
let score = 0;
let currentQuestion = 0;
let questions = [];

// Add these after the initial variable declarations
const difficultyItems = document.querySelectorAll('#difficultyDropdown + .dropdown-menu .dropdown-item');
const categoryCheckboxes = document.querySelectorAll('#categories input[type="checkbox"]');

// Add event listeners for difficulty selection
difficultyItems.forEach(item => {
    item.addEventListener('click', (e) => {
        difficulty = e.target.textContent.toLowerCase();
        document.getElementById('difficultyDropdown').textContent = e.target.textContent;
    });
});

// Add event listeners for category selection
categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const selectedCategories = Array.from(categoryCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.id.replace('-', '_'));
        
        categories = selectedCategories.length > 0 ? selectedCategories.join(',') : 'general_knowledge';
        
        // Update dropdown button text
        const buttonText = selectedCategories.length > 0 ? 
            `${selectedCategories.length} Selected` : 
            'Select Category';
        document.getElementById('categoryDropdown').textContent = buttonText;
    });
});

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
    if (!question) {//if question doesnt exist
        console.error('Question is undefined');
        return;
    }
    console.log(question.question.text);
    const questionText = question.question.text;
    const correctAnswer = question.correctAnswer;
    const choices = [...question.incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);//the .sort randomsies the order
    let text = "";
    console.log(choices);
    console.log(questionText);

    if (question.type === "text_choice") {
        questionNumberElement.textContent = `Question ${currentQuestion + 1}/${questions.length}`;//display the question number
        questionTextElement.textContent = questionText;//display the question text
        choices.forEach((choice, index)=>{
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
            // Instead of replacing entire HTML, just update the text and hide buttons
            questionNumberElement.textContent = "Quiz Complete!";
            questionTextElement.textContent = `Your score is ${score}/${questions.length}`;
            document.querySelectorAll('#questions button').forEach(button => {
                button.style.display = 'none';
            });
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
    questions = await getQuestions(10, categories, difficulty);
    if (questions) {
        // Reset the display of answer buttons
        document.querySelectorAll('#questions button').forEach(button => {
            button.style.display = 'inline-block';
        });
        
        displayQuestion(questions[currentQuestion]);
        gameSection.classList.remove('hidden');
    } else {
        console.error('No questions found');
    }
}

// initQuiz();





