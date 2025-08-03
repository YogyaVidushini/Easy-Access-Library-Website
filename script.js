// Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', function() {
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
                this.classList.add('active');
                
                const methodType = this.dataset.method;
                const cardSection = document.getElementById('cardSection');
                
                if (methodType === 'card') {
                    cardSection.style.display = 'block';
                } else {
                    cardSection.style.display = 'none';
                }
            });
        });

        // Card number formatting
        document.getElementById('cardNumber').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });

        // Expiry date formatting
        document.getElementById('expiryDate').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // CVV validation
        document.getElementById('cvv').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });

        // Form submission
        document.getElementById('paymentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
            submitBtn.disabled = true;
            
            // Simulate payment processing
            setTimeout(() => {
                alert('Payment successful! Your library fees have been paid. Thank you!');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                // You can redirect to a success page here
                // window.location.href = 'payment-success.html';
            }, 2000);
        });

        //calendar
        class Calendar {
            constructor() {
                this.currentDate = new Date();
                this.today = new Date();
                this.selectedDate = null;
                this.events = {
                    '2025-08-05': [{ title: 'Return: The Invisible Man', time: '', type: 'due-soon' }],
                    '2025-08-08': [{ title: 'Book Club Meeting', time: '6:00 PM', type: 'event' }],
                    '2025-08-10': [{ title: 'New Books Arrival', time: '', type: 'event' }],
                    '2025-08-12': [{ title: 'Library Workshop', time: '2:00 PM', type: 'event' }],
                    '2025-08-15': [{ title: 'Return: Harry Potter', time: '', type: 'due' }]
                };
                
                this.init();
            }

            init() {
                this.render();
                this.bindEvents();
            }

            bindEvents() {
                document.getElementById('prevMonth').addEventListener('click', () => {
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                    this.render();
                });

                document.getElementById('nextMonth').addEventListener('click', () => {
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                    this.render();
                });

                document.getElementById('eventForm').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.addEvent();
                });
            }

            render() {
                this.renderHeader();
                this.renderCalendar();
            }

            renderHeader() {
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                
                const monthYear = document.getElementById('monthYear');
                monthYear.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
            }

            renderCalendar() {
                const grid = document.getElementById('calendarGrid');
                grid.innerHTML = '';

                // Day headers
                const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                dayHeaders.forEach(day => {
                    const header = document.createElement('div');
                    header.className = 'calendar-day-header';
                    header.textContent = day;
                    grid.appendChild(header);
                });

                // Get first day of month and number of days
                const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
                const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
                const startDate = new Date(firstDay);
                startDate.setDate(startDate.getDate() - firstDay.getDay());

                // Generate calendar days
                for (let i = 0; i < 42; i++) {
                    const date = new Date(startDate);
                    date.setDate(startDate.getDate() + i);
                    
                    const dayElement = this.createDayElement(date);
                    grid.appendChild(dayElement);
                }
            }

            createDayElement(date) {
                const day = document.createElement('div');
                day.className = 'calendar-day';
                
                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = date.getDate();
                day.appendChild(dayNumber);

                // Add classes for styling
                if (date.getMonth() !== this.currentDate.getMonth()) {
                    day.classList.add('other-month');
                }

                if (this.isSameDay(date, this.today)) {
                    day.classList.add('today');
                }

                // Check for events
                const dateStr = this.formatDate(date);
                if (this.events[dateStr]) {
                    day.classList.add('has-event');
                    this.events[dateStr].forEach(() => {
                        const dot = document.createElement('span');
                        dot.className = 'event-dot';
                        day.appendChild(dot);
                    });
                }

                day.addEventListener('click', () => {
                    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                    day.classList.add('selected');
                    this.selectedDate = date;
                    this.showDayEvents(date);
                });

                return day;
            }

            showDayEvents(date) {
                const dateStr = this.formatDate(date);
                const events = this.events[dateStr] || [];
                
                if (events.length > 0) {
                    let eventText = `Events for ${date.toDateString()}:\n\n`;
                    events.forEach(event => {
                        eventText += `• ${event.title}`;
                        if (event.time) eventText += ` at ${event.time}`;
                        eventText += '\n';
                    });
                    alert(eventText);
                }
            }

            addEvent() {
                const title = document.getElementById('eventTitle').value;
                const date = document.getElementById('eventDate').value;
                const time = document.getElementById('eventTime').value;
                const description = document.getElementById('eventDescription').value;

                if (title && date) {
                    if (!this.events[date]) {
                        this.events[date] = [];
                    }
                    
                    this.events[date].push({
                        title: title,
                        time: time,
                        description: description,
                        type: 'personal'
                    });

                    // Clear form
                    document.getElementById('eventForm').reset();
                    
                    // Re-render calendar
                    this.render();
                    
                    alert('Reminder added successfully!');
                }
            }

            formatDate(date) {
                return date.getFullYear() + '-' + 
                       String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(date.getDate()).padStart(2, '0');
            }

            isSameDay(date1, date2) {
                return date1.getDate() === date2.getDate() &&
                       date1.getMonth() === date2.getMonth() &&
                       date1.getFullYear() === date2.getFullYear();
            }
        }

        // Initialize calendar when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new Calendar();
        });

        //signup

         // Membership selection
        document.querySelectorAll('.membership-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.membership-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                this.querySelector('input[type="radio"]').checked = true;
            });
        });

        // Form validation
        function validateForm() {
            let isValid = true;
            const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'password', 'confirmPassword'];
            
            // Clear previous errors
            document.querySelectorAll('.form-control').forEach(field => {
                field.classList.remove('error');
                field.nextElementSibling.style.display = 'none';
            });

            // Validate required fields
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (!field.value.trim()) {
                    field.classList.add('error');
                    field.nextElementSibling.style.display = 'block';
                    isValid = false;
                }
            });

            // Email validation
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value && !emailRegex.test(email.value)) {
                email.classList.add('error');
                email.nextElementSibling.textContent = 'Please enter a valid email address';
                email.nextElementSibling.style.display = 'block';
                isValid = false;
            }

            // Password validation
            const password = document.getElementById('password');
            if (password.value && password.value.length < 8) {
                password.classList.add('error');
                password.nextElementSibling.style.display = 'block';
                isValid = false;
            }

            // Confirm password validation
            const confirmPassword = document.getElementById('confirmPassword');
            if (confirmPassword.value !== password.value) {
                confirmPassword.classList.add('error');
                confirmPassword.nextElementSibling.style.display = 'block';
                isValid = false;
            }

            // Membership selection validation
            const membershipSelected = document.querySelector('input[name="membership"]:checked');
            if (!membershipSelected) {
                alert('Please select a membership type');
                isValid = false;
            }

            // Terms acceptance validation
            const terms = document.getElementById('terms');
            if (!terms.checked) {
                alert('Please accept the Terms and Conditions to continue');
                isValid = false;
            }

            return isValid;
        }

        // Form submission
        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                const submitBtn = document.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
                submitBtn.disabled = true;
                
                // Simulate account creation
                setTimeout(() => {
                    alert('Account created successfully! Welcome to Easy Access Library. Please check your email for verification instructions.');
                    
                    // Reset form
                    document.getElementById('signupForm').reset();
                    document.querySelectorAll('.membership-option').forEach(opt => opt.classList.remove('selected'));
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // You can redirect to login page or home page here
                    // window.location.href = 'index.html';
                }, 2000);
            }
        });

        // Real-time validation
        document.getElementById('email').addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.classList.add('error');
                this.nextElementSibling.style.display = 'block';
            } else {
                this.classList.remove('error');
                this.nextElementSibling.style.display = 'none';
            }
        });

        document.getElementById('confirmPassword').addEventListener('input', function() {
            const password = document.getElementById('password').value;
            if (this.value && this.value !== password) {
                this.classList.add('error');
                this.nextElementSibling.style.display = 'block';
            } else {
                this.classList.remove('error');
                this.nextElementSibling.style.display = 'none';
            }
        });

        function showLoginForm() {
        }