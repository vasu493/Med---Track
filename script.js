let medicationList = JSON.parse(localStorage.getItem('medications')) || [];
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let selectedSymptoms = [];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#6e48aa'
                },
                shape: {
                    type: 'circle',
                },
                opacity: {
                    value: 0.5,
                    random: false,
                },
                size: {
                    value: 3,
                    random: true,
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6e48aa',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }

    // Initialize Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Initialize Medicine Tracking Form
    const medForm = document.getElementById('med-form');
    
    if (medForm) {
        medForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const medName = document.getElementById('med-name').value;
            const dosage = document.getElementById('dosage').value;
            const time = document.getElementById('time').value;
            
            addMedication(medName, dosage, time);
            
            // Reset form
            medForm.reset();
        });
    }
    
    // Load saved medications
    loadMedications();
    
    // Initialize AI Doctor Section
    const doctorSpecialty = document.getElementById('doctor-specialty');
    
    if (doctorSpecialty) {
        doctorSpecialty.addEventListener('change', function() {
            loadDoctors(this.value);
        });
    }
    
    // Initialize Symptom Pills
    const symptomPills = document.querySelectorAll('.symptom-pill');
    
    symptomPills.forEach(pill => {
        pill.addEventListener('click', function() {
            this.classList.toggle('selected');
            const symptom = this.getAttribute('data-symptom');
            
            if (this.classList.contains('selected')) {
                // Add to selected symptoms
                selectedSymptoms.push(symptom);
            } else {
                // Remove from selected symptoms
                const index = selectedSymptoms.indexOf(symptom);
                if (index > -1) {
                    selectedSymptoms.splice(index, 1);
                }
            }
            
            // Update health issue textarea
            updateHealthIssueText();
        });
    });
    
    // Initialize AI Consultation Form
    const aiForm = document.getElementById('ai-form');
    
    if (aiForm) {
        aiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const healthIssue = document.getElementById('health-issue').value;
            
            if (healthIssue.trim() !== '') {
                consultAIDoctor(healthIssue);
            }
        });
    }
    
    // Initialize Medicine Order - Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(name, price, 1);
            showNotification(`${name} added to your cart!`);
        });
    });
    
    // Initialize Custom Medicine Order Form
    const orderForm = document.getElementById('order-form');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const medName = document.getElementById('order-name').value;
            const quantity = document.getElementById('order-qty').value;
            
            // You could set a default price or calculate based on medicine
            const price = 8.99; // Default price
            
            addToCart(medName, price, parseInt(quantity));
            showNotification(`${medName} added to your cart!`);
            
            // Reset form
            orderForm.reset();
        });
    }
    
    // Initialize Prescription Toggle
    const prescriptionRequired = document.getElementById('prescription-required');
    const prescriptionUpload = document.getElementById('prescription-upload');
    
    if (prescriptionRequired && prescriptionUpload) {
        prescriptionRequired.addEventListener('change', function() {
            if (this.value === 'yes') {
                prescriptionUpload.style.display = 'block';
            } else {
                prescriptionUpload.style.display = 'none';
            }
        });
    }
    
    // Initialize Checkout Button
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Process checkout - in a real app, this would go to payment processing
            alert('Proceeding to checkout! In a real application, this would take you to the payment page.');
        });
    }
    
    // Load cart items
    loadCartItems();
});

// Function to add medication to the tracking list
function addMedication(name, dosage, time) {
    const medication = {
        id: Date.now(), // Unique ID using timestamp
        name: name,
        dosage: dosage,
        time: time
    };
    
    medicationList.push(medication);
    
    // Save to localStorage
    localStorage.setItem('medications', JSON.stringify(medicationList));
    
    // Add to display
    displayMedication(medication);
    
    // Show notification
    showNotification('Medicine added to your tracking list!');
}

// Function to display medication in the list
function displayMedication(medication) {
    const medList = document.getElementById('med-list');
    
    if (!medList) return;
    
    const medItem = document.createElement('div');
    medItem.className = 'med-item';
    medItem.setAttribute('data-id', medication.id);
    
    const timeFormatted = formatTime(medication.time);
    
    medItem.innerHTML = `
        <div class="med-info">
            <h4>${medication.name}</h4>
            <p><i class="fas fa-weight"></i> ${medication.dosage} mg | <i class="far fa-clock"></i> ${timeFormatted}</p>
        </div>
        <div class="med-actions">
            <button class="btn-take" data-id="${medication.id}"><i class="fas fa-check"></i></button>
            <button class="btn-delete" data-id="${medication.id}"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    medList.appendChild(medItem);
    
    // Add event listeners
    medItem.querySelector('.btn-take').addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        takeMedication(id);
    });
    
    medItem.querySelector('.btn-delete').addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        deleteMedication(id);
    });
}

// Function to format time display (convert 24h to 12h format)
function formatTime(time24h) {
    const [hours, minutes] = time24h.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes} ${period}`;
}

// Function to mark medication as taken
function takeMedication(id) {
    const medItem = document.querySelector(`.med-item[data-id="${id}"]`);
    
    if (medItem) {
        medItem.classList.add('taken');
        showNotification('Medicine marked as taken!');
        
        // In a real app, you might want to save this state or set a timer until next dose
    }
}

// Function to delete medication
function deleteMedication(id) {
    const medItem = document.querySelector(`.med-item[data-id="${id}"]`);
    
    if (medItem) {
        medItem.remove();
        
        // Remove from array
        medicationList = medicationList.filter(med => med.id != id);
        
        // Update localStorage
        localStorage.setItem('medications', JSON.stringify(medicationList));
        
        showNotification('Medicine removed from your tracking list!');
    }
}

// Function to load saved medications
function loadMedications() {
    const medList = document.getElementById('med-list');
    
    if (!medList) return;
    
    // Clear existing items
    medList.innerHTML = '';
    
    // Add saved medications
    medicationList.forEach(medication => {
        displayMedication(medication);
    });
}

// Function to load doctors based on specialty
function loadDoctors(specialty) {
    const doctorList = document.getElementById('doctor-list');
    
    if (!doctorList) return;
    
    // Clear existing items
    doctorList.innerHTML = '';
    
    if (specialty === '') {
        return;
    }
    
    // Mock data for doctors
    const doctors = {
        'General Physician': [
            { name: 'Dr. Sarah Johnson', rating: 4.8, experience: '12 years' },
            { name: 'Dr. Michael Chen', rating: 4.7, experience: '8 years' }
        ],
        'Cardiologist': [
            { name: 'Dr. Robert Smith', rating: 4.9, experience: '15 years' },
            { name: 'Dr. Emma Davis', rating: 4.8, experience: '10 years' }
        ],
        'Dermatologist': [
            { name: 'Dr. Jessica Lee', rating: 4.9, experience: '9 years' },
            { name: 'Dr. David Wilson', rating: 4.7, experience: '12 years' }
        ],
        'Neurologist': [
            { name: 'Dr. James Brown', rating: 4.9, experience: '14 years' },
            { name: 'Dr. Linda Martinez', rating: 4.8, experience: '11 years' }
        ],
        'Pediatrician': [
            { name: 'Dr. Maria Rodriguez', rating: 4.9, experience: '10 years' },
            { name: 'Dr. John Williams', rating: 4.8, experience: '8 years' }
        ]
    };
    
    // Display doctors based on specialty
    if (doctors[specialty]) {
        doctors[specialty].forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card';
            
            doctorCard.innerHTML = `
                <div class="doctor-info">
                    <h4>${doctor.name}</h4>
                    <p><i class="fas fa-star"></i> ${doctor.rating} | <i class="fas fa-history"></i> ${doctor.experience}</p>
                </div>
                <button class="btn btn-small select-doctor"><i class="fas fa-user-md"></i> Select</button>
            `;
            
            doctorList.appendChild(doctorCard);
            
            // Add event listener
            doctorCard.querySelector('.select-doctor').addEventListener('click', function() {
                // Mark as selected
                document.querySelectorAll('.doctor-card').forEach(card => {
                    card.classList.remove('selected');
                });
                
                doctorCard.classList.add('selected');
                
                // You could store the selected doctor info for the consultation
            });
        });
    }
}

// Function to update health issue textarea based on selected symptoms
function updateHealthIssueText() {
    const healthIssue = document.getElementById('health-issue');
    
    if (!healthIssue) return;
    
    if (selectedSymptoms.length > 0) {
        const currentText = healthIssue.value;
        
        // Only add if symptoms aren't already in the text
        if (!selectedSymptoms.some(symptom => currentText.includes(symptom))) {
            const symptomsText = 'I am experiencing ' + selectedSymptoms.join(', ') + '.';
            
            if (currentText.trim() === '') {
                healthIssue.value = symptomsText;
            } else {
                healthIssue.value = symptomsText + ' ' + currentText;
            }
        }
    }
}

// Function to consult AI Doctor
function consultAIDoctor(issue) {
    const aiResponse = document.getElementById('ai-response');
    
    if (!aiResponse) return;
    
    // Show loading
    aiResponse.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Analyzing your symptoms...</div>';
    
    // Simulate AI processing time
    setTimeout(() => {
        // Mock AI response based on symptoms
        let response = '';
        
        if (issue.toLowerCase().includes('fever') || issue.toLowerCase().includes('cough') || 
            issue.toLowerCase().includes('sore throat') || issue.toLowerCase().includes('runny nose')) {
            response = `
                <div class="ai-response-card">
                    <h3><i class="fas fa-robot"></i> AI Doctor Analysis</h3>
                    <p class="diagnosis"><strong>Possible Condition:</strong> Common Cold or Seasonal Flu</p>
                    <p>Based on your symptoms, you may be experiencing a common cold or seasonal flu. These are viral infections that usually resolve on their own within 7-10 days.</p>
                    <h4>Recommendations:</h4>
                    <ul>
                        <li>Rest and drink plenty of fluids</li>
                        <li>Take over-the-counter medications like Paracetamol to reduce fever and relieve pain</li>
                        <li>Use a humidifier to ease congestion</li>
                        <li>Gargle with salt water for sore throat</li>
                    </ul>
                    <p class="warning"><i class="fas fa-exclamation-triangle"></i> Seek immediate medical attention if you experience difficulty breathing, persistent high fever, or severe symptoms.</p>
                    <div class="related-medicines">
                        <h4>Recommended Medicines:</h4>
                        <div class="medicine-pills">
                            <div class="medicine-pill">Paracetamol</div>
                            <div class="medicine-pill">Cough Syrup</div>
                            <div class="medicine-pill">Vitamin C</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (issue.toLowerCase().includes('headache') || issue.toLowerCase().includes('migraine')) {
            response = `
                <div class="ai-response-card">
                    <h3><i class="fas fa-robot"></i> AI Doctor Analysis</h3>
                    <p class="diagnosis"><strong>Possible Condition:</strong> Tension Headache or Migraine</p>
                    <p>Based on your symptoms, you may be experiencing a tension headache or possibly a migraine. Tension headaches are often caused by stress, dehydration, or poor posture.</p>
                    <h4>Recommendations:</h4>
                    <ul>
                        <li>Rest in a quiet, dark room</li>
                        <li>Stay hydrated and maintain regular meal times</li>
                        <li>Apply a cold or warm compress to your head</li>
                        <li>Practice stress management techniques</li>
                    </ul>
                    <p class="warning"><i class="fas fa-exclamation-triangle"></i> Seek immediate medical attention if you experience sudden severe headache, headache with fever, neck stiffness, or confusion.</p>
                    <div class="related-medicines">
                        <h4>Recommended Medicines:</h4>
                        <div class="medicine-pills">
                            <div class="medicine-pill">Paracetamol</div>
                            <div class="medicine-pill">Ibuprofen</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            response = `
                <div class="ai-response-card">
                    <h3><i class="fas fa-robot"></i> AI Doctor Analysis</h3>
                    <p>Based on the information provided, I would need more specific details about your symptoms to provide an accurate analysis.</p>
                    <p>Please consider the following:</p>
                    <ul>
                        <li>How long have you been experiencing these symptoms?</li>
                        <li>Are there any specific triggers that worsen your condition?</li>
                        <li>Do you have any existing medical conditions?</li>
                        <li>Are you currently taking any medications?</li>
                    </ul>
                    <p class="warning"><i class="fas fa-exclamation-triangle"></i> This is a preliminary assessment. For persistent or severe symptoms, please consult with a healthcare professional.</p>
                </div>
            `;
        }
        
        aiResponse.innerHTML = response;
        
        // Add event listeners to recommended medicine pills
        const medicinePills = aiResponse.querySelectorAll('.medicine-pill');
        
        medicinePills.forEach(pill => {
            pill.addEventListener('click', function() {
                // Add to cart
                addToCart(this.textContent, 7.99, 1);
                showNotification(`${this.textContent} added to your cart!`);
            });
        });
    }, 2000);
}

// Function to add item to cart
function addToCart(name, price, quantity) {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.name === name);
    
    if (existingItem) {
        // Update quantity
        existingItem.quantity += quantity;
    } else {
        // Add new item
        cartItems.push({
            id: Date.now(),
            name: name,
            price: price,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update display
    loadCartItems();
}

// Function to load cart items
function loadCartItems() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (!cartItemsElement || !cartSummary || !cartTotal || !checkoutBtn) return;
    
    // Clear existing items
    cartItemsElement.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsElement.innerHTML = '<p>Your cart is empty.</p>';
        cartSummary.style.display = 'none';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    // Calculate total
    let total = 0;
    
    // Add cart items
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-total">$${itemTotal.toFixed(2)}</span>
                <button class="btn-delete-cart" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        cartItemsElement.appendChild(cartItem);
        
        // Add event listener
        cartItem.querySelector('.btn-delete-cart').addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            removeFromCart(id);
        });
    });
    
    // Show total and checkout button
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartSummary.style.display = 'flex';
    checkoutBtn.style.display = 'block';
}

// Function to remove item from cart
function removeFromCart(id) {
    cartItems = cartItems.filter(item => item.id != id);
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update display
    loadCartItems();
    
    showNotification('Item removed from your cart!');
}

// Function to show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    
    if (!notification) return;
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Scroll Animation for Features
window.addEventListener('scroll', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const cardPosition = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (cardPosition < screenPosition) {
            card.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
});

document.getElementById('ai-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const userInput = document.getElementById('health-issue').value.toLowerCase();
    const responseText = document.getElementById('ai-response');
    responseText.innerHTML = ''; // Clear previous response

    // Predefined responses for common health issues
    const responses = {
        "fever": "For a fever, stay hydrated and rest. If your temperature exceeds 102°F or persists for more than 2 days, consult a doctor.",
        "headache": "For a headache, ensure you're hydrated and take a break from screens. Over-the-counter pain relievers like ibuprofen can help.",
        "cough": "For a cough, drink warm fluids like honey and lemon tea. If it persists for more than a week, consult a doctor.",
        "sore throat": "For a sore throat, gargle with warm salt water and stay hydrated. Lozenges can also help.",
        "stomach ache": "For a stomach ache, avoid heavy meals and drink plenty of water. Ginger tea can help with digestion.",
        "cold": "For a common cold, rest, drink warm fluids, and consider over-the-counter decongestants."
    };

    // Check if the input matches any predefined responses
    let foundResponse = false;
    for (const [key, value] of Object.entries(responses)) {
        if (userInput.includes(key)) {
            responseText.innerHTML = `<h4>AI Doctor's Response:</h4><p>${value}</p>`;
            foundResponse = true;
            break;
        }
    }

    // Default response if no match is found
    if (!foundResponse) {
        responseText.innerHTML = `<h4>AI Doctor's Response:</h4><p>I'm sorry, I couldn't understand your query. Please consult a doctor for more specific advice.</p>`;
    }

    // Show the response
    responseText.style.display = 'block';
});