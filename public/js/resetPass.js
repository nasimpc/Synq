async function resetPass(e) {
    const parts = window.location.href.split('/');
    const lastPart = parts[parts.length - 1];
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    if (password == confirmPassword) {
        const obj = {
            resetid: lastPart,
            password: password,
        }
        try {
            let res = await axios.post("/password/reset", obj);
            alert(res.data.message)
        }
        catch (err) {
            confirm(err.data.message);
        }
    }
    else {
        confirm('paswords do not match please re-enter');
    }
}