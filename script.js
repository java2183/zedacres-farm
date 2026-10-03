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
  let quizAnswer = "";

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

  function addQuizChoices() {
    const choices = document.createElement("div");
    choices.className = "assistant-quiz-choices";
    for (const [answer, label] of [
      ["activities", "Fish, crops and livestock"],
      ["other", "Only one kind of farming"],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", () => {
        quizAnswer = "";
        addMessage(label, "user");
        choices.remove();
        addMessage(answer === "activities"
          ? "That's right! The site features fish farming, crops and livestock."
          : "Not quite. The site features fish farming, crops and livestock.");
      });
      choices.append(button);
    }
    assistantMessages.append(choices);
    choices.scrollIntoView({ block: "nearest" });
  }

  function respond(question) {
    const text = question.toLowerCase();

    if (quizAnswer) {
      return "Choose one of the quiz answers above to see how you did.";
    }
    if (/\b(quiz|trivia|test me)\b/.test(text)) {
      quizAnswer = "activities";
      addMessage("Quick farm quiz: Which activities are featured on this website?");
      addQuizChoices();
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
    addMessage(question, "user");
    const answer = respond(question);
    if (answer) addMessage(answer);
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
