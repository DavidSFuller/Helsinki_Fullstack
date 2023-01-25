sequenceDiagram
    participant browser
    participant server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server
    
    Note right of browser:  The browser executes theJavaScript code to fetch file /exampleapp/data.json from the server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [[{content: "", date: "2023-01-24T12:32:57.154Z"},{content: "", date: "2023-01-24T12:33:02.667Z"}, ... ]
    deactivate server    

    Note right of browser: The browser executes the callback function onreadystatechange that renders via redrawNotes() 