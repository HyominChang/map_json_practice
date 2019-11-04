//json파일
var section = document.querySelector('section'); //html의 section을 변수선언
var header = document.querySelector('header'); //html의 header 변수선언

var request = new XMLHttpRequest();
request.open('GET', "./rstrnt.json");
request.responseType="json";
request.send();

request.onload = function(){
  var datar = request.response;
  showheader(datar);
  showrest(datar);
}

function showheader(jsonObj){
  var myH1 = document.createElement('h1');
  myH1.textContent = jsonObj['title'];
  header.appendChild(myH1);
}

function showrest(jsonObj){
  var rstrntlists = jsonObj['etrprs'];
  // var rstnamearr = [];
  // var rstaddarr = [];

  //json에서 order값 불러와서 버튼만들기
  var buttonA = document.createElement('button');
  buttonA.textContent = rstrntlists[0].order;
  section.appendChild(buttonA);
  buttonA.id = "btnA";

  var buttonB = document.createElement('button');
  buttonB.textContent = rstrntlists[1].order;
  section.appendChild(buttonB);
  buttonB.id = "btnB";

  //주소값 가져오기
  var addA = rstrntlists[0].address;
  var addB = rstrntlists[1].address;
  var nameA = document.createElement('p');
  nameA.textContent = rstrntlists[0].name;
  section.appendChild(nameA);
  // var nameB = document.createElement('p');
  // nameB.textContent = rstrntlists[1].name;
  // section.appendChild(nameB);

  //지도, 주소-좌표변환
  var container = document.getElementById('map');
  var options = {
    center: new daum.maps.LatLng(33.450701, 126.570667),
    level: 8,
    //mapTypeId: daum.maps.MapTypeId.SKYVIEW,
  };

  var map = new daum.maps.Map(container, options);

  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new daum.maps.services.Geocoder();

  //마커모음 배열만들기
  var markersA = [];
  var markersB = [];

  //주소로 좌표를 검색합니다
  geocoder.addressSearch(addA, function(result, status){
    // 정상적으로 검색이 완료됐으면
    //console.log(status);
    if (status === daum.maps.services.Status.OK){
      var coordsA = new daum.maps.LatLng(result[0].y, result[0].x);
      // 결과값으로 받은 위치를 마커로 표시
      var markerA = new daum.maps.Marker({
        map: map,
        position: coordsA
      });
      //마커배열에 마커를
      markersA.push(markerA);

      // 지도의 중심을 결과값으로 받은 위치로
      map.setCenter(coordsA);

      markerA.class = "mkA";
    }
  });

  geocoder.addressSearch(addB, function(result, status){
    if(status === daum.maps.services.Status.OK){
      var coordsB = new daum.maps.LatLng(result[0].y,result[0].x);
      var markerB = new daum.maps.Marker({
        map: map,
        position: coordsB
      });

      //마커배열에 마커를
      markersB.push(markerB);

      var mLabelB = new kakao.maps.InfoWindow({
        position: coordsB, // 지도의 중심좌표에 올립니다.
        content: nameA // 인포윈도우 내부에 들어갈 컨텐츠 입니다.
      });

      mLabelB.open(map, markerB); // 지도에 올리면서, 두번째 인자로 들어간 마커 위에 올라가도록 설정합니다.
      markerB.class = "mkB"
    }
  });


  setMarkersA = function(map) {
      for (var i = 0; i < markersA.length; i++) {
          markersA[i].setMap(map);
      }
  }

  setMarkersB = function(map) {
      for (var i = 0; i < markersB.length; i++) {
          markersB[i].setMap(map);
      }
  }

  showMarkersA = function(){
      setMarkersA(map);
      setMarkersB(null);
  }

  showMarkersB = function(){
      setMarkersA(null);
      setMarkersB(map);
  }

}
