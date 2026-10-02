/* =========================================================
   DATI
========================================================= */

const days = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica"
];


const defaultActivities = [

  {
    id: "university",
    name: "Università",
    icon: "🎓",
    color: "orange"
  },

  {
    id: "gym",
    name: "Palestra",
    icon: "🏋️",
    color: "purple"
  },

  {
    id: "tennis",
    name: "Tennis",
    icon: "🎾",
    color: "green"
  }

];


let activities = [];

let events = [];

let unavailableCells = [];

let selectedCell = null;

let editingEventId = null;

let editingActivityId = null;


/* =========================================================
   ELEMENTI
========================================================= */

const planner =
  document.getElementById("planner");

const legend =
  document.getElementById("legend");

const eventCount =
  document.getElementById("eventCount");


/* =========================================================
   ELEMENTI MOBILE LEGACY
   Manteniamo i riferimenti perché sono presenti nell'HTML,
   ma non vengono più utilizzati.
========================================================= */

const mobileDayName =
  document.getElementById("mobileDayName");

const mobileDayCounter =
  document.getElementById("mobileDayCounter");

const mobileActivities =
  document.getElementById("mobileActivities");

const previousDayBtn =
  document.getElementById("previousDayBtn");

const nextDayBtn =
  document.getElementById("nextDayBtn");

const mobilePlanner =
  document.getElementById("mobilePlanner");


/* =========================================================
   EVENT MODAL
========================================================= */

const modal =
  document.getElementById("modal");

const modalCategory =
  document.getElementById("modalCategory");

const eventForm =
  document.getElementById("eventForm");

const eventTitle =
  document.getElementById("eventTitle");

const startTime =
  document.getElementById("startTime");

const endTime =
  document.getElementById("endTime");

const eventNote =
  document.getElementById("eventNote");

const deleteBtn =
  document.getElementById("deleteBtn");

const markUnavailableBtn =
  document.getElementById("markUnavailableBtn");

const closeModalBtn =
  document.getElementById("closeModal");

const cancelBtn =
  document.getElementById("cancelBtn");


/* =========================================================
   ATTIVITÀ
========================================================= */

const activitiesModal =
  document.getElementById("activitiesModal");

const activitiesList =
  document.getElementById("activitiesList");

const manageActivitiesBtn =
  document.getElementById("manageActivitiesBtn");

const closeActivitiesModal =
  document.getElementById("closeActivitiesModal");

const addActivityBtn =
  document.getElementById("addActivityBtn");


/* =========================================================
   FORM ATTIVITÀ
========================================================= */

const activityFormModal =
  document.getElementById("activityFormModal");

const activityForm =
  document.getElementById("activityForm");

const activityFormTitle =
  document.getElementById("activityFormTitle");

const activityName =
  document.getElementById("activityName");

const activityIcon =
  document.getElementById("activityIcon");

const activityPreviewIcon =
  document.getElementById("activityPreviewIcon");

const activityPreviewName =
  document.getElementById("activityPreviewName");

const closeActivityForm =
  document.getElementById("closeActivityForm");

const cancelActivityBtn =
  document.getElementById("cancelActivityBtn");


/* =========================================================
   DATI / BACKUP
========================================================= */

const dataModal =
  document.getElementById("dataModal");

const openDataBtn =
  document.getElementById("openDataBtn");

const closeDataModalBtn =
  document.getElementById("closeDataModal");

const exportDataBtn =
  document.getElementById("exportDataBtn");

const importDataBtn =
  document.getElementById("importDataBtn");

const importFileInput =
  document.getElementById("importFileInput");


/* =========================================================
   CARICAMENTO ATTIVITÀ
========================================================= */

try {

  const savedActivities =
    JSON.parse(
      localStorage.getItem(
        "weeklyPlannerActivities"
      )
    );


  if (
    Array.isArray(savedActivities) &&
    savedActivities.length
  ) {

    activities =
      savedActivities;

  } else {

    activities =
      defaultActivities.map(
        activity => ({
          ...activity
        })
      );

  }

} catch {

  activities =
    defaultActivities.map(
      activity => ({
        ...activity
      })
    );

}


/* =========================================================
   CARICAMENTO EVENTI
========================================================= */

try {

  events =
    JSON.parse(
      localStorage.getItem(
        "weeklyPlanner"
      )
    ) || [];

} catch {

  events = [];

}


/* =========================================================
   CARICAMENTO X
========================================================= */

try {

  unavailableCells =
    JSON.parse(
      localStorage.getItem(
        "weeklyPlannerUnavailable"
      )
    ) || [];

} catch {

  unavailableCells = [];

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveActivities() {

  localStorage.setItem(
    "weeklyPlannerActivities",
    JSON.stringify(activities)
  );

}


function saveEvents() {

  localStorage.setItem(
    "weeklyPlanner",
    JSON.stringify(events)
  );

}


function saveUnavailableCells() {

  localStorage.setItem(
    "weeklyPlannerUnavailable",
    JSON.stringify(unavailableCells)
  );

}


/* =========================================================
   UTILITY
========================================================= */

function getActivityById(id) {

  return activities.find(
    activity =>
      activity.id === id
  );

}


function getCellKey(type, day) {

  return `${type}-${day}`;

}


function generateId(prefix = "id") {

  return (
    prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .substring(2, 8)
  );

}


function escapeHTML(text) {

  return String(text).replace(
    /[&<>"']/g,
    function(character) {

      return {

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      }[character];

    }
  );

}


/* =========================================================
   RENDER GENERALE
========================================================= */

function render() {

  renderLegend();

  renderPlanner();

  eventCount.textContent =
    events.length;

}


/* =========================================================
   LEGENDA
========================================================= */

function renderLegend() {

  legend.innerHTML = "";


  activities.forEach(
    activity => {

      const item =
        document.createElement("div");


      item.className =
        "legend-item";


      item.innerHTML = `

        <span>
          ${escapeHTML(activity.icon)}
        </span>

        <span>
          ${escapeHTML(activity.name)}
        </span>

      `;


      legend.appendChild(item);

    }
  );

}


/* =========================================================
   PLANNER
   Unica griglia sia desktop che mobile.
========================================================= */

function renderPlanner() {

  planner.innerHTML = "";


  const corner =
    document.createElement("div");


  corner.className =
    "corner";


  planner.appendChild(corner);


  /* -------------------------------------------------------
     GIORNI
  ------------------------------------------------------- */

  days.forEach(
    day => {

      const dayElement =
        document.createElement("div");


      dayElement.className =
        "day";


      dayElement.innerHTML = `
        <span>
          ${day.substring(0, 3).toUpperCase()}
        </span>
      `;


      planner.appendChild(
        dayElement
      );

    }
  );


  /* -------------------------------------------------------
     ATTIVITÀ
  ------------------------------------------------------- */

  activities.forEach(
    activity => {

      const label =
        document.createElement("div");


      label.className =
        "activity";


      label.innerHTML = `

        <span class="activity-icon">
          ${escapeHTML(activity.icon)}
        </span>

        <strong class="activity-name">
          ${escapeHTML(activity.name)}
        </strong>

      `;


      planner.appendChild(label);


      /* ---------------------------------------------------
         CELLE DEI 7 GIORNI
      --------------------------------------------------- */

      for (
        let day = 0;
        day < 7;
        day++
      ) {

        const cell =
          document.createElement("div");


        cell.className =
          "cell";


        cell.dataset.type =
          activity.id;


        cell.dataset.day =
          day;


        cell.addEventListener(
          "click",
          function() {

            openNewEvent(
              activity.id,
              day,
              cell
            );

          }
        );


        renderCell(
          cell,
          activity.id,
          day
        );


        planner.appendChild(cell);

      }

    }
  );

}


/* =========================================================
   CELLA
========================================================= */

function renderCell(
  cell,
  type,
  day
) {

  const key =
    getCellKey(
      type,
      day
    );


  cell.innerHTML = "";


  cell.classList.remove(
    "unavailable"
  );


  /* -------------------------------------------------------
     NON PREVISTO
  ------------------------------------------------------- */

  if (
    unavailableCells.includes(key)
  ) {

    cell.classList.add(
      "unavailable"
    );


    const xElement =
      document.createElement("div");


    xElement.className =
      "cell-x";


    cell.appendChild(
      xElement
    );


    return;

  }


  /* -------------------------------------------------------
     EVENTI
  ------------------------------------------------------- */

  const cellEvents =
    events.filter(
      event =>
        event.type === type &&
        Number(event.day) === day
    );


  cellEvents.sort(
    (a, b) =>
      a.start.localeCompare(
        b.start
      )
  );


  cellEvents.forEach(
    event => {

      const activity =
        getActivityById(
          event.type
        );


      if (!activity) {
        return;
      }


      const element =
        document.createElement("div");


      element.className =
        `event color-${activity.color}`;


      element.innerHTML = `

        <div class="event-time">
          ${escapeHTML(event.start)}
          –
          ${escapeHTML(event.end)}
        </div>

        <div class="event-title">
          ${escapeHTML(event.title)}
        </div>

        ${
          event.note
            ? `
              <div class="event-note">
                ${escapeHTML(event.note)}
              </div>
            `
            : ""
        }

      `;


      element.addEventListener(
        "click",
        function(e) {

          e.stopPropagation();


          openEditEvent(
            event,
            type,
            day
          );

        }
      );


      cell.appendChild(element);

    }
  );

}


/* =========================================================
   NUOVO EVENTO
========================================================= */

function openNewEvent(
  type,
  day,
  cell
) {

  selectedCell = {
    type,
    day,
    element: cell
  };


  editingEventId = null;


  const activity =
    getActivityById(type);


  if (!activity) {
    return;
  }


  const key =
    getCellKey(
      type,
      day
    );


  const isUnavailable =
    unavailableCells.includes(key);


  modalCategory.textContent =
    `${activity.icon} ${activity.name} · ${days[day]}`;


  if (isUnavailable) {

    eventTitle
      .closest("label")
      .style.display = "none";


    document
      .querySelector(".time-row")
      .style.display = "none";


    eventNote
      .closest("label")
      .style.display = "none";


    markUnavailableBtn.textContent =
      "Riattiva attività";


    deleteBtn.style.display =
      "none";

  } else {

    eventTitle
      .closest("label")
      .style.display = "block";


    document
      .querySelector(".time-row")
      .style.display = "grid";


    eventNote
      .closest("label")
      .style.display = "block";


    eventTitle.value =
      "";

    startTime.value =
      "18:00";

    endTime.value =
      "19:30";

    eventNote.value =
      "";


    markUnavailableBtn.textContent =
      "Non previsto";


    deleteBtn.style.display =
      "none";

  }


  modal.classList.add("active");

}


/* =========================================================
   MODIFICA EVENTO
========================================================= */

function openEditEvent(
  event,
  type,
  day
) {

  selectedCell = {
    type,
    day,
    element: null
  };


  editingEventId =
    event.id;


  eventTitle
    .closest("label")
    .style.display = "block";


  document
    .querySelector(".time-row")
    .style.display = "grid";


  eventNote
    .closest("label")
    .style.display = "block";


  const activity =
    getActivityById(event.type);


  if (!activity) {
    return;
  }


  modalCategory.textContent =
    `${activity.icon} ${activity.name} · ${days[event.day]}`;


  eventTitle.value =
    event.title;


  startTime.value =
    event.start;


  endTime.value =
    event.end;


  eventNote.value =
    event.note || "";


  deleteBtn.style.display =
    "block";


  markUnavailableBtn.textContent =
    "Non previsto";


  modal.classList.add("active");


  setTimeout(
    () =>
      eventTitle.focus(),
    100
  );

}


/* =========================================================
   SALVA EVENTO
========================================================= */

eventForm.addEventListener(
  "submit",
  function(e) {

    e.preventDefault();


    if (!selectedCell) {
      return;
    }


    const type =
      selectedCell.type;


    const day =
      Number(
        selectedCell.day
      );


    const title =
      eventTitle.value.trim();


    if (!title) {
      return;
    }


    if (
      startTime.value &&
      endTime.value &&
      startTime.value >=
        endTime.value
    ) {

      alert(
        "L'orario di fine deve essere successivo all'orario di inizio."
      );


      return;

    }


    const newEvent = {

      id:
        editingEventId ||
        generateId("event"),

      type,

      day,

      title,

      start:
        startTime.value,

      end:
        endTime.value,

      note:
        eventNote.value.trim()

    };


    if (editingEventId) {

      const index =
        events.findIndex(
          event =>
            event.id ===
            editingEventId
        );


      if (index !== -1) {

        events[index] =
          newEvent;

      }

    } else {

      events.push(
        newEvent
      );

    }


    const key =
      getCellKey(
        type,
        day
      );


    unavailableCells =
      unavailableCells.filter(
        item =>
          item !== key
      );


    saveEvents();

    saveUnavailableCells();

    render();

    closeEventModal();

  }
);


/* =========================================================
   NON PREVISTO / RIATTIVA
========================================================= */

markUnavailableBtn.addEventListener(
  "click",
  function() {

    if (!selectedCell) {
      return;
    }


    const type =
      selectedCell.type;


    const day =
      Number(
        selectedCell.day
      );


    const key =
      getCellKey(
        type,
        day
      );


    if (
      unavailableCells.includes(key)
    ) {

      unavailableCells =
        unavailableCells.filter(
          item =>
            item !== key
        );


      saveUnavailableCells();

      render();

      closeEventModal();

      return;

    }


    if (editingEventId) {

      const confirmed =
        confirm(
          "Vuoi eliminare l'impegno e segnare questa attività come non prevista?"
        );


      if (!confirmed) {
        return;
      }


      events =
        events.filter(
          event =>
            event.id !==
            editingEventId
        );

    }


    unavailableCells.push(key);


    saveEvents();

    saveUnavailableCells();

    render();

    closeEventModal();

  }
);


/* =========================================================
   ELIMINA EVENTO
========================================================= */

deleteBtn.addEventListener(
  "click",
  function() {

    if (!editingEventId) {
      return;
    }


    const confirmed =
      confirm(
        "Vuoi eliminare questo impegno?"
      );


    if (!confirmed) {
      return;
    }


    events =
      events.filter(
        event =>
          event.id !==
          editingEventId
      );


    saveEvents();

    render();

    closeEventModal();

  }
);


/* =========================================================
   CHIUSURA MODAL EVENTO
========================================================= */

closeModalBtn.addEventListener(
  "click",
  closeEventModal
);


cancelBtn.addEventListener(
  "click",
  closeEventModal
);


modal.addEventListener(
  "click",
  function(e) {

    if (e.target === modal) {

      closeEventModal();

    }

  }
);


function closeEventModal() {

  modal.classList.remove(
    "active"
  );


  selectedCell = null;

  editingEventId = null;

}


/* =========================================================
   GESTIONE ATTIVITÀ
========================================================= */

manageActivitiesBtn.addEventListener(
  "click",
  function() {

    renderActivitiesManager();

    activitiesModal.classList.add(
      "active"
    );

  }
);


closeActivitiesModal.addEventListener(
  "click",
  closeActivitiesManager
);


activitiesModal.addEventListener(
  "click",
  function(e) {

    if (
      e.target ===
      activitiesModal
    ) {

      closeActivitiesManager();

    }

  }
);


function closeActivitiesManager() {

  activitiesModal.classList.remove(
    "active"
  );

}


/* =========================================================
   LISTA ATTIVITÀ
========================================================= */

function renderActivitiesManager() {

  activitiesList.innerHTML = "";


  if (!activities.length) {

    activitiesList.innerHTML = `
      <div style="
        padding: 20px;
        text-align: center;
        color: #888;
        font-size: 13px;
      ">
        Nessuna attività.
      </div>
    `;


    return;

  }


  activities.forEach(
    activity => {

      const item =
        document.createElement("div");


      item.className =
        "activity-manager-item";


      item.innerHTML = `

        <div class="activity-manager-icon">
          ${escapeHTML(activity.icon)}
        </div>

        <div class="activity-manager-info">

          <strong>
            ${escapeHTML(activity.name)}
          </strong>

          <span>
            ${countActivityEvents(activity.id)}
            impegni
          </span>

        </div>

        <div class="activity-manager-actions">

          <button
            type="button"
            class="edit-activity"
            title="Modifica"
          >
            ✎
          </button>

          <button
            type="button"
            class="remove-activity"
            title="Elimina"
          >
            ×
          </button>

        </div>

      `;


      item
        .querySelector(".edit-activity")
        .addEventListener(
          "click",
          function() {

            openEditActivity(
              activity
            );

          }
        );


      item
        .querySelector(".remove-activity")
        .addEventListener(
          "click",
          function() {

            removeActivity(
              activity
            );

          }
        );


      activitiesList.appendChild(item);

    }
  );

}


function countActivityEvents(
  activityId
) {

  return events.filter(
    event =>
      event.type === activityId
  ).length;

}


/* =========================================================
   NUOVA ATTIVITÀ
========================================================= */

addActivityBtn.addEventListener(
  "click",
  function() {

    openNewActivity();

  }
);


function openNewActivity() {

  editingActivityId = null;


  activityFormTitle.textContent =
    "Aggiungi attività";


  activityName.value =
    "";


  activityIcon.value =
    "";


  updateActivityPreview();


  activitiesModal.classList.remove(
    "active"
  );


  activityFormModal.classList.add(
    "active"
  );


  setTimeout(
    () =>
      activityName.focus(),
    100
  );

}


/* =========================================================
   MODIFICA ATTIVITÀ
========================================================= */

function openEditActivity(
  activity
) {

  editingActivityId =
    activity.id;


  activityFormTitle.textContent =
    "Modifica attività";


  activityName.value =
    activity.name;


  activityIcon.value =
    activity.icon;


  updateActivityPreview();


  activitiesModal.classList.remove(
    "active"
  );


  activityFormModal.classList.add(
    "active"
  );


  setTimeout(
    () =>
      activityName.focus(),
    100
  );

}


/* =========================================================
   PREVIEW
========================================================= */

activityName.addEventListener(
  "input",
  updateActivityPreview
);


activityIcon.addEventListener(
  "input",
  updateActivityPreview
);


function updateActivityPreview() {

  activityPreviewName.textContent =
    activityName.value.trim() ||
    "Nuova attività";


  activityPreviewIcon.textContent =
    activityIcon.value.trim() ||
    "📌";

}


/* =========================================================
   SALVA ATTIVITÀ
========================================================= */

activityForm.addEventListener(
  "submit",
  function(e) {

    e.preventDefault();


    const name =
      activityName.value.trim();


    const icon =
      activityIcon.value.trim() ||
      "📌";


    if (!name) {
      return;
    }


    if (editingActivityId) {

      const activity =
        getActivityById(
          editingActivityId
        );


      if (activity) {

        activity.name =
          name;


        activity.icon =
          icon;

      }

    } else {

      activities.push({

        id:
          generateId("activity"),

        name,

        icon,

        color:
          getNextColor()

      });

    }


    saveActivities();

    render();

    closeActivityFormModal();

    renderActivitiesManager();

    activitiesModal.classList.add(
      "active"
    );

  }
);


/* =========================================================
   CHIUSURA FORM ATTIVITÀ
========================================================= */

closeActivityForm.addEventListener(
  "click",
  closeActivityFormModal
);


cancelActivityBtn.addEventListener(
  "click",
  closeActivityFormModal
);


activityFormModal.addEventListener(
  "click",
  function(e) {

    if (
      e.target ===
      activityFormModal
    ) {

      closeActivityFormModal();

    }

  }
);


function closeActivityFormModal() {

  activityFormModal.classList.remove(
    "active"
  );


  editingActivityId = null;

}


/* =========================================================
   ELIMINA ATTIVITÀ
========================================================= */

function removeActivity(
  activity
) {

  const activityEvents =
    events.filter(
      event =>
        event.type ===
        activity.id
    );


  let message =
    `Vuoi eliminare "${activity.name}"?`;


  if (activityEvents.length) {

    message +=
      `\n\nQuesta attività contiene ${activityEvents.length} impegni. Verranno eliminati anche questi impegni.`;

  }


  const confirmed =
    confirm(message);


  if (!confirmed) {
    return;
  }


  activities =
    activities.filter(
      item =>
        item.id !==
        activity.id
    );


  events =
    events.filter(
      event =>
        event.type !==
        activity.id
    );


  const prefix =
    `${activity.id}-`;


  unavailableCells =
    unavailableCells.filter(
      key =>
        !key.startsWith(prefix)
    );


  saveActivities();

  saveEvents();

  saveUnavailableCells();

  render();

  renderActivitiesManager();

}


/* =========================================================
   COLORI AUTOMATICI
========================================================= */

function getNextColor() {

  const colors = [
    "blue",
    "pink",
    "yellow",
    "gray",
    "orange",
    "purple",
    "green"
  ];


  const usedColors =
    activities.map(
      activity =>
        activity.color
    );


  const availableColor =
    colors.find(
      color =>
        !usedColors.includes(color)
    );


  return (
    availableColor ||
    colors[
      activities.length %
      colors.length
    ]
  );

}


/* =========================================================
   BACKUP — ESPORTA
========================================================= */

function exportBackup() {

  const backup = {

    version: 1,

    app: "MY ROUTINE",

    exportedAt:
      new Date().toISOString(),

    activities,

    events,

    unavailableCells

  };


  const json =
    JSON.stringify(
      backup,
      null,
      2
    );


  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  const date =
    new Date()
      .toISOString()
      .slice(0, 10);


  link.href =
    url;


  link.download =
    `my-routine-backup-${date}.json`;


  document.body.appendChild(link);


  link.click();


  link.remove();


  setTimeout(
    function() {

      URL.revokeObjectURL(url);

    },
    1000
  );

}


/* =========================================================
   BACKUP — IMPORTA
========================================================= */

function importBackupFile(file) {

  if (!file) {
    return;
  }


  const reader =
    new FileReader();


  reader.onload =
    function() {

      try {

        const imported =
          JSON.parse(
            reader.result
          );


        if (
          !validateBackup(imported)
        ) {

          alert(
            "Il file selezionato non è un backup valido di MY ROUTINE."
          );


          return;

        }


        const confirmed =
          confirm(
            "Importando questo backup, la tua settimana attuale verrà sostituita.\n\nVuoi continuare?"
          );


        if (!confirmed) {
          return;
        }


        activities =
          imported.activities;


        events =
          imported.events;


        unavailableCells =
          imported.unavailableCells;


        saveActivities();

        saveEvents();

        saveUnavailableCells();

        render();


        closeDataModal();


        alert(
          "Backup importato correttamente."
        );

      } catch {

        alert(
          "Impossibile leggere il backup. Il file potrebbe essere danneggiato."
        );

      }

    };


  reader.onerror =
    function() {

      alert(
        "Non è stato possibile leggere il file."
      );

    };


  reader.readAsText(file);

}


/* =========================================================
   VALIDAZIONE BACKUP
========================================================= */

function validateBackup(backup) {

  if (
    !backup ||
    typeof backup !== "object"
  ) {

    return false;

  }


  if (
    !Array.isArray(
      backup.activities
    )
  ) {

    return false;

  }


  if (
    !Array.isArray(
      backup.events
    )
  ) {

    return false;

  }


  if (
    !Array.isArray(
      backup.unavailableCells
    )
  ) {

    return false;

  }


  const activitiesValid =
    backup.activities.every(
      activity =>
        activity &&
        typeof activity.id === "string" &&
        typeof activity.name === "string" &&
        typeof activity.icon === "string" &&
        typeof activity.color === "string"
    );


  if (!activitiesValid) {
    return false;
  }


  const eventsValid =
    backup.events.every(
      event =>
        event &&
        typeof event.id === "string" &&
        typeof event.type === "string" &&
        typeof event.day === "number" &&
        typeof event.title === "string" &&
        typeof event.start === "string" &&
        typeof event.end === "string"
    );


  if (!eventsValid) {
    return false;
  }


  const unavailableValid =
    backup.unavailableCells.every(
      item =>
        typeof item === "string"
    );


  if (!unavailableValid) {
    return false;
  }


  return true;

}


/* =========================================================
   MODAL DATI
========================================================= */

openDataBtn.addEventListener(
  "click",
  function() {

    dataModal.classList.add(
      "active"
    );

  }
);


closeDataModalBtn.addEventListener(
  "click",
  closeDataModal
);


dataModal.addEventListener(
  "click",
  function(e) {

    if (
      e.target === dataModal
    ) {

      closeDataModal();

    }

  }
);


function closeDataModal() {

  dataModal.classList.remove(
    "active"
  );

}


/* ESPORTA */

exportDataBtn.addEventListener(
  "click",
  function() {

    exportBackup();

  }
);


/* IMPORTA */

importDataBtn.addEventListener(
  "click",
  function() {

    importFileInput.click();

  }
);


importFileInput.addEventListener(
  "change",
  function() {

    const file =
      importFileInput.files[0];


    if (file) {

      importBackupFile(file);

    }


    importFileInput.value =
      "";

  }
);


/* =========================================================
   ESC
========================================================= */

document.addEventListener(
  "keydown",
  function(e) {

    if (e.key !== "Escape") {
      return;
    }


    if (
      modal.classList.contains("active")
    ) {

      closeEventModal();

      return;

    }


    if (
      activityFormModal.classList.contains(
        "active"
      )
    ) {

      closeActivityFormModal();

      return;

    }


    if (
      activitiesModal.classList.contains(
        "active"
      )
    ) {

      closeActivitiesManager();

      return;

    }


    if (
      dataModal.classList.contains("active")
    ) {

      closeDataModal();

    }

  }
);


/* =========================================================
   AVVIO
========================================================= */

saveActivities();

render();
