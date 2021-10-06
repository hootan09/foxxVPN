// Initialize the list of Direct Hosts
directHosts= ["127.0.0.1", "localhost"];
proxyData= { host: "127.0.0.1", port: 3000 };
connected= false;

// Set the default list on installation.
browser.runtime.onInstalled.addListener(details => {
  browser.storage.local.set({
    directHosts,
    proxyData,
    connected
  });
});

// Get the stored Data from Storage
browser.storage.local.get(data => {
  if(data.directHosts)
    directHosts = data.directHosts;
  if(data.proxyData)
    proxyData = data.proxyData;
  if(data.connected)
    connected = data.connected;
});

// Listen for changes in the Storage Data
browser.storage.onChanged.addListener(changeData => {
  if(changeData.directHosts)
    directHosts = changeData.directHosts.newValue;
  if(changeData.proxyData)
    proxyData = changeData.proxyData.newValue;
  if(changeData.connected)
    connected = changeData.connected.newValue;;
});

// Managed the proxy

// Listen for a request to open a webpage
browser.proxy.onRequest.addListener(handleProxyRequest, {urls: ["<all_urls>"]});

// On the request to open a webpage
function handleProxyRequest(requestInfo) {
// Read the web address of the page to be visited 
  const url = new URL(requestInfo.url);
  // Determine whether the domain in the web address is on the blocked hosts list
  if (!connected || directHosts.indexOf(url.hostname) > -1) {
    // Return instructions to open the requested webpage
    return {type: "direct"};
  }
  // Write details of the proxied host to the console and return the proxy address
  console.log(`Proxying: ${url.hostname}`);
  const type = url.protocol.slice(0, -1);
  return {type: type, host: proxyData.host, port: proxyData.port};
}

// Log any errors from the proxy script
browser.proxy.onError.addListener(error => {
  console.error(`Proxy error: ${error.message}`);
});

/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
function notify(message) {
  console.log("background script received message");
  var title = browser.i18n.getMessage("notificationTitle");
  var content = browser.i18n.getMessage("notificationContent", message.connected ? "Connected": "Disconnected");
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.runtime.getURL(message.connected ? "images/green.svg" : "images/red.svg"),
    "title": title,
    "message": content
  });

  //change extensions icon
  browser.browserAction.setIcon({path: browser.runtime.getURL(message.connected ? "images/green.svg" : "images/red.svg")});
}
/*
Assign `notify()` as a listener to messages from the content script.
*/
browser.runtime.onMessage.addListener(notify);