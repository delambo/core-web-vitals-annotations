/* eslint-disable no-plusplus, no-loop-func, no-restricted-syntax, no-undef */
const layoutElementMemo = {};
let lcpData;

const appendCSS = (css) => {
  const style = document.createElement('style');
  style.innerText = css;
  style.classList.add('cls-styles');
  document.head.appendChild(style);
};

const borderContentCSS = (namespace, content, zIndex) => `
  .cls-border-${namespace}:after {
    content: '${content || ''}';
    z-index: ${zIndex};
    color: white; text-shadow: 1px 1px 3px black;
    position: absolute; top: 0; left: 2px;
    font-size: 14px !important; font-family: nyt-franklin, helvetica, arial, sans-serif !important; font-kerning: normal !important; font-style: normal !important; font-weight: bold !important; text-transform: uppercase !important; }
`;

const findBestNodeToAnnotate = (node) => {
  if (!node) return node;
  // if it's a text node, return parent
  if (node.nodeType === 3) node = node.parentNode;
  if (node.tagName === 'TBODY') return node.closest('table');
  // Problems with setting border inset on images via pseudo class.
  // Grabbing a parent div may be too high in the tree :/
  if (node.tagName === 'IMG') return node.closest('div');
  if (node.tagName === 'IFRAME') {
    // We can't add pseudo styles to an iframe.
    // So we wrap the iframe with a div and put a border on that.
    // If the iframe is fixed/absolute then we need to copy some styles to overlay the wrapper.
    const wrapper = document.createElement('div');
    wrapper.class = 'cls-iframe-wrapper';
    if (node.style.position === 'fixed' || node.style.position === 'absolute') {
      ['height', 'width', 'position', 'top', 'bottom', 'left', 'right'].forEach(
        // eslint-disable-next-line no-return-assign
        (prop) => (wrapper.style[prop] = node.style[prop])
      );
      wrapper.style.zIndex = 10000000001;
      node.parentNode.insertBefore(wrapper, node.nextSibling || node);
    } else {
      node.parentNode.insertBefore(wrapper, node);
      wrapper.appendChild(node);
    }
    return wrapper;
  }
  return node;
};

const annotateLCP = () => {
  if (!lcpData) return;
  console.log('CWV Annotations: LCP:', lcpData);
  if (lcpData.entries.length) {
    const entry = lcpData.entries[lcpData.entries.length - 1];
    // Sometimes `element` does not exist, but `url` does and `url` is for img src
    const getElForURL = (url) => {
      if (!url) return null;
      const src = new URL(url);
      src.search = '';
      return document.querySelectorAll(`[src="${src.href}"]`)[0];
    };
    let el = entry.element || getElForURL(entry.url);
    const isImage = el && el.tagName === 'img';
    el = findBestNodeToAnnotate(el);
    if (el) {
      let content = `Paint${isImage ? ' (img)' : ''}: ${(lcpData.value / 1000).toFixed(2)}s`;
      if (layoutElementMemo[el]) {
        content = `${content} | ${layoutElementMemo[el].content}`;
      }
      appendCSS(borderContentCSS('lcp', content, 100000000000));
      el.classList.add('cls-border', 'cls-purple', 'cls-border-lcp');
    }
  }
};

const webVitalCallback = (data) => {
  const { name, value } = data;
  if (name === 'LCP') lcpData = data;
  if (name === 'FID') console.log('CWV Annotations: FID:', data);
  chrome.runtime.sendMessage({ CWV: { name, value } });
};

let clsScrollEventFn;

const addCLSAnnotations = () => {
  window.cumulativeLayoutShiftScore = 0;
  let namespaceCount = 0;
  let borderContentZIndex = 1000000;

  const getColor = (val) => {
    if (val < 0.001) return 'cls-yellow';
    if (val < 0.01) return 'cls-orange';
    if (val < 0.1) return 'cls-dark-orange';
    return 'cls-red';
  };

  const annotateCLS = () => {
    console.log('CWV Annotations: Annotating CLS');
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput && entry.entryType === 'layout-shift') {
          console.log(`CWV Annotations: Layout Shift: ${entry.value}`, entry);
          const hasNestedShifts = entry.sources.length > 1;
          entry.sources.forEach((source, index) => {
            let { node } = source;
            // What should we do when node is null (element was removed)? Notify the user?
            if (node === null) return;
            node = findBestNodeToAnnotate(node);
            const namespace = `${++namespaceCount}${index}`;
            const metadata = {
              namespace,
              clazz: `cls-border-${namespace}`,
              content: `${hasNestedShifts ? '↳' : ''}Shift: ${(entry.value || 0).toFixed(5)}`,
            };
            if (!layoutElementMemo[node]) {
              layoutElementMemo[node] = metadata;
            }
            node.classList.add('cls-border', getColor(entry.value), metadata.clazz);
            appendCSS(
              borderContentCSS(metadata.namespace, metadata.content, ++borderContentZIndex)
            );
          });
          window.cumulativeLayoutShiftScore += entry.value;
        }
      }
      // Annotate LCP after CLS so that we can layer it in on top.
      annotateLCP();
      observer.disconnect();
    });

    observer.observe({
      type: 'layout-shift',
      buffered: true,
    });
  };

  annotateCLS();
  clsScrollEventFn = _.debounce(annotateCLS, 250);

  window.addEventListener('scroll', clsScrollEventFn, { passive: true });
};

const removeAnnotations = () => {
  window.removeEventListener('scroll', clsScrollEventFn, { passive: true });
  [].forEach.call(document.querySelectorAll('.cls-styles, .cls-iframe-wrapper'), (el) => {
    el.remove();
  });
  [].forEach.call(document.querySelectorAll('.cls-border'), (el) => {
    el.classList.remove('cls-border');
  });
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.getCoreVitals) {
    console.log('CWV Annotations: Loading...');
    webVitals.getCLS(webVitalCallback, { reportAllChanges: false });
    webVitals.getFID(webVitalCallback, { reportAllChanges: false });
    webVitals.getLCP(webVitalCallback, { reportAllChanges: false });
    addCLSAnnotations();
  } else if (message.removeAnnotations) {
    removeAnnotations();
  }
});
