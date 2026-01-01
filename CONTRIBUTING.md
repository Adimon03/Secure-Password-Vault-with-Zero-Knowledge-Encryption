# Contributing to Secure Password Vault

Thank you for your interest in contributing to the Secure Password Vault! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker to report bugs
- Include detailed steps to reproduce the issue
- Provide system information (OS, browser, versions)
- Include screenshots if applicable

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its use case
- Explain why it would be valuable to users

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test your changes**
5. **Commit with clear messages**
   ```bash
   git commit -m "Add: new password strength indicator"
   ```
6. **Push to your fork**
7. **Create a Pull Request**

## 🛡️ Security Guidelines

### Security-First Development
- Never log sensitive data (passwords, tokens, keys)
- Always validate input on both client and server
- Use parameterized queries to prevent SQL injection
- Implement proper error handling without exposing internals

### Encryption Standards
- Use only approved cryptographic libraries
- Never implement custom crypto algorithms
- Ensure proper key derivation (PBKDF2 with high iterations)
- Use secure random number generation

### Code Review Requirements
- All security-related changes require thorough review
- Crypto implementations must be reviewed by security experts
- Database changes require migration scripts

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Security Testing
- Run dependency vulnerability scans
- Test for common web vulnerabilities (XSS, CSRF, etc.)
- Verify encryption/decryption workflows

## 📝 Code Style

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints where possible
- Document functions with docstrings
- Use meaningful variable names

### TypeScript (Frontend)
- Follow ESLint configuration
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use meaningful component and variable names

### Git Commit Messages
- Use conventional commit format
- Examples:
  - `feat: add password strength meter`
  - `fix: resolve login token expiration issue`
  - `docs: update API documentation`
  - `security: improve input validation`

## 🏗️ Development Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Local Development
1. Clone your fork
2. Set up backend (see README)
3. Set up frontend (see README)
4. Create feature branch
5. Make changes
6. Test thoroughly
7. Submit PR

## 🚀 Release Process

### Version Numbering
- Follow Semantic Versioning (SemVer)
- Format: MAJOR.MINOR.PATCH
- Security fixes increment PATCH
- New features increment MINOR
- Breaking changes increment MAJOR

### Release Checklist
- [ ] All tests pass
- [ ] Security review completed
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Changelog updated
- [ ] Release notes prepared

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Security implications considered
- [ ] No sensitive data in commits

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Security improvement
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Security Checklist
- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization verified
- [ ] Crypto implementation reviewed

## Screenshots (if applicable)
Add screenshots of UI changes
```

## 🔒 Security Disclosure

### Reporting Security Issues
- **DO NOT** open public issues for security vulnerabilities
- Email security issues to: adimonpubg@gmail.com
- Include detailed description and reproduction steps
- Allow reasonable time for fix before public disclosure

### Security Response Process
1. Acknowledge receipt within 24 hours
2. Investigate and assess severity
3. Develop and test fix
4. Coordinate disclosure timeline
5. Release security update
6. Publish security advisory

## 📞 Getting Help

### Community Support
- GitHub Discussions for general questions
- GitHub Issues for bug reports
- Email for security concerns

### Development Questions
- Check existing issues and discussions
- Provide minimal reproduction case
- Include relevant system information

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for helping make Secure Password Vault better and more secure! 🔐✨