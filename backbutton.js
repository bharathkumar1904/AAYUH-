document.addEventListener("DOMContentLoaded", function() {
  if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener("backButton", function(data) {
      var exitDialog = document.getElementById("aayuhExitDialog");
      if (exitDialog) { exitDialog.remove(); return; }
      var profOv = document.getElementById("profOv");
      if (profOv && profOv.classList.contains("open")) { profOv.classList.remove("open"); return; }
      var mobileMenu = document.getElementById("mobileMenu");
      if (mobileMenu && mobileMenu.classList.contains("open")) { mobileMenu.classList.remove("open"); return; }
      var current = window.location.pathname.split("/").pop();
      var featurePages = ["medicines.html","symptoms.html","disease.html","medical history.html","Find Doctors.html","Emergency.html","ChatBot.html","profile.html","settings.html","Blog.html","pharmacy.html","about.html","register.html"];
      if (featurePages.indexOf(current) !== -1) { window.location.href = "dashboard.html"; return; }
      showExitDialog();
    });
  }
});
function showExitDialog() {
  var old = document.getElementById("aayuhExitDialog");
  if (old) old.remove();
  var d = document.createElement("div");
  d.id = "aayuhExitDialog";
  d.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;";
  d.innerHTML = "<div style='background:white;width:82%;max-width:280px;border-radius:20px;padding:28px;text-align:center;'><div style='font-size:2.8rem;margin-bottom:10px;'>👋</div><h3 style='color:#004d40;margin-bottom:8px;font-weight:700;'>Exit AAYUH?</h3><p style='color:#777;font-size:0.9rem;margin-bottom:20px;'>Are you sure you want to exit?</p><div style='display:flex;gap:10px;'><button id='aayuhStayBtn' style='flex:1;padding:12px;border:none;border-radius:12px;background:#e0f2f1;color:#00897b;font-weight:700;cursor:pointer;'>🏠 Stay</button><button id='aayuhExitBtn' style='flex:1;padding:12px;border:none;border-radius:12px;background:#004d40;color:white;font-weight:700;cursor:pointer;'>Exit 👋</button></div></div>";
  document.body.appendChild(d);
  document.getElementById("aayuhStayBtn").onclick = function() { document.getElementById("aayuhExitDialog").remove(); };
  document.getElementById("aayuhExitBtn").onclick = function() { window.Capacitor.Plugins.App.exitApp(); };
  d.onclick = function(ev) { if (ev.target === d) d.remove(); };
}
window.showExitDialog = showExitDialog;