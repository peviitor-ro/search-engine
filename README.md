# ui-js

Documnetations - 2021 12 06

# Structure

1. Project has 2 pages

    a) home/landing page - main purpose is just to have a search bar
    
    b) serp
    
        * display all results
        * show filters
        * etc

2. State of the app stay in the url


# How works

1. Home page

    a) after you press search button, the quesry string will be added in url and you will be redirected to serp page
    
2. SERP

2.1 - first render

    a) parse query string    
    b) populate on ui all search inputs     
    c) call api for data    
    d) display data
    
2.2 - search for something new

    a) press search button
    b) update query string
    c) refresh page with new url
    d) got to step 2.1
    
