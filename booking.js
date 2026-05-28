// Multi-step booking form
const steps = document.querySelectorAll('.booking-step');
const progressSteps = document.querySelectorAll('.progress-step');
const progressLines = document.querySelectorAll('.progress-line');
let currentStep = 1;

// Pre-select service from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const preSelectedService = urlParams.get('service');
if (preSelectedService) {
    const checkbox = document.querySelector(`input[name="service"][value="${preSelectedService}"]`);
    if (checkbox) {
        checkbox.checked = true;
    }
}

function showStep(stepNum) {
    steps.forEach(step => step.classList.remove('active'));
    const target = document.getElementById(`step${stepNum}`);
    if (target) {
        target.classList.add('active');
    }

    // Update progress
    progressSteps.forEach((ps, index) => {
        ps.classList.remove('active', 'completed');
        if (index + 1 === stepNum) {
            ps.classList.add('active');
        } else if (index + 1 < stepNum) {
            ps.classList.add('completed');
        }
    });

    progressLines.forEach((line, index) => {
        if (index + 1 < stepNum) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });

    currentStep = stepNum;

    // Populate confirmation on step 4
    if (stepNum === 4) {
        populateConfirmation();
    }
}

// Next buttons
document.querySelectorAll('.next-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const nextStep = parseInt(btn.dataset.next);
        showStep(nextStep);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    });
});

// Previous buttons
document.querySelectorAll('.prev-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const prevStep = parseInt(btn.dataset.prev);
        showStep(prevStep);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    });
});

// Populate confirmation
function populateConfirmation() {
    // Services
    const checked = document.querySelectorAll('input[name="service"]:checked');
    const services = Array.from(checked).map(cb => {
        return cb.closest('.service-select-card').querySelector('h4').textContent;
    });
    document.getElementById('confirmServices').textContent = services.length > 0 ? services.join(', ') : '—';

    // Vehicle
    const type = document.getElementById('vehicleType');
    const brand = document.querySelector('#step2 input[placeholder*="Hyundai"]');
    const model = document.querySelector('#step2 input[placeholder*="Creta"]');
    if (type && brand && model) {
        const vehicleText = `${type.options[type.selectedIndex]?.text || ''} — ${brand.value} ${model.value}`.trim();
        document.getElementById('confirmVehicle').textContent = vehicleText || '—';
    }

    // Date & Time
    const date = document.getElementById('bookingDate');
    const time = document.getElementById('bookingTime');
    if (date && time) {
        const dateText = date.value ? new Date(date.value).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '';
        const timeText = time.options[time.selectedIndex]?.text || '';
        document.getElementById('confirmDate').textContent = `${dateText} • ${timeText}` || '—';
    }

    // Location
    const location = document.querySelector('#step3 input[placeholder*="address"]');
    if (location) {
        document.getElementById('confirmLocation').textContent = location.value || '—';
    }
}

// Submit booking
document.getElementById('submitBooking').addEventListener('click', () => {
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;

    if (!name || !phone) {
        alert('Please fill in your name and phone number.');
        return;
    }

    // Hide all steps and show success
    steps.forEach(step => step.classList.remove('active'));
    document.getElementById('stepSuccess').style.display = 'block';
    document.getElementById('stepSuccess').classList.add('active');

    // Hide progress
    document.querySelector('.booking-progress').style.display = 'none';
});
