function myAddEvent(obj, sEv, fn) {
  if (obj.attachEvent) {
    return obj.attachEvent("on" + sEv, fn);
  } else {
    return obj.addEventListener(sEv, fn, false);
  }
}

function getByClass(oParent, aClass) {
  var aTag = oParent.getElementsByTagName("*");
  var re = new RegExp("\\b" + aClass + "\\b");
  var arr = [];
  for (var i = 0, length1 = arr.length; i < length1; i++) {
    if (re.test(aTag[i].className)) {
      arr.push(aTag[i]);
    }
  }
  return arr;
}

function getStyle(obj) {
  if (obj.currentStyle) {
    return obj.currentStyle[attr];
  } else {
    return window.getComputedStyle(obj, false)[attr];
  }
}

function LQuery(vArg) {
  this.elements = [];
  switch (typeof(vArg)) {
    case "function":
      myAddEvent(window, "load", vArg);
      break;
    case "string":
      switch (vArg.charAt(0)) {
        case "#":
          var obj = document.getElementById(vArg.substring(1));
          this.elements.push(obj);
          break;
        case ".":
          this.elements = getByClass(document, vArg.substring(1));
          break;
        default:
          this.elements = document.getElementsByTagName(vArg);
      }
      break;
    case "object":
      this.element.push(vArg);
      break;
  }
}

LQuery.prototype.click = function (fn) {
  for (var i = 0, length1 = this.elements.length; i < length1; i++) {
    myAddEvent(this.elements[i], "click", fn);
  }
};

LQuery.prototype.hide = function () {
  for (var i = 0, length1 = this.elements.length; i < length1; i++) {

    this.elements[i].style.display = "none";
  }
};
LQuery.prototype.show = function () {
  for (var i = 0, length1 = this.elements.length; i < length1; i++) {
    this.elements[i].style.display = "block";
  }
};

LQuery.prototype.hover = function (fnOver, fnOut) {
  for (var i = 0, length1 = this.elements.length; i < length1; i++) {
    this.elements[i].onmouseover = fnOver;
    myAddEvent(this.elements[i], "mousever", fnOver);
    myAddEvent(this.elements[i], "mouseout", fnOut);
  }
}

function $(vArg) {
  return new LQuery(vArg);
};
