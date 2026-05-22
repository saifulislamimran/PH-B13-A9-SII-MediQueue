=== STEP 0 ===
<USER_REQUEST>
Act as an Expert Senior Frontend Architect. I have reviewed the recent implementation, and there are several missing features and crucial UI/UX updates that must be completed. 

Please note that we previously missed a core task regarding Profile Editing (Task 7 from our earlier architecture design). I have merged it here under Task 4. 

This is STILL a STRICTLY Frontend (Client-side) environment. Build the complete UI layout, states, filters, and mock functions so they are fully interactive and production-ready. Implement these 4 tasks step-by-step.

---

🎨 Task 2: Financials & Payments Ecosystem (Advanced Ledger & Excel View)
- Location: Admin Dashboard -> Financials & Payments.
- Automated Description Logic: In the "Record Transaction" modal, replace the raw text description input. If a booking occurs automatically in the app (e.g., Student books an Anatomy session), auto-populate the ledger payload. For manual logging, turn the field into a searchable Combobox linked to existing student/tutor data.
- PDF/Receipt Download: Add a small Action Icon (e.g., Download/File Icon) to the right side of EVERY individual transaction row. Clicking this should trigger a mock function to download that specific transaction receipt as a PDF or image.
- Advanced Date Filtering: Add filters for "Daily", "Weekly", and "Monthly" timelines above the table.
- Excel-Style Frozen Total Row: 
  - Below the transaction rows, implement a static summary banner or a CSS-Sticky Bottom Row (`bottom-0 sticky bg-slate-900`) that acts like a frozen row in Excel.
  - This row must display the Cash Flow Total (Total Inflows minus Outflows).
  - Crucial UX: If the ledger has many rows, the table body must be scrollable (`max-h-[400px] overflow-y-auto`), but the Total Row must remain permanently frozen/visible at the bottom and update its calculated sum dynamically based on the active Daily/Weekly/Monthly filter.

### 🎨 Task 2: Comprehensive Edit Profile Upgrades (CRITICAL)
- Location: User Profile Page -> "Editable Profile Settings" section.
- Password Change Block (New): Create a complete, fully interactive form section containing fields for "Current Password", "New Password", and "Confirm Password" with built-in real-time UI validation state matching.
- Global Standard Profile Picture Uploader (New): 
  - Upgrade the current profile photo URL selector into a proper device file picker and Drag & Drop area (Pick from Gallery/Device).
  - Add strict frontend validation: If the chosen file size exceeds 1MB (`file.size > 1024 * 1024`), block the selection and trigger a precise error Toast notification: "File size exceeds 1MB limit. Please upload a smaller image."
  - Keep the traditional "Or paste image URL" text input underneath as a secondary fallback so the user has both options.
- Note: The "Locked Identity Fields / Request Change" option remains untouched as previously designed.

---

Please start with Task 1 (Specialty Coverage) and Task 4 (Comprehensive Profile & Password Upgrades). Provide the updated code and the git commit message.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-05-22T21:05:42+06:00.
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from None to Gemini 3.5 Flash (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>

=== STEP 104 ===
<USER_REQUEST>
approved
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-05-22T21:10:27+06:00.
</ADDITIONAL_METADATA>

=== STEP 165 ===
<USER_REQUEST>
do all 
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-05-22T21:15:42+06:00.
</ADDITIONAL_METADATA>

