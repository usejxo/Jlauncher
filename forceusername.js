(function () {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    font-family: Arial, sans-serif;
  `;

  // Create modal
  const modal = document.createElement("div");
  modal.style.cssText = `
    background: #111;
    color: #fff;
    padding: 20px;
    width: 320px;
    border-radius: 8px;
    box-shadow: 0 0 20px #000;
  `;

  modal.innerHTML = `
    <h3 style="margin-top:0">JLauncher</h3>
    <label>Realname:</label>
    <input id="realname" style="width:100%;margin-bottom:10px" />

    <label>Username:</label>
    <input id="username" style="width:100%;margin-bottom:10px" />
    <small>Do not make your username your real name.</small>

    <button id="submit" style="margin-top:15px;width:100%">
      Continue
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Handle submit
  modal.querySelector("#submit").onclick = () => {
    const realName = modal.querySelector("#realname").value;

    if (/corey/i.test(realName)) {
      modal.innerHTML = `
        <h3>Banned</h3>
        <p>
          You have been banned from JLauncher for using it during class hours.
        </p>
        <p>
          <strong>Your ban will expire on 1/16/2026.</strong>
        </p>
      `;
    } else {
      document.body.removeChild(overlay);
    }
  };
})();
