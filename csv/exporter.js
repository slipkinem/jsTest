/**
 * Created by slipkinem on 1/2/2018 at 10:13 AM.
 */
window.exporter = {
  isIE () {
    var match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
    return match !== -1;
  },
  delay: 100,
  downloadFile (fileName, csvContent, columnSeparator, exporterOlderExcelCompatibility, exporterIsExcelCompatible) {
    var D = document;
    var a = D.createElement('a');
    var strMimeType = 'application/octet-stream;charset=utf-8';
    var rawFile;
    var ieVersion = this.isIE();

    if (exporterIsExcelCompatible) {
      csvContent = 'sep=' + columnSeparator + '\r\n' + csvContent;
    }

    // IE10+
    if (navigator.msSaveBlob) {
      return navigator.msSaveOrOpenBlob(
        new Blob(
          [exporterOlderExcelCompatibility ? '\uFEFF' : '', csvContent],
          { type: strMimeType }),
        fileName
      );
    }

    if (ieVersion) {
      var frame = D.createElement('iframe');
      document.body.appendChild(frame);

      frame.contentWindow.document.open('text/html', 'replace');
      frame.contentWindow.document.write(csvContent);
      frame.contentWindow.document.close();
      frame.contentWindow.focus();
      frame.contentWindow.document.execCommand('SaveAs', true, fileName);

      document.body.removeChild(frame);
      return true;
    }

    //html5 A[download]
    if ('download' in a) {
      var blob = new Blob(
        [exporterOlderExcelCompatibility ? '\uFEFF' : '', csvContent],
        { type: strMimeType }
      );
      rawFile = URL.createObjectURL(blob);
      a.setAttribute('download', fileName);
    } else {
      rawFile = 'data:' + strMimeType + ',' + encodeURIComponent(csvContent);
      a.setAttribute('target', '_blank');
    }

    a.href = rawFile;
    a.setAttribute('style', 'display:none;');
    D.body.appendChild(a);
    setTimeout(function () {
      if (a.click) {
        a.click();
        // Workaround for Safari 5
      } else if (document.createEvent) {
        var eventObj = document.createEvent('MouseEvents');
        eventObj.initEvent('click', true, true);
        a.dispatchEvent(eventObj);
      }
      D.body.removeChild(a);

    }, this.delay);
  }
}