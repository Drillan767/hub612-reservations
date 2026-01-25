# HUB612 Reservations

This projects provides a reservation system for the meeting rooms and callboxes inside the HUB612.

## How to run

**API server**
```
go run . serve
```

**Create a migration**
```
go run . migrate collections
```

## Backend

Handled with [Pocketbase](https://pocketbase.io/) and Golang

### Available resources:

- Rooms
  - Name (required)
  - Image (required)
  - Description (required)
  - Price (required)
- Users
  - Email (required) 
  - Name (required)
  - Avatar
  - Credit balance (default 0)
  - Is Admin (default `false`)
- Bookings
  - Room (Required)
  - User (Required)
  - Start Date (required)
  - End date (required)
  - Paid price (required)
- Credit transactions
  - Origin (user who's an admin) (required)
  - Target (user) (required)
  - Amount (can be negative)

Each collection has a `created_at` and `updated_at` fields

## Frontend

Handled with Vue and Vuetify

### Specicities

- Vue Router
- Pinia to handle the auth state
- Vuetify to quicken the front-end development

### Route groups

`/admin`: 
- Can CRUD on the users, meeting rooms and reservations
- Can give credits to a specific user
- Can book a meeting room on behalf of another user (said user will use their own credits)

`/user`: 
- Can see / update their infos (not their credit balance)
- Can see future and past bookings

`/book`:
- List the meeting rooms
- See general availabilities, with who booked what and when ([Qalendar](https://tomosterlund.github.io/qalendar/))
- Book a meeting room
- (Check if booking multiple meeting rooms is useful?)

---

The Booking process must be as simple and straight forward as possible
- Pick a date and time of future reservation
- Pick an available room
- Select duration
- Validate