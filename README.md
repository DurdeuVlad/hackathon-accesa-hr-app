# 📘 GitHub Rules for Team Project

## 🧩 Project Structure
- Use a **monorepo**:
  ```
  /frontend
  /backend
  /docs
  README.md
  ```

## 🌿 Branching Strategy
- `main`: always stable and working
- `dev`: integration branch
- Feature branches: `feature/<name>`  
- Bugfix branches: `bugfix/<name>`
- Hotfixes (for emergencies): `hotfix/<name>`

## 🔁 Workflow
1. **Never commit directly to `main` or `dev`.**
2. Always branch off `dev`.
3. Open a **pull request (PR)** to merge into `dev`.
4. Get at least **1 review** before merging.
5. Rebase frequently to avoid merge hell.
6. Resolve merge conflicts locally before pushing.

## 📦 Commits
- Follow this format: `type: short description`
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation
  - `style:` formatting only
  - `refactor:` refactoring code
  - `test:` adding tests
- Example: `feat: add login page layout`

## 🔍 Pull Requests
- Name: `feature: meaningful title`
- Description must include:
  - What was done
  - Why it matters
  - Screenshots if UI-related
- Tag relevant people for review
- Clean up your branch before opening a PR

## 📁 File Management
- No dumping random files in root.
- Frontend code → `/frontend`
- Backend code → `/backend`
- Use `.gitignore` to avoid committing node_modules, build files, or environment configs.

## 🚫 Don'ts
- Don’t push broken code to `dev`
- Don’t merge your own PR without review
- Don’t commit secrets or environment files (use `.env.example`)
- Don’t ignore review comments unless you're ready to explain why

## ✅ Do’s
- Pull and rebase `dev` **before** starting any work
- Keep commits small and focused
- Use meaningful commit messages
- Communicate on PRs and issues

## 🧪 Manual Testing (No CI/CD)
- Test locally before pushing
- Backend: run all routes and check logs
- Frontend: test UI interactions manually
- Create `docs/manual-test-checklist.md` to track test cases

## 📓 Documentation
- Use `/docs` folder for any setup, notes, or decisions
- Update `README.md` with setup instructions and dev tips

---

**Last rule: If you’re not sure — ask. Don’t guess and break stuff.**
