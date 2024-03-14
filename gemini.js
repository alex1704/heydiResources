let beforeSubmitCount = 0;

function getTextArea() {
  return document.querySelector(".ql-editor.textarea");
}

function extractLastAssistantMessageElements() {
  return Array.from(document.querySelectorAll('.response-container-content'));
}

function responseFooterElements() {
  return Array.from(document.querySelectorAll('message-actions'));
}

function isAnimating() {
  return document.querySelector('.animated-line-inner') !== null;
}

function appendToTextAreaValue(value) {
  let element = getTextArea();
  element.textContent += value;
}

function submitTextArea() {
  beforeSubmitCount = extractLastAssistantMessageElements().length;
  document.querySelector("button.send-button").click();
}

function isResponseReady() {
  let msgCount = extractLastAssistantMessageElements().length;
  if (beforeSubmitCount === msgCount) {
    return false;
  }

  return !isAnimating();
}

function scrollDown() {
  let assistantMessages = extractLastAssistantMessageElements();
  if (assistantMessages.length > 0) {
    let element = assistantMessages[assistantMessages.length - 1];
    element.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}

function extractLastAssistantMessage() {
  let assistantMessages = extractLastAssistantMessageElements();

  if (assistantMessages.length == 0) {
    return "";
  } else {
    let lastItem = assistantMessages[assistantMessages.length - 1];
    let clonedElement = lastItem.cloneNode(true);

    let childrenToRemove = clonedElement.querySelectorAll('sources-list, .code-block, .attachment-container');
    childrenToRemove.forEach(function(child) {
      child.parentNode.removeChild(child);
    });

    clonedElement.id = "temp_test_id_xyz";
    document.body.appendChild(clonedElement);
    let out = clonedElement.innerText;
    clonedElement.remove();
    return out;
  }
}

(function iapCompliance() {
  let cssContent = `
/* accounts link */
a[href^="https://accounts.google.com/"] {
  pointer-events: none;
}

/* top right signin */
a[href^="https://accounts.google.com/ServiceLogin"] {
  display: none;
}

/* gemini picker button */
button[data-test-id="bard-mode-menu-button"] {
  pointer-events: none;
}

/* upgrade button */
upsell-button {
  display: none;
}
`;

  let style = document.createElement('style');
  style.innerHTML = cssContent;
  document.head.appendChild(style);
})();
