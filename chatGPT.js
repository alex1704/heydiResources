let textareaDescriptorCache = null;
let prototypeDescriptorCache = null;
let beforeSubmitCount = 0;

function getTextArea() {
  return document.getElementById("prompt-textarea");
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
  if (beforeSubmitCount === extractLastAssistantMessageElements().length) {
    return false;
  }

  let element = document.querySelector('[data-testid="send-button"]');
  let textArea = getTextArea(); // hidden on error
  return (element !== null || textArea === null)
}

function scrollDown() {
  let scrollButton = document.querySelector('.cursor-pointer.absolute.z-10');
  if (scrollButton) {
    scrollButton.click();
  }
}

function extractLastAssistantMessageElements() {
  return Array.from(document.querySelectorAll('div[data-message-author-role][data-message-id]')).filter(div => div.getAttribute('data-message-author-role') === 'assistant');
}

function extractLastAssistantMessage() {
  let assistantMessages = extractLastAssistantMessageElements();

  if (assistantMessages.length == 0) {
    return "";
  } else {
    let lastItem = assistantMessages[assistantMessages.length - 1];
    let root = lastItem.querySelector(".markdown");
    let clonedElement = root.cloneNode(true);

    let childrenToRemove = clonedElement.getElementsByTagName('pre');
    for (child of childrenToRemove) {
      child.parentNode.removeChild(child);
    }

    let text = "";
    for (child of clonedElement.children) {
      if (child.tagName == "OL") {
        let rows = child.querySelectorAll('li');
        for (row of rows) {
          text += row.textContent + "\n";
        }
      } else {
        text += child.textContent + "\n";
      }
    }

    return text;
  }
}
