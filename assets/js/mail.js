function sendEmail() {
    let name = document.querySelector("#sName");
    let message = document.querySelector("#sMessage");
    let email = document.querySelector("#sEmail");

    if (!name.value || !message.value || !email.value) {
        alert("이름, 이메일 혹은 내용을 확인해주세요.");
        return;
    }
    if (!checkEmail(email.value)) {
        alert("올바른 이메일을 입력해주세요.");
        return;
    }

    var data = {
        name: name.value,
        message: message.value,
        email: email.value,
    };
    
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
    }).join('&');

    data.formDataNameOrder = '["name","message","email"]';

    fetch("https://script.google.com/macros/s/AKfycbzK6EmKaCoIcfH9_8i3WJT35xRNU9q0GpK0x0Hd0s5gADhkKqQ/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: encoded
    }).then((response) => response.json())
    .then((data) => {
        var res = data.result;
        if (res === "success") {
            name.value = "";
            message.value = "";
            email.value = "";
            alert("메일을 성공적으로 보냈습니다.");
        } else {
            alert("서버의 문제로 메일을 보내지 못했습니다.");
        }
    });
}

function checkEmail(str){                                                 
     var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
     if(!reg_email.test(str)) {                            
          return false;         
     }                            
     else {                       
          return true;         
     }                            
}