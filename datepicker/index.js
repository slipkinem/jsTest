/**
 * Created by slipkinem on 2/5/2018 at 11:42 AM.
 */
var $ = function (el) {
  return document.querySelector(el)
}
var monthList = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
]


window.onload = function () {
  var $select = $('#date-input')
  var $content = $('#s-picker-content')
  var $next = $('#next')
  var $prev = $('#prev')

  var date = new Date()
  render(date)

  $next.addEventListener('click', function () {
    date.setMonth(date.getMonth() + 1)
    render(date)
  })

  $prev.addEventListener('click', function () {
    date.setMonth(date.getMonth() - 1)
    render(date)
  })

  render.cb = function (value) {
    $select.value = value.toLocaleString()
    util.addClass($content, 'hidden')
  }

  $select.addEventListener('focus', function (e) {
    util.removeClass($content, 'hidden')
  })
}

function render (date) {
  var $subject = $('#s-picker-subject')
  var $dayColumns = document.querySelectorAll('.s-picker-list.day')

  var currentYear = date.getFullYear()
  var currentMonth = date.getMonth()
  var currentWeek = date.getDay()
  var currentDay = date.getDate()
  var indexDay = 1
  var startWeek = getStartWeek(currentYear, currentMonth, 1)
  var currentDayCount = getDayCount(currentMonth, date)
  var newDate = new Date(date.toString())
  newDate.setMonth(currentMonth + 1)
  var oldDate = new Date(date.toString())
  oldDate.setMonth(currentMonth - 1)

  var newDayCount = getDayCount(newDate.getMonth(), newDate)
  var oldDayCount = getDayCount(oldDate.getMonth(), oldDate)
  // 根据开始的星期数求出上个月第一天
  var oldDayIndex = oldDayCount - startWeek + 1

  for (var i = 0, ii = $dayColumns.length; i < ii; i++) {
    $dayColumns[i].innerHTML = ''
    for (var j = 0; j < 7; j++) {
      if (i === 0) {
        if (j >= startWeek) {
          $dayColumns[i].innerHTML += '<li class="s-picker-item">' + (indexDay++) + '</li>'
        } else {
          $dayColumns[i].innerHTML += '<li class="s-picker-item old">' + (oldDayIndex++) + '</li>'
        }
      } else {
        if (indexDay > currentDayCount) {
          $dayColumns[i].innerHTML += '<li class="s-picker-item new">' + (indexDay++) + '</li>'
        } else {
          $dayColumns[i].innerHTML += '<li class="s-picker-item">' + (indexDay++) + '</li>'
        }
      }
    }
  }
  indexDay = 1
  var $newDays = document.querySelectorAll('.s-picker-item')

  for (var i = 0, ii = $newDays.length; i < ii; i++) {
    if (util.hasClass($newDays[i], 'new')) {
      $newDays[i].innerHTML = '' + indexDay++
    }
    $newDays[i].index = i
    $newDays[i].addEventListener('click', function (e) {
      date.setMonth(currentMonth)
      date.setDate($newDays[this.index].innerHTML)
      if (util.hasClass($newDays[this.index], 'new')) {
        date.setMonth(currentMonth + 1)
      }
      if (util.hasClass($newDays[this.index], 'old')) {
        date.setMonth(currentMonth - 1)
      }
      render.cb(date)
    })
  }

  $subject.innerHTML = ' ' + monthList[currentMonth] + ' ' + currentYear + ' '
}

function getDayCount (month, date) {
  month = (month + 1) + ''
  var days31 = '1 3 5 7 8 10 12'.split(' ')
  var days30 = '4 6 9 11'.split(' ')
  var isBig2Month = date.getFullYear() % 4 === 0

  if (days30.indexOf(month) >= 0) {
    return 30
  }

  if (days31.indexOf(month) >= 0) {
    return 31
  }

  return isBig2Month ? 29 : 28
}

function getStartWeek (y, m, d) {
  m += 1
  if (m === 1 || m === 2) {
    m += 12;
    y--;
  }
  return Math.floor((d + 2 * m + 3 * (m + 1) / 5 + y + y / 4 - y / 100 + y / 400 + 1) % 7)
}
