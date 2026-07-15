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
/* ===========================================
   Hamming Lab
   Part 2
   Hamming(7,4) Algorithm
=========================================== */


// ===========================================
// 4bit 데이터 → Hamming(7,4) 코드 변환
// 위치:
// 1 2 3 4 5 6 7
// p1 p2 d1 p4 d2 d3 d4
// ===========================================

function encodeHamming(data){

    let d1 = Number(data[0]);
    let d2 = Number(data[1]);
    let d3 = Number(data[2]);
    let d4 = Number(data[3]);


    let p1 = d1 ^ d2 ^ d4;
    let p2 = d1 ^ d3 ^ d4;
    let p4 = d2 ^ d3 ^ d4;


    return (
        p1.toString() +
        p2.toString() +
        d1.toString() +
        p4.toString() +
        d2.toString() +
        d3.toString() +
        d4.toString()
    );

}



// ===========================================
// 한 개의 오류 발생
// index: 0~6
// ===========================================

function makeError(code,index){

    let bits = code.split("");

    bits[index] =
        bits[index] === "0"
        ? "1"
        : "0";

    return bits.join("");

}



// ===========================================
// Syndrome 계산
// 결과:
// 000 → 정상
// 001~111 → 오류 위치
// ===========================================

function calculateSyndrome(code){

    let bits = code.split("").map(Number);


    let b1 = bits[0];
    let b2 = bits[1];
    let b3 = bits[2];
    let b4 = bits[3];
    let b5 = bits[4];
    let b6 = bits[5];
    let b7 = bits[6];


    let s1 =
        b1 ^ b3 ^ b5 ^ b7;

    let s2 =
        b2 ^ b3 ^ b6 ^ b7;

    let s4 =
        b4 ^ b5 ^ b6 ^ b7;


    return (
        s4.toString() +
        s2.toString() +
        s1.toString()
    );

}



// ===========================================
// Syndrome → 오류 위치
// ===========================================

function findErrorPosition(syndrome){

    return parseInt(syndrome,2);

}



// ===========================================
// 오류 수정
// ===========================================

function correctError(code,position){

    if(position===0){
        return code;
    }


    let bits = code.split("");

    bits[position-1] =
        bits[position-1] === "0"
        ? "1"
        : "0";


    return bits.join("");

}



// ===========================================
// Hamming 코드 → 원래 데이터 추출
// ===========================================

function decodeHamming(code){

    return (
        code[2] +
        code[4] +
        code[5] +
        code[6]
    );

}
/* ===========================================
   Hamming Lab
   Part 3
   Step Functions
=========================================== */


// ===========================================
// STEP 0
// 입력 데이터 저장
// ===========================================

function step0(){

    let value = inputData.value.trim();


    if(!/^[01]{4}$/.test(value)){

        message.innerHTML =
        "⚠ 4자리 이진수를 입력해주세요.";

        return;

    }


    original = value;

    originalBox.innerHTML =
    original;


    currentStep++;

    stepInfo.innerHTML =
    "STEP " + currentStep + " / 6";


    message.innerHTML =
    "입력 데이터가 준비되었습니다.";

}



// ===========================================
// STEP 1
// Hamming Encoding
// ===========================================

function step1(){

    encoded =
    encodeHamming(original);


    encodedBox.innerHTML =
    encoded;


    currentStep++;

    stepInfo.innerHTML =
    "STEP " + currentStep + " / 6";


    message.innerHTML =
    "패리티 비트를 추가하여 Hamming(7,4) 코드 생성 완료.";

}



// ===========================================
// STEP 2
// 오류 발생
// ===========================================

function step2(){

    // 랜덤한 위치 선택
    errorIndex =
    Math.floor(Math.random()*7);


    received =
    makeError(encoded,errorIndex);



    receivedBox.innerHTML =
    received;


    currentStep++;

    stepInfo.innerHTML =
    "STEP " + currentStep + " / 6";


    message.innerHTML =
    "전송 과정에서 1bit 오류 발생!";

}



// ===========================================
// STEP 3
// Syndrome 검사
// ===========================================

function step3(){

    let syndrome =
    calculateSyndrome(received);


    syndromeBox.innerHTML =
    syndrome;


    currentStep++;

    stepInfo.innerHTML =
    "STEP " + currentStep + " / 6";


    if(syndrome==="000"){

        message.innerHTML =
        "오류 없음.";

    }

    else{

        message.innerHTML =
        "Syndrome 분석 결과 오류 위치 : "
        + parseInt(syndrome,2)
        + "번 비트";

    }


}



// ===========================================
// STEP 4
// 오류 수정
// ===========================================

function step4(){

    let syndrome =
    calculateSyndrome(received);


    let position =
    findErrorPosition(syndrome);



    received =
    correctError(received,position);



    receivedBox.innerHTML =
    received;



    currentStep++;

    stepInfo.innerHTML =
    "STEP " + currentStep + " / 6";


    message.innerHTML =
    "오류 위치를 찾아 수정했습니다.";

}



// ===========================================
// STEP 5
// 데이터 복원
// ===========================================

function step5(){

    decoded =
    decodeHamming(received);


    decodedBox.innerHTML =
    decoded;



    currentStep++;

    stepInfo.innerHTML =
    "STEP " + currentStep + " / 6";


    message.innerHTML =
    "원본 데이터 복원 완료.";

}
/* ===========================================
   Hamming Lab
   Part 4
   Visualization
=========================================== */


// ===========================================
// 비트 문자열 → 비트 박스 표시
// ===========================================

function displayBits(element, data, error=-1){

    if(data===""){

        element.innerHTML="-";
        return;

    }


    let html="";


    for(let i=0;i<data.length;i++){

        let cls="bit";


        if(i===error){

            cls += " error";

        }


        html +=
        `
        <span class="${cls}">
        ${data[i]}
        </span>
        `;

    }


    element.innerHTML = html;

}



// ===========================================
// 기존 출력 방식 대신 비트박스 적용
// ===========================================

function updateVisualization(){

    displayBits(
        originalBox,
        original
    );


    displayBits(
        encodedBox,
        encoded
    );


    displayBits(
        receivedBox,
        received,
        errorIndex
    );


    if(decoded!==""){

        displayBits(
            decodedBox,
            decoded
        );

    }

}



// ===========================================
// 기존 함수에 시각화 연결
// ===========================================


const oldStep0 = step0;
step0 = function(){

    oldStep0();

    updateVisualization();

}



const oldStep1 = step1;
step1 = function(){

    oldStep1();

    updateVisualization();

}



const oldStep2 = step2;
step2 = function(){

    oldStep2();

    updateVisualization();

}



const oldStep3 = step3;
step3 = function(){

    oldStep3();

    updateVisualization();

}



const oldStep4 = step4;
step4 = function(){

    oldStep4();

    updateVisualization();

}



const oldStep5 = step5;
step5 = function(){

    oldStep5();

    updateVisualization();

}
