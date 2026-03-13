# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Created `.env.example` with HTTPS and IP binding instructions.

### Changed
- App now listens on `0.0.0.0` (all network interfaces) instead of just `localhost` to allow access via local IP address.
- Updated `FRONTEND_URL` for IP access.
- Redesigned Profile logic: Added `photoUrl` to `Profile` entity and updated `isComplete` to require photo and gender.
