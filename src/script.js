// var outputDiv = document.getElementById("output");
// var inputDiv = document.getElementById("input");
var parentDiv = document.getElementById("epik")
function submitForm() {
    var formData = new FormData(document.getElementById("myForm"));
    document.getElementById("myForm").reset();
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
    var inputDataValue = formData.get("inputData"); 
    if (file) {
        // Check the file type
        if (file.type.includes("image")) {
            // If it's an image, send to /image endpoint
            fetch('http://localhost:5000/image', {
                method: 'POST',
                body: formData
            })
            .then(handleResponse)
            .catch(handleError);
        } else if (file.type === "application/pdf") {
            // If it's a PDF, send to /pdf endpoint
            fetch('http://localhost:5000/pdf', {
                method: 'POST',
                body: formData
            })
            .then(handleResponse)
            .catch(handleError);
        } else {
            console.error('Unsupported file type');
        }
    } else {
        var newInputDiv = document.createElement("div")
        newInputDiv.className = 'in'
        newInputDiv.style.display = 'block';
        newInputDiv.innerHTML = inputDataValue;
        parentDiv.appendChild(newInputDiv)
        // If no file is selected, send to a generic endpoint
        fetch('http://localhost:5000', {
            method: 'POST',
            body: formData
        })
        .then(handleResponse)
        .catch(handleError);
    }
}

function handleResponse(response) {
    var newOutputDiv = document.createElement("div")
    newOutputDiv.className = "op"
    parentDiv.appendChild(newOutputDiv)
    const reader = response.body.getReader();
    return new ReadableStream({
        start(controller) {
            function push() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        controller.close();
                        
                        return;
                    }
                    // newOutputDiv.style.display = 'block';
                    const chars = new TextDecoder().decode(value);
                    newOutputDiv.innerHTML += chars;
                    setTimeout(push, 0);
                });
            }
            push();
        }
    });
}

function handleError(error) {
    console.error('Error:', error);
    // Handle errors here
}