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
   Display Upgrade
=========================================== */


function displayBits(element,data,error=-1){

    if(data===""){

        element.innerHTML="-";
        return;

    }


    let result="";


    for(let i=0;i<data.length;i++){

        if(i===error){

            result +=
            `<span class="bit error">${data[i]}</span>`;

        }

        else{

            result +=
            `<span class="bit">${data[i]}</span>`;

        }

    }


    element.innerHTML=result;

}



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


    displayBits(
        decodedBox,
        decoded
    );


}



// 기존 STEP 함수 마지막에 자동 연결

const originalStep0 = step0;

step0=function(){

    originalStep0();

    updateVisualization();

};



const originalStep1 = step1;

step1=function(){

    originalStep1();

    updateVisualization();

};



const originalStep2 = step2;

step2=function(){

    originalStep2();

    updateVisualization();

};



const originalStep3 = step3;

step3=function(){

    originalStep3();

    updateVisualization();

};



const originalStep4 = step4;

step4=function(){

    originalStep4();

    updateVisualization();

};



const originalStep5 = step5;

step5=function(){

    originalStep5();

    updateVisualization();

};
/* ===========================================
   Hamming Lab
   Part 5
   Performance Analysis
=========================================== */


const prob =
document.getElementById("prob");


const probText =
document.getElementById("probText");


const runBtn =
document.getElementById("run");


const successBox =
document.getElementById("success");


const failBox =
document.getElementById("fail");


const rateBox =
document.getElementById("rate");


const theoryBox =
document.getElementById("theory");


const mode =
document.getElementById("mode");


const trial =
document.getElementById("trial");



let chart;



// ===============================
// 확률 표시
// ===============================

prob.addEventListener(
"input",
()=>{

    probText.innerHTML =
    prob.value+"%";

});




// ===============================
// 랜덤 오류 생성
// ===============================


function randomError(code,p){


    let bits =
    code.split("");


    for(let i=0;i<bits.length;i++){


        if(Math.random()<p){


            bits[i] =
            bits[i]==="0"
            ?"1"
            :"0";


        }

    }


    return bits.join("");

}



// ===============================
// 이론 성공률
// ===============================


function theoryProbability(p){


    return (

        Math.pow(1-p,7)

        +

        7*p*Math.pow(1-p,6)

    )*100;


}



// ===============================
// 실험 실행
// ===============================


runBtn.addEventListener(
"click",
()=>{


    let p =
    Number(prob.value)/100;


    let count =
    Number(trial.value);



    let success=0;

    let fail=0;



    for(let i=0;i<count;i++){


        // 랜덤 4bit 생성

        let data="";


        for(let j=0;j<4;j++){

            data +=
            Math.random()<0.5
            ?"0"
            :"1";

        }



        let testEncoded =
encodeHamming(data);


        let received;



        // --------------------
        // 오류 방식 선택
        // --------------------

        if(mode.value==="independent"){


            received =
burstError(encoded,p);

        }


        else{


            received =
            burstError(encoded,p);


        }



        let syndrome =
        calculateSyndrome(received);


        let position =
        findErrorPosition(syndrome);



        let corrected =
        correctError(
            received,
            position
        );



        let decoded =
        decodeHamming(corrected);



        if(decoded===data){

            success++;

        }

        else{

            fail++;

        }


    }



    let rate =
    success/count*100;



    successBox.innerHTML =
    success;


    failBox.innerHTML =
    fail;


    rateBox.innerHTML =
    rate.toFixed(2)+"%";



    if(mode.value==="independent"){


        theoryBox.innerHTML =
        theoryProbability(p)
        .toFixed(2)+"%";


    }

    else{


        theoryBox.innerHTML =
        "Burst Error는 일반식 적용 불가";


    }



    drawGraph(
        success,
        fail
    );



});
/* ===========================================
   Hamming Lab
   Part 6
   Burst Error + Graph
=========================================== */



// ===========================================
// Burst Error
// 연속된 구간에 오류 발생
// ===========================================

function burstError(code,p){


    let bits =
    code.split("");


    if(Math.random()<p){


        // 시작 위치

        let start =
        Math.floor(
            Math.random()*7
        );


        // 오류 길이 2~3bit

        let length =
        Math.floor(
            Math.random()*2
        )+2;



        for(
            let i=start;
            i<start+length && i<7;
            i++
        ){

            bits[i] =
            bits[i]==="0"
            ?"1"
            :"0";

        }


    }


    return bits.join("");

}





// ===========================================
// Chart.js 그래프
// ===========================================

function drawGraph(success,fail){



    let ctx =
    document
    .getElementById("graph")
    .getContext("2d");



    if(chart){

        chart.destroy();

    }



    chart =
    new Chart(
        ctx,
        {

        type:"bar",

        data:{

            labels:[
                "복원 성공",
                "복원 실패"
            ],


            datasets:[{

                label:
                "실험 결과",


                data:[
                    success,
                    fail
                ]

            }]

        },


        options:{

            responsive:true,


            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });



}
