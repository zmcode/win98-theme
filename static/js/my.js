function reqAllCateGory(id) {
  request({
        config: {
          url: '/api/category/getAllList',
        },
        target: '#document-wrap-' + id + ' .document-wrap-left',
      }
  ).then(data => {
      renderCateGoryTree(id, data)
  }).catch(error => {

  })
}



function deepChangeArr(id, data) {
   return data.map(item => {
    if (item.children && item.children.length) {
      item.children = deepChangeArr(id, item.children)
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
  const id = 'article-headline-' + activeArticleId +  index++

  if (level === 1 || level < prevLevel) {
    activePid =  0
  }
  if (level > prevLevel) {
    activePid = prevPid
  }

  headlineArr.push({
    id,
    pid: activePid,
    level,
    url: '#' + id,
    name: text,
    target: '_self',
  })
  prevPid = id
  prevLevel = level
  return `<h${level} id=${id}>${text}</h${level}>`;
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
    { id = "id", pid = "pid", children = "children" } = {}
) {
  return arr
      .filter((item) => item[pid] === parentId)
      .map((item) => ({
        ...item,
        [children]: array2Tree(arr, item[id], { id, pid, children }),
      }));
}

function renderArticleContent(id, content) {

  return `<div id="article-content-wrap-${id}" class="article-content-wrap">
      <div class="article-headline-wrap" id="article-headline-wrap-${id}">
         <ul id="article-headline-${id}" class="ztree"></ul>
      </div>
      <div class="article-content" id="article-content-${id}">
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

function renderDocumentRight(id, cateGoryId) {
  const rightContent = $(`#document-wrap-right-content-${id}`)
  rightContent.css("touch-action", "none"); // TODO: should this be in FolderView, or is it to prevent scrolling the page or what?
  const rightContent_view = new FolderView('', {
    asDesktop: false,
  });
  request({
      config: {
        url: '/api/article/list',
        data: {
          pageSize: 9999,
          categoryId: cateGoryId
        },
      },
      target: `#document-wrap-right-content-${id}`
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
          const articleContentId = item.id + new Date().getTime()
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
    $(rightContent).empty()
    $(rightContent_view.element).appendTo(rightContent);
  })
}


// 创建document内容
function createDocumentContent(id) {
   return  `<div id="document-wrap-${id}" class="document-wrap">
  <div class="document-wrap-left">
    <ul id="cate-gory-tree-${id}" class="ztree"></ul>
  </div>
    <div class="document-wrap-right" id="document-wrap-right-content-${id}">
  
  </div>
  </div>`
}
const CateGorySetting = {
  callback: {
    onClick: (e, cateGoryId, data) => {
      const lastIndex = cateGoryId.lastIndexOf('-')
      const id = cateGoryId.slice(lastIndex + 1)
      renderDocumentRight(id, data.id)
    }
  }
}
function renderCateGoryTree(id, data) {
  const result = deepChangeArr(id,data)
  $.fn.zTree.init($("#cate-gory-tree-" + id), CateGorySetting, result);
}
