// var x = document.getElementById("test-id");
// x.textContent = "HEY YOU TOO!";
// console.log(x);

// var y = document.querySelector(".test-class");
// y.textContent += ", NOT!!";
// console.log(y);

// var newElement = document.createElement('p');
// newElement.textContent = 'This is a new Element BROOOOOO!';
// document.body.appendChild( newElement );

// var newElement2 = document.createElement('p');
// newElement2.textContent = "Second new paragraph";
// newElement2.style.color = 'darkgrey';

// document.body.appendChild(newElement2);

// var newElement3 = document.createElement('A');
// newElement3.textContent = "Click Me, Click Me!!";
// newElement3.href = "./index.html";
// newElement3.title = "Return to Homepage";
// newElement3.style.color = "red";

// newElement2.appendChild(newElement3);

var calculatorForm = document.getElementById("calculator");

calculatorForm.addEventListener("submit", function(event){
    event.preventDefault();
    var operatorInput = document.getElementById('operator');
    var add1 = document.getElementById("num1");
    var add2 = document.getElementById("num2");
    var answer = document.getElementById("answer");

    switch (operatorInput.value)
    {
        case "add":
            answer.textContent += Number(add1.value)+Number(add2.value);
            break;
        case "subtract":
            answer.textContent += Number(add1.value)-Number(add2.value);
            break;
        case "divide":
            answer.textContent += Number(add1.value)/Number(add2.value);
            break;
        case "multiply":
            answer.textContent += Number(add1.value)*Number(add2.value);
            break;
        default:
            break;
    }  
});



