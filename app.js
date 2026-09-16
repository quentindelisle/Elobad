/* =========================================================
   ELOBAD — Application logique — By Quentin Delisle
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   0. CONSTANTES & CONFIG
--------------------------------------------------------- */
const DB_KEY = 'elobad_db_v1';
const AVATAR_COLORS = ['#011B4D','#3C87C9','#EF3982','#7DC009','#F4A11A','#7A4FE0','#1E4FA3','#D9483F'];

const VAR_WIN_BRACKETS = [
  {key:'winL71',    label:'Advers. < joueur de +71%',        short:'Adv ≪ −71%',   val:1},
  {key:'winL70_41', label:'Advers. < joueur de 70% à 41%',   short:'Adv < −41→70%',val:2},
  {key:'winL40_20', label:'Advers. < joueur de 40% à 20%',   short:'Adv < −20→40%',val:3},
  {key:'winL19_1',  label:'Advers. < joueur de 19% à 1%',    short:'Adv < −1→19%', val:4},
  {key:'winEqual',  label:'ELO identique',                   short:'ELO identique',val:5},
  {key:'winH0_10',  label:'Advers. > joueur de 0 à 10%',     short:'Adv +0→10%',   val:5},
  {key:'winH11_20', label:'Advers. > joueur de 11 à 20%',    short:'Adv +11→20%',  val:6},
  {key:'winH21_30', label:'Advers. > joueur de 21 à 30%',    short:'Adv +21→30%',  val:7},
  {key:'winH31_50', label:'Advers. > joueur de 31 à 50%',    short:'Adv +31→50%',  val:8},
  {key:'winH51_70', label:'Advers. > joueur de 51 à 70%',    short:'Adv +51→70%',  val:9},
  {key:'winH71',    label:'Advers. > joueur de +71%',        short:'Adv ≫ +71%',   val:10},
];
const VAR_LOSS_BRACKETS = [
  {key:'lossL71',    label:'Advers. < joueur de +71%',        short:'Adv ≪ −71%',   val:-7},
  {key:'lossL70_41', label:'Advers. < joueur de 70% à 41%',   short:'Adv < −41→70%',val:-6},
  {key:'lossL40_20', label:'Advers. < joueur de 40% à 20%',   short:'Adv < −20→40%',val:-5},
  {key:'lossL19_1',  label:'Advers. < joueur de 19% à 1%',    short:'Adv < −1→19%', val:-4},
  {key:'lossEqual',  label:'ELO identique',                   short:'ELO identique',val:-3},
  {key:'lossH0_10',  label:'Advers. > joueur de 0 à 10%',     short:'Adv +0→10%',   val:-3},
  {key:'lossH11_20', label:'Advers. > joueur de 11 à 20%',    short:'Adv +11→20%',  val:-2},
  {key:'lossH21_30', label:'Advers. > joueur de 21 à 30%',    short:'Adv +21→30%',  val:-2},
  {key:'lossH31_50', label:'Advers. > joueur de 31 à 50%',    short:'Adv +31→50%',  val:-1},
  {key:'lossH51_70', label:'Advers. > joueur de 51 à 70%',    val:-1},
  {key:'lossH71',    label:'Advers. > joueur de +71%',        val:-1},
];

const MASTERY_CATALOG = [
  // --- Général ---
  {id:'mst_arbitrage',     sport:'general',        name:'Maîtrise Arbitrage',            description:"L'élève arbitre un match complet",                                   elo:2, scope:'arbitre',  active:true},
  // --- Badminton ---
  {id:'mst_bad_vnt',       sport:'badminton',      name:'VNT',                           description:'3 volants non touchés par l’adversaire (ace)',                       elo:2, scope:'joueurs', active:true},
  {id:'mst_bad_smash',     sport:'badminton',      name:'Smash',                         description:'3 smashs qui marquent le point',                                     elo:2, scope:'joueurs', active:true},
  {id:'mst_bad_amorti',    sport:'badminton',      name:'Amorti',                        description:'3 amortis qui marquent le point',                                    elo:2, scope:'joueurs', active:true},
  {id:'mst_bad_smashrush', sport:'badminton',      name:'Enchaînement Smash-Rush',       description:'3 enchaînements smash puis rush au filet',                           elo:2, scope:'joueurs', active:false},
  {id:'mst_bad_amortilob', sport:'badminton',      name:'Enchaînement Amorti-Lob',       description:'3 enchaînements amorti puis lob',                                     elo:2, scope:'joueurs', active:false},
  {id:'mst_bad_service',   sport:'badminton',      name:'Service Gagnant',               description:'3 services non retournés par l’adversaire',                          elo:2, scope:'joueurs', active:false},
  {id:'mst_bad_degage',    sport:'badminton',      name:'Dégagement Long',               description:'3 dégagements qui repoussent l’adversaire au fond du court',         elo:2, scope:'joueurs', active:false},
  {id:'mst_bad_variation', sport:'badminton',      name:'Variation Tactique',            description:'3 échanges où 3 zones différentes du court adverse sont visées',     elo:2, scope:'joueurs', active:false},
  {id:'mst_bad_filet',     sport:'badminton',      name:'Jeu au Filet',                  description:'3 points gagnés directement au filet',                               elo:2, scope:'joueurs', active:false},
  {id:'mst_bad_defense',   sport:'badminton',      name:'Récupération Défensive',        description:'3 points remportés après avoir renvoyé un smash adverse',            elo:2, scope:'joueurs', active:false},
  // --- Tennis de table ---
  {id:'mst_tt_smash',      sport:'tennis_de_table',name:'Smash',                         description:'3 smashs qui marquent le point',                                     elo:2, scope:'joueurs', active:true},
  {id:'mst_tt_bnt',        sport:'tennis_de_table',name:'BNT',                           description:'3 balles non touchées par l’adversaire (ace)',                       elo:2, scope:'joueurs', active:true},
  {id:'mst_tt_service',    sport:'tennis_de_table',name:'Service Gagnant',               description:'3 points marqués directement sur le service',                        elo:2, scope:'joueurs', active:false},
  {id:'mst_tt_servicevarie',sport:'tennis_de_table',name:'Service Varié',                description:'Jamais deux fois de suite le même service, sur une série de 6',      elo:2, scope:'joueurs', active:false},
  {id:'mst_tt_revers',     sport:'tennis_de_table',name:'Revers Adverse',                description:'3 points marqués en visant le revers de l’adversaire',               elo:2, scope:'joueurs', active:false},
  {id:'mst_tt_coupdroit',  sport:'tennis_de_table',name:'Coup Droit Croisé',             description:'3 points marqués en coup droit croisé',                              elo:2, scope:'joueurs', active:false},
  {id:'mst_tt_defense',    sport:'tennis_de_table',name:'Défense Longue',                description:'3 échanges défensifs (loin de la table) remportés',                  elo:2, scope:'joueurs', active:false},
  {id:'mst_tt_remise',     sport:'tennis_de_table',name:'Remise Courte',                 description:'3 remises courtes empêchant l’attaque adverse',                      elo:2, scope:'joueurs', active:false},
  {id:'mst_tt_contre',     sport:'tennis_de_table',name:'Contre-Attaque',                description:'3 points gagnés en contre-attaquant après une attaque adverse',       elo:2, scope:'joueurs', active:false},
  {id:'mst_tt_regularite', sport:'tennis_de_table',name:'Régularité',                    description:'Un échange de 10 balles ou plus remporté',                           elo:2, scope:'joueurs', active:false},
];
function defaultClassSettings(){
  return {
    eloMode:'variable', // 'fixe' | 'variable'
    eloFixed:{win:5, loss:-3},
    eloVariable:{
      win: Object.fromEntries(VAR_WIN_BRACKETS.map(b=>[b.key,b.val])),
      loss: Object.fromEntries(VAR_LOSS_BRACKETS.map(b=>[b.key,b.val])),
    },
    styleBonus:{winM1:5, winB1:1, winM2:8, winB2:2, lossM1:3, lossB1:1, lossM2:1, lossB2:2},
    leaderStreak:{streak:3, bonus:10},
    matchDefaults:{
      sport:'badminton', setsMode:'total', setsTarget:1,
      tiebreak:'goalaverage', winBy2:true, pointsPerSet:[15,15,15,15,15], refereeRequired:true
    },
    masteries: MASTERY_CATALOG.map(m=>({...m})),
  };
}

function emptyDB(){
  return { classes:{}, matches:[], masteryAwards:[], activeClassId:null, adminPassword:'0000' };
}

/* ---------------------------------------------------------
   1. STATE & PERSISTENCE
--------------------------------------------------------- */
let DB = loadDB();
let STATE = {
  view:'home',
  currentMatch:null,   // {playerAId, playerBId, params, sets:[[a,b]], curA, curB, refereeId, sessionLabel}
  adminUnlocked: false,
  adminPanel:'panel-classe',
  editingMatchParams:false,
};

function loadDB(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(!raw) return emptyDB();
    const parsed = JSON.parse(raw);
    const db = Object.assign(emptyDB(), parsed);
    Object.values(db.classes||{}).forEach(migrateClassSettings);
    // Migration : mot de passe admin unique pour toutes les classes (auparavant un code par classe)
    if(!parsed.adminPassword){
      const firstClassPass = Object.values(db.classes||{}).map(c=>c.settings && c.settings.adminPassword).find(Boolean);
      db.adminPassword = firstClassPass || '0000';
    }
    return db;
  }catch(e){ console.warn('DB load error', e); return emptyDB(); }
}
function migrateClassSettings(cls){
  if(!cls.settings) cls.settings = defaultClassSettings();
  if(!Array.isArray(cls.settings.masteries)) cls.settings.masteries = [];
  const existingIds = new Set(cls.settings.masteries.map(m=>m.id));
  MASTERY_CATALOG.forEach(cat=>{
    if(!existingIds.has(cat.id)) cls.settings.masteries.push({...cat});
  });
  // older classes may miss the 'active'/'sport'/'scope' fields on their own entries
  cls.settings.masteries.forEach(m=>{
    if(m.active===undefined) m.active = true;
    if(!m.sport) m.sport = 'general';
    if(!m.scope) m.scope = m.refereeOnly===true ? 'arbitre' : 'tous';
  });
}
function saveDB(){ localStorage.setItem(DB_KEY, JSON.stringify(DB)); }

function uid(prefix){ return (prefix||'id')+'_'+Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4); }

function activeClass(){ return DB.activeClassId ? DB.classes[DB.activeClassId] : null; }

/* ---------------------------------------------------------
   2. TOASTS
--------------------------------------------------------- */
function toast(msg, type){
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' '+type : '');
  el.textContent = msg;
  stack.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='.3s'; setTimeout(()=>el.remove(),300); }, 2600);
}

/* ---------------------------------------------------------
   3. NOM / AVATAR HELPERS (RGPD : Prénom + Initiale du nom)
--------------------------------------------------------- */
function displayName(s){
  if(!s) return '';
  const initial = (s.nom||'?').trim().charAt(0).toUpperCase();
  return `${s.prenom} ${initial}.`;
}
function avatarColor(studentId){
  let hash=0; for(const c of studentId) hash = (hash*31 + c.charCodeAt(0))>>>0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
function avatarInitials(s){
  return (s.prenom||'?').charAt(0).toUpperCase() + (s.nom||'?').charAt(0).toUpperCase();
}
const CLASS_COLORS = ['#FF3E82','#3C87C9','#A6F400','#FFB020','#7A4FE0','#00C2A8','#FF6B4A','#2FA1FF','#E23FD6','#43D17A'];
function classColor(classId){
  let hash=0; for(const c of classId) hash = (hash*31 + c.charCodeAt(0))>>>0;
  return CLASS_COLORS[hash % CLASS_COLORS.length];
}
/* ---- Échelle rouge (adversaire plus faible) / vert (adversaire plus fort) pour l'écart d'ELO ---- */
function hexToRgb(hex){
  hex = hex.replace('#','');
  return {r:parseInt(hex.slice(0,2),16), g:parseInt(hex.slice(2,4),16), b:parseInt(hex.slice(4,6),16)};
}
function mixColor(hex1, hex2, t){
  const c1=hexToRgb(hex1), c2=hexToRgb(hex2);
  const r=Math.round(c1.r+(c2.r-c1.r)*t), g=Math.round(c1.g+(c2.g-c1.g)*t), b=Math.round(c1.b+(c2.b-c1.b)*t);
  return `rgb(${r},${g},${b})`;
}
function textColorFor(rgbStr){
  const m = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgbStr);
  if(!m) return '#111';
  const [r,g,b] = [1,2,3].map(i=>+m[i]);
  const lum = (0.299*r+0.587*g+0.114*b)/255;
  return lum>0.62 ? '#101014' : '#fff';
}
function eloGapInfo(diff){
  // diff = ELO de l'adversaire − ELO du joueur. > 0 : adversaire plus fort (vert). < 0 : plus faible (rouge).
  const ad = Math.abs(diff);
  let bg;
  if(ad<=4){
    bg = '#FFD93D'; // écart quasi nul -> jaune
  } else {
    const t = Math.min(1, (ad-4)/36); // pleine intensité vers ~40 points d'écart
    bg = diff>0 ? mixColor('#D7F5A6','#3E8E0C', t) : mixColor('#FFD2C7','#C81C10', t);
  }
  return { label:(diff>=0?'+':'')+diff+' ELO', bg, color:textColorFor(bg) };
}

/* ---------------------------------------------------------
   4. IMPORT DE CLASSE — formats souples
   - Une seule colonne : "NOM Prénom" (comme avant)
   - Deux colonnes (ou plus) : Colonne A = Nom, Colonne B = Prénom
     (ou repérées par leurs en-têtes "Nom"/"Prénom" si présentes,
     quel que soit leur ordre)
   - Détection automatique du séparateur (; , ou tabulation)
--------------------------------------------------------- */
function stripAccents(str){
  return String(str==null?'':str).normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function parseNameField(rawField){
  let field = String(rawField==null?'':rawField).trim();
  field = field.replace(/^"+|"+$/g,'').trim();
  if(!field) return null;
  if(/^(nom|name|eleves?|classe)/i.test(stripAccents(field)) && field.split(' ').length<=2) return null; // skip header-ish
  const tokens = field.split(/\s+/).filter(Boolean);
  if(tokens.length===1) return {nom:tokens[0], prenom:''};
  let i=0;
  const isUpperToken = (t)=> t === t.toUpperCase() && t !== t.toLowerCase();
  while(i<tokens.length-1 && isUpperToken(tokens[i])) i++;
  if(i===0) i=1; // fallback: first token = nom
  const nom = tokens.slice(0,i).join(' ');
  const prenom = tokens.slice(i).join(' ') || tokens[tokens.length-1];
  return {nom: capitalize(nom), prenom: capitalize(prenom)};
}
function looksLikeHeaderCell(c){
  return /^(nom|name|last ?name|pr[ée]nom|first ?name|classe|eleves?|eleve|sexe|genre|date de naissance|nee?\(?e?\)?)$/i.test(stripAccents(String(c==null?'':c).trim()));
}
function isHeaderRow(cells){
  return cells.some(looksLikeHeaderCell);
}
function findColIndex(header, regex){
  for(let i=0;i<header.length;i++){ if(regex.test(stripAccents(String(header[i]==null?'':header[i]).trim()))) return i; }
  return -1;
}
/* Transforme un tableau 2D brut (lignes x colonnes, quelle que soit la source :
   CSV découpé ou feuille Excel) en liste {nom, prenom}. Tolère les colonnes en
   trop (classe, sexe...), les lignes vides et l'ordre des colonnes si un en-tête
   est présent. */
function parseStudentRows2D(rows2d){
  const rows = (rows2d||[])
    .map(r=> (r||[]).map(c=> c==null ? '' : String(c).trim()))
    .filter(r=> r.some(c=> c!==''));
  if(!rows.length) return [];
  let nomIdx=0, prenomIdx=1, start=0;
  if(isHeaderRow(rows[0])){
    start=1;
    const nIdx = findColIndex(rows[0], /^(nom|name|last ?name)/i);
    const pIdx = findColIndex(rows[0], /^(prenom|first ?name)/i);
    if(nIdx>=0) nomIdx=nIdx;
    if(pIdx>=0) prenomIdx=pIdx;
  }
  const out = [];
  for(let i=start;i<rows.length;i++){
    const r = rows[i];
    const nomCell = r[nomIdx]!==undefined ? r[nomIdx] : '';
    const prenomCell = r[prenomIdx]!==undefined ? r[prenomIdx] : '';
    if(nomCell && prenomCell && nomIdx!==prenomIdx){
      out.push({nom:capitalize(nomCell), prenom:capitalize(prenomCell)});
    } else if(nomCell){
      // repli : une seule colonne renseignée -> format combiné "NOM Prénom"
      const parsed = parseNameField(nomCell);
      if(parsed) out.push(parsed);
    } else if(prenomCell){
      const parsed = parseNameField(prenomCell);
      if(parsed) out.push(parsed);
    }
  }
  return out;
}
function detectDelimiter(line){
  const counts = {';':(line.match(/;/g)||[]).length, ',':(line.match(/,/g)||[]).length, '\t':(line.match(/\t/g)||[]).length};
  let best=null, bestN=0;
  Object.keys(counts).forEach(d=>{ if(counts[d]>bestN){ bestN=counts[d]; best=d; } });
  return best; // null => pas de séparateur détecté, colonne unique
}
function splitCsvLine(line, delim){
  if(!delim) return [line];
  const out=[]; let cur=''; let inQ=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){ inQ=!inQ; continue; }
    if(ch===delim && !inQ){ out.push(cur); cur=''; continue; }
    cur+=ch;
  }
  out.push(cur);
  return out;
}
function parseCsvNames(text){
  const lines = String(text||'').split(/\r?\n/).filter(l=>l.trim()!=='');
  if(!lines.length) return [];
  const delim = detectDelimiter(lines[0]);
  const rows2d = lines.map(l=> splitCsvLine(l, delim));
  return parseStudentRows2D(rows2d);
}
async function parseXlsxNames(arrayBuffer){
  await ensureSheetJs();
  const wb = XLSX.read(arrayBuffer, {type:'array'});
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows2d = XLSX.utils.sheet_to_json(sheet, {header:1, raw:false, defval:''});
  return parseStudentRows2D(rows2d);
}
function capitalize(str){
  return str.split(/\s+/).map(w=> w.split('-').map(p=> p ? p.charAt(0).toUpperCase()+p.slice(1).toLowerCase() : p).join('-')).join(' ');
}

/* ---------------------------------------------------------
   5. STUDENT FACTORY
--------------------------------------------------------- */
function newStudent(nom, prenom){
  return {
    id: uid('s'), nom: nom||'', prenom: prenom||'',
    elo:100, mj:0, v:0, d:0, pf:0, pa:0, masteryElo:0,
    leaderWinStreak:0,
  };
}

/* ---------------------------------------------------------
   6. VIEW ROUTING
--------------------------------------------------------- */
const VIEW_TITLES = {home:'Mes classes', match:'Match en cours', ranking:'Classement ELO', admin:'Administration'};

function goView(view){
  if((view==='ranking'||view==='match') && !DB.activeClassId){
    toast('Choisis d’abord une classe', 'err'); view='home';
  }
  if(view!=='admin' && STATE.adminUnlocked){ STATE.adminUnlocked = false; } // re-verrouillage systématique
  STATE.view = view;
  document.querySelectorAll('.view').forEach(v=>v.classList.add('hidden'));
  document.getElementById('view-'+view).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.view===view));
  document.getElementById('classPill').style.display = DB.activeClassId ? 'flex':'none';
  if(view==='home') renderHome();
  if(view==='ranking') renderRanking();
  if(view==='admin') renderAdmin();
  renderClassPill();
}

function renderClassPill(){
  const sel = document.getElementById('classSelect');
  sel.innerHTML = Object.values(DB.classes).map(c=>`<option value="${c.id}" ${c.id===DB.activeClassId?'selected':''}>${escapeHtml(c.name)}</option>`).join('');
  const cls = activeClass();
  document.getElementById('classCount').textContent = cls ? cls.students.length : 0;
}

/* ---------------------------------------------------------
   7. HOME / CLASSES
--------------------------------------------------------- */
function renderHome(){
  document.getElementById('homeYear').textContent = new Date().getFullYear()+' / '+(new Date().getFullYear()+1);
  const grid = document.getElementById('classGrid');
  const classes = Object.values(DB.classes);
  let html = classes.map(c=>{
    const color = classColor(c.id);
    return `
    <div class="class-card" data-class="${c.id}" style="background:linear-gradient(160deg, rgba(5,12,34,.10) 0%, rgba(5,12,34,.58) 100%), ${color};">
      <div class="icon">${escapeHtml((c.name||'?').slice(0,2).toUpperCase())}</div>
      <h3>${escapeHtml(c.name)}</h3>
      <p>${c.students.length} élève${c.students.length>1?'s':''}</p>
    </div>`;
  }).join('');
  html += `<div class="class-card add" id="btnOpenNewClass">
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
      Nouvelle classe
    </div>`;
  grid.innerHTML = html;
  grid.querySelectorAll('.class-card[data-class]').forEach(el=>{
    el.addEventListener('click', ()=>{
      DB.activeClassId = el.dataset.class; saveDB();
      toast('Classe « '+DB.classes[el.dataset.class].name+' » sélectionnée','ok');
      goView('ranking');
    });
  });
  document.getElementById('btnOpenNewClass').addEventListener('click', openNewClassModal);
}

/* ----- New class modal ----- */
function openNewClassModal(){
  document.getElementById('newClassName').value='';
  document.getElementById('manualRows').innerHTML='';
  addManualRow(); addManualRow(); addManualRow();
  document.getElementById('csvPreview').classList.add('hidden');
  document.getElementById('csvPreview').innerHTML='';
  document.getElementById('newClassError').classList.add('hidden');
  csvParsedRows = [];
  setImportMode('csv');
  document.getElementById('modalNewClass').classList.remove('hidden');
}
function setImportMode(mode){
  document.querySelectorAll('#modalNewClass .chip[data-import]').forEach(c=>c.classList.toggle('active', c.dataset.import===mode));
  document.getElementById('manualImportZone').classList.toggle('hidden', mode!=='manual');
  document.getElementById('csvImportZone').classList.toggle('hidden', mode!=='csv');
}
function addManualRow(prenom,nom){
  const row = document.createElement('div');
  row.className='student-manual-row';
  row.innerHTML = `<input class="input manual-prenom" placeholder="Prénom" value="${escapeHtml(prenom||'')}">
    <input class="input manual-nom" placeholder="NOM" value="${escapeHtml(nom||'')}">
    <button class="btn ghost small">✕</button>`;
  row.querySelector('button').addEventListener('click', ()=>row.remove());
  document.getElementById('manualRows').appendChild(row);
}
let csvParsedRows = [];
function initNewClassModalEvents(){
  document.querySelectorAll('#modalNewClass .chip[data-import]').forEach(c=>{
    c.addEventListener('click', ()=>setImportMode(c.dataset.import));
  });
  document.getElementById('btnAddManualRow').addEventListener('click', ()=>addManualRow());
  document.getElementById('btnCancelNewClass').addEventListener('click', ()=>document.getElementById('modalNewClass').classList.add('hidden'));
  document.getElementById('csvDropZone').addEventListener('click', ()=>document.getElementById('csvFileInput').click());
  document.getElementById('csvFileInput').addEventListener('change', (e)=>{
    const file = e.target.files[0]; if(!file) return;
    const ext = (file.name.split('.').pop()||'').toLowerCase();
    const showPreview = (rows)=>{
      csvParsedRows = rows;
      const prev = document.getElementById('csvPreview');
      prev.classList.remove('hidden');
      prev.innerHTML = '<table><thead><tr><th>Prénom</th><th>Nom</th></tr></thead><tbody>'+
        csvParsedRows.map(r=>`<tr><td>${escapeHtml(r.prenom)}</td><td>${escapeHtml(r.nom)}</td></tr>`).join('')+'</tbody></table>';
      toast(csvParsedRows.length+' élèves détectés','ok');
    };
    if(ext==='xls' || ext==='xlsx'){
      toast('Lecture du fichier Excel…');
      const reader = new FileReader();
      reader.onload = async ()=>{
        try{
          const rows = await parseXlsxNames(reader.result);
          if(!rows.length){ toast('Aucun nom détecté en colonne A','err'); return; }
          showPreview(rows);
        }catch(err){
          console.warn(err);
          toast('Connexion internet requise pour lire un fichier Excel (.xls/.xlsx)','err');
        }
      };
      reader.onerror = ()=> toast('Impossible de lire ce fichier','err');
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = ()=> showPreview(parseCsvNames(reader.result));
      reader.onerror = ()=> toast('Impossible de lire ce fichier','err');
      reader.readAsText(file, 'UTF-8');
    }
  });
  document.getElementById('btnCreateClass').addEventListener('click', ()=>{
    const errEl = document.getElementById('newClassError');
    errEl.classList.add('hidden');
    const name = document.getElementById('newClassName').value.trim();
    if(!name){ toast('Indique un nom de classe','err'); return; }
    const mode = document.querySelector('#modalNewClass .chip[data-import].active').dataset.import;
    let students = [];
    if(mode==='manual'){
      document.querySelectorAll('#manualRows .student-manual-row').forEach(row=>{
        const prenom = row.querySelector('.manual-prenom').value.trim();
        const nom = row.querySelector('.manual-nom').value.trim();
        if(prenom || nom) students.push(newStudent(nom,prenom));
      });
      if(!students.length){
        errEl.textContent = '⚠️ Ajoute au moins un élève avant de créer la classe.';
        errEl.classList.remove('hidden');
        toast('Ajoute au moins un élève','err'); return;
      }
    } else {
      if(!csvParsedRows.length){
        errEl.textContent = '⚠️ Importe d’abord un fichier CSV, XLS ou XLSX contenant au moins un élève.';
        errEl.classList.remove('hidden');
        toast('Importe un fichier CSV, XLS ou XLSX','err'); return;
      }
      students = csvParsedRows.map(r=>newStudent(r.nom,r.prenom));
    }
    if(!students.length){
      errEl.textContent = '⚠️ Ajoute au moins un élève avant de créer la classe.';
      errEl.classList.remove('hidden');
      toast('Ajoute au moins un élève','err'); return;
    }
    const id = uid('c');
    DB.classes[id] = { id, name, createdAt:Date.now(), students, settings: defaultClassSettings() };
    DB.activeClassId = id;
    saveDB();
    document.getElementById('modalNewClass').classList.add('hidden');
    toast('Classe créée avec '+students.length+' élèves','ok');
    goView('ranking');
  });
}

/* ---------------------------------------------------------
   8. PLAYER TILES
--------------------------------------------------------- */
function rankedStudents(cls){
  return [...cls.students].sort((a,b)=> b.elo - a.elo);
}

/* ---------------------------------------------------------
   9. PROFILE MODAL
--------------------------------------------------------- */
function openProfile(studentId){
  const cls = activeClass(); const s = cls.students.find(x=>x.id===studentId); if(!s) return;
  const ranked = rankedStudents(cls); const rank = ranked.indexOf(s)+1;
  document.getElementById('profileAvatar').style.background = avatarColor(s.id);
  document.getElementById('profileAvatar').textContent = avatarInitials(s);
  document.getElementById('profileName').textContent = displayName(s);
  document.getElementById('profileRank').textContent = `#${rank} du classement · ELO ${s.elo}`;
  const pct = s.mj ? Math.round((s.v/s.mj)*100) : 0;
  document.getElementById('profileStats').innerHTML = `
    <div class="stat-box"><div class="v">${s.mj}</div><div class="l">Matchs</div></div>
    <div class="stat-box"><div class="v">${s.v}</div><div class="l">Victoires</div></div>
    <div class="stat-box"><div class="v">${s.d}</div><div class="l">Défaites</div></div>
    <div class="stat-box"><div class="v">${pct}%</div><div class="l">% Victoires</div></div>`;
  // 5 derniers matchs
  const studentMatches = DB.matches.filter(m=> m.classId===cls.id && (m.playerAId===s.id || m.playerBId===s.id))
    .sort((a,b)=> b.date-a.date).slice(0,5);
  const lastMatchesBody = studentMatches.length ? studentMatches.map(m=>{
    const won = m.winnerId===s.id;
    const oppId = m.playerAId===s.id ? m.playerBId : m.playerAId;
    const opp = cls.students.find(x=>x.id===oppId);
    const scoreTxt = m.sets && m.sets.length
      ? m.sets.map(st=> (m.playerAId===s.id ? st[0]+'-'+st[1] : st[1]+'-'+st[0])).join(', ')
      : (m.playerAId===s.id ? m.ptsA+'-'+m.ptsB : m.ptsB+'-'+m.ptsA);
    const bonus = won ? m.eloDeltaWinner : m.eloDeltaLoser;
    return `<div class="last-match-row ${won?'win':'lose'}">
      <span class="lmr-opp">${escapeHtml(opp?displayName(opp):'?')}</span>
      <span class="lmr-result">${won?'✔ Victoire':'✘ Défaite'}</span>
      <span class="lmr-score">${escapeHtml(scoreTxt)}</span>
      <span class="lmr-bonus ${bonus>=0?'pos':'neg'}">${bonus>=0?'+':''}${bonus} ELO</span>
    </div>`;
  }).join('') : '<p class="empty-note">Aucun match joué.</p>';
  document.getElementById('profileLastMatches').innerHTML =
    `<div class="profile-section-title">5 derniers matchs</div>${lastMatchesBody}`;

  // Maîtrises validées — pour chaque maîtrise, le nombre exact de fois où elle a été validée
  const studentAwards = DB.masteryAwards.filter(a=> a.classId===cls.id && a.studentId===s.id);
  const countsByName = {};
  studentAwards.forEach(a=>{ countsByName[a.masteryName] = (countsByName[a.masteryName]||0)+1; });
  const masteryBody = studentAwards.length
    ? `<div class="profile-mastery-list">${Object.entries(countsByName).map(([name,count])=>
        `<span class="profile-mastery-chip">🏅 ${escapeHtml(name)} — validée ${count} fois</span>`).join('')}</div>`
    : '<p class="empty-note">Aucune maîtrise validée.</p>';
  document.getElementById('profileMasteries').innerHTML =
    `<div class="profile-section-title">Maîtrises validées — ${studentAwards.length} au total</div>${masteryBody}`;

  const opList = document.getElementById('opponentList');
  const others = ranked.filter(x=>x.id!==s.id);
  opList.innerHTML = others.map(o=>{
    const diff = o.elo - s.elo;
    const gap = eloGapInfo(diff);
    return `<div class="tile" data-id="${o.id}">
      <div class="name" style="font-size:12.5px;">${escapeHtml(displayName(o))}</div>
      <div class="elo" style="font-size:10.5px;">ELO ${o.elo}</div>
      <span class="opp-elo-gap" style="background:${gap.bg};color:${gap.color};">${gap.label}</span>
    </div>`;
  }).join('') || '<p style="font-size:12px;color:var(--ink-soft);">Pas d’adversaire disponible.</p>';
  opList.querySelectorAll('.tile').forEach(t=> t.addEventListener('click', ()=>{
    document.getElementById('modalProfile').classList.add('hidden');
    startMatch(s.id, t.dataset.id);
  }));
  document.getElementById('modalProfile').classList.remove('hidden');
}

/* ---------------------------------------------------------
   10. MATCH ENGINE
--------------------------------------------------------- */
function startMatch(idA, idB){
  const cls = activeClass();
  const md = cls.settings.matchDefaults;
  STATE.currentMatch = {
    playerAId:idA, playerBId:idB,
    params: JSON.parse(JSON.stringify(md)),
    refereeId:null,
    sessionLabel: todayLabel(),
    sets: [], // [[a,b], ...] validated sets
    curA:0, curB:0,
    givenAwards: {}, // "studentId:masteryId" -> awardId
    abandonId: null,
  };
  goView('match');
  renderMatch();
}
function todayLabel(){
  const d = new Date();
  return 'Séance '+d.toLocaleDateString('fr-FR');
}

function sportLabel(sport){ return {tennis_de_table:'🏓 Tennis de table', badminton:'🏸 Badminton', autre:'🎯 Autre'}[sport]||sport; }

function renderMatch(){
  const cls = activeClass(); const m = STATE.currentMatch; if(!m) return;
  const A = cls.students.find(s=>s.id===m.playerAId), B = cls.students.find(s=>s.id===m.playerBId);
  const p = m.params;

  // settings strip (lecture seule — se règle en Administration)
  const setsLabel = p.setsMode==='gagnants' ? `${p.setsTarget} set(s) gagnant(s)` : `${p.setsTarget} set(s) au total`;
  document.getElementById('matchSettingsStrip').innerHTML = `
    <span class="chip active">${sportLabel(p.sport)}</span>
    <span class="chip">${setsLabel}</span>
    <span class="chip">${p.winBy2?'2 pts d’écart':'Score sec'}</span>
    <span class="chip">${p.tiebreak==='sets'?'Sets remportés':'Goal-average'}</span>
  `;

  document.getElementById('matchSessionInput').value = m.sessionLabel;

  const setsWonA = m.sets.filter(s=>s[0]>s[1]).length, setsWonB = m.sets.filter(s=>s[1]>s[0]).length;
  document.getElementById('vsBoard').innerHTML = `
    <div class="player-badge ${setsWonA>setsWonB?'leading':''}">
      <div class="avatar-lg" style="background:${avatarColor(A.id)};margin:0 auto 8px;">${avatarInitials(A)}</div>
      <div class="name">${escapeHtml(displayName(A))}</div>
      <div class="elo-tag">ELO ${A.elo} · Sets ${setsWonA}</div>
    </div>
    <div class="vs-mid">VS</div>
    <div class="player-badge ${setsWonB>setsWonA?'leading':''}">
      <div class="avatar-lg" style="background:${avatarColor(B.id)};margin:0 auto 8px;">${avatarInitials(B)}</div>
      <div class="name">${escapeHtml(displayName(B))}</div>
      <div class="elo-tag">ELO ${B.elo} · Sets ${setsWonB}</div>
    </div>`;

  document.getElementById('setsStrip').innerHTML = m.sets.map((s,i)=>`<div class="set-pill done">Set ${i+1} : ${s[0]}-${s[1]}</div>`).join('')
    || '<div class="set-pill">Aucun set joué</div>';

  const target = p.pointsPerSet[m.sets.length] || p.pointsPerSet[p.pointsPerSet.length-1] || 11;
  document.getElementById('dialsRow').innerHTML = `
    <div class="dial-col">
      <div class="who">${escapeHtml(displayName(A))}</div>
      <div class="dial-wrap" id="dialA"></div>
      <div class="dial-btns"><button id="dialAminus">−</button><button id="dialAplus">+</button></div>
    </div>
    <div class="dial-col">
      <div class="who">${escapeHtml(displayName(B))}</div>
      <div class="dial-wrap" id="dialB"></div>
      <div class="dial-btns"><button id="dialBminus">−</button><button id="dialBplus">+</button></div>
    </div>`;
  buildDial('dialA', m.curA, target, v=>{ m.curA=v; });
  buildDial('dialB', m.curB, target, v=>{ m.curB=v; });
  document.getElementById('dialAminus').addEventListener('click', ()=> updateDialValue('dialA', Math.max(0,m.curA-1)));
  document.getElementById('dialAplus').addEventListener('click', ()=> updateDialValue('dialA', m.curA+1));
  document.getElementById('dialBminus').addEventListener('click', ()=> updateDialValue('dialB', Math.max(0,m.curB-1)));
  document.getElementById('dialBplus').addEventListener('click', ()=> updateDialValue('dialB', m.curB+1));

  // abandon buttons
  document.getElementById('abandonRow').innerHTML = m.abandonId ? '' : `
    <button class="btn secondary small" data-abandon="${A.id}">🚩 Abandon ${escapeHtml(displayName(A))}</button>
    <button class="btn secondary small" data-abandon="${B.id}">🚩 Abandon ${escapeHtml(displayName(B))}</button>`;

  // masteries — attribution directe pendant la saisie du score
  // (l'arbitre est choisi ici même, via la maîtrise "Arbitrage", plutôt que dans un champ séparé)
  const referee = m.refereeId ? cls.students.find(x=>x.id===m.refereeId) : null;
  const potentialReferees = cls.students.filter(st=> st.id!==m.playerAId && st.id!==m.playerBId);
  const masteries = (cls.settings.masteries || []).filter(mst=> mst.active && (mst.sport==='general' || mst.sport===p.sport));
  document.getElementById('matchMasteriesPanel').innerHTML = masteries.length ? masteries.map(mst=>{
    if(mst.scope==='arbitre'){
      const refPicker = `<select class="input input-compact" style="width:auto;min-width:170px;flex:0 0 auto;" data-referee-picker>
        <option value="">— Choisir l’arbitre —</option>
        ${potentialReferees.map(st=>`<option value="${st.id}" ${st.id===m.refereeId?'selected':''}>${escapeHtml(displayName(st))}</option>`).join('')}
      </select>`;
      let chip = '';
      if(referee){
        const key = referee.id+':'+mst.id;
        const given = !!m.givenAwards[key];
        chip = `<button type="button" class="mastery-chip ${given?'given':''}" data-mastery-chip data-student-id="${referee.id}" data-mastery-id="${mst.id}">${given?'✓ ':''}${escapeHtml(displayName(referee))} (arbitre)</button>`;
      }
      return `<div class="mastery-award-block">
        <div class="mab-text"><span class="mab-title">🏅 ${escapeHtml(mst.name)}</span> ${scopeTag(mst.scope)}<span class="mab-desc">+${mst.elo} ELO · ${escapeHtml(mst.description||'')}</span></div>
        <div class="mastery-chips" style="align-items:center;">${refPicker}${chip}</div>
      </div>`;
    }
    let eligible;
    if(mst.scope==='joueurs') eligible = [A,B];
    else eligible = referee ? [A,B,referee] : [A,B]; // 'tous'
    const chips = eligible.map(part=>{
      const key = part.id+':'+mst.id;
      const given = !!m.givenAwards[key];
      return `<button type="button" class="mastery-chip ${given?'given':''}" data-mastery-chip data-student-id="${part.id}" data-mastery-id="${mst.id}">${given?'✓ ':''}${escapeHtml(displayName(part))}${part.id===m.refereeId?' (arbitre)':''}</button>`;
    }).join('');
    return `<div class="mastery-award-block">
      <div class="mab-text"><span class="mab-title">🏅 ${escapeHtml(mst.name)}</span> ${scopeTag(mst.scope)}<span class="mab-desc">+${mst.elo} ELO · ${escapeHtml(mst.description||'')}</span></div>
      <div class="mastery-chips">${chips}</div>
    </div>`;
  }).join('') : '';

  const single = isSingleSetMatch(p);
  const matchOver = isMatchOver(m);
  document.getElementById('btnValidateSet').classList.toggle('hidden', single || matchOver || !!m.abandonId);
  document.getElementById('btnFinishMatch').classList.toggle('hidden', !single && !matchOver && !m.abandonId);
  document.getElementById('btnUndoLastSet').classList.toggle('hidden', !m.sets.length || !!m.abandonId);
}

function awardMastery(studentId, masteryId, sessionLabel){
  const cls = activeClass();
  const s = cls.students.find(x=>x.id===studentId), mst = cls.settings.masteries.find(x=>x.id===masteryId);
  if(!s||!mst) return null;
  const award = {id:uid('aw'), classId:cls.id, studentId, masteryId, masteryName:mst.name, elo:mst.elo, sessionLabel:sessionLabel||todayLabel(), date:Date.now()};
  DB.masteryAwards.push(award);
  s.elo += mst.elo; s.masteryElo += mst.elo;
  saveDB();
  return award.id;
}
function revokeAwardSilent(awardId){
  const cls = activeClass();
  const idx = DB.masteryAwards.findIndex(a=>a.id===awardId); if(idx<0) return;
  const a = DB.masteryAwards[idx];
  const s = cls.students.find(x=>x.id===a.studentId);
  if(s){ s.elo -= a.elo; s.masteryElo -= a.elo; }
  DB.masteryAwards.splice(idx,1);
  saveDB();
}
function toggleMatchMastery(studentId, masteryId){
  const cls = activeClass(); const m = STATE.currentMatch; if(!m) return;
  const key = studentId+':'+masteryId;
  if(m.givenAwards[key]){
    revokeAwardSilent(m.givenAwards[key]);
    delete m.givenAwards[key];
    toast('Maîtrise retirée','ok');
  } else {
    const id = awardMastery(studentId, masteryId, m.sessionLabel);
    if(id){ m.givenAwards[key] = id; toast('Maîtrise attribuée 🏅','ok'); }
  }
  renderMatch();
}

const dialRegistry = {};
function updateDialValue(containerId, val){
  val = Math.max(0,val);
  dialRegistry[containerId].setValue(val);
}

/* --- Rotary "roue crantée" dial (clickwheel style) --- */
function buildDial(containerId, initial, target, onChange){
  const container = document.getElementById(containerId);
  container.innerHTML='';
  const size=180, cx=90, cy=90, r=78;
  const ns='http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox',`0 0 ${size} ${size}`);

  // outer track with tick marks
  const nTicks = 30;
  for(let i=0;i<nTicks;i++){
    const ang = (i/nTicks)*2*Math.PI - Math.PI/2;
    const x1 = cx + Math.cos(ang)*(r-6), y1 = cy + Math.sin(ang)*(r-6);
    const x2 = cx + Math.cos(ang)*r, y2 = cy + Math.sin(ang)*r;
    const line = document.createElementNS(ns,'line');
    line.setAttribute('x1',x1); line.setAttribute('y1',y1); line.setAttribute('x2',x2); line.setAttribute('y2',y2);
    const hue = i/nTicks;
    line.setAttribute('stroke', hue<0.33?'#3C87C9':hue<0.66?'#EF3982':'#7DC009');
    line.setAttribute('stroke-width','3'); line.setAttribute('stroke-linecap','round'); line.setAttribute('opacity','0.55');
    svg.appendChild(line);
  }
  const knob = document.createElementNS(ns,'circle');
  knob.setAttribute('cx',cx); knob.setAttribute('cy',cy); knob.setAttribute('r', r-16);
  knob.setAttribute('fill','#0E1B42'); knob.setAttribute('stroke','#1B2E63'); knob.setAttribute('stroke-width','2');
  svg.appendChild(knob);

  const handleGroup = document.createElementNS(ns,'g');
  handleGroup.setAttribute('opacity','0.5');
  const handleLine = document.createElementNS(ns,'line');
  handleLine.setAttribute('stroke','#F3F6FF'); handleLine.setAttribute('stroke-width','4'); handleLine.setAttribute('stroke-linecap','round');
  handleGroup.appendChild(handleLine);
  const handleDot = document.createElementNS(ns,'circle');
  handleDot.setAttribute('r','7'); handleDot.setAttribute('fill','#EF3982');
  handleGroup.appendChild(handleDot);
  svg.appendChild(handleGroup);
  container.appendChild(svg);

  const valueLabel = document.createElement('div');
  valueLabel.className='dial-value';
  valueLabel.innerHTML = `<div class="num" id="${containerId}_num">${initial}</div>`;
  container.appendChild(valueLabel);

  let value = initial;
  let rotation = 0; // visual accumulated degrees
  function paintHandle(){
    const rad = (rotation-90) * Math.PI/180;
    handleLine.setAttribute('x1', cx+Math.cos(rad)*38);
    handleLine.setAttribute('y1', cy+Math.sin(rad)*38);
    handleLine.setAttribute('x2', cx+Math.cos(rad)*(r-22));
    handleLine.setAttribute('y2', cy+Math.sin(rad)*(r-22));
    handleDot.setAttribute('cx', cx+Math.cos(rad)*(r-22));
    handleDot.setAttribute('cy', cy+Math.sin(rad)*(r-22));
  }
  function setValue(v, silent){
    value = Math.max(0, v);
    rotation = (value * (360/nTicks)) % 360;
    paintHandle();
    document.getElementById(containerId+'_num').textContent = value;
    if(!silent) onChange(value);
  }
  paintHandle();

  let dragging=false, lastAngle=0, accum=0;
  const DEG_PER_NOTCH = 360/nTicks;
  function angleAt(clientX, clientY){
    const rect = container.getBoundingClientRect();
    const dx = clientX-(rect.left+rect.width/2), dy = clientY-(rect.top+rect.height/2);
    return Math.atan2(dy,dx)*180/Math.PI;
  }
  function pointerDown(e){
    dragging=true; accum=0;
    const p = e.touches? e.touches[0]: e;
    lastAngle = angleAt(p.clientX,p.clientY);
    container.setPointerCapture && e.pointerId!==undefined && container.setPointerCapture(e.pointerId);
  }
  function pointerMove(e){
    if(!dragging) return;
    const p = e.touches? e.touches[0]: e;
    const ang = angleAt(p.clientX,p.clientY);
    let delta = ang-lastAngle;
    if(delta>180) delta-=360; if(delta<-180) delta+=360;
    lastAngle = ang;
    accum += delta;
    while(accum >= DEG_PER_NOTCH){ setValue(value+1); accum -= DEG_PER_NOTCH; }
    while(accum <= -DEG_PER_NOTCH){ setValue(Math.max(0,value-1)); accum += DEG_PER_NOTCH; }
    e.preventDefault && e.preventDefault();
  }
  function pointerUp(){ dragging=false; }
  container.addEventListener('pointerdown', pointerDown);
  container.addEventListener('pointermove', pointerMove);
  window.addEventListener('pointerup', pointerUp);
  container.addEventListener('touchstart', pointerDown, {passive:false});
  container.addEventListener('touchmove', pointerMove, {passive:false});
  window.addEventListener('touchend', pointerUp);

  dialRegistry[containerId] = { setValue };
  setValue(initial, true);
}

/* --- Set / match completion logic --- */
function setIsWon(a,b,target,winBy2){
  if(a===b) return false;
  const max = Math.max(a,b), min=Math.min(a,b);
  if(max<target) return false;
  if(!winBy2){
    // score sec : le set s'arrête pile à l'objectif, jamais au-delà
    return max===target && min<target;
  }
  // 2 points d'écart obligatoire
  if(max===target) return min<=target-2; // victoire nette
  return (max-min)===2 && min>=target-1; // prolongation en écart de 2
}
function describeSetError(a,b,target,winBy2){
  if(a===b) return 'Score invalide : égalité impossible en fin de set.';
  const max = Math.max(a,b), min = Math.min(a,b);
  if(max<target) return `Score invalide : il faut atteindre ${target} points pour terminer le set.`;
  if(!winBy2){
    if(max>target) return `Score invalide : en score sec, le score ne peut pas dépasser ${target} points.`;
    return `Score invalide : l'adversaire doit avoir moins de ${target} points.`;
  }
  if(max===target) return `Score invalide : à ${target}-${min}, l'écart n'est pas suffisant (2 points d'écart obligatoires).`;
  return `Score invalide : au-delà de ${target} points, l'écart doit être d'exactement 2 points (ex. ${target+1}-${target-1}).`;
}
function isSingleSetMatch(p){ return p.setsTarget===1; }
function isMatchOver(m){
  const p = m.params;
  const setsWonA = m.sets.filter(s=>s[0]>s[1]).length, setsWonB = m.sets.filter(s=>s[1]>s[0]).length;
  if(p.setsMode==='gagnants'){
    return setsWonA>=p.setsTarget || setsWonB>=p.setsTarget;
  } else {
    return m.sets.length >= p.setsTarget;
  }
}

document.addEventListener('click', (e)=>{
  if(e.target.id==='btnValidateSet') validateCurrentSet();
  if(e.target.id==='btnFinishMatch') tryFinishMatch();
  if(e.target.id==='btnUndoLastSet') undoLastSet();
  if(e.target.id==='btnCancelRecap') cancelRecap();
});
function pushCurrentSetIfValid(){
  const m = STATE.currentMatch; const p = m.params;
  const idx = m.sets.length;
  const target = p.pointsPerSet[idx] || p.pointsPerSet[p.pointsPerSet.length-1] || 11;
  if(!setIsWon(m.curA,m.curB,target,p.winBy2)){
    toast(describeSetError(m.curA,m.curB,target,p.winBy2),'err');
    return false;
  }
  m.sets.push([m.curA, m.curB]);
  m.curA=0; m.curB=0;
  return true;
}
function validateCurrentSet(){
  const m = STATE.currentMatch; const p = m.params;
  if(p.setsMode==='total' && m.sets.length>=p.setsTarget){ toast('Nombre de sets déjà atteint','err'); return; }
  if(!pushCurrentSetIfValid()) return;
  renderMatch();
}
function undoLastSet(){
  const m = STATE.currentMatch; if(!m || !m.sets.length) return;
  const last = m.sets.pop();
  toast('Set annulé : '+last[0]+'-'+last[1],'ok');
  renderMatch();
}
function tryFinishMatch(){
  const m = STATE.currentMatch; const p = m.params;
  if(m.abandonId){ openRecap(); return; }
  m._preFinish = {sets: m.sets.map(s=>[...s]), abandonId: m.abandonId};
  if(isSingleSetMatch(p) && m.sets.length===0){
    if(!pushCurrentSetIfValid()){ m._preFinish=null; renderMatch(); return; }
  }
  if(!isMatchOver(m)){ m._preFinish=null; toast('Le match n’est pas encore terminé','err'); return; }
  openRecap();
}
function triggerAbandon(studentId){
  const cls = activeClass(); const m = STATE.currentMatch; if(!m) return;
  const s = cls.students.find(x=>x.id===studentId); if(!s) return;
  const target = m.params.pointsPerSet[0]||11;
  if(!confirm(displayName(s)+' abandonne la rencontre : le match sera clos en '+target+'-0. Confirmer ?')) return;
  m._preFinish = {sets: m.sets.map(s=>[...s]), abandonId: m.abandonId};
  m.abandonId = studentId;
  m.sets = studentId===m.playerAId ? [[0,target]] : [[target,0]];
  m.curA=0; m.curB=0;
  toast('Abandon enregistré','ok');
  renderMatch();
  openRecap();
}
function cancelRecap(){
  document.getElementById('modalRecap').classList.add('hidden');
  const m = STATE.currentMatch; if(!m) return;
  if(m._preFinish){ m.sets = m._preFinish.sets; m.abandonId = m._preFinish.abandonId; m._preFinish=null; }
  m.pendingResult = null;
  renderMatch();
}

function computeMatchWinner(m){
  const p = m.params;
  const setsWonA = m.sets.filter(s=>s[0]>s[1]).length, setsWonB = m.sets.filter(s=>s[1]>s[0]).length;
  const ptsA = m.sets.reduce((t,s)=>t+s[0],0), ptsB = m.sets.reduce((t,s)=>t+s[1],0);
  let winner;
  if(p.tiebreak==='goalaverage'){
    winner = ptsA===ptsB ? (setsWonA>=setsWonB?'A':'B') : (ptsA>ptsB?'A':'B');
  } else {
    winner = setsWonA===setsWonB ? (ptsA>=ptsB?'A':'B') : (setsWonA>setsWonB?'A':'B');
  }
  return {winner, setsWonA, setsWonB, ptsA, ptsB};
}

/* ---------------------------------------------------------
   11. ELO CALCULATION
--------------------------------------------------------- */
function pctDiff(oppElo, playerElo){ return ((oppElo-playerElo)/playerElo)*100; }
function variableBracketValue(diffPct, table){
  if(diffPct <= -71) return table.winL71!==undefined ? table : null; // placeholder not used directly
}
function eloVariableGain(playerElo, oppElo, isWin, settings){
  const d = pctDiff(oppElo, playerElo);
  const table = isWin ? settings.eloVariable.win : settings.eloVariable.loss;
  if(d===0) return isWin? table.winEqual : table.lossEqual;
  if(d<0){ // opponent weaker
    const ad = Math.abs(d);
    if(ad>71) return isWin? table.winL71: table.lossL71;
    if(ad>=41) return isWin? table.winL70_41: table.lossL70_41;
    if(ad>=20) return isWin? table.winL40_20: table.lossL40_20;
    return isWin? table.winL19_1: table.lossL19_1;
  } else { // opponent stronger
    if(d<=10) return isWin? table.winH0_10: table.lossH0_10;
    if(d<=20) return isWin? table.winH11_20: table.lossH11_20;
    if(d<=30) return isWin? table.winH21_30: table.lossH21_30;
    if(d<=50) return isWin? table.winH31_50: table.lossH31_50;
    if(d<=70) return isWin? table.winH51_70: table.lossH51_70;
    return isWin? table.winH71: table.lossH71;
  }
}
function styleBonus(marginPts, isWin, settings){
  const sb = settings.styleBonus;
  if(isWin){
    if(marginPts>=sb.winM2) return sb.winB2;
    if(marginPts>=sb.winM1) return sb.winB1;
    return 0;
  } else {
    if(marginPts<=sb.lossM2) return sb.lossB2;
    if(marginPts<sb.lossM1) return sb.lossB1;
    return 0;
  }
}

/* ---------------------------------------------------------
   12. RECAP & SAVE MATCH
--------------------------------------------------------- */
function matchMasteryLinesFor(studentId, m){
  const lines = [];
  Object.keys(m.givenAwards||{}).forEach(key=>{
    const sid = key.split(':')[0];
    if(sid!==studentId) return;
    const rec = DB.masteryAwards.find(a=>a.id===m.givenAwards[key]);
    if(rec) lines.push({label:'🏅 Bonus Maîtrise : '+rec.masteryName, value: rec.elo});
  });
  return lines;
}
function buildEloLines(student, opponent, isWin, baseGain, styleGain, leaderGain, settings, m){
  const lines = [];
  if(settings.eloMode==='variable'){
    const diffPct = Math.round(pctDiff(opponent.elo, student.elo));
    const sign = diffPct>=0 ? '+' : '';
    lines.push({label: (isWin?'Victoire':'Défaite')+' contre adversaire classé '+sign+diffPct+'%', value: baseGain});
  } else {
    lines.push({label: isWin?'Victoire':'Défaite', value: baseGain});
  }
  if(styleGain) lines.push({label: isWin? 'Bonus « gagner avec la manière »' : 'Bonus « perdre avec la manière »', value: styleGain});
  if(leaderGain) lines.push({label:'Bonus leader (série en tête)', value: leaderGain});
  lines.push(...matchMasteryLinesFor(student.id, m));
  return lines;
}
function renderEloColumn(student, lines){
  const total = lines.reduce((s,l)=> s+l.value, 0);
  return `<div class="elo-breakdown-col">
    <div class="ebc-name">${escapeHtml(displayName(student))}</div>
    <div class="ebc-lines">${lines.map(l=>`<div class="ebc-line"><span>${escapeHtml(l.label)}</span><b class="${l.value>=0?'pos':'neg'}">${l.value>=0?'+':''}${l.value}</b></div>`).join('')}</div>
    <div class="ebc-total ${total>=0?'pos':'neg'}">${total>=0?'+':''}${total} ELO</div>
  </div>`;
}
function openRecap(){
  const cls = activeClass(); const m = STATE.currentMatch;
  const A = cls.students.find(s=>s.id===m.playerAId), B = cls.students.find(s=>s.id===m.playerBId);
  const res = computeMatchWinner(m);
  const winnerS = res.winner==='A'?A:B, loserS = res.winner==='A'?B:A;
  const margin = Math.abs(res.ptsA-res.ptsB);
  const settings = cls.settings;

  let winGain, loseGain;
  if(settings.eloMode==='fixe'){
    winGain = settings.eloFixed.win; loseGain = settings.eloFixed.loss;
  } else {
    winGain = eloVariableGain(winnerS.elo, loserS.elo, true, settings);
    loseGain = eloVariableGain(loserS.elo, winnerS.elo, false, settings);
  }
  const winStyle = m.abandonId ? 0 : styleBonus(margin, true, settings);
  const loseStyle = m.abandonId ? 0 : styleBonus(margin, false, settings);

  // leader streak
  const ranked = rankedStudents(cls);
  const leaderId = ranked[0] ? ranked[0].id : null;
  let leaderBonusApplied = 0;
  let newStreak = winnerS.leaderWinStreak;
  if(winnerS.id===leaderId){
    newStreak = (winnerS.leaderWinStreak||0)+1;
    if(newStreak >= settings.leaderStreak.streak){ leaderBonusApplied = settings.leaderStreak.bonus; newStreak=0; }
  } else {
    newStreak = winnerS.leaderWinStreak; // unaffected unless they are leader
  }
  let loserStreakReset = loserS.id===leaderId ? 0 : loserS.leaderWinStreak;

  const totalWinGain = winGain + winStyle + leaderBonusApplied;
  const totalLoseGain = loseGain + loseStyle;

  STATE.currentMatch.pendingResult = { res, winnerS, loserS, winGain, loseGain, winStyle, loseStyle, leaderBonusApplied, totalWinGain, totalLoseGain, newStreak, loserStreakReset };

  document.getElementById('recapTitle').textContent = m.abandonId
    ? `🚩 ${escapeHtml(displayName(winnerS))} remporte (abandon adverse)`
    : `🏆 ${escapeHtml(displayName(winnerS))} remporte le match !`;
  const winLines = buildEloLines(winnerS, loserS, true, winGain, winStyle, leaderBonusApplied, settings, m);
  const loseLines = buildEloLines(loserS, winnerS, false, loseGain, loseStyle, 0, settings, m);
  document.getElementById('recapBody').innerHTML = `
    <p style="font-size:13px;color:var(--ink-soft);margin-bottom:12px;">${res.setsWonA}-${res.setsWonB} sets · ${res.ptsA}-${res.ptsB} pts</p>
    <div class="elo-breakdown">
      ${renderEloColumn(winnerS, winLines)}
      ${renderEloColumn(loserS, loseLines)}
    </div>`;
  document.getElementById('modalRecap').classList.remove('hidden');
}

function saveCurrentMatch(){
  const cls = activeClass(); const m = STATE.currentMatch;
  const A = cls.students.find(s=>s.id===m.playerAId), B = cls.students.find(s=>s.id===m.playerBId);
  const pr = m.pendingResult; const res = pr.res;
  const winnerS = pr.winnerS, loserS = pr.loserS;

  const record = {
    id: uid('mt'), classId: cls.id, date: Date.now(), sessionLabel: m.sessionLabel,
    sport: m.params.sport, params: m.params,
    playerAId:A.id, playerBId:B.id, refereeId:m.refereeId||null,
    sets: m.sets, winnerId: winnerS.id,
    ptsA: res.ptsA, ptsB: res.ptsB, setsWonA: res.setsWonA, setsWonB: res.setsWonB,
    eloDeltaWinner: pr.totalWinGain, eloDeltaLoser: pr.totalLoseGain,
    abandonId: m.abandonId || null,
  };
  DB.matches.push(record);

  winnerS.elo += pr.totalWinGain; winnerS.mj+=1; winnerS.v+=1; winnerS.leaderWinStreak = pr.newStreak;
  loserS.elo += pr.totalLoseGain; loserS.mj+=1; loserS.d+=1; loserS.leaderWinStreak = pr.loserStreakReset;

  A.pf += res.ptsA; A.pa += res.ptsB;
  B.pf += res.ptsB; B.pa += res.ptsA;
  winnerS.elo = Math.max(0, winnerS.elo);
  loserS.elo = Math.max(0, loserS.elo);

  saveDB();
  document.getElementById('modalRecap').classList.add('hidden');
  toast('Match enregistré 🎉','ok');
  STATE.currentMatch=null;
  goView('ranking');
}

/* ---------------------------------------------------------
   14. RANKING (hub principal)
--------------------------------------------------------- */
function timeAgo(ts){
  const diff = Date.now() - ts;
  const min = Math.floor(diff/60000);
  if(min < 1) return "à l'instant";
  if(min < 60) return min+' min';
  const h = Math.floor(min/60);
  if(h < 24) return h+' h';
  const d = Math.floor(h/24);
  if(d < 7) return d+' j';
  return Math.floor(d/7)+' sem.';
}
function lastMatchForStudent(cls, studentId){
  const list = DB.matches.filter(m=> m.classId===cls.id && (m.playerAId===studentId || m.playerBId===studentId));
  if(!list.length) return null;
  list.sort((a,b)=> b.date-a.date);
  return list[0];
}
function scopeTag(scope){
  if(scope==='arbitre') return '<span class="mab-tag">👤 arbitre uniquement</span>';
  if(scope==='joueurs') return '<span class="mab-tag mab-tag-joueurs">🏸 joueurs uniquement</span>';
  return '';
}
function scopeLabel(scope){
  return scope==='arbitre' ? 'Arbitre uniquement' : scope==='joueurs' ? 'Joueurs uniquement' : 'Tous (joueurs + arbitre)';
}
function rankBadgeHtml(rank){
  if(rank===1) return '🥇';
  if(rank===2) return '🥈';
  if(rank===3) return '🥉';
  return '#'+rank;
}
function renderMasteryTop3(cls){
  const row = document.getElementById('masteryTop3Row');
  const top = [...cls.students].filter(s=> s.masteryElo>0).sort((a,b)=> b.masteryElo-a.masteryElo).slice(0,3);
  if(!top.length){ row.innerHTML=''; return; }
  const medals = ['🥇','🥈','🥉'];
  row.innerHTML = `<div class="mastery-top3-title">🏅 Top 3 Maîtrises — le plus d’ELO gagné hors match</div>
    <div class="mastery-top3-cards">${top.map((s,i)=>`
      <div class="mastery-top3-card">
        <span class="mt3-medal">${medals[i]}</span>
        <span class="mt3-name">${escapeHtml(displayName(s))}</span>
        <span class="mt3-points">+${s.masteryElo} ELO</span>
      </div>`).join('')}</div>`;
}
function renderRanking(){
  const cls = activeClass(); if(!cls) return;
  document.getElementById('rankingClassName').textContent = cls.name+' · '+cls.students.length+' élèves';
  const search = (document.getElementById('tileSearch').value||'').toLowerCase();
  const ranked = rankedStudents(cls);
  const grid = document.getElementById('tilesGrid');
  renderMasteryTop3(cls);
  const filtered = ranked.filter(s=> displayName(s).toLowerCase().includes(search));
  if(!filtered.length){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Aucun élève trouvé.</div>`;
    return;
  }
  grid.innerHTML = filtered.map(s=>{
    const rank = ranked.indexOf(s)+1;
    const pct = s.mj ? Math.round((s.v/s.mj)*100) : 0;
    const lm = lastMatchForStudent(cls, s.id);
    let lastLine = '<span class="tile-last empty">Aucun match joué</span>';
    if(lm){
      const won = lm.winnerId===s.id;
      const oppId = lm.playerAId===s.id ? lm.playerBId : lm.playerAId;
      const opp = cls.students.find(x=>x.id===oppId);
      const delta = won ? lm.eloDeltaWinner : lm.eloDeltaLoser;
      lastLine = `<span class="tile-last ${won?'win':'lose'}">${won?'✔ V':'✘ D'} vs ${escapeHtml(opp?displayName(opp):'?')} · ${delta>=0?'+':''}${delta} ELO · ${timeAgo(lm.date)}</span>`;
    }
    const podiumClass = rank===1?'rank-gold':rank===2?'rank-silver':rank===3?'rank-bronze':rank<=10?'rank-top10':'';
    return `<div class="tile ${podiumClass}" data-id="${s.id}">
      <div class="tile-top">
        <span class="rank ${rank===1?'top1':rank===2?'top2':rank===3?'top3':rank<=10?'top10':''}">${rankBadgeHtml(rank)}</span>
        <div class="tile-id">
          <div class="name">${escapeHtml(displayName(s))}</div>
          <div class="elo">ELO <b>${s.elo}</b></div>
        </div>
      </div>
      <div class="tile-stats-row">${s.mj} MJ · ${s.v}V/${s.d}D · ${pct}%</div>
      ${lastLine}
    </div>`;
  }).join('');
  grid.querySelectorAll('.tile').forEach(t=> t.addEventListener('click', ()=> openProfile(t.dataset.id)));
}

/* ---------------------------------------------------------
   15. ADMIN
--------------------------------------------------------- */
function renderAdmin(){
  const cls = activeClass();
  const lockEl = document.getElementById('adminLock');
  const contentEl = document.getElementById('adminContent');
  lockEl.classList.toggle('hidden', STATE.adminUnlocked);
  contentEl.classList.toggle('hidden', !STATE.adminUnlocked);
  if(STATE.adminUnlocked){ contentEl.removeAttribute('inert'); lockEl.setAttribute('inert',''); }
  else { contentEl.setAttribute('inert',''); lockEl.removeAttribute('inert'); document.getElementById('adminPassInput').focus(); }
  if(!STATE.adminUnlocked || !cls) return;
  renderAdminClassePanel();
  renderAdminFormatPanel();
  renderAdminEloPanel();
  renderAdminMasteriesPanel();
  renderAdminHistoryPanel();
}

function renderAdminClassePanel(){
  const cls = activeClass();
  document.getElementById('editClassName').value = cls.name;
  document.getElementById('editAdminPass').value = DB.adminPassword||'0000';
  document.getElementById('studentCountTag').textContent = cls.students.length;
  document.getElementById('studentAdminList').innerHTML = cls.students.map(s=>`
    <div class="mastery-item">
      <div class="icon-box" style="background:${avatarColor(s.id)};color:#fff;">${avatarInitials(s)}</div>
      <div class="info"><b>${escapeHtml(s.prenom)} ${escapeHtml(s.nom)}</b><div>ELO ${s.elo} · ${s.mj} matchs</div></div>
      <button class="btn ghost small" data-edit-student="${s.id}">✏️</button>
      <button class="btn ghost small" data-del-student="${s.id}">🗑</button>
    </div>`).join('') || '<p style="font-size:12px;color:var(--ink-soft);">Aucun élève.</p>';
  document.querySelectorAll('[data-del-student]').forEach(b=>b.addEventListener('click', ()=>{
    if(!confirm('Supprimer cet élève et toutes ses données ?')) return;
    cls.students = cls.students.filter(s=>s.id!==b.dataset.delStudent);
    saveDB(); renderAdminClassePanel(); toast('Élève supprimé','ok');
  }));
  document.querySelectorAll('[data-edit-student]').forEach(b=>b.addEventListener('click', ()=>{
    const s = cls.students.find(x=>x.id===b.dataset.editStudent);
    const prenom = prompt('Prénom', s.prenom); if(prenom===null) return;
    const nom = prompt('Nom', s.nom); if(nom===null) return;
    s.prenom=prenom.trim(); s.nom=nom.trim(); saveDB(); renderAdminClassePanel(); toast('Élève modifié','ok');
  }));
}

function openDeleteClassModal(){
  const cls = activeClass(); if(!cls) return;
  document.getElementById('delClassName').textContent = cls.name;
  const input = document.getElementById('delClassConfirmInput');
  input.value='';
  document.getElementById('btnConfirmDeleteClass').disabled = true;
  document.getElementById('modalDeleteClass').classList.remove('hidden');
  setTimeout(()=>input.focus(), 30);
}
function confirmDeleteClass(){
  const cls = activeClass(); if(!cls) return;
  const input = document.getElementById('delClassConfirmInput');
  if(input.value.trim().toLowerCase() !== cls.name.trim().toLowerCase()) return;
  const name = cls.name;
  delete DB.classes[cls.id];
  DB.matches = DB.matches.filter(m=>m.classId!==cls.id);
  DB.masteryAwards = DB.masteryAwards.filter(a=>a.classId!==cls.id);
  DB.activeClassId = Object.keys(DB.classes)[0]||null;
  saveDB();
  document.getElementById('modalDeleteClass').classList.add('hidden');
  toast('Classe « '+name+' » supprimée','ok');
  goView('home');
}
function ptsBoxesToShow(mode, target){
  const n = mode==='total' ? target : Math.max(1, 2*target-1); // best-of-N peut aller jusqu'à 2N-1 sets
  return Math.min(5, Math.max(1, n));
}
function updatePtsVisibility(){
  const mode = document.getElementById('defSetsMode').value;
  const target = parseInt(document.getElementById('defSetsTarget').value)||1;
  const n = ptsBoxesToShow(mode, target);
  for(let i=1;i<=5;i++) document.getElementById('ptsCol'+i).classList.toggle('hidden', i>n);
}
function renderAdminFormatPanel(){
  const cls = activeClass(); const md = cls.settings.matchDefaults;
  document.getElementById('defSport').value = md.sport;
  document.getElementById('defSetsMode').value = md.setsMode;
  document.getElementById('defSetsTarget').value = md.setsTarget;
  document.getElementById('defTiebreak').value = md.tiebreak;
  document.getElementById('defWinBy2').value = md.winBy2?'1':'0';
  document.getElementById('defReferee').checked = md.refereeRequired;
  for(let i=0;i<5;i++) document.getElementById('pts'+(i+1)).value = md.pointsPerSet[i]||11;
  document.getElementById('defSetsTargetLabel').textContent = md.setsMode==='gagnants'?'Sets gagnants':'Nombre de sets total';
  updatePtsVisibility();
}

function renderAdminEloPanel(){
  const cls = activeClass(); const s = cls.settings;
  document.querySelectorAll('#eloModeChips .chip').forEach(c=>c.classList.toggle('active', c.dataset.mode===s.eloMode));
  document.getElementById('eloFixeCard').style.display = s.eloMode==='fixe'?'block':'none';
  document.getElementById('eloVarCard').parentElement && null;
  document.getElementById('fixWin').value = s.eloFixed.win;
  document.getElementById('fixLoss').value = s.eloFixed.loss;
  document.getElementById('varWinGrid').innerHTML = VAR_WIN_BRACKETS.map(b=>`
    <div class="compact-row" title="${escapeHtml(b.label)}"><span class="compact-row-label">${b.short}</span>
    <input class="input input-compact" type="number" data-var-win="${b.key}" value="${s.eloVariable.win[b.key]}"></div>`).join('');
  document.getElementById('varLossGrid').innerHTML = VAR_LOSS_BRACKETS.map(b=>`
    <div class="compact-row" title="${escapeHtml(b.label)}"><span class="compact-row-label">${b.short}</span>
    <input class="input input-compact" type="number" data-var-loss="${b.key}" value="${s.eloVariable.loss[b.key]}"></div>`).join('');
  document.getElementById('styleWinM1').value=s.styleBonus.winM1; document.getElementById('styleWinB1').value=s.styleBonus.winB1;
  document.getElementById('styleWinM2').value=s.styleBonus.winM2; document.getElementById('styleWinB2').value=s.styleBonus.winB2;
  document.getElementById('styleLossM1').value=s.styleBonus.lossM1; document.getElementById('styleLossB1').value=s.styleBonus.lossB1;
  document.getElementById('styleLossM2').value=s.styleBonus.lossM2; document.getElementById('styleLossB2').value=s.styleBonus.lossB2;
  document.getElementById('leaderStreak').value=s.leaderStreak.streak;
  document.getElementById('leaderBonus').value=s.leaderStreak.bonus;
  const varCards = document.querySelectorAll('#panel-elo .card')[1]; // eloVarCard is 2nd
}

let editingMasteryId = null;
function openMasteryModal(mst){
  editingMasteryId = mst ? mst.id : null;
  document.getElementById('masteryModalTitle').textContent = mst ? 'Modifier la maîtrise' : 'Nouvelle maîtrise';
  document.getElementById('mstName').value = mst ? mst.name : '';
  document.getElementById('mstDescription').value = mst ? (mst.description||'') : '';
  document.getElementById('mstSport').value = mst ? mst.sport : 'general';
  document.getElementById('mstElo').value = mst ? mst.elo : 2;
  const scope = mst ? (mst.scope||'tous') : 'tous';
  document.querySelectorAll('#mstScopeChips .chip').forEach(c=>c.classList.toggle('active', c.dataset.scope===scope));
  document.getElementById('modalMastery').classList.remove('hidden');
}
function renderAdminMasteriesPanel(){
  const cls = activeClass();
  const groups = [
    {key:'general', label:'🎖 Général'},
    {key:'badminton', label:'🏸 Badminton'},
    {key:'tennis_de_table', label:'🏓 Tennis de table'},
  ];
  document.getElementById('masteryList').innerHTML = groups.map(g=>{
    const items = cls.settings.masteries.filter(m=>m.sport===g.key);
    if(!items.length) return '';
    return `<div class="mastery-group">
      <div class="mastery-group-title">${g.label}</div>
      ${items.map(mst=>`
        <div class="mastery-item">
          <label class="switch" style="flex-shrink:0;"><input type="checkbox" data-toggle-mastery="${mst.id}" ${mst.active?'checked':''}><span class="slider"></span></label>
          <div class="info">
            <b>${escapeHtml(mst.name)}</b> ${scopeTag(mst.scope)}
            <div>${escapeHtml(mst.description||'')}</div>
          </div>
          <input class="input input-compact" type="number" data-elo-mastery="${mst.id}" value="${mst.elo}" title="ELO attribué">
          <button class="btn ghost small" data-edit-mastery="${mst.id}">✏️</button>
          <button class="btn ghost small" data-del-mastery="${mst.id}">🗑</button>
        </div>`).join('')}
    </div>`;
  }).join('') || '<p style="font-size:12px;color:var(--ink-soft);">Aucune maîtrise définie.</p>';

  document.querySelectorAll('[data-toggle-mastery]').forEach(cb=>cb.addEventListener('change', ()=>{
    const mst = cls.settings.masteries.find(x=>x.id===cb.dataset.toggleMastery);
    mst.active = cb.checked; saveDB(); toast(mst.active?'Maîtrise activée':'Maîtrise désactivée','ok');
  }));
  document.querySelectorAll('[data-elo-mastery]').forEach(inp=>inp.addEventListener('change', ()=>{
    const mst = cls.settings.masteries.find(x=>x.id===inp.dataset.eloMastery);
    const v = parseInt(inp.value); if(!isNaN(v)){ mst.elo=v; saveDB(); }
  }));
  document.querySelectorAll('[data-del-mastery]').forEach(b=>b.addEventListener('click', ()=>{
    cls.settings.masteries = cls.settings.masteries.filter(x=>x.id!==b.dataset.delMastery);
    saveDB(); renderAdminMasteriesPanel(); toast('Maîtrise supprimée','ok');
  }));
  document.querySelectorAll('[data-edit-mastery]').forEach(b=>b.addEventListener('click', ()=>{
    openMasteryModal(cls.settings.masteries.find(x=>x.id===b.dataset.editMastery));
  }));
  const awardStudent = document.getElementById('awardStudent');
  awardStudent.innerHTML = cls.students.map(s=>`<option value="${s.id}">${escapeHtml(displayName(s))}</option>`).join('');
  const awardMastery = document.getElementById('awardMastery');
  awardMastery.innerHTML = cls.settings.masteries.filter(m=>m.active).map(m=>`<option value="${m.id}">${escapeHtml(m.name)} (+${m.elo})</option>`).join('');
  document.getElementById('awardSession').value = todayLabel();
}

function renderAdminHistoryPanel(){
  const cls = activeClass();
  const matches = DB.matches.filter(m=>m.classId===cls.id).map(m=>({...m, _type:'match'}));
  const awards = DB.masteryAwards.filter(a=>a.classId===cls.id).map(a=>({...a, _type:'award'}));
  const all = [...matches, ...awards].sort((a,b)=>b.date-a.date);
  const list = document.getElementById('historyList');
  if(!all.length){ list.innerHTML = '<p style="font-size:12px;color:var(--ink-soft);">Aucune performance enregistrée.</p>'; return; }
  list.innerHTML = all.map(item=>{
    if(item._type==='match'){
      const A = cls.students.find(s=>s.id===item.playerAId), B = cls.students.find(s=>s.id===item.playerBId);
      const w = cls.students.find(s=>s.id===item.winnerId);
      return `<div class="history-item">
        <div class="icon-box">${sportEmoji(item.sport)}</div>
        <div class="info"><b>${escapeHtml(A?displayName(A):'?')} vs ${escapeHtml(B?displayName(B):'?')}</b>
        <div>${item.setsWonA}-${item.setsWonB} sets · vainqueur ${escapeHtml(w?displayName(w):'?')} · ${escapeHtml(item.sessionLabel)} · ${new Date(item.date).toLocaleDateString('fr-FR')}</div></div>
        <button class="btn danger small" data-del-match="${item.id}">Supprimer</button>
      </div>`;
    } else {
      const s = cls.students.find(x=>x.id===item.studentId);
      return `<div class="history-item">
        <div class="icon-box">🏅</div>
        <div class="info"><b>${escapeHtml(s?displayName(s):'?')} — ${escapeHtml(item.masteryName)}</b>
        <div>+${item.elo} ELO · ${escapeHtml(item.sessionLabel)} · ${new Date(item.date).toLocaleDateString('fr-FR')}</div></div>
        <button class="btn danger small" data-del-award="${item.id}">Supprimer</button>
      </div>`;
    }
  }).join('');
  document.querySelectorAll('[data-del-match]').forEach(b=>b.addEventListener('click', ()=>deleteMatch(b.dataset.delMatch)));
  document.querySelectorAll('[data-del-award]').forEach(b=>b.addEventListener('click', ()=>deleteAward(b.dataset.delAward)));
}
function sportEmoji(sport){ return {tennis_de_table:'🏓',badminton:'🏸',autre:'🎯'}[sport]||'🎯'; }

function deleteMatchNoConfirm(matchId){
  const cls = activeClass();
  const idx = DB.matches.findIndex(m=>m.id===matchId); if(idx<0) return;
  const m = DB.matches[idx];
  const A = cls.students.find(s=>s.id===m.playerAId), B = cls.students.find(s=>s.id===m.playerBId);
  const winner = cls.students.find(s=>s.id===m.winnerId);
  const loser = winner && winner.id===A.id ? B : A;
  if(A) { A.pf-=m.ptsA; A.pa-=m.ptsB; }
  if(B) { B.pf-=m.ptsB; B.pa-=m.ptsA; }
  if(winner){ winner.elo -= m.eloDeltaWinner; winner.mj-=1; winner.v-=1; }
  if(loser){ loser.elo -= m.eloDeltaLoser; loser.mj-=1; loser.d-=1; }
  DB.matches.splice(idx,1);
  saveDB();
}
function deleteMatch(matchId){
  if(!confirm('Supprimer ce match ? Les points ELO seront annulés.')) return;
  deleteMatchNoConfirm(matchId);
  renderAdminHistoryPanel(); renderAdminClassePanel();
  toast('Match supprimé et ELO annulé','ok');
}
function deleteAward(awardId){
  if(!confirm('Supprimer cette maîtrise attribuée ?')) return;
  const cls = activeClass();
  const idx = DB.masteryAwards.findIndex(a=>a.id===awardId); if(idx<0) return;
  const a = DB.masteryAwards[idx];
  const s = cls.students.find(x=>x.id===a.studentId);
  if(s){ s.elo -= a.elo; s.masteryElo -= a.elo; }
  DB.masteryAwards.splice(idx,1);
  saveDB(); renderAdminHistoryPanel();
  toast('Maîtrise annulée','ok');
}

/* ---------------------------------------------------------
   16. EXCEL EXPORT (SheetJS, lazy-loaded)
--------------------------------------------------------- */
let sheetJsLoading=null;
function ensureSheetJs(){
  if(window.XLSX) return Promise.resolve();
  if(sheetJsLoading) return sheetJsLoading;
  sheetJsLoading = new Promise((resolve,reject)=>{
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
  return sheetJsLoading;
}
async function exportExcel(){
  const cls = activeClass(); if(!cls){ toast('Choisis une classe','err'); return; }
  try{ await ensureSheetJs(); }catch(e){ toast('Connexion internet requise pour l’export Excel','err'); return; }
  const ranked = rankedStudents(cls);
  const matches = DB.matches.filter(m=>m.classId===cls.id);
  const sessions = [...new Set(matches.map(m=>m.sessionLabel))];
  const awards = DB.masteryAwards.filter(a=>a.classId===cls.id);
  const masteryList = cls.settings.masteries.filter(m=> awards.some(a=>a.masteryId===m.id)); // colonnes seulement pour les maîtrises réellement utilisées
  const rows = ranked.map((s,i)=>{
    const row = {
      'Rang': i+1, 'Joueur': displayName(s), 'ELO': s.elo,
      'Matchs joués': s.mj, 'Victoires': s.v, 'Défaites': s.d,
      '% Victoires': s.mj? Math.round((s.v/s.mj)*100)+'%':'0%',
      'Points marqués': s.pf, 'Points encaissés': s.pa, 'Différentiel': s.pf-s.pa,
      'ELO maîtrises': s.masteryElo,
    };
    masteryList.forEach(mst=>{
      row['🏅 '+mst.name] = awards.filter(a=> a.studentId===s.id && a.masteryId===mst.id).length;
    });
    sessions.forEach(sess=>{
      row['MJ '+sess] = matches.filter(m=> m.sessionLabel===sess && (m.playerAId===s.id||m.playerBId===s.id)).length;
    });
    return row;
  });
  const matchRows = matches.slice().sort((a,b)=>a.date-b.date).map(m=>{
    const A = cls.students.find(x=>x.id===m.playerAId), B = cls.students.find(x=>x.id===m.playerBId);
    const winner = cls.students.find(x=>x.id===m.winnerId);
    const referee = m.refereeId ? cls.students.find(x=>x.id===m.refereeId) : null;
    const abandonStudent = m.abandonId ? cls.students.find(x=>x.id===m.abandonId) : null;
    return {
      'Date': new Date(m.date).toLocaleDateString('fr-FR'), 'Séance': m.sessionLabel,
      'Sport': ({tennis_de_table:'Tennis de table', badminton:'Badminton', autre:'Autre'})[m.sport] || m.sport,
      'Joueur A': A?displayName(A):'?', 'Joueur B': B?displayName(B):'?',
      'Score sets': `${m.setsWonA}-${m.setsWonB}`, 'Score points': `${m.ptsA}-${m.ptsB}`,
      'Vainqueur': winner?displayName(winner):'?',
      'ELO vainqueur': m.eloDeltaWinner, 'ELO vaincu': m.eloDeltaLoser,
      'Arbitre': referee?displayName(referee):'',
      'Abandon': abandonStudent ? 'Oui — '+displayName(abandonStudent) : 'Non',
    };
  });
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, 'Classement');
  const wsMatches = XLSX.utils.json_to_sheet(matchRows);
  XLSX.utils.book_append_sheet(wb, wsMatches, 'Matchs');
  XLSX.writeFile(wb, `ELOBAD_${cls.name.replace(/\s+/g,'_')}_classement.xlsx`);
  toast('Export Excel généré','ok');
}

/* ---------------------------------------------------------
   17. JSON EXPORT / IMPORT
--------------------------------------------------------- */
function exportJson(){
  const blob = new Blob([JSON.stringify(DB,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download = 'elobad_sauvegarde_'+new Date().toISOString().slice(0,10)+'.json';
  a.click(); URL.revokeObjectURL(url);
  toast('Sauvegarde JSON téléchargée','ok');
}
function importJson(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if(!data.classes) throw new Error('format invalide');
      DB = Object.assign(emptyDB(), data);
      saveDB();
      toast('Import réussi','ok');
      goView('home');
    }catch(e){ toast('Fichier JSON invalide','err'); }
  };
  reader.readAsText(file);
}

/* ---------------------------------------------------------
   18. UTIL
--------------------------------------------------------- */
function escapeHtml(str){
  return String(str==null?'':str).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* ---------------------------------------------------------
   19. EVENT WIRING (global)
--------------------------------------------------------- */
function wireEvents(){
  document.querySelectorAll('.nav-btn').forEach(b=> b.addEventListener('click', ()=>goView(b.dataset.view)));
  document.getElementById('classSelect').addEventListener('change', (e)=>{
    DB.activeClassId = e.target.value; saveDB(); goView(STATE.view==='home'?'ranking':STATE.view);
  });
  document.getElementById('tileSearch').addEventListener('input', renderRanking);
  document.getElementById('closeProfile').addEventListener('click', ()=>document.getElementById('modalProfile').classList.add('hidden'));

  document.getElementById('btnBackToTiles').addEventListener('click', ()=>{ STATE.currentMatch=null; goView('ranking'); });
  document.getElementById('matchMasteriesPanel').addEventListener('change', (e)=>{
    const sel = e.target.closest('[data-referee-picker]'); if(!sel) return;
    const m = STATE.currentMatch; if(!m) return;
    m.refereeId = sel.value || null;
    renderMatch();
  });
  document.getElementById('matchSessionInput').addEventListener('change', (e)=>{
    const m = STATE.currentMatch; if(!m) return;
    m.sessionLabel = e.target.value.trim() || todayLabel();
    renderMatch();
  });
  document.getElementById('abandonRow').addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-abandon]'); if(!btn) return;
    triggerAbandon(btn.dataset.abandon);
  });
  document.getElementById('matchMasteriesPanel').addEventListener('click', (e)=>{
    const chip = e.target.closest('[data-mastery-chip]'); if(!chip) return;
    toggleMatchMastery(chip.dataset.studentId, chip.dataset.masteryId);
  });

  document.getElementById('btnSaveMatch').addEventListener('click', saveCurrentMatch);
  document.getElementById('btnExportExcel').addEventListener('click', exportExcel);
  document.getElementById('btnExportExcel2').addEventListener('click', exportExcel);

  // Admin
  document.getElementById('btnAdminUnlock').addEventListener('click', tryAdminUnlock);
  document.getElementById('btnLockAdmin').addEventListener('click', ()=>{
    STATE.adminUnlocked = false;
    renderAdmin();
    toast('Administration verrouillée','ok');
  });
  document.getElementById('adminPassInput').addEventListener('keydown', (e)=>{ if(e.key==='Enter') tryAdminUnlock(); });
  document.querySelectorAll('.tabs-sub button').forEach(b=> b.addEventListener('click', ()=>{
    document.querySelectorAll('.tabs-sub button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active'));
    document.getElementById(b.dataset.panel).classList.add('active');
  }));

  document.getElementById('btnSaveClassMeta').addEventListener('click', ()=>{
    const cls = activeClass();
    cls.name = document.getElementById('editClassName').value.trim() || cls.name;
    saveDB(); renderClassPill(); toast('Classe mise à jour','ok');
  });
  document.getElementById('btnSaveAdminPass').addEventListener('click', ()=>{
    const val = document.getElementById('editAdminPass').value.trim();
    if(!val){ toast('Indique un code','err'); return; }
    DB.adminPassword = val;
    saveDB(); toast('Code administrateur changé pour toutes les classes','ok');
  });
  document.getElementById('btnDeleteClass').addEventListener('click', openDeleteClassModal);
  document.getElementById('btnCancelDeleteClass').addEventListener('click', ()=>document.getElementById('modalDeleteClass').classList.add('hidden'));
  document.getElementById('delClassConfirmInput').addEventListener('input', (e)=>{
    const cls = activeClass();
    const ok = !!cls && e.target.value.trim().toLowerCase() === cls.name.trim().toLowerCase();
    document.getElementById('btnConfirmDeleteClass').disabled = !ok;
  });
  document.getElementById('delClassConfirmInput').addEventListener('keydown', (e)=>{
    if(e.key==='Enter' && !document.getElementById('btnConfirmDeleteClass').disabled) confirmDeleteClass();
  });
  document.getElementById('btnConfirmDeleteClass').addEventListener('click', confirmDeleteClass);
  document.getElementById('btnAddStudentManual').addEventListener('click', ()=>{
    const prenom = prompt('Prénom'); if(!prenom) return;
    const nom = prompt('Nom')||'';
    activeClass().students.push(newStudent(nom,prenom));
    saveDB(); renderAdminClassePanel(); renderClassPill(); toast('Élève ajouté','ok');
  });
  document.getElementById('btnResetElo').addEventListener('click', ()=>{
    if(!confirm('Réinitialiser tous les ELO à 100 pour cette classe ?')) return;
    activeClass().students.forEach(s=>{ s.elo=100; s.mj=0; s.v=0; s.d=0; s.pf=0; s.pa=0; s.masteryElo=0; s.leaderWinStreak=0; });
    saveDB(); renderAdminClassePanel(); toast('ELO réinitialisés','ok');
  });

  document.getElementById('defSetsMode').addEventListener('change', (e)=>{
    document.getElementById('defSetsTargetLabel').textContent = e.target.value==='gagnants'?'Sets gagnants':'Nombre de sets total';
    updatePtsVisibility();
  });
  document.getElementById('defSetsTarget').addEventListener('change', updatePtsVisibility);
  document.getElementById('btnSaveFormat').addEventListener('click', ()=>{
    const cls = activeClass(); const md = cls.settings.matchDefaults;
    md.sport = document.getElementById('defSport').value;
    md.setsMode = document.getElementById('defSetsMode').value;
    md.setsTarget = parseInt(document.getElementById('defSetsTarget').value);
    md.tiebreak = document.getElementById('defTiebreak').value;
    md.winBy2 = document.getElementById('defWinBy2').value==='1';
    md.refereeRequired = document.getElementById('defReferee').checked;
    md.pointsPerSet = [1,2,3,4,5].map(i=>parseInt(document.getElementById('pts'+i).value)||11);
    saveDB(); toast('Format par défaut enregistré','ok');
  });

  document.querySelectorAll('#eloModeChips .chip').forEach(c=>c.addEventListener('click', ()=>{
    activeClass().settings.eloMode = c.dataset.mode; saveDB(); renderAdminEloPanel();
  }));
  document.getElementById('btnSaveElo').addEventListener('click', ()=>{
    const cls = activeClass(); const s = cls.settings;
    s.eloFixed.win = parseInt(document.getElementById('fixWin').value)||0;
    s.eloFixed.loss = parseInt(document.getElementById('fixLoss').value)||0;
    document.querySelectorAll('[data-var-win]').forEach(inp=> s.eloVariable.win[inp.dataset.varWin] = parseInt(inp.value)||0);
    document.querySelectorAll('[data-var-loss]').forEach(inp=> s.eloVariable.loss[inp.dataset.varLoss] = parseInt(inp.value)||0);
    s.styleBonus = {
      winM1:+document.getElementById('styleWinM1').value, winB1:+document.getElementById('styleWinB1').value,
      winM2:+document.getElementById('styleWinM2').value, winB2:+document.getElementById('styleWinB2').value,
      lossM1:+document.getElementById('styleLossM1').value, lossB1:+document.getElementById('styleLossB1').value,
      lossM2:+document.getElementById('styleLossM2').value, lossB2:+document.getElementById('styleLossB2').value,
    };
    s.leaderStreak = {streak:+document.getElementById('leaderStreak').value, bonus:+document.getElementById('leaderBonus').value};
    saveDB(); toast('Réglages ELO enregistrés','ok');
  });

  document.getElementById('btnAddMastery').addEventListener('click', ()=> openMasteryModal(null));
  document.getElementById('closeMasteryModal').addEventListener('click', ()=>document.getElementById('modalMastery').classList.add('hidden'));
  document.querySelectorAll('#mstScopeChips .chip').forEach(c=>c.addEventListener('click', ()=>{
    document.querySelectorAll('#mstScopeChips .chip').forEach(x=>x.classList.toggle('active', x===c));
  }));
  document.getElementById('btnSaveMastery').addEventListener('click', ()=>{
    const cls = activeClass();
    const name = document.getElementById('mstName').value.trim();
    if(!name){ toast('Indique un nom','err'); return; }
    const description = document.getElementById('mstDescription').value.trim();
    const sport = document.getElementById('mstSport').value;
    const elo = parseInt(document.getElementById('mstElo').value)||2;
    const scope = document.querySelector('#mstScopeChips .chip.active').dataset.scope;
    if(editingMasteryId){
      const mst = cls.settings.masteries.find(x=>x.id===editingMasteryId);
      mst.name=name; mst.description=description; mst.sport=sport; mst.elo=elo; mst.scope=scope;
      toast('Maîtrise modifiée','ok');
    } else {
      cls.settings.masteries.push({id:uid('mst'), name, description, sport, elo, scope, active:true});
      toast('Maîtrise ajoutée','ok');
    }
    saveDB();
    document.getElementById('modalMastery').classList.add('hidden');
    renderAdminMasteriesPanel();
  });
  document.getElementById('btnAwardMastery').addEventListener('click', ()=>{
    const cls = activeClass();
    const studentId = document.getElementById('awardStudent').value;
    const masteryId = document.getElementById('awardMastery').value;
    const sessionLabel = document.getElementById('awardSession').value.trim() || todayLabel();
    const s = cls.students.find(x=>x.id===studentId), mst = cls.settings.masteries.find(x=>x.id===masteryId);
    if(!s||!mst) return;
    awardMastery(studentId, masteryId, sessionLabel);
    renderAdminHistoryPanel(); toast(displayName(s)+' a obtenu « '+mst.name+' »','ok');
  });

  document.getElementById('btnExportJson').addEventListener('click', exportJson);
  document.getElementById('btnImportJsonBtn').addEventListener('click', ()=>document.getElementById('importJsonFile').click());
  document.getElementById('btnImportJsonHome').addEventListener('click', ()=>document.getElementById('importJsonHomeFile').click());
  document.getElementById('importJsonHomeFile').addEventListener('change', (e)=>{
    const file = e.target.files[0]; if(!file) return;
    const hasExisting = Object.keys(DB.classes||{}).length>0;
    if(hasExisting && !confirm('Importer ce fichier remplacera TOUTES les classes et données actuellement sur cet appareil. Continuer ?')){
      e.target.value=''; return;
    }
    importJson(file);
    e.target.value='';
  });
  document.getElementById('importJsonFile').addEventListener('change', (e)=>{ if(e.target.files[0]) importJson(e.target.files[0]); });

  initNewClassModalEvents();
}

function tryAdminUnlock(){
  const cls = activeClass(); if(!cls){ toast('Choisis une classe','err'); return; }
  const val = document.getElementById('adminPassInput').value;
  if(val === (DB.adminPassword||'0000')){
    STATE.adminUnlocked = true;
    document.getElementById('adminPassInput').value='';
    renderAdmin();
  } else {
    toast('Code incorrect','err');
  }
}

/* ---------------------------------------------------------
   20. PWA SERVICE WORKER
--------------------------------------------------------- */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
  let swRefreshed = false;
  navigator.serviceWorker.addEventListener('controllerchange', ()=>{
    if(swRefreshed) return;
    swRefreshed = true;
    window.location.reload();
  });
}

/* ---------------------------------------------------------
   21. INIT
--------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', ()=>{
  wireEvents();
  if(!DB.activeClassId && Object.keys(DB.classes).length) DB.activeClassId = Object.keys(DB.classes)[0];
  goView(DB.activeClassId ? 'ranking' : 'home');
});
