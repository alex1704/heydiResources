let textareaDescriptorCache = null;
let prototypeDescriptorCache = null;
let beforeSubmitCount = 0;

function getTextArea() {
  return document.getElementsByTagName("textarea")[0];
}

function appendToTextAreaValue(value) {
  let element = getTextArea();

  if (!textareaDescriptorCache || !prototypeDescriptorCache) {
    textareaDescriptorCache = Object.getOwnPropertyDescriptor(element, 'value') || {};
    const prototype = Object.getPrototypeOf(element);
    prototypeDescriptorCache = Object.getOwnPropertyDescriptor(prototype, 'value') || {};
  }

  const { get: valueGetter, set: valueSetter } = textareaDescriptorCache;
  const { get: prototypeValueGetter, set: prototypeValueSetter } = prototypeDescriptorCache;

  if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
    const currentValue = prototypeValueGetter.call(element);
    prototypeValueSetter.call(element, currentValue + value);
  } else if (valueSetter) {
    const currentValue = valueGetter.call(element);
    valueSetter.call(element, currentValue + value);
  } else {
    throw new Error('The given element does not have a value setter');
  }

  element.dispatchEvent(new Event('input', { bubbles: true }));
}

function submitTextArea() {
  beforeSubmitCount = extractLastAssistantMessageElements().length;
  let element = getTextArea();
  let siblingButtons = element.parentElement.querySelectorAll("button");
  siblingButtons[siblingButtons.length - 1].click();
}

function isResponseReady() {
  let msgCount = extractLastAssistantMessageElements().length;
  if (beforeSubmitCount === msgCount) {
    return false;
  }

  return document.querySelectorAll('[data-icon="clipboard"]').length === msgCount;
}

function scrollDown() {
  // window.scrollBy({ top: window.innerHeight * 2, behavior: 'smooth' });
}

function extractLastAssistantMessageElements() {
  return Array.from(document.querySelectorAll('div[dir="auto"]'))
}

function extractLastAssistantMessage() {
  let assistantMessages = extractLastAssistantMessageElements();

  if (assistantMessages.length == 0) {
    return "";
  } else {
    let lastItem = assistantMessages[assistantMessages.length - 1];
    let clonedElement = lastItem.cloneNode(true);

    let childrenToRemove = clonedElement.querySelectorAll('.citation.ml-xs.inline, .relative.codeWrapper.my-md');
    childrenToRemove.forEach(function(child) {
      child.parentNode.removeChild(child);
    });

    return clonedElement.textContent.trim();
  }
}

(function iapCompliance() {
  let cssContent = `
/* try pro */
.px-md.pb-sm.border-borderMain\\/50 {
  display: none;
}

/* account */
[href="/settings/account"] {
  display: none;
}

/* pro */
[href="/pro"] {
  display: none;
}

/* playground */
[href="https://labs.perplexity.ai"] {
  display: none;
}

/* copilot purchase popup */
.bg-background.dark\\:bg-backgroundDark.shadow-md.overflow-auto.md\\:rounded-lg {
  display: none;
}

/* signup */
button.bg-super.dark\\:bg-superDark {
  display: none;
}
`;

  let style = document.createElement('style');
  style.innerHTML = cssContent;
  document.head.appendChild(style);
})();

