export const FileInput = `
      <div className="file-upload" 
      style="display: inline-block;
              padding: 10px;
              
              "
              
              >
           <div className="file-upload-select"
         style="background:#324759;
                color: #ffffff;
                transition: all 0.2s ease-in-out;
                -moz-transition: all 0.2s ease-in-out;
                -webkit-transition: all 0.2s ease-in-out;
                -o-transition: all 0.2s ease-in-out;
           ">
          <div className="file-select-button">Choose File</div>
          <div className="file-select-name">No file chosen...</div>
          <input type="file" accept=".csv, .xlsx, .json, .txt" name="file-upload-input" id="popup-file-input">
        </div>
      </div>`