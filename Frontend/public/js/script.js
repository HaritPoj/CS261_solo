function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Application-Key': "TUffbcdf5a4b9b89ee9a7b480266b1d686e46850635f72f8c0fea4b0c62f7fb9f1aa369230dc2f1640c3c10942dfee2b62" ,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "UserName": username,
            "PassWord": password
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json(); 
        } else {
            return response.json().then(data => {
                let errorMessage;
                switch (response.status) {
                    case 400:
                        if (data.message === 'User or Password Invalid!') {
                            errorMessage = 'Invalid username or password. Please try again.';
                        } else if (data.message === 'Could not read the request body!') {
                            errorMessage = 'There was an issue with the request body. Please check your input.';
                        } else if (data.message.includes('UserName or PassWord Invalid!')) {
                            errorMessage = 'Required both Username and Password.';
                        } else {
                            errorMessage = 'Something went wrong please check your input.';
                        }
                        break;
                    case 401:
                        errorMessage = 'Unauthorized: Application-Key header required or missing. Please provide a valid access token.';
                        break;
                    case 403:
                        if (data.message.includes('invalid token')) {
                            errorMessage = 'Forbidden: Invalid token. Please confirm your access token is valid.';
                        } else {
                            errorMessage = 'Forbidden: You are not authorized to access this resource.';
                        }
                        break;
                    case 404:
                        errorMessage = 'Not Found: The requested resource does not exist.';
                        break;
                    default:
                        errorMessage = 'An unexpected error occurred. Please try again later.';
                }
                throw new Error(errorMessage);
            });
        }
    })
    .then(data => {
        if (data.status === true) {
            const displayName = data.displayname_th || 'ชื่อไม่ระบุ';
            const department = data.department || 'แผนกไม่ระบุ';
            const faculty = data.faculty || 'คณะไม่ระบุ';
            
            document.getElementById('message').innerText = `ชื่อ: ${displayName}\nสาขา: ${department}\nคณะ: ${faculty}`;
        } else {
            document.getElementById('message').innerText = data.message;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = error.message;
    });
}



function call_REST_API_Hello() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const url = (
        'http://localhost:8080/hello?' +
        new URLSearchParams({ myName: username, lastName: password}).toString()
      );
    
    fetch(url)
    .then(response => response.text())
    .then(text => {
        document.getElementById('message').innerText = text;
    })
    .catch(error => console.error('Error:', error));
}
