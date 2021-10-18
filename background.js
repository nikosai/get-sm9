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
  const id = url2id(url);
  chrome.tabs.executeScript(tab.id, {
    code: `(()=>{
      const id = "${id}";
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
      })();`
  });
});
