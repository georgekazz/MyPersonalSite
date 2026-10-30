(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  var countryInfo = {
    GR: {
      kind: "home",
      title: { el: "Ελλάδα", en: "Greece" },
      text: {
        el: "Βάση — Θεσσαλονίκη. ΔΙΠΑΕ & Open Knowledge Foundation Greece.",
        en: "Home base — Thessaloniki. IHU & Open Knowledge Foundation Greece.",
      },
    },
    DK: {
      kind: "visited",
      title: { el: "Δανία", en: "Denmark" },
      text: {
        el: "Κοπεγχάγη — Συνεργασία σε ευρωπαϊκό ερευνητικό έργο Horizon.",
        en: "Copenhagen — Visited for an EU Horizon research project collaboration.",
      },
    },
    BA: {
      kind: "visited",
      title: { el: "Βοσνία-Ερζεγοβίνη", en: "Bosnia and Herzegovina" },
      text: {
        el: "Σαράγεβο — Επίσκεψη.",
        en: "Sarajevo — Visited.",
      },
    },
    BG: {
      kind: "visited",
      title: { el: "Βουλγαρία", en: "Bulgaria" },
      text: {
        el: "Σόφια — Επίσκεψη.",
        en: "Sofia — Visited.",
      },
    },
    DE: {
      kind: "visited",
      title: { el: "Γερμανία", en: "Germany" },
      text: {
        el: "Επίσκεψη.",
        en: "Visited.",
      },
    },
    BR: {
      kind: "visited",
      title: { el: "Βραζιλία", en: "Brazil" },
      text: {
        el: "Ρίο ντε Τζανέιρο — Παρουσίαση άρθρου συνεδρίου.",
        en: "Rio de Janeiro — Conference paper presentation.",
      },
    },
    CY: {
      kind: "visited",
      title: { el: "Κύπρος", en: "Cyprus" },
      text: {
        el: "Συνεργασία σε ευρωπαϊκό έργο (EU project).",
        en: "Visited for an EU project collaboration.",
      },
    },
  };

  // City-level pins shown on top of the highlighted countries.
  var markersData = [
    {
      coords: [55.6761, 12.5683],
      name: { el: "Κοπεγχάγη", en: "Copenhagen" },
      text: {
        el: "Συνεργασία σε ερευνητικό έργο Horizon.",
        en: "EU Horizon research project collaboration.",
      },
    },
    {
      coords: [43.8563, 18.4131],
      name: { el: "Σαράγεβο", en: "Sarajevo" },
      text: {
        el: "Επίσκεψη.",
        en: "Visited.",
      },
    },
    {
      coords: [42.6977, 23.3219],
      name: { el: "Σόφια", en: "Sofia" },
      text: {
        el: "Επίσκεψη.",
        en: "Visited.",
      },
    },
    {
      coords: [-22.9068, -43.1729],
      name: { el: "Ρίο ντε Τζανέιρο", en: "Rio de Janeiro" },
      text: {
        el: "Παρουσίαση άρθρου συνεδρίου.",
        en: "Conference paper presentation.",
      },
    },
    {
      coords: [35.1856, 33.3823],
      name: { el: "Λευκωσία", en: "Nicosia" },
      text: {
        el: "Συνεργασία σε ευρωπαϊκό έργο (EU project).",
        en: "Visited for an EU project collaboration.",
      },
    },
    {
      coords: [52.52, 13.405],
      name: { el: "Βερολίνο", en: "Berlin" },
      text: {
        el: "Επίσκεψη.",
        en: "Visited.",
      },
    },
  ];

  function lang() {
    return localStorage.getItem("site-lang") === "en" ? "en" : "el";
  }

  function setTooltipHtml(tooltip, html) {
    if (!tooltip) return;
   
    var el = tooltip._tooltip || tooltip.el || tooltip.element;
    if (el) {
      el.innerHTML = html;
    } else if (typeof tooltip.text === "function") {
      tooltip.text(html);
    }
  }

  function highlightCountries(mapEl) {
    Object.keys(countryInfo).forEach(function (code) {
      var path = mapEl.querySelector('path[data-code="' + code + '"]');
      if (path) {
        path.classList.add(
          countryInfo[code].kind === "home" ? "is-home" : "is-visited"
        );
      }
    });
  }

  ready(function () {
    var mapEl = document.getElementById("worldMap");
    if (!mapEl || typeof jsVectorMap === "undefined") return;

    var worldMap = new jsVectorMap({
      selector: "#worldMap",
      map: "world",
      zoomButtons: true,
      zoomOnScroll: false,
      regionsSelectable: false,
      backgroundColor: "transparent",
      regionStyle: {
        initial: { fill: "#dcd3be", stroke: "#fffdf8", strokeWidth: 0.5 },
        hover: { fill: "#e7c98f", cursor: "pointer" },
      },
      markerStyle: {
        initial: { fill: "#2c4238", stroke: "#fffdf8", r: 6 },
        hover: { fill: "#b9863b" },
      },
      markers: markersData.map(function (m) {
        return { coords: m.coords };
      }),
      onRegionTooltipShow: function (event, tooltip, code) {
        var info = countryInfo[code];
        if (info) {
          var l = lang();
          setTooltipHtml(
            tooltip,
            "<strong>" + info.title[l] + "</strong><br>" + info.text[l]
          );
        }
      },
      onMarkerTooltipShow: function (event, tooltip, index) {
        var m = markersData[index];
        if (m) {
          var l = lang();
          setTooltipHtml(
            tooltip,
            "<strong>" + m.name[l] + "</strong><br>" + m.text[l]
          );
        }
      },
      onLoaded: function () {
        highlightCountries(mapEl);
      },
    });

    requestAnimationFrame(function () {
      highlightCountries(mapEl);
    });

    function refreshMapSize() {
      if (worldMap && typeof worldMap.updateSize === "function") {
        worldMap.updateSize();
      }
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refreshMapSize, 150);
    });
    window.addEventListener("orientationchange", function () {
      setTimeout(refreshMapSize, 200);
    });
    window.addEventListener("load", refreshMapSize);
  });
})();