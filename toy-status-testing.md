# ToyShare Status Management Testing Script

## Test Preparation
1. Log into the application with valid credentials
2. Navigate to the Testing Tools page (/testing-tools)

## Test Case 1: Creating Test Toys
### Creating a Test Inactive Toy
1. Go to the Testing Tools page
2. Select the "Inactive Toys" tab
3. Click the "Create Test Inactive Toy" button
4. Expected Result: Success message appears and confirms toy creation

### Creating a Test Traded Toy
1. Go to the Testing Tools page
2. Select the "Traded Toys" tab
3. Click the "Create Test Traded Toy" button
4. Expected Result: Success message appears and confirms toy creation

## Test Case 2: Managing Inactive Toys
1. Navigate to your Profile page
2. Select the "Inactive" tab
3. Verify that the test inactive toy you created appears in this section
4. Test the "Reactivate" button:
   - Click "Reactivate" button on an inactive toy
   - Confirm in the dialog by clicking "Reactivate Toy"
   - Expected Result: Success toast message appears and the toy disappears from the Inactive tab
5. Navigate to the "Active" tab
6. Verify that the reactivated toy now appears in the Active tab

## Test Case 3: Managing Traded Toys
1. Navigate to your Profile page
2. Select the "Traded" tab
3. Verify that the test traded toy you created appears in this section
4. Test the "Mark as Active" button:
   - Click "Mark as Active" button on a traded toy
   - Expected Result: Success toast message appears and the toy disappears from the Traded tab
5. Navigate to the "Active" tab
6. Verify that the reactivated toy now appears in the Active tab

## Test Case 4: Mark as Traded Functionality
1. Navigate to your Profile page
2. Select the "Active" tab
3. For an active toy:
   - Click the "Mark as Traded" button
   - Confirm in the dialog by clicking "Confirm Trade"
   - Expected Result: Success toast message "Toy Marked as Traded" appears
4. Navigate to the "Traded" tab
5. Verify that the toy now appears in the Traded section
6. Check if Community Metrics have been updated on the home page

## Issue Documentation
If any tests fail, document the following:
1. Which test case failed
2. What was the expected behavior
3. What actually happened
4. Any error messages displayed in the UI or console
5. Browser and device information