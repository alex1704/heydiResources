let beforeSubmitCount = 0;

function getTextArea() {
  let areas = document.querySelectorAll('.ProseMirror.break-words');
  if (areas.length > 1) {
    return areas[1];
  } else {
    return areas[0];
  }
}

function extractLastAssistantMessageElements() {
  return Array.from(document.querySelectorAll('.font-claude-message'));
}

function responseFooterElements() {
  return Array.from(document.querySelectorAll('.flex.items-center.bg-bg-000'));
}

function appendToTextAreaValue(value) {
  let element = getTextArea();
  element.textContent += value;
}

function submitTextArea() {
  beforeSubmitCount = extractLastAssistantMessageElements().length;
  let buttonContainers = document.querySelectorAll('.grid.grid-flow-col');
  if (buttonContainers.length > 1) {
    buttonContainers[1].querySelector('button').click();
  } else {
    buttonContainers[0].querySelector('button').click();
  }
}

function isResponseReady() {
  let msgCount = extractLastAssistantMessageElements().length;
  if (beforeSubmitCount === msgCount) {
    return false;
  }

  return responseFooterElements().length === msgCount;
}

function scrollDown() {
  let bottomAnchor = document.querySelector('.transition-transform.duration-300');
  if (bottomAnchor !== null) {
    bottomAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function extractLastAssistantMessage() {
  let assistantMessages = extractLastAssistantMessageElements();

  if (assistantMessages.length == 0) {
    return "";
  } else {
    let lastItem = assistantMessages[assistantMessages.length - 1];
    let clonedElement = lastItem.cloneNode(true);

    let childrenToRemove = clonedElement.querySelectorAll('.code-block');
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
/* subscribe bottom */
.absolute.bottom-full.left-0.w-full.text-center {
  display: none;
}

/* top right hover */
.text-accent-pro-000.font-semibold.group-hover\\:underline {
  display: none;
}

/* subscribe link */
a[href^="/settings/billing"] {
  display: none;
}
`;

  let style = document.createElement('style');
  style.innerHTML = cssContent;
  document.head.appendChild(style);
})();
