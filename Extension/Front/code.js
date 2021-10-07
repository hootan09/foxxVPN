const directHostsTextArea = document.querySelector("#direct-hosts");
const connectBTN = document.querySelector("#connectButton");
const proxyHostInput = document.querySelector("#proxy-host");
const proxyPortInput = document.querySelector("#proxy-port");

// clicked connect button
connectBTN.addEventListener("click", ()=>{
  browser.storage.local.get("connected", ({connected})=> {
    browser.storage.local.set({connected: !connected});
    setConnectBtn(!connected);
    browser.runtime.sendMessage({"connected": !connected});
  })
});

directHostsTextArea.addEventListener("change", ()=>{
  browser.storage.local.set({directHosts: directHostsTextArea.value.split("\n")});
});

function setConnectBtn (connected){
  connectBTN.style.background= connected ? "green" : "red";
  connectBTN.innerText = connected ? "disconnect" : "Connect";
}

//UI Update

// Update the options UI with the settings values retrieved from storage,
// or the default settings if the stored settings are empty.
function updateUI(settings) {
  directHostsTextArea.value = settings.directHosts.join("\n");

  proxyHostInput.value = settings.proxyData.host;
  proxyPortInput.value = settings.proxyData.port;

  setConnectBtn(settings.connected);
}

function onError(e) {
  console.error(e);
}

// On opening the options page, fetch stored settings and update the UI with them.
browser.storage.local.get().then(updateUI, onError);

