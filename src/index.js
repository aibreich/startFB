import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  getDoc,
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  Query,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4jJ92xPemZNDaAyiJL5rNUtu-rtbpNUA",
  authDomain: "n423-data-aiden.firebaseapp.com",
  projectId: "n423-data-aiden",
  storageBucket: "n423-data-aiden.appspot.com",
  messagingSenderId: "163901931037",
  appId: "1:163901931037:web:8f285c27e2d4a46c5f10f4",
  measurementId: "G-NL28YPVMEZ",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

var logInBtn = document.getElementById("login");
var logOutBtn = document.getElementById("logout");
var addUserBtn = document.getElementById("addUser");
var getAllDataBtn = document.getElementById("getAllData");
var getQueryBtn = document.getElementById("getQueryButton");
// HW BUTTONS
var getAllAlbumsBtn = document.getElementById("getAllAlbums");
var getGenreBtn = document.getElementById("getGenreButton");
// END OF HW BUTTONS

logInBtn.addEventListener("click", login);
logOutBtn.addEventListener("click", logout);
addUserBtn.addEventListener("click", addUserToDB);
getAllDataBtn.addEventListener("click", getAllData);
getQueryBtn.addEventListener("click", queryData);

// HW LISTENERS
getAllAlbumsBtn.addEventListener("click", getAllAlbums);
getGenreBtn.addEventListener("click", genreData);
// END OF HW LISTENERS

// IN CLASS
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("Logged In", user);
  } else {
    console.log("no user");
  }
});

function addUserToDB() {
  let fn = document.getElementById("fname").value.toLowerCase();
  let ln = document.getElementById("lname").value.toLowerCase();
  let em = document.getElementById("email").value.toLowerCase();
  let pw = document.getElementById("pw").value.toLowerCase();

  let person = {
    firstName: fn,
    lastName: ln,
    email: em,
    password: pw,
  };

  addData(person);
}

async function addData(person) {
  try {
    const docRef = await addDoc(collection(db, "Pirates"), person);
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("pw").value = "";
    console.log("Doc id: ", docRef.id);
  } catch (e) {
    console.log(e);
  }
}

async function getUser(userId) {
  const docRef = doc(db, "Pirates", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let user = docSnap.data();
    $("#userData").html(
      `<input class="name" type="text" id="userFN" value="${user.firstName}" disabled />`
    );
  } else {
    console.log("No Document exists.");
  }
}
function addUserEditBtnListener() {
  $("#allData button").on("click", (e) => {
    console.log(e.currentTarget.id);
    getUser(e.currentTarget.id);
  });
}
async function getAllData() {
  document.getElementById("allData").innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "Pirates"));
  let htmlStr = "";
  querySnapshot.forEach((doc) => {
    htmlStr += `<div>
    <p class="name"> ${doc.data().firstName}</p>
    <p class="name"> ${doc.data().lastName}</p>
    <p class="name"> ${doc.data().email}</p>
    <button id="${doc.id}">Get User</button>
    </div>`;
  });

  document.getElementById("allData").innerHTML = htmlStr;
  addUserEditBtnListener();
}

async function queryData() {
  let searchName = $("#query-input").val();
  const q = query(
    collection(db, "Pirates"),
    where("firstName", "==", searchName)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0) {
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  } else {
    console.log("none");
  }
}

function login() {
  signInAnonymously(auth)
    .then(() => {
      console.log("Signed In");
    })
    .catch((error) => {
      console.log(error.code);
    });
}

function logout() {
  signOut(auth)
    .then(() => {
      console.log("Signed Out");
    })
    .catch((error) => {
      console.log(error.code);
    });
}
// END OF INCLASS PART

// HW PORTION
$(window).on("load", getAllAlbums());
async function getAllAlbums() {
  //for HW
  document.getElementById("allData").innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "Albums"));
  let htmlStr = "";
  querySnapshot.forEach((doc) => {
    htmlStr += `<div class="albumCard">
    <img src="img/${doc.data().albumPhoto}" class="albumImg" />
    <p class="name"><span style="font-style: italic; font-weight:bold;">Album:</span> ${
      doc.data().albumName
    }</p>
    <p class="name"><span style="font-style: italic; font-weight:bold;">Artist:</span> ${
      doc.data().artistName
    }</p>
    <p class="name"><span style="font-style: italic; font-weight:bold;">Genre:</span> ${
      doc.data().genre
    }</p>
    </div>`;
  });

  document.getElementById("allData").innerHTML = htmlStr;
  addUserEditBtnListener();
}
async function genreData() {
  let genreName = $("#genres").find(":selected").val();
  const q = query(collection(db, "Albums"), where("genre", "==", genreName));

  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length > 0) {
    document.getElementById("allData").innerHTML = "";
    let htmlStr = "";
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      htmlStr += `<div class="albumCard">
    <img src="img/${doc.data().albumPhoto}" class="albumImg" />
    <p class="name">Album: ${doc.data().albumName}</p>
    <p class="name">Artist: ${doc.data().artistName}</p>
    <p class="name">Genre: ${doc.data().genre}</p>
    </div>`;
    });
    document.getElementById("allData").innerHTML = htmlStr;
  } else {
    console.log("none");
  }
}
// END OF HW PORTION
