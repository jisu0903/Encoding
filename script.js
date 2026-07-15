/* ===========================================
   Hamming Lab
   Part 1
=========================================== */

let currentStep = 0;

let original = "";
let encoded = "";
let received = "";
let decoded = "";

let errorIndex = -1;

const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".page");

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(t=>t.classList.remove("active"));
        pages.forEach(p=>p.classList.remove("active"));

        tab.classList.add("active");

        document
        .getElementById(tab.dataset.page)
        .classList.add("active");

    });

});

const inputData =
document.getElementById("inputData");

const stepBtn =
document.getElementById("stepBtn");

const resetBtn =
document.getElementById("resetBtn");

const stepInfo =
document.getElementById("stepInfo");

const message =
document.getElementById("message");

const originalBox =
document.getElementById("originalData");

const encodedBox =
document.getElementById("encodedData");

const receivedBox =
document.getElementById("receivedData");

const syndromeBox =
document.getElementById("syndromeData");

const decodedBox =
document.getElementById("decodedData");



stepBtn.addEventListener("click",nextStep);

resetBtn.addEventListener("click",resetDemo);



function resetDemo(){

    currentStep=0;

    original="";
    encoded="";
    received="";
    decoded="";

    errorIndex=-1;

    stepInfo.innerHTML="STEP 0 / 6";

    message.innerHTML="";

    originalBox.innerHTML="-";
    encodedBox.innerHTML="-";
    receivedBox.innerHTML="-";
    syndromeBox.innerHTML="-";
    decodedBox.innerHTML="-";

}



function nextStep(){

    switch(currentStep){

        case 0:

            step0();

            break;

        case 1:

            step1();

            break;

        case 2:

            step2();

            break;

        case 3:

            step3();

            break;

        case 4:

            step4();

            break;

        case 5:

            step5();

            break;

        default:

            resetDemo();

    }

}
