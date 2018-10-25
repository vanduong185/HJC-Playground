window.console.log = function (obj) {
  if (typeof obj === "object")
  {
    obj = JSON.stringify(obj);
  }
  message = {
    type: "log-msg",
    content: obj
  }
	window.parent.postMessage(message, '*');
}

window.onerror = function(msg, url,line) {
  arr = url.split("/");
  error = {
    position: arr[arr.length-1] + ":" + line,
    content: msg,
    type: "error-msg"
  }
  window.parent.postMessage(error, '*');
}
