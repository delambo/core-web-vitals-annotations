# vi-chrome-extension

Sitting on Chrome

## Setup

```
npm ci
```

## Development
- startup development: `npm run dev`
- in your Chrome browser navigate to: `chrome://extensions/`
- if the extension is already loaded the click the reload/update button, otherwise find the "Load Unpacked" button and select the local `build/public` directory
- select a tab with a nytimes.com asset and relaod the page
- locate the new extension icon in the Chrome bar and give it a whirl

After saving changes to the `popup` code, I've seen "hot reloading" work after saving files and re-clicking the extension icon, but there's also an extension refresh button in the `chrome://extensions` interface.

Note, development should feel pretty similar to working in Vi. kyt is used under the hood so the linting and prettier rules are the same. Also, import aliases are also configured to for everything in the root of `src/*`.

## Debugging

Depending on what you need to debug -- background script, content script, or the popup -- you will need to open a chrome debugger pane for each one of the scripts, as they are sandboxed separately. 

### background script

Go to `chrome://extensions/` and find the plugin and click on the section that reads `Inspect views
background page`

### content script

After you navigate to a tab with a nytimes.com page, if you open the developer tools and reload the page, you should see that the contentScript logging there.

### popup

To debug the popup you can right-click on the popup and choose to inspect it from the context menu.