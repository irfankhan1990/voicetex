import React from "react";
import { Viewer } from "@react-pdf-viewer/core";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import * as pdfjs from "pdfjs-dist";
const Show = (props) => {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
  ).toString();
  const bytes = atob(props.documentData);
  let length = bytes.length;
  let out = new Uint8Array(length);

  while (length--) {
    out[length] = bytes.charCodeAt(length);
  }
  const blob = new Blob([out], { type: "application/pdf" });
  var url = URL.createObjectURL(blob);
  const download = () => {
    const downloadLink = document.createElement("a");
    const fileName = "convertedPDFFile.pdf";
    downloadLink.href = "data:application/pdf;base64," + props.documentData;
    downloadLink.download = fileName;
    downloadLink.click();
  };
  return (
    <Paper className="pdfCSS">
      <Button variant="contained" onClick={download}>
        Download
      </Button>
      <div style={{ height: "600px", overflow: "hidden" }}>
        <Viewer fileUrl={url} />
      </div>
    </Paper>
  );
};
export default Show;
