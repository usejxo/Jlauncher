(function() {
    const popupKey = "seenPopup_v2"; // Change key name to ensure a fresh start

    if (!localStorage.getItem(popupKey)) {
        let popup = document.createElement("div");
        popup.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: black;
                color: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                z-index: 9999;
            ">
                <p>Check it out✨!<br>Jlauncher just got updated!</p>
                <ul style="text-align: left; display: inline-block;">
                    <li>Now you can use Furnace to install mods.</li>
                    <li>And use Jskin to download any Minecrafter's skin.</li>
                </ul>
                <button style="
                    background: green;
                    color: white;
                    border: none;
                    padding: 10px;
                    margin-top: 10px;
                    cursor: pointer;
                    border-radius: 5px;
                " onclick="this.parentElement.remove(); localStorage.setItem('${popupKey}', Date.now());">
                    Close
                </button>
            </div>
        `;
        document.body.appendChild(popup);
    }
})();
