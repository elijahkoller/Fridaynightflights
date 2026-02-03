/* script.js
   Timeline + tooltip behavior
   Requires: timeline-dot class on items, #timeline-tooltip element in DOM
*/
document.addEventListener("DOMContentLoaded", () => {

  const champions = {
    1: { name: "John Pork", text: "The very first FNF, an almost informal affair won by John Pork in a four man tournament, besting Silksong" },
    2: { name: "The Mariner", text: "The first fullfledge event where the mariner won in domminant fashion for the first time, realizing everyones fears." },
    3: { name: "The Mariner", text: "The first and only back to back FNF championship, in which the Mariner didn't lose a single leg, defeating silksong for the second time in the finals." },
    4: { name: "John Pork", text: "The second win for John Pork in the mordernized format tournament format, John Pork was brutally injured by JJ Fiend, who was then abducted by the Night Mariner." },
    5: { name: "Silksong", text: "In the absence of both JJ Fiend and John Pork, Silksong makes his first appearance in the finals from the winners bracket and finally gets over the hump by defeating G***e to win his first FNF" },
    6: { name: "John Pork", text: "John Pork makes a suprise return and becomes the first finalist from the losers' bracket to win FNF, defeating JJ fiend in his first Finals appearance." },
    7: { name: "Silksong & Jersey", text: "In the largest tournament in FNF history, Silksong and Jersey battle their way to the finals defeating John Pork and Dickmel to earn Silksong his second FNF Trophy" },
    8: { name: "John Pork", text: "In the largest singles tournamnet in FNF History John Pork crushes the competition winning his fourth championship." },
    9: { name: "The Mariner", text: "The Mariner wins his third Championship in domminant fashion, seeming to be in form for the first time in months." },
    10: { name: "John Pork", text: "Once again John Pork Rises to the top to claim glory once again, winning his 5th FNF and claiming the Season 1 championship" },
    11: { name: "The Mariner", text: "The Mariner wins his 4th title, in a close decisive final against John Pork!" },
    11: { name: "The Mariner", text: "The MAriner goes back to back beating John Pork once again, for just the second time in FNF history. He ties John Pork for the most FNF titles for the first time since FNF 6!" },
    11: { name: "TBD", text: "Find out this friday if the Mariner will three-peat, will John Pork get revenge, or will a newcomer finallly rise to the challenge, only at FNF 13" }
  };

  const timelineWrapper = document.querySelector(".timeline-wrapper");
  const timeline = document.getElementById("timeline");
  const tooltip = document.getElementById("timeline-tooltip");
  const dots = document.querySelectorAll(".timeline-dot");

  // Helper to show tooltip, centered above target, with bounds checking
  function showTooltip(targetEl, contentHtml) {
    tooltip.innerHTML = contentHtml;
    tooltip.classList.remove("hidden");
    tooltip.setAttribute("aria-hidden", "false");

    // compute sizes & positions
    const rect = targetEl.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    const vw = window.innerWidth;

    // default place above
    let left = rect.left + rect.width / 2 - ttRect.width / 2;
    // clamp horizontally
    left = Math.max(8, Math.min(left, vw - ttRect.width - 8));

    // top above element
    let top = window.scrollY + rect.top - ttRect.height - 12;

    // if not enough room above, place below
    if (top < window.scrollY + 8) {
      top = window.scrollY + rect.bottom + 12;
      // move caret down - handled visually by ::after; we won't flip caret here for simplicity
    }

    // apply
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function hideTooltip() {
    tooltip.classList.add("hidden");
    tooltip.setAttribute("aria-hidden", "true");
    tooltip.style.left = "-9999px";
    tooltip.style.top = "-9999px";
  }

  // attach hover + focus (keyboard) + touch/click fallback for mobile
  dots.forEach(dot => {
    const id = dot.getAttribute("data-id");

    // mouse enter -> show
    dot.addEventListener("mouseenter", (e) => {
      const champ = champions[id];
      const html = `<strong>${dot.textContent}</strong><br>
                    <span style="color:#00c000;">Champion:</span> ${champ.name}<br><br>
                    <em>${champ.text || "No additional notes yet."}</em>`;
      showTooltip(e.currentTarget, html);
    });

    // mouse leave -> hide
    dot.addEventListener("mouseleave", () => hideTooltip());

    // keyboard focus -> show, blur -> hide
    dot.setAttribute("tabindex", "0");
    dot.addEventListener("focus", (e) => {
      const champ = champions[id];
      const html = `<strong>${dot.textContent}</strong><br>
                    <span style="color:#00c000;">Champion:</span> ${champ.name}<br><br>
                    <em>${champ.text || "No additional notes yet."}</em>`;
      showTooltip(e.currentTarget, html);
    });
    dot.addEventListener("blur", () => hideTooltip());

    // mobile: click toggles tooltip (so touch users can see it)
    let mobileOpen = false;
    dot.addEventListener("click", (e) => {
      // prevent default focus toggles messing with tooltip
      e.stopPropagation();
      const champ = champions[id];
      const html = `<strong>${dot.textContent}</strong><br>
                    <span style="color:#00c000;">Champion:</span> ${champ.name}<br><br>
                    <em>${champ.text || "No additional notes yet."}</em>`;
      if (mobileOpen) {
        hideTooltip();
        mobileOpen = false;
      } else {
        showTooltip(e.currentTarget, html);
        mobileOpen = true;
      }
    });
  });

  // clicking anywhere else hides tooltip (mobile convenience)
  document.addEventListener("click", (e) => {
    // if click is outside timeline and tooltip, hide
    if (!timeline.contains(e.target) && !tooltip.contains(e.target)) {
      hideTooltip();
    }
  });

  // horizontal scroll with mouse wheel inside wrapper
  timelineWrapper.addEventListener("wheel", (e) => {
    // prefer horizontal movement if user uses vertical wheel
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      timelineWrapper.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // small accessibility: allow left/right arrow keys to scroll timeline wrapper
  timelineWrapper.addEventListener("keydown", (e) => {
    const step = 140;
    if (e.key === "ArrowRight") {
      timelineWrapper.scrollLeft += step;
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      timelineWrapper.scrollLeft -= step;
      e.preventDefault();
    }
  });

  // ensure tooltip hides when resizing
  window.addEventListener("resize", hideTooltip);
  window.addEventListener("scroll", hideTooltip);
});



