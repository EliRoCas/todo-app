 // Set default date to today
        document.getElementById('eventDate').valueAsDate = new Date();
        
        // Set default time to current time + 1 hour
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const timeString = now.toTimeString().slice(0, 5);
        document.getElementById('eventTime').value = timeString;

        // Handle alarm option selection
        document.querySelectorAll('.alarm-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.alarm-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Handle form submission
        document.getElementById('eventForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('taskName').value,
                date: document.getElementById('eventDate').value,
                time: document.getElementById('eventTime').value,
                alarm: document.querySelector('.alarm-option.selected').dataset.value,
                description: document.getElementById('description').value
            };
            
            // Simulate form submission
            const btn = e.target.querySelector('.btn-primary');
            const originalText = btn.textContent;
            btn.textContent = 'Creating...';
            btn.disabled = true;
            
            setTimeout(() => {
                alert('Event reminder created successfully!');
                btn.textContent = originalText;
                btn.disabled = false;
                // Reset form
                e.target.reset();
                document.getElementById('eventDate').valueAsDate = new Date();
                document.getElementById('eventTime').value = timeString;
                document.querySelectorAll('.alarm-option').forEach(opt => opt.classList.remove('selected'));
                document.querySelector('.alarm-option[data-value="15min"]').classList.add('selected');
            }, 1000);
        });

        // Handle cancel button
        document.getElementById('cancelBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                // Simulate navigation back
                window.history.back();
            }
        });