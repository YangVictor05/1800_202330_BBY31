function dosearch() {
  allmarket();
  console.log("search button clicked");
  var result = document.getElementById("search").value;
  // alert(allResults);

  // displayCardsDynamically("market");
    window.location.href = "searchResults.html?value=" + result;
}