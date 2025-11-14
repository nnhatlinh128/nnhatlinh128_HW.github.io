$(function () {
    // Khai báo các object
    var container = $('#container');      
    var bird = $('#bird');               
    var pole = $('.pole');               
    var pole_1 = $('#pole_1');           
    var pole_2 = $('#pole_2');           
    var score = $('#score');              
    var levelDisplay = $('#level');       // Thêm thẻ hiển thị Level

    // Chuyển các thông tin của object sang dạng số thực
    var container_width = parseInt(container.width());      
    var container_height = parseInt(container.height());    
    var pole_initial_position = parseInt(pole.css('right'));  
    var pole_initial_height = parseInt(pole.css('height'));   
    var bird_left = parseInt(bird.css('left'));             
    var bird_height = parseInt(bird.height());             
    
    var speed = 10; 
    var gameIntervalTime = 40; //interval thay đổi theo Level
    var gameLoop; // lưu interval game
    var upInterval; // lưu interval bay lên

    // Một số trạng thái trong game
    var go_up = false;            
    var score_updated = false;    
    var game_over = false;        

    // Khởi tạo Level
    var level = 1;                // thêm biến level

    // hàm cập nhật Level dựa trên điểm
    function updateLevel() {
        var currentScore = parseInt(score.text());
        if(currentScore >= 50){
            stop_the_game(true); // chiến thắng
        } else if(currentScore >= 40){
            level = 4;
            gameIntervalTime = 20;
        } else if(currentScore >= 20){
            level = 3;
            gameIntervalTime = 25;
        } else if(currentScore >= 5){
            level = 2;
            gameIntervalTime = 30;
        } else {
            level = 1;
            gameIntervalTime = 40;
        }

        levelDisplay.text('Level: ' + level);

        // Nếu interval thay đổi, restart gameLoop để cập nhật tốc độ
        if(gameLoop){
            clearInterval(gameLoop);
            gameLoop = setInterval(runGame, gameIntervalTime);
        }
    }

    // tách ra hàm runGame() để dùng cho interval
    function runGame() {
        if (collision(bird, pole_1) || collision(bird, pole_2) || 
            parseInt(bird.css('top')) <= 0 || 
            parseInt(bird.css('top')) > container_height - bird_height)
        {
            stop_the_game(false); // 
        } else {
            var pole_current_position = parseInt(pole.css('right')); 

            // Cập nhật điểm + Level
            if (pole_current_position > container_width - bird_left) {
                if (!score_updated) {
                    score.text(parseInt(score.text()) + 1);
                    score_updated = true;
                    updateLevel(); // Cập nhật Level khi score thay đổi
                }
            }

            // Giữ nguyên logic tạo ống mới khi đi ra khỏi khung
            if (pole_current_position > container_width) {
                var new_height = parseInt(Math.random() * 100);
                pole_1.css('height', pole_initial_height + new_height);
                pole_2.css('height', pole_initial_height - new_height);
                score_updated = false;
                pole_current_position = pole_initial_position;
            }

            // Di chuyển ống
            pole.css('right', pole_current_position + speed); 

            // Chim rơi xuống nếu không bay lên
            if(!go_up) {
                go_down(); 
            }
        }
    }

    // Hàm bắt đầu game
    function playGame() {
        gameLoop = setInterval(runGame, gameIntervalTime);
    }

    
    function go_down() {
        bird.css('top', parseInt(bird.css('top')) + 10);
        bird.css('transform', 'rotate(50deg)');
    }

    
    function up() {
        bird.css('top', parseInt(bird.css('top')) - 20);
        bird.css('transform', 'rotate(-10deg)');
    }

    // thay mouse down/up bằng phím ArrowDown
    $(document).keydown(function(e){
        if(e.key === "ArrowDown" && !upInterval && !game_over){
            upInterval = setInterval(up, 40);
        }
    });

    $(document).keyup(function(e){
        if(e.key === "ArrowDown"){
            clearInterval(upInterval);
            upInterval = null;
        }
    });

    
    $('#play_btn').click(function() {
        playGame();
        $(this).hide();
    });

    
    $('#restart_btn').click(function () {
        location.reload();
    });

    // stop game với option chiến thắng hay thua
    function stop_the_game(win) {
        clearInterval(gameLoop);
        clearInterval(upInterval);
        game_over = true;
        if(win){
            alert("🎉 Chúc mừng! Bạn đã chiến thắng Level 4 với 50 điểm!");
        } else {
            alert("💀 Game Over!");
        }
        $('#restart_btn').slideDown();
    }

    
    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        else return true;
    }
});
