// Shared helper to send simple email captures to the I Read Space Bookings sheet (Sheet2 tab)
(function() {
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQX3YcflcWNrUZN7a4pcBkzWmf5B4R4vccK5Ci32LuPnpW6YJnKNJrlUYyJ_vz-609/exec';
  var SHEET_NAME = 'Sheet2';
  var TRACKER_PDF_PATH = '../../assets/43day-reset-tracker-FINAL.pptx.pdf';

  function isValidEmail(value) {
    if (!value || typeof value !== 'string') return false;
    var trimmed = value.trim();
    if (trimmed.length === 0) return false;
    // Basic check: has @, something before @, something after @ with at least one dot
    var at = trimmed.indexOf('@');
    if (at <= 0 || at === trimmed.length - 1) return false;
    var after = trimmed.slice(at + 1);
    if (after.indexOf('.') <= 0 || after.length < 3) return false;
    return true;
  }

  function sendEmailToSheets(email, source) {
    if (!email) return;

    try {
      var iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.name = 'email-capture-' + Date.now();
      document.body.appendChild(iframe);

      var form = document.createElement('form');
      form.method = 'POST';
      form.action = GOOGLE_SCRIPT_URL;
      form.target = iframe.name;
      form.style.display = 'none';

      var dataInput = document.createElement('input');
      dataInput.type = 'hidden';
      dataInput.name = 'data';
      dataInput.value = JSON.stringify({
        email: email,
        source: source || ''
      });
      form.appendChild(dataInput);

      var sheetInput = document.createElement('input');
      sheetInput.type = 'hidden';
      sheetInput.name = 'sheetName';
      sheetInput.value = SHEET_NAME;
      form.appendChild(sheetInput);

      document.body.appendChild(form);
      form.submit();

      setTimeout(function() {
        try {
          if (form.parentNode) form.parentNode.removeChild(form);
          if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
        } catch (e) {}
      }, 3000);
    } catch (err) {
      console.error('Error submitting email to Google Sheets:', err);
    }
  }

  function handleInsightEmailForm() {
    var form = document.getElementById('email-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('input[name="email"]');
      var btn = form.querySelector('button');
      if (!input || !btn) return;

      var email = (input.value || '').trim();
      if (!email) {
        input.focus();
        return;
      }

      var source =
        (document.querySelector('article.insight-article h1') &&
          document.querySelector('article.insight-article h1').textContent) ||
        document.title ||
        'Insight';

      btn.textContent = 'Subscribed!';
      btn.disabled = true;

      sendEmailToSheets(email, source);
    });
  }

  function handleResetTrackerEmail() {
    var emailInput = document.getElementById('tracker-email');
    var trackerBtn = document.getElementById('get-tracker-btn');
    if (!emailInput || !trackerBtn) return;

    function setButtonState(valid) {
      trackerBtn.disabled = !valid;
      trackerBtn.setAttribute('aria-disabled', valid ? 'false' : 'true');
    }

    setButtonState(false);

    emailInput.addEventListener('input', function() {
      setButtonState(isValidEmail(emailInput.value));
    });
    emailInput.addEventListener('blur', function() {
      setButtonState(isValidEmail(emailInput.value));
    });

    trackerBtn.addEventListener('click', function() {
      var email = (emailInput.value || '').trim();
      if (!isValidEmail(email)) {
        emailInput.focus();
        emailInput.setAttribute('aria-invalid', 'true');
        return;
      }
      emailInput.setAttribute('aria-invalid', 'false');

      var source =
        (document.querySelector('main h1') && document.querySelector('main h1').textContent) ||
        'Ascendant Reset Tracker';

      trackerBtn.textContent = 'Sent!';
      trackerBtn.disabled = true;
      trackerBtn.setAttribute('aria-disabled', 'true');

      sendEmailToSheets(email, source);

      var a = document.createElement('a');
      a.href = TRACKER_PDF_PATH;
      a.download = '43-Day-Reset-Tracker.pdf';
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      handleInsightEmailForm();
      handleResetTrackerEmail();
    });
  } else {
    handleInsightEmailForm();
    handleResetTrackerEmail();
  }
})();

