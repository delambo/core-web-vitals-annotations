import React, { Component } from 'react';
import { render } from 'react-dom';
import * as styles from './styled';

class Popup extends Component {
  componentDidCatch(error, info) {
    console.log('Caught an error :/', error, info);
  }

  constructor() {
    super();
    this.state = {
      CLS: null,
      LCP: null,
      FID: null,
    };
    this.loadContentScript();
  }

  // Load the content scripts on demand for the current tab after the popup is opened.
  // Doing it ondemand eases up Chrome Extension permissions/makes it easier to publish.
  // This is typically done via message passing to a background script, but doing it
  // here seemed way simpler for now.
  // eslint-disable-next-line class-methods-use-this
  loadContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // pulled from node_modules by kyt.config into build directory
      chrome.tabs.executeScript(tabs[0].id, { file: 'web-vitals.umd.js' });
      // script in src/public
      chrome.tabs.executeScript(tabs[0].id, { file: 'lodash.debounce-throttle.js' });
      // pulled from src/conrtentScript.js by kyt.config into build directory
      chrome.tabs.executeScript(tabs[0].id, { file: 'contentScript.js' });
      // static file in src/public
      chrome.tabs.insertCSS(tabs[0].id, { file: 'contentScript.css' }, () => {
        chrome.tabs.sendMessage(tabs[0].id, { getCoreVitals: true });
      });
    });
  }

  componentDidMount() {
    const that = this;
    chrome.runtime.onMessage.addListener((request) => {
      // Listen for core web vitals events from the contentScript
      if (request && request && request.CWV) {
        console.log('POPUP recieved CWV:', request.CWV);
        that.setState({ [request.CWV.name]: request.CWV.value });
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  clickRemoveBtn() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { removeAnnotations: true });
    });
  }

  renderCWV() {
    let { CLS, FID, LCP } = this.state;
    let clsClass = styles.cwvItemNoData;
    let fidClass = styles.cwvItemNoData;
    let lcpClass = styles.cwvItemNoData;

    if (LCP) {
      if (LCP <= 2500) lcpClass = styles.goodItem;
      else if (LCP > 4000) lcpClass = styles.badItem;
      else lcpClass = styles.impItem;
      LCP = `${(LCP / 1000).toFixed(2)}s`;
    }
    if (FID) {
      if (FID <= 100) fidClass = styles.goodItem;
      else if (FID > 300) fidClass = styles.badItem;
      else fidClass = styles.impItem;
      FID = `${FID.toFixed(2)}ms`;
    }
    if (CLS) {
      if (CLS <= 0.1) clsClass = styles.goodItem;
      else if (CLS > 0.25) clsClass = styles.badItem;
      else clsClass = styles.impItem;
      CLS = CLS.toFixed(4);
    }

    return (
      <ul className={`${styles.cwvReport}`}>
        <li className={`${styles.cwvItem} ${fidClass}`}>FID: {FID || 'no data'}</li>
        <li className={`${styles.cwvItem} ${lcpClass}`}>LCP: {LCP || 'no data'}</li>
        <li className={`${styles.cwvItem} ${clsClass}`}>CLS: {CLS || 'no data'}</li>
      </ul>
    );
  }

  render() {
    return (
      <div className={`${styles.popupClass} ${styles.popupSize}`}>
        {this.renderCWV()}
        <button type="button" className={styles.removeAnnotationsBtn} onClick={this.clickRemoveBtn}>
          Remove Annotations
        </button>
      </div>
    );
  }
}

const root = document.querySelector('#root');

render(<Popup />, root);
