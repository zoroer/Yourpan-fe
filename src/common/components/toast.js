/**
 * toast提示
 * @param text
 * @param duration
 */
export default function Toast (text, duration) {
  let toastTimer;
  let body = document.getElementsByTagName('body')[0];
  let wrap = document.getElementById('#fe-web-kc-toast');
  let toastText = text || 'toast';
  let toastDuration = duration || 2000;

  // 去重
  if (wrap && wrap.length) {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    body.removeChild(wrap);
  }

  let toastHtml =
    `<div id="fe-web-kc-toast" style="position:fixed; width:100%; left:0; bottom:100px; text-align:center;">
      <p style="background:rgba(0,0,0,.6); color:#fff; border-radius:100px; display:inline-block; padding:10px 15px; font-size:14px;">
        ${toastText}
      </p>
    </div>`;

  let divTemp = document.createElement('div');
  divTemp.innerHTML = toastHtml;
  body.appendChild(divTemp);

  toastTimer = setTimeout(function () {
    body.removeChild(divTemp);
  }, toastDuration);
}
