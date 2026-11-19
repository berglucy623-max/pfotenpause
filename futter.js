"use strict";

(function () {
  // =========================================
  // 1. DATEIEN UND SPIELEINSTELLUNGEN
  // =========================================

  const BILDORDNER = "bilder/futter/";

  const FRESSZEIT = 2000;
  const GLUECKLICHZEIT = 1100;
  const STREITZEIT = 1400;

  const KATZEN = [
    { id: "coco", name: "Coco" },
    { id: "loki", name: "Loki" },
    { id: "mango", name: "Mango" },
    { id: "mila", name: "Mila" },
    { id: "nala", name: "Nala" }
  ];

  const NAEPFE = [
    { id: "blau", name: "Blau", wunsch: "den blauen Napf" },
    { id: "rosa", name: "Rosa", wunsch: "den rosa Napf" },
    { id: "grün", name: "Grün", wunsch: "den grünen Napf" },
    { id: "gelb", name: "Gelb", wunsch: "den gelben Napf" },
    { id: "lila", name: "Lila", wunsch: "den lila Napf" }
  ].map(function (napf) {
    return {
      ...napf,
      datei: `${BILDORDNER}${napf.id}-napf.png`
    };
  });

  const FUTTER = [
    { id: "fische", name: "Fische", wunsch: "Fisch-Leckerlis" },
    { id: "herzen", name: "Herzen", wunsch: "Herz-Leckerlis" },
    { id: "dose1", name: "Dose 1", wunsch: "Futter aus Dose 1" },
    { id: "dose2", name: "Dose 2", wunsch: "Futter aus Dose 2" }
  ].map(function (futter) {
    return {
      ...futter,
      datei: `${BILDORDNER}${futter.id}.png`
    };
  });

  const TAGE = [
    { bestellungen: 5, naepfe: 2, futter: 2 },
    { bestellungen: 5, naepfe: 3, futter: 3 },
    { bestellungen: 5, naepfe: 4, futter: 3 },
    { bestellungen: 5, naepfe: 5, futter: 4 },
    { bestellungen: 6, naepfe: 5, futter: 4 },
    { bestellungen: 8, naepfe: 5, futter: 4 },
    { bestellungen: 10, naepfe: 5, futter: 4 }
  ];

  // =========================================
  // 2. INDIVIDUELLE BILDPOSITIONEN
  // =========================================

  /*
   * Alle Positionen beziehen sich auf das gesamte Zimmer.
   *
   * [links, unten, Breite, Höhe] in Prozent.
   *
   * katze:
   * Bildrahmen der Katze. Das ganze PNG wird darin angezeigt.
   *
   * napf:
   * Napfposition beim Fressen.
   *
   * spiegeln: true
   * Spiegelt nur das Katzenbild horizontal.
   *
   * Die Werte sind anpassbare Startwerte.
   */
  const BILDPOSITIONEN = {
    "coco-warten": {
      katze: [32, 6, 52, 26]
    },
    "coco-fressen": {
      katze: [44, 9, 52, 22],
      napf: [75, 8, 17, 8]
    },
    "coco-gluecklich": {
      katze: [43, 9, 54, 21]
    },
    "coco-streiten": {
      katze: [46, 8, 48, 25]
    },

    "loki-warten": {
      katze: [32, 6, 52, 26]
    },
    "loki-fressen": {
      katze: [44, 9, 52, 22],
      napf: [46, 8, 17, 8]
    },
    "loki-gluecklich": {
      katze: [43, 9, 54, 21]
    },
    "loki-streiten": {
      katze: [46, 8, 48, 25]
    },

    "mango-warten": {
      katze: [32, 6, 52, 26]
    },
    "mango-fressen": {
      katze: [44, 9, 52, 22],
      napf: [75, 8, 17, 8]
    },
    "mango-gluecklich": {
      katze: [43, 9, 54, 21]
    },
    "mango-streiten": {
      katze: [46, 8, 48, 25]
    },

    "mila-warten": {
      katze: [32, 6, 52, 26]
    },
    "mila-fressen": {
      katze: [44, 9, 52, 22],
      napf: [67, 8, 17, 8]
    },
    "mila-gluecklich": {
      katze: [43, 9, 54, 21]
    },
    "mila-streiten": {
      katze: [46, 8, 48, 25]
    },

    "nala-warten": {
      katze: [32, 6, 52, 26]
    },
    "nala-fressen": {
      katze: [44, 9, 52, 22],
      napf: [46, 8, 17, 8]
    },
    "nala-gluecklich": {
      katze: [43, 9, 54, 21]
    },
    "nala-streiten": {
      katze: [46, 8, 48, 25]
    }
  };


  // =========================================
  // 3. HTML-ELEMENTE
  // =========================================

  const ids = [
    "startFruehstueck", "fruehstueckseite",
    "frZurAuswahl", "frStart", "frNeu", "frTagAuswahl",
    "frSzene", "frHintergrund", "frTresen",
    "frNapfOptionen", "frFutterOptionen",
    "frServieren", "frVorschau",
    "frKatze", "frNapf", "frBlase",
    "frKatzenname", "frWunsch", "frWunschbilder",
    "frZaehler", "frPunkte", "frMeldung", "frBildhinweis",
    "frAbschluss", "frAbschlussBild",
    "frAbschlussTitel", "frAbschlussText",
    "frWeiter", "frAbschlussAuswahl"
  ];

  const dom = {};

  ids.forEach(function (id) {
    dom[id] = document.getElementById(id);
  });

  const fehlendeElemente = ids.filter(function (id) {
    return !dom[id];
  });

  if (fehlendeElemente.length > 0) {
    console.error(
      "Frühstück: Diese HTML-Elemente fehlen:",
      fehlendeElemente.join(", ")
    );
    return;
  }

  // =========================================
  // 4. SPIELZUSTAND
  // =========================================

  let tagIndex = 0;
  let bestellungen = [];
  let bestellIndex = 0;
  let richtigeBestellungen = 0;

  let ausgewaehlterNapf = null;
  let ausgewaehltesFutter = null;
  let letzteBestellungRichtig = true;
  let letzterWunsch = null;

  /*
   * laden → bereit → warten
   * warten → fressen → gluecklich → nächste Katze
   * warten → streit → nächste Katze
   */
  let phase = "laden";
  let positionsEditorAktiv = false;

  let bilderBereit = false;
  let ladeVersprechen = null;

  let reaktionsTimer = null;
  let timerVersion = 0;

  const bildCache = new Map();
  const fehlendeBilder = new Set();

  // =========================================
  // 5. BILDER LADEN
  // =========================================

  function katzenDatei(katze, pose) {
    return pose === "streiten"
      ? `bilder/katzen/${katze.id}-streiten.png`
      : `${BILDORDNER}${katze.id}-${pose}.png`;
  }

  function vollerNapfDatei(napfId, futterId) {
    return `${BILDORDNER}${napfId}-${futterId}.png`;
  }

  function ladeBild(datei) {
    return new Promise(function (resolve) {
      const bild = new Image();
      let erledigt = false;

      const zeitlimit = window.setTimeout(function () {
        abschliessen(false);
      }, 15000);

      function abschliessen(erfolg) {
        if (erledigt) {
          return;
        }

        erledigt = true;
        window.clearTimeout(zeitlimit);

        bildCache.set(datei, erfolg ? bild : null);

        if (!erfolg) {
          fehlendeBilder.add(datei);
        }

        resolve();
      }

      bild.onload = function () {
        abschliessen(true);
      };

      bild.onerror = function () {
        abschliessen(false);
      };

      bild.src = datei;
    });
  }

  function bereiteBilderVor() {
    if (ladeVersprechen) {
      return ladeVersprechen;
    }

    const dateien = new Set([
      `${BILDORDNER}esszimmer.png`,
      `${BILDORDNER}thresen.png`
    ]);

    KATZEN.forEach(function (katze) {
      ["warten", "fressen", "gluecklich", "streiten"].forEach(
        function (pose) {
          dateien.add(katzenDatei(katze, pose));
        }
      );
    });

    NAEPFE.forEach(function (napf) {
      dateien.add(napf.datei);

      FUTTER.forEach(function (futter) {
        dateien.add(vollerNapfDatei(napf.id, futter.id));
      });
    });

    FUTTER.forEach(function (futter) {
      dateien.add(futter.datei);
    });

    ladeVersprechen = Promise.all(
      Array.from(dateien).map(ladeBild)
    ).then(function () {
      bilderBereit = true;

      const hintergrund =
        bildCache.get(`${BILDORDNER}esszimmer.png`);

      dom.frHintergrund.hidden = !hintergrund;

      if (hintergrund) {
        // Tatsächliches Bildformat statt festgelegter Szenenhöhe.
        dom.frSzene.style.setProperty(
          "--fr-bildformat",
          `${hintergrund.naturalWidth} / ${hintergrund.naturalHeight}`
        );
      }

      dom.frTresen.hidden =
        !bildCache.get(`${BILDORDNER}thresen.png`);

      if (fehlendeBilder.size > 0) {
        dom.frBildhinweis.hidden = false;
        dom.frBildhinweis.textContent =
          "Nicht geladen: " +
          Array.from(fehlendeBilder).join(", ") +
          ". Prüfe diese Dateinamen. " +
          "Fehlende Bilder werden durch beschriftete Flächen ersetzt.";

        console.warn(
          "Frühstück: Fehlende Bilder",
          Array.from(fehlendeBilder)
        );
      }

      if (phase === "laden") {
        phase = "bereit";
      }

      baueAuswahl();
      aktualisiereAnzeige();

      if (phase === "bereit") {
        zeigeMeldung(
          `Tag ${tagIndex + 1} ist bereit. Drücke auf „Tag starten“.`
        );
      }
    }).catch(function (fehler) {
      console.error("Frühstück: Vorbereitung fehlgeschlagen.", fehler);

      bilderBereit = false;
      aktualisiereAnzeige();

      zeigeMeldung(
        "Die Vorbereitung wurde unterbrochen. " +
        "Prüfe die erste Fehlermeldung in der Browserkonsole.",
        "fehler"
      );
    });

    return ladeVersprechen;
  }

  function erstelleBild(datei, beschreibung, dekorativ = false) {
    const rahmen = document.createElement("span");
    rahmen.className = "fr-bild";

    if (dekorativ) {
      rahmen.setAttribute("aria-hidden", "true");
    }

    const geladenesBild = bildCache.get(datei);

    if (geladenesBild) {
      const bild = geladenesBild.cloneNode(false);

      bild.alt = dekorativ ? "" : beschreibung;
      bild.draggable = false;

      rahmen.appendChild(bild);
    } else {
      const ersatz = document.createElement("span");
      ersatz.className = "fr-bildersatz";
      ersatz.textContent = beschreibung;

      rahmen.appendChild(ersatz);
    }

    return rahmen;
  }

  // =========================================
  // 6. TAGE UND BESTELLUNGEN
  // =========================================

  function mische(liste) {
    const kopie = [...liste];

    for (let i = kopie.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
    }

    return kopie;
  }

  function zufaellig(liste) {
    return liste[Math.floor(Math.random() * liste.length)];
  }

	function erstelleBestellungen(tag) {
	  const katzenfolge = [];

	  while (katzenfolge.length < tag.bestellungen) {
		const runde = mische(KATZEN);

		if (
		  katzenfolge.length > 0 &&
		  katzenfolge[katzenfolge.length - 1].id === runde[0].id
		) {
		  [runde[0], runde[1]] = [runde[1], runde[0]];
		}

		katzenfolge.push(...runde);
	  }

	  const naepfe = NAEPFE.slice(0, tag.naepfe);
	  const futtersorten = FUTTER.slice(0, tag.futter);

	  const kombinationen = [];

	  naepfe.forEach(function (napf) {
		futtersorten.forEach(function (futter) {
		  kombinationen.push({ napf, futter });
		});
	  });

	  const verwendungen = new Map();

	  // Auch die erste Bestellung eines neuen Tages soll sich
	  // vom zuletzt abgegebenen Wunsch unterscheiden.
	  let vorher = letzterWunsch;

	  return katzenfolge.slice(0, tag.bestellungen).map(
		function (katze) {
		  let kandidaten = kombinationen.filter(function (kombi) {
			return (
			  !vorher ||
			  (
				kombi.napf.id !== vorher.napf.id &&
				kombi.futter.id !== vorher.futter.id
			  )
			);
		  });

		  // Absicherung, falls später ein Tag mit nur einer
		  // Farbe oder einer Futtersorte ergänzt wird.
		  if (kandidaten.length === 0) {
			kandidaten = kombinationen;
		  }

		  // Unter den erlaubten Kombinationen werden die
		  // bisher am seltensten verwendeten bevorzugt.
		  const geringsteVerwendung = Math.min(
			...kandidaten.map(function (kombi) {
			  const schluessel = `${kombi.napf.id}|${kombi.futter.id}`;
			  return verwendungen.get(schluessel) || 0;
			})
		  );

		  const selteneKombinationen = kandidaten.filter(
			function (kombi) {
			  const schluessel = `${kombi.napf.id}|${kombi.futter.id}`;

			  return (
				(verwendungen.get(schluessel) || 0) ===
				geringsteVerwendung
			  );
			}
		  );

		  const gewaehlt = zufaellig(selteneKombinationen);

		  const schluessel =
			`${gewaehlt.napf.id}|${gewaehlt.futter.id}`;

		  verwendungen.set(
			schluessel,
			(verwendungen.get(schluessel) || 0) + 1
		  );

		  vorher = gewaehlt;

		  return {
			katze,
			napf: gewaehlt.napf,
			futter: gewaehlt.futter
		  };
		}
	  );
	}

  function bereiteTagVor(index) {
    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= TAGE.length
    ) {
      return;
    }

    stoppeReaktion();
    schliesseAbschluss();

    tagIndex = index;
    bestellungen = erstelleBestellungen(TAGE[index]);
    bestellIndex = 0;
    richtigeBestellungen = 0;

    ausgewaehlterNapf = null;
    ausgewaehltesFutter = null;
    letzteBestellungRichtig = true;

    phase = bilderBereit ? "bereit" : "laden";

    dom.frTagAuswahl.value = String(index);

    if (bilderBereit) {
      baueAuswahl();
    }

    aktualisiereAnzeige();

    zeigeMeldung(
      bilderBereit
        ? `Tag ${index + 1} ist bereit. Drücke auf „Tag starten“.`
        : "Die Frühstücksbilder werden vorbereitet."
    );
  }

  function starteSpiel() {
    if (!bilderBereit || phase !== "bereit") {
      return;
    }

    phase = "warten";
    aktualisiereAnzeige();
    zeigeMeldung("Die erste Katze wartet auf ihr Frühstück.");
  }

  function aktuelleBestellung() {
    return bestellungen[
      Math.min(bestellIndex, bestellungen.length - 1)
    ];
  }

  // =========================================
  // 7. AUSWAHL AUFBAUEN
  // =========================================

  function baueAuswahlgruppe(container, werte, art) {
    container.replaceChildren();

    werte.forEach(function (wert) {
      const knopf = document.createElement("button");

      knopf.type = "button";
      knopf.className = "fr-option";
      knopf.dataset.art = art;
      knopf.dataset.id = wert.id;
      knopf.setAttribute("aria-pressed", "false");

      const beschriftung = document.createElement("span");
      beschriftung.textContent = wert.name;

      knopf.append(
        erstelleBild(wert.datei, wert.name, true),
        beschriftung
      );

      container.appendChild(knopf);
    });
  }

	function baueAuswahl() {
	  // Immer alle fünf Napffarben anzeigen.
	  baueAuswahlgruppe(
		dom.frNapfOptionen,
		NAEPFE,
		"napf"
	  );

	  // Immer alle vier Futtersorten anzeigen.
	  baueAuswahlgruppe(
		dom.frFutterOptionen,
		FUTTER,
		"futter"
	  );
	}

  function zeigeMeldung(text, typ = "") {
    dom.frMeldung.textContent = text;
    dom.frMeldung.dataset.typ = typ;
  }

  // =========================================
  // 8. BILDPOSITIONEN ANWENDEN
  // =========================================

  function setzePosition(element, position) {
    if (
      !Array.isArray(position) ||
      position.length !== 4 ||
      !position.every(Number.isFinite)
    ) {
      return;
    }

    const [links, unten, breite, hoehe] = position;

    if (breite <= 0 || hoehe <= 0) {
      return;
    }

    element.style.left = `${links}%`;
    element.style.bottom = `${unten}%`;
    element.style.width = `${breite}%`;
    element.style.height = `${hoehe}%`;
  }

	function positioniereBilder(katze, pose) {
	  const einstellung =
		BILDPOSITIONEN[`${katze.id}-${pose}`] || {};

	  setzePosition(
		dom.frKatze,
		einstellung.katze || [32, 6, 52, 26]
	  );

	  dom.frKatze.style.transform =
		einstellung.spiegeln === true ? "scaleX(-1)" : "none";

	  // Nur der Napf vor der fressenden Katze wird hier positioniert.
	  // Die Zubereitungsvorschau liegt jetzt in der Seitenleiste.
	  if (phase === "fressen") {
		setzePosition(
		  dom.frNapf,
		  einstellung.napf || [66, 8, 17, 8]
		);
	  }
	}

	function richteSprechblaseAus() {
	  if (
		phase !== "warten" ||
		dom.fruehstueckseite.hidden ||
		dom.frBlase.hidden
	  ) {
		return;
	  }

	  const bestellung = aktuelleBestellung();

	  if (!bestellung) {
		return;
	  }

	  const bild = bildCache.get(
		katzenDatei(bestellung.katze, "warten")
	  );

	  const zimmerBreite = dom.frSzene.clientWidth;
	  const zimmerHoehe = dom.frSzene.clientHeight;

	  const rahmenBreite = dom.frKatze.clientWidth;
	  const rahmenHoehe = dom.frKatze.clientHeight;

	  if (
		zimmerBreite <= 0 ||
		zimmerHoehe <= 0 ||
		rahmenBreite <= 0 ||
		rahmenHoehe <= 0
	  ) {
		return;
	  }

	  // Die tatsächliche Bildhöhe innerhalb des contain-Rahmens
	  // berücksichtigen, nicht nur die Höhe des Katzenrahmens.
	  const bildformat =
		bild && bild.naturalHeight > 0
		  ? bild.naturalWidth / bild.naturalHeight
		  : rahmenBreite / rahmenHoehe;

	  const dargestellteHoehe = Math.min(
		rahmenHoehe,
		rahmenBreite / bildformat
	  );

	  const einstellung =
		BILDPOSITIONEN[`${bestellung.katze.id}-warten`] || {};

	  const untenProzent =
		Number.parseFloat(dom.frKatze.style.bottom) || 0;

	  // Optional pro Katzenbild einstellbar:
	  // blaseAbstand: Abstand über dem Bild in Prozent des Zimmers.
	  const abstandProzent = Number.isFinite(einstellung.blaseAbstand)
		? einstellung.blaseAbstand
		: 1.2;

	  const gewuenschterAbstandUnten =
		zimmerHoehe * untenProzent / 100 +
		dargestellteHoehe +
		zimmerHoehe * abstandProzent / 100;

	  const blasenBreite = dom.frBlase.offsetWidth;
	  const blasenHoehe = dom.frBlase.offsetHeight;

	  const katzenMitte =
		dom.frKatze.offsetLeft + rahmenBreite / 2;

	  // Nicht über die Auswahlleiste oder den rechten Bildrand hinaus.
	  const minimaleLinkePosition = zimmerBreite * 0.34;

	  const maximaleLinkePosition = Math.max(
		minimaleLinkePosition,
		zimmerBreite - blasenBreite - zimmerBreite * 0.02
	  );

	  const links = Math.max(
		minimaleLinkePosition,
		Math.min(
		  maximaleLinkePosition,
		  katzenMitte - blasenBreite / 2
		)
	  );

	  const unten = Math.max(
		8,
		Math.min(
		  gewuenschterAbstandUnten,
		  zimmerHoehe - blasenHoehe - 8
		)
	  );

	  const spitze = Math.max(
		16,
		Math.min(blasenBreite - 16, katzenMitte - links)
	  );

	  dom.frBlase.style.setProperty(
		"--fr-blase-links",
		`${links}px`
	  );

	  dom.frBlase.style.setProperty(
		"--fr-blase-unten",
		`${unten}px`
	  );

	  dom.frBlase.style.setProperty(
		"--fr-blasenspitze",
		`${spitze}px`
	  );
	}

  // =========================================
  // 9. SPIELANZEIGE
  // =========================================

	function aktualisiereAnzeige() {
	  dom.frSzene.dataset.phase = phase;

	const wartet =
	  bilderBereit && phase === "warten" && !positionsEditorAktiv;

	const bereit =
	  bilderBereit && phase === "bereit" && !positionsEditorAktiv;

	  dom.frStart.disabled = !bereit;
	  dom.frStart.textContent =
		!bilderBereit ? "Bilder werden geladen …" : "Tag starten →";

	  dom.frNeu.disabled = !bilderBereit || positionsEditorAktiv;
	  dom.frTagAuswahl.disabled = positionsEditorAktiv;

	  dom.frZaehler.textContent =
		phase === "bereit" || phase === "laden"
		  ? `Bestellungen: 0 von ${bestellungen.length}`
		  : phase === "fertig"
			? `Bestellungen: ${bestellungen.length} von ${bestellungen.length}`
			: `Katze ${bestellIndex + 1} von ${bestellungen.length}`;

	  dom.frPunkte.textContent =
		`Richtig: ${richtigeBestellungen}`;

	  [
		...dom.frNapfOptionen.querySelectorAll("button"),
		...dom.frFutterOptionen.querySelectorAll("button")
	  ].forEach(function (knopf) {
		const ausgewaehlt =
		  knopf.dataset.art === "napf"
			? knopf.dataset.id === ausgewaehlterNapf
			: knopf.dataset.id === ausgewaehltesFutter;

		knopf.disabled = !wartet;
		knopf.setAttribute("aria-pressed", String(ausgewaehlt));
	  });

	  dom.frServieren.disabled =
		!wartet || !ausgewaehlterNapf || !ausgewaehltesFutter;

	  const napf = NAEPFE.find(function (eintrag) {
		return eintrag.id === ausgewaehlterNapf;
	  });

	  const futter = FUTTER.find(function (eintrag) {
		return eintrag.id === ausgewaehltesFutter;
	  });

	  // Zubereitungsvorschau über "Servieren".
	  if (napf) {
		dom.frVorschau.replaceChildren(
		  erstelleBild(
			futter
			  ? vollerNapfDatei(napf.id, futter.id)
			  : napf.datei,
			futter
			  ? `${napf.name}: ${futter.name}`
			  : `Leerer Napf: ${napf.name}`
		  )
		);
	  } else {
		const hinweis = document.createElement("span");
		hinweis.className = "fr-vorschauhinweis";
		hinweis.textContent = "Dein Frühstück";

		dom.frVorschau.replaceChildren(hinweis);
	  }

	  const bestellung = aktuelleBestellung();

	  if (
		!bilderBereit ||
		!bestellung ||
		phase === "bereit" ||
		phase === "laden"
	  ) {
		dom.frKatze.hidden = true;
		dom.frNapf.hidden = true;
		dom.frBlase.hidden = true;

		document.dispatchEvent(new Event("fr-layout"));

		return;
	  }

	  let pose = "warten";

	  if (phase === "fressen") {
		pose = "fressen";
	  } else if (phase === "gluecklich") {
		pose = "gluecklich";
	  } else if (phase === "streit") {
		pose = "streiten";
	  } else if (phase === "fertig") {
		pose = letzteBestellungRichtig ? "gluecklich" : "streiten";
	  }

	  positioniereBilder(bestellung.katze, pose);

	  const beschreibungen = {
		warten: "wartet auf ihr Frühstück",
		fressen: "frisst",
		gluecklich: "ist glücklich",
		streiten: "ist ärgerlich"
	  };

	  dom.frKatze.hidden = false;
	  dom.frKatze.replaceChildren(
		erstelleBild(
		  katzenDatei(bestellung.katze, pose),
		  `${bestellung.katze.name} ${beschreibungen[pose]}`
		)
	  );

	  dom.frBlase.hidden = phase !== "warten";

	  if (phase === "warten") {
		dom.frKatzenname.textContent = bestellung.katze.name;

		dom.frWunsch.textContent =
		  `Bitte ${bestellung.napf.wunsch} ` +
		  `mit ${bestellung.futter.wunsch}!`;

		const plus = document.createElement("span");
		plus.textContent = "+";

		dom.frWunschbilder.replaceChildren(
		  erstelleBild(
			bestellung.napf.datei,
			bestellung.napf.name,
			true
		  ),
		  plus,
		  erstelleBild(
			bestellung.futter.datei,
			bestellung.futter.name,
			true
		  )
		);
	  }

	  // Im Zimmer erscheint der Napf ausschließlich beim Fressen.
	  const napfSichtbar =
		phase === "fressen" && Boolean(napf) && Boolean(futter);

	  dom.frNapf.hidden = !napfSichtbar;

	  if (napfSichtbar) {
		dom.frNapf.replaceChildren(
		  erstelleBild(
			vollerNapfDatei(napf.id, futter.id),
			`${napf.name}: ${futter.name}`
		  )
		);
	  }

	  richteSprechblaseAus();
	  document.dispatchEvent(new Event("fr-layout"));
	}

  function waehleOption(ereignis) {
    if (!bilderBereit || phase !== "warten") {
      return;
    }

    const knopf = ereignis.target.closest("button[data-art]");

    if (!knopf || !ereignis.currentTarget.contains(knopf)) {
      return;
    }

    if (knopf.dataset.art === "napf") {
      ausgewaehlterNapf = knopf.dataset.id;
    } else {
      ausgewaehltesFutter = knopf.dataset.id;
    }

    aktualisiereAnzeige();

    zeigeMeldung(
      ausgewaehlterNapf && ausgewaehltesFutter
        ? "Frühstück vorbereitet? Drücke auf „Servieren“."
        : "Wähle noch den passenden Napf und das passende Futter."
    );
  }

  // =========================================
  // 10. SERVIEREN UND REAKTIONEN
  // =========================================

  function stoppeReaktion() {
    timerVersion++;

    if (reaktionsTimer !== null) {
      window.clearTimeout(reaktionsTimer);
      reaktionsTimer = null;
    }
  }

  function nachWartezeit(dauer, aktion) {
    const versionBeimStart = timerVersion;

    reaktionsTimer = window.setTimeout(function () {
      reaktionsTimer = null;

      if (
        versionBeimStart !== timerVersion ||
        dom.fruehstueckseite.hidden
      ) {
        return;
      }

      aktion();
    }, dauer);
  }

  function servieren() {
    if (
      phase !== "warten" ||
      !ausgewaehlterNapf ||
      !ausgewaehltesFutter
    ) {
      return;
    }

    const bestellung = aktuelleBestellung();
	letzterWunsch = bestellung;

    letzteBestellungRichtig =
      ausgewaehlterNapf === bestellung.napf.id &&
      ausgewaehltesFutter === bestellung.futter.id;

    if (letzteBestellungRichtig) {
      richtigeBestellungen++;
      phase = "fressen";
      aktualisiereAnzeige();

      zeigeMeldung(
        `${bestellung.katze.name} lässt es sich schmecken.`,
        "erfolg"
      );

      nachWartezeit(FRESSZEIT, function () {
        phase = "gluecklich";
        aktualisiereAnzeige();

        zeigeMeldung(
          `${bestellung.katze.name} ist satt und glücklich!`,
          "erfolg"
        );

        nachWartezeit(GLUECKLICHZEIT, naechsteKatze);
      });
    } else {
      phase = "streit";
      aktualisiereAnzeige();

      zeigeMeldung(
        `Das war nicht ${bestellung.katze.name}s Bestellung. ` +
        "Die nächste Katze kommt gleich.",
        "fehler"
      );

      nachWartezeit(STREITZEIT, naechsteKatze);
    }
  }

  function naechsteKatze() {
    bestellIndex++;
    ausgewaehlterNapf = null;
    ausgewaehltesFutter = null;

    if (bestellIndex >= bestellungen.length) {
      phase = "fertig";
      aktualisiereAnzeige();
      zeigeAbschluss();
      return;
    }

    phase = "warten";
    aktualisiereAnzeige();
    zeigeMeldung("Die nächste Katze wartet auf ihr Frühstück.");

    const ersterKnopf =
      dom.frNapfOptionen.querySelector("button");

    if (ersterKnopf && !dom.fruehstueckseite.hidden) {
      ersterKnopf.focus({ preventScroll: true });
    }
  }

  // =========================================
  // 11. ABSCHLUSSFENSTER
  // =========================================

  function synchronisiereDialoge() {
    if (typeof synchronisiereDialogStatus === "function") {
      synchronisiereDialogStatus();
      return;
    }

    document.body.classList.toggle(
      "dialog-offen",
      document.querySelector("dialog[open]") !== null
    );
  }

  function schliesseAbschluss() {
    if (dom.frAbschluss.open) {
      dom.frAbschluss.close();
    }

    synchronisiereDialoge();
  }

  function zeigeAbschluss() {
    if (
      phase !== "fertig" ||
      dom.fruehstueckseite.hidden ||
      dom.frAbschluss.open
    ) {
      return;
    }

    const letzterGast = aktuelleBestellung().katze;

    dom.frAbschlussBild.replaceChildren(
      erstelleBild(
        katzenDatei(
          letzterGast,
          letzteBestellungRichtig ? "gluecklich" : "streiten"
        ),
        letzterGast.name
      )
    );

    dom.frAbschlussTitel.textContent =
      `Tag ${tagIndex + 1} beendet!`;

    dom.frAbschlussText.textContent =
      `${richtigeBestellungen} von ${bestellungen.length} ` +
      "Bestellungen waren richtig. " +
      (
        richtigeBestellungen === bestellungen.length
          ? "Alle Gäste haben ihr Wunschfrühstück bekommen!"
          : "Beim nächsten Frühstück wartet eine neue Runde."
      );

    dom.frWeiter.textContent =
      tagIndex + 1 < TAGE.length
        ? "Weiter →"
        : "Tag 1 spielen ↻";

    zeigeMeldung(
      `Tag beendet: ${richtigeBestellungen} von ` +
      `${bestellungen.length} Bestellungen richtig.`
    );

    dom.frAbschluss.showModal();
    synchronisiereDialoge();
    dom.frWeiter.focus({ preventScroll: true });
  }

  // =========================================
  // 12. NAVIGATION
  // =========================================

  function beimBetreten() {
    if (dom.fruehstueckseite.hidden) {
      return;
    }

    if (!bilderBereit) {
      bereiteBilderVor();
      return;
    }

    aktualisiereAnzeige();

    if (phase === "fertig") {
      zeigeAbschluss();
    }
  }

  function beimVerlassen() {
    stoppeReaktion();
    schliesseAbschluss();

    // Bereits abgegebene Bestellungen nicht erneut werten.
    if (
      phase === "fressen" ||
      phase === "gluecklich" ||
      phase === "streit"
    ) {
      bestellIndex++;
      ausgewaehlterNapf = null;
      ausgewaehltesFutter = null;

      phase = bestellIndex >= bestellungen.length
        ? "fertig"
        : "warten";
    }

    aktualisiereAnzeige();
  }

  function geheZurAuswahl() {
    if (typeof zeigeSeite !== "function") {
      return;
    }

    beimVerlassen();
    zeigeSeite("eingangsseite");
  }

  const seitenBeobachter = new MutationObserver(function () {
    if (dom.fruehstueckseite.hidden) {
      beimVerlassen();
    } else {
      beimBetreten();
    }
  });

  seitenBeobachter.observe(dom.fruehstueckseite, {
    attributes: true,
    attributeFilter: ["hidden"]
  });

  // =========================================
  // 13. BEDIENELEMENTE
  // =========================================

  dom.startFruehstueck.addEventListener("click", function () {
    if (typeof zeigeSeite !== "function") {
      console.error(
        "Frühstück: zeigeSeite() fehlt. Prüfe pfotenpause.js."
      );
      return;
    }

    zeigeSeite("fruehstueckseite");
    beimBetreten();
  });

  dom.frStart.addEventListener("click", starteSpiel);

  dom.frNeu.addEventListener("click", function () {
    bereiteTagVor(tagIndex);
    starteSpiel();
  });

  dom.frTagAuswahl.addEventListener("change", function () {
    bereiteTagVor(Number(dom.frTagAuswahl.value));
  });

  dom.frZurAuswahl.addEventListener("click", geheZurAuswahl);
  dom.frAbschlussAuswahl.addEventListener("click", geheZurAuswahl);

  dom.frNapfOptionen.addEventListener("click", waehleOption);
  dom.frFutterOptionen.addEventListener("click", waehleOption);
  dom.frServieren.addEventListener("click", servieren);

  dom.frWeiter.addEventListener("click", function () {
    const naechsterTag =
      tagIndex + 1 < TAGE.length ? tagIndex + 1 : 0;

    bereiteTagVor(naechsterTag);
    dom.frStart.focus({ preventScroll: true });
  });

  dom.frAbschluss.addEventListener("cancel", function (ereignis) {
    ereignis.preventDefault();
  });

  dom.frAbschluss.addEventListener("close", synchronisiereDialoge);

  [dom.frHintergrund, dom.frTresen].forEach(function (bild) {
    bild.addEventListener("error", function () {
      bild.hidden = true;
    });

    if (bild.complete && bild.naturalWidth === 0) {
      bild.hidden = true;
    }
  });

  dom.frTagAuswahl.replaceChildren();

  TAGE.forEach(function (_, index) {
    const option = document.createElement("option");

    option.value = String(index);
    option.textContent = `Tag ${index + 1}`;

    dom.frTagAuswahl.appendChild(option);
  });

	if (typeof ResizeObserver === "function") {
  const groessenBeobachter = new ResizeObserver(
    richteSprechblaseAus
  );

  groessenBeobachter.observe(dom.frSzene);
} else {
  window.addEventListener("resize", richteSprechblaseAus);
}


	// =========================================
	// VERBINDUNG ZUM POSITIONS-EDITOR
	// =========================================

	window.FruehstueckWerkstatt = {
	  bereit: function () {
		return bilderBereit;
	  },

	  oeffnen: function () {
		if (!bilderBereit) {
		  return false;
		}

		bereiteTagVor(tagIndex);

		positionsEditorAktiv = true;
		baueAuswahl();

		return true;
	  },

	  vorschau: function (auswahl) {
		if (!positionsEditorAktiv || !bilderBereit) {
		  return;
		}

		const katze = KATZEN.find(function (eintrag) {
		  return eintrag.id === auswahl.katze;
		});

		const napf = NAEPFE.find(function (eintrag) {
		  return eintrag.id === auswahl.napf;
		});

		const futter = FUTTER.find(function (eintrag) {
		  return eintrag.id === auswahl.futter;
		});

		const erlaubtePosen = [
		  "warten", "fressen", "gluecklich", "streiten"
		];

		if (
		  !katze ||
		  !napf ||
		  !erlaubtePosen.includes(auswahl.pose)
		) {
		  return;
		}

		stoppeReaktion();

		bestellungen = [{
		  katze: katze,
		  napf: napf,
		  futter: futter || FUTTER[0]
		}];

		bestellIndex = 0;
		richtigeBestellungen = 0;

		ausgewaehlterNapf = napf.id;
		ausgewaehltesFutter = futter ? futter.id : null;

		letzteBestellungRichtig = true;

		phase = auswahl.pose === "streiten"
		  ? "streit"
		  : auswahl.pose;

		aktualisiereAnzeige();

		dom.frZaehler.textContent = "Ausrichtungsvorschau";

		zeigeMeldung(
		  "Ausrichtungsmodus: Es läuft kein Spiel und kein Fress-Timer."
		);
	  },

	  kontext: function () {
		const bestellung = aktuelleBestellung();

		let pose = "warten";

		if (phase === "fressen") {
		  pose = "fressen";
		} else if (phase === "gluecklich") {
		  pose = "gluecklich";
		} else if (phase === "streit") {
		  pose = "streiten";
		} else if (phase === "fertig") {
		  pose = letzteBestellungRichtig
			? "gluecklich"
			: "streiten";
		}

		return {
		  katze: bestellung ? bestellung.katze.id : "coco",
		  pose: pose,
		  napf: ausgewaehlterNapf || (
			bestellung ? bestellung.napf.id : "blau"
		  ),
		  futter: ausgewaehltesFutter || "leer"
		};
	  },

	  schliessen: function () {
		positionsEditorAktiv = false;
		bereiteTagVor(tagIndex);
	  }
	};

  bereiteTagVor(0);
})();