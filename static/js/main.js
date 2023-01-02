
function createCateGoryList(arr, modalId) {
  return arr.reduce((prev, next) => {
    const cateGoryId = `cate-gory-wrap-${next.id}`
    prev += `
    <div class="cate-gory-wrap" id="${cateGoryId}" data-type="internet">
  <img src="/static/themes/win98/static/img/directory_closed.png">
  <span>${next.name}</span>
</div>
`
    $(document).ready(function () {
      if (next.children && next.children.length) {
        $('#' + cateGoryId).dblclick(function() {
          const content = createCateGoryList(next.children, modalId)
          $('#' + modalId + ' .win95-modal-content').html(content)
        })
      }
    })


    return prev
  }, '')
}


// 累计index
var indexTotal = 1000

function S4() {
  // 0x   表示16进制数据的开头
  //可以直接return (((1+Math.random())*0x10000)|0).toString(16)；

  //也可用如下，随机数*时间戳，再转化为16进制
  //Number.toString(16)    表示将其转换为16进制
  // Number | 0 表示取整数部分

  let stamp = new Date().getTime();
  return (((1+Math.random())*stamp)|0).toString(16)
}

// 创建modal
function createModal(modalId, content) {
  const type = modalId.split('-')[0]
  indexTotal += 1

  const headerId = `win95-modal-header-${modalId}`
  const titleMap = {
    computer: '我的电脑',
    directory_closed: '我的笔记',
    internet: 'Internet',
  }
  const header = `<div class="win95-modal-header" id="${headerId}" >
            <img src="/static/themes/win98/static/img/${type}.png" >
            <div class="title">${titleMap[type]}</div>
            <ul class="header-options">
              <li class="close">X</li>
            </ul>
        </div>`

  const contentHtml = `<div class="win95-modal-content">
${content}
</div>`

  const modalHtml = `<div class="win95-modal-wrap" id="${modalId}" style="z-index: ${indexTotal}">
  ${header}
  ${contentHtml}
</div>`
  $('body').append(modalHtml)

  $('#' + modalId).Tdrag({
    handle:".title"
  });

  $(document).ready(function () {
    $('#' + headerId + ' .title').on('touchstart click', function (){
      indexTotal += 1
      $('#' + modalId)[0].style.zIndex = indexTotal
    })
    $('#' + modalId).on('touchstart click',function (){
      indexTotal += 1
      $('#' + modalId)[0].style.zIndex = indexTotal
    })
    $('#' + modalId + ' .close').on('touchstart click',function (){

      $('#' + modalId).remove()
    })
  })

}

