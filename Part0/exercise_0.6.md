sequenceDiagram
    participant browser
    participant server
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: json 
    deactivate server

   Note right of browser: payload {content: "exercise 0.6", date: "2023-01-25T15:00:03.838Z"}
   Note right of browser: response: {"message":"note created"}
   Note right of browser: The browser executes the callback function form.onsubmit to redraw the page and send to server