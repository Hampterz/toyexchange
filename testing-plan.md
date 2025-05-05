# ToyShare Comprehensive Testing Plan

## Authentication Flows

### Sign Up
- [ ] Navigate to Sign Up page
- [ ] Test validation for required fields (email, username, password)
- [ ] Test password strength requirements
- [ ] Test successful account creation with valid information
- [ ] Test duplicate username/email error handling
- [ ] Test Google OAuth signup flow

### Login
- [ ] Navigate to Login page 
- [ ] Test validation for required fields
- [ ] Test error handling for incorrect credentials
- [ ] Test successful login with valid credentials
- [ ] Test "Remember Me" functionality
- [ ] Test Google OAuth login
- [ ] Verify login persists after page refresh

### Forgot Password
- [ ] Navigate to Forgot Password page
- [ ] Test validation for email field
- [ ] Test error handling for non-existent email
- [ ] Test successful password reset request
- [ ] Test email delivery of reset link/code
- [ ] Test password reset completion with valid code
- [ ] Test expired reset code handling

### User Account Management
- [ ] Test profile customization flow for new users
- [ ] Test editing profile information
- [ ] Test profile picture upload and display
- [ ] Test changing password
- [ ] Test account deletion (if implemented)
- [ ] Test session timeout (if implemented)
- [ ] Test accessing restricted pages when logged out (redirects to login)

## Core Functionality: Toy Listings

### Home Page
- [ ] Verify navigation menu shows correct items for logged-in and logged-out state
- [ ] Test search functionality
- [ ] Test filtering toys by various criteria (categories, age range, condition, location)
- [ ] Test location-based search using geolocation
- [ ] Test manual location entry and geocoding
- [ ] Test distance-based filtering (10 miles radius)
- [ ] Test sorting options
- [ ] Test pagination or infinite scroll (if implemented)
- [ ] Test responsive layout at various screen sizes

### Posting a Toy
- [ ] Navigate to Add Toy form
- [ ] Test validation for required fields
- [ ] Test image upload (single and multiple)
- [ ] Test location selection
- [ ] Test category and tag selection
- [ ] Test form submission with valid data
- [ ] Test error handling for invalid submissions
- [ ] Verify newly created toy appears in user's listings and on the home page

### Viewing a Toy
- [ ] Test opening individual toy details
- [ ] Verify all toy information displays correctly
- [ ] Test image gallery (if multiple images)
- [ ] Test contact/messaging the owner
- [ ] Test sharing functionality
- [ ] Test flagging/reporting functionality
- [ ] Test adding to favorites
- [ ] Test map display of toy location
- [ ] Verify relative distance calculation

### Managing Toy Listings
- [ ] Navigate to My Listings/Profile page
- [ ] Test viewing Active, Inactive and Traded tabs
- [ ] Test editing toy information
- [ ] Test marking toy as traded
- [ ] Test deactivating/reactivating toy listing
- [ ] Test deleting a toy listing
- [ ] Test availability toggle

### Inactive Toy Management
- [ ] Verify auto-hiding functionality for toys inactive >31 days
- [ ] Test reactivation of inactive toys
- [ ] Verify correct status display
- [ ] Test inactive toy appears in correct tab on profile

### Traded Toy Management
- [ ] Test marking a toy as traded
- [ ] Verify sustainability metrics update
- [ ] Verify toy appears in the traded tab on profile
- [ ] Test reactivation of traded toys (mark as active)
- [ ] Verify correct status display

## Social and Communication

### Messaging System
- [ ] Test initiating conversation with toy owner
- [ ] Test sending messages
- [ ] Test receiving messages
- [ ] Test message notifications
- [ ] Test marking messages as read
- [ ] Test deleting messages
- [ ] Test message history retention
- [ ] Test blocking/unblocking users
- [ ] Test muting/unmuting users

### User Interactions
- [ ] Test viewing other user profiles
- [ ] Test following/unfollowing users
- [ ] Test interactions with blocked/muted users
- [ ] Test reporting a user

### Toy Requests
- [ ] Test requesting a toy
- [ ] Test accepting/rejecting a toy request
- [ ] Test managing request history
- [ ] Test arranging meetups
- [ ] Test requesting a wish

## Wishes and Community Features

### Wish List
- [ ] Test creating a wish
- [ ] Test viewing wishes
- [ ] Test editing wishes
- [ ] Test deleting wishes
- [ ] Test filtering wishes
- [ ] Test offering a toy for a wish
- [ ] Test accepting/rejecting wish offers

### Community Features
- [ ] Test joining/creating groups
- [ ] Test group interactions and permissions
- [ ] Test community metrics display
- [ ] Test user badges and achievements
- [ ] Test sustainability score system

## Safety and Security

### Safe Meetup Locations
- [ ] Test viewing verified safe meetup locations
- [ ] Test adding a meetup location
- [ ] Test filtering by meetup locations
- [ ] Test safety tips and guidance

### Content Moderation
- [ ] Test reporting inappropriate content
- [ ] Test admin review of reported content (if you have admin access)
- [ ] Test suspending/reinstating listings (admin feature)

## Testing Tools

### Administrative Testing
- [ ] Navigate to Testing Tools page
- [ ] Test creating inactive toys
- [ ] Test creating traded toys
- [ ] Verify test data appears correctly in the application

## Safety Center

- [ ] Test accessing Safety Center
- [ ] Verify all safety resources display correctly
- [ ] Test links to external safety resources (if any)

## Help Center

- [ ] Test accessing Help Center
- [ ] Verify FAQ content displays correctly
- [ ] Test search functionality within Help Center (if implemented)
- [ ] Test submitting support requests or contact forms

## Mobile Responsiveness

- [ ] Test all main pages at mobile viewport sizes
- [ ] Verify navigation menu collapses appropriately
- [ ] Verify buttons and touch targets are appropriately sized
- [ ] Test orientation changes (portrait/landscape)
- [ ] Verify forms are usable on mobile
- [ ] Test image uploads from mobile

## Additional Features

### Sustainability Metrics
- [ ] Verify community metrics update after relevant actions
- [ ] Test user sustainability score calculation
- [ ] Verify badges are earned and displayed correctly

### Notification System
- [ ] Test in-app notifications
- [ ] Test email notifications (if implemented)
- [ ] Test notification preferences settings

## Issue Reporting Checklist

For each issue found, record:
1. Page/feature where issue occurred
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Error messages (if any)
6. Screenshots (if possible)
7. Environment details (browser, device, screen size)