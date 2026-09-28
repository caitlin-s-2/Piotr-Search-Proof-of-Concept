/*
    Name: Caitlin Spyra
    Email: cspyra@uw.edu
    Title: Search.js
    Desc: Loads achive file into the website and searches the data by catalogue number, performer, title, and general keywords. It is case insensitive. 
*/

let entries = [];

/*
    Title: setSite
    Param: n/a
    Ret: n/a
    Desc: Opens file and confirms it has been read to the console. File location is relative to place in folder. 
*/
function setSite() {
    const file = "Derek Piotr Fieldwork Archive.csv";
    openFile(file);
    console.log("File read");
}

/*
    Title: openFile()
    Param: String file 
    Ret: n/a
    Desc: Locates file in folder, opens it according to string file name, and handles file-reading errors.
*/
function openFile(file) {
    console.log(file);
    const urlParams = new URLSearchParams(window.location.search);
    fetch(file)
    .then(response => response.text())
    .then(data => {
        processData(data);
        console.log("Data set");
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

/*
    Title: removeElement
    Param: Array entry, Int index
    Ret: Array clone
    Desc: Helper method for removing extraneous spaces from entries.
*/
function removeElement(entry, index) {
    clone = [];
    for (i = 0; i < entry.length; i++) {
        if (i != index) {
            clone.push(entry[i]);
        }
    }
    return clone;
}

/*
    Title: quoteProcess
    Param: String line
    Ret: Array Entry
    Desc: Specialty processing to ensure puncutation inside quoations does not impact entry role divisions. 
        Implementation is pending further discussion as it would be unnecessary within a SQL database. 

function quoteProcess(line) {
    // remove commmas within quotations
    clone = "";
    for (i = 0; i < line.length; i++) {
        if (line[i] != '"') {
            clone.push(line[i]);
        } else {
            var cur = line.substring[count+1];
            var num = cur.indexof('"');
            
        }
    }
}
*/


/*
    Title: processData
    Param: String data
    Ret: n/a
    Desc: Processes file data by splitting the lines into individual entries then adding the entries to the global entries array.
*/
function processData(data) {
    var lines = data.split('\n');
    var entry = [];
    console.log("lines: " + lines.length); 
    console.log(lines[0]); 
    for (let i = 1; i < lines.length; i++) {
        var currLine = lines[i].toString();
        entry = currLine.split(',');
        entries.push(entry);
    }
    console.log("Entries: ", entries.length)
}


/*
    Title: getLinks()
    Param: Array results
    Ret: String ret
    Desc: Helper method that formats search results into html code.
*/

function getLinks(results) {
    let ret = "";
    console.log("results length: "+results.length);
    let linkform = "https://fieldwork-archive.com/";
    if (results.length == 1) {
        let link = linkform + results[0];
        ret = ret + "<a href=" + link + "> " + link + "</a> ";
    } else {
        ret = "<ul> ";
        for (let i = 0; i < results.length; i++) {
            let link = linkform + results[i];
            ret = ret + "<li> <a href=" + link + "> " + link + "</a> </li>";
        }
        ret = ret + "</ul>";
    }   
    console.log(ret);
    return ret;
}

/*
    Title: searchSite()
    Param: n/a
    Ret: n/a
    Desc: Searches global entries array for corresponding information. 
        The catalogue search is for exact matches, but the other categories (Title, Performer, All) utilize keywords. 
        The search is not case sensitive. 
        The default search and the all categories search are identical. 
        Results are inserted into the searchForm.html.
        Results are either links in an unnumbered list or "No Records Found". 

*/
function searchSite() {
    // Set-up    
    console.log("Starting results:");
    console.log("the category is:", $('#category').val());
    console.log("the inquiry is:", $('#formQuery').val()); 
    console.log(entries.length); 
    let results = [];

    // Search specific categories via switch
    switch ($('#category').val()) {

        // Catalogue Number
        case("Catalogue Number"):
            let num = Number($('#formQuery').val());
            console.log("Number is " + num);
            if ((num >= entries.length) || (num < 0)) {
                break;
            }
            for (let i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry[0] == num) {
                    results.push(entry[0]);
                    console.log("result found: " + entry[0]);
                    break;
                }
            } 
        break;

        // Title
        case("Title"):
            var key = $('#formQuery').val().toLowerCase();
            if (key.length < 1) {
                break;
            }
            if (key == " ") {
                break;
            }
            for (let i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry[2].toLowerCase().includes(key)) {
                    console.log(entry[0]);
                    results.push(entry[0]);
                }
            }
        break;

        // Performer / Informant
        case("Performer"):
            var key = $('#formQuery').val().toLowerCase();
            if (key.length < 1) {
                break;
            }
            if (key == " ") {
                break;
            }
            for (let i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry[1].toLowerCase().includes(key)) {
                    console.log(entry[0]);
                    results.push(entry[0]);
                }
            }
        break;

        // All / Default
        case("all"):
        default:
            var key = $('#formQuery').val().toLowerCase();
            if (key.length < 1) {
                break;
            }
            if (key == " ") {
                break;
            }
            for (let i = 0; i < entries.length; i++) {
                var entry = entries[i];
                for (let j = 0; j < entry.length; j++) {
                    if (entry[j].toLowerCase().includes(key)) {
                        results.push(entry[0]);
                        break;
                    }
                }
            }
    }
    console.log("finished switch");

    // Display 
    const linkform = "https://fieldwork-archive.com/";
    let message = "<p> Results for searching " + $('#category').val() + " for \"" + $('#formQuery').val() + "\": </p>";
    if (results.length < 1) {
        message = message + "<p> No Records Found </p>";
    } else {
        message = message  + "<p> " + getLinks(results) + "</p>";
    }
    $('#searchResult').html( );
    $('#searchResult').html(message);
}