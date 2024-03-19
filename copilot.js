let beforeSubmitCount = 0;

function shadowQuerySelectorAll(selector, rootNode=document.body) {
  const arr = []

  const traverser = node => {
    if(node.nodeType !== Node.ELEMENT_NODE) {
      return
    }

    if(node.matches(selector)) {
      arr.push(node)
    }

    const children = node.children
    if (children.length) {
      for(const child of children) {
        traverser(child)
      }
    }

    const shadowRoot = node.shadowRoot
    if (shadowRoot) {
      const shadowChildren = shadowRoot.children
      for(const shadowChild of shadowChildren) {
        traverser(shadowChild)
      }
    }
  }

  traverser(rootNode)

  return arr
}

function getTextArea() {
  return shadowQuerySelectorAll('cib-text-input')[0];
}

function appendToTextAreaValue(value) {
  let element = getTextArea();
  element.vm.value += value;
}

function submitTextArea() {
  beforeSubmitCount = extractLastAssistantMessageElements().length;
  let button = shadowQuerySelectorAll('.control.submit > button')[0];
  button.disabled = false;
  button.click();
}

function extractLastAssistantMessageElements() {
  return Array.from(shadowQuerySelectorAll('cib-message-group.response-message-group'));
}

function isActive() {
  return shadowQuerySelectorAll('button#stop-responding-button')[0].disabled === false;
}

function isResponseReady() {
  let msgCount = extractLastAssistantMessageElements().length;
  if (beforeSubmitCount === msgCount) {
    return false;
  }

  return !isActive();
}

function scrollDown() {
  let anchors = shadowQuerySelectorAll('cib-turn-counter');
  if (anchors.length > 0) {
    let anchor = anchors[anchors.length - 1];
    anchor.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function extractLastAssistantMessage() {
  let assistantMessages = extractLastAssistantMessageElements();

  if (assistantMessages.length == 0) {
    return "";
  } else {
    let lastItem = assistantMessages[assistantMessages.length - 1];
    let content = shadowQuerySelectorAll('.ac-container', lastItem)[0];
    let clonedElement = content.cloneNode(true);

    let childrenToRemove = clonedElement.querySelectorAll('cib-code-block, .entity-image-button, .citation-sup');
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
/* manage account */
a[href^="https://account.microsoft.com"] {
  /* display: none; */
  pointer-events: none;
}
`;

  let style = document.createElement('style');
  style.innerHTML = cssContent;
  document.head.appendChild(style);
})();
