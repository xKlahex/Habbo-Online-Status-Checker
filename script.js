const form = document.getElementById('habbo-form');
const input = document.getElementById('habbo-name');
const sound = document.getElementById('notification-sound');
const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('=')).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

form.addEventListener('submit', (event) => {
	event.preventDefault();

	const habboName = input.value;
	const cookieName = 'habboUsers';
	const cookieValue = cookies[cookieName] ? `${cookies[cookieName]},${habboName}` : habboName;

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
		})
		.finally(() => {
			document.cookie = `${cookieName}=${cookieValue}`;
			input.value = '';
		});
});

Object.values(cookies.habboUsers.split(',')).forEach(habboName => {
	fetch(`https://www.habbo.com/api/public/users?name=${habboName}`)
		.then(response => response.json())
		.then(data => {
			if (data.online) {
				showStatus(`${habboName} is online!`, 'online');
			} else {
				showStatus(`${habboName} is offline.`, 'offline');
			}
		}).catch(error => {
	showStatus(`An error occurred while checking status. Please try again.`, 'error');
});

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

function getSavedUsernames() {
	const cookieValue = document.cookie
		.split('; ')
		.find(row => row.startsWith('savedUsernames='))
		?.split('=')[1];
	return cookieValue ? cookieValue.split(',') : [];
}


function saveUsernamesToCookie(usernames) {
	document.cookie = `savedUsernames=${usernames.join(',')}`;
}


function watchSavedUsernames() {
	const savedUsernames = getSavedUsernames();
	savedUsernames.forEach(username => {
		fetch(`https://www.habbo.com/api/public/users?name=${username}`)
			.then(response => response.json())
			.then(data => {
				if (data.online) {
					showStatus(`${username} is online!`, 'online');
					sound.play();
				} else {
					showStatus(`${username} is offline.`, 'offline');
				}
			})
			.catch(error => {
				showStatus(`An error occurred while checking status for ${username}. Please try again.`, 'error');
			});
	});
}


setInterval(() => {
	watchSavedUsernames();
}, 15000);


window.onload = function() {
	watchSavedUsernames();
}


form.addEventListener('submit', (event) => {
	event.preventDefault();
	const habboName = input.value.trim();
	if (habboName === '') {
		alert('Please enter a valid Habbo name.');
		return;
	}

	const savedUsernames = getSavedUsernames();
	if (savedUsernames.includes(habboName)) {
		alert('This Habbo name is already being tracked.');
		return;
	}

	savedUsernames.push(habboName);
	saveUsernamesToCookie(savedUsernames);

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
			showStatus(`An error occurred while checking status for ${habboName}. Please try again.`, 'error');
		});

	input.value = '';
});

		
