(function () {
  var stage = document.getElementById('stage');
  var wick = document.getElementById('wick');
  var lit = false;

  function light() {
    if (lit) return;
    lit = true;
    stage.classList.add('lit');
    // After the flame glows for a moment, fade into the uniform scene
    setTimeout(function () {
      stage.classList.add('show2');
    }, 2800);
  }

  wick.addEventListener('click', light);
  wick.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      light();
    }
  });
})();