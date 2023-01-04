function reqAllCateGory(uniqueId) {
  request({
      config: {
        url: '/api/category/getAllList',
      },
      target: '#document-wrap-' + uniqueId + ' .document-wrap-left',
    }
  ).then(data => {
    renderCateGoryTree(uniqueId, data)
  }).catch(error => {

  })
}


function deepChangeArr(uniqueId, data) {
  return data.map(item => {
    if (item.children && item.children.length) {
      item.children = deepChangeArr(uniqueId, item.children)
    } else {
      delete item.children
    }

    return {
      ...item,
      text: item.name,
      icon: '/static/themes/win98/static/img/folder-small-close-icon.png',
      iconClose: '/static/themes/win98/static/img/folder-small-close-icon.png',
      iconOpen: '/static/themes/win98/static/img/folder-small-open-icon.png',
      url: '',
      // parent: item.pid == -1 ? '#' : item.pid,
    }
  })
}

function createArticleItem() {
  return `<div>

</div>`
}

let activeCateGoryId = 0


function iconsAtTwoSizes(iconID) {
  return {
    16: `/static/themes/win98/static/img/icons/${iconID}-16x16.png`,
    32: `/static/themes/win98/static/img/icons/${iconID}-32x32.png`,
  };
}

let headlineArr = []
let prevLevel = 0
let activePid = 0
let prevPid = 0
let index = 1
let activeArticleId = 0
const renderer = new marked.Renderer()
renderer.heading = (text, level) => {
  // 产生一致的几率相对较小
  const uniqueId = 'article-headline-' + activeArticleId + index++

  if (level === 1 || level < prevLevel) {
    activePid = 0
  }
  if (level > prevLevel) {
    activePid = prevPid
  }

  headlineArr.push({
    uniqueId,
    pid: activePid,
    level,
    url: '#' + uniqueId,
    name: text,
    target: '_self',
  })
  prevPid = uniqueId
  prevLevel = level
  return `<h${level} id=${uniqueId}>${text}</h${level}>`;
}


marked.setOptions({
  renderer,
  highlight: (code) => {
    return hljs.highlightAuto(code).value
  },
  pedantic: false,
  gfm: true,
  tables: true,
  breaks: true,
  headerIds: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
});

const betterMarked = (str) => marked.parse(str).replace(/<code( class="language-[A-Za-z]*")?>/g, '<code class="hljs">') // replace <code> tags to <code class="hljs">

function array2Tree(
  arr,
  parentId = 0,
  {id = "id", pid = "pid", children = "children"} = {}
) {
  return arr
    .filter((item) => item[pid] === parentId)
    .map((item) => ({
      ...item,
      [children]: array2Tree(arr, item[id], {id, pid, children}),
    }));
}

function renderArticleContent(uniqueId, content) {

  return `<div id="article-content-wrap-${uniqueId}" class="article-content-wrap">
      <div class="article-headline-wrap" id="article-headline-wrap-${uniqueId}">
         <ul id="article-headline-${uniqueId}" class="ztree"></ul>
      </div>
      <div class="article-content" id="article-content-${uniqueId}">
        ${content}
      </div>
  </div>`
}


const headlineSetting = {
  view: {
    showIcon: false
  },
  data: {
    simpleData: {
      enable: true,
      idKey: 'id',
      pIdKey: 'pid'
    }
  }
}

function renderDocumentRight(uniqueId, cateGoryId, page = 1, content ='') {
  const rightContent = $(`#document-wrap-right-content-${uniqueId}`)
  $(rightContent).empty()
  rightContent.css("touch-action", "none"); // TODO: should this be in FolderView, or is it to prevent scrolling the page or what?
  const rightContent_view = new FolderView('', {
    asDesktop: false,
  });
  request({
    config: {
      url: '/api/article/list',
      data: {
        pageSize: 12,
        categoryId: cateGoryId,
        pageIndex: page,
        content
      },
    },
    target: `#document-wrap-right-content-${uniqueId}`
  }).then(data => {

    data.forEach(item => {
      rightContent_view.add_item(new FolderViewItem({
        icons: {
          // @TODO: know what sizes are available
          [DESKTOP_ICON_SIZE]: getIconPath("notepad-file", DESKTOP_ICON_SIZE),
        },
        title: item.title,
        is_system_folder: true,
        open: function () {
          const $win = new $Window({
            title: item.title,
            outerWidth: '80%',
            outerHeight: '80%',
            resizable: true,
            customClass: 'article-window',
            icons: iconsAtTwoSizes("notepad-file"),
          });
          const articleContentId = new Date().getTime()
          headlineArr = []
          prevLevel = 0
          activePid = 0
          prevPid = 0
          index = 1
          activeArticleId = articleContentId
          const markedHtml = betterMarked(item.content)
          const html = renderArticleContent(articleContentId, markedHtml)


          $win.$content.append(html)
          if (!headlineArr.length) {
            $(`#article-headline-wrap-${articleContentId}`).hide()
            $(`#article-content-${articleContentId}`).css('width', '100%')
          }
          $.fn.zTree.init($('#article-headline-' + articleContentId), headlineSetting, headlineArr);
          new Task($win);
          $(document).ready(() => {
            $win.show();
            $win.focus();
          })
        },
      }));
    })
    $(`#document-wrap-${uniqueId} .pagination-input`).val(page)
    $(rightContent).append(rightContent_view.element);
  })
}




// 创建document内容
function createDocumentContent(uniqueId) {
  return `<div id="document-wrap-${uniqueId}" class="document-wrap">
  <div class="document-wrap-left">
    <ul id="cate-gory-tree-${uniqueId}" class="ztree"></ul>
  </div>
    <div class="document-wrap-right">
      <div class="document-wrap-right-content-wrap" id="document-wrap-right-content-${uniqueId}">
      
      </div>
      <div class="right-wrap-control">
        <div style="display: flex;align-items: center">
          <img src="/static/themes/win98/static/img/icons/find-file-16x16.png" alt="">
          <input style="width:60%;text-align: left" onblur="searchArticle('${uniqueId}')" id="seachInput" placeholder="搜索文章" class="right-content-input" type="text"   value="">
        </div>
        <div class="right-wrap-pagination">
          <button onclick="handlePage('${uniqueId}', 'prev')" class="prevButton"></button>
           <input onblur="handlePage('${uniqueId}', 'input')" class="right-content-input pagination-input" type="text"   value="1">
          <button onclick="handlePage('${uniqueId}', 'next')" class="nextButton"></button>
        </div>
        
      </div>
    </div>
  </div>`
}

function handlePage(uniqueId, type) {
  let page = parseFloat($(`#document-wrap-${uniqueId} .pagination-input`).val())
  const value = $(`#document-wrap-${uniqueId} #seachInput`).val()
  if (type === 'prev') {
    page -= 1
  }

  if (type === 'next') {
    page += 1
  }
  page = page ? page : 1
  const cateGoryId = allZtreeInstanceObj[uniqueId].getSelectedNodes()
  renderDocumentRight(uniqueId, cateGoryId[0].id, page, value)
}

function searchArticle(uniqueId) {
  const value = $(`#document-wrap-${uniqueId} #seachInput`).val()
  const cateGoryId = allZtreeInstanceObj[uniqueId].getSelectedNodes()
  renderDocumentRight(uniqueId, cateGoryId[0].id, 1, value)
}




var allZtreeInstanceObj = {}

const CateGorySetting = {
  callback: {
    onClick: (e, cateGoryId, data) => {
      const lastIndex = cateGoryId.lastIndexOf('-')
      const id = cateGoryId.slice(lastIndex + 1)
      renderDocumentRight(id, data.id)
    },
  }
}



function renderCateGoryTree(uniqueId, data) {
  data = data.filter(({ desc }) => !desc.includes('代码'))
  data.unshift({
    id: '0',
    name: '全部',
  })
  const result = deepChangeArr(uniqueId, data)
  const treeInstance = $.fn.zTree.init($("#cate-gory-tree-" + uniqueId), CateGorySetting, result);
  allZtreeInstanceObj[uniqueId] = treeInstance
  var nodes = treeInstance.getNodes();
  treeInstance.selectNode(nodes[0])
}
