async function login(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const password = e.target.password.value;
    const obj = { name, password }
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

async function signup(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const deviceId = e.target.deviceId.value;
    const availableCoins = e.target.availableCoins.value;
    const phoneNumber = e.target.phone.value;
    const password = e.target.password.value;

    const obj = {
        name,
        deviceId,
        availableCoins,
        phoneNumber,
        password
    }
    try {
        let res = await axios.post(`user/add-user`, obj);
        localStorage.setItem('token', res.data.token);
        signup_form.reset();
        alert(res.data.message)
        window.location.href = "user"
    }
    catch (err) {
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
