const roleSkills = {
  "Data Analyst": [
    {
      skill: "Excel",
      question: "Can you use Excel formulas, sorting and filtering?",
      project: "Student Marks Analysis using Excel"
    },
    {
      skill: "SQL",
      question: "Can you write SQL queries to retrieve data?",
      project: "Student Database Analysis using SQL"
    },
    {
      skill: "Python",
      question: "Can you use basic Python for data analysis?",
      project: "Sales Data Analysis using Python"
    },
    {
      skill: "Data Visualization",
      question: "Can you create charts and explain the results?",
      project: "Sales Dashboard"
    },
    {
      skill: "Statistics",
      question: "Do you understand mean, median and basic statistics?",
      project: "Student Performance Analysis"
    }
  ],

  "Web Developer": [
    {
      skill: "HTML",
      question: "Can you create webpages using HTML?",
      project: "Personal Portfolio Website"
    },
    {
      skill: "CSS",
      question: "Can you style webpages using CSS?",
      project: "Responsive Landing Page"
    },
    {
      skill: "JavaScript",
      question: "Can you make webpages interactive using JavaScript?",
      project: "Interactive Quiz Application"
    },
    {
      skill: "Responsive Design",
      question: "Can you make a website work on phones and computers?",
      project: "Responsive College Website"
    },
    {
      skill: "Debugging",
      question: "Can you find and fix basic website errors?",
      project: "Website Testing Project"
    }
  ],

  "Python Developer": [
    {
      skill: "Python Basics",
      question: "Can you use variables, conditions and loops?",
      project: "Number Guessing Game"
    },
    {
      skill: "Functions",
      question: "Can you create and use Python functions?",
      project: "Calculator Application"
    },
    {
      skill: "Data Structures",
      question: "Can you work with lists, dictionaries and tuples?",
      project: "Student Record Manager"
    },
    {
      skill: "File Handling",
      question: "Can you read and write files using Python?",
      project: "File-Based Notes Manager"
    },
    {
      skill: "Error Handling",
      question: "Can you handle errors using try and except?",
      project: "Input Validation Tool"
    }
  ]
};

const form = document.getElementById("assessmentForm");
const roleSelect = document.getElementById("jobRole");
const questionsBox = document.getElementById("questions");

const HISTORY_KEY = "skillBridgeHistory";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderQuestions() {
  const skills = roleSkills[roleSelect.value];

  questionsBox.innerHTML = skills.map((item, index) => `
    <div class="question">
      <p>${index + 1}. ${item.question}</p>
      <label for="skill${index}">Your current skill level</label>
      <select id="skill${index}" required>
        <option value="">Select an answer</option>
        <option value="yes">Yes, I can do this</option>
        <option value="no">I need more practice</option>
      </select>
    </div>
  `).join("");
}

roleSelect.addEventListener("change", renderQuestions);

function getHistory() {
  try {
    const history = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || "[]"
    );

    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
}

function showHistory() {
  const historyBox = document.getElementById("history");
  const history = getHistory();

  if (history.length === 0) {
    historyBox.innerHTML =
      "<li>No assessments yet. Complete your first assessment.</li>";
    return;
  }

  historyBox.innerHTML = history.map(item => `
    <li>
      ${escapeHTML(item.date)} —
      ${escapeHTML(item.name)} —
      ${escapeHTML(item.role)} —
      ${Number(item.score)}%
    </li>
  `).join("");
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const role = roleSelect.value;
  const skills = roleSkills[role];

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  const answers = skills.map((item, index) => {
    const selected = document.getElementById(`skill${index}`).value;

    return {
      skill: item.skill,
      project: item.project,
      answer: selected,
      ready: selected === "yes"
    };
  });

  if (answers.some(answer => !answer.answer)) {
    alert("Please answer every question.");
    return;
  }

  const readyCount = answers.filter(answer => answer.ready).length;
  const score = Math.round((readyCount / answers.length) * 100);
  const missing = answers.filter(answer => !answer.ready);

  document.getElementById("score").textContent = `${score}%`;
  document.getElementById("scoreBar").style.width = `${score}%`;
  document.getElementById("resultRole").textContent = role;
  document.getElementById("gapCount").textContent = missing.length;

  let summary;

  if (score >= 80) {
    summary =
      "Great progress! Continue practising and build projects to demonstrate your skills.";
  } else if (score >= 50) {
    summary =
      "You have a good starting point. Focus on the skills you need to improve.";
  } else {
    summary =
      "Start with the fundamentals and practise regularly to strengthen your skills.";
  }

  document.getElementById("summary").textContent =
    `${name}, ${summary} This score is based on your self-assessment.`;

  document.getElementById("feedback").innerHTML = answers.map(answer => `
    <div class="feedback-item">
      ${answer.ready ? "✓" : "○"}
      <strong>${escapeHTML(answer.skill)}:</strong>
      ${answer.ready ? "Confident" : "Needs more practice"}
    </div>
  `).join("");

  const projectsBox = document.getElementById("projects");

  if (missing.length) {
    projectsBox.innerHTML = missing.map(item => `
      <li>
        <strong>${escapeHTML(item.project)}</strong>
        — practise ${escapeHTML(item.skill)}
      </li>
    `).join("");
  } else {
    projectsBox.innerHTML =
      "<li>Build a complete portfolio project for your chosen role.</li>";
  }

  const record = {
    name: name,
    role: role,
    score: score,
    date: new Date().toLocaleDateString()
  };

  const history = getHistory();
  history.unshift(record);

  try {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, 20))
    );
  } catch {
    alert("Your browser could not save history. Check its storage settings.");
  }

  showHistory();

  document.getElementById("dashboard").scrollIntoView({
    behavior: "smooth"
  });
});

document.getElementById("historyButton").addEventListener(
  "click",
  showHistory
);

renderQuestions();
showHistory();