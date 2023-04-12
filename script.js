const clearNamesBtn = document.getElementById('clear-habbo-names');
clearNamesBtn.addEventListener('click', (event) => {
  // clear localStorage
  localStorage.removeItem('habboNames');
  // clear savedNames array
  savedNames = [];
  // remove all status messages
  const statusDivs = document.querySelectorAll('.status-message');
  statusDivs.forEach((div) => div.remove());
  // update names container
  updateNamesContainer();
  // reload page after 0.5 seconds
  setTimeout(() => {
    location.reload();
  }, 100);
});

const form = document.getElementById('habbo-form');
const input = document.getElementById('habbo-name');
const sound = document.getElementById('notification-sound');
let savedNames = [];

window.addEventListener('load', () => {
  if (localStorage.getItem('habboNames')) {
    savedNames = JSON.parse(localStorage.getItem('habboNames'));
    savedNames.forEach(habboName => {
      checkStatus(habboName);
    });
    updateNamesContainer();
  }
  setTimeout(startInterval, 15000);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const habboName = input.value.trim();
  if (habboName !== '' && !savedNames.includes(habboName)) {
    savedNames.push(habboName);
    localStorage.setItem('habboNames', JSON.stringify(savedNames));
    checkStatus(habboName);
    updateNamesContainer();
  }
  input.value = '';
});

function updateNamesContainer() {
  const namesContainer = document.getElementById('names-container');
  namesContainer.innerHTML = '';

  savedNames.forEach(name => {
    const nameDiv = document.createElement('div');
    nameDiv.textContent = name;
    namesContainer.appendChild(nameDiv);
  });
}

function checkStatus(habboName) {
  fetch(`https://www.habbo.com/api/public/users?name=${habboName}`)
    .then(response => response.json())
    .then(data => {
      if (data.online) {
        showStatus(`${habboName} is online!`, 'online');
        sound.play();
      } else {
        showStatus(`${habboName} is offline.`, 'offline');
      }
    })
    .catch(error => {
      showStatus(`An error occurred while checking status. Please try again.`, 'error');
    });
}

function startInterval() {
  setInterval(() => {
    savedNames.forEach(habboName => {
      checkStatus(habboName);
    });
  }, 15000);
}

function showStatus(message, status) {
  const statusDiv = document.createElement('div');
  statusDiv.textContent = message;

  if (status === 'online') {
    statusDiv.classList.add('online-status');
  } else if (status === 'offline') {
    statusDiv.classList.add('offline-status');
  } else if (status === 'error') {
    statusDiv.classList.add('error-status');
  }

  form.appendChild(statusDiv);
}

