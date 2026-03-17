const USERS_KEY = "authUsers";
const LOGGED_IN_KEY = "loggedInUser";
const PROFILE_KEY = "studentProfiles";

async function hashPassword(password) {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const buffer = await crypto.subtle.digest("SHA-256", data);
	return Array.from(new Uint8Array(buffer))
		.map(function (byte) {
			return byte.toString(16).padStart(2, "0");
		})
		.join("");
}

function getProfiles() {
	const rawProfiles = localStorage.getItem(PROFILE_KEY);
	if (!rawProfiles) {
		return {};
	}

	try {
		const parsed = JSON.parse(rawProfiles);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch (error) {
		return {};
	}
}

function saveProfiles(profiles) {
	localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles));
}

function createDefaultProfile(username) {
	return {
		nim: "18223118",
		name: username,
		faculty: "Faculty of Informatics",
		studyProgram: "Computer Science",
		className: "IF-46-09",
		admissionYear: "2023",
		advisor: "Dr. R. Prasetyo, M.T.",
		ipk: "3.78",
		ips: "3.84",
		sks: "104",
		avatar: "assets/images/avatar-default.jpg"
	};
}

function setTextById(id, value) {
	const element = document.getElementById(id);
	if (element && typeof value !== "undefined") {
		element.textContent = value;
	}
}

async function isPasswordMatch(user, inputPassword) {
	if (!user || !inputPassword) {
		return false;
	}

	if (user.passwordHash) {
		const inputHash = await hashPassword(inputPassword);
		return user.passwordHash === inputHash;
	}

	return user.password === inputPassword;
}

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
	const emailInput = document.getElementById("registerEmail");
	const passwordInput = document.getElementById("registerPassword");
	const messageElement = document.getElementById("registerMessage");

	registerForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		const username = usernameInput.value.trim();
		const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
		const password = passwordInput.value.trim();

		if (!username || !email || !password) {
			setMessage(messageElement, "Username, email, and password are required.", "error");
			return;
		}

		if (!email.includes("@")) {
			setMessage(messageElement, "Please enter a valid email address.", "error");
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

		const passwordHash = await hashPassword(password);
		users.push({ username: username, email: email, passwordHash: passwordHash });
		saveUsers(users);

		const profiles = getProfiles();
		if (!profiles[username]) {
			profiles[username] = createDefaultProfile(username);
			saveProfiles(profiles);
		}

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

	loginForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		const username = usernameInput.value.trim();
		const password = passwordInput.value.trim();
		const users = getUsers();

		if (users.length === 0) {
			setMessage(messageElement, "No account found. Please register first.", "error");
			return;
		}

		const userByUsername = users.find(function (user) {
			return user.username === username;
		});

		if (!userByUsername) {
			setMessage(messageElement, "Login failed. Username or password is incorrect.", "error");
			return;
		}

		const passwordMatched = await isPasswordMatch(userByUsername, password);
		const matchedUser = passwordMatched ? userByUsername : null;

		if (!matchedUser) {
			setMessage(messageElement, "Login failed. Username or password is incorrect.", "error");
			return;
		}

		if (!matchedUser.passwordHash && matchedUser.password) {
			// Migrate old plaintext account to hashed password after successful login.
			matchedUser.passwordHash = await hashPassword(matchedUser.password);
			delete matchedUser.password;
			saveUsers(users);
		}

		localStorage.setItem(LOGGED_IN_KEY, matchedUser.username);
		setMessage(messageElement, "Login successful. Redirecting to profile...", "success");

		setTimeout(function () {
			window.location.href = "profile.html";
		}, 700);
	});
}

function handleForgotPage() {
	const forgotForm = document.getElementById("forgotForm");
	if (!forgotForm) {
		return;
	}

	const usernameInput = document.getElementById("forgotUsername");
	const emailInput = document.getElementById("forgotEmail");
	const newPasswordInput = document.getElementById("newPassword");
	const confirmPasswordInput = document.getElementById("confirmNewPassword");
	const verifyButton = document.getElementById("verifyAccountButton");
	const resetSection = document.getElementById("resetPasswordSection");
	const messageElement = document.getElementById("forgotMessage");

	let verifiedUsername = "";

	verifyButton.addEventListener("click", function () {
		const username = usernameInput.value.trim();
		const email = emailInput.value.trim().toLowerCase();
		const users = getUsers();

		if (!username || !email) {
			setMessage(messageElement, "Username and email are required for verification.", "error");
			return;
		}

		const matchedUser = users.find(function (user) {
			return user.username === username;
		});

		if (!matchedUser) {
			setMessage(messageElement, "Account not found.", "error");
			return;
		}

		if (!matchedUser.email || matchedUser.email.toLowerCase() !== email) {
			setMessage(messageElement, "Email verification failed.", "error");
			return;
		}

		verifiedUsername = username;
		resetSection.classList.remove("hidden");
		setMessage(messageElement, "Email verified. You can now reset your password.", "success");
	});

	forgotForm.addEventListener("submit", async function (event) {
		event.preventDefault();

		if (!verifiedUsername) {
			setMessage(messageElement, "Verify your account first.", "error");
			return;
		}

		const newPassword = newPasswordInput.value.trim();
		const confirmPassword = confirmPasswordInput.value.trim();

		if (!newPassword || !confirmPassword) {
			setMessage(messageElement, "New password and confirmation are required.", "error");
			return;
		}

		if (newPassword.length < 6) {
			setMessage(messageElement, "Password must be at least 6 characters.", "error");
			return;
		}

		if (newPassword !== confirmPassword) {
			setMessage(messageElement, "Password confirmation does not match.", "error");
			return;
		}

		const users = getUsers();
		const matchedUser = users.find(function (user) {
			return user.username === verifiedUsername;
		});

		if (!matchedUser) {
			setMessage(messageElement, "Account not found.", "error");
			return;
		}

		matchedUser.passwordHash = await hashPassword(newPassword);
		delete matchedUser.password;
		saveUsers(users);

		setMessage(messageElement, "Password reset successful. Redirecting to login...", "success");
		forgotForm.reset();
		resetSection.classList.add("hidden");
		verifiedUsername = "";

		setTimeout(function () {
			window.location.href = "login.html";
		}, 900);
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

	const profiles = getProfiles();
	if (!profiles[loggedInUser]) {
		profiles[loggedInUser] = createDefaultProfile(loggedInUser);
		saveProfiles(profiles);
	}

	const currentProfile = profiles[loggedInUser];
	setTextById("nimValue", currentProfile.nim);
	setTextById("profileName", currentProfile.name);
	setTextById("facultyValue", currentProfile.faculty);
	setTextById("programValue", currentProfile.studyProgram);
	setTextById("classValue", currentProfile.className);
	setTextById("admissionYearValue", currentProfile.admissionYear);
	setTextById("advisorValue", currentProfile.advisor);
	setTextById("ipkValue", currentProfile.ipk);
	setTextById("ipsValue", currentProfile.ips);
	setTextById("sksValue", currentProfile.sks);

	const studentAvatar = document.getElementById("studentAvatar");
	if (studentAvatar && currentProfile.avatar) {
		studentAvatar.src = currentProfile.avatar;
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
handleForgotPage();
handleProfilePage();
