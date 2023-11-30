//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) 
// and dynamically displays them in the gallery
//----------------------------------------------------------
// if (firebase.auth().currentUser !== null) 
//         console.log("user id: " + firebase.auth().currentUser.uid);
// const currentUser = firebase.auth().currentUser.uid;​
function getBookmarks() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      db.collection("users").doc(user.uid).get()
          .then(userDoc => {
              // Get the Array of bookmarks
            let bookmarks = userDoc.data().historyList;
              // Get pointer the new card template
            let newcardTemplate = document.getElementById("pastListTemplate");
              // Iterate through the ARRAY of bookmarked hikes (document ID's)
              let arr = Object.keys(bookmarks);
              arr.forEach((historyListID) => {
                db.collection("users").doc(historyListID).get().then(doc => {
                    // var docID = doc.id;  //this is the autogenerated ID of the document
                    // console.log(doc.data().listName);
                    //clone the new card
                  const item = bookmarks[historyListID];
                  const listName = item.listName;
                  const createdDate = item.createdDate;
                  const shoppingList = item.shoppinglist;

                  let newcard = newcardTemplate.content.cloneNode(true);
                  let title = listName;
                    //update title and some pertinant information
                    newcard.querySelector('#list-title').innerHTML = title;
                    newcard.querySelector('#use').onclick = () => useList(historyListID); // add event listener to the addbutton
                    newcard.querySelector('#delete').onclick = () => deleteList(historyListID); // add event listener to the addbutton
                  //Finally, attach this new card to the gallery
                    listCards.appendChild(newcard);
                })
            });
          })
    }
  });
}
getBookmarks();

function useList(historyListID) {
  firebase.auth().onAuthStateChanged((user) => {
    console.log(user.uid);
    // Check if a user is signed in:
    if (user) {
      const currentUser = db.collection("users").doc(user.uid);
      currentUser
        .get()
        .then((userDoc) => {
          const currentHistoryList = userDoc.data().historyList || {};
          // Check if the historyListId exists
          if (currentHistoryList.hasOwnProperty(historyListID)) {
            // Access the properties of the specified history list
            const createdDate = currentHistoryList[historyListID].createdDate;
            const listName = currentHistoryList[historyListID].listName;
            const shoppingList = currentHistoryList[historyListID].shoppinglist;
            // Use the properties as needed
            console.log("Created Date:", createdDate);
            console.log("List Name:", listName);
            console.log("Shopping List:", shoppingList);

            shoppingList.forEach((productId) => {
              currentUser.update({
                currentList: firebase.firestore.FieldValue.arrayUnion(productId),
              });
            })
          } else {
            console.log(`History list with ID ${historyListID} not found.`);
          }
        });


      db.collection("users").doc(user.uid).collection("historyList").doc(historyListID).get().then((doc) => {
        // doc doesn't exist for some reason
        if (doc.exists) {
          console.log("exists");
          const shoppingList = doc.data().shoppinglist;
          for (var key in shoppingList){
            console.log(shoppingList[key]);
          }
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      });
    } else {
    }
  });
}
function deleteList(historyListID) {
  
  firebase.auth().onAuthStateChanged((user) => {
    // Check if a user is signed in:
    if (user) {
      // Get the collection containing the id
      db.collection("users").doc(user.uid).collection("historyList").get().then(doc => {
          console.log(user.uid);
      });
      if (confirm("Are you sure you want to delete this list?")) {
        //delete the collection corresponding to the id
        const currentUser = db.collection("users").doc(user.uid);
        currentUser.get().then((userDoc) => {
          const currentHistoryList = userDoc.data().historyList || {};
          if (currentHistoryList.hasOwnProperty(historyListID)) {
            delete currentHistoryList[historyListID];

            // Update Firestore with the modified historyList
            return currentUser.update({
              historyList: currentHistoryList,
            });
          } else {
            console.warn("Current list is empty or null");
          }
        });

        
        txt = "You deleted " + historyListID;
      } else {
        txt = "You pressed Cancel!";
      }
    } else {
    }
  });
}