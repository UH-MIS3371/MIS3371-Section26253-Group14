
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
    