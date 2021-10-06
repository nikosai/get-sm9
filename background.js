function url2id(url) {
  return url.replace(/[#?].*$/, "")
    .replace(/\/*$/, "")
    .replace(/^.*\//, "");
}

// function uuid() {
//   const template = "RRRRRRRR-RRRR-4RRR-rRRR-RRRRRRRRRRRR";
//   let str = "";
//   for (let i = 0; i < template.length; i++) {
//     switch (template[i]) {
//       case "R":
//         str += Math.floor(Math.random() * 16).toString(16);
//         break;
//       case "r":
//         str += Math.floor(Math.random() * 4 + 8).toString(16);
//         break;
//       default:
//         str += template[i];
//     }
//   }
//   return str;
// }

chrome.contextMenus.create({
  title: "現在ページURL最終部をコピー",
  contexts: ["all"],
  type: "normal",
  id: "contextMenuAll",
  visible: true
});

chrome.contextMenus.create({
  title: "リンク先URL最終部をコピー",
  contexts: ["link"],
  type: "normal",
  id: "contextMenuLink",
  visible: true
});

let prev;

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let url;
  switch (info.menuItemId) {
    case "contextMenuAll":
      url = info.pageUrl;
      break;
    case "contextMenuLink":
      url = info.linkUrl;
      break;
  }
  if (url === undefined) return;
  // chrome.tabs.sendMessage(tab.id, { id: url2id(url) });
  const id = url2id(url);
  const divID = "nikosai-extension-get-sm9-toast"
  console.log(tab.id);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [id, divID],
    function: (id, divID) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(id);
      } else {
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.value = id;
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      let toast;
      if (!document.getElementById(divID)) {
        toast = document.createElement("div");
        toast.id = divID;
        toast.style.transition = "1s";
        toast.style.zIndex = "999";
        toast.style.position = "fixed";
        toast.style.bottom = "10px";
        toast.style.right = "10px";
        toast.style.padding = "5px";
        toast.style.fontSize = "15px";
        toast.style.borderRadius = "10px";
        toast.style.backgroundColor = "#252525";
        toast.style.color = "#ffffff";
        toast.style.opacity = "0";
        document.body.insertBefore(toast, document.body.firstChild);
        setTimeout(() => {
          toast.style.opacity = "0.8";
        }, 10);
      } else {
        toast = document.getElementById(divID);
        toast.style.opacity = "0.8";
      }
      toast.innerHTML = `“${id}”をコピーしました`;
    }
  });
  if (prev) clearTimeout(prev);
  prev = setTimeout(() => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [divID],
      function: (divID) => { document.getElementById(divID).style.opacity = '0'; }
    })
  }, 5000);
});
