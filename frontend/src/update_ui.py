import os

def update_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply ResourcePage specific updates
    if 'ResourcePage.jsx' in filepath:
        content = content.replace('import "./ResourcePage.css";', 'import "./ResourcesModule.css";')
        content = content.replace('className="page-container animate-fade-in"', 'className="resources-page"')
        content = content.replace('className="glass-card main-form-section animate-slide-up"', 'className="resources-card"')
        content = content.replace('className="btn btn-primary"', 'className="resource-btn-primary"')
        content = content.replace('className="btn btn-secondary"', 'className="resource-btn-secondary"')
        content = content.replace('className="modern-table"', 'className="resource-table"')
        content = content.replace('className="action-buttons"', 'className="resource-actions"')
        content = content.replace('className="btn-icon edit"', 'className="resource-btn-edit"')
        content = content.replace('className="btn-icon delete"', 'className="resource-btn-danger"')
        content = content.replace('No assets found in the registry.', 'No resources found. Create one to begin.')
        content = content.replace('className="table-container table-wrapper animate-slide-up"', 'className="resources-card resource-table-wrapper"')
        content = content.replace('className="modern-form"', 'className="resource-form"')
        content = content.replace('className="input-field"', 'className="resource-form-group"')
        content = content.replace('className="input-label"', 'className="resource-form-label"')
        content = content.replace('className="form-grid"', 'className="resource-form-grid"')
        
        # fix inputs
        content = content.replace('<input name="name" placeholder="e.g. Innovation Hub" value={form.name} onChange={handleChange} required />', '<input className="resource-form-input" name="name" placeholder="e.g. Innovation Hub" value={form.name} onChange={handleChange} required />')
        content = content.replace('<input name="capacity" type="number" placeholder="0" value={form.capacity} onChange={handleChange} required />', '<input className="resource-form-input" name="capacity" type="number" placeholder="0" value={form.capacity} onChange={handleChange} required />')
        content = content.replace('<input name="location" placeholder="e.g. Block C, Level 2" value={form.location} onChange={handleChange} required />', '<input className="resource-form-input" name="location" placeholder="e.g. Block C, Level 2" value={form.location} onChange={handleChange} required />')
        content = content.replace('<select name="type" value={form.type} onChange={handleChange} required>', '<select className="resource-form-input" name="type" value={form.type} onChange={handleChange} required>')
        content = content.replace('<select\n      name="status"\n      value={form.status}\n      onChange={handleChange}\n      required\n    >', '<select\n      className="resource-form-input"\n      name="status"\n      value={form.status}\n      onChange={handleChange}\n      required\n    >')

    # Apply general updates to other files to ensure they are wrapped in .resources-page
    if 'EquipmentCatalogue.jsx' in filepath or 'Analytics.jsx' in filepath or 'MaintenanceConsole.jsx' in filepath:
        # Check if they already have import './ResourcesModule.css'
        if 'import "./ResourcesModule.css"' not in content:
            # add after first import line
            lines = content.split('\n')
            for i, line in enumerate(lines):
                if line.startswith('import '):
                    lines.insert(i + 1, 'import "./ResourcesModule.css";')
                    break
            content = '\n'.join(lines)
            
        # Replace their top container with resources-page if they use page-container
        content = content.replace('className="page-container"', 'className="resources-page"')
        content = content.replace('className="page-container animate-fade-in"', 'className="resources-page"')
        content = content.replace('className="glass-card"', 'className="resources-card"')
        content = content.replace('className="modern-table"', 'className="resource-table"')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r'd:\PAF\Smart_Campus\it3030-paf-2026-smart-campus-group71\frontend\src\pages'
update_file(f'{base_dir}\ResourcePage.jsx')
update_file(f'{base_dir}\EquipmentCatalogue.jsx')
update_file(f'{base_dir}\Analytics.jsx')
update_file(f'{base_dir}\MaintenanceConsole.jsx')
print('Updated files successfully.')
