
//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) 
// and dynamically displays them in the gallery
//----------------------------------------------------------
function getBookmarks(userId) {
    db.collection("users").doc(userId).get()
        .then(userDoc => {

					  // Get the Array of bookmarks
            var bookmarks = userDoc.data().historyList;
            console.log(bookmarks);
						
						// Get pointer the new card template
            let newcardTemplate = document.getElementById("pastListTemplate");
						// Iterate through the ARRAY of bookmarked hikes (document ID's)
            bookmarks.forEach((historyListId) => {
                console.log(historyListId);
                db.collection("users").doc(historyListID).get().then(doc => {
                    // var docID = doc.id;  //this is the autogenerated ID of the document
                    
                    //clone the new card
                    let newcard = newcardTemplate.content.cloneNode(true);
                    let title = itemDoc.data().listName;

                    //update title and some pertinant information
                    newcard.querySelector('.list-title').innerHTML = title;
  		            //Finally, attach this new card to the gallery
                    listCards.appendChild(newcard);
                })
            });
        })
}
getBookmarks("yXsEZFc7kTdbuu3cePxcLdG9CBH3");

function useList() {
  db.collections("users")
}

function deleteList() {

}