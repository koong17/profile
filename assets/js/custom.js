$(document).ready(function(){
    loadGuestbook();
})

function loadGuestbook() {
    fetch("https://script.google.com/macros/s/AKfycbyLG9Y8zJ7Wa0R-m6rFhD6XIHOOxEmD9K-Etc2fd0YMp_44NeIUEC8t/exec")
    .then((response) => response.json())
    .then((data) => {
        var res = data.result;
        var wrap = $('#guestbook')

        if (res === "success") {
            gb = JSON.parse(data.data);
            console.log("success")
            console.log(gb);
            let minval = Math.max(-1, gb.length - 6);
            for (let i = gb.length - 1; i > minval; i--) {
                const element = gb[i];
                var htmlString = makePostBlock(element[1], new Date(element[0]), element[2], i);
                wrap.append(htmlString)
               
            }
        } else {
            wrap.append(makePostBlock("Kang Suah", new Date(), "서버 문제로 방명록을 로드할 수 없습니다.", 1));
        }
        swipeChange();
    });
}

function makePostBlock(n, d, m, i) {
    var htmlString = ` <div class="post">
                <div class="post__media"><img src="https://source.unsplash.com/random/600x400?sig=${i}" alt=""/></div>
                <div>
                    <div class="post__meta"><span class="author">${n}</span><span class="cat"><i class='fa fa-calendar-alt'></i> ${d.toDateString()}</span></div>
                    <p class="post__text">${m}</p>
                </div>
            </div>`;
    return htmlString;
}

function swipeChange() {
	$('.swiper__module').each(function () {
		var self = $(this),
			    wrapper = $('.swiper-wrapper', self),
			    optData = eval('(' + self.attr('data-options') + ')'),
			    optDefault = {
			paginationClickable: true,
			pagination: self.find('.swiper-pagination-custom'),
			nextButton: self.find('.swiper-button-next-custom'),
			prevButton: self.find('.swiper-button-prev-custom'),
			spaceBetween: 30
		},
			    options = $.extend(optDefault, optData);
		wrapper.children().wrap('<div class="swiper-slide"></div>');
		var swiper = new Swiper(self, options);

		function thumbnails(selector) {

			if (selector.length > 0) {
				var wrapperThumbs = selector.children('.swiper-wrapper'),
					    optDataThumbs = eval('(' + selector.attr('data-options') + ')'),
					    optDefaultThumbs = {
					spaceBetween: 10,
					centeredSlides: true,
					slidesPerView: 3,
					touchRatio: 0.3,
					slideToClickedSlide: true,
					pagination: selector.find('.swiper-pagination-custom'),
					nextButton: selector.find('.swiper-button-next-custom'),
					prevButton: selector.find('.swiper-button-prev-custom')
				},
					    optionsThumbs = $.extend(optDefaultThumbs, optDataThumbs);
				wrapperThumbs.children().wrap('<div class="swiper-slide"></div>');
				var swiperThumbs = new Swiper(selector, optionsThumbs);
				swiper.params.control = swiperThumbs;
				swiperThumbs.params.control = swiper;
			}
		}
		thumbnails(self.next('.swiper-thumbnails__module'));
	});
}

function sendGuestbook() {
    let name = document.querySelector("#gName");
    let message = document.querySelector("#gMessage");

    if (!name.value || !message.value) {
        alert("이름 혹은 내용을 확인해주세요.");
        return;
    }

    var data = {
        name: name.value,
        message: message.value
    }

    var encoded = encode(data);
    document.getElementById("lds").style.display = "block";
    fetch("https://script.google.com/macros/s/AKfycbyLG9Y8zJ7Wa0R-m6rFhD6XIHOOxEmD9K-Etc2fd0YMp_44NeIUEC8t/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: encoded
    }).then((response) => response.json())
    .then((data) => {
        var res = data.result;
        if (res === "success") {
            var wrap = $('#guestbook')
            wrap.prepend(makePostBlock(name.value, new Date(), message.value, Math.floor(Math.random() * 100)));
            swipeChange();
            name.value = "";
            message.value = "";
            
            document.getElementById("lds").style.display = "none";
        } else {
            alert("서버의 문제로 방명록을 작성하지 못했습니다.");
            document.getElementById("lds").style.display = "none";
        }
    });
}

// mail
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

    var encoded = encode(data);

    data.formDataNameOrder = '["name","message","email"]';

    document.getElementById("lds").style.display = "block";
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
            document.getElementById("lds").style.display = "none";
        } else {
            alert("서버의 문제로 메일을 보내지 못했습니다.");
            document.getElementById("lds").style.display = "none";
        }
    });
}

function encode(data) {
    return Object.keys(data).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]); }).join('&');
}

function checkEmail(str) {
    var reg_email = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (!reg_email.test(str)) {
        return false;
    }
    else {
        return true;
    }
}


// luck
function findLuck() {
    let todayMsg = [
        "1%의 가능성, 그것이 나의 길이다. -나폴레옹",
        "가난은 가난하다고 느끼는 곳에 존재한다 .-에머슨",
        "겨울이 오면 봄이 멀지 않으리. -셸리",
        "계단을 밟아야 계단 위에 올라설 수 있다. -터키속담",
        "고개 숙이지 마십시오. 세상을 똑바로 정면으로 바라보십시오. -헬렌 켈러",
        "고난의 시기에 동요하지 않는 것, 이것은 진정 칭찬받을 만한 뛰어난 인물의 증거다. -베토벤",
        "고통이 남기고 간 뒤를 보라! 고난이 지나면 반드시 기쁨이 스며든다. -괴테",
        "곧 위에 비교하면 족하지 못하나, 아래에 비교하면 남음이 있다. -명심보감",
        "그대의 하루하루를 그대의 마지막 날이라고 생각하라. -호라티우스",
        "길을 잃는다는 것은 곧 길을 알게 된다는 것이다. -동아프리카속담",
        "꿈을 계속 간직하고 있으면 반드시 실현할 때가 온다. -괴테",
        "나이가 60이다 70이다 하는 것으로 그 사람이 늙었다 젊었다 할 수 없다. 늙고 젊은 것은 그 사람의 신념이 늙었느냐 젊었느냐 하는 데 있다. -맥아더",
        "내 비장의 무기는 아직 손안에 있다. 그것은 희망이다. -나폴레옹",
        "너 자신의 불행을 생각하지 않게 되는 가장 좋은 방법은 일에 몰두하는 것이다. -베토벤",
        "너무 소심하고 까다롭게 자신의 행동을 고민하지 말라. 모든 인생은 실험이다. 더 많이 실험할수록 더 나아진다 -랄프 왈도 에머슨",
        "눈물과 더불어 빵을 먹어 보지 않은 자는 인생의 참다운 맛을 모른다. -괴테",
        "단순하게 살아라. 현대인은 쓸데없는 절차와 일 때문에 얼마나 복잡한 삶을 살아가는가? -이드리스 샤흐",
        "당신의 행복은 무엇이 당신의 영혼을 노래하게 하는가에 따라 결정된다. -낸시 설리번",
        "당신이 할 수 있다고 믿든 할 수 없다고 믿든 믿는 대로 될 것이다. -헨리 포드",
        "도중에 포기하지 말라. 망설이지 말라. 최후의 성공을 거둘 때까지 밀고 나가자. -헨리포드",
        "돈이란 바닷물과도 같다. 그것은 마시면 마실수록 목이 말라진다. -쇼펜하우어",
        "되찾을 수 없는 게 세월이니 시시한 일에 시간을 낭비하지 말고 순간순간을 후회 없이 잘 살아야 한다. -루소",
        "마음만을 가지고 있어서는 안 된다. 반드시 실천하여야 한다. -이소룡",
        "만약 우리가 할 수 있는 일을 모두 한다면 우리는 우리 자신에 깜짝 놀랄 것이다. -에디슨",
        "만족할 줄 아는 사람은 진정한 부자이고, 탐욕스러운 사람은 진실로 가난한 사람이다. -솔론",
        "먼저 핀 꽃은 먼저 진다. 남보다 먼저 공을 세우려고 조급히 서둘 것이 아니다. -채근담",
        "모든 것들에는 나름의 경이로움과 심지어 어둠과 침묵이 있고, 내가 어떤 상태에 있더라도 나는 그 속에서 만족하는 법을 배운다. -헬렌켈러",
        "문제는 목적지에 얼마나 빨리 가느냐가 아니라 그 목적지가 어디냐는 것이다. -메이벨 뉴컴버",
        "문제점을 찾지 말고 해결책을 찾으라. -헨리포드",
        "물러나서 조용하게 구하면 배울 수 있는 스승은 많다. 사람은 가는 곳마다 보는 것마다 모두 스승으로서 배울 것이 많은 법이다. -맹자",
        "사람이 여행하는 것은 도착하기 위해서가 아니라 여행하기 위해서이다. -괴테",
        "사막이 아름다운 것은 어딘가에 샘이 숨겨져 있기 때문이다. -생텍쥐베리",
        "산다는 것, 그것은 치열한 전투이다. -로망로랑",
        "삶을 사는 데는 단 두 가지 방법이 있다. 하나는 기적이 전혀 없다고 여기는 것이고 또 다른 하나는 모든 것이 기적이라고 여기는 방식이다. -알버트 아인슈타인",
        "삶이 있는 한 희망은 있다. -키케로",
        "성공의 비결은 단 한 가지, 잘할 수 있는 일에 광적으로 집중하는 것이다.-톰 모나건",
        "성공해서 만족하는 것은 아니다. 만족하고 있었기 때문에 성공한 것이다. -알랭",
        "세상은 고통으로 가득하지만 극복하는 사람들로도 가득하다. -헬렌켈러",
        "신은 용기 있는 자를 절대 버리지 않는다. -켄러",
        "실패는 잊어라. 그러나 그것이 준 교훈은 절대 잊으면 안 된다. -하버트 개서",
        "어리석은 자는 멀리서 행복을 찾고, 현명한 자는 자신의 발치에서 행복을 키워간다 -제임스 오펜하임",
        "언제나 현재에 집중할 수 있다면 행복할 것이다. -파울로 코엘료",
        "오랫동안 꿈을 그리는 사람은 마침내 그 꿈을 닮아 간다. -앙드레 말로",
        "용기 있는 자로 살아라. 운이 따라주지 않는다면 용기 있는 가슴으로 불행에 맞서라. -키케로",
        "우리는 두려움의 홍수에 버티기 위해서 끊임없이 용기의 둑을 쌓아야 한다. -마틴 루터 킹",
        "우선 무엇이 되고자 하는가를 자신에게 말하라. 그리고 해야 할 일을 하라. -에픽토테스",
        "이룰 수 없는 꿈을 꾸고 이길 수 없는 적과 싸우며, 이룰 수 없는 사랑을 하고 견딜 수 없는 고통을 견디고, 잡을 수 없는 저 하늘의 별도 잡자. -세르반테스",
        "이미 끝나버린 일을 후회하기보다는 하고 싶었던 일들을 하지 못한 것을 후회하라. -탈무드",
        "인간의 삶 전체는 단지 한순간에 불과하다. 인생을 즐기자. -플루타르코스",
        "인생에 뜻을 세우는 데 있어 늦었을 때라곤 없다 -볼드윈",
        "인생에서 원하는 것을 엇기 위한 첫 번째 단계는 내가 무엇을 원하는지 결정하는 것이다 -벤스타인",
        "인생을 다시 산다면 다음번에는 더 많은 실수를 저지르리라. -나딘 스테어",
        "인생이란 학교에는 불행이란 훌륭한 스승이 있다. 그 스승 때문에 우리는 더욱 단련되는 것이다. -프리체",
        "일하여 얻으라. 그러면 운명의 바퀴를 붙들어 잡은 것이다. -랄프 왈도 에머슨",
        "자신감 있는 표정을 지으면 자신감이 생긴다. -찰스 다윈",
        "자신을 내보여라. 그러면 재능이 드러날 것이다. -발타사르 그라시안",
        "자신의 본성이 어떤 것이든 그에 충실하라. 자신이 가진 재능의 끈을 놓아 버리지 마라. 본성이 이끄는 대로 따르면 성공할 것이다. -시드니 스미스",
        "자신이 해야 할 일을 결정하는 사람은 세상에서 단 한 사람, 오직 나 자신뿐이다. -오손 웰스",
        "작은 기회로부터 종종 위대한 업적이 시작된다. -데모스테네스",
        "재산을 잃은 사람은 많이 잃은 것이고, 친구를 잃은 사람은 더 많이 잃은 것이며, 용기를 잃은 사람은 모든 것을 잃은 것이다. -세르반테스",
        "절대 어제를 후회하지 마라. 인생은 오늘의 나 안에 있고 내일은 스스로 만드는 것이다. -L.론허바드",
        "좋은 성과를 얻으려면 한 걸음 한 걸음이 힘차고 충실하지 않으면 안 된다. -단테",
        "지금이야말로 일할 때다. 지금이야말로 싸울 때다. 지금이야말로 나를 더 훌륭한 사람으로 만들 때다. 오늘 그것을 못 하면 내일 그것을 할 수 있는가? -토마스 아켐피스",
        "직업에서 행복을 찾아라. 아니면 행복이 무엇인지 절대 모를 것이다. -엘버트 허버드",
        "진짜 문제는 사람들의 마음이다. 그것은 절대로 물리학이나 윤리학의 문제가 아니다. -아인슈타인",
        "최고에 도달하려면 최저에서 시작하라. -P.시루스",
        "평생 살 것처럼 꿈을 꾸어라. 그리고 내일 죽을 것처럼 오늘을 살아라. -제임스 딘",
        "피할 수 없으면 즐겨라. -로버트 엘리엇",
        "하루에 3시간을 걸으면 7년 후에 지구를 한 바퀴 돌 수 있다. -사무엘존슨",
        "한 번의 실패와 영원한 실패를 혼동하지 말라. -F.스콧 핏제랄드",
        "해야 할 것을 하라. 모든 것은 타인의 행복을 위해서, 동시에 특히 나의 행복을 위해서이다. -톨스토이",
        "행복은 습관이다. 그것을 몸에 지니라. -허버드",
        "화가 날 때는 100까지 세라. 최악일 때는 욕설을 퍼부어라. -마크 트웨인",
        "화려한 일을 추구하지 말라. 중요한 것은 스스로의 재능이며, 자신의 행동에 쏟아붓는 사랑의 정도이다. -머더 테레사",
        "사람을 화나게 하는 방법은 두 가지가 있다. 첫째는 말을 하다 마는 것이고, 둘째는"
    ];
    
    alert(todayMsg[Math.floor(Math.random() * todayMsg.length)]);
    return;
}