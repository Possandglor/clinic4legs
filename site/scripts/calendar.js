document.getElementById("date").value = formatDate(new Date())
const today = new Date();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
    return `rgb(${getRandomInt(200, 255)},${getRandomInt(200, 255)},${getRandomInt(200, 255)})`
}
const scheduleChart = document.getElementById('schedule-chart');

function createScheduleChart(eventsData) {
    const timeScaleElement = document.createElement('div');
    timeScaleElement.classList.add('time-scale');
    for (let i = 7; i <= 19; i++) {
        const timeSlotElement = document.createElement('div');
        timeSlotElement.classList.add('time-slot');
        timeSlotElement.innerText = formatTime(i) + ':00';
        timeScaleElement.appendChild(timeSlotElement);
    }
    scheduleChart.innerHTML = ""
    scheduleChart.appendChild(timeScaleElement);

    const eventsElement = document.createElement('div');
    eventsElement.classList.add('events');
    eventsData.forEach(event => {
        const startHour = parseInt(event.startTime.split(':')[0], 10);
        const startMinute = parseInt(event.startTime.split(':')[1], 10);
        const endHour = parseInt(event.endTime.split(':')[0], 10);
        const endMinute = parseInt(event.endTime.split(':')[1], 10);

        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.innerText = event.title;

        const topPosition = calculateEventTopPosition(startHour, startMinute);
        const height = calculateEventHeight(startHour, startMinute, endHour, endMinute);
        eventElement.style.top = topPosition + 'px';
        eventElement.style.height = height + 'px';
        eventElement.style.color = "black";
        eventElement.style.backgroundColor = randomColor()
        eventsElement.appendChild(eventElement);
        eventElement.style.paddingLeft = "10px"
    });
    scheduleChart.appendChild(eventsElement);
}

function formatTime(hour) {
    return hour < 10 ? '0' + hour : hour.toString();
}

function calculateEventTopPosition(startHour, startMinute) {
    const totalMinutes = (startHour - 7) * 60 + startMinute;
    const minutesPerSlot = 60;
    return Math.floor(totalMinutes / minutesPerSlot * 40);
}

function calculateEventHeight(startHour, startMinute, endHour, endMinute) {
    const startTotalMinutes = (startHour - 7) * 60 + startMinute;
    const endTotalMinutes = (endHour - 7) * 60 + endMinute;
    const totalMinutes = endTotalMinutes - startTotalMinutes;
    const minutesPerSlot = 60;
    const height = Math.ceil(totalMinutes / minutesPerSlot * 40);
    return height;
}

let allEventsFromCalendar = []

async function getEvents(date) {
    await postData(`${window.location.href}cal`, { event: "get" })
        .then((data) => {
            allEventsFromCalendar = JSON.parse(data).VisitList
            // Создаем календарь при загрузке страницы
            createCalendar(formatDate(date));
        });
}

getEvents(new Date())

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`
}

function formatedTime(date) {
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`
}

function changeData(date) {
    let eventsInSelectedDay = allEventsFromCalendar.filter((elem) => {
        return formatDate(new Date(elem.dateStart)) == formatDate(new Date(date))
    })
    console.log(date)
    let eventsData = []
    for (let a of eventsInSelectedDay) {
        eventsData.push({
            startTime: formatedTime(new Date(a.dateStart)),
            endTime: formatedTime(new Date(a.dateEnd)),
            title: a.title,
        })
    }

    createScheduleChart(eventsData);
}



// 
// Данные событий для календаря (пример)
const events = {
    "2023-07-01": ["укол кошка Буся 0500559015", "Событие 2"],
    "2023-07-05": ["Событие 3"],
    "2023-07-10": ["Событие 4", "Событие 5"],
};

// Функция для создания блока дня календаря
function createCalendarDay(date) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("calendar-day");
    dayElement.textContent = date.toISOString().split("T")[0];
    for (let ev of allEventsFromCalendar) {
        const eventItems = document.createElement("div");
        if (ev.dateStart.split("T")[0] == date.toISOString().split("T")[0]) {
            const eventItem = document.createElement("span");
            eventItem.innerText = ev.title;
            eventItems.appendChild(eventItem);
        }
        eventItems.style = "border-top: 1px solid green;"
        dayElement.appendChild(eventItems);
    }

    // Обработчик клика на день
    dayElement.addEventListener("click", () => {
        // Удаляем выделение со всех дней
        const allDays = document.querySelectorAll(".calendar-day");
        allDays.forEach((day) => {
            day.classList.remove("selected-day");
        });
        loadEventsForSelectedDay(dayElement)
        // Выделяем выбранный день
        dayElement.classList.add("selected-day");
    });

    return dayElement;
}

function loadEventsForSelectedDay(dayElement) {
    console.log(dayElement.innerText.substring(0, 10))
    changeData(new Date(dayElement.innerText.substring(0, 10)))
}
// Функция для создания календаря
function createCalendar(selectedDate) {
    const calendarElement = document.getElementById("calendar");
    calendarElement.innerHTML = ""
    selectedDate = new Date(selectedDate);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();

    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 2);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 1);

    for (let date = firstDayOfMonth; date <= lastDayOfMonth; date.setDate(date.getDate() + 1)) {
        const dayElement = createCalendarDay(date);
        calendarElement.appendChild(dayElement);
    }
}

