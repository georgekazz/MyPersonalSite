document.addEventListener("DOMContentLoaded", () => {
  /* mobile nav toggle */
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (navToggle && mainNav){
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("is-open");
    });
    mainNav.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => mainNav.classList.remove("is-open"))
    );
  }

  /* mark active nav link */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  /* scroll reveal */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  /* card-stack carousel: arrows bring a different card to the front */
  const cardStack = document.getElementById("cardStack");
  if (cardStack){
    const cards = Array.from(cardStack.querySelectorAll(".stack-card"));
    const dots = Array.from(document.querySelectorAll("#stackDots span"));
    let order = cards.map((_, i) => i); // order[0] = index of card currently in front

    function render(){
      order.forEach((cardIndex, pos) => {
        cards[cardIndex].className = "stack-card pos-" + pos;
      });
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === order[0]));
    }
    render();

    function next(){ order.push(order.shift()); render(); }
    function prev(){ order.unshift(order.pop()); render(); }

    document.getElementById("stackNext")?.addEventListener("click", next);
    document.getElementById("stackPrev")?.addEventListener("click", prev);

    /* clicking a back card also brings it to the front */
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const pos = order.indexOf(cards.indexOf(card));
        if (pos === 0) return;
        for (let i = 0; i < pos; i++) next();
      });
    });

    /* dots are also clickable shortcuts */
    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        while (order[0] !== i) next();
      });
    });
  }

  /* contact form: prevent actual submit (no backend) */
  const form = document.querySelector(".contact-form");
  if (form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      const original = btn.textContent;
      btn.textContent = "✓";
      setTimeout(() => (btn.textContent = original), 1800);
    });
  }
});