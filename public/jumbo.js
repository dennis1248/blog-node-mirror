const jumboLeft = document.getElementById("jumbo_btn_left");
const jumboRight = document.getElementById("jumbo_btn_right");
const jumboBody = document.getElementById("main_jumbo");

var img = 1;
var imgCount = 3; // The amount of images

function rollImgFoward() {
  if (img === (imgCount + 1)) {
    img = 1;
  }
}

function rollImgbackwards() {
  if (img === 0) {
    img = imgCount;
  }
}

jumboLeft.addEventListener("click", function () {
  img--;
  rollImgbackwards()
  jumboBody.style.backgroundImage = "url(/images/placeholder_" + img + ".jpg)";
});

jumboRight.addEventListener("click", function () {
  img++;
  rollImgFoward();
  jumboBody.style.backgroundImage = "url(/images/placeholder_" + img + ".jpg)";
});
