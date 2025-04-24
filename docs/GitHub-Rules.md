# GitHub Rules for CVMatch Webapp Repository

---

## 🧩 Project Structure
```
/frontend
/backend
/docs
README.md
```

---

## 🌿 Branching Strategy
- `main`: always stable and working
- `dev`: integration branch
- Feature branches: `feature/<name>`
- Bugfix branches: `bugfix/<name>`
- Hotfixes (for emergencies): `hotfix/<name>`

---

## 🔁 Workflow
1. **Never commit directly to `main` or `dev`.**
2. Always branch off `dev`.
3. Open a **pull request (PR)** to merge into `dev`.
4. Get at least **1 review** before merging.
5. Rebase frequently to avoid merge hell.
6. Resolve merge conflicts locally before pushing.

---

## 📦 Commits
Use this format: `type: short description`
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting only
- `refactor:` refactoring code
- `test:` adding tests

Example:
```bash
feat: add login page layout
```

---

## 🔍 Pull Requests
- Title format: `feature: meaningful title`
- Description must include:
  - What was done
  - Why it matters
  - Screenshots if UI-related
- Tag relevant people for review
- Clean up your branch before opening a PR

---

## 📁 File Management
- No dumping random files in root.
- Frontend code → `/frontend`
- Backend code → `/backend`
- Use `.gitignore` to avoid committing `node_modules`, builds, or secrets.

---

## 🚫 Don'ts
- Don’t push broken code to `dev`
- Don’t merge your own PR without review
- Don’t commit secrets or `.env` files
- Don’t ignore review feedback without explanation

---

## ✅ Do’s
- Rebase `dev` before starting any work
- Keep commits focused and descriptive
- Communicate on PRs and issues
- Test before pushing

---

## 🧪 Manual Testing
- No CI/CD yet → test everything manually
- Backend: check logs and endpoints
- Frontend: click through UI
- Use `docs/manual-test-checklist.md` to track test cases

---

## 📓 Documentation
- Use `/docs` folder for all technical documentation and decisions
- Keep `README.md` clean and up-to-date

---

**Final rule: If unsure — ask. Don’t guess and break stuff.**

