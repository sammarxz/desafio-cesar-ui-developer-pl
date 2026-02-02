document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('registration-form');
  var btnClear = document.getElementById('btn-clear');

  // ══════════════════════════════════════════════════════════════════════════
  //  Nav — hide on scroll down, show on scroll up (rAF-throttled)
  // ══════════════════════════════════════════════════════════════════════════

  var nav = document.querySelector('.nav');
  var lastScrollY = window.scrollY;
  var scrollTicking = false;

  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        var currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          nav.classList.add('nav--hidden');
        } else {
          nav.classList.remove('nav--hidden');
        }

        lastScrollY = currentScrollY;
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ══════════════════════════════════════════════════════════════════════════
  //  Form — validation, clear buttons, submission
  // ══════════════════════════════════════════════════════════════════════════

  // Mark inputs as "touched" on blur for CSS validation
  form.querySelectorAll('.form-field__input').forEach(function (input) {
    input.addEventListener('blur', function () {
      this.classList.add('touched');
    });
  });

  // Clear buttons (x) on text inputs
  document.querySelectorAll('.form-field__clear').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = this.closest('.form-field').querySelector('.form-field__input');
      if (input) {
        input.value = '';
        input.classList.remove('touched');
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  // Form "Clear" button
  if (btnClear) {
    btnClear.addEventListener('click', function () {
      form.reset();
      form.querySelectorAll('.form-field__input').forEach(function (input) {
        input.classList.remove('touched');
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      // TODO: reset phone selector
      // TODO: reset file upload
    });
  }

  // Form "Send" button
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      form.querySelectorAll('.form-field__input[required]').forEach(function (input) {
        input.classList.add('touched');
      });

      if (!form.checkValidity()) {
        var firstInvalid = form.querySelector('.form-field__input:invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var data = new FormData(form);
      var obj = {};
      data.forEach(function (value, key) {
        obj[key] = value;
      });

      console.log('Form submitted:', obj);
    });
  }
});
