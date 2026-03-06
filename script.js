let selectedCategory = "All";
let lineup = [];
function showStats() {
    document.getElementById("total-events").innerHTML = events.length;
    let categoryTotals = {};
    for (let i = 0; i < events.length; i++) {
        let cat = events[i].category;
        if (categoryTotals[cat] == undefined) {
            categoryTotals[cat] = 0;
        }
        categoryTotals[cat] = categoryTotals[cat] + events[i].registrations;
    }
    let topCategory = "";
    let topCount = 0;
    for (let cat in categoryTotals) {
        if (categoryTotals[cat] > topCount) {
            topCount = categoryTotals[cat];
            topCategory = cat;
        }
    }
    document.getElementById("popular-category").innerHTML = topCategory;
}
function showFilterButtons() {
    let categories = ["All"];
    for (let i = 0; i < events.length; i++) {
        let cat = events[i].category;
        if (categories.indexOf(cat) == -1) {
            categories.push(cat);
        }
    }
    let container = document.getElementById("filter");
    container.innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
        let btn = document.createElement("button");
        btn.innerHTML = categories[i];
        if (categories[i] == selectedCategory) {
            btn.className = "active";
        }
        btn.onclick = function () {
            selectedCategory = this.innerHTML;
            showFilterButtons();
            renderCards();
        };
        container.appendChild(btn);
    }
}
function isInLineup(id) {
    for (let i = 0; i < lineup.length; i++) {
        if (lineup[i] == id) {
            return true;
        }
    }
    return false;
}
function toggleLineup(id) {
    if (isInLineup(id)) {
        let newLineup = [];
        for (let i = 0; i < lineup.length; i++) {
            if (lineup[i] != id) {
                newLineup.push(lineup[i]);
            }
        }
        lineup = newLineup;
    } else {
        lineup.push(id);
    }
    renderCards();
    renderLineup();
}
function toggleCard(cardElement) {
    if (cardElement.className.indexOf("open") != -1) {
        cardElement.className = "card";
    } else {
        cardElement.className = "card open";
    }
}
function renderCards() {
    let searchText = document.getElementById("search-bar").value.toLowerCase();
    let sortValue = document.getElementById("sort-dropdown").value;
    let filtered = [];
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        if (searchText != "" && event.name.toLowerCase().indexOf(searchText) == -1) {
            continue;
        }
        if (selectedCategory != "All" && event.category != selectedCategory) {
            continue;
        }
        filtered.push(event);
    }
    if (sortValue == "day") {
        for (let i = 0; i < filtered.length; i++) {
            for (let j = i + 1; j < filtered.length; j++) {
                if (filtered[i].day > filtered[j].day) {
                    let temp = filtered[i];
                    filtered[i] = filtered[j];
                    filtered[j] = temp;
                }
            }
        }
    } else if (sortValue == "registrations") {
        for (let i = 0; i < filtered.length; i++) {
            for (let j = i + 1; j < filtered.length; j++) {
                if (filtered[i].registrations < filtered[j].registrations) {
                    let temp = filtered[i];
                    filtered[i] = filtered[j];
                    filtered[j] = temp;
                }
            }
        }
    }
    let noEventsMsg = document.getElementById("none");
    let cardsContainer = document.getElementById("cards");
    if (filtered.length == 0) {
        noEventsMsg.style.display = "block";
        cardsContainer.innerHTML = "";
        return;
    }
    noEventsMsg.style.display = "none";
    cardsContainer.innerHTML = "";
    for (let i = 0; i < filtered.length; i++) {
        let event = filtered[i];
        let saved = isInLineup(event.id);
        let card = document.createElement("div");
        card.className = "card";
        card.innerHTML =
            "<h3>" + event.name + "</h3>" +
            "<span class='category-tag'>" + event.category + "</span>" +
            "<p class='basic-info'>📅 Day " + event.day + "&nbsp;&nbsp; 🕐 " + event.time + "</p>" +
            "<div class='extra-details'>" +
                "<p>📍 Venue: " + event.venue + "</p>" +
                "<p>👥 Registrations: " + event.registrations + "</p>" +
            "</div>" +
            "<button class='save-btn " + (saved ? "saved" : "") + "'>" + (saved ? "★ Saved" : "☆ Save to Lineup") + "</button>";
        card.onclick = function () {
            toggleCard(this);
        };
        let saveBtn = card.querySelector(".save-btn");
        saveBtn.onclick = (function (id) {
            return function (e) {
                e.stopPropagation();
                toggleLineup(id);
            };
        })(event.id);
        cardsContainer.appendChild(card);
    }
}
function renderLineup() {
    let lineupSection = document.getElementById("lineup-section");
    let lineupContainer = document.getElementById("lineup-container");
    let logo = document.getElementById("lineup-logo");
    lineupContainer.innerHTML = "";
    if (lineup.length == 0) {
        lineupSection.style.display = "none";
        logo.style.display = "none";
        return;
    }
    lineupSection.style.display = "block";
    logo.style.display = "block";
    for (let i = 0; i < lineup.length; i++) {
        let id = lineup[i];
        let event = null;
        for (let j = 0; j < events.length; j++) {
            if (events[j].id == id) {
                event = events[j];
                break;
            }
        }
        if (event == null) continue;
        let item = document.createElement("div");
        item.className = "lineup-item";
        item.innerHTML =
            event.name + " &nbsp;|&nbsp; " + event.category + " &nbsp;|&nbsp; Day " + event.day + " &nbsp;|&nbsp; " + event.time + "</span>" +
            "<button>Remove</button>";

        item.querySelector("button").onclick = (function (id) {
            return function () {
                toggleLineup(id);
            };
        })(event.id);

        lineupContainer.appendChild(item);
    }
}
showStats();
showFilterButtons();
renderCards();
