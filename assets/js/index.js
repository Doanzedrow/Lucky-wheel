var LUCKYWHEEL = LUCKYWHEEL || {};
var previousAlpha = 0;
var isPercentage = true;
var deg = 0;
var prizes = [
  {
    title: "Điểm thưởng đạt được",
    text: "Lì xì",
    img: "./assets/image/istockphoto-1078059914-612x612.png",
    percentpage: 0.29, // 29%
    items: [10, 20, 30, 40],
    number: 5,
  },
  {
    title: "Bạn nhận được 1 món quà",
    text: "Quà tặng",
    img: "./assets/image/Bitmap (2).png",
    number: 5,
    percentpage: 0.01, // 1%
    items: ["1 son lancome", "1 chiếc SH", "1 con gấu bông", "1 chiếc áo thun"],
  },
  {
    title: "Thật tiếc",
    text: "Lời chúc",
    img: "./assets/image/Bitmap (1).png",
    percentpage: 0.4, // 40%
    items: ["Chúc bạn may mắn lần sau"],
  },
  {
    title: `Bạn nhận được số lần quay`,
    text: "Thêm lượt",
    img: "./assets/image/Bitmap.png",
    percentpage: 0.3, // 30%
    items: ["x1", "x2", "x3", "x4"],
    number: 4,
  },
];

$(document).ready(function () {
  LUCKYWHEEL.pageActive();
  LUCKYWHEEL.startGame();
});

// func play game
LUCKYWHEEL.playGame = () => {
  //lấy đối tượng play game
  var btnPlay = $(".play");
  //khi nhấn nút play thì sẽ thực hiện func getResultRandom()
  btnPlay.on("click", function () {
    LUCKYWHEEL.getResultRandom();
  });
};

LUCKYWHEEL.startGame = () => {
  var startGame = $(".start_game");
  startGame.on("click", function () {
    LUCKYWHEEL.countTimePlay();
  });
};

//func getResultRandom() => có tác dung tính toán góc quay, hiển thị popup
LUCKYWHEEL.getResultRandom = () => {
  var circle = $(".circle");
  var model = $(".model");
  var exit_model = $("#icon_exit");
  var randomIndex = LUCKYWHEEL.randomIndex(prizes);
  if (randomIndex == null) {
    alert("Thật tiếc. Hết quà rồi!");
    return;
  }
  var num = prizes.length;
  deg = deg || 0;
  deg = deg + (360 - (deg % 360)) + (360 * 10 - randomIndex * (360 / num));

  // khi tính toán được góc quay thì cho circle quay theo góc độ nó đã random
  circle.css("transition", "5s ease");
  circle.css("transform", "rotate(" + deg + "deg)");
  // Set time để khi quay xong hiện popup lên
  var wheel = new Howl({
    src: ["./assets/sound/wheel.mp3"],
  });
  var success = new Howl({
    src: ["./assets/sound/success.mp3"],
  });
  wheel.play();
  setTimeout(() => {
    model.css("display", "flex");
    LUCKYWHEEL.getPrizeRandom(randomIndex);
    LUCKYWHEEL.styleFontItem(randomIndex);
    wheel.stop();
    success.play();
  }, 5200);
  //nhấn nút exit tắt popup đi
  exit_model.on("click", function () {
    model.css("display", "none");
  });
};

// hiện thị giá trị của quà lên popup
LUCKYWHEEL.getPrizeRandom = (randomIndex) => {
  var model_content = $(".content_model");
  var title_model = $(".title_model");
  var turn_content = $(".turn-content");
  var point_content = $(".point-content");

  var prize = prizes[randomIndex];
  var item = Math.floor(Math.random() * prize.items.length);
  title_model.html(prize.title);
  model_content.html(prize.items[item]);

  if (randomIndex == 0) {
    var pre_point = point_content.html();
    var sum_point = parseInt(pre_point, 10) + prize.items[item];
    point_content.html(sum_point);
  }
  if (randomIndex == 3) {
    var pre_turn = turn_content.html().split("x")[1];
    var new_turn = prize.items[item].split("x")[1];
    var sum_turn = parseInt(pre_turn, 10) + parseInt(new_turn, 10);
    turn_content.html("x" + sum_turn);
    model_content.css("font-size", "6.5em");
  }
};

//func css
LUCKYWHEEL.styleFontItem = (randomIndex) => {
  var model_content = $(".content_model");
  if (randomIndex == 2) {
    model_content.css("font-size", "3em");
  } else if (randomIndex == 1) {
    if (model_content.html() != null) {
      model_content.html("");
    }
    model_content.append(
      ' <img class="img_gift" src="/assets/image/icon_gift.png" alt="Gift Image" />'
    );
    model_content.append(`<p class="gift_content">${gifts[randomgGifts]}</p>`);
    $(".img_gift").css("width", "90px");
    $(".img_gift").css("transform", "translateY(-15px)");
    $(".gift_content").css("font-size", "25px");
    $(".gift_content").css("transform", "translateY(-35px)");
    model_content.css("font-size", "6.5em");
  } else {
    model_content.css("font-size", "6.5em");
  }
};

//func đếm thời gian để hiện ra nội dung chơi
LUCKYWHEEL.countTimePlay = () => {
  var modelPlay = $(".model-play");
  var count_play = 3;
  LUCKYWHEEL.appendTemplateTimePlay();
  //thời gian chạy 3 giây hiển thị vòng quay
  var countdown = new Howl({
    src: ["./assets/sound/countdown.mp3"],
  });
  countdown.play();
  const timePlay = setInterval(function () {
    var time_content = $(".time-content");
    --count_play;
    time_content.html(count_play);
    if (count_play < 0) {
      clearInterval(timePlay);
      modelPlay.css("display", "inline-block");
      //hiển thị vòng quay ra
      LUCKYWHEEL.appendTemplatesModelPlay();
      LUCKYWHEEL.playGame();
      countdown.stop();
    }
  }, 1000);
};

//func khi nào trang active
LUCKYWHEEL.pageActive = () => {
  const PORT = "http://127.0.0.1:5502/";
  var URL = window.location.href;
  if (URL === PORT + "index.html") {
    $(".nav").children("li").children("a").eq(0).css("color", "red");
    LUCKYWHEEL.draw();
  } else if (URL === PORT + "rules.html") {
    $(".nav").children("li").children("a").eq(1).css("color", "red");
  } else if (URL === PORT + "awardlist.html") {
    $(".nav").children("li").children("a").eq(2).css("color", "red");
  } else {
    $(".nav").children("li").children("a").eq(3).css("color", "red");
  }
};

//func append templates for Model play
LUCKYWHEEL.appendTemplatesModelPlay = () => {
  $(".model-play").css("display", "inline-block");
  $(".rotation-lucky").css("display", "inline-flex");
  $(".turn").css("display", "inline-flex");
  $(".point").css("display", "inline-flex");
  $(".play").css("display", "inline-block");
  $(".rules").css("display", "none");
  $(".time_play").css("display", "none");
};

//func append templates time play
LUCKYWHEEL.appendTemplateTimePlay = () => {
  // Nội dung hiển thị là đếm số giây bắt đầu chơi
  $(".time_play").css("display", "inline-block");
  $(".rules").css("display", "none");
  $(".rotation-lucky").css("display", "none");
};

//random là quà nhận được
LUCKYWHEEL.randomIndex = (prizes) => {
  if (isPercentage) {
    //Đếm coi còn đủ số lượng quà không
    var counter = 1;
    for (let i = 0; i < prizes.length; i++) {
      if (prizes[i].number == 0) {
        counter++;
      }
    }
    if (counter == prizes.length) {
      return null;
    }
    let rand = Math.random();
    let prizeIndex = null;
    let cumulativeProbability = 0;
    // Kiểm tra trúng ô nào
    for (let i = prizes.length - 1; i >= 0; i--) {
      cumulativeProbability += prizes[i].percentpage;
      if (rand < cumulativeProbability) {
        prizeIndex = i;
        break;
      }
    }
    //Kiểm tra nếu ô đó còn quà hay ko
    if (prizes[prizeIndex].number != 0) {
      $(".pie-item").eq(prizeIndex).addClass("active");
      prizes[prizeIndex].number = prizes[prizeIndex].number - 1;
      return prizeIndex;
    } else {
      return LUCKYWHEEL.randomIndex(prizes);
    }
  } else {
    var counter = 1;
    for (let i = 0; i < prizes.length; i++) {
      if (prizes[i].number == 0) {
        counter++;
      }
    }
    if (counter == prizes.length) {
      return null;
    }
    var rand = (Math.random() * prizes.length) >>> 0;
    if (prizes[rand].number != 0) {
      prizes[rand].number = prizes[rand].number - 1;
      return rand;
    } else {
      return LUCKYWHEEL.randomIndex(prizes);
    }
  }
};

//Vẽ canvas
LUCKYWHEEL.draw = () => {
  var num = prizes.length;
  var rotateDeg = 360 / num / 2 + 90;
  var prizeItems = $("<ul></ul>");
  var turnNum = 1 / num;
  var html = [];

  var canvas = $(".hc-luckywheel-canvas")[0];
  var container = $(".circle");

  if (!canvas.getContext) {
    console.log("Browser is not support");
    return;
  }
  // Lấy context 2D của đối tượng canvas
  ctx = canvas.getContext("2d");

  for (var i = 0; i < num; i++) {
    // Lưu trạng thái hiện tại của context.
    ctx.save();
    //Bắt đầu một đường vẽ mới.
    ctx.beginPath();
    // Di chuyển tâm của hình tròn
    ctx.translate(250, 250); // Center Point
    ctx.moveTo(0, 0);
    ctx.rotate((((360 / num) * i - rotateDeg) * Math.PI) / 180);
    ctx.arc(0, 0, 250, 0, (2 * Math.PI) / num, false); // Radius
    if (i % 2 == 0) {
      ctx.fillStyle = "#e41f1f";
    } else {
      ctx.fillStyle = "#f9e335";
    }
    //Đổ màu vào hình tròn.
    ctx.fill();
    //Đặt độ rộng của đường vẽ là 1 pixel.
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#e4370e";
    //Vẽ đường viền của hình tròn.
    ctx.stroke();
    ctx.restore();

    var prizeList = prizes;
    html.push('<li class="pie-item"> <span style="');
    html.push("transform: rotate(" + i * turnNum + 'turn)">');
    html.push("<p id='curve'>" + prizeList[i].text + "</p>");
    html.push('<img src="' + prizeList[i].img + '" />');
    html.push("</span> </li>");

    if (i + 1 === num) {
      prizeItems.addClass("pie");
      container.append(prizeItems);
      prizeItems.html(html.join(""));
    }
  }
};
