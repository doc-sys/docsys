define({ "api": [
  {
    "type": "post",
    "url": "/document/checkout/:fileid",
    "title": "",
    "version": "0.0.0",
    "filename": "src/routes/documents.js",
    "group": "C:\\Users\\LocalAdmin\\Documents\\Code\\docsys\\src\\routes\\documents.js",
    "groupTitle": "C:\\Users\\LocalAdmin\\Documents\\Code\\docsys\\src\\routes\\documents.js",
    "name": "PostDocumentCheckoutFileid"
  },
  {
    "type": "get",
    "url": "/document/checkout/:fileid",
    "title": "Document checkout",
    "name": "documentCheckout",
    "group": "Document",
    "description": "<p>Checks out document and sends files as ZIP archive</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fileid",
            "description": "<p>The fileid as part of the GET URL</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Stream",
            "optional": false,
            "field": "ZIP",
            "description": "<p>file stream</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "optional": false,
            "field": "PermissionError",
            "description": "<p>Not allowed to GET this file</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/documents.js",
    "groupTitle": "Document"
  },
  {
    "type": "post",
    "url": "/document/",
    "title": "New document",
    "name": "documentCreate",
    "group": "Document",
    "description": "<p>Creates and uploads a new documents with its body.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Buffer[]",
            "optional": false,
            "field": "files",
            "description": "<p>Page(s) for the document</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Documents subject or title</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "dated",
            "description": "<p>Date the original document was recieved</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Optional comment to append to log</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Confirming upload</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Something went wrong</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/documents.js",
    "groupTitle": "Document"
  },
  {
    "type": "get",
    "url": "/document/own",
    "title": "Own documents",
    "name": "documentGetOwn",
    "group": "Document",
    "description": "<p>Returns the users documents</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "ownDocs",
            "description": "<p>User documents basic metadata</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/documents.js",
    "groupTitle": "Document"
  },
  {
    "type": "get",
    "url": "/document/shared",
    "title": "Shared documents",
    "name": "documentGetShared",
    "group": "Document",
    "description": "<p>Returns the documents shared with the user</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "sharedDocs",
            "description": "<p>Shared documents basic metadata</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/documents.js",
    "groupTitle": "Document"
  },
  {
    "type": "get",
    "url": "/user/autocomplete",
    "title": "Username Autocomplete JSON",
    "name": "UserNameAutoComplete",
    "group": "User",
    "description": "<p>Gives back the full user list (names and usernames) for use in autocomplete</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "userList",
            "description": "<p>List of user profiles</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Something went wrong.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/signup/:inviteid",
    "title": "User signup with invite",
    "name": "userInvite",
    "group": "User",
    "description": "<p>New alternative for userSignup. Potential user should recieve a token per mail with that he can join the organistaion.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "inviteid",
            "description": "<p>The invitatation ID as part of the POST URL</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>User profile</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>API token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "InvalidInvite",
            "description": "<p>User didn't provide a valid ID</p>"
          }
        ],
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Something went wrong during signup. Most likely to be during validation.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/login",
    "title": "User login",
    "name": "userLogin",
    "group": "User",
    "description": "<p>Logs user in and returns the user and API token</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": ""
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>User profile</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>API token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "401": [
          {
            "group": "401",
            "type": "String",
            "optional": false,
            "field": "LoginFailed",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user/signup",
    "title": "User signup",
    "name": "userSignup",
    "group": "User",
    "description": "<p>Signs user up and logs in automatically</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password according to policy</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mail",
            "description": "<p>Valid email</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "displayName",
            "description": "<p>Full name</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>User profile</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>API token</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "500": [
          {
            "group": "500",
            "type": "String",
            "optional": false,
            "field": "InternalError",
            "description": "<p>Something went wrong during signup. Most likely to be during validation.</p>"
          }
        ]
      }
    },
    "deprecated": {
      "content": "Users should not be allowed to sign up by themselfes but rather be invited to use docSys"
    },
    "version": "0.0.0",
    "filename": "src/routes/users.js",
    "groupTitle": "User"
  }
] });
