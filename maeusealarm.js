(() => {
  "use strict";

  /* =========================================
     DATEIEN
     ========================================= */

  // Genau einmal definiert.
  // Entspricht dem Ordner auf deinem aktuellen Screenshot.
  const BILDORDNER = "bilder/mäusejagd/";
  const HINTERGRUND = "spielzimmer-handy.png";

  /*
   * fokusX / fokusY:
   * Welcher Punkt im Tierbild in der Mitte der Öffnung erscheint.
   *
   * breite:
   * Bildbreite in Prozent der Öffnungsbreite.
   * Die Bildhöhe ergibt sich automatisch proportional.
   *
   * Die Gesichtsausrichtungen sind Startwerte aus deinen Vorschauen.
   */
  const MAEUSE = [
    {
      datei: "Maus1.png",
      name: "Spielzeugmaus",
      art: "maus",
      fokusX: 45,
      fokusY: 50,
      breite: 112
    },
    {
      datei: "Maus2.png",
      name: "Spielzeugmaus",
      art: "maus",
      fokusX: 55,
      fokusY: 50,
      breite: 112
    },
    {
      datei: "Maus3.png",
      name: "Spielzeugmaus",
      art: "maus",
      fokusX: 50,
      fokusY: 50,
      breite: 110
    },
    {
      datei: "Maus6.png",
      name: "Spielzeugmaus",
      art: "maus",
      fokusX: 39,
      fokusY: 48,
      breite: 120
    }
  ];

  // Nur liegende Versteckposen.
  // Die Bildausrichtung setzt vor allem das Gesicht in die Öffnung.
  const KATZEN = [
    {
      datei: "coco-verstecken.png",
      name: "Coco",
      art: "katze",
      fokusX: 34,
      fokusY: 60,
      breite: 180
    },
    {
      datei: "loki-verstecken.png",
      name: "Loki",
      art: "katze",
      fokusX: 48,
      fokusY: 60,
      breite: 180
    },
    {
      datei: "mango-verstecken.png",
      name: "Mango",
      art: "katze",
      fokusX: 69,
      fokusY: 62,
      breite: 180
    },
    {
      datei: "mila-verstecken.png",
      name: "Mila",
      art: "katze",
      fokusX: 71,
      fokusY: 60,
      breite: 180
    },
    {
      datei: "nala-verstecken.png",
      name: "Nala",
      art: "katze",
      fokusX: 47,
      fokusY: 61,
      breite: 180
    }
  ];
  
	// Zusätzliche Sitzposen für die beiden offenen Kartons.
	// Die bisherigen liegenden Katzen bleiben unverändert.
	const SITZ_AUSRICHTUNG = {
	  Coco:  { fokusX: 62, fokusY: 30 },
	  Loki:  { fokusX: 50, fokusY: 30 },
	  Mango: { fokusX: 63, fokusY: 30 },
	  Mila:  { fokusX: 61, fokusY: 30 },
	  Nala:  { fokusX: 50, fokusY: 30 }
	};

	KATZEN.push(
	  ...KATZEN.map((katze) => ({
		...katze,
		datei: katze.datei.replace(
		  "-verstecken.png",
		  "-sitz-versteck.png"
		),
		pose: "sitzen",
		...SITZ_AUSRICHTUNG[katze.name],
		breite: 110
	  }))
	);

  /* =========================================
     VIER VERSTECKE IM HANDYBILD
     ========================================= */

  /*
   * position:
   * [links, oben, Breite, Höhe] in Prozent des vollständigen Bildes.
   *
   * Dies sind Startwerte, keine pixelgenau geprüften Konturen.
   * Alle Positionsänderungen erfolgen ausschließlich hier.
   */
const VERSTECKE = [
  {
    name: "Holzhöhle links",
    position: [13.4, 49.0, 7.8, 7.0],

    form:
      "polygon(0% 100%, 0% 45%, 7% 22%, 23% 7%, " +
      "50% 0%, 77% 7%, 93% 22%, 100% 45%, 100% 100%)",

    katzenErlaubt: true,
    katzenpose: "liegen",
	katzenOffsetY: 8,

    mausdateien: [
      "Maus1.png",
      "Maus2.png",
      "Maus3.png",
      "Maus6.png"
    ]
  },

  {
    name: "Papphöhle in der Mitte",
    position: [41.0, 54.0, 7.0, 4.5],
    form: "ellipse(49% 49% at 50% 50%)",

    katzenErlaubt: true,
    katzenpose: "liegen",

    mausdateien: [
      "Maus1.png",
      "Maus2.png",
      "Maus3.png",
      "Maus6.png"
    ]
  },

  {
    name: "Kleine Holzhöhle oben rechts",
    position: [69.0, 29.0, 6.1, 4.3],
    form: "ellipse(49% 49% at 50% 50%)",

    katzenErlaubt: false,
    mausOffsetY: 18,

    mausdateien: [
      "Maus1.png",
      "Maus2.png",
      "Maus3.png"
    ]
  },

  {
    name: "Kuscheltunnel rechts",
    position: [88.2, 68.8, 7.1, 7.2],
    form: "ellipse(49% 49% at 50% 50%)",

    katzenErlaubt: true,
    katzenpose: "liegen",
	katzenbreite: 200,

    // Alle Tunneltiere weiter nach unten setzen.
    figurOffsetY: 19.5,

    // Die bisherige Ausrichtung nach außen bleibt erhalten.
    katzenSpiegeln: [
      "mango-verstecken.png",
      "mila-verstecken.png"
    ],

    mausdateien: [
      "Maus1.png",
      "Maus2.png",
      "Maus3.png"
    ]
  },

  {
    name: "Karton vorne links",

    // Kleinerer und etwas weiter rechts liegender Sichtbereich.
    position: [13.0, 57.0, 15.5, 7.0],

    form:
      "polygon(0% 0%, 100% 0%, 100% 78%, " +
      "55% 100%, 0% 85%)",

    katzenErlaubt: true,
    katzenpose: "sitzen",

    // Katzen deutlich kleiner als bisher darstellen.
    katzenbreite: 78,
    katzenOffsetY: 8,

    // In diesem Karton erscheinen keine Mäuse.
    mausdateien: []
  },

  {
    name: "Karton rechts",

    // Engerer Sichtbereich über der Kartonöffnung.
    position: [89.0, 51.8, 11.8, 7.8],

    form:
      "polygon(0% 0%, 100% 0%, 100% 85%, " +
      "48% 100%, 0% 79%)",

    katzenErlaubt: true,
    katzenpose: "sitzen",

    katzenbreite: 100,
    katzenOffsetY: 8,

    // Auch hier ausschließlich sitzende Katzen.
    mausdateien: []
  },
  
  {
  name: "Hinter dem Blumentopf vorne links",

  // Niedrigerer Sichtbereich für einen Kopf statt des ganzen Körpers.
  position: [5.0, 75.0, 12.0, 7.5],

  // Linke Begrenzung entlang der geschätzten Topfkante.
  // Die untere Begrenzung verdeckt Brust und Pfoten.
  form:
    "polygon(30% 5%, 100% 5%, 100% 85%, " +
    "10% 85%, 15% 55%, 28% 30%)",

	katzenErlaubt: true,

  // Dieselben Bildvarianten wie bei Position 5.
  // Keine liegenden Katzen mehr an dieser Stelle.
  katzenposen: ["sitzen"],
  // Zusätzlich nur diese beiden liegenden Varianten erlauben.
	zusaetzlicheKatzendateien: [
	  "mango-verstecken.png",
	  "mila-verstecken.png"
	],

  // Kleinerer Kopf als bei der bisherigen Einstellung.
  katzenbreite: 140,
  katzenOffsetY: -5,

  // Loki hier horizontal spiegeln.
  // Nala bleibt wie an Position 5 ungespiegelt.
  katzenSpiegeln: [
    "loki-sitz-versteck.png", 
	"coco-sitz-versteck.png"
  ],
  mausdateien:[]
},

{
  name: "Auf dem Teppich",
  position: [40.0, 72.0, 12.0, 7.5],
  form: "inset(0)",

  katzenErlaubt: false,

  // Ganze Maus zeigen und am unteren Rand ausrichten.
  bodenplatz: true,
  mausbreite: 85,

  mausdateien: [
    "Maus1.png",
    "Maus2.png",
    "Maus3.png",
    "Maus6.png"
  ]
},

{
  name: "Vor dem rosa Kissen",
  position: [49.0, 58.0, 10.0, 6.5],
  form: "inset(0)",

  katzenErlaubt: false,
  bodenplatz: true,
  mausbreite: 80,

  mausdateien: [
    "Maus1.png",
    "Maus2.png",
    "Maus3.png",
    "Maus6.png"
  ]
}
];

  /* =========================================
     HTML-ELEMENTE
     ========================================= */

  const element = (id) => document.getElementById(id);

  const ui = {
    regal: element("startMaeusealarm"),
    regalBild: element("maRegalBild"),
    regalErsatz: element("maRegalErsatz"),
    seite: element("maeuseseite"),
    eingang: element("eingangsseite"),
    titel: element("maeusetitel"),
    zurueck: element("maZurAuswahl"),
    tagauswahl: element("maTagAuswahl"),
    start: element("maStart"),
    pause: element("maPause"),
    punkte: element("maPunkte"),
    zeit: element("maZeit"),
    meldung: element("maMeldung"),
    bildhinweis: element("maBildhinweis"),
    zimmer: element("maZimmer"),
    hintergrund: element("maHintergrund"),
    verstecke: element("maVerstecke"),
    pruefmodus: element("maPruefmodus"),
    dialog: element("maAbschluss"),
    dialogBild: element("maAbschlussBild"),
    dialogTitel: element("maAbschlussTitel"),
    dialogText: element("maAbschlussText"),
    weiter: element("maWeiter"),
    dialogAuswahl: element("maAbschlussAuswahl")
  };

  const fehlendeElemente = Object.entries(ui)
    .filter(([, wert]) => !wert)
    .map(([name]) => name);

  if (fehlendeElemente.length > 0) {
    console.error(
      "Mäusealarm: Die HTML-Datei passt nicht zum neuen Skript.",
      fehlendeElemente
    );
    return;
  }

  /* =========================================
     SPIELZUSTAND
     ========================================= */

  const plaetze = [];
  const bildCache = new Map();
  const bildprobleme = new Set();

  let verfuegbareMaeuse = [];
  let verfuegbareKatzen = [];
  let bilderBereit = false;

  let tag = 1;
  let punkte = 0;
  let vergangen = 0;
  let letzterZeitpunkt = 0;
  let naechstesTier = 350;
  let animationsId = 0;
  let status = "laden";
  let naechsterTag = 1;
  let letztesVersteck = null;

  function zufall(min, max) {
    return min + Math.random() * (max - min);
  }

  function auswaehlen(liste) {
    if (liste.length === 0) {
      return null;
    }

    return liste[Math.floor(Math.random() * liste.length)];
  }

  function tagesregeln(nummer) {
    if (nummer === 1) {
      return {
        ziel: 8,
        zeit: 45000,
        sichtbar: 2400,
        abstand: 650,
        gleichzeitig: 1,
        katzenanteil: 0.22
      };
    }

    if (nummer === 2) {
      return {
        ziel: 12,
        zeit: 45000,
        sichtbar: 2100,
        abstand: 600,
        gleichzeitig: 2,
        katzenanteil: 0.26
      };
    }

    return {
      ziel: Math.min(24, 15 + (nummer - 3) * 2),
      zeit: 40000,
      sichtbar: Math.max(1200, 1800 - (nummer - 3) * 80),
      abstand: Math.max(420, 550 - (nummer - 3) * 15),
      gleichzeitig: nummer >= 5 ? 3 : 2,
      katzenanteil: Math.min(0.36, 0.28 + (nummer - 3) * 0.01)
    };
  }

  /* =========================================
     BILDER LADEN
     ========================================= */

  function bildproblem(datei) {
    bildprobleme.add(datei);

    ui.bildhinweis.hidden = false;
    ui.bildhinweis.textContent =
      "Nicht geladen: " +
      [...bildprobleme].join(", ") +
      ". Prüfe diese Dateien im Ordner " +
      BILDORDNER +
      ".";

    console.warn("Mäusealarm: Bild nicht geladen:", BILDORDNER + datei);
  }

  function bildLaden(datei) {
    if (bildCache.has(datei)) {
      return bildCache.get(datei);
    }

    const versprechen = new Promise((resolve) => {
      const bild = new Image();

      bild.onload = () => {
        resolve({
          datei,
          erfolgreich: true,
          bild
        });
      };

      bild.onerror = () => {
        bildproblem(datei);

        resolve({
          datei,
          erfolgreich: false,
          bild: null
        });
      };

      bild.src = BILDORDNER + datei;
    });

    bildCache.set(datei, versprechen);
    return versprechen;
  }

  function regalbildFehlt() {
    ui.regalBild.hidden = true;
    ui.regalErsatz.hidden = false;
    bildproblem("maeusealarm-vorschau.png");
  }

  ui.regalBild.addEventListener("error", regalbildFehlt);

  if (ui.regalBild.complete && !ui.regalBild.naturalWidth) {
    regalbildFehlt();
  }

  /* =========================================
     VERSTECKE ERSTELLEN
     ========================================= */

  VERSTECKE.forEach((versteck, index) => {
    const knopf = document.createElement("button");
    knopf.type = "button";
    knopf.className = "ma-versteck";
    knopf.disabled = true;

    const [links, oben, breite, hoehe] = versteck.position;

    knopf.style.setProperty("--ma-links", `${links}%`);
    knopf.style.setProperty("--ma-oben", `${oben}%`);
    knopf.style.setProperty("--ma-breite", `${breite}%`);
    knopf.style.setProperty("--ma-hoehe", `${hoehe}%`);
    knopf.style.setProperty("--ma-form", versteck.form);

    knopf.setAttribute("aria-label", `${versteck.name}: leer`);

    const oeffnung = document.createElement("span");
    oeffnung.className = "ma-oeffnung";
    oeffnung.setAttribute("aria-hidden", "true");

    const auftauchen = document.createElement("span");
    auftauchen.className = "ma-auftauchen";

    const bild = document.createElement("img");
    bild.className = "ma-tierbild";
    bild.alt = "";
    bild.draggable = false;

    const nummer = document.createElement("span");
    nummer.className = "ma-nummer";
    nummer.textContent = String(index + 1);
    nummer.setAttribute("aria-hidden", "true");

    auftauchen.append(bild);
    oeffnung.append(auftauchen);
    knopf.append(oeffnung, nummer);
    ui.verstecke.append(knopf);

    const platz = {
      versteck,
      knopf,
      bild,
      tier: null
    };

    knopf.addEventListener("click", () => antippen(platz));

    bild.addEventListener("error", () => {
      if (!platz.tier) {
        return;
      }

      bildproblem(platz.tier.datei);
      entfernen(platz);
      anzeigen();
    });

    plaetze.push(platz);
  });

	function erlaubteMaeuse(platz) {
	  // Fehlende oder ungültige Liste bedeutet:
	  // In diesem Versteck sind keine Mäuse erlaubt.
	  const erlaubteDateien = Array.isArray(
		platz.versteck.mausdateien
	  )
		? platz.versteck.mausdateien
		: [];

	  return verfuegbareMaeuse.filter((maus) => {
		return erlaubteDateien.includes(maus.datei);
	  });
	}
  
	function erlaubteKatzen(platz) {
	  const versteck = platz.versteck;

	  if (!versteck.katzenErlaubt) {
		return [];
	  }

	  const erlaubtePosen = versteck.katzenposen ?? [
		versteck.katzenpose ?? "liegen"
	  ];

	  const zusaetzlicheDateien =
		versteck.zusaetzlicheKatzendateien ?? [];

	  return verfuegbareKatzen.filter((katze) => {
		const pose = katze.pose ?? "liegen";

		return erlaubtePosen.includes(pose) ||
		  zusaetzlicheDateien.includes(katze.datei);
	  });
	}

function tierZeigen(platz, tier, dauer) {
  const versteck = platz.versteck;
  const istKatze = tier.art === "katze";
  const pose = tier.pose ?? "liegen";

  platz.tier = {
    ...tier,
    verschwindet: vergangen + dauer
  };

  // Reihenfolge:
  // Größe für die konkrete Pose,
  // allgemeine Versteckgröße,
  // Standardgröße des Tierbildes.
  const bildbreite = istKatze
    ? (
        versteck.katzenbreiteNachPose?.[pose] ??
        versteck.katzenbreite ??
        tier.breite
      )
    : (
        versteck.mausbreite ??
        tier.breite
      );

  platz.bild.style.setProperty(
    "--ma-tierbreite",
    `${bildbreite}%`
  );

  const spiegeln =
    istKatze &&
    versteck.katzenSpiegeln?.includes(tier.datei) === true;

  if (versteck.bodenplatz === true && !istKatze) {
    // Offene Bodenstellen:
    // das vollständige Bild mittig über dem unteren Rand anzeigen.
    // Kein Gesichtsfokus, damit Körper und Schwanz sichtbar bleiben.
    platz.bild.style.top = "100%";
    platz.bild.style.transformOrigin = "50% 100%";
    platz.bild.style.transform =
      "translate(-50%, -100%)";
  } else {
    // Verstecke:
    // vorhandene Gesichtsausrichtung und Höhenversätze beibehalten.
    const allgemeinerVersatz =
      versteck.figurOffsetY ?? 0;

    const tierVersatz = istKatze
      ? (versteck.katzenOffsetY ?? 0)
      : (versteck.mausOffsetY ?? 0);

    platz.bild.style.top =
      `${50 + allgemeinerVersatz + tierVersatz}%`;

    platz.bild.style.transformOrigin =
      `${tier.fokusX}% ${tier.fokusY}%`;

    platz.bild.style.transform =
      `translate(-${tier.fokusX}%, -${tier.fokusY}%) ` +
      `scaleX(${spiegeln ? -1 : 1})`;
  }

  platz.bild.src = BILDORDNER + tier.datei;

  platz.knopf.setAttribute(
    "aria-label",
    istKatze
      ? `${versteck.name}: ${tier.name}, nicht antippen`
      : `${versteck.name}: Spielzeugmaus fangen`
  );

  platz.knopf.classList.remove("ma-sichtbar");

  // Anfangszustand der kurzen Auftauchbewegung übernehmen.
  void platz.knopf.offsetWidth;

  platz.knopf.classList.add("ma-sichtbar");
  platz.knopf.disabled = status !== "spielen";
}

  function entfernen(platz) {
    platz.tier = null;
    platz.knopf.disabled = true;
    platz.knopf.classList.remove("ma-sichtbar");
    platz.knopf.setAttribute(
      "aria-label",
      `${platz.versteck.name}: leer`
    );
  }

  function alleEntfernen() {
    plaetze.forEach(entfernen);
  }

  /* =========================================
     ANZEIGEN UND TAGE
     ========================================= */

  function tageErgaenzen(bis) {
    while (ui.tagauswahl.options.length < bis) {
      const nummer = ui.tagauswahl.options.length + 1;
      const option = document.createElement("option");

      option.value = String(nummer);
      option.textContent = `Tag ${nummer}`;

      ui.tagauswahl.append(option);
    }
  }

  function anzeigen() {
    const regeln = tagesregeln(tag);
    const rest = Math.max(0, regeln.zeit - vergangen);

    ui.punkte.textContent = `${punkte} / ${regeln.ziel}`;
    ui.zeit.textContent = `${Math.ceil(rest / 1000)} s`;

    ui.start.disabled = !bilderBereit || status === "spielen";

    ui.start.textContent = !bilderBereit
      ? "Bilder noch nicht bereit"
      : status === "pause"
        ? "Fortsetzen →"
        : "Tag starten →";

    ui.pause.disabled =
      status !== "spielen" && status !== "pause";

    ui.pause.textContent =
      status === "pause" ? "Fortsetzen" : "Pause";

    ui.pause.setAttribute(
      "aria-pressed",
      String(status === "pause")
    );

    ui.pruefmodus.disabled = !bilderBereit;

    plaetze.forEach((platz) => {
      platz.knopf.disabled =
        status !== "spielen" || !platz.tier;
    });
  }

  function animationStoppen() {
    cancelAnimationFrame(animationsId);
    animationsId = 0;
  }

  function tagVorbereiten(nummer) {
    animationStoppen();
    alleEntfernen();

    tag = Math.max(1, Math.floor(nummer));
    punkte = 0;
    vergangen = 0;
    naechstesTier = 350;
	letztesVersteck = null;
    status = bilderBereit ? "bereit" : "laden";

    ui.pruefmodus.value = "aus";
    ui.zimmer.classList.remove("ma-pruefen");

    tageErgaenzen(Math.max(10, tag));
    ui.tagauswahl.value = String(tag);

    const regeln = tagesregeln(tag);

    ui.meldung.textContent = bilderBereit
      ? `Tag ${tag}: Sammle ${regeln.ziel} Punkte ` +
        `in ${regeln.zeit / 1000} Sekunden.`
      : "Die Bilder werden geladen. Prüfe gegebenenfalls den Bildhinweis.";

    anzeigen();
  }

  function starten() {
    if (!bilderBereit || status === "spielen") {
      return;
    }

    if (status !== "pause") {
      tagVorbereiten(tag);
    }

    ui.pruefmodus.value = "aus";
    ui.zimmer.classList.remove("ma-pruefen");

    status = "spielen";
    letzterZeitpunkt = performance.now();

    ui.meldung.textContent =
      "Fange die Spielzeugmäuse. Lass die Katzen in Ruhe.";

    anzeigen();
    animationsId = requestAnimationFrame(spielschritt);
  }

  function pausieren(text = "Das Spiel ist pausiert.") {
    if (status !== "spielen") {
      return;
    }

    const jetzt = performance.now();
    vergangen += Math.max(0, jetzt - letzterZeitpunkt);
    letzterZeitpunkt = jetzt;

    if (vergangen >= tagesregeln(tag).zeit) {
      abschliessen(false);
      return;
    }

    animationStoppen();
    status = "pause";
    ui.meldung.textContent = text;

    anzeigen();
  }

  /* =========================================
     SPIELABLAUF
     ========================================= */

function tierAuftauchen() {
  const regeln = tagesregeln(tag);
  const aktive = plaetze.filter((platz) => platz.tier);

  if (aktive.length >= regeln.gleichzeitig) {
    return;
  }

  const kandidaten = plaetze
    .filter((platz) => {
      // Kein aktives und kein direkt zuvor verwendetes Versteck.
      return !platz.tier && platz !== letztesVersteck;
    })
    .map((platz) => ({
      platz,
      maeuse: erlaubteMaeuse(platz),
      katzen: erlaubteKatzen(platz)
    }))
    .filter((kandidat) => {
      // Auch reine Katzenverstecke dürfen teilnehmen.
      return kandidat.maeuse.length > 0 ||
        kandidat.katzen.length > 0;
    });

  const kandidat = auswaehlen(kandidaten);

  if (!kandidat) {
    // Nicht auf das vorige Versteck zurückfallen.
    // Stattdessen bis zum nächsten Auftauchversuch warten.
    return;
  }

  const { platz, maeuse, katzen } = kandidat;

  let tier = null;

  if (maeuse.length === 0) {
    // Kartons: ausschließlich passende sitzende Katzen.
    tier = auswaehlen(katzen);
  } else if (katzen.length === 0) {
    // Beispielsweise Position 3: ausschließlich Mäuse.
    tier = auswaehlen(maeuse);
  } else {
    // Gemischte Verstecke behalten ihre bisherige Zufallsauswahl.
    const istKatze =
      Math.random() < regeln.katzenanteil;

    tier = istKatze
      ? auswaehlen(katzen)
      : auswaehlen(maeuse);
  }

  if (!tier) {
    return;
  }

  tierZeigen(
    platz,
    tier,
    regeln.sichtbar * zufall(0.9, 1.1)
  );

  // Erst nach dem tatsächlichen Anzeigen merken.
  letztesVersteck = platz;
}

  function spielschritt(zeitpunkt) {
    if (status !== "spielen") {
      return;
    }

    vergangen += Math.max(0, zeitpunkt - letzterZeitpunkt);
    letzterZeitpunkt = zeitpunkt;

    const regeln = tagesregeln(tag);

    if (vergangen >= regeln.zeit) {
      abschliessen(false);
      return;
    }

    plaetze.forEach((platz) => {
      if (
        platz.tier &&
        platz.tier.verschwindet <= vergangen
      ) {
        entfernen(platz);
      }
    });

    if (vergangen >= naechstesTier) {
      tierAuftauchen();

      naechstesTier =
        vergangen + regeln.abstand * zufall(0.9, 1.1);
    }

    anzeigen();
    animationsId = requestAnimationFrame(spielschritt);
  }

  function antippen(platz) {
    if (status !== "spielen" || !platz.tier) {
      return;
    }

    const jetzt = performance.now();
    vergangen += Math.max(0, jetzt - letzterZeitpunkt);
    letzterZeitpunkt = jetzt;

    const regeln = tagesregeln(tag);

    if (vergangen >= regeln.zeit) {
      abschliessen(false);
      return;
    }

    if (platz.tier.verschwindet <= vergangen) {
      entfernen(platz);
      return;
    }

    const tier = platz.tier;

    if (tier.art === "maus") {
      punkte += 1;
      ui.meldung.textContent = "Spielzeugmaus gefangen! +1 Punkt.";
    } else {
      punkte = Math.max(0, punkte - 1);
      ui.meldung.textContent =
        `${tier.name} möchte nicht gestört werden. −1 Punkt.`;
    }

    entfernen(platz);
    anzeigen();

    if (punkte >= regeln.ziel) {
      abschliessen(true);
    }
  }

  /* =========================================
     PRÜFMODUS OHNE ZEITLIMIT
     ========================================= */

function pruefmodusAnzeigen() {
  const modus = ui.pruefmodus.value;

  if (modus === "aus") {
    tagVorbereiten(tag);
    return;
  }

  animationStoppen();
  alleEntfernen();

  status = "pruefen";
  punkte = 0;
  vergangen = 0;

  ui.zimmer.classList.add("ma-pruefen");

  plaetze.forEach((platz, index) => {
    const tiere = modus === "katze"
      ? erlaubteKatzen(platz)
      : erlaubteMaeuse(platz);

    // Kein Ersatz durch die andere Tierart:
    // Mäusevorschau: Kartons bleiben leer.
    // Katzenvorschau: Position 3 bleibt leer.
    if (tiere.length === 0) {
      return;
    }

    const tier = tiere[index % tiere.length];
    tierZeigen(platz, tier, Infinity);
  });

ui.meldung.textContent = modus === "katze"
  ? "Katzenvorschau: Katzen in Höhlen, Kartons und hinter dem Blumentopf. " +
    "Position 3 sowie die Bodenstellen 8 und 9 bleiben leer."
  : "Mäusevorschau: Mäuse in den erlaubten Höhlen und auf den Bodenstellen. " +
    "Kartons und Blumentopf bleiben leer.";

  anzeigen();
}

  /* =========================================
     ABSCHLUSS UND NAVIGATION
     ========================================= */

  function dialogStatusAktualisieren() {
    document.body.classList.toggle(
      "dialog-offen",
      Boolean(document.querySelector("dialog[open]"))
    );
  }

  function abschliessen(erfolg) {
    animationStoppen();
    alleEntfernen();

    status = "fertig";
    naechsterTag = erfolg ? tag + 1 : tag;

    const regeln = tagesregeln(tag);

    ui.dialog.classList.toggle(
      "ma-nicht-geschafft",
      !erfolg
    );

    ui.dialogTitel.textContent = erfolg
      ? `Tag ${tag} geschafft!`
      : "Die Mäuse waren schneller!";

    ui.dialogText.textContent = erfolg
      ? `Du hast ${punkte} Punkte gesammelt. ` +
        `Weiter geht es mit Tag ${tag + 1}.`
      : `Du hast ${punkte} von ${regeln.ziel} Punkten gesammelt. ` +
        "Versuche diesen Tag noch einmal.";

    ui.weiter.textContent = erfolg
      ? "Weiter →"
      : "Nochmal versuchen ↻";

    ui.dialogBild.hidden = true;

    if (erfolg && verfuegbareKatzen.length > 0) {
      const katze = auswaehlen(verfuegbareKatzen);
      ui.dialogBild.src = BILDORDNER + katze.datei;
      ui.dialogBild.alt = katze.name;
      ui.dialogBild.hidden = false;
    }

    ui.meldung.textContent = ui.dialogTitel.textContent;
    anzeigen();

    if (!ui.dialog.open) {
      ui.dialog.showModal();
    }

    dialogStatusAktualisieren();
  }

  function spielOeffnen() {
    document.querySelectorAll(".app > section").forEach((seite) => {
      seite.hidden = true;
    });

    ui.seite.hidden = false;
    tagVorbereiten(tag);

    ui.titel.focus({ preventScroll: true });
    ui.seite.scrollIntoView({ block: "start" });
  }

  function zurSpielauswahl() {
    animationStoppen();
    alleEntfernen();

    if (ui.dialog.open) {
      ui.dialog.close();
    }

    tagVorbereiten(tag);

    ui.seite.hidden = true;
    ui.eingang.hidden = false;

    dialogStatusAktualisieren();
    element("eingangstitel")?.focus({ preventScroll: true });
  }

  // Navigation ist unabhängig davon eingerichtet,
  // ob alle Tierbilder bereits geladen sind.
  ui.regal.addEventListener("click", spielOeffnen);
  ui.zurueck.addEventListener("click", zurSpielauswahl);
  ui.dialogAuswahl.addEventListener("click", zurSpielauswahl);

  ui.start.addEventListener("click", starten);

  ui.pause.addEventListener("click", () => {
    if (status === "pause") {
      starten();
    } else {
      pausieren();
    }
  });

  ui.tagauswahl.addEventListener("change", () => {
    const nummer = Number(ui.tagauswahl.value);

    if (Number.isInteger(nummer) && nummer >= 1) {
      tagVorbereiten(nummer);
    }
  });

  ui.pruefmodus.addEventListener("change", pruefmodusAnzeigen);

  ui.weiter.addEventListener("click", () => {
    ui.dialog.close();
    tagVorbereiten(naechsterTag);
    starten();
  });

  ui.dialog.addEventListener("close", dialogStatusAktualisieren);

  ui.dialogBild.addEventListener("error", () => {
    ui.dialogBild.hidden = true;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && status === "spielen") {
      pausieren("Das Spiel ist pausiert, weil du den Tab verlassen hast.");
    }
  });

  /* =========================================
     INITIALISIERUNG
     ========================================= */

  tageErgaenzen(10);
  tagVorbereiten(1);

  const dateien = [
    HINTERGRUND,
    ...MAEUSE.map((maus) => maus.datei),
    ...KATZEN.map((katze) => katze.datei)
  ];

  Promise.all(dateien.map(bildLaden))
    .then((ergebnisse) => {
      const erfolgreich = new Set(
        ergebnisse
          .filter((ergebnis) => ergebnis.erfolgreich)
          .map((ergebnis) => ergebnis.datei)
      );

      verfuegbareMaeuse = MAEUSE.filter((maus) => {
        return erfolgreich.has(maus.datei);
      });

      verfuegbareKatzen = KATZEN.filter((katze) => {
        return erfolgreich.has(katze.datei);
      });

      bilderBereit =
        erfolgreich.has(HINTERGRUND) &&
        verfuegbareMaeuse.length > 0 &&
        verfuegbareKatzen.length > 0;

      tagVorbereiten(tag);

      if (!bilderBereit) {
        ui.meldung.textContent =
          "Für den Start fehlen Bilder. " +
          "Benötigt werden der Hintergrund, " +
          "mindestens eine Maus und mindestens eine Katze.";
      }
    })
    .catch((fehler) => {
      console.error("Mäusealarm: Fehler beim Vorbereiten.", fehler);

      ui.meldung.textContent =
        "Die Vorbereitung wurde unterbrochen. " +
        "Die Browserkonsole zeigt den Fehler.";
    });
})();