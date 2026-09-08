// ===============================
// FITZONE MAIN JAVASCRIPT
// ===============================


// USER DATA

let user = JSON.parse(localStorage.getItem("fitzoneUser")) || {
    username: "Fitness Warrior",
    xp: 0,
    workouts: 0,
    achievements: 0
};


// SAVE USER

function saveUser() {
    localStorage.setItem("fitzoneUser", JSON.stringify(user));
}


// UPDATE USER INTERFACE

function updateUI() {

    const usernameElements = document.querySelectorAll(".username");

    usernameElements.forEach(element => {
        element.textContent = user.username;
    });


    const xpElements = document.querySelectorAll(".user-xp");

    xpElements.forEach(element => {
        element.textContent = user.xp;
    });


    const workoutElements = document.querySelectorAll(".workout-count");

    workoutElements.forEach(element => {
        element.textContent = user.workouts;
    });


    const achievementElements =
        document.querySelectorAll(".achievement-count");

    achievementElements.forEach(element => {
        element.textContent = user.achievements;
    });


    updateXPBar();
}


// XP SYSTEM

function addXP(amount) {

    user.xp += amount;

    saveUser();

    updateUI();

    alert("🔥 You earned " + amount + " XP!");
}


function getLevel() {

    if (user.xp >= 3000) return "Fitness Champion";
    if (user.xp >= 1500) return "Fitness Warrior";
    if (user.xp >= 500) return "Fitness Explorer";

    return "Beginner";
}


function updateXPBar() {

    const levelElement =
        document.querySelector(".user-level");

    if (levelElement) {
        levelElement.textContent = getLevel();
    }


    const progressFill =
        document.querySelector(".progress-fill");

    if (progressFill) {

        let progress = user.xp % 500;

        let percentage = (progress / 500) * 100;

        progressFill.style.width = percentage + "%";
    }
}


// COMPLETE WORKOUT

function completeWorkout() {

    user.workouts += 1;

    user.xp += 50;

    // Achievement every 5 workouts

    if (user.workouts % 5 === 0) {

        user.achievements += 1;

        user.xp += 100;

        alert("🏆 Achievement Unlocked!");
    }

    saveUser();

    updateUI();

    alert("Workout Completed! +50 XP 💪");
}


// LOGIN

function loginUser(event) {

    event.preventDefault();

    const username =
        document.getElementById("loginUsername").value;

    const password =
        document.getElementById("loginPassword").value;


    const savedUser =
        JSON.parse(localStorage.getItem("fitzoneAccount"));


    if (!savedUser) {

        alert("No account found. Please sign up.");

        return;
    }


    if (
        username === savedUser.username &&
        password === savedUser.password
    ) {

        user.username = username;

        saveUser();

        localStorage.setItem("fitzoneLoggedIn", "true");

        window.location.href = "index.html";

    } else {

        alert("Incorrect username or password.");
    }
}


// SIGN UP

function signupUser(event) {

    event.preventDefault();


    const username =
        document.getElementById("signupUsername").value;

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if (password !== confirmPassword) {

        alert("Passwords do not match!");

        return;
    }


    const account = {
        username: username,
        password: password
    };


    localStorage.setItem(
        "fitzoneAccount",
        JSON.stringify(account)
    );


    user.username = username;

    saveUser();


    alert("Account created successfully!");

    window.location.href = "login.html";
}


// LOGOUT

function logout() {

    localStorage.removeItem("fitzoneLoggedIn");

    window.location.href = "login.html";
}


// BMI CALCULATOR

function calculateBMI() {

    const weight =
        parseFloat(document.getElementById("weight").value);

    const height =
        parseFloat(document.getElementById("height").value);


    if (!weight || !height) {

        alert("Please enter valid values.");

        return;
    }


    const heightMeter = height / 100;

    const bmi =
        weight / (heightMeter * heightMeter);


    let category = "";


    if (bmi < 18.5) {

        category = "Below the typical healthy range";

    } else if (bmi < 25) {

        category = "Within the typical healthy range";

    } else if (bmi < 30) {

        category = "Above the typical healthy range";

    } else {

        category = "High BMI range";
    }


    document.getElementById("bmiResult").innerHTML =
        "<h2>" +
        bmi.toFixed(1) +
        "</h2><p>" +
        category +
        "</p>";
}


// TIMER

let timerInterval;

let totalSeconds = 45;

let isRunning = false;


function updateTimerDisplay() {

    const timerElement =
        document.getElementById("timer");

    if (!timerElement) return;


    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;


    timerElement.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");
}


function startTimer() {

    if (isRunning) return;

    isRunning = true;


    timerInterval = setInterval(() => {

        if (totalSeconds > 0) {

            totalSeconds--;

            updateTimerDisplay();

        } else {

            clearInterval(timerInterval);

            isRunning = false;

            alert("🎉 Exercise Complete!");

            completeWorkout();
        }

    }, 1000);
}


function pauseTimer() {

    clearInterval(timerInterval);

    isRunning = false;
}


function resetTimer() {

    clearInterval(timerInterval);

    isRunning = false;

    totalSeconds = 45;

    updateTimerDisplay();
}


// BODY PART DATA

const workouts = {

    chest: [
        "Push Ups",
        "Bench Press",
        "Incline Dumbbell Press",
        "Chest Fly",
        "Cable Crossover"
    ],

    biceps: [
        "Barbell Curl",
        "Hammer Curl",
        "Concentration Curl",
        "Preacher Curl",
        "Cable Curl"
    ],

    triceps: [
        "Tricep Dips",
        "Skull Crushers",
        "Tricep Pushdown",
        "Overhead Extension",
        "Close Grip Push Ups"
    ],

    shoulders: [
        "Shoulder Press",
        "Lateral Raise",
        "Front Raise",
        "Arnold Press",
        "Face Pull"
    ],

    back: [
        "Pull Ups",
        "Lat Pulldown",
        "Barbell Row",
        "Seated Row",
        "Deadlift"
    ],

    legs: [
        "Squats",
        "Lunges",
        "Leg Press",
        "Leg Curl",
        "Calf Raises"
    ],

    abs: [
        "Crunches",
        "Plank",
        "Leg Raises",
        "Russian Twists",
        "Mountain Climbers"
    ]
};


// LOAD BODY PART

function loadBodyPart() {

    const params =
        new URLSearchParams(window.location.search);

    const bodyPart =
        params.get("part");


    if (!bodyPart || !workouts[bodyPart]) return;


    const title =
        document.getElementById("bodyPartTitle");

    const container =
        document.getElementById("exerciseContainer");


    title.textContent =
        bodyPart.toUpperCase() + " WORKOUTS";


    workouts[bodyPart].forEach((exercise, index) => {

        container.innerHTML += `

        <div class="card workout-card">

            <div class="workout-icon">
                ${getWorkoutIcon(bodyPart)}
            </div>

            <h3>${exercise}</h3>

            <div class="workout-meta">

                <span class="badge">
                    Exercise ${index + 1}
                </span>

                <span class="badge">
                    3 Sets × 12 Reps
                </span>

            </div>

            <button
                class="btn btn-primary"
                onclick="startExercise('${exercise}')">

                Start Workout

            </button>

        </div>

        `;
    });
}


function getWorkoutIcon(part) {

    const icons = {

        chest: "💪",
        biceps: "🏋️",
        triceps: "💪",
        shoulders: "🏋️",
        back: "🔙",
        legs: "🦵",
        abs: "🔥"

    };

    return icons[part] || "💪";
}


function startExercise(exercise) {

    document.getElementById("currentExercise").textContent =
        exercise;

    document.getElementById("workoutTimerSection")
        .scrollIntoView({
            behavior: "smooth"
        });

    resetTimer();
}


// INITIALIZE

document.addEventListener("DOMContentLoaded", () => {

    updateUI();

    updateTimerDisplay();

    loadBodyPart();

});
