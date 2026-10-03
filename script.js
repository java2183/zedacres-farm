const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const mobileNavigation = window.matchMedia("(max-width: 900px)");

function closeMenu(returnFocus = false) {
  if (!menuToggle || !navigation) return;
  navigation.dataset.open = "false";
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  if (returnFocus) menuToggle.focus();
}

if (menuToggle && navigation) {
  navigation.dataset.open = "false";

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    navigation.dataset.open = String(!isOpen);
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a") && mobileNavigation.matches) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });

  mobileNavigation.addEventListener("change", () => closeMenu());
}

const filterButtons = document.querySelectorAll(".filter-button");
const galleryItems = document.querySelectorAll(".gallery-item");
const videoCards = document.querySelectorAll(".video-card");

for (const card of videoCards) {
  const video = card.querySelector(".gallery-video");
  const playButton = card.querySelector(".video-play-button");
  const poster = card.querySelector(".video-frame > img");
  const source = card.dataset.videoSrc?.trim();

  if (!video || !playButton || !poster || !source) continue;

  playButton.disabled = false;
  playButton.setAttribute("aria-label", `Watch ${video.getAttribute("aria-label")}`);
  playButton.querySelector(".video-status")?.remove();
  video.src = source;

  playButton.addEventListener("click", () => {
    poster.hidden = true;
    playButton.hidden = true;
    video.hidden = false;
    video.focus();
  });
}

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    for (const filterButton of filterButtons) {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    }

    for (const item of galleryItems) {
      const matchesFilter = filter === "all"
        || (filter === "videos"
          ? item.classList.contains("video-card")
          : !item.classList.contains("video-card") && item.dataset.category === filter);
      item.hidden = !matchesFilter;
    }
  });
}

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const assistant = document.querySelector(".farm-assistant");
const assistantPanel = document.querySelector("#assistant-panel");
const assistantLauncher = document.querySelector(".assistant-launcher");
const assistantClose = document.querySelector(".assistant-close");
const assistantForm = document.querySelector(".assistant-form");
const assistantInput = document.querySelector("#assistant-input");
const assistantMessages = document.querySelector(".assistant-messages");

if (
  assistant && assistantPanel && assistantLauncher && assistantClose
  && assistantForm && assistantInput && assistantMessages
) {
  const quizQuestions = [
    {
      question: "Which activities does the farm feature on this website?",
      options: [
        ["Fish farming, crops, livestock and agricultural training", true],
        ["Fish farming and crops only", false],
        ["Livestock and training only", false],
      ],
      explanation: "The website describes fish farming, crops, livestock and agricultural training.",
    },
    {
      question: "Where does the website say the farm is located?",
      options: [
        ["Chipata, Eastern Province, Zambia", true],
        ["The location is not listed", false],
      ],
      explanation: "The listed location is Chipata, Eastern Province, Zambia.",
    },
    {
      question: "Does the website list confirmed training dates and fees?",
      options: [
        ["Yes, both are listed", false],
        ["No, details have not been listed yet", true],
      ],
      explanation: "Training is offered, but dates and fees are not listed. Contact the farm to ask.",
    },
  ];
  let quizIndex = -1;
  let quizScore = 0;

  function openAssistant() {
    assistantPanel.hidden = false;
    assistantLauncher.setAttribute("aria-expanded", "true");
    assistantInput.focus();
  }

  function closeAssistant(returnFocus = false) {
    assistantPanel.hidden = true;
    assistantLauncher.setAttribute("aria-expanded", "false");
    if (returnFocus) assistantLauncher.focus();
  }

  function addMessage(text, sender = "bot") {
    const message = document.createElement("div");
    message.className = `assistant-message assistant-message-${sender}`;
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    message.append(paragraph);
    assistantMessages.append(message);
    message.scrollIntoView({ block: "nearest" });
    return message;
  }

  function addWhatsAppHandoff(topic = "general") {
    const trainingEnquiry = topic === "training";
    const body = trainingEnquiry
      ? "Hello Zedacres Farm. I would like to ask about agricultural training. Could you please share any confirmed course details, dates and fees? Thank you."
      : "Hello Zedacres Farm. I would like to ask about the farm. Could you please share more information? Thank you.";
    const message = addMessage(
      "You can review and send an enquiry in WhatsApp. This link opens a message to the supplied farm number; it only works if that number is registered on WhatsApp.",
    );
    const link = document.createElement("a");
    link.className = "assistant-whatsapp-link";
    link.href = `https://wa.me/260773720056?text=${encodeURIComponent(body)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = trainingEnquiry ? "Prepare training enquiry in WhatsApp" : "Prepare farm enquiry in WhatsApp";
    message.append(link);
  }

  function addQuizChoices() {
    const choices = document.createElement("div");
    choices.className = "assistant-quiz-choices";
    for (const [label, isCorrect] of quizQuestions[quizIndex].options) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => {
        choices.querySelectorAll("button").forEach((option) => {
          option.disabled = true;
        });
        addMessage(label, "user");
        quizScore += Number(isCorrect);
        addMessage(`${isCorrect ? "Correct!" : "Not quite."} ${quizQuestions[quizIndex].explanation}`);
        choices.remove();
        quizIndex += 1;
        showQuizQuestion();
      });
      choices.append(button);
    }
    assistantMessages.append(choices);
    choices.scrollIntoView({ block: "nearest" });
  }

  function showQuizQuestion() {
    if (quizIndex >= quizQuestions.length) {
      addMessage(`Quiz complete! You got ${quizScore} out of ${quizQuestions.length}. Ask for another quiz to play again.`);
      quizIndex = -1;
      return;
    }

    addMessage(`Question ${quizIndex + 1} of ${quizQuestions.length}: ${quizQuestions[quizIndex].question}`);
    addQuizChoices();
  }

  function respond(question) {
    const text = question.toLowerCase();

    if (/\b(quiz|trivia|test me)\b/.test(text)) {
      quizIndex = 0;
      quizScore = 0;
      showQuizQuestion();
      return "";
    }
    if (/\b(joke|make me laugh|funny)\b/.test(text)) {
      return "Why did the farmer get an award? Because the work was outstanding in its field!";
    }
    if (/\b(fact|interesting|did you know)\b/.test(text)) {
      return "Farm fact: Zedacres Farm brings fish farming, crops, livestock and agricultural training together.";
    }
    if (/\b(training|course|courses|fee|fees|price|cost|date|dates|schedule)\b/.test(text)) {
      return "Zedacres Farm offers agricultural training. Dates, fees and course details are not listed here yet. Contact the farm at 0773720056 or zedacres@gmail.com to ask.";
    }
    if (/\b(where|location|located|address|chipata|province)\b/.test(text)) {
      return "Zedacres Farm is in Chipata, Eastern Province, Zambia.";
    }
    if (/\b(contact|phone|call|email|reach)\b/.test(text)) {
      return "Contact Zedacres Farm by phone at 0773720056 or email zedacres@gmail.com.";
    }
    if (/\b(fish|crop|crops|livestock|farm|farming|activities|do|work|services)\b/.test(text)) {
      return "The farm focuses on fish farming, crops, livestock and agricultural training.";
    }
    if (/\b(hello|hi|hey|good morning|good afternoon)\b/.test(text)) {
      return "Hello! I can share details listed on the site or offer a quiz, farm fact or joke. I'm a scripted demo, not a live AI.";
    }
    return "I'm a limited scripted demo, so I can only answer questions covered by the website. Try asking about farm activities, training, location or contact details, or ask for a quiz, fact or joke.";
  }

  function sendMessage(text) {
    const question = text.trim();
    if (!question) return;
    if (quizIndex >= 0) {
      assistantMessages.querySelector(".assistant-quiz-choices")?.remove();
      quizIndex = -1;
      addMessage("Quiz paused. You can continue with your question.");
    }
    addMessage(question, "user");
    const answer = respond(question);
    if (answer) {
      addMessage(answer);
      const normalized = question.toLowerCase();
      const askingForQuiz = /\b(quiz|trivia|test me)\b/.test(normalized);
      if (!askingForQuiz && /\b(training|course|courses|fee|fees|price|cost|date|dates|schedule)\b/.test(normalized)) {
        addWhatsAppHandoff("training");
      } else if (!askingForQuiz && /\b(contact|phone|call|email|reach|whatsapp)\b/.test(normalized)) {
        addWhatsAppHandoff();
      }
    }
  }

  assistantLauncher.addEventListener("click", () => {
    if (assistantPanel.hidden) openAssistant();
    else closeAssistant();
  });
  assistantClose.addEventListener("click", () => closeAssistant(true));
  assistantMessages.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const suggestion = event.target.closest(".assistant-suggestions button");
    if (!suggestion) return;
    sendMessage(suggestion.textContent || "");
    assistantInput.focus();
  });
  assistantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(assistantInput.value);
    assistantInput.value = "";
    assistantInput.focus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !assistantPanel.hidden) closeAssistant(true);
  });
}

const accountTabs = document.querySelectorAll(".account-tab, .account-switch");
const accountPanels = {
  login: document.querySelector("#login-panel"),
  signup: document.querySelector("#signup-panel"),
};

function showAccountPanel(mode, moveFocus = true) {
  const selectedPanel = accountPanels[mode];
  if (!selectedPanel) return;

  for (const [panelMode, panel] of Object.entries(accountPanels)) {
    if (panel) panel.hidden = panelMode !== mode;
  }

  for (const tab of document.querySelectorAll(".account-tab")) {
    const isActive = tab.dataset.accountTab === mode;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  }

  if (moveFocus) selectedPanel.querySelector("input")?.focus();
}

for (const tab of accountTabs) {
  tab.addEventListener("click", () => {
    showAccountPanel(tab.dataset.accountTab);
  });
}

for (const form of document.querySelectorAll(".account-form")) {
  const submitButton = form.querySelector(".account-submit");
  const status = form.querySelector(".account-status");
  const password = form.querySelector('[name="password"]');
  const confirmPassword = form.querySelector('[name="password-confirm"]');

  if (!submitButton || !status || !password) continue;

  form.addEventListener("input", () => {
    status.hidden = true;
    status.textContent = "";
  });

  if (confirmPassword) {
    const validatePasswordConfirmation = () => {
      confirmPassword.setCustomValidity(
        confirmPassword.value && confirmPassword.value !== password.value
          ? "The demo passwords do not match."
          : "",
      );
    };
    password.addEventListener("input", validatePasswordConfirmation);
    confirmPassword.addEventListener("input", validatePasswordConfirmation);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = form.dataset.accountMode === "signup"
      ? "This is a preview only. No account was created, and your details were not sent or saved. Contact the farm if you would like to get involved."
      : "Visitor sign-in is not available yet. This demo did not send or save your details.";
    status.hidden = false;
    form.reset();
  });

  submitButton.disabled = false;
}
