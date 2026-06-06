Dropzone.autoDiscover = false;

var LANG_STORAGE_KEY = "gohttpserver.lang";
var DEFAULT_LANG = "zh";
var FALLBACK_LANG = "en";

var I18N = {
  zh: {
    "nav.toggle_navigation": "切换导航",
    "nav.sign_in": "登录",
    "nav.guest": "访客",
    "nav.search_placeholder": "搜索文本",
    "lang.zh": "中文",
    "lang.en": "EN",
    "actions.back": "返回",
    "actions.hidden": "隐藏文件",
    "actions.upload": "上传",
    "actions.new_folder": "新建文件夹",
    "actions.archive": "下载ZIP",
    "actions.download": "下载",
    "actions.install": "安装",
    "table.name": "名称",
    "table.size": "大小",
    "table.mod_time": "修改时间",
    "table.actions": "操作",
    "tooltip.copied": "已复制！",
    "upload.title": "文件上传",
    "upload.remove_all": "清空列表",
    "common.close": "关闭",
    "status.loading": "加载中",
    "status.loading_ellipsis": "加载中...",
    "prompt.new_directory": "当前路径：{{path}}\n请输入新目录名称",
    "alert.invalid_name": "名称不能包含以下字符：\\/:*<>|",
    "confirm.delete_path": "确认删除 {{name}} 吗？",
    "dropzone.default_message": "将文件拖到这里上传",
    "dropzone.fallback_message": "你的浏览器不支持拖拽上传。",
    "dropzone.fallback_text": "请使用下方备用表单上传文件。",
    "dropzone.file_too_big": "文件过大（{{filesize}}MiB），最大允许：{{maxFilesize}}MiB。",
    "dropzone.invalid_file_type": "不支持此类型文件上传。",
    "dropzone.response_error": "服务端返回状态码：{{statusCode}}。",
    "dropzone.cancel_upload": "取消上传",
    "dropzone.cancel_upload_confirm": "确定要取消本次上传吗？",
    "dropzone.remove_file": "移除文件",
    "dropzone.max_files_exceeded": "文件数量已达上限。"
  },
  en: {
    "nav.toggle_navigation": "Toggle navigation",
    "nav.sign_in": "Sign in",
    "nav.guest": "Guest",
    "nav.search_placeholder": "Search text",
    "lang.zh": "中文",
    "lang.en": "EN",
    "actions.back": "Back",
    "actions.hidden": "Hidden",
    "actions.upload": "Upload",
    "actions.new_folder": "New Folder",
    "actions.archive": "Download ZIP",
    "actions.download": "Download",
    "actions.install": "Install",
    "table.name": "Name",
    "table.size": "Size",
    "table.mod_time": "ModTime",
    "table.actions": "Actions",
    "tooltip.copied": "Copied!",
    "upload.title": "File upload",
    "upload.remove_all": "Remove All",
    "common.close": "Close",
    "status.loading": "loading",
    "status.loading_ellipsis": "loading ...",
    "prompt.new_directory": "current path: {{path}}\nplease enter the new directory name",
    "alert.invalid_name": "Name should not contain any of \\/:*<>|",
    "confirm.delete_path": "Delete {{name}} ?",
    "dropzone.default_message": "Drop files here to upload",
    "dropzone.fallback_message": "Your browser does not support drag'n'drop file uploads.",
    "dropzone.fallback_text": "Please use the fallback form below to upload your files like in the olden days.",
    "dropzone.file_too_big": "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
    "dropzone.invalid_file_type": "You can't upload files of this type.",
    "dropzone.response_error": "Server responded with {{statusCode}} code.",
    "dropzone.cancel_upload": "Cancel upload",
    "dropzone.cancel_upload_confirm": "Are you sure you want to cancel this upload?",
    "dropzone.remove_file": "Remove file",
    "dropzone.max_files_exceeded": "You can not upload any more files."
  }
};

// Keep these keys explicit here to avoid encoding issues in source literals.
I18N.zh["nav.search_placeholder"] = "\u641c\u7d22";
I18N.en["nav.search_placeholder"] = "Search";
I18N.zh["scroll.to_top"] = "\u56de\u5230\u9876\u90e8";
I18N.en["scroll.to_top"] = "Scroll to top";

function normalizeLang(lang) {
  if (!lang) {
    return DEFAULT_LANG;
  }
  var value = String(lang).toLowerCase();
  if (value.indexOf("zh") === 0) {
    return "zh";
  }
  if (value.indexOf("en") === 0) {
    return "en";
  }
  return DEFAULT_LANG;
}

function getLang() {
  try {
    var stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return normalizeLang(stored || DEFAULT_LANG);
  } catch (e) {
    return DEFAULT_LANG;
  }
}

function setLang(lang) {
  var normalized = normalizeLang(lang);
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, normalized);
  } catch (e) {
  }
  return normalized;
}

function interpolate(text, vars) {
  if (!vars) {
    return text;
  }
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, function (match, key) {
    if (vars[key] === undefined || vars[key] === null) {
      return "";
    }
    return String(vars[key]);
  });
}

function getI18nValue(lang, key) {
  var normalized = normalizeLang(lang);
  if (I18N[normalized] && I18N[normalized][key] !== undefined) {
    return I18N[normalized][key];
  }
  if (I18N[FALLBACK_LANG] && I18N[FALLBACK_LANG][key] !== undefined) {
    return I18N[FALLBACK_LANG][key];
  }
  return key;
}

function tWithLang(lang, key, vars) {
  return interpolate(getI18nValue(lang, key), vars);
}

function t(key, vars) {
  return tWithLang(getLang(), key, vars);
}

function defineMomentZhLocale() {
  if (typeof moment === "undefined" || !moment.defineLocale) {
    return;
  }
  moment.defineLocale("zh", {
    relativeTime: {
      future: "%s后",
      past: "%s前",
      s: "几秒",
      m: "1 分钟",
      mm: "%d 分钟",
      h: "1 小时",
      hh: "%d 小时",
      d: "1 天",
      dd: "%d 天",
      M: "1 个月",
      MM: "%d 个月",
      y: "1 年",
      yy: "%d 年"
    }
  });
}

function applyMomentLocale(lang) {
  if (typeof moment === "undefined" || !moment.locale) {
    return;
  }
  moment.locale(normalizeLang(lang) === "zh" ? "zh" : "en");
}

function getDropzoneMessages(lang) {
  return {
    dictDefaultMessage: tWithLang(lang, "dropzone.default_message"),
    dictFallbackMessage: tWithLang(lang, "dropzone.fallback_message"),
    dictFallbackText: tWithLang(lang, "dropzone.fallback_text"),
    dictFileTooBig: tWithLang(lang, "dropzone.file_too_big"),
    dictInvalidFileType: tWithLang(lang, "dropzone.invalid_file_type"),
    dictResponseError: tWithLang(lang, "dropzone.response_error"),
    dictCancelUpload: tWithLang(lang, "dropzone.cancel_upload"),
    dictCancelUploadConfirmation: tWithLang(lang, "dropzone.cancel_upload_confirm"),
    dictRemoveFile: tWithLang(lang, "dropzone.remove_file"),
    dictMaxFilesExceeded: tWithLang(lang, "dropzone.max_files_exceeded")
  };
}

function findParentWithClass(node, className) {
  var current = node;
  while (current && current !== document.body) {
    if (current.classList && current.classList.contains(className)) {
      return current;
    }
    current = current.parentNode;
  }
  return null;
}

function applyDropzoneLanguage(dropzone, lang) {
  if (!dropzone || !dropzone.options) {
    return;
  }
  var messages = getDropzoneMessages(lang);
  Object.keys(messages).forEach(function (key) {
    dropzone.options[key] = messages[key];
  });

  var defaultMessageElement = dropzone.element.querySelector(".dz-default.dz-message span");
  if (defaultMessageElement) {
    defaultMessageElement.textContent = messages.dictDefaultMessage;
  }

  var removeLinks = dropzone.element.querySelectorAll("[data-dz-remove]");
  for (var i = 0; i < removeLinks.length; i += 1) {
    var link = removeLinks[i];
    var preview = findParentWithClass(link, "dz-preview");
    var isUploading = preview && preview.classList && preview.classList.contains("dz-processing") && !preview.classList.contains("dz-complete");
    link.textContent = isUploading ? messages.dictCancelUpload : messages.dictRemoveFile;
  }
}

function updateScrollUpTitle(lang) {
  var title = tWithLang(lang, "scroll.to_top");
  var target = $("#scrollUp");
  if (target.length) {
    target.attr("title", title);
    target.attr("aria-label", title);
  }
}

function isTextTruncated(element) {
  if (!element) {
    return false;
  }
  return element.scrollWidth - element.clientWidth > 1;
}

function destroyAssetNameTooltip(element) {
  var target = $(element);
  if (target.data("bs.tooltip")) {
    target.tooltip("hide");
    target.tooltip("destroy");
  }
}

function maybeShowAssetNameTooltip(element) {
  var target = $(element);
  var textElement = element.querySelector(".asset-name-text");
  var fullName = target.attr("data-full-name");
  if (!fullName || !isTextTruncated(textElement)) {
    destroyAssetNameTooltip(element);
    return;
  }

  destroyAssetNameTooltip(element);
  target.tooltip({
    container: "body",
    placement: "top",
    trigger: "manual",
    title: fullName,
    template: '<div class="tooltip asset-name-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  });
  target.tooltip("show");
}

defineMomentZhLocale();
applyMomentLocale(getLang());

function getExtention(fname) {
  return fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);
}

function pathJoin(parts, sep) {
  var separator = sep || '/';
  var replace = new RegExp(separator + '{1,}', 'g');
  return parts.join(separator).replace(replace, separator);
}

function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = decodeURI(window.location.search).substr(1).match(reg);
  if (r != null) return r[2].replace(/\+/g, ' ');
  return null;
}

function checkPathNameLegal(name) {
  var reg = new RegExp("[\\/:*<>|]");
  var r = name.match(reg);
  return r == null;
}

function showErrorMessage(jqXHR) {
  var errMsg = jqXHR.getResponseHeader("x-auth-authentication-message");
  if (errMsg == null) {
    errMsg = jqXHR.responseText;
  }
  alert(String(jqXHR.status).concat(":", errMsg));
  console.error(errMsg);
}

function formatBytesForInfo(value) {
  var bytes = parseFloat(value);
  if (!isFinite(bytes) || bytes < 0) {
    return String(value);
  }
  var human = "";
  if (bytes < 1024) {
    human = bytes.toFixed(0) + " B";
  } else if (bytes < 1048576) {
    human = (bytes / 1024).toFixed(0) + " KB";
  } else if (bytes < 1073741824) {
    human = (bytes / 1048576).toFixed(1) + " MB";
  } else {
    human = (bytes / 1073741824).toFixed(1) + " GB";
  }
  if (normalizeLang(getLang()) === "zh") {
    return human + " (" + bytes.toFixed(0) + " \u5b57\u8282)";
  }
  return human + " (" + bytes.toFixed(0) + " bytes)";
}

function formatMtimeForInfo(value) {
  if (value === null || value === undefined) {
    return value;
  }
  var ts = parseInt(value, 10);
  if (!isFinite(ts)) {
    return String(value);
  }
  var m = moment(ts);
  if (!m.isValid()) {
    return String(value);
  }
  if (normalizeLang(getLang()) === "zh") {
    return m.format("YYYY\u5e74MM\u6708DD\u65e5 HH:mm:ss") + " (" + m.fromNow() + ")";
  }
  return m.format("YYYY-MM-DD HH:mm:ss") + " (" + m.fromNow() + ")";
}

function localizedInfoKey(key, parentKey, lang) {
  var normalizedLang = normalizeLang(lang);
  if (normalizedLang === "zh") {
    switch (key) {
      case "name":
        return parentKey === "version" ? "\u7248\u672c\u540d\u79f0" : "\u540d\u79f0";
      case "type":
        return "\u7c7b\u578b";
      case "size":
        return "\u5927\u5c0f";
      case "path":
        return "\u8def\u5f84";
      case "mtime":
        return "\u4fee\u6539\u65f6\u95f4";
      case "extra":
        return "\u989d\u5916\u4fe1\u606f";
      case "packageName":
        return "\u5305\u540d";
      case "mainActivity":
        return "\u4e3b\u6d3b\u52a8";
      case "version":
        return "\u7248\u672c";
      case "code":
        return parentKey === "version" ? "\u7248\u672c\u4ee3\u7801" : "\u4ee3\u7801";
      default:
        return key;
    }
  }

  switch (key) {
    case "name":
      return parentKey === "version" ? "Version Name" : "Name";
    case "type":
      return "Type";
    case "size":
      return "Size";
    case "path":
      return "Path";
    case "mtime":
      return "Modified Time";
    case "extra":
      return "Extra";
    case "packageName":
      return "Package Name";
    case "mainActivity":
      return "Main Activity";
    case "version":
      return "Version";
    case "code":
      return parentKey === "version" ? "Version Code" : "Code";
    default:
      return key;
  }
}

function formatInfoForDisplay(value, lang, parentKey) {
  if (Array.isArray(value)) {
    return value.map(function (item) {
      return formatInfoForDisplay(item, lang, parentKey);
    });
  }
  if (!value || typeof value !== "object") {
    return value;
  }

  var result = {};
  Object.keys(value).forEach(function (key) {
    var raw = value[key];
    var formatted = raw;

    if (key === "size" && (typeof raw === "number" || typeof raw === "string")) {
      formatted = formatBytesForInfo(raw);
    } else if (key === "mtime") {
      formatted = formatMtimeForInfo(raw);
    } else {
      formatted = formatInfoForDisplay(raw, lang, key);
    }

    result[localizedInfoKey(key, parentKey, lang)] = formatted;
  });
  return result;
}

var vm = new Vue({
  el: "#app",
  data: {
    lang: getLang(),
    user: {
      email: "",
      name: "",
    },
    location: window.location,
    breadcrumb: [],
    showHidden: false,
    previewMode: false,
    preview: {
      filename: '',
      filetype: '',
      filesize: 0,
      contentHTML: '',
    },
    version: tWithLang(getLang(), "status.loading"),
    mtimeTypeFromNow: false, // or fromNow
    auth: {},
    search: getQueryString("search"),
    files: [{
      name: tWithLang(getLang(), "status.loading_ellipsis"),
      path: "",
      size: "...",
      type: "dir",
    }],
    myDropzone: null,
  },
  computed: {
    computedFiles: function () {
      var that = this;
      that.preview.filename = null;

      var files = this.files.filter(function (f) {
        if (f.name == 'README.md') {
          that.preview.filename = f.name;
        }
        if (!that.showHidden && f.name.slice(0, 1) === '.') {
          return false;
        }
        return true;
      });
      if (this.preview.filename) {
        $.ajax({
          url: pathJoin([location.pathname, 'README.md']),
          method: 'GET',
          success: function (res) {
            var converter = new showdown.Converter({
              // 禁止原始 HTML 直通，避免上传的 README.md 注入脚本。
              noHTML: true,
              tables: true,
              omitExtraWLInCodeBlocks: true,
              parseImgDimensions: true,
              simplifiedAutoLink: true,
              literalMidWordUnderscores: true,
              tasklists: true,
              ghCodeBlocks: true,
              smoothLivePreview: true,
              simplifiedAutoLink: true,
              strikethrough: true,
            });

            var html = converter.makeHtml(res);
            that.preview.contentHTML = html;
          },
          error: function (err) {
            console.log(err);
          }
        });
      }

      return files;
    },
  },
  created: function () {
    var that = this;
    applyMomentLocale(this.lang);
    $.ajax({
      url: "/-/user",
      method: "get",
      dataType: "json",
      success: function (ret) {
        if (ret) {
          that.user.email = ret.email;
          that.user.name = ret.name;
        }
      }
    });

    var dropzoneOptions = getDropzoneMessages(this.lang);
    dropzoneOptions.paramName = "file";
    dropzoneOptions.maxFilesize = 10240;
    dropzoneOptions.addRemoveLinks = true;
    dropzoneOptions.init = function () {
      this.on("uploadprogress", function () {
      });
      this.on("complete", function () {
        loadFileList();
      });
    };

    this.myDropzone = new Dropzone("#upload-form", dropzoneOptions);
    applyDropzoneLanguage(this.myDropzone, this.lang);
  },
  methods: {
    t: function (key, vars) {
      return tWithLang(this.lang, key, vars);
    },
    setLanguage: function (lang) {
      var normalized = setLang(lang);
      this.lang = normalized;
      applyMomentLocale(normalized);
      applyDropzoneLanguage(this.myDropzone, normalized);
      updateScrollUpTitle(normalized);
      if (this.version === I18N.zh["status.loading"] || this.version === I18N.en["status.loading"]) {
        this.version = this.t("status.loading");
      }
      if (this.files.length === 1 && this.files[0].path === "" && this.files[0].size === "...") {
        this.files[0].name = this.t("status.loading_ellipsis");
      }
    },
    getEncodePath: function (filepath) {
      return pathJoin([location.pathname].concat(filepath.split("/").map(function (v) {
        return encodeURIComponent(v);
      })));
    },
    formatTime: function (timestamp) {
      var m = moment(timestamp);
      if (this.mtimeTypeFromNow) {
        return m.fromNow();
      }
      return m.format('YYYY-MM-DD HH:mm:ss');
    },
    toggleHidden: function () {
      this.showHidden = !this.showHidden;
    },
    removeAllUploads: function () {
      this.myDropzone.removeAllFiles();
    },
    parentDirectory: function (path) {
      return path.replace('\\', '/').split('/').slice(0, -1).join('/');
    },
    changeParentDirectory: function (path) {
      var parentDir = this.parentDirectory(path);
      loadFileOrDir(parentDir);
    },
    genInstallURL: function (name, noEncode) {
      var parts = [location.host];
      var pathname = decodeURI(location.pathname);
      if (!name) {
        parts.push(pathname);
      } else if (getExtention(name) == "ipa") {
        parts.push("/-/ipa/link", pathname, encodeURIComponent(name));
      } else {
        parts.push(pathname, name);
      }
      var urlPath = location.protocol + "//" + pathJoin(parts);
      return noEncode ? urlPath : encodeURI(urlPath);
    },
    genDownloadURL: function (f) {
      var search = location.search;
      var sep = search == "" ? "?" : "&";
      return location.origin + this.getEncodePath(f.name) + location.search + sep + "download=true";
    },
    shouldHaveQrcode: function (name) {
      return ['apk', 'ipa'].indexOf(getExtention(name)) !== -1;
    },
    genFileClass: function (f) {
      if (f.type == "dir") {
        if (f.name == '.git') {
          return 'fa-git-square';
        }
        return "fa-folder-open";
      }
      var ext = getExtention(f.name);
      switch (ext) {
        case "go":
        case "py":
        case "js":
        case "java":
        case "c":
        case "cpp":
        case "h":
          return "fa-file-code-o";
        case "pdf":
          return "fa-file-pdf-o";
        case "zip":
          return "fa-file-zip-o";
        case "mp3":
        case "wav":
          return "fa-file-audio-o";
        case "jpg":
        case "png":
        case "gif":
        case "jpeg":
        case "tiff":
          return "fa-file-picture-o";
        case "ipa":
        case "dmg":
          return "fa-apple";
        case "apk":
          return "fa-android";
        case "exe":
          return "fa-windows";
      }
      return "fa-file-text-o";
    },
    clickFileOrDir: function (f, e) {
      var reqPath = this.getEncodePath(f.name);
      if (f.type == "file") {
        var videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
        var fileExtension = getExtention(f.name).toLowerCase();
        if (videoExtensions.indexOf(fileExtension) !== -1) {
          window.location.href = '/-/video-player' + reqPath;
        } else {
          window.location.href = reqPath;
        }
        e.preventDefault();
        return;
      }
      loadFileOrDir(reqPath);
      e.preventDefault();
    },
    changePath: function (reqPath, e) {
      loadFileOrDir(reqPath);
      e.preventDefault();
    },
    showInfo: function (f) {
      $.ajax({
        url: this.getEncodePath(f.name),
        data: {
          op: "info",
        },
        method: "GET",
        success: function (res) {
          var displayInfo = formatInfoForDisplay(res, vm.lang, "");
          $("#file-info-title").text(f.name);
          $("#file-info-content").text(JSON.stringify(displayInfo, null, 4));
          $("#file-info-modal").modal("show");
        },
        error: function (jqXHR) {
          showErrorMessage(jqXHR);
        }
      });
    },
    makeDirectory: function () {
      var name = window.prompt(this.t("prompt.new_directory", {
        path: location.pathname
      }), "");
      if (!name) {
        return;
      }
      if (!checkPathNameLegal(name)) {
        alert(this.t("alert.invalid_name"));
        return;
      }
      $.ajax({
        url: this.getEncodePath(name),
        method: "POST",
        success: function () {
          loadFileList();
        },
        error: function (jqXHR) {
          showErrorMessage(jqXHR);
        }
      });
    },
    deletePathConfirm: function (f, e) {
      e.preventDefault();
      if (!e.altKey) {
        if (!window.confirm(this.t("confirm.delete_path", {
          name: f.name
        }))) {
          return;
        }
      }
      $.ajax({
        url: this.getEncodePath(f.name),
        method: 'DELETE',
        success: function () {
          loadFileList();
        },
        error: function (jqXHR) {
          showErrorMessage(jqXHR);
        }
      });
    },
    updateBreadcrumb: function (pathname) {
      pathname = decodeURI(pathname || location.pathname || "/");
      pathname = pathname.split('?')[0];
      var parts = pathname.split('/');
      this.breadcrumb = [];
      if (pathname == "/") {
        return this.breadcrumb;
      }
      var i = 2;
      for (; i <= parts.length; i += 1) {
        var name = parts[i - 1];
        if (!name) {
          continue;
        }
        var path = parts.slice(0, i).join('/');
        this.breadcrumb.push({
          name: name + (i == parts.length ? ' /' : ''),
          path: path
        });
      }
      return this.breadcrumb;
    },
    loadPreviewFile: function (filepath, e) {
      if (e) {
        e.preventDefault();
      }
      var that = this;
      $.getJSON(pathJoin(['/-/info', location.pathname]))
        .then(function (res) {
          that.preview.filename = res.name;
          that.preview.filesize = res.size;
          return $.ajax({
            url: '/' + res.path,
            dataType: 'text',
          });
        })
        .then(function (res) {
          that.preview.contentHTML = '<pre>' + res + '</pre>';
        });
    },
    loadAll: function () {
    },
  }
});

window.onpopstate = function () {
  if (location.search.match(/\?search=/)) {
    location.reload();
    return;
  }
  loadFileList();
};

function loadFileOrDir(reqPath) {
  var requestUri = reqPath + location.search;
  var retObj = loadFileList(requestUri);
  if (retObj !== null) {
    retObj.done(function () {
      window.history.pushState({}, "", requestUri);
    });
  }
}

function loadFileList(pathname) {
  pathname = pathname || location.pathname + location.search;
  var retObj = null;
  if (getQueryString("raw") !== "false") { // not a file preview
    var sep = pathname.indexOf("?") === -1 ? "?" : "&";
    retObj = $.ajax({
      url: pathname + sep + "json=true",
      dataType: "json",
      cache: false,
      success: function (res) {
        res.files = _.sortBy(res.files, function (f) {
          var weight = f.type == 'dir' ? 1000 : 1;
          return -weight * f.mtime;
        });
        vm.files = res.files;
        vm.auth = res.auth;
        vm.updateBreadcrumb(pathname);
      },
      error: function (jqXHR) {
        showErrorMessage(jqXHR);
      },
    });
  }

  vm.previewMode = getQueryString("raw") == "false";
  if (vm.previewMode) {
    vm.loadPreviewFile();
  }
  return retObj;
}

Vue.filter('fromNow', function (value) {
  return moment(value).fromNow();
});

Vue.filter('formatBytes', function (value) {
  var bytes = parseFloat(value);
  if (bytes < 0) return "-";
  else if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(0) + " KB";
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
  else return (bytes / 1073741824).toFixed(1) + " GB";
});

$(function () {
  $.scrollUp({
    scrollText: '', // text are defined in css
    scrollTitle: tWithLang(vm.lang, "scroll.to_top"),
  });
  updateScrollUpTitle(vm.lang);

  // For page first loading
  loadFileList(location.pathname + location.search);

  // update version
  $.getJSON("/-/sysinfo", function (res) {
    vm.version = res.version;
  });

  var clipboard = new Clipboard('.btn');
  clipboard.on('success', function (e) {
    $(e.trigger)
      .tooltip('show')
      .mouseleave(function () {
        $(this).tooltip('hide');
      });

    e.clearSelection();
  });

  $(document)
    .on("mouseenter focusin", ".asset-name-link", function () {
      maybeShowAssetNameTooltip(this);
    })
    .on("mouseleave focusout click", ".asset-name-link", function () {
      destroyAssetNameTooltip(this);
    });
});
