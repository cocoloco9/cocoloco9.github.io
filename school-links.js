(() => {
  "use strict";
  // The token travels after "#", which browsers never send to this website's server.
  const values = new URLSearchParams(String(window.location.hash || "").replace(/^#/, "")).getAll("token");
  const token = values.length === 1 && /^[0-9a-f]{64}$/.test(values[0]) ? values[0] : null;
  if (!token) {
    document.getElementById("status").textContent = "This invitation is incomplete or invalid. Ask the school to send a new link.";
    return;
  }
  // Never forward arbitrary URLs, child data or tokens to an app store or analytics.
  // The app scheme stays on this device, so the query form is fine there.
  document.getElementById("open").href = `noted://join/school?token=${token}`;
  document.getElementById("actions").hidden = false;
  const config = window.NOTED_SCHOOL_LINKS || {};
  let stores = 0;
  for (const [id, value, host] of [["ios", config.iosStoreUrl, "apps.apple.com"], ["android", config.androidStoreUrl, "play.google.com"]]) {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" || url.hostname !== host || url.username || url.password || url.port || url.hash) continue;
      if (id === "ios" && (!/^\/(?:[a-z]{2}\/)?app\/(?:[^/]+\/)?id[1-9]\d*$/.test(url.pathname) || url.search)) continue;
      if (id === "android" && (url.pathname !== "/store/apps/details" || !/^[A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z][A-Za-z0-9_]*)+$/.test(url.searchParams.get("id") || "") || [...url.searchParams.keys()].length !== 1)) continue;
      const anchor = document.getElementById(id);
      anchor.href = url.href;
      anchor.rel = "noopener noreferrer";
      anchor.hidden = false;
      stores++;
    } catch { /* Unconfigured store destination stays hidden. */ }
  }
  document.getElementById("stores").hidden = stores > 0;
})();
