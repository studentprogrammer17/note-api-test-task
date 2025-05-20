# Notes Api

Backend service for the CRUD opeartions with notes, used NestJS, MongoDB, Mongoose.

## Getting Started

### Environment Setup

```bash
# Copy the example environment file
cp .env.example .env
```

### Installing dependencies

```bash
npm install
```

### Start application

```bash
npm run start
```

## Testing

For testing notes service run:

```bash
npm run test
```

## Example API Requests & Responses

For each request should be added header with key x-api-key and value is API_KEY from .env file

### Get All Notes

- **Method**: GET
- **Endpoint**: `/notes`
- **Response**:

```json
[
  {
    "_id": "60b8d295f1d4c12a34567890",
    "title": "First Note",
    "content": "This is the content of the first note.",
    "createdAt": "2024-05-20T14:00:00.000Z",
    "tags": ["work", "business"]
  },
  {
    "_id": "60b8d2a6f1d4c12a34567891",
    "title": "Second Note",
    "content": "Some other note content.",
    "createdAt": "2024-05-19T10:30:00.000Z",
    "tags": ["travel"]
  }
]
```

## Get One Note

- **Method**: GET
- **Endpoint**: `/notes/${id}`
- **Response**:

```json
{
  "_id": "60b8d295f1d4c12a34567890",
  "title": "First Note",
  "content": "This is the content of the first note.",
  "createdAt": "2024-05-20T14:00:00.000Z",
  "tags": ["work", "business"]
}
```

### Create a Note

- **Method**: POST
- **Endpoint**: `/notes`
- **Request Body**:
  ```json
  {
    "title": "New Note Title",
    "content": "Optional content of the note.",
    "tags": ["tag1", "tag2"]
  }
  ```
- **Response**:
  ```json
  {
    "_id": "60b8d3b4f1d4c12a34567892",
    "title": "New Note Title",
    "content": "Optional content of the note.",
    "createdAt": "2024-05-21T12:00:00.000Z",
    "tags": ["tag1", "tag2"]
  }
  ```

### Update a Note

- **Method**: PATCH
- **Endpoint**: `/notes/${id}`
- **Request Body**:
  ```json
  {
    "title": "Changed Title",
    "content": "Changed content",
    "tags": ["tag3"]
  }
  ```
- **Response**:
  ```json
  {
    "_id": "60b8d3b4f1d4c12a34567892",
    "title": "Changed Title",
    "content": "Changed content",
    "createdAt": "2024-05-21T12:00:00.000Z",
    "tags": ["tag3"]
  }
  ```

### Delete a Note

- **Method**: DELETE
- **Endpoint**: `/notes/{id}`
- **Response**:
  ```json
  {
    "_id": "60b8d3b4f1d4c12a34567892",
    "title": "Changed Title",
    "content": "Changed content",
    "createdAt": "2024-05-21T12:00:00.000Z",
    "tags": ["tag3"]
  }
  ```
