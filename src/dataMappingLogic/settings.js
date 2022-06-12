const input_file_popup = {
    events: options || {
        'click .btn-cancel': 'remove',
        'click .btn-change': function () {
            const input = document.querySelector('#popup-file-input');

        }
    },
    content: [
        `<div class="popup-container">
             <input id="popup-file-input" class="inp-fill" type="file" accept=".csv, .xlsx, .json, .txt"> <br><br>
             <span id="file-name"></span>
            '<button class="btn-cancel">Cancel</button>
            <button class="btn-change">Change</button>
            </div>`].join(''),
}