var formElement = document.getElementById('form-id');

formElement.addEventListener('submit', function(event){

    event.preventDefault();

    var name = document.getElementById('name');
    var age = document.getElementById('age');
    var school_class = document.getElementById('class');
    var city = document.getElementById('city');

    var tableElement = document.getElementById('table-id').getElementsByTagName('tbody')[0];
    
    var tableRow = tableElement.insertRow();
    var tableData1 = tableRow.insertCell();
    tableData1.textContent = name.value;
    var tableData2 = tableRow.insertCell();
    tableData2.textContent = age.value;
    var tableData3 = tableRow.insertCell();
    tableData3.textContent = school_class.value;
    var tableData4 = tableRow.insertCell();
    tableData4.textContent = city.value;



});