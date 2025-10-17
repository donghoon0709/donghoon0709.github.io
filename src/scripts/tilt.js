( function () {
  // 기본 옵션 (data-tilt-* 로 개별 오버라이드 가능)
  const DEFAULTS = {
    max: 14,          // 최대 기울기 각도 (deg)
    scale: 1.06,      // 호버 시 스케일
    lift: -2          // 살짝 떠오르는 Y 이동(px)
  };

  function clamp(v, min, max){
    return v < min ? min : (v > max ? max : v);
  }

  function getOpts(el){
    const d = el.dataset;
    return {
      max:   d.tiltMax   ? +d.tiltMax   : DEFAULTS.max,
      scale: d.tiltScale ? +d.tiltScale : DEFAULTS.scale,
      lift:  d.tiltLift  ? +d.tiltLift  : DEFAULTS.lift
    };
  }

  function applyTilt(el, e){
    const { max, scale, lift } = getOpts(el);
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width/2;
    const cy = r.top  + r.height/2;
    let px = (e.clientX - cx) / (r.width/2);   // -1 ~ 1
    let py = (e.clientY - cy) / (r.height/2);  // -1 ~ 1
    px = clamp(px, -1, 1); py = clamp(py, -1, 1);

    // 포인터 쪽이 화면 안쪽으로: 좌측→rotateY(+), 상단→rotateX(-)
    const rotY =  px * max;
    const rotX =  py * max;

    el.style.transform =
      `translateZ(0) translateY(${lift}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
    el.style.filter = "drop-shadow(0 6px 12px rgba(0,0,0,.12))";
  }

  function resetTilt(el){
    el.style.transform = "";
    el.style.filter = "";
  }

  // 모든 .tilt에 바인딩
  const nodes = document.querySelectorAll(".tilt");
  nodes.forEach(el => {
    el.addEventListener("mousemove", (e)=> applyTilt(el, e));
    el.addEventListener("mouseleave", ()=> resetTilt(el));
    el.addEventListener("touchstart", ()=>{
      const { scale } = getOpts(el);
      el.style.transform = `translateZ(0) scale(${scale})`;
      el.style.filter = "drop-shadow(0 6px 12px rgba(0,0,0,.12))";
      setTimeout(()=> resetTilt(el), 180);
    }, { passive: true });
  });

  // 접근성: 키보드 포커스 시 틸트 제거(외곽선만)
  document.addEventListener("focusin", (e)=>{
    const t = e.target.closest(".tilt");
    if (t) resetTilt(t);
  });
}) ();