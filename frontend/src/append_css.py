import os

tickets_css = r"d:\PAF new\New folder\Incident Tickets\frontend\src\App.css"
main_css = r"d:\PAF\Smart_Campus\it3030-paf-2026-smart-campus-group71\frontend\src\App.css"

with open(tickets_css, "r", encoding="utf-8") as f:
    tickets_content = f.read()

with open(main_css, "a", encoding="utf-8") as f:
    f.write("\n\n/* ----- INCIDENT TICKETS STYLES ----- */\n\n")
    f.write(tickets_content)

print("CSS appended")
