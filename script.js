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

  // ── Aria-invalid helpers ──

  var ERROR_MESSAGES = {
    'first-name': 'First name is required',
    'last-name': 'Last name is required',
    'email': 'Please enter a valid email address'
  };

  function updateAriaInvalid(input) {
    var errorSpan = document.getElementById(input.id + '-error');
    if (!errorSpan) return;

    if (!input.validity.valid) {
      input.setAttribute('aria-invalid', 'true');
      errorSpan.textContent = ERROR_MESSAGES[input.id] || 'This field is required';
    } else {
      input.setAttribute('aria-invalid', 'false');
      errorSpan.textContent = '';
    }
  }

  // Mark inputs as "touched" on blur for CSS validation + aria-invalid
  form.querySelectorAll('.form-field__input').forEach(function (input) {
    input.addEventListener('blur', function () {
      this.classList.add('touched');
      if (this.hasAttribute('aria-invalid')) {
        updateAriaInvalid(this);
      }
    });

    input.addEventListener('input', function () {
      if (this.classList.contains('touched') && this.hasAttribute('aria-invalid')) {
        updateAriaInvalid(this);
      }
    });
  });

  // Clear buttons (x) on text inputs
  document.querySelectorAll('.form-field__clear').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = this.closest('.form-field').querySelector('.form-field__input');
      if (input) {
        input.value = '';
        input.classList.remove('touched');
        if (input.hasAttribute('aria-invalid')) {
          input.setAttribute('aria-invalid', 'false');
          var errorSpan = document.getElementById(input.id + '-error');
          if (errorSpan) errorSpan.textContent = '';
        }
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  function resetForm() {
    form.reset();
    form.querySelectorAll('.form-field__input').forEach(function (input) {
      input.classList.remove('touched');
      if (input.hasAttribute('aria-invalid')) {
        input.setAttribute('aria-invalid', 'false');
        var errorSpan = document.getElementById(input.id + '-error');
        if (errorSpan) errorSpan.textContent = '';
      }
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    phoneSelector.reset();
    fileUpload.reset();
  }

  // Form "Clear" button
  if (btnClear) {
    btnClear.addEventListener('click', resetForm);
  }

  // Form "Send" button
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      form.querySelectorAll('.form-field__input[required]').forEach(function (input) {
        input.classList.add('touched');
        updateAriaInvalid(input);
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

      var country = phoneSelector.getCountry();
      obj.phone_country = country.code;
      obj.phone_dial = country.dial;
      obj.phone_full = country.dial + ' ' + phoneSelector.getDigits();

      console.log('Form submitted:', obj);
      resetForm();
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  Phone Country Selector + Mask (encapsulated)
  // ══════════════════════════════════════════════════════════════════════════

  var phoneSelector = (function () {
    var COUNTRIES = [
      { code: 'BR', flag: '\u{1F1E7}\u{1F1F7}', dial: '+55',  mask: '(##) #####-####' },
      { code: 'US', flag: '\u{1F1FA}\u{1F1F8}', dial: '+1',   mask: '(###) ###-####' },
      { code: 'PT', flag: '\u{1F1F5}\u{1F1F9}', dial: '+351', mask: '### ### ###' },
      { code: 'AR', flag: '\u{1F1E6}\u{1F1F7}', dial: '+54',  mask: '## ####-####' },
      { code: 'CL', flag: '\u{1F1E8}\u{1F1F1}', dial: '+56',  mask: '# ####-####' },
      { code: 'CO', flag: '\u{1F1E8}\u{1F1F4}', dial: '+57',  mask: '### ###-####' },
      { code: 'MX', flag: '\u{1F1F2}\u{1F1FD}', dial: '+52',  mask: '## ####-####' },
      { code: 'DE', flag: '\u{1F1E9}\u{1F1EA}', dial: '+49',  mask: '#### #######' },
      { code: 'FR', flag: '\u{1F1EB}\u{1F1F7}', dial: '+33',  mask: '# ## ## ## ##' },
      { code: 'GB', flag: '\u{1F1EC}\u{1F1E7}', dial: '+44',  mask: '#### ######' },
      { code: 'ES', flag: '\u{1F1EA}\u{1F1F8}', dial: '+34',  mask: '### ## ## ##' },
      { code: 'IT', flag: '\u{1F1EE}\u{1F1F9}', dial: '+39',  mask: '### ### ####' },
      { code: 'JP', flag: '\u{1F1EF}\u{1F1F5}', dial: '+81',  mask: '##-####-####' },
      { code: 'IN', flag: '\u{1F1EE}\u{1F1F3}', dial: '+91',  mask: '#####-#####' },
      { code: 'CA', flag: '\u{1F1E8}\u{1F1E6}', dial: '+1',   mask: '(###) ###-####' },
      { code: 'AU', flag: '\u{1F1E6}\u{1F1FA}', dial: '+61',  mask: '#### ### ###' },
    ];

    var DEFAULT_INDEX = 0;

    var selectEl   = document.getElementById('phone-select');
    var triggerEl  = document.getElementById('phone-trigger');
    var dropdownEl = document.getElementById('phone-dropdown');
    var flagEl     = document.getElementById('phone-flag');
    var codeEl     = document.getElementById('phone-code');
    var inputEl    = document.getElementById('phone');

    var selected = COUNTRIES[DEFAULT_INDEX];

    // ── Mask helpers ──

    function stripDigits(str) {
      return str.replace(/\D/g, '');
    }

    function applyMask(digits, mask) {
      var result = '';
      var di = 0;
      for (var i = 0; i < mask.length && di < digits.length; i++) {
        if (mask[i] === '#') {
          result += digits[di];
          di++;
        } else {
          result += mask[i];
        }
      }
      return result;
    }

    function maxDigits(mask) {
      var count = 0;
      for (var i = 0; i < mask.length; i++) {
        if (mask[i] === '#') count++;
      }
      return count;
    }

    // ── Dropdown open/close ──

    function clearFocusedOption() {
      var options = dropdownEl.querySelectorAll('.phone-select__option');
      options.forEach(function (opt) {
        opt.classList.remove('phone-select__option--focused');
      });
      triggerEl.removeAttribute('aria-activedescendant');
    }

    function setFocusedOption(index) {
      var options = dropdownEl.querySelectorAll('.phone-select__option');
      clearFocusedOption();
      if (index >= 0 && index < options.length) {
        focusedIndex = index;
        options[index].classList.add('phone-select__option--focused');
        triggerEl.setAttribute('aria-activedescendant', options[index].id);
        options[index].scrollIntoView({ block: 'nearest' });
      }
    }

    function selectOption(index) {
      var country = COUNTRIES[index];
      if (!country) return;

      selected = country;
      flagEl.textContent = country.flag;
      codeEl.textContent = country.code;

      dropdownEl.querySelectorAll('.phone-select__option').forEach(function (opt) {
        opt.setAttribute('aria-selected', opt.dataset.country === country.code ? 'true' : 'false');
      });

      setOpen(false);
      inputEl.value = applyMask(stripDigits(inputEl.value), country.mask);
      inputEl.focus();
    }

    function setOpen(open) {
      selectEl.dataset.open = open ? 'true' : 'false';
      triggerEl.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) {
        focusedIndex = -1;
        clearFocusedOption();
      }
    }

    var focusedIndex = -1;

    // ── Build dropdown options ──

    COUNTRIES.forEach(function (country, index) {
      var li = document.createElement('li');
      li.className = 'phone-select__option';
      li.setAttribute('role', 'option');
      li.setAttribute('data-country', country.code);
      li.id = 'phone-option-' + index;
      if (country.code === selected.code) {
        li.setAttribute('aria-selected', 'true');
      }
      li.innerHTML =
        '<span class="phone-select__option-flag">' + country.flag + '</span>' +
        '<span>' + country.code + '</span>' +
        '<span class="phone-select__option-code">' + country.dial + '</span>';
      dropdownEl.appendChild(li);
    });

    // ── Event listeners ──

    triggerEl.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(selectEl.dataset.open !== 'true');
    });

    triggerEl.addEventListener('keydown', function (e) {
      var isOpen = selectEl.dataset.open === 'true';
      var optionCount = COUNTRIES.length;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setOpen(true);
            setFocusedOption(0);
          } else {
            setFocusedOption(focusedIndex < optionCount - 1 ? focusedIndex + 1 : 0);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!isOpen) {
            setOpen(true);
            setFocusedOption(optionCount - 1);
          } else {
            setFocusedOption(focusedIndex > 0 ? focusedIndex - 1 : optionCount - 1);
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            selectOption(focusedIndex);
          } else if (!isOpen) {
            setOpen(true);
            setFocusedOption(0);
          }
          break;
        case 'Escape':
          if (isOpen) {
            e.preventDefault();
            setOpen(false);
            triggerEl.focus();
          }
          break;
        case 'Home':
          if (isOpen) {
            e.preventDefault();
            setFocusedOption(0);
          }
          break;
        case 'End':
          if (isOpen) {
            e.preventDefault();
            setFocusedOption(optionCount - 1);
          }
          break;
      }
    });

    dropdownEl.addEventListener('click', function (e) {
      var option = e.target.closest('.phone-select__option');
      if (!option) return;

      var code = option.dataset.country;
      var index = COUNTRIES.findIndex(function (c) { return c.code === code; });
      if (index === -1) return;

      selectOption(index);
    });

    document.addEventListener('click', function (e) {
      if (!selectEl.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && selectEl.dataset.open === 'true') setOpen(false);
    });

    inputEl.addEventListener('input', function () {
      var digits = stripDigits(this.value);
      var max = maxDigits(selected.mask);
      if (digits.length > max) digits = digits.substring(0, max);
      this.value = applyMask(digits, selected.mask);
    });

    inputEl.addEventListener('keydown', function (e) {
      if (
        e.key &&
        e.key.length === 1 &&
        !/\d/.test(e.key) &&
        !e.ctrlKey && !e.metaKey
      ) {
        e.preventDefault();
      }
    });

    // ── Public API ──

    return {
      getCountry: function () { return selected; },
      getDigits: function () { return stripDigits(inputEl.value); },
      reset: function () {
        selected = COUNTRIES[DEFAULT_INDEX];
        flagEl.textContent = selected.flag;
        codeEl.textContent = selected.code;
        inputEl.value = '';
        setOpen(false);
      }
    };
  })();

  // ══════════════════════════════════════════════════════════════════════════
  //  File Upload Component (encapsulated)
  // ══════════════════════════════════════════════════════════════════════════

  var fileUpload = (function () {
    var ALLOWED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text'
    ];
    var MAX_SIZE = 5 * 1024 * 1024;

    var zone      = document.getElementById('file-upload-zone');
    var fileInput = document.getElementById('file-upload');
    var dragCounter = 0;
    var uploadTimer = null;

    var progressFilename = zone.querySelector('.file-upload__progress .file-upload__filename');
    var progressFilesize = zone.querySelector('.file-upload__progress .file-upload__filesize');
    var progressBarFill  = zone.querySelector('.file-upload__bar-fill');
    var progressBar      = zone.querySelector('.file-upload__bar');

    var completedFilename = zone.querySelector('.file-upload__completed .file-upload__filename');
    var completedSize     = zone.querySelector('.file-upload__completed-size');

    var progressRegion   = zone.querySelector('.file-upload__progress');
    var completedRegion  = zone.querySelector('.file-upload__completed');

    // ── Helpers ──

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      var kb = bytes / 1024;
      if (kb < 1024) return Math.round(kb) + ' KB';
      return (kb / 1024).toFixed(1) + ' MB';
    }

    function reset() {
      clearInterval(uploadTimer);
      uploadTimer = null;
      fileInput.value = '';
      zone.dataset.state = 'idle';
      dragCounter = 0;
      progressRegion.setAttribute('aria-label', 'File upload progress');
      completedRegion.setAttribute('aria-label', 'File upload completed');
    }

    // ── File handling ──

    function handleFile(file) {
      if (ALLOWED_TYPES.indexOf(file.type) === -1) {
        alert('File type not allowed. Please select a PDF, DOC, or ODT file.');
        reset();
        return;
      }
      if (file.size > MAX_SIZE) {
        alert('File is too large. Maximum size is 5 MB.');
        reset();
        return;
      }
      startUpload(file);
    }

    function startUpload(file) {
      var totalSize = file.size;
      var totalFormatted = formatSize(totalSize);

      progressFilename.textContent = file.name;
      progressBarFill.style.width = '0%';
      zone.dataset.state = 'uploading';
      progressRegion.setAttribute('aria-label', 'Uploading file: ' + file.name);

      var progress = 0;

      clearInterval(uploadTimer);
      uploadTimer = setInterval(function () {
        progress += 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(uploadTimer);
          uploadTimer = null;
          setTimeout(function () {
            completedFilename.textContent = file.name;
            completedSize.textContent = totalFormatted + ' of ' + totalFormatted;
            completedRegion.setAttribute('aria-label', 'Upload completed: ' + file.name);
            zone.dataset.state = 'completed';
          }, 300);
        }

        var loaded = Math.round((progress / 100) * totalSize);
        progressFilesize.textContent = formatSize(loaded) + ' of ' + totalFormatted;
        progressBarFill.style.width = progress + '%';
        progressBar.setAttribute('aria-valuenow', progress);
      }, 60);
    }

    // ── Event listeners ──

    zone.querySelectorAll('.file-upload__remove').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        reset();
      });
    });

    var dragoverArea = zone.querySelector('.file-upload__dragover');
    dragoverArea.addEventListener('click', function () {
      fileInput.click();
    });

    zone.addEventListener('dragenter', function (e) {
      e.preventDefault();
      dragCounter++;
      if (zone.dataset.state === 'idle') zone.dataset.state = 'dragover';
    });

    zone.addEventListener('dragover', function (e) {
      e.preventDefault();
    });

    zone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        if (zone.dataset.state === 'dragover') zone.dataset.state = 'idle';
      }
    });

    zone.addEventListener('drop', function (e) {
      e.preventDefault();
      dragCounter = 0;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      } else {
        zone.dataset.state = 'idle';
      }
    });

    fileInput.addEventListener('change', function () {
      if (this.files && this.files.length > 0) handleFile(this.files[0]);
    });

    // ── Public API ──

    return { reset: reset };
  })();
});
