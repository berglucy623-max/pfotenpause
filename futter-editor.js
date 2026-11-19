"use strict";

(function () {
  // false: Editor ausblenden; gespeichertes Layout bleibt wirksam.
  const EDITOR_ANZEIGEN = false;

  const api = window.FruehstueckWerkstatt;
  const szene = document.getElementById("frSzene");
  const seite = document.getElementById("fruehstueckseite");

  if (!api || !szene || !seite) {
    console.error(
      "Frühstück-Editor: Die Verbindung in futter.js fehlt."
    );
    return;
  }

  // =========================================
  // 1. GESPEICHERTE EINSTELLUNGEN PRÜFEN
  // =========================================

  const daten = {};
  const sitzungsbeginn = new Map();

  function kopie(wert) {
    return JSON.parse(JSON.stringify(wert));
  }

  function begrenze(wert, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, wert));
  }

  function runde(wert) {
    return Math.round(wert * 100) / 100;
  }

  const vorhandeneDaten = window.FRUEHSTUECK_LAYOUT;

  if (
    vorhandeneDaten &&
    typeof vorhandeneDaten === "object" &&
    !Array.isArray(vorhandeneDaten)
  ) {
    Object.entries(vorhandeneDaten).forEach(function ([key, wert]) {
      if (
        !/^[a-z0-9äöü:_-]{1,150}$/.test(key) ||
        !wert ||
        typeof wert !== "object" ||
        !["x", "y", "w", "h", "a"].every(function (feld) {
          return Number.isFinite(wert[feld]);
        }) ||
        wert.w <= 0 ||
        wert.h <= 0
      ) {
        return;
      }

      daten[key] = {
        x: begrenze(wert.x, -200, 200),
        y: begrenze(wert.y, -200, 200),
        w: begrenze(wert.w, 0.2, 300),
        h: begrenze(wert.h, 0.2, 300),
        a: begrenze(wert.a, 0, 100),
        spiegeln: wert.spiegeln === true
      };
    });
  }

  /*
   * Ein einziges aktualisiertes Stylesheet.
   * Keine wiederholten Korrekturblöcke am Dateiende.
   */
  const layoutStil = document.createElement("style");
  layoutStil.id = "frEditorLayout";
  document.head.appendChild(layoutStil);

  // =========================================
  // 2. EDITOR-OBERFLÄCHE
  // =========================================

  const editor = document.createElement("details");
  editor.className = "fr-editor";
  editor.hidden = !EDITOR_ANZEIGEN;

  editor.innerHTML = `
    <summary>Alle Elemente manuell ausrichten</summary>

    <p>
      Beim Öffnen wird der aktuelle Tag zurückgesetzt.
      Die Vorschau bleibt stehen, bis du sie änderst.
    </p>

    <div class="fr-ed-vorschau">
      <label>
        Katze
        <select data-ed="katze">
          <option value="coco">Coco</option>
          <option value="loki">Loki</option>
          <option value="mango">Mango</option>
          <option value="mila">Mila</option>
          <option value="nala">Nala</option>
        </select>
      </label>

      <label>
        Pose
        <select data-ed="pose">
          <option value="warten">Wartend</option>
          <option value="fressen">Fressend</option>
          <option value="gluecklich">Glücklich</option>
          <option value="streiten">Streitend</option>
        </select>
      </label>

      <label>
        Napffarbe
        <select data-ed="napf">
          <option value="blau">Blau</option>
          <option value="rosa">Rosa</option>
          <option value="grün">Grün</option>
          <option value="gelb">Gelb</option>
          <option value="lila">Lila</option>
        </select>
      </label>

      <label>
        Futter
        <select data-ed="futter">
          <option value="fische">Fische</option>
          <option value="herzen">Herzen</option>
          <option value="dose1">Dose 1</option>
          <option value="dose2">Dose 2</option>
          <option value="leer">Leerer Napf</option>
        </select>
      </label>
    </div>

    <label>
      Element auswählen
      <select data-ed="element"></select>
    </label>

    <p class="fr-ed-hinweis" data-ed="bezug"></p>

    <div class="fr-ed-werte">
      <label>
        Links (%)
        <input data-feld="x" type="number"
          min="-200" max="200" step="0.1">
      </label>

      <label>
        Unten (%)
        <input data-feld="y" type="number"
          min="-200" max="200" step="0.1">
      </label>

      <label>
        Breite (%)
        <input data-feld="w" type="number"
          min="0.2" max="300" step="0.1">
      </label>

      <label>
        Höhe (%)
        <input data-feld="h" type="number"
          min="0.2" max="300" step="0.1">
      </label>

      <label>
        Sichtbarkeit (%)
        <input data-feld="a" type="number"
          min="0" max="100" step="1">
      </label>
    </div>

    <label class="fr-ed-checkbox">
      <input data-ed="proportionen" type="checkbox" checked>
      Beim Vergrößern die Proportionen beibehalten
    </label>

    <label class="fr-ed-checkbox">
      <input data-ed="spiegeln" type="checkbox">
      Ausgewähltes Element horizontal spiegeln
    </label>

    <p>
      Ziehe die blaue Markierung zum Verschieben.
      Ziehe ihre Ecke unten rechts zum Vergrößern.
      Größere Unten-Werte verschieben nach oben.
    </p>

    <div class="fr-ed-aktionen">
      <button data-ed="reset" class="knopf" type="button">
        Element zurücksetzen
      </button>

      <button data-ed="download" class="knopf primaer" type="button">
        Layout herunterladen
      </button>
    </div>

    <p>
      Die Änderungen gelten zunächst nur in dieser Sitzung.
      Ersetze anschließend futter-layout.js durch die
      heruntergeladene Datei oder durch den folgenden Text.
    </p>

    <textarea
      data-ed="ausgabe"
      class="fr-ed-ausgabe"
      readonly
      spellcheck="false"
      aria-label="Layout-Einstellungen zum Kopieren"
    ></textarea>

    <p data-ed="status" role="status"></p>
  `;

  szene.after(editor);

  const ui = {};

  editor.querySelectorAll("[data-ed]").forEach(function (element) {
    ui[element.dataset.ed] = element;
  });

  const eingaben = {};

  editor.querySelectorAll("[data-feld]").forEach(function (element) {
    eingaben[element.dataset.feld] = element;
  });

  const markierung = document.createElement("div");
  markierung.className = "fr-ed-markierung";
  markierung.hidden = true;

  const ecke = document.createElement("span");
  ecke.className = "fr-ed-groesse";
  ecke.textContent = "↘";

  markierung.appendChild(ecke);
  szene.appendChild(markierung);

  let aktiv = false;
  let elemente = [];
  let ausgewaehlteRolle = "katze";
  let renderAngefordert = false;
  let ziehvorgang = null;

  // =========================================
  // 3. ALLE SZENENELEMENTE REGISTRIEREN
  // =========================================

  function registriereElemente() {
    const kontext = api.kontext();
    const liste = [];

    function add(key, name, element, bezug, rolle = key) {
      if (!element || !bezug) {
        return;
      }

      element.dataset.frEdit = key;

      liste.push({
        key: key,
        name: name,
        element: element,
        bezug: bezug,
        rolle: rolle
      });
    }

    const id = function (name) {
      return document.getElementById(name);
    };

    const leiste = szene.querySelector(".fr-leiste");
    const auswahl = szene.querySelector(".fr-auswahlbereiche");
    const servierbereich = szene.querySelector(".fr-servierbereich");
    const vorschau = id("frVorschau");

    add("hintergrund", "Hintergrundbild", id("frHintergrund"), szene);
    add("tresen", "Tresen", id("frTresen"), szene);
    add("leiste", "Seitenleiste – gesamter Bereich", leiste, szene);

    add(
      "auswahlbereich",
      "Seitenleiste – Auswahlbereich",
      auswahl,
      leiste
    );

    add(
      "servierbereich",
      "Seitenleiste – Vorschau und Servieren",
      servierbereich,
      leiste
    );

    add(
      "vorschau",
      "Zubereitung – Vorschaufläche",
      vorschau,
      servierbereich
    );

    add(
      "servieren",
      "Servieren-Button",
      id("frServieren"),
      servierbereich
    );

    add(
      `vorschaubild:${kontext.napf}:${kontext.futter}`,
      "Zubereitung – aktuelles Napfbild",
      vorschau ? vorschau.querySelector(".fr-bild") : null,
      vorschau,
      "vorschaubild"
    );

    ["napf", "futter"].forEach(function (art) {
      const grid = id(
        art === "napf" ? "frNapfOptionen" : "frFutterOptionen"
      );

      if (!grid) {
        return;
      }

      const gruppe = grid.closest("fieldset");

      add(
        `gruppe:${art}`,
        art === "napf" ? "Napfauswahl – gesamte Gruppe" : "Futterauswahl – gesamte Gruppe",
        gruppe,
        auswahl
      );

      add(
        `ueberschrift:${art}`,
        art === "napf" ? "Beschriftung „1. Napf“" : "Beschriftung „2. Futter“",
        gruppe ? gruppe.querySelector("legend") : null,
        gruppe
      );

      add(
        `raster:${art}`,
        art === "napf" ? "Napfauswahl – Rechteckanordnung" : "Futterauswahl – Rechteckanordnung",
        grid,
        gruppe
      );

      grid.querySelectorAll("button[data-id]").forEach(function (knopf) {
        const key = `${art}:${knopf.dataset.id}`;
        const text = knopf.lastElementChild;
        const name = text ? text.textContent : knopf.dataset.id;

        add(
          `wahl:${key}`,
          `${name} – Auswahlrechteck`,
          knopf,
          grid
        );

        add(
          `wahlbild:${key}`,
          `${name} – Bild im Auswahlrechteck`,
          knopf.querySelector(".fr-bild"),
          knopf
        );

        add(
          `wahltext:${key}`,
          `${name} – Beschriftung`,
          text,
          knopf
        );
      });
    });

    add(
      `katze:${kontext.katze}:${kontext.pose}`,
      `Katze – ${kontext.katze}, ${kontext.pose}`,
      id("frKatze"),
      szene,
      "katze"
    );

    add(
      `fressnapf:${kontext.katze}`,
      `Napfposition beim Fressen – ${kontext.katze}`,
      id("frNapf"),
      szene,
      "fressnapf"
    );

    const fressnapf = id("frNapf");

    add(
      `fressbild:${kontext.katze}:${kontext.napf}:${kontext.futter}`,
      "Fressnapf – aktuelles Bild im Napfrahmen",
      fressnapf ? fressnapf.querySelector(".fr-bild") : null,
      fressnapf,
      "fressbild"
    );

    const blase = id("frBlase");
    const wunschbilder = id("frWunschbilder");

    add(
      `blase:${kontext.katze}`,
      `Sprechblase – ${kontext.katze}`,
      blase,
      szene,
      "blase"
    );

    add("blasenname", "Sprechblase – Katzenname", id("frKatzenname"), blase);
    add("blasentext", "Sprechblase – Wunschtext", id("frWunsch"), blase);
    add("blasenbilder", "Sprechblase – Bildgruppe", wunschbilder, blase);

    if (wunschbilder) {
      const bilder = wunschbilder.querySelectorAll(".fr-bild");

      add("blasennapf", "Sprechblase – Napfbild", bilder[0], wunschbilder);
      add("blasenfutter", "Sprechblase – Futterbild", bilder[1], wunschbilder);

      add(
        "blasenplus",
        "Sprechblase – Pluszeichen",
        wunschbilder.querySelector("span:not(.fr-bild)"),
        wunschbilder
      );
    }

    return liste;
  }

  // =========================================
  // 4. POSITIONEN MESSEN
  // =========================================

  function sichtbar(eintrag) {
    return (
      eintrag.element.getClientRects().length > 0 &&
      eintrag.element.getBoundingClientRect().width > 0 &&
      eintrag.element.getBoundingClientRect().height > 0
    );
  }

  function bezugsmasse(element) {
    const rechteck = element.getBoundingClientRect();

    const faktorX = element.offsetWidth > 0
      ? rechteck.width / element.offsetWidth
      : 1;

    const faktorY = element.offsetHeight > 0
      ? rechteck.height / element.offsetHeight
      : 1;

    return {
      rechteck: rechteck,
      faktorX: faktorX || 1,
      faktorY: faktorY || 1,
      breite: element.clientWidth,
      hoehe: element.clientHeight
    };
  }

  function messe(eintrag) {
    const rechteck = eintrag.element.getBoundingClientRect();
    const bezug = eintrag.bezug;
    const masse = bezugsmasse(bezug);
    const stil = getComputedStyle(eintrag.element);

    if (masse.breite <= 0 || masse.hoehe <= 0) {
      return null;
    }

    const links =
      (rechteck.left - masse.rechteck.left) / masse.faktorX -
      bezug.clientLeft +
      bezug.scrollLeft;

    const unterkante =
      (rechteck.bottom - masse.rechteck.top) / masse.faktorY -
      bezug.clientTop +
      bezug.scrollTop;

    return {
      x: runde(100 * links / masse.breite),
      y: runde(100 * (masse.hoehe - unterkante) / masse.hoehe),
      w: runde(100 * rechteck.width / masse.faktorX / masse.breite),
      h: runde(100 * rechteck.height / masse.faktorY / masse.hoehe),
      a: runde(Number.parseFloat(stil.opacity) * 100),
      spiegeln: /^matrix\(\s*-/.test(stil.transform)
    };
  }

  // =========================================
  // 5. LAYOUT ANWENDEN UND EXPORTIEREN
  // =========================================

  function exportText() {
    return (
      '"use strict";\n\n' +
      "window.FRUEHSTUECK_LAYOUT = " +
      JSON.stringify(daten, null, 2) +
      ";\n"
    );
  }

  function schreibeLayout() {
    layoutStil.textContent = Object.entries(daten).map(
      function ([key, wert]) {
        return `
          #frSzene [data-fr-edit="${key}"] {
            position: absolute !important;
            top: auto !important;
            right: auto !important;
            left: ${wert.x}% !important;
            bottom: ${wert.y}% !important;
            width: ${wert.w}% !important;
            height: ${wert.h}% !important;
            min-width: 0 !important;
            min-height: 0 !important;
            max-width: none !important;
            max-height: none !important;
            margin: 0 !important;
            opacity: ${wert.a / 100} !important;
            transform: ${wert.spiegeln ? "scaleX(-1)" : "none"} !important;
          }
        `;
      }
    ).join("\n");

    ui.ausgabe.value = exportText();
    aktualisiereMarkierung();
  }

  function gewaehlt() {
    return elemente.find(function (eintrag) {
      return eintrag.key === ui.element.value;
    });
  }

  function aktualisiereEingaben() {
    const eintrag = gewaehlt();

    if (!eintrag || !daten[eintrag.key]) {
      markierung.hidden = true;
      return;
    }

    const wert = daten[eintrag.key];

    Object.entries(eingaben).forEach(function ([feld, eingabe]) {
      eingabe.value = String(runde(wert[feld]));
    });

    ui.spiegeln.checked = wert.spiegeln;

    const bezugName =
      eintrag.bezug === szene
        ? "gesamtes Zimmer"
        : eintrag.bezug.dataset.frEdit || "übergeordneter Bereich";

    ui.bezug.textContent =
      `Bezug: ${bezugName}. ` +
      "Die Zahlen beziehen sich auf diesen Bereich.";

    aktualisiereMarkierung();
  }

  function aktualisiereMarkierung() {
    const eintrag = gewaehlt();

    if (!aktiv || !eintrag || !sichtbar(eintrag)) {
      markierung.hidden = true;
      return;
    }

    const rechteck = eintrag.element.getBoundingClientRect();
    const masse = bezugsmasse(szene);

    markierung.hidden = false;

    markierung.style.left =
      `${(rechteck.left - masse.rechteck.left) / masse.faktorX - szene.clientLeft}px`;

    markierung.style.top =
      `${(rechteck.top - masse.rechteck.top) / masse.faktorY - szene.clientTop}px`;

    markierung.style.width =
      `${rechteck.width / masse.faktorX}px`;

    markierung.style.height =
      `${rechteck.height / masse.faktorY}px`;
  }

  function aktualisieren() {
    elemente = registriereElemente();

    if (!aktiv || seite.hidden) {
      markierung.hidden = true;
      return;
    }

    elemente = elemente.filter(sichtbar);

    /*
     * Erst sämtliche Ausgangsflächen messen, danach anwenden.
     * So bleiben die verschachtelten Gruppen beim Übergang
     * auf frei positionierbare Flächen zunächst zusammen.
     */
    elemente.forEach(function (eintrag) {
      if (!daten[eintrag.key]) {
        const gemessen = messe(eintrag);

        if (gemessen) {
          daten[eintrag.key] = gemessen;
        }
      }

      if (
        daten[eintrag.key] &&
        !sitzungsbeginn.has(eintrag.key)
      ) {
        sitzungsbeginn.set(
          eintrag.key,
          kopie(daten[eintrag.key])
        );
      }
    });

    const bisherigeAuswahl = ui.element.value;
    ui.element.replaceChildren();

    elemente.forEach(function (eintrag) {
      const option = document.createElement("option");
      option.value = eintrag.key;
      option.textContent = eintrag.name;
      ui.element.appendChild(option);
    });

    const ziel =
      elemente.find(function (eintrag) {
        return eintrag.key === bisherigeAuswahl;
      }) ||
      elemente.find(function (eintrag) {
        return eintrag.rolle === ausgewaehlteRolle;
      }) ||
      elemente[0];

    if (ziel) {
      ui.element.value = ziel.key;
    }

    schreibeLayout();
    aktualisiereEingaben();
  }

  function planeAktualisierung() {
    if (renderAngefordert) {
      return;
    }

    renderAngefordert = true;

    requestAnimationFrame(function () {
      renderAngefordert = false;
      aktualisieren();
    });
  }

  // =========================================
  // 6. VORSCHAU UND EDITOR ÖFFNEN
  // =========================================

  function zeigeVorschau() {
    if (!aktiv) {
      return;
    }

    api.vorschau({
      katze: ui.katze.value,
      pose: ui.pose.value,
      napf: ui.napf.value,
      futter: ui.futter.value
    });

    planeAktualisierung();
  }

  editor.addEventListener("toggle", function () {
    if (editor.open && !aktiv) {
      if (!api.oeffnen()) {
        ui.status.textContent =
          "Öffne das Frühstücksspiel und warte, bis die Bilder geladen sind.";

        editor.open = false;
        return;
      }

      aktiv = true;
      sitzungsbeginn.clear();

      ui.status.textContent =
        "Vorschau aktiv. Änderungen anschließend exportieren.";

      zeigeVorschau();
    } else if (!editor.open && aktiv) {
      aktiv = false;
      markierung.hidden = true;
      api.schliessen();
    }
  });

  ["katze", "pose", "napf", "futter"].forEach(function (name) {
    ui[name].addEventListener("change", zeigeVorschau);
  });

  ui.element.addEventListener("change", function () {
    const eintrag = gewaehlt();

    if (eintrag) {
      ausgewaehlteRolle = eintrag.rolle;
    }

    aktualisiereEingaben();
  });

  // =========================================
  // 7. ZAHLENFELDER
  // =========================================

  Object.entries(eingaben).forEach(function ([feld, eingabe]) {
    eingabe.addEventListener("input", function () {
      const eintrag = gewaehlt();

      if (!eintrag || eingabe.value.trim() === "") {
        return;
      }

      const zahl = Number(eingabe.value);

      if (!Number.isFinite(zahl)) {
        return;
      }

      const wert = daten[eintrag.key];

      const minimum = feld === "w" || feld === "h"
        ? 0.2
        : feld === "a" ? 0 : -200;

      const maximum = feld === "w" || feld === "h"
        ? 300
        : feld === "a" ? 100 : 200;

      const neuerWert = begrenze(zahl, minimum, maximum);

      if (
        ui.proportionen.checked &&
        (feld === "w" || feld === "h")
      ) {
        const anderesFeld = feld === "w" ? "h" : "w";
        const faktor = neuerWert / wert[feld];

        wert[anderesFeld] = begrenze(
          wert[anderesFeld] * faktor,
          0.2,
          300
        );

        eingaben[anderesFeld].value =
          String(runde(wert[anderesFeld]));
      }

      wert[feld] = neuerWert;

      schreibeLayout();
    });
  });

  ui.spiegeln.addEventListener("change", function () {
    const eintrag = gewaehlt();

    if (!eintrag) {
      return;
    }

    daten[eintrag.key].spiegeln = ui.spiegeln.checked;
    schreibeLayout();
  });

  // =========================================
  // 8. ZIEHEN UND VERGRÖSSERN
  // =========================================

  markierung.addEventListener("pointerdown", function (ereignis) {
    if (
      !aktiv ||
      !ereignis.isPrimary ||
      ereignis.button !== 0
    ) {
      return;
    }

    const eintrag = gewaehlt();

    if (!eintrag) {
      return;
    }

    const rechteck = markierung.getBoundingClientRect();

    const groesseAendern =
      ereignis.clientX >= rechteck.right - 24 &&
      ereignis.clientY >= rechteck.bottom - 24;

    ziehvorgang = {
      pointerId: ereignis.pointerId,
      key: eintrag.key,
      eintrag: eintrag,
      startX: ereignis.clientX,
      startY: ereignis.clientY,
      start: kopie(daten[eintrag.key]),
      groesseAendern: groesseAendern,
      masse: bezugsmasse(eintrag.bezug)
    };

    markierung.setPointerCapture(ereignis.pointerId);
    ereignis.preventDefault();
  });

  markierung.addEventListener("pointermove", function (ereignis) {
    if (
      !ziehvorgang ||
      ereignis.pointerId !== ziehvorgang.pointerId
    ) {
      return;
    }

    const zug = ziehvorgang;
    const start = zug.start;
    const wert = daten[zug.key];

    const deltaX =
      100 * (ereignis.clientX - zug.startX) /
      (zug.masse.breite * zug.masse.faktorX);

    const deltaY =
      100 * (ereignis.clientY - zug.startY) /
      (zug.masse.hoehe * zug.masse.faktorY);

    if (zug.groesseAendern) {
      let breite = start.w + deltaX;
      let hoehe = start.h + deltaY;

      if (ui.proportionen.checked) {
        const faktorX = deltaX / start.w;
        const faktorY = deltaY / start.h;

        const faktor = Math.max(
          0.05,
          1 + (
            Math.abs(faktorX) >= Math.abs(faktorY)
              ? faktorX
              : faktorY
          )
        );

        breite = start.w * faktor;
        hoehe = start.h * faktor;
      }

      wert.w = begrenze(breite, 0.2, 300);
      wert.h = begrenze(hoehe, 0.2, 300);

      // Die obere Kante beim Ziehen der unteren Ecke erhalten.
      wert.y = begrenze(
        start.y - (wert.h - start.h),
        -200,
        200
      );
    } else {
      wert.x = begrenze(start.x + deltaX, -200, 200);
      wert.y = begrenze(start.y - deltaY, -200, 200);
    }

    schreibeLayout();
    aktualisiereEingaben();
  });

  function beendeZiehen(ereignis) {
    if (
      !ziehvorgang ||
      ereignis.pointerId !== ziehvorgang.pointerId
    ) {
      return;
    }

    ziehvorgang = null;

    if (markierung.hasPointerCapture(ereignis.pointerId)) {
      markierung.releasePointerCapture(ereignis.pointerId);
    }
  }

  markierung.addEventListener("pointerup", beendeZiehen);
  markierung.addEventListener("pointercancel", beendeZiehen);

  // =========================================
  // 9. ZURÜCKSETZEN UND HERUNTERLADEN
  // =========================================

  ui.reset.addEventListener("click", function () {
    const eintrag = gewaehlt();

    if (
      !eintrag ||
      !sitzungsbeginn.has(eintrag.key)
    ) {
      return;
    }

    daten[eintrag.key] = kopie(
      sitzungsbeginn.get(eintrag.key)
    );

    schreibeLayout();
    aktualisiereEingaben();

    ui.status.textContent =
      "Dieses Element wurde auf den Stand beim Öffnen zurückgesetzt.";
  });

  ui.download.addEventListener("click", function () {
    const datei = new Blob(
      [exportText()],
      { type: "text/javascript;charset=utf-8" }
    );

    const adresse = URL.createObjectURL(datei);
    const link = document.createElement("a");

    link.href = adresse;
    link.download = "futter-layout.js";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(function () {
      URL.revokeObjectURL(adresse);
    }, 10000);

    ui.status.textContent =
      "Ersetze deine bisherige futter-layout.js durch die neue Datei. " +
      "Der Text kann alternativ direkt aus dem Ausgabefeld kopiert werden.";
  });

  ui.ausgabe.addEventListener("click", function () {
    ui.ausgabe.select();
  });

  // =========================================
  // 10. AUF SPIEL- UND GRÖSSENÄNDERUNGEN REAGIEREN
  // =========================================

  document.addEventListener("fr-layout", planeAktualisierung);

  szene.addEventListener("scroll", aktualisiereMarkierung, true);

  if (typeof ResizeObserver === "function") {
    const beobachter = new ResizeObserver(
      planeAktualisierung
    );

    beobachter.observe(szene);
  } else {
    window.addEventListener("resize", planeAktualisierung);
  }

  const seitenBeobachter = new MutationObserver(function () {
    if (seite.hidden && aktiv) {
      aktiv = false;
      editor.open = false;
      markierung.hidden = true;
      ziehvorgang = null;

      api.schliessen();
    }
  });

  seitenBeobachter.observe(seite, {
    attributes: true,
    attributeFilter: ["hidden"]
  });

  // Gespeicherte Regeln gelten auch bei geschlossenem Editor.
  schreibeLayout();
  registriereElemente();
})();