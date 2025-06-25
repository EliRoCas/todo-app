// Priority button handling
        document.querySelectorAll('.priority-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Subtask priority dropdown handling
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('subtask-priority')) {
                const priority = e.target.value;
                e.target.className = `subtask-priority ${priority}`;
            }
        });

        // Add subtask functionality
        document.getElementById('addSubtaskBtn').addEventListener('click', function() {
            const subtasksList = document.getElementById('subtasksList');
            const subtaskItem = document.createElement('div');
            subtaskItem.className = 'subtask-item';
            subtaskItem.innerHTML = `
                <input type="text" class="subtask-input" placeholder="Subtask name...">
                <select class="subtask-priority low">
                    <option value="low" selected>🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                </select>
                <button type="button" class="remove-subtask">×</button>
            `;
            subtasksList.appendChild(subtaskItem);
        });

        // Remove subtask functionality
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-subtask')) {
                const subtasksList = document.getElementById('subtasksList');
                if (subtasksList.children.length > 1) {
                    e.target.parentElement.remove();
                }
            }
        });

        // Collapse menu functionality
        document.getElementById('optionalToggle').addEventListener('click', function() {
            const content = document.getElementById('optionalContent');
            const header = this;
            
            header.classList.toggle('active');
            content.classList.toggle('active');
        });

        // Form submission
        document.getElementById('taskForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const taskData = {
                name: document.getElementById('taskName').value,
                priority: document.querySelector('.priority-btn.selected').dataset.priority,
                subtasks: Array.from(document.querySelectorAll('.subtask-item')).map(item => ({
                    name: item.querySelector('.subtask-input').value,
                    priority: item.querySelector('.subtask-priority').value
                })).filter(subtask => subtask.name.trim() !== ''),
                deadline: document.getElementById('deadline').value,
                focusTimer: document.getElementById('focusMinutes').value
            };
            
            // Simulate form submission
            const btn = e.target.querySelector('.btn-primary');
            const originalText = btn.textContent;
            btn.textContent = 'Creating...';
            btn.disabled = true;
            
            setTimeout(() => {
                alert('Task created successfully!');
                btn.textContent = originalText;
                btn.disabled = false;
                // Reset form
                e.target.reset();
                document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('selected'));
                document.querySelector('.priority-btn.medium').classList.add('selected');
                
                // Reset subtasks to single item
                const subtasksList = document.getElementById('subtasksList');
                subtasksList.innerHTML = `
                    <div class="subtask-item">
                        <input type="text" class="subtask-input" placeholder="Subtask name...">
                        <select class="subtask-priority low">
                            <option value="low" selected>🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>
                        <button type="button" class="remove-subtask">×</button>
                    </div>
                `;
                
                // Close optional section
                document.getElementById('optionalToggle').classList.remove('active');
                document.getElementById('optionalContent').classList.remove('active');
            }, 1000);
        });

        // Handle cancel button
        document.getElementById('cancelBtn').addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                // Simulate navigation back
                window.history.back();
            }
        });