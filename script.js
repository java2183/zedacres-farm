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
const accountTabBar = document.querySelector(".account-tabs");
const accountServiceStatus = document.querySelector("#account-service-status");
const accountPrivacyNote = document.querySelector("#account-privacy-note");
const accountSession = document.querySelector("#account-session");
const accountSessionEmail = document.querySelector("#account-session-email");
const accountSessionInterest = document.querySelector("#account-session-interest");
const accountSessionStatus = document.querySelector("#account-session-status");
const accountSignOut = document.querySelector("#account-signout");
const accountResetButton = document.querySelector("#account-reset-password");
const recoveryPanel = document.querySelector("#recovery-panel");
const accountPanels = {
  login: document.querySelector("#login-panel"),
  signup: document.querySelector("#signup-panel"),
};

function setAccountServiceStatus(message, isError = false) {
  if (!accountServiceStatus) return;
  accountServiceStatus.textContent = message;
  accountServiceStatus.classList.toggle("is-error", isError);
}

function showAccountPanel(mode, moveFocus = true) {
  const selectedPanel = accountPanels[mode];
  if (!selectedPanel) return;

  for (const [panelMode, panel] of Object.entries(accountPanels)) {
    if (panel) panel.hidden = panelMode !== mode;
  }
  if (recoveryPanel) recoveryPanel.hidden = true;

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

const accountForms = [...document.querySelectorAll(".account-form")];

for (const form of accountForms) {
  const status = form.querySelector(".account-status");
  const password = form.querySelector('[name="password"]');
  const confirmPassword = form.querySelector('[name="password-confirm"]');

  form.addEventListener("input", () => {
    if (status) {
      status.hidden = true;
      status.textContent = "";
    }
  });

  if (password && confirmPassword) {
    const validatePasswordConfirmation = () => {
      confirmPassword.setCustomValidity(
        confirmPassword.value && confirmPassword.value !== password.value
          ? "The passwords do not match."
          : "",
      );
    };
    password.addEventListener("input", validatePasswordConfirmation);
    confirmPassword.addEventListener("input", validatePasswordConfirmation);
  }
}

function getAccountRedirectUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function isServiceRoleKey(key) {
  if (/service[_-]?role|^sb_secret_/i.test(key)) return true;
  const jwtPayload = key.split(".")[1];
  if (!jwtPayload) return false;

  try {
    const base64 = jwtPayload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))).role === "service_role";
  } catch {
    return false;
  }
}

function showAuthenticatedUser(session) {
  if (!accountSession) return;
  const user = session?.user;
  const isSignedIn = Boolean(user);

  if (accountSessionEmail) {
    accountSessionEmail.textContent = user?.email || "";
  }
  if (accountSessionInterest) {
    const interestLabels = {
      "fish-farming": "Fish farming",
      crops: "Crops",
      livestock: "Livestock",
      training: "Agricultural training",
    };
    const interest = interestLabels[user?.user_metadata?.farming_interest];
    accountSessionInterest.textContent = interest ? `Your interest: ${interest}` : "";
    accountSessionInterest.hidden = !interest;
  }

  accountSession.hidden = !isSignedIn;
  if (accountTabBar) accountTabBar.hidden = isSignedIn;
  for (const panel of Object.values(accountPanels)) {
    if (panel) panel.hidden = isSignedIn || panel.id !== "login-panel";
  }
  if (recoveryPanel) recoveryPanel.hidden = true;
}

async function enableAccountService() {
  const config = window.ZEDACRES_AUTH_CONFIG;
  const hasConfig = typeof config?.url === "string"
    && typeof config?.anonKey === "string"
    && config.url.trim()
    && config.anonKey.trim()
    && !/YOUR_|REPLACE_ME/i.test(config.url + config.anonKey);

  if (!hasConfig) {
    setAccountServiceStatus(
      "Secure sign-in is not configured yet. The farm must connect its authentication service before visitor accounts are available.",
    );
    return;
  }
  if (isServiceRoleKey(config.anonKey.trim())) {
    setAccountServiceStatus(
      "Account setup was blocked because the key looks like a private service-role key. Configure only the public publishable or anon key.",
      true,
    );
    return;
  }

  let serviceUrl;
  try {
    serviceUrl = new URL(config.url);
  } catch {
    setAccountServiceStatus("Account service setup is incomplete. The configured project URL is invalid.", true);
    return;
  }

  const isLocalDevelopment = ["localhost", "127.0.0.1"].includes(serviceUrl.hostname);
  if (serviceUrl.protocol !== "https:" && !isLocalDevelopment) {
    setAccountServiceStatus("Account service setup is incomplete. A secure HTTPS project URL is required.", true);
    return;
  }

  setAccountServiceStatus("Connecting to the secure account service…");
  try {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    const authClient = createClient(serviceUrl.toString(), config.anonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });

    for (const form of accountForms) {
      for (const control of form.elements) control.disabled = false;
    }
    if (accountResetButton) accountResetButton.disabled = false;
    if (accountTabBar) accountTabBar.hidden = false;
    if (accountPrivacyNote) accountPrivacyNote.hidden = false;
    if (accountServiceStatus) accountServiceStatus.hidden = true;
    showAccountPanel("login", false);

    for (const form of accountForms) {
      const submitButton = form.querySelector(".account-submit");
      const status = form.querySelector(".account-status");
      if (!submitButton || !status) continue;

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        submitButton.disabled = true;
        status.hidden = true;
        status.textContent = "";
        const formData = new FormData(form);

        try {
          if (form.id === "recovery-form") {
            const { error } = await authClient.auth.updateUser({
              password: String(formData.get("password") || ""),
            });
            if (error) throw error;
            form.reset();
            status.textContent = "Your password has been updated. You are signed in.";
            status.hidden = false;
            return;
          }

          if (form.dataset.accountMode === "signup") {
            const { data, error } = await authClient.auth.signUp({
              email: String(formData.get("email") || ""),
              password: String(formData.get("password") || ""),
              options: {
                data: {
                  full_name: String(formData.get("name") || "").trim(),
                  farming_interest: String(formData.get("interest") || ""),
                },
                emailRedirectTo: getAccountRedirectUrl(),
              },
            });
            if (error) throw error;
            form.reset();
            status.textContent = data.session
              ? "Your account is ready. You are signed in."
              : "Check your email for a confirmation link to finish creating your account. If it does not arrive, check your spam folder.";
            status.hidden = false;
            return;
          }

          const { error } = await authClient.auth.signInWithPassword({
            email: String(formData.get("email") || ""),
            password: String(formData.get("password") || ""),
          });
          if (error) throw error;
          form.reset();
        } catch (error) {
          status.textContent = error instanceof Error
            ? error.message
            : "The account request could not be completed. Please try again.";
          status.hidden = false;
        } finally {
          submitButton.disabled = false;
        }
      });
    }

    accountResetButton?.addEventListener("click", async () => {
      const emailInput = document.querySelector("#login-email");
      const status = accountPanels.login?.querySelector(".account-status");
      if (!(emailInput instanceof HTMLInputElement) || !status) return;
      if (!emailInput.reportValidity()) {
        emailInput.focus();
        return;
      }

      accountResetButton.disabled = true;
      status.hidden = true;
      try {
        const { error } = await authClient.auth.resetPasswordForEmail(emailInput.value.trim(), {
          redirectTo: getAccountRedirectUrl(),
        });
        if (error) throw error;
        status.textContent = "If an account exists for that email, a password-reset link has been sent.";
        status.hidden = false;
      } catch (error) {
        status.textContent = error instanceof Error
          ? error.message
          : "The password-reset request could not be completed. Please try again.";
        status.hidden = false;
      } finally {
        accountResetButton.disabled = false;
      }
    });

    accountSignOut?.addEventListener("click", async () => {
      if (!accountSignOut) return;
      accountSignOut.disabled = true;
      if (accountSessionStatus) accountSessionStatus.hidden = true;
      try {
        const { error } = await authClient.auth.signOut();
        if (error) throw error;
      } catch (error) {
        if (accountSessionStatus) {
          accountSessionStatus.textContent = error instanceof Error
            ? error.message
            : "Sign out could not be completed. Please try again.";
          accountSessionStatus.hidden = false;
        }
      } finally {
        accountSignOut.disabled = false;
      }
    });

    authClient.auth.onAuthStateChange((event, session) => {
      showAuthenticatedUser(session);
      if (event === "PASSWORD_RECOVERY" && recoveryPanel) {
        if (accountTabBar) accountTabBar.hidden = true;
        for (const panel of Object.values(accountPanels)) {
          if (panel) panel.hidden = true;
        }
        accountSession.hidden = true;
        recoveryPanel.hidden = false;
        recoveryPanel.querySelector("input")?.focus();
      }
    });

    setAccountServiceStatus("Secure account service connected.");
    if (accountServiceStatus) accountServiceStatus.hidden = true;
  } catch {
    setAccountServiceStatus(
      "Could not connect to the account service. Check the project URL, public key, network connection, and allowed website URLs.",
      true,
    );
  }
}

enableAccountService();
