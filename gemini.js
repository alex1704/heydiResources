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
  if (document.querySelector('.animated-line-inner') !== null) {
    return true;
  } else {
    let avatars = document.querySelectorAll('bard-avatar');
    if (avatars.length > 0) {
      return avatars[avatars.length - 1].querySelectorAll('img[src$=".gif"').length != 0;
    } else {
      return false;
    }
  }
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
  let footers = document.querySelectorAll('.response-container-footer');
  if (footers.length > 0) {
    let element = footers[footers.length - 1];
    element.scrollIntoView({ behavior: "smooth", block: "start" });
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
