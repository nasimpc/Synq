async function login(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const obj = {
        email: email,
        password: password,
    }
    try {
        const response = await axios.post(`user/login`, obj)
        if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
            login_form.reset();
            alert(response.data.message)
            window.location.href = "user"
        }

    }
    catch (err) {
        console.log(err)
        document.body.innerHTML += `<div style="color: red;">${err.response.data.message}</div>`;

    }
}


async function forgetPass(e) {
    e.preventDefault();
    const email = e.target.forgetEmail.value;

    try {
        const data = {
            email: email,
        }

        const res = await axios.post('../password/forgotpassword', data);
        console.log(res);

    }
    catch (err) {
        console.log(err)

    }

}
async function signup(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phonenumber = e.target.phone.value;
    const password = e.target.password.value;

    const obj = {
        name: name,
        email: email,
        phonenumber: phonenumber,
        password: password,
    }
    try {
        let res = await axios.post(`user/add-user`, obj);
        localStorage.setItem('token', res.data.token);
        signup_form.reset();
        alert(res.data.message)
        window.location.href = "user"
    }
    catch (err) {
        //console.log("hi1", err);
        confirm('User already exists!');

    }
}
async function loginPage(e) {
    document.getElementById('loginDiv').className = "card bg-info-subtle m-lg-5";
    document.getElementById('signupDiv').className = "card bg-info-subtle m-lg-5 collapse";
}
async function signupPage(e) {
    document.getElementById('signupDiv').className = "card bg-info-subtle m-lg-5";
    document.getElementById('loginDiv').className = "card bg-info-subtle m-lg-5 collapse";
}
