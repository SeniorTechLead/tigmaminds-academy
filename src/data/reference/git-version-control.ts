import type { ReferenceGuide } from '../reference';

export const guide: ReferenceGuide = {
  slug: 'git-version-control',
  title: 'Git & Version Control',
  category: 'language',
  icon: '💻',
  tagline: 'Track every change, collaborate without chaos, and never lose your work again.',

  understand: [
    {
      title: 'What Is Version Control?',
      beginnerContent:
        'Imagine you are writing an essay and you save a new copy every time you make major changes: ' +
        'essay_v1.docx, essay_v2.docx, essay_final.docx, essay_final_FINAL.docx. Within a week you ' +
        'have a dozen files and no idea which one has the paragraph you deleted yesterday. Version ' +
        'control solves this by keeping a single file but recording every change as a snapshot in time. ' +
        'You can scroll back through history, see exactly what changed, who changed it, and why.\n\n' +
        'This matters enormously when multiple people work on the same project. Without version control, ' +
        'two developers editing the same file will overwrite each other\'s work. With it, the system ' +
        'tracks both sets of changes and helps merge them together. Every professional software team in ' +
        'the world uses version control — it is as fundamental to coding as saving a document is to ' +
        'writing. Git is the most popular version control system by far, created in 2005 by Linus ' +
        'Torvalds (who also created Linux).',
      intermediateContent:
        'Git tracks changes, not files. Each commit stores a snapshot plus metadata (author, timestamp, message, parent). The SHA-1 hash uniquely identifies each commit. Key commands: git init, git add file.py, git commit -m "message", git log --oneline, git diff, git status. The staging area lets you commit selectively: change 5 files, stage 2, commit those 2 — the rest remain uncommitted. The .gitignore file prevents tracking generated files (node_modules/, __pycache__/, .env).',
      advancedContent:
        'Git\'s data model is a **directed acyclic graph (DAG)** of commits. Branches are lightweight pointers — creating one is O(1). Merges create two-parent commits. Rebasing replays commits onto a new base for linear history. The reflog records every HEAD movement, enabling recovery of "lost" commits. Git\'s content-addressable storage deduplicates identical files across commits. Pack files compress similar objects together, making repositories 10-50× smaller than storing full copies. The three-tree architecture (HEAD, index, working directory) enables Git\'s powerful staging workflow.',
    },
    {
      title: 'Git Basics: init, add, commit, status, log',
      diagram: 'GitStagingDiagram',
      beginnerContent:
        'Try the three-zone diagram above. Click **edit** on a file to modify it (it moves to Working). Click **git add** to stage it. Type a message and **commit**. Watch files flow Working → Staged → Committed. This is what every Git workflow comes down to: three zones and the commands that move files between them.\n\n' +
        'Git works in three stages. First, you make changes to files in your *working directory* — this ' +
        'is just your normal folder. Second, you *stage* the changes you want to save using `git add`. ' +
        'Staging is like placing items on a conveyor belt: you choose exactly which changes to include. ' +
        'Third, you *commit* those staged changes with `git commit -m "your message"`, which takes a ' +
        'permanent snapshot.\n\n' +
        'The command `git init` creates a new repository (repo) in your folder — it tells Git to start ' +
        'tracking changes here. `git status` shows you what has changed since the last commit: which ' +
        'files are modified, which are staged, and which are new. `git log` shows the history of all ' +
        'commits, newest first, with the author, date, and message for each. Think of the log as a ' +
        'detailed diary of every save point in your project. These five commands — init, add, commit, ' +
        'status, and log — are the foundation of everything else in Git.',
      intermediateContent:
        'The three areas: **Working Directory** (your files), **Staging Area** (index — selected changes for next commit), **Repository** (committed history). Workflow: edit files → git add file.py (stage) → git commit -m "message" (save). git diff shows unstaged changes; git diff --staged shows staged changes. git log --oneline --graph shows branch history graphically. Undo: git restore file.py discards working changes; git restore --staged file.py unstages. **Commits should be atomic** — each commit represents one logical change with a clear message.',
      advancedContent:
        'Git internals: a commit object contains a tree (snapshot of all files), parent pointer(s), author, and message. A tree object maps filenames to blob objects (file contents). Blobs are content-addressed — identical file contents are stored once regardless of filename. git cat-file -p <hash> inspects any object. The .git directory contains: objects/ (blobs, trees, commits), refs/ (branch pointers), HEAD (current branch pointer), index (staging area). Understanding these internals helps debug unusual situations: detached HEAD, lost commits, corrupted repositories.',
      interactive: {
        type: 'matching',
        props: {
          title: 'Match each Git command to what it does',
          pairs: [
            ['git init', 'Create a new repository and start tracking changes'],
            ['git add', 'Stage changes for the next commit'],
            ['git commit', 'Save a permanent snapshot of staged changes'],
            ['git status', 'Show which files have changed since the last commit'],
            ['git log', 'Display the history of all commits'],
          ],
        },
      },
    },
    {
      title: 'Branches: Creating, Switching, and Merging',
      beginnerContent:
        'Step through the branch history in the diagram above. A branch forks off main, gets its own commits, and eventually merges back. Notice how a branch is just a pointer to a commit — not a full copy of files. That\'s why creating branches in Git is instant.\n\n' +
        'A branch is a parallel copy of your project where you can experiment without affecting the main ' +
        'version. Imagine a tree: the trunk is your main code, and each branch grows in its own ' +
        'direction. You might create a branch called "add-dark-mode" to try a new feature. If it works ' +
        'out, you merge the branch back into the trunk. If it doesn\'t, you delete the branch and the ' +
        'main code is untouched.\n\n' +
        'You create a branch with `git branch feature-name` and switch to it with `git checkout feature-name` ' +
        '(or the newer `git switch feature-name`). While on that branch, all your commits only affect ' +
        'that branch. When you are ready, you switch back to the main branch and run `git merge feature-name` ' +
        'to bring the changes in. The default branch is usually called `main` (older repos use `master`). ' +
        'Branches are lightweight in Git — they are just pointers to a commit, not full copies of files — ' +
        'so creating hundreds of branches costs almost nothing. Professional teams create a new branch for ' +
        'every bug fix and every feature, keeping the main branch always stable and deployable.',
      intermediateContent:
        'Branch workflow: git branch feature-xyz (create), git switch feature-xyz (switch), make changes, commit, then git switch main; git merge feature-xyz. Merge conflicts occur when both branches modify the same lines — manually edit, then git add and commit. **Git flow**: main (production), develop (integration), feature/*, release/*, hotfix/*. Simpler: **trunk-based development** — short-lived branches merged frequently. GitHub/GitLab pull requests enable code review before merging.',
      advancedContent:
        'Advanced Git: **interactive rebase** (git rebase -i HEAD~5) reorders, squashes, edits, or drops commits. **Cherry-pick** (git cherry-pick abc123) applies a specific commit. **Bisect** (git bisect start/bad/good) binary-searches through history to find bug-introducing commits in O(log n) steps. **Submodules** manage repository dependencies. **Git hooks** run scripts before/after events (pre-commit: lint code, pre-push: run tests). **Git LFS** handles large binaries by storing pointers in the repo and actual files on a separate server.',
      diagram: 'GitBranchDiagram',
    },
    {
      title: 'Remote Repositories: push, pull, clone, and GitHub',
      beginnerContent:
        'So far, everything has been on your own computer. A *remote repository* is a copy of your repo ' +
        'stored on a server — most commonly on GitHub, GitLab, or Bitbucket. This serves two purposes: ' +
        'backup (your code survives even if your laptop dies) and collaboration (others can access the ' +
        'same repo).\n\n' +
        '`git clone URL` downloads a remote repo to your computer, including its full history. ' +
        '`git push` uploads your local commits to the remote. `git pull` downloads new commits from the ' +
        'remote and merges them into your local copy. Think of push and pull like syncing a shared ' +
        'document: push sends your latest edits to the cloud, pull downloads everyone else\'s edits.\n\n' +
        'GitHub is the most popular hosting platform for Git repositories. It adds a web interface where ' +
        'you can browse code, read commit history, file issues (bug reports), and manage pull requests. ' +
        'Over 100 million developers use GitHub, and most open-source projects live there — from Linux ' +
        'to Python to React.',
      intermediateContent:
        'Remotes are copies of the repository on another machine (GitHub, GitLab, Bitbucket). git clone url downloads the entire history. git remote -v shows configured remotes. git push origin main uploads local commits. git pull origin main downloads and merges remote changes. git fetch downloads without merging (safer — inspect first with git log origin/main). **Forks** (GitHub) create your own copy of someone else\'s repository. **Pull Requests** propose merging your branch into the original — the standard collaboration mechanism in open source.',
      advancedContent:
        'Distributed version control means every clone has the complete history — no central server is required for local operations (commit, branch, merge, log). This enables offline work, fast operations, and resilience. GitHub Actions (CI/CD) runs automated tests on every push: on: push → jobs: test → steps: checkout, setup-python, pip install, pytest. Protected branches require passing tests and approving reviews before merging. SSH keys (ssh-keygen, add public key to GitHub) replace password authentication for push/pull operations — more secure and more convenient.',
    },
    {
      title: 'Collaboration Workflow: Pull Requests and Code Review',
      beginnerContent:
        'In a team, you rarely push directly to the main branch. Instead, you create a branch, make your ' +
        'changes, push that branch to the remote, and open a *pull request* (PR). A pull request is a ' +
        'formal proposal that says "I\'d like to merge these changes into main — please review them." ' +
        'Teammates read your code, leave comments, suggest improvements, and eventually approve the PR. ' +
        'Then the branch gets merged.\n\n' +
        'Sometimes two people edit the same line of the same file on different branches. When you try to ' +
        'merge, Git reports a *merge conflict*: it cannot decide which version to keep, so it marks the ' +
        'conflicting lines and asks you to choose. This sounds scary but is usually straightforward — ' +
        'you open the file, see both versions side by side, pick the correct one (or combine them), and ' +
        'commit the resolution. Code review and pull requests are not just about catching bugs; they ' +
        'spread knowledge across the team so everyone understands the codebase, and they create a written ' +
        'record of *why* changes were made — invaluable when debugging six months later.',
      intermediateContent:
        'PR workflow: (1) Fork/clone the repo, (2) Create a feature branch: git switch -c feature-name, (3) Make changes, commit with clear messages, (4) Push: git push origin feature-name, (5) Open PR on GitHub with description, (6) Address review comments, push updates, (7) Maintainer merges. **Code review** catches bugs, improves design, and shares knowledge. Good PR practice: small, focused changes (not giant PRs); descriptive title and body; link to relevant issue; include tests.',
      advancedContent:
        'Advanced collaboration: **Conventional Commits** standardize messages (feat:, fix:, docs:, refactor:) enabling automated changelog generation. **Semantic Versioning** (MAJOR.MINOR.PATCH) communicates compatibility: breaking change → major bump, new feature → minor, bug fix → patch. **Monorepos** (Google, Meta) keep all code in one repository, using build tools (Bazel, Nx) to manage dependencies between projects. **Git hooks** automate quality checks: pre-commit runs linters, commit-msg validates format, pre-push runs tests. Husky (Node.js) and pre-commit (Python) manage hook installation across teams.',
      interactive: {
        type: 'true-false',
        props: {
          statements: [
            { text: 'You should always push your changes directly to the main branch.', answer: false, explanation: 'In professional workflows, you push to a feature branch and open a pull request so teammates can review before merging to main.' },
            { text: 'A merge conflict means Git cannot automatically combine two sets of changes to the same lines.', answer: true, explanation: 'When two branches edit the same line, Git marks the conflict and asks you to resolve it manually.' },
            { text: 'Git stores a complete copy of every file in every branch, using lots of disk space.', answer: false, explanation: 'Git branches are lightweight pointers to commits. Git uses snapshots and compression, so branches cost almost no extra space.' },
            { text: 'Pull requests create a written record of why changes were made, which helps future debugging.', answer: true, explanation: 'The PR description, review comments, and linked issues form a paper trail that is invaluable months later.' },
          ],
        },
      },
    },
  ],
};
