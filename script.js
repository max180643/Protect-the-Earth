// เรียกกล่อง pit ทุก pit มาให้ js ใช้งาน
pits = document.querySelectorAll('pit');

// เวลาในการเตรียมตัว (s)
preparing = 3;
// ระยะเวลาที่ตุ่นจะเกิด (ms)
birth = 1000; //1000
// ระยะเวลาที่ตุ่นจะอยู่รอโดนตี (ms)
delay = 3000; //3000

//ฟังก์ชันหลังโหลดเว็บเสร็จ จะนับถอยหลัง 5 วินาที แล้วเริ่มเกม
function ready(){
    // คะแนนเริ่มต้น
    score = 0;
    // เวลาในการเล่นเกม (s)
    time = 30;

    // รีเซ็ทเวลา
    updateTime();
    // รีเซ็ทคะแนนให้คนดู
    updateScore();
    // reset ทุกหลุมให้ว่าง
    for (var i = 0; i < pits.length; i++) {
        pits[i].setAttribute("status","blank");
    }

    for (let i = 0; i < preparing; i++) {
        setTimeout(
            function(){
                console.log(i);
                subTitle.innerText = "Ready! Game start in "+(preparing-i);
                soundplay('beep');
                document.getElementById("subTitle").style.textDecoration = "none";
            },i*1000);
    }
    // หมดเวลาเตรียมตัว เรื่มเกมได้!
    setTimeout(
        function(){
            subTitle.innerText = "Let fire Alien !";
            countdown();
            reloadMole();
        }
        ,preparing*1000);
}

// สำหรับสั่งให้เวลาลด
function countdown(){
    // ทุกๆ 1 วินาที เวลาต้องลด
    cd = setInterval(
        function(){
            // ถ้ายังไม่หมดเวลา
            if (time > 0) {
                // ลดเวลา
                time--;
                // อัพเดทเวลา
                updateTime();
            }
            // ถ้าหมดเวลา
            else{
                clearInterval(cd);
                console.log("END");
            }
        }
        ,1000)
}

// ฟังก์ชันเกม โดยจะคอยเรียกตัวเองจนกว่าจะตาย หลักการคือ ทุกๆ เวลา birth จะมีตุ่นโผล่หน้ามา โดยสุ่มว่าจะเกิดที่ไหน จากนั้นจะรอใหโดนตีตามเวลา delay ถ้าหมดเวลา delay ยังไม่โดนตี จะหายไป 
function reloadMole(){
    // ถ้าเวลาไม่หมด ให้ทำตามนี้
    if (time>0) {
        // สุ่มเลขหลุมที่จะเกิด ตั้งแต่เลข 0 ถึง 15
        var randomPit = Math.floor(Math.random() * 16);

        // สุ่มตัวตุ่นปกติ กับ ตัวตุ่น Bonus
        var MoleArray = ['mole1', 'mole2'];
        var character = MoleArray[Math.floor(Math.random() * MoleArray.length)];

        // ตั้ง status ให้หลุมที่สุ่มได้ เป็นตุ่นโผล่มา
        pits[randomPit].setAttribute("status",character);
        soundplay("spawn");

        // ตั้งเวลาว่า เมื่อหมดเวลา ตุ่นจะหายไป
        setTimeout(
            function(){
                // ถ้าเวลายังไม่หมด ตุ่่นจะหาย
                if (time>0) {
                    pits[randomPit].setAttribute("status","blank");
                }
            }
            ,delay);
        // กำหนดหน่วงเวลาไว้ พอหมดเวลา ให้แรนดอมตุ่นออกมาต่ออีกรอบ
        setTimeout(
            function(){
            // เรียกตัวเอง
            reloadMole()
        }
        ,birth);
    }
}

// สำหรับการตี
function hit(pit){
    // ตีได้ต่อเมื่อไม่หมดเวลา
    if (time>0) {
        // ดูว่า  status ตอนนี้คืออะไร
        var status = pit.getAttribute("status");
        // ถ้าตีโดนตุ่น ปรับเป็น die
        if (status == "mole1") {
            pit.setAttribute("status","die");
            // กดถูกได้คะแนน
            score++;
            soundplay('hit');
            subTitle.innerText = "You Protect Earth!! score +1";
        }
        // ตุ่น-ตัวBonus
        else if(status == "mole2") {
            pit.setAttribute("status","die");
            // bonus เพิ่ม score
            score = score + 2;
            // bonus เพิ่มเวลา
            time = time + 2;
            soundplay('hit');
            subTitle.innerText = "You Kill Boss !! Bonus score & time +2";
        }
        // ถ้าตีโดน blank จะกลายเป็น miss
        else if(status == "blank"){
            pit.setAttribute("status","miss");
            // กดผิดติดลบ
            score--;
            // กดผิดลบเวลา
            time--;
            soundplay('miss');
            subTitle.innerText = "You Miss!! score & time -1";
        }
        // ถ้าตีโดน miss อีกให้ลบคะแนนและเวลา
        else if(status == "miss"){
            pit.setAttribute("status","miss");
            // กดผิดติดลบ
            score -= 3;
            // กดผิดลบเวลา
            time -= 3;
            soundplay('miss');
            subTitle.innerText = "You Miss!! score & time -3";
        }
        // แสดงคะแนนให้คนดู
        updateScore();
        updateTime();
    }
}

//ตัวแปรเก็บการกด
var clickcount = 0;

// สำหรับโชว์คะแนน
function updateScore(){
    // แสดงคะแนนให้คนดู
    theScore.innerText = score;
    // บวกค่าการกด
    clickcount++;
    // ตรวจสอบค่าและทำงานทำเงื่อนไข
    if (clickcount % 5 == 0 && birth > 300 && delay > 500) {
        birth -= 20;
        delay -= 50;
    }
    console.log(birth, delay);
}

//สำหรับโชว์เวลา
function updateTime(){
    // แสดงเวลา
    theTime.innerText = time;

    // ถ้าหมดเวลา ให้บอก และ reset กระดานเกม
    if (time <= 0) {
        for (var i = 0; i < pits.length; i++) {
            pits[i].setAttribute("status","blank");
        }
        subTitle.innerHTML = "GAMEOVER !! <a href='#!' onclick='ready()'>Play again!</a>";
    }
}

//Sound
function soundplay(id){
    document.getElementById(id).play();
}

//BGM
var bgmi = 0;
    function playbgm(){
    	if (bgmi==0) {
    		soundplay('bgm');
    		bgm++;
    	}
    }

//สั่งให้โหลดไฟล์ทั้งหมดก่อน โหลดเสร็จเกมค่อยเริ่ม
window.onload = function(){
    setTimeout(function(){playbgm()},500);
}