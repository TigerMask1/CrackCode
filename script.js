const firebaseConfig = {
    apiKey: "AIzaSyB83_s-zLKnC5SMaUq936hBgwFMU3Tc6_Y",
    authDomain: "code-generator-65a8b.firebaseapp.com",
    projectId: "code-generator-65a8b",
    storageBucket: "code-generator-65a8b.appspot.com", // Corrected this line
    messagingSenderId: "487927483429",
    appId: "1:487927483429:web:c57f5ae1f1ad8403f443cc",
    measurementId: "G-NN4C7XHJXF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const codeRef = db.collection("codes").doc("latest");

async function generateNewCode() {
    const newCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    await codeRef.set({ code: newCode, timestamp: Date.now() });
    return newCode;
}

async function checkAndUpdateCode() {
    const doc = await codeRef.get();
    const now = Date.now();
    
    if (!doc.exists || now - doc.data().timestamp >= 7200000) { // 2 hours check
        const newCode = await generateNewCode();
        document.getElementById("code").textContent = newCode;
    } else {
        document.getElementById("code").textContent = doc.data().code;
    }
}

checkAndUpdateCode();
