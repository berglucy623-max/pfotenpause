"use strict";

(function () {

  // ===================================================
  // 1. MEMORYKARTEN UND GESCHICHTEN
  // ===================================================

  const motive = [
    {
      id: "kratzbaum",
      name: "Kratzbaum",
      bild: "bilder/memory/kratzbaum.png",
      titel: "Mila behält den Überblick",
      geschichte:
        "Mila eroberte heute den höchsten Platz auf dem Kratzbaum. " +
        "Von dort überwachte sie den Hof – bis ein Schmetterling " +
        "ihre ganze Aufmerksamkeit bekam."
    },
    {
      id: "leckerlis",
      name: "Leckerlis",
      bild: "bilder/memory/leckerlis.png",
      titel: "Mangos überzeugendes Miauen",
      geschichte:
        "Beim Rascheln der Leckerlitüte standen plötzlich alle fünf " +
        "Gäste in einer Reihe. Mango behauptete mit einem besonders " +
        "überzeugenden Miauen, noch gar nichts bekommen zu haben."
    },
    {
      id: "koerbchen",
      name: "Körbchen",
      bild: "bilder/memory/koerbchen.png",
      titel: "Loki sucht den besten Platz",
      geschichte:
        "Loki probierte jedes Körbchen der Pension aus. " +
        "Am gemütlichsten war natürlich das, in dem gerade schon " +
        "jemand anderes schlafen wollte."
    },
    {
      id: "spielzeugmaus",
      name: "Spielzeugmaus",
      bild: "bilder/memory/spielzeugmaus.png",
      titel: "Cocos große Mäusejagd",
      geschichte:
        "Coco jagte die rosa Spielzeugmaus quer durch den Garten. " +
        "Als die Maus unter einer Bank verschwand, musste die " +
        "ganze Pension bei der Suche helfen."
    },
    {
      id: "tunnel",
      name: "Tunnel",
      bild: "bilder/memory/tunnel.png",
      titel: "Nalas geheimes Versteck",
      geschichte:
        "Nala entdeckte den Tunnel als perfektes Versteck. " +
        "Niemand konnte sie sehen – zumindest glaubte sie das. " +
        "Ihre Schwanzspitze schaute noch heraus."
    },
    {
      id: "wollknaeuel",
      name: "Wollknäuel",
      bild: "bilder/memory/wollknaeuel.png",
      titel: "Eine Spur zum Abendessen",
      geschichte:
        "Ein Wollknäuel machte sich selbstständig und rollte durch " +
        "den Hof. Fünf neugierige Katzen folgten ihm. Am Ende führte " +
        "eine lange Wollspur direkt zum Abendessen."
    }
  ];
  
  // Eigene Illustrationen für die Geschichten-Pop-ups.
	// Die normalen Memorykarten verwenden weiterhin motiv.bild.
	const geschichtenBilder = {
	  kratzbaum: "bilder/memory/mila-kratzbaum.png",
	  leckerlis: "bilder/memory/mango-leckerlis.png",
	  koerbchen: "bilder/memory/loki-koerbchen.png",
	  spielzeugmaus: "bilder/memory/coco-maus.png",
	  tunnel: "bilder/memory/nala-tunnel.png",
	  wollknaeuel: "bilder/memory/alle-wollknaeul.png"
	};

  // ===================================================
  // 2. ELEMENTE UND SPIELZUSTAND
  // ===================================================

  const feld = document.getElementById("memoryfeld");
  const paarAnzeige = document.getElementById("memoryPaare");
  const versuchAnzeige = document.getElementById("memoryVersuche");

  const geschichteDialog = document.getElementById("geschichteDialog");
  const geschichteTitel = document.getElementById("geschichteTitel");
  const geschichteText = document.getElementById("geschichteText");
  const geschichteBild = document.getElementById("geschichteBild");

  const abschluss = document.getElementById("memoryAbschluss");
  const weiterKnopf = document.getElementById("memoryWeiter");
  const neuKnopf = document.getElementById("memoryNeu");
  const bildhinweis = document.getElementById("memoryBildhinweis");

  let karten = [];
  let offeneKarten = [];
  let gefundenePaare = 0;
  let versuche = 0;
  let gesperrt = false;
  let rueckdrehTimer = null;

  const fehlendeBilder = new Set();

  // ===================================================
  // 3. KARTEN MISCHEN UND BILDFEHLER ANZEIGEN
  // ===================================================

  function mische(liste) {
    const ergebnis = liste.slice();

    for (let i = ergebnis.length - 1; i > 0; i--) {
      const zufallsIndex = Math.floor(Math.random() * (i + 1));

      const zwischenstand = ergebnis[i];
      ergebnis[i] = ergebnis[zufallsIndex];
      ergebnis[zufallsIndex] = zwischenstand;
    }

    return ergebnis;
  }

  function meldeBildproblem(datei) {
    fehlendeBilder.add(datei);

    bildhinweis.hidden = false;
    bildhinweis.textContent =
      "Diese Memorybilder konnten nicht geladen werden: " +
      Array.from(fehlendeBilder).join(", ") +
      ". Prüfe die Dateien im Ordner bilder/memory.";
  }

  // ===================================================
  // 4. KARTEN ERSTELLEN UND ANZEIGEN
  // ===================================================

  function erstelleKarten() {
    feld.replaceChildren();

    karten.forEach(function (karte, index) {
      const knopf = document.createElement("button");
      knopf.type = "button";
      knopf.className = "memorykarte";

      const ruecken = document.createElement("span");
      ruecken.className = "kartenruecken";
      ruecken.textContent = "🐾";
      ruecken.setAttribute("aria-hidden", "true");

      const bild = document.createElement("img");
      bild.alt = "";
      bild.hidden = true;
      bild.draggable = false;

      const ersatz = document.createElement("span");
      ersatz.className = "kartenersatz";
      ersatz.textContent = karte.motiv.name;
      ersatz.hidden = true;
      ersatz.setAttribute("aria-hidden", "true");

      karte.knopf = knopf;
      karte.ruecken = ruecken;
      karte.bild = bild;
      karte.ersatz = ersatz;
      karte.bildFehlt = false;

      bild.addEventListener("error", function () {
        karte.bildFehlt = true;
        meldeBildproblem(karte.motiv.bild);
        aktualisiereKarte(karte, index);
      });

      knopf.addEventListener("click", function () {
        deckeKarteAuf(index);
      });

      knopf.append(ruecken, bild, ersatz);
      feld.appendChild(knopf);

      bild.src = karte.motiv.bild;
    });

    aktualisiereAnzeige();
  }

  function aktualisiereKarte(karte, index) {
    const sichtbar =
      karte.gefunden || offeneKarten.includes(index);

    karte.knopf.classList.toggle("aufgedeckt", sichtbar);
    karte.knopf.classList.toggle("gefunden", karte.gefunden);
    karte.knopf.disabled = karte.gefunden;

    karte.ruecken.hidden = sichtbar;
    karte.bild.hidden = !sichtbar || karte.bildFehlt;
    karte.ersatz.hidden = !sichtbar || !karte.bildFehlt;

    let beschreibung = `Karte ${index + 1}, verdeckt`;

    if (sichtbar) {
      beschreibung = `Karte ${index + 1}, ${karte.motiv.name}`;
    }

    if (karte.gefunden) {
      beschreibung += ", Paar gefunden";
    }

    karte.knopf.setAttribute("aria-label", beschreibung);
  }

  function aktualisiereAnzeige() {
    karten.forEach(function (karte, index) {
      aktualisiereKarte(karte, index);
    });

    paarAnzeige.textContent =
      `Paare: ${gefundenePaare} von ${motive.length}`;

    versuchAnzeige.textContent = `Versuche: ${versuche}`;
  }

  // ===================================================
  // 5. AUFDECKEN UND PAARE PRÜFEN
  // ===================================================

  function deckeKarteAuf(index) {
    if (
      gesperrt ||
      geschichteDialog.open ||
      karten[index].gefunden ||
      offeneKarten.includes(index)
    ) {
      return;
    }

    offeneKarten.push(index);
    aktualisiereAnzeige();

    if (offeneKarten.length < 2) {
      return;
    }

    versuche++;

    const erste = karten[offeneKarten[0]];
    const zweite = karten[offeneKarten[1]];

    if (erste.motiv.id === zweite.motiv.id) {
      erste.gefunden = true;
      zweite.gefunden = true;

      gefundenePaare++;
      offeneKarten = [];

      aktualisiereAnzeige();

      if (gefundenePaare === motive.length) {
        beendeRunde();
      }

      zeigeGeschichte(erste.motiv);
      return;
    }

    // Unterschiedliche Karten eine Sekunde sichtbar lassen.
    gesperrt = true;
    aktualisiereAnzeige();

    rueckdrehTimer = window.setTimeout(function () {
      offeneKarten = [];
      gesperrt = false;
      rueckdrehTimer = null;

      aktualisiereAnzeige();
    }, 1000);
  }

  // ===================================================
  // 6. GESCHICHTENFENSTER UND ABSCHLUSS
  // ===================================================

  function zeigeGeschichte(motiv) {
    geschichteTitel.textContent = motiv.titel;
    geschichteText.textContent = motiv.geschichte;

    // Im Fenster erscheint nur das gefundene Kartenmotiv.
    geschichteBild.hidden = true;
    geschichteBild.src = geschichtenBilder[motiv.id];

    document.body.classList.add("geschichte-offen");

    if (!geschichteDialog.open) {
      geschichteDialog.showModal();
    }
  }

  geschichteBild.addEventListener("load", function () {
    geschichteBild.hidden = false;
  });

  geschichteBild.addEventListener("error", function () {
    geschichteBild.hidden = true;
    meldeBildproblem(geschichteBild.getAttribute("src"));
  });

	geschichteDialog.addEventListener("close", function () {
	  document.body.classList.remove("geschichte-offen");

	  const allePaareGefunden = gefundenePaare === motive.length;
	  const memorySichtbar =
		!document.getElementById("memoryseite").hidden;

	  if (allePaareGefunden && memorySichtbar) {
		// Nach der letzten Geschichte folgt der Abschluss.
		document.body.classList.add("geschichte-offen");

		if (!abschluss.open) {
		  abschluss.showModal();
		}

		return;
	  }

	  // Während der Runde zur nächsten verfügbaren Karte zurückkehren.
	  const naechsteKarte = karten.find(function (karte) {
		return !karte.gefunden;
	  });

	  const ziel = naechsteKarte
		? naechsteKarte.knopf
		: neuKnopf;

	  ziel.focus({ preventScroll: true });
	});
	
	weiterKnopf.addEventListener("click", function () {
	abschluss.close();
	document.body.classList.remove("geschichte-offen");

	// Die vorhandene Navigation aus game.js verwenden.
	zeigeSeite("eingangsseite");
	});

	// Dieses Abschlussfenster wird über seinen Button verlassen.
	// Das Kreuz und die Esc-Taste der einzelnen Geschichten bleiben unverändert.
	abschluss.addEventListener("cancel", function (ereignis) {
	  ereignis.preventDefault();
	});

	function beendeRunde() {
	  // Das Abschlussfenster noch nicht öffnen:
	  // Zuerst darf die letzte Geschichte gelesen werden.
	  neuKnopf.textContent = "Noch einmal spielen ↻";
	}

  // ===================================================
  // 7. NEUE RUNDE
  // ===================================================

  function neueRunde() {
    if (geschichteDialog.open) {
      geschichteDialog.close();
    }

    document.body.classList.remove("geschichte-offen");

    // Alte Timer dürfen nicht in die neue Runde eingreifen.
    if (rueckdrehTimer !== null) {
      window.clearTimeout(rueckdrehTimer);
      rueckdrehTimer = null;
    }

    offeneKarten = [];
    gefundenePaare = 0;
    versuche = 0;
    gesperrt = false;

    const neueKarten = [];

    // Jede Bilddatei ergibt zwei passende Karten.
    motive.forEach(function (motiv) {
      neueKarten.push({ motiv: motiv, gefunden: false });
      neueKarten.push({ motiv: motiv, gefunden: false });
    });

    karten = mische(neueKarten);

    if (abschluss.open) {
    abschluss.close();
	}
    neuKnopf.textContent = "Neu mischen ↻";

    erstelleKarten();
  }

  neuKnopf.addEventListener("click", neueRunde);

  neueRunde();

})();