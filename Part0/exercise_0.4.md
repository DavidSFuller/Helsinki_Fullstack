sequenceDiagram
    participant browser
    participant server
    
     browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: HTML document
    deactivate server
    Note right of browser: The server executes new_note using the payload "note: note for exercise 0.4", adding the note on the server

   browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    
    Note right of browser:  The browser executes theJavaScript code to fetch file /exampleapp/data.json from the server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [[{"content":"hola","date":"2023-01-24T11:44:33.185Z"},{"content":"qaqaqa","date":"2023-01-24T11:46:21.177Z"}, ... ]
    deactivate server    

    Note right of browser: The browser executes the callback function onreadystatechange that renders the notes 