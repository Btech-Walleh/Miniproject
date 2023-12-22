const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _nextBtn = document.getElementById('next-question');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _pageNumber = document.getElementById('page-number');
const _categorySelect = document.getElementById('category-select');

let correctAnswer = "", correctScore = pageNumber = 0, totalQuestion = 10;

async function loadQuestion() {
    showLoader(); // Display loader while fetching question

    const categoryParam = _categorySelect.value === "" ? "" : `&category=${_categorySelect.value}`;
    const APIUrl = `https://opentdb.com/api.php?amount=1${categoryParam}`;
    
    try {
        const result = await fetch(APIUrl);
        const data = await result.json();
        _result.innerHTML = "";
        showQuestion(data.results[0]);
    } catch (error) {
        _question.innerHTML = 'Please Wait loading question...';
        console.error('Error fetching question:', error);
        // Automatically call loadQuestion again after a delay
        setTimeout(loadQuestion, 2000); // Adjust the delay as needed
    }
}

function eventListeners() {
    _nextBtn.addEventListener('click', showResult);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

function startQuiz() {
    loadQuestion();
    eventListeners();
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
    _pageNumber.textContent = `Question ${pageNumber + 1}`;
}

document.addEventListener('DOMContentLoaded', function () {
    startQuiz();
});

function showQuestion(data) {
    _nextBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

    _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}

function showLoader() {
    _question.innerHTML = 'Loading...';
    _options.innerHTML = ''; // Clear options while loading
}

function selectOption() {
    _options.querySelectorAll('li').forEach(function (option) {
        option.addEventListener('click', function () {
            if (_options.querySelector('.selected')) {
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

function showResult() {
    _nextBtn.disabled = true;

    const selectedOption = _options.querySelector('.selected span');

    if (selectedOption) {
        checkAnswer(selectedOption.textContent);
    } else {
        _result.innerHTML = `<p><i class="fas fa-question"></i>Please select an option!</p>`;
        _nextBtn.disabled = false;
    }
}

function checkAnswer(selectedAnswer) {
    if (selectedAnswer === HTMLDecode(correctAnswer)) {
        correctScore++;
        _result.innerHTML = `<p><i class="fas fa-check"></i>Correct Answer!</p>`;
    } else {
        _result.innerHTML = `<p><i class="fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
    }

    pageNumber++;
    _pageNumber.textContent = `Question ${pageNumber + 1}`;

    checkCount();
}

function checkCount() {
    if (pageNumber === totalQuestion) {
        _result.innerHTML += `<p>Your final score is ${correctScore} out of ${totalQuestion}.</p>`;
        _playAgainBtn.style.display = "block";
        _nextBtn.style.display = "none";
        setCount();
    } else {
        setTimeout(function () {
            loadQuestion();
            _nextBtn.disabled = false;
        }, 1000); // Adjust the delay as needed
    }
}

function restartQuiz() {
    correctScore = pageNumber = 0;
    _playAgainBtn.style.display = "none";
    _nextBtn.style.display = "block";
    _nextBtn.disabled = false;
    setCount();
    loadQuestion();
}

function setCount() {
    _correctScore.textContent = correctScore;
}

function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}
