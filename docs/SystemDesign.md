# System Design

## Database

### ERD:

![alt text](ERD_Smart_Pharmacy.jpg)

## API

1. **Authentication**:
- POST `/api/v1/auth/singup`            # Register new user
- POST `/api/v1/auth/login`             # Login user
- POST `/api/v1/auth/refresh-token`     # Refresh access token
- POST `/api/v1/auth/logout`            # Logout user
- POST `/api/v1/auth/forgot-password`   # Request password reset
- POST `/api/v1/auth/reset-password`    # Reset password with token
- GET  `/api/v1/auth/me`                # Get current user profile

2. **User Management**:
- GET    `/api/v1/users`                # List users (admin only)
- GET    `/api/v1/users/{id}`           # Get user by ID
- PUT    `/api/v1/users/{id}`           # Update user
- PATCH  `/api/v1/users/{id}`           # Partial update user
- DELETE `/api/v1/users/{id}`           # Delete user
- GET    `/api/v1/users/{id}/addresses` # Get user addresses
- POST   `/api/v1/users/{id}/addresses` # Add user address

3. **Patient**:
- GET    `/api/v1/patients`                     # List patients
- POST   `/api/v1/patients`                     # Create patient
- GET    `/api/v1/patients/{id}`                # Get patient by ID
- PUT    `/api/v1/patients/{id}`                # Update patient
- DELETE `/api/v1/patients/{id}`                # Delete patient
- GET    `/api/v1/patients/{id}/prescriptions`  # Get patient prescriptions
- GET    `/api/v1/patients/{id}/appointments`   # Get patient appointments
- GET    `/api/v1/patients/{id}/orders`         # Get patient orders

4. **Employee**:
- GET    `/api/v1/employees`                    # List employees
- POST   `/api/v1/employees`                    # Create employee (admin only)
- GET    `/api/v1/employees/{id}`               # Get employee by ID
- PUT    `/api/v1/employees/{id}`               # Update employee
- DELETE `/api/v1/employees/{id}`               # Delete employee
- GET    `/api/v1/employees/{id}/appointments`  # Get employee appointments
- PATCH  `/api/v1/employees/{id}/availability`  # Update employee availability

5. **Doctor**:
- GET    `/api/v1/doctors`                      # List doctors
- POST   `/api/v1/doctors`                      # Create doctor
- GET    `/api/v1/doctors/{id}`                 # Get doctor by ID
- PUT    `/api/v1/doctors/{id}`                 # Update doctor
- DELETE `/api/v1/doctors/{id}`                 # Delete doctor
- GET    `/api/v1/doctors/{id}/prescriptions`   # Get doctor's prescriptions

6. **Appointment**:
- GET    `/api/v1/appointments`                 # List appointments
- POST   `/api/v1/appointments`                 # Create appointment
- GET    `/api/v1/appointments/{id}`            # Get appointment by ID
- PUT    `/api/v1/appointments/{id}`            # Update appointment
- DELETE `/api/v1/appointments/{id}`            # Cancel appointment
- PATCH  `/api/v1/appointments/{id}/status`     # Update appointment status

7. **Prescription**:
- GET    `/api/v1/prescriptions`                # List prescriptions
- POST   `/api/v1/prescriptions`                # Create prescription
- GET    `/api/v1/prescriptions/{id}`           # Get prescription by ID
- PUT    `/api/v1/prescriptions/{id}`           # Update prescription
- DELETE `/api/v1/prescriptions/{id}`           # Delete prescription
- PATCH  `/api/v1/prescriptions/{id}/status`    # Update prescription status
- GET    `/api/v1/prescriptions/{id}/medications` # Get prescription medications
- POST   `/api/v1/prescriptions/{id}/medications` # Add medication to prescription

8. **Medication**:
- GET    `/api/v1/medications`                  # List medications
- POST   `/api/v1/medications`                  # Create medication
- GET    `/api/v1/medications/{id}`             # Get medication by ID
- PUT    `/api/v1/medications/{id}`             # Update medication
- DELETE `/api/v1/medications/{id}`             # Delete medication

9. **Product**:
- GET    `/api/v1/products`                     # List products
- POST   `/api/v1/products`                     # Create product (admin)
- GET    `/api/v1/products/{id}`                # Get product by ID
- PUT    `/api/v1/products/{id}`                # Update product (admin)
- DELETE `/api/v1/products/{id}`                # Delete product (admin)
- GET    `/api/v1/products/categories`          # List product categories
- GET    `/api/v1/products/categories/{id}`     # Get products by category
- GET    `/api/v1/products/search`              # Search products

10. **Shopping Cart**:
- GET    `/api/v1/cart`                         # Get user's cart
- POST   `/api/v1/cart/items`                   # Add item to cart
- PUT    `/api/v1/cart/items/{id}`              # Update cart item
- DELETE `/api/v1/cart/items/{id}`              # Remove item from cart
- DELETE `/api/v1/cart/items`                   # Clear cart

11. **Order**:
- GET    `/api/v1/orders`                       # List user's orders
- POST   `/api/v1/orders`                       # Create order from cart
- GET    `/api/v1/orders/{id}`                  # Get order by ID
- PATCH  `/api/v1/orders/{id}/status`           # Update order status (admin)
- GET    `/api/v1/orders/{id}/items`            # Get order items
- POST   `/api/v1/orders/{id}/payment`          # Process payment for order

12. **Payment**:
- POST   `/api/v1/payments`                     # Create payment
- GET    `/api/v1/payments/{id}`                # Get payment details
- POST   `/api/v1/payments/{id}/refund`         # Process refund