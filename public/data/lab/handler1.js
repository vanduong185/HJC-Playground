function myFunction(event) {
  if (event.target.id != null) {
  	var node = document.getElementById(event.target.id);
    if (node.children[0]) {
      if (node.children[0].style.display == "none") {
        node.children[0].style.display = "block";
      }
      else {
        node.children[0].style.display = "none";
      }
    }
  }
}