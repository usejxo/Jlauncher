(function() {
    const params = new URLSearchParams(window.location.search);
    const modsParam = params.get("fmods"); // Detect "fmods=" in the URL
    if (!modsParam) return;

    fetch('https://jfurnace.netlify.app/assets/mods/mods.json')
        .then(response => response.json())
        .then(data => {
            if (!data || !Array.isArray(data.mods)) {
                console.error("Invalid mods.json format");
                return;
            }

            let usedHashes = new Set();
            let modsList = [];

            modsParam.split(",").forEach(modName => {
                let mod = data.mods.find(m => m.name.toLowerCase() === modName.toLowerCase());
                if (mod && mod.scriptUrl) {
                    modsList.push(mod.scriptUrl);
                }
            });

            // Ensure window.eaglercraftXOpts exists
            window.eaglercraftXOpts = window.eaglercraftXOpts || {};

            // Append Mods array without overwriting other properties
            if (!window.eaglercraftXOpts.Mods) {
                window.eaglercraftXOpts.Mods = [];
            }
            window.eaglercraftXOpts.Mods.push(...modsList);

            console.log(`Mods added to eaglercraftXOpts: ${window.eaglercraftXOpts.Mods}`);
        })
        .catch(error => console.error("Failed to load mods:", error));
})();
