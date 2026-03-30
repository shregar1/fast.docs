# Security policy

## Reporting a vulnerability

**Please do not** file a public GitHub issue for security-relevant bugs until they can be addressed.

### Documentation site (this repo)

- Open a **private security advisory** on [github.com/shregar1/fast.docs](https://github.com/shregar1/fast.docs) (Security → Advisory), or
- Email the maintainers if you have a contact published on the repository.

Describe the issue, affected components, and steps to reproduce.

### Fast framework (application code)

For vulnerabilities in the **framework** itself, use the security process documented on [github.com/shregar1/fast.mvc](https://github.com/shregar1/fast.mvc).

## Scope

This site is a static documentation frontend (Vite + static content). Typical issues include XSS via content injection, dependency vulnerabilities, or misconfigured headers. Reports are reviewed on a best-effort basis.
