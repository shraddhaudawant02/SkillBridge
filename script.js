// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL = "https://eahywrvvmxebzxvwvpcn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vXpNyUq2yw_zZZRAhGLlqg_zTibaR7U";
const STORAGE_BUCKET = "project-files";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let currentUser = null;
let allApprovedProjects = [];

// ==========================================
// SKILL ASSESSMENT DATA
// ==========================================

const roleQuestions = {
  "Data Analyst": [
    {
      question: "How comfortable are you with Microsoft Excel?",
      skill: "Excel",
      options: [
        "Beginner",
        "I know basic formulas",
        "I can use formulas, charts and tables",
        "I can analyse data using Excel"
      ]
    },
    {
      question: "How much do you know about SQL?",
      skill: "SQL",
      options: [
        "I have no knowledge",
        "I know basic queries",
        "I can write joins and queries",
        "I can work with databases confidently"
      ]
    },
    {
      question: "How comfortable are you with Power BI?",
      skill: "Power BI",
      options: [
        "I have never used it",
        "I know the basics",
        "I can create dashboards",
        "I can create interactive reports"
      ]
    },
    {
      question: "How well do you understand data analysis?",
      skill: "Data Analysis",
      options: [
        "I am a beginner",
        "I understand basic concepts",
        "I can analyse datasets",
        "I can find insights from data"
      ]
    },
    {
      question: "How comfortable are you with Python?",
      skill: "Python",
      options: [
        "No knowledge",
        "Basic syntax",
        "I can write simple programs",
        "I can use Python for data analysis"
      ]
    }
  ],

  "Web Developer": [
    {
      question: "How much do you know about HTML?",
      skill: "HTML",
      options: [
        "No knowledge",
        "I know basic tags",
        "I can create web pages",
        "I can create structured websites"
      ]
    },
    {
      question: "How comfortable are you with CSS?",
      skill: "CSS",
      options: [
        "No knowledge",
        "I know basic styling",
        "I can design responsive pages",
        "I can create advanced layouts"
      ]
    },
    {
      question: "How much JavaScript do you know?",
      skill: "JavaScript",
      options: [
        "No knowledge",
        "I know basic syntax",
        "I can write interactive code",
        "I can build dynamic websites"
      ]
    },
    {
      question: "How comfortable are you with databases?",
      skill: "Database",
      options: [
        "No knowledge",
        "I know basic concepts",
        "I can create and manage tables",
        "I can connect databases with websites"
      ]
    },
    {
      question: "Have you worked on any web development project?",
      skill: "Projects",
      options: [
        "No",
        "I have tried small examples",
        "I have created a basic website",
        "I have completed a working project"
      ]
    }
  ],

  "Python Developer": [
    {
      question: "How well do you know Python syntax?",
      skill: "Python Basics",
      options: [
        "No knowledge",
        "I know basic syntax",
        "I can write programs",
        "I am confident with Python"
      ]
    },
    {
      question: "How comfortable are you with functions and loops?",
      skill: "Functions and Loops",
      options: [
        "Beginner",
        "I know basic loops",
        "I can use functions and loops",
        "I can solve problems using them"
      ]
    },
    {
      question: "How much do you know about data structures?",
      skill: "Data Structures",
      options: [
        "No knowledge",
        "I know lists and tuples",
        "I understand dictionaries and sets",
        "I can use data structures in programs"
      ]
    },
    {
      question: "How comfortable are you with libraries?",
      skill: "Python Libraries",
      options: [
        "No knowledge",
        "I know a few libraries",
        "I can use common libraries",
        "I can use libraries in projects"
      ]
    },
    {
      question: "Have you created any Python project?",
      skill: "Projects",
      options: [
        "No",
        "I have tried small programs",
        "I have created a basic project",
        "I have completed a working project"
      ]
    }
  ]
};

const projectSuggestions = {
  "Data Analyst": [
    "Student Performance Analysis",
    "Sales Data Dashboard",
    "Customer Behaviour Analysis"
  ],
  "Web Developer": [
    "Personal Portfolio Website",
    "Online Shopping Website",
    "Student Management System"
  ],
  "Python Developer": [
    "Student Management System",
    "Weather Information Application",
    "Library Management System"
  ]
};

// ==========================================
// ASSESSMENT QUESTION DISPLAY
// ==========================================

const jobRole = document.getElementById("jobRole");
const questionsContainer = document.getElementById("questions");

function displayQuestions() {
  const selectedRole = jobRole.value;
  const questions = roleQuestions[selectedRole];

  questionsContainer.innerHTML = "";

  questions.forEach((item, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    let optionsHTML = "";

    item.options.forEach((option, optionIndex) => {
      optionsHTML += `
        <label>
          <input
            type="radio"
            name="question${index}"
            value="${optionIndex + 1}"
            required
          >
          ${option}
        </label>
      `;
    });

    questionDiv.innerHTML = `
      <p>${index + 1}. ${item.question}</p>
      ${optionsHTML}
    `;

    questionsContainer.appendChild(questionDiv);
  });
}

jobRole.addEventListener("change", displayQuestions);
displayQuestions();

// ==========================================
// ASSESSMENT FORM SUBMISSION
// ==========================================

document.getElementById("assessmentForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const studentName = document.getElementById("studentName").value.trim();
  const selectedRole = jobRole.value;
  const questions = roleQuestions[selectedRole];

  let totalScore = 0;
  let feedbackHTML = "";
  let skillGaps = 0;

  questions.forEach((item, index) => {
    const selectedOption = document.querySelector(
      `input[name="question${index}"]:checked`
    );

    if (!selectedOption) {
      return;
    }

    const score = Number(selectedOption.value);
    totalScore += score;

    let feedback = "";

    if (score === 1) {
      feedback = "Needs improvement";
      skillGaps++;
    } else if (score === 2) {
      feedback = "Basic knowledge";
      skillGaps++;
    } else if (score === 3) {
      feedback = "Good understanding";
    } else {
      feedback = "Excellent";
    }

    feedbackHTML += `
      <div class="feedback-item">
        <strong>${item.skill}:</strong> ${feedback}
      </div>
    `;
  });

  const maximumScore = questions.length * 4;
  const percentage = Math.round((totalScore / maximumScore) * 100);

  document.getElementById("score").textContent = percentage + "%";
  document.getElementById("scoreBar").style.width = percentage + "%";
  document.getElementById("resultRole").textContent = selectedRole;
  document.getElementById("gapCount").textContent = skillGaps;
  document.getElementById("feedback").innerHTML = feedbackHTML;

  let summary = "";

  if (percentage >= 85) {
    summary = "Excellent work! You have a strong foundation for this career.";
  } else if (percentage >= 65) {
    summary = "Good job! You have a good foundation. Keep practising to improve.";
  } else if (percentage >= 40) {
    summary = "You are making progress. Focus on improving your basic skills.";
  } else {
    summary = "You are at the beginning of your journey. Start with the basics and practise regularly.";
  }

  document.getElementById("summary").textContent = summary;

  const suggestedProjects = projectSuggestions[selectedRole];

  document.getElementById("projects").innerHTML =
    suggestedProjects.map(project => `<li>${project}</li>`).join("");

  saveAssessmentHistory({
    name: studentName,
    role: selectedRole,
    score: percentage,
    date: new Date().toLocaleDateString()
  });

  document.getElementById("dashboard").scrollIntoView({
    behavior: "smooth"
  });
});

// ==========================================
// ASSESSMENT HISTORY USING LOCAL STORAGE
// ==========================================

function saveAssessmentHistory(result) {
  let history = JSON.parse(
    localStorage.getItem("skillBridgeHistory")
  ) || [];

  history.push(result);

  localStorage.setItem(
    "skillBridgeHistory",
    JSON.stringify(history)
  );
}

function displayHistory() {
  const historyList = document.getElementById("history");

  const history = JSON.parse(
    localStorage.getItem("skillBridgeHistory")
  ) || [];

  if (history.length === 0) {
    historyList.innerHTML = "<li>No assessment history available.</li>";
    return;
  }

  historyList.innerHTML = history.map(item => `
    <li>
      <strong>${escapeHTML(item.name)}</strong> -
      ${escapeHTML(item.role)} -
      ${item.score}% -
      ${escapeHTML(item.date)}
    </li>
  `).join("");
}

document.getElementById("historyButton").addEventListener("click", displayHistory);

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

function showMessage(elementId, message, type = "") {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = "status-message";

  if (type) {
    element.classList.add(type);
  }
}

function safeFileName(fileName) {
  return fileName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
}

function isValidHttpUrl(value) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

// ==========================================
// AUTHENTICATION: SIGN UP
// ==========================================

document.getElementById("signupForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const fullName = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  const button = this.querySelector("button");
  button.disabled = true;
  button.textContent = "Creating account...";

  try {
    const { data, error } = await supabaseClient.auth.signUp({
  email,
  password,
  options: {
  data: { full_name: fullName },
  emailRedirectTo: window.location.origin
}
});

    if (error) throw error;

    if (data.session) {
      showMessage("accountStatus", "Account created successfully!", "success");
    } else {
      showMessage(
        "accountStatus",
        "Account created. Please check your email to confirm your account, then log in.",
        "success"
      );
    }

    this.reset();

  } catch (error) {
    showMessage("accountStatus", error.message, "error");
  } finally {
    button.disabled = false;
    button.textContent = "Sign Up";
  }
});

// ==========================================
// AUTHENTICATION: LOG IN
// ==========================================

document.getElementById("loginForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const button = this.querySelector("button");
  button.disabled = true;
  button.textContent = "Logging in...";

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    currentUser = data.user;

    showMessage("accountStatus", "You are logged in successfully!", "success");

    this.reset();

    await updateAuthUI();

  } catch (error) {
    showMessage("accountStatus", error.message, "error");
  } finally {
    button.disabled = false;
    button.textContent = "Log In";
  }
});

// ==========================================
// AUTHENTICATION: LOG OUT
// ==========================================

document.getElementById("logoutButton").addEventListener("click", async function() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    showMessage("accountStatus", error.message, "error");
    return;
  }

  currentUser = null;

  showMessage("accountStatus", "You have logged out successfully.", "success");

  await updateAuthUI();
});

// ==========================================
// UPDATE AUTHENTICATION UI
// ==========================================

async function updateAuthUI() {
  const authForms = document.getElementById("authForms");
  const signedInPanel = document.getElementById("signedInPanel");
  const signedInEmail = document.getElementById("signedInEmail");

  if (currentUser) {
    authForms.hidden = true;
    signedInPanel.hidden = false;
    signedInEmail.textContent = currentUser.email || "User";

    await loadMyProjects();

  } else {
    authForms.hidden = false;
    signedInPanel.hidden = true;

    document.getElementById("myProjectsList").innerHTML =
      '<p class="muted">Log in to view your submissions.</p>';
  }
}

// ==========================================
// RESTORE USER SESSION
// ==========================================

async function checkUserSession() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    showMessage("accountStatus", error.message, "error");
  }

  currentUser = data.session ? data.session.user : null;

  await updateAuthUI();
}

supabaseClient.auth.onAuthStateChange((_event, session) => {
  currentUser = session ? session.user : null;
  updateAuthUI();
});

// ==========================================
// PROJECT UPLOAD
// ==========================================

document.getElementById("projectForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  if (!currentUser) {
    showMessage("uploadMessage", "Please log in before uploading a project.", "error");
    return;
  }

  const title = document.getElementById("projectTitle").value.trim();
  const category = document.getElementById("projectCategory").value;
  const description = document.getElementById("projectDescription").value.trim();
  const imageFile = document.getElementById("projectImage").files[0];
  const projectFile = document.getElementById("projectFile").files[0];
  const projectUrl = document.getElementById("projectUrl").value.trim();

  if (!imageFile || !projectFile) {
    showMessage("uploadMessage", "Please select both a project image and project file.", "error");
    return;
  }

  if (imageFile.size > 5 * 1024 * 1024) {
    showMessage("uploadMessage", "Project image must be smaller than 5 MB.", "error");
    return;
  }

  if (projectFile.size > 25 * 1024 * 1024) {
    showMessage("uploadMessage", "Project file must be smaller than 25 MB.", "error");
    return;
  }

  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedImageTypes.includes(imageFile.type)) {
    showMessage("uploadMessage", "Please upload a JPG, PNG or WebP image.", "error");
    return;
  }

  const allowedProjectTypes = [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed"
  ];

  const fileExtension = projectFile.name.split(".").pop().toLowerCase();

  if (
    !allowedProjectTypes.includes(projectFile.type) &&
    !["pdf", "zip"].includes(fileExtension)
  ) {
    showMessage("uploadMessage", "Please upload a PDF or ZIP project file.", "error");
    return;
  }

  if (!isValidHttpUrl(projectUrl)) {
    showMessage("uploadMessage", "Please enter a valid HTTP or HTTPS project link.", "error");
    return;
  }

  const button = this.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Uploading...";

  let uploadedPaths = [];

  try {
    const uniquePrefix = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const folderPath = currentUser.id;

    const imagePath =
      `${folderPath}/${uniquePrefix}_${safeFileName(imageFile.name)}`;

    const filePath =
      `${folderPath}/${uniquePrefix}_${safeFileName(projectFile.name)}`;

    // Upload project image
    const { error: imageError } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .upload(imagePath, imageFile, {
        cacheControl: "3600",
        upsert: false
      });

    if (imageError) throw imageError;

    uploadedPaths.push(imagePath);

    // Upload project file
    const { error: fileError } = await supabaseClient.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, projectFile, {
        cacheControl: "3600",
        upsert: false
      });

    if (fileError) throw fileError;

    uploadedPaths.push(filePath);

    // Get public URLs
    const { data: imageData } = supabaseClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(imagePath);

    const { data: fileData } = supabaseClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    const imageUrl = imageData.publicUrl;
    const fileUrl = fileData.publicUrl;

    // Save project details in Supabase table
    const { error: insertError } = await supabaseClient
      .from("projects")
      .insert({
        title: title,
        description: description,
        category: category,
        image_url: imageUrl,
        file_url: fileUrl,
        uploaded_by: currentUser.id,
        approval_status: "pending",
        project_url: projectUrl || null
      });

    if (insertError) throw insertError;

    showMessage(
      "uploadMessage",
      "Project submitted successfully! It is now waiting for approval.",
      "success"
    );

    this.reset();

    await loadMyProjects();

  } catch (error) {
    // Remove uploaded files if the database insert or another step fails
    if (uploadedPaths.length > 0) {
      await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .remove(uploadedPaths);
    }

    showMessage("uploadMessage", error.message, "error");

  } finally {
    button.disabled = false;
    button.textContent = "Submit Project";
  }
});

// ==========================================
// LOAD MY PROJECTS
// ==========================================

async function loadMyProjects() {
  const container = document.getElementById("myProjectsList");

  if (!currentUser) {
    container.innerHTML = '<p class="muted">Log in to view your submissions.</p>';
    return;
  }

  container.innerHTML = '<p class="muted">Loading your projects...</p>';

  const { data, error } = await supabaseClient
    .from("projects")
    .select("id, title, description, category, image_url, file_url, approval_status, created_at, project_url")
    .eq("uploaded_by", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML = `<p class="muted">Unable to load projects: ${escapeHTML(error.message)}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p class="muted">You have not uploaded any projects yet.</p>';
    return;
  }

  container.innerHTML = data.map(project => {
    const status = project.approval_status || "pending";
    const image = project.image_url
      ? `<img src="${escapeHTML(project.image_url)}" alt="${escapeHTML(project.title)}">`
      : "";

    const projectLink = project.project_url
      ? `<a href="${escapeHTML(project.project_url)}" target="_blank" rel="noopener noreferrer">View Project Link</a>`
      : "";

    const fileLink = project.file_url
      ? `<a href="${escapeHTML(project.file_url)}" target="_blank" rel="noopener noreferrer">Download Project File</a>`
      : "";

    return `
      <article class="project-card">
        ${image}
        <div class="project-card-body">
          <h3>${escapeHTML(project.title)}</h3>
          <div class="project-meta">
            <span class="category-tag">${escapeHTML(project.category)}</span>
            <span class="approval-tag ${escapeHTML(status)}">${escapeHTML(status)}</span>
          </div>
          <p>${escapeHTML(project.description)}</p>
          <div class="project-links">
            ${fileLink}
            ${projectLink}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ==========================================
// LOAD APPROVED PROJECTS FOR EXPLORE PAGE
// ==========================================

async function loadApprovedProjects() {
  const container = document.getElementById("exploreProjectsList");

  container.innerHTML = '<p class="muted">Loading approved projects...</p>';

  const { data, error } = await supabaseClient
    .from("projects")
    .select("id, title, description, category, image_url, file_url, created_at, project_url")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    container.innerHTML =
      `<p class="muted">Unable to load projects: ${escapeHTML(error.message)}</p>`;
    return;
  }

  allApprovedProjects = data || [];

  displayApprovedProjects();
}

// ==========================================
// DISPLAY APPROVED PROJECTS
// ==========================================

function displayApprovedProjects() {
  const container = document.getElementById("exploreProjectsList");

  const searchText = document.getElementById("projectSearch")
    .value.trim().toLowerCase();

  const selectedCategory = document.getElementById("categoryFilter").value;

  const filteredProjects = allApprovedProjects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchText) ||
      project.description.toLowerCase().includes(searchText);

    const matchesCategory =
      !selectedCategory || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (filteredProjects.length === 0) {
    container.innerHTML =
      '<p class="muted">No approved projects found. Try another search or category.</p>';
    return;
  }

  container.innerHTML = filteredProjects.map(project => {
    const image = project.image_url
      ? `<img src="${escapeHTML(project.image_url)}" alt="${escapeHTML(project.title)}">`
      : "";

    const projectLink = project.project_url
      ? `<a href="${escapeHTML(project.project_url)}" target="_blank" rel="noopener noreferrer">View Project Link</a>`
      : "";

    const fileLink = project.file_url
      ? `<a href="${escapeHTML(project.file_url)}" target="_blank" rel="noopener noreferrer">Download Project File</a>`
      : "";

    return `
      <article class="project-card">
        ${image}
        <div class="project-card-body">
          <h3>${escapeHTML(project.title)}</h3>
          <div class="project-meta">
            <span class="category-tag">${escapeHTML(project.category)}</span>
          </div>
          <p>${escapeHTML(project.description)}</p>
          <div class="project-links">
            ${fileLink}
            ${projectLink}
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ==========================================
// SEARCH AND CATEGORY FILTER
// ==========================================

document.getElementById("projectSearch").addEventListener("input", displayApprovedProjects);

document.getElementById("categoryFilter").addEventListener("change", displayApprovedProjects);

document.getElementById("refreshProjects").addEventListener("click", loadApprovedProjects);

// ==========================================
// INITIAL PAGE LOAD
// ==========================================

async function initializeSkillBridge() {
  if (
    SUPABASE_URL === "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE" ||
    SUPABASE_ANON_KEY === "PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE"
  ) {
    showMessage(
      "accountStatus",
      "Add your Supabase Project URL and publishable/anon key in script.js to enable accounts and project uploads.",
      "error"
    );

    document.getElementById("exploreProjectsList").innerHTML =
      '<p class="muted">Connect Supabase to view approved projects.</p>';

    return;
  }

  await checkUserSession();
  await loadApprovedProjects();
}

initializeSkillBridge();