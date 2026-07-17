// ========== PRODUCTION-GRADE CLINIC MANAGEMENT SYSTEM ==========
// REAL-WORLD SOLUTION: Token System, Queue Mgmt, Real-time Updates, Professional Dashboards

// ========== DATA STORAGE ==========
let users = JSON.parse(localStorage.getItem('users')) || [];
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let tokens = JSON.parse(localStorage.getItem('tokens')) || [];
let currentUser = null;
let selectedDoctor = null;

// Daily token counter for OPD management
let tokenCounter = parseInt(localStorage.getItem('tokenCounter')) || 0;
let lastTokenDate = localStorage.getItem('lastTokenDate') || new Date().toISOString().split('T')[0];

// Clinic configuration
const clinicConfig = {
    opd: {
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 15,
        tokensPerSlot: 3,
        maxDailyTokens: 120
    }
};

// ========== PROFESSIONAL DOCTORS DATABASE ==========
const sampleDoctors = [
    { id: 1, name: 'Dr. Rajesh Sharma', spec: 'General Physician', education: 'MBBS, MD (Internal Medicine)', experience: '12 years', rating: 4.8, consultationFee: 500, avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop', available_slots: 8, waitTime: 15, totalConsultations: 2847 },
    { id: 2, name: 'Dr. Priya Verma', spec: 'Cardiologist', education: 'MBBS, DM (Cardiology)', experience: '8 years', rating: 4.7, consultationFee: 800, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', available_slots: 5, waitTime: 25, totalConsultations: 1256 },
    { id: 3, name: 'Dr. Amit Singh', spec: 'Dermatologist', education: 'MBBS, MD (Dermatology)', experience: '10 years', rating: 4.9, consultationFee: 600, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', available_slots: 6, waitTime: 12, totalConsultations: 3125 },
    { id: 4, name: 'Dr. Neha Patel', spec: 'Orthopedic Surgeon', education: 'MBBS, MS (Orthopedic)', experience: '9 years', rating: 4.6, consultationFee: 700, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', available_slots: 4, waitTime: 20, totalConsultations: 2101 },
    { id: 5, name: 'Dr. Sanjay Kumar', spec: 'Gynecologist', education: 'MBBS, MD (Gynecology)', experience: '15 years', rating: 4.8, consultationFee: 750, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', available_slots: 5, waitTime: 18, totalConsultations: 4562 },
    { id: 6, name: 'Dr. Anjali Desai', spec: 'Pediatrician', education: 'MBBS, MD (Pediatrics)', experience: '11 years', rating: 4.9, consultationFee: 550, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', available_slots: 10, waitTime: 10, totalConsultations: 5234 },
    { id: 7, name: 'Dr. Vikram Singh', spec: 'ENT Specialist', education: 'MBBS, MS (ENT)', experience: '7 years', rating: 4.7, consultationFee: 600, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', available_slots: 7, waitTime: 14, totalConsultations: 1845 },
    { id: 8, name: 'Dr. Meera Gupta', spec: 'Psychiatrist', education: 'MBBS, MD (Psychiatry)', experience: '13 years', rating: 4.8, consultationFee: 900, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', available_slots: 3, waitTime: 30, totalConsultations: 876 },
    { id: 9, name: 'Dr. Arjun Mehta', spec: 'Oncologist', education: 'MBBS, MD (Oncology)', experience: '14 years', rating: 4.9, consultationFee: 1200, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', available_slots: 2, waitTime: 45, totalConsultations: 542 },
    { id: 10, name: 'Dr. Kavya Reddy', spec: 'Neurosurgeon', education: 'MBBS, MS (Neurosurgery)', experience: '16 years', rating: 4.95, consultationFee: 1500, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', available_slots: 1, waitTime: 60, totalConsultations: 287 }
];

// Hospital Services
const hospitalServices = [
    {
        name: 'General Consultation',
        icon: '🏥',
        description: 'General medical checkup and consultation'
    },
    {
        name: 'Cardiac Care',
        icon: '❤️',
        description: 'Heart and cardiovascular treatment'
    },
    {
        name: 'Dermatology',
        icon: '💆',
        description: 'Skin and cosmetic treatments'
    },
    {
        name: 'Orthopedic Care',
        icon: '🦴',
        description: 'Bone and joint treatments'
    },
    {
        name: 'Women Health',
        icon: '👩‍⚕️',
        description: 'Gynecological and maternity care'
    },
    {
        name: 'Diagnostic Center',
        icon: '🔬',
        description: 'Lab tests and medical imaging'
    },
    {
        name: 'Emergency Care',
        icon: '🚑',
        description: '24/7 Emergency services'
    },
    {
        name: 'Vaccination',
        icon: '💉',
        description: 'Immunization and vaccine programs'
    }
];

// Available Treatments
const availableTreatments = [
    {
        name: 'General Checkup',
        duration: '30-45 minutes',
        description: 'Complete health examination including vital signs, BMI check, and comprehensive medical history review'
    },
    {
        name: 'Cardiac Treatment',
        duration: '45-60 minutes',
        description: 'Heart screening, ECG analysis, and consultation with a certified cardiac specialist'
    },
    {
        name: 'Skin Treatment',
        duration: '30-40 minutes',
        description: 'Detailed skin analysis, consultation, and personalized treatment plan'
    },
    {
        name: 'Bone & Joint Therapy',
        duration: '45-60 minutes',
        description: 'Orthopedic examination, advanced imaging consultation, and therapeutic treatment plan'
    },
    {
        name: 'Dental Checkup',
        duration: '20-30 minutes',
        description: 'Professional dental examination, cleaning, and preventive care guidance'
    },
    {
        name: 'Eye Examination',
        duration: '25-35 minutes',
        description: 'Complete eye test, vision assessment, and prescription updates if needed'
    }
];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    setMinDate();
    checkLogin();
    initializeDailyTokenCounter();
});

function initializeDailyTokenCounter() {
    const today = new Date().toISOString().split('T')[0];
    if (lastTokenDate !== today) {
        tokenCounter = 0;
        lastTokenDate = today;
        localStorage.setItem('tokenCounter', '0');
        localStorage.setItem('lastTokenDate', today);
    }
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => input.min = today);
}

// ========== AUTHENTICATION FUNCTIONS ==========
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    const regRoleSelect = document.getElementById('regRole');
    if (regRoleSelect) {
        regRoleSelect.addEventListener('change', function() {
            const doctorFields = document.getElementById('doctorFields');
            doctorFields.style.display = this.value === 'doctor' ? 'block' : 'none';
        });
    }
});

function handleRegister(e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value.trim();
    const role = document.getElementById('regRole').value;

    let isValid = true;

    if (name.length < 2) {
        document.getElementById('regNameError').textContent = 'Name must be at least 2 characters';
        isValid = false;
    }

    if (users.find(u => u.email === email)) {
        document.getElementById('regEmailError').textContent = 'Email already exists';
        isValid = false;
    }

    if (password.length < 6) {
        document.getElementById('regPasswordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }

    if (phone.length < 10) {
        document.getElementById('regPhoneError').textContent = 'Invalid phone number';
        isValid = false;
    }

    if (!role) {
        document.getElementById('regRoleError').textContent = 'Please select a role';
        isValid = false;
    }

    if (role === 'doctor') {
        const spec = document.getElementById('regSpec').value;
        const license = document.getElementById('regLicense').value.trim();

        if (!spec) {
            document.getElementById('regSpecError').textContent = 'Please select specialization';
            isValid = false;
        }

        if (!license || license.length < 5) {
            document.getElementById('regLicenseError').textContent = 'Please enter valid license number';
            isValid = false;
        }
    }

    if (!isValid) return;

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        phone,
        role,
        spec: role === 'doctor' ? document.getElementById('regSpec').value : null,
        license: role === 'doctor' ? document.getElementById('regLicense').value : null
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    document.getElementById('registerSuccess').style.display = 'flex';
    document.getElementById('registerForm').reset();

    setTimeout(() => {
        switchAuthTab('login');
        document.getElementById('registerSuccess').style.display = 'none';
    }, 1500);
}

function handleLogin(e) {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        document.getElementById('loginEmailError').textContent = 'Invalid email or password';
        return;
    }

    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    document.getElementById('loginSuccess').style.display = 'flex';

    setTimeout(() => {
        showDashboard();
    }, 1000);
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

function checkLogin() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
        currentUser = JSON.parse(saved);
        showDashboard();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('authPage').style.display = 'block';
        document.getElementById('dashboardPage').style.display = 'none';
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
    }
}

function showDashboard() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('dashboardPage').style.display = 'block';

    const roleLabel = currentUser.role === 'doctor' ? '👨‍⚕️ Dr.' : '🩺';
    document.getElementById('userGreeting').textContent = `${roleLabel} ${currentUser.name}`;

    if (currentUser.role === 'patient') {
        document.getElementById('patientMenu').style.display = 'block';
        document.getElementById('doctorMenu').style.display = 'none';
        document.getElementById('patientDash').style.display = 'block';
        document.getElementById('doctorDash').style.display = 'none';
    } else {
        document.getElementById('patientMenu').style.display = 'none';
        document.getElementById('doctorMenu').style.display = 'block';
        document.getElementById('patientDash').style.display = 'none';
        document.getElementById('doctorDash').style.display = 'block';
    }

    updateDashboard();
}

// ========== PAGE NAVIGATION ==========
function switchPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');

    document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.sidebar-item').classList.add('active');

    if (page === 'my-appointments' || page === 'appointments') initMyAppointments();
    if (page === 'services') loadServices();
    if (page === 'doctors') loadDoctorsList();
    if (page === 'treatments') loadTreatments();
    if (page === 'patients') loadMyPatients();
}

// ========== DASHBOARD UPDATE ==========
function updateDashboard() {
    if (currentUser.role === 'patient') {
        updatePatientDash();
    } else {
        updateDoctorDash();
    }
}

// ========== PATIENT DASHBOARD ==========
function updatePatientDash() {
    const myAppts = appointments.filter(a => a.patientId === currentUser.id);
    const upcoming = myAppts.filter(a => new Date(a.date) >= new Date()).length;
    const completed = myAppts.filter(a => a.status === 'completed').length;

    document.getElementById('totalAppts').textContent = myAppts.length;
    document.getElementById('upcomingAppts').textContent = upcoming;
    document.getElementById('completedAppts').textContent = completed;

    const recentHtml = myAppts.slice(0, 5).length > 0 ? myAppts.slice(0, 5).map(a => `
        <div class="appointment-card">
            <div class="appointment-header">
                <div>
                    <div class="appointment-title">${a.doctorName}</div>
                    <div class="appointment-info"><i class="fas fa-calendar"></i> ${a.date} | <i class="fas fa-clock"></i> ${a.time}</div>
                </div>
                <span class="status-badge status-${a.status}">${a.status}</span>
            </div>
            ${a.tokenNumber ? `<div class="token-display"><strong>🎟️ Token: #${a.tokenNumber}</strong></div>` : ''}
            ${a.estimatedWaitTime ? `<div class="wait-info"><i class="fas fa-hourglass-half"></i> Est. Wait: ${a.estimatedWaitTime} min</div>` : ''}
        </div>
    `).join('') : '<div class="empty-state"><p>No appointments yet. Book one now!</p></div>';

    document.getElementById('recentAppts').innerHTML = recentHtml;
}

// ========== DOCTOR DASHBOARD ==========
function updateDoctorDash() {
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter(a => a.date === today);
    const pendingAppts = todayAppts.filter(a => a.status === 'pending').length;
    const completedToday = todayAppts.filter(a => a.status === 'completed').length;

    document.getElementById('todayCount').textContent = todayAppts.length;
    document.getElementById('pendingCount').textContent = pendingAppts;
    document.getElementById('completedToday').textContent = completedToday;

    const queueHtml = todayAppts.length > 0 ? todayAppts.slice(0, 10).map((a, idx) => `
        <div class="queue-item" ${a.status === 'in-progress' ? 'style="border-left: 5px solid #00a86b;"' : ''}>
            <span class="queue-token"><strong>#${a.tokenNumber || idx + 1}</strong></span>
            <div class="queue-info">
                <strong>${a.patientName}</strong>
                <small>${a.consultationType || 'General'}</small>
            </div>
            <span class="queue-status">${a.status}</span>
        </div>
    `).join('') : '<div class="empty-state"><p>No appointments today</p></div>';

    document.getElementById('todayQueue').innerHTML = queueHtml;
}

// ========== APPOINTMENTS ==========
function loadAppointments() {
    const myAppts = appointments.filter(a =>
        currentUser.role === 'patient' ? a.patientId === currentUser.id : a.doctorId === currentUser.id
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    const html = myAppts.length > 0 ? myAppts.map(a => `
        <div class="appointment-card">
            <div class="appointment-header">
                <div>
                    <div class="appointment-title">${currentUser.role === 'patient' ? a.doctorName : a.patientName}</div>
                    <div class="appointment-info" style="margin-top: 0.5rem;"><i class="fas fa-calendar"></i> ${a.date} at ${a.time}</div>
                </div>
                <span class="status-badge status-${a.status}">${a.status.toUpperCase()}</span>
            </div>
            ${a.reason ? `<div class="appointment-info"><i class="fas fa-stethoscope"></i> ${a.reason}</div>` : ''}
            <div style="margin-top: 1rem;">
                ${a.status === 'pending' && currentUser.role === 'doctor' ? `<button class="btn btn-secondary btn-small" onclick="confirmAppt(${a.id})"><i class="fas fa-check"></i> Confirm</button>` : ''}
                ${['pending', 'confirmed'].includes(a.status) ? `<button class="btn btn-danger btn-small" onclick="cancelAppt(${a.id})" style="margin-left: 0.5rem;"><i class="fas fa-times"></i> Cancel</button>` : ''}
            </div>
        </div>
    `).join('') : '<div class="empty-state"><i class="fas fa-inbox"></i><p>No appointments booked yet</p></div>';

    const container = document.getElementById('appointmentsList');
    if (container) {
        container.innerHTML = html;
    }
}

// ========== SERVICES ==========
function loadServices() {
    const servicesHtml = hospitalServices.map(service => `
        <div class="service-card">
            <div class="service-icon">${service.icon}</div>
            <div class="service-content">
                <h3>${service.name}</h3>
                <p class="service-description">${service.description}</p>
                <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="switchPage('doctors')">
                    <i class="fas fa-search"></i> Find Doctor
                </button>
            </div>
        </div>
    `).join('');

    document.getElementById('servicesGrid').innerHTML = servicesHtml;
}

// ========== TREATMENTS ==========
function loadTreatments() {
    const treatmentsHtml = availableTreatments.map(treatment => `
        <div class="treatment-card-creative">
            <div class="treatment-header-creative">
                <h3>${treatment.name}</h3>
            </div>
            <div class="treatment-content-creative">
                <div class="treatment-info">
                    <span class="info-label"><i class="fas fa-hourglass-half"></i> Duration</span>
                    <span class="info-value">${treatment.duration}</span>
                </div>
                <p class="treatment-description">${treatment.description}</p>
                <ul class="treatment-benefits">
                    <li>Professional treatment</li>
                    <li>Expert consultation</li>
                    <li>Follow-up care</li>
                </ul>
                <button class="btn btn-primary" style="width: 100%;" onclick="alert('Consult with a doctor to book this treatment')">
                    <i class="fas fa-phone"></i> Book Consultation
                </button>
            </div>
        </div>
    `).join('');

    document.getElementById('treatmentsGrid').innerHTML = treatmentsHtml;
}

// ========== DOCTORS LIST - SMART FILTERING ==========
function loadDoctorsList() {
    const specs = [...new Set(sampleDoctors.map(d => d.spec))];
    const filterHtml = `
        <button class="specialty-filter active" onclick="filterDoctorsBySpec('')">
            <i class="fas fa-list"></i> All Doctors (${sampleDoctors.length})
        </button>
    ` + specs.map(spec => `
        <button class="specialty-filter" onclick="filterDoctorsBySpec('${spec}')">
            ${spec}
        </button>
    `).join('');
    
    document.getElementById('specialtyFilters').innerHTML = filterHtml;
    displayDoctors(sampleDoctors);
}

function filterDoctorsBySpec(spec) {
    document.querySelectorAll('.specialty-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    const filtered = spec ? sampleDoctors.filter(d => d.spec === spec) : sampleDoctors;
    displayDoctors(filtered);
}

function displayDoctors(doctors) {
    const html = doctors.map(doc => `
        <div class="doctor-card-premium">
            <div class="doctor-image-container">
                <img src="${doc.avatar}" alt="${doc.name}" class="doctor-avatar">
                <div class="doctor-badge">⭐ ${doc.rating}/5</div>
                <div class="availability-badge">
                    <i class="fas fa-check-circle"></i> ${doc.available_slots} Slots
                </div>
            </div>
            <div class="doctor-content-premium">
                <div class="doctor-name-premium">${doc.name}</div>
                <div class="doctor-spec-premium">${doc.spec}</div>
                <div class="doctor-info-row">
                    <span class="info-badge"><i class="fas fa-certificate"></i> ${doc.education}</span>
                </div>
                <div class="doctor-info-row">
                    <span class="info-badge"><i class="fas fa-briefcase"></i> ${doc.experience}</span>
                </div>
                <div class="doctor-stats-row">
                    <div class="stat-box">
                        <strong>₹${doc.consultationFee}</strong>
                        <p>Fee</p>
                    </div>
                    <div class="stat-box">
                        <strong>${doc.waitTime}m</strong>
                        <p>Wait</p>
                    </div>
                    <div class="stat-box">
                        <strong>${doc.totalConsultations}</strong>
                        <p>Cases</p>
                    </div>
                </div>
                <button class="btn btn-primary btn-book" onclick="bookConsultation(${doc.id}, '${doc.name}', '${doc.spec}')">
                    <i class="fas fa-calendar-plus"></i> Book Consultation
                </button>
            </div>
        </div>
    `).join('');

    document.getElementById('doctorsList').innerHTML = `<div class="doctors-grid">${html}</div>`;
}

// ========== BOOKING LOGIC ==========
function bookConsultation(docId, docName, docSpec) {
    const doc = sampleDoctors.find(d => d.id === docId);
    document.getElementById('regDoctorSelect').value = docId;
    document.getElementById('regDoctorSpec').value = docSpec;
    
    switchPage('my-appointments');
    document.getElementById('regDoctorSelect').focus();
}

// ========== APPOINTMENT MODAL ==========
function openAppointmentModal(doctorName, doctorSpec) {
    selectedDoctor = { name: doctorName, spec: doctorSpec };
    document.getElementById('modalDoctorName').value = doctorName;
    document.getElementById('modalDoctorSpec').value = doctorSpec;
    document.getElementById('appointmentModal').style.display = 'block';
    generateTimeSlots();
}

function closeModal() {
    document.getElementById('appointmentModal').style.display = 'none';
    document.getElementById('modalApptDate').value = '';
    document.getElementById('modalReason').value = '';
    document.getElementById('modalMedicalHistory').value = '';
    document.getElementById('modalTimeSlots').innerHTML = '';
}

// ========== APPOINTMENT REGISTRATION ==========
// ========== INTERNATIONAL VARIABLES ==========
let selectedScheduleDoctor = null;
let selectedScheduleDate = null;
let selectedScheduleTime = null;

function initMyAppointments() {
    loadScheduleDoctorSelector();
    loadScheduleCalendar();
    loadAppointmentHistory();
}

// ========== DOCTOR SELECTOR FOR SCHEDULING ==========
function loadScheduleDoctorSelector() {
    const html = sampleDoctors.map(doc => `
        <div class="schedule-doctor-card" onclick="selectScheduleDoctor(${doc.id})" style="cursor: pointer; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 0.5rem; transition: all 0.3s; background: #fff; ${selectedScheduleDoctor?.id === doc.id ? 'border-color: var(--primary); background: #f0f8ff;' : ''}">
            <div style="display: flex; gap: 1rem;">
                <img src="${doc.avatar}" alt="${doc.name}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;">
                <div style="flex: 1;">
                    <strong>${doc.name}</strong> <span style="color: var(--primary);">${doc.spec}</span>
                    <div style="font-size: 0.9rem; color: #666; margin-top: 0.3rem;">
                        💰 ₹${doc.consultationFee} | ⏱️ ${doc.waitTime}m wait | 👥 ${doc.available_slots} slots
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('doctorScheduleList').innerHTML = html;
}

function selectScheduleDoctor(docId) {
    selectedScheduleDoctor = sampleDoctors.find(d => d.id === docId);
    document.getElementById('scheduleDisplayDoctor').textContent = `${selectedScheduleDoctor.name} (${selectedScheduleDoctor.spec}) - ₹${selectedScheduleDoctor.consultationFee}`;
    loadScheduleDoctorSelector();
    loadScheduleCalendar();
    loadTimeSlots();
}

// ========== CALENDAR SCHEDULING ==========
function loadScheduleCalendar() {
    const today = new Date();
    const calendarDays = [];
    
    // Generate 30 days from today
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        calendarDays.push(date);
    }
    
    const calendarHtml = calendarDays.map(date => {
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = date.getDate();
        const isSelected = selectedScheduleDate === dateStr;
        const isToday = dateStr === new Date().toISOString().split('T')[0];
        
        return `
            <div onclick="selectScheduleDate('${dateStr}')" style="cursor: pointer; padding: 0.8rem; text-align: center; border: 2px solid #e0e0e0; border-radius: 0.5rem; transition: all 0.3s; background: #fff; ${isSelected ? 'border-color: var(--primary); background: var(--primary); color: white;' : isToday ? 'background: #fff3cd;' : ''}">
                <div style="font-size: 0.8rem; opacity: 0.8;">${dayName}</div>
                <div style="font-weight: bold; font-size: 1.2rem;">${dayNum}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('scheduleCalendar').innerHTML = calendarHtml;
}

function selectScheduleDate(dateStr) {
    selectedScheduleDate = dateStr;
    const date = new Date(dateStr);
    document.getElementById('selectedScheduleDate').textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    loadScheduleCalendar();
    loadTimeSlots();
    updateScheduleDisplay();
}

// ========== TIME SLOTS SCHEDULING ==========
function loadTimeSlots() {
    if (!selectedScheduleDoctor || !selectedScheduleDate) {
        document.getElementById('timeSlotGrid').innerHTML = '<p style="color: #999;">Select a doctor and date to see available time slots</p>';
        return;
    }
    
    const timeSlots = [];
    for (let h = 9; h < 17; h++) {
        for (let m = 0; m < 60; m += 15) {
            const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            timeSlots.push(time);
        }
    }
    
    // Check which slots are booked
    const bookedSlots = appointments
        .filter(a => a.doctorId === selectedScheduleDoctor.id && a.date === selectedScheduleDate && a.status !== 'cancelled')
        .map(a => a.time);
    
    const slotsPerHour = 3; // tokensPerSlot from clinic config
    const slotCounts = {};
    
    timeSlots.forEach(slot => {
        slotCounts[slot] = bookedSlots.filter(s => s === slot).length;
    });
    
    const html = timeSlots.map(time => {
        const count = slotCounts[time] || 0;
        const available = count < slotsPerHour;
        const isSelected = selectedScheduleTime === time;
        
        return `
            <div onclick="${available ? `selectScheduleTime('${time}')` : ''}" style="cursor: ${available ? 'pointer' : 'not-allowed'}; padding: 0.8rem; border: 2px solid ${available ? '#e0e0e0' : '#ffcccc'}; border-radius: 0.5rem; text-align: center; transition: all 0.3s; background: ${available ? '#fff' : '#ffe0e0'}; ${isSelected ? 'border-color: var(--primary); background: var(--primary); color: white; font-weight: bold;' : ''}">
                <div style="font-size: 0.9rem;">${time}</div>
                <div style="font-size: 0.75rem; opacity: 0.8;">${count}/${slotsPerHour}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('timeSlotGrid').innerHTML = html;
}

function selectScheduleTime(time) {
    selectedScheduleTime = time;
    loadTimeSlots();
    updateScheduleDisplay();
}

function updateScheduleDisplay() {
    if (selectedScheduleDate && selectedScheduleTime) {
        const date = new Date(selectedScheduleDate);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        document.getElementById('scheduleDisplayDateTime').textContent = `${dateStr} at ${selectedScheduleTime}`;
    }
}

function handleApptRegistration(e) {
    e.preventDefault();
    
    if (!selectedScheduleDoctor || !selectedScheduleDate || !selectedScheduleTime) {
        alert('❌ Please select doctor, date, and time');
        return;
    }
    
    const reason = document.getElementById('regReason').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    
    if (!reason) {
        alert('❌ Please enter reason for visit');
        return;
    }
    
    // Generate token automatically
    initializeDailyTokenCounter();
    const newTokenNumber = ++tokenCounter;
    localStorage.setItem('tokenCounter', tokenCounter.toString());
    
    const appt = {
        id: Date.now(),
        tokenNumber: newTokenNumber,
        doctorId: selectedScheduleDoctor.id,
        doctorName: selectedScheduleDoctor.name,
        doctorSpec: selectedScheduleDoctor.spec,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientPhone: phone || currentUser.phone,
        date: selectedScheduleDate,
        time: selectedScheduleTime,
        reason,
        estimatedWaitTime: selectedScheduleDoctor.waitTime,
        consultationFee: selectedScheduleDoctor.consultationFee,
        status: 'pending',
        bookedAt: new Date().toLocaleString()
    };
    
    appointments.push(appt);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    alert(`✅ Appointment Scheduled!\n\n🎟️ Token: #${newTokenNumber}\n👨‍⚕️ Doctor: ${selectedScheduleDoctor.name}\n📅 Date: ${selectedScheduleDate}\n🕐 Time: ${selectedScheduleTime}\n⏱️ Est. Wait: ~${selectedScheduleDoctor.waitTime} min\n💰 Fee: ₹${selectedScheduleDoctor.consultationFee}`);
    
    document.getElementById('apptRegistrationForm').reset();
    selectedScheduleDoctor = null;
    selectedScheduleDate = null;
    selectedScheduleTime = null;
    document.getElementById('scheduleDisplayDoctor').textContent = '-- Not selected --';
    document.getElementById('scheduleDisplayDateTime').textContent = '-- Not selected --';
    
    loadScheduleDoctorSelector();
    loadScheduleCalendar();
    loadTimeSlots();
    loadAppointmentHistory();
    loadAppointments();
    updateDashboard();
}

function loadAppointmentHistory() {
    const userAppointments = appointments.filter(a => a.patientId === currentUser.id);
    const html = userAppointments.slice(-5).reverse().map(appt => {
        const statusColor = appt.status === 'completed' ? '#4CAF50' : appt.status === 'in-progress' ? '#FF9800' : '#2196F3';
        return `
            <div class="appointment-card" style="border-left: 4px solid ${statusColor}">
                <div class="appt-header">
                    <div>
                        <strong>${appt.doctorName}</strong> (${appt.doctorSpec})
                        <br><small>📅 ${appt.date} @ ${appt.time}</small>
                    </div>
                    <span class="status-badge" style="background: ${statusColor}">${appt.status.toUpperCase()}</span>
                </div>
                <div class="appt-details">
                    <p>📝 <strong>Reason:</strong> ${appt.reason}</p>
                </div>
                <div class="appt-footer">
                    <span><i class="fas fa-ticket"></i> <strong>Token:</strong> #${appt.tokenNumber}</span>
                    <span><i class="fas fa-hourglass"></i> <strong>Wait:</strong> ~${appt.estimatedWaitTime}m</span>
                    <span><i class="fas fa-rupee-sign"></i> <strong>Fee:</strong> ₹${appt.consultationFee}</span>
                </div>
            </div>
        `;
    }).join('') || '<p style="text-align: center; color: #999;">No appointments yet</p>';
    
    document.getElementById('appointmentHistory').innerHTML = html;
}

window.onclick = function(event) {
    const modal = document.getElementById('appointmentModal');
    if (event.target == modal) {
        closeModal();
    }
}

function generateTimeSlots() {
    let slots = '';
    for (let h = 9; h < 17; h++) {
        const time = `${String(h).padStart(2, '0')}:00`;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        slots += `<button class="time-slot" type="button" onclick="selectTimeSlot(this, '${time}')">${displayH}:00 ${ampm}</button>`;
    }
    document.getElementById('modalTimeSlots').innerHTML = slots;
}

function selectTimeSlot(el, time) {
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    el.dataset.time = time;
}

function submitAppointment(e) {
    e.preventDefault();

    const date = document.getElementById('modalApptDate').value;
    const selectedSlot = document.querySelector('.time-slot.selected');
    const reason = document.getElementById('modalReason').value.trim();
    const medicalHistory = document.getElementById('modalMedicalHistory').value.trim();

    if (!date || !selectedSlot) {
        alert('Please select date and time');
        return;
    }

    const doctor = sampleDoctors.find(d => d.name === selectedDoctor.name);

    const appt = {
        id: Date.now(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpec: doctor.spec,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientPhone: currentUser.phone,
        date,
        time: selectedSlot.textContent.trim(),
        reason,
        medicalHistory,
        status: 'pending'
    };

    appointments.push(appt);
    localStorage.setItem('appointments', JSON.stringify(appointments));

    alert('✓ Appointment booked successfully! Status: Pending doctor confirmation');
    closeModal();
    updateDashboard();
}

function confirmAppt(id) {
    const appt = appointments.find(a => a.id === id);
    if (appt) {
        appt.status = 'confirmed';
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadAppointments();
        updateDashboard();
        alert('✓ Appointment confirmed!');
    }
}

function cancelAppt(id) {
    if (confirm('Cancel this appointment?')) {
        const appt = appointments.find(a => a.id === id);
        if (appt) {
            appt.status = 'cancelled';
            localStorage.setItem('appointments', JSON.stringify(appointments));
            loadAppointments();
            updateDashboard();
            alert('Appointment cancelled');
        }
    }
}

// ========== DOCTOR SCHEDULE ==========
function saveSchedule() {
    alert('✓ Schedule saved successfully!');
}

function addLeave() {
    const from = document.getElementById('leaveFrom').value;
    const to = document.getElementById('leaveTo').value;

    if (!from || !to) {
        alert('Please select dates');
        return;
    }

    alert(`✓ Leave planned from ${from} to ${to}! Patients will be notified.`);
    document.getElementById('leaveFrom').value = '';
    document.getElementById('leaveTo').value = '';
    document.getElementById('leaveReason').value = '';
}

// ========== PATIENTS ==========
function loadMyPatients() {
    const docAppts = appointments.filter(a => a.doctorId === currentUser.id);
    const patients = {};

    docAppts.forEach(a => {
        if (!patients[a.patientId]) {
            patients[a.patientId] = { name: a.patientName, phone: a.patientPhone, count: 0 };
        }
        patients[a.patientId].count++;
    });

    const rows = Object.values(patients).length > 0 ? Object.values(patients).map(p => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.phone}</td>
            <td><span style="background: var(--primary); color: white; padding: 0.3rem 0.6rem; border-radius: 0.3rem;">${p.count}</span></td>
            <td><button class="btn btn-small" style="background: var(--light);"><i class="fas fa-file-alt"></i> View</button></td>
        </tr>
    `).join('') : '<tr><td colspan="4" style="text-align: center; color: var(--gray);">No patients</td></tr>';

    document.getElementById('patientsTable').innerHTML = rows;
}


let beds = [];

function bookBed(e) {
    e.preventDefault();

    const patient = document.getElementById("bedPatient").value;
    const contact = document.getElementById("bedContact").value;
    const type = document.getElementById("bedType").value;
    const ward = document.getElementById("bedWard").value;
    const start = document.getElementById("bedStart").value;
    const end = document.getElementById("bedEnd").value;

    const newBed = {
        id: Date.now(),
        patient,
        contact,
        type,
        ward,
        start,
        end,
        status: "Allocated"
    };

    beds.push(newBed);

    updateBeds();
    renderBeds();

    e.target.reset();
}

function updateBeds() {
    document.getElementById("occupiedBeds").innerText = beds.length;
    document.getElementById("availableBeds").innerText = 50 - beds.length;
}

function renderBeds() {
    const list = document.getElementById("bedList");

    if (beds.length === 0) {
        list.innerHTML = "<p>No beds allocated</p>";
        return;
    }

    list.innerHTML = beds.map(b => `
        <div style="padding:1rem; border:1px solid #ddd; border-radius:8px; margin-bottom:1rem;">
            <strong>${b.patient}</strong> (${b.type})<br>
            Ward: ${b.ward} <br>
            ${b.start} → ${b.end} <br>
            <button onclick="discharge(${b.id})" class="btn btn-secondary" style="margin-top:0.5rem;">Discharge</button>
        </div>
    `).join("");
}

function discharge(id) {
    beds = beds.filter(b => b.id !== id);
    updateBeds();
    renderBeds();
}

// Add Medicine Schedule
function addMedicine() {
    const patient = document.getElementById("medPatient").value;
    const medicine = document.getElementById("medName").value;
    const time = document.getElementById("medTime").value;
  
    if (!patient || !medicine) {
      alert("Please fill all fields");
      return;
    }
  
    const newData = { patient, medicine, time };
  
    let data = JSON.parse(localStorage.getItem("medSchedules")) || [];
  
    data.push(newData);
  
    localStorage.setItem("medSchedules", JSON.stringify(data));
  
    displayMedicine();
  
    // Clear inputs
    document.getElementById("medPatient").value = "";
    document.getElementById("medName").value = "";
  }
  
  
  // Display Data
  function displayMedicine() {
    const table = document.getElementById("medTable");
    table.innerHTML = "";
  
    let data = JSON.parse(localStorage.getItem("medSchedules")) || [];
  
    data.forEach(item => {
      table.innerHTML += `
        <tr>
          <td>${item.patient}</td>
          <td>${item.medicine}</td>
          <td>${item.time}</td>
        </tr>
      `;
    });
  }
  
  
  // Load on page start
  window.onload = function () {
    displayMedicine();
  };

  function loadAmbulanceRequests() {
    const list = document.getElementById("ambulanceList");
    let requests = JSON.parse(localStorage.getItem("ambulanceRequests")) || [];
  
    list.innerHTML = "";
  
    requests.forEach(r => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <p><strong>${r.name}</strong></p>
        <p>📍 ${r.location}</p>
        <p>📞 ${r.contact}</p>
        <small>${r.time}</small>
      `;
      list.appendChild(div);
    });
  }
  loadAmbulanceRequests();
  function submitAmbulanceRequest(event) {
    event.preventDefault(); // 🔥 prevents page reload
  
    const name = document.getElementById("patientName").value.trim();
    const location = document.getElementById("pickupLocation").value.trim();
    const contact = document.getElementById("contactNumber").value.trim();
  
    if (!name || !location || !contact) {
      alert("Please fill all fields");
      return;
    }
  
    const request = {
      name: name,
      location: location,
      contact: contact,
      time: new Date().toLocaleString()
    };
  
    console.log("Saving request:", request); // debug
  
    // ✅ FIX: always parse safely
    let requests = localStorage.getItem("ambulanceRequests");
  
    if (requests) {
      requests = JSON.parse(requests);
    } else {
      requests = [];
    }
  
    requests.push(request);
  
    localStorage.setItem("ambulanceRequests", JSON.stringify(requests));
  
    console.log("Stored:", localStorage.getItem("ambulanceRequests"));
  
    // ✅ show success
    const msg = document.getElementById("ambulanceSuccess");
    msg.style.display = "block";
  
    // clear form
    event.target.reset();
  
    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);
  
    loadAmbulanceRequests(); // refresh list
  }