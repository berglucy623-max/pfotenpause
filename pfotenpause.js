"use strict";

// =====================================================
// 1. RÄTSEL UND KATZEN
// =====================================================

const groesse = 5;

// Hier liegt unsere Sammlung vorbereiteter Rätsel.
const levelListe = [
  {
    name: "Tag 1",
    bereiche: [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 2],
      [0, 3, 3, 2, 2],
      [3, 3, 4, 4, 4],
      [3, 4, 4, 4, 4]
    ]
  },

  {
    name: "Tag 2",
    bereiche: [
      [3, 3, 0, 0, 0],
      [4, 3, 3, 0, 0],
      [4, 4, 1, 1, 0],
      [4, 4, 2, 1, 0],
      [4, 4, 2, 1, 0]
    ]
  },

  {
    name: "Tag 3",
    bereiche: [
      [4, 4, 3, 3, 3],
      [4, 4, 4, 4, 3],
      [2, 2, 2, 2, 0],
      [2, 1, 1, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  
  {
    name: "Tag 4",
    bereiche: [
      [2, 2, 2, 2, 2],
      [4, 2, 3, 3, 0],
      [4, 1, 3, 3, 0],
      [4, 1, 3, 3, 0],
      [4, 1, 1, 3, 0]
    ]
  },
  
    {
    name: "Tag 5",
    bereiche: [
      [1, 4, 0, 0, 0],
      [1, 0, 0, 0, 3],
      [1, 2, 2, 0, 3],
      [1, 2, 0, 0, 3],
      [1, 2, 0, 0, 3]
    ]
  },
  
  {
    name: "Tag 6",
    bereiche: [
      [3, 3, 3, 0, 0],
      [3, 3, 3, 0, 0],
      [3, 3, 1, 4, 0],
      [2, 1, 1, 4, 4],
      [2, 2, 2, 4, 4]
    ]
  },
  
  {
    name: "Tag 7",
    bereiche: [
      [0, 3, 3, 4, 4],
      [0, 3, 3, 4, 4],
      [0, 0, 2, 1, 1],
      [0, 0, 2, 2, 2],
      [0, 0, 0, 2, 2]
    ]
  },
  
    {
    name: "Tag 8",
    bereiche: [
      [2, 1, 3, 0, 0],
      [2, 3, 3, 0, 0],
      [2, 3, 3, 4, 0],
      [2, 3, 3, 4, 0],
      [2, 3, 4, 4, 0]
    ]
  },
  
    {
    name: "Tag 9",
    bereiche: [
      [1, 0, 2, 2, 2],
      [1, 2, 2, 2, 4],
      [1, 3, 2, 2, 4],
      [1, 3, 2, 2, 4],
      [1, 3, 3, 2, 4]
    ]
  },
  
    {
    name: "Tag 10",
    bereiche: [
      [4, 4, 1, 1, 3],
      [4, 1, 1, 1, 1],
      [2, 0, 1, 1, 3],
      [2, 0, 1, 4, 3],
      [2, 0, 0, 4, 3]
    ]
  }
];

// Wir beginnen mit dem ersten Schlafplan.
let aktuellesLevel = 0;

// Anders als bisher kann der aktive Farblayout-Plan wechseln.
let bereiche = levelListe[aktuellesLevel].bereiche;

// "schlafBild" ist die Position auf der Schlaf-Tafel.
// "anderesBild" ist die Position auf den anderen Tafeln.
// Orange und Schwarz haben dort eine andere Reihenfolge.
const katzen = [
  {
    name: "Mila",
    bereich: "A",
    farbe: "#f5dfa7",
    schlafBild: 0,
    anderesBild: 0
  },
  {
    name: "Mango",
    bereich: "B",
    farbe: "#f2c6c8",
    schlafBild: 1,
    anderesBild: 2
  },
  {
    name: "Loki",
    bereich: "C",
    farbe: "#c6dfe9",
    schlafBild: 2,
    anderesBild: 1
  },
  {
    name: "Coco",
    bereich: "D",
    farbe: "#d4e3b6",
    schlafBild: 3,
    anderesBild: 3
  },
  {
    name: "Nala",
    bereich: "E",
    farbe: "#dfd0e9",
    schlafBild: 4,
    anderesBild: 4
  }
];

const bilddateien = {
  schlafen: "bilder/katzen-schlafen.png",
  strecken: "bilder/katzen-strecken.png",
  sitzen: "bilder/katzen-sitzen.png",
  streiten: "bilder/katzen-streiten.png"
};

// Koordinaten beziehen sich auf eine Tafel mit 768 × 768.
// Größere oder kleinere Versionen werden entsprechend skaliert.
//
// Jeder Eintrag enthält:
// [Ausschnitt-X, Ausschnitt-Y, Breite, Höhe,
//  Nummer-X, Nummer-Y, Nummer-Breite, Nummer-Höhe]
//
// Die Ausschnitte sind auf die hochgeladenen Tafeln abgestimmt.
const ausschnitte = {
  schlafen: [
    [0,   0,   396, 268, 14,  12,  57, 76],
    [396, 0,   372, 268, 397, 12,  70, 76],
    [0,   268, 396, 267, 10,  270, 65, 75],
    [396, 268, 372, 270, 396, 270, 69, 76],
    [170, 530, 438, 238, 177, 530, 72, 60]
  ],

  strecken: [
    [0,   60,  260, 305, 5,   67,  51, 61],
    [256, 60,  260, 305, 277, 66,  48, 62],
    [508, 60,  260, 305, 534, 66,  53, 62],
    [22,  370, 365, 398, 60,  375, 61, 68],
    [398, 370, 370, 398, 397, 375, 63, 68]
  ],

  sitzen: [
    [0,   0,   260, 360, 13,  12,  53, 63],
    [255, 0,   262, 360, 279, 12,  54, 63],
    [507, 0,   261, 360, 539, 12,  52, 63],
    [28,  355, 369, 413, 90,  357, 69, 79],
    [397, 355, 371, 413, 405, 357, 69, 79]
  ],

  streiten: [
    [0,   0,   263, 356, 89,  9,   78, 66],
    [256, 0,   263, 356, 341, 9,   83, 66],
    [509, 0,   259, 356, 594, 9,   85, 66],
    [0,   356, 383, 412, 110, 355, 79, 72],
    [385, 356, 383, 412, 495, 355, 79, 72]
  ]
};

// 0 = leer, 1 = Katze, 2 = ausgeschlossen.
const zustand = Array(groesse * groesse).fill(0);

let werkzeug = 1;
let geloest = false;
let konflikte = new Set();

const feldButtons = [];
const bildCache = new Map();
const fehlendeBilder = new Set();

// =====================================================
// 2. ELEMENTE DER SEITE
// =====================================================

const spielfeld = document.getElementById("spielfeld");
const katzenliste = document.getElementById("katzenliste");
const katzenzaehler = document.getElementById("katzenzaehler");
const meldung = document.getElementById("meldung");
const bildhinweis = document.getElementById("bildhinweis");

const katzenWerkzeug = document.getElementById("katzenWerkzeug");
const ausschlussWerkzeug = document.getElementById("ausschlussWerkzeug");

// =====================================================
// 3. NAVIGATION: HOF, EINGANG UND SPIELE
// =====================================================

const seitenTitel = {
  startseite: "starttitel",
  eingangsseite: "eingangstitel",
  spielseite: "spieltitel",
  memoryseite: "memorytitel",
  fruehstueckseite: "fruehstuecktitel"
};

// Seitenwechsel verändert keine Spielstände.
function zeigeSeite(seitenId) {
	stoppeAbschlussTimer();
  if (!Object.prototype.hasOwnProperty.call(seitenTitel, seitenId)) {
    console.error("Unbekannte Seite:", seitenId);
    return;
  }

  Object.keys(seitenTitel).forEach(function (id) {
    document.getElementById(id).hidden = id !== seitenId;
  });

  const titel = document.getElementById(seitenTitel[seitenId]);
  titel.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

// =====================================================
// GEMEINSAMES ABSCHLUSSFENSTER
// =====================================================

const spielAbschluss = document.getElementById("spielAbschluss");
const spielAbschlussTitel =
  document.getElementById("spielAbschlussTitel");
const spielAbschlussText =
  document.getElementById("spielAbschlussText");
const spielAbschlussWeiter =
  document.getElementById("spielAbschlussWeiter");
const spielAbschlussAuswahl =
  document.getElementById("spielAbschlussAuswahl");

// Gemeinsame Wartezeit für Geschichten und Abschlussfenster.
const popupVerzoegerung = 2000;

let abschlussWeiterAktion = null;
let abschlussTimer = null;

// Der Hintergrund bleibt gesperrt, solange irgendein Dialog offen ist.
function synchronisiereDialogStatus() {
  const dialogOffen =
    document.querySelector("dialog[open]") !== null;

  document.body.classList.toggle("dialog-offen", dialogOffen);
}

function stoppeAbschlussTimer() {
  if (abschlussTimer !== null) {
    window.clearTimeout(abschlussTimer);
    abschlussTimer = null;
  }
}

function schliesseSpielAbschluss() {
  stoppeAbschlussTimer();

  if (spielAbschluss.open) {
    spielAbschluss.close();
  }

  abschlussWeiterAktion = null;
  synchronisiereDialogStatus();
}

function zeigeSpielAbschluss({
  titel,
  text,
  weiterText,
  weiterAktion
}) {
  // Ein vorheriger Abschluss oder Timer wird zuerst beendet.
  schliesseSpielAbschluss();

  // Merken, auf welcher Seite der Abschluss ausgelöst wurde.
  const seiteBeimStart = Object.keys(seitenTitel).find(
    function (seitenId) {
      return !document.getElementById(seitenId).hidden;
    }
  );

  abschlussTimer = window.setTimeout(function () {
    abschlussTimer = null;

    // Nicht öffnen, falls die ursprüngliche Seite verlassen wurde.
    if (
      !seiteBeimStart ||
      document.getElementById(seiteBeimStart).hidden
    ) {
      return;
    }

    spielAbschlussTitel.textContent = titel;
    spielAbschlussText.textContent = text;
    spielAbschlussWeiter.textContent = weiterText;
    abschlussWeiterAktion = weiterAktion;

    if (!spielAbschluss.open) {
      spielAbschluss.showModal();
    }

    synchronisiereDialogStatus();
    spielAbschlussWeiter.focus({ preventScroll: true });
  }, popupVerzoegerung);
}

spielAbschlussWeiter.addEventListener("click", function () {
  // Vor dem Schließen sichern, da die gespeicherte Aktion gelöscht wird.
  const aktion = abschlussWeiterAktion;

  schliesseSpielAbschluss();

  if (typeof aktion === "function") {
    aktion();
  }
});

spielAbschlussAuswahl.addEventListener("click", function () {
  schliesseSpielAbschluss();
  zeigeSeite("eingangsseite");
});

// Der Abschluss wird über eine der beiden Schaltflächen verlassen.
spielAbschluss.addEventListener("cancel", function (ereignis) {
  ereignis.preventDefault();
});

spielAbschluss.addEventListener(
  "close",
  synchronisiereDialogStatus
);

document.getElementById("gartenpforte").addEventListener(
  "click",
  function () {
    zeigeSeite("eingangsseite");
  }
);

document.getElementById("eingangZumHof").addEventListener(
  "click",
  function () {
    zeigeSeite("startseite");
  }
);

document.getElementById("startPfotenpause").addEventListener(
  "click",
  function () {
    zeigeSeite("spielseite");

    // Ein bereits gelöster Tag behält seinen Spielstand.
    // Beim erneuten Öffnen sind die Abschlussaktionen wieder erreichbar.
    if (geloest) {
      zeigePfotenAbschluss();
    }
  }
);

document.getElementById("startMemory").addEventListener(
  "click",
  function () {
    zeigeSeite("memoryseite");
  }
);

// Die bisherige ID bleibt bestehen, der Rückweg führt jetzt zur Auswahl.
document.getElementById("zumHof").addEventListener(
  "click",
  function () {
    zeigeSeite("eingangsseite");
  }
);

document.getElementById("memoryZumEingang").addEventListener(
  "click",
  function () {
    zeigeSeite("eingangsseite");
  }
);

// Ersatzdarstellung bei fehlenden Szenenbildern.
function verbindeSzenenbild(bildId, hinweisId) {
  const bild = document.getElementById(bildId);
  const hinweis = document.getElementById(hinweisId);

  function zeigeErsatz() {
    bild.hidden = true;
    hinweis.hidden = false;
  }

  bild.addEventListener("error", zeigeErsatz);

  if (bild.complete && bild.naturalWidth === 0) {
    zeigeErsatz();
  }
}

verbindeSzenenbild("hofbild", "hofErsatz");
verbindeSzenenbild("eingangsbild", "eingangBildhinweis");


// =====================================================
// 4. EINZELNE KATZENBILDER LADEN
// =====================================================

// Reihenfolge der Katzen in den Bereichen A bis E.
const katzenBildnamen = [
  "mila",
  "mango",
  "loki",
  "coco",
  "nala"
];

function meldeBildproblem(datei) {
  fehlendeBilder.add(datei);

  bildhinweis.hidden = false;
  bildhinweis.textContent =
    "Diese Bilder konnten nicht geladen werden: " +
    Array.from(fehlendeBilder).join(", ") +
    ". Prüfe die Dateinamen im Ordner bilder/katzen.";
}

// Diese eine Funktion stellt jetzt ALLE Katzenposen dar.
function erstelleKatzenBild(bereich, pose) {
  const bildname = katzenBildnamen[bereich];
  const datei = `bilder/katzen/${bildname}-${pose}.png`;

  const rahmen = document.createElement("span");
  rahmen.className = "katzenbild";
  rahmen.setAttribute("aria-hidden", "true");

  const ersatz = document.createElement("span");
  ersatz.className = "ersatzkatze";
  ersatz.textContent = "🐱";

  const bild = document.createElement("img");
  bild.alt = "";
  bild.width = 320;
  bild.height = 320;
  bild.hidden = true;
  bild.draggable = false;

  bild.addEventListener("load", function () {
    bild.hidden = false;
    ersatz.hidden = true;
  });

  bild.addEventListener("error", function () {
    meldeBildproblem(datei);
  });

  rahmen.append(ersatz, bild);
  bild.src = datei;

  return rahmen;
}

// =====================================================
// 5. ANZEIGE UND BEDIENUNG
// =====================================================

function zeigeMeldung(text, typ = "") {
  meldung.textContent = text;
  meldung.className = typ ? "meldung " + typ : "meldung";
}

function waehleWerkzeug(neuesWerkzeug) {
  werkzeug = neuesWerkzeug;

  katzenWerkzeug.setAttribute(
    "aria-pressed",
    String(werkzeug === 1)
  );

  ausschlussWerkzeug.setAttribute(
    "aria-pressed",
    String(werkzeug === 2)
  );
}

function poseFuerFeld(index) {
  if (geloest) {
    return "schlafen";
  }

  if (konflikte.has(index)) {
    return "streiten";
  }
// Eine platzierte Katze streckt sich vor dem Einschlafen.
  return "strecken";
}

function aktualisiereKatzenliste() {
  katzenliste.replaceChildren();

  katzen.forEach(function (gast, bereich) {
    const platz = zustand.findIndex(function (wert, index) {
      const reihe = Math.floor(index / groesse);
      const spalte = index % groesse;

      return wert === 1 && bereiche[reihe][spalte] === bereich;
    });

    const pose = platz === -1
      ? "sitzen"
      : poseFuerFeld(platz);

    const karte = document.createElement("div");
    karte.className = "katzenkarte";
    karte.style.setProperty("--bereichsfarbe", gast.farbe);

    const name = document.createElement("span");
    name.className = "katzenname";
    name.textContent = gast.name;

    karte.append(
      erstelleKatzenBild(bereich, pose),
      name
    );

    katzenliste.appendChild(karte);
  });
}

function aktualisiereAnzeige() {
  let anzahlKatzen = 0;

  zustand.forEach(function (wert, index) {
    const feld = feldButtons[index];
    const reihe = Math.floor(index / groesse);
    const spalte = index % groesse;
    const bereich = bereiche[reihe][spalte];
    const gast = katzen[bereich];

    feld.replaceChildren();
    feld.className = "feld";

    const buchstabe = document.createElement("span");
    buchstabe.className = "feld-buchstabe";
    buchstabe.textContent = gast.bereich;
    buchstabe.setAttribute("aria-hidden", "true");

    feld.appendChild(buchstabe);

    let beschreibung = "leer";

    if (wert === 1) {
      anzahlKatzen++;

      const pose = poseFuerFeld(index);

      feld.appendChild(
        erstelleKatzenBild(bereich, pose)
      );

      beschreibung = gast.name;

      if (konflikte.has(index)) {
        feld.classList.add("konflikt");
        beschreibung += ", Regelkonflikt";
      }

      if (geloest) {
        feld.classList.add("geloest");
        beschreibung += ", schläft friedlich";
      }
    } else if (wert === 2) {
      const kreuz = document.createElement("span");
      kreuz.className = "ausschluss";
      kreuz.textContent = "×";
      kreuz.setAttribute("aria-hidden", "true");

      feld.appendChild(kreuz);
      beschreibung = "ausgeschlossen";
    }

    feld.setAttribute(
      "aria-label",
      `Reihe ${reihe + 1}, Spalte ${spalte + 1}, ` +
      `Bereich ${gast.bereich}, ${beschreibung}`
    );
  });

  katzenzaehler.textContent =
    `Katzen: ${anzahlKatzen} von ${groesse}`;

  aktualisiereKatzenliste();

  }


function klickeFeld(index) {
	stoppeAbschlussTimer();
  if (zustand[index] === werkzeug) {
    zustand[index] = 0;
  } else {
    zustand[index] = werkzeug;
  }

  // Nach einer Änderung wird die bisherige Prüfung aufgehoben.
  geloest = false;
  konflikte.clear();

  aktualisiereAnzeige();

  zeigeMeldung(
    "Platz gefunden? Prüfe, ob alle Katzen friedlich schlafen können."
  );
}

function erstelleSpielfeld() {
  // Alte Felder entfernen, bevor wir den neuen Plan aufbauen.
  spielfeld.replaceChildren();
  feldButtons.length = 0;

  for (let index = 0; index < zustand.length; index++) {
    const reihe = Math.floor(index / groesse);
    const spalte = index % groesse;
    const bereich = bereiche[reihe][spalte];

    const feld = document.createElement("button");

    feld.type = "button";
    feld.className = "feld";

    feld.style.setProperty(
      "--bereichsfarbe",
      katzen[bereich].farbe
    );

    feld.addEventListener("click", function () {
      klickeFeld(index);
    });

    spielfeld.appendChild(feld);
    feldButtons.push(feld);
  }
}

// =====================================================
// 6. SPIELREGELN PRÜFEN
// =====================================================

function zeigePfotenAbschluss() {
  if (!geloest) {
    return;
  }

  const weitererTagVorhanden =
    aktuellesLevel + 1 < levelListe.length;

  const naechsterTag = weitererTagVorhanden
    ? aktuellesLevel + 1
    : 0;

  const abschlussText =
    "Mila, Mango, Loki, Coco und Nala haben ihre Schlafplätze " +
    "gefunden. Jetzt kehrt Ruhe in die Pension ein." +
    (
      weitererTagVorhanden
        ? " Morgen wartet ein neuer Schlafplan auf dich."
        : " Das war der letzte verfügbare Tag."
    );

  zeigeSpielAbschluss({
    titel: `${levelListe[aktuellesLevel].name} geschafft! 💤`,
    text: abschlussText,
    weiterText: weitererTagVorhanden
      ? "Weiter →"
      : "Tag 1 spielen ↻",

    weiterAktion: function () {
      wechsleLevel(naechsterTag);
      zeigeSeite("spielseite");
    }
  });
}

function pruefeLoesung() {
	stoppeAbschlussTimer();
  const platzierteKatzen = [];
  const gruende = new Set();

  konflikte.clear();
  geloest = false;

  zustand.forEach(function (wert, index) {
    if (wert !== 1) {
      return;
    }

    const reihe = Math.floor(index / groesse);
    const spalte = index % groesse;

    platzierteKatzen.push({
      index: index,
      reihe: reihe,
      spalte: spalte,
      bereich: bereiche[reihe][spalte]
    });
  });

  // Jede Katze mit jeder anderen vergleichen.
  for (let a = 0; a < platzierteKatzen.length; a++) {
    for (let b = a + 1; b < platzierteKatzen.length; b++) {
      const erste = platzierteKatzen[a];
      const zweite = platzierteKatzen[b];

      let konflikt = false;

      if (erste.reihe === zweite.reihe) {
        gruende.add(
          `In Reihe ${erste.reihe + 1} liegen mehrere Katzen.`
        );
        konflikt = true;
      }

      if (erste.spalte === zweite.spalte) {
        gruende.add(
          `In Spalte ${erste.spalte + 1} liegen mehrere Katzen.`
        );
        konflikt = true;
      }

      if (erste.bereich === zweite.bereich) {
        const gast = katzen[erste.bereich];

        gruende.add(
          `Im Bereich von ${gast.name} darf nur eine Katze liegen.`
        );
        konflikt = true;
      }

      const reihenAbstand = Math.abs(
        erste.reihe - zweite.reihe
      );

      const spaltenAbstand = Math.abs(
        erste.spalte - zweite.spalte
      );

      if (reihenAbstand <= 1 && spaltenAbstand <= 1) {
        gruende.add(
          "Zwei Katzen berühren sich. Auch diagonal brauchen sie Abstand."
        );
        konflikt = true;
      }

      if (konflikt) {
        // Beide beteiligten Katzen bekommen die Streit-Pose.
        konflikte.add(erste.index);
        konflikte.add(zweite.index);
      }
    }
  }

  if (konflikte.size > 0) {
    aktualisiereAnzeige();

    zeigeMeldung(
      Array.from(gruende)[0] +
      " Die streitenden Katzen zeigen dir die betroffenen Plätze.",
      "fehler"
    );

    return;
  }

  if (platzierteKatzen.length !== groesse) {
    aktualisiereAnzeige();

    zeigeMeldung(
      `Bisher ist alles friedlich. Setze noch alle ${groesse} Katzen. ` +
      `Aktuell sind es ${platzierteKatzen.length}.`
    );

    return;
  }

	 geloest = true;
	  aktualisiereAnzeige();

	  zeigeMeldung(
		"Pssst … alle schlafen! Die Abendruhe beginnt. 💤",
		"erfolg"
	  );

	  zeigePfotenAbschluss();
}

function setzeZurueck() {
	stoppeAbschlussTimer();
  zustand.fill(0);
  konflikte.clear();
  geloest = false;

  waehleWerkzeug(1);
  aktualisiereAnzeige();

  zeigeMeldung(
    "Alle Schlafplätze sind wieder frei. Die Gäste warten auf ihren Platz."
  );
}

// =====================================================
// 7. SCHALTFLÄCHEN VERBINDEN UND SPIEL STARTEN
// =====================================================

katzenWerkzeug.addEventListener("click", function () {
  waehleWerkzeug(1);
});

ausschlussWerkzeug.addEventListener("click", function () {
  waehleWerkzeug(2);
});

document.getElementById("pruefen").addEventListener(
  "click",
  pruefeLoesung
);

// Dieser Button startet immer den aktuellen Tag neu.
// Der Wechsel zum nächsten Tag erfolgt im Abschlussfenster.
document.getElementById("zuruecksetzen").addEventListener(
  "click",
  setzeZurueck
);

// =====================================================
// LEVELAUSWAHL UND LEVELWECHSEL
// =====================================================

function wechsleLevel(index) {
	stoppeAbschlussTimer();
  // Nur vorhandene Level zulassen.
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= levelListe.length
  ) {
    return;
  }

  aktuellesLevel = index;
  bereiche = levelListe[aktuellesLevel].bereiche;

  // Alle Markierungen und Prüfergebnisse zurücksetzen.
  zustand.fill(0);
  konflikte.clear();
  geloest = false;

  waehleWerkzeug(1);

  // Den neuen Farblayout-Plan anzeigen.
  erstelleSpielfeld();
  aktualisiereAnzeige();

  document.getElementById("levelauswahl").value = String(index);

  zeigeMeldung(
    `${levelListe[index].name}: ` +
    "Die Gäste warten auf ihre Schlafplätze."
  );
}

function initialisiereLevelauswahl() {
  const auswahl = document.getElementById("levelauswahl");

  auswahl.replaceChildren();

  levelListe.forEach(function (level, index) {
    const option = document.createElement("option");

    option.value = String(index);
    option.textContent = level.name;

    auswahl.appendChild(option);
  });

  auswahl.addEventListener("change", function () {
    wechsleLevel(Number(auswahl.value));
  });

  // Beim Start das erste Level laden.
  wechsleLevel(0);
}

// Das Spiel mit seiner Levelauswahl starten.
initialisiereLevelauswahl();