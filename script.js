(function () {
  var stage = document.getElementById('stage');
  var wick = document.getElementById('wick');
  var lit = false;

  // Synthesized match-strike + flame "whoosh" + soft crackle (no audio file needed)
  function playLightSfx() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      var ctx = new AC();
      var t = ctx.currentTime;

      function noise(dur) {
        var buf = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate);
        var d = buf.getChannelData(0);
        for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        var src = ctx.createBufferSource();
        src.buffer = buf;
        return src;
      }

      // 1) Match scratch
      var s1 = noise(0.3), f1 = ctx.createBiquadFilter(), g1 = ctx.createGain();
      f1.type = 'bandpass'; f1.Q.value = 1.5;
      f1.frequency.setValueAtTime(1500, t);
      f1.frequency.exponentialRampToValueAtTime(5000, t + 0.28);
      g1.gain.setValueAtTime(0, t);
      g1.gain.linearRampToValueAtTime(0.35, t + 0.05);
      g1.gain.linearRampToValueAtTime(0, t + 0.3);
      s1.connect(f1); f1.connect(g1); g1.connect(ctx.destination);
      s1.start(t);

      // 2) Ignition whoosh
      var s2 = noise(1.3), f2 = ctx.createBiquadFilter(), g2 = ctx.createGain();
      f2.type = 'lowpass';
      f2.frequency.setValueAtTime(400, t + 0.3);
      f2.frequency.exponentialRampToValueAtTime(1800, t + 0.45);
      f2.frequency.exponentialRampToValueAtTime(600, t + 1.5);
      g2.gain.setValueAtTime(0, t + 0.3);
      g2.gain.linearRampToValueAtTime(0.5, t + 0.4);
      g2.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
      s2.connect(f2); f2.connect(g2); g2.connect(ctx.destination);
      s2.start(t + 0.3);

      // 3) Little flame crackles
      for (var i = 0; i < 7; i++) {
        var at = t + 0.6 + Math.random() * 1.6;
        var c = noise(0.025), hp = ctx.createBiquadFilter(), cg = ctx.createGain();
        hp.type = 'highpass'; hp.frequency.value = 2500;
        cg.gain.value = 0.08 + Math.random() * 0.12;
        c.connect(hp); hp.connect(cg); cg.connect(ctx.destination);
        c.start(at);
      }

      setTimeout(function () { ctx.close(); }, 3000);
    } catch (e) { /* audio not supported - fail silently */ }
  }

  function light() {
    if (lit) return;
    lit = true;
    playLightSfx();
    stage.classList.add('lit');
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