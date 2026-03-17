const USERS_KEY = "authUsers";
const LOGGED_IN_KEY = "loggedInUser";

function getUsers() {
	const rawUsers = localStorage.getItem(USERS_KEY);
	if (!rawUsers) {
		return [];
	}

	try {
		const parsed = JSON.parse(rawUsers);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		return [];
	}
}

function saveUsers(users) {
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setMessage(element, message, type) {
	if (!element) {
		return;
	}

	element.textContent = message;
	element.classList.remove("error", "success");

	if (type) {
		element.classList.add(type);
	}
}

function handleRegisterPage() {
	const registerForm = document.getElementById("registerForm");
	if (!registerForm) {
		return;
	}

	const usernameInput = document.getElementById("registerUsername");
	const passwordInput = document.getElementById("registerPassword");
	const messageElement = document.getElementById("registerMessage");

	registerForm.addEventListener("submit", function (event) {
		event.preventDefault();

		const username = usernameInput.value.trim();
		const password = passwordInput.value.trim();

		if (!username || !password) {
			setMessage(messageElement, "Username and password are required.", "error");
			return;
		}

		const users = getUsers();
		const exists = users.some(function (user) {
			return user.username === username;
		});

		if (exists) {
			setMessage(messageElement, "Username already exists. Use another username.", "error");
			return;
		}

		users.push({ username: username, password: password });
		saveUsers(users);

		setMessage(messageElement, "Registration successful. Redirecting to login...", "success");
		registerForm.reset();

		setTimeout(function () {
			window.location.href = "login.html";
		}, 900);
	});
}

function handleLoginPage() {
	const loginForm = document.getElementById("loginForm");
	if (!loginForm) {
		return;
	}

	const usernameInput = document.getElementById("loginUsername");
	const passwordInput = document.getElementById("loginPassword");
	const messageElement = document.getElementById("loginMessage");

	loginForm.addEventListener("submit", function (event) {
		event.preventDefault();

		const username = usernameInput.value.trim();
		const password = passwordInput.value.trim();
		const users = getUsers();

		if (users.length === 0) {
			setMessage(messageElement, "No account found. Please register first.", "error");
			return;
		}

		const matchedUser = users.find(function (user) {
			return user.username === username && user.password === password;
		});

		if (!matchedUser) {
			setMessage(messageElement, "Login failed. Username or password is incorrect.", "error");
			return;
		}

		localStorage.setItem(LOGGED_IN_KEY, matchedUser.username);
		setMessage(messageElement, "Login successful. Redirecting to profile...", "success");

		setTimeout(function () {
			window.location.href = "profile.html";
		}, 700);
	});
}

function handleProfilePage() {
	const profileName = document.getElementById("profileName");
	if (!profileName) {
		return;
	}

	const loggedInUser = localStorage.getItem(LOGGED_IN_KEY);
	if (!loggedInUser) {
		window.location.href = "login.html";
		return;
	}

	profileName.textContent = loggedInUser;

	const navbarUsername = document.getElementById("navbarUsername");
	if (navbarUsername) {
		navbarUsername.textContent = loggedInUser;
	}

	if (typeof Chart !== "undefined") {
		const gpaChartCanvas = document.getElementById("gpaChart");
		if (gpaChartCanvas) {
			new Chart(gpaChartCanvas, {
				type: "line",
				data: {
					labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"],
					datasets: [
						{
							label: "GPA",
							data: [3.45, 3.55, 3.63, 3.72, 3.79, 3.84],
							borderColor: "#0284c7",
							backgroundColor: "rgba(2, 132, 199, 0.18)",
							fill: true,
							tension: 0.35,
							pointRadius: 3
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							display: true
						}
					},
					scales: {
						y: {
							min: 2.5,
							max: 4,
							ticks: {
								stepSize: 0.25
							}
						}
					}
				}
			});
		}

		const attendanceChartCanvas = document.getElementById("attendanceChart");
		if (attendanceChartCanvas) {
			new Chart(attendanceChartCanvas, {
				type: "pie",
				data: {
					labels: ["Present", "Excused", "Sick", "Absent"],
					datasets: [
						{
							data: [82, 8, 6, 4],
							backgroundColor: ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"]
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							position: "bottom"
						}
					}
				}
			});
		}
	}

	const logoutButton = document.getElementById("logoutButton");
	if (logoutButton) {
		logoutButton.addEventListener("click", function () {
			localStorage.removeItem(LOGGED_IN_KEY);
			window.location.href = "login.html";
		});
	}
}

handleRegisterPage();
handleLoginPage();
handleProfilePage();
