const $ = (id) => document.getElementById(id);
let selectedGender = "";
const sleepoverNames = ["echa", "dhea", "misel", "michelle"];
const girlsPacking = [
  ["Baju renang"], ["Handuk"], ["Makeup", true], ["Catokan", true],
  ["Alat mandi"], ["Baju untuk dinner"], ["Baju untuk menginap", false, true],
  ["Bantal", false, true], ["Guling", false, true], ["Selimut", false, true],
  ["Barang lain yang ingin dibawa", true]
];
const boysPacking = [["Baju renang"], ["Handuk"], ["Peralatan mandi", true], ["Baju untuk dinner"]];
function showStep(step) {
  $("genderStep").classList.toggle("active", step === "gender");
  $("nameStep").classList.toggle("active", step === "name");
}
document.querySelectorAll(".gender-option").forEach(button => {
  button.addEventListener("click", () => {
    selectedGender = button.dataset.gender;
    document.querySelectorAll(".gender-option").forEach(b => b.classList.toggle("selected", b === button));
    showStep("name");
    setTimeout(() => $("guestName").focus(), 250);
  });
});
$("backBtn").addEventListener("click", () => showStep("gender"));
function enterInvitation() {
  const name = $("guestName").value.trim();
  if (!name) { $("guestName").focus(); $("guestName").classList.add("needs-name"); return; }
  document.body.classList.remove("locked");
  document.body.classList.add(selectedGender);
  $("welcomeGate").classList.add("gate-exit");
  $("invitationContent").setAttribute("aria-hidden", "false");
  $("personalGreeting").textContent = name;
  if (selectedGender === "girls") {
    $("packingEyebrow").textContent = "GIRLS' PREPARATION";
    $("packingIntro").textContent = "Untuk teman-teman perempuan. Echa, Dhea, dan Michelle/Misel tidak perlu membawa perlengkapan menginap.";
    const notStaying = sleepoverNames.includes(name.toLowerCase());
    $("packingList").innerHTML = girlsPacking.filter(item => !(notStaying && item[2])).map(item => checklistItem(item[0], item[1])).join("");
  } else {
    $("packingEyebrow").textContent = "BOYS' PREPARATION";
    $("packingIntro").textContent = "Checklist barang yang perlu kamu siapkan sebelum acara.";
    $("packingList").innerHTML = boysPacking.map(item => checklistItem(item[0], item[1])).join("");
  }
  renderPhotos();
  window.scrollTo({top:0,behavior:"smooth"});
}
function checklistItem(label, optional) {
  return `<label class="check-row"><input type="checkbox"><span>${label}</span>${optional ? '<small>(opsional)</small>' : ''}</label>`;
}
$("continueBtn").addEventListener("click", enterInvitation);
$("guestName").addEventListener("keydown", e => { if (e.key === "Enter") enterInvitation(); });
function renderPhotos() {
  const files = [];
  for (let i=1;i<=10;i++) files.push(`photos/kayla/kayla-${String(i).padStart(2,"0")}.jpg`);
  for (let i=1;i<=10;i++) files.push(`photos/melquin/melquin-${String(i).padStart(2,"0")}.jpg`);
  // Interleave the photos so both people appear throughout one shared collection.
  const mixed = [];
  for (let i=0;i<10;i++) mixed.push(files[i],files[i+10]);
  $("togetherGallery").innerHTML = mixed.map((src,i)=>`<img src="${src}" alt="Kayla dan Melquin — moment ${i+1}" loading="lazy">`).join("");
}
const music = $("bgMusic");
async function startMusic() {
  try { await music.play(); $("soundToggle").classList.add("playing"); }
  catch(e) { $("soundToggle").title = "Tambahkan file house-of-balloons.mp3 ke folder music untuk mengaktifkan musik."; }
}
$("soundToggle").addEventListener("click",async()=>{
  if (music.paused) await startMusic(); else { music.pause(); $("soundToggle").classList.remove("playing"); }
});
document.addEventListener("visibilitychange",()=>{if(document.hidden) music.pause();});
window.addEventListener("pagehide",()=>music.pause());
