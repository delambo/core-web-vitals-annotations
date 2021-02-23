
<h1 align="center">Chrome Extension: Core Web Vitals Annotations</h1>

<p align="center"><img src="src/public/images/logo-128x128.png/?raw=true"></p>

## About
This extension will overlay annotations onto your website to highlight page attributes that had an impact on the [Core Web Vitals](https://web.dev/vitals/) performance metrics, First Input Delay ([FID](https://web.dev/fid/)), Largest Contentful Paint ([LCP](https://web.dev/lcp/)) and Cumulative Layout Shift ([CLS](https://web.dev/cls/)). It also reports the Core Web Vitals metrics for a page, using [Google's recommended color-coded thresholds](https://web.dev/defining-core-web-vitals-thresholds/).
  
  
![Core Web Vitals Annotations example](readme-images/example-1280x800.png/?raw=true "Core Web Vitals Annotations example")
  
Two types of annotations will be overlaid onto elements of a webpage:

  1. Elements that had layout shift and contributed to the Cumulative Layout Shift score. Depending on the severity of the shift, the annotations will be color coded from lowest impact to highest - yellow -> orange -> dark orange -> red. In the upper left hand corner of each annotation you will find the shift score.

  2. The element with the Largest Contentful Paint will be highlighted with a dashed purple annotation. It will include the paint time in the upper left hand corner of the annotation.

The extension popup should open a grid with the FID, LCP and CLS metric timings. At the bottom of the popup is a button to remove the annotations from the website.

## Performance Analysis
Except for the Largest Contentful Paint, the Core Web Vitals metrics are user initiated. Take note of the following when you use the plugin and analyze the performance of your website:

  - The First Input Delay is captured after a user clicks or taps a key on the webpage. If you open the extension before one of those actions, then you will notice that the metric is missing from the grid. To get the First Input Delay, close the extension, make a user action on the page, and then reopen.

  -  Cumulative Layout Shift is an accumulation of shifts on the page. As you scroll through the page, you may see additional shifts and the extension will add new annotations dynamically. The popup grid that reports the total score will also increase as more shifts accrue.

  - Cumulative Layout Shift annotations highlight an element that moved, **not necessarily the element that caused the shift**. For example, if an ad loads on the page, it may push some elements below it downward, causing a shift. The elements below the ad will likely be highlighted, and possibly the ad.

  - Given the ad example above, multiple elements on the page may have been shifted after the ad loaded. In that case, only one shift score will be recorded, but all of the affected elements will be highlighted with an annotation. In this case, you should see an arrow (↳) next to the annotated shift score which denotes a grouping of elements that shifted together.

[Read more about how to improve CLS](https://web.dev/cls/#how-to-improve-cls)  
[Read more about how to improve FID](https://web.dev/fid/#how-to-improve-fid)  
[Read more about how to improve LCP](https://web.dev/lcp/#how-to-improve-lcp)  
[More details on Layout Shift](https://github.com/WICG/layout-instability)  

## Setup

```
npm install
```

## Development
- startup development: `npm run dev`
- in your Chrome browser navigate to: `chrome://extensions/`
- if the extension is already loaded the click the reload/update button, otherwise find the "Load Unpacked" button and select the local `core-web-vitals-annotations/build/public` directory
- load a webpage
- locate the new extension icon in the Chrome bar and left click and select Inspect Popup

Hot reloading may not work. Reload after you save extension code and the build is successful.
