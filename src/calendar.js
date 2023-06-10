document.getElementById("date").value = formatDate(new Date())
const today = new Date();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
    return `rgb(${getRandomInt(0, 100)},${getRandomInt(0, 100)},${getRandomInt(0, 100)})`
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

function getEvents() {
    postData(`http://${myip}:3000/cal`, { event: "get", age: 25 })
        .then((data) => {
            allEventsFromCalendar = JSON.parse(data).VisitList
            
            changeData(new Date())
        });
}
getEvents()

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
    console.log(eventsInSelectedDay)
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


function changeDateInput(type) {
    let i = 0;
    if (type == "prev") {
        i = -1;
    } else {
        i = 1;
    }

    let currentDate = new Date(document.getElementById("date").value);
    let newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + i);

    document.getElementById("date").value = formatDate(newDate);
    changeData(newDate);
}