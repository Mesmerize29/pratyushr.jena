import { siteContent } from "../data/content.js";

function createChip(text) {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = text;
  return chip;
}

function createCard(cardData) {
  const card = document.createElement("article");
  card.className = "info-card";

  const title = document.createElement("h3");
  title.className = "info-card__title";
  title.textContent = cardData.title;

  const body = document.createElement("p");
  body.className = "info-card__text";
  body.textContent = cardData.text;

  const tags = document.createElement("div");
  tags.className = "card-tags";

  (cardData.tags || []).forEach((tag) => {
    tags.appendChild(createChip(tag));
  });

  card.append(title, body, tags);
  return card;
}

function createSectionPanel(section, index) {
  const panel = document.createElement("article");
  panel.className = "orbit-panel";
  panel.dataset.sectionId = section.id;
  panel.dataset.sectionIndex = String(index);
  panel.style.setProperty("--panel-index", index);

  const inner = document.createElement("div");
  inner.className = "orbit-panel__inner";

  const kicker = document.createElement("p");
  kicker.className = "section-kicker";
  kicker.textContent = section.kicker || "";

  const title = document.createElement("h2");
  title.className = "section-title";
  title.textContent = section.title;

  inner.append(kicker, title);

  if (section.body) {
    const body = document.createElement("p");
    body.className = "section-body";
    body.textContent = section.body;
    inner.appendChild(body);
  }

  if (section.bullets?.length) {
    const list = document.createElement("ul");
    list.className = "section-list";

    section.bullets.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    inner.appendChild(list);
  }

  if (section.cards?.length) {
    const grid = document.createElement("div");
    grid.className = "cards-grid";

    section.cards.forEach((card) => {
      grid.appendChild(createCard(card));
    });

    inner.appendChild(grid);
  }

  if (section.chips?.length) {
    const chipRow = document.createElement("div");
    chipRow.className = "chip-row";

    section.chips.forEach((chip) => {
      chipRow.appendChild(createChip(chip));
    });

    inner.appendChild(chipRow);
  }

  if (section.cta) {
    const button = document.createElement("button");
    button.className = "section-cta";
    button.type = "button";
    button.textContent = section.cta.label;
    button.dataset-target = section.cta.target;
    inner.appendChild(button);
  }

  panel.appendChild(inner);
  return panel;
}

export function renderSections(ringElement, navElement) {
  ringElement.innerHTML = "";
  navElement.innerHTML = "";

  siteContent.sections.forEach((section, index) => {
    ringElement.appendChild(createSectionPanel(section, index));

    const navButton = document.createElement("button");
    navButton.className = "orbit-nav__button";
    navButton.type = "button";
    navButton.dataset-index = String(index);
    navButton.setAttribute("aria-label", section.navLabel);
    navButton.innerHTML = `
      <span class="orbit-nav__dot"></span>
      <span class="orbit-nav__text">${section.navLabel}</span>
    `;
    navElement.appendChild(navButton);
  });
}
