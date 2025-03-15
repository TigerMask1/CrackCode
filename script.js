const GITHUB_REPO = "tigermask1/CrackCode"; // Change this
const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/codes.json`;
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/codes.json`;
const GITHUB_TOKEN = "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"; // Required for updating the file

async function fetchCode() {
    try {
        const response = await fetch(RAW_URL + "?timestamp=" + new Date().getTime());
        const data = await response.json();
        document.getElementById("code").textContent = data.code;
    } catch (error) {
        console.error("Error fetching code:", error);
        document.getElementById("code").textContent = "Error loading code!";
    }
}

async function updateCodeIfNeeded() {
    try {
        const response = await fetch(RAW_URL + "?timestamp=" + new Date().getTime());
        const data = await response.json();
        const now = Date.now();

        if (!data.timestamp || now - data.timestamp >= 7200000) { // 2 hours passed
            const newCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
            console.log("Generating new code:", newCode);
            await updateCodeInGitHub(newCode);
        }
    } catch (error) {
        console.error("Error checking/updating code:", error);
    }
}

async function updateCodeInGitHub(newCode) {
    try {
        const getFileResponse = await fetch(API_URL, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        const fileData = await getFileResponse.json();
        const sha = fileData.sha;

        const updatedContent = {
            code: newCode,
            timestamp: Date.now()
        };

        await fetch(API_URL, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Update code",
                content: btoa(JSON.stringify(updatedContent, null, 2)),
                sha: sha
            })
        });

        console.log("Code updated in GitHub!");
        document.getElementById("code").textContent = newCode;
    } catch (error) {
        console.error("Error updating code in GitHub:", error);
    }
}

fetchCode();
setInterval(updateCodeIfNeeded, 60000); // Check every 1 min
