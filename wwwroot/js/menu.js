document.getElementById("startGame").addEventListener("click", () => {
    window.location.href = "index.js"; // Redirect to the game
});

document.getElementById("options").addEventListener("click", () => {
    alert("Options are coming soon!"); // Placeholder for options
});

document.getElementById("quit").addEventListener("click", () => {
    if (confirm("Are you sure you want to quit?")) {
        window.close(); // May not work in all browsers
    }
});