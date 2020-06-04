const express = require("express");
const fileUpload = require("express-fileupload");
const pdf_table_extractor = require("pdf-table-extractor");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(fileUpload());

// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "./",
//   })
// );

app.post("/upload", function (req, res) {
  console.log(req);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;

  function success(result) {
    console.log(JSON.stringify(result));
    let csvContent = "";

    result.pageTables[0].tables.forEach(function (rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";

      console.log(row);
    });

    fs.writeFile("./test.csv", csvContent, (err) => {
      console.log(err);
      if (!err) {
        const file = path.join(__dirname + "/test.csv");
        console.log(file);
        res.download(file, (err) => {
          console.log(err);
        });
      }
    });
    //   download.setAttribute("href", csvContent);
  }

  function error(err) {
    console.error(err);
  }

  function convert() {
    //   let file = upload.files[0];
    pdf_table_extractor("./dummy.pdf", success, error);
  }

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(`./dummy.pdf`, function (err) {
    if (err) {
      return res.status(500).send(err);
    } else {
      convert();
    }
  });
});

app.listen(4000, () => {
  const file = path.join(__dirname + "/test.csv");
  console.log(file);
  console.log("app running");
});
