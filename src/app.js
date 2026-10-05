// Function to check rooms available, takes in selectedDates parameter from the user and unavailableDates parameter from the system's database

function checkRoomAvailability(selectedDates, unavailableDates) {

    for (let date of selectedDates) {
        if (unavailableDates.includes(date)) {
            return "Room not available";
        }
    }
    return "Room available";
}

//Test 1: all selected dates are available
console.log(checkRoomAvailability(["2026-10-10", "2026-10-11", "2026-10-12"], ["2026-10-15", "2026-10-16"])
);

//Test 2: Only one selected date is available
console.log(checkRoomAvailability(["2026-10-14", "2026-10-15", "2026-10-16"], ["2026-10-15", "2026-10-16"])
);

//Test 3: All selected dates are unavailable
console.log(checkRoomAvailability(["2026-10-15", "2026-10-16"], ["2026-10-15", "2026-10-16"])
);
const select = document.getElementById("category");
const view = document.getElementById("roomView");

// info about the type of room
const info = {
    single: {
        title: "Single Room",
        desc: "One twin bed"
    },
    double: {
        title: "Double Room",
        desc: "Two queen beds"
    },
    king: {
        title: "King Room",
        desc: "A spacious room with a king-sized bed."
    },
    suite: {
        title: "Suite Room",
        desc: "A luxurious room with additional amenities."
    }
};

// Smooth scrolling, unless the visitor has "reduce motion" turned on
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollMode = reduceMotion ? "auto" : "smooth";

function showRoom() {
    const art = document.querySelector('#roomLibrary [data-room="' + select.value + '"]');
    const room = info[select.value];

    // dont show the room until selected
    if (!art || !room) {
        view.hidden = true;
        return;
    }

    document.getElementById("roomArt").innerHTML = art.innerHTML;
    document.getElementById("roomTitle").textContent = room.title;
    document.getElementById("roomDesc").textContent = room.desc;

    view.hidden = false;
    view.scrollIntoView({ behavior: scrollMode });
}

select.addEventListener("change", showRoom);

//scrolls back to top
document.getElementById("changeRoom").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: scrollMode });
});