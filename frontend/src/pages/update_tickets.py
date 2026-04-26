import re

file_path = r"d:\PAF\Smart_Campus\it3030-paf-2026-smart-campus-group71\frontend\src\pages\TicketsPage.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace imports
content = content.replace("import { useState, useEffect, useCallback } from 'react'", 
                          "import { useState, useEffect, useCallback } from 'react'\nimport { useAuth } from '../context/AuthContext';\nimport axios from 'axios';")

# 2. Rename App to TicketsPage
content = content.replace("function App() {", "export default function TicketsPage() {")
content = content.replace("export default App", "")

# 3. Replace fetch headers
content = re.sub(r"headers: \{ 'X-User-Id': '[^']+', 'X-User-Role': [^\}]+ \}", 
                 "headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }", content)

content = re.sub(r"headers: \{ 'X-User-Id': '[^']+' \}", 
                 "headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }", content)

content = re.sub(r"headers: \{ 'X-User-Role': [^\}]+ \}", 
                 "headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }", content)

# 4. Replace user state with useAuth
user_state_regex = r"const \[user, setUser\] = useState\(\{[\s\S]*?avatar: '👩‍💻'\n  \}\)"
content = re.sub(user_state_regex, "const { user, token } = useAuth();", content)

# 5. Remove role switcher carefully
role_switcher_regex = r"<select[\s]*value=\{user\.role\}[\s\S]*?<\/select>"
content = re.sub(role_switcher_regex, "", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("TicketsPage.jsx securely updated")
