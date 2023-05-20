console.log("main")

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        // mode: 'no-cors',
        
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.text(); // parses JSON response into native JavaScript objects
}
